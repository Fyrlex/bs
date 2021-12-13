import { Client, Collection } from 'discord.js';
import fastify, { FastifyInstance } from 'fastify';
import fastifyExpress from 'fastify-express';
import { BSCommand, BSEvent, BSEventNames } from '../../typings/bot.js';
import { router } from '../api/index.js';
import { BSGameManager } from '../managers/BSGameManager.js';
import { CommandManager } from '../managers/CommandManager.js';
import { EventManager } from '../managers/EventManager.js';
import { settings } from '../settings/settings.js';

export class BSClient extends Client {
  private readonly _fastify: FastifyInstance;

  public readonly startTimestamp = Date.now();

  public readonly games: BSGameManager;

  public readonly managers = {
    commands: new CommandManager(this),
    events: new EventManager()
  };

  public readonly statuses = settings.statuses;

  public commands = new Collection<string, BSCommand>();
  public events = new Collection<BSEventNames, BSEvent>();
  public debug: boolean;
  public ready = false;

  constructor() {
    super({ intents: ['GUILDS'] });
    this._fastify = fastify();
    this.debug = false;
    this.games = new BSGameManager(this);
  }

  public listen(): void {
    this.on('debug', (info) => {
      if (!this.debug) return;
      this.events.get('debug')!.run(this, info);
    });

    this.on('guildCreate', (guild) => {
      this.events.get('guildCreate')!.run(this, guild);
    });

    this.on('interactionCreate', (interaction) => {
      this.events.get('interactionCreate')!.run(this, interaction);
    });

    this.on('ready', () => {
      this.events.get('ready')!.run(this);
    });
  }

  public async load(): Promise<void> {
    this.commands = await this.managers.commands.import();
    this.events = await this.managers.events.import();

    await this._fastify.register(fastifyExpress);
    await this._fastify.register(router);
    await this._fastify.listen(parseInt(process.env.PORT!), '127.0.0.1');
  }
}

export const BS = new BSClient();