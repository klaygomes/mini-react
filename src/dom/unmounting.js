/**
 * Functions related to unmount DOM elements
 * @module unmounting
 */

import {
  isElement
} from '../vdom/vdom.utils'
import {
  throwError
} from '../utils'
import {
  removeNode
} from './dom.utils'

/**
 * Unmount the given vnode element
 * @param {import('../vnode/node').Node} vnode
 */
function unmountElement (vnode) {
  vnode.children.map(unmount)
  vnode.__child && removeNode(vnode.__child)
  vnode.__child = null
}

/**
 * Unmount the given vnode
 * @param {import('../vnode/node').Node} vnode
 */
export default function unmount (vnode) {
  /* istanbul ignore else */
  if (isElement(vnode)) {
    unmountElement(vnode)
  } else {
    throwError('not able to unmount this vnode')
  }
}
