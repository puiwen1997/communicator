import React from 'react';
import { TouchableHighlight, Dimensions, KeyboardAvoidingView, View, ScrollView, StyleSheet, Modal, Alert } from 'react-native';
import { theme, Text, Block, Button } from 'galio-framework';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput'
import { firebase } from '../config/FirebaseConfig';
import tts from 'react-native-tts';

const { height, width } = Dimensions.get('window');

export default class TextToSpeech extends React.Component {
    state = {
        text: "",
        message: "",
        isVisible: false,
        isFavourite: false,
        displayName: firebase.auth().currentUser.displayName
    };

    handleChange = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
    }

    // Convert entered text to speech
    convert = (text) => {
        tts.getInitStatus().then(() => {
            tts.speak(text);
        });
    }

    // Save favourite used word
    save = async () => {
        if (this.state.text != '') {
            fetch('https://communicator-server.herokuapp.com/tts/save', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "displayName": this.state.displayName,
                    "text": this.state.text
                })
            }).then((response) => response.json())
                .then((responseData) => {
                    if (responseData.message != null) {
                        this.setState({
                            message: responseData.message,
                            isVisible: !this.state.isVisible,
                        });
                    }
                }).catch(function (error) {
                    console.log('There has been a problem with your fetch operation: ' + error.message);
                    throw error;
                });
        } else {
            Alert.alert("Text cannot be null!")
        }
    }

    renderModal = (message) => {
        return (
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.isVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>{message}</Text>
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
    }

    renderIcon = () => {
        if (this.state.isFavourite == false) {
            return (
                <FontAwesome
                    name='star-o'
                    size={30}
                />
            )
        } else {
            return (
                <MaterialIcons
                    name='star'
                    size={20}
                />
            )
        }
    }

    render() {
        const { navigation } = this.props;

        return (
            <Block flex style={styles.block}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <KeyboardAvoidingView behavior="height" enabled>
                        <Block flex right>
                            <TouchableHighlight onPress={() => this.save()}>
                                <FontAwesome name='star-o' size={30} color="#000000" />
                            </TouchableHighlight>
                        </Block>
                        <Block>
                            <AutoGrowingTextInput
                                backgroundColor="#ffffff"
                                style={styles.textInput}
                                placeholder="Please enter the text..."
                                placeholderTextColor="black"
                                value={this.state.text}
                                onChangeText={(text) => this.handleChange(text, 'text')}
                                maxHeight={170}
                                minHeight={50}
                                enableScrollToCaret
                            />
                        </Block>
                        <Block>
                            <Button
                                style={styles.button}
                                color='info'
                                onPress={() => this.convert(this.state.text)}>
                                Convert
                            </Button>
                        </Block>
                        <Block flex middle right>
                            <Button
                                color="pink"
                                onlyIcon
                                large
                                style={styles.favouriteButton}
                                icon="favorite"
                                iconFamily="MaterialIcons"
                                iconSize={theme.SIZES.BASE * 1.2}
                                onPress={() => {
                                    this.setState({ text: '' })
                                    navigation.navigate('FavouriteText')
                                }}>
                                Go to favourite
                            </Button>
                            <Text color="#000000" size={theme.SIZES.BASE * 0.8} muted>Go to favourite</Text>
                            {this.renderModal(this.state.message)}
                        </Block>
                    </KeyboardAvoidingView>
                </ScrollView>
            </Block>
        )
    }
}

const styles = StyleSheet.create({
    block: {
        padding: theme.SIZES.BASE,
        margin: 10
    },
    input: {
        padding: theme.SIZES.BASE,
        height: height * 0.2,
    },
    button: {
        fontSize: theme.SIZES.BASE,
        width: width - 64,
        padding: theme.SIZES.BASE,
        margin: 10
    },
    favouriteButton: {
        width: (width - 64) / 5,
        padding: theme.SIZES.BASE,
        marginTop: theme.SIZES.BASE * 4
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
        fontSize: 18,
        marginBottom: 18,
        textAlign: "center"
    },
    textInput: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: theme.SIZES.BASE * 3,
        marginBottom: theme.SIZES.BASE,
        width: width - 64,
        padding: theme.SIZES.BASE,
        fontSize: theme.SIZES.BASE
        // margin: 10
        // width: width * 0.8,
        // height: height * 0.1,
    }
})