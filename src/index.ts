import type { RollDiceModResult, RollDiceResult } from './@types';

function rollDice(dice: string): RollDiceResult {
  const [ dices, sides, ] = dice.split('D');
  const details: number[] = [];

  const newDices = dices || '1';
  const sign = +newDices > 0 ? '+' : '-';

  for (let i = 0; i < Math.abs(+newDices); i++) {
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

function rollDiceMod(diceFormula: string): RollDiceModResult {
  const matchReg = /([+-]?\d*[ㅇdD]\d+|[+-]?\d+)/g;

  const result = diceFormula
    .match(matchReg)?.filter((item) => item !== '');

  const diceDetails: RollDiceResult[] = [];
  const modArray: number[] = [];

  result?.forEach((item) => {
    if (item.includes('D')) {
      const [ n1, n2, ] = item.split('D');

      const newN1 = n1.replace(/[+-]/g, '');
      diceDetails.push(rollDice(`${newN1}D${n2}`));
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

function rollAllDices(formulas: string): RollDiceModResult[] {
  const dices1 = formulas
    .trim()
    .replace(/[dㅇ]/g, 'D')
    .split(' ');

  const results: RollDiceModResult[] = [];

  dices1.forEach((diceString) => {
    if (diceString.includes('*')) {
      const [ formula, loop, ] = diceString.split('*');

      for (let i = 0; i < +loop; i++) {
        results.push(rollDiceMod(formula));
      }
    } else {
      results.push(rollDiceMod(diceString));
    }
  });

  return results;
}

const preset = {
  diceD2: () => rollDice('D2'),
  diceD4: () => rollDice('D4'),
  diceD6: () => rollDice('D6'),
  diceD8: () => rollDice('D8'),
  diceD10: () => rollDice('D10'),
  diceD12: () => rollDice('D12'),
  diceD20: () => rollDice('D20'),
  dice2D4: () => rollDice('2D4'),
  dice2D8: () => rollDice('2D8'),
  dice2D10: () => rollDice('2D10'),
  dice3D4: () => rollDice('3D4'),
  dice3D6: () => rollDice('3D6'),
  dice3D8: () => rollDice('3D8'),
  diceD100: () => rollDice('D100'),
};

export {
  rollDice,
  rollDiceMod,
  rollAllDices,
  preset
};
