import React from 'react';
import { TouchableHighlight, Dimensions, KeyboardAvoidingView, View, ScrollView, StyleSheet, Modal, Alert } from 'react-native';
import { theme, Toast, Text, Block, Button, Input, Card } from 'galio-framework';
import tts from 'react-native-tts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Modal from 'react-native-modal';

const { height, width } = Dimensions.get('window');

export default class TextToSpeech extends React.Component {
    state = {
        text: "",
        message: "",
        isVisible: false,
        isFavourite: false
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
                    "text": this.state.text
                })
            }).then((response) => response.json())
                .then((responseData) => {
                    this.setState({
                        message: responseData.message,
                        isVisible: !this.state.isVisible,
                        // isFavourite: !this.state.isFavourite
                    });
                })
                .catch(function (error) {
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
                    size={20}
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
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height" enabled>
                        <Block flex right>
                            <TouchableHighlight onPress={() => this.save()}>
                                {this.renderIcon()}
                            </TouchableHighlight>
                        </Block>
                        <Block>
                            <Input
                            id={1}
                                color={theme.COLORS.BLACK}
                                label='Text'
                                placeholder='Please enter the text you would like to translate.'
                                style={styles.input}
                                icon = "cancel"
                                family = "MaterialIcons"
                                right
                                onChangeText={(text) => this.handleChange(text, 'text')}
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
                                color="success"
                                onlyIcon
                                large
                                style={styles.favouriteButton}
                                icon="navigate-next"
                                iconFamily="MaterialIcons"
                                onPress={() => navigation.navigate('FavouriteText')}>
                                Go to favourite
                            </Button>
                            <Text size={8} muted>Go to favourite</Text>
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
        paddingBottom: theme.SIZES.BASE * 5,
        paddingVertical: theme.SIZES.BASE,
        margin: 10
    },
    input: {
        padding: theme.SIZES.BASE,
        height: height * 0.2,
    },
    button: {
        width: width - 64,
        padding: theme.SIZES.BASE,
        margin: 10
    },
    favouriteButton: {
        width: (width - 64) / 5,
        padding: theme.SIZES.BASE,
        marginTop: 20
    },
    modalButton: {
        width: width/4
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