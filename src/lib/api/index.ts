import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { notFound } from '../methods/index.js';
import * as routers from './router/index.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const router = async (fastify: FastifyInstance, options: RouteShorthandOptions): Promise<void> => {
  fastify.setNotFoundHandler(notFound);

  fastify.get('/', async (req, res) => {
    return res.status(200).send({
      error: false,
      message: 'BS is currently online.'
    });
  });

  for (const router of Object.values(routers)) await fastify.register(router.router, { prefix: router.name });
};