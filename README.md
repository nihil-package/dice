# @nihilapp/dice
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
npm install @nihilapp/dice
```

```bash
yarn add @nihilapp/dice
```

# 사용법 (usage)
지금부터 사용법에 대해 알아보겠습니다. 모든 기능은 `Dice` 클래스 안에서 실행됩니다. 결과적으로 사용되는 메소드는 두가지입니다.

*Now, let's learn about how to use it. All functions are executed within the `Dice` class. Ultimately, there are two methods that are used.*

```ts
import {Dice} from '@nihilapp/dice';
```

먼저 `@nihilapp/dice` 패키지에서 `Dice` 클래스를 임포트하세요.

*First, import the `Dice` class from the `@nihilapp/dice` package.*

## Dice.rollToFormula

```ts
Dice.rollToFormula({
  formula: 'd20+3d30 d8+7 2d20kh1',
});
```

```ts
type RollMode = 'default' | 'min' | 'max';

type RollDiceProps = {
  formula: string;
  mode?: RollMode;
  isAdvantage?: boolean;
  isDisAdvantage?: boolean;
  selectCount?: number;
};
```

`Dice.rollToFormula` 는 `RollDiceProps` 타입의 객체를 인수로 받습니다. 그리고 다음과 같은 타입의 결과를 보여줍니다.

```ts
type DiceResult = {
  formula: string;
  total: number;
  result: number[];
  ignore: number[];
};

type RollResult = {
  formula: string;
  total: number;
  dices: DiceResult[];
  mod: number[];
};
```

### RollDiceProps.formula: string
`formula` 프로퍼티는 필수값이며 여기에 주사위 수식 문자열을 입력하면 됩니다.

*The `formula` property is required, and you need to enter the dice formula string here.*

### RollDiceProps.mode: RollMode
`mode` 프로퍼티는 주사위를 최대값으로 굴릴 것인지, 최소값으로 굴릴 것인지, 일반적인 굴림을 할 것인지를 선택합니다. 기본값은 `'default'` 입니다.

*The `mode` property allows you to choose whether to roll the dice for the maximum value, minimum value, or a regular roll. The default value is `'default'`.*

## 주사위 수식(Dice Expression)
사실 그 의외의 것들은 몰라도 됩니다. 어떤 주사위식을 넣으면 내부적으로 알아서 넣어주기 때문입니다. 이제는 지원하는 주사위 수식의 예시를 설명하도록 하겠습니다.

*Actually, you don't need to know about the other details because any dice expression you input will be handled internally. Now, let's explain some examples of supported dice expressions.*

### nDn
가장 일반적인 형태의 주사위 수식입니다. 첫번째 n에는 주사위의 개수가 들어갑니다. 생략하면 자동으로 1로 인식합니다. D는 주사위를 의미하고 두번째 n에는 주사위의 면을 의미합니다. 4D6은 D6을 4번 굴린다. 라는 의미와 같습니다.

*This is the most common form of a dice expression. The first **n** represents the number of dice. If omitted, it defaults to 1. **D** signifies the dice, and the second **n** represents the number of sides on the dice. For example, **4D6** means rolling a six-sided die four times.*

### nDn+n / nDn-n
주사위의 값에서 고정된 수치의 특정 값을 더하거나 뺄 수 있습니다. **D20-4** 라는 주사위 수식을 입력했을 때, **D20**을 굴리고 **6**이 나왔다면 **-4**를 해서 **2**가 최종 결과값이 됩니다.

*You can add or subtract a fixed value from the dice roll result. For example, if you input the dice expression **D20-4**, and the roll result of **D20** is **6**, then subtracting 4 results in a final value of **2**.*

### nDn+nDn / nDn-nDn
주사위에다가 주사위의 값을 더하거나 뺄 수도 있습니다. **D20+D8**을 입력하면 **D20**을 굴리고 **D8**을 굴린 후에 이를 모두 합산합니다.

*You can also add or subtract the result of one dice roll to or from another dice roll. For example, if you input **D20+D8**, it rolls a **D20** and a **D8**, then sums the results.*

### nDn nDn
주사위 수식에 공백을 넣으면 총합을 따로 구합니다. 두가지의 주사위를 각각 한번씩 굴린 결과와 같습니다.

*If you include a space in the dice expression, each part is rolled separately, similar to rolling two different dice once each and summing the results.*

### nDn*n
같은 주사위를 여러번 굴린다는 것을 의미합니다. 예를 들어 2D8 은 D8*2와 같은 결과를 보여줍니다. 다른 주사위식과는 호환되지 않는 기능이므로 따로 사용하는 것을 권장합니다.

*It means rolling the same dice multiple times. For example, **2D8** would show the same result as **D8\*2**.*

### nDnkhn / nDnkln
이 형태의 주사위 수식은 던전앤 드래곤 5판에서 유리점(advantage) 혹은 불리점(disadvantage) 기능으로 알려진 "높은 값 유지 (kh)" 혹은 "낮은 값 유지 (kl)" 기능에서 유래되었습니다.

khn: n개의 주사위 결과 중에서 가장 높은 값을 선택합니다. 예를 들어, 2D20kh1은 20면체 주사위(D20)를 2번 굴리고, 그 중에서 가장 높은 값을 선택합니다.

kln: n개의 주사위 결과 중에서 가장 낮은 값을 선택합니다. 예를 들어, 4D30kl3은 30면체 주사위(D30)를 4번 굴리고, 그 중에서 가장 낮은 3개의 값을 선택합니다.

*This type of dice expression originates from the advantage/disadvantage mechanic in Dungeons & Dragons 5th Edition, known as "keep highest (kh)" or "keep lowest (kl)" features.*

*khn: Keep the highest n dice rolls. For example, 2D20kh1 means rolling 2 twenty-sided dice (D20) and selecting the highest value from the two.*

*kln: Keep the lowest n dice rolls. For example, 4D30kl3 means rolling 4 thirty-sided dice (D30) and selecting the lowest 3 values.*

*These mechanics are commonly used in situations where characters have advantage or disadvantage on a roll, affecting the outcome based on the best or worst results of multiple dice rolls.*
