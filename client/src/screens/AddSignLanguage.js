import React from 'react';
import { Modal, Image, Dimensions, KeyboardAvoidingView, View, ScrollView, StyleSheet } from 'react-native';
import { theme, Text, Block, Button, Input } from 'galio-framework';
// import theme from '../theme';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
import ImagePicker from 'react-native-image-picker';
import tts from 'react-native-tts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { height, width } = Dimensions.get('window');

export default class AddSignLanguage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cd: '',
            dscp: '',
            text: '',
            defaultSignLanguage: [],
            isChange: null,
            isEntered: false,
        };
        // this.handleChoosePhoto = this
        //     .handleChoosePhoto
        //     .bind(this);
        // this.handleUpload = this.handleUpload.bind(this);
    }

    handleChange = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
    }

    handleChoosePhoto = async () => {
        const options = {
            // title: 'Select Photo',
            // customButtons: [
            //     { name: 'gallery', title: 'Choose Photo from Gallery' },
            //     { name: 'camera', title: 'Take photo' }
            // ]
            noData: true,
        };
        ImagePicker.showImagePicker(options, response => {
            if (response.uri) {
                console.log('Response = ', response);
                this.setState({
                    photo: response
                })
            } else if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                console.log('User selected a file form camera or gallery', response);
            }
        })
    }

    /*Upload multiple files*/
    // createFormData = (photo, body) => {
    //     const data = new FormData()
    //     data.append('photo', {
    //       name: photo.fileName,
    //       type: photo.type,
    //       uri:
    //         Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
    //     })
    //     Object.keys(body).forEach(key => {
    //       data.append(key, body[key])
    //     })
    //     return data;
    //   }

    createFormData = (photo) => {
        const data = new FormData()
        data.append('photo', {
            name: photo.fileName,
            type: photo.type,
            uri:
                Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
            code: this.state.code,
            description: this.state.description
        })
        return data;
    }

    handleUpload = async () => {
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: this.createFormData(this.state.photo, { userId: '123' })
        };
        fetch("https://communicator-server.herokuapp.com/upload", config)
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                this.setState({
                    returnPhoto: responseData.data.url
                })

                fetch("https://communicator-server.herokuapp.com/signLanguage/save", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "cd": this.state.cd,
                        "dscp": this.state.dscp,
                        "url": this.state.returnPhoto,
                        "username": "admin"
                    })
                })
                    .then((response) => response.json())
                    .then((responseData) => {
                        console.log(responseData);
                    })
                    .catch((err) => {
                        console.log(err)
                    }
                    );
            })
            .catch((err) => {
                console.log(err)
            }
            );

    }

    speak = (text) => {
        // text = this.state.text;
        if (this.state.isEntered == true || this.state.isChange == null || this.state.isChange == true) {
            tts.speak(text);
        }
    }

    retrieve = () => {
        fetch("https://communicator-server.herokuapp.com/signLanguage/retrieve", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                this.setState({ defaultSignLanguage: responseData.defaultSignLanguage })
                console.log(this.state.defaultSignLanguage)
            })
            .catch((err) => {
                console.log(err)
            }
            );
    }

    renderSignLanguage = () => {
        return (
            this.state.defaultSignLanguage.map(buttonInfo => (
                <Block>
                    <Image
                        source={{ uri: buttonInfo.url }}
                        style={{ width: 150, height: 150 }}
                    />
                    <Button
                        style={{ width: 150 }}
                        key={buttonInfo.cd}
                    >
                        {buttonInfo.dscp}
                    </Button>
                </Block>
            )
            )
        )
    }

    componentDidMount() {
        this.retrieve();
    }

    render() {
        return (
            <Block safe flex style={styles.block}>
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 0.9 }}>
                        <Block>
                            <Input type='text' onChangeText={(text) => { this.handleChange(text, 'cd') }}></Input>
                            <Input type='text' onChangeText={(text) => { this.handleChange(text, 'dscp') }}></Input>
                        </Block>
                        <Block row right>
                            <Button style={styles.button} color='info' onPress={() => this.handleChoosePhoto()}>
                                <MaterialIcons name='add' size={20} />
                            </Button>
                            <Button style={styles.button} color='info' onPress={() => this.handleUpload()}>
                                <MaterialIcons name='file-upload' size={20} />
                            </Button>
                        </Block>
                        {/* <Block>
                            <View>
                                {this.renderSignLanguage()}
                            </View>
                        </Block> */}
                    </ScrollView>
                </View>
            </Block>
        )
    }
}

const styles = StyleSheet.create({
    block: {
        padding: 10,
        // backgroundColor: theme.COLORS.BLACK
    },
    button: {
        padding: 10,
        width: (width / 4)
    }
})