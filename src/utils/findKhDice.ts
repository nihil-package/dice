export function findKhDice(formula: string) {
  const khExp = /\b([+-]?\d*[dD]\d+)kh\d+\b/g;

  const khMatch = formula.match(khExp)?.filter(
    (item) => item !== ''
  );

  return khMatch || [];
}
