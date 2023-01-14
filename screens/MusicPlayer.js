{/* Manually mported libraries: 
  Ionicons -> Vector icons library (see android/app/build.gradle line 308)
  Slider -> Simple slider library
  songs -> Object defined in our model Data.js
  TrackPlayer -> For playing songs in the background (as an async task)
  Flatlist -> Render components with better performance and makes it a horizontal scroll view
*/}
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Image, FlatList, Animated } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import TrackPlayer, { Event, State, useProgress, usePlaybackState, useTrackPlayerEvents } from 'react-native-track-player'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Slider from '@react-native-community/slider'
import songs from "../model/Data"

//TODO Fix artwork size
//TODO Change interface to one that looks like spotify -> Change const names and songs and explain some libraries and other things

{/* Default phone dimensions (Depends on the screen size) */ }
const { width, height } = Dimensions.get("window")

{/* 
  - First method used to setup our TrackPlayer library

  When using await, it MUST be inside of an async function
*/}
const trackPlayerSetUp = async () => {
  try {
    /* The next function has to wait until the TrackPlayer initializes */
    await TrackPlayer.setupPlayer()
    /* Adds our songs data structure to the track player */
    await TrackPlayer.add(songs)
  } catch (e) {
    console.log(e)
  }
}

{/* Get the current track and changes it audio state to playing/stopped */ }
const changePlayBackState = async playBackState => {
  const currentTrack = await TrackPlayer.getCurrentTrack()
  /* If it's not playing an audio... */
  if (currentTrack != null) {
    {/* playBackStates -> Ready/ Playing/ Paused/ Connecting/ ... */ }
    if (playBackState == State.Paused || playBackState == State.Ready) {
      await TrackPlayer.play()
    } else {
      await TrackPlayer.pause()
    }
  }
}

{/* Principal method called when uses <MusicPlayer /> tag, and returns a View 
(Basic React Native CLI structure)*/}
const MusicPlayer = () => {

  {/* 
    - We have to call our trackPlayerSetUp() function to setup the TrackPlayer
    - Used when scrollx value changed, an set our songIndex to the current scrollx reference (pos 1, pos 2...)
  */}
  useEffect(() => {
    trackPlayerSetUp()

    scrollX.addListener(({ value }) => {
      const scrollIndex = Math.round(value / width)
      /* When we scrolls the horizontal slider, whe skips the song also */
      skipTo(scrollIndex)
    })
  }, [])

  {/* Set our playBackState to the default trackplayer state (imported from TrackPlayer library) */ }
  const playBackState = usePlaybackState()

  {/*
    - Initialize a songIndex var, using a state (useState(0))
    - We can update that state with setSongIndex(new index)

    - Use useProgress for working with song times in milliseconds (songProgress.duration -> *NOT WORKING )
  */}
  const [songIndex, setSongIndex] = useState(0)
  const songProgress = useProgress()

  {/* 
      CUSTOM REFERENCES

    - scrollx: Cointains the current reference (position)
    - useRef: React method used for obtaining references from our views.
    - new Animated.Value(0): When you scroll left/right, it will throw back the value (initial = 0)

    - songScroller reference used for next/previous song buttons (Flatlist reference)
  */}
  const scrollX = useRef(new Animated.Value(0)).current
  const songScroller = useRef(null)

  {/* 
    - Change song from the TrackPlayer (useTrackPlayerEvents & Event imported)

    When triggers a TrackChanged Playback event, runs an async function and 
    goes to the next song if it exists (When a song finishes...)
  */}
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {

    if (event.type == Event.PlaybackTrackChanged && event.nextTrack != null) {

      if (event.nextTrack > songIndex) {
        skipToNext()
      }

      setSongIndex(event.nextTrack)

      await TrackPlayer.pause()
      await TrackPlayer.play()
    }
  })

  {/* Skips to a certain track (in positions)*/ }
  const skipTo = async trackId => {
    await TrackPlayer.skip(trackId)
  }

  {/* Method to skip the current song to the next one  */ }
  const skipToNext = () => {
    /* Gets our current flatlist reference and scrolls it to the next songIndex (songIndex -> our reference for each scroll image) */
    songScroller.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    })
  }

  {/* Method to skip the current song to the previous one  */ }
  const skipToPrevious = () => {
    songScroller.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    })
  }

  {/* 
    - Render songs method
    
      Used with FlatList, to render each item (image) in our model Data.js
  */}
  const renderSongImages = ({ item, index }) => {
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
          /* Set the flatlist reference to our custom song slider reference */
          ref={songScroller}
          /* Our custom render method */
          renderItem={renderSongImages}
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
            value={songProgress.position}
            minimumValue={0}
            /* songProgress.duration NOT WORKING, so we have to manually set the song duration in our Object file */
            maximumValue={songs[songIndex].duration}
            thumbTintColor="#FFD369"
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#FFFFFF"
            disabled = {true}

            /* NOT WORKING (value it's correct, but the .seekTo() method it's not updating the song position) */
            /* When whe slides the slider, our TrackPlayer will seek to the new value (go to time...) */
            /*onSlidingComplete={async value => {
              console.log(value)
              await TrackPlayer.seekTo(value)
            }}*/
          />
          {/* 
            - Music progress durations

           */}
          <View style={style.progressLevelDuration}>
            <Text style={style.progressLabelText}>{
              /* Parse from milliseconds to minutes and seconds */
              new Date((songProgress.position) * 1000).toLocaleTimeString().substring(3).split(" ")[0]
            }</Text>
            <Text style={style.progressLabelText}>{
              new Date(songs[songIndex].duration * 1000).toLocaleTimeString().substring(3).split(" ")[0]
            }</Text>
          </View>
        </View>

        {/* 
          - Music controls
            
          TouchableOpacity: Decrease or Increase opacity when press their components.
          Ionicons: Vector icons from Ionicons (all icon name can be found in their website)

        */}
        <View style={style.musicControlsContainer}>
          <TouchableOpacity onPress={() => { skipToPrevious() }}>
            <Ionicons name='play-skip-back-outline' size={35} color="#FFD369" />
          </TouchableOpacity>

          {/* When whe press on the icon, it will call our changePlayBackState method */}
          <TouchableOpacity onPress={() => changePlayBackState(playBackState)}>
            {/* If it's playing, show pause icon, if it's not, show play icon */}
            <Ionicons name={
              playBackState === State.Playing
                ? 'ios-pause-circle'
                : 'ios-play-circle'
            } size={75} color="#FFD369" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { skipToNext() }}>
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