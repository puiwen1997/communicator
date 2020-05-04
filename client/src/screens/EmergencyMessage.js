import React from 'react';
import { Dimensions, KeyboardAvoidingView, View, ScrollView, StyleSheet } from 'react-native';
import { Text, Block, Button, Input } from 'galio-framework';
import theme from '../theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

const { height, width } = Dimensions.get('window');

export default class EmergencyMessage extends React.Component {
    render(){
        return( 
        <Block safe flex style={styles.block}>
            <Header title='Emergency Message'/>
            <View style={{flex: 1}}>
                <Footer/>
            </View>
        </Block>)
    }    
}

const styles = StyleSheet.create({
    block : {
        padding: 10,
        backgroundColor: theme.COLORS.BLACK
    },
})