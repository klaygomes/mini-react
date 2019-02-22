/**
 * @jest-environment jsdom
 */

import Component from '../src/component'
import {
  COMPONENT_KIND
} from '../src/constants'

describe('component', () => {
  it('should has passed props', () => {
    class C1 extends Component {
    }
    const someProps = {foo: 'bar'}
    const instance = new C1(someProps)
    expect(instance.props).toMatchObject(someProps)
  })

  it('should be an component kind', () => {
    class C1 extends Component {
    }
    const instance = new C1()
    expect(instance.kind).toBe(COMPONENT_KIND)
  })
  it('should be an component kind', () => {
    class C1 extends Component {
    }
    const instance = new C1()
    expect(instance.kind).toBe(COMPONENT_KIND)
  })
  describe('setState', () => {
    class C1 extends Component {
    }
    class C2 extends Component {
      render () {
      }
    }
    let instance
    beforeEach(() => {
      instance = new C1()
    })
    it('should throw a erros if not a function', () => {
      const t = () => instance.setState(null)
      expect(t).toThrow()
    })
    it('should throw if no render function defined', () => {
      const setStateFunc = jest.fn()
      setStateFunc.mockReturnValueOnce({'baz': 'boo'})
      const defaultProps = {'foo': 'bar'}
      instance = new C1(defaultProps)
      const t = () => instance.setState(setStateFunc)
      expect(t).toThrowError('no render function was defined')
    })
    it('should throw if no wired up', () => {
      const setStateFunc = jest.fn()
      setStateFunc.mockReturnValueOnce({'baz': 'boo'})
      const defaultProps = {'foo': 'bar'}
      instance = new C2(defaultProps)
      const t = () => instance.setState(setStateFunc)
      expect(t).toThrowError('this component was not correctly construted')
      expect(setStateFunc).toBeCalledWith({}, defaultProps)
    })
  })
})
