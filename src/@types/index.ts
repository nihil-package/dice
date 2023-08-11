type RollDiceResult = {
  dice: string;
  total: number;
  details: number[];
};

type RollDiceModResult = {
  formula: string;
  diceTotal: number;
  diceDetails: RollDiceResult[];
  modDetails: number[];
};

export type { RollDiceModResult, RollDiceResult };
