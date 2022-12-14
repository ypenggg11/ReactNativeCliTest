import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Image, FlatList, Animated } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Slider from '@react-native-community/slider'
import songs from "../model/Data"

const { width, height } = Dimensions.get("window")

const MusicPlayer = () => {

  const[songIndex, setSongIndex] = useState(0)

  const scrollX = useRef(new Animated.Value(0)).current

  useEffect(() => {
    scrollX.addListener(({ value }) => {

      //console.log(`ScrollX: ${value} | Device width: ${width}`)
      const index = Math.round(value / width)
        setSongIndex(index)
      // console.log(index)
    })
  }, [])

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
        {/* image */}
        <Animated.FlatList
          renderItem={renderSongs}
          data={songs}
          keyExtractor={item => item.id}
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

        {/* Song Content */}
        <View>
          <Text style={[style.songContent, style.songTitle]}>{songs[songIndex].title}</Text>
          <Text style={[style.songContent, style.songArtist]}>{songs[songIndex].artist}</Text>
        </View>

        {/* slider */}
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
          {/* music progress durations */}
          <View style={style.progressLevelDuration}>
            <Text style={style.progressLabelText}>00:00</Text>
            <Text style={style.progressLabelText}>00:00</Text>
          </View>

        </View>

        {/* music controls */}
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

      {/* bottom container */}
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

export default MusicPlayer

const style = StyleSheet.create({
  container: {
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
    width: width,
    alignItems: "center",
    paddingVertical: 15,
    borderTopColor: "#393E46",
    borderColor: "#222831",
    borderWidth: 1,
  },

  bottonIconWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },

  elevation: {
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