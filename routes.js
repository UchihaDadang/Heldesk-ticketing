import { 
    handlerLoginAdmin,
    handlerLoginUser, 
    handlerSubmitReport,
    handlerGetAllReports,
    handlerGetCrimeReports,
    handlerUpdateReportStatus,
    handlerDeleteCompliteReport,
    handlerDeleteCompliteReportAll,
 } from './handler.js';
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
    },

    {
        method: 'GET',
        path: '/api/report/all',
        handler: handlerGetAllReports,
        options: {
            auth: false,
            cors: {
                origin: ['http://localhost:5173'],
                headers: ['Accept', 'Content-Type', 'Authorization'],
                credentials: true
            },
            validate: {
                query: Joi.object({
                    page: Joi.number().integer().min(1).default(1),
                    limit: Joi.number().integer().min(1).max(100).default(10)
                }),
                failAction: (request, h, err) => {
                    console.error('Validation Error:', err);
                    return h.response({ message: 'Invalid query parameters', details: err.details }).code(400);
                }
            }
        }
    },
    
    {
        method: 'GET',
        path: '/api/report/crime',
        handler: handlerGetCrimeReports,
        options: {
            auth: false,
            cors: {
                origin: ['http://localhost:5173'],
                headers: ['Accept', 'Content-Type', 'Authorization']
            }
        }
    },
    
    {
        method: "PUT",
        path: "/api/report/{type}/{id}",
        handler: handlerUpdateReportStatus,
        options: {
            auth: false,
            cors: {
                origin: ["http://localhost:5173"],
                headers: ["Accept", "Content-Type", "Authorization"],
                credentials: false
            }
        }
    },
    
    {
        method: "DELETE",
        path: "/api/report/{type}/{id}/delete",
        handler: handlerDeleteCompliteReport,
        options: {
            auth: false,
            cors: {
                origin: ["http://localhost:5173"],
                headers: ["Accept", "Content-Type", "Authorization"],
                credentials: false
            }
        }
    },

    {
        method: "DELETE",
        path: "/api/report/{type}/delete",
        handler: handlerDeleteCompliteReportAll,
        options: {
            auth: false,
            cors: {
                origin: ["http://localhost:5173"],
                headers: ["Accept", "Content-Type", "Authorization"],
                credentials: false
            }
        }
    },
    
    
   
];

export default routes;