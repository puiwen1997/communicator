import React, { PureComponent } from 'react'
import { Modal, ActivityIndicator, Alert, StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity, Dimensions, Linking } from 'react-native'
import { Button, Block, theme } from 'galio-framework';
import Icon from 'react-native-vector-icons/MaterialIcons'
import User from '../components/ChatRoomComponents/renderUser'
import { firebase } from '../config/FirebaseConfig';
import ConnectyCubeChatService from '../services/ConnectyCubeChatService';
import ConnectyCubeAuthService from '../services/ConnectyCubeAuthService'
import qs from 'qs';

const { height, width } = Dimensions.get('screen');

export default class ChatRoomContacts extends PureComponent {
  isGroupDetails = false

  constructor(props) {
    super(props)
    // this.isGroupDetails = this.props.navigation.getParam('isGroupDetails', false)

    this.state = {
      keyword: '',
      isLoader: false,
      isUpdate: false,
      userNotFound: '',
      listUsers: null,
      dialogType: this.isGroupDetails,
      activIndicator: false,
      isSearch: false,
      isVisible: false,
      fullName: '',
      emailAddress: '',
    }
  }

  selectedUsers = []

  handleChange = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  getUserInfo = () => {
    var user = firebase.auth().currentUser;
    if (user != null) {
      firebase.database().ref("users/" + user.uid).once('value').then((snapshot) => {
        var data = snapshot.val();
        this.setState({
          fullName: data.fullName,
        });
      })
    }
  }

  updateSearch = keyword => this.setState({ keyword })

  keyExtractor = (item, index) => index.toString()

  toggleUserSelect = (user) => {
    let newArr = []
    this.selectedUsers.forEach(elem => {
      if (elem.id !== user.id) {
        newArr.push(elem)
      }
    })
    this.selectedUsers = newArr
    this.setState({ isUpdate: !this.state.isUpdate })
  }

  _renderUser = ({ item }) => {
    const isSelected = this.selectedUsers.find(elem => elem.id === item.id)
    return (
      <User
        user={item}
        selectUsers={this.selectUsers}
        dialogType={this.state.dialogType}
        selectedUsers={isSelected ? true : false}
      />
    )
  }

  changeTypeDialog = () => {
    this.selectedUsers = []
    this.setState({ dialogType: !this.state.dialogType })
  }

  _renderSelectedUser = ({ item }) => {
    return (
      <TouchableOpacity style={styles.selectedUser} onPress={() => this.toggleUserSelect(item)}>
        <View style={{ paddingLeft: 10 }}>
          <View style={{ position: 'absolute', bottom: 7, right: 7, backgroundColor: 'white', width: 20, height: 20, borderRadius: 10 }}>
            <Icon name="cancel" size={20} color='grey' />
          </View>
        </View>
        <Text numberOfLines={2} style={{ textAlign: 'center' }}>{item.full_name}</Text>
      </TouchableOpacity >
    )
  }

  selectUsers = (user) => {
    const { navigation } = this.props;
    return ConnectyCubeChatService.createPrivateDialog(user.id).then((newDialog) => {
      navigation.navigate("ChatRoom", { dialogsProps: JSON.stringify(newDialog) });
    })
  }

  searchUsers = () => {
    this.setState({ isSearch: true, activIndicator: true });
    const { keyword } = this.state
    let str = keyword.trim()
    if (str.length > 2) {
      ConnectyCubeChatService.listUsersByFullName(str)
        .then((users) => {
          if (users.length >= 1) {
            this.setState({
              listUsers: users,
              isLoader: false,
              userNotFound: false,
              activIndicator: false
            })
            console.log("User found!")
            console.log(this.state)
          } else {
            this.setState({
              isLoader: false,
              userNotFound: true,
              activIndicator: false
            })
            console.log("User not found!")
            console.log(this.state)
          }
        })
        .catch(() => {
          this.setState({
            isLoader: false,
            userNotFound: true,
            activIndicator: false
          })
          console.log("User not found!")
          console.log(this.state)
        })
    } else {
      this.setState({ activIndicator: false })
      Alert.alert('Enter more than 3 characters')
    }
  }

  sendEmail = async (to) => {
    this.setState({ isVisible: !this.state.isVisible })
    this.getUserInfo();
    const subject = "Welcome to Communicator!"
    const body = `Hi! Your friend ${this.state.fullName} was inviting you to using the Communicator app.
    \nClick the link below to download the application.
    \nhttps://drive.google.com/drive/folders/139NBKbj0UVJf6j2IpBTiNs8cXyqAaKY5?usp=sharing`
    const cc = '' 
    const bcc = ''
    
    let url = `mailto:${to}`;

    // Create email link query
    const query = qs.stringify({
      subject: subject,
      body: body,
      cc: cc,
      bcc: bcc
    });

    if (query.length) {
      url += `?${query}`;
    }

    // check if we can use this link
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
      throw new Error('Provided URL can not be handled');
    }

    Linking.openURL(url);

  }

  renderSendInvitation = () => {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text size={20}>Send Invitation To Your Friend</Text>
              <TextInput
                placeholder="Your Friend Email Address"
                style={styles.textInput}
                backgroundColor="#f2f2f2"
                defaultValue={this.state.emailAddress}
                onChangeText={(text) => this.handleChange(text, 'emailAddress')}>
              </TextInput>
              <View style={styles.centeredView}>
                <Button
                  style={styles.saveButton}
                  color="info"
                  onPress={() => this.sendEmail(this.state.emailAddress)}>
                  Confirm
               </Button>
                <Button
                  style={styles.closeButton}
                  color="error"
                  round
                  onPress={() => this.setState({ isVisible: !this.state.isVisible })}
                >
                  Close
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }

  render() {
    const { activIndicator } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.searchUser}>
          <TextInput style={styles.searchInput}
            autoCapitalize="none"
            placeholder="Search users..."
            placeholderTextColor="grey"
            returnKeyType="search"
            onChangeText={this.updateSearch}
            onSubmitEditing={this.searchUsers}
            value={this.state.search}
          />
        </View>
        { activIndicator &&
          (
            <View style={styles.indicator}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )
        }
        { this.state.isSearch && this.state.userNotFound == true &&
          <View style={styles.inviteButton}>
            <Text style={styles.userNotFound}>Couldn't find user / Particular user already added! </Text>
            <Button onPress={() => { this.setState({ isVisible: !this.state.isVisible }) }}
              style={styles.inviteButton}>Send invitation to him/her by email?</Button>
          </View>
        }
        { this.state.isSearch && this.state.userNotFound == false &&
          <View>
            <FlatList
              data={this.state.listUsers}
              keyExtractor={this.keyExtractor}
              renderItem={(item) => this._renderUser(item)}
            />
          </View>
        }
        <View>
          {this.renderSendInvitation()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchUser: {
    margin: 10
  },
  searchInput: {
    fontSize: 18,
    fontWeight: '300',
    borderWidth: 0.5,
    borderRadius: 20,
    borderColor: 'grey',
    color: 'black',
    padding: 10,
  },
  dialogTypeContainer: {
    marginHorizontal: 12,
    paddingVertical: 10
  },
  dialogType: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dialogTypeText: {
    marginHorizontal: 5,
    fontSize: 16
  },
  containerCeletedUsers: {
    borderBottomWidth: 0.5,
    borderColor: 'grey',
    margin: 10
  },
  selectedUser: {
    width: 70,
    paddingBottom: 5,
    alignItems: 'center',
  },
  userNotFound: {
    fontSize: 17,
    marginTop: 20,
    textAlign: 'center'
  },
  inviteButton: {
    margin: 40,
    textAlign: 'center',
    alignItems: 'center'
  },
  createDialog: {
    position: 'absolute',
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    bottom: 40,
    right: 30,
    backgroundColor: '#48A6E3'
  },
  userContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  nameTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  select: {
    color: 'green',
    fontSize: 10,
    fontWeight: '500',
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
  saveButton: {
    width: width * 0.8,
    margin: 20,
    marginTop: 15
  },
  closeButton: {
    margin: 20,
    padding: 5,
    width: width / 4
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
})