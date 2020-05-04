import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';

import { Text } from 'galio-framework';

const screenWidth = Dimensions.get('window').width;

export default class Footer extends React.Component {
    render() {
        return (
            <View style={styles.footer}>
                <Text style= {styles.text}>Copyright @2020</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        flex: 0.1,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        height: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 12
    }
  });