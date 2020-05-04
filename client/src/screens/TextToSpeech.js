import React from 'react';
import { Dimensions, KeyboardAvoidingView, View, ScrollView, StyleSheet } from 'react-native';
import { Text, Block, Button, Input } from 'galio-framework';
import theme from '../theme';
import Header from '../components/Header';
import Footer from '../components/Footer';
import tts from 'react-native-tts';

const { height, width } = Dimensions.get('window');

export default class TextToSpeech extends React.Component {
    constructor() {
        super();
        this.state = {
            text: '',
            defaultText: [],
            isChange: null,
            isEntered: false,
            buttonsListArr : []
        };
    }

    handleChange = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
        this.setState({isEntered: true})
    }

    speak = (text) => {
        // text = this.state.text;
        if (this.state.isEntered == true || this.state.isChange == null || this.state.isChange == true) {
            tts.speak(text);
        }
    }

    convert = async () => {
        console.log("Text: " + this.state.text)
        fetch('http://127:5000/say', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "text" : this.state.text
            })
        })
        .catch(function(error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
          // ADD THIS THROW error
          throw error;
        });
    }

    save = async () => {
        console.log("Text: " + this.state.text)
        fetch('http://localhost:5000/export', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
       
              },
            body: JSON.stringify({
                "text" : this.state.text
            })
        }).then((response) => response.json())
        .then((responseData) => {
        //   console.log(responseData);
          this.setState({defaultText:responseData.defaultText});
          this.setState({isChange: true});
          console.log(this.state);  
        })
        .catch(function(error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
          // ADD THIS THROW error
          throw error;
        });
    }

    componentDidMount() {
        if (this.state.isChange == null || this.state.isChange == true ) {
            fetch('http://localhost:5000/retrieve',{
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json())
            .then((responseData) => {
            // console.log(responseData);
            this.setState({defaultText:responseData.defaultText});
            console.log(this.state.defaultText);            
            })
            .catch(error => console.warn(error));
        }
    }

    renderDefaultText = () => {
        return(
            this.state.buttonsListArr = this.state.defaultText.map(buttonInfo => (
                <Button 
                key={buttonInfo.text}
                onPress={() => this.speak(buttonInfo.text) }>
                    {buttonInfo.text}
                </Button>
            ))
        )
    }
    // renderDefaultText = () => {
    //     console.log(this.state.defaultText.length);
    //     for(var i=0;i<this.state.defaultText.length;i++) {
    //         console.log(this.state.defaultText[0].text);
    //         console.log(this.state.defaultText[1].text);
    //         console.log(this.state.defaultText[2].text);
    //         // var text = this.state.defaultText[i].text;
    //         <Button>{this.state.defaultText[i].text}</Button>
    //         return(
    //             component+=component
    //         )
    //     }
    // }

    render(){
        return( 
        <Block safe flex style={styles.block}>
            <Header title='Text To Speech'/>
            
                <KeyboardAvoidingView style={{flex: 1}}  behavior="height" enabled>
                    <View style={{flex: 0.9}}>
                    <Block>
                        <ScrollView>
                        <Input 
                        label='Text'
                        placeholder='Please enter the text you would like to translate.'
                        style={styles.input}
                        onChangeText={(text) => this.handleChange(text, 'text')}
                        />
                        </ScrollView>
                        <Block>
                        <Button 
                            style={styles.button}
                            onPress={() => this.speak(this.state.text) }>
                            Convert
                        </Button>
                        <Button 
                            style={styles.button}
                            onPress={() => this.save() }>Save</Button>
                        </Block>
                        <Block>
                        <ScrollView>
                        {this.renderDefaultText()}
                        </ScrollView>
                        </Block>
                    </Block>
                    </View>
                <Footer/>
            </KeyboardAvoidingView>
            
        </Block>
        )
    }
}

const styles = StyleSheet.create({
    block: {
        margin: 10,
        backgroundColor: theme.COLORS.WHITE
    },
    input: {
        height: height * 0.2
    },
    button: {
        margin:10
    }
})