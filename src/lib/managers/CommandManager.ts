import { APIApplicationCommandOption, Snowflake } from 'discord-api-types';
import { ApplicationCommand, ApplicationCommandData, ApplicationCommandOptionData, Collection, Guild } from 'discord.js';
import { readdirSync } from 'fs';
import { BSCommand } from '../../typings/bot.js';
import { BSClient } from '../structures/BSClient.js';

export class CommandManager {
  private readonly _client: BSClient;
  private readonly _commands: Collection<string, BSCommand> = new Collection();
  private readonly _applicationCommands: ApplicationCommandData[] = [];

  constructor(client: BSClient) {
    this._client = client;
  }

  public async import(directory = './build/commands'): Promise<Collection<string, BSCommand>> {
    await this.importDir(directory);

    return this._commands;
  }

  public async getGlobalCommands(): Promise<Collection<Snowflake, ApplicationCommand>> {
    return await this._client.application!.commands.fetch();
  }

  public async getGuildCommands(guild: Guild): Promise<Collection<Snowflake, ApplicationCommand>> {
    return await guild.commands.fetch();
  }

  public async deleteGlobalCommands(...commands: string[]): Promise<void> {
    if (commands.length) {
      console.log('Started deleting commands globabbly.');

      for (const [name, command] of await this._client.application!.commands.fetch()) {
        if (!commands.includes(name)) continue;

        await this._client.application!.commands.delete(command);

        console.log(`Deleted ${name} globally.`);
      }
    } else {
      await this._client.application!.commands.set([]);

      console.log('Deleted all commands globally.');
    }
  }

  public async deleteGuildCommands(guild: Guild, ...commands: string[]): Promise<void> {
    if (commands.length) {
      console.log(`Started deleting commands from ${guild.name} (${guild.id})`);

      for (const [name, command] of await guild.commands.fetch()) {
        if (!commands.includes(name)) continue;

        await guild.commands.delete(command);

        console.log(`Deleted ${name} from ${guild.name} (${guild.id})`);
      }
    } else {
      await guild.commands.set([]);

      console.log(`Deleted all commands from ${guild.name} (${guild.id})`);
    }
  }

  public async postGlobalCommands(...commands: string[]): Promise<void> {
    if (commands.length) {
      console.log('Starting posting commands globally');

      for (const commandName of commands) {
        const command = this._commands.get(commandName)!;

        await this._client.application!.commands.create({ name: command.name, description: command.description, options: command.options as unknown as APIApplicationCommandOption[] });

        console.log(`Posted ${commandName} globally`);
      }

      console.log('Finished posting commands globally');
    } else {
      await this._client.application!.commands.set(this._applicationCommands);

      console.log('Overwrote all commands globally');
    }
  }

  public async postGuildCommands(guild: Guild, ...commands: string[]): Promise<void> {
    if (commands.length) {
      console.log(`Started posting commands to ${guild.name}`);

      for (const commandName of commands) {
        const command = this._commands.get(commandName)!;

        await guild.commands.create({ name: command.name, description: command.description, options: command.options as unknown as APIApplicationCommandOption[] });

        console.log(`Posted ${commandName} to ${guild.name}`);
      }

      console.log(`Finished posting commands to ${guild.name}`);
    } else {
      await guild.commands.set(this._applicationCommands);
      console.log(`Overwrote all commands of ${guild.name} (${guild.id}).`);
    }
  }

  private async add(path: string): Promise<void> {
    const command = (await import(`../../../${path}`.slice(0, -4) + 'js')).default as BSCommand;
    this._commands.set(command.name, command);
    this._applicationCommands.push({ name: command.name, description: command.description, options: command.options as ApplicationCommandOptionData[] });
  }

  private async importDir(directory: string) {
    for (const dirent of readdirSync(directory, { withFileTypes: true })) {
      if (dirent.isDirectory()) await this.importDir(`${directory}/${dirent.name}`);
      else if (dirent.isFile() && dirent.name.endsWith('.ts')) await this.add(`${directory}/${dirent.name}`);
    }
  }
}