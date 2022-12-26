{/* Array object which contains each of our song object */}
const songs = [
    {
        id: 1,
        title: "19th Floor",
        artist: "Bobby Richards",
        /* Use 'require(path)' to access system files */
        artwork: require("../assets/img/img1.jpg"),
        url: require("../assets/audio/assets_audio_19th Floor - Bobby Richards.mp3")
    },
    {
        id: 2,
        title: "Awful",
        artist: "Josh pan",
        artwork: require("../assets/img/img2.jpg"),
        url: require("../assets/audio/Awful - josh pan.mp3")
    },
    {
        id: 3,
        title: "Something is Going On",
        artist: "Godmode",
        artwork: require("../assets/img/img3.jpg"),
        url: require("../assets/audio/assets_audio_Something is Going On - Godmode.mp3")
    },
    {
        id: 4,
        title: "Book The Rental Wit It",
        artist: "RAGE",
        artwork: require("../assets/img/img4.jpg"),
        url: require("../assets/audio/Book The Rental Wit It - RAGE.mp3")
    },
    {
        id: 5,
        title: "Crimson Fly",
        artist: "Huma-Huma",
        artwork: require("../assets/img/img5.jpg"),
        url: require("../assets/audio/Crimson Fly - Huma-Huma.mp3")
    }
]

export default songs