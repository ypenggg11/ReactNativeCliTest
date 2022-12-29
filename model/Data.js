{/* 
    Array object which contains each of our song object
    WE MUST USE THE SAME OBJECT STRUCTURE DEFINED IN THE TRACK PLAYER LIBRARY

    SONG NAMES MUST NOT COINTAIN SPACES BETWEEN WORDS!!
 */}
const songs = [
    {
        url: require("../assets/audio/19thFloor-BobbyRichards.mp3"),
        id: 1,
        title: "19th Floor",
        artist: "Bobby Richards",
        /* Use 'require(path)' to access system files */
        artwork: require("../assets/img/img1.jpg"),
    },
    {
        url: require("../assets/audio/Awful-joshpan.mp3"),
        id: 2,
        title: "Awful",
        artist: "Josh pan",
        artwork: require("../assets/img/img2.jpg"),
    },
    {
        url: require("../assets/audio/SomethingisGoingOn-Godmode.mp3"),
        id: 3,
        title: "Something is Going On",
        artist: "Godmode",
        artwork: require("../assets/img/img3.jpg")
    },
    {
        url: require("../assets/audio/BookTheRentalWitIt-RAGE.mp3"),
        id: 4,
        title: "Book The Rental Wit It",
        artist: "RAGE",
        artwork: require("../assets/img/img4.jpg")
    },
    {
        url: require("../assets/audio/CrimsonFly-Huma-Huma.mp3"),
        id: 5,
        title: "Crimson Fly",
        artist: "Huma-Huma",
        artwork: require("../assets/img/img5.jpg")
    }
]

export default songs