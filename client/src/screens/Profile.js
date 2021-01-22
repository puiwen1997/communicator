//import React in our code
import React from 'react';
import { firebase } from '../config/FirebaseConfig';
import Separator from '../components/Separator';
import FirebaseAuthService from '../services/FirebaseAuthService'
import ConnectyCubeAuthService from '../services/ConnectyCubeAuthService'
import Avatar from '../components/ChatRoomComponents/avatar'
import { NavigationActions, StackActions } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { ERROR_MESSAGE } from '../constants/error';

//import all the components we are going to use
import { TextInput, ActivityIndicator, Dimensions, Modal, StyleSheet, View, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Input, theme, Block, Button } from 'galio-framework';
import { Alert } from 'react-native';

const { height, width } = Dimensions.get('window');

export default class Profile extends React.Component {
    state = {
        activIndicator: true,
        id: '',
        fullName: '',
        displayName: '',
        phoneNumber: '',
        email: '',
        emergencyContact: '',
        photoURL: '',
        userRecordFound: false,
        isVisible: false
    }

    handleChange = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
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

    renderModal = () => {
        return (
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.isVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text size={50}>Edit Here!</Text>
                            <Input
                                label="Phone Number"
                                type='phone-pad'
                                color={theme.COLORS.BLACK}
                                placeholderTextColor={theme.COLORS.BLACK}
                                rounded
                                placeholder="Phone Number"
                                style={{ width: width * 0.9 }}
                                value={this.state.phoneNumber}
                                onChangeText={(text) => this.handleChange(text, 'phoneNumber')}
                            />
                            <Input
                                label="Emergency Contact"
                                type='phone-pad'
                                color={theme.COLORS.BLACK}
                                placeholderTextColor={theme.COLORS.BLACK}
                                rounded
                                placeholder="Emergency Contact"
                                style={{ width: width * 0.9 }}
                                value={this.state.emergencyContact}
                                onChangeText={(text) => this.handleChange(text, 'emergencyContact')} />
                            <View style={styles.centeredView}>
                                <Button
                                    style={styles.saveButton}
                                    color="info"
                                    onPress={() => this.edit(this.state)}>
                                    Save
                                </Button>
                                <Button
                                    style={styles.closeButton}
                                    color="error"
                                    round
                                    onPress={() => this.setState({ isVisible: !this.state.isVisible })}
                                >
                                    Close
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View >
        )
    }

    edit = async (data) => {
        const errors = []
        const validatePhoneNumber = await this.validatePhoneNumber(data.phoneNumber, "phoneNumber")
        const validateEmergencyContact = await this.validatePhoneNumber(data.emergencyContact, "emergencyContact")

        if (validatePhoneNumber == false) {
            errors.push(ERROR_MESSAGE.phoneNumberFormat)
        }
        if (validateEmergencyContact == false) {
            errors.push(ERROR_MESSAGE.emergencyContactFormat)
        }
        console.log(errors)

        if (errors.length > 0) {
            const errorMessage = errors.join(`\n`)
            Alert.alert(errorMessage);
        } else {
            const updateData = {
                id: data.id,
                fullName: data.fullName,
                displayName: data.displayName,
                email: data.email,
                photoURL: data.photoURL,
                phoneNumber: data.phoneNumber,
                emergencyContact: data.emergencyContact
            }
            var updates = {};
            updates['/users/' + data.id] = updateData;

            await firebase.database().ref().update(updates, (error) => {
                if (error) {
                    Alert.alert("Failed to edit profile!")
                } else {
                    Alert.alert("Your profile updated successfully!")
                }
            });

            firebase.database().ref("users/" + data.id).once('value').then((snapshot) => {
                console.log("Snapshot: ", snapshot);
                var data = snapshot.val();
                console.log("Snapshot: ", snapshot.val().displayName);
                this.setState({
                    isVisible: !this.state.isVisible,
                    phoneNumber: data.phoneNumber,
                    emergencyContact: data.emergencyContact,
                });
            })

        }
    }

    componentDidMount = () => {
        const { navigation } = this.props

        this._unsubscribe = navigation.addListener('focus', () => {

            var user = firebase.auth().currentUser;

            if (user != null) {
                console.log("User uid: ", user.uid);
                firebase.database().ref("users/" + user.uid).once('value').then((snapshot) => {
                    console.log("Snapshot: ", snapshot);
                    var data = snapshot.val();
                    console.log("Snapshot: ", snapshot.val().displayName);
                    this.setState({
                        userRecordFound: true,
                        activIndicator: false,
                        id: data.id,
                        fullName: data.fullName,
                        displayName: data.displayName,
                        phoneNumber: data.phoneNumber,
                        email: data.email,
                        emergencyContact: data.emergencyContact,
                        photoURL: data.photoURL,
                    });
                    console.log("State: ", this.state)
                })
            }
        })
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    render() {
        const { navigation } = this.props;
        const { activIndicator } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <View>
                    {activIndicator &&
                        (
                            <View style={styles.indicator}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        )
                    }
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {
                        this.state.userRecordFound &&
                        (
                            <View style={styles.container}>
                                <View style={styles.editBlock}>
                                    <TouchableOpacity
                                        style={styles.editIcon}
                                        onPress={() => { this.setState({ isVisible: !this.state.isVisible }) }}>
                                        <MaterialCommunityIcons name="account-edit" size={40} />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    {this.renderModal()}
                                </View>

                                <View style={styles.imageContainer}>
                                    <Avatar
                                        name={this.state.fullName}
                                        iconSize="extra-large"
                                    />
                                </View>
                                <View style={styles.container}>
                                    <Block>
                                        <TouchableOpacity style={styles.borderLine}>
                                            <Text style={styles.textHeadingStyle}>Full Name: </Text>
                                            <Text style={styles.textStyle}>{this.state.fullName}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.borderLine}>
                                            <Text style={styles.textHeadingStyle}>Display Name: </Text>
                                            <Text style={styles.textStyle}>{this.state.displayName}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.borderLine}>
                                            <Text style={styles.textHeadingStyle}>Email: </Text>
                                            <Text style={styles.textStyle}>{this.state.email}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.borderLine}>
                                            <Text style={styles.textHeadingStyle}>Phone Number: </Text>
                                            <Text style={styles.textStyle}>{this.state.phoneNumber}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.borderLine}>
                                            <Text style={styles.textHeadingStyle}>Emergency Contact: </Text>
                                            <Text style={styles.textStyle}>{this.state.emergencyContact}</Text>
                                        </TouchableOpacity>

                                    </Block>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <Button color="error" onPress={() => FirebaseAuthService.logout(navigation)} style={styles.button}>Sign Out</Button>
                                </View>
                            </View >
                        )
                    }
                </ScrollView>

            </View >
        );
    }

};

const styles = StyleSheet.create({
    borderLine: {
        padding: 10,
        borderBottomWidth: 0.5,
        borderColor: 'black',
    },
    container: {
        backgroundColor: '#e0dcdc',
        margin: theme.SIZES.BASE,
        marginTop: theme.SIZES.BASE * 0.5,
        marginBottom: theme.SIZES.BASE * 0.5,
    },
    imageContainer: {
        alignItems: 'center',
        backgroundColor: '#e0dcdc',
        margin: 10
    },
    textContainer: {
        textAlign: 'left',
        backgroundColor: '#e0dcdc',
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#e0dcdc',
    },
    editBlock: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    editIcon: {
        alignSelf: 'flex-end',
        marginTop: 5,
        marginRight: 10
    },
    textHeadingStyle: {
        marginTop: 10,
        fontSize: theme.SIZES.BASE,
        color: '#0250a3',
        fontWeight: 'bold',
    },
    textStyle: {
        marginTop: 10,
        fontSize: theme.SIZES.BASE,
        color: '#000000',
        fontWeight: 'bold',
    },
    button: {
        width: (width / 16 * 14),
        marginTop: theme.SIZES.BASE * 1.5,
        marginBottom: theme.SIZES.BASE * 1.5
    },
    saveButton: {
        width: width * 0.8,
        margin: 20,
        marginTop: 15
    },
    closeButton: {
        margin: 20,
        padding: 5,
        width: width / 4
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
        marginTop: 22
    },
    textInput: {
        margin: 20,
        width: width * 0.8,
        height: height * 0.1,
    },
    modalView: {
        width: width,
        height: height * 0.6,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    indicator: {
        paddingTop: height * 0.3,
        paddingBottom: height * 0.3,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
});