import React from 'react';
import { ActivityIndicator, TextInput, Modal, TouchableHighlight, Dimensions, KeyboardAvoidingView, View, ScrollView, StyleSheet } from 'react-native';
import { theme, Toast, Text, Block, Button, Input } from 'galio-framework';
// import theme from '../theme';
import tts from 'react-native-tts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { text } from 'react-native-communications';
import Separator from '../components/Separator';
import { firebase } from '../config/FirebaseConfig';

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

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default class FavouriteText extends React.Component {
    state = {
        activIndicator: true,
        favouriteText: [],
        message: '',
        isVisible: false,
        id: '',
        text: '',
        displayName: firebase.auth().currentUser.displayName
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
        fetch(`https://communicator-server.herokuapp.com/tts/retrieve/${this.state.displayName}`, {
            // fetch(`http://10.0.2.2:5000/tts/retrieve/${this.state.displayName}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
            .then((responseData) => {
                // console.log(responseData);
                this.setState({ activIndicator: false, favouriteText: responseData.defaultText });
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
                "displayName": this.state.displayName,
                "id": id,
                "editText": text
            })
        }).then((response) => response.json())
            .then((responseData) => {
                console.log(responseData.data);
                this.setState({
                    isVisible: !this.state.isVisible,
                    favouriteText: responseData.data,
                    message: responseData.message
                });
                console.log(this.state.message);
            })
            .catch(error => console.warn(error));

    }

    delete = (id) => {
        fetch('https://communicator-server.herokuapp.com/tts/delete', {
            // fetch('http://10.0.2.2:5000/tts/delete', {    
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "displayName": this.state.displayName,
                "id": id
            })
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
        return (
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.isVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text size={20}>Edit Here!</Text>
                            <TextInput
                                style={styles.textInput}
                                backgroundColor="#f2f2f2"
                                defaultValue={this.state.text}
                                onChangeText={(text) => this.handleChange(text, 'text')}>
                            </TextInput>
                            <View style={styles.centeredView}>
                                <Button
                                    style={styles.saveButton}
                                    color="info"
                                    onPress={() => this.edit(this.state.id, this.state.text)}>
                                    Save
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
        // }
    }

    renderFavouriteText = (navigation) => {
        return (
            this.state.favouriteText.map(buttonInfo => (
                <Block style={styles.borderLine} key={buttonInfo.id} row>
                    <TouchableHighlight style={styles.button} onPress={() => this.convert(buttonInfo.text)}>
                        <Text style={styles.text}>{buttonInfo.text}</Text>
                    </TouchableHighlight>
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
                    <Separator />
                </Block>

            ))
        )
    }

    render() {
        const { navigation } = this.props;
        const { activIndicator } = this.state;
        return (
            <View style={{ flex: 1 }}>
                {activIndicator &&
                    (
                        <View style={styles.indicator}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    )
                }

                <ScrollView showsVerticalScrollIndicator={false}>

                    <Block>
                        {this.renderFavouriteText(navigation)}
                    </Block>
                    <Block>
                        {this.renderModal()}
                    </Block>

                </ScrollView>


            </View>
        )
    }
}

const styles = StyleSheet.create({
    borderLine: {
        borderBottomWidth: 0.5,
        borderColor: 'black',
    },
    block: {
        // backgroundColor: '#b3ccff',
        marginBottom: 5
    },
    buttonBlock: {
        width: (width / 16 * 1.5),
        paddingTop: 10,
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
    indicator: {
        paddingTop: height * 0.3,
        paddingBottom: height * 0.3,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    }
})