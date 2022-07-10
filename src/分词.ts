export enum 令牌类型 {
  左大括号 = "{",
  右大括号 = "}",
  左中括号 = "[",
  右中括号 = "]",
  引号 = ":",
  逗号 = ",",
  冒号 = ":",
  数字 = "数字",
  字符串 = "字符串",
  逻辑值 = "逻辑值",
  null = "null",
}

export interface 令牌 {
  content: string;
  type: 令牌类型;
}

export interface 解析响应 {
  index_increment: number,
  result: string,
  type: 令牌类型
}

export function 是否是字符串(a: string) {
  console.log("a", a);
  if (a === "") return true;

  const 第一位 = a[0];
  const 最后一位 = a[a.length - 1];
  if (a.length >= 2 && 第一位 === '"' && 最后一位 === '"') {
    return true;
  }
  return false;
}
export function 解析字符串(a: string) {
  // console.log("2");
  let result = "";
  if (a === "") return result;
  for (let i = 1; i < a.length - 1; i++) {
    result += a[i];
  }
  return result;
}

function 解析数字(s: string): 解析响应 {
  const res: 解析响应 = {
    index_increment: 0,
    result: "",
    type: 令牌类型.数字
  }

  for (const i of s){
    if ("0123456789".includes(i)) {
      res.result += i
      res.index_increment += 1
    } else {
      break
    }
  }

  return res
}

export function 分词(a: string): Array<令牌> {
  const res: 令牌[] = [];

  let flag = false;
  let str = "";
  let type;
  let x = 0;
  let t = "";
  for (let i = 0; i < a.length; ) {
    const char = a[i];
    if (" \t\n\r".includes(char)) {
      continue;
    }
    if ("0123456789".includes(char)){
      const r = 解析数字(a.slice(i))
      i += r.index_increment
      res.push({
        content: r.result,
        type: r.type
      })
    } else if (char === `{`) {
      res.push({
        content: char,
        type: 令牌类型.左大括号,
      });
      i += 1
    } else if (char === `}`) {
      res.push({
        content: char,
        type: 令牌类型.右大括号,
      });
      i += 1
    } else if (char === `,`) {
      res.push({
        content: char,
        type: 令牌类型.逗号,
      });
      i += 1
    }

  //   x = i;
  //   console.log("是否是字符串", a.slice(x, i + 1));
  //   t += a.slice(x, i + 1);
  //   console.log("t", t);
  //   if (是否是字符串(t)) {
  //     flag = true;
  //     str = 解析字符串(t);
  //     console.log("str", str);
  //     type = "字符串";
  //   }
  //   console.log("str1", str);
  //   if (char == ",") {
  //     if (flag) {
  //       res.push({
  //         content: str,
  //         type: type,
  //       });
  //       str = "";
  //       t = "";
  //       console.log("str2", str);
  //       flag = false;
  //       res.push({
  //         content: ",",
  //         type: 令牌类型.逗号,
  //       });
  //       console.log("str2", str);
  //     }
  //   }
  // }
  // res.push({
  //   content: str,
  //   type: type,
  // });
  // console.log("res", res);
  }
  return res;
}

// {"qwe":"123", "中文": 123}
// [`{`, `"qwe"`, `:`, `"123"`, `"中文"`, `:`, `123`, `}`]
/*
[
    {conetent:`{`, type:左大括号},
    {conetent:`qwe`, type:字符串},
    {conetent:`:`, type:冒号},
    ...

*/
