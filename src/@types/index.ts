type RollResult = {
  dice: string;
  total: number;
  details: number[];
};

type Dice = {
  formula: string;
  diceTotal: number;
  diceDetails: RollResult[];
  modDetails: number[];
};

export type { Dice, RollResult };
