import React from 'react';
import { ActivityIndicator, Alert, Dimensions, View, StyleSheet, PermissionsAndroid } from 'react-native';
import { theme, Text, Button } from 'galio-framework';
import geolocation from '@react-native-community/geolocation';
import geocoder from 'react-native-geocoder';
import Communications from 'react-native-communications';
import { firebase } from '../config/FirebaseConfig';

const { height, width } = Dimensions.get('screen');

export default class EmergencyMessage extends React.Component {

    state = {
        currentLongitude: 'unknown',//Initial Longitude
        currentLatitude: 'unknown',//Initial Latitude
        address: '',
        isChange: false,
        emergencyContact: '',
        activIndicator: true
    }

    getEmergencyContact = async () => {
        try {
            var user = firebase.auth().currentUser;

            if (user != null) {
                firebase.database().ref("users/" + user.uid).once('value').then((snapshot) => {
                    var data = snapshot.val();
                    this.setState({
                        emergencyContact: data.emergencyContact,
                    });
                })
            }

        } catch (error) {
            console.log("Error: ", error);
            Alert.alert("Error: ", error)
        }
    }

    getPermissionBeforeAccessLocation = async () => {
        try {

            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                {
                    title: 'Permissions for access coarse location',
                    message: 'Give permission to access your coarse location',
                    buttonPositive: 'Ok',
                },

            );
            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Permissions for access fine location',
                    message: 'Give permission to access your fine location',
                    buttonPositive: 'Ok',
                },
            )

        } catch (error) {
            Alert.alert(error)
        }
    }

    getCurrentLocation = async () => {
        try {
            this.setState({ address: '', activIndicator: true })

            //get current location latitude and longitude
            geolocation.getCurrentPosition(
                position => {
                    this.setState({ currentLongitude: position.coords.longitude });
                    this.setState({ currentLatitude: position.coords.latitude });
                    var coord = {
                        lat: this.state.currentLatitude,
                        lng: this.state.currentLongitude
                    }
                    //get full address of the location
                    geocoder.geocodePosition(coord)
                        .then(json => {
                            var addressComponent = json[0].formattedAddress;
                            this.setState({
                                activIndicator: false,
                                address: addressComponent,
                                isChange: !this.state.isChange
                            })
                            console.log(addressComponent);
                            console.log(this.state)
                        })
                        .catch(error => console.warn(error));
                },
                error => alert(error.message),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 },
            );

            this.watchID = geolocation.watchPosition(position => {
                //Will give you the location on location change
                console.log(position);
                const currentLongitude = JSON.stringify(position.coords.longitude);
                //getting the Longitude from the location json
                const currentLatitude = JSON.stringify(position.coords.latitude);
                //getting the Latitude from the location json
                this.setState({ currentLongitude: position.coords.longitude });
                //Setting state Longitude to re re-render the Longitude Text
                this.setState({ currentLatitude: position.coords.latitude });
                //Setting state Latitude to re re-render the Longitude Text
            });

        } catch (error) {
            console.log("Error:", error);
            Alert.alert("Error:", error);
        }
    }

    sendSMSFunction() {
        try {
            var address = this.state.address;
            var emergencyContact = this.state.emergencyContact
            if (address != '' && emergencyContact != '') {
                var body = 'Help me!\nI am at location: ' + address
                Communications.textWithoutEncoding(emergencyContact, body);
                this.setState({ isChange: !this.state.isChange })
            } else {
                Alert.alert("No emergency contact! / Cannot locate your current position!")
            }
        } catch (error) {
            console.log("Error:", error);
            Alert.alert("Error:", error);
        }
    }

    getCurrentLocationAgain = async () => {
        await this.getCurrentLocation();
        this.sendSMSFunction();
    }

    componentDidMount = async () => {
        const { navigation } = this.props;
        await this.getPermissionBeforeAccessLocation();
        await this.getEmergencyContact();
        this._unsubscribe = navigation.addListener('focus', () => {
            this.getCurrentLocation();
        })
    };

    componentWillUnmount = () => {
        console.log("Component Will Unmount")
        geolocation.clearWatch(this.watchID);
        this._unsubscribe();
    };

    render() {
        const { activIndicator } = this.state;
        return (
            <View>

                <View>
                    {activIndicator &&
                        (
                            <View style={styles.indicator}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        )
                    }
                </View>
                <View style={styles.container}>
                    <View>
                        {this.state.isChange && this.sendSMSFunction()}
                    </View>

                    <Text style={styles.boldText}>You are Here</Text>
                    <Text style={styles.text, { paddingTop: theme.SIZES.BASE }}> Address: </Text>
                    <Text style={styles.text, { padding: theme.SIZES.BASE }}>{this.state.address}</Text>

                    <Button style={styles.button} color='info' onPress={() => this.getCurrentLocation()}>
                        Try to get current position again?
                </Button>

                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.SIZES.BASE * 8,
        margin: theme.SIZES.BASE
    },
    boldText: {
        fontSize: 30,
        color: 'red',
    },
    text: {
        fontSize: 18,
        paddingLeft: theme.SIZES.BASE,
        paddingRight: theme.SIZES.BASE,
        margin: theme.SIZES.BASE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addressText: {
        fontSize: 18,
        padding: theme.SIZES.BASE,
        margin: theme.SIZES.BASE * 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        margin: theme.SIZES.BASE * 2
    },
    indicator: {
        margin: 0,
        paddingTop: height * 0.3,
        paddingBottom: height * 0.3,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    }

});


