const assert = require('assert')
const calc = require('./calculator.js')

it('test expression', () => {
  assert.equal(calc.calculate('2 * 2 + 2'), 6)
})

it('testing sqrt', () => {
  assert.equal(calc.calculate('2 * 2 + 2 + 2 √ 4'), 8)
})

it('testing sqrt with pow', () => {
  assert.equal(calc.calculate('2 * 2 + 2 + 2 √ 4 ^ 2'), 10)
})

it('testing currenci', () => {
  calc.currencies = { EUR : 1}
  assert.equal(calc.calculate('2 * 2 + 2 + 2 √ 4 ^ 2 + E(10)'), 20)
})

it('test div', () => {
  assert.throws(() => {calc.calculate('1 ÷ 0')} , Error, 'Nie dziel przez 0')
})