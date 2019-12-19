const SerialPort = require('serialport')
const Twitter = require('twitter')
const moment = require('moment')
const config = require('./config.js')
const T = new Twitter({
  consumer_key: 'dE8Kh1UC6wgnAs6oKhOaR7ugQ',
  consumer_secret: 'QOym6lfG9b39GigjLMr8b72F354o8zMKdHFWnBm1fL2hZOIDjd',
  access_token_key: '195991271-Ch4Hh0OZ1Nfbo6PXMMUewl2lROmd6nX3QBqbniia',
  access_token_secret: 'vIbTJCeFTb3Vol9xk9rgCDUJipeZffRzhYkkG5Zm6Zrca'
})

const port = new SerialPort('/dev/cu.usbmodem1441401', { baudRate: 9600 })
const twitterDateFormat = 'dd MMM DD HH:mm:ss ZZ YYYY'
const ourDateFormat = 'MM/DD/YYYY hh:mm A'
let lastTweet
// Search parameters
const params = {
  q: 'from:realDonaldTrump',
  count: 1,
  result_type: 'lastTweet',
  lang: 'en'
}

// Read the port data
port.on("open", () => {
  console.log('serial port open');
})

getLatestTweet = () => {
    // Get request to find tweets
    T.get('search/tweets', params, function(err, data, response) {
      if (!err) {
          const tweets = JSON.parse(response.body)
          // console.log(tweets);
          for (let tweet of tweets['statuses']) {
            const date = moment(tweet['created_at'], twitterDateFormat, 'en').format(ourDateFormat)
            const newTweet = `${date} - ${tweet['text']}`
            if (newTweet != lastTweet) {
                console.log(newTweet)
                // insert code to display the tweet on Arduino here
                sendToArduino(newTweet)
                lastTweet = newTweet
            } else {
                sendToArduino(lastTweet)
                // console.log(moment().format(ourDateFormat), '- No new tweets')
                console.log(lastTweet)
            }
            
          }
      } else {
        console.log(err)
      }
    })
    setTimeout(getLatestTweet, 5000)
}

sendToArduino = (data) => {
  // Sending String character by character
    // for(let i=0; i < data.length; i++){
        // port.write(new Buffer(data[i], 'ascii'), function(err, results) {
           port.write(data + '\n');
           console.log("sent")
            // console.log('Error: ' + err);
            // console.log('Results ' + results);
        // });
    // }

    // Sending the terminate character
    // port.write(new Buffer('\n', 'ascii'), function(err, results) {
        // console.log('err ' + err);
        // console.log('results ' + results);
    // });  
}



getLatestTweet()
console.log(lastTweet)

