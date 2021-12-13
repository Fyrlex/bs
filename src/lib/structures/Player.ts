import { CardID } from '../../typings/index.js';
import { Card } from './Card.js';
import { BSGame } from './BSGame.js';
import Collection from '@discordjs/collection';

export class Player {
  public readonly game: BSGame;
  public readonly name: string;

  public hand: Collection<CardID, Card>;
  public turn: boolean;
  public peanutButter: boolean;
  public played: CardID[] | null;

  constructor(game: BSGame, name: string) {
    this.game = game;
    this.name = name;

    this.hand = new Collection();
    this.turn = false;
    this.peanutButter = false;
    this.played = null;
  }

  get cardCount(): number {
    return this.hand.size;
  }

  public addCards(...cards: Card[]): void {
    for (const card of cards) this.hand.set(card.id, card);
  }

  public clearCards(): void {
    this.hand.clear();
  }

  public removeCards(...cards: CardID[]): void {
    for (const cardID of cards) this.hand.delete(cardID);
  }

  public play(...cards: CardID[]): void {
    if (this.turn) this.game.emit('go', this, ...cards);
    else throw new Error('It is not this players turn.');
  }

  public bs() {
    if (this.turn) {
      const lastPlayer = this.game.lastPlayer;
      this.game.emit('bs', this, lastPlayer);
    } else throw new Error('It is not this players turn.');
  }
}