export const component = (dom, getter, title) => {
	let renderedModel = null;
	const render = (event, model) => {
		model = model || renderedModel;
		dom.querySelector('.value').textContent = model.toString();
		dom.querySelector('.title').textContent = title;

		renderedModel = model;
	};

	const input = dom.querySelector('.input');

	const loadAndRender = () => {
		if (renderedModel) {
			renderedModel.removeEventListener(renderedModel.EVENT_CHANGED.type, render);
			renderedModel = null;
		}

		getter(input.value)
			.then((model) => render(null, model))
			.then(() => renderedModel.addEventListener(renderedModel.EVENT_CHANGED.type, render));
	};

	input.addEventListener('change', loadAndRender);
	input.addEventListener('keyup', loadAndRender);

	dom.querySelector('.refresh').addEventListener('click', loadAndRender);

	loadAndRender();
};
