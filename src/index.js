/**
 * Here is where we expose our API to the world
 */
import { render } from './dom/rendering'
export { Component } from './component'
export { default as node } from './vdom/node'

export const MiniReact = {
  render
}
