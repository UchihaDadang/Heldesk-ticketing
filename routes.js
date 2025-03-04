import { handlerLoginAdmin, handlerLoginUser, handlerSubmitReport } from './handler.js';
import Joi from 'joi';

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
    },
    {
        method: 'POST',
        path: '/api/report',
        handler: handlerSubmitReport,
        options: {
            cors: {
                origin: ['http://localhost:5173'],
                headers: ['Accept', 'Content-Type'],
                credentials: false
            },
            validate: {
                payload: Joi.object({
                    feature: Joi.string().required(),
                    data: Joi.object().required()
                }),
                failAction: (request, h, err) => {
                    console.error('Validation Error:', err);
                    throw err;
                }
            }
        }
    }
];

export default routes;