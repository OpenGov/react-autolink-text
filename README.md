\<AutoLinkText /\>
================

[![build status](https://img.shields.io/travis/OpenGov/react-autolink-text/master.svg?style=flat-square)](https://travis-ci.org/OpenGov/react-autolink-text)

A React component for converting URLs in a given string of text into clicking link tags.

Installation
------------
`npm install react-autolink-text`

Usage
-----
```js
import React from 'react';
import AutoLinkText from 'react-autolink-text';
  
React.render(
  <AutoLinkText text="Check out this cool component: http://github.com/OpenGov/react-autolink-text" />,
  document.body
);
```

Thanks
------
Thank you to @gregjacobs for creating [Autolinker.js](https://github.com/gregjacobs/Autolinker.js) from which this component was based.
