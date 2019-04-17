export class DynamicModel extends EventTarget {
	/**
	 * @param {Object} data
	 */
	constructor(data) {
		super();

		/** @type {string} */
		this.id;
		/** @type {number} */
		this.revision;

		/**
		 * @type {Event}
		 */
		this.EVENT_CHANGED = new Event('changed');

		this.parse(data);
	}

	/**
	 * @param {Object} data
	 */
	parse(data) {
		let changed = false;

		if (this.id !== data['id']) {
			this.id = data['id'];
			changed = true;
		}

		if (this.revision !== data['revision']) {
			this.revision = data['revision'];
			changed = true;
		}

		if (changed) {
			this.dispatchEvent(this.EVENT_CHANGED);
		}
	}

	toString() {
		return `DynamicModel ${this.id} at ${this.revision}`;
	}
}
