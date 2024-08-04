import { findMultiple } from './utils/findMultiple';
import { findKlDice } from './utils/findKlDice';
import { findKhDice } from './utils/findKhDice';
import { findMod } from './utils/findMod';
import { findMainDice } from './utils/findMainDice';
import { findSubDice } from './utils/findSubDice';
import {
  DiceResult, RollDiceProps, RollError, RollResult
} from './@types';
import { rollPerDice } from './utils/rollPerDice';
import { disAdvantage } from './utils/disAdvantage';
import { advantage } from './utils/advantage';
import { errorCatch } from './utils/errorCatch';

class Dice {
  static rollToFormula(
    { formula, mode = 'default', }: RollDiceProps
  ): RollResult[] | RollError {
    const diceString = formula.replace(/[dㅇ]/g, 'D');

    const isError = errorCatch(diceString);

    if (isError.errorNumber !== 0) {
      return isError;
    }

    const stringArray = diceString.split(' ');

    const rollResults: RollResult[] = [];

    stringArray.forEach((item) => {
      rollResults.push(this.roll({
        formula: item,
        mode,
      }));
    });

    return rollResults;
  }

  static roll({ formula, mode, }: RollDiceProps): RollResult {
    const mainDice = findMainDice(formula);
    const subDice = findSubDice(formula);
    const khDice = findKhDice(formula);
    const klDice = findKlDice(formula);
    const mod = findMod(formula);
    const multiple = findMultiple(formula);

    const diceResults: DiceResult[] = [];

    if (mainDice.length !== 0) {
      diceResults.push(this.dice({
        formula: mainDice[0],
        mode,
      }));
    }

    if ((mainDice.length !== 0) && (multiple.length !== 0)) {
      for (let i = 0; i < +multiple[0].replace('*', '') - 1; i++) {
        diceResults.push(this.dice({
          formula: mainDice[0],
          mode,
        }));
      }
    }

    if (khDice.length !== 0) {
      const diceString = khDice[0].replace(/kh\d+/g, '');
      const khSearch = khDice[0]
        .replace(/\d+[dDㅇ]\d+/g, '')
        .replace(/[^0-9]/g, '');

      diceResults.push(this.dice({
        formula: diceString,
        mode,
        isAdvantage: true,
        selectCount: +khSearch,
      }));
    }

    if ((khDice.length !== 0) && (multiple.length !== 0)) {
      const diceString = khDice[0].replace(/kh\d+/g, '');
      const khSearch = khDice[0]
        .replace(/\d+[dDㅇ]\d+/g, '')
        .replace(/[^0-9]/g, '');

      for (let i = 0; i < +multiple[0].replace('*', '') - 1; i++) {
        diceResults.push(this.dice({
          formula: diceString,
          mode,
          isAdvantage: true,
          selectCount: +khSearch,
        }));
      }
    }

    if (klDice.length !== 0) {
      const diceString = klDice[0].replace(/kl\d+/g, '');
      const klSearch = klDice[0]
        .replace(/\d+[dDㅇ]\d+/g, '')
        .replace(/[^0-9]/g, '');

      diceResults.push(this.dice({
        formula: diceString,
        mode,
        isDisAdvantage: true,
        selectCount: +klSearch,
      }));
    }

    if ((klDice.length !== 0) && (multiple.length !== 0)) {
      const diceString = klDice[0].replace(/kl\d+/g, '');
      const klSearch = klDice[0]
        .replace(/\d+[dDㅇ]\d+/g, '')
        .replace(/[^0-9]/g, '');

      for (let i = 0; i < +multiple[0].replace('*', '') - 1; i++) {
        diceResults.push(this.dice({
          formula: diceString,
          mode,
          isDisAdvantage: true,
          selectCount: +klSearch,
        }));
      }
    }

    if (subDice.length !== 0) {
      subDice.forEach((item) => {
        diceResults.push(this.dice({
          formula: item,
          mode,
        }));
      });
    }

    const modArray = mod.map((item) => +item);

    const diceTotal = diceResults.reduce(
      (pre, curr) => {
        const currTotal = curr.total;

        return pre + currTotal;
      },
      0
    );

    const modTotal = modArray.reduce((pre, curr) => pre + curr, 0);

    return {
      formula,
      total: diceTotal + modTotal,
      dices: diceResults,
      mod: mod.map((item) => +item),
    };
  }

  static dice(
    {
      formula, mode, isAdvantage = false,
      isDisAdvantage = false, selectCount = 0,
    }: RollDiceProps
  ): DiceResult {
    let newFormula: string;

    if (formula.startsWith('+D')) {
      newFormula = formula.replace('+D', '+1D');
    } else {
      newFormula = formula.replace('-D', '-1D');
    }

    const [ dices, sides, ] = newFormula.split('D');
    const newDices = +dices || 1;
    const sign = newDices > 0 ? '+' : '-';

    if (mode === 'min') {
      const defaultResult = rollPerDice({
        mode: 'min',
        sides: +sides,
        dices: newDices,
      });

      if (isAdvantage) {
        const adItems = advantage({
          diceItems: defaultResult,
          select: selectCount,
          sides: +sides,
          newDices,
        });

        return {
          total: sign === '+' ? adItems.total : -adItems.total,
          formula: adItems.diceString,
          result: adItems.results,
          ignore: adItems.ignores,
        };
      }

      if (isDisAdvantage) {
        const disAdItems = disAdvantage({
          diceItems: defaultResult,
          select: selectCount,
          sides: +sides,
          newDices,
        });

        return {
          total: sign === '+' ? disAdItems.total : -disAdItems.total,
          formula: disAdItems.diceString,
          result: disAdItems.results,
          ignore: disAdItems.ignores,
        };
      }

      const total = defaultResult.reduce((pre, curr) => pre + curr.dice, 0);

      const diceString = newDices === 1
        ? `D${+sides}`
        : `${Math.abs(newDices)}D${+sides}`;

      return {
        formula: diceString,
        total: sign === '+' ? total : -total,
        result: defaultResult,
        ignore: [],
      };
    }

    if (mode === 'max') {
      const defaultResult = rollPerDice({
        mode: 'max',
        sides: +sides,
        dices: newDices,
      });

      if (isAdvantage) {
        const adItems = advantage({
          diceItems: defaultResult,
          select: selectCount,
          sides: +sides,
          newDices,
        });

        return {
          total: sign === '+' ? adItems.total : -adItems.total,
          formula: adItems.diceString,
          result: adItems.results,
          ignore: adItems.ignores,
        };
      }

      if (isDisAdvantage) {
        const disAdItems = disAdvantage({
          diceItems: defaultResult,
          select: selectCount,
          sides: +sides,
          newDices,
        });

        return {
          total: sign === '+' ? disAdItems.total : -disAdItems.total,
          formula: disAdItems.diceString,
          result: disAdItems.results,
          ignore: disAdItems.ignores,
        };
      }

      const total = defaultResult.reduce((pre, curr) => pre + curr.dice, 0);

      const diceString = newDices === 1
        ? `D${+sides}`
        : `${Math.abs(newDices)}D${+sides}`;

      return {
        formula: diceString,
        total: sign === '+' ? total : -total,
        result: defaultResult,
        ignore: [],
      };
    }

    if (mode === 'default') {
      const defaultResult = rollPerDice({
        mode: 'default',
        sides: +sides,
        dices: newDices,
      });

      if (isAdvantage) {
        const adItems = advantage({
          diceItems: defaultResult,
          select: selectCount,
          sides: +sides,
          newDices,
        });

        return {
          total: sign === '+' ? adItems.total : -adItems.total,
          formula: adItems.diceString,
          result: adItems.results,
          ignore: adItems.ignores,
        };
      }

      if (isDisAdvantage) {
        const disAdItems = disAdvantage({
          diceItems: defaultResult,
          select: selectCount,
          sides: +sides,
          newDices,
        });

        return {
          total: sign === '+' ? disAdItems.total : -disAdItems.total,
          formula: disAdItems.diceString,
          result: disAdItems.results,
          ignore: disAdItems.ignores,
        };
      }

      const total = defaultResult.reduce((pre, curr) => pre + curr.dice, 0);

      const diceString = newDices === 1
        ? `D${+sides}`
        : `${Math.abs(newDices)}D${+sides}`;

      return {
        formula: diceString,
        total: sign === '+' ? total : -total,
        result: defaultResult,
        ignore: [],
      };
    }
  }

  static preset() {
    return [
      'D2', 'D4', 'D6', 'D8', 'D10',
      'D12', 'D20', 'D100', '2D4', '2D6', '2D8',
      '2D10', '2D12', '3D4', '3D6', '3D8',
      '3D10', '3D12',
    ];
  }
}

export {
  Dice
};

export * from './@types';
