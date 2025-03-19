import { 
    handlerLoginAdmin,
    handlerLoginUser, 
    handlerSubmitReport,
    handlerGetAllReports,
    handlerGetCrimeReports,
    handlerUpdateCrimeReportStatus,
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
            auth: false, // Nonaktifkan autentikasi
            cors: {
                origin: ['http://localhost:5173'], // Izinkan akses dari frontend
                headers: ['Accept', 'Content-Type', 'Authorization']
            }
        }
    },
    
    {
        method: 'PUT',
        path: '/api/report/crime/{id}',
        handler: handlerUpdateCrimeReportStatus,
        options: { 
            auth: false,
            cors: {
                origin: ['http://localhost:5173'],
                headers: ['Accept', 'Content-Type', 'Authorization'],
                credentials: false
            }
        }
    },
    
    
    // {
    //     method: 'GET',
    //     path: '/api/reports/missing',
    //     handler: handlerGetMissingReports,
    //     options: {
    //         auth: false,
    //         cors: {
    //             origin: ['http://localhost:5173'],
    //             headers: ['Accept', 'Content-Type', 'Authorization'],
    //             credentials: false
    //         },
    //         validate: {
    //             query: Joi.object({
    //                 page: Joi.number().integer().min(1).default(1),
    //                 limit: Joi.number().integer().min(1).max(100).default(10)
    //             }),
    //             failAction: (request, h, err) => {
    //                 console.error('Validation Error:', err);
    //                 throw err;
    //             }
    //         }
    //     }
    // },

    // {
    //     method: 'GET',
    //     path: '/api/reports/domestic-violence',
    //     handler: handlerGetDomesticViolenceReports,
    //     options: {
    //         auth: false,
    //         cors: {
    //             origin: ['http://localhost:5173'],
    //             headers: ['Accept', 'Content-Type', 'Authorization'],
    //             credentials: false
    //         },
    //         validate: {
    //             query: Joi.object({
    //                 page: Joi.number().integer().min(1).default(1),
    //                 limit: Joi.number().integer().min(1).max(100).default(10)
    //             }),
    //             failAction: (request, h, err) => {
    //                 console.error('Validation Error:', err);
    //                 throw err;
    //             }
    //         }
    //     }
    // },

    // {
    //     method: 'GET',
    //     path: '/api/reports/bullying',
    //     handler: handlerGetBullyingReports,
    //     options: {
    //         auth: false,
    //         cors: {
    //             origin: ['http://localhost:5173'],
    //             headers: ['Accept', 'Content-Type', 'Authorization'],
    //             credentials: false
    //         },
    //         validate: {
    //             query: Joi.object({
    //                 page: Joi.number().integer().min(1).default(1),
    //                 limit: Joi.number().integer().min(1).max(100).default(10)
    //             }),
    //             failAction: (request, h, err) => {
    //                 console.error('Validation Error:', err);
    //                 throw err;
    //             }
    //         }
    //     }
    // },
    
    // {
    //     method: 'GET',
    //     path: '/api/reports/suspicious',
    //     handler: handlerGetSuspiciousActivityReports,
    //     options: {
    //         auth: false,
    //         cors: {
    //             origin: ['http://localhost:5173'],
    //             headers: ['Accept', 'Content-Type', 'Authorization'],
    //             credentials: false
    //         },
    //         validate: {
    //             query: Joi.object({
    //                 page: Joi.number().integer().min(1).default(1),
    //                 limit: Joi.number().integer().min(1).max(100).default(10)
    //             }),
    //             failAction: (request, h, err) => {
    //                 console.error('Validation Error:', err);
    //                 throw err;
    //             }
    //         }
    //     }
    // },
    
    // {
    //     method: 'GET',
    //     path: '/api/reports/feedback',
    //     handler: handlerGetFeedback,
    //     options: {
    //         auth: false,
    //         cors: {
    //             origin: ['http://localhost:5173'],
    //             headers: ['Accept', 'Content-Type', 'Authorization'],
    //             credentials: false
    //         },
    //         validate: {
    //             query: Joi.object({
    //                 page: Joi.number().integer().min(1).default(1),
    //                 limit: Joi.number().integer().min(1).max(100).default(10)
    //             }),
    //             failAction: (request, h, err) => {
    //                 console.error('Validation Error:', err);
    //                 throw err;
    //             }
    //         }
    //     }
    // },
    
    // {
    //     method: 'GET',
    //     path: '/api/reports/search',
    //     handler: handlerSearchReports,
    //     options: {
    //         auth: false, 
    //         cors: {
    //             origin: ['http://localhost:5173'],
    //             headers: ['Accept', 'Content-Type', 'Authorization'],
    //             credentials: false
    //         },
    //         validate: {
    //             query: Joi.object({
    //                 keyword: Joi.string().required(),
    //                 category: Joi.string().valid('crime', 'missing', 'domestic', 'bullying', 'suspicious', 'feedback').required(),
    //                 page: Joi.number().integer().min(1).default(1),
    //                 limit: Joi.number().integer().min(1).max(100).default(10)
    //             }),
    //             failAction: (request, h, err) => {
    //                 console.error('Validation Error:', err);
    //                 throw err;
    //             }
    //         }
    //     }
    // }
];

export default routes;