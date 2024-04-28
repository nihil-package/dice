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
