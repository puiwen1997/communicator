import React from 'react';
import { Image, Dimensions, KeyboardAvoidingView, View, ScrollView, StyleSheet } from 'react-native';
import { Text, Block, Button, Input } from 'galio-framework';
import theme from '../theme';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ImagePicker from 'react-native-image-picker';

const { height, width } = Dimensions.get('window');

export default class Administrator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photo: null,
            cd: '',
            dscp: '',
            returnPhoto: null
        }
        this.handleChoosePhoto = this
            .handleChoosePhoto
            .bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }

    handleChange = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
        // console.log(state);
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
            }else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }else {
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
            body: this.createFormData(this.state.photo, {userId: '123'})
        };
        fetch("http://localhost:5000/upload", config)
        .then((response) => response.json())
        .then((responseData) => {
            console.log(responseData);
            this.setState ({
                returnPhoto: responseData.data.url
            })
            
            fetch("http://localhost:5000/signLanguageSave", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "cd" : this.state.cd,
                    "dscp": this.state.dscp,
                    "url": this.state.returnPhoto,
                    "username": "admin"
                })
            })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData); 
            })
            .catch((err)=>{
                console.log(err)}
            );    
        })
        .catch((err)=>{
            console.log(err)}
        );        
    
    }

    // save = async() => {
    //     fetch("http://localhost:5000/signLanguageSave", {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             "cd" : this.state.cd,
    //             "dscp": this.state.dscp,
    //             "url": this.state.returnPhoto,
    //             "username": "admin"
    //         })
    //     })
    //     .then((response) => response.json())
    //     .then((responseData) => {
    //         console.log(responseData); 
    //     })
    //     .catch((err)=>{
    //         console.log(err)}
    //     );      
    // }

    render(){
        const { photo } = this.state;
        return( 
        <Block safe flex style={styles.block}>
            <Header title='Administrator'/>
            <View style={{flex: 1}}>
                <Button onPress={this.handleChoosePhoto}>Choose Photo</Button>
                
                {/* <View>
                {photo && (
                <Image
                    source={{ uri: photo.uri }}
                    style={{ width: 300, height: 300 }}
                />
                )}
                </View> */}
                <Input 
                placeholder="Code"
                onChangeText={(text) => this.handleChange(text, 'cd')}
                />
                <Input 
                placeholder="Description"
                onChangeText={(text) => this.handleChange(text, 'dscp')}
                />
                <Button onPress={this.handleUpload}>Upload</Button>
                <View>
                <Image
                    source={{ uri: this.state.returnPhoto }}
                    style={{ width: 300, height: 300 }}
                />
                </View>
                <Footer/>
            </View>
        </Block>
        )
    }    
}

const styles = StyleSheet.create({
    block : {
        padding: 10,
        backgroundColor: theme.COLORS.BLACK
    },
})