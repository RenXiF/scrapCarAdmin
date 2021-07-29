<template>
	<div class=""  @click="ckshow" >
		<svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'"/>
	</div>
</template>

<script>
	import screenfull from 'screenfull'

	export default {
		name: 'Screenfull',
		data() {
			return {
				isFullscreen: false
			}
		},
		mounted() {
			this.init()
		},
		beforeDestroy() {
			this.destroy()
		},
		methods: {
			ckshow(){
				this.toggleFullscreen();
				this.isFullscreen = !this.isFullscreen;
			},
			// 点击按钮触发的方法
			toggleFullscreen() {
				this.isFullscreen?this.outFullCreeen(document) :this.FullCreeen(document.documentElement);
			},
			// 进入全屏的方法
			FullCreeen(element) {
				let el = element;
				let rfs =
					el.requestFullScreen ||
					el.webkitRequestFullScreen ||
					el.mozRequestFullScreen ||
					el.msRequestFullScreen;
				// Element.requestFullscreen() 此方法用于发出异步请求使元素进入全屏模式。
				// 调用此API并不能保证元素一定能够进入全屏模式。如果元素被允许进入全屏幕模式，
				// document对象会收到一个fullscreenchange事件，通知调用者当前元素已经进入全屏模式。如果全屏请求不被许可，则会收到一个fullscreenerror事件。
				if (typeof rfs != "undefined" && rfs) {
					rfs.call(el);
				} else if (typeof window.ActiveXObject != "undefined") {
					let wscript = new ActiveXObject("WScript.Shell");
					if (wscript != null) {
						wscript.SendKeys("{F11}");
					}
				}
			},
			//退出全屏的方法
			outFullCreeen(element) {
				let el = element;
				let cfs =
					el.cancelFullScreen ||
					el.webkitCancelFullScreen ||
					el.mozCancelFullScreen ||
					el.exitFullScreen;
				if (typeof cfs != "undefined" && cfs) {
					cfs.call(el);
				} else if (typeof window.ActiveXObject != "undefined") {
					let wscript = new ActiveXObject("WScript.Shell");
					if (wscript != null) {
						wscript.SendKeys("{F11}");
					}
				}
			},
			click() {
				if (!screenfull.enabled) {
					this.$message({
						message: 'you browser can not work',
						type: 'warning'
					})
					return false
				}
				screenfull.toggle()
			},
			change() {
				this.isFullscreen = screenfull.isFullscreen
			},
			init() {
				if (screenfull.enabled) {
					screenfull.on('change', this.change)
				}
			},
			destroy() {
				if (screenfull.enabled) {
					screenfull.off('change', this.change)
				}
			}
		}
	}
</script>

<style scoped>
	.screenfull-svg {
		display: inline-block;
		cursor: pointer;
		fill: #5a5e66;
		;
		width: 20px;
		height: 20px;
		vertical-align: 10px;
	}
</style>
