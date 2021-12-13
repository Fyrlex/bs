import { ApplicationCommandOption } from 'discord.js';
import { BSClient } from '../lib/structures/BSClient.js';

export interface BSCommand {
  readonly name: string
  readonly comingSoon: boolean
  readonly description: string
  readonly dev: boolean
  readonly ephemeral: boolean
  readonly options: ApplicationCommandOption[]
  run: (client: BSClient, ...param: unknown[]) => Promise<unknown>
}

export interface BSEvent {
  readonly name: string
  run: (client: BSClient, ...param: unknown[]) => Promise<unknown>
}


export type BSEventNames = 'debug' | 'guildCreate' | 'interactionCreate' | 'ready';