/**
 * @typedef {Object}
 */
let Data;

/**
 * @typedef {{ref: WeakRef, name: string}}
 */
let Record;

/**
 * @template M
 */
export class UniqueCollection {
	#finalizationGroup;
	#builder;
	#comparator;
	#patcher;
	#collection = [];

	/**
	 * @param {function(Data): M} builder
	 * @param {function(M, Data): boolean} comparator
	 * @param {function(M, Data)} patcher
	 */
	constructor(builder, comparator, patcher) {
		this.#builder = builder;
		this.#comparator = comparator;
		this.#patcher = patcher;

		this.#finalizationGroup = new FinalizationGroup((iterable) => this.cleanUp(iterable));
	}

	/**
	 * @param {Data} data
	 * @return {M}
	 */
	createModel(data) {
		for (let i = 0; i < this.#collection.length; i++) {
			const model = this.#collection[i].deref();
			if (model && this.#comparator(model, data)) {
				this.#patcher(model, data);

				return model;
			}
		}

		const model = this.#builder(data);
		const ref = new WeakRef(model);
		this.#collection.push(ref);

		this.#finalizationGroup.register(model, /** @type {Record} */ ({
			ref,
			name: model.id
		}));

		return model;
	}

	/**
	 * Cleanup collected refs
	 * @param {Iterable<Record>} iterable
	 */
	cleanUp(iterable) {
		for (const record of iterable) {
			const {ref, name} = record;
			const index = this.#collection.indexOf(ref);
			const exists = index !== -1;
			console.log('Clean WeakRef for ' + name, exists);
			if (exists) {
				this.#collection.splice(index, 1);
			}
		}
	}
}
