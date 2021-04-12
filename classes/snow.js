var screenW = 0;
var screenH = 0;

uni.getSystemInfo({
	success: (res) => {
		screenW = res.screenWidth
		screenH = res.screenHeight
	},
})
class Snow {
	constructor() {
		this.canvas = {}
		this.snow = []
		this.init();
	}

	init() {
		this.canvas = uni.createCanvasContext("snow", this)
		this.generateSnow()
	}

	//随机生成雪花半径
	rand(num) {
		return Math.floor(Math.random() * num + 1)
	}
	//雪花飘落速度
	getRanNum(n, m) {
		return Math.floor(Math.random() * (m - n) + n);
	}
	//生成雪花
	generateSnow() {
		setInterval(() => {
			let snows = {
				r: this.rand(10), //雪花半径
				x: this.rand(screenW), //雪花坐标位置
				y: 0,
				speedx: this.getRanNum(-2, 3), //雪花飘落速度
				speedy: this.getRanNum(2, 5)
			}
			this.snow.push(snows)
		}, 100)
	}
	//绘制雪花
	drawSnow() {
		let canvas = this.canvas
		let snow = this.snow
		canvas.clearRect(0, 0, screenW, screenH)
		// console.log(this.snow.length)
		for (let i = 0; i < snow.length; i++) {
			snow[i].x += snow[i].speedx
			snow[i].y += snow[i].speedy
			//超出屏幕高度时移除雪花
			if (snow[i].y > screenH) {
				this.snow.splice(i, 1)
			}
			canvas.beginPath()
			let snowColor = canvas.createCircularGradient(snow[i].x, snow[i].y, snow[i].r)
			snowColor.addColorStop(0, "rgba(255,255,255,1)")
			snowColor.addColorStop(1, "rgba(255,255,255,0.2)")
			canvas.setFillStyle(snowColor)
			canvas.arc(snow[i].x, snow[i].y, snow[i].r, 0, 2 * Math.PI)
			canvas.fill()
		}
		canvas.draw()
	}

}

function play() {
	let snow = new Snow();
	let timer = setInterval(() => {
		snow.drawSnow()
	}, 100)
}

function stop() {
	// canvas.clearRect(0, 0, screenW, screenH);

	let id = setInterval(() => {}, 0);
	while (id >= 0) {
		clearInterval(id)
		id--;
	}
}

export {
	play,
	stop
}
