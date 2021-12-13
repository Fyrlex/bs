import { Snowflake } from 'discord-api-types';
import { FastifyInstance, RouteShorthandOptions, HookHandlerDoneFunction } from 'fastify';
import { BS } from '../../../structures/BSClient.js';

const router = (fastify: FastifyInstance, options: RouteShorthandOptions, done: HookHandlerDoneFunction): void => {
  fastify.delete('/', async (req, res) => {
    const body = req.body as { commands: string[] };
    await BS.managers.commands.deleteGlobalCommands(...body.commands ?? []);
    return res.status(200).send({
      error: false,
      message: 'Commands have been deleted globally.'
    });
  });

  fastify.delete('/:id', async (req, res) => {
    const id = (req.params as { id: Snowflake }).id;
    const guild = BS.guilds.cache.get(id);

    const body = req.body as { commands: string[] };

    if (!guild) {
      return res.status(404).send({
        error: true,
        message: 'Guild not found.'
      });
    } else {
      await BS.managers.commands.deleteGuildCommands(guild, ...body.commands ?? []);
      return res.status(200).send({
        error: false,
        message: `Commands have been deleted from ${guild.name} (${guild.id}).`
      });
    }
  });

  fastify.get('/', async (req, res) => {
    return res.status(200).send({
      error: false,
      message: 'Global commands fetched.',
      data: await BS.managers.commands.getGlobalCommands()
    });
  });

  fastify.get('/:id', async (req, res) => {
    const id = (req.params as { id: Snowflake }).id;
    const guild = BS.guilds.cache.get(id);

    if (!guild) {
      return res.status(404).send({
        error: true,
        message: 'Guild not found.'
      });
    } else {
      return res.status(200).send({
        error: false,
        message: `Commands have been fetched from ${guild.name} (${guild.id}).`,
        data: await BS.managers.commands.getGuildCommands(guild)
      });
    }
  });

  fastify.patch('/:id', async (req, res) => {
    const id = (req.params as { id: Snowflake }).id;
    const guild = BS.guilds.cache.get(id);
    if (guild) {
      // await BS.managers.commands.
    }
  });

  fastify.post('/', async (req, res) => {
    await BS.managers.commands.postGlobalCommands().catch(e => {
      return res.status(500).send({
        error: true,
        message: 'There was an error while posting guild commands',
        data: e
      });
    });

    return res.status(200).send({
      error: false,
      message: 'Commands have been posted globally.'
    });
  });

  fastify.post('/:id', async (req, res) => {
    const id = (req.params as { id: Snowflake }).id;
    const guild = BS.guilds.cache.get(id);

    if (!guild) {
      return res.status(404).send({
        error: true,
        message: 'Guild not found.'
      });
    } else {
      await BS.managers.commands.postGuildCommands(guild).catch(e => {
        return res.status(500).send({
          error: true,
          message: 'There was an error while posting guild commands.',
          data: e
        });
      });

      return res.status(200).send({
        error: false,
        message: `Commands have been posted to ${guild.name} (${guild.id}).`
      });
    }
  });

  done();
};

export const commandsRouter = { name: 'commands', router };