import React from 'react';
import { TextInput, Modal, TouchableHighlight, Dimensions, KeyboardAvoidingView, View, ScrollView, StyleSheet } from 'react-native';
import { theme, Toast, Text, Block, Button, Input } from 'galio-framework';
// import theme from '../theme';
import tts from 'react-native-tts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { text } from 'react-native-communications';

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

export default class FavouriteText extends React.Component {
    state = {
        favouriteText: [],
        message: '',
        isVisible: false,
        id: '',
        text: ''
        // edit: {
        //     id: '',
        //     text: ''
        // }

    };

    handleChange = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
    }

    // Convert text to speech
    convert = (text) => {
        tts.getInitStatus().then(() => {
            tts.speak(text);
        });
    }

    retrieve = () => {
        fetch('https://communicator-server.herokuapp.com/tts/retrieve', {
            // fetch('http://10.0.2.2:5000/tts/retrieve', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
            .then((responseData) => {
                // console.log(responseData);
                this.setState({ favouriteText: responseData.defaultText });
                // console.log(this.state.favouriteText);
            })
            .catch(error => console.warn(error));
    }

    edit = (id, text) => {
        fetch('https://communicator-server.herokuapp.com/tts/edit', {
        // fetch('http://10.0.2.2:5000/tts/edit', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id": id,
                "editText": text
            })
        }).then((response) => response.json())
            .then((responseData) => {
                console.log(responseData.data);
                this.setState({ 
                    favouriteText: responseData.data,
                    message: responseData.message 
                });
                console.log(this.state.message);
            })
            .catch(error => console.warn(error));

    }

    delete = (id) => {
        fetch('https://communicator-server.herokuapp.com/tts/delete', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "id": id })
        }).then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                this.setState({
                    favouriteText: responseData.data,
                    message: responseData.message
                });
                console.log(this.state.message);
            })
            .catch(error => console.warn(error));

    }

    componentDidMount() {
        this.retrieve();
    }

    renderEdit(id, text) {
        this.setState({
            id: id,
            text: text,
            isVisible: !this.state.isVisible
        })
    }

    renderModal = () => {
        // this.setState({isVisible: !this.state.isVisible})
        // if (this.state.isVisible == true) {
        // console.log("Hi")
        // console.log(this.state.isVisible)
        // console.log(this.state.text)
        return (
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.isVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text>Edit Here!</Text>
                            <TextInput
                                defaultValue={this.state.text}
                                onChangeText={(text) => this.handleChange(text, 'text') }>
                            </TextInput>
                            <Button 
                                style={styles.modalButton} 
                                color="info"
                                onPress={() => this.edit(this.state.id, this.state.text)}>
                                Save
                            </Button>
                            <Button
                                style={styles.modalButton}
                                color="error"
                                round
                                onPress={() => this.setState({ isVisible: !this.state.isVisible })}
                            >
                                Close
                            </Button>
                        </View>
                    </View>
                </Modal>
            </View>
        )
        // }
    }

    renderFavouriteText = (navigation) => {
        return (
            this.state.favouriteText.map(buttonInfo => (
                <Block key={buttonInfo.id} row style={styles.block}>
                    <Button
                        style={styles.button}
                        color='#b3ccff'
                        onPress={() => this.convert(buttonInfo.text)}>
                        <Text style={styles.text}>{buttonInfo.text}</Text>
                    </Button>
                    <TouchableHighlight onPress={() => { this.renderEdit(buttonInfo.id, buttonInfo.text) }}>
                        <Block style={styles.buttonBlock} middle>
                            <MaterialIcons
                                name='edit'
                                size={width / 16 * 1.2}
                            />
                            {/* {this.renderModal(buttonInfo.id, buttonInfo.text)} */}
                        </Block>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this.delete(buttonInfo.id)}>
                        <Block style={styles.buttonBlock} middle>
                            <MaterialIcons
                                color="red"
                                name='delete'
                                size={width / 16 * 1.2}
                            />
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
                    {this.renderFavouriteText(navigation)}
                </Block>
                <Block>
                    {this.renderModal()}
                </Block>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    block: {
        backgroundColor: '#b3ccff',
        marginBottom: 5
    },
    buttonBlock: {
        width: (width / 16 * 1.5),
        paddingTop: 7,
        // paddingBottom: 3,
    },
    input: {
        padding: theme.SIZES.BASE,
        height: height * 0.2
    },
    button: {
        width: (width / 16 * 13),
    },
    text: {
        alignSelf: 'flex-start',
        fontSize: 16,
        padding: theme.SIZES.BASE
    },
    modalButton: {
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