import { BaseClient, CommandInteraction } from 'discord.js';
import { BSGame } from '../lib/structures/BSGame.js';
import { Deck } from '../lib/structures/Deck.js';
import { Player } from '../lib/structures/Player.js';
import { BSCommand } from '../typings/bot.js';

export default {
  name: 'bs',
  description: 'Create a BS game',
  dev: false,
  ephemeral: true,
  comingSoon: true,
  options: [
    {
      type: 'USER',
      description: 'Players to invite to your game.',
      name: 'players',
      required: true
    }
  ],
  run: async (client: BaseClient, interaction: CommandInteraction) => {

  }
} as BSCommand;