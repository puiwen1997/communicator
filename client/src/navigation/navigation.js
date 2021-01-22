import React from 'react';
import { theme } from 'galio-framework';

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';

import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import MainScreen from '../screens/Main';
import TTSScreen from '../screens/TextToSpeech';
import STTScreen from '../screens/SpeechToText';
import SignLanguageScreen from '../screens/SignLanguage';
import EmergencyMessageScreen from '../screens/EmergencyMessage';
import ChatRoomScreen from '../screens/ChatRoom';
import ChatRoomHomeScreen from '../screens/ChatRoomHome';
import ChatRoomContactScreen from '../screens/ChatRoomContacts';
import FavouriteTextScreen from '../screens/FavouriteText';
import ProfileScreen from '../screens/Profile';

import { Header } from '../components';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function AuthenticationStack(props) {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          header: ({ navigation, scene }) =>  (
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
        name="Screen"
        component={MainStack}
        options={{
          headerLeft:null,
          headerTransparent: true,
          title: ""
        }}
      />
    </Stack.Navigator>
  );
}

const EmergencyMessageAppStack = createStackNavigator();
export const EmergencyMessageStack = (props) => {
  return (
    <EmergencyMessageAppStack.Navigator mode="card" headerMode="screen">
      <EmergencyMessageAppStack.Screen
        name="EmergencyMessage"
        component={EmergencyMessageScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Emergency Message" navigation={navigation} scene={scene}
            />
          )
        }}
      />
    </EmergencyMessageAppStack.Navigator>
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
              title="Chat Room Home" navigation={navigation} scene={scene}
            />
          )
        }}
      />
      <ChatAppStack.Screen
        name="ChatRoomContact"
        component={ChatRoomContactScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Contact" navigation={navigation} scene={scene}
            />
          )
        }}
      />
      <ChatAppStack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={{
          header: ({ navigation, scene }) => {
            const { options } = scene.descriptor;
            const title = options.title !== undefined ? options.title : "Chat Room"
            return(
              <Header
              title={title} navigation={navigation} scene={scene}
            />
            )
          }
        }}
      />
    </ChatAppStack.Navigator>
  );
}

export const ScreenStack = (props) => {
  return (
    <Stack.Navigator mode="card" headerMode="screen" initialRouteName='Main'>
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Main" scene={scene} navigation={navigation}
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
              title="Text to Speech" scene={scene} navigation={navigation}
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
              title="Speech To Text" scene={scene} navigation={navigation}
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
              title="Sign Language" scene={scene} navigation={navigation}
            />
          )
        }}
      />
      <Stack.Screen
        name="FavouriteText"
        component={FavouriteTextScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Favourite Text" scene={scene} navigation={navigation}
            />
          )
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Profile" scene={scene} navigation={navigation} />
          )
        }}
      />
    </Stack.Navigator>
  );
}

export const MainStack = (props) => {
  return (
    <Tab.Navigator
      backBehavior='initialRoute'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Main') {
            iconName = focused
              ? 'ios-menu'
              : 'md-menu';
          }
          else if (route.name === 'Chat Room') {
            iconName = focused ? 'ios-chatbubbles' : 'ios-chatboxes';
          }
          else if (route.name === 'SOS') {
            iconName = focused ? 'ios-alert' : 'md-alert';
            color = "#FF0000";
          }
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        style: {
          height: theme.SIZES.BASE * 3.5
        },
        tabStyle: {
          color: "#000000",

        },
        labelStyle: {
          color: "#000000",
          fontSize: 12
        },
        keyboardHidesTabBar: true,
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
      }}
      initialRouteName='Main'
    >
      <Tab.Screen name="Chat Room" component={ChatRoomStack} />
      <Tab.Screen name="Main" component={ScreenStack} />
      <Tab.Screen name="SOS" component={EmergencyMessageStack} />
    </Tab.Navigator>
  );
}