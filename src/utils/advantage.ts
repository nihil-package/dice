import { DiceItem, DisAdvantageProps, RollIndex } from '../@types';

export function advantage({ diceItems, select, }: DisAdvantageProps) {
  const array: RollIndex[] = diceItems.map(
    (item, index) => ({
      number: item.dice,
      isCritical: item.isCritical,
      isFumble: item.isFumble,
      index,
    })
  );

  const storedArray = array
    .sort((a, b) => b.number - a.number);

  const resultArray = storedArray
    .splice(0, select)
    .sort((a, b) => a.index - b.index);
  const ignoreArray = storedArray;

  const results: DiceItem[] = resultArray.map((item) => ({
    dice: item.number,
    isCritical: item.isCritical,
    isFumble: item.isFumble,
  }));

  const ignores = ignoreArray.map((item) => item.number);

  const total = results.reduce(
    (pre, curr) => (pre + curr.dice),
    0
  );

  return {
    results,
    ignores,
    total,
  };
}
