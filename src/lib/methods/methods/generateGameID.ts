import { default_random_engine } from 'better-random.js/build/engines/index.js';
import { unique_string_generator } from 'better-random.js/build/utils/index.js';

const rng = new default_random_engine();

export function generateGameID(): string {
  return unique_string_generator('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)(rng);
}