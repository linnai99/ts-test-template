export const f = (a: string): number => {
  return a.length;
};
export function 是否是字符串(a: string) {
  if (a==="") return true;

  const 第一位 = a[0];
  const 最后一位 = a[a.length - 1];
  if (a.length >= 2 && 第一位 === '"' && 最后一位 === '"') {
    return true;
  }
  return false;
}

export function 是否是数字(a: string) {
  for (let i = 0; i < a.length; i++) {
    // console.log(a[i], !"0123456789".includes(a[i]));
    if (!"0123456789".includes(a[i])) {
      return false;
    }
  }
  return true;
}

export function 是否是null(a: string) {
  return a === "null";
}

export function 是否是逻辑值(a: string) {
  return a === "true" || a === "false";
}

export function 是否是对象(a: string) {
  if (a.length >= 2 && a[0] === `{` && a[a.length - 1] === `}`) {
    // if(a.length===2){
    //     return true;
    // }
    // let x =0;
    // for(let i=1;i<a.length-1;i++){
    //     if(a[i]===`:`){
    //         x=i;
    //     }
    // }
    return true;
  }
  return false;
}

export function 是否是数组(a: string) {
  if (a.length >= 2 && a[0] === `[` && a[a.length - 1] === `]`) {
    return true;
  }
  return false;
}

console.assert(是否是字符串(`"123"`) === true);
console.assert(是否是数字(`12s3`) === false);
console.assert(是否是数字(`123`) === true);
console.assert(是否是数字(`asd123a`) === false);
console.assert(是否是null(`null`) === true);
console.assert(是否是null(`nu1ll`) === false);
console.assert(是否是逻辑值(`true`) === true);
console.assert(是否是逻辑值(`tru1`) === false);

// ----------

export function 解析JSON(a: string) {
  if (是否是字符串(a)) {
    return 解析字符串(a);
  } else if (是否是数字(a)) {
    return 解析数字(a);
  } else if (是否是null(a)) {
    return 解析null(a);
  } else if (是否是逻辑值(a)) {
    return 解析逻辑值(a);
  } else if (是否是对象(a)) {
    return 解析对象(a);
  } else if (是否是数组(a)) {
    return 解析数组(a);
  }
}

// export function parseValue(a:string) {

//     const value =
//         解析字符串(a) ??
//         解析数字(a);

//     return value;
//   }

export function 解析字符串(a: string) {
  // console.log("2");
  let result = "";
  if (a==="") return result;
  for (let i = 1; i < a.length - 1; i++) {
    result += a[i];
  }
  return result;
}

export function 解析数字(a: string) {
  return Number(a);
}

export function 解析null(a: string) {
  return null;
}

export function 解析逻辑值(a: string) {
  return a === "true" ? true : false;
}

export function 解析对象(a: string) {
  let result = {};
  let i = 0;
  let t = 1;
  let initial = true;
  if (a[i] === `{`) {
    i++;
    while (i < a.length && a[i] !== `}`) {
      if (!initial) {
        if (a[i - 2] === ",") {
          i++;
        }
      }
      // console.log(是否是字符串(a.slice(1,i)));
      if (是否是字符串(a.slice(t, i))) {
        const key = 解析字符串(a.slice(t, i));
        // console.log('key',key);
        if (a[i] === `:`) {
          i++;
        }
        let x = i;
        let value;
        // const value = 解析数字(a.slice(i,a.length-1));
        // && a[i]!==`}`遇到包含对象就会跳出了
        while (i < a.length) {
          if (a[i] === `[`) {
            console.log("进去");
            while (a[i] !== `]`) {
              if (是否是数组(a.slice(x, i))) {
                解析数组(a.slice(x, i));
              }
              i++;
            }
          }
          value = 解析JSON(a.slice(x, i));
          console.log("va1", value);
          //按照键值对，逗号分开，跳出拿value的值，再到下一个键值
          //但是遇到了对象里包裹数组的话，遇到逗号就跳出了
          if (a[i] === `,`) {
            i++;
            break;
          }
          i++;
        }
        t = i;
        result[key] = value;
        initial = false;
      }
      i++;
    }
  }
  return result;
}

export function 解析数组(a: string) {
  let result = [];
  let i = 0;
  let t = 1;
  let initial = true;
  if (a[i] === `[`) {
    i++;
    while (i < a.length && a[i] !== `]`) {
      if (!initial) {
        console.log(a[i]);
        if (a[i] === ",") {
          i++;
        }
      }
      let value;
      while (i <= a.length - 1) {
        // console.log('t',a.slice(t,i));
        value = 解析JSON(a.slice(t, i));
        // console.log('va1',value);
        if (a[i] === `,`) {
          break;
        }
        i++;
      }
      result.push(value);
      initial = false;
      i++;
      t = i;
    }
  }
  return result;
}
