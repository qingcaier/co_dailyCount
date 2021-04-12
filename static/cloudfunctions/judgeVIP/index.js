const cloud = require('wx-server-sdk')
cloud.init({
	env: "qingczb-mint-test-hqawo"
})
const db = cloud.database();
exports.main = async (event, context) => {
	try {
		const wxContext = cloud.getWXContext();
		let targetUser = (await db.collection("users").doc(wxContext.OPENID).get()).data;
		if (targetUser.authority && targetUser.authority === 1) {
			return ({
				code: 200,
				msg: "success",
				data: {
					state: 1
				},
			})
		} else {
			return ({
				code: 200,
				msg: "success",
				data: {
					state: 0
				},
			})
		}

	} catch (err) {
		return ({
			code: 400,
			msg: err
		})
	}
}
