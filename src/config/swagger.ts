import swaggerJSDoc, { SwaggerDefinition, Options } from 'swagger-jsdoc'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Interview Test API',
    version: '3.0.0',
    description: 'Swagger documentation for Interview Test API',
  },
};

const options: Options = {
    swaggerDefinition,
    apis: ['src/api-swagger.yaml'],
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec
