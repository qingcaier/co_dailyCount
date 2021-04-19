<template>
	<view class="personal">
		<view class="personal__beforeLogin" v-if="!isLogin"><button class="personal__loginBtn" type="primary" @click="getUserInfo">登录</button></view>
		<view class="personal__afterLogin" v-else>
			<view class="personal__userInfo">
				<view class="personal__avatar"><image class="personal__img" :src="userInfo.avatarUrl" mode="aspectFill"></image></view>
				<view class="personal__nickName">{{ userInfo.nickName }}</view>
			</view>
		</view>
		<uni-popup ref="popup_success" type="message"><uni-popup-message type="success" message="登录成功" :duration="1000"></uni-popup-message></uni-popup>
		<uni-popup ref="popup_fail" type="message"><uni-popup-message type="warn" message="登录取消" :duration="1500"></uni-popup-message></uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';

export default {
	components: {
		uniPopup,
		uniPopupMessage
	},
	data() {
		return {
			// href: 'https://uniapp.dcloud.io/component/README?id=uniui'
			isLogin: false,
			userInfo: {}
		};
	},
	onLoad() {
		this.init();
	},
	mounted() {},
	methods: {
		init() {
			const { isLogin, userInfo } = getApp().globalData;
			this.isLogin = isLogin;
			this.userInfo = userInfo;
			
			if(isLogin){
				uni.switchTab({
					url: '../home/home'
				});
			}
		},
		getUserInfo() {
			try {
				console.log('res');
				wx.getUserProfile({
					desc: '用于使用展示',
					success: async res => {
						console.log('res', res);
						const { userInfo } = res;
						await global.http('login', userInfo);
						await uni.showToast({
							title: '登录成功'
						});

						uni.setStorageSync('userInfo', userInfo);

						setTimeout(() => {
							getApp().globalData.isLogin = true;
							getApp().globalData.userInfo = userInfo;
							this.isLogin = true;
							this.userInfo = userInfo;
						}, 1500);
					},
					fail: err => {
						console.log(err);

						// 拒绝授权
						if (err.errMsg === 'getUserProfile:fail auth deny') {
							uni.showModal({
								title: '授权失败',
								showCancel: false
							});
						} else {
							uni.showModal({
								title: '系统异常',
								showCancel: false
							});
						}
					}
				});
			} catch (err) {
				console.log(err);
			}
		}
	}
};
</script>

<style lang="stylus">
$btnWidth = 300rpx
.personal
	display flex
	flex-direction column
	justify-content space-between
	.personal__beforeLogin
		width 100%
		display flex
		justify-content center
		margin-top 60px
		.personal__loginBtn
			width $btnWidth
			height 1 / 3 * $btnWidth
			background-color #FB7299
	.personal__afterLogin
		@keyframes login
			0%
				background-color #FFFFFF
			100%
				background-color #FB7299
		.personal__userInfo
			width 100%
			height 260rpx
			background #FB7299
			display flex
			flex-direction column
			align-items center
			box-sizing border-box
			padding-top 50rpx
			animation login 1.5s ease 0s
			.personal__avatar
				width 120rpx
				height 120rpx
				.personal__img
					width 100%
					height 100%
					border-radius 100%
			.personal__nickName
				padding 10rpx
				color #F1F1F1
</style>
