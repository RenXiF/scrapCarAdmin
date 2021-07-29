<template>
	<section class="app-main" style="height: 100%;">
		<div class="" style="background-color: #FFFFFF;margin: 20px; padding: 20px 0;">
			<transition name="fade-transform" mode="out-in">
				<keep-alive :include="cachedViews">
					<router-view :key="key" />
				</keep-alive>
			</transition>
		</div>

	</section>
</template>

<script>
	export default {
		name: 'AppMain',
		computed: {
			cachedViews() {
				return this.$store.state.tagsView.cachedViews
			},
			key() {
				return this.$route.path
			}
		}
	}
</script>

<style lang="scss" scoped>
	.app-main {
		/* 50= navbar  50  */
		min-height: calc(100vh - 50px);
		width: 100%;
		margin-top: 10px;
		position: relative;
		overflow: hidden;
	}

	.fixed-header+.app-main {
		padding-top: 50px;
	}

	.hasTagsView {
		.app-main {
			/* 84 = navbar + tags-view = 50 + 34 */
			min-height: calc(100vh - 84px);
		}

		.fixed-header+.app-main {
			padding-top: 84px;
		}
	}
</style>

<style lang="scss">
	// fix css style bug in open el-dialog
	.el-popup-parent--hidden {
		.fixed-header {
			padding-right: 15px;
		}
	}
</style>
