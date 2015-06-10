var context = require.context('./src', true, /_test$/);
context.keys().forEach(context);
