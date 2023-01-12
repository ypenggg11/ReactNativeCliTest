{/* 
    Array object which contains each of our song object
    WE MUST USE THE SAME OBJECT STRUCTURE DEFINED IN THE TRACK PLAYER LIBRARY

    SONG NAMES MUST NOT COINTAIN SPACES BETWEEN WORDS!!
 */}
const songs = [
    {
        url: require("../assets/audio/aloneInARoom.mp3"),
        id: 1,
        title: "Alone In A Room",
        artist: "Asking Alexandria",
        /* Use 'require(path)' to access system files */
        artwork: require('../assets/img/img1.jpg'),
    },
    {
        url: require("../assets/audio/devilDoesntBargin.mp3"),
        id: 2,
        title: "Devil Doesn't Bargain",
        artist: "Alec Benjamin",
        artwork: require('../assets/img/img2.jpg'),
    },
    {
        url: require("../assets/audio/firestarter.mp3"),
        id: 3,
        title: "Firestarter",
        artist: "SUMR, Siamese",
        artwork: require('../assets/img/img3.jpg')
    },
    {
        url: require("../assets/audio/fractions.mp3"),
        id: 4,
        title: "Fractions",
        artist: "Juniper Vale",
        artwork: require('../assets/img/img4.jpg')
    },
    {
        url: require("../assets/audio/neroUmbasa.mp3"),
        id: 5,
        title: "NERO",
        artist: "UMBASA",
        artwork: require('../assets/img/img5.jpg')
    }
]

export default songs