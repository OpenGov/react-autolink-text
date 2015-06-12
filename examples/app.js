import React from 'react';
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
        <AutoLinkText text={this.state.text} maxLength={10} /><br />
        <textarea value={this.state.text} onChange={this._onTextChange.bind(this)} />
      </div>
    );
  }
}

React.render(<App />, document.getElementById('app'));
