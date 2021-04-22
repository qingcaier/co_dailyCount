const cloud = require('wx-server-sdk');
const moment = require('moment');
cloud.init({
	env: "qingczb-mint-test-hqawo"
})
const db = cloud.database();
exports.main = async (event, context) => {
	try {
		console.log("传值", event);
		console.log(context);

		// 将账目置为已结算
		const updateTime = moment().format("YYYY-MM-DD HH:mm:ss");
		await db.collection('countRecords').where({
			state: 0
		}).update({
			data: {
				updateTime,
				state: 1
			}
		});
		
		return ({
			head: {
				resCode: "000000",
				resMsg: "交易成功"
			}
		})
	} catch (err) {
		return ({
			head: {
				resCode: "100001",
				resMsg: "系统异常"
			}
		})
	}
}
