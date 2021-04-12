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
		
		const { id, count, remarks } = event;
		const updateTime = moment().format("YYYY-MM-DD H:mm:ss");

		// const { OPENID } = cloud.getWXContext;

		await db.collection('countRecords').where({
			_id: id
		}).set({
			data: {
				updateTime,
				count,
				remarks
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
