import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { BSEventNames, BSEvent } from '../../typings/bot.js';

export class EventManager {
  private readonly _events: Collection<BSEventNames, BSEvent> = new Collection();

  public async import(directory = './build/events'): Promise<Collection<BSEventNames, BSEvent>> {
    await this.importDir(directory);

    return this._events;
  }

  private async add(path: string): Promise<void> {
    const event = (await import(`../../../${path}`.slice(0, -4) + 'js')).default;
    this._events.set(event.name, event);
  }

  private async importDir(directory: string) {
    for (const dirent of readdirSync(directory, { withFileTypes: true })) {
      if (dirent.isFile() && dirent.name.endsWith('.ts')) await this.add(`${directory}/${dirent.name}`);
    }
  }
}