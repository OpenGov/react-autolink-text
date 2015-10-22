import React from 'react';
import ReactDOM from 'react-dom';
import AutoLinkText from 'react-autolink-text';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {text: ''};
  }

  _onTextChange(e) {
    this.setState({text: e.target.value});
  }

  render() {
    return (
      <div>
        <AutoLinkText text={this.state.text} /><br />
        <textarea value={this.state.text} onChange={this._onTextChange.bind(this)} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
