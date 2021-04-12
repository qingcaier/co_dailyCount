<template>
	<view class="countForm">
		<view class="countForm__countItem">
			<view class="countForm__label">您的汗血</view>
			<input
				class="countForm__inp"
				:value="formData.count"
				placeholder="请输入"
				@input="countChange"
				onKeyUp="value=value.replace(/[^\d]/g,'')"
				onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))"
			/>
			<view class="countForm__yuan">元</view>
		</view>
		<view class="countForm__line"></view>
		<view class="countForm__remarksItem">
			<view class="countForm__label">备注</view>
			<textarea :value="formData.remarks" class="countForm__members" placeholder="请备注" @input="remarksChange" />
		</view>
		<button class="countForm__btn" @click="submitCount">提交</button>
	</view>
</template>

<script>
export default {
	props: {
		isEdit: {
			type: Boolean,
			default: false
		},
		preFormData: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			formData: {
				count: '', // 账目
				remarks: '' // 备注
			}
		};
	},
	mounted() {
		if (this.isEdit) {
			this.formData = this.preFormData;
		}
	},
	methods: {
		// 输入框双向绑定
		countChange(e) {
			this.formData.count = e.detail.value;
		},
		remarksChange(e) {
			this.formData.remarks = e.detail.value;
		},

		// 提交账目
		async submitCount() {
			const validate = global.tools.isPositiveFloat(this.formData.count);
			if (validate) {
				// 小数点后数字不超过两位
				const pointNumber = this.formData.count.split('.');
				const [beforePoint = '', afterPoint = ''] = pointNumber;
				if (afterPoint.length > 2) {
					uni.showModal({
						content: '您的汗血钱小数没有那么多',
						showCancel: false
					});
				} else if (parseInt(beforePoint) > 100 && parseInt(beforePoint) < 200) {
					uni.showToast({
						title: '这。。有点小贵',
						icon:"none",
						image:"/static/images/ganga.png",
						duration: 1000,
						position: 'top'
					});
					setTimeout(() => {
						this.$emit('submit', this.formData);
					}, 1000);
				} else if (parseInt(beforePoint) >= 200) {
					uni.showModal({
						title: '不是吧阿sir?',
						content: '这么贵，你确定没搞错？',
						cancelText: '对不起',
						confirmText: '爷有钱',
						success: res => {
							if (res.confirm) {
								this.$emit('submit', this.formData);
							}
						}
					});
				}
			} else {
				uni.showModal({
					content: '您的汗血钱请输入合法的数字',
					showCancel: false
				});
			}
		}
	}
};
</script>

<style lang="stylus">
.center
	display flex
	justify-content center
	align-items center
.countForm
	width 100%
	box-sizing border-box
	padding 30rpx
	display flex
	flex-direction column
	background-color #FFFFFF
	border-radius 5px
	box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
	.countForm__countItem
		display flex
		justify-content space-between
		margin-top 16px
		.countForm__yuan
			position relative
			right 60rpx
			color #333333
	.countForm__line
		height 1rpx
		width 100%
		background #999999
		margin-top 16px
	.countForm__remarksItem
		display flex
		flex-direction column
		margin-top 16px
		.countForm__members
			display flex
			width 100%
			margin-top 10px
	.countForm__label
		color #333333
	.countForm__btn
		height 60rpx
		width 120rpx
		font-size 30rpx
		@extend .center
		background-color #FB7299
		color #FFFFFF
		margin-top 10px
</style>
