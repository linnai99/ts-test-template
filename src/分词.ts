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
  type: 令牌类型,
  error?: string,
}
export function 是否是数字(a: string) {
  if (!"0123456789".includes(a)) {
    return false;
  }
  return true;
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
export function 解析字符串(a: string): 解析响应 {
  const res: 解析响应 = {
    index_increment: 1,
    result: ``,
    type: 令牌类型.字符串
  }

  for (const i of a.slice(1)) {
    if (i !== `"`) {
      res.result += i;
      res.index_increment += 1
    } else {
      res.index_increment += 1
      break
    }
  }
  if(res.index_increment===1){
    res.error = "字符串异常停止"
  }

  return res;
}

function 解析数字(s: string): 解析响应 {
  const res: 解析响应 = {
    index_increment: 0,
    result: "",
    type: 令牌类型.数字
  }

  for (const i of s) {
    if (是否是数字(i)) {
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

  for (let i = 0; i < a.length;) {
    const char = a[i];
    let r: 解析响应;

    if (" \t\n\r".includes(char)) {
      i += 1
    } else if (是否是数字(char)) {
      r = 解析数字(a.slice(i))
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
    } else if (char === `:`) {
      res.push({
        content: char,
        type: 令牌类型.冒号,
      });
      i += 1
    } else if (char === `"`) {
      r = 解析字符串(a.slice(i));
      i += r.index_increment
      res.push({
        content: r.result,
        type: r.type
      })
    } else {
      console.log(a, i);
      break
    }

    if (r?.error) {
      throw `error: ${r.error} 于位置 ${i}`
    }
  }
  return res;
}
