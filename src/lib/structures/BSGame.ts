import Collection from '@discordjs/collection';
import { EventEmitter } from 'events';
import { CardID, Rank } from '../../typings/index.js';
import { generateGameID } from '../methods/methods/generateGameID.js';
import { Card } from './Card.js';
import { Deck } from './Deck.js';
import { Player } from './Player.js';

export class BSGame extends EventEmitter {

  public readonly id: string;
  public readonly deck: Deck;
  public readonly players: Player[];

  public lastPlayer: Player | null;
  public nextPlayer: Player | null;
  public plays: number;
  public rankToPlay: Rank;
  public pile: Collection<CardID, Card>;
  public startedAt: number;
  public playerIndex: number;
  public dealt: boolean;

  constructor(deck: Deck, verbose?: boolean) {
    super();
    this.deck = deck;
    this.players = [];
    this.startedAt = 0;
    this.rankToPlay = 'A';
    this.pile = new Collection();
    this.lastPlayer = null;
    this.nextPlayer = null;
    this.plays = 0;
    this.playerIndex = 0;
    this.dealt = false;

    this.id = generateGameID();

    this.on('go', (player: Player, ...cards: CardID[]) => {
      for (const cardID of cards) {
        if (!player.hand.has(cardID)) throw new Error(`The card ${cardID} was not found in the player's deck, whether it was valid or not.`);

        if (cardID.split('-')[0] !== this.rankToPlay) player.peanutButter = true;
        else player.peanutButter = false;

        this.pile.set(cardID, player.hand.get(cardID)!);
        player.removeCards(...cards);
      }

      player.played = cards;
      player.turn = false;

      this.nextPlayer = this.players[++this.playerIndex]!;
      this.nextPlayer.turn = true;

      if (verbose) {
        console.log(`Player ${player.name}`);
        console.log(`Rank To Play: ${this.rankToPlay}`);
        console.log(`Played: ${cards.map(c => c).join(', ')}`);
        console.log(`Valid: ${!player.peanutButter}`);
      }
    });

    this.on('bs', (caller: Player, player: Player) => {
      if (player.peanutButter) player.addCards(...Array.from(this.pile.values()));
      else caller.addCards(...Array.from(this.pile.values()));
    });
  }

  get duration(): number {
    return Date.now() - this.startedAt;
  }

  public addPlayers(...players: Player[]) {
    for (const player of players) this.players.push(player);
  }

  public deal(toDeal?: number): void {
    let playerIndex = 0;
    const amount = toDeal ?? 52;

    for (const [, card] of this.deck.cards) {
      if (Array.from(this.deck.cards.values()).indexOf(card) < amount * this.players.length) {
        if (playerIndex > this.players.length - 1) playerIndex = 0;
        const player = this.players[playerIndex++]!;
        player.addCards(card);
      }
    }

    this.dealt = true;
  }

  public start() {
    if (this.startedAt) throw new Error('This game has already been started.');

    this.deal();
    this.startedAt = Date.now();

    const player = this.players.find(player => player.hand.find(card => card.id === 'A-Spades'))!;
    player.turn = true;
    player.play('A-Spades');
  }

  public finish() {

  }
}