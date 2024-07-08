export function findSubDice(formula: string) {
  const subDiceExp = /\b([+-]\d*[dD]\d+)\b/g;

  const subDiceMatch = formula.match(subDiceExp)?.filter(
    (item) => item !== ''
  );

  return subDiceMatch || [];
}
