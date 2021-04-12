const cloud = require('wx-server-sdk')
cloud.init({
	env: "qingczb-mint-test-hqawo"
})
const db = cloud.database();
exports.main = async (event, context) => {
	try {
		console.log("传值", event);
		console.log(context);
		let {
			name,
			avatar,
			members
		} = event;
		if (!name) {
			name = "傻逼，你没有群名";
		}
		const wxContext = cloud.getWXContext();
		let creatorInfo = (await db.collection("users").doc(wxContext.OPENID).get()).data;
		const creator = {
			avatar: creatorInfo.avatarUrl,
			nickName: creatorInfo.nickName,
			userId: creatorInfo._id
		};
		members.unshift(creator);
		await db.collection('rooms').add({
			data: {
				creator: wxContext.OPENID,
				name,
				avatar,
				members
			}
		})

		return ({
			code: 200,
			msg: "success",
			data: {
				state: 1,
				message: "建群成功！"
			}
		})
		// }

	} catch (err) {
		return ({
			code: 400,
			msg: err
		})
	}
}
