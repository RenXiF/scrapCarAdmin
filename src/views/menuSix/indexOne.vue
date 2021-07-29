<template>
	<!-- 订单管理 -->
	<div class="flex_columns ">
		<h6 class="flex_jufy_center" style="font-size: 2.25rem;margin: 0.625rem 0;">订单管理</h6>
		<el-header>
			<el-row :gutter="12" class="flex_wrap">
				<el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2">
					<el-button type="primary" @click="addshow()">添加订单</el-button>
				</el-col>
				<el-col :xs="12" :sm="10" :md="8" :lg="7" :xl="5">
					<el-input placeholder="请输入查询的手机号" v-model="searchiut" clearable @change="searchmod">
						<el-button slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
				<el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2">
					<el-select v-model="Letter" :clearable="true" placeholder="请选择查询类型" @change="selectCK"
						:disabled="brandlist.length==0">
						<el-option v-for="(item ,index) in brandlist" :key="index" :label="item.label"
							:value="item.value"></el-option>
					</el-select>
				</el-col>
			</el-row>
		</el-header>
		<el-main>
			<el-table :data="tableList" height="495" stripe border v-loading="loading">
				<el-table-column label="序号" align="center" :width="70">
					<template slot-scope="scope">
						<p>{{scope.$index+1}}</p>
					</template>
				</el-table-column>
				<el-table-column v-for="(item ,index) in tableName" :key="index" :prop="item.key" :label="item.label"
					:width="item.width" :show-overflow-tooltip="true">
				</el-table-column>
				
				<el-table-column label="操作" align="right" fixed="right">
					<template slot-scope="scope">
						<!-- 	<el-button size="mini" type="info" class="m_b" @click="catmakeS(scope.row)"
							v-if="scope.row.quantity != 0">退还</el-button> -->
						<el-button size="mini" type="success" class="m_b" :disabled="true">
							{{brandlist[scope.row.state].label}}</el-button>
						<el-button size="mini" type="warning" @click="showDetailsList(scope.$index, scope.row)">{{scope.row.state == 0?'修改' : '查看'}}</el-button>
						<!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)"
							:disabled="scope.row.quantity != 0?false : true">删除</el-button> -->
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
		<comfrom :showMsg.sync="show" :fromLabel="Fromlabel" :tit="title" :fromModel="FromModel" @conModify="conAddlist"
			:disabled.sync="disabled" @handleNodeClickDG="DGlist" size="small" :table="tableAdd"
			@addTableck="addTableck" @deleTableck="deleTableck" @upMethod="upMethodadd"></comfrom>
		<!-- 入库弹窗 -->
		<!-- <newOrder :showMsg.sync="showDing" :fromLabel="dingLabel" tit="订单" :fromModel="dingModel"
			@conModify="dingAddlist" :disabled.sync="disabled" @handleNodeClickDG="DGlist" size="small"
			:table="tableAdd" @addTableck="addTableck" @deleTableck="deleTableck" @upMethod="upMethodadd"></newOrder> -->
		<conDialog :showMsg.sync="showMsg" :ftit="ftit" @confirm="deleteDete"></conDialog>
		<!-- <conDetails :showMsg.sync="showDetails" :list="Detailslist" tit="详情" :listLabel="Fromlabel" @confirm="edit">
		</conDetails> -->
	</div>
</template>

<script>
	import newOrder from '../../components/concom/order/newOrder.vue';
	import comfrom from '../../components/concom/comFrom/index.vue';
	import conDialog from '../../components/concom/conDialog/index.vue'; // 确认删除组件
	import conDetails from '../../components/concom/conDialogDetails/index.vue'; // 确认删除组件
	import cities from '../../../mock/data.js';
	export default {
		components: {
			comfrom,
			conDialog,
			conDetails,
			newOrder
		},
		data() {
			return {
				loading: this.$loading,
				show: false,
				showMsg: false,
				showDing: false, //入库

				searchiut: "", //搜索
				title: '添加订单',
				ftit: '',
				detelist: {},
				disabled: false,
				tableList: [], // 所有表格数据

				Letter: 0, //是否启用
				brandlist: [{
						label: "已下单",
						value: 0
					},
					{
						label: "已出货",
						value: 1
					},
				],
				Detailslist: {}, //详情数据
				previewlist: [''], //图片预览
				dingModel: { //入库参数
					frameNumber: '',
					id: '',
					dismantlings: []
				},
				tableAdd: { //内部表格数据
					title: '新增订单',
					disabled: false,
					List: [],
					Name: [{
							label: '零件名称',
							key: 'sparePartsId',
							width: '150',
							type: 'select',
							loading: false,
							disabled: false,
							options: []
						},
						{
							label: '购买数量',
							key: 'quantity',
							width: '120',
							disabled: false,
							type: 'input',
							type2: 'number',
						},
						{
							label: '备注说明',
							key: 'remarks',
							disabled: false,
							type: 'input',
							width: '200',
						},
					]
				},
				addName: [ //添加数据
					{
						label: '单价/元',
						key: 'price',
						disabled: true,
						type: 'input',
						width: '120',
					},
					{
						label: '总价/元',
						key: 'totalAmount',
						disabled: true,
						type: 'input',
						width: '170',
					},
				],
				Fromlabel: [{
						label: '客户姓名',
						key: 'placeName',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						disabled: false,
						type: 'input',
					},
					{
						label: '客户电话',
						key: 'phone',
						rules: [{
							required: true,
							message: '请填写内容',
						},
						{
							pattern: /^1[3|4|5|7|8][0-9]{9}$/, //正则
							message: '请输入正确手机号'
						}
						],
						disabled: false,
						type: 'input',
					},
					{
						label: '地址',
						key: 'address',
						disabled: false,
						type: 'input',
					},
					
					{
						label: '备注',
						key: 'remarks',
						disabled: false,
						type: 'textarea',
					},
					{
						label: '订单状态',
						key: 'state',
						type: 'select',
						disabled: false,
						options: [{
								label: "已下单",
								value: 0
							},
							{
								label: "已出货",
								value: 1
							},
						]
					},
					{
						label: '订单总价',
						key: 'orders',
						disabled: true,
						placeholder:'自动计算总价',
						type: 'input',
					},
				],
				FromModel: {
					catPlaceEntitys: []
				},
				tableName: [ // 表格渲染数据
					{
						label: '订单号',
						key: 'oddNumbers',
						width: '120',
					},
					{
						label: '订单总价',
						key: 'orders',
						width: '120',
					},
					{
						label: '客户姓名',
						key: 'placeName',
						width: '120',
					},
					{
						label: '联系电话',
						key: 'phone',
						width: '120',
					},
					{
						label: '地址',
						key: 'address',
						width: '150',
					},
					{
						label: '创建时间',
						key: 'placeTime',
						width: '160',
					},
					// {
					// 	label: '修改时间',
					// 	key: 'updateTime',
					// 	width: '160',
					// }
				],

				catwarelist: [], //仓库列表
				pageNum: 1, // 第几页
				pageSize: 10, // 每页数
				total: 5, // 数据总条数
			};
		},
		computed: {},
		watch: {},
		created() {
			this.getCaretails(this.pageNum); //获取订单
			// this.getcatwareG();
			this.loading = false;
		},
		mounted() {

		},
		destroyed() {},
		methods: {
			selectCK(e) {
				// //console.log(e);
				this.Letter = e;
				this.getCaretails(1);
			},
			previewCK(list) { //图片预览
				this.previewlist = [list];
			},
			DGlist(item) {
				//console.log(item);
			},
			handleSizeChange(val) {
				// eslint-disable-next-line no-console
				//console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				// eslint-disable-next-line no-console
				//console.log(`当前页: ${val}`);
				this.getCaretails(val);
			},
			addshow() {
				this.title = '添加订单'
				this.show = true;
				this.disabled = false;
				this.toyixiugai(false);
			},
			searchmod(e) {
				//console.log(e);
				this.getCaretails(1);
			},
			// 确定添加数据
			conAddlist(imglist) {
				//console.log('打印确定数据！');
				//console.log(imglist);
				console.log(this.FromModel);
				//console.log(this.tableAdd.List);
				if (this.FromModel.id) {
					this.FromModel.catPlaceEntitys = this.tableAdd.List;
					this.edit(this.FromModel);
					return;
				}
				this.addstudent();
			},
			// 确定添加入库数据
			dingAddlist(imglist) {
				// //console.log(imglist);
				//console.log(this.dingModel);
				//console.log(this.tableAdd.List);
				this.addDiling();
			},
			// 表格内添加按钮
			addTableck() {
				let li = {}
				this.tableAdd.List.splice(this.tableAdd.List.length + 1, 0, li);
				this.getdilingG();
			},
			// 表格删除按钮
			deleTableck(e) {
				this.tableAdd.List.splice(e, 1);
			},
			upMethodadd(index, value) { //远程搜索
				//console.log(index);
				console.log(value);
				this.getDilingG(index, value)
			},
			getdilingG(){//获取所有仓库配件
				var list = {
					pageNum: 0,
					pageSize: 0,
				};
				//console.log(list);
				this.$api.ding.dilingG(list, (res) => {
					console.log(res);
					if (res.code == 0) {
						this.updilingS(res.list, (li) => {
							this.tableAdd.Name[0].options = li;
							this.tableAdd.Name[0].loading = false;
						})
					} else {
						this.tableAdd.Name[0].loading = false;
					}
				});
			},
			getDilingG(i, value) { //获取库存
				this.tableAdd.Name[0].loading = true;
				var list = {
					pageNum: 0,
					pageSize: 0,
					partName: value,
				};
				//console.log(list);
				this.$api.ding.dilingG(list, (res) => {
					//console.log(res);
					if (res.code == 0) {
						// setTimeout(() => {}, 1000);
						this.updilingS(res.list, (li) => {
							this.tableAdd.Name[0].options = li;
							this.tableAdd.Name[0].loading = false;
						})
					} else {
						this.tableAdd.Name[0].loading = false;
					}
				});
			},
			updilingS(list, callback) {
				callback(list.map(iterator => {
					return {
						label: iterator.partName,
						value: iterator.id,
					}
				}));
			},
			vehiclescrapGet(item, callback) { //详情
				this.$api.order.orderGet(item, (res) => {
					console.log(res);
					// this.loading = false;
					if (res.code == 0) {
						// this.$message.success(res.message);
						callback(res.oddNumbers)
					} else {
						this.$message.error(res.message);
					}
				});
			},
			// 添加订单申请
			addstudent() {
				this.FromModel.catPlaceEntitys = this.tableAdd.List;
				//console.log(this.FromModel);
				this.$api.order.orderA(this.FromModel, (res) => {
					//console.log(res);
					if (res.code == 0) {
						this.$message.success(res.message);
						this.FromModel = {}
						this.getCaretails(this.pageNum); //获取订单
					} else {
						this.$message.error(res.message);
					}
				});
			},
			getCaretails(pageNum) { //获取订单
				this.loading = true;
				this.tableList = [];
				var list = {
					pageNum: pageNum,
					pageSize: this.pageSize,
					phone: this.searchiut,
					state: this.Letter
				};
				// if (list.examine === '') {
				// 	delete list.examine
				// }
				console.log(list);
				this.$api.order.orderG(list, (res) => {
					console.log(res);
					this.loading = false;
					if (res.code == 0) {
						this.tableList = res.list;
						this.total = res.total;
						this.pageSize = res.pageSize;
						// //console.log(this.tableList)
						// this.$message.success(res.message);
					} else {
						this.$message.error(res.message);
					}

				});
			},
			//删除
			handleDelete(index, row) {
				this.detelist = row;
				this.ftit = '确认删除' + row.equipmentName + '?(此操作将永久删除数据)';
				this.showMsg = true;
				// 提示是否确认删除
				//console.log(index);
				console.log(row);
			},
			deleteDete() { //确认删除
				//console.log(this.detelist);
				// let li = [this.detelist.id];
				// //console.log(li);
				// //console.log(this.detelist.id);
				this.$api.device.catmakeD(this.detelist, (res) => {
					//console.log(res);
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum); //获取订单
					} else {
						this.$message.error(res.message);
					}
				});

			},
			showDetailsList(index, list) { //打开详情
				//console.log(index);
				console.log(list);
				// this.$set(this.FromModel, 'altogether', list.quantity)
				let li = {
					oddNumbers: list.oddNumbers
				}
				this.vehiclescrapGet(li, (res) => {
					// //console.log(res);
					this.FromModel = list;
					this.tableAdd.List = res;
					this.toyixiugai(true);
					this.title = '查看订单'
					this.show = true;
					list.state ==1?this.disabled = true : this.disabled = false
					// //console.log(this.tableAdd);
				})
			},
			toyixiugai(i) { //切换
				// //console.log(this.tableAdd.Name.length);
				if (i) {
					this.tableAdd.title = '购买记录';
					this.tableAdd.Name[0].key = 'partName';
					this.tableAdd.disabled = true;
					this.tableAdd.Name[0].disabled = true;
					// this.tableAdd.Name[1].disabled = true;
					this.tableAdd.Name[2].disabled = true;
					this.FromModel.state == 0 ? this.Fromlabel[4].disabled = false : this.Fromlabel[4].disabled = false
					if (this.tableAdd.Name.length < 4) {
						this.tableAdd.Name.splice(3, 0, this.addName[0]);
						this.tableAdd.Name.splice(4, 0, this.addName[1]);
					}
					// //console.log(this.tableAdd.Name);
				} else {
					this.FromModel = {
						catPlaceEntitys: []
					}
					this.tableAdd.List = []
					this.tableAdd.title = '新增订单';
					this.tableAdd.Name[0].key = 'sparePartsId';
					this.tableAdd.disabled = false;
					this.tableAdd.Name[0].disabled = false;
					this.tableAdd.Name[1].disabled = false;
					this.tableAdd.Name[2].disabled = false;
					this.Fromlabel[4].disabled = true;
					if (this.tableAdd.Name.length > 4) {
						this.tableAdd.Name.splice(3, 1);
						this.tableAdd.Name.splice(3, 1);
					}
					// //console.log(this.tableAdd.Name);

				}
			},
			edit(item) { //编辑接口
				//console.log('执行编辑接口')
				// this.FromModel.catPlaceEntitys = this.tableAdd.List;
				console.log(item)
				this.$api.order.orderU(item, (res) => {
					console.log(res);
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum); //获取订单
					} else {
						this.$message.error(res.message);
					}
				});
			},
			catmakeS(item) { //退还接口
				this.$api.device.catmakeS(item, (res) => {
					//console.log(res);
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum); //获取订单
					} else {
						this.$message.error(res.message);
					}
				});
			}
		},
	};
</script>
<style lang="scss">
</style>
