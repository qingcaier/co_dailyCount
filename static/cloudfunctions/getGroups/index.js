
const cloud = require('wx-server-sdk')
cloud.init({
	env: "qingczb-mint-test-hqawo",
})
const db = cloud.database();
exports.main = async (event, context) => {
	try {
		console.log("传值", event);
		console.log(context);
		const wxContext = cloud.getWXContext();

		const groups = (await db.collection("rooms").where({
			'members.userId': wxContext.OPENID
		}).get()).data;
		console.log(groups);

		if (groups && groups.length > 0) {
			return ({
				head: {
					resCode: "000000",
					resMsg: "交易成功"
				},
				body: {
					groups,
				}
			});
		} else {
			return ({
				head: {
					resCode: "200001",
					resMsg: "当前用户不在群组"
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
