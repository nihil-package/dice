import type { RollDiceModResult, RollDiceResult } from './@types';

function rollDice(dice: string, rollType = 'default'): RollDiceResult {
  dice = dice.replace(/[dㅇ]/g, 'D');

  const [ dices, sides, ] = dice.split('D');
  const details: number[] = [];

  const newDices = dices || '1';
  const sign = +newDices > 0 ? '+' : '-';

  if (rollType === 'min') {
    for (let i = 0; i < Math.abs(+newDices); i++) {
      details.push(1);
    }
  } else if (rollType === 'max') {
    for (let i = 0; i < Math.abs(+newDices); i++) {
      details.push(+sides);
    }
  } else {
    for (let i = 0; i < Math.abs(+newDices); i++) {
      const number = Math.ceil(Math.random() * +sides);
      details.push(number);
    }
  }

  const total = details.reduce((pre, curr) => pre + curr, 0);

  return {
    dice,
    total: sign === '+' ? total : -total,
    details,
  };
}

function rollDiceMod(diceFormula: string, rollType = 'default'): RollDiceModResult {
  const matchReg = /([+-]?\d*[ㅇdD]\d+|[+-]?\d+)/g;

  diceFormula = diceFormula.replace(/[dㅇ]/g, 'D');

  const result = diceFormula
    .match(matchReg)?.filter((item) => item !== '');

  const diceDetails: RollDiceResult[] = [];
  const modArray: number[] = [];

  result?.forEach((item) => {
    if (item.includes('D')) {
      const [ n1, n2, ] = item.split('D');

      const newN1 = n1.replace(/[+-]/g, '');
      diceDetails.push(rollDice(`${newN1}D${n2}`, rollType));
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

function rollAllDices(formulas: string, rollType = 'default'): RollDiceModResult[] {
  const dices1 = formulas
    .trim()
    .replace(/[dㅇ]/g, 'D')
    .split(' ');

  const results: RollDiceModResult[] = [];

  dices1.forEach((diceString) => {
    if (diceString.includes('*')) {
      const [ formula, loop, ] = diceString.split('*');

      for (let i = 0; i < +loop; i++) {
        results.push(rollDiceMod(formula, rollType));
      }
    } else {
      results.push(rollDiceMod(diceString, rollType));
    }
  });

  return results;
}

const preset = [
  'D2', 'D4', 'D6', 'D8', 'D10',
  'D12', 'D20', 'D100', '2D4', '2D6', '2D8',
  '2D10', '2D12', '3D4', '3D6', '3D8',
  '3D10', '3D12',
];

export {
  rollDice,
  rollDiceMod,
  rollAllDices,
  preset
};
