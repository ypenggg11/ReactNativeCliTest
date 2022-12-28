{/* File required for TrackPlayer (code copied from the library documentation) */}
import TrackPlayer from "react-native-track-player"

module.exports = async function() {

    TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play())

    TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause())

    TrackPlayer.addEventListener('remote-stop', () => TrackPlayer.destroy())
    
}