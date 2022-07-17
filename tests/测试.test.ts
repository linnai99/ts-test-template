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

import { 令牌, 令牌类型, 分词, 解析, 通用解析 } from '../src/分词'
// const fs = require('fs')
// const path = require('path')

import * as fs from 'fs'
// test('分词1', () => {
//   expect(分词("12e3,456")).toStrictEqual([{
//     type: 令牌类型.数字,
//     content: '12e3',
//     index: 0
//   }
//     , {
//     type: 令牌类型.逗号,
//     content: ',',
//     index: 4
//   }
//     , {
//     type: 令牌类型.数字,
//     content: '456',
//     index: 5
//   }
//   ])
//   expect(分词(`"qwe", 123`)).toStrictEqual([{
//     type: 令牌类型.字符串,
//     content: 'qwe',
//     index: 0
//   }, {
//     type: 令牌类型.逗号,
//     content: ',',
//     index: 5
//   }, {
//     type: 令牌类型.数字,
//     content: '123',
//     index: 7
//   }])
//   // console.log(分词(`"qwe","asd","",2334`));

//   expect(分词(`"qwe","asd","",2334`)).toStrictEqual([{
//     type: 令牌类型.字符串,
//     content: 'qwe',
//     index: 0
//   }, {
//     type: 令牌类型.逗号,
//     content: ',',
//     index: 5
//   }, {
//     type: 令牌类型.字符串,
//     content: 'asd',
//     index: 6
//   }, {
//     type: 令牌类型.逗号,
//     content: ',',
//     index: 11
//   }, {
//     type: 令牌类型.字符串,
//     content: '',
//     index: 12
//   },
//   {
//     type: 令牌类型.逗号,
//     content: ',',
//     index: 14
//   },
//   {
//     type: 令牌类型.数字,
//     content: '2334',
//     index: 15
//   }])
// })
// test('分词2', () => {
//   expect(分词(`[1,2]`)).toStrictEqual([
//     {
//       type: 令牌类型.左中括号,
//       content: `[`
//     }, {
//       type: 令牌类型.数字,
//       content: '1'
//     },
//     {
//       type: 令牌类型.逗号,
//       content: ','
//     },
//     {
//       type: 令牌类型.数字,
//       content: '2'
//     },
//     {
//       type: 令牌类型.右中括号,
//       content: `]`
//     }
//   ])
// })
// test('分词3', () => {
//   expect(分词(`{"qwe":"123"}`)).toStrictEqual([
//     {
//       type: 令牌类型.左大括号,
//       content: `{`
//     },
//     {
//       type: 令牌类型.字符串,
//       content: `qwe`
//     },
//     {
//       type: 令牌类型.冒号,
//       content: `:`
//     },
//     {
//       type: 令牌类型.字符串,
//       content: `123`
//     },
//     {
//       type: 令牌类型.右大括号,
//       content: `}`
//     }
//   ])
// })
test('解析', () => {
  // const q = `["x"` `[1,`   [1,] 
  // `[1,
  //   1
  //   ,1`
  // [""
  // `[{}`   {"asd":"asd"
  // `[-1.0.]` `[-1.0.1]`
  // `[1.8011670033376514H-308]`
  // `[.123]`
  // `[012]`
  // `{"x"::"b"}`
  // `{"�":"0",}`
  // `{"a" b}` 分词为{ a了
  // `{"a":`   {"a"  {"a
  //     `{ "foo" : "bar", "a" }`  {"a":"b"}#
  // *
  const q =`{"asd":2` 
  expect(() => 解析(分词(q))).toThrowError()
  // expect(解析(分词(q))).toStrictEqual(JSON.parse(q))
  // expect(解析(分词(`null`))).toStrictEqual(null)
  // expect(解析(分词(`false`))).toStrictEqual(false)
  // expect(解析(分词(`true`))).toStrictEqual(true)
  const json =
  `
  [
    "qwe",
    [1e2, 23, [4], []],
    "asd",456,
    [], [[]], [[[[[[
      {"asd":123,"zxc":{"zxcv":123, "qwe": []}}
    ]]]]]],
    12e3,"asf"
  ]
  `
  // const tokens = 分词(json)
  // expect(解析(tokens)).toStrictEqual(JSON.parse(json))
  // expect(解析(分词(`["qwe"]`))).toStrictEqual(["qwe"])  

  // expect(解析(分词(`{"qwe":{"qwer":"wqe"}, "asd":"asdf"}`))).toStrictEqual({
  //   asd: "asdf",
  //   qwe: {qwer:"wqe"},

  // });

})
test('解析数据', () => {
  const folderPath = 'JSONTestSuite/test_parsing'
  fs.readdirSync(folderPath).forEach(item => {
    // console.log(item);
    const file_content = fs.readFileSync(`${folderPath}/${item}`, 'utf8')
    // if (item[0] === "y") {
    //   expect(解析(分词(file_content)), file_content).toStrictEqual(JSON.parse(file_content));
    // }

    // if (item[0] === "n") {
    //   const tokens = 分词(file_content)
    //   expect(() => 解析(tokens), file_content).toThrowError()
    // } else if (item[0] === "y") {
    //   expect(解析(分词(file_content)), file_content).toStrictEqual(JSON.parse(file_content));
    // }

  })
})
test('错误分词', () => {
  // expect(() => 分词(`"""`)).toThrowError("字符串异常停止")
  // expect(() => 解析(分词(`{{}`))).toThrowError("字符串异常停止")
  // expect(解析(tokens)).toStrictEqual(JSON.parse(json)) // 1. 这里应该仿照下面错误分词哪里, 用toThrowError, 而不是用toStrictEqual
  const json = `[`
  // {{}
  // {}}
  // const tokens = 分词(json)
  // expect(() => 解析(tokens)).toThrowError()
  // expect(() => 解析(tokens)).toThrowError(`语法错误: 预期外的字符 ${tokens[tokens.length - 1].content}`)

})


