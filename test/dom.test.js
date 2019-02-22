/**
 * @jest-environment jsdom
 */

import { render } from '../src/dom/rendering'
import Component from '../src/component'
import node from '../src/vdom/node'

describe('dom', () => {
  class C1 extends Component {
    trigger () {
      this.setState(() => ({ textContent: 'Hello Bar' }))
    }
    constructor (props) {
      super(props)
      this.state = {
        textContent: 'hello world'
      }
    }
    render () {
      return node({
        tagName: 'div',
        textContent: this.state.textContent,
        onclick: () => this.trigger()
      })
    }
  }

  // ---------
  //          constructing
  // ---------
  describe('render', () => {
    let scratch

    beforeEach(() => {
      scratch = document.createElement('div')
    })

    it('should throw an error if not a vnode', () => {
      const vnode = {'not a valid': 'vnode'}
      const t = () => render(vnode, scratch)
      expect(t).toThrowError('not able to construct this vnode')
    })

    it('should throw an error if not a DOM Element', () => {
      const vnode = node({
        tagName: 'span',
        textContent: 'hello world'
      })
      const t = () => render(vnode, {})
      expect(t).toThrowError('node must be a valid DOM Element')
    })

    it('should render an element', () => {
      const vnode = node({
        tagName: 'span',
        textContent: 'hello world'
      })

      render(vnode, scratch)
      expect(scratch.innerHTML).toBe('<span>hello world</span>')
    })

    it('should render an element', () => {
      const vnode = node({
        tagName: 'div',
        children: ['hello world']
      })
      render(vnode, scratch)
      expect(scratch.innerHTML).toBe('<div><span>hello world</span></div>')
    })

    it('should render a component', () => {
      const vnode = new C1()

      render(vnode, scratch)
      expect(scratch.innerHTML).toBe('<div>hello world</div>')
    })
  })
  // ---------
  //          patching
  // ---------
  describe('patching', () => {
    class C2 extends Component {
      trigger () {
        this.setState(() => ({ isA: false }))
      }
      constructor (props) {
        super(props)
        this.state.isA = true
      }
      render () {
        return this.state.isA ? node({
          tagName: 'div',
          textContent: 'is a',
          onclick: () => this.trigger()
        }) : node({
          tagName: 'span',
          textContent: 'is b'
        })
      }
    }

    let scratch

    beforeEach(() => {
      scratch = document.createElement('div')
      document.body.appendChild(scratch)
    })
    it('should nothing happens', () => {
      class C2 extends Component {
        trigger () {
          this.setState(() => ({'data-test': 'state'}))
        }
        constructor (props) {
          super(props)
          this.state = {'data-test': 'state'}
          this.trigger = this.trigger.bind(this)
        }
        render () {
          return node({
            tagName: 'div',
            textContent: 'foobar',
            ...this.state,
            onclick: this.trigger
          })
        }
      }
      const vnode = new C2()
      render(vnode, scratch)
      expect(scratch.innerHTML).toBe('<div data-test="state">foobar</div>')
      var evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', false, true)
      scratch.firstElementChild.dispatchEvent(evt)
      expect(scratch.innerHTML).toBe('<div data-test="state">foobar</div>')
    })
    it('should update a component', () => {
      const vnode = new C1()

      render(vnode, scratch)
      expect(scratch.innerHTML).toBe('<div>hello world</div>')
      var evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', false, true)
      scratch.firstElementChild.dispatchEvent(evt)
      expect(scratch.innerHTML).toBe('<div>Hello Bar</div>')
    })
    it('should update flip child component', () => {
      const vnode = new C2()
      render(vnode, scratch)

      expect(scratch.innerHTML).toBe('<div>is a</div>')

      var evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', false, true)
      scratch.firstElementChild.dispatchEvent(evt)
      expect(scratch.innerHTML).toBe('<span>is b</span>')
    })
    it('should remove event listener', () => {
      class C2 extends Component {
        trigger () {
          this.setState(({isA}) => ({ isA: !isA }))
        }
        constructor (props) {
          super(props)
          this.state.isA = true
        }
        render () {
          return node({
            tagName: 'div',
            textContent: 'is a',
            alt: this.state.isA ? 'title' : undefined,
            onclick: this.state.isA ? () => this.trigger() : undefined
          })
        }
      }
      const vnode = new C2()
      render(vnode, scratch)

      expect(scratch.innerHTML).toBe('<div alt="title">is a</div>')

      var evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', false, true)
      scratch.firstElementChild.dispatchEvent(evt)
      expect(scratch.innerHTML).toBe('<div>is a</div>')
      evt.initEvent('click', false, true)
      scratch.firstElementChild.dispatchEvent(evt)
      expect(scratch.innerHTML).toBe('<div>is a</div>')
    })
    it('should update flip child component with childs', () => {
      class C3 extends Component {
        trigger () {
          this.setState(({isA}) => ({ isA: !isA }))
        }
        constructor (props) {
          super(props)
          this.state.isA = true
        }
        render () {
          return this.state.isA ? node({
            tagName: 'div',
            textContent: 'is a',
            onclick: () => this.trigger()
          }) : node({
            tagName: 'div',
            onclick: () => this.trigger(),
            children: [
              'foo',
              'bar'
            ]
          })
        }
      }
      const vnode = new C3()
      render(vnode, scratch)

      expect(scratch.innerHTML).toBe('<div>is a</div>')

      var evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', false, true)
      scratch.firstElementChild.dispatchEvent(evt)
      expect(scratch.innerHTML).toBe('<div><span>foo</span><span>bar</span></div>')
      scratch.firstElementChild.dispatchEvent(evt)
      expect(scratch.innerHTML).toBe('<div>is a</div>')
    })
    it('should update flip child component with childs and its childs', () => {
      class C3 extends Component {
        trigger () {
          this.setState(({isA}) => ({ isA: !isA }))
        }
        constructor (props) {
          super(props)
          this.state.isA = true
        }
        render () {
          return this.state.isA ? node({
            tagName: 'div',
            children: [
              'foo',
              'bar',
              'baz'
            ],
            onclick: () => this.trigger()
          }) : node({
            tagName: 'div',
            onclick: () => this.trigger(),
            children: [
              'boo',
              'barz'
            ]
          })
        }
      }
      const vnode = new C3()
      render(vnode, scratch)

      expect(scratch.innerHTML).toBe('<div><span>foo</span><span>bar</span><span>baz</span></div>')

      var evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', false, true)
      scratch.firstElementChild.dispatchEvent(evt)
      expect(scratch.innerHTML).toBe('<div><span>boo</span><span>barz</span></div>')
      scratch.firstElementChild.dispatchEvent(evt)
      expect(scratch.innerHTML).toBe('<div><span>foo</span><span>bar</span><span>baz</span></div>')
    })
    it('should update flip child component with childs and childs', () => {
      class C4 extends Component {
        trigger () {
          this.setState(({isA}) => ({ isA: !isA }))
        }
        constructor (props) {
          super(props)
          this.state.isA = true
        }
        render () {
          return this.state.isA ? node({
            tagName: 'div',
            children: [
              '1',
              '2',
              '3'
            ],
            onclick: () => this.trigger()
          }) : node({
            tagName: 'div',
            onclick: () => this.trigger(),
            children: [
              '4',
              '5',
              '6'
            ]
          })
        }
      }
      const vnode = new C4()
      render(vnode, scratch)

      expect(scratch.innerHTML).toBe('<div><span>1</span><span>2</span><span>3</span></div>')

      var evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', false, true)
      scratch.firstElementChild.dispatchEvent(evt)
      expect(scratch.innerHTML).toBe('<div><span>4</span><span>5</span><span>6</span></div>')
      scratch.firstElementChild.dispatchEvent(evt)
      expect(scratch.innerHTML).toBe('<div><span>1</span><span>2</span><span>3</span></div>')
    })
    it('should update flip child component with child component', () => {
      class C5 extends Component {
        render () {
          return node({tagName: 'span', textContent: 'hello word'})
        }
      }
      class C6 extends Component {
        trigger () {
          this.setState(({isA}) => ({ isA: !isA }))
        }
        constructor (props) {
          super(props)
          this.state.isA = false
        }
        render () {
          return this.state.isA ? node({
            tagName: 'div',
            children: [
              '1',
              '2',
              '3'
            ],
            onclick: () => this.trigger()
          }) : node({
            tagName: 'div',
            onclick: () => this.trigger(),
            children: [
              new C5()
            ]
          })
        }
      }
      const vnode = new C6()
      render(vnode, scratch)

      expect(scratch.innerHTML).toBe('<div><span>hello word</span></div>')

      var evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', false, true)
      scratch.firstElementChild.dispatchEvent(evt)
      expect(scratch.innerHTML).toBe('<div><span>1</span><span>2</span><span>3</span></div>')
      scratch.firstElementChild.dispatchEvent(evt)
      expect(scratch.innerHTML).toBe('<div><span>hello word</span></div>')
    })
    it('should update flip child component a with child component b', () => {
      class C7 extends Component {
        render () {
          return node({tagName: 'span', textContent: 'hello word'})
        }
      }
      class C8 extends Component {
        render () {
          return node({tagName: 'div', textContent: 'foo bar'})
        }
      }
      class C9 extends Component {
        trigger () {
          this.setState(({isA}) => ({ isA: !isA }))
        }
        constructor (props) {
          super(props)
          this.state.isA = true
        }
        render () {
          return node({
            tagName: 'div',
            children: [
              this.state.isA ? new C7() : new C8()
            ],
            onclick: () => this.trigger()
          })
        }
      }
      const vnode = new C9()
      render(vnode, scratch)

      expect(scratch.innerHTML).toBe('<div><span>hello word</span></div>')

      var evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', false, true)
      scratch.firstElementChild.dispatchEvent(evt)
      expect(scratch.innerHTML).toBe('<div><div>foo bar</div></div>')
      scratch.firstElementChild.dispatchEvent(evt)
      expect(scratch.innerHTML).toBe('<div><span>hello word</span></div>')
    })
  })
})
