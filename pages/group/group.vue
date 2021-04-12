<template>
	<view class="group">
		<canvas canvas-id="snow" style="width: 750rpx;height: 100vh;"></canvas>
		<view class="group__background"><image class="group__backgroundImg" :src="bgImg" mode="scaleToFill"></image></view>
		<!-- <view class="group__contain"> -->
		<scroll-view class="group__contain" :scroll-y="true">
			<block v-for="(item, idx) in groups" :key="idx">
				<view class="group__resultItem" @click="enterGroup(item)">
					<image class="group__avatar" :src="item.avatar"></image>
					<view class="group__nickName">{{ item.name }}</view>
				</view>
			</block>
		</scroll-view>
	</view>
</template>

<script>
import { play } from '../../classes/snow.js';
// import uniPopup from '@/components/uni-popup/uni-popup.vue';
// import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
export default {
	data() {
		return {
			// href: 'https://uniapp.dcloud.io/component/README?id=uniui',
			// bgImg: '../../static/images/bg2.jpg',
			bgImg: 'cloud://qingczb-mint-test-hqawo.7169-qingczb-mint-test-hqawo-1302211891/uploadImg/bg.jpg',
			groups: [] // 已加入群组
		};
	},
	

	mounted() {
		// play();
		console.log('请求群');
		this.init();
	},
	methods: {
		async init() {
			await this.getGroup();
		},
		async getGroup() {
			try {
				const { groups } = await global.http('getGroups');
				this.groups = groups;
			} catch (err) {
				console.log(err);
			}
		},

		// 进入群聊
		enterGroup(item) {
			console.log(item);
			uni.navigateTo({
				url: `../main/home?roomInfo=${encodeURIComponent(JSON.stringify(item))}`
			});
		}
	}
};
</script>

<style lang="stylus">
$btnWidth = 100rpx
.group
	width 100%
	// height 100%
	.group__background
		position fixed
		top 0
		left 0
		right 0
		bottom 0
		z-index -1
		opacity 0.8
		.group__backgroundImg
			width 100%
			height 100%
			border 0
	.group__contain
		z-index 100
		position absolute
		top 20px
		// left 20rpx
		// right 20rpx
		.group__resultItem
			display flex
			// width 100%
			height 100rpx
			box-sizing border-box
			background-color rgba(0 0 0 0.2)
			border-radius 5px
			margin 20rpx
			// background-color #f6f6f6
			// border-bottom 1rpx solid #cccccc
			align-items center
			padding 0 20rpx
			.group__avatar
				width 80rpx
				height 80rpx
				border-radius 8rpx
			.group__nickName
				font-size 36rpx
				align-self flex-start
				color #f0f0f0
				margin-left 30rpx
				margin-top 4px
</style>
