const cloud = require('wx-server-sdk');
const moment = require('moment');
cloud.init({
	env: "qingczb-mint-test-hqawo"
})
const db = cloud.database();
const dbOptions = db.command;
exports.main = async (event, context) => {
	try {
		console.log("传值", event);
		console.log("context",context);
		
		const { count, remarks = "" } = event;
		if(!count){
			return {
				head: {
					resCode: "100002",
					resMsg: "参数校验异常"
				}
			}
		}
		
		const createTime = moment().format("YYYY-MM-DD H:mm:ss");
		
		const { OPENID } = cloud.getWXContext();
		
		await db.collection('countRecords').add({
			data: {
				creator: OPENID,
				count,
				remarks,
				createTime,
				state: 0, // 条目记录的状态：0:未结算/ -1: 已结算 / -2：已删除
			}
		})

		return ({
			head: {
				resCode: "000000",
				resMsg: "交易成功"
			},
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
