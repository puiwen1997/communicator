import React, { Component } from 'react'
import { ActivityIndicator, Dimensions, StyleSheet, View, FlatList, Text, StatusBar, TouchableOpacity, Platform, Button, ScrollView } from 'react-native'
// import { connect } from 'react-redux'
// import store from '../../../store'
import ConnectyCubeChatService from '../services/ConnectyCubeChatService'
import ConnectyCubeAuthService from '../services/ConnectyCubeAuthService'
// import Indicator from '../../components/indicator'
// import CreateBtn from '../../components/createBtn'
// import { BTN_TYPE } from '../../../helpers/constants'
import Avatar from '../components/ChatRoomComponents/avatar'
// import PushNotificationService from '../../../services/push-notification'
import DialogTitles from '../components/ChatRoomComponents/dialogTitles'
import DialogLastDate from '../components/ChatRoomComponents/dialogLastDate'
import DialogUnreadCounter from '../components/ChatRoomComponents/dialogUnreadCounter'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import ActionButton from 'react-native-action-button';
import { Block } from 'galio-framework'

const { height, width } = Dimensions.get('screen');

export default class ChatRoomHome extends React.Component {
  static currentUserInfo = ''

  constructor(props) {
    super(props)
    this.state = {
      dialogs: [],
      noDialogs: '',
      isLoader: true,
      activIndicator: true,
    }
  }

  keyExtractor = (item, index) => index.toString()

  _renderDialog = ({ item }) => {
    const { navigation } = this.props
    return (
      <TouchableOpacity onPress={() => navigation.navigate("ChatRoom", { dialogsProps: JSON.stringify(item) })}>
        <View style={styles.container}>
          <Avatar
            // photo={dialogPhoto}
            name={item.name}
            iconSize="large"
          />
          <View style={styles.border} >
            <DialogTitles
              name={item.name}
              messageId={item.last_message_id}
              message={item.last_message}
            />
            <View style={styles.infoContainer}>
              <DialogLastDate
                lastDate={item.last_message_date_sent}
                lastMessage={item.last_message}
                updatedDate={item.updated_date}
              />
              <DialogUnreadCounter
                unreadMessagesCount={item.unread_messages_count}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity >
    )
  }

  componentDidMount() {
    const { navigation } = this.props
    this._unsubscribe = navigation.addListener('focus', () => {
      ConnectyCubeChatService.fetchDialogsFromServer()
        .then((response) => {
          this.setState({ activIndicator: false })
          console.log("Response: ", response)
          console.log("Response length: ", response.length)
          if (response.length >= 1) {
            this.setState({
              dialogs: response,
              noDialogs: false
            })
          } else {
            this.setState({
              dialogs: response,
              noDialogs: true
            })
          }

          console.log(this.state)
        })
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    const { navigation } = this.props;
    const { activIndicator } = this.state;
    return (
      // <View>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle={'dark-content'} />
        {activIndicator &&
          (
            <View style={styles.indicator}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )
        }
        {this.state.noDialogs ?
          (<Text style={styles.noDialogs}>No chat yet! :)</Text>) :
          (
            <View>
              <FlatList
                data={this.state.dialogs}
                keyExtractor={this.keyExtractor}
                renderItem={(item) => this._renderDialog(item)}
              />
            </View>
          )
        }
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#3498db' title="Search Contact" onPress={() => { navigation.navigate("ChatRoomContact") }}>
            <MaterialIcons name="person-add" size={30} />
          </ActionButton.Item>
        </ActionButton>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 10
  },
  border: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgrey'
  },
  infoContainer: {
    maxWidth: 75,
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingVertical: 10,
    marginLeft: 5
  },
  createDialog: {
    // flex: 1,
    position: 'absolute',
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    bottom: 10,
    right: 10,
    // bottom: - (height / 16 * 10),
    // right: width / 16 * 1.5,
    backgroundColor: '#48A6E3'
  },
  noDialogs: {
    fontSize: 17,
    marginTop: 20,
    textAlign: 'center'
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
})