/**
 * Basic class for use with Components
 * @module component
 */
import {
  isFunction,
  shallowClone,
  mergeObjects,
  throwError
} from './utils'

import { COMPONENT_KIND } from './constants'

/**
 * Blueprint of a VNode Component
 */
export class Component {
  constructor (props, state) {
    this.props = shallowClone(props)
    this.state = shallowClone(state)
    Object.defineProperty(this, 'kind', {
      value: COMPONENT_KIND,
      enumerable: true,
      writable: false
    })
  }
  setState (func) {
    !isFunction(func) && throwError('state must be a function!')
    const previousState = shallowClone(this.state)
    const props = shallowClone(this.props)
    this.state = mergeObjects(this.state, func(previousState, props))
    this.__child = this.__patch(this.__child, this.render(props, this.state))
  }
  render () { throwError('no render function was defined') }
  __patch () { throwError('this component was not correctly construted. Did you forget to call pass inside render?') }
}

export default Component
