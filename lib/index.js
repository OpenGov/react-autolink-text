'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPureRenderFunction = require('react-pure-render/function');

var _reactPureRenderFunction2 = _interopRequireDefault(_reactPureRenderFunction);

var _match_parser = require('./match_parser');

var _match_parser2 = _interopRequireDefault(_match_parser);

var AutoLinkText = (function (_React$Component) {
  _inherits(AutoLinkText, _React$Component);

  function AutoLinkText() {
    _classCallCheck(this, AutoLinkText);

    _get(Object.getPrototypeOf(AutoLinkText.prototype), 'constructor', this).apply(this, arguments);

    this.shouldComponentUpdate = _reactPureRenderFunction2['default'];
  }

  _createClass(AutoLinkText, [{
    key: 'render',
    value: function render() {
      var _context;

      var text = this.props.text || '';
      var target = this.props.target || '_self';
      return _react2['default'].createElement(
        'span',
        null,
        (_context = (_context = (_context = (0, _match_parser2['default'])(text), prepareElements).call(_context, text, target), truncate).call(_context, this.props.maxLength), keyElements).call(_context)
      );
    }
  }]);

  return AutoLinkText;
})(_react2['default'].Component);

exports['default'] = AutoLinkText;

function prepareElements(text, target) {
  var elements = [];
  var lastIndex = 0;

  this.forEach(function (match) {
    if (match.position.start !== 0) {
      elements.push(_react2['default'].createElement(
        'span',
        null,
        text.slice(lastIndex, match.position.start)
      ));
    }
    elements.push(_react2['default'].createElement(
      'a',
      { href: match.getAnchorHref(), target: target },
      match.getAnchorText()
    ));
    lastIndex = match.position.end;
  });

  if (lastIndex < text.length) {
    elements.push(_react2['default'].createElement(
      'span',
      null,
      text.slice(lastIndex)
    ));
  }

  return elements;
}

function truncate(maxLength) {
  if (!maxLength) return this;

  var elements = [];
  var length = 0;

  this.some(function (el) {
    length += el.props.children.length;

    if (length > maxLength) {
      var truncatedText = el.props.children.slice(0, -(length - maxLength));
      elements.push(_react2['default'].cloneElement(el, {}, truncatedText));
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
  return this.map(function (el, index) {
    return _react2['default'].cloneElement(el, { key: index });
  });
}

AutoLinkText.propTypes = {
  text: _react2['default'].PropTypes.string,
  maxLength: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.number, _react2['default'].PropTypes.string])
};
module.exports = exports['default'];