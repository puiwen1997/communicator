import React, { Component } from 'react'
import { Alert, StyleSheet, View, Text, Dimensions, TouchableOpacity, Modal, Platform, ActivityIndicator } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import { getTime } from '../ChatRoomComponents/getTime'
import MessageSendState from '../ChatRoomComponents/messageSendState'
import ChatImage from '../ChatRoomComponents/chatImage'
import Icon from 'react-native-vector-icons/AntDesign'
import ConnectyCubeChatService from '../../services/ConnectyCubeChatService'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import SoundPlayer from 'react-native-sound-player'
import tts from 'react-native-tts';
import Sound from 'react-native-sound';
import ConnectyCube from 'react-native-connectycube'
import RNFS from 'react-native-fs'
import { firebase } from '../../config/FirebaseConfig'

const fullWidth = Dimensions.get('window').width
const fullHeight = Dimensions.get('window').height

export default class Message extends Component {
  isAtachment = null
  attachmentType = null
  attachmentURL = null
  attachmentUid = null

  constructor(props) {
    super(props)
    this.state = {
      activIndicator: false,
      userInfo: '',
      isModal: false,
      send_state: props.message.send_state,
      playing: false,
      recordSecs: 0,
      recordTime: '00:00:00',
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00:00',
      duration: '00:00:00',
      transcription: '',
      errorMessage: '',
      downloadURL: '',
      isVisible: false
    };
    this.audioRecorderPlayer = new AudioRecorderPlayer();

    this.isAtachment = props.message.attachment
    if (this.isAtachment) {
      this.attachmentType = this.isAtachment[0].type
      this.attachmentURL = this.isAtachment[0].url
      this.attachmentUid = this.isAtachment[0].uid
    } else {
      this.attachmentType = "text/plain"
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.message.send_state != nextState.send_state ||
      nextState.isModal !== this.state.isModal
    ) {
      return true
    } else {
      return false
    }
  }

  renderAttachment = () => {

    const { message } = this.props
    const { isModal, activIndicator } = this.state

    if (this.attachmentType == 'image/jpeg') {

      return (
        <TouchableOpacity style={{ marginBottom: 3 }} onPress={this.handleModalState}>
          <ChatImage photo={message.attachment[0].url} width={200} height={150} />
        </TouchableOpacity>
      )

    } else if (this.attachmentType == 'audio/aac') {

      return (
        <View style={styles.rowContainer}>
          {activIndicator &&
            (
              <View style={styles.indicator}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )
          }
          <TouchableOpacity onPress={() => {
            this.onStartPlay(this.attachmentURL)
          }}>
            <FontAwesome style={styles.attachmentIcon} name="play" size={32} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            this.transcribe(this.attachmentURL)
          }}>
            <MaterialIcons name="swap-horiz" size={20} color="#683e87" />
          </TouchableOpacity>
        </View>
      )
    }
  }

  renderHeader = () => {
    return <View style={[{ margin: Platform.OS === 'ios' ? 35 : 15 }, { position: 'absolute', zIndex: 10 }]}>
      <Icon name="close" size={30} color='white' onPress={this.handleModalState} />
    </View>
  }

  handleModalState = () => {
    this.setState({ isModal: !this.state.isModal })
  }

  onStartPlay = async (url) => {
    this.setState({ activIndicator: true })
    console.log(url)
    const str = url.split('/')
    const name = str[str.length - 1]
    const fileString = name.split('?')
    const fileName = fileString[0]
    console.log(typeof fileName);
    var ref = firebase.storage().ref("voiceMessages/" + fileName + ".flac");
    console.log(ref)
    // var ref = firebase.storage().ref("voiceMessages/fileName.flac");
    console.log(await ref.getDownloadURL())

    await ref.getDownloadURL().then((result) => {
      console.log(result)
      if (result != null) {

        this.playURL(result)
      } else {
        Alert.alert("Cannot find the audio message!")
      }
    }).catch(function (error) {
      console.log(error)
      Alert.alert(error);
    })
  };

  playURL = async (url) => {
    await this.audioRecorderPlayer.removePlayBackListener();
    const msg = await this.audioRecorderPlayer.startPlayer(url);
    this.audioRecorderPlayer.setVolume(1.0);
    this.audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.current_position === e.duration) {
        console.log('finished');
        this.audioRecorderPlayer.stopPlayer();
      }
      this.setState({
        activIndicator: true,
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
      return;
    });

  }

  onStopPlay = async (e) => {
    console.log('onStopPlay');
    this.setState({ activIndicator: false })
    this.audioRecorderPlayer.stopPlayer();
    this.audioRecorderPlayer.removePlayBackListener();
  };


  transcribe = async (url) => {
    this.setState({ activIndicator: true });
    console.log(url)
    const str = url.split('/')
    const name = str[str.length - 1]
    const fileString = name.split('?')
    const fileName = fileString[0]
    console.log(typeof fileName);

    // fetch('https://communicator-server.herokuapp.com/transcribe', {
    fetch('http://10.0.2.2:5000/transcribe', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: fileName
      })
    }).then((response) => response.json())
      .then((responseData) => {
        console.log(responseData)
        if (responseData.error == false) {
          this.setState({
            transcription: responseData.transcription,
            activIndicator: false,
          });

          if (this.state.transcription != "") {
            Alert.alert(`Transcription: \n`, this.state.transcription)
          } else {
            Alert.alert(`Error:\nFailed to recognize the speech!`)
          }

        } else {

          this.setState({ errorMessage: `Error:\nFailed to transcribe the speech!` })
          Alert.alert(errorMessage)

        }
      }).catch(function (error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        throw error;
      });
  }

  // Convert text to speech
  convert = (text) => {
    tts.getInitStatus().then(() => {
      tts.speak(text);
    });
  }

  componentDidMount() {
    const { message } = this.props
    ConnectyCubeChatService.retrieveUserInfo([message.sender_id]).then((info) => {
      this.setState({
        userInfo: info
      })
    });
  }

  render() {
    const { message, otherSender } = this.props
    const { isModal, activIndicator } = this.state
    // console.log("Info", this.state)
    // console.log("attachmentType:", this.attachmentType)
    console.log("message", message)
    const user = otherSender ? this.state.userInfo : '.'
    // const user = otherSender ? store.getState().users[message.sender_id] : '.'
    return (
      <View>
        { activIndicator &&
          <Modal visible={activIndicator} transparent={false} style={{ backgroundColor: 'white' }}>
            <View style={{
              width: fullWidth,
              height: fullHeight,
            }}>
              <Text>Loading</Text>
            </View>
          </Modal>
        }
        {this.attachmentType == 'image/jpeg' &&
          <Modal visible={isModal} transparent={false} style={{ backgroundColor: 'black' }}>
            <View style={{
              width: fullWidth,
              height: fullHeight,
            }}>
              <ImageViewer
                imageUrls={[{ url: message.attachment[0].url }]}
                onCancel={() => this.handleModalState()}
                enableSwipeDown
                renderIndicator={() => null}
                renderHeader={this.renderHeader}
                renderImage={props => (
                  <ChatImage
                    photo={props.source.uri}
                    width={+message.attachment[0].width}
                    height={+message.attachment[0].height}
                  />
                )}
              />
            </View>
          </Modal>
        }
        {otherSender ?
          (
            <View style={[styles.container, styles.positionToLeft]}>
              <View style={[styles.message, styles.messageToLeft]}>
                {this.isAtachment && this.renderAttachment()}
                {message.body != null &&
                  <TouchableOpacity onPress={() => this.convert(message.body)}>
                    <Text style={[styles.messageText, styles.selfToLeft]}>
                      {message.body}
                    </Text>
                  </TouchableOpacity>
                }
                <Text style={styles.dateSent}>
                  {getTime(message.date_sent)}
                </Text>
              </View>
            </View>
          ) :
          (
            <View style={[styles.container, styles.positionToRight]}>
              <View style={[styles.message, styles.messageToRight]}>
                {this.isAtachment && this.renderAttachment()}
                {message.body != null &&
                  <TouchableOpacity onPress={() => this.convert(message.body)}>
                    <Text style={[styles.messageText, styles.selfToRight]}>
                      {message.body}
                    </Text>
                  </TouchableOpacity>
                }
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Text style={styles.dateSent}>
                    {getTime(message.date_sent)}
                  </Text>
                  <MessageSendState send_state={message.send_state} />
                </View>
              </View>
            </View>
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  positionToLeft: {
    justifyContent: 'flex-start'
  },
  positionToRight: {
    justifyContent: 'flex-end'
  },
  message: {
    paddingTop: 5,
    paddingBottom: 3,
    paddingHorizontal: 6,
    borderRadius: 10
  },
  messageToLeft: {
    maxWidth: fullWidth - 90,
    borderBottomLeftRadius: 2,
    backgroundColor: '#63D9C6'
  },
  messageToRight: {
    maxWidth: fullWidth - 55,
    borderBottomRightRadius: 2,
    backgroundColor: '#a0b2bd'
  },
  messageText: {
    fontSize: 16,
    color: 'white'
  },
  selfToLeft: {
    alignSelf: 'flex-start'
  },
  selfToRight: {
    alignSelf: 'flex-end'
  },
  dateSent: {
    alignSelf: 'flex-end',
    paddingTop: 1,
    paddingHorizontal: 3,
    fontSize: 12,
    color: 'lightcyan'
  },
  rowContainer: {
    flexDirection: 'row'
  },
  attachmentIcon: {
    paddingRight: 20,
    marginLeft: 10,
    marginRight: 30
  },
  indicator: {
    // position: 'absolute',
    alignSelf: 'center',
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
    width: fullWidth * 0.8,
    height: fullHeight * 0.1,
  },
  modalView: {
    width: fullWidth * 0.9,
    height: fullHeight * 0.5,
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
})
