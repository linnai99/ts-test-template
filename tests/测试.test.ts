import {
  f,
  是否是字符串,
  是否是null,
  是否是数字,
  是否是逻辑值,
  是否是对象,
  是否是数组,
  解析JSON,
  解析对象,
} from "../src/is";
import { g } from "../src/g";

test("length of g", () => {
  expect(f(g)).toBe(g.length);
});

test("asd", () => {
  expect(1 + 1).toBe(2);
});
test("是否是字符串", () => {
  expect(是否是字符串(`"123"`)).toBe(true);
});
test("是否是null", () => {
  expect(是否是null(`null`)).toBe(true);
});
test("是否是数字", () => {
  expect(是否是数字(`12s3`)).toBe(false);
});
test("是否是数字", () => {
  expect(是否是数字(`123`)).toBe(true);
});
test("是否是逻辑值", () => {
  expect(是否是逻辑值(`true`)).toBe(true);
});

test("是否是对象", () => {
  expect(是否是对象(`{}`)).toBe(true);
});
test("是否是数组", () => {
  expect(是否是数组(`[]`)).toBe(true);
});

test("解析JSON-字符", () => {
  expect(解析JSON(`"qwe"`)).toBe("qwe");
});
test("解析JSON-数字", () => {
  expect(解析JSON(`1234`)).toBe(1234);
});
test("解析JSON-null", () => {
  expect(解析JSON(`null`)).toBe(null);
});
test("解析JSON-逻辑值", () => {
  expect(解析JSON(`true`)).toBe(true);
});
test("解析JSON-逻辑值", () => {
  expect(解析JSON(`false`)).toBe(false);
});
test("解析JSON-对象1", () => {
  expect(解析JSON(`{"qwe":123}`)).toStrictEqual({ qwe: 123 });
});
test("解析JSON-对象2", () => {
  expect(解析JSON(`{"qwe":"123"}`)).toStrictEqual({ qwe: "123" });
});
test("解析JSON-对象3", () => {
  expect(解析JSON(`{"qwe":true}`)).toStrictEqual({ qwe: true });
});
test("解析JSON-对象4", () => {
  expect(解析JSON(`{"qwe":true,"a":1}`)).toStrictEqual({ qwe: true, a: 1 });
});
test("解析JSON-对象5", () => {
  expect(解析JSON(`{"qwe":true,"a":1,"sd":"zxc"}`)).toStrictEqual({
    qwe: true,
    a: 1,
    sd: "zxc",
  });
});
test("解析JSON-对象6", () => {
  expect(解析JSON(`{"qwe":true,"a":1,"sd":"zxc","df":{"a":1}}`)).toStrictEqual({
    qwe: true,
    a: 1,
    sd: "zxc",
    df: { a: 1 },
  });
});
test("解析JSON-数组", () => {
  expect(解析JSON(`[1,2,"sd"]`)).toStrictEqual([1, 2, "sd"]);
});
test("解析JSON-数组2", () => {
  expect(解析JSON(`[1,2,"sd",{"asd":1}]`)).toStrictEqual([
    1,
    2,
    "sd",
    { asd: 1 },
  ]);
});
test("解析JSON", () => {
  expect(解析JSON(`{"asd":[1,2,3]}`)).toStrictEqual({
    asd: [1, 2, 3],
  });
  expect(解析JSON(`{"asd":[1,2,3],"zxc":{"qwe":[1,2]}}`)).toStrictEqual({
    "asd": [1, 2, 3],
    "zxc": { "qwe": [1, 2] },
  });
});

