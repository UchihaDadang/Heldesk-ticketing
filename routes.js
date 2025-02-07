import { handlerLoginAdmin, handlerLoginUser } from './handler.js';

const routes = [
    {
        method: 'POST',
        path: '/login/admin',
        handler: handlerLoginAdmin,
    },

    {
        method: 'POST',
        path: '/login/user',
        handler: handlerLoginUser,
        options: {
            cors: {
                origin: ['*'],
                headers: ['Content-Type', 'Authorization'],
                credentials: true
            }
        }
    }
];

export default routes;