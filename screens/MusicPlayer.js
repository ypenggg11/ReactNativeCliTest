{/* Manually mported libraries: 
  Ionicons -> Vector icons library (see android/app/build.gradle line 308)
  Slider -> Simple slider library
  songs -> Object defined in our model Data.js
*/}
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Image, FlatList, Animated } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Slider from '@react-native-community/slider'
import songs from "../model/Data"

{/* Default phone dimensions (Depends on the screen size) */ }
const { width, height } = Dimensions.get("window")

{/* Principal method called when uses <MusicPlayer /> tag, and returns a View 
(Basic React Native CLI structure)*/}
const MusicPlayer = () => {

  {/*
    - Initialize a songIndex var, using a state (useState(0))
    - We can update that state with setSongIndex(new index)
  */}
  const [songIndex, setSongIndex] = useState(0)

  {/* 
    - scrollx: Cointains the current reference (position)
    - useRef: React method used for obtaining references from our views.
    - new Animated.Value(0): When you scroll left/right, it will throw back the value (initial = 0)

  */}
  const scrollX = useRef(new Animated.Value(0)).current

  {/* 
    - Used when scrollx value changed, an set our songIndex to the current scrollx reference (pos 1, pos 2...)
  */}
  useEffect(() => {
    scrollX.addListener(({ value }) => {

      //console.log(`ScrollX: ${value} | Device width: ${width}`)
      const index = Math.round(value / width)
      setSongIndex(index)
      // console.log(index)
    })
  }, [])

  {/* 
    - Render songs method
    
      Used with FlatList, to render each item (image) in our model Data.js
  */}
  const renderSongs = ({ item, index }) => {
    return (
      <Animated.View style={style.mainImageWrapper}>
        <View style={[style.imageWrapper, style.elevation]}>
          <Image
            source={item.artwork}
            style={style.musicImage}
          />
        </View>
      </Animated.View>
    )
  }

  return (
    <SafeAreaView style={style.container}>
      <View style={style.mainContainer}>
        {/* 
          - Song image
          
          Flatlist: Render components with better performance and makes it a horizontal scroll view
          Animated: When you use a Animated.event, you must use Animated in your parent tag too
        */}
        <Animated.FlatList
          /* Our custom render method */
          renderItem={renderSongs}
          /* Our data file */
          data={songs}
          /* An id from our data file items */
          keyExtractor={item => item.id}
          /* Horizontal scroll properies */
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { x: scrollX },
                }
              }
            ],
            {
              useNativeDriver: true
            }
          )}
        />

        {/* 
          - Song Content
          
            Text: Simple text display
            style property: Can contain more than 1 style using an array

          */}
        <View>
          <Text style={[style.songContent, style.songTitle]}>{songs[songIndex].title}</Text>
          <Text style={[style.songContent, style.songArtist]}>{songs[songIndex].artist}</Text>
        </View>

        {/* 
          - Slider

            Slider: Imported library with custom properties

         */}
        <View>
          <Slider
            style={style.progressBar}
            value={10}
            minimumValue={0}
            maximumValue={100}
            thumbTintColor="#FFD369"
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#FFFFFF"
            onSlidingComplete={() => { }}
          />
          {/* 
            - Music progress durations

           */}
          <View style={style.progressLevelDuration}>
            <Text style={style.progressLabelText}>00:00</Text>
            <Text style={style.progressLabelText}>00:00</Text>
          </View>
        </View>

        {/* 
          - Music controls
            
          TouchableOpacity: Decrease or Increase opacity when press their components.
          Ionicons: Vector icons from Ionicons (all icon name can be found in their website)

        */}
        <View style={style.musicControlsContainer}>
          <TouchableOpacity onPress={() => { }}>
            <Ionicons name='play-skip-back-outline' size={35} color="#FFD369" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { }}>
            <Ionicons name='ios-pause-circle' size={75} color="#FFD369" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { }}>
            <Ionicons name='play-skip-forward-outline' size={35} color="#FFD369" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 
        - Bottom container
      */}
      <View style={style.bottomContainer}>
        <View style={style.bottonIconWrapper}>
          <TouchableOpacity onPress={() => { }}>
            <Ionicons name='heart-outline' size={30} color="#888888" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { }}>
            <Ionicons name='repeat' size={30} color="#888888" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { }}>
            <Ionicons name='share-outline' size={30} color="#888888" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { }}>
            <Ionicons name='ellipsis-horizontal' size={30} color="#888888" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

{/* Genereted by default, typing rnfe (React Native Functional Export Component) */ }
export default MusicPlayer

{/* Stylesheet object with all of our styles used in the application*/ }
const style = StyleSheet.create({
  container: {
    /* Flex : 1 -> Fit all space*/
    flex: 1,
    backgroundColor: "#222831",
  },

  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  mainImageWrapper: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },

  imageWrapper: {
    width: 300,
    height: 340,
    marginBottom: 25,
  },

  musicImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },

  bottomContainer: {
    /* Used our with var, which fits all the width of our screen */
    width: width,
    alignItems: "center",
    paddingVertical: 15,
    borderTopColor: "#393E46",
    borderColor: "#222831",
    borderWidth: 1,
  },

  bottonIconWrapper: {
    /* Display components as a row */
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },

  elevation: {
    /* Elevation with shadow effects */
    elevation: 5,
    shadowColor: "#ccc",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84
  },

  songContent: {
    textAlign: "center",
    color: "#EEEEEE",
  },

  songTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  songArtist: {
    fontSize: 16,
    fontWeight: "300",
  },

  progressBar: {
    width: 350,
    height: 40,
    marginTop: 25,
    flexDirection: "row"
  },

  progressLevelDuration: {
    width: 340,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  progressLabelText: {
    color: "#fff",
    fontWeight: "500",
  },

  musicControlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 15,
  },
})