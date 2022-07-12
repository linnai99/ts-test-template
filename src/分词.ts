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
}
export function 是否是数字(a: string) {
  // console.log("qq",a);
  // 遇到负数-123 小数点.123 浮点数12.23 零开头的0123 中间有e的
  if (!"0123456789".includes(a)) {
    return false;
    //   for (let i = 0; i <a.length; i++) {
    //   let start = i;
    //   if (a[i] === "-") {
    //     i++;
    //     if ((a[i] >= "0" && a[i] <= "9")) {
    //       a.slice(start, i)
    //       return true;
    //     }
    //   } 
    //   if (a[i] === "0") {
    //     i++;
    //   } else if (a[i] >= "1" && a[i] <= "9") {
    //     i++;
    //     while (a[i] >= "0" && a[i] <= "9") {
    //       i++;
    //     }
    //   }
    //   if (a[i] === ".") {
    //     i++;
    //     if ((a[i] >= "0" && a[i] <= "9")) {
    //       // 把点切割掉
    //       a.slice(start, i)
    //     }
    //     while (a[i] >= "0" && a[i] <= "9") {
    //       i++;
    //       return true;
    //     }
    //   }
    //   // console.log("a[i]",a[i])
    //   if (a[i] === "e" || a[i] === "E") {
    //     i++;
    //     if (a[i] === "-" || a[i] === "+") {
    //       i++;
    //     }
    //     if ((a[i] >= "0" && a[i] <= "9")) {
    //       a.slice(start, i)
    //     }
    //     while (a[i] >= "0" && a[i] <= "9") {
    //       i++;
    //       return true;
    //     }     
    //   }
    //   return false;
    // }
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
  }

  return res;
}

function 解析数字(s: string): 解析令牌响应 {
  const res: 解析令牌响应 = {
    index_increment: 0,
    result: "",
    type: 令牌类型.数字
  }

  for (const i of s) {
    if (是否是数字(i)) {
      console.log("i", i)
      res.result += i
      res.index_increment += 1
    } else {
      break
    }
  }

  return res
}
export interface 分词响应 {
  res: 令牌[];
  error?: string;
}
export function 分词(a: string): Array<令牌> {
  const res: 令牌[] = [];

  for (let i = 0; i < a.length;) {

    const char = a[i];
    let r: 解析令牌响应;

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
    } else if (char === `[`) {
      res.push({
        content: char,
        type: 令牌类型.左中括号,
      });
      i += 1
    } else if (char === `]`) {
      res.push({
        content: char,
        type: 令牌类型.右中括号,
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
  console.log("vi", res)
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
    }

    if (curr_token.type === ",") {
      i++;
    } else if (["数字", '字符串'].includes(curr_token.type)) {
      // curr_token是对象,但是解析函数输入是一个带content,type的数组
      // 于是加个[]

      res.result.push(解析([curr_token]));
      i++;
    } else if (curr_token.type === "[") {
      // 遇到嵌套数组,碰到[,就要把剩余数据的数组递归函数了,输入参数是带令牌的数组   
      const current_array_res = 解析数组(arr.slice(i))
      res.result.push(current_array_res.result)
      i += current_array_res.index_increment
    } else if (curr_token.type === '{') {
      const current_array_res = 解析对象(arr.slice(i))
      res.result.push(current_array_res.result)
      i += current_array_res.index_increment
    }
    else {
      i++;
    }
    // i的结果最后要返回给res的i的增量,这样主函数才能拿到i的增加数
    res.index_increment = i
  }

  return res;
}
function 解析对象(arr: Array<令牌>): 解析对象响应 {
  const res: 解析对象响应 = {
    index_increment: 1,
    result: {},
  }
  let key;
  let value;
  for (let i = 1; i < arr.length;) {
    if (arr[i].type === "}") {
      res.index_increment = i + 1;
      // console.log("进", key, value, arr[i + 1])
      break;
    }
    if (key === undefined) {
      key = 解析([arr[i]]).result;
      i++;
    } else if (arr[i].type === ":") {
      i++;
    } else if (value === undefined) {
      const curr_res = 解析([arr[i]]);
      res.result[key] = curr_res.result;
      i += curr_res.index_increment;
    } else if (arr[i].type === ",") {
      i++;
      key = undefined;
      value = undefined;
    } else {
      i++;
    }
    res.index_increment = i;
  }
  return res;
}
export function 解析(tokens: 令牌[]): 解析对象响应 {
  const arr = tokens;
  const res: 解析对象响应 = {
    index_increment: 0,
    result: undefined
  }
  // let res: Object | Array<any> | string | number;
  console.log('arr', arr);
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].type === "[") {
      // console.log("arrz",解析数组(arr.slice(i)))
      const current_array_res = 解析数组(arr.slice(i))
      res.result = current_array_res.result
      // console.log("i",i)
      i += current_array_res.index_increment
    } else if (arr[i].type === "{") {
      const current_array_res = 解析对象(arr.slice(i))
      res.result = current_array_res.result
      console.log("res", res)
      i += current_array_res.index_increment
    }
    else if (arr[i].type === "字符串") {
      res.result = arr[i].content;
      i++;
    } else if (arr[i].type === "数字") {
      res.result = Number(arr[i].content);
      i++;
      // console.log('t', res);
    }
    
    res.index_increment = i+1;
    // res.push(arr[i].content);

    // res+=arr[i].content;
    // res+=t;
    // console.log('res0', res);
  }
  console.log('res', res);
  return res;
}
