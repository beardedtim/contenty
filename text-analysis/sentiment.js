const R = require('ramda')
const { SentimentAnalyzer, PorterStemmer, WordTokenizer } = require('natural')
const tokenizer = new WordTokenizer()

const patternSentiment = new SentimentAnalyzer("English", PorterStemmer, "pattern")
const afinnSentiment = new SentimentAnalyzer("English", PorterStemmer, "afinn")
const senticonSentiment = new SentimentAnalyzer("English", PorterStemmer, "senticon")

const getSentiment = tokens => {
  const pattern = patternSentiment.getSentiment(tokens)
  const afinn = afinnSentiment.getSentiment(tokens)
  const senticon = senticonSentiment.getSentiment(tokens)

  return (pattern + afinn + senticon) / 3
}

module.exports = R.compose(
  getSentiment,
  tokenizer.tokenize.bind(tokenizer)
)