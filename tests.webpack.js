require('es5-shim');
import {configure} from 'enzyme';
import ReactSixteenAdapter from 'enzyme-adapter-react-16';

configure({adapter: new ReactSixteenAdapter()});
var context = require.context('./src', true, /_test$/);
context.keys().forEach(context);
