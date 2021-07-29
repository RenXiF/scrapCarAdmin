<template>
    <!-- 订单详情弹窗 -->
    <div class="confirm-dialog">
        <el-dialog :title="tit" :visible.sync="showMsg" :show-close="false" width="45%" center :close-on-click-modal="false">
            <!-- <div>{{ftit}}</div> -->
			<el-form ref="listLabel" :model="list.good" v-if="list.good" label-position="left" label-width="180px">
				<el-form-item v-for="(item ,index) in listLabel" :key="index" :label="item.label" :prop="item.key" :rules="item.rules" v-if="item.label!= '品牌ID' && item.label!= '店铺选择'">
					<el-input required  v-model="list.good[item.key]" v-if="item.type=== 'input'" :type="item.type2" :placeholder="item.placeholder?item.placeholder : '请输入'+item.label"></el-input>
					<el-input required  v-model="list.good[item.key]" v-if="item.type=== 'textarea'" :placeholder="item.placeholder?item.placeholder : '请输入'+item.label"
					 type="textarea" :autosize="{ minRows: 2, maxRows: 6}" maxlength="300" show-word-limit></el-input>
					 <el-select v-model="list.good[item.key]"  :placeholder="item.placeholder?item.placeholder : '请输入'+item.label" v-if="item.type==='select'">
					 	<el-option v-for="(subitem ,index) in item.options" :label="subitem.label" :value="subitem.value"></el-option>
					 </el-select>
					 <el-date-picker required  v-if="item.type === 'date-picker'" v-model="list.good[item.key]" type="date" :placeholder="item.placeholder?item.placeholder : '请输入'+item.label"
					  style="width: 100%;"></el-date-picker>
					 <el-switch v-if="item.type === 'switch'"  v-model="list.good[item.key]"></el-switch>
					 <!-- 多级选择 -->
					 <el-cascader v-if="item.type === 'cascader'"  :options="item.options"  :show-all-levels="item.levels" :props="item.props" v-model="list.good[item.key]" clearable></el-cascader>
					
				</el-form-item>
			</el-form>
			<div class="flex_columns " v-if="list.imgList">
				<div class="flex_rows" style="margin-bottom: 1.25rem;">
					<h4>主图：</h4>
					<el-image
				    style="width: 100px; height: 100px;margin-left: 1.25rem;"
					v-for="(item ,index) in list.imgList" :key="index"
				    :src="item.imgAddress" 
					lazy v-if="item.imgGenre=='1'">
				  </el-image>
				</div>
				<div class="flex_rows" style="margin-bottom: 1.25rem;">
					<h4>详情图：</h4>
					<el-image
				    style="width: 100px; height: 100px;margin-left: 1.25rem;"
					v-for="(item ,index) in list.imgList" :key="index"
				    :src="item.imgAddress" 
					lazy v-if="item.imgGenre=='2'">
				  </el-image>
				</div>
			</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="$emit('update:showMsg', false)">取 消</el-button>
                <el-button :type="type" @click="dialogConfirm('listLabel')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        showMsg: Boolean,
        tit: {
            type: String,
            default: '系统消息',
        },
        list: {
        	type: Object,
        	default () {
        		return {};
        	},
        },
		listLabel: {
			type: Array,
			default () {
				return [];
			},
		},
        type: {
            type: String,
            default: 'primary',
        },
    },
    components: {},
    data() {
        return {
            // 是否同步展示
            // visible: false,
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    destroyed() {},
    methods: {
        /**
			 *@description: 确定执行的方法
			 *@param{}
			 *@return:
			 */
        dialogConfirm(formName) {
			this.$refs[formName].validate((valid) => {
				// console.log(valid);
				// console.log(this.fromModel);
				if (valid) {
					// this.$refs.upload.submit();
					// this.$emit('conModify', this.fileList);
					this.$emit('update:showMsg', false);
					this.$emit('confirm',this.list.good);
					this.fileList = [];
					// this.disabled = true;
				} else {
					console.log('error submit!!');
					return false;
				}
			});
        },
    },
};
</script>
<style lang='scss' scoped>
    //@import url(); 引入公共css类
</style>
