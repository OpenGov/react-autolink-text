import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server'
import ReactTestUtils from 'react-addons-test-utils';
import AutoLinkText from '../index';

const {renderIntoDocument, createRenderer} = ReactTestUtils;

describe('<AutoLinkText />', function() {
  let renderer;

  beforeEach(function() {
    renderer = createRenderer();
  });

  function renderText(text, props={}) {
    return renderToStaticMarkup(
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

    it('should automatically link URLs in the form of https://opengov.com', function() {
      expect(
        renderText('Joe went to https://opengov.com')
      ).toEqual('<span><span>Joe went to </span><a href="https://opengov.com">opengov.com</a></span>');
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

    it('should NOT autolink possible URLs with the "javascript:" URI scheme', function() {
      expect(
        renderText('do not link javascript:window.alert("hi") please')
      ).toBe('<span><span>do not link javascript:window.alert(&quot;hi&quot;) please</span></span>');
    });

    it('should NOT automatically link strings of the form "git:d" (using the heuristic that the domain name does not have a "." in it)', function() {
      expect(
        renderText('Something like git:d should not be linked as a URL')
      ).toBe('<span><span>Something like git:d should not be linked as a URL</span></span>');
    });

    it('should NOT automatically link strings of the form ":git:domain" (using the heuristic that the domain name does not have a "." in it)', function() {
      expect(
        renderText('Something like git:domain should not be linked as a URL')
      ).toBe('<span><span>Something like git:domain should not be linked as a URL</span></span>');
    });

    it('should automatically link strings of the form "git:domain.com", interpreting this as a protocol and domain name', function() {
      expect(
        renderText('Something like git:domain.com should be linked as a URL')
      ).toBe('<span><span>Something like </span><a href="git:domain.com">git:domain.com</a><span> should be linked as a URL</span></span>');
    });

    it('should NOT automatically link a string in the form of "git:1.0"', function() {
      expect(
        renderText('git:1.0')
      ).toBe('<span><span>git:1.0</span></span>');
    });

    it("should NOT automatically link supposed protocol-relative URLs in the form of abc//yahoo.com, which is most likely not supposed to be interpreted as a URL", function() {
      expect(
        renderText('Joe went to abc//opengov.com')
      ).toBe('<span><span>Joe went to abc//opengov.com</span></span>');
    });

    it('should automatically link protocol-relative URLs', function() {
      expect(
        renderText('Joe visited //opengov.com this morning')
      ).toBe('<span><span>Joe visited </span><a href="//opengov.com">opengov.com</a><span> this morning</span></span>');
    });

    it('should support extra html attributes', function() {
      expect(
        renderText('Joe went to http://opengov.com', { className: "my-link", target: "_blank" })
      ).toEqual('<span><span>Joe went to </span><a href="http://opengov.com" class="my-link" target="_blank">opengov.com</a></span>');
    });
  });

  describe('truncating text with links', function() {
    it('should truncate a text span', function() {
      expect(
        renderText('Joe bookmarked http://opengov.com yesterday in his browser', {maxLength: 36})
      ).toBe('<span><span>Joe bookmarked </span><a href="http://opengov.com">opengov.com</a><span> yesterday</span></span>');
    });

    it('should allow "maxLength" prop to be a string', function() {
      expect(
        renderText('This message will be cut off', {maxLength: '13'})
      ).toBe('<span><span>This message </span></span>');
    });
  });
});
