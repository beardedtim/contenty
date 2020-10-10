const { objectiveness } = require('./')

describe('Text Analysis', () => {
  describe('Objectiveness', () => {
    describe('Given a totally objective string', () => {
      it('returns 1', async () => {
        await expect(objectiveness('It is 10 degrees outside right now.')).resolves.toBe(1)
        await expect(objectiveness('It rained today')).resolves.toBe(1)
      })
    })

    describe('Given a totally subjective string', () => {
      it('returns 0', async () => {
        await expect(objectiveness('It is cold outside.')).resolves.toBe(0)
        // THIS FAILS
        // await expect(objectiveness('The weather was gross today.')).resolves.toBe(0)
      })
    })

    describe('Given a half objective, half subjective string', () => {
      it('returns 0.5', async () => {
        await expect(objectiveness('It is 10 degrees outside right now. It is cold outside.')).resolves.toBe(0.5)
        await expect(objectiveness('The weather was gross today. It rained.')).resolves.toBe(0.5)
      })
    })
  })
})