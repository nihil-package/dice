type RollMode = 'default' | 'min' | 'max';

interface RollIndex {
  number: number;
  index: number;
  isCritical?: boolean;
  isFumble?: boolean;
}

type DiceItem = {
  dice: number;
  isCritical?: boolean;
  isFumble?: boolean;
};

type RollFunctionProps = {
  mode: RollMode;
  sides: number;
  dices: number;
};

type AdvantageProps = {};

type DisAdvantageProps = {
  diceItems: DiceItem[];
  select: number;
};

type DiceResult = {
  formula: string;
  total: number;
  result: DiceItem[];
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
  RollMode,
  RollFunctionProps,
  DiceItem,
  DisAdvantageProps
};
