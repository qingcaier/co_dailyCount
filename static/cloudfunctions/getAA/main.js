function dispatch(list) {
  let result = [];
  let average = list.reduce((total, n) => total + n.count, 0) / list.length;
  let tempList = list.map((item) => {
    return {
      openid: item.openid,
      count: item.count - average,
    };
  });

  let debtors = tempList.filter((item) => item.count < 0);
  let creditors = tempList.filter((item) => item.count > 0);

  recursive(debtors, creditors);

  function recursive(arr1, arr2) {
    const len = arr1.length;
    if (arr1.length === 1) {
      for (let i = 0; i < arr2.length; i++) {
        result.push({
          creditor: arr2[i].openid,
          debtor: arr1[0].openid,
          count: arr2[i].count,
        });
      }
    } else if (arr2.length === 1) {
      for (let i = 0; i < arr1.length; i++) {
        result.push({
          creditor: arr2[0].openid,
          debtor: arr1[i].openid,
          count: -arr1[i].count,
        });
      }
    } else {
      for (let i = 0; i < arr1.length; i++) {
        let flag = false;
        for (let j = 0; j < arr2.length; j++) {
          if (arr1[i].count + arr2[j].count === 0) {
            result.push({
              creditor: arr2[j].openid,
              debtor: arr1[i].openid,
              count: arr2[j].count,
            });
            arr1.splice(i, 1);
            arr2.splice(j, 1);
            flag = true;
            break;
          }
        }
        if (flag) {
          break;
        }
      }

      if (arr1.length < len) {
        recursive(arr1, arr2);
      } else {
        let quater = arr2[0].count + arr1[0].count;
        if (quater > 0) {
          result.push({
            creditor: arr2[0].openid,
            debtor: arr1[0].openid,
            count: -arr1[0].count,
          });
          arr1.splice(0, 1);
          arr2[0].count = quater;

          recursive(arr1, arr2);
        } else {
          result.push({
            creditor: arr2[0].openid,
            debtor: arr1[0].openid,
            count: arr2[0].count,
          });

          arr2.splice(0, 1);
          arr1[0].count = quater;

          recursive(arr1, arr2);
        }
      }
    }
  }
  return result;
}

export default dispatch;

// let data = [
//   {
//     openid: "蔡梓彬",
//     count: 45,
//   },
//   {
//     openid: "倪顺丰",
//     count: 50,
//   },
// ];

// console.log(dispatch(data));
