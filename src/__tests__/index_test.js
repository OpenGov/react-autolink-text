import React from 'react/addons';
import AutoLinkText from '../index';

const {renderIntoDocument, createRenderer} = React.addons.TestUtils;

describe('<AutoLinkText />', function() {
  let renderer;

  beforeEach(function() {
    renderer = createRenderer();
  });

  function renderText(text, props={}) {
    return React.renderToStaticMarkup(
      <AutoLinkText text={text} {...props} />
    );
  }

  it('renders an empty span if no text is provided', function() {
    expect(
      renderText()
    ).toEqual('<span></span>');
  });

  describe('URL linking', function() {
    it('should automatically link URLs in the form of http://opengov.com', function() {
      expect(
        renderText('Joe went to http://opengov.com')
      ).toEqual('<span><span>Joe went to </span><a href="http://opengov.com">opengov.com</a></span>');
    });

    it('should automatically link localhost URLs when there is a protocol', function() {
      expect(
        renderText('Joe visited http://localhost today')
      ).toEqual('<span><span>Joe visited </span><a href="http://localhost">localhost</a><span> today</span></span>');
    });

    it('should automatically link localhost URLs when there is a protocol and port', function() {
      expect(
        renderText('Joe visited http://localhost:8000 today')
      ).toEqual('<span><span>Joe visited </span><a href="http://localhost:8000">localhost:8000</a><span> today</span></span>');
    });

    it('should automatically link URLs in the form of http://www.opengov.com (i.e. protocol and www prefix)', function() {
      expect(
        renderText('Joe checked out http://www.opengov.com last week')
      ).toBe('<span><span>Joe checked out </span><a href="http://www.opengov.com">opengov.com</a><span> last week</span></span>');
    });
  });

  describe('truncating text with links', function() {
    it('should truncate a text span', function() {
      expect(
        renderText('Joe bookmarked http://opengov.com yesterday in his browser', {maxLength: 36})
      ).toBe('<span><span>Joe bookmarked </span><a href="http://opengov.com">opengov.com</a><span> yesterday</span></span>');
    });
  });
});
