import React from 'react';
import { View, TouchableHighlight, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { theme, Text, Block, Button } from 'galio-framework';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const { height, width } = Dimensions.get('screen');

export default class Main extends React.Component {
  renderMenu = () => {
    const { title, navigation } = this.props;
    return (
      <Block flex>
        <Block row flex>
          <TouchableHighlight onPress={() => navigation.navigate('TTS')}>
            <Block middle style={styles.block}>
              <MaterialIcons
                size={(height - 288) / 6}
                name='g-translate'
              />
              <Text>Text to Speech</Text>
            </Block>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => navigation.navigate('STT')}>
            <Block middle style={styles.block}>
              <MaterialIcons
                size={(height - 288) / 6}
                name='mic'
              />
              <Text>Speech to Text</Text>
            </Block>
          </TouchableHighlight>
        </Block>

        <Block row flex>
          <TouchableHighlight onPress={() => navigation.navigate('SignLanguage')}>
            <Block middle style={styles.block}>
              <FontAwesome
                size={(height - 288) / 6}
                name='american-sign-language-interpreting'
              />
              <Text>Sign Language</Text>
            </Block>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => navigation.navigate('Profile')}>
            <Block middle style={styles.block}>
              <AntDesign
                size={(height - 288) / 6}
                name='profile'
              />
              <Text>Profile</Text>
            </Block>
          </TouchableHighlight>
        </Block>

        {/* <Block>
          <TouchableHighlight onPress={() => navigation.navigate('Settings')}>
            <Block margin={theme.SIZES.BASE} right>
              <FontAwesome
                size={(height - 288) / 12}
                name='info-circle'
              />
            </Block>
          </TouchableHighlight>
        </Block> */}

        <Block flex right>
          <Button
            color="pink"
            onlyIcon
            large
            style={styles.favouriteButton}
            icon="favorite"
            iconFamily="MaterialIcons"
            iconSize={theme.SIZES.BASE * 1.2}
            onPress={() => {
              navigation.navigate('FavouriteText')
            }}>
            Go to favourite
            </Button>
            <Text style={styles.favouriteButton} color="#000000" size={9} muted>Go to favourite</Text>
        </Block>
      </Block>
    )
  }

  render() {
    const { navigation } = this.props;
    return (
      <Block card flex style={styles.mainBlock}>
        <ScrollView
          showsVerticalScrollIndicator={false}>
          {this.renderMenu()}
        </ScrollView>
      </Block>
    );
  }

}

const styles = StyleSheet.create({
  mainBlock: {
    padding: theme.SIZES.BASE,
    paddingBottom: theme.SIZES.BASE,
    paddingVertical: theme.SIZES.BASE
  },
  block: {
    width: (width - 96) / 2,
    height: (height - 336) / 2,
    margin: theme.SIZES.BASE,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#b3ccff",
    shadowColor: theme.COLORS.WHITE
  },
  button: {
    width: (width - 96) / 2,
    height: (height - 288) / 2,
    margin: theme.SIZES.BASE
  },
  home: {
    width: width,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
    zIndex: 2,
  },
  tabs: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.50,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '300'
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  products: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
  },
  product: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
  },
  productTitle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingBottom: 6,
  },
  productDescription: {
    padding: theme.SIZES.BASE / 2,
  },
  imageContainer: {
    elevation: 1,
  },
  image: {
    borderRadius: 3,
    marginHorizontal: theme.SIZES.BASE / 2,
    marginTop: -16,
  },
  horizontalImage: {
    height: 122,
    width: 'auto',
  },
  fullImage: {
    height: 215,
    width: width - theme.SIZES.BASE * 3,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  favouriteButton: {
    width: (width - 64) / 5,
    // padding: theme.SIZES.BASE,
    marginTop: 10,
    marginRight: theme.SIZES.BASE
},
})