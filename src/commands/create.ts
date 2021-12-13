import { BaseClient, CommandInteraction } from 'discord.js';
import { BSGame } from '../lib/structures/BSGame.js';
import { Deck } from '../lib/structures/Deck.js';
import { Player } from '../lib/structures/Player.js';
import { BSCommand } from '../typings/bot.js';

export default {
  name: 'create',
  description: 'Create a BS game',
  dev: false,
  ephemeral: true,
  comingSoon: true,
  options: [
    {
      type: 'USER',
      description: 'Players to invite to your game.',
      name: 'Player #1',
      required: true
    }
  ],
  run: async (client: BaseClient, interaction: CommandInteraction) => {
    const players = interaction.options.get('players');
    console.log(players);
  }
} as BSCommand;