import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ChatRoom extends React.Component {
  state = {
    messages: [],
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello! How are you?',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    return (
      <GiftedChat
        alwaysShowSend
        onLongPress={()=>{
          this.onSend(messages)
        }}
        // renderMessageImage="true"
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        // renderActions={() => {
        //   if (Platform.OS === "android") {
        //     return (
        //       <Ionicons
        //         name="ios-mic"
        //         size={35}
        //         hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
        //         color={this.state.startAudio ? "red" : "black"}
        //         style={{
        //           bottom: 50,
        //           // right: Dimensions.get("window").width / 2,
        //           position: "absolute", 
        //           shadowColor: "#000",
        //           shadowOffset: { width: 0, height: 0 },
        //           shadowOpacity: 0.5,
        //           zIndex: 2,
        //           backgroundColor: "transparent"
        //         }}
        //         onPress={this.handleAudio}
        //       />);
        //     }
        // }}
      />
    )
  }
}