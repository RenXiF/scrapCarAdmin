<template>
	<!-- 库存管理 -->
	<div class="flex_columns ">
		<h6 class="flex_jufy_center" style="font-size: 2.25rem;margin: 0.625rem 0;">库存管理</h6>
		<el-header>
			<el-row :gutter="12" class="flex_wrap">
				<!-- <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2">
					<el-button type="primary" @click="addshow()">添加库存</el-button>
				</el-col> -->
				<el-col :xs="12" :sm="10" :md="8" :lg="7" :xl="5">
					<el-input placeholder="请输入需要查询的入库单号" v-model="searchiut" clearable  @change="searchmod">
						<el-button slot="append" icon="el-icon-search" ></el-button>
					</el-input>
				</el-col>
			</el-row>
		</el-header>
		<el-main>
			<el-table :data="tableList" height="495" stripe border v-loading="loading">
				<el-table-column label="序号" align="center" :width="60">
					<template slot-scope="scope"><p>{{scope.$index+1}}</p></template>
				</el-table-column>
				<el-table-column v-for="(item ,index) in tableName" :key="index" :prop="item.key" :label="item.label"
					:width="item.width" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column label="操作" align="right"  fixed="right" width="170">
					<template slot-scope="scope">
						<el-button size="mini" @click="showDetailsList(scope.$index, scope.row)"  :disabled="true">修改</el-button>
						<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
		<comfrom :showMsg.sync="show" :fromLabel="Fromlabel" tit="仓库" :fromModel="FromModel" @conModify="conAddlist"
			:disabled.sync="disabled" @handleNodeClickDG="DGlist" size="small" :table="tableAdd" @addTableck="addTableck" @deleTableck="deleTableck"></comfrom>
		<conDialog :showMsg.sync="showMsg" :ftit="ftit" @confirm="deleteDete"></conDialog>
	</div>
</template>

<script>
	import comfrom from '../../components/concom/comFrom/index.vue';
	import conDialog from '../../components/concom/conDialog/index.vue'; // 确认删除组件
	import cities from '../../../mock/data.js';
	export default {
		components: {
			comfrom,
			conDialog
		},
		data() {
			return {
				loading: this.$loading,
				show: false,
				showMsg: false,

				searchiut: "", //搜索

				ftit: '',
				detelist: {},
				disabled: false,
				tableList: [], // 所有表格数据
				
				
				Letter: 0, //是否启用
				brandlist: [{
						label: "未申请",
						value: 0
					},
					{
						label: "已申请",
						value: 1
					},
				],
				Detailslist: {}, //详情数据
				previewlist: [''], //图片预览
				disModel:{
					frameUrl:'',
					url:'',
				},
				Fromlabel: [],
				FromModel: {
					dismantlings:[]
				},
				tableName: [{ // 表格渲染数据
						label: '仓库名',
						key: 'name',
						width: '100',
					},
					{
						label: '入库编号',
						key: 'warehousingNumber',
						width: '130',
					},
					{
						label: '零件名称',
						key: 'partName',
						width: '100',
					},
					{
						label: '零件类型',
						key: 'partTyps',
						width: '100',
					},
					{
						label: '车架号',
						key: 'frameNumber',
						width: '100',
					},
					{
						label: '库存',
						key: 'quantity',
						width: '70',
					},
					{
						label: '单价',
						key: 'price',
						width: '80',
					},
					{
						label: '仓库方式',
						key: 'disassemblyType',
						width: '90',
					},
					{
						label: '派工人',
						key: 'disassembler',
						width: '100',
					},
					{
						label: '仓库组',
						key: 'disassemblyGroup',
						width: '100',
					},
					{
						label: '仓库工位',
						key: 'disassemblyStation',
						width: '100',
					},
					{
						label: '仓库时间',
						key: 'disassemblyTime',
						width: '120',
					},
					// {
					// 	label: '总数量',
					// 	key: 'total',
					// 	width: '100',
					// },
					{
						label: '备注',
						key: 'remarks',
						width: '100',
					},
					
					{
						label: '创建时间',
						key: 'addTime',
						width: '160',
					}
				],
				catwarelist:[],//仓库车辆列表
				pageNum: 1, // 第几页
				pageSize: 10, // 每页数
				total: 5, // 数据总条数
			};
		},
		computed: {},
		watch: {},
		created() {
			this.getCaretails(this.pageNum); //获取仓库车辆
			this.loading = false;
		},
		mounted() {

		},
		destroyed() {},
		methods: {
			DGlist(item) {
				console.log(item);
			},
			selectCK(e) {
				// console.log(e);
				this.Letter = e;
				this.getCaretails(1);
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
				this.disabled = false;
				this.FromModel = {}
			},
			searchmod(e){
				console.log(e);
				this.getCaretails(1);
			},
			// 确定添加数据
			conAddlist(imglist) {
				console.log('打印确定数据！');
				console.log(imglist);
				console.log(this.FromModel);
				console.log(this.tableAdd.List);
				
				// if (this.FromModel.id) {
				// 	this.edit(this.FromModel);
				// 	return;
				// }
				this.addstudent();
			},
			vehiclescrapGet(id, callback) { //详情
				this.$api.brand.vehiclescrapGet(id, (res) => {
					console.log(res);
					this.loading = false;
					if (res.code == 0) {
						// this.$message.success(res.message);
						callback(res.catInfoVo)
					} else {
						this.$message.error(res.message);
					}
				});
			},
			// 添加仓库车辆
			addstudent() {
				this.FromModel.dismantlings = this.tableAdd.List
				console.log(this.FromModel);
				this.$api.ding.dilingA(this.FromModel, (res) => {
					console.log(res);
					this.disabled = false;
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum); //获取仓库车辆
					} else {
						this.$message.error(res.message);
					}
				});
			},
			getCaretails(pageNum) { //获取仓库车辆
				this.loading = true;
				this.tableList = [];
				var list = {
					pageNum: pageNum,
					pageSize: this.pageSize,
					warehousingNumber: this.searchiut,
					// state:this.Letter
				};
				// console.log(list);
				this.$api.ding.dilingG(list, (res) => {
					console.log(res);
					this.loading = false;
					if (res.code == 0) {
						this.tableList = res.list;
						this.total = res.total;
						this.pageSize = res.pageSize;
						console.log(this.tableList)
						// this.$message.success(res.message);
					} else{
						this.$message.error(res.message);
					}
					
				});
			},
			//删除
			handleDelete(index, row) {
				this.detelist = row;
				this.ftit = '确认删除' + row.partName + '?';
				this.showMsg = true;
				// 提示是否确认删除
				console.log(index);
				console.log(row);
			},
			deleteDete() { //确认删除
				this.loading = true;
				console.log(this.detelist);
				let li = [this.detelist.id];
				console.log(li);
				// console.log(this.detelist.id);
				this.$api.ding.dilingD(li, (res) => {
					console.log(res);
					if (res.code == 0) {
						this.$message.success('删除成功');
						this.getCaretails(this.pageNum); //获取仓库车辆
					} else {
						this.$message.error(res.message);
					}
				});

			},
			edit(item) { //编辑接口
				console.log(item)
				item.money = item.weight * item.unitPrice;
				this.$api.store.housingU(item, (res) => {
					console.log(res);
					this.disabled = false;
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum); //获取仓库车辆
					} else {
						this.$message.error(res.message);
					}
				});
			},
		},
	};
</script>
<style lang="scss">
	.imgag {
		img {
			max-width: 100%;
		}
	}

	.imgag2 {
		img {
			width: 9.125rem;
			height: 12.8125rem;
			margin-left: 5.625rem;
		}
	}

	.logo_img {
		max-width: 80%;
		max-height: 80%;
	}
</style>
