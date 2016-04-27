import React from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import matchParser from './match_parser';

export default class AutoLinkText extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static defaultProps = {
    text: ''
  }

  render() {
    const { text, maxLength, ...attrs } = this.props
    return (
      <span>{matchParser(text)::prepareElements(text, attrs)::truncate(maxLength)::keyElements()}</span>
    );
  }
}

function prepareElements(text, attrs) {
  let elements = [];
  let lastIndex = 0;

  this.forEach((match) => {
    if (match.position.start !== 0) {
      elements.push(<span>{text.slice(lastIndex, match.position.start)}</span>);
    }
    elements.push(<a href={match.getAnchorHref()} {...attrs}>{match.getAnchorText()}</a>);
    lastIndex = match.position.end;
  });

  if (lastIndex < text.length) {
    elements.push(<span>{text.slice(lastIndex)}</span>);
  }

  return elements;
}

function truncate(maxLength) {
  if (!maxLength) return this;

  let elements = [];
  let length = 0;

  this.some((el) => {
    length += el.props.children.length;

    if (length > maxLength) {
      const truncatedText = el.props.children.slice(0, -(length - maxLength));
      elements.push(
        React.cloneElement(el, {}, truncatedText)
      );
      return true; // stop iterating through the elements
    }

    elements.push(el);
  });

  return elements;
}

/*
 * Generate unique keys for each of the elements.
 * The key will be based on the index of the element.
 */
function keyElements() {
  return this.map((el, index) => {
    return React.cloneElement(el, {key: index});
  });
}

AutoLinkText.propTypes = {
  text: React.PropTypes.string,
  maxLength: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string
  ])
};
