import React from 'react'
import { StyleSheet, View } from 'react-native'
import { theme } from 'galio-framework';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: theme.SIZES.BASE / 2,
  },
  separatorOffset: {
    flex: 2,
    flexDirection: 'row',
  },
  separator: {
    borderColor: '#000000',
    borderWidth: 0.8,
    flex: 8,
    flexDirection: 'row',
  },
})

const Separator = () => (
  <View style={styles.container}>
    <View style={styles.separatorOffset} />
    <View style={styles.separator} />
  </View>
)

export default Separator