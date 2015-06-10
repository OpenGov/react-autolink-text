import React from 'react';

import matchParser from './match_parser';

export default class AutoLinkText extends React.Component {
  render() {
    const {text} = this.props;
    if (!text) {
      return <span />;
    }

    const matches = matchParser(text);
    const children = [];

    let lastIndex = 0;
    for (let m of matches) {
      if (m.position.start !== 0) {
        children.push(<span>{text.slice(lastIndex, m.position.start)}</span>);
      }
      children.push(<a href="#">{m.text}</a>);
      lastIndex = m.position.end;
    }

    if (lastIndex < text.length) {
      children.push(<span>{text.slice(lastIndex)}</span>);
    }

    return <span>{children}</span>;
  }
}

AutoLinkText.propTypes = {
  text: React.PropTypes.string
};
