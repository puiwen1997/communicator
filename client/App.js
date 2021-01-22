import React from 'react';
import { View, Button, Text, Platform, StatusBar, Image, YellowBox, Dimensions } from 'react-native';
import { Asset } from 'expo-asset';
import { Block, GalioProvider } from 'galio-framework';

// import { Images, products, materialTheme } from '';
import { materialTheme } from './src/constants'

import { NavigationContainer } from '@react-navigation/native';
import AuthenticationStack from './src/navigation/navigation';
import MainStack from './src/navigation/navigation'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ConnectyCubeAuthService from './src/services/ConnectyCubeAuthService'

// Before rendering any navigation stack
import { enableScreens } from 'react-native-screens';

enableScreens();

const { height, width } = Dimensions.get('screen');
const CURRENT_USER_SESSION_KEY = 'CURRENT_USER_SESSION_KEY'
const ICON = "https://firebasestorage.googleapis.com/v0/b/myreactnative-33c0a.appspot.com/o/icon%2Ficon.jpg?alt=media&token=f95bd882-7d3d-4d41-8c94-d37d5a34dacc"

export default class App extends React.Component {

  state = {
    isLoadingComplete: false,
    isLoggedIn: false
  };

  onboarding = () => {
    return (
      <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <View style={{ marginTop: height * 0.3, alignSelf: 'center', alignItems: 'center', alignContent: 'center' }}>
          <Image
            source={{
              uri: ICON
            }}
            style={{ alignSelf: 'center', alignItems: 'center', alignContent: 'center', width: 100, height: 100, borderRadius: 100 / 2 }}
          />
          <Text style={{ fontSize: 20, margin: 10 }}>Welcome to Communicator!</Text>
          <Button title='Get Started' onPress={() => { this.setState({ isLoadingComplete: true }) }}></Button>
        </View>
      </View>
    )
  };

  // componentDidMount() {
  //   const signedIn = AsyncStorage.getItem(CURRENT_USER_SESSION_KEY);
  //   if (signedIn) {
  //     this.setState({
  //       isLoggedIn: true
  //     })
  //   } else {
  //     this.setState({
  //       isLoggedIn: false
  //     })
  //   }
  // }

  render() {
    YellowBox.ignoreWarnings([""]);
    return (
      <NavigationContainer>
        <GalioProvider theme={materialTheme}>
          <Block flex>
            {
              this.state.isLoggedIn ?
                (<AuthenticationStack />) 
                :
                (<MainStack />)
            }
          </Block>
        </GalioProvider>
      </NavigationContainer>
    );
    // }
  }
}