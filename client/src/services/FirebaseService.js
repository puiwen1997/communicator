import { firebase } from '../config/FirebaseConfig';
import { Alert } from 'react-native';
import ConnectyCubeAuthService from '../services/ConnectyCubeAuthService';
import ConnectyCubeUser from '../models/ConnectyCubeUser';
import User from '../models/User';
import { ERROR_MESSAGE } from '../constants/error';

const DEFAULT_PROFILE_PIC = "https://firebasestorage.googleapis.com/v0/b/myreactnative-33c0a.appspot.com/o/profilePicture%2Fdefault.png?alt=media&token=0d991cf8-8268-4db0-9650-dfad8e712189";

class FirebaseService {

    getCurrentUser() {
        console.log("Getting current user...")
        const currentUser = firebase.auth().currentUser;
        console.log("Current user: ", currentUser);
        return currentUser;
    }

    validateInput(input, field) {
        var letterNumber = /^[0-9a-zA-Z]+$/;
        if (!input.match(letterNumber)) {
            console.log("Wrong format input for " + field)
            return false
        } else {
            console.log("Correct format input for " + field)
            return true
        }
    }

    checkDisplayName(displayName) {
        let existed = 0;
        firebase.database().ref("users").once('value').then((snapshot) => {
            console.log("Snapshot: ", snapshot);
            snapshot.forEach((childSnapshot) => {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                console.log("Child key: ", childKey + ", ChildData: ", childData)
                if (childData.displayName.toLowerCase() === displayName.toLowerCase()) {
                    existed += 1;
                }
            });
        })
        console.log("NumberExisted: ", existed)
        if (existed < 1) {
            console.log("Nice Display Name.")
            return false;
        } else {
            console.log("The display name has been taken!")
            return true;
        }
    }

    checkPassword(password) {
        if (password.length >= 8) {
            console.log("Nice Password!")
            return true;
        } else {
            console.log("Password should be at least 8 characters!")
            return false;
        }

    }

    getUserInfo(email) {
        let userData = null;
        firebase.database().ref("users").once('value').then((snapshot) => {
            console.log("Snapshot: ", snapshot);
            snapshot.forEach((childSnapshot) => {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                console.log("Child key: ", childKey + ", ChildData: ", childData)
                if (childData.email === email) {
                    userData = childData;
                }
            });
        })
        console.log("User Data: ", userData)
        return userData
    }

    registerValidation(user) {
        let errors = []
        let password = user.password
        let displayName = user.login

        let validateDisplayName = this.validateInput(displayName, "displayName")
        let validatePassword = this.validateInput(password, "password")

        let recordFound = this.checkDisplayName(displayName)
        let checkPasswordLength = this.checkPassword(password)

        if (validateDisplayName == true && validatePassword == true && recordFound == false && checkPasswordLength == true) {
            return true
        } else {
            if (validateDisplayName == false) {
                errors.push(ERROR_MESSAGE.displayNameError)
            }
            if (validatePassword == false) {
                errors.push(ERROR_MESSAGE.passwordError)
            }
            if (recordFound == true) {
                errors.push(ERROR_MESSAGE.recordFound)
            }
            if (checkPasswordLength == false) {
                errors.push(ERROR_MESSAGE.passwordLength)
            }
            const errorMessage = errors.join(`\n`)
            console.log("Error: ", errorMessage)
            return errorMessage;
        }
    }

    async register(state, navigation) {
        console.log("Register State: ", state)

        const newUser = new User(state);
        console.log("New User: ", newUser)

        const validationResult = this.registerValidation(newUser)
        console.log("Type", typeof JSON.stringify(validationResult))
        if (validationResult !== true) {
            console.log("Message", validationResult)
            Alert.alert(validationResult)
        } else {
            console.log("Registering....")
            firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
                .then(() => {
                    firebase.auth().onAuthStateChanged(function (user) {
                        if (user) {
                            console.log('User account created & signed in!');
                            console.log("User: ", user)

                            console.log("Updating profile......");
                            // Update User Profile in Firebase
                            user.updateProfile({
                                // Update the user attributes:
                                displayName: newUser.login,
                                photoURL: DEFAULT_PROFILE_PIC
                            }).then(function () {
                                // Profile updated successfully!
                                console.log("User info is updated:", user);

                                // Save User Data to Firebase Database
                                console.log("Saving to database......");
                                firebase.database().ref("users/" + user.uid).set({
                                    id: user.uid,
                                    fullName: newUser.full_name,
                                    displayName: newUser.login,
                                    email: newUser.email,
                                    phoneNumber: newUser.phone,
                                    emergencyContact: newUser.emergencyContact,
                                    photoURL: newUser.photoURL
                                })
                                console.log("User is created and saved into database!");
                                firebase.database().ref("users/" + user.uid).once('value').then((snapshot) => {
                                    console.log("Snapshot: ", snapshot);
                                })
                                console.log("Saved to database!")

                                // Register in the Connecty Cube
                                const newConnectyCubeUser = new ConnectyCubeUser(newUser);
                                console.log("New Connecty Cube User: ", newConnectyCubeUser)
                                ConnectyCubeAuthService.connectySignUp(newConnectyCubeUser, navigation);
                            }, function (error) {
                                // An error happened.
                            });



                        }
                    });
                })
                .then(() => {

                    navigation.navigate("Screen", { screen: 'Main' })
                })
                .catch(error => {
                    // console.error(error);
                    console.log("Error: ", error)
                    if (error.code === 'auth/email-already-in-use') {
                        console.log('That email address is already in use!');
                        Alert.alert("That email address is already in use!")
                    }

                    if (error.code === 'auth/invalid-email') {
                        console.log('That email address is invalid!');
                        Alert.alert("That email address is invalid!")
                    }

                });



        }
        //     console.log("Registering....")
        //     firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        //         .then(() => {
        //             firebase.auth().onAuthStateChanged(function (user) {
        //                 if (user) {
        //                     console.log('User account created & signed in!');
        //                     console.log("User: ", user)

        //                     console.log("Updating profile......");
        //                     // Update User Profile in Firebase
        //                     user.updateProfile({
        //                         // Update the user attributes:
        //                         displayName: newUser.login,
        //                         photoURL: DEFAULT_PROFILE_PIC
        //                     }).then(function () {
        //                         // Profile updated successfully!
        //                         console.log("User info is updated:", user);
        //                     }, function (error) {
        //                         // An error happened.
        //                     });

        //                     // Save User Data to Firebase Database
        //                     // console.log("Saving to database......")
        //                     // firebase.database().ref("users/" + user.uid).set({
        //                     //   fullName: fullName,
        //                     //   displayName: user.displayName,
        //                     //   email: user.email,
        //                     //   phoneNumber: phoneNumber,
        //                     //   emergencyContact: emergencyContact,
        //                     //   photoURL: user.photoURL
        //                     // })
        //                     // console.log("User is created and saved into database!");
        //                     // firebase.database().ref("users/" + user.uid).once('value').then((snapshot) => {
        //                     //   console.log("Snapshot: ", snapshot);
        //                     // })

        //                     // Register in the Connecty Cube
        //                     const newConnectyCubeUser = new ConnectyCubeUser(newUser);
        //                     console.log("New Connecty Cube User: ", newConnectyCubeUser)
        //                     ConnectyCubeAuthService.connectySignUp(newConnectyCubeUser, navigation);
        //                 }
        //             });
        //         })
        //         .then(
        //             () => navigation.navigate("Screen", { screen: 'Main' })
        //         )
        //         .catch(error => {
        //             if (error.code === 'auth/email-already-in-use') {
        //                 console.log('That email address is already in use!');
        //             }

        //             if (error.code === 'auth/invalid-email') {
        //                 console.log('That email address is invalid!');
        //             }

        //             console.error(error);
        //         });

        // }

    }

    login(state, navigation) {
        const email = state.email;
        const password = state.password;
        console.log("Login State - Email: ", email, " , Password: ", password)

        console.log("Login....")
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((users) => {
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        console.log('User account signed in!');
                        console.log("User: ", users)

                        // Login to the Connecty Cube
                        const loginUser = {
                            login: user.displayName,
                            full_name: user.fullName,
                            phone: user.phone,
                            email: email,
                            password: password
                        }
                        const loginConnectyCubeUser = new ConnectyCubeUser(loginUser);
                        ConnectyCubeAuthService.connectySignIn(loginConnectyCubeUser, navigation).then(() => {
                            // ConnectyCubeServices.setUpListeners();
                            ConnectyCubeAuthService.getConnectyCurrentUser();
                            // navigation.navigate("Screen", { screen: 'Main' });
                        }
                        )
                    }
                });
            })
            .catch(error => {
                console.log("Error: ", error)

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                    Alert.alert("That email address is invalid!")
                }
            });
    }

    logout(navigation) {
        ConnectyCubeAuthService.connectySignOut().then(() => {
            firebase.auth().signOut().then(function () {
                // Sign-out successful. 
                // ConnectyCubeAuthService.connectySignOut();
                console.log("Sign out successfully");
                navigation.navigate('Login');
            }).catch(function (error) {
                // An error happened.
                console.log("An error occured! Please try again.")
            });

        })
    }

    deleteCurrentUser() {
        console.log("Deleting current user...")
        const currentUser = firebase.auth().currentUser;
        console.log("Current user: ", currentUser);
        return firebase.auth().currentUser.delete();
    }

}

const firebaseService = new FirebaseService()

export default firebaseService;