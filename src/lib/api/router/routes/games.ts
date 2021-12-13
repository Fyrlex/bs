import { FastifyInstance, HookHandlerDoneFunction, RouteShorthandOptions } from 'fastify';
import * as routers from './games/index.js';
import { BS } from '../../../structures/BSClient.js';
import { Snowflake } from 'discord-api-types';

const router = async (fastify: FastifyInstance, options: RouteShorthandOptions, done: HookHandlerDoneFunction): Promise<void> => {
  fastify.delete('/:id', async (req, res) => {
    const id = (req.params as { id: Snowflake }).id;
    if (!id) return res.status(400).send({
      error: true,
      message: 'Please provide a game ID in the path.'
    });

    const game = BS.games.cache.get(id);
    if (!game) return res.status(404).send({
      error: true,
      message: 'Game not found with provided ID.'
    });

    BS.games.cache.delete(game.id);

    return res.status(200).send({
      error: false,
      message: 'Game successfully deleted.'
    });
  });

  fastify.get('/:id', async (req, res) => {
    const id = (req.params as { id: Snowflake }).id;
    if (!id) return res.status(400).send({
      error: true,
      message: 'Please provide a game ID in the path.'
    });

    const game = BS.games.cache.get(id);
    if (!game) return res.status(404).send({
      error: true,
      message: 'User not found with provided ID.'
    });

    return res.status(200).send({
      error: false,
      message: 'Game successfully found.',
      data: game
    });
  });

  fastify.post('/', async (req, res) => {
    const game = BS.games.create(true);

    return res.status(200).send({
      error: false,
      message: 'Game successfully created.',
      data: game
    });
  });

  for (const router of Object.values(routers)) await fastify.register(router.router, { prefix: `/:id/${router.name}` });

  done();
};

export const usersRouter = { name: 'games', router };