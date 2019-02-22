import {
  isFunction,
  shallowClone,
  isNull,
  isBoolean,
  isValidObject,
  throwError,
  isEmpty,
  mergeObjects,
  shallowCompare
} from '../src/utils'

describe('utils', () => {
  describe('isFunction', () => {
    it('should return false', () => {
      [null, undefined, [], '', 1, false, /\s/, void 0, Symbol('foo')].forEach(
        (value) => expect(isFunction(value)).toBeFalsy()
      )
    })
    it('should return true', () => {
      [function () {}, () => ({}), function test () {}].forEach(
        (value) => expect(isFunction(value)).toBeTruthy()
      )
    })
  })
  describe('isNull', () => {
    it('should return false', () => {
      [undefined, [], '', 1, false, /\s/, void 0, function () {}].forEach(
        (value) => expect(isNull(value)).toBeFalsy()
      )
    })
    it('should return true', () => {
      [null].forEach(
        (value) => expect(isNull(value)).toBeTruthy()
      )
    })
  })
  describe('isBoolean', () => {
    it('should return false', () => {
      [undefined, [], '', 1, 0, /\s/, void 0, function () {}, null].forEach(
        (value) => expect(isBoolean(value)).toBeFalsy()
      )
    })
    it('should return true', () => {
      [true, false].forEach(
        (value) => expect(isBoolean(value)).toBeTruthy()
      )
    })
  })
  describe('isValidObject', () => {
    it('should return false', () => {
      // eslint-disable-next-line no-new-object
      [new Object(9), Function, undefined, [], '', 1, /\s/, void 0, null, Symbol('foo')].forEach(
        (value) => expect(isValidObject(value)).toBeFalsy()
      )
    })
    it('should return true', () => {
    // eslint-disable-next-line no-new-object
      [{foo: 'bar'}, {}, new Object({foo: 'bar'})].forEach(
        (value) => expect(isValidObject(value)).toBeTruthy()
      )
    })
  })
  describe('isEmpty', () => {
    it('should return false', () => {
      // eslint-disable-next-line no-new-wrappers
      [new String('foo bar'), 'foo bar'].forEach(
        (value) => expect(isEmpty(value)).toBeFalsy()
      )
    })
    it('should return true', () => {
    // eslint-disable-next-line no-new-wrappers
      ['', new String(''), null, undefined].forEach(
        (value) => expect(isEmpty(value)).toBeTruthy()
      )
    })
  })
  describe('shallowClone', () => {
    it('should shallow clone', () => {
      const original = {foo: 'bar', bar: {foo: 'bar'}}
      const clone = shallowClone(original)

      expect(original).toMatchObject(clone)
      expect(original !== clone).toBeTruthy()
    })
    it('should return an empty object', () => {
      const original = undefined
      const clone = shallowClone(original)

      expect({}).toMatchObject(clone)
    })
  })
  describe('throwError', () => {
    it('should throw an exception', () => {
      const t = () => throwError('foo bar')
      expect(t).toThrow(
        Error
      )
    })
    it('should throw an exception with custom message', () => {
      const t = () => throwError('foo bar')
      expect(t).toThrowError('Mini React: foo bar')
    })
  })
  describe('mergeObjects', () => {
    it('should merge two objects', () => {
      const a = {a: '1'}
      const b = {b: '2'}
      expect(mergeObjects(a, b)).toMatchObject({
        a: '1',
        b: '2'
      })
    })
    it('should merge two objects', () => {
      const a = {a: '1', b: [4]}
      const b = {b: [1, 2, 3]}
      expect(mergeObjects(a, b)).toMatchObject({
        a: '1',
        b: [1, 2, 3]
      })
    })
    it('should merge two objects deeply', () => {
      const a = {a: 1, c: 5, b: {c: 'b.c', d: {e: 'd.e'}}}
      const b = {c: [2], b: {d: {foo: 'bar', 'bar': {foo: '1'}}}}
      expect(mergeObjects(a, b)).toMatchObject({
        a: 1, b: {c: 'b.c', d: {e: 'd.e', foo: 'bar', 'bar': {foo: '1'}}}, c: [2]
      })
    })
    it('should throw an exception with custom message', () => {
      const t = () => mergeObjects(null, null)
      expect(t).toThrow()
    })
  })
  describe('throwError', () => {
    it('should throw an exception with custom message', () => {
      const t = () => throwError('foo bar')
      expect(t).toThrowError('Mini React: foo bar')
    })
  })
  describe('shallowCompare', () => {
    it('should return false if `a` has a property that `b` does not have', () => {
      const a = {
        prop1: '1',
        prop2: '2'
      }
      const b = {
        prop2: '2'
      }
      expect(shallowCompare(a, b)).toBeFalsy()
    })
    it('should return false if `b` has a property that `a` does not have', () => {
      const b = {
        prop1: '1',
        prop2: '2'
      }
      const a = {
        prop2: '2'
      }
      expect(shallowCompare(a, b)).toBeFalsy()
    })
    it('should return false if `b` has a property that `a` does have but with diferente value', () => {
      const b = {
        prop1: '1',
        prop2: '2'
      }
      const a = {
        prop1: '1',
        prop2: '3'
      }
      expect(shallowCompare(a, b)).toBeFalsy()
    })
    it('should return true if `b` has a property that `a` does have with same value', () => {
      const b = {
        prop1: '1',
        prop2: '2'
      }
      const a = {
        prop1: '1',
        prop2: '2'
      }
      expect(shallowCompare(a, b)).toBeTruthy()
    })
  })
})
