import React from 'react';
import { TouchableHighlight, Modal, Image, Dimensions, KeyboardAvoidingView, View, ScrollView, StyleSheet } from 'react-native';
import { theme, Text, Block, Button, Input } from 'galio-framework';
import ImagePicker from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import tts from 'react-native-tts';
import { InputAutoSuggest } from 'react-native-autocomplete-search';

const { height, width } = Dimensions.get('window');

export default class SignLanguage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            dscp: '',
            defaultSignLanguage: [],
            isChange: null,
            isEntered: false,
            buttonsListArr: []
        };
    }

    handleChange = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
    }

    handleChoosePhoto = async () => {
        const options = {
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
            this.state.buttonsListArr = this.state.defaultSignLanguage.map(buttonInfo => (
                <Block key={buttonInfo.id} style={{ padding: 10 }}>
                    <Image
                        source={{ uri: buttonInfo.url }}
                        style={{ width: (width / 2) - 40, height: 150 }}
                    />
                    <Button
                        style={{ width: (width / 2) - 40 }}
                        // key={buttonInfo.cd}
                        onPress={() => {this.speak(buttonInfo.description)}}
                    >
                        {buttonInfo.description}
                    </Button>
                </Block>
            ))
        )
    }

    componentDidMount() {
        this.retrieve();
    }

    render() {
        const { navigation } = this.props;
        return (
            <Block safe flex style={styles.block}>
                <KeyboardAvoidingView>
                    {/* <InputAutoSuggest
                        staticData={[
                            { id: '1', name: 'Paris' },
                            { id: '2', name: 'Pattanduru' },
                            { id: '3', name: 'Para' },
                            { id: '4', name: 'London' },
                            { id: '5', name: 'New York' },
                            { id: '6', name: 'Berlin' }]}
                    /> */}
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Block>
                            <Input onChangeText={(text) => this.handleChange(text, 'dscp')}>
                            </Input>
                        </Block>
                        <Block right>
                            <TouchableHighlight style={styles.addButton} onPress={() => navigation.navigate('AddSignLanguage')}>
                                <MaterialIcons name='add-circle' size={30} />
                            </TouchableHighlight>
                        </Block>
                        <Block row>
                            <View style={{
                                flexWrap: 'wrap',
                                flexDirection: 'row',
                                alignContent: 'space-between',
                            }}>
                                {this.renderSignLanguage()}
                            </View>
                        </Block>

                    </ScrollView>
                </KeyboardAvoidingView>
            </Block>
        )
    }
}

const styles = StyleSheet.create({
    block: {
        padding: 10,
        paddingBottom: theme.SIZES.BASE
    },
    button: {
        padding: 10,
        width: (width / 4)
    }
})