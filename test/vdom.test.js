import { default as NodeFactory, Node } from '../src/vdom/node'

describe('node', () => {
  describe('Node', () => {
    it('should return an empty node definition', () => {
      const n = new Node('div')
      expect(n).toMatchObject(
        {
          kind: 'div',
          attributes: {},
          children: []
        }
      )
    })

    it('should return valid node definition with attributes', () => {
      const n = new Node('div', { attr: 1 })
      expect(n).toMatchObject(
        {
          kind: 'div',
          attributes: { attr: 1 },
          children: []
        }
      )
    })

    it('should return valid node definition with children', () => {
      const n = new Node('div', { attr: 1 }, 'div')
      expect(n).toMatchObject(
        {
          kind: 'div',
          attributes: { attr: 1 },
          children: ['div']
        }
      )
    })
  })

  describe('default', () => {
    it('should return simple text node definition', () => {
      const n = new NodeFactory('simple text')
      expect(n).toMatchObject(
        {
          kind: 'span',
          attributes: {textContent: 'simple text'},
          children: []
        }
      )
    })
  })
})
