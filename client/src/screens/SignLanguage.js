import React from 'react';
import { TextInput, Modal, Image, Dimensions, View, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { theme, Text, Block, Button, Input } from 'galio-framework';
// import ImagePicker from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import tts from 'react-native-tts';
import { InputAutoSuggest } from 'react-native-autocomplete-search';
import FirebaseAuthService from '../services/FirebaseAuthService'
import { firebase } from '../config/FirebaseConfig';
import { data } from 'react-native-connectycube';
import { Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/MaterialIcons'

const { height, width } = Dimensions.get('window');

export default class SignLanguage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            defaultSignLanguage: [],
            subsetSignLanguage: [],
            searchSignLanguage: [],
            gifs: [],
            pagination: 1,
            isSearch: false,
            isLoading: true,
            isClear: false,
            activIndicator: false,
        };
    }

    // fetchGifs = async () => {
    //     try {
    //         const API_KEY = 'p5G2iUK38iwlof3EATWBEmNdiptSJOlN';
    //         const q = '@signWithRobert';
    //         // Offset default is 0, maximum return object is 25, hence the offset have to add 25 to get object in the next page
    //         const resJson = await fetch(`http://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${q}&offset=0`);
    //         const res = await resJson.json();
    //         console.log("Res: ", res)
    //         console.log("Res data: ", res.data)
    //         this.setState({
    //             gifs: res.data
    //         })
    //     } catch (error) {
    //         console.log("Error: ", error)
    //     }
    // }

    // saveSignLanguage = async () => {
    //     await this.fetchGifs();
    //     const signLanguage = this.state.gifs;
    //     signLanguage.map(elem => {
    //         var title = elem.title;
    //         title = title.replace(/ by Sign with Robert/gi, "")
    //         title = title.replace(/sign language /gi, "")
    //         title = title.replace(/asl/gi, "")
    //         title = title.replace(/ GIF/gi, "")
    //         title = title.replace(/GIF/gi, "")
    //         if (title != "") {
    //             title = title.toLowerCase();
    //             try {
    //                 FirebaseAuthService.saveSignLanguage(elem.id, elem.images.original.url, title)
    //             } catch (error) {
    //                 console.log("Error: ", error)
    //             }
    //         }
    //     })
    // }

    handleChange = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
    }


    speak = (text) => {
        if (this.state.isEntered == true || this.state.isChange == null || this.state.isChange == true) {
            tts.speak(text);
        }
    }

    getSignLanguage = () => {
        this.setState({ activIndicator: true })
        console.log("Getting sign language....");
        var signLanguage = [];

        firebase.database().ref("signLanguage").orderByChild("cd").once('value').then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                var cd = childSnapshot.val().cd;
                var url = childSnapshot.val().url;
                signLanguage.push({
                    cd: cd,
                    url: url
                });
            });
            this.setState({ activIndicator: false, defaultSignLanguage: signLanguage });
        })
        console.log("Get: ", this.state.defaultSignLanguage)
    }

    searchSignLanguage = (text) => {

        console.log("Text", text);
        this.setState({ activIndicator: true, searchSignLanguage: [] })
        try {
            if (text != '') {

                var signLanguage = []
                firebase.database().ref("signLanguage").orderByChild("cd").startAt(text).endAt(text + "\uf8ff").on('value', (snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        var cd = childSnapshot.val().cd;
                        var url = childSnapshot.val().url;
                        signLanguage.push({
                            cd: cd,
                            url: url
                        });
                        this.setState({ searchSignLanguage: signLanguage })
                    });
                })

                this.setState({ isSearch: true });

            } else {
                Alert.alert("Please enter some keyword!");
            }
            this.setState({ activIndicator: false })
        } catch (error) {
            Alert.alert("Error", error);
        }

    }

    renderSearchResult = () => {
        const result = this.state.searchSignLanguage;
        console.log("Result:", result)

        try {
            if (result.length > 0) {
                return (
                    result.map(element => (
                        <Block style={{ padding: 10 }}>
                            <TouchableOpacity onPress={() => {
                                Alert.alert(`Description\n`, element.cd)
                                this.speak(element.cd)
                            }}>
                                <Image
                                    source={{ uri: element.url }}
                                    style={{ width: (width * 0.7), height: 150 }}
                                />
                            </TouchableOpacity>
                        </Block>
                    ))
                )


            } else {
                return (
                    <Block style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                        <Text style={{ fontSize: theme.SIZES.BASE }}> No such sign language found! </Text>
                    </Block>
                )
            }

        } catch (error) {
            Alert.alert("Error:", error)
        }
    }

    renderSignLanguage = (pagination) => {

        // console.log("Default sign language: ", this.state.defaultSignLanguage);
        try {


            if (pagination > 0 && pagination < 160) {
                var defaultStartIndex = 0;
                var defaultEndIndex = 10;
                defaultEndIndex = defaultEndIndex * pagination;
                defaultStartIndex = defaultEndIndex - 10;
                console.log("Start: ", defaultStartIndex, "End: ", defaultEndIndex);
                var subset = this.state.defaultSignLanguage.slice(defaultStartIndex, defaultEndIndex);
                // this.setState({subsetSignLanguage: subset})
                // console.log("Subset: ", this.state.subsetSignLanguage);
                console.log("Subset: ", subset);

                return (
                    subset.map(buttonInfo => (
                        <Block style={{ padding: 10 }}>
                            <TouchableOpacity onPress={() => { this.speak(buttonInfo.cd) }}>
                                <Image
                                    source={{ uri: buttonInfo.url }}
                                    style={{ width: (width * 0.7), height: 150 }}
                                />
                            </TouchableOpacity>
                        </Block>
                    ))
                )
            }

            else if (pagination == null) {
                this.setState({ activIndicator: true })
            }

        } catch (error) {
            Alert.alert("Error: ", error)
        }

    }

    renderPagination() {
        const defaultSignLanguage = this.state.defaultSignLanguage;
        if (defaultSignLanguage.length > 0) {
            return (
                <Block row>
                    <Input
                        style={styles.paginationInput}
                        bgColor="null"
                        placeholder="Turn to pages?"
                        color={theme.COLORS.BLACK}
                        placeholderTextColor="#000000"
                        value={this.state.pagination}
                        onChangeText={(pagination) => this.handleChange(pagination, 'pagination')}
                    >
                    </Input>
                </Block>
            )
        }
    }

    clearText() {
        this.setState({
            text: '',
            isSearch: false
        })
    }

    componentDidMount() {
        // this.saveSignLanguage();
        this.getSignLanguage();
    }

    render() {
        const { navigation } = this.props;
        const { activIndicator } = this.state;

        return (
            <Block safe flex style={styles.block}>
                <View>
                    {activIndicator &&
                        (
                            <View style={styles.indicator}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        )
                    }
                </View>
                <Block middle>
                    <Text style={{ color: "#FF0000", fontSize: 10 }}>
                        Please search the sign language using small letter.
                    </Text>
                </Block>
                <Block row>
                    <Input
                        color={theme.COLORS.BLACK}
                        placeholderTextColor="#000000"
                        rounded
                        placeholder="Search sign language... "
                        style={styles.input}
                        value={this.state.text}
                        onChangeText={(text) => this.handleChange(text, 'text')}
                    >
                    </Input>
                    {this.state.isSearch == false ?
                        (<TouchableOpacity style={styles.icon} onPress={() => this.searchSignLanguage(this.state.text)}>
                            <Icon name="search" size={32} color="#000000" />
                        </TouchableOpacity>) :
                        (<TouchableOpacity style={styles.icon} onPress={() => this.clearText()}>
                            <Icon name="cancel" size={32} color="#000000" />
                        </TouchableOpacity>)
                    }
                </Block>
                <Block>
                    {this.state.isSearch == false ?
                        (<KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                            <Block style={styles.renderPagination}>
                                <View>
                                    {this.renderPagination()}
                                </View>
                            </Block>
                            <Block style={styles.renderBlock}>
                                <View>
                                    {this.renderSignLanguage(this.state.pagination)}
                                </View>
                            </Block>
                        </KeyboardAwareScrollView>
                        ) :
                        (<KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                            <Block row style={styles.renderBlock}>
                                <View>
                                    {this.renderSearchResult()}
                                </View>
                            </Block>
                        </KeyboardAwareScrollView>)}

                </Block>
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
    },
    input: {
        width: width * 0.8,
        marginLeft: theme.SIZES.BASE,
    },
    paginationInput: {
        width: width * 0.5,
        height: height * 0.07,
    },
    renderBlock: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: theme.SIZES.BASE,
        marginRight: theme.SIZES.BASE,
        marginBottom: theme.SIZES.BASE * 3
    },
    renderPagination: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginTop: 13,
        marginRight: theme.SIZES.BASE,
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
})