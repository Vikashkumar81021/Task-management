import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description: "API documentation for Task Management System",
    },

    servers: [
      {
        url: "https://task-management-ilmz.onrender.com",
      },
    ],

    components: {
   
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },

  
      schemas: {
     
        User: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            id: {
              type: "string",
            },
            name: {
              type: "string",
              example: "Vikas Kumar",
            },
            email: {
              type: "string",
              example: "vikas@gmail.com",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              example: "user",
            },
            password: {
              type: "string",
              example: "********",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Task: {
          type: "object",
          required: ["title", "description"],
          properties: {
            id: {
              type: "string",
            },
            title: {
              type: "string",
              example: "Complete backend task",
            },
            description: {
              type: "string",
              example: "Make full Task CRUD with Swagger",
            },
            status: {
              type: "string",
              enum: ["pending", "in-progress", "completed"],
              example: "pending",
            },
            assignedTo: {
              type: "string",
              example: "671df9d23fbb8b7d9cfda358",
            },
            createdBy: {
              type: "string",
              example: "671df9d23fbb8b7d9cfda358",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },

    security: [{ cookieAuth: [] }],
  },


  apis: ["./src/controllers/*.js"],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
