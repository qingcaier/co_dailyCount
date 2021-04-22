const http = function(transCode, params, opts = {}) {
	return new Promise((resolve, reject) => {
		console.log(`${transCode}接口请求参数`, params);
		const {
			showLoading = true,
				loadingText = "请稍候",
				errAlert = true,
				callback = () => {}
		} = opts;
		if (showLoading) {
			uni.showLoading({
				title: loadingText,
			});
		}
		wx.cloud
			.callFunction({
				name: transCode,
				data: params,
			})
			.then((res) => {
				console.log("接口返回数据", res);
				uni.hideLoading();
				const {
					resCode,
					resMsg
				} = res.result.head;
				if (resCode === "000000") {
					resolve(res.result.body);
				} else {
					if (errAlert) {
						uni.showModal({
							title: resMsg,
							showCancel: false,
							success: res => {
								if (res.confirm) {
									callback();
								}
							}
						});
					}
					reject(res.result.head);
				}

				// else {
				// 	this.errorMsg = res.result.msg;
				// 	this.$refs.popup_fail.open();
				// }
			})
			.catch((err) => {
				uni.hideLoading();
				if (errAlert) {
					uni.showModal({
						title: "系统异常",
						showCancel: false,
						success: res => {
							if (res.confirm) {
								callback();
							}
						}
					});
				}
				reject(err);
			});
	});
};

export default http;
