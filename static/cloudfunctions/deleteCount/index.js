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
		
		const { id } = event;
		const updateTime = moment().format("YYYY-MM-DD HH:mm:ss");

		const { OPENID } = cloud.getWXContext();
		const targetCount = (await db.collection("countRecords").doc(id).get()).data;
		console.log(targetCount);
		
		// 只有创建者才可修改
		if(targetCount.creator === OPENID){
			// 只有未结算未删除的账目可修改
			if(targetCount.state === 0){
				await db.collection('countRecords').where({
					_id: id
				}).update({
					data: {
						updateTime,
						state: -1
					}
				});
				
				return ({
					head: {
						resCode: "000000",
						resMsg: "交易成功"
					}
				})
			}else {
				return ({
					head: {
						resCode: "200002",
						resMsg: "当前账目不可删除"
					}
				})
			}
		}else {
			return ({
				head: {
					resCode: "200003",
					resMsg: "对不起，您无权删除"
				}
			})
		}
		
	} catch (err) {
		return ({
			head: {
				resCode: "100001",
				resMsg: "系统异常"
			}
		})
	}
}
