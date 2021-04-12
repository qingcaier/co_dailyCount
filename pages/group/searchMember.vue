<template>
	<view class="searchMember">
		<view class="searchMember__inp">
			<view class="searchMember__searchImg">
				<view class="searchMember__circle"></view>
				<view class="searchMember__stick"></view>
			</view>
			<input :value="searchStr" placeholder="请输入好友昵称" confirm-type="search" @input="searchChange" />
		</view>
		<view class="searchMember__result">
			<block v-for="(item, idx) in searchResult" :key="idx">
				<view class="searchMember__resultItem" @click="selectMember(item)">
					<image class="searchMember__avatar" :src="item.avatar"></image>
					<view class="searchMember__nickName">{{ item.nickName }}</view>
				</view>
			</block>
		</view>
		<view class="searchMember__none" v-if="isEmpty"><text style="color: #999999"> · —— · —— </text><text :decode="true">&emsp;找不到好友~&emsp;</text><text style="color: #999999"> —— · —— · </text></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			searchStr: '', // 搜索昵称
			searchResult: [], // 搜索结果
			isEmpty: false,  // 搜索结果是否为空
			// selector: {},
		};
	},
	watch: {
		searchStr: function() {
			let timeout;
			if (this.searchStr) {
				if (timeout) {
					clearTimeout(timeout);
				}

				timeout = setTimeout(() => {
					wx.cloud.callFunction({
						name: 'searchUsers',
						data: {
							nickName: this.searchStr
						},
						success: res => {
							console.log(res);
							this.isEmpty = false;
							this.searchResult = [];
							const code = res.result.code;
							const resultArr = res.result.data.friends;
							if (code === 200) {
								if (resultArr.length > 0) {
									this.searchResult = resultArr.map(item => {
										return {
											avatar: item.avatarUrl,
											nickName: item.nickName,
											userId: item._id
										};
									});
								}else{
									this.isEmpty = true;
								}
							}
						}
					});
				}, 500);
			}
		}
	},
	methods: {
		searchChange(e) {
			this.searchStr = e.detail.value;
		},
		
		selectMember(item){
			this.searchStr = item.nickName;
			
			let pages = getCurrentPages();
			let prePage = pages[pages.length - 2];
			// console.log("上一页对象",prePage);
			// prePage.data.members.push(item);
			prePage.data.selector = item;
			// prePage.onShow();
			// this.selector = item;
			uni.navigateBack({
				delta: 1
			})
		}
	}
};
</script>

<style lang="stylus">
$inputHeight = 40px
.searchMember__inp
	margin 20rpx
	height $inputHeight
	box-sizing border-box
	// border 1rpx solid #007AFF
	border-radius ($inputHeight / 2)
	background-color #F3F4F8
	display flex
	align-items center
	padding-left 20rpx
	.searchMember__searchImg
		// width 30rpx
		// height 30rpx
		// border 1rpx solid red
		margin-right 50rpx
		.searchMember__circle
			width 30rpx
			height 30rpx
			border 2rpx solid #999999
			border-radius 50%
		.searchMember__stick
			width 18rpx
			height 4rpx
			background-color #bbbbbb
			// transform rotate(55deg)
			transform matrix(0.866, 0.707, -0.707, 0.866, 14, 1)
			
.searchMember__result{
	padding 0 20rpx
	.searchMember__resultItem{
		display flex
		width 100%
		height 100rpx
		box-sizing border-box
		// background-color #f6f6f6
		border-bottom 1rpx solid #cccccc
		align-items center
		padding 0 20rpx
		
		
		.searchMember__avatar{
			width 80rpx
			height 80rpx
			border-radius 8rpx
		}
		
		.searchMember__nickName{
			font-size 38rpx
			align-self flex-start
			color #999999
			margin-left 30rpx
			margin-top 4px
		}
	}
}

.searchMember__none{
	width 100%
	height 50rpx
	line-height 50rpx
	text-align center
	color #999999
	// background-color #f6f6f6
}
</style>
