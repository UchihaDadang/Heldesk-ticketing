import { handlerLoginAdmin } from './handler.js';

const routes = [
    {
        method: 'POST',
        path: '/login',
        handler: handlerLoginAdmin,
    }
];

export default routes;