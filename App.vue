<script>
export default {
	onLaunch: async function() {
		console.log('App Launch');

		if (!wx.cloud) {
			uni.showToast({
				title: '当前微信版本过低，请升级微信版本！',
				image: './static/images/warning.png'
			});
		} else {
			wx.cloud.init({
				traceUser: true,
				env: 'qingczb-mint-test-hqawo'
			});

			this.init();
		}
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	methods: {
		init(){
			this.getLoginState();
		},

		// 获取用户信息及登录态
		getLoginState(){
			const userInfo = uni.getStorageSync('userInfo');
			if (userInfo && !global.tools.isEmptyObj(userInfo)) {
				this.$scope.globalData.isLogin = true;
				this.$scope.globalData.userInfo = userInfo;
			}
		}
	},
	globalData: {
		isLogin: false, // 登录态
		userInfo: {}, // 用户信息
	}
};
</script>

<style>
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */

body {
	background-color: #f0f2f7;
}
</style>
