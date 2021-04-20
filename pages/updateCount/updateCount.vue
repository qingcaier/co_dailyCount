<template>
	<view class="addCount">
		<view class="addCount__avatar">
			<view class="addCount__avatarContain"><image class="addCount__avatarImg" :src="tempAvatar"></image></view>
			<view class="addCount__avatarCamera"><image class="addCount__camera" src="../../static/images/camera.png"></image></view>
		</view>
		<view class="addCount__form"><count-form :isEdit="true" :preRemarks="remarks" @submit="submitCount"></count-form></view>
	</view>
</template>

<script>
import countForm from '../../myComponents/countForm.vue';
export default {
	components: {
		'count-form': countForm
	},
	data() {
		return {
			remarks: '',
			countId: '',
			tempAvatar: 'cloud://qingczb-mint-test-hqawo.7169-qingczb-mint-test-hqawo-1302211891/uploadImg/avator.png' // 上传头像预览
		};
	},
	computed: {},
	watch: {},
	onLoad(option) {
		const { id, remarks } = JSON.parse(decodeURIComponent(option.params));
		console.log(id, remarks);

		this.remarks = remarks;
		this.countId = id;
	},
	methods: {
		// 提交账目
		async submitCount(data, callback) {
			console.log(data);
			data.id = this.countId;

			await global.http('updateCount', data);

			callback(true);

			uni.setStorageSync('countChange', true);
			uni.showToast({
				title: '修改成功',
				duration: 1500
			});
			setTimeout(() => {
				uni.navigateBack();
			}, 1500);
		}
	}
};
</script>

<style lang="stylus">
$imageWidth = 120rpx
$avatarWidth = 100rpx
.center
	display flex
	justify-content center
	align-items center
.addCount
	width 100%
	position absolute
	top 0
	bottom 0
	overflow hidden
	display flex
	flex-direction column
	align-items center
	padding 30rpx
	box-sizing border-box
	.addCount__avatar
		width 150rpx
		height 150rpx
		border-radius 50%
		background #FFFFFF
		position relative
		z-index 10
		.addCount__avatarContain
			@extend .center
			width 100%
			height 100%
			.addCount__avatarImg
				width $imageWidth
				height $imageWidth
				border-radius 50%
		.addCount__avatarCamera
			@extend .center
			width 50rpx
			height 50rpx
			background-color #FFFFFF
			border-radius 50%
			position absolute
			right 0
			bottom 0
			.addCount__camera
				width 30rpx
				height 30rpx
	.addCount__form
		width 100%
		.addCount__noLogin
			@extend .center
			margin-top 60rpx
			color #777777
</style>
