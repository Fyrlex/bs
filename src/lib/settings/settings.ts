import { ActivityOptions, ClientOptions } from 'discord.js';

export const settings = {
  links: {
    invite: 'https://treefarmer.xyz/invite',
    discord: 'https://treefarmer.xyz/discord',
    github: 'https://github.com/TreeFarmer',
    host: 'https://fyrlex.me/hosting',
    status: 'https://status.treefarmer.xyz',
    publisher: 'https://bremea.com',
  },
  mainBotID: '919731548255821894',
  serverID: '782760653181419542',
  clientOptions: {
    restRequestTimeout: 60000,
    intents: [
      'GUILDS',
    ]
  } as ClientOptions,
  statuses: [
    {
      name: 'with cards',
      type: 'PLAYING'
    }
  ] as ActivityOptions[]
};