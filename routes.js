import { 
    handlerLoginAdmin,
    handlerLoginUser, 
    handlerSubmitReport,
    handlerGetAllReports,
    handlerGetCrimeReports,
    handlerUpdateReportStatus,
    handlerDeleteCompliteReport,
    handlerDeleteCompliteReportAll,
    handlerGetMissingReport,
    handlerGetDomesticViolenceReport,
    handlerGetDBulyyingReport,
    handlerGetSuspiciousActivityReport,
    handlerGetDataToCart,
    handlerGetNumberQueues,
    handlerUpdateQueuesById,
    handlerResetQueueNumber,
    feedbackHandler,
    verifyToken,
    handlerGetAllFeedback,
    handlerGetFeedbackById,
    handlerDeleteAllFeedback,
    handlerDeleteFeedbackById,
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
        method: 'GET',
        path: '/api/report/missing',
        handler: handlerGetMissingReport,
        options: {
            auth: false,
            cors: {
                origin: ['http://localhost:5173'],
                headers: ['Accept', 'Content-type', 'Authorization']
            }
        }
    },

    {
        method: 'GET',
        path: '/api/report/domestic-violence',
        handler: handlerGetDomesticViolenceReport,
        options: {
            auth: false,
            cors: {
                origin: ['http://localhost:5173'],
                headers: ['Accept', 'Content-type', 'Authorization']
            }
        }
    },

    {
        method: 'GET',
        path: '/api/report/bullying',
        handler: handlerGetDBulyyingReport,
        options: {
            auth: false,
            cors: {
                origin: ['http://localhost:5173'],
                headers: ['Accept', 'Content-type', 'Authorization']
            }
        }
    },

    {
        method: 'GET',
        path: '/api/report/suspecious-activity',
        handler: handlerGetSuspiciousActivityReport,
        options: {
            auth: false,
            cors: {
                origin: ['http://localhost:5173'],
                headers: ['Accept', 'Content-type', 'Authorization']
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

    {
        method: "GET",
        path: "/api/report/stats",
        handler: handlerGetDataToCart,
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
        method: "GET",
        path: "/api/ticket/queues",
        handler: handlerGetNumberQueues,
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
        method: "PUT",
        path: "/api/ticket/queues/{id}",
        handler: handlerUpdateQueuesById,
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
        method: "PUT",
        path: "/api/ticket/queues/reset",
        handler: handlerResetQueueNumber,
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
        method: "POST",
        path: "/api/feedback",
        handler: feedbackHandler,
        options: {
            pre: [{ method: verifyToken }],
            auth: false,
            cors: {
                origin: ["http://localhost:5173"],
                headers: ["Accept", "Content-Type", "Authorization"],
                credentials: false
            }
        }
    },

    {
        method: "GET",
        path: "/api/feedback",
        handler: handlerGetAllFeedback,
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
        method: "GET",
        path: "/api/feedback/{id}",
        handler: handlerGetFeedbackById,
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
        path: "/api/feedback",
        handler: handlerDeleteAllFeedback,
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
        path: "/api/feedback/{id}",
        handler: handlerDeleteFeedbackById,
        options: {
            auth: false,
            cors: {
                origin: ["http://localhost:5173"],
                headers: ["Accept", "Content-Type", "Authorization"],
                credentials: false
            }
        }
}

    
    
    
   
];

export default routes;