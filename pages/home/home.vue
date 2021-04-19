<template>
	<view class="home">
		<view class="home__background"><image class="home__backgroundImg" :src="bgImg" mode="scaleToFill"></image></view>
		<!-- <view v-if="isLogin === false" class="home_empty">
			<canvas canvas-id="snow" style="width: 750rpx;height: 100vh;"></canvas>
			<button class="home__btn" type="default" size="mini">去登录</button>
		</view> -->
		<view v-if="isLogin" class="home_body">
			<view class="home__header">
				<image class="home__img" src="../../static/images/calendar.png" @click="goBottom()"></image>
				<image class="home__img" src="../../static/images/add.png" @click="addCountItem"></image>
			</view>
			<scroll-view
				class="home__main"
				:scroll-y="true"
				:enable-flex="true"
				:show-scrollbar="true"
				upper-threshold="0"
				:scroll-top="scrollTop"
				@scroll="scroll"
				@scrolltoupper="getMoreCount"
			>
				<view v-for="(item, idx) in handleCountList" :key="idx" class="home__msg">
					<view v-if="item.showTime" class="home__timeBoard">
						<view class="home__time">{{ item.showTime }}</view>
					</view>
					<view :class="'home__msg-' + item.role">
						<image class="home__avatar" :src="item.avatarUrl"></image>
						<view :class="'home__msgContain-' + item.role">
							<view :class="'home__msgOwner-' + item.role">{{ item.nickName }}</view>
							<view :class="'home__msgMain-' + item.role" @click="toUpdate(item.remarks)">{{ item.remarks }}</view>
						</view>
					</view>
				</view>
				<!-- <view id="gundong" style="height:1px;width:100%"></view> -->
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

// import { play, stop } from '../../classes/snow.js';

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
			bgImg: '', // 背景图
			isLogin: '', // 是否登录判断

			pageIndex: 1, // 账目请求当前页数
			pageCount: 10, // 每次请求账目数
			totalNum: 0, //总数据
			isMore: false, // 是否还有更多

			countMsgList: [], // 账目信息队列

			scrollTop: 9999,
			old: {
				scrollTop: 0
			}
		};
	},
	computed: {
		handleCountList() {
			if (this.countMsgList.length > 0) {
				let finalCountList = this.countMsgList;

				// 第一条数据显示时间
				finalCountList[0].showTime = global.tools.formatShowTime(finalCountList[0].createTime);
				for (let i = 1; i < finalCountList.length; i++) {
					const preTime = finalCountList[i - 1].createTime.split(' ')[0];
					const nextTime = finalCountList[i].createTime.split(' ')[0];
					if (preTime !== nextTime) {
						finalCountList[i].showTime = global.tools.formatShowTime(finalCountList[i].createTime);
					}
				}

				const userName = getApp().globalData.userInfo.nickName;
				console.log('他妈的');
				finalCountList.forEach(item => {
					if (item.nickName === userName) {
						item.role = 'right';
					} else {
						item.role = 'left';
					}
				});
				console.log(finalCountList);
				return finalCountList;
			} else {
				return [];
			}
		},

		totalPage() {
			return Math.ceil(this.totalNum / this.pageCount);
		}
	},
	async onLoad(option) {
		// play();
		this.setBgImg();
		if (this.isLogin) {
			await this.getCountMsgs();
		}
	},
	async onShow() {
		await this.init();
		this.goBottom();
	},
	// onTabItemTap() {
	// 	// console.log(this.isLogin)
	// 	this.init();
	// },
	methods: {
		async init() {
			if (!this.isLogin) {
				this.setBgImg();
			}
			if (this.isLogin) {
				const countChange = uni.getStorageSync('countChange');
				console.log('countChange', countChange);
				if (countChange) {
					this.countMsgList = [];
					this.pageIndex = 1;
					this.isMore = false;
					await this.getCountMsgs();

					uni.setStorageSync('countChange', false);
				}
			}
		},

		scroll(e) {
			this.old.scrollTop = e.detail.scrollTop;
		},

		goBottom(e) {
			console.log('shengxiao');
			this.scrollTop = this.old.scrollTop;
			this.$nextTick(function() {
				this.scrollTop = 9999;
			});
			// this.$nextTick(function(){
			// 	uni.createSelectorQuery()
			// 		.select('#gundong')
			// 		.boundingClientRect(res => {
			// 			console.log(res)
			// 			var newbottom = res.bottom;
			// 			if (Number(newbottom) > Number(this.old.scrollTop)) {
			// 				this.scrollTop = newbottom;
			// 			}
			// 			this.old.scrollTop = newbottom;
			// 		})
			// 		.exec();
			// })
		},

		setBgImg() {
			uni.showLoading();

			const { isLogin } = getApp().globalData;
			this.isLogin = isLogin;
			if (isLogin) {
				this.bgImg = bg.login;
				// stop();
			} else {
				this.bgImg = bg.beforeLogin;
			}

			uni.hideLoading();
			return isLogin;
		},

		async getCountMsgs() {
			const { list: countList, totalNum } = await global.http('getCounts', {
				pageIndex: this.pageIndex,
				pageCount: this.pageCount
			});

			console.log(countList);
			this.totalNum = totalNum;

			if (countList && countList.length > 0) {
				this.countMsgList = countList.concat(this.countMsgList);
				console.log('countMsgList', this.countMsgList);
				if (this.pageIndex === 1) {
					this.goBottom();
				}
				this.pageIndex++;
			}
		},

		async getMoreCount() {
			const countChange = uni.getStorageSync('countChange');
			if (countChange) {
				return;
			}
			console.log(22222);
			if (this.pageIndex <= this.totalPage) {
				await this.getCountMsgs();
			} else {
				if (!this.isMore) {
					uni.showToast({
						title: '无更多历史',
						icon: 'none'
					});
					this.isMore = true;
				}
			}
		},

		toUpdate(data) {
			uni.navigateTo({
				url: `../updateCount/updateCount?remarks=${data}`
			});
		}

		// // 添加新账目
		// addCountItem() {
		// 	this.$refs.popup.open();
		// },

		// // 获取记账信息
		// getCountMsg() {
		// 	const userName = uni.getStorageSync('userInfo').nickName;
		// 	let result = [];

		// 	result.forEach(item => {
		// 		if (item.nickName === userName) {
		// 			item.role = 'right';
		// 		} else {
		// 			item.role = 'left';
		// 		}
		// 	});
		// 	this.countMsgList = result;
		// 	console.log(this.countMsgList);
		// },

		// // 提交新账目
		// submitForm(count, remarks) {
		// 	console.log('拿到的东西', count, remarks);
		// 	const userInfo = uni.getStorageSync('userInfo');
		// 	console.log(userInfo);
		// 	wx.cloud.callFunction({
		// 		name: 'addCount',
		// 		data: {
		// 			count: Number(count),
		// 			remarks,
		// 			roomId: this.roomId
		// 		},
		// 		success: res => {
		// 			console.log(res);
		// 			const code = res.result.code;
		// 			if (code === 200) {
		// 			} else if (code === 400) {
		// 				this.errorMsg = res.result.msg;
		// 				this.$refs.popup_fail.open();
		// 			}
		// 		}
		// 	});
		// },

		// // 打开日历统计
		// toCalendar() {}
	},
	mounted() {
		// uni.createSelectorQuery()
		// 	.select('#gundong')
		// 	.boundingClientRect(res => {
		// 		this.old.scrollTop = res.bottom; // 记录 滚动 元素的 bottom 值
		// 	})
		// 	.exec();
	}
	// updated() {

	// }
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
		.home__msg
			margin-bottom 40rpx
		.home__timeBoard
			display flex
			justify-content center
			.home__time
				padding 5rpx 12rpx
				border-radius 6rpx
				color #333333
				font-size 24rpx
				background-color rgba(220, 220, 220, 0.6)
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
					// width 100%
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
					// width 100%
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
