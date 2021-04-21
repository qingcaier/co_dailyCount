const cloud = require('wx-server-sdk')
cloud.init({
	env: "qingczb-mint-test-hqawo",
})
const db = cloud.database();
const dbOptions = db.command;
const $ = dbOptions.aggregate;
const getSkipIndex = function(totalNum, pageIndex, pageCount) {
	if (totalNum < pageIndex * pageCount) {
		return {
			skip: 0,
			limit: totalNum - (pageIndex - 1) * pageCount
		}
	} else {
		return {
			skip: totalNum - pageIndex * pageCount,
			limit: pageCount
		}
	}
}
exports.main = async (event, context) => {
	try {
		console.log("传值", event);
		console.log(context);

		// 获取当前页和每页请求条数
		const {
			pageIndex = '',
				pageCount
		} = event;
		if (pageIndex !== '' && pageCount) {
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

				const {
					total: totalNum
				} = (await db.collection("countRecords").where({
					"creator": dbOptions.in(members),
					"state": dbOptions.neq(-1)
				}).count());

				const totalPage = Math.ceil(totalNum / pageCount);

				let list = [];
				if (totalPage >= pageIndex) {
					const {
						skip,
						limit
					} = getSkipIndex(totalNum, pageIndex, pageCount);
					console.log("skip", skip, limit)
					list = (await db.collection("countRecords").aggregate().match({
							"creator": dbOptions.in(members),
							"state": dbOptions.neq(-1)
						})
						.lookup({
							from: "users",
							localField: "creator",
							foreignField: "_id",
							as: "userInfo"
						})
						.replaceRoot({
							newRoot: $.mergeObjects([$.arrayElemAt(['$userInfo', 0]), '$$ROOT'])
						})
						.project({
							userInfo: 0
						}).skip(skip).limit(limit).sort({
							createTime: 1
						}).end()).list;
				}



				console.log("记录", list);
				console.log("总数", totalNum);

				return ({
					head: {
						resCode: "000000",
						resMsg: "交易成功"
					},
					body: {
						list,
						totalNum
					}
				})
			}else {
				return {
					head: {
						resCode: "200005",
						resMsg: "对不起，您的用户异常"
					}
				}
			}
		} else {
			return {
				head: {
					resCode: "100002",
					resMsg: "参数校验异常"
				}
			}
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
