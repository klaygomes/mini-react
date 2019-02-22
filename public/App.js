class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      definedLimit: 2500,
      maxLimit: 5000,
    };
  }

  setDefinedLimit(e) {
    this.setState(() => ({
      definedLimit: parseInt(e.target.value)
    }))
  }

  render() {
    return node({
      tagName: 'div',
      children: [
        {
          tagName: 'h1',
          textContent: 'Ajuste de limite'
        }, {
          tagName: 'input',
          type: 'text',
          value: this.state.definedLimit,
          onchange: e => this.setDefinedLimit(e)
          }, {
          tagName: 'p',
          textContent: `R$ ${ this.state.maxLimit - this.state.definedLimit } disponíveis`
        }, {
          tagName: 'input',
          type: 'range',
          min: 0,
          max: this.state.maxLimit,
          value: this.state.definedLimit,
          onchange: e => this.setDefinedLimit(e)
        }
      ],
    });
  }
}
