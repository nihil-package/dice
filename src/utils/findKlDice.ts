export function findKlDice(formula: string) {
  const klExp = /\b([+-]?\d*[dD]\d+)kl\d+\b/g;
  const klMatch = formula.match(klExp)?.filter(
    (item) => item !== ''
  );

  return klMatch || [];
}
