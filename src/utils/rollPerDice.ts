import { getRandomValues } from 'crypto';
import { DiceItem, RollFunctionProps } from '../@types';

function genRandomNumber(start: number, end: number) {
  const randomBuffer = new Uint32Array(1);
  getRandomValues(randomBuffer);
  const randomNumber = randomBuffer[0] / (0xffffffff + 1);

  return Math.floor(randomNumber * (end - start + 1)) + start;
}

export function rollPerDice({ mode, sides, dices, }: RollFunctionProps) {
  const result: DiceItem[] = [];

  if (mode === 'min') {
    for (let i = 0; i < Math.abs(dices); i++) {
      result.push({
        dice: 1,
        isFumble: true,
      });
    }
  } else if (mode === 'max') {
    for (let i = 0; i < Math.abs(dices); i++) {
      result.push({
        dice: sides,
        isCritical: true,
      });
    }
  } else if (mode === 'default') {
    for (let i = 0; i < Math.abs(dices); i++) {
      const number = genRandomNumber(1, +sides);

      result.push({
        dice: number,
        isCritical: number === +sides,
        isFumble: number === 1,
      });
    }
  }

  return result;
}
