async function start(base, options) {
    const fs = require('fs');
    const { promisify } = require('util');
    const server = require('live-server');

    try {
        const html = await promisify(fs.readFile)('./404.html', 'UTF8');

        const params = {
            ...options || {},
            verbose: true,
            mount: [[base, './']],
            middleware: [(req, res, next) => {
                // if is a resource (ends .extension) do not touch the request
                if (req.url.match(/\.[0-9a-z]+$/i)) {
                    next();
                    return;
                }

                // if is a virtual request, SPA behaviour (similar to Github Pages)
                res.setHeader('Content-Type', 'text/html');
                res.write(html);
                res.end();
            }]
        };

        server.start(params);
    } catch (e) {
        console.error(`Dev Server could not be started`, e);
    }
}

const options = {
    port: 8000,
    open: true, // When false, it won't load a new window of your browser.
    // host: '192.168.1.110'

};

start('/webcardinal-app-tester', options);

