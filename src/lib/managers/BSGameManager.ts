import { Collection } from 'discord.js';
import { BSClient } from '../structures/BSClient.js';
import { BSGame } from '../structures/BSGame.js';
import { Deck } from '../structures/Deck.js';

export class BSGameManager {
  private readonly _client: BSClient;

  private _gameCache = new Collection<string, BSGame>();

  constructor(client: BSClient) {
    this._client = client;
  }

  get cache(): Collection<string, BSGame> {
    return this._gameCache;
  }

  public create(log?: boolean) {
    const game = new BSGame(new Deck({ shuffle: true }), log);
    this.cache.set(game.id, game);
    console.log('New Game Created', game);
  }
}