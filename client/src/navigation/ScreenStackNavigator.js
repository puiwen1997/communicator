import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import MainScreen from '../screens/Main';
import TTSScreen from '../screens/TextToSpeech';
import STTScreen from '../screens/SpeechToText';
import SignLanguageScreen from '../screens/SignLanguage';
import EmergencyMessageScreen from '../screens/EmergencyMessage';
import ChatRoomScreen from '../screens/ChatRoom';
import ChatRoomHomeScreen from '../screens/ChatRoomHome';
import FavouriteTextScreen from '../screens/FavouriteText';
import SettingsScreen from '../screens/Settings';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import AddSignLanguageScreen from '../screens/AddSignLanguage';

import { Header } from '../components';

const Stack = createStackNavigator();

// const profile = {
//   avatar: Images.Profile,
//   name: "Rachel Brown",
//   type: "Seller",
//   plan: "Pro",
//   rating: 4.8
// };

export const ProfileStack = (props) => {
  return (
    <Stack.Navigator initialRouteName="Profile" mode="card" headerMode="screen">
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              white
              transparent
              title="Profile"
              scene={scene}
              navigation={navigation}
            />
          ),
          headerTransparent: true
        }}
      />
    </Stack.Navigator>
  );
}

export const EmergencyMessageStack = (props) => {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="EmergencyMessage"
        component={EmergencyMessageScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Emergency Message"
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
    </Stack.Navigator>
  );
}

const ChatAppStack = createStackNavigator();
export const ChatRoomStack = (props) => {
  return (
    <ChatAppStack.Navigator mode="card" headerMode="screen">
      <ChatAppStack.Screen
        name="ChatRoomHome"
        component={ChatRoomHomeScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Chat Room Home"
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <ChatAppStack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Chat Room"
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
    </ChatAppStack.Navigator>
  );
}

export const ScreenStack = (props) => {
  return (
    <Stack.Navigator mode="card" headerMode="screen" initialRouteName = 'Main'>
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Main"
              scene={scene}
              navigation={navigation}
            />
          )
        }}
      />
      <Stack.Screen
        name="TTS"
        component={TTSScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Text to Speech"
              scene={scene}
              navigation={navigation}
            />
          )
        }}
      />
      <Stack.Screen
        name="STT"
        component={STTScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Speech To Text"
              scene={scene}
              navigation={navigation}
            />
          )
        }}
      />
      <Stack.Screen
        name="SignLanguage"
        component={SignLanguageScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Sign Language"
              scene={scene}
              navigation={navigation}
            />
          )
        }}
      />
      <Stack.Screen
        name="FavouriteText"
        component={FavouriteTextScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Favourite Text"
              scene={scene}
              navigation={navigation}
            />
          )
        }}
      />
       <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Settings" scene={scene} navigation={navigation} />
          )
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Login" scene={scene} navigation={navigation} />
          )
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Register" scene={scene} navigation={navigation} />
          )
        }}
      />
      <Stack.Screen
        name="AddSignLanguage"
        component={AddSignLanguageScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Add Sign Language" scene={scene} navigation={navigation} />
          )
        }}
      />
    </Stack.Navigator>
  );
}