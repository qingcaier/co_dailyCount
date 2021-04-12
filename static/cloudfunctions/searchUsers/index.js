const cloud = require('wx-server-sdk')
cloud.init({
	env: "qingczb-mint-test-hqawo"
})
const db = cloud.database();
exports.main = async (event, context) => {
	try {
		const wxContext = cloud.getWXContext();
		const _ = db.command;
		const openid = wxContext.OPENID;
		let targetUsers = (await db.collection("users").where({
			_id: _.neq(openid),
			nickName: db.RegExp({
			    regexp: event.nickName,
			    options: 'i',
			  }),
			state: 1
		}).get()).data;
		console.log("昵称查询结果",targetUsers);
		// if (targetUser.authority && targetUser.authority === 1) {
			return ({
				code: 200,
				msg: "success",
				data: {
					friends: targetUsers
				},
			})
		// } else {
		// 	return ({
		// 		code: 200,
		// 		msg: "success",
		// 		data: {
		// 			state: 0
		// 		},
		// 	})
		// }

	} catch (err) {
		return ({
			code: 400,
			msg: err
		})
	}
}