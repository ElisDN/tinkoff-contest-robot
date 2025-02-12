import { Data } from '../robot/trading'
import PricesClose from './PricesClose'

test('prices-close', () => {
  const criteria = new PricesClose()

  const data = Data.blank()
    .withCandle({ time: new Date(10000000), open: 110, low: 100, high: 120, close: 105, isComplete: true })
    .withCandle({ time: new Date(10100000), open: 105, low: 101, high: 122, close: 111, isComplete: true })
    .withCandle({ time: new Date(10200000), open: 111, low: 103, high: 118, close: 106, isComplete: true })
    .withCandle({ time: new Date(10300000), open: 106, low: 102, high: 119, close: 102, isComplete: false })

  const result = criteria.eval('id-42', data)
  expect(result.value).toEqual([105, 111, 106])
})
