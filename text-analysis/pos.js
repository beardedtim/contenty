var pos = require('pos');
var words = new pos.Lexer().lex('This is some sample text. This text can contain multiple sentences.');
var tagger = new pos.Tagger();

module.exports = async text => {
  const words = new pos.Lexer().lex(text);
  const tagger = new pos.Tagger();
  const taggedWords = tagger.tag(words);
  const list = []

  for (const tag in taggedWords) {
    list.push(taggedWords[tag])
  }

  return list
}