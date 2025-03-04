import Hapi from '@hapi/hapi';
import routes from './routes.js';

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['http://localhost:5173'], // URL frontend Anda
                headers: [
                    'Accept', 
                    'Content-Type', 
                    'Authorization', 
                    'Access-Control-Allow-Origin'
                ],
                credentials: false,
            }
        }
    });

    server.route(routes);
    
    await server.start();
    console.log(`Server Berjalan di`, server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();