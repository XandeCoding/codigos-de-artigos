import Meter from './meter'

const requestCounter = Meter.createCounter('requests', {
  description: 'Counter with requests'
})

export {
  requestCounter
}
