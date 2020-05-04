import React from 'react';
import { Text, View, StatusBar, StyleSheet } from 'react-native';
import Container from './src/routes';
import theme from './src/theme';

export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex : 1 }}>
        <StatusBar hidden={false} />
        <Container style={styles.container}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'space-around',
    // paddingTop: theme.SIZES.BASE * 0.3,
    // paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: '#000000'
  }
});