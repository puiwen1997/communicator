import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Icon, Text, Block, Button } from 'galio-framework';
import theme from '../theme';
import Header from '../components/Header';
import Footer from '../components/Footer';
// import Icon from 'react-native-vector-icons/FontAwesome';

export default class Home extends React.Component {
    renderMenu = () => {
        const { navigation } = this.props;
        return (
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
            <Block row center space="between">
                <Block flex middle left>
                    <Button 
                        round 
                        onlyIcon 
                        shadowless        
                        icon="mic" 
                        iconFamily="MaterialIcons" 
                        iconColor="#fff" 
                        iconSize={theme.SIZES.BASE * 5} 
                        style={styles.menuButton}
                        onPress={() => {
                            navigation.navigate("TextToSpeechAndroidDevice");
                        }}
                    />
                </Block> 
                <Block flex middle right>
                    <Button 
                        round 
                        onlyIcon 
                        shadowless 
                        icon="g-translate" 
                        iconFamily="MaterialIcons" 
                        iconSize={theme.SIZES.BASE * 5}
                        iconColor="#fff" 
                        style={styles.menuButton}
                    />
                </Block> 
            </Block>
            <Block row center space="between">
                <Block flex middle left>
                    <Button 
                        round 
                        onlyIcon 
                        shadowless 
                        icon ="call" 
                        iconFamily="MaterialIcons" 
                        iconSize={theme.SIZES.BASE * 5} 
                        iconColor="#fff"
                        style={styles.menuButton}
                    />
                </Block> 
                <Block flex middle right>
                    <Button 
                        round 
                        onlyIcon 
                        shadowless        
                        icon="call" 
                        iconFamily="MaterialIcons" 
                        iconColor="#fff" 
                        iconSize={theme.SIZES.BASE * 5} 
                        style={styles.menuButton}
                        onPress={() => {
                            navigation.navigate("Login");
                        }}
                    />
                </Block> 
            </Block>
            <Block row center space="between">
                <Block flex middle right>
                    <Button 
                        round 
                        onlyIcon 
                        shadowless 
                        icon="help" 
                        iconFamily="Entypo" 
                        iconSize={theme.SIZES.BASE * 1.5} 
                        iconColor="#fff" 
                        style={styles.helpButton}
                    />
                </Block>
            </Block>
        </Block>      
        )
    }

    render() {
        return (
            <Block safe flex style={styles.block}>
                <Header title='Home'/>
                <View style={{flex: 1}}>
                    <View style={{flex: 0.9}}>
                        <ScrollView
                        showsVerticalScrollIndicator={false}>
                        {this.renderMenu()}
                        </ScrollView>
                    </View>
                    <Footer/>
                </View>
            </Block>
        );
    }

}

const styles = StyleSheet.create({
    block : {
        padding: 10,
        backgroundColor: theme.COLORS.BLACK
    },
    menuButton : {
        margin: 20,
        width: 150,
        height: 150
    },
    helpButton : {
        margin: 30,
        width: 50,
        height: 50
    }
})