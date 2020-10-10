const Sentiment = require('sentiment')
const sentiment = new Sentiment()

module.exports = sentiment.analyze.bind(sentiment)