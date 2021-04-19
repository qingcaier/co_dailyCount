const cloud = require('wx-server-sdk')
cloud.init({
	env: "qingczb-mint-test-hqawo",
})
const db = cloud.database();
const dbOptions = db.command;
exports.main = async (event, context) => {
	try {
		console.log(event, context);
		const wxContext = cloud.getWXContext();
		console.log("微信用户信息", wxContext);
		const targetUser = (await db.collection("users").where({
			_id: wxContext.OPENID
		}).get()).data;

		delete event.userInfo;
		// let targetUser = (await db.collection("users").doc(wxContext.OPENID).get()).data;
		if (targetUser.length === 0) {
			// 无此用户，则新增用户视为登录
			await db.collection('users').add({
				data: {
					_id: wxContext.OPENID,
					...event
				}
			})
		} else {
			// 已有此用户，则更新用户信息
			await db.collection("users").where({
				_id: wxContext.OPENID
			}).update({
				data: {
					...event
				}
			})
		}
		// await db.collection("users").doc(wxContext.OPENID).update({
		// 	data: {
		// 		...event
		// 	}
		// })

		return ({
			head: {
				resCode: "000000",
				resMsg: "交易成功"
			}
		})
	} catch (err) {
		console.log(err);
		return ({
			head: {
				resCode: "100001",
				resMsg: "系统异常",
			}
		})
	}
}
