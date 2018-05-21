import React from 'react';
import { shallow } from 'enzyme';
import ReactTestUtils from 'react-dom/test-utils';
import AutoLinkText from '../index';

const {renderIntoDocument, createRenderer} = ReactTestUtils;

describe('<AutoLinkText />', function() {
  // let renderer;

  // beforeEach(function() {
  //   renderer = createRenderer();
  // });

  // function renderText(text, props={}) {
  //   return React.renderToStaticMarkup(
  //     <AutoLinkText text={text} {...props} />
  //   );
  // }

  it('renders an empty span if no text is provided', function() {
    const text = '';
    const wrapper = shallow(<AutoLinkText text={text} />);
    expect(wrapper.find('span').text()).toEqual('');
  });

  describe('URL linking', function() {
    it('should automatically link URLs in the form of http://opengov.com', function() {
      const text = 'Joe went to http://opengov.com';
      const wrapper = shallow(<AutoLinkText text={text} />);
      expect(wrapper.find('span').at(1).text()).toEqual('Joe went to ');
      expect(wrapper.find('a').prop('href')).toEqual('http://opengov.com');
      expect(wrapper.find('a').text()).toEqual('opengov.com'); 
    });

    it('should automatically link URLs in the form of https://opengov.com', function() {
      const text = 'Joe went to https://opengov.com';
      const wrapper = shallow(<AutoLinkText text={text} />);
      expect(wrapper.find('span').at(1).text()).toEqual('Joe went to ');
      expect(wrapper.find('a').prop('href')).toEqual('https://opengov.com');
      expect(wrapper.find('a').text()).toEqual('opengov.com'); 
    });

    it('should automatically link localhost URLs when there is a protocol', function() {
      const text = 'Joe visited http://localhost today'; 
      const wrapper = shallow(<AutoLinkText text={text} />);
      expect(wrapper.find('span').at(1).text()).toEqual('Joe visited ');
      expect(wrapper.find('a').prop('href')).toEqual('http://localhost');
      expect(wrapper.find('a').text()).toEqual('localhost');
      expect(wrapper.find('span').at(2).text()).toEqual(' today');
    });

    it('should automatically link localhost URLs when there is a protocol and port', function() {
      const text = 'Joe visited http://localhost:8000 today'; 
      const wrapper = shallow(<AutoLinkText text={text} />);
      expect(wrapper.find('span').at(1).text()).toEqual('Joe visited ');
      expect(wrapper.find('a').prop('href')).toEqual('http://localhost:8000');
      expect(wrapper.find('a').text()).toEqual('localhost:8000');
      expect(wrapper.find('span').at(2).text()).toEqual(' today');
    });

    it('should automatically link URLs in the form of http://www.opengov.com (i.e. protocol and www prefix)', function() {
      const text = 'Joe checked out http://www.opengov.com last week'; 
      const wrapper = shallow(<AutoLinkText text={text} />);
      expect(wrapper.find('span').at(1).text()).toEqual('Joe checked out ');
      expect(wrapper.find('a').prop('href')).toEqual('http://www.opengov.com');
      expect(wrapper.find('a').text()).toEqual('opengov.com');
    });

    it('should NOT autolink possible URLs with the "javascript:" URI scheme', function() {
      const text = 'do not link javascript:window.alert("hi") please'; 
      const wrapper = shallow(<AutoLinkText text={text} />);
      console.log(wrapper.debug())
      expect(wrapper.find('span').at(1).html()).toEqual('<span>do not link javascript:window.alert(&quot;hi&quot;) please</span>');
      expect(wrapper.find('a').exists()).toEqual(false);
    });

    it('should NOT automatically link strings of the form "git:d" (using the heuristic that the domain name does not have a "." in it)', function() {
      const text = 'Something like git:d should not be linked as a URL'; 
      const wrapper = shallow(<AutoLinkText text={text} />);
      expect(wrapper.html()).toEqual('<span><span>Something like git:d should not be linked as a URL</span></span>');
    });

    it('should NOT automatically link strings of the form ":git:domain" (using the heuristic that the domain name does not have a "." in it)', function() {
      const text = 'Something like git:domain should not be linked as a URL';
      const wrapper = shallow(<AutoLinkText text={text} />);
      expect(wrapper.html()).toEqual('<span><span>Something like git:domain should not be linked as a URL</span></span>');
    });

    it('should automatically link strings of the form "git:domain.com", interpreting this as a protocol and domain name', function() {
      const text = 'Something like git:domain.com should be linked as a URL'; 
      const wrapper = shallow(<AutoLinkText text={text} />);
      expect(wrapper.html()).toEqual('<span><span>Something like </span><a href="git:domain.com">git:domain.com</a><span> should be linked as a URL</span></span>');
    });

    it('should NOT automatically link a string in the form of "git:1.0"', function() {
      const text = 'git:1.0'; 
      const wrapper = shallow(<AutoLinkText text={text} />);
      expect(wrapper.html()).toEqual('<span><span>git:1.0</span></span>');
    });

    it("should NOT automatically link supposed protocol-relative URLs in the form of abc//yahoo.com, which is most likely not supposed to be interpreted as a URL", function() {
      const text = 'Joe went to abc//opengov.com'; 
      const wrapper = shallow(<AutoLinkText text={text} />);
      expect(wrapper.html()).toEqual('<span><span>Joe went to abc//opengov.com</span></span>');
    });

    it('should automatically link protocol-relative URLs', function() {
      const text = 'Joe visited //opengov.com this morning'; 
      const wrapper = shallow(<AutoLinkText text={text} />);
      expect(wrapper.html()).toEqual('<span><span>Joe visited </span><a href="//opengov.com">opengov.com</a><span> this morning</span></span>');
    });
  });

  describe('truncating text with links', function() {
    it('should truncate a text span', function() {
      const text = 'Joe bookmarked http://opengov.com yesterday in his browser'; 
      const wrapper = shallow(<AutoLinkText text={text} maxLength={36} />);
      expect(wrapper.html()).toEqual('<span><span>Joe bookmarked </span><a href="http://opengov.com">opengov.com</a><span> yesterday</span></span>');
    });

    it('should allow "maxLength" prop to be a string', function() {
      const text = 'This message will be cut off'; 
      const wrapper = shallow(<AutoLinkText text={text} maxLength={13} />);
      expect(wrapper.html()).toEqual('<span><span>This message </span></span>');
    });
  });
});
