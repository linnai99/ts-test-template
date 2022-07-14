import { assert } from "console";
import { copyFileSync } from "fs";

export enum 令牌类型 {
  左大括号 = "{",
  右大括号 = "}",
  左中括号 = "[",
  右中括号 = "]",
  引号 = "'",
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
  index: number
}
export const 是否是数字开头 = String.prototype.includes.bind(`-.0123456789`)

export function 是否是数字(a: string) {
  // console.log("qq", a);
  // 遇到负数-123 小数点.123 浮点数12.23 零开头的0123 中间有e的
  // 特征: - . <num>
  if (!"0123456789".includes(a)) {
    return false;

  }
  return true;
}
export function 是否是字符串(a: string) {
  // console.log("a", a);
  if (a === "") return true;

  const 第一位 = a[0];
  const 最后一位 = a[a.length - 1];
  if (a.length >= 2 && 第一位 === '"' && 最后一位 === '"') {
    return true;
  }
  return false;
}
export interface 解析令牌响应 {
  index_increment: number,
  result: string,
  type: 令牌类型,
  error?: string,
}
export function 解析字符串(a: string): 解析令牌响应 {
  const res: 解析令牌响应 = {
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
  if (res.index_increment === 1) {
    res.error = "字符串异常停止"
    throw `字符串异常停止 ${res}`
  }

  return res;
}

function 解析数字(a: string): 解析令牌响应 {
  const res: 解析令牌响应 = {
    index_increment: 0,
    result: "",
    type: 令牌类型.数字
  }
  for (let i = 0; i < a.length;) {
    if (a[i] === "0") {
      i++;
    } else if (a[i] >= "1" && a[i] <= "9") {
      i++;
      while (a[i] >= "0" && a[i] <= "9") {
        i++;
      }
      res.result = a.slice(0, i);
    } else if (a[i] === "-") {
      i++;
      if ((a[i] >= "0" && a[i] <= "9")) {
      }
    } else if (a[i] === ".") {
      i++;
      if ((a[i] >= "0" && a[i] <= "9")) {

      }
      while (a[i] >= "0" && a[i] <= "9") {
        i++;
      }
      res.result = a.slice(0, i)
    } else if (a[i] === "e" || a[i] === "E") {
      i++;
      if (a[i] === "-" || a[i] === "+") {
        i++;
      }
      if ((a[i] >= "0" && a[i] <= "9")) {
      }
      while (a[i] >= "0" && a[i] <= "9") {
        i++;
      }
      res.result = a.slice(0, i);
    } else {
      break;
    }
    res.index_increment = i

  }
  // for (const i of a) {
  //   if (是否是数字(i)) {
  //     console.log("i", i)
  //     res.result += i
  //     res.index_increment += 1
  //   } else {
  //     break
  //   }
  // }
  return res
}
export function 分词(a: string): Array<令牌> {
  const res: 令牌[] = [];

  for (let i = 0; i < a.length;) {

    const char = a[i];
    let r: 解析令牌响应;

    if (" \t\n\r".includes(char)) {
      i += 1
    } else if (是否是数字开头(char)) {
      // console.log("char",char)
      r = 解析数字(a.slice(i))
      res.push({
        content: r.result,
        type: r.type,
        index: i
      })
      i += r.index_increment
    } else if (char === `{`) {
      res.push({
        content: char,
        type: 令牌类型.左大括号,
        index: i
      });
      i += 1
    } else if (char === `}`) {
      res.push({
        content: char,
        type: 令牌类型.右大括号,
        index: i
      });
      i += 1
    } else if (char === `[`) {
      res.push({
        content: char,
        type: 令牌类型.左中括号,
        index: i
      });
      i += 1
    } else if (char === `]`) {
      res.push({
        content: char,
        type: 令牌类型.右中括号,
        index: i
      });
      i += 1
    } else if (char === `,`) {
      res.push({
        content: char,
        type: 令牌类型.逗号,
        index: i
      });
      i += 1
    } else if (char === `:`) {
      res.push({
        content: char,
        type: 令牌类型.冒号,
        index: i
      });
      i += 1
    } else if (char === `"`) {
      r = 解析字符串(a.slice(i));
      res.push({
        content: r.result,
        type: r.type,
        index: i
      })
      i += r.index_increment
    } else {
      break
    }

    if (r?.error) {
      throw `error: ${r.error} 于位置 ${i}`
    }
  }
  // console.log("vi", res)
  return res;
}

export interface 解析对象响应 {
  index_increment: number,
  result: any
}

function 解析数组(arr: Array<令牌>): 解析对象响应 {
  const res: 解析对象响应 = {
    index_increment: 1,
    result: [],
  }
  for (let i = 1; i < arr.length;) {
    const curr_token = arr[i];
    if (curr_token.type === ']') {
      res.index_increment = i + 1
      break
    } else if (curr_token.type === ",") {
      i++;
    } else {
      const current_array_res = 通用解析(arr.slice(i))
      res.result.push(current_array_res.result)
      i += current_array_res.index_increment
    }
    // i的结果最后要返回给res的i的增量,这样主函数才能拿到i的增加数
    res.index_increment = i
    // console.log("res", res);

  }
  if (arr.length === 1 && arr[0].type === '[') {
    throw `语法错误: 预期外的字符 [`
  }
  return res;
}
function 解析对象(arr: Array<令牌>): 解析对象响应 {
  const res: 解析对象响应 = {
    index_increment: 1,
    result: {},
  }
  let key, value;
  for (let i = 1; i < arr.length;) {
    // console.log('arr[i]',arr[i])
    if (arr[i].type === "}") {
      res.index_increment = i + 1;
      break;
    }
    if (key === undefined) {
      if (arr[i].type === "{") {
        throw `语法错误: 预期外的字符: ${arr[i].content}`
      }
      key = 通用解析([arr[i]]).result;
      // console.log('key',key,arr[i])
      i++;
    } else if (arr[i].type === ":") {
      i++;
    } else if (value === undefined) {
      const curr_res = 通用解析(arr.slice(i));
      // console.log("xxx",arr.slice(i));  
      value = res.result[key] = curr_res.result;
      i += curr_res.index_increment;
    } else if (arr[i].type === ",") {
      i++;
      key = value = undefined;
    } else {
      // console.log('什么也不是', arr[i]);
      throw `什么也不是 ${arr[i]}`
      i++;
    }
    res.index_increment = i;
  }
  if (arr.length === 1 && arr[0].type === '{') {
    throw `语法错误: 预期外的字符 {`
  }
  return res;
}
export function 通用解析(tokens: 令牌[]): 解析对象响应 {
  const arr = tokens;
  const res: 解析对象响应 = {
    index_increment: 0,
    result: undefined
  }
  const curr_token = arr[res.index_increment]
  // console.log(curr_token);

  if (curr_token.type === "[") {
    const current_array_res = 解析数组(arr)
    res.result = current_array_res.result
    // console.log("i",i)
    res.index_increment = current_array_res.index_increment
  } else if (curr_token.type === "{") {
    // console.log("arra",解析数组(arr))
    const current_array_res = 解析对象(arr)
    res.result = current_array_res.result
    // console.log("res", res)
    res.index_increment = current_array_res.index_increment
    // console.log("qqq1",res.index_increment);
  }
  else if (curr_token.type === "字符串") {
    res.result = curr_token.content;
    res.index_increment = 1
  } else if (curr_token.type === "数字") {
    res.result = Number(curr_token.content);
    res.index_increment = 1
  } else if (curr_token.type === '}') {
    // console.log("qqq2",res.index_increment);
    throw `语法错误: 预期外的字符 ${curr_token.content} 在位置 ${curr_token.index}`
  } else {
    // console.log('未知的类', curr_token);
    throw `未知的类型 ${curr_token}`
  }
  // console.log("qqq3",res);
  return res;
}


export function 解析(tokens: 令牌[]): 解析对象响应 {
  const res: 解析对象响应 = {
    index_increment: 0,
    result: undefined
  }
  while (res.index_increment < tokens.length) {
    const curr_res = 通用解析(tokens.slice(res.index_increment))
    res.index_increment += curr_res.index_increment
    res.result = curr_res.result
  }
  // console.log(res, res.index_increment, tokens.length);
  return res.result
}
