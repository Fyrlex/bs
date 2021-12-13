import { ShardingManager } from 'discord.js';

(await import('dotenv')).config();

const manager = new ShardingManager('./build/bot.js', { token: process.env.DISCORD_TOKEN });

manager.on('shardCreate', shard => console.log(`Created and launched shard ${shard.id}.`));
manager.spawn({ amount: 'auto' });

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);