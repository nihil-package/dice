# @nihilncunia/diceroll
이 문서의 영문 번역은 Chat GPT의 도움을 받았습니다.

*The English translation of this document was assisted by ChatGPT.*
# 들어가는 말 (Introduction)

이 모듈의 존재의의는 명확합니다. 이 모듈은 그저 주사위를 굴리기 위한 모듈입니다. 이 모듈은 TRPG를 접하고나서부터 맵툴과 같은 프로그램을 보고 나도 주사위를 굴리는 프로그램을 만들어보자 라는 생각으로 시작되었습니다.

*The purpose of this module is clear. This module is simply for rolling dice. It all began with the idea of creating a program to roll dice myself after encountering programs like MapTool following my introduction to TRPG (Tabletop Role-Playing Games).*

사용법은 간단합니다. 여러 TRPG 게임에서 쓰이는 nDn 을 포함한 주사위 수식을 입력하면 끝입니다.

*The usage is straightforward. Just input dice expressions, including nDn commonly used in various TRPG games, and you're done.*

# 설치 (installation)
npm 혹은 yarn 등의 패키지 매니저를 통해서 설치할 수 있습니다.

*You can install it using package managers like npm or yarn.*

```bash
npm install @nihilncunia/diceroll
```

```bash
yarn add @nihilncunia/diceroll
```

# 사용법 (usage)
지금부터 세가지의 함수에 대해 소개하고 간단하게 사용하는 법을 알아보도록 하겠습니다.

*I will now introduce three functions and briefly explain how to use them.*

## rollDice(dice: string): RollDiceResult

```js
import { rollDice } from '@nihilncunia/diceroll';
```

한 번에 하나의 주사위를 굴릴 수 있는 함수입니다. **D2**나 **4D56**같은 주사위를 넣으면 `RollDiceResult` 타입의 결과를 리턴해줍니다.

This is a function that allows you to roll a single die at a time. When you input a die notation like **D2** or **4D6**, it will return the result in the form of a `RollDiceResult` type.

```js
rollDice('D100');
rollDice('2D100');
```

```js
{ dice: 'D100', total: 67, details: [ 67 ] }
{ dice: '2D100', total: 56, details: [ 13, 43 ] }
```

```ts
type RollDiceResult = {
  dice: string;
  total: number;
  details: number[];
};
```

`dice`는 입력한 주사위입니다. `total`은 주사위의 결과값의 총합입니다. `details`는 **3D6**이나 **2D30**같은 값을 굴렸을 때에 같은 주사위를 여러번 굴린 결과물들이 들어가는 곳입니다.

*The `dice` represents the inputted dice. `total` stands for the cumulative sum of the dice outcomes. `details` is where the results of rolling the same dice multiple times, like in cases of rolling values such as **3D6** or **2D30**, are stored.*

## rollDiceMod(diceFormula: string): RollDiceModResult

```js
import { rollDiceMod } from '@nihilncunia/diceroll';
```

한 번에 하나의 주사위 뿐만 아니라 **2D20+4+D8** 같은 여러개의 주사위를 동시에 굴릴 수 있고 보너스나 패널티 같은 보정치도 같이 적용해서 굴릴 수 있는 함수입니다. `RollDiceModResult` 타입을 리턴합니다. 주사위의 결과에 보정치만 더하고 뺄 수 있는 게 아니라 주사위의 결과에 주사위의 결과를 더하고 뺄 수 있습니다.

*This function allows you to roll multiple dice simultaneously, not only single dice at a time. You can roll expressions like **2D20+4+D8**, incorporating various dice and modifiers such as bonuses or penalties. It returns a `RollDiceModResult` type. You can apply adjustments not only by adding or subtracting from the dice results, but also by adding or subtracting results from other dice.*

```js
rollDiceMod('2D20+4+D8');
```

```js
{
  formula: '2D20+4+D8',
  diceTotal: 29,
  diceDetails: [
    { dice: '2D20', total: 21, details: [19, 2] },
    { dice: 'D8', total: 4, details: [4] }
  ],
  modDetails: [ 4 ]
}
```

```ts
type RollDiceModResult = {
  formula: string;
  diceTotal: number;
  diceDetails: RollDiceResult[];
  modDetails: number[];
};
```
`formula`는 여러분이 입력한 주사위식입니다. 주사위가 수식처럼 되어있다고 해서 저는 주사위식이라고 부르고 있습니다. `diceTotal`은 주사위들의 결과과 보정치의 결과를 합친 것입니다. `diceDetails`는 하나 하나가 `rollDice`함수의 결과물입니다. `modDetails`은 보정치들이 나열된 곳입니다.

*`formula` refers to the dice expressions you input. I use the term **"dice formula"** to describe dice arranged in such expressions. `diceTotal` is the combined result of the dice outcomes and any applied adjustments. `diceDetails` represents individual outcomes obtained from the `rollDice` function. `modDetails` is where modifiers are listed.*

# rollAllDices(formulas: string): RollDiceModResult[]

```js
import { rollAllDices } from '@nihilncunia/diceroll';
```

`rollDice`는 **하나의 주사위**를 굴립니다. `rollDiceMod`는 **하나의 주사위식**을 굴립니다. 그리고 이 `rollAllDices`는 **여러 주사위식**을 굴릴 수 있습니다. 가장 큰 범위의 기능을 갖고 있는 셈입니다.

*`rollDice` rolls a **single die.** `rollDiceMod` rolls a **single dice expression.** And this `rollAllDices` allows you to roll **multiple dice expressions.** It encompasses the broadest range of functionalities.*

주사위식과 주사위식은 공백으로 구분합니다. **'D8 2D4'** 를 입력하면 **D8**과 **2D4**를 따로 계산하고 각각의 총합을 표시합니다. 같은 주사위식의 경우에는 귀찮음을 덜기 위해 **(\*)** 를 통한 반복이 가능합니다.

*Dice expressions are separated by spaces. When you input **'D8 2D4'**, it calculates **D8** and **2D4** separately and displays their respective totals. To alleviate repetition for the same dice expression, you can use **(\*)** for duplication.*

이 함수는 최종적으로 `RollDiceModResult[]` 타입을 반환합니다.

*Ultimately, this function returns a `RollDiceModResult[]` type.*

```js
rollAllDices('D20+11 D8+7+2D6');
```

```js
[
  {
    formula: 'D20+11',
    diceTotal: 21,
    diceDetails: [
      { dice: 'D20', total: 10, details: [ 10 ] }
    ],
    modDetails: [ 11 ]
  },
  {
    formula: 'D8+7+2D6',
    diceTotal: 18,
    diceDetails: [
      { dice: 'D8', total: 4, details: [ 4 ] }
      { dice: '2D6', total: 7, details: [ 5, 2 ] }
    ],
    modDetails: [ 7 ]
  }
]
```

아래의 두 표현은 같은 결과를 보여줍니다.

*The following two expressions yield the same result.*

```js
rollAllDices('D8+2 D8+2');
rollAllDices('D8+2*2');
```

```js
[
  {
    formula: 'D8+2',
    diceTotal: 6,
    diceDetails: [
      { dice: 'D8', total: 4, details: [ 4 ] }
    ],
    modDetails: [ 2 ]
  },
  {
    formula: 'D8+2',
    diceTotal: 7,
    diceDetails: [
      { dice: 'D8', total: 5, details: [ 5 ] }
    ],
    modDetails: [ 2 ]
  }
]
```

# 프리셋 (preset)

```js
import { preset } from '@nihilncunia/diceroll';
```

위의 함수들은 직접 주사위를 굴리기 위한 함수들입니다. 여러분은 미리 준비된 주사위 프리셋을 사용할 수도 있습니다. 게임에서 자주 사용되는 주사위를 모아두었습니다.

*The above functions are direct dice rolling functions. You can also make use of pre-defined dice presets. We have gathered commonly used dice for games.*

***D2, D4, D6, D8, D10, D12, D20, 2D4, 2D8, 2D10, 3D4, 3D6, 3D8, D100***

위의 주사위들은 프리셋이 존재합니다. 사용은 다음과 같습니다.

```js
preset.diceD10();
```

```js
{ dice: 'D10', total: 6, details: [ 6 ] }
```
