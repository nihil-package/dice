import { DiceItem, DisAdvantageProps, RollIndex } from '../@types';

export function disAdvantage({
  diceItems, select, sides, newDices,
}: DisAdvantageProps) {
  const array: RollIndex[] = diceItems.map(
    (item, index) => ({
      number: item.dice,
      isCritical: item.isCritical,
      isFumble: item.isFumble,
      index,
    })
  );

  const storedArray = array
    .sort((a, b) => a.number - b.number);

  const resultArray = storedArray
    .splice(0, select)
    .sort((a, b) => a.index - b.index);
  const ignoreArray = storedArray;

  const results: DiceItem[] = resultArray.map((item) => ({
    dice: item.number,
    isCritical: item.isCritical,
    isFumble: item.isFumble,
  }));

  const ignores: DiceItem[] = ignoreArray.map((item) => ({
    dice: item.number,
    isCritical: item.isCritical,
    isFumble: item.isFumble,
  }));

  const total = results.reduce(
    (pre, curr) => (pre + curr.dice),
    0
  );

  const diceString = newDices === 1
    ? `D${sides}kl${select}`
    : `${Math.abs(newDices)}D${sides}kl${select}`;

  return {
    results,
    ignores,
    total,
    diceString,
  };
}
