/**
 * General utility classes
 * @module utils
 * */
'use strict'
/**
 * Returns true if the given parameter is a function
 * @param {*} f
 */
export const isFunction = f => typeof f === 'function'
/**
 * Shallows clone the given object
 * returns an empty object if obj is not an object
 * @param {*} obj
 */
export const shallowClone = (obj) => ({ ...obj })
/**
 * Returns true if the given parameter is null
 * @param {*} o
 */
export const isNull = o => o === null
/**
 * Returns true if the given parameter is a boolean
 * @param {*} o
 */
export const isBoolean = o => typeof o === 'boolean'
/**
 * Returns true only if the given parameter is a literal object or a wrapped one
 * @param {*} o
 */
export const isValidObject = (o) => !isNull(o) && typeof o === 'object' && o.constructor === Object
/**
 * Throws an error if the given message
 * @param {string} message
 */
export const throwError = message => {
  throw new Error(`Mini React: ${message}`)
}
/**
 * Returns true if the given parameter is null, undefined or an empty string
 * @param {*} str
 */
export const isEmpty = str => isNull(str) || str === void 0 || (str.constructor === String && str.length === 0)
/**
 * Makes a deeply last win merge between two or more objects without mutating them.
 * @param {object} target
 * @param {object} origin
 * @param {...object} [otherOrigins]
 *
 * @returns {object} a new merged object
 */
export function mergeObjects () {
  const ret = {}
  Array.from(arguments).forEach(
    (argument, i) => {
      !isValidObject(argument) && throwError(`${i}º paramter must be a valid object`)
      Object.entries(argument).forEach(
        ([key, value]) => {
          if (isValidObject(value)) {
            ret[key] = mergeObjects(ret[key] || {}, value)
          } else if (Array.isArray(value)) {
            ret[key] = [...value]
          } else {
            ret[key] = value
          }
        }
      )
    }
  )
  return ret
}

/**
 * It will do a shallow comparison between two objects, returning true if the two are equal
 * @param {*} objectA - The first Object
 * @param {*} objectB - Object B to compare with
 */
export function shallowCompare (objectA, objectB) {
  for (let prop in objectA) { if (!(prop in objectB)) return false }
  for (let prop in objectB) { if (!(prop in objectA)) return false }
  for (let prop in objectA) { if (objectA[prop] !== objectB[prop]) return false }
  return true
}
