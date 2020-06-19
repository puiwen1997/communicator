import React from 'react';
import { StyleSheet, Switch, FlatList, Platform, TouchableOpacity, ScrollView } from "react-native";
import { Block, Text, theme, Icon } from "galio-framework";

// import materialTheme from '../constants/Theme';

export default class Settings extends React.Component {
  state = {};

  toggleSwitch = switchNumber => this.setState({ [switchNumber]: !this.state[switchNumber] });

  renderItem = ({ item }) => {
    const {navigate} = this.props.navigation;

    switch(item.type) {
      case 'switch': 
        return (
          <Block row middle space="between" style={styles.rows}>
            <Text size={14}>{item.title}</Text>
            <Switch
              onValueChange={() => this.toggleSwitch(item.id)}
              ios_backgroundColor={theme.COLORS.SWITCH_OFF}
              thumbColor={Platform.OS === 'android' ? theme.COLORS.SWITCH_OFF : null}
              trackColor={{ false: theme.COLORS.SWITCH_OFF, true: theme.COLORS.SWITCH_ON }}
              value={this.state[item.id]}
            />
          </Block>
        );
      case 'button': 
        return (
          <Block style={styles.rows}>
            <TouchableOpacity onPress={() => navigate('Login')}>
              <Block row middle space="between" style={{paddingTop:7}}>
                <Text size={14}>{item.title}</Text>
                <Icon name="angle-right" family="font-awesome" style={{ paddingRight: 5 }} />
              </Block>
            </TouchableOpacity>
          </Block>);
      default:
        break;
    }
  }

  render() {
    const recommended = [
      { title: "Use FaceID to sign in", id: "face", type: "switch" },
      { title: "Auto-Lock security", id: "autolock", type: "switch" },
      { title: "Notifications", id: "Notifications", type: "button" },
    ];

    const payment = [
      { title: "Manage Payment Options", id: "Payment", type: "button" },
      { title: "Manage Gift Cards", id: "gift", type: "button" },
    ];
    
    const privacy = [
      { title: "User Agreement", id: "Agreement", type: "button" },
      { title: "Privacy", id: "Privacy", type: "button" },
      { title: "About", id: "About", type: "button" },
    ];

    const emergencyContact = [
      { title: "Emergency Contact", id: "Emergency Contact", type: "button" },
      // { title: "Signup", id: "Signup", type: "button" },
    ];

    const authentication = [
      { title: "Login", id: "Login", type: "button" },
      // { title: "Signup", id: "Signup", type: "button" },
    ];

    return (
      
      // <ScrollView
      //   showsVerticalScrollIndicator={false}
      //   contentContainerStyle={styles.settings}>
        <Block>
          <FlatList
          data={recommended}
          keyExtractor={(item, index) => item.id}
          renderItem={this.renderItem}
          ListHeaderComponent={
            <Block style={styles.title}>
              <Text bold center size={theme.SIZES.BASE} style={{ paddingBottom: 5 }}>
                Recommended Settings
              </Text>
              <Text center muted size={12}>
                These are the most important settings
              </Text>
            </Block>
          }
        />

         <FlatList
          style={styles.title}
          data={emergencyContact}
          keyExtractor={(item, index) => item.id}
          renderItem={this.renderItem}
        />
         <FlatList
          style={styles.title}
          data={authentication}
          keyExtractor={(item, index) => item.id}
          renderItem={this.renderItem}
        />
        </Block>
    );
  }
}

const styles = StyleSheet.create({
  settings: {
    paddingVertical: theme.SIZES.BASE / 3,
  },
  title: {
    paddingTop: theme.SIZES.BASE,
    paddingBottom: theme.SIZES.BASE / 2,
  },
  rows: {
    height: theme.SIZES.BASE * 2,
    paddingHorizontal: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE / 2,
  }
});
