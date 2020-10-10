const natural = require('natural')
const tokenizer = natural.PorterStemmer

module.exports = tokenizer.tokenizeAndStem.bind(tokenizer)
