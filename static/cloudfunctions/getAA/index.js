const cloud = require('wx-server-sdk');
const moment = require('moment');
cloud.init({
	env: "qingczb-mint-test-hqawo",
})
const db = cloud.database();
const dbOptions = db.command;
const $ = dbOptions.aggregate;

const recursive = function recursive(arr1, arr2) {
	let result = [];
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
			const quater = arr2[0].count + arr1[0].count;
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
	return result;
};

const dispatch = function(list) {
	let result = [];
	const average = list.reduce((total, n) => total + n.count, 0) / list.length;
	const tempList = list.map((item) => {
		return {
			openid: item.openid,
			count: item.count - average,
		};
	});

	const debtors = tempList.filter((item) => item.count < 0);
	const creditors = tempList.filter((item) => item.count > 0);

	return recursive(debtors, creditors);
};

exports.main = async (event, context) => {
	try {
		console.log("传值", event);
		console.log(context);

		const {
			OPENID
		} = cloud.getWXContext();

		// 查询用户所属群组
		const group = (await db.collection("rooms").where({
			'members': OPENID
		}).get()).data;

		console.log(group);

		if (group && group.length == 1) {
			// 根据群组内用户获取群组账目记录
			const {
				members
			} = group[0];

			let {
				list = []
			} = await db.collection('countRecords').aggregate().match({
					"state": dbOptions.eq(0)
				})
				.group({
					_id: {
						openid: '$creator',
					},
					totalCount: $.sum('$count')
				})
				.end();
			console.log("countDetail", list);

			// 处理结账人少于群组内人数的情况
			if (list.length < members.length) {
				const handleList = list.map(item => item._id.openid);
				const orderMembers = members.filter(item => !handleList.includes(item));
				orderMembers.forEach(item => {
					list.push({
						_id: {
							openid: item
						},
						totalCount: 0
					})
				})
			}

			const sum = list.reduce((total, item) => total.totalCount + item.totalCount);
			console.log("sum", sum);

			if (sum > 0) {

				const tempList = list.map(item => {
					return {
						openid: item._id.openid,
						count: item.totalCount
					}
				});



				const result = dispatch(tempList);

				console.log("result", result);
				const finalList = await Promise.all(result.map(async item => {
					const {
						creditor,
						debtor
					} = item;
					const creditorInfo = (await db.collection("users").doc(creditor).get())
						.data;
					const debtorInfo = (await db.collection("users").doc(debtor).get()).data;
					return {
						count: item.count,
						creditor: {
							nickName: creditorInfo.nickName,
							avatarUrl: creditorInfo.avatarUrl
						},
						debtor: {
							nickName: debtorInfo.nickName,
							avatarUrl: debtorInfo.avatarUrl
						}
					}
				}));
				console.log("finalList", finalList);

				return ({
					head: {
						resCode: "000000",
						resMsg: "交易成功"
					},
					body: {
						result: finalList
					}
				});
			} else {
				return ({
					head: {
						resCode: "200004",
						resMsg: "对不起，您无账可结"
					}
				})
			}
		} else {
			return ({
				head: {
					resCode: "200005",
					resMsg: "对不起，您的用户异常"
				}
			});
		}
	} catch (err) {
		return ({
			head: {
				resCode: "100001",
				resMsg: "系统异常"
			}
		});
	}
}
