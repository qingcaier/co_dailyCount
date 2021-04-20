<template>
	<view class="countForm">
		<view class="countForm__totalCount">
			<view class="countForm__totalCount-before">{{ showCountBeforePoint || '0' }}</view>
			<view class="countForm__totalCount-after">.{{ showCountAfterPoint || '00' }}</view>
			<view class="countForm__yuan">元</view>
		</view>
		<view class="countForm__line"></view>
		<view class="countForm__remarksItem"><textarea :value="remarks" class="countForm__members" placeholder="这里写" @input="remarksChange" /></view>
		<button class="countForm__btn" @click="submitCount">确定</button>
	</view>
</template>

<script>
export default {
	props: {
		isEdit: {
			type: Boolean,
			default: false
		},
		preRemarks: {
			type: String,
			default: ''
		}
	},
	computed: {
		// 账目总数
		totalCount() {
			const countArr = this.remarks.match(/(\d+\.\d+)|\d+/g);
			console.log('匹配数组', countArr);
			if (countArr && countArr.length > 0) {
				let total = countArr.reduce((total, num) => {
					return parseFloat(total) + parseFloat(num);
				});
				// return (Math.ceil(parseFloat(total) * 100)/100).toFixed(2);
				return parseFloat(total).toFixed(2);
			} else {
				return '';
			}
		},

		showCountBeforePoint() {
			return this.totalCount.split('.')[0] || '';
		},

		showCountAfterPoint() {
			// 不补充''会清空remarks会莫名其妙不清空小数点后数字
			return this.totalCount.split('.')[1] || '';
		}
	},
	watch: {
		preRemarks() {
			this.remarks = this.preRemarks;
		}
	},
	data() {
		return {
			remarks: '' // 备注
		};
	},
	mounted() {
		if (this.isEdit) {
			this.remarks = this.preRemarks;
		}
	},
	methods: {
		// 输入框双向绑定
		remarksChange(e) {
			this.remarks = e.detail.value;
		},

		emitSubmit() {
			this.$emit('submit', {
				count: this.totalCount,
				remarks: this.remarks
			}, res => {
				if(res){
					this.remarks = '';
				}
			});
		},

		// 提交账目
		async submitCount() {
			if (!this.totalCount) {
				return;
			}
			const validate = global.tools.isPositiveFloat(this.totalCount);
			if (validate) {
				// 小数点后数字不超过两位
				const pointNumber = this.totalCount.split('.');
				const [beforePoint = '', afterPoint = ''] = pointNumber;
				if (afterPoint.length > 2) {
					uni.showModal({
						content: '您的汗血钱小数没有那么多',
						showCancel: false
					});
				} else if (parseInt(beforePoint) > 100 && parseInt(beforePoint) < 200) {
					uni.showToast({
						title: '这。。有点小贵',
						icon: 'none',
						image: '/static/images/ganga.png',
						duration: 1000,
						position: 'top'
					});
					setTimeout(() => {
						this.emitSubmit();
					}, 1000);
				} else if (parseInt(beforePoint) >= 200) {
					uni.showModal({
						title: '不是吧阿sir?',
						content: '这么贵，你确定没搞错？',
						cancelText: '对不起',
						confirmText: '爷有钱',
						success: res => {
							if (res.confirm) {
								this.emitSubmit();
							}
						}
					});
				} else {
					this.emitSubmit();
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
	.countForm__totalCount
		display flex
		justify-content center
		align-items baseline
		margin-top 16px
		color #FB7299
		&-before
			font-size 60rpx
			font-weight 600
		&-after
			font-size 45rpx
		.countForm__yuan
			margin-left 20rpx
			font-weight bold
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
	.countForm__btn
		height 60rpx
		width 120rpx
		font-size 30rpx
		@extend .center
		background-color #FB7299
		color #FFFFFF
		margin-top 10px
</style>
