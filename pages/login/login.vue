<template>
	<view class="login">
		<view class="login__explain">
		<text class="login__text">欢迎来到dailyC合账小程序。</text>
		<text class="login__text">如有意愿使用请联系邮箱：</text>
		<text class="login__text-mail">1721119157@qq.com</text>
		</view>
		
		<button class="login__btn" type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo">登录</button>
		<uni-popup ref="popup" type="message">
			<uni-popup-message type="success" message="登录成功" :duration="2000"> </uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	
	export default {
		components:{
			uniPopup,
			uniPopupMessage,
		},
		data() {
			return {
				// href: 'https://uniapp.dcloud.io/component/README?id=uniui'
				
			}
		},
		methods: {
			getUserInfo(e){
				console.log(e);
				wx.cloud.callFunction({
					name: "login",
					data: e.detail.userInfo,
					success: res => {
						console.log(res);
						let status = res.result.data.code;
						if(status === 200){
							this.$refs.popup.open();
							setTimeout(() => {
								uni.navigateTo({
									
								})
							})
						}
					}
				})
			}
		},
		mounted(){
			// uni.showToast({
			// 	title: "当前微信版本过低，请升级微信版本！",
			// 	icon: "none",
			// 	// image: '../../static/images/warning.png',
			// })
		}
	}
</script>

<style lang="stylus">
	
	$btnWidth = 400rpx
	.login{
		display flex
		flex-direction column
		justify-content space-between
		
		.login__explain{
			display flex
			flex-direction column
			
			.login__text{
				margin 10px
				font-size 36rpx
				
				&:first-child{
					margin-top 50px
				}
			}
			
			.login__text-mail{
				@extend .login__text
				color rgba(200 0 0 0.9)
				font-size 50rpx
				font-weight 600
				margin-top 20px
				align-self center
			}
		}
		
		
		.login__btn{
			// margin-top 400px
			position absolute
			width $btnWidth
			height 1/4 * $btnWidth
			background-color #FB7299
			bottom 60px
			transform translateX((750rpx - $btnWidth) / 2)
		}
		
	}
	
	
	
</style>
