import React from 'react';
import { Modal, View, ActivityIndicator, Dimensions, StyleSheet, Image } from 'react-native';

import { theme, Block, Button, Input, Text } from 'galio-framework';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { firebase } from '../config/FirebaseConfig';
import ConnectyCubeAuthService from '../services/ConnectyCubeAuthService';
import FirebaseAuthService from '../services/FirebaseAuthService';
import ConnectyCubeUser from '../models/ConnectyCubeUser';

const { height, width } = Dimensions.get('window');
const ICON = "https://firebasestorage.googleapis.com/v0/b/myreactnative-33c0a.appspot.com/o/icon%2Ficon.jpg?alt=media&token=f95bd882-7d3d-4d41-8c94-d37d5a34dacc"

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activIndicator: false,
      email: '',
      password: '',
      isLoading: false,
      isVisible: false,
    }
  };

  handleChange = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
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
              <Text style={styles.modalText}>Loading...</Text>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          </View>
        </Modal>
      </View>
    )
  }

  onLogin = async (navigation) => {
    this.setState({ activIndicator: true })
    FirebaseAuthService.login(this.state, navigation)
  }

  componentDidMount() {
    const { navigation } = this.props;
    ConnectyCubeAuthService.connectyInit(navigation)
  }

  render() {
    const { navigation } = this.props;
    const { activIndicator } = this.state;

    return (
      <View style={{ flex: 1 }}>
        { activIndicator &&
          (
            <View style={styles.indicator}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )
        }
        <Block safe flex style={{ backgroundColor: theme.COLORS.WHITE }}>
          <View>
            <KeyboardAwareScrollView>
              <Block style={styles.container}>
                <Block center space="evenly">
                  <Block style={styles.iconContainer}>
                    <Image
                      source={{
                        uri: ICON
                      }}
                      //borderRadius style will help us make the Round Shape Image
                      style={{ width: 100, height: 100, borderRadius: 100 / 2 }}
                    />
                  </Block>
                  <Block>
                    <Input
                      color={theme.COLORS.BLACK}
                      type="email-address"
                      rounded
                      placeholderTextColor={theme.COLORS.BLACK}
                      placeholder="Email"
                      autoCapitalize="none"
                      style={{ width: width * 0.9 }}
                      value={this.state.email}
                      onChangeText={(text) => this.handleChange(text, 'email')}
                    />
                    <Input
                      color={theme.COLORS.BLACK}
                      rounded
                      password
                      viewPass
                      placeholderTextColor={theme.COLORS.BLACK}
                      placeholder="Password"
                      style={{ width: width * 0.9 }}
                      value={this.state.password}
                      onChangeText={(text) => this.handleChange(text, 'password')}
                    />
                  </Block>
                  <Block style={{ padding: theme.SIZES.BASE }} flex middle>
                    <Button
                      round
                      color="info"
                      onPress={() => {
                        FirebaseAuthService.login(this.state, navigation)
                      }}
                    >
                      Login
              </Button>
                    <Button color="transparent" shadowless onPress={() => navigation.navigate('Register')}>
                      <Text center color={theme.COLORS.ERROR} size={theme.SIZES.FONT * 0.9}>
                        {"Don't have an account? Click here to register"}
                      </Text>
                    </Button>
                  </Block>
                </Block>
              </Block>
            </KeyboardAwareScrollView>
          </View>
        </Block>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: theme.SIZES.BASE * 0.3,
    backgroundColor: theme.COLORS.WHITE,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: theme.SIZES.BASE * 2.5,
    paddingBottom: theme.SIZES.BASE,
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
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
    width: width * 0.9,
    height: height * 0.5,
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
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
});