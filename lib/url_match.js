/**
 * @class Autolinker.match.Url
 *
 * Represents a Url match found in an input string which should be Autolinked.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var URLMatch = (function () {
  function URLMatch(url, protocolUrlMatch, protocolRelativeMatch, position) {
    _classCallCheck(this, URLMatch);

    this.urlPrefixRegex = /^(https?:\/\/)?(www\.)?/i;
    this.protocolRelativeRegex = /^\/\//;
    this.protocolPrepended = false;
    this.stripPrefix = true;

    this._url = url;
    this._protocolUrlMatch = protocolUrlMatch;
    this._protocolRelativeMatch = protocolRelativeMatch;
    this.position = position;
  }

  /**
   * A regular expression used to remove the 'http://' or 'https://' and/or the 'www.' from URLs.
   */

  _createClass(URLMatch, [{
    key: 'getUrl',

    /**
     * Returns the url that was matched, assuming the protocol to be 'http://' if the original
     * match was missing a protocol.
     *
     * @return {String}
     */
    value: function getUrl() {
      var url = this._url;

      // if the url string doesn't begin with a protocol, assume 'http://'
      if (!this._protocolRelativeMatch && !this._protocolUrlMatch && !this.protocolPrepended) {
        url = this._url = 'http://' + url;

        this.protocolPrepended = true;
      }

      return url;
    }

    /**
     * Returns the anchor href that should be generated for the match.
     *
     * @return {String}
     */
  }, {
    key: 'getAnchorHref',
    value: function getAnchorHref() {
      var url = this.getUrl();

      return url.replace(/&amp;/g, '&'); // any &amp;'s in the URL should be converted back to '&' if they were displayed as &amp; in the source html
    }

    /**
     * Returns the anchor text that should be generated for the match.
     *
     * @return {String}
     */
  }, {
    key: 'getAnchorText',
    value: function getAnchorText() {
      var anchorText = this.getUrl();

      if (this._protocolRelativeMatch) {
        // Strip off any protocol-relative '//' from the anchor text
        anchorText = this.stripProtocolRelativePrefix(anchorText);
      }
      if (this.stripPrefix) {
        anchorText = this.stripUrlPrefix(anchorText);
      }
      anchorText = this.removeTrailingSlash(anchorText); // remove trailing slash, if there is one

      return anchorText;
    }

    // ---------------------------------------

    // Utility Functionality

    /**
     * Strips the URL prefix (such as "http://" or "https://") from the given text.
     *
     * @private
     * @param {String} text The text of the anchor that is being generated, for which to strip off the
     *   url prefix (such as stripping off "http://")
     * @return {String} The `anchorText`, with the prefix stripped.
     */
  }, {
    key: 'stripUrlPrefix',
    value: function stripUrlPrefix(text) {
      return text.replace(this.urlPrefixRegex, '');
    }

    /**
     * Strips any protocol-relative '//' from the anchor text.
     *
     * @private
     * @param {String} text The text of the anchor that is being generated, for which to strip off the
     *   protocol-relative prefix (such as stripping off "//")
     * @return {String} The `anchorText`, with the protocol-relative prefix stripped.
     */
  }, {
    key: 'stripProtocolRelativePrefix',
    value: function stripProtocolRelativePrefix(text) {
      return text.replace(this.protocolRelativeRegex, '');
    }

    /**
     * Removes any trailing slash from the given `anchorText`, in preparation for the text to be displayed.
     *
     * @private
     * @param {String} anchorText The text of the anchor that is being generated, for which to remove any trailing
     *   slash ('/') that may exist.
     * @return {String} The `anchorText`, with the trailing slash removed.
     */
  }, {
    key: 'removeTrailingSlash',
    value: function removeTrailingSlash(anchorText) {
      if (anchorText.charAt(anchorText.length - 1) === '/') {
        anchorText = anchorText.slice(0, -1);
      }
      return anchorText;
    }
  }]);

  return URLMatch;
})();

exports['default'] = URLMatch;
module.exports = exports['default'];

/**
 * The regular expression used to remove the protocol-relative '//' from the {@link #url} string, for purposes
 * of {@link #getAnchorText}. A protocol-relative URL is, for example, "//yahoo.com"
 */

/**
 * Will be set to `true` if the 'http://' protocol has been prepended to the {@link #url} (because the
 * {@link #url} did not have a protocol)
 */