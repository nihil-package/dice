import { RollError } from '../@types';

export function errorCatch(diceString: string) {
  const d0FindExp = /D0/g;
  const d0Find = diceString.match(d0FindExp) || [];

  const ddFindExp = /D{2,200}/g;
  const ddFind = diceString.match(ddFindExp) || [];

  if (d0Find.length !== 0) {
    return {
      errorNumber: 1,
      errorMessage: '0면체 주사위는 굴릴 수 없습니다.',
    } satisfies RollError;
  }

  if (ddFind.length !== 0) {
    return {
      errorNumber: 2,
      errorMessage: '주사위식에 D가 여러개 적인 부분이 있습니다.',
    } satisfies RollError;
  }

  return {
    errorNumber: 0,
    errorMessage: '에러가 없습니다.',
  };
}
