import { BSClient } from '../../structures/BSClient.js';

export function setActivity(client: BSClient): void {
  let statusesIndex = client.statuses.length - 1;
  const status = client.statuses[statusesIndex]!;

  setInterval(() => {
    for (const shardID of client.shard!.ids) client.user!.setActivity(status.name!, { type: status.type, shardId: shardID });

    statusesIndex--;

    if (statusesIndex < 0) statusesIndex = client.statuses.length - 1;
  }, 60000);
}