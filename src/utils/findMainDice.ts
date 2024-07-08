export function findMainDice(formula: string) {
  const mainDiceExp = /^\b(\d*[dD]\d+)\b/g;

  const mainDiceMatch = formula.match(mainDiceExp)?.filter(
    (item) => item !== ''
  );

  return mainDiceMatch || [];
}
