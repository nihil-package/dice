import { Dice, RollResult } from './@types/index';

function diceRoll(formulas: string): Dice[] {
  const dices1 = formulas
    .trim()
    .replace(/[dㅇ]/g, 'D')
    .split(' ');

  const results: Dice[] = [];

  dices1.forEach((diceString) => {
    if (diceString.includes('*')) {
      const [ formula, loop, ] = diceString.split('*');

      for (let i = 0; i < +loop; i++) {
        results.push(dice(formula));
      }
    } else {
      results.push(dice(diceString));
    }
  });

  return results;
}

function dice(diceFormula: string): Dice {
  const matchReg = /([+-]?\d*[ㅇdD]\d+|[+-]?\d+)/g;

  const result = diceFormula
    .match(matchReg)?.filter((item) => item !== '');

  const diceDetails: RollResult[] = [];
  const modArray: number[] = [];

  result.forEach((item) => {
    if (item.includes('D')) {
      const [ n1, n2, ] = item.split('D');

      diceDetails.push(roll(`${n1 || 1}D${n2}`));
    } else {
      modArray.push(+item);
    }
  });

  const detailsTotal = diceDetails
    .map((item) => item.total)
    .reduce((pre, curr) => pre + curr, 0);

  return {
    formula: diceFormula,
    diceTotal: detailsTotal + modArray.reduce((pre, curr) => pre + curr, 0),
    diceDetails,
    modDetails: modArray,
  };
}

function roll(dice: string): RollResult {
  const [ dices, sides, ] = dice.split('D');
  const details = [];

  const sign = +dices > 0 ? '+' : '-';

  for (let i = 0; i < Math.abs(+dices); i++) {
    const number = Math.ceil(Math.random() * +sides);
    details.push(number);
  }

  const total = details.reduce((pre, curr) => pre + curr, 0);

  return {
    dice,
    total: sign === '+' ? total : -total,
    details,
  };
}

export {
  diceRoll
};
