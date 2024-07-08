import { DiceItem, RollFunctionProps } from '../@types';

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
      const number = Math.ceil(Math.random() * +sides);
      result.push({
        dice: number,
        isCritical: number === +sides,
        isFumble: number === 1,
      });
    }
  }

  return result;
}
