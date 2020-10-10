const R = require('ramda')
const textAnalysis = require('../../text-analysis')

const db = require('../../infrastructure/db')
const UseCases = require('../../use-cases')
const Queues = require('../../infrastructure/queues')

const SLUG = 'news-articles'
const isNewsArticle = R.pathEq(['data', 'meta', 'slug'], SLUG)

const articleTextPath = ['data', 'payload', 'data', 'article']

const hasArticleText = R.pathSatisfies(R.complement(R.isNil), articleTextPath)
const getArticleText = R.path(articleTextPath)
const doesNotHaveAnalysis = R.pathSatisfies(R.isNil, [
  'data',
  'payload',
  'data',
  'analysis',
])

const shouldDoAnalysis = R.allPass([
  isNewsArticle,
  hasArticleText,
  doesNotHaveAnalysis,
])

const getItemID = R.path(['data', 'payload', 'id'])

const doAnalysis = async (job) => {
  const item_id = getItemID(job)
  const text = getArticleText(job)
  const positiveness = await textAnalysis.positiveness(text)

  await UseCases.Dynamic.updateById(
    { slug: SLUG, id: item_id },
    { analysis: { positiveness } },
    db,
    Queues.events
  )

  return true
}

const genericFallback = () => {}

const handler = R.cond([
  [shouldDoAnalysis, doAnalysis],
  [R.T, genericFallback],
])

module.exports = async (job) => await handler(job)
