import React from 'react';
import { View, ActivityIndicator, TouchableOpacity, Alert, Dimensions, ScrollView, KeyboardAvoidingView, StyleSheet, Platform, Image } from 'react-native';

// Galio component
import {
  theme, Block, Button, Input, NavBar, Text, Icon
} from 'galio-framework';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { firebase } from '../config/FirebaseConfig';
import FirebaseAuthService from '../services/FirebaseAuthService'
// import ConnectyCubeAuthService from '../services/ConnectyCubeAuthService';
import ConnectyCubeUser from '../models/ConnectyCubeUser';
import User from '../models/User';
// import theme from '../theme';

const { height, width } = Dimensions.get('window');
const DEFAULT_PROFILE_PIC = "https://firebasestorage.googleapis.com/v0/b/myreactnative-33c0a.appspot.com/o/profilePicture%2Fdefault.png?alt=media&token=0d991cf8-8268-4db0-9650-dfad8e712189";
const ICON = "https://firebasestorage.googleapis.com/v0/b/myreactnative-33c0a.appspot.com/o/icon%2Ficon.jpg?alt=media&token=f95bd882-7d3d-4d41-8c94-d37d5a34dacc"

export default class Register extends React.Component {
  state = {
    id: '',
    full_name: '',
    login: '',
    phone: '',
    email: '',
    password: '',
    emergencyContact: '',
    photoURL: DEFAULT_PROFILE_PIC,
    isLoading: false,
    activIndicator: false,
  };

  handleChange = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
    // console.log("State: ", state);
  }

  render() {
    const { navigation } = this.props;
    const { activIndicator } = this.state;
    return (
      <Block safe flex style={styles.container, { backgroundColor: theme.COLORS.WHITE }}>
        <View>
          {activIndicator &&
            (
              <View style={styles.indicator}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )
          }

          <KeyboardAwareScrollView >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Block style={styles.container}>
                <Block flex={2} center space="evenly">
                  <Block style={styles.iconContainer}>
                    <Image
                      source={{
                        uri: ICON
                      }}
                      //borderRadius style will help us make the Round Shape Image
                      style={{ width: 100, height: 100, borderRadius: 100 / 2 }}
                    />
                  </Block>
                  <Block style={styles.guidelineContainer}>
                    <Text style={styles.text}>Guideline:</Text>
                    <Text style={styles.text}>1. Display name: Alphanumeric & punctuation characters only! </Text>
                    <Text style={styles.text}>2. Password: Minimum 8 characters, alphanumeric & punctuation characters only!</Text>
                    <Text style={styles.text}>3. Phone Number / Emergency Contact: No need insert the '-'</Text>

                  </Block>
                  <Block flex={2}>
                    <Input
                      color={theme.COLORS.BLACK}
                      placeholderTextColor={theme.COLORS.BLACK}
                      rounded
                      placeholder="Full Name"
                      autoCapitalize="none"
                      style={{ width: width * 0.9 }}
                      value={this.state.full_name}
                      onChangeText={(text) => this.handleChange(text, 'full_name')}
                    />
                    <Input
                      color={theme.COLORS.BLACK}
                      placeholderTextColor={theme.COLORS.BLACK}
                      rounded
                      placeholder="Display Name"
                      autoCapitalize="none"
                      style={{ width: width * 0.9 }}
                      value={this.state.login}
                      onChangeText={(text) => this.handleChange(text, 'login')}
                    />
                    <Input
                      color={theme.COLORS.BLACK}
                      placeholderTextColor={theme.COLORS.BLACK}
                      rounded
                      type="email-address"
                      placeholder="Email"
                      autoCapitalize="none"
                      style={{ width: width * 0.9 }}
                      value={this.state.email}
                      onChangeText={(text) => this.handleChange(text, 'email')}
                    />
                    <Input
                      type='phone-pad'
                      color={theme.COLORS.BLACK}
                      placeholderTextColor={theme.COLORS.BLACK}
                      rounded
                      placeholder="Phone Number"
                      style={{ width: width * 0.9 }}
                      value={this.state.phone}
                      onChangeText={(text) => this.handleChange(text, 'phone')}
                    />
                    <Input
                      color={theme.COLORS.BLACK}
                      placeholderTextColor={theme.COLORS.BLACK}
                      rounded
                      password
                      viewPass
                      placeholder="Password"
                      style={{ width: width * 0.9 }}
                      value={this.state.password}
                      onChangeText={(text) => this.handleChange(text, 'password')}
                    />
                    <Input
                      type='phone-pad'
                      color={theme.COLORS.BLACK}
                      placeholderTextColor={theme.COLORS.BLACK}
                      rounded
                      placeholder="Emergency Contact"
                      style={{ width: width * 0.9 }}
                      value={this.state.emergencyContact}
                      onChangeText={(text) => this.handleChange(text, 'emergencyContact')}
                    />
                  </Block>
                  <Block style={{ padding: theme.SIZES.BASE }} flex middle>
                    <Button
                      color="info"
                      round
                      onPress={() => {
                        this.setState({ activIndicator: true })
                        FirebaseAuthService.register(this.state, navigation)
                      }}
                    >
                      Register
              </Button>
                  </Block>
                </Block>
              </Block>
            </ScrollView>
          </KeyboardAwareScrollView>
        </View>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: theme.SIZES.BASE * 0.3,
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: theme.COLORS.WHITE,
  },
  guidelineContainer: {
    flex: 1,
    paddingTop: theme.SIZES.BASE * 0.3,
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: theme.COLORS.WHITE,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: theme.SIZES.BASE * 0.5,
    paddingBottom: theme.SIZES.BASE * 0.2,
  },
  text: {
    marginTop: 2,
    marginBottom: 2,
    color: "#FF0000",
    fontSize: 12
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center',
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