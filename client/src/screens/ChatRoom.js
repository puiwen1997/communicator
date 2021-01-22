import React, { PureComponent } from 'react'
import { Alert, StyleSheet, View, FlatList, StatusBar, KeyboardAvoidingView, TouchableOpacity, Platform, ActivityIndicator, PermissionsAndroid } from 'react-native'
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput'
import { RNFFmpeg } from 'react-native-ffmpeg';
import RNFS from 'react-native-fs'
import ImagePicker from 'react-native-image-crop-picker'
import Icon from 'react-native-vector-icons/MaterialIcons'
import uuid from 'uuid-random';
import AudioRecorderPlayer, { AVEncoderAudioQualityIOSType, AVEncodingOption, AudioEncoderAndroidType, AudioSourceAndroidType } from 'react-native-audio-recorder-player';

import ConnectyCubeChatService from '../services/ConnectyCubeChatService'
import ConnectyCubeAuthService from '../services/ConnectyCubeAuthService'
import { firebase } from '../config/FirebaseConfig'
import Message from '../components/ChatRoomComponents/message'

export default class ChatRoom extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      writeExternalStoragePermission: '',
      recordAudioPermission: '',
      currentUserId: '',
      history: [],
      activIndicator: true,
      messageText: '',
      isLoggingIn: false,
      recordSecs: 0,
      recordTime: '00:00:00',
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00:00',
      duration: '00:00:00',
      translation: ''
    };
    this.audioRecorderPlayer = new AudioRecorderPlayer();
  }

  needToGetMoreMessage = null

  onTypeMessage = messageText => this.setState({ messageText })

  onPickImage = () => {
    return ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      return image
    })
  }

  getPermissionBeforeRecord = async () => {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Permissions for write access',
        message: 'Give permission to your storage to write a file',
        buttonPositive: 'Ok',
      },
    );
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Permissions for record audio',
        message: 'Give permission to record audio',
        buttonPositive: 'Ok',
      },
    );
  }

  onStartRecord = async () => {

    this.setState({ activIndicator: true })

    const randomUUID = uuid();
    this.setState({
      uid: randomUUID
    })

    const path = Platform.select({
      ios: randomUUID + '.m4a',
      android: "storage/emulated/0/Android/data/com.client/files/" + randomUUID + '.aac', // should give extra dir name in android. Won't grant permission to the first level of dir.
    });

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.flac,
    };

    const uri = await this.audioRecorderPlayer.startRecorder(path, audioSet);

    this.audioRecorderPlayer.addRecordBackListener((e) => {
      this.setState({
        recordSecs: e.current_position,
        recordTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ),
      });
    });

  };

  onStopRecord = async () => {

    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
    });

    if (result != null) {

      const outputPath = `file:///storage/emulated/0/Android/data/com.client/files/${this.state.uid}.flac`
      console.log("Output path: ", outputPath)

      await RNFFmpeg.execute(`-i ${result} -c:v flac ${outputPath}`).then((res) => {
        console.log("FFmpeg process exited with rc " + res.rc)
      });

      try {
        await RNFS.stat(result).then((contents) => {
          if (contents != null) {
            this.sendVoiceMessage(contents);
            this.saveToFirebaseStorage(outputPath);
          }
        })
      } catch (error) {
        Alert.alert(`Error:\nError in sending message.`)
      }
    }
  };

  saveToFirebaseStorage = async (url) => {

    var ref = firebase.storage().ref().child("voiceMessages/" + this.state.uid + '.flac');
    let res = await fetch(url);

    await res.blob().then((blobResult) => {

      var metadata = {
        contentType: 'audio/flac',
      };
      ref.put(blobResult, metadata).then(function (snapshot) {
        console.log('Uploaded a blob or file!');
      }).catch(function (error) {
        Alert.alert(error);
      })
    }).catch(function (error) {
      Alert.alert(error);
    })
  }

  sendVoiceMessage = async (contents) => {
    const { dialogsProps } = this.props.route.params;
    const dialog = JSON.parse(dialogsProps)

    const newHistory = await ConnectyCubeChatService.sendVoiceMessage(dialog, '', contents)
    console.log(newHistory)
    if (newHistory != this.state.history) {
      this.setState({
        history: newHistory,
        activIndicator: false
      })
    }
  }

  sendAttachment = async () => {
    const { dialogsProps } = this.props.route.params;
    const dialog = JSON.parse(dialogsProps)
    const img = await this.onPickImage()

    this.setState({ activIndicator: true })
    const newHistory = await ConnectyCubeChatService.sendMessage(dialog, '', img)
    if (newHistory != this.state.history) {
      this.setState({
        history: newHistory,
        activIndicator: false
      })
    }
  }

  sendMessage = async () => {
    this.setState({ activIndicator: true })
    const { dialogsProps } = this.props.route.params;
    const dialog = JSON.parse(dialogsProps)

    const { messageText } = this.state
    if (messageText.length <= 0) return

    const newHistory = await ConnectyCubeChatService.sendMessage(dialog, messageText)
    if (newHistory != this.state.history) {
      this.setState({
        history: newHistory
      })
    }
    this.setState({ messageText: '', activIndicator: false })
  }

  _keyExtractor = (item, index) => index.toString()

  _renderMessageItem(message) {
    const isOtherSender = message.sender_id !== this.state.currentUserId ? true : false
    return (
      <Message otherSender={isOtherSender} message={message} key={message.id} />
    );
  }

  componentDidMount = async () => {
    await this.getPermissionBeforeRecord();

    const { dialogsProps } = this.props.route.params;
    const dialog = JSON.parse(dialogsProps)

    await ConnectyCubeAuthService.getConnectyCurrentUser().then((data) => {
      ConnectyCubeChatService.getHistoryMessages(dialog).then((historyMessages) => {
        this.setState({
          currentUserId: data.id,
          history: historyMessages
        })
        ConnectyCubeChatService.getMessages(dialog, historyMessages)
          .catch(e => alert(`Error.\n\n${JSON.stringify(e)}`))
          .then(amountMessages => {
            amountMessages === 100 ? this.needToGetMoreMessage = true : this.needToGetMoreMessage = false
            this.setState({ activIndicator: false })
          })
      })

    })
  }

  render() {
    const { navigation } = this.props;
    const { messageText, activIndicator } = this.state

    const { dialogsProps } = this.props.route.params;
    const dialog = JSON.parse(dialogsProps)

    navigation.setOptions({
      title: dialog.name
    })

    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: 'white' }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 100}
      >
        <StatusBar barStyle="dark-content" />
        {activIndicator &&
          (
            <View style={styles.indicator}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )
        }
        <FlatList
          inverted
          data={this.state.history}
          keyExtractor={this._keyExtractor}
          renderItem={({ item }) => this._renderMessageItem(item)}
          onEndReachedThreshold={5}
          onEndReached={this.getMoreMessages}
        />
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <AutoGrowingTextInput
              color="#000000"
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="#000000"
              value={messageText}
              onChangeText={this.onTypeMessage}
              maxHeight={170}
              minHeight={50}
              enableScrollToCaret
            />
            <TouchableOpacity style={styles.attachment} onPress={this.sendAttachment}>
              <Icon name="photo" size={32} color="#8c8c8c" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.micAttachment} onPressIn={this.onStartRecord} onPress={this.onStopRecord}>
              <Icon name="mic" size={32} color="#8c8c8c" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button}>
            <Icon name="send" size={32} color="blue" onPress={this.sendMessage} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',
    paddingVertical: 12,
    paddingHorizontal: 35
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    paddingTop: 25,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '300',
    color: '#000000',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 14 : 10,
    paddingBottom: Platform.OS === 'ios' ? 14 : 10,
    paddingRight: 35,
    backgroundColor: 'whitesmoke',
  },
  button: {
    width: 40,
    height: 50,
    marginBottom: Platform.OS === 'ios' ? 15 : 0,
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachment: {
    width: 40,
    height: 50,
    position: 'absolute',
    right: 0,
    bottom: 0,
    // marginLeft: 12,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  micAttachment: {
    width: 40,
    height: 50,
    position: 'relative',
    right: 50,
    bottom: 0,
    // marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    marginBottom: Platform.OS === 'ios' ? 15 : 0,
    flexDirection: 'row'
  },
});

// const mapStateToProps = (state, props) => ({
//   history: state.messages[props.navigation.state.params.dialog.id],
//   currentUser: state.currentUser
// })

// export default connect(mapStateToProps)(Chat)