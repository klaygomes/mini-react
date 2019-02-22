/**
 * Patching and Diffing
 * Warning: all dom operations has side effects
 * @module patching
 */

import {
  shallowCompare,
  shallowClone,
  throwError
} from '../utils'
import {
  isElement,
  diff
} from '../vdom/vdom.utils'
import {
  findDOMElementComponent,
  applyAttributes,
  setText
} from './dom.utils'

import unmount from './unmounting'
import construct from './constructing'

/**
 * Unmount, construct and replace previous vnode with the new one
 * @param {import('../vdom/dom').Node} previousVNode
 * @param {import('../vdom/dom').Node} nextVNode
 */
function replaceVNode (previousVNode, nextVNode) {
  const el = findDOMElementComponent(previousVNode)
  const newVNode = construct(nextVNode)
  /* DOM side effect */
  el.parentNode.replaceChild(newVNode.__child, el)
  unmount(previousVNode)
  return newVNode
}

/**
 * It will update DOM Element related to this previousVNode with the nextVNode
 * @param {import('../vdom/dom').Node} previousVNode
 * @param {import('../vdom/dom').Node} nextVNode
 * @returns {import('../vdom/dom').Node} - returns a patched vnode
 */
function patchElement (previousVNode, nextVNode) {
  if (previousVNode.kind !== nextVNode.kind) {
    return replaceVNode(previousVNode, nextVNode)
  } else {
    const ret = shallowClone(nextVNode)
    const {textContent: previousTextContent} = previousVNode.attributes
    const {textContent: nextTextContent, ...attributes} = diff(previousVNode, nextVNode)

    ret.__child = previousVNode.__child

    if (!shallowCompare(previousVNode.attributes, nextVNode.attributes)) {
      /* DOM side effect */
      applyAttributes(ret.__child, attributes)
    }

    if (!previousTextContent && nextTextContent) {
      previousVNode.children.map(
        unmount
      )
      ret.children = []
      /* DOM side effect */
      setText(ret.__child, nextTextContent)
    } else if (previousTextContent && !nextTextContent) {
      /* DOM side effect */
      ret.__child.innerHTML = ''
      ret.children = nextVNode.children.map(construct)
      /* DOM side effect */
      ret.children.map(({__child}) => ret.__child.appendChild(__child))
    } else if (nextTextContent) {
      /* DOM side effect */
      setText(ret.__child, nextTextContent)
    } else if (nextVNode.children.length === previousVNode.children.length) {
      ret.children = previousVNode.children.map(
        (previousChildVNode, i) => patch(previousChildVNode, nextVNode.children[i])
      )
    } else {
      /* DOM side effect */
      ret.__child.innerHTML = ''
      ret.children = nextVNode.children.map(construct)
      /* DOM side effect */
      ret.children.map(({__child}) => ret.__child.appendChild(__child))
    }
    return ret
  }
}

/**
 * It will update DOM Element related to this previousVNode with the nextVNode
 * @param {import('../vdom/dom').Node} previousVNode
 * @param {import('../vdom/dom').Node} nextVNode
 * @returns {import('../vdom/dom').Node} - returns a patched vnode
 */
export default function patch (previousVNode, nextVNode) {
  /* istanbul ignore else */
  if (isElement(previousVNode)) {
    return patchElement(previousVNode, nextVNode)
  } else {
    throwError('not able to patch this object')
  }
}
