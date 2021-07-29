<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style lang="scss">
	// @import "uview-ui/index.scss";
	// @import '@/styles/common.scss';
    #app{
        width:100%;
        height: 100%;
    }
	.boder{
		border: #FF0000 1px solid;
	}
	.m_b{
		margin-bottom: 0.625rem;
	}
	/* 栅格布局 */
	.flex {
		display: flex !important;
	}
	
	.flex_rows {
		display: flex;
		flex-direction: row !important;
	}
	
	.flex_row_reverse {
		display: flex;
		flex-direction: row-reverse !important;
	}
	
	.flex_columns {
		display: flex;
		flex-direction: column !important;
	}
	
	.flex_wrap {
		display: flex;
		flex-wrap: wrap !important;
	}
	
	.flex_nowrap {
		display: flex;
		flex-wrap: nowrap !important;
	}
	
	.flex_between {
		display: flex;
		justify-content: space-between !important;
	}
	
	.flex_around {
		display: flex;
		justify-content: space-around !important;
	}
	
	.flex_center {
		display: flex;
		align-items: center !important;
	}
	
	.flex_align_start {
		display: flex;
		align-items: flex-start !important;
	}
	
	.flex_align_center {
		display: flex;
		align-items: center !important;
	}
	
	.flex_align_end {
		display: flex;
		align-items: flex-end !important;
	}
	
	.flex_jufy_center {
		display: flex;
		align-items: center;
		justify-content: center !important;
	}
</style>
