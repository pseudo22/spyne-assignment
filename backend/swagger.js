// src/swagger.js or config/swagger.js

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
    definition: {
      openapi: "3.0.0", // Specify OpenAPI version (3.0.0)
      info: {
        title: "Car Management API", // API title
        description: "API documentation for Car Management application", // API description
      },
      components: {
        responses: {
          ApiResponse: {
            description: 'Standard API response structure',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    statusCode: { type: 'integer', example: 200 },
                    data: {
                      type: 'object',
                      example: {
                        carName: 'Toyota',
                        description: 'A reliable car',
                        company: 'Toyota',
                        year: 2020,
                        price: 20000
                      },
                    },
                    message: { type: 'string', example: 'Request successful' },
                  },
                },
              },
            },
          },
        },
      },
      paths: {
        "/api/create": {
          post: {
            summary: "Create a new user",
            description: "This endpoint is used to create a new user",
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      email: { type: 'string' },
                      username: { type: 'string' },
                      password: { type: 'string' },
                    },
                  },
                },
              },
            },
            responses: {
              201: {
                description: 'User created successfully',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/responses/ApiResponse' },
                  },
                },
              },
              400: {
                description: 'Bad request',
              },
            },
          },
        },
        "/api/logout": {
          post: {
            summary: "Logout user",
            description: "This endpoint logs out the current user",
            responses: {
              200: {
                description: 'User logged out successfully',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/responses/ApiResponse' },
                  },
                },
              },
              400: {
                description: 'Invalid refresh token',
              },
            },
          },
        },
        "/api/list": {
          get: {
            summary: "List cars by user",
            description: "This endpoint fetches all the cars of the logged-in user",
            responses: {
              200: {
                description: 'List of cars fetched successfully',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/responses/ApiResponse' },
                  },
                },
              },
              404: {
                description: 'User not found',
              },
            },
          },
        },
        "/api/add": {
          post: {
            summary: "Add a car",
            description: "This endpoint allows the user to add a car",
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      carName: { type: 'string' },
                      description: { type: 'string' },
                      company: { type: 'string' },
                      carType: { type: 'string' },
                      dealer: { type: 'string' },
                      color: { type: 'string' },
                      mileage: { type: 'number' },
                      year: { type: 'integer' },
                      price: { type: 'number' },
                    },
                  },
                },
              },
            },
            responses: {
              201: {
                description: 'Car added successfully',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/responses/ApiResponse' },
                  },
                },
              },
              400: {
                description: 'Required fields missing or invalid image count',
              },
            },
          },
        },
        "/api/search": {
          post: {
            summary: "Search cars globally",
            description: "This endpoint allows searching cars based on keyword and tags",
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      searchKeyword: { type: 'string' },
                      selectedTag: { type: 'string' },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: 'Cars matching search criteria',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/responses/ApiResponse' },
                  },
                },
              },
              404: {
                description: 'No cars found',
              },
            },
          },
        },
        "/api/view/{carId}": {
          get: {
            summary: "View car details",
            description: "This endpoint fetches details of a car by ID",
            parameters: [
              {
                name: "carId",
                in: "path",
                required: true,
                description: "ID of the car to view",
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              200: {
                description: 'Car details fetched successfully',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/responses/ApiResponse' },
                  },
                },
              },
              400: {
                description: 'Invalid Car ID',
              },
              404: {
                description: 'Car not found',
              },
            },
          },
        },
        "/api/update/{carId}": {
          put: {
            summary: "Update car details",
            description: "This endpoint allows updating the details of an existing car",
            parameters: [
              {
                name: "carId",
                in: "path",
                required: true,
                description: "ID of the car to update",
                schema: {
                  type: "string",
                },
              },
            ],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      carName: { type: 'string' },
                      description: { type: 'string' },
                      company: { type: 'string' },
                      carType: { type: 'string' },
                      dealer: { type: 'string' },
                      color: { type: 'string' },
                      mileage: { type: 'number' },
                      year: { type: 'integer' },
                      price: { type: 'number' },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: 'Car updated successfully',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/responses/ApiResponse' },
                  },
                },
              },
              400: {
                description: 'Invalid input data',
              },
              404: {
                description: 'Car not found',
              },
            },
          },
        },
        "/api/delete/{carId}": {
          delete: {
            summary: "Delete a car",
            description: "This endpoint allows deleting a car",
            parameters: [
              {
                name: "carId",
                in: "path",
                required: true,
                description: "ID of the car to delete",
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              200: {
                description: 'Car deleted successfully',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/responses/ApiResponse' },
                  },
                },
              },
              400: {
                description: 'Invalid Car ID',
              },
              404: {
                description: 'Car not found',
              },
            },
          },
        },
      },
    },
    apis: ['./routes/*.js'], // Path to your route files
  };
  

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export { swaggerDocs, swaggerUi };
