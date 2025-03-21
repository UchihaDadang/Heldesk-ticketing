import Hapi from '@hapi/hapi';
import routes from './routes.js';

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['http://localhost:5173'],
                headers: ['Accept', 'Content-Type', 'Authorization'],
                credentials: false
            }
        },
        state: {
            strictHeader: true, 
            ignoreErrors: true  
        }
    });

    server.ext('onRequest', (request, h) => {
        const cookies = request.headers.cookie;

        if (cookies) {
            request.headers.cookie = undefined;
        }

        return h.continue;
    });

    server.ext('onPreResponse', (request, h) => {
        const response = request.response;

        if (response.isBoom) {
            console.error('Boom Error:', response.output.payload);
            return h.continue;
        }

        return h.continue;
    });

    server.route(routes);

    await server.start();
    console.log(`Server Berjalan di`, server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init();