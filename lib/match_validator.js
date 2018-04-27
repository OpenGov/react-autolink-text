'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isValidMatch = isValidMatch;
var uriSchemeRegex = /^[A-Za-z][-.+A-Za-z0-9]+:/;
var hasFullProtocolRegex = /^[A-Za-z][-.+A-Za-z0-9]+:\/\//;
var hasWordCharAfterProtocolRegex = /:[^\s]*?[A-Za-z]/;
var invalidProtocolRelMatchRegex = /^[\w]\/\//;

/**
 * Determines if a given match found by the match parser is valid.
 * Will return `false` for:
 *
 * 1) URL matches which do not have at least have one period ('.') in the
 *    domain name (effectively skipping over matches like "abc:def").
 *    However, URL matches with a protocol will be allowed (ex: 'http://localhost')
 * 2) URL matches which do not have at least one word character in the
 *    domain name (effectively skipping over matches like "git:1.0").
 * 3) A protocol-relative url match (a URL beginning with '//') whose
 *    previous character is a word character (effectively skipping over
 *    strings like "abc//google.com")
 *
 * Otherwise, returns `true`.
 *
 * @param {String} urlMatch The matched URL, if there was one. Will be an
 *   empty string if the match is not a URL match.
 * @param {String} protocolUrlMatch The match URL string for a protocol
 *   match. Ex: 'http://yahoo.com'. This is used to match something like
 *   'http://localhost', where we won't double check that the domain name
 *   has at least one '.' in it.
 * @param {String} protocolRelativeMatch The protocol-relative string for a
 *   URL match (i.e. '//'), possibly with a preceding character (ex, a
 *   space, such as: ' //', or a letter, such as: 'a//'). The match is
 *   invalid if there is a word character preceding the '//'.
 * @return {Boolean} `true` if the match given is valid and should be
 *   processed, or `false` if the match is invalid and/or should just not be
 *   processed.
 */

function isValidMatch(urlMatch, protocolUrlMatch, protocolRelativeMatch) {
  if (protocolUrlMatch && !isValidUriScheme(protocolUrlMatch) || urlMatchDoesNotHaveProtocolOrDot(urlMatch, protocolUrlMatch) || // At least one period ('.') must exist in the URL match for us to consider it an actual URL, *unless* it was a full protocol match (like 'http://localhost')
  urlMatchDoesNotHaveAtLeastOneWordChar(urlMatch, protocolUrlMatch) || // At least one letter character must exist in the domain name after a protocol match. Ex: skip over something like "git:1.0"
  isInvalidProtocolRelativeMatch(protocolRelativeMatch) // A protocol-relative match which has a word character in front of it (so we can skip something like "abc//google.com")
  ) {
      return false;
    }

  return true;
}

/**
 * Determines if the URI scheme is a valid scheme to be autolinked. Returns
 * `false` if the scheme is 'javascript:' or 'vbscript:'
 *
 * @private
 * @param {String} uriSchemeMatch The match URL string for a full URI scheme
 *   match. Ex: 'http://yahoo.com' or 'mailto:a@a.com'.
 * @return {Boolean} `true` if the scheme is a valid one, `false` otherwise.
 */
function isValidUriScheme(uriSchemeMatch) {
  var uriScheme = uriSchemeMatch.match(uriSchemeRegex)[0].toLowerCase();

  return uriScheme !== 'javascript:' && uriScheme !== 'vbscript:';
}

/**
 * Determines if a URL match does not have either:
 *
 * a) a full protocol (i.e. 'http://'), or
 * b) at least one dot ('.') in the domain name (for a non-full-protocol
 *    match).
 *
 * Either situation is considered an invalid URL (ex: 'git:d' does not have
 * either the '://' part, or at least one dot in the domain name. If the
 * match was 'git:abc.com', we would consider this valid.)
 *
 * @private
 * @param {String} urlMatch The matched URL, if there was one. Will be an
 *   empty string if the match is not a URL match.
 * @param {String} protocolUrlMatch The match URL string for a protocol
 *   match. Ex: 'http://yahoo.com'. This is used to match something like
 *   'http://localhost', where we won't double check that the domain name
 *   has at least one '.' in it.
 * @return {Boolean} `true` if the URL match does not have a full protocol,
 *   or at least one dot ('.') in a non-full-protocol match.
 */
function urlMatchDoesNotHaveProtocolOrDot(urlMatch, protocolUrlMatch) {
  return !!urlMatch && (!protocolUrlMatch || !hasFullProtocolRegex.test(protocolUrlMatch)) && urlMatch.indexOf('.') === -1;
}

/**
 * Determines if a URL match does not have at least one word character after
 * the protocol (i.e. in the domain name).
 *
 * At least one letter character must exist in the domain name after a
 * protocol match. Ex: skip over something like "git:1.0"
 *
 * @private
 * @param {String} urlMatch The matched URL, if there was one. Will be an
 *   empty string if the match is not a URL match.
 * @param {String} protocolUrlMatch The match URL string for a protocol
 *   match. Ex: 'http://yahoo.com'. This is used to know whether or not we
 *   have a protocol in the URL string, in order to check for a word
 *   character after the protocol separator (':').
 * @return {Boolean} `true` if the URL match does not have at least one word
 *   character in it after the protocol, `false` otherwise.
 */
function urlMatchDoesNotHaveAtLeastOneWordChar(urlMatch, protocolUrlMatch) {
  if (urlMatch && protocolUrlMatch) {
    return !hasWordCharAfterProtocolRegex.test(urlMatch);
  } else {
    return false;
  }
}

/**
 * Determines if a protocol-relative match is an invalid one. This method
 * returns `true` if there is a `protocolRelativeMatch`, and that match
 * contains a word character before the '//' (i.e. it must contain
 * whitespace or nothing before the '//' in order to be considered valid).
 *
 * @private
 * @param {String} protocolRelativeMatch The protocol-relative string for a
 *   URL match (i.e. '//'), possibly with a preceding character (ex, a
 *   space, such as: ' //', or a letter, such as: 'a//'). The match is
 *   invalid if there is a word character preceding the '//'.
 * @return {Boolean} `true` if it is an invalid protocol-relative match,
 *   `false` otherwise.
 */
function isInvalidProtocolRelativeMatch(protocolRelativeMatch) {
  return !!protocolRelativeMatch && invalidProtocolRelMatchRegex.test(protocolRelativeMatch);
}