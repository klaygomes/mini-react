/**
 * Helper functions used to manipulate the dom
 * Warning: all dom operations has side effects
 * @module dom.utils
 */

import {
  isEmpty
} from '../utils'
import {
  NODE_ATTR_PROPERTY
} from '../constants'

/**
 * Remove the given HTMLElement (only if attached to the DOM)
 * @param {HTMLElement} node
 */
export function removeNode (node) {
  node.parentNode && node.parentNode.removeChild(node)
}
/**
 * It will find the DOM element of a given constructed VDOM
 * @param {import('../vdom/node').Node} vnode
 */
export const findDOMElementComponent = (vnode) => vnode.__child ? findDOMElementComponent(vnode.__child) : vnode

/**
 * Returns true if given object is a valid DOM
 */

export const isDOMElement = (obj) => obj instanceof HTMLElement

/**
 * It will apply the attributes on the given DOM Element
 * @param {HTMLElement} dom
 * @param {object} attributes - a object where each key will be the attribute and value its value
 */
export function applyAttributes (dom, attributes) {
  Object.entries(attributes).forEach(
    ([attr, value]) => setAttribute(dom, attr, value)
  )
}

/**
 * Set or Remove attribute in a given DOM element based on the presence of value
 * @param {HTMLElement} dom
 * @param {*} name - attribute name
 * @param {*} [value] - attribute value
 */
export function setAttribute (dom, name, value) {
  !dom[NODE_ATTR_PROPERTY] && (dom[NODE_ATTR_PROPERTY] = {})
  if (name[0] === 'o' && name[1] === 'n') {
    const eventName = name.substring(2).toLowerCase()
    if (!dom[NODE_ATTR_PROPERTY][eventName]) {
      dom.addEventListener(eventName, onEvent)
    } else if (!value) {
      dom.removeEventListener(eventName, onEvent)
    }
    dom[NODE_ATTR_PROPERTY][eventName] = value
  } else {
    if (isEmpty(value)) {
      dom.removeAttribute(name)
    } else if (name === 'value') {
      dom.value = value
    } else {
      dom.setAttribute(name, value)
    }
  }
}

/**
 * Set text content on a given element
 * @param {HTMLElement} dom
 * @param {string} value
 */
export function setText (dom, value) {
  dom.innerHTML = ''
  dom.appendChild(document.createTextNode(value))
}

/**
 * Internal helper function used as proxy to the event listeners
 * @param {*} ev
 */
function onEvent (ev) {
  this[NODE_ATTR_PROPERTY][ev.type](ev)
}
