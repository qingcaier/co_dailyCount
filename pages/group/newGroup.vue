<template>
	<view class="newGroup">
		<view class="newGroup__avatar" @click="uploadAvatar">
			<view class="newGroup__avatarContain"><image class="newGroup__avatarImg" :src="tempAvatar"></image></view>
			<view class="newGroup__avatarCamera"><image class="newGroup__camera" src="../../static/images/camera.png"></image></view>
		</view>
		<view class="newGroup__form">
			<view class="newGroup__nameItem">
				<view class="newGroup__label">群聊名称</view>
				<input class="newGroup__inp" :value="groupName" @input="groupNameChange" placeholder="请输入群聊名称" />
			</view>
			<view class="newGroup__line"></view>
			<view class="newGroup__membersItem">
				<view class="newGroup__label">群成员</view>
				<view class="newGroup__members">
					<view class="newGroup__unit member" v-for="(item, idx) in members" :key="idx">
						<!-- <view class="newGroup__unitTop"> -->
						<image class="newGroup__unitTop" :src="item.avatar"></image>
						<!-- </view> -->
						<view class="newGroup__text">{{ item.nickName }}</view>
					</view>
					<view class="newGroup__unit invite">
						<view class="newGroup__unitTop" @click="addMember">+</view>
						<view class="newGroup__text">添加</view>
					</view>
					<view class="newGroup__unit delete" v-if="members.length > 0">
						<view class="newGroup__unitTop" @click="deleteMember">-</view>
						<view class="newGroup__text">删除</view>
					</view>
				</view>

				<!-- <xfl-select
					:list="list"
					:clearable="true"
					:showItemNum="5"
					:listShow="false"
					:isCanInput="true"
					:style_Container="'height: 36px; font-size: 15px;'"
					:placeholder="'请输入好友昵称'"
					:selectHideType="'hideAll'"
					:focusShowList="true"
					@input="nickNameChange"
					@change="selectFriend"
				></xfl-select> -->
			</view>
			<button class="newGroup__btn" @click="submitGroup">提交</button>
		</view>

		<uni-popup ref="popup_success" type="message"><uni-popup-message type="success" :message="successMsg" :duration="1000"></uni-popup-message></uni-popup>
		<uni-popup ref="popup_fail" type="message"><uni-popup-message type="warn" :message="errorMsg" :duration="1500"></uni-popup-message></uni-popup>
	</view>
</template>

<script>
// import xflselect from '../../components/xfl-select/xfl-select.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';

export default {
	components: {
		// 'xfl-select': xflselect,
		uniPopup,
		uniPopupMessage
	},
	data() {
		return {
			groupName: '', // 群名
			friendNickName: '', // 好友昵称
			tempAvatar: 'cloud://qingczb-mint-test-hqawo.7169-qingczb-mint-test-hqawo-1302211891/uploadImg/avator.png', // 上传头像预览
			members: [
				// 	{
				// 	avatar: 'cloud://qingczb-mint-test-hqawo.7169-qingczb-mint-test-hqawo-1302211891/uploadImg/avator.png',
				// 	nickName: '倪順' ,
				// },{
				// 	avatar: 'cloud://qingczb-mint-test-hqawo.7169-qingczb-mint-test-hqawo-1302211891/uploadImg/avator.png',
				// 	nickName: '清婇' ,
				// },
			], // 提交的群成员
			selector: {}, // 选择的成员
			errorMsg: '', // 失败消息
			successMsg: '' // 成功消息
		};
	},

	watch: {
		selector: function(){
			// handler: function(){
				console.log('我变了');
				this.members.push(this.selector)
			// },
			// deep: true
		},
		members: {
			handler: function() {
				console.log('我变了我没变');
			},
			deep: true
		}
	},
	onShow() {
		let pages = getCurrentPages();
		let currPage = pages[pages.length - 1]; //当前页面
		
		if(Object.keys(currPage.data.selector).length > 0){
			this.members.push(currPage.data.selector);
		}
	},
	methods: {
		// 输入框双向绑定
		groupNameChange(e) {
			this.groupName = e.detail.value;
		},

		// 选择好友
		selectFriend(newVal) {
			console.log(newVal);
		},
		
		// 上传群头像
		uploadAvatar() {
			uni.chooseImage({
				count: 1,
				success: res => {
					console.log(res);
					const filePath = res.tempFilePaths;
					if (res.tempFilePaths) {
						wx.cloud.uploadFile({
							cloudPath: `${new Date().valueOf()}.png`, // 上传至云端的路径
							filePath: filePath[0], // 小程序临时文件路径
							success: res => {
								// 返回文件 ID
								console.log(res.fileID);
								this.tempAvatar = res.fileID;
							},
							fail: err => {
								console.log(err);
							}
						});
					}
				},
				fail: err => {
					console.log(err);
				}
			});
		},

		// 跳转到搜索好友页面
		addMember() {
			uni.navigateTo({
				url: './searchMember'
			});
		},

		// 移除好友
		deleteMember() {
			this.members.pop();
		},

		// 提交新建群信息
		submitGroup() {
			console.log(this.groupName);
			if (!this.groupName) {
				this.errorMsg = '请输入群聊名称';
				this.$refs.popup_fail.open();
				return;
			}
			if (this.members.length === 0) {
				this.errorMsg = '请添加好友';
				this.$refs.popup_fail.open();
				return;
			}
			// this.members.push(this.friendsPhone);
			let submitEvent = {
				name: this.groupName,
				avatar: this.tempAvatar,
				members: this.members
			};
			console.log(submitEvent);

			wx.cloud.callFunction({
				name: 'createGroup',
				data: submitEvent,
				success: res => {
					console.log('新建群返回数据', res.result);
					let requestState = res.result.code,
						responseState = res.result.data.state;
					if (requestState === 200) {
						if (responseState === 0) {
							this.errorMsg = res.result.data.message;
							this.$refs.popup_fail.open();
						} else if (responseState === 1) {
							this.successMsg = res.result.data.message;
							this.$refs.popup_success.open();
							uni.navigateBack({
								delta: 1
							})
						}
					} else {
						this.errorMsg = res.result.msg;
						this.$refs.popup_fail.open();
					}
				}
			});
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
.newGroup
	width 100%
	position absolute
	top 0
	bottom 0
	overflow hidden
	background-color #f9f9f9
	display flex
	flex-direction column
	align-items center
	padding 30rpx
	box-sizing border-box
	.newGroup__avatar
		width 150rpx
		height 150rpx
		border-radius 50%
		background #FFFFFF
		position relative
		z-index 10
		.newGroup__avatarContain
			@extend .center
			width 100%
			height 100%
			.newGroup__avatarImg
				width $imageWidth
				height $imageWidth
				border-radius 50%
		.newGroup__avatarCamera
			@extend .center
			width 50rpx
			height 50rpx
			background-color #FFFFFF
			border-radius 50%
			position absolute
			right 0
			bottom 0
			.newGroup__camera
				width 30rpx
				height 30rpx
	.newGroup__form
		width 100%
		// height 300px
		box-sizing border-box
		padding 30rpx
		display flex
		flex-direction column
		background-color #FFFFFF
		border-radius 5px
		.newGroup__nameItem
			display flex
			justify-content space-between
			margin-top 16px
		.newGroup__line
			height 1rpx
			width 100%
			background #999999
			margin-top 16px
		.newGroup__membersItem
			width 100%
			display flex
			flex-direction column
			margin-top 16px
			.newGroup__members
				display flex
				flex-wrap wrap
				margin-top 10px
				.newGroup__unit
					display flex
					flex-direction column
					align-items center
					width 150rpx
					// border 1rpx solid #007AFF
					.newGroup__unitTop
						@extend .center
						width $avatarWidth
						height $avatarWidth
						border-radius 50%
						background-color #f1f1f1
						font-size 80rpx
						font-weight 100
						color #999999
					.newGroup__text
						width 150rpx
						text-align center
						color #999999
						font-size 26rpx
						margin-top 5px
						word-break keep-all
						white-space nowrap
						overflow hidden
						text-overflow ellipsis
		.newGroup__btn
			height 60rpx
			width 120rpx
			font-size 30rpx
			@extend .center
			background-color #FB7299
			color #FFFFFF
			margin-top 90px
</style>
