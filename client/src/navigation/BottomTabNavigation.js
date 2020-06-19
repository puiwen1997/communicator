import React from 'react';
import { theme } from 'galio-framework';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  ChatRoomStack,
  EmergencyMessageStack,
  ScreenStack
} from './ScreenStackNavigator';

import { Images, materialTheme } from "../constants";

const Tab = createBottomTabNavigator();

const profile = {
  avatar: Images.Profile,
  name: "Rachel Brown",
  type: "Seller",
  plan: "Pro",
  rating: 4.8
};

export default function BottomTabNavigation(props) {
  return (
    <Tab.Navigator
      backBehavior='history'
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
          // backgroundColor: '#e6fff9',
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