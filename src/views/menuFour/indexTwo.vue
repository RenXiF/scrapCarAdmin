<template>
	<!-- 入库管理 -->
	<div class="flex_columns ">
		<h6 class="flex_jufy_center" style="font-size: 2.25rem;margin: 0.625rem 0;">入库订单</h6>
		<el-header>
			<el-row :gutter="12" class="flex_wrap">
				<!-- <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2">
					<el-button type="primary" @click="addshow()">添加仓库</el-button>
				</el-col> -->
				<el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2">
					<el-select v-model="Letter" clearable  placeholder="请选择查询类型" @change="selectCK"
						:disabled="brandlist.length==0">
						<el-option v-for="(item ,index) in brandlist" :key="index" :label="item.label"
							:value="item.value"></el-option>
					</el-select>
				</el-col>
				<el-col :xs="12" :sm="10" :md="8" :lg="7" :xl="5">
					<el-input placeholder="请输入需要查询的入库单号" v-model="searchiut" clearable @change="searchmod">
						<el-button slot="append" icon="el-icon-search"></el-button>
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
				<el-table-column label="操作" align="right" fixed="right" :width="270">
					<template slot-scope="scope">
						<div>
							<el-button size="mini" @click="Dismantling(scope.$index, scope.row)" v-if="scope.row.state ===0">申请拆解</el-button>
							<el-button size="mini" @click="dingck(scope.$index, scope.row)" v-if="scope.row.state ===1">拆解</el-button>
							<el-button size="mini" :disabled="true" type="success" v-if="scope.row.state ===0">未申请</el-button>
							<el-button size="mini" :disabled="true" type="success" v-if="scope.row.state ===1">已申请</el-button>
							<el-button size="mini" :disabled="true" type="success" v-if="scope.row.state ===2">已拆解</el-button>
							<el-button size="mini" @click="showDetailsList(scope.$index, scope.row)"
								:disabled="scope.row.state ==0||scope.row.state==2? false : true">{{scope.row.state==2?'查看':'修改'}}</el-button>
							<el-button size="mini" type="danger":disabled="scope.row.state ==1||scope.row.state==2? true : false" @click="handleDelete(scope.$index, scope.row)">删除
							</el-button>
						</div>
						
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
		<comfrom :showMsg.sync="show" :fromLabel="Fromlabel" :tit="showtit" :fromModel="FromModel" @conModify="conAddlist"
			:disabled.sync="disabled" @handleNodeClickDG="DGlist" size="small"></comfrom>
		<comfrom :showMsg.sync="showDis" :fromLabel="dislabel" tit="添加拆解" :fromModel="disModel" @conModify="disAddlist"
			:disabled.sync="disabled" @handleNodeClickDG="DGlist" size="small"></comfrom>
			<!-- 入库弹窗 -->
			<comfrom :showMsg.sync="showDing" :fromLabel="dingLabel" tit="拆解" :fromModel="dingModel" @conModify="dingAddlist"
				:disabled.sync="disabled" @handleNodeClickDG="DGlist" size="small" :table="tableAdd" @addTableck="addTableck" @deleTableck="deleTableck"></comfrom>
		<conDialog :showMsg.sync="showMsg" :ftit="ftit" @confirm="deleteDete"></conDialog>
		<conDetails :showMsg.sync="showDetails" :list="Detailslist" tit="详情" :listLabel="Fromlabel" @confirm="edit">
		</conDetails>
	</div>
</template>

<script>
	import comfrom from '../../components/concom/comFrom/index.vue';
	import conDialog from '../../components/concom/conDialog/index.vue'; // 确认删除组件
	import conDetails from '../../components/concom/conDialogDetails/index.vue'; // 确认删除组件
	import cities from '../../../mock/data.js';
	export default {
		components: {
			comfrom,
			conDialog,
			conDetails
		},
		data() {
			return {
				loading: this.$loading,
				show: false,
				showMsg: false,
				showDetails: false,
				showDis: false, //拆解
				showDing:false,//入库
				showtit:'添加仓库',
				searchiut: "", //搜索

				ftit: '',
				detelist: {},
				disabled: false,
				tableList: [], // 所有表格数据


				Letter: '', //是否启用
				brandlist: [
					// {
					// 	label: "全部",
					// 	value: ''
					// },
					{
						label: "未申请",
						value: 0
					},
					{
						label: "已申请",
						value: 1
					},
					{
						label: "已拆解",
						value: 2
					},
				],
				Detailslist: {}, //详情数据
				previewlist: [''], //图片预览
				dislabel: [{
						label: '车主姓名',
						key: 'owner',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'input',
					},
					{
						label: '车牌号',
						key: 'number',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						// disabled: true,
						type: 'input',
					},
					// {
					// 	label: '号牌种类',
					// 	key: 'numberType',
					// 	rules: [{
					// 		required: true,
					// 		message: '请填写内容',
					// 	}],
					// 	type: 'input',
					// },
					{
						label: '车辆类型',
						key: 'type',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						// disabled: true,
						type: 'input',
					},
					{
						label: '车架号',
						key: 'frameNumber',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						// disabled: true,
						type: 'input',
					},
					{
						label: '车辆型号',
						key: 'catType',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						// disabled: true,
						type: 'input',
					},
					{
						label: '车辆重量/吨',
						key: 'weight',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						// disabled: true,
						type: 'input',
						type2: 'number',
					},
					{
						label: '单价',
						key: 'unitPrice',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						placeholder: '吨/元',
						type: 'input',
						type2: 'number',
					},
					{
						label: '总金额/元',
						key: 'money',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						placeholder: '自动计算',
						// disabled: true,
						type: 'input',
						type2: 'number',
					},
					{
						label: '备注',
						key: 'remarks',
						// rules: [{
						// 	required: true,
						// 	message: '请填写内容',
						// }],
						type: 'textarea',
					},
					{
						label: '照片',
						key: 'oneImg',
						title: '注：第一张为拆解照片，第二张为车架号照片',
						limit: 2,
						type: 'uploadImg',
					},
					// {
					// 	label: '车架号照片',
					// 	key: 'twoImg',
					// 	limit:1,
					// 	rules: [{
					// 		required: true,
					// 		message: '请填写内容',
					// 	}],
					// 	type: 'uploadImg',
					// },
				],
				disModel: {
					frameUrl: '',
					url: '',
				},
				Fromlabel: [{
						label: '仓库选择',
						key: 'spareId',
						rules: [{
							required: true,
							message: '请选择内容',
						}],
						options: [],
						type: 'select',
					},
					{
						label: '车主姓名',
						key: 'owner',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'input',
					},
					{
						label: '身份证号',
						key: 'certificates',
						rules: [{
								required: true,
								message: '请填写内容',
							},
							{
								pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, //正则
								message: '请输入正确身份证号'
							}
						],
						type: 'input',
					},
					{
						label: '车架号',
						key: 'frameNumber',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						// disabled: true,
						type: 'input',
					},
					{
						label: '车牌号',
						key: 'number',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						// disabled: true,
						type: 'input',
					},
					{
						label: '车辆重量/吨',
						key: 'weight',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						// disabled: true,
						type: 'input',
						type2: 'number',
					},
					{
						label: '车辆类型',
						key: 'type',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						// disabled: true,
						type: 'input',
					},
					{
						label: '车辆型号',
						key: 'catType',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						// disabled: true,
						type: 'input',
					},
					{
						label: '单价',
						key: 'unitPrice',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						placeholder: '吨/元',
						type: 'input',
						type2: 'number',
					},
					{
						label: '总金额/元',
						key: 'money',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						placeholder: '自动计算',
						// disabled: true,
						type: 'input',
						type2: 'number',
					},
					{
						label: '备注',
						key: 'remarks',
						// rules: [{
						// 	required: true,
						// 	message: '请填写内容',
						// }],
						type: 'textarea',
					},

				],
				FromModel: {},
				dingLabel:[//入库弹窗
					{
						label: '仓库选择',
						key: 'warehouseId',
						rules: [{
							required: true,
							message: '请选择内容',
						}],
						options: [],
						type: 'select',
					},
					{
						label: '拆解方式',
						key: 'disassemblyType',
						rules: [{
							required: true,
							message: '请选择内容',
						}],
						options: [],
						type: 'select',
					},
					{
						label: '派工人',
						key: 'disassembler',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						options: [],
						type: 'selectDiv',
					},
					// {
					// 	label: '部门',
					// 	key: 'disassemblyGroup',
					// 	rules: [{
					// 		required: true,
					// 		message: '请填写内容',
					// 	}
					// 	],
					// 	type: 'input',
					// },
					// {
					// 	label: '岗位',
					// 	key: 'disassemblyStation',
					// 	rules: [{
					// 		required: true,
					// 		message: '请填写内容',
					// 	}],
					// 	disabled: true,
					// 	type: 'input',
					// },
					{
						label: '拆解时间',
						key: 'disassemblyTime',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						// disabled: true,
						vformat:'yyyy-MM-dd',
						format:'yyyy 年 MM 月 dd 日',
						type: 'date-picker',
					},
					// {
					// 	label: '总数量',
					// 	key: 'total',
					// 	rules: [{
					// 		required: true,
					// 		message: '请填写内容',
					// 	}],
					// 	type: 'input',
					// 	type2: 'number',
					// },
					{
						label: '车架号',
						key: 'frameNumber',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						// disabled: true,
						type: 'input',
					},
					{
						label: '备注',
						key: 'notes',
						// rules: [{
						// 	required: true,
						// 	message: '请填写内容',
						// }],
						type: 'textarea',
					},
				],
				dingModel:{//入库参数
					frameNumber:'',
					id:'',
					dismantlings:[]
				},
				tableAdd:{//内部表格数据
					title:'拆解标准',
					List:[],
					Name:[
						{
							label: '零件名称',
							key: 'partName',
							width: '150',
							type: 'input',
						},
						{
							label: '零件类型',
							key: 'partTyps',
							width: '150',
							type: 'input',
						},
						{
							label: '单价',
							key: 'price',
							width: '130',
							type2: 'number',
							type: 'input',
						},
						{
							label: '数量',
							key: 'quantity',
							width: '130',
							type2: 'number',
							type: 'input',
						},
						
						{
							label: '备注说明',
							key: 'remarks',
							width: '200',
							type: 'input',
						},
					]
				},
				
				tableName: [{ // 表格渲染数据
						label: '仓库名',
						key: 'name',
						width: '120',
					},
					{
						label: '入库单号',
						key: 'warehousingCode',
						width: '130',
					},
					// {
					// 	label: '仓库类型',
					// 	key: 'warehouseType',
					// 	width: '100',
					// },
					{
						label: '车牌号',
						key: 'number',
						width: '100',
					},
					{
						label: '车架号',
						key: 'frameNumber',
						width: '100',
					},
					{
						label: '车辆重量/吨',
						key: 'weight',
						width: '100',
					},
					{
						label: '单价',
						key: 'unitPrice',
						width: '110',
					},
					{
						label: '总金额/元',
						key: 'money',
						width: '100',
					},
					{
						label: '拆解员',
						key: 'dismantlingName',
						width: '100',
					},
					{
						label: '拆解员电话',
						key: 'dismantlingPhone',
						width: '100',
					},
					{
						label: '创建时间',
						key: 'addTime',
						// width: '160',
					}
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
			this.getCaretails(this.pageNum);
			this.getcatwareG();//获取仓库
			this.getcatdiG();//获取用户
			this.getmodeG();//获取字典拆解方式
			this.loading = false;
		},
		mounted() {

		},
		destroyed() {},
		methods: {
			screen() {
				this.Fromlabel[0].options = this.catwarelist.map(iterator => {
					return {
						label: iterator.name,
						value: iterator.id,
					}
				});
				this.dingLabel[0].options = this.catwarelist.map(iterator => {
					return {
						label: iterator.name,
						value: iterator.id,
					}
				});
			},
			getmodeG() { //获取字典拆解方式
				this.$api.dicti.catdiG({
					dictionaries: 'mode',
					pageNum: 0,
					pageSize: 0
				}, (res) => {
					// console.log(res);
					if(res.code===0){
						this.dingLabel[1].options = res.list.map(iterator => {
							return {
								label: iterator.dictionaryValue,
								value: iterator.dictionaryValue,
							}
						});
						return;
					}
					this.$message.error(res.message);
				});
			},
			getcatdiG() { //获取用户
				var list = {
					pageNum: 0,
					pageSize: 0
				};
				this.$api.staUser.userG(list, (res) => {
					console.log(res);
					if (res.code == 0 && res.list.length!=0) {
						this.dingLabel[2].options = res.list.map(iterator => {
							return {
								label: iterator.staName,
								label2: iterator.phone,
								value: iterator.id,
							}
						});
						return;
					}
					this.$message.error(res.message);
				});
			},
			// 表格内添加按钮
			addTableck(){
				let li = {}
				this.tableAdd.List.splice(this.tableAdd.List.length+1,0,li);
			},
			// 表格删除按钮
			deleTableck(e){
				this.tableAdd.List.splice(e,1);
			},
			getcatwareG() { //获取仓库
				this.$api.store.catwareG({
					pageNum: 0,
					pageSize: 0,
				}, (res) => {
					console.log(res);
					if (res.code == 0) {
						this.catwarelist = res.list;
						this.screen();
						return;
					}
					this.$message.error(res.message);
				});
			},
			DGlist(item) {
				console.log(item);
			},
			selectCK(e) {
				console.log(e);
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
				this.showtit = '添加仓库'
				this.disabled = false;
				this.FromModel = {}
				if(this.Fromlabel.length >11){
					this.Fromlabel.splice(11,1);
				}
			},
			//打开入库
			dingck(index, row){
				this.showDing = true;
				this.disabled = false;
				this.dingModel.frameNumber = row.frameNumber
				this.dingModel.id = row.id
			},
			searchmod(e) {
				console.log(e);
				this.getCaretails(1);
			},
			// 确定添加数据
			conAddlist(imglist) {
				console.log('打印确定数据！');
				console.log(imglist);
				console.log(this.FromModel);

				if (this.FromModel.id) {
					this.edit(this.FromModel);
					return;
				}
				this.addstudent();
			},
			// 确定添加拆解数据
			disAddlist(imglist) {
				console.log(imglist);
				if (imglist.length != 0) {
					for (let i = 0; i < imglist.length; i++) {
						if (imglist[i].response.data.url && i == 0) {
							this.disModel.frameUrl = imglist[i].response.data.url;
						} else {
							this.disModel.url = imglist[i].response.data.url;
						}
					}
					console.log(this.disModel);
					this.disModel.state = 1;
					this.edit(this.disModel);
				}

			},
			// 确定添加入库数据
			dingAddlist(imglist){
				// console.log(imglist);
				console.log(this.dingModel);
				console.log(this.tableAdd.List);
				this.addDiling();
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
			// 添加库存
			addDiling() {
				this.dingModel.dismantlings = this.tableAdd.List
				console.log(this.dingModel);
				this.$api.ding.dilingA(this.dingModel.id,this.dingModel, (res) => {
					console.log(res);
					this.disabled = false;
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum); //获取仓库
					} else {
						this.$message.error(res.message);
					}
				});
			},
			// 添加仓库
			addstudent() {
				var _this = this;
				console.log(this.FromModel);
				this.$api.store.catwareA(this.FromModel, (res) => {
					console.log(res);
					this.disabled = false;
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum); //获取仓库
					} else {
						this.$message.error(res.message);
					}
				});
			},
			getCaretails(pageNum) { //获取仓库
				this.loading = true;
				this.tableList = [];
				var list = {
					pageNum: pageNum,
					pageSize: this.pageSize,
					warehousingCode: this.searchiut,
					state: this.Letter===''?-1 :this.Letter
				};
				console.log(list);
				this.$api.store.housingG(list, (res) => {
					console.log(res);
					this.loading = false;
					if (res.code == 0) {
						console.log('11111');
						this.tableList = res.list;
						console.log(this.tableList)
						this.total = res.total;
						this.pageSize = res.pageSize;
						// console.log(this.tableList)
						// this.$message.success(res.message);
					} else {
						console.log('222222');
						this.$message.error(res.message);
					}

				});
			},
			//删除
			handleDelete(index, row) {
				this.detelist = row;
				this.ftit = '确认删除' + row.warehousingCode + '?';
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
				this.$api.store.housingD(li, (res) => {
					console.log(res);
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum); //获取仓库
					} else {
						this.$message.error(res.message);
					}
				});

			},
			Dismantling(index, list) { //打开拆解
				console.log(index);
				console.log(list);
				this.showDis = true;
				this.disModel = list;
				this.disabled = true;
			},
			showDetailsList(index, list) { //打开详情
				console.log(index);
				console.log(list);
				this.FromModel = list;
				this.showtit = '查看信息'
				this.show = true;
				this.disabled = false;
				let it = {
						label: '拆解照片',
						key: 'imglist',
						options: [],
						type: 'imglist',
					}
				if(list.url!=null && this.Fromlabel.length<=11){
					this.Fromlabel.splice(11,0,it);
					this.Fromlabel[11].options[0] = list.url
					this.Fromlabel[11].options[1] = list.frameUrl
				}
			},
			edit(item) { //编辑接口
				console.log(item)
				let mo = item.weight * item.unitPrice;
				item.money = parseFloat(mo).toFixed(2);
				this.$api.store.housingU(item, (res) => {
					console.log(res);
					this.disabled = false;
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum); //获取仓库
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
