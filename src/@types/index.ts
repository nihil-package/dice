export type RollResult = {
  dice: string;
  total: number;
  details: number[];
};

export type Dice = {
  formula: string;
  diceTotal: number;
  diceDetails: RollResult[];
  modDetails: number[];
};
