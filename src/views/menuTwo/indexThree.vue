<template>
	<!-- 字典管理 -->
	<div class="flex_columns ">
		<h6 class="flex_jufy_center" style="font-size: 2.25rem;margin: 0.625rem 0;">字典管理</h6>
		<el-header>
			<el-button type="primary" @click="addshow()"class="lefte">添加字典</el-button>
			<el-select clearable v-model="brandLetter" placeholder="请选择查询类型" @change="selectCK"
				:disabled="brandlist.length===0" class="lefte">
				<el-option v-for="(item ,index) in brandlist" :key="index" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
		</el-header>
		<el-main>
			<el-table :data="datalist" height="505" stripe border v-loading="loading">
				<el-table-column v-for="(item ,index) in tableName" :key="index" :prop="item.key" :label="item.label"
					:width="item.width" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column label="操作" align="right">
					<template slot-scope="scope">
						<el-button size="mini" @click="handleUpload(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class=" flex_row_reverse" style="padding: 0 20px;">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page.sync="pageNum" :page-size="pageSize" layout="prev, pager, next, jumper"
					:total="total">
				</el-pagination>
			</div>
		</el-main>

		<comfrom :showMsg.sync="show" :fromLabel="Fromlabel" :tit="Fromlabeltit" :fromModel="FromModel"
			@conModify="conAddlist" :disabled.sync="disabled"></comfrom>
		<conDialog :showMsg.sync="showMsg" :ftit="ftit" @confirm="deleteDete"></conDialog>
	</div>
</template>

<script>
	import comfrom from '../../components/concom/comFrom/index.vue';
	import conDialog from '../../components/concom/conDialog/index.vue'; // 确认删除组件
	export default {
		components: {
			comfrom,
			conDialog
		},
		data() {
			return {
				loading: false,
				show: false,
				showMsg: false,
				ftit: '',
				detelist: {},
				disabled: false,
				tableList: [], // 所有表格数据
				datalist: [], //原始数据

				Fromlabeltit: '添加字典',

				srcList: [''], //大图预览
				brandlist: [
					{
						label: '车辆颜色',
						value: 'Vehicle'
					},
					{
						label: '岗位',
						value: 'station'
					},
					{
						label: '拆解方式',
						value: 'mode'
					},
				],
				brandLetter: "", //是否启用

				Fromlabel: [
					{
						label: '字典类型',
						key: 'dictionaries',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'select',
						disabled: false,
						options: [{
								label: '车辆颜色',
								value: 'Vehicle'
							},
							{
								label: '岗位',
								value: 'station'
							},
							{
								label: '拆解方式',
								value: 'mode'
							},
						]
					},
					{
					label: '名称',
					key: 'dictionaryValue',
					rules: [{
						required: true,
						message: '请填写内容',
					}],
					type: 'input',
				}, ],
				FromModel: {
					dictionarys:''
				},
				tableName: [{
						label: '组名称',
						key: 'dictionarys',
						width: '170',
					},
					{
						label: '参数值',
						key: 'dictionaryValue',
						width: '160',
					},
					{
						label: '创建时间',
						key: 'addTime',
						width: '160',
					}
				],
				pageNum: 1, // 第几页
				pageSize: 10, // 每页数
				total: 5, // 数据总条数
			};
		},
		computed: {},
		watch: {},
		created() {
			this.getCaretails(this.pageNum);
			this.loading = false;
		},
		mounted() {

		},
		destroyed() {},
		methods: {
			selectCK(e) {
				console.log(e);
				this.brandLetter = e;
				this.getCaretails(1);
			},
			//图片预览
			yulan(img) {
				// console.log(img)
				this.srcList[0] = img;
				// console.log(this.srcList)
			},
			handleSizeChange(val) {
				// eslint-disable-next-line no-console
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				// eslint-disable-next-line no-console
				console.log(`当前页: ${val}`);
				this.getCaretails(val);
			},
			addshow() {
				this.show = true;
				this.Fromlabeltit = '添加字典';
				// this.Fromlabel[0].disabled = false;
				// this.screen();
				this.disabled = false;
				// console.log(this.Fromlabel);
			},
			// 确定添加数据
			conAddlist(imglist) {
				console.log(imglist);
				console.log(this.FromModel);
				for (let i=0;i < this.Fromlabel[0].options.length;i++) {
					if(this.FromModel.dictionaries == this.Fromlabel[0].options[i].value){
						this.FromModel.dictionarys = this.Fromlabel[0].options[i].label;
					}
				}
				if (this.FromModel.id) {
					console.log('1111111！');
					this.shopUpdate();
				} else {
					console.log('2222222！');
					console.log(this.FromModel);
					this.addstudent();
				}
			},
			conAddlistTwo(imglist) { //two确认数据
				console.log(imglist);
				console.log(this.FromModelTwo);
				if (this.FromModelTwo.id) {
					console.log('1111111！');
					this.catattrUpdate();
				} else {
					console.log('2222222！');
					console.log(this.FromModelTwo);
					this.catattrA();
				}
			},
			// 添加字典
			addstudent() {
				this.$api.dicti.catdiA(this.FromModel, (res) => {
					console.log(res);
					if (res.code == 0) {
						this.$message.success(res.message);
						this.FromModel = {};
						this.getCaretails(this.pageNum);
					} else {
						this.$message.error(res.message);
					}
				});
			},
			// 添加属性
			catattrA() {
				this.$api.group.catattrA(this.FromModelTwo, (res) => {
					console.log(res);
					if (res.code == 0) {
						delete this.FromModelTwo.attributeName;
						this.$message.success(res.message);
						this.getCaretails(this.pageNum);
					} else {
						this.$message.error(res.message);
					}
				});
			},
			// 修改分类
			shopUpdate() {
				this.$api.dicti.catdiU(this.FromModel, (res) => {
					console.log(res);
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum);
					} else {
						this.$message.error(res.message);
					}
				});
			},
			// 修改属性
			catattrUpdate() {
				this.$api.group.catattrU(this.FromModelTwo, (res) => {
					console.log(res);
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum);
					} else {
						this.$message.error(res.message);
					}
				});
			},
			getCaretails(pageNum) { //获取分类
				this.loading = true;
				this.datalist = [];
				var list = {
					dictionaries: this.brandLetter,
					pageNum: pageNum,
					pageSize: this.pageSize
				};
				console.log(list);
				this.$api.dicti.catdiG(list, (res) => {
					console.log(res);
					this.loading = false;
					if(res.code===0){
						this.datalist = res.list;
						this.total = res.total;
						this.pageSize = res.pageSize;
						return;
					}
					this.$message.error(res.message);
				});
			},
			//删除
			handleDelete(index, row) {
				this.detelist = row;
				this.ftit = '确认删除' + row.dictionaryValue + '?';
				this.showMsg = true;
				// 提示是否确认删除
				// console.log(index);
				console.log(row);
			},
			deleteDete() {
				this.loading = true;
				console.log(this.detelist);
				console.log(li);
				let li = [this.detelist.id];
				this.$api.dicti.catdiD(li, (res) => {
					console.log(res);
					if (res.code == 0) {
						this.$message.success(res.message);
						this.FromModel = {};
						this.getCaretails(this.pageNum);
					} else {
						this.$message.error(res.message);
						this.loading = false;
					}
				});
			},
			//编辑
			handleUpload(index, row) {
				this.Fromlabeltit = '编辑';
				console.log(index);
				console.log(row);
				this.show = true;
				this.disabled = false;
				this.FromModel = row;
				console.log(this.FromModel);
			},
		},
	};
</script>
<style lang="scss">
	.lefte{
		margin-right: 0.625rem;
	}
</style>
