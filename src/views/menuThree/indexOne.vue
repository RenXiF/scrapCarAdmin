<template>
	<!-- 查验管理 -->
	<div class="flex_columns ">
		<h6 class="flex_jufy_center" style="font-size: 2.25rem;margin: 0.625rem 0;">公司查验</h6>
		<el-header>
			<el-row :gutter="12" class="flex_wrap">
				<el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2">
					<el-select v-model="brandLetter" clearable placeholder="请选择查询品牌" @change="selectCK"
						:disabled="brandlist.length==0">
						<el-option v-for="(item ,index) in brandlist" :key="index" :label="item.label"
							:value="item.value"></el-option>
					</el-select>
				</el-col>
				<el-col :xs="12" :sm="11" :md="10" :lg="9" :xl="7">
					<el-input placeholder="请输入查询的车牌号" v-model="searchiut" clearable @change="searchmod">
						<el-button slot="append" icon="el-icon-search" @change="getCaretails(pageNum)"></el-button>
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
				<el-table-column label="操作" align="right">
					<template slot-scope="scope">
						<el-button size="mini" @click="handleUpload(scope.$index, scope.row)"
							v-if="scope.row.testing =='否'">查验</el-button>
						<el-button size="mini" type="success" :disabled="false" @click="handleUpload(scope.$index, scope.row)" v-else>已查验</el-button>
						
						<el-button size="mini" @click="Warehousing(scope.$index, scope.row)" v-if="scope.row.testing !='否'">入库</el-button>
						<el-button size="mini" @click="showDetailsList(scope.$index, scope.row)"
							v-if="scope.row.testing =='否'">修改</el-button>
						<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)"
							v-if="scope.row.testing =='否'">删除</el-button>
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
		<comfrom :showMsg.sync="show" :fromLabel="Fromlabel" tit="添加车辆" :fromModel="FromModel" @conModify="conAddlist"
			:disabled.sync="disabled" @handleNodeClickDG="DGlist" size="small"></comfrom>
		<checkfrom :showMsg.sync="showCheck" :fromLabel="checklabel" tit="查验车辆" :fromModel="FromModel"
			@conModify="checklist" :disabled.sync="disabled" size="small"></checkfrom>
		<comfrom :showMsg.sync="showTest" :fromLabel="textlabel" tit="车辆入库" :fromModel="textModel"
			@conModify="conAddtext" :disabled.sync="disabled" size="small"></comfrom>
		<conDialog :showMsg.sync="showMsg" :ftit="ftit" @confirm="deleteDete"></conDialog>
		<conDetails :showMsg.sync="showDetails" :list="Detailslist" tit="详情" :listLabel="Fromlabel" @confirm="edit">
		</conDetails>
	</div>
</template>

<script>
	import comfrom from '../../components/concom/comFrom/index.vue';
	import checkfrom from '../../components/concom/comFrom/check.vue';
	import conDialog from '../../components/concom/conDialog/index.vue'; // 确认删除组件
	import conDetails from '../../components/concom/conDialogDetails/index.vue'; // 确认删除组件
	import cities from '../../../mock/data.js';
	export default {
		components: {
			comfrom,
			checkfrom,
			conDialog,
			conDetails
		},
		data() {
			return {
				loading: this.$loading,
				show: false,
				showMsg: false, //删除
				showDetails: false, //修改
				showCheck: false, //查验
				showTest: false, //入库

				brandLetter: '', //是否启用
				brandlist: [{
						label: "已查验",
						value: '是'
					},
					{
						label: "未查验",
						value: '否'
					},
				],
				searchiut: "", //搜索

				ftit: '',
				detelist: {},
				disabled: false,
				tableList: [], // 所有表格数据

				cheid: "",
				checklabel: [],
				Detailslist: {}, //详情数据
				previewlist: [''], //图片预览

				textlabel: [
					{
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
						disabled: true,
						type: 'input',
					},
					{
						label: '车牌号',
						key: 'number',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						disabled: true,
						type: 'input',
					},
					{
						label: '车辆重量/吨',
						key: 'weight',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						disabled: true,
						type: 'input',
						type2: 'number',
					},
					{
						label: '车辆型号',
						key: 'catType',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						disabled: true,
						type: 'input',
					},
					{
						label: '载客人数',
						key: 'carry',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						disabled: true,
						type: 'input',
						type2: 'number',
					},
					{
						label: '单价/吨/元',
						key: 'unitPrice',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						placeholder:'吨/元',
						type: 'input',
						type2: 'number',
					},
					{
						label: '金额',
						key: 'money',
						// rules: [{
						// 	required: true,
						// 	message: '请填写内容',
						// }],
						placeholder:'自动计算',
						disabled: true,
						type: 'input',
						type2: 'number',
					},
					{
						label: '备注',
						key: 'remarks',
						type: 'textarea',
					},
				],
				textModel: {
					weight:0,
					unitPrice:0,
					money:0
				},
				Fromlabel: [{
						label: '车牌号',
						key: 'number',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'input',
					},
					{
						label: '车辆重量',
						key: 'weight',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'input',
					},
					{
						label: '载客人数',
						key: 'carry',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'input',
						type2: 'number',
					},
					{
						label: '车辆品牌',
						key: 'brand',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'input',
					},
					{
						label: '车辆颜色',
						key: 'carColor',
						rules: [{
							required: true,
							message: '请选择内容',
						}],
						options: [{
								value: '红色',
								label: '红色'
							}, {
								value: '蓝色',
								label: '蓝色'
							}, {
								value: '绿色',
								label: '绿色'
							}, {
								value: '白色',
								label: '白色'
							}, {
								value: '黑色',
								label: '黑色'
							},
							{
								value: '灰色',
								label: '灰色'
							},
							{
								value: '选项',
								label: '其他'
							}
						],
						type: 'select',
					},
					{
						label: '车架号',
						key: 'frameNumber',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'input',
					},
					{
						label: '车辆长度',
						key: 'vehicleLength',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'input',
						type2: 'number'
					},
					{
						label: '发动机号',
						key: 'engineNumber',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'input',
					},
					{
						label: '车辆型号',
						key: 'catType',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'input',
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
						}],
						type: 'input',
					},
					{
						label: '联系电话',
						key: 'telePhone',
						rules: [{
							required: true,
							message: '请填写内容',
						},
						{
							pattern: /^1[3|4|5|7|8][0-9]{9}$/, //正则
							message: '请输入正确手机号'
						}
						],
						type: 'input',
					},
					{
						label: '省区县',
						key: 'sumOne',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						options: cities,
						type: 'cascader',
					},
					{
						label: '地址',
						key: 'mailbox',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'input',
					},
					{
						label: '负责业务员',
						key: 'salesmanId',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'input',
					},
				],
				FromModel: {},
				tableName: [{ // 表格渲染数据
						label: '车牌号',
						key: 'number',
						width: '120',
					},
					{
						label: '车辆重量',
						key: 'weight',
						width: '100',
					},
					{
						label: '载客人数',
						key: 'carry',
						width: '100',
					},
					{
						label: '车辆品牌',
						key: 'brand',
						width: '100',
					},
					{
						label: '车辆颜色',
						key: 'carColor',
						width: '100',
					},
					{
						label: '车架号',
						key: 'frameNumber',
						width: '70',
					},
					{
						label: '车辆长度',
						key: 'vehicleLength',
						width: '100',
					},
					{
						label: '发动机号',
						key: 'engineNumber',
						width: '100',
					},
					{
						label: '创建时间',
						key: 'addTime',
						width: '160',
					}
				],
				catwarelist:[],//仓库列表
				pageNum: 1, // 第几页
				pageSize: 10, // 每页数
				total: 5, // 数据总条数
			};
		},
		computed: {},
		watch: {},
		created() {
			this.getCaretails(this.pageNum); //获取车辆
			this.getcatwareG();//获取仓库列表
			this.loading = false;
		},
		mounted() {

		},
		destroyed() {},
		methods: {
			screen() {
				this.textlabel[0].options = this.catwarelist.map(iterator => {
					return {
						label: iterator.name,
						value: iterator.id,
					}
				});
			},
			getcatwareG() { //获取仓库
				this.$api.store.catwareG({
					pageNum: 0,
					pageSize: 0,
				}, (res) => {
					console.log(res);
					if (res.code == 0) {
						this.catwarelist = res.list;
						console.log(this.catwarelist);
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
				this.brandLetter = e;
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
			searchmod(e) {
				console.log(e);
			},
			// 确定添加数据
			conAddlist(imglist) {
				console.log('打印确定数据！');
				console.log(imglist);
				console.log(this.FromModel);
				this.FromModel.province = this.FromModel.sumOne[0];
				this.FromModel.city = this.FromModel.sumOne[1];
				this.FromModel.area = this.FromModel.sumOne[2];
				this.addstudent();
			},
			// 确认入库数据
			conAddtext(imglist){
				console.log(imglist);
				let mo = this.textModel.weight * this.textModel.unitPrice;
				this.textModel.money = parseFloat(mo).toFixed(2);
				console.log(this.textModel);
				this.$api.store.housingA(this.textModel, (res) => {
					console.log(res);
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum); //获取车辆
					} else {
						this.$message.error(res.message);
					}
				});
			},
			checklist(list) { //确认查验数据
				console.log(list);
				console.log(this.cheid);
				this.$api.check.checklistA(this.cheid, list, (res) => {
					console.log(res);
					// this.disabled = false;
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum); //获取车辆
					} else {
						this.$message.error(res.message);
					}
				});
			},
			vehiclescrapGet(id, callback) { //详情
				this.$api.brand.vehiclescrapGet(id, (res) => {
					console.log(res);
					this.loading = false;
					if (res.code == 0) {
						// this.$message.success(res.message);
						callback(res.catInfoEntity)
					} else {
						this.$message.error(res.message);
					}
				});
			},
			// 添加车辆
			addstudent() {
				var _this = this;
				console.log(this.FromModel);
				this.$api.brand.CaretailsAdd(this.FromModel, (res) => {
					console.log(res);
					this.disabled = false;
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum); //获取车辆
					} else {
						this.$message.error(res.message);
					}
				});
			},
			getCaretails(pageNum) { //获取车辆
				this.loading = true;
				this.tableList = [];
				var list = {
					pageNum: pageNum,
					pageSize: this.pageSize,
					number: this.searchiut,
					testing: this.brandLetter
				};
				console.log(list);
				this.$api.brand.getCaretails(list, (res) => {
					console.log(res);
					this.loading = false;
					if (res.code == 0) {
						this.tableList = res.list;
						this.total = res.total;
						this.pageSize = res.pageSize;
						console.log(this.tableList)
						// this.$message.success(res.message);
					} else {
						this.$message.error(res.message);
					}
				});
			},
			//删除
			handleDelete(index, row) {
				this.detelist = row;
				this.ftit = '确认删除' + row.number + '?';
				this.showMsg = true;
				// 提示是否确认删除
				console.log(index);
				console.log(row);
			},
			deleteDete() { //确认删除
				this.loading = true;
				console.log(this.detelist);
				let li = [];
				let id = this.detelist.id;
				li[0] = id
				console.log(li);
				console.log(this.detelist.id);
				this.$api.brand.deleteCaretails(li, (res) => {
					console.log(res);
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum); //获取车辆
					} else {
						this.$message.error(res.message);
					}
				});

			},
			checklistG(id, callback) { //获取查验单
				this.$api.check.checklistG(id, (res) => {
					console.log(res);
					if (res.code == 0) {
						// this.$message.success(res.message);
						callback(res.groupingEntity)
					} else {
						this.$message.error(res.message);
					}
				});
			},
			handleUpload(index, list) { //查验打开
				console.log(index);
				console.log(list);
				this.cheid = list.id
				this.checklistG(this.cheid, (res) => {
					console.log(res);
					if (res.length != 0) {
						this.showCheck = true;
						this.checklabel = res;
					} else {
						this.$message.error('查询失败');
					}
				});
			},
			Warehousing(index, list) { //入库
				console.log(index);
				console.log(list);
				this.showTest = true;
				this.disabled = false;
				this.textModel = list;
				// this.vehiclescrapGet(list.id, res => {
				// 	this.Detailslist = res;
				// 	this.Detailslist.sumOne = sumOne;
				// 	this.showDetails = true;
				// 	console.log(this.Detailslist);
				// });

				// this.$api.store.housingA(item, (res) => {
				// 	console.log(res);
				// 	this.disabled = false;
				// 	if (res.code == 0) {
				// 		this.$message.success(res.message);
				// 		this.getCaretails(this.pageNum); //获取车辆
				// 	} else {
				// 		this.$message.error(res.message);
				// 	}
				// });
			},
			showDetailsList(index, list) { //打开详情
				console.log(index);
				console.log(list);
				this.loading = true;
				this.vehiclescrapGet(list.id, res => {
					this.Detailslist = res;
					const sumOne = [];
					sumOne[0] = res.province;
					sumOne[1] = res.city;
					sumOne[2] = res.area;
					this.Detailslist.sumOne = sumOne;
					this.showDetails = true;
					console.log(this.Detailslist);
				});

			},
			edit(item) { //编辑接口
				console.log('111111111111')
				console.log(item)
				item.province = item.sumOne[0];
				item.city = item.sumOne[1];
				item.area = item.sumOne[2];
				this.$api.brand.CaretailsUpdate(item, (res) => {
					console.log(res);
					this.disabled = false;
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum); //获取车辆
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
