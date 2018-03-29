require("dotenv").config()
var keys = require('./keys.js')
var Twitter = require("twitter")
var Spotify = require("node-spotify-api")
var request = require("request")
var fs = require("fs")

var spotify = new Spotify(keys.spotify)
var client = new Twitter(keys.twitter)

var command = process.argv[2]
var arg
if (process.argv[3]) {arg = process.argv[3]}

executeCommand(command, arg)

function executeCommand(command, arg) {
    switch (command) {
        case 'my-tweets':
            getTwitterData()
            break
        case 'spotify-this-song':
            getSpotifyData(arg)
            break
        case 'movie-this':
            getOMBDData(arg)
            break
        case 'do-what-it-says':
            doWhatItSays()
            break
        default:
            console.log('invalid command.')
    }
}

function getTwitterData() {
    client.get("statuses/home_timeline", function (err, tweets, response) {
        if (err) {
            console.log(err)
        } else {
            console.log('---------------------------------------------------------------------------')
            console.log('-------------------------------MY TWEETS-----------------------------------')
            console.log('---------------------------------------------------------------------------')
            for (tweet in tweets) {
                console.log(tweets[tweet].text)
                console.log(tweets[tweet].created_at)
                console.log('---------------------------------------------------------------------------')
            }
        }
    })
}

function getSpotifyData(song) {
    spotify.search({
        type: 'track',
        query: song
    }, function (err, data) {
        if (err) {
            console.log('Error occurred: song "' + song + '" not found.')
            getSpotifyData("the sign ace")
        } else {
            console.log('---------------------------------------------------------------------------')
            console.log('-------------------------------SPOTIFY-------------------------------------')
            console.log('---------------------------------------------------------------------------')
            console.log("  Song | " + data.tracks.items[0].name) // song name
            console.log("Artist | " + data.tracks.items[0].album.artists[0].name) // artist
            console.log(" Album | " + data.tracks.items[0].album.name) // album name
            console.log("  Link | " + data.tracks.items[0].external_urls.spotify) // link to song
            console.log('---------------------------------------------------------------------------')
        }
    })
}

function getOMBDData(movie) {
    request({
        url: 'http://www.omdbapi.com/',
        qs: { apikey: keys.omdb.apikey, t: movie }
    }, function (err, data, body) {
        response = JSON.parse(body)
        if (response.Error) {
            console.log('---------------------------------------------------------------------------')
            console.log('Error occurred: movie "' + movie + '" not found.')
            getOMBDData('Mr. Nobody')
        } else {
            console.log('---------------------------------------------------------------------------')
            console.log('---------------------------------OMDB--------------------------------------')
            console.log('---------------------------------------------------------------------------')
            console.log("                Title | " + response.Title)
            console.log("                 Year | " + response.Year)
            console.log("          IMDb Rating | " + response.Ratings[0].Value)
            console.log("Rotten Tomatoes Score | " + response.Ratings[1].Value)
            console.log("              Country | " + response.Country)
            console.log("             Language | " + response.Language)
            console.log("                 Plot | " + response.Plot)
            console.log("               Actors | " + response.Actors)
            console.log('---------------------------------------------------------------------------')
        }
    })
}

function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) throw err
        var commandArr = data.split(',')
        executeCommand(commandArr[0], commandArr[1])
    })
}