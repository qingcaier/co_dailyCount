<template>
	<view class="uni-popup-form">
		<view class="uni-form-title">
			<text class="uni-form-title-text">{{ title }}</text>
		</view>
		<view class="uni-form-content">
			<view class="uni-form-content-box">
				<view class="uni-form-input-box">
					<input
						class="inp"
						type="digit"
						:value="count"
						@input="countChange"
						placeholder="请输入金额"
						:focus="true"
						:cursor-spacing="160"
						placeholder-style="color:#999999"
					/>
				</view>
				<view class="uni-form-textarea-box">
					<textarea
						class="text"
						:value="remarks"
						@input="remarksChange"
						placeholder="备注"
						:maxlength="-1"
						:auto-height="false"
						:cursor-spacing="80"
						placeholder-style="color:#999999"
					></textarea>
				</view>
			</view>
		</view>
		<view class="uni-form-button-box"><button class="uni-form-button" @click="close">完成</button></view>
	</view>
</template>

<script>
export default {
	name: 'UniPopupform',
	props: {
		title: {
			type: String,
			default: '又tm破费了'
		}
	},
	inject: ['popup'],
	data() {
		return {
			count: '',
			remarks: ''
		};
	},
	created() {},
	methods: {
		/**
		 * 输入金额
		 */
		countChange(e) {
			this.count = e.detail.value;
		},

		/**
		 * 输入备注
		 */
		remarksChange(e) {
			this.remarks = e.detail.value;
		},

		/**
		 * 关闭窗口
		 */
		close() {
			if (this.count) {
				this.$emit('submitForm', this.count, this.remarks);
				this.popup.close();
			} else {
				this.popup.close();
			}
		}
	}
};
</script>
<style lang="scss" scoped>
.uni-popup-form {
	background-color: #fff;
	// height: 70vh
	padding-bottom: 20px;
}
.uni-form-title {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	height: 40px;
}
.uni-form-title-text {
	font-size: 14px;
	color: #666;
}
.uni-form-content {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	justify-content: center;
	padding-top: 10px;
}

.uni-form-content-box {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	flex-wrap: wrap;
	width: 360px;

	.uni-form-input-box {
		width: 50%;
		height: 50px;
		box-sizing: border-box;
		padding: 0 40rpx;
		// border: 1rpx solid #007AFF;
		border-radius: 25px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f3f4f8;

		.inp {
			width: 100%;
		}
	}

	.uni-form-textarea-box {
		width: 100%;
		height: 90px;
		// border: 1rpx solid #007AFF;
		background-color: #f3f4f8;
		border-radius: 5px;
		margin-top: 10px;
		// box-sizing: border-box;
		// padding: 5px 16rpx;

		.text {
			width: 100%;
			height: 90px;
			box-sizing: border-box;
			padding: 5px 16rpx;
			// border: 1rpx solid #007AFF;
		}
	}
}

.uni-form-button-box {
	width: 100%;
	text-align: center;
	margin-top: 20px;

	.uni-form-button {
		width: 180rpx;
		flex: 1;
		border-radius: 50px;
		color: #f1f1f1;
		font-size: 16px;
		background-color: #fb7299;
	}

	.uni-form-button::after {
		border-radius: 50px;
	}
}
</style>
