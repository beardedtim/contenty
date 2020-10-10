const natural = require('natural')
const stemmer = natural.PorterStemmer

module.exports = stemmer.stem.bind(stemmer)