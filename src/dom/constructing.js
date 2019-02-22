/**
 * Very simple api to construct DOM nodes based on VDOM
 * Warning: all dom operations has side effects
 * @module constructing
 */

import {
  isComponent,
  isElement
} from '../vdom/vdom.utils'
import {
  applyAttributes,
  setText
} from './dom.utils'
import {
  throwError,
  shallowClone
} from '../utils'

import patch from './patching'

/**
 * Construct a component, render it and construct its childs based on the passed VNode
 * @param {import('../vdom/dom').Node} vnode
 * @returns {HTMLDOMElement} - return an unattached but constructed DOM node
 */
function constructComponent (vnode) {
  // Not the best solution, I konw we could reuse the function instance
  // but as you are looking for imutability...
  const instance = new vnode.constructor(vnode.attributes)
  instance.state = vnode.state
  const childVNode = instance.render(vnode.attributes, vnode.state)

  instance.__child = construct(childVNode)
  instance.__patch = patch

  return instance.__child
}

/**
 * Construct an element and its childs
 * @param {import('../vdom/dom').Node} parent
 * @param {import('../vdom/dom').Node} vnode
 * @returns {HTMLDOMElement} - return an unattached but constructed DOM node
 */
function constructElement (vnode) {
  const dom = document.createElement(vnode.kind)
  const ret = shallowClone(vnode)
  const {textContent, ...attributes} = ret.attributes

  ret.__child = dom

  applyAttributes(dom, attributes)

  if (textContent) {
    setText(dom, textContent)
    ret.children = []
  } else {
    ret.children = vnode.children.map(
      construct
    )
    ret.children.map(({__child}) => dom.appendChild(__child))
  }
  return ret
}

/**
 * Factory that will create a component or an element and its childs
 * @param {import('../vdom/dom').Node} parent
 * @param {import('../vdom/dom').Node} vnode
 * @returns {HTMLDOMElement} - return an unattached but constructed DOM node
 */
export default function construct (vnode) {
  if (isElement(vnode)) {
    return constructElement(vnode)
  } if (isComponent(vnode)) {
    return constructComponent(vnode)
  } else {
    throwError('not able to construct this vnode')
  }
}
