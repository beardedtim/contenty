const R = require('ramda')

const sentiment = require('./sentiment')
const pos = require('./pos')


/**
 * Given a string, returns how positive the language
 * is
 *
 * @param {string} text The corpus to look at
 */
module.exports.positiveness = async text => {
  const set = sentiment(text)

  return set
}


const starts_with = str => full_str => full_str.indexOf(str) === 0

module.exports.objectiveness = async text => {
  const words = await pos(text)

  const is_noun = starts_with('NN')
  const is_adjective = starts_with('JJ')

  const nouns = words.filter(([_, part]) => is_noun(part))
  const adjectives = words.filter(([_, part]) => is_adjective(part))

  if (adjectives.length === 0) {
    return 1
  }

  if (nouns.length === 0) {
    return 0
  }

  return adjectives.length / nouns.length
}