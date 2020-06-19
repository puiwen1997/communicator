// import React from 'react';
// import { Text, View, StatusBar, StyleSheet } from 'react-native';
// // import Container from './src/routes';
// import theme from './src/theme';
// import Drawer from './src/navigators/drawerNavigator'

// export default class App extends React.Component {
//   render() {
//     return (
//       <View style={{ flex : 1 }}>
//         <StatusBar hidden={false} />
//         {/* <Container style={styles.container}/> */}
//         <Drawer/>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // alignItems: 'center',
//     // justifyContent: 'space-around',
//     // paddingTop: theme.SIZES.BASE * 0.3,
//     // paddingHorizontal: theme.SIZES.BASE,
//     backgroundColor: '#000000'
//   }
// });

import React from 'react';
import { Platform, StatusBar, Image } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import { Block, GalioProvider } from 'galio-framework';

// import { Images, products, materialTheme } from '';
import { Images, products, materialTheme } from './src/constants'

import { NavigationContainer } from '@react-navigation/native';
import Screens from './src/navigation/BottomTabNavigation';

// Before rendering any navigation stack
import { enableScreens } from 'react-native-screens';
enableScreens();

// cache app images
const assetImages = [
  Images.Pro,
  Images.Profile,
  Images.Avatar,
  Images.Onboarding,
];

// cache product images
products.map(product => assetImages.push(product.image));

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    // if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
    //   return (
    //     <AppLoading
    //       startAsync={this._loadResourcesAsync}
    //       onError={this._handleLoadingError}
    //       onFinish={this._handleFinishLoading}
    //     />
    //   );
    // } else {
      return (
        <NavigationContainer>
          <GalioProvider theme={materialTheme}>
            <Block flex>
              {/* {Platform.OS === 'ios' && <StatusBar barStyle="default" />} */}
              {Platform.OS === 'android' && <StatusBar barStyle="default" />}
              <Screens />
            </Block>
          </GalioProvider>
        </NavigationContainer>
      );
    // }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      ...cacheImages(assetImages),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}
