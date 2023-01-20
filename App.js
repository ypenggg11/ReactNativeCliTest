import { View, StatusBar, StyleSheet} from 'react-native'
import React from 'react'
import MusicPlayer from './screens/MusicPlayer'

{/* Basic React Native CLI structure generated typing rnfe (React Native Functional Export Component) */}
const App = () => {
  return (
    //Use view when you need to use a division (lika a 'div' in html)
    <View style = {style.container}>
      <StatusBar barStyle={'light-content'} />
      {/* Our MusicPlayer screen (MusicPlayer.js) */}
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