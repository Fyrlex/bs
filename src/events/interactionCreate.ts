import { CommandInteraction } from 'discord.js';
import { BSClient } from '../lib/structures/BSClient.js';
import { BSEvent } from '../typings/bot.js';

export default {
  name: 'interactionCreate',
  run: async (client: BSClient, interaction: CommandInteraction) => {
    if (!client.ready) return;
    if (interaction.type === 'APPLICATION_COMMAND') {
      const command = client.commands.get(interaction.commandName)!;

      await interaction.deferReply({ ephemeral: command.ephemeral }).catch(() => { });

      command.run(client, interaction).catch(console.error);
    }
  }
} as BSEvent;