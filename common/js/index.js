const moment = require("moment");
const tools = {
	isEmptyObj(obj){
		return Object.keys(obj).length === 0;
	},
	
	/**
	 * 判断一个字符串是否为正浮点数
	 * @param {String} str
	 * @return {Boolean}
	 */
	isPositiveFloat(str){
		return /^(([1-9]\d*(\.\d+)?$)|(0\.\d*[1-9]\d*))$/g.test(str);
	},
	
	/**
	 * 记录显示时间规则
	 * @param {String} time
	 * @return {String} 格式化后时间
	 */
	formatShowTime(time){
		// 获取今天起始时间戳
		const todayStartTimestamp = moment().startOf('day').format('x');
		// 传入时间时间戳
		const preTimestamp = moment(time).valueOf();
		
		let formatTime = "";
		
		if(preTimestamp >= todayStartTimestamp){
			// 今天	11:00
			formatTime = moment(time).format("HH:mm");
		}else if(preTimestamp >= todayStartTimestamp - 3600*24*1000*1 && preTimestamp < todayStartTimestamp) {
			// 昨天	昨天 11:00
			formatTime = moment(time).format("[昨天] HH:mm");
		}else if(preTimestamp >= todayStartTimestamp - 3600*24*1000*2 && preTimestamp < todayStartTimestamp - 3600*24*1000*1){
			// 前天	前天 11:00
			formatTime = moment(time).format("[前天] HH:mm");
		}else {
			// 其他比前天更久远的日子 2020年5月4日 11:00
			formatTime = moment(time).format("YYYY年M月D日 HH:mm");
		}
		return formatTime;
	}
};


export default tools;