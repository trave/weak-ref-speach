import {DynamicModel} from './dynamic-model.js';
import {UniqueCollection} from './unique-collection.js';

/*const uniqueDynamicModels = new UniqueCollection(
	(data) => new DynamicModel(data),
	(m, data) => m.id === data['id'],
	(m, data) => m.parse(data)
);*/

export class ApiTransport {
	#endpoint;

	constructor(endpoint) {
		this.#endpoint = endpoint;
	}

	/**
	 * @param {string} id
	 * @return {Promise<DynamicModel>}
	 */
	getDynamicModel(id) {
		return fetch(`${this.#endpoint}get-model?id=` + encodeURIComponent(id))
			.then((response) => response.json())
			//.then((data) => uniqueDynamicModels.createModel(data));
			.then((data) => new DynamicModel(data));
	}
}
