//Variables, information for each button
const buttonInfo = [
  { label: 'AC', id: 'clear', val: null },
  { label: 'DEL', id: 'delete', val: null },
  { label: '+', id: 'add', val: null },
  { label: '7', id: 'seven', val: 7 },
  { label: '8', id: 'eight', val: 8 },
  { label: '9', id: 'nine', val: 9 },
  { label: '-', id: 'subtract', val: null },
  { label: '4', id: 'four', val: 4 },
  { label: '5', id: 'five', val: 5 },
  { label: '6', id: 'six', val: 6 },
  { label: 'x', id: 'multiply', val: null },
  { label: '1', id: 'one', val: 1 },
  { label: '2', id: 'two', val: 2 },
  { label: '3', id: 'three', val: 3 },
  { label: '/', id: 'divide', val: null },
  { label: '0', id: 'zero', val: 0 },
  { label: '.', id: 'decimal', val: null },
  { label: '=', id: 'equals', val: null },
];

class Button extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick = () => {
    this.props.updateDisplay(this.props.info.val, this.props.info.label);
  };

  render() {
    return (
      <button
      id={this.props.info.id}
      onClick= {this.handleClick}>
        {this.props.info.label}
      </button>
    );
  }
}

class Display extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id='display-window'>

      {/*For display of the 'mode' the calculator is in enable the line below*/}
      {/*<p id="mode">{this.props.mode}</p>*/}
      <p id="previous-output">{this.props.currentCalc}{this.props.currentInput}</p>
      <p id='display'>{this.props.currentInput}</p>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prevCalc: '',
      currentCalc: '',
      currentInput: '0',
      mode: 'number',
    };

    this.updateDisplay = this.updateDisplay.bind(this);
    this.evaluate = this.evaluate.bind(this);
  }

  updateDisplay(val, label) {
    //For number Keys: replace (if '0') or update the number
    if (val != null) {
      if (this.state.mode !== 'number') {
        this.setState({ mode: 'number', });
      };

      this.state.currentInput == '0' ?
      this.setState({ currentInput:  val.toString(), }) :
      this.state.mode == 'evaluate' ?
      this.setState({
        currentInput:  val.toString(),
        currentCalc: '',
      }) :
      this.setState({ currentInput:  this.state.currentInput.concat(val.toString()), });
    }

    //For non-numbers: case-by-case
    else {
      switch (label) {
        case 'AC' :
          this.setState({ currentInput: '0', currentCalc: '', mode: 'number' }); break;
        case 'DEL' :

          if (this.state.mode != 'evaluate') {
            //longer than 1 digit/operator, then 'backspace' to trunkated input
            if (this.state.currentInput.length > 1) {
              const trunkInput = this.state.currentInput.slice(0, -1);
              this.setState({ currentInput: trunkInput, });

              //if this trunkated input is only operators, switch the mode to match
              if (['+', '-', '/', 'x'].indexOf(trunkInput.charAt(trunkInput.length - 1)) > -1) {
                this.setState({ mode: 'operator' });
              }
            }

            //otherwise, if the current single character input is a number, set the input to 0.
            else if (['+', '-', '/', 'x'].indexOf(this.state.currentInput) <= -1) {
              this.setState({ currentInput: '0', mode: 'number' });
            }
          }

          break;

        case '.' :
          if (this.state.currentInput.indexOf('.') < 0) {
            this.setState({ currentInput:  this.state.currentInput.concat(label), });
          }; break;

        case '+':
        case '-':
        case 'x':
        case '/':

          /*mode is number, operator or evaluate
            #: append current input to the current calculation and give current input val of operator pressed.
            op: replace current input with new op, do not update current calculation. if '-' can append, but only once.
            eval: assign currentCalc value of prevCalc and currentInput value of operator
          */
          switch (this.state.mode){
            case 'number':
              this.setState({
                currentCalc: this.state.currentCalc.concat(this.state.currentInput),
                currentInput: label,
                mode: 'operator',
              }); break;

            case 'operator':
              label == '-' && this.state.currentInput.length == 1 ?
              this.setState({
                currentInput: this.state.currentInput.concat('-'),
              }) :
              this.setState({
                currentInput: label,
              }); break;

            case 'evaluate':
              this.setState({
                currentCalc: this.state.prevCalc,
                currentInput: label,
                mode: 'operator',
              });
          } break;
        case '=':
          if (this.state.mode == 'number') {
            var result = this.evaluate(this.state.currentCalc.concat(this.state.currentInput));
            this.setState({
              prevCalc: result,
              currentCalc: this.state.currentCalc.concat(this.state.currentInput + '='),
              currentInput: result,
              mode: 'evaluate',
            });
          }

          break;
      }
    }
  }

  evaluate(x) {
    x = x.replace(/x/g, '*');
    x = x.replace(/[^-\d/*+.]/g, '');
    return eval(x).toString();
  }

  render() {
    return (
      <div id="calculator">
        <Display
        currentInput={this.state.currentInput}
        currentCalc={this.state.currentCalc}
        mode={this.state.mode} />
        {buttonInfo.map((value, index) =>
          (<Button info={value} updateDisplay={this.updateDisplay} />))
        }
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('React-App'));
