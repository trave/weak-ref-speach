import {ApiTransport} from './api-transport.js';
import {component} from './component.js';

const apiTransport = new ApiTransport('/');

document.querySelectorAll('.component')
	.forEach((dom, i) => component(
		dom,
		(id) => apiTransport.getDynamicModel(id),
		'Component ' + (i + 1)
	));

window.apiTransport = apiTransport;
