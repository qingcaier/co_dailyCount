<template>
	<view class="home">
		<view class="home__background"><image class="home__backgroundImg" :src="bgImg" mode="scaleToFill"></image></view>
		<view v-if="!isLogin" class="home_empty">
			<!-- <view>
				空空如也
			</view> -->
			<canvas canvas-id="snow" style="width: 750rpx;height: 100vh;"></canvas>
			<button class="home__btn" type="default" size="mini">去登录</button>
		</view>
		<view v-else class="home_body">
			<view class="home__header">
				<image class="home__img" src="../../static/images/calendar.png" @click="toCalendar"></image>
				<image class="home__img" src="../../static/images/add.png" @click="addCountItem"></image>
			</view>
			<scroll-view class="home__main" scroll-y="true">
				<block v-for="(item, idx) in countMsgList" :key="idx">
					<view :class="'home__msg-' + item.role">
						<image class="home__avatar" :src="item.avatar"></image>
						<view :class="'home__msgContain-' + item.role">
							<view :class="'home__msgOwner-' + item.role">{{ item.nickName }}</view>
							<view :class="'home__msgMain-' + item.role">{{ `${item.count}元，${item.remarks}` }}</view>
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
		<!-- <view></view> -->
		<uni-popup ref="popup" type="form"><uni-popup-form @submitForm="submitForm"></uni-popup-form></uni-popup>
		<uni-popup ref="popup_fail" type="message"><uni-popup-message type="warn" :message="errorMsg" :duration="1500"></uni-popup-message></uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniPopupForm from '@/components/uni-popup/uni-popup-form.vue';
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';

import { play, stop } from '../../classes/snow.js';

const bg = {
	beforeLogin: 'cloud://qingczb-mint-test-hqawo.7169-qingczb-mint-test-hqawo-1302211891/uploadImg/bg.jpg',
	login: 'cloud://qingczb-mint-test-hqawo.7169-qingczb-mint-test-hqawo-1302211891/uploadImg/yangcai.jpg'
};
export default {
	components: {
		uniPopup,
		uniPopupForm,
		uniPopupMessage
	},
	data() {
		return {
			bgImg: '',
			isLogin: "",

			roomName: '', // 聊天室名称
			roomId: '', // 聊天室id
			role: '', // 信息位置
			countMsgList: [] // 账目信息队列
		};
	},
	computed: {
		// isLogin() {
		// 	const userInfo = uni.getStorageSync('userInfo');
		// 	return !global.tools.isEmptyObj(userInfo);
		// }
	},
	onLoad(option) {
		play();
		this.init();
	},
	onTabItemTap() {
		if (!this.isLogin) {
			this.init();
		}
	},
	methods: {
		init() {
			// if (this.isLogin) {
			// 	this.bgImg = bg.login;
			// 	stop();
			// } else {
			// 	this.bgImg = bg.beforeLogin;
			// }
			uni.showLoading();

			const { isLogin } = getApp().globalData;
			this.isLogin = isLogin;
			if (isLogin) {
				this.bgImg = bg.login;
				stop();
			} else {
				this.bgImg = bg.beforeLogin;
			}
			
			uni.hideLoading();
			
		},
		// 添加新账目
		addCountItem() {
			this.$refs.popup.open();
		},

		// 获取记账信息
		getCountMsg() {
			const userName = uni.getStorageSync('userInfo').nickName;
			let result = [
				{
					_id: '362458465ef8a4de005a1c281cbdedee',
					avatar: 'https://wx.qlogo.cn/mmopen/vi_32/q5C74jLPtXCu9x0TyTpq1wmts9JVQjsey8poGmIgfPoT8ITIne3Yiax5OkXXUrHudDH9zRhpKPqL0iaSuXHRkZtQ/132',
					count: 123,
					createTime: '2020-06-28T22:10:37+08:00',
					createTimestamp: 1593353437000,
					nickName: '清婇',
					remarks: '浪屎事',
					roomId: 'b960af395ee630ba0014945e02da7d41',
					state: 0,
					userId: 'oSBeY5JEYVEAmHcJOk-H5Rk_Sgu4'
				},
				{
					_id: '362458465ef8a4de005a1c281cbdedee',
					avatar: 'https://wx.qlogo.cn/mmopen/vi_32/q5C74jLPtXCu9x0TyTpq1wmts9JVQjsey8poGmIgfPoT8ITIne3Yiax5OkXXUrHudDH9zRhpKPqL0iaSuXHRkZtQ/132',
					count: 3,
					createTime: '2020-06-28T22:10:37+08:00',
					createTimestamp: 1593353457000,
					nickName: '清婇',
					remarks: '查查查',
					roomId: 'b960af395ee630ba0014945e02da7d41',
					state: 0,
					userId: 'oSBeY5JEYVEAmHcJOk-H5Rk_Sgu4'
				},
				{
					_id: '362458465ef8a4de005a1c281cbdedee',
					avatar: 'https://wx.qlogo.cn/mmopen/vi_32/q5C74jLPtXCu9x0TyTpq1wmts9JVQjsey8poGmIgfPoT8ITIne3Yiax5OkXXUrHudDH9zRhpKPqL0iaSuXHRkZtQ/132',
					count: 23,
					createTime: '2020-06-28T22:10:37+08:00',
					createTimestamp: 1593353467000,
					nickName: '清婇',
					remarks: '就回个',
					roomId: 'b960af395ee630ba0014945e02da7d41',
					state: 0,
					userId: 'oSBeY5JEYVEAmHcJOk-H5Rk_Sgu4'
				},
				{
					_id: '362458465ef8a4de005a1c281cbdedee',
					avatar: 'https://wx.qlogo.cn/mmopen/vi_32/q5C74jLPtXCu9x0TyTpq1wmts9JVQjsey8poGmIgfPoT8ITIne3Yiax5OkXXUrHudDH9zRhpKPqL0iaSuXHRkZtQ/132',
					count: 223,
					createTime: '2020-06-28T22:10:37+08:00',
					createTimestamp: 1593353487000,
					nickName: '清婇',
					remarks: '哈弗接',
					roomId: 'b960af395ee630ba0014945e02da7d41',
					state: 0,
					userId: 'oSBeY5JEYVEAmHcJOk-H5Rk_Sgu4'
				},
				{
					_id: '362458465ef8a4de005a1c281cbdedee',
					avatar: 'https://wx.qlogo.cn/mmopen/vi_32/q5C74jLPtXCu9x0TyTpq1wmts9JVQjsey8poGmIgfPoT8ITIne3Yiax5OkXXUrHudDH9zRhpKPqL0iaSuXHRkZtQ/132',
					count: 223,
					createTime: '2020-06-28T22:10:37+08:00',
					createTimestamp: 1593353487000,
					nickName: '倪順豐Carson Ni',
					remarks: '傲人放弃我',
					roomId: 'b960af395ee630ba0014945e02da7d41',
					state: 0,
					userId: 'oSBeY5AOQBaYcqxp6HFRSx-0DG3E'
				}
			];

			result.forEach(item => {
				if (item.nickName === userName) {
					item.role = 'right';
				} else {
					item.role = 'left';
				}
			});
			this.countMsgList = result;
			console.log(this.countMsgList);
		},

		// 提交新账目
		submitForm(count, remarks) {
			console.log('拿到的东西', count, remarks);
			const userInfo = uni.getStorageSync('userInfo');
			console.log(userInfo);
			wx.cloud.callFunction({
				name: 'addCount',
				data: {
					count: Number(count),
					remarks,
					roomId: this.roomId
				},
				success: res => {
					console.log(res);
					const code = res.result.code;
					if (code === 200) {
					} else if (code === 400) {
						this.errorMsg = res.result.msg;
						this.$refs.popup_fail.open();
					}
				}
			});
		},

		// 打开日历统计
		toCalendar() {}
	},
	mounted() {
		console.log('有没有用', this.roomName);
		this.getCountMsg();
		console.log(this.countMsgList);
	}
};
</script>

<style lang="stylus">
$imgSize = 56rpx
$avatarSize = 80rpx
.home
	.home__background
		position fixed
		top 0
		left 0
		right 0
		bottom 0
		z-index -1
		opacity 0.8
		.home__backgroundImg
			width 100%
			height 100%
			border 0
	.home_empty
		position relative
		display flex
		justify-content center
		height 100%
		.home__btn
			position absolute
			bottom 150rpx
			z-index 1000
			background-color #FB7299
			color #FFFFFF
	.home__header
		width 100%
		height 36px
		display flex
		align-items center
		justify-content flex-end
		position fixed
		.home__img
			width $imgSize
			height $imgSize
			margin-right 30rpx
			margin-left 30rpx
	.home__main
		position absolute
		top 36px
		bottom 0
		left 0
		right 0
		overflow auto
		.home__avatar
			width $avatarSize
			height $avatarSize
			border-radius 50%
		.home__msg-left
			display flex
			margin-top 20rpx
			margin-left 16rpx
			.home__msgContain-left
				margin-left 20rpx
				.home__msgOwner-left
					width 100%
					font-size 24rpx
					color #666666
				.home__msgMain-left
					margin-top 6rpx
					padding 10rpx 16rpx
					background #FB7299
					border-radius 10rpx
					position relative
					color #ffffff
					&:before
						content ''
						position absolute
						right 100%
						border-top 10rpx solid transparent
						border-right 12rpx solid #FB7299
						border-bottom 10rpx solid transparent
		.home__msg-right
			display flex
			flex-direction row-reverse
			margin-top 20rpx
			margin-right 16rpx
			.home__msgContain-right
				margin-right 20rpx
				.home__msgOwner-right
					width 100%
					text-align right
					font-size 24rpx
					color #666666
				.home__msgMain-right
					margin-top 6rpx
					padding 10rpx 16rpx
					background #FB7299
					border-radius 10rpx
					position relative
					color #ffffff
					&:after
						content ''
						position absolute
						left 100%
						border-top 10rpx solid transparent
						border-left 12rpx solid #FB7299
						border-bottom 10rpx solid transparent
</style>
