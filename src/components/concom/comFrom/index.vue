<template>
	<!-- 表单修改提交 -->
	<el-dialog :title="tit" :visible.sync="showMsg" width="50%" :show-close="false" :closeOnClickModal="false" center>
		<el-form ref="fromModel" :model="fromModel" v-if="fromModel" label-position="left" label-width="auto" :size="size">
			<el-form-item v-for="(item ,index) in fromLabel" :key="index" :label="item.label" :rules="item.rules" :prop="item.key">
				<el-input required v-model="fromModel[item.key]" v-if="item.type=== 'input'" :type="item.type2" :placeholder="item.placeholder?item.placeholder : '请输入'+item.label" :disabled="item.disabled"></el-input>
				<el-input required v-model="fromModel[item.key]" v-if="item.type=== 'textarea'" :placeholder="item.placeholder?item.placeholder : '请输入'+item.label" :disabled="item.disabled"
				 type="textarea" :autosize="{ minRows: 2, maxRows: 6}" maxlength="300" show-word-limit></el-input>
				<el-select v-if="item.type==='select'" v-model="fromModel[item.key]"clearable :placeholder="item.placeholder?item.placeholder : '请输入'+item.label" :disabled="item.disabled">
					<el-option v-for="(subitem ,index) in item.options" :label="subitem.label" :value="subitem.value"></el-option>
				</el-select>
				<el-select v-if="item.type==='selectDiv'" v-model="fromModel[item.key]"clearable :placeholder="item.placeholder?item.placeholder : '请输入'+item.label"
				 :disabled="item.disabled" @change="selectDivch">
					<el-option v-for="(subitem ,index) in item.options" :label="subitem.label" :value="subitem.value">
						<span style="float: left">{{ subitem.label }}</span>
						<span style="float: right; color: #8492a6; font-size: 13px">{{ subitem.label2 }}</span>
					</el-option>
				</el-select>
				<el-select v-model="fromModel[item.key]" clearable filterable :placeholder="item.placeholder?item.placeholder : '请输入'+item.label"
				 v-if="item.type==='selectMenu'" :disabled="item.disabled">
				    <el-option-group v-for="group in item.options" :key="group.title" :label="group.title">
				      <el-option  v-for="item2 in group.lists" :key="item2" :label="item2" :value="item2"></el-option>
				    </el-option-group>
				  </el-select>
				
				<el-button v-if="item.type === 'tree'" @click="fromModel[item.key]=0">选择顶级</el-button>
				<el-tree v-if="item.type === 'tree'" :data="item.data" :empty-text="item.emptyText" :props="item.defaultProps"
				  accordion highlight-current @node-click="handleNodeClick" :disabled="item.disabled">
				</el-tree>
				<el-date-picker required v-if="item.type === 'date-picker'" :format="item.format" :value-format="item.vformat" v-model="fromModel[item.key]" :placeholder="item.placeholder?item.placeholder : '请输入'+item.label"
				:type="item.type2":disabled="item.disabled" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
				
				<el-switch v-if="item.type === 'switch'" v-model="fromModel[item.key]" :disabled="item.disabled"></el-switch>
				<!-- 多级选择 -->
				<el-cascader v-if="item.type === 'cascader'" :options="item.options"  :disabled="item.disabled" :show-all-levels="item.levels" :props="item.props" v-model="fromModel[item.key]" clearable></el-cascader>
				<div v-if="item.type === 'uploadImg'">
					<uploadImg :action="$http.apili+'/oss/uploadfile'" :limit="item.limit" multiple @upSuccess="upSuccess" :title="item.title"></uploadImg>
				</div>
				<el-radio-group v-if="item.type === 'radio'" v-model="fromModel[item.key]">
				    <el-radio v-for="(subitem ,index) in item.options" v-model="subitem.value" :label="subitem.label" border size="medium">{{subitem.label}}</el-radio>
				</el-radio-group>
				<div class="flex_wrap flex_center" v-if="item.type === 'imglist'">
					<el-image style="width: 100px; height: 100px;margin-right: 10px; border-radius: 10px;" v-for="(item2 ,index2) in item.options" :key="index2" :src="item2" :preview-src-list="item.options">
						<div slot="error" class="image-slot">
							<i class="el-icon-picture-outline"></i>
						</div>
					</el-image>
				</div>
				<div class="flex_between flex_row_reverse flex_wrap" v-if="item.type === 'device'">
					<div style="margin-right: 0.625rem; margin-bottom: 0.625rem;">
						<el-button size="mini" type="primary" @click="deviceGet()">获取车辆信息</el-button>
					</div>
					<el-image style="width: 9.375rem; height: 100px;margin-right: 0.625rem; border-radius: 0.3125rem;" v-if="item.options.length!=0 " v-for="(item2 ,index2) in item.options" :key="index2" :src="item2" :preview-src-list="item.options">
						<!-- <div slot="error" class="image-slot">
							<i class="el-icon-picture-outline"></i>
						</div> -->
					</el-image>
					
				</div>
			</el-form-item>
		</el-form>
		<!-- 添加数据表格 -->
		<div class="" v-if="table.Name.length!=0">
			<h6 class="flex_jufy_center" style="font-size: 2.25rem;margin: 0.625rem 0;">{{table.title}}</h6>
			<div class="flex_row_reverse flex_center" style="margin-bottom: 10px;">
				<el-button type="primary" icon="el-icon-circle-plus-outline" :disabled="table.disabled" @click="$emit('addTableck')">添加</el-button>
			</div>
			<el-table :data="table.List" height="295" stripe border>
				<el-table-column label="序号" align="right" :width="50">
					<template slot-scope="scope">
						<p>{{scope.$index+1}}</p>
					</template>
				</el-table-column>
				<el-table-column v-for="(item ,index) in table.Name" :key="index" :prop="item.key" :label="item.label"
					:width="item.width" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<el-input required v-if="item.type==='input'" v-model="scope.row[item.key]" :type="item.type2" :disabled="item.disabled" :placeholder="item.placeholder?item.placeholder : '请输入'+item.label"></el-input>
						<el-select class="" v-else v-model="scope.row[item.key]"clearable :placeholder="item.placeholder?item.placeholder : '请输入'+item.label":disabled="item.disabled"
						:loading="item.loading" filterable remote :remote-method="remoteMethod" @focus="indexck(scope.$index)">
							<el-option v-for="(subitem ,index) in item.options" :label="subitem.label" :value="subitem.value" :key="subitem.value"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="right" fixed="right">
					<template slot-scope="scope">
						<el-button size="mini" type="danger" :disabled="table.disabled"  @click="$emit('deleTableck',scope.$index)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button @click="$emit('update:showMsg', false)">取 消</el-button>
			<el-button :type="type" @click="dialogConfirm('fromModel')" :disabled="disabled">确 定</el-button>
		</div>
	</el-dialog>
</template>
<script>
	import uploadImg from '../../uploadIMG/index.vue';
	export default {
		components: {
			uploadImg
		},
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
			table:{
				type: Object,
				default () {
					return {
						List:[],
						Name:[]
					};
				},
			}
		},
		data() {
			return {
				fileList: [],
				index:0
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
			upSuccess(list,key) {
				console.log('上传成功数据')
				this.$message.success('上传图片成功');
				console.log(list)
				this.fileList = list;
				this.$emit('update:disabled', false);
			},
			dialogConfirm(formName) {
				this.$refs[formName].validate((valid) => {
					// console.log(valid);
					// console.log(this.fromModel);
					if (valid) {
						// this.$refs.upload.submit();
						this.$emit('conModify', this.fileList);
						this.$emit('update:showMsg', false);
						this.fileList = [];
						this.$emit('update:disabled', true);
						
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			remoteMethod(query){//远程搜索
				if (query!=='') {
					// console.log(query);
					this.$emit('upMethod', this.index,query);
				} else{
					console.log('执行二段');
				}
			},
			indexck(index){
				// console.log(index);
				this.index = index
			},
			deviceGet(){//获取设备信息
				this.$emit('deviceGet');
			},
			selectDivch(e){//获取设备信息
				// console.log(e);
			}
		},
	};
</script>
<style lang="scss">
</style>
