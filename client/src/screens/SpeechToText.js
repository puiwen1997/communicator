import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableHighlight,
  ScrollView,
  Dimensions
} from 'react-native';
import Voice from '@react-native-community/voice';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { Block, theme } from 'galio-framework';

const { height, width } = Dimensions.get('screen');

export default class SpeechToText extends Component {
  state = {
    onClick: false,
    pitch: '',
    error: '',
    end: '',
    started: '',
    results: [],
    partialResults: [],
    activIndicator: false
  };

  constructor(props) {
    super(props);
    //Setting callbacks for the process status
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
  }

  componentWillUnmount() {
    //destroy the process after switching the screen 
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart = e => {
    //Invoked when .start() is called without error
    console.log('onSpeechStart: ', e);
    this.setState({
      started: '√',
    });
  };

  onSpeechEnd = e => {
    //Invoked when SpeechRecognizer stops recognition
    console.log('onSpeechEnd: ', e);
    this.setState({
      end: '√',
    });
  };

  onSpeechError = e => {
    //Invoked when an error occurs. 
    console.log('onSpeechError: ', e);
    this.setState({
      error: JSON.stringify(e.error),
    });
  };

  onSpeechResults = e => {
    //Invoked when SpeechRecognizer is finished recognizing
    console.log('onSpeechResults: ', e);
    this.setState({
      results: e.value,
    });
  };

  onSpeechPartialResults = e => {
    //Invoked when any results are computed
    console.log('onSpeechPartialResults: ', e);
    this.setState({
      partialResults: e.value,
    });
  };

  onSpeechVolumeChanged = e => {
    //Invoked when pitch that is recognized changed
    console.log('onSpeechVolumeChanged: ', e);
    this.setState({
      pitch: e.value,
    });
  };

  _startRecognizing = async () => {
    //Starts listening for speech for a specific locale
    this.setState({
      activIndicator: true,
      isRecorded: false,
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });

    try {
      await Voice.start('en-US');
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _stopRecognizing = async () => {
    this.setState({
      activIndicator: false
    })
    //Stops listening for speech
    try {
      await Voice.stop();
      this.setState({ isRecorded: true })
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _cancelRecognizing = async () => {
    //Cancels the speech recognition
    try {
      await Voice.cancel();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _destroyRecognizer = async () => {
    //Destroys the current SpeechRecognizer instance
    try {
      await Voice.destroy();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
    this.setState({
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });
  };

  renderResult = async() => {
    try {
      this.state.partialResults.map((result, index) => {
        return (
          <Text
            key={`partial-result-${index}`}
            style={{
              fontSize: 16,
              textAlign: 'center',
              color: '#B0171F',
              marginBottom: 1,
              fontWeight: '700',
            }}>
            {result}
          </Text>
        );
      })

    } catch(error) {
      console.log("Error", error)
      Alert.alert("Error", error)
    }
  }

  render() {
    const { activIndicator } = this.state
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          {activIndicator &&
            (
              <View style={styles.indicator}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )
          }
          <Text muted style={styles.instructions}>
            Press the mic to speak
          </Text>
          <TouchableHighlight
            onPressIn={this._startRecognizing}
            onPress={this._stopRecognizing}
            style={{ marginVertical: 20 }}>
            <FontAwesome
              size={(height - 288) / 6}
              name='microphone'
            />
          </TouchableHighlight>
          <Text style={styles.header}>
            Results
          </Text>
          <ScrollView>
            {this.state.partialResults.map((result, index) => {
              return (
                <Text
                  key={`partial-result-${index}`}
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: '#B0171F',
                    marginBottom: 1,
                    fontWeight: '700',
                  }}>
                  {result}
                </Text>
              )
            })}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  action: {
    width: '100%',
    textAlign: 'center',
    color: 'white',
    paddingVertical: 8,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333333',
    marginBottom: theme.SIZES.BASE,
    marginTop: theme.SIZES.BASE
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
    marginTop: 30,
  },
  indicator: {
    paddingTop: height * 0.3,
    paddingBottom: height * 0.3,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  header: {
    fontSize: 18,
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
    fontWeight: '700',
  }
});