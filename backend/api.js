const path = require('path');
const fs = require('fs');
const http = require('http');
const url = require('url');
const PORT = 3000;

const model = {
	id: '',
	revision: 1
};

const mimeLookup = {
	'.js': 'application/javascript',
	'.html': 'text/html'
};

http
	.createServer((request, response) => {
		if (request.method === 'GET') {
			const fileUrl = request.url === '/' ? 'index.html' : request.url;
			const filepath = path.resolve('./src/' + fileUrl);

			if (fileUrl.startsWith('/get-model?id=')) {
				model.id = url.parse(request.url, true).query.id;
				model.revision = model.revision + 1;

				response.setHeader('Content-Type', 'application/json');
				response.end(JSON.stringify(model));

				return;
			}

			fs.exists(filepath, (exists) => {
				if (!exists) {
					response.writeHead(404, {'Content-Type': 'text/plain'});
					response.write('Error 404: Resource not found.');
					response.end();

					return;
				}

				const mimeType = mimeLookup[path.extname(filepath)] || 'text/plain';

				response.writeHead(200, {'Content-Type': mimeType});
				fs.createReadStream(filepath).pipe(response);

			});

		}
	})
	.listen(PORT, (err) => {
		if (err) {
			return console.log('Something bad happened', err);
		}

		console.log(`Server is listening on ${PORT}. Open http://localhost:${PORT}/ in Chrome Canary with --js-flags="--harmony-weak-refs --expose-gc".`);

		const chromeLauncher = require('chrome-launcher');

		chromeLauncher.launch({
			startingUrl: `http://localhost:${PORT}/`,
			chromeFlags: ['--js-flags=--harmony-weak-refs --expose-gc']
		});
	});
