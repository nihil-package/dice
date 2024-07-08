export function findMod(formula: string) {
  const modExp = /\b([+-]\d)\b/g;

  const modMatch = formula.match(modExp)?.filter(
    (item) => item !== ''
  );

  return modMatch || [];
}
