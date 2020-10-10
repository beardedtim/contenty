module.exports.createEvent = ({ name, action, handler }) => ({
  name,
  action: (...args) => ({
    type: name,
    ...action(...args),
  }),
  handler,
})
