import React from 'react';
import { Alert, Image, Dimensions, KeyboardAvoidingView, View, ScrollView, StyleSheet, PermissionsAndroid } from 'react-native';
import { theme, Text, Block, Button, Input } from 'galio-framework';
import geolocation from '@react-native-community/geolocation';
import geocoder from 'react-native-geocoder';
import Communications from 'react-native-communications';
// import SendSMS from 'react-native-sms-z';

const { height, width } = Dimensions.get('window');

const api_key = "AIzaSyB6GExprqyylFpaqNIHrLlilkyWGpVkD9U";

export default class EmergencyMessage extends React.Component {

    state = {
        currentLongitude: 'unknown',//Initial Longitude
        currentLatitude: 'unknown',//Initial Latitude
        address: '',
        isChange: false
    }

    componentDidMount = () => {
        console.log("Component Did Mount")
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
                            isChange: !this.state.isChange,
                            address: addressComponent
                        })
                        console.log(addressComponent);
                        console.log(this.state)
                    })
                    .catch(error => console.warn(error));
            },
            error => alert(error.message),
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
    };

    componentWillUnmount = () => {
        console.log("Component Will Unmount")
        geolocation.clearWatch(this.watchID);
    };

    sendSMSFunction() {
        if (this.state.isChange == true) {
            var phoneNumber = '0125541719'
            var body = 'Help me!\n I am at location: ' + this.state.address
            Communications.text(phoneNumber, body);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.boldText}>You are Here</Text>
                <Text
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 16,
                    }}>
                    Address:
                </Text>
                <Text style={styles.text}>{this.state.address}</Text>
                <Text margin={theme.SIZES.BASE}>{this.sendSMSFunction()}</Text>

                <Button color='info' onPress={() => this.sendSMSFunction()}>
                    Resend message
                </Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    boldText: {
        fontSize: 30,
        color: 'red',
    },
    text: {
        padding: theme.SIZES.BASE,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
