import ms from 'pretty-ms';
import { BSEvent } from '../typings/bot.js';
import { setActivity } from '../lib/methods/index.js';
import { BSClient } from '../lib/structures/BSClient.js';

export default {
  name: 'ready',
  run: async (client: BSClient) => {
    console.log(`${client.user!.username} is ready! Took ${ms(Date.now() - client.startTimestamp)}`);
    setActivity(client);
  }
} as BSEvent;