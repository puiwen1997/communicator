import React from 'react';
import { Modal, Image, Dimensions, KeyboardAvoidingView, View, ScrollView, StyleSheet } from 'react-native';
import { Text, Block, Button, Input } from 'galio-framework';
import theme from '../theme';
import Header from '../components/Header';
import Footer from '../components/Footer';
// import ImagePicker from 'react-native-image-picker';
import tts from 'react-native-tts';

const { height, width } = Dimensions.get('window');

export default class SignLanguageLibrary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            defaultSignLanguage: [],
            isChange: null,
            isEntered: false,
            buttonsListArr : []
        };
        // this.handleChoosePhoto = this
        //     .handleChoosePhoto
        //     .bind(this);
        // this.handleUpload = this.handleUpload.bind(this);
    }

    // handleChange = (text, field) => {
    //     const state = this.state
    //     state[field] = text;
    //     this.setState(state);
    //     // console.log(state);
    // }
    
    // handleChoosePhoto = async () => {
    //     const options = {
    //         // title: 'Select Photo',
    //         // customButtons: [
    //         //     { name: 'gallery', title: 'Choose Photo from Gallery' },
    //         //     { name: 'camera', title: 'Take photo' }
    //         // ]
    //         noData: true,
    //     };
    //     ImagePicker.showImagePicker(options, response => {
    //         if (response.uri) {
    //             console.log('Response = ', response);
    //             this.setState({ 
    //                 photo: response 
    //             })
    //         } else if (response.didCancel) {
    //             console.log('User cancelled image picker');
    //         }else if (response.error) {
    //             console.log('ImagePicker Error: ', response.error);
    //         }else if (response.customButton) {
    //             console.log('User tapped custom button: ', response.customButton);
    //         }else {
    //             console.log('User selected a file form camera or gallery', response); 
    //         }
    //     })
    // }

    //     /*Upload multiple files*/
    // // createFormData = (photo, body) => {
    // //     const data = new FormData()
    // //     data.append('photo', {
    // //       name: photo.fileName,
    // //       type: photo.type,
    // //       uri:
    // //         Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
    // //     })
    // //     Object.keys(body).forEach(key => {
    // //       data.append(key, body[key])
    // //     })
    // //     return data;
    // //   }

    // createFormData = (photo) => {
    //     const data = new FormData()
    //     data.append('photo', {
    //       name: photo.fileName,
    //       type: photo.type,
    //       uri:
    //         Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
    //         code: this.state.code,
    //         description: this.state.description
    //     })
    //     return data;
    // }

    // handleUpload = async () => {
    //     const config = {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'multipart/form-data',
    //         },
    //         body: this.createFormData(this.state.photo, {userId: '123'})
    //     };
    //     fetch("http://localhost:5000/upload", config)
    //     .then((response) => response.json())
    //     .then((responseData) => {
    //         console.log(responseData);
    //         this.setState ({
    //             returnPhoto: responseData.data.url
    //         })
            
    //         fetch("http://localhost:5000/signLanguageSave", {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 "cd" : this.state.cd,
    //                 "dscp": this.state.dscp,
    //                 "url": this.state.returnPhoto,
    //                 "username": "admin"
    //             })
    //         })
    //         .then((response) => response.json())
    //         .then((responseData) => {
    //             console.log(responseData); 
    //         })
    //         .catch((err)=>{
    //             console.log(err)}
    //         );    
    //     })
    //     .catch((err)=>{
    //         console.log(err)}
    //     );        
    
    // }
    speak = (text) => {
        // text = this.state.text;
        if (this.state.isEntered == true || this.state.isChange == null || this.state.isChange == true) {
            tts.speak(text);
        }
    }

    retrieve = () => {
        fetch("http://localhost:5000/signLanguageRetrieve", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then((response) => response.json())
        .then((responseData) => {
            console.log(responseData); 
            this.setState({defaultSignLanguage:responseData.defaultSignLanguage})
            console.log(this.state.defaultSignLanguage)
        })
        .catch((err)=>{
            console.log(err)}
        );    
    }

    renderSignLanguage = () => {
        return(
            this.state.buttonsListArr = this.state.defaultSignLanguage.map(buttonInfo => (
                <Block>
                    <Image 
                        source={{uri:buttonInfo.url}}
                        style={{ width: 150, height: 150 }}
                    />
                    <Button key={buttonInfo.cd}>
                        {buttonInfo.dscp}
                    </Button>
                </Block>
            )
            )
        )
    }

    deleteSignLanguage(){

    }

    componentDidMount() {
        this.retrieve();
    }

    render(){
        // const { photo } = this.state;
        return( 
        <Block safe flex style={styles.block}>
            <Header title='Sign Language Library'/>
            <View style={{flex: 1}}>
                <View style={{flex: 0.9}}>
                <Block>
                    <View>
                    {this.renderSignLanguage()}
                    </View>
                </Block>
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