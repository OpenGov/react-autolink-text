'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _match_validator = require('./match_validator');

var _url_match = require('./url_match');

var _url_match2 = _interopRequireDefault(_url_match);

// match protocol, allow in format "http://" or "mailto:". However, do not match
// the first part of something like 'link:http://www.google.com' (i.e. don't match "link:").
// Also, make sure we don't interpret 'google.com:8000' as if 'google.com' was a
// protocol here (i.e. ignore a trailing port number in this regex)
var protocolRegex = /(?:[A-Za-z][-.+A-Za-z0-9]+:(?![A-Za-z][-.+A-Za-z0-9]+:\/\/)(?!\d+\/?)(?:\/\/)?)/;

// starting with 'www.'
var wwwRegex = /(?:www\.)/;

// anything looking at all like a domain, non-unicode domains, not ending in a period
var domainNameRegex = /[A-Za-z0-9\.\-]*[A-Za-z0-9\-]/;

// match our known top level domains (TLDs)
var tldRegex = /\.(?:international|construction|contractors|enterprises|photography|productions|foundation|immobilien|industries|management|properties|technology|christmas|community|directory|education|equipment|institute|marketing|solutions|vacations|bargains|boutique|builders|catering|cleaning|clothing|computer|democrat|diamonds|graphics|holdings|lighting|partners|plumbing|supplies|training|ventures|academy|careers|company|cruises|domains|exposed|flights|florist|gallery|guitars|holiday|kitchen|neustar|okinawa|recipes|rentals|reviews|shiksha|singles|support|systems|agency|berlin|camera|center|coffee|condos|dating|estate|events|expert|futbol|kaufen|luxury|maison|monash|museum|nagoya|photos|repair|report|social|supply|tattoo|tienda|travel|viajes|villas|vision|voting|voyage|actor|build|cards|cheap|codes|dance|email|glass|house|mango|ninja|parts|photo|shoes|solar|today|tokyo|tools|watch|works|aero|arpa|asia|best|bike|blue|buzz|camp|club|cool|coop|farm|fish|gift|guru|info|jobs|kiwi|kred|land|limo|link|menu|mobi|moda|name|pics|pink|post|qpon|rich|ruhr|sexy|tips|vote|voto|wang|wien|wiki|zone|bar|bid|biz|cab|cat|ceo|com|edu|gov|int|kim|mil|net|onl|org|pro|pub|red|tel|uno|wed|xxx|xyz|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)\b/;

// Allow optional path, query string, and hash anchor, not ending in the following characters: "?!:,.;"
// http://blog.codinghorror.com/the-problem-with-urls/
var urlSuffixRegex = /[\-A-Za-z0-9+&@#\/%=~_()|'$*\[\]?!:,.;]*[\-A-Za-z0-9+&@#\/%=~_()|'$*\[\]]/;

var charBeforeProtocolRelMatchRegex = /^(.)?\/\//;

var urlRegex = ['(?:', // parens to cover match for protocol (optional), and domain
'(', // *** Capturing group $1, for a protocol-prefixed url (ex: http://google.com)
protocolRegex.source, domainNameRegex.source, ')', '|', '(?:', // non-capturing paren for a 'www.' prefixed url (ex: www.google.com)
'(.?//)?', // *** Capturing group $2 for an optional protocol-relative URL. Must be at the beginning of the string or start with a non-word character
wwwRegex.source, domainNameRegex.source, ')', '|', '(?:', // non-capturing paren for known a TLD url (ex: google.com)
'(.?//)?', // *** Capturing group $3 for an optional protocol-relative URL. Must be at the beginning of the string or start with a non-word character
domainNameRegex.source, tldRegex.source, ')', ')', '(?:' + urlSuffixRegex.source + ')?']. // match for path, query string, and/or hash anchor - optional
join('');

exports['default'] = function () {
  var text = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

  var regex = new RegExp(urlRegex, 'gi');
  var matches = [];

  var match;
  while ((match = regex.exec(text)) !== null) {
    var _match = match;

    var _match2 = _slicedToArray(_match, 4);

    var matchedText = _match2[0];
    var protocolUrlMatch = _match2[1];
    var wwwProtocolRelativeMatch = _match2[2];
    var tldProtocolRelativeMatch = _match2[3];

    var protocolRelativeMatch = wwwProtocolRelativeMatch || tldProtocolRelativeMatch;

    // If it's a protocol-relative '//' match, remove the character
    // before the '//' (which the matcherRegex needed to match due to
    // the lack of a negative look-behind in JavaScript regular
    // expressions)
    if (protocolRelativeMatch) {
      var charBeforeMatch = protocolRelativeMatch.match(charBeforeProtocolRelMatchRegex)[1] || '';

      // fix up the `matchStr` if there was a preceding char before a protocol-relative match, which was needed to determine the match itself (since there are no look-behinds in JS regexes)
      if (charBeforeMatch) {
        matchedText = matchedText.slice(1); // remove the prefixed char from the match
        match.index++;
      }
    }

    if ((0, _match_validator.isValidMatch)(matchedText, protocolUrlMatch, protocolRelativeMatch)) {
      var position = { start: match.index, end: regex.lastIndex };
      matches.push(new _url_match2['default'](matchedText, protocolUrlMatch, protocolRelativeMatch, position));
    }
  }

  return matches;
};

;
module.exports = exports['default'];