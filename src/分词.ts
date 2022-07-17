import { assert } from "console";
import { copyFileSync } from "fs";


class DepthLimiter {
  public current_loop_depth: number = 0;
  public readonly MAX_LOOP_DEPTH = 10000;

  public check_loop_depth() {
    if (this.current_loop_depth > this.MAX_LOOP_DEPTH) {
      throw `递归深度过大: ${this.current_loop_depth}`
    }
    this.current_loop_depth += 1
  }
  public clear() {
    this.current_loop_depth = 0
  }
}

const depth_limiter = new DepthLimiter()

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
export function 是不是n开头(a: string) {
  return a === "n"
}
export function 是不是逻辑值开头(a: string) {
  return a === "t" || a === "f"
}
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
export function 解析null(a: string): 解析令牌响应 {
  const res: 解析令牌响应 = {
    index_increment: 0,
    result: ``,
    type: 令牌类型.null
  }
  if (a.slice(0, 4) === "null") {
    res.result = null;
    res.index_increment = 4;
  } else {
    throw `不正确的null`
  }
  return res;
}
export function 解析逻辑值(a: string): 解析令牌响应 {
  const res: 解析令牌响应 = {
    index_increment: 0,
    result: ``,
    type: 令牌类型.逻辑值
  }
  for (let i = 0; i < a.length;) {
    if (a.slice(i, i + 4) === "true") {
      res.result = "true";
      res.index_increment = 4;
      i += 4
      return res;
    } else if (a.slice(i, i + 5) === "false") {
      res.result = "false";
      res.index_increment = 5;
      i += 5
      return res;
    } else {
      // console.log(a);

      throw `不正确的逻辑值${a}`
    }
  }

  // console.log(res);

  return res;
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
  if (res.result === "\x0Ba") {
    throw `不明字符`
  }

  return res;
}

function 解析正整数(s: string, dont_throw_when_zero = false): string {
  let res = ''

  for (const c of s) {
    if ("0123456789".includes(c)) {
      res += c
    } else {
      break
    }
  }
  if (dont_throw_when_zero) {
    return res
  }
  if (res.length && res[0] === "0") {
    if (res.length === 1) {
      return '0'
    } else {
      throw `长整数不能以0开头`
    }
  }
  return res
}

export function 解析整数(a: string): string {
  let res = ''
  let to_parsed = a

  if (to_parsed[0] === "-") {
    to_parsed = to_parsed.slice(1)
    res += '-'
  }

  const 正整数解析结果 = 解析正整数(to_parsed);
  if (正整数解析结果 === "") {
    throw `不正确的数字${a}`
  } else {
    res += 正整数解析结果;
  }
  if (res.length === 1 && res[0] === "-") {
    throw `只有一个负号`
  }
  return res;
}
export function 解析普通数字(a: string): string {
  const prefix = 解析整数(a);
  let i = prefix.length;
  if (a[i] !== `.`) {
    return prefix
  }
  const suffix = 解析正整数(a.slice(i + 1), true);
  if (suffix === "") {
    return prefix
  }
  return prefix + '.' + suffix
}
export function 解析科学计数法(a: string): string {
  const prefix = 解析普通数字(a);
  let i = prefix.length;
  if (a.length == 0) {
    return prefix
  }
  if (a[i] === undefined) {
    return prefix
  }
  if (a[i].toLowerCase() !== `e`) {
    return prefix
  }
  const suffix = 解析整数(a.slice(i + 1));
  if (suffix === "") {
    throw `e后面应有数字`
  }

  return prefix + 'e' + suffix
}
function 解析数字(a: string): 解析令牌响应 {
  // 1 -1 1.1 -2.0 234 123 
  // 1e2 1E2 20e3 -3e8 1.2e3
  // 解析整数 1 -1 2 0
  // 解析浮点数 := 解析整数 . 解析正整数
  // 解析普通数字 := 解析整数 | 解析浮点数
  // 解析科学计数法 := 解析普通数字 e|E 解析正整数
  // 解析数字 := 解析普通数字 | 解析科学计数法
  const res: 解析令牌响应 = {
    index_increment: 0,
    result: "",
    type: 令牌类型.数字
  }
  const temp = 解析科学计数法(a);
  res.result = temp;
  res.index_increment = temp.length;
  return res
}
export function 分词(a: string): Array<令牌> {
  const res: 令牌[] = [];
  // console.log("a",a);

  for (let i = 0; i < a.length;) {


    const char = a[i];
    let r: 解析令牌响应;

    if (" \t\n\r".includes(char)) {
      i += 1
    } else if (是否是数字开头(char)) {
      // console.log("char",char)
      r = 解析数字(a.slice(i))
      // console.log("r",r)
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
    } else if (是不是n开头(char)) {
      r = 解析null(a.slice(i));
      res.push({
        content: r.result,
        type: r.type,
        index: i
      })
      i += r.index_increment
    } else if (是不是逻辑值开头(char)) {

      r = 解析逻辑值(a.slice(i));
      res.push({
        content: r.result,
        type: r.type,
        index: i
      })
      i += r.index_increment
    } else {
      throw `语法错误: 未知的符号 ${char}`
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
  let flag = true;
  for (let i = 1; i < arr.length;) {
    const curr_token = arr[i];
    // if(curr_token.type !== ']'){
    //   throw `缺少右中括号`
    // }
    if (!flag && curr_token.type !== ']') {
      if (curr_token.type !== ",") {
        throw `缺少逗号!`
      }
      i++;
    }
    if (curr_token.type === ']') {
      res.index_increment = i + 1
      break
    }
    // console.log("arr.slice(i)", arr.slice(i));
    const current_array_res = 通用解析(arr.slice(i))
    res.result.push(current_array_res.result)
    // console.log("12",res.result);
    i += current_array_res.index_increment
    flag = false;
    // i的结果最后要返回给res的i的增量,这样主函数才能拿到i的增加数
    res.index_increment = i
    // console.log("res", res);
  }
  // console.log("qqw",res,res.index_increment,arr.length);

  if (arr.length === 1 && arr[0].type === '[') {
    throw `语法错误: 预期外的字符 [`
  }
  if (arr[res.index_increment - 1].type !== ']') {
    throw `语法错误: 数组未能正常停止`
  }
  return res;
}
function 解析对象(arr: Array<令牌>): 解析对象响应 {
  const res: 解析对象响应 = {
    index_increment: 1,
    result: {},
  }
  let key, value;
  let flag = false;
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
      if (arr[i].type === "字符串") {
        key = 通用解析([arr[i]]).result;
      } else {
        throw `键的类型异常`
      }
      // console.log('key',key,arr[i])
      i++;
    } else if (arr[i].type === ":" && !flag) {
      i++;
      flag = true;
    } else if (value === undefined && flag) {
      // console.log( "asd",i);
      const curr_res = 通用解析(arr.slice(i));
      // console.log("xxx",arr.slice(i));  
      value = res.result[key] = curr_res.result;
      i += curr_res.index_increment;
    } else if (arr[i].type === "," && flag) {
      i++;
      key = value = undefined;
      flag = false;
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
  if (arr[res.index_increment - 1].type !== '}') {
    throw `语法错误: 对象未能正常停止`
  }
  if (arr[res.index_increment - 2].type === ",") {
    throw `语法错误: 对象不应当有裸逗号`
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
  depth_limiter.check_loop_depth()

  if (curr_token.type === "[") {

    const current_array_res = 解析数组(arr)
    res.result = current_array_res.result
    // console.log("i", res)
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
    if (curr_token.content === "") {
      // console.log(arr);

      throw `数字错误`
    }
    res.result = Number(curr_token.content);
    res.index_increment = 1
  } else if (curr_token.type === '}') {
    // console.log("qqq2",res.index_increment);
    throw `语法错误: 预期外的字符 ${curr_token.content} 在位置 ${curr_token.index}`
  } else if (curr_token.type === "null") {
    res.result = curr_token.content
    res.index_increment = 1
  } else if (curr_token.type === '逻辑值') {
    res.result = curr_token.content === "true" ? true : false;
    // res.result = Boolean(curr_token.content)
    res.index_increment = 1
  } else {
    // console.log('未知的类', curr_token);
    throw `未知的类型 ${curr_token}`
  }
  // console.log("qqq3", res);
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
  depth_limiter.clear()
  // console.log(res, res.index_increment, tokens.length);
  return res.result;
}