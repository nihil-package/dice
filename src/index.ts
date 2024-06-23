type RollMode = 'default' | 'min' | 'max';

interface RollIndex {
  number: number;
  index: number;
}

type DiceResult = {
  formula: string;
  total: number;
  result: number[];
  ignore: number[];
};

type RollDiceProps = {
  formula: string;
  mode?: RollMode;
  isAdvantage?: boolean;
  isDisAdvantage?: boolean;
  selectCount?: number;
};

type RollResult = {
  formula: string;
  total: number;
  dices: DiceResult[];
  mod: number[];
};

export type {
  RollDiceProps,
  DiceResult,
  RollIndex,
  RollResult,
  RollMode
};

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
    const mainDice = this.findMainDice(formula);
    const subDice = this.findSubDice(formula);
    const khDice = this.findKhDice(formula);
    const klDice = this.findKlDice(formula);
    const mod = this.findMod(formula);
    const multiple = this.findMultiple(formula);

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
      const result: number[] = [];

      for (let i = 0; i < Math.abs(newDices); i++) {
        result.push(1);
      }

      const result2: RollIndex[] = result.map(
        (item, index) => ({
          number: item,
          index,
        })
      );

      let results: number[];
      let ignores: number[];
      let diceString: string;

      if (isAdvantage) {
        const sortedResult2 = result2
          .sort((a, b) => b.number - a.number);

        const resultArray = sortedResult2.splice(0, selectCount)
          .sort((a, b) => a.index - b.index);
        const ignoreArray = sortedResult2;

        results = resultArray.map((item) => item.number);
        ignores = ignoreArray.map((item) => item.number);

        diceString = newDices === 1
          ? `D${sides}kh${selectCount}`
          : `${Math.abs(newDices)}D${sides}kh${selectCount}`;
      }

      if (isDisAdvantage) {
        const sortedResult2 = result2
          .sort((a, b) => a.number - b.number);

        const resultArray = sortedResult2.splice(0, selectCount)
          .sort((a, b) => a.index - b.index);
        const ignoreArray = sortedResult2;

        results = resultArray.map((item) => item.number);
        ignores = ignoreArray.map((item) => item.number);

        diceString = newDices === 1
          ? `D${sides}kh${selectCount}`
          : `${Math.abs(newDices)}D${sides}kl${selectCount}`;
      }

      const total = isAdvantage || isDisAdvantage
        ? results.reduce(
          (pre, curr) => (pre + curr),
          0
        )
        : result.reduce((pre, curr) => pre + curr, 0);

      return {
        formula: isAdvantage || isDisAdvantage ? diceString : formula,
        total: sign === '+' ? total : -total,
        result: isAdvantage || isDisAdvantage ? results : result,
        ignore: isAdvantage || isDisAdvantage ? ignores : [],
      };
    }

    if (mode === 'max') {
      const result: number[] = [];

      for (let i = 0; i < Math.abs(newDices); i++) {
        result.push(+sides);
      }

      const result2: RollIndex[] = result.map(
        (item, index) => ({
          number: item,
          index,
        })
      );

      let results: number[];
      let ignores: number[];
      let diceString: string;

      if (isAdvantage) {
        const sortedResult2 = result2
          .sort((a, b) => b.number - a.number);

        const resultArray = sortedResult2.splice(0, selectCount)
          .sort((a, b) => a.index - b.index);
        const ignoreArray = sortedResult2;

        results = resultArray.map((item) => item.number);
        ignores = ignoreArray.map((item) => item.number);

        diceString = newDices === 1
          ? `D${sides}kh${selectCount}`
          : `${Math.abs(newDices)}D${sides}kh${selectCount}`;
      }

      if (isDisAdvantage) {
        const sortedResult2 = result2
          .sort((a, b) => a.number - b.number);

        const resultArray = sortedResult2.splice(0, selectCount)
          .sort((a, b) => a.index - b.index);
        const ignoreArray = sortedResult2;

        results = resultArray.map((item) => item.number);
        ignores = ignoreArray.map((item) => item.number);

        diceString = newDices === 1
          ? `D${sides}kh${selectCount}`
          : `${Math.abs(newDices)}D${sides}kl${selectCount}`;
      }

      const total = isAdvantage || isDisAdvantage
        ? results.reduce(
          (pre, curr) => (pre + curr),
          0
        )
        : result.reduce((pre, curr) => pre + curr, 0);

      return {
        formula: isAdvantage || isDisAdvantage ? diceString : formula,
        total: sign === '+' ? total : -total,
        result: isAdvantage || isDisAdvantage ? results : result,
        ignore: isAdvantage || isDisAdvantage ? ignores : [],
      };
    }

    if (isAdvantage) {
      const result: number[] = [];

      for (let i = 0; i < Math.abs(newDices); i++) {
        const number = Math.ceil(Math.random() * +sides);
        result.push(number);
      }

      const result2: RollIndex[] = result.map(
        (item, index) => ({
          number: item,
          index,
        })
      );

      const sortedResult2 = result2
        .sort((a, b) => b.number - a.number);

      const resultArray = sortedResult2.splice(0, selectCount)
        .sort((a, b) => a.index - b.index);
      const ignoreArray = sortedResult2;

      const results = resultArray.map((item) => item.number);
      const ignores = ignoreArray.map((item) => item.number);

      const total = results.reduce(
        (pre, curr) => (pre + curr),
        0
      );

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
      const result: number[] = [];

      for (let i = 0; i < Math.abs(newDices); i++) {
        const number = Math.ceil(Math.random() * +sides);
        result.push(number);
      }

      const result2: RollIndex[] = result.map(
        (item, index) => ({
          number: item,
          index,
        })
      );

      const sortedResult2 = result2
        .sort((a, b) => a.number - b.number);

      const resultArray = sortedResult2.splice(0, selectCount)
        .sort((a, b) => a.index - b.index);
      const ignoreArray = sortedResult2;

      const results = resultArray.map((item) => item.number);
      const ignores = ignoreArray.map((item) => item.number);

      const total = results.reduce(
        (pre, curr) => (pre + curr),
        0
      );

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
      const result: number[] = [];

      for (let i = 0; i < Math.abs(newDices); i++) {
        const number = Math.ceil(Math.random() * +sides);
        result.push(number);
      }

      const total = result.reduce((pre, curr) => pre + curr, 0);

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

  static findMainDice(formula: string) {
    const mainDiceExp = /^\b(\d*[dD]\d+)\b/g;

    const mainDiceMatch = formula.match(mainDiceExp)?.filter(
      (item) => item !== ''
    );

    return mainDiceMatch || [];
  }

  static findSubDice(formula: string) {
    const subDiceExp = /\b([+-]\d*[dD]\d+)\b/g;

    const subDiceMatch = formula.match(subDiceExp)?.filter(
      (item) => item !== ''
    );

    return subDiceMatch || [];
  }

  static findMod(formula: string) {
    const modExp = /\b([+-]\d)\b/g;

    const modMatch = formula.match(modExp)?.filter(
      (item) => item !== ''
    );

    return modMatch || [];
  }

  static findKhDice(formula: string) {
    const khExp = /\b([+-]?\d*[dD]\d+)kh\d+\b/g;

    const khMatch = formula.match(khExp)?.filter(
      (item) => item !== ''
    );

    return khMatch || [];
  }

  static findKlDice(formula: string) {
    const klExp = /\b([+-]?\d*[dD]\d+)kl\d+\b/g;
    const klMatch = formula.match(klExp)?.filter(
      (item) => item !== ''
    );

    return klMatch || [];
  }

  static findMultiple(formula: string) {
    const multipleExp = /\b([*]\d+)\b/g;
    const multipleMatch = formula.match(multipleExp)?.filter(
      (item) => item !== ''
    );

    return multipleMatch || [];
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
