/**
 * Very simple Virtual DOM Implementation
 * @module node
 */

import { isValidObject, isBoolean, isNull, isEmpty, throwError } from '../utils'
import { COMPONENT_KIND } from '../constants'

/**
 * A Virtual DOM Node
 */
export class Node {
  /**
   *
   * @param {(string|Function)} kind - If an string it will be a simple element otherwise a Component
   * @param {object} attributes - Attributes of the given node
   * @param {Array[(string | object | Node)]} children - Any valid Virtual DOM Node
   */
  constructor (kind, attributes = {}, ...children) {
    this.kind = kind
    this.attributes = attributes
    this.children = children
  }
}

/**
 * Based on a basic blueprint creates an complete Virtual DOM Tree
 * @param {any} blueprint
 */
export default function factory (blueprint) {
  if (isValidObject(blueprint)) {
    const { tagName, children = [], ...attributes } = blueprint
    isEmpty(tagName) && throwError('tagName is required and must be valid string')
    return new Node(
      tagName,
      attributes,
      ...children.map(
        factory
      )
    )
  } else if (typeof blueprint === 'string') {
    let textContent = blueprint
    return new Node('span', { textContent })
  } else if (blueprint.kind === COMPONENT_KIND) {
    return blueprint
  } else if (blueprint && blueprint.hasOwnProperty('kind') && blueprint.hasOwnProperty('attributes') && blueprint.hasOwnProperty('children')) {
    return blueprint
  } else {
    throwError('not a valid blueprint')
  }
}
