export function findMultiple(formula: string) {
  const multipleExp = /\b([*]\d+)\b/g;
  const multipleMatch = formula.match(multipleExp)?.filter(
    (item) => item !== ''
  );

  return multipleMatch || [];
}
