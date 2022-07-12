// import {
//   f,
//   是否是字符串,
//   是否是null,
//   是否是数字,
//   是否是逻辑值,
//   是否是对象,
//   是否是数组,
//   解析JSON,
//   解析对象,
// } from "../src/is";
// import { g } from "../src/g";

// test("length of g", () => {
//   expect(f(g)).toBe(g.length);
// });

// test("asd", () => {
//   expect(1 + 1).toBe(2);
// });
// test("是否是字符串", () => {
//   expect(是否是字符串(`"123"`)).toBe(true);
// });
// test("是否是null", () => {
//   expect(是否是null(`null`)).toBe(true);
// });
// test("是否是数字", () => {
//   expect(是否是数字(`12s3`)).toBe(false);
// });
// test("是否是数字", () => {
//   expect(是否是数字(`123`)).toBe(true);
// });
// test("是否是逻辑值", () => {
//   expect(是否是逻辑值(`true`)).toBe(true);
// });

// test("是否是对象", () => {
//   expect(是否是对象(`{}`)).toBe(true);
// });
// test("是否是数组", () => {
//   expect(是否是数组(`[]`)).toBe(true);
// });

// test("解析JSON-字符", () => {
//   expect(解析JSON(`"qwe"`)).toBe("qwe");
// });
// test("解析JSON-数字", () => {
//   expect(解析JSON(`1234`)).toBe(1234);
// });
// test("解析JSON-null", () => {
//   expect(解析JSON(`null`)).toBe(null);
// });
// test("解析JSON-逻辑值", () => {
//   expect(解析JSON(`true`)).toBe(true);
// });
// test("解析JSON-逻辑值", () => {
//   expect(解析JSON(`false`)).toBe(false);
// });
// test("解析JSON-对象1", () => {
//   expect(解析JSON(`{"qwe":123}`)).toStrictEqual({ qwe: 123 });
// });
// test("解析JSON-对象2", () => {
//   expect(解析JSON(`{"qwe":"123"}`)).toStrictEqual({ qwe: "123" });
// });
// test("解析JSON-对象3", () => {
//   expect(解析JSON(`{"qwe":true}`)).toStrictEqual({ qwe: true });
// });
// test("解析JSON-对象4", () => {
//   expect(解析JSON(`{"qwe":true,"a":1}`)).toStrictEqual({ qwe: true, a: 1 });
// });
// test("解析JSON-对象5", () => {
//   expect(解析JSON(`{"qwe":true,"a":1,"sd":"zxc"}`)).toStrictEqual({
//     qwe: true,
//     a: 1,
//     sd: "zxc",
//   });
// });
// test("解析JSON-对象6", () => {
//   expect(解析JSON(`{"qwe":true,"a":1,"sd":"zxc","df":{"a":1}}`)).toStrictEqual({
//     qwe: true,
//     a: 1,
//     sd: "zxc",
//     df: { a: 1 },
//   });
// });
// test("解析JSON-对象7", () => {
//   expect(解析JSON(`{"asd":"asdf","qwe":"qwer"}`)).toStrictEqual({
//     asd: "asdf",
//     qwe: "qwer",
//   });
// });
// test("解析JSON-数组", () => {
//   expect(解析JSON(`[1,2,"sd"]`)).toStrictEqual([1, 2, "sd"]);
// });
// test("解析JSON-数组2", () => {
//   expect(解析JSON(`[1,2,"sd",{"asd":1,"z":"中文"}]`)).toStrictEqual([
//     1,
//     2,
//     "sd",
//     { asd: 1, z: "中文" },
//   ]);
// });
// test("解析JSON", () => {
//   expect(解析JSON(`[[[[[[[[`)).toStrictEqual({
//     asd: [1, 2, 3],
//   });
//   expect(解析JSON(`{"asd":[1,2,3]}`)).toStrictEqual({
//     asd: [1, 2, 3],
//   });
//   expect(解析JSON(`{"asd":[1,2,3],"zxc":{"qwe":[1,2]}}`)).toStrictEqual({
//     asd: [1, 2, 3],
//     zxc: { qwe: [1, 2] },
//   });
// });

import { 令牌, 令牌类型, 分词,解析 } from '../src/分词'

test('分词1', () => {
  expect(分词("123, 234")).toStrictEqual([{
    type: 令牌类型.数字,
    content: '123'
  }, {
    type: 令牌类型.逗号,
    content: ','
  }, {
    type: 令牌类型.数字,
    content: '234'
  }])
  expect(分词(`"qwe", 123`)).toStrictEqual([{
    type: 令牌类型.字符串,
    content: 'qwe'
  }, {
    type: 令牌类型.逗号,
    content: ','
  }, {
    type: 令牌类型.数字,
    content: '123'
  }])
  // console.log(分词(`"qwe","asd","",2334`));
  
  expect(分词(`"qwe","asd","",2334`)).toStrictEqual([{
    type: 令牌类型.字符串,
    content: 'qwe'
  }, {
    type: 令牌类型.逗号,
    content: ','
  }, {
    type: 令牌类型.字符串,
    content: 'asd'
  }, {
    type: 令牌类型.逗号,
    content: ','
  }, {
    type: 令牌类型.字符串,
    content: ''
  },
  {
    type: 令牌类型.逗号,
    content: ','
  },
  {
    type: 令牌类型.数字,
    content: '2334'
  }])
})
test('分词2', () => {
  expect(分词(`[1,2]`)).toStrictEqual([
    {
      type: 令牌类型.左中括号,
      content: `[`
    }, {
      type: 令牌类型.数字,
      content: '1'
    },
    {
      type: 令牌类型.逗号,
      content: ','
    },
    {
      type: 令牌类型.数字,
      content: '2'
    },
    {
      type: 令牌类型.右中括号,
      content: `]`
    }
  ])
})
test('分词3', () => {
  expect(分词(`{"qwe":"123"}`)).toStrictEqual([
    {
      type: 令牌类型.左大括号,
      content: `{`
    },
    {
      type: 令牌类型.字符串,
      content: `qwe`
    },
    {
      type: 令牌类型.冒号,
      content: `:`
    },
    {
      type: 令牌类型.字符串,
      content: `123`
    },
    {
      type: 令牌类型.右大括号,
      content: `}`
    }
  ])
})
test('解析',()=>{
  // expect(解析(`"qwe"`)).toStrictEqual("qwe"),
  // expect(解析(`1234`)).toStrictEqual(1234),
  const json = `
  [
    "qwe",
    [123, 23, [4], []],
    "asd",456,
    [], [[]], [[[[[[
      {"asd":123,"zxc":{"zxcv":123}}
    ]]]]]]
  ]

  `
  const tokens = 分词(json)
  // expect(解析(分词(`["qwe"]`))).toStrictEqual(["qwe"])
  expect(解析(tokens).result).toStrictEqual([
    "qwe",
    [123, 23, [4], []],
    "asd",456,
    [], [[]], [[[[[[
      {"asd":123,"zxc":{"zxcv":123}}
    ]]]]]]
  ])
  // expect(解析(分词(`{"qwe":{"qwer":"wqe"}, "asd":"asdf"}`))).toStrictEqual({
  //   asd: "asdf",
  //   qwe: {qwer:"wqe"},
   
  // });

}) 
test('错误分词', () => {
  expect(() => 分词(`"""`)).toThrowError("字符串异常停止")
  // expect(() => 解析(分词(`{{}`))).toThrowError("字符串异常停止")
})
