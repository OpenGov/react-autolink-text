import {isValidMatch} from './match_validator';

// match protocol, allow in format "http://" or "mailto:". However, do not match
// the first part of something like 'link:http://www.google.com' (i.e. don't match "link:").
// Also, make sure we don't interpret 'google.com:8000' as if 'google.com' was a
// protocol here (i.e. ignore a trailing port number in this regex)
const protocolRegex = /(?:[A-Za-z][-.+A-Za-z0-9]+:(?![A-Za-z][-.+A-Za-z0-9]+:\/\/)(?!\d+\/?)(?:\/\/)?)/;

// starting with 'www.'
const wwwRegex = /(?:www\.)/;

// anything looking at all like a domain, non-unicode domains, not ending in a period
const domainNameRegex = /[A-Za-z0-9\.\-]*[A-Za-z0-9\-]/;

// match our known top level domains (TLDs)
const tldRegex = /\.(?:international|construction|contractors|enterprises|photography|productions|foundation|immobilien|industries|management|properties|technology|christmas|community|directory|education|equipment|institute|marketing|solutions|vacations|bargains|boutique|builders|catering|cleaning|clothing|computer|democrat|diamonds|graphics|holdings|lighting|partners|plumbing|supplies|training|ventures|academy|careers|company|cruises|domains|exposed|flights|florist|gallery|guitars|holiday|kitchen|neustar|okinawa|recipes|rentals|reviews|shiksha|singles|support|systems|agency|berlin|camera|center|coffee|condos|dating|estate|events|expert|futbol|kaufen|luxury|maison|monash|museum|nagoya|photos|repair|report|social|supply|tattoo|tienda|travel|viajes|villas|vision|voting|voyage|actor|build|cards|cheap|codes|dance|email|glass|house|mango|ninja|parts|photo|shoes|solar|today|tokyo|tools|watch|works|aero|arpa|asia|best|bike|blue|buzz|camp|club|cool|coop|farm|fish|gift|guru|info|jobs|kiwi|kred|land|limo|link|menu|mobi|moda|name|pics|pink|post|qpon|rich|ruhr|sexy|tips|vote|voto|wang|wien|wiki|zone|bar|bid|biz|cab|cat|ceo|com|edu|gov|int|kim|mil|net|onl|org|pro|pub|red|tel|uno|wed|xxx|xyz|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)\b/;

// Allow optional path, query string, and hash anchor, not ending in the following characters: "?!:,.;"
// http://blog.codinghorror.com/the-problem-with-urls/
const urlSuffixRegex = /[\-A-Za-z0-9+&@#\/%=~_()|'$*\[\]?!:,.;]*[\-A-Za-z0-9+&@#\/%=~_()|'$*\[\]]/;

const charBeforeProtocolRelMatchRegex = /^(.)?\/\//;

const urlRegex = [
	'(?:', // parens to cover match for protocol (optional), and domain
		'(',  // *** Capturing group $1, for a protocol-prefixed url (ex: http://google.com)
			protocolRegex.source,
			domainNameRegex.source,
		')',

		'|',

		'(?:',  // non-capturing paren for a 'www.' prefixed url (ex: www.google.com)
			'(.?//)?',  // *** Capturing group $2 for an optional protocol-relative URL. Must be at the beginning of the string or start with a non-word character
			wwwRegex.source,
			domainNameRegex.source,
		')',

		'|',

		'(?:',  // non-capturing paren for known a TLD url (ex: google.com)
			'(.?//)?',  // *** Capturing group $3 for an optional protocol-relative URL. Must be at the beginning of the string or start with a non-word character
			domainNameRegex.source,
			tldRegex.source,
		')',
	')',

	'(?:' + urlSuffixRegex.source + ')?',  // match for path, query string, and/or hash anchor - optional
].join('');

export default function(text='') {
  const regex = new RegExp(urlRegex, 'gi');
  const matches = [];

  var match;
  while ((match = regex.exec(text)) !== null) {
		const [matchedText, protocolUrlMatch, wwwProtocolRelativeMatch, tldProtocolRelativeMatch] = match;
		const protocolRelativeMatch = wwwProtocolRelativeMatch || tldProtocolRelativeMatch;

		if (isValidMatch(matchedText, protocolUrlMatch, protocolRelativeMatch)) {
	    matches.push({
	      text: matchedText,
	      position: {start: match.index, end: regex.lastIndex}
	    });
		}
  }

  return matches;
};
