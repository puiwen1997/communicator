import React from 'react';
import { Image, Modal, TouchableHighlight, Dimensions, KeyboardAvoidingView, View, ScrollView, StyleSheet } from 'react-native';
import { theme, Toast, Text, Block, Button, Input } from 'galio-framework';
// import theme from '../theme';
import tts from 'react-native-tts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { height, width } = Dimensions.get('window');

const colourScheme = [
  "#004d80",
  "#005c99",
  "#006bb3",
  "#007acc",
  "#008ae6",
  "#0099ff",
  "#1aa3ff",
  "#33adff",
  "#006bb3",
  "#007acc",
  "#4db8ff",
  "#66c2ff"
]

export default class ChatRoomHome extends React.Component {
  state = {
    data: [
      { id: "1", title: "Albert", avatar: "https://placeimg.com/140/140/any" },
      { id: "2", title: "Wendy", avatar: "https://placeimg.com/140/140/any" },
      { id: "3", title: "Navindren", avatar: "https://placeimg.com/140/140/any" }
    ],
    message: '',
    isVisible: false
  };

  renderChatRoom = (navigation) => {
    return (
      this.state.data.map(info => (
        <Block left style={styles.buttonBlock} key={info.id}>
          <TouchableHighlight onPress={() => { navigation.navigate('ChatRoom') }}>
            <Block left>
              {/* <Image url={info.avatar}/> */}
              <Text style={styles.text}>{info.title}</Text>
            </Block>
          </TouchableHighlight>
        </Block>
      ))
    )
  }

  render() {
    const { navigation } = this.props;
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Block>
          <Block>
            {this.renderChatRoom(navigation)}
          </Block>
          <Block style={styles.addButtonBlock} right>
             <Button style={styles.addButton} color='info'>
            <MaterialIcons name='add' size={20} />
          </Button>
          </Block>
         
        </Block>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  block: {
    width: width,
    paddingBottom: 3,
  },
  buttonBlock: {
    width: width,
    padding: 5
  },
  addButtonBlock: {
    width: width,
    padding: theme.SIZES.BASE
  },
  input: {
    padding: theme.SIZES.BASE,
    height: height * 0.2
  },
  button: {
    width: (width / 16 * 13),
  },
  addButton: {
    width: (width / 16 * 3)
  },
  text: {
    alignSelf: 'flex-start',
    fontSize: theme.SIZES.BASE * 2,
    padding: theme.SIZES.BASE
  },
  modalButton: {
    width: width / 4
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    marginTop: 22
  },
  modalView: {
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
  }
})