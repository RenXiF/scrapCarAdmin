<template>
	<!-- 查验表单 -->
	<el-dialog :title="tit" :visible.sync="showMsg" width="60%" :show-close="false" :closeOnClickModal="false" center>
		<div class="flex_columns" v-for="(item ,index) in fromLabel" :key="index">
			<h2 style="margin-bottom: 0.6125rem;">{{index+1}}.{{item.groupingName}}</h2>
			<!-- <el-form ref="fromModel" :model="fromModel" v-if="fromModel" label-position="left" label-width="auto" :size="size" class="boder">
				<el-form-item v-for="(item2 ,index2) in item.attributeEntities" :key="index2" :label="item2.attributeName" :rules="rules" :prop="item2.value">
					<el-input required v-model="item2.value" v-if="item2.frame== 2" type="text" :placeholder="item2.placeholder?item2.placeholder : '请输入'+item2.attributeName" :disabled="item2.disabled"></el-input>
					<el-input required v-model="item2.value" v-if="item2.frame== 3" :placeholder="item2.placeholder?item2.placeholder : '请输入'+item2.attributeName" :disabled="item2.disabled"
					 type="textarea" :autosize="{ minRows: 2, maxRows: 6}" maxlength="300" show-word-limit></el-input>
					<el-select v-if="item2.frame== 4" v-model="item2.value"clearable :placeholder="item2.placeholder?item2.placeholder : '请输入'+item2.attributeName" :disabled="item2.disabled">
						<el-option v-for="(subitem ,index) in item.options" :label="subitem.label" :value="subitem.value"></el-option>
					</el-select>
					<el-radio-group v-if="item2.frame== 1" v-model="item2.value">
						<el-radio v-model="item2.value" label="true">正确</el-radio>
						<el-radio v-model="item2.value" label="false">错误</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form> -->
			<div class="flex_wrap">
				<div class="flex_row_reverse flex_rows boder_bottom flex_center " v-for="(item2 ,index2) in item.attributeEntities" :key="index2" style="width: 30%;padding: 7px 10px;">
					
					<div class="">
						<el-input required v-model="item2.value" v-if="item2.frame== 2" type="text" :placeholder="item2.placeholder?item2.placeholder : '请输入'+item2.attributeName" :disabled="item2.disabled"></el-input>
						<el-input required v-model="item2.value" v-if="item2.frame== 3" :placeholder="item2.placeholder?item2.placeholder : '请输入'+item2.attributeName" :disabled="item2.disabled"
						 type="textarea" :autosize="{ minRows: 2, maxRows: 6}" maxlength="300" show-word-limit></el-input>
						<el-select v-if="item2.frame== 4" v-model="item2.value"clearable :placeholder="item2.placeholder?item2.placeholder : '请输入'+item2.attributeName" :disabled="item2.disabled">
							<el-option v-for="(subitem ,index) in item.options" :label="subitem.label" :value="subitem.value"></el-option>
						</el-select>
						<el-radio-group v-if="item2.frame== 1" v-model="item2.value">
							<el-radio v-model="item2.value" label="true">正确</el-radio>
							<el-radio v-model="item2.value" label="false">错误</el-radio>
						</el-radio-group>
					</div>
					<h3  style="margin-right: 0.6125rem;">{{index2+1}}.{{item2.attributeName}}:</h3>
				</div>
			</div>
		</div>
		
		<div slot="footer" class="dialog-footer">
			<el-button @click="$emit('update:showMsg', false)">取 消</el-button>
			<el-button :type="type" @click="dialogConfirm('fromModel')" :disabled="disabled">确 定</el-button>
		</div>
	</el-dialog>
</template>
<script>
	export default {
		name: 'conModify',
		props: {
			disabled:Boolean,
			showMsg: Boolean,
			tit: {
				type: String,
				default: '系统消息',
			},
			type: {
				type: String,
				default: 'primary',
			},
			size:{
				type: String,
				default: 'medium',
			},
			fromModel: {
				type: Object,
				default () {
					return {};
				},
			},
			fromLabel: {
				type: Array,
				default () {
					return [];
				},
			},
		},
		data() {
			return {
				fileList: [],
				rules: [{
					required: true,
					message: '请填写内容',
				}],
			};
		},
		created() {
			// console.log(this.$http);
		},
		methods: {
			handleNodeClick(data){//树形结构
				console.log(data);
				this.$emit("handleNodeClickDG",data);
			},
			dialogConfirm(formName) {
				console.log(this.fromLabel);
				console.log(formName);
				// this.$refs[formName].validate((valid) => {
				// 	console.log(valid);
				// 	if (valid) {
						this.$emit('conModify', this.fromLabel);
						this.$emit('update:showMsg', false);
				// 	} else {
				// 		console.log('error submit!!');
				// 		return false;
				// 	}
				// });
				
			},
		},
	};
</script>
<style lang="scss">
	.boder_bottom{
		border-bottom: #dfdfdf 0.0625rem solid;
	}
</style>
