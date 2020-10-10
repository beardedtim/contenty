const R = require('ramda')
const fetch = require('node-fetch')
const cheerio = require('cheerio')

const db = require('../../infrastructure/db')
const UseCases = require('../../use-cases')
const Queues = require('../../infrastructure/queues')

const SLUG = 'news-articles'

const isNewsArticle = R.pathEq(['data', 'meta', 'slug'], SLUG)
const getData = R.path(['data'])
const getItemID = R.path(['data', 'payload', 'id'])

const getNewsArticle = async (job) => {
  const data = getData(job)
  const url = R.path(['payload', 'data', 'url'], data)
  const text = await fetch(url).then((x) => x.text())
  const $ = cheerio.load(text)

  return $.text()
}

const handleNewsArticle = async (job) => {
  const article = await getNewsArticle(job)
  const item_id = getItemID(job)

  await UseCases.Dynamic.updateById(
    { id: item_id, slug: SLUG },
    { article },
    db,
    Queues.events
  )
}

const genericFallback = (job) => {
  console.log('Create Job handled')
  console.dir(job)
  return true
}

const handler = R.cond([
  [isNewsArticle, handleNewsArticle],
  [R.T, genericFallback],
])

module.exports = async (job) => await handler(job)
