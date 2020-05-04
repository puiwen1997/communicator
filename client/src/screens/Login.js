import React from 'react';
import {
  TouchableOpacity, Alert, Dimensions, KeyboardAvoidingView, StyleSheet, Platform,
} from 'react-native';
// import db from '../Firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';

// galio component
import {
  Block, Button, Input, NavBar, Text, Icon
} from 'galio-framework';
import theme from '../theme';

const { height, width } = Dimensions.get('window');

class Login extends React.Component {
  constructor() {
    super();
    // this.dbRef = firebase.firestore().collection('user');
    this.state = {
      email: '',
      password: '',
      isLoading: false,
    };
  }

  // state = {
  //   email: '-',
  //   password: '-',
  // }

  handleChange = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
    console.log(state);
  }

  // addItem = (email, password) => {
  //   db.ref('/user').push({
  //     email: this.state.email,
  //     password: this.state.password
  //   })
  // }

  // saveUser = () => {
  //   console.log('saving');
  //   this.addItem(this.state.email, this.state.password)
  //   alert("Success")
    // this.setState({
    //   isLoading: true,
    // });
    // this.dbRef.add({
    //   email: this.state.email,
    //   password: this.state.password
    // }).then((res) => {
    //   this.setState({
    //     email: '',
    //     password: '',
    //     isLoading: false,
    //   })
    //   this.props.navigation.navigate('Home')
    //   .catch((error) => {
    //     console.error("Error adding document: ", error);
    //     this.setState({
    //       isLoading: false,
    //     });
    //   });
    //   console.log("Save");
  // }

  render() {
    const { navigation } = this.props;
    // const { email, password } = this.state;

    return (
      <Block safe flex style={{ backgroundColor: theme.COLORS.WHITE }}>
        <Header title='Sign In'/>
        <KeyboardAvoidingView style={styles.container} behavior="height" enabled>
          <Block flex center style={{ marginTop: theme.SIZES.BASE * 1.875, marginBottom: height * 0.1 }}>
            <Text muted center size={theme.SIZES.FONT * 0.875} style={{ paddingHorizontal: theme.SIZES.BASE * 2.3 }}>
              This is the perfect place to write a short description
              of this step and even the next steps ahead
            </Text>
            <Block row center space="between" style={{ marginVertical: theme.SIZES.BASE * 1.875 }}>
              <Block flex middle right>
                <Button
                  round
                  onlyIcon
                  iconSize={theme.SIZES.BASE * 1.625}
                  icon="facebook"
                  iconFamily="FontAwesome"
                  color={theme.COLORS.FACEBOOK}
                  shadowColor={theme.COLORS.FACEBOOK}
                  iconColor={theme.COLORS.WHITE}
                  style={styles.social}
                  onPress={() => Alert.alert('Not implemented')}
                />
              </Block>
              <Block flex middle center>
                <Button
                  round
                  onlyIcon
                  iconSize={theme.SIZES.BASE * 1.625}
                  icon="twitter"
                  iconFamily="FontAwesome"
                  color={theme.COLORS.TWITTER}
                  shadowColor={theme.COLORS.TWITTER}
                  iconColor={theme.COLORS.WHITE}
                  style={styles.social}
                  onPress={() => Alert.alert('Not implemented')}
                />
              </Block>
              <Block flex middle left>
                <Button
                  round
                  onlyIcon
                  iconSize={theme.SIZES.BASE * 1.625}
                  icon="dribbble"
                  iconFamily="FontAwesome"
                  color={theme.COLORS.DRIBBBLE}
                  shadowColor={theme.COLORS.DRIBBBLE}
                  iconColor={theme.COLORS.WHITE}
                  style={styles.social}
                  onPress={() => Alert.alert('Not implemented')}
                />
              </Block>
            </Block>
            <Text muted center size={theme.SIZES.FONT * 0.875}>
              or be classical
            </Text>
          </Block>

          <Block flex={2} center space="evenly">
            <Block flex={2}>
              <Input
                rounded
                type="text"
                placeholder="Email"
                autoCapitalize="none"
                style={{ width: width * 0.9 }}
                value={this.state.email}
                onChangeText={(text) => this.handleChange(text, 'email')}
              />
              <Input
                rounded
                type="text"
                // viewPass
                placeholder="Password"
                style={{ width: width * 0.9 }}
                value={this.state.password}
                onChangeText={(text) => this.handleChange(text, 'password')}
              />
              <Text
                color={theme.COLORS.ERROR}
                size={theme.SIZES.FONT * 0.75}
                onPress={() => Alert.alert('Not implemented')}
                style={{ alignSelf: 'flex-end', lineHeight: theme.SIZES.FONT * 2 }}
              >
                Forgot your password?
              </Text>
            </Block>
            <Block flex middle>
              <Button
                round
                color="error"
//                 onPress={() => Alert.alert(
//                   'Sign in action',
//                   `Email: ${email}
// Password: ${password}`,
                // onPress = {() => this.saveUser()}
              >
                Sign in
              </Button>
              <Button color="transparent" shadowless onPress={() => navigation.navigate('Register')}>
                <Text center color={theme.COLORS.ERROR} size={theme.SIZES.FONT * 0.75}>
                  {"Don't have an account? Sign Up"}
                </Text>
              </Button>
            </Block>
          </Block>
        </KeyboardAvoidingView>
        <Footer/>
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
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center',
  },
});

export default Login;
