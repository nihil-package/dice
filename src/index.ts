function roll(dices: number = 1, sides: number) {
  const results = [];

  for (let i = 0; i < dices; i++) {
    const num = Math.ceil(Math.random() * sides);
    results.push(num);
  }

  return {
    total: results.reduce((pre, curr) => pre + curr, 0),
    details: results,
  };
}

export {
  roll
};