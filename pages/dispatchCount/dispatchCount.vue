<template>
	<view class="dispatchCount">
		<view v-for="(item, idx) in dispatch" :key="idx" class="dispatchCount__item">
			<view class="dispatchCount__user">
				<view class="dispatchCount__name">{{ item.debtor.nickName }}</view>
				<view class="dispatchCount__avatar"><image :src="item.debtor.avatarUrl" mode=""></image></view>
			</view>
			<view class="dispatchCount__arrow">￥{{item.count}}</image></view>
			<view class="dispatchCount__user">
				<view class="dispatchCount__name">{{ item.creditor.nickName }}</view>
				<view class="dispatchCount__avatar"><image :src="item.creditor.avatarUrl" mode=""></image></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			dispatch: [] // 分配数组
		};
	},
	computed: {},
	watch: {},
	onLoad(option) {
		this.init();
	},
	methods: {
		init() {
			this.getDispatch();
		},

		async getDispatch() {
			try {
				const { result } = await global.http('getAA');
				console.log(result);
				if (result && result.length > 0) {
					uni.setStorageSync('countChange', true);
					this.dispatch = result;
				}
			} catch (err) {}
		}
	}
};
</script>

<style lang="stylus">
.dispatchCount{
	display flex
	flex-direction column
	
	box-sizing border-box
	width 100%
	padding 40rpx 60rpx
	.dispatchCount__item{
		display flex
		align-items center
		justify-content space-around
		margin-bottom 30rpx
		
		.dispatchCount__user{
			display flex
			flex-direction column
			align-items center
			justify-content center
			
			width 180rpx
			height 180rpx
			
			.dispatchCount__name{
				width 100%
				text-align center
				font-size 28rpx
				color #666666
				
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}
			
			.dispatchCount__avatar{
				width 120rpx
				height 120rpx
				margin-top 10rpx
				
				
				
				image{
					width 100%
					height 100%
					border-radius 5rpx
				}
			}
		}
		.dispatchCount__arrow{
			width 300rpx;
			height 150rpx;
			background url(../../static/images/arrow_right.png) no-repeat;
			background-size 50% 30%;
			background-position: 50% 90%; 
			
			
			text-align center
			line-height 100rpx;
			font-size 42rpx
			font-weight bold;
			color #FB7299
		}
	}
}
</style>
