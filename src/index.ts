import {
  DiceResult, RollDiceProps, RollIndex, RollResult
} from './@types';

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
    const [ dices, sides, ] = formula.split('D');
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

      let finalResult: RollIndex[];
      let ignore: RollIndex[];
      let resultArray: number[];
      let ignoreArray: number[];
      let diceString: string;

      if (isAdvantage) {
        finalResult = result2
          .sort((a, b) => b.number - a.number)
          .slice(0, selectCount)
          .sort((a, b) => a.index - b.index);

        ignore = result2
          .sort((a, b) => a.number - b.number)
          .slice(0, selectCount)
          .sort((a, b) => a.index - b.index);

        resultArray = finalResult.map((item) => item.number);
        ignoreArray = ignore.map((item) => item.number);

        diceString = newDices === 1
          ? `D${sides}kh${selectCount}`
          : `${Math.abs(newDices)}D${sides}kh${selectCount}`;
      }

      if (isDisAdvantage) {
        finalResult = result2
          .sort((a, b) => a.number - b.number)
          .slice(0, selectCount)
          .sort((a, b) => a.index - b.index);

        ignore = result2
          .sort((a, b) => b.number - a.number)
          .slice(0, selectCount)
          .sort((a, b) => a.index - b.index);

        resultArray = finalResult.map((item) => item.number);
        ignoreArray = ignore.map((item) => item.number);

        diceString = newDices === 1
          ? `D${sides}kh${selectCount}`
          : `${Math.abs(newDices)}D${sides}kl${selectCount}`;
      }

      const total = isAdvantage || isDisAdvantage
        ? resultArray.reduce(
          (pre, curr) => (pre + curr),
          0
        )
        : result.reduce((pre, curr) => pre + curr, 0);

      return {
        formula: isAdvantage || isDisAdvantage ? diceString : formula,
        total: sign === '+' ? total : -total,
        result: isAdvantage || isDisAdvantage ? resultArray : result,
        ignore: isAdvantage || isDisAdvantage ? ignoreArray : [],
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

      let finalResult: RollIndex[];
      let ignore: RollIndex[];
      let resultArray: number[];
      let ignoreArray: number[];
      let diceString: string;

      if (isAdvantage) {
        finalResult = result2
          .sort((a, b) => b.number - a.number)
          .slice(0, selectCount)
          .sort((a, b) => a.index - b.index);

        ignore = result2
          .sort((a, b) => a.number - b.number)
          .slice(0, selectCount)
          .sort((a, b) => a.index - b.index);

        resultArray = finalResult.map((item) => item.number);
        ignoreArray = ignore.map((item) => item.number);

        diceString = newDices === 1
          ? `D${sides}kh${selectCount}`
          : `${Math.abs(newDices)}D${sides}kh${selectCount}`;
      }

      if (isDisAdvantage) {
        finalResult = result2
          .sort((a, b) => a.number - b.number)
          .slice(0, selectCount)
          .sort((a, b) => a.index - b.index);

        ignore = result2
          .sort((a, b) => b.number - a.number)
          .slice(0, selectCount)
          .sort((a, b) => a.index - b.index);

        resultArray = finalResult.map((item) => item.number);
        ignoreArray = ignore.map((item) => item.number);

        diceString = newDices === 1
          ? `D${sides}kh${selectCount}`
          : `${Math.abs(newDices)}D${sides}kl${selectCount}`;
      }

      const total = isAdvantage || isDisAdvantage
        ? resultArray.reduce(
          (pre, curr) => (pre + curr),
          0
        )
        : result.reduce((pre, curr) => pre + curr, 0);

      return {
        formula: isAdvantage || isDisAdvantage ? diceString : formula,
        total: sign === '+' ? total : -total,
        result: isAdvantage || isDisAdvantage ? resultArray : result,
        ignore: isAdvantage || isDisAdvantage ? ignoreArray : [],
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

      const finalResult = result2
        .sort((a, b) => b.number - a.number)
        .slice(0, selectCount)
        .sort((a, b) => a.index - b.index);

      const ignore = result2
        .sort((a, b) => a.number - b.number)
        .slice(0, selectCount)
        .sort((a, b) => a.index - b.index);

      const resultArray = finalResult.map((item) => item.number);
      const ignoreArray = ignore.map((item) => item.number);

      const total = resultArray.reduce(
        (pre, curr) => (pre + curr),
        0
      );

      return {
        formula: newDices === 1
          ? `D${sides}kh${selectCount}`
          : `${Math.abs(newDices)}D${sides}kh${selectCount}`,
        total: sign === '+' ? total : -total,
        result: resultArray,
        ignore: ignoreArray,
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

      const finalResult = result2
        .sort((a, b) => a.number - b.number)
        .slice(0, selectCount)
        .sort((a, b) => a.index - b.index);

      const ignore = result2
        .sort((a, b) => b.number - a.number)
        .slice(0, selectCount)
        .sort((a, b) => a.index - b.index);

      const resultArray = finalResult.map((item) => item.number);
      const ignoreArray = ignore.map((item) => item.number);

      const total = resultArray.reduce(
        (pre, curr) => (pre + curr),
        0
      );

      return {
        formula: newDices === 1
          ? `D${sides}kh${selectCount}`
          : `${Math.abs(newDices)}D${sides}kh${selectCount}`,
        total: sign === '+' ? total : -total,
        result: resultArray,
        ignore: ignoreArray,
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
