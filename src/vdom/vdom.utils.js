/**
 * Virtual DOM function utilities
 * @module vdom.utils
 */
import { COMPONENT_KIND } from '../constants'

/**
 * Returns true if the given object is a valid Component VNode
 * @param {Object} obj - any valid object that has a kind property
 * @param {*} obj.kind -  a kind definition
 */
export const isComponent = (obj) => (obj && obj.kind === COMPONENT_KIND)
/**
 * Returns true if the given object is a valid Element VNode
 * @param {Object} obj - any valid object that has a kind property
 * @param {*} obj.kind -  a kind definition
 */
export const isElement = (obj) => (obj && obj.kind) && !isComponent(obj)

/**
 * Returns an object based on the diff of two VNode attributes
 * it will return value as undefined for removed keys
 * @param {*} previousVNode
 * @param {*} nextVNode
 */
export const diff = (previousVNode, nextVNode) => Object.keys(previousVNode.attributes).reduce(
  (acc, attr) => ({[attr]: undefined, ...acc}),
  nextVNode.attributes
)
