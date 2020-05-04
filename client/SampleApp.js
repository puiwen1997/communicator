// import logo from './logo.svg';
// import './App.css';
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Block, Button } from 'galio-framework';

export default class App extends React.Component {
state = {
    data: null,
    text: '',
    url: ''
  };

  componentDidMount() {
      // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));
  }
    // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('http:/10.0.2.2:5000/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  // getResponse = () => {
  //   fetch('http://10.0.2.2:5000/playTTS')
  //   .then(response => 
  //     response.json()
  //   )
  //   .then(json => {
  //     this.setState({
  //       url: json.getUrl,
  //     })
  //   })
  //   .catch(function(error) {
  //     console.log('There has been a problem with your fetch operation: ' + error.message);
  //      // ADD THIS THROW error
  //       throw error;
  //   });
  // }

  getResponse = () => {
    fetch('http://10.0.2.2:5000/say')
    .catch(function(error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
      // ADD THIS THROW error
      throw error;
    });
  }
  
  render() {
    return (
      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <h1 className="App-title">Welcome to React</h1>
      //   </header>
      //   // Render the newly fetched data inside of this.state.data 
      //   <p className="App-intro">{this.state.data}</p>
      // </div>
      // Render the newly fetched data inside of this.state.data
      <View>
        <Text>Welcome to React</Text>
        <Text>{this.state.data}</Text>
        <Button onPress={() => this.getResponse() }>
        </Button>
        <Text>
          {this.state.url}
        </Text>
      </View>
    );
  }
}