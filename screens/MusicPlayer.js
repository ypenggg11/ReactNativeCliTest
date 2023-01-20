{/* Manually imported libraries: 
  Ionicons -> Vector icons library (see android/app/build.gradle line 308)
  Slider -> Simple slider library
  songs -> Object defined in our model directory Songs.js
  TrackPlayer -> For playing songs in the background (as an async task)
  Flatlist -> Render components with better performance and makes it a horizontal scroll view
*/}
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Image, FlatList, Animated } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import TrackPlayer, { Event, State, useProgress, usePlaybackState, useTrackPlayerEvents } from 'react-native-track-player'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Slider from '@react-native-community/slider'
import songs from "../model/Songs"

// FUNCIONA
// TODO Change style names, clean code, and explain some libraries.

{/* Default phone dimensions (Depends on the screen size) */ }
const { width, height } = Dimensions.get("window")

{/* 
  - First method used to setup our TrackPlayer library

  When using await, it MUST be inside of an async function
*/}
const trackPlayerSetUp = async () => {
  try {
    /* Set up our TrackPlayer (initializes it) */
    await TrackPlayer.setupPlayer()
    /* Adds our songs data structure to the track player */
    await TrackPlayer.add(songs)
  } catch (e) {
    console.log(e)
  }
}

{/* Play our Pause the current song when called */ }
const changePlayBackState = async playBackState => {
  const currentTrack = await TrackPlayer.getCurrentTrack()

  /* If it's playing an audio... */
  if (currentTrack != null) {
    {/* playBackStates -> Ready/ Playing/ Paused/ Connecting/ ... */ }
    if (playBackState == State.Paused || playBackState == State.Ready) {
      await TrackPlayer.play()
    } else {
      await TrackPlayer.pause()
    }
  }
}

{/* Principal method called when uses <MusicPlayer /> tag, and returns a View (Basic React Native CLI structure)*/}
const MusicPlayer = () => {

  {/* 
    - Imported method from 'react'
    
    Performs side effects in our components, it will be executed at some point
    depending on our lifecycle (it's a lifecycle method)
  */}
  useEffect(() => {
    trackPlayerSetUp()

    /* When we scrolls the horizontal slider (scrollx value changes), we also skips the song */
    scrollX.addListener(({ value }) => {
      /* Recover the precise value (index 1,2,3...) */
      const scrollIndex = Math.round(value / width)
      
      skipTo(scrollIndex)
    })
  }, [])

  {/* 
    - Imported from TrackPlayer library
    
    Set our playBackState to the default trackplayer state,
    represents the current song state.
  */ }
  const playBackState = usePlaybackState()

  {/*
    - Initialize a 'songIndex' and 'like' state
    - We can update that state with their setters (setLike('new value'))

    We use useState() imported from 'react', and it can be any value from any data type.
    State -> Like a mutable value, if the value changes, all of the references 
    of this value will update to the new value.
  */}
  const [songIndex, setSongIndex] = useState(0)
  const [like, setLike] = useState(false)

  {/* 
    - useProgress() imported from TrackPlayer library

    Song progress times in milliseconds (songProgress.duration -> *NOT WORKING) 
  */}
  const songProgress = useProgress()

  {/* 
    CUSTOM REFERENCES

    - scrollx: Contains the current reference (position)
    - useRef: React method used for obtaining references from our views.
    - new Animated.Value(0): When you scroll left/right, it will throw back the value (initial = 0)

    - songScroller reference used for next/previous song buttons (Flatlist reference)
  */}
  const scrollX = useRef(new Animated.Value(0)).current
  const songScroller = useRef(null)

  {/* 
    - Change song from the TrackPlayer (useTrackPlayerEvents & Event imported)

    When triggers a TrackChanged Playback event, runs an async function and 
    goes to the next song if it exists
  */}
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {

    /* If the next song exists  */
    if (event.type == Event.PlaybackTrackChanged && event.nextTrack != null) {

      /* Some index checks (fix position bugs) */
      if (event.nextTrack > songIndex) {
        skipToNext()
      }

      /* Update our songIndex state  */
      setSongIndex(event.nextTrack)

      /* Pausing and playing (fix some sound bugs) */
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
    /* Gets our current flatlist reference and scrolls it to the next songIndex (the next song artwork pos) */
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

  {/* Toggle like button changing the 'like' state */}
  const changeLike = () => {
    setLike(!like)
  }

  {/* 
    - Render songs method
    
    Used with FlatList, to render each item (image) in our Songs.js
  */}
  const renderSongImages = ({ item, index }) => {
    return (
      <Animated.View style={style.mainImageWrapper}>
        <View style={style.imageWrapper}>
          <Image
            source={item.artwork}
            style={style.musicImage}
          />
        </View>
      </Animated.View>
    )
  }

  /* View components */
  return (
    <SafeAreaView style={style.container}>

      {/* Playing round button */}
      <View style={style.roundButtonContainer}>
        <TouchableOpacity
          onPress={() => { }}
          style={style.roundButton}>
          <Text style={style.textButton}>Playing</Text>
        </TouchableOpacity>
      </View>

      {/* Song artwork rendering */}
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
          /* An id from our Songs.js file items */
          keyExtractor={item => item.id}
          /* Horizontal scroll properties */
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
      </View>

      {/* Displays every view inside in a row */}
      <View style={style.songInfoRowContainer}>
        
        {/* Some song content and controls (displayed as our first column) */}
        <View style={style.songInfoContainer}>

          {/* 
            - Song Content
          
            Style property: Can contain more than 1 style using an array
            Auto update the title and artist text when songIndex state changes
          */}
          <View>
            <Text style={[style.songContent, style.songTitle]}>{songs[songIndex].title}</Text>
            <Text style={[style.songContent, style.songArtist]}>{songs[songIndex].artist}</Text>
          </View>

          {/* 
            - Music controls
            
            TouchableOpacity: Decrease or Increase opacity when press their components.
            Ionicons: Vector icons from Ionicons (all icon name can be found in their website)
          */}
          <View style={style.musicControlsContainer}>

            {/* When whe press on the icon, it will call our changePlayBackState method */}
            <TouchableOpacity onPress={() => changePlayBackState(playBackState)}>

              {/* If it's playing, show pause icon, if it's not, show play icon */}
              <Ionicons name={
                playBackState == State.Playing
                  ? 'ios-pause-circle'
                  : 'ios-play-circle'
              } size={55} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { skipToPrevious() }}>
              <Ionicons name='play-skip-back-circle' size={55} color="#8D8D8D" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { skipToNext() }}>
              <Ionicons name='play-skip-forward-circle' size={55} color="#8D8D8D" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Side icons container (displayed as our second column) */}
        <View>
          <View style={style.sideIconContainer}>
            <TouchableOpacity onPress={() => { }}>
              <Ionicons name='ellipsis-vertical' size={26} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { }}>
              <Ionicons name='share-social-outline' size={26} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Toggle like icon button */}
            <TouchableOpacity onPress={() => { changeLike() }}>
              <Ionicons name={
                like == true
                  ? 'heart'
                  : 'heart-outline'
              } size={26} color={
                like == true
                  ? "#1ED760"
                  : "#FFFFFF"
              } />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 
        - Slider

        Slider: Imported library with custom properties
      */}
      <View style={style.songInfoContainer}>
        <Slider
          style={style.progressBar}
          value={songProgress.position}
          minimumValue={0}
          /* songProgress.duration NOT WORKING, so we have to manually set the song duration in our Object file */
          maximumValue={songs[songIndex].duration}
          thumbTintColor="#FFFFFF"
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#FFFFFF"
          disabled={true}
        /* NOT WORKING (value it's correct, but the .seekTo() method it's not updating the song position)
        When whe slides the slider, our TrackPlayer will seek to the new value (go to time...)
        onSlidingComplete={async value => {
        console.log(value)
        await TrackPlayer.seekTo(value)
        }}
        */
        />

        {/* - Music progress durations */}
        <View style={style.progressDuration}>
          <Text style={style.progressLabelText}>{
            /* Parse from milliseconds to minutes and seconds */
            new Date((songProgress.position) * 1000).toLocaleTimeString().substring(3).split(" ")[0]
          }</Text>
          <Text style={style.progressLabelText}>{
            new Date(songs[songIndex].duration * 1000).toLocaleTimeString().substring(3).split(" ")[0]
          }</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

{/* Genereted by default, typing rnfe (React Native Functional Export Component) */ }
export default MusicPlayer

{/* Stylesheet object with all of our styles used in the application */}
const style = StyleSheet.create({
  container: {
    /* Flex : 1 -> Fit all space */
    flex: 1,
    backgroundColor: "black",
  },

  mainContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  roundButtonContainer: {
    paddingStart: 35,
    paddingTop: 40,
    alignItems: "flex-start",
  },

  roundButton: {
    width: 110,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    borderRadius: 20,
    backgroundColor: 'white',
  },

  textButton: {
    fontSize: 22,
    fontWeight: "600",
    color: 'black',
  },

  mainImageWrapper: {
    width: width,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },

  imageWrapper: {
    width: 300,
    height: 340,
  },

  musicImage: {
    width: "100%",
    height: "100%",
  },

  songInfoContainer: {
    paddingStart: 30,
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },

  sideIconContainer: {
    /* Display components as a column */
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: 120,
  },

  songInfoRowContainer: {
    flexDirection: "row",
    width: "100%"
  },

  songContent: {
    paddingStart: 20,
    textAlign: "left",
    color: "#EEEEEE",
  },

  songTitle: {
    fontSize: 20,
    fontWeight: "600",
  },

  songArtist: {
    fontSize: 16,
    fontWeight: "300",
  },

  progressBar: {
    width: width - 60,
    height: 40,
    marginTop: 10,
    flexDirection: "row",
  },

  progressDuration: {
    width: width - 72,
    paddingStart: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  progressLabelText: {
    color: "#fff",
    fontSize: 17,
  },

  musicControlsContainer: {
    paddingStart: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "70%",
    marginTop: 15,
  },
})