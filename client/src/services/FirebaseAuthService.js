import { firebase } from '../config/FirebaseConfig';
import { Alert } from 'react-native';
import ConnectyCubeAuthService from './ConnectyCubeAuthService';
import CustomConnectyCubeUser from '../models/CustomConnectyCubeUser';
import User from '../models/User';
import { ERROR_MESSAGE } from '../constants/error';
import RNRestart from 'react-native-restart';

const DEFAULT_PROFILE_PIC = "https://firebasestorage.googleapis.com/v0/b/myreactnative-33c0a.appspot.com/o/profilePicture%2Fdefault.png?alt=media&token=0d991cf8-8268-4db0-9650-dfad8e712189";


class FirebaseAuthService {

    getCurrentUser() {
        console.log("Getting current user...")
        const currentUser = firebase.auth().currentUser;
        console.log("Current user: ", currentUser);
        return currentUser;
    }

    validateInput = async (input, field) => {
        try {
            var letterNumber = /^[0-9a-zA-Z]+$/;
            if (!input.match(letterNumber)) {
                console.log("Wrong format input for " + field)
                return false
            } else {
                console.log("Correct format input for " + field)
                return true
            }
        } catch (error) {
            Alert.alert("Error: ", error)
        }

    }

    validatePhoneNumber = async (input, field) => {
        try {
            var number = /^[0-9]+$/;
            if (!input.match(number)) {
                console.log("Wrong format input for " + field)
                return false
            } else {
                console.log("Correct format input for " + field)
                return true
            }
        } catch (error) {
            Alert.alert("Error: ", error)
        }

    }

    checkDisplayName = async (displayName) => {
        try {
            var data = []
            firebase.database().ref("users").once('value').then((snapshot) => {
                console.log("Snapshot: ", snapshot);

                snapshot.forEach((childSnapshot) => {
                    var childKey = childSnapshot.key;
                    var childData = childSnapshot.val();
                    console.log("Child key: ", childKey + ", ChildData: ", childData)
                    console.log("ChildDataToLowerCase: ", childData.displayName.toLowerCase())
                    console.log("DisplayNameToLowerCase: ", displayName.toLowerCase())
                    if (childData.displayName.toLowerCase() === displayName.toLowerCase()) {
                        console.log("Entering here!!!")
                        data.push("Existed")
                    }
                });

            })
            console.log("Data", data)
            return data;
        } catch (error) {
            Alert.alert("Error: ", error)
        }

    }

    checkPassword = async (password) => {
        try {
            if (password.length >= 8) {
                console.log("Nice Password!")
                return true;
            } else {
                console.log("Password should be at least 8 characters!")
                return false;
            }
        } catch (error) {
            Alert.alert("Error: ", error)
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

    registerValidation = async (user) => {
        try {
            let errors = []
            let password = user.password
            let displayName = user.login
            let phoneNumber = user.phone
            let emergencyContact = user.emergencyContact

            let validateDisplayName = await this.validateInput(displayName, "displayName")
            let validatePassword = await this.validateInput(password, "password")
            let validatePhoneNumber = await this.validatePhoneNumber(phoneNumber, "phoneNumber")
            let validateEmergencyContact = await this.validatePhoneNumber(emergencyContact, "emergencyContact")


            // let recordFound = await this.checkDisplayName(displayName)
            let checkPasswordLength = await this.checkPassword(password)

            await firebase.database().ref("users").once('value').then((snapshot) => {
                console.log("Snapshot: ", snapshot);

                snapshot.forEach((childSnapshot) => {
                    var childKey = childSnapshot.key;
                    var childData = childSnapshot.val();
                    console.log("Child key: ", childKey + ", ChildData: ", childData)
                    console.log("ChildDataToLowerCase: ", childData.displayName.toLowerCase())
                    console.log("DisplayNameToLowerCase: ", displayName.toLowerCase())
                    if (childData.displayName.toLowerCase() === displayName.toLowerCase()) {
                        console.log("Entering here!!!")
                        errors.push(ERROR_MESSAGE.recordFound)
                    }
                });

            })

            if (validateDisplayName == false) {
                errors.push(ERROR_MESSAGE.displayNameError)
            }
            if (validatePassword == false) {
                errors.push(ERROR_MESSAGE.passwordError)
            }
            if (checkPasswordLength == false) {
                errors.push(ERROR_MESSAGE.passwordLength)
            }
            if (validatePhoneNumber == false) {
                errors.push(ERROR_MESSAGE.phoneNumberFormat)
            }
            if (validateEmergencyContact == false) {
                errors.push(ERROR_MESSAGE.emergencyContactFormat)
            }

            console.log(errors);
            return errors;

        } catch (error) {
            Alert.alert("Error: ", error)
        }
    }

    async register(state, navigation) {
        console.log("Register State: ", state)

        const newUser = new User(state);
        console.log("New User: ", newUser)

        const validationResult = await this.registerValidation(newUser)
        console.log("Type", validationResult)
        if (validationResult.length > 0) {
            console.log("Message", validationResult)
            const errorMessage = validationResult.join(`\n`)
            console.log("Error: ", errorMessage)
            // return errorMessage;
            Alert.alert(errorMessage)
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
                                const newConnectyCubeUser = new CustomConnectyCubeUser(newUser);
                                console.log("New Connecty Cube User: ", newConnectyCubeUser)
                                ConnectyCubeAuthService.connectySignUp(newConnectyCubeUser, navigation);

                            }, function (error) {
                                // An error happened.
                                Alert.alert("Error", error)
                            });



                        }
                    });
                })
                // .then(() => {

                //     navigation.navigate("Screen", { screen: 'Main' })
                // })
                .catch(error => {

                    if (error.code === 'auth/email-already-in-use') {
                        console.log('That email address is already in use!');
                        Alert.alert("That email address is already in use!")
                    }

                    if (error.code === 'auth/invalid-email') {
                        console.log('That email address is invalid!');
                        Alert.alert("That email address is invalid!")
                    }

                    if (error.code == 'auth/network-request-failed') {
                        console.log('Network error (such as timeout, interrupted connection or unreachable host) has occurred.');
                        Alert.alert("Network error (such as timeout, interrupted connection or unreachable host) has occurred.")
                    }

                });
        }

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
                            email: email,
                            password: password
                        }

                        const loginConnectyCubeUser = new CustomConnectyCubeUser(loginUser);
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
                console.log("Error: ", error.code, ": ", error)

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid.');
                    Alert.alert("That email address is invalid.")
                }
                if (error.code == 'auth/wrong-password') {
                    console.log('The password is invalid.');
                    Alert.alert("The password is invalid.")
                }

                if (error.code == 'auth/user-not-found') {
                    console.log('There is no user record corresponding to this email.');
                    Alert.alert("There is no user record corresponding to this email.")
                }

                if (error.code == 'auth/network-request-failed') {
                    console.log('Network error (such as timeout, interrupted connection or unreachable host) has occurred.');
                    Alert.alert("Network error (such as timeout, interrupted connection or unreachable host) has occurred.")
                }
            });
    }



    logout = async (navigation) => {
        await ConnectyCubeAuthService.connectySignOut().then(() => {
            firebase.auth().signOut().then(function () {
                // Sign-out successful. 
                console.log("Sign out successfully");
                RNRestart.Restart();

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

const firebaseAuthService = new FirebaseAuthService()

export default firebaseAuthService;