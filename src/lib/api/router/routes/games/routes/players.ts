import { FastifyInstance, RouteShorthandOptions, HookHandlerDoneFunction } from 'fastify';
import { BS } from '../../../../../structures/BSClient.js';


const router = (fastify: FastifyInstance, options: RouteShorthandOptions, done: HookHandlerDoneFunction): void => {
  fastify.get('/', async (req, res) => {
    // @ts-ignore
    return BS.games.cache.get(req.params.id);
  });

  done();
};

export const gamePlayersRouter = { name: 'players', router };