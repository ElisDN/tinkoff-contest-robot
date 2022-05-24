import { Criteria, Schema } from '../robot/criteria'
import { Inputs, Params } from '../robot/node'
import { Data, DateValue, Metric, Result } from '../robot/trading'
import { SMA as TechSMA } from 'technicalindicators'

class SMA implements Criteria {
  getSchema(): Schema {
    return {
      type: 'sma',
      name: 'SMA',
      multiple: false,
      params: [
        {
          type: 'period',
          name: 'Период',
        },
      ],
      inputs: [
        {
          type: 'one',
          name: 'от',
          multiple: true,
        },
      ],
    }
  }

  eval(id: string, data: Data, params: Params, inputs: Inputs): Result {
    const items = inputs.get('one', data)
    const period = params.get('period')

    if (items.value === null) {
      return new Result(null, [...items.metrics])
    }

    if (!Array.isArray(items.value)) {
      return new Result(null, [...items.metrics])
    }

    const begin = new Date(data.date.getTime() - 60000000 * period)

    const values = items.value
      .map((value) => value as DateValue)
      .filter((value) => begin.getTime() <= value.date.getTime() && value.date.getTime() <= data.date.getTime())
      .map((value) => value.value)

    const value = TechSMA.calculate({ values, period }).at(-1) || null

    return new Result(value, [...items.metrics, new Metric(id, 'SMA', value)])
  }
}

export default SMA
