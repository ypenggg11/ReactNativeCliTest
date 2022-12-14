import { View, StatusBar, StyleSheet} from 'react-native'
import React from 'react'
import MusicPlayer from './screens/MusicPlayer'

const App = () => {
  return (
    //Use view when you need to use a division
    <View style = {style.container}>
      <StatusBar barStyle={'light-content'} />
      <MusicPlayer />
    </View>
  )
}

export default App

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
})