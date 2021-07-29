<template>
    <!-- 车辆详情弹窗 -->
    <div class="confirm-dialog">
        <el-dialog :title="tit" :visible.sync="showMsg" :show-close="false" width="45%" center :close-on-click-modal="false">
            <!-- <div>{{ftit}}</div> -->
			<el-form ref="listLabel" :model="list" v-if="list" label-position="left" label-width="180px">
				<el-form-item v-for="(item ,index) in listLabel" :key="index" :label="item.label" :prop="item.key" :rules="item.rules">
					<el-input required  v-model="list[item.key]" v-if="item.type=== 'input'" :disabled="item.disabled" :type="item.type2" :placeholder="item.placeholder?item.placeholder : '请输入'+item.label"></el-input>
					<el-input required  v-model="list[item.key]" v-if="item.type=== 'textarea'" :disabled="item.disabled" :placeholder="item.placeholder?item.placeholder : '请输入'+item.label"
					 type="textarea" :autosize="{ minRows: 2, maxRows: 6}" maxlength="300" show-word-limit></el-input>
					 <el-select v-model="list[item.key]"  :disabled="item.disabled" :placeholder="item.placeholder?item.placeholder : '请输入'+item.label" v-if="item.type==='select'">
					 	<el-option v-for="(subitem ,index) in item.options" :label="subitem.label" :value="subitem.value"></el-option>
					 </el-select>
					 <el-select v-if="item.type==='selectDiv'" v-model="list[item.key]"clearable :placeholder="item.placeholder?item.placeholder : '请输入'+item.label" :disabled="item.disabled">
					 	<el-option v-for="(subitem ,index) in item.options" :label="subitem.label" :value="subitem.value">
					 		<span style="float: left">{{ subitem.label }}</span>
					 		<span style="float: right; color: #8492a6; font-size: 13px">{{ subitem.label2 }}</span>
					 	</el-option>
					 </el-select>
					 <el-select v-model="list[item.key]" clearable filterable :placeholder="item.placeholder?item.placeholder : '请输入'+item.label"
					  v-if="item.type==='selectMenu'" :disabled="item.disabled">
					     <el-option-group v-for="group in item.options" :key="group.title" :label="group.title">
					       <el-option  v-for="item2 in group.lists" :key="item2" :label="item2" :value="item2"></el-option>
					     </el-option-group>
					   </el-select>
					 <el-date-picker required  v-if="item.type === 'date-picker'" :disabled="item.disabled" v-model="list[item.key]" type="date" :placeholder="item.placeholder?item.placeholder : '请输入'+item.label"
					  style="width: 100%;"></el-date-picker>
					 <el-switch v-if="item.type === 'switch'"  v-model="list[item.key]" :disabled="item.disabled"></el-switch>
					 <!-- 多级选择 -->
					 <el-cascader v-if="item.type === 'cascader'"  :options="item.options"  :disabled="item.disabled" :show-all-levels="item.levels" :props="item.props" v-model="list[item.key]" clearable></el-cascader>
					 <div class=" " v-if="item.type === 'device'">
					 	<el-image style="width: 9.375rem; height: 100px;margin-right: 0.625rem; border-radius: 0.3125rem;" v-if="item.options.length!=0 " v-for="(item2 ,index2) in item.options" :key="index2" :src="item2" :preview-src-list="item.options">
					 	<!-- 	<div slot="error" class="image-slot">
					 			<i class="el-icon-picture-outline"></i>
					 		</div> -->
					 	</el-image>
					 </div>
				</el-form-item>
			</el-form>
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
		Labelkey: {
		    type: String,
		    default: 'good',
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
					this.$emit('confirm',this.list);
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
	.orderliimg{
		max-width: 50%;
		max-height: 200px;
		border-radius: 10px;
	}
	.color_ff20{
		color: #ff2010;
	}
</style>
