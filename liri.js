require("dotenv").config()
var keys = require('./keys.js')
var Twitter = require("twitter")
var Spotify = require("node-spotify-api")

var spotify = new Spotify(keys.spotify)
var client = new Twitter(keys.twitter)

var command = process.argv[2]

switch (command) {
    case 'my-tweets':
        client.get("statuses/home_timeline", { count: 5 }, function (err, tweets, response) {
            if (err) { console.log(err) }
            console.log(tweets) // The favorites. 
            console.log(response)  // Raw response object. 
        })
        break
    case 'spotify-this-song':
        spotify.search({ type: 'track', query: process.argv[3] }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err)
            }
            console.log(data.tracks.items[0].name) // song name
            console.log(data.tracks.items[0].album.name) // album name
            console.log(data.tracks.items[0].external_urls.spotify) // link to song
            console.log(data.tracks.items[0].album.artists[0].name) // artist
        })
        break
}