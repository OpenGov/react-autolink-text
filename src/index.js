import React from 'react';

import matchParser from './match_parser';

export default class AutoLinkText extends React.Component {
  render() {
    const text = this.props.text || '';
    return (
      <span>{matchParser(text)::prepareElements(text)::truncate(this.props.maxLength)}</span>
    );
  }
}

function prepareElements(text) {
  let elements = [];
  let lastIndex = 0;

  for (const match of this) {
    if (match.position.start !== 0) {
      elements.push(<span>{text.slice(lastIndex, match.position.start)}</span>);
    }
    elements.push(<a href={match.text}>{match.text.replace(/(http:)?\/\//, '').replace('www.', '')}</a>);
    lastIndex = match.position.end;
  }

  if (lastIndex < text.length) {
    elements.push(<span>{text.slice(lastIndex)}</span>);
  }

  return elements;
}

function truncate(maxLength) {
  if (!maxLength) return this;

  let elements = [];
  let length = 0;

  for (const el of this) {
    length += el.props.children.length;

    if (length > maxLength) {
      const truncatedText = el.props.children.slice(0, -(length - maxLength));
      elements.push(
        React.cloneElement(el, {}, truncatedText)
      );
      break;
    }

    elements.push(el);
  }

  return elements;
}

AutoLinkText.propTypes = {
  text: React.PropTypes.string
};
