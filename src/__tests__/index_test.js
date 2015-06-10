import React from 'react/addons';
import AutoLinkText from '../index';

const {renderIntoDocument, isElementOfType} = React.addons.TestUtils;

describe('<AutoLinkText />', function() {
  it('renders a span', function() {
    expect(
      React.findDOMNode(renderIntoDocument(<AutoLinkText />)).tagName
    ).toBe('SPAN');
  });
});
