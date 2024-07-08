import { findMultiple } from './utils/findMultiple';
import { findKlDice } from './utils/findKlDice';
import { findKhDice } from './utils/findKhDice';
import { findMod } from './utils/findMod';
import { findMainDice } from './utils/findMainDice';
import { findSubDice } from './utils/findSubDice';
import {
  DiceItem, DiceResult, RollDiceProps, RollResult
} from './@types';
import { rollPerDice } from './utils/rollPerDice';
import { disAdvantage } from './utils/disAdvantage';
import { advantage } from './utils/advantage';

class Dice {
  static rollToFormula(
    { formula, mode = 'default', }: RollDiceProps
  ): RollResult[] {
    const diceString = formula.replace(/[dㅇ]/g, 'D');

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
      diceResults.push(this.dice({
        formula: subDice[0],
        mode,
      }));
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
      const result = rollPerDice({
        mode: 'min',
        sides: +sides,
        dices: +dices,
      });

      let results: DiceItem[];
      let ignores: number[];
      let diceString: string;

      if (isAdvantage) {
        const {
          results: adResults,
          ignores: adIgnores,
        } = advantage({
          diceItems: result,
          select: selectCount,
        });

        results = adResults;
        ignores = adIgnores;

        diceString = newDices === 1
          ? `D${sides}kh${selectCount}`
          : `${Math.abs(newDices)}D${sides}kh${selectCount}`;
      }

      if (isDisAdvantage) {
        const {
          results: disAdResults,
          ignores: disAdIgnores,
        } = advantage({
          diceItems: result,
          select: selectCount,
        });

        results = disAdResults;
        ignores = disAdIgnores;

        diceString = newDices === 1
          ? `D${sides}kh${selectCount}`
          : `${Math.abs(newDices)}D${sides}kl${selectCount}`;
      }

      const total = isAdvantage || isDisAdvantage
        ? results.reduce(
          (pre, curr) => (pre + curr.dice),
          0
        )
        : result.reduce((pre, curr) => pre + curr.dice, 0);

      return {
        formula: isAdvantage || isDisAdvantage ? diceString : formula,
        total: sign === '+' ? total : -total,
        result: isAdvantage || isDisAdvantage ? results : result,
        ignore: isAdvantage || isDisAdvantage ? ignores : [],
      };
    }

    if (mode === 'max') {
      const result = rollPerDice({
        mode: 'max',
        sides: +sides,
        dices: +dices,
      });

      let results: DiceItem[];
      let ignores: number[];
      let diceString: string;

      if (isAdvantage) {
        const {
          results: adResults,
          ignores: adIgnores,
        } = advantage({
          diceItems: result,
          select: selectCount,
        });

        results = adResults;
        ignores = adIgnores;

        diceString = newDices === 1
          ? `D${sides}kh${selectCount}`
          : `${Math.abs(newDices)}D${sides}kh${selectCount}`;
      }

      if (isDisAdvantage) {
        const {
          results: disAdResults,
          ignores: disAdIgnores,
        } = advantage({
          diceItems: result,
          select: selectCount,
        });

        results = disAdResults;
        ignores = disAdIgnores;

        diceString = newDices === 1
          ? `D${sides}kh${selectCount}`
          : `${Math.abs(newDices)}D${sides}kl${selectCount}`;
      }

      const total = isAdvantage || isDisAdvantage
        ? results.reduce(
          (pre, curr) => (pre + curr.dice),
          0
        )
        : result.reduce((pre, curr) => pre + curr.dice, 0);

      return {
        formula: isAdvantage || isDisAdvantage ? diceString : formula,
        total: sign === '+' ? total : -total,
        result: isAdvantage || isDisAdvantage ? results : result,
        ignore: isAdvantage || isDisAdvantage ? ignores : [],
      };
    }

    if (isAdvantage) {
      const result = rollPerDice({
        mode: 'default',
        sides: +sides,
        dices: +dices,
      });

      const { results, ignores, total, } = advantage({
        diceItems: result,
        select: selectCount,
      });

      return {
        formula: newDices === 1
          ? `D${sides}kh${selectCount}`
          : `${Math.abs(newDices)}D${sides}kh${selectCount}`,
        total: sign === '+' ? total : -total,
        result: results,
        ignore: ignores,
      };
    }

    if (isDisAdvantage) {
      const result = rollPerDice({
        mode: 'default',
        sides: +sides,
        dices: +dices,
      });

      const { results, ignores, total, } = disAdvantage({
        diceItems: result,
        select: selectCount,
      });

      return {
        formula: newDices === 1
          ? `D${sides}kl${selectCount}`
          : `${Math.abs(newDices)}D${sides}kl${selectCount}`,
        total: sign === '+' ? total : -total,
        result: results,
        ignore: ignores,
      };
    }

    if (!isAdvantage && !isDisAdvantage) {
      const result = rollPerDice({
        mode: 'default',
        sides: +sides,
        dices: +dices,
      });

      const total = result.reduce((pre, curr) => pre + curr.dice, 0);

      return {
        formula: newDices === 1
          ? `D${+sides}`
          : `${Math.abs(newDices)}D${+sides}`,
        total: sign === '+' ? total : -total,
        result,
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
