/**
 * @class Autolinker.match.Url
 *
 * Represents a Url match found in an input string which should be Autolinked.
 */
export default class URLMatch {
  constructor(url, protocolUrlMatch, protocolRelativeMatch, position) {
    this._url = url;
    this._protocolUrlMatch = protocolUrlMatch;
    this._protocolRelativeMatch = protocolRelativeMatch;
    this.position = position;
  }

  /**
   * A regular expression used to remove the 'http://' or 'https://' and/or the 'www.' from URLs.
   */
  urlPrefixRegex = /^(https?:\/\/)?(www\.)?/i;

  /**
   * The regular expression used to remove the protocol-relative '//' from the {@link #url} string, for purposes
   * of {@link #getAnchorText}. A protocol-relative URL is, for example, "//yahoo.com"
   */
  protocolRelativeRegex = /^\/\//;

  /**
   * Will be set to `true` if the 'http://' protocol has been prepended to the {@link #url} (because the
   * {@link #url} did not have a protocol)
   */
  protocolPrepended = false;

  stripPrefix = true;

  /**
   * Returns the url that was matched, assuming the protocol to be 'http://' if the original
   * match was missing a protocol.
   *
   * @return {String}
   */
  getUrl() {
    let url = this._url;

    // if the url string doesn't begin with a protocol, assume 'http://'
    if( !this._protocolRelativeMatch && !this._protocolUrlMatch && !this.protocolPrepended ) {
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
  getAnchorHref() {
    var url = this.getUrl();

    return url.replace( /&amp;/g, '&' );  // any &amp;'s in the URL should be converted back to '&' if they were displayed as &amp; in the source html
  }

  /**
   * Returns the anchor text that should be generated for the match.
   *
   * @return {String}
   */
  getAnchorText() {
    var anchorText = this.getUrl();

    if(this._protocolRelativeMatch) {
      // Strip off any protocol-relative '//' from the anchor text
      anchorText = this.stripProtocolRelativePrefix(anchorText);
    }
    if(this.stripPrefix) {
      anchorText = this.stripUrlPrefix(anchorText);
    }
    anchorText = this.removeTrailingSlash(anchorText);  // remove trailing slash, if there is one

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
  stripUrlPrefix(text) {
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
  stripProtocolRelativePrefix(text) {
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
  removeTrailingSlash(anchorText) {
    if(anchorText.charAt(anchorText.length - 1) === '/') {
      anchorText = anchorText.slice( 0, -1 );
    }
    return anchorText;
  }
}
