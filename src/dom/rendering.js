/**
 * Render VDOM to DOM Implementation
 * @module rendering
 */

import {
  throwError
} from '../utils'
import {
  isDOMElement
} from './dom.utils'
import construct from './constructing'

/**
 * Render the given VNode or Compoment instance on the dom
 * @param {import('../vnode/node').Node} vnode
 * @param {HTMLElement} node
 */
export function render (vnode, node) {
  !isDOMElement(node) && throwError('node must be a valid DOM Element')
  const constructed = construct(vnode)
  node.appendChild(constructed.__child)
}
