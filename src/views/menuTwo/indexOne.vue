<template>
	<!-- 车辆管理 -->
	<div class="flex_columns ">
		<h6 class="flex_jufy_center" style="font-size: 2.25rem;margin: 0.625rem 0;">报废车管理</h6>
		<el-header>
			<el-row :gutter="12" class="flex_wrap">
				<el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2">
					<el-button type="primary" @click="addshow()">添加车辆</el-button>
				</el-col>
				<el-col :xs="12" :sm="10" :md="8" :lg="5" :xl="5">
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
				<el-table-column label="照片" width="100" align="center">
					<template slot-scope="scope">
						<el-image style="width: 70px; height: 50px" :src="scope.row.img" fit="fill"
							@click="previewCK(scope.row.img)" :preview-src-list="previewlist">
							<div slot="error" class="image-slot flex_jufy_center" style="height: 100%; width: 100%;">
								<p>暂无图片</p>
							</div>
						</el-image>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="right"  fixed="right" width="150">
					<template slot-scope="scope">
						<!-- <el-button size="mini" @click="handleUpload(scope.$index, scope.row)">上传图片</el-button> -->
						<el-button size="mini" class="m_b" @click="showDetailsList(scope.$index, scope.row)">修改
						</el-button>
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
		<comfrom :showMsg.sync="show" :fromLabel="Fromlabel" tit="添加车辆" :fromModel="FromModel" @conModify="conAddlist"
			:disabled.sync="disabled" @handleNodeClickDG="DGlist" size="small" @deviceGet="deviceG"></comfrom>
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
	import brandlist from '../../../mock/brand.js';
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

				searchiut: "", //搜索

				ftit: '添加车辆',
				detelist: {},
				disabled: false,
				tableList: [], // 所有表格数据

				Detailslist: {}, //详情数据
				previewlist: [''], //图片预览
				Fromlabel: [{
						label: '车辆图片',
						key: 'img',
						rules: [{
							required: true,
							message: '请在摄像头设备同一网段下进行此操作',
						}],
						options: [],
						type: 'device',
					},
					{
						label: '车牌号',
						key: 'number',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'input',
					},
					{
						label: '车辆品牌',
						key: 'brand',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						options: brandlist,
						type: 'selectMenu',
					},
					{
						label: '车辆重量/吨',
						key: 'weight',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'input',
						type2: 'number',
					},
					{
						label: '载客人数/人',
						key: 'carry',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'input',
						type2: 'number',
					},
					{
						label: '车辆颜色',
						key: 'carColor',
						rules: [{
							required: true,
							message: '请选择内容',
						}],
						options: [],
						type: 'select',
					},
					{
						label: '车架号',
						key: 'frameNumber',
						rules: [{
							required: true,
							message: '请填写内容',
						},
						{ min: 17, max: 17, message: '请填写17位车架号', trigger: 'blur' }],
						type: 'input',
					},
					{
						label: '车辆长度/米',
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
						label: '车辆类型',
						key: 'type',
						rules: [{
							required: true,
							message: '请选择内容',
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
						},
						{
							pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, //正则
							message: '请输入正确身份证号'
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
						}],
						type: 'input',
						type2: 'number',
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
						options: [],
						type: 'selectDiv',
					},
				],
				FromModel: {
					number: '',
					type: '',
					img: '',
					carColor: ''
				},
				tableName: [ // 表格渲染数据
					{
						label: '车主姓名',
						key: 'owner',
						width: '100',
					},
					{
						label: '车牌号',
						key: 'number',
						width: '120',
					},
					{
						label: '车辆重量/吨',
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
						width: '150',
					},
					{
						label: '车辆长度/米',
						key: 'vehicleLength',
						width: '70',
					},
					{
						label: '发动机号',
						key: 'engineNumber',
						width: '100',
					},
					{
						label: '业务员',
						key: 'salesmanName',
						width: '100',
					},
					{
						label: '业务员电话',
						key: 'salesmanPhone',
						width: '100',
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
			this.getCaretails(this.pageNum); //获取车辆
			this.getcatdiG();
			this.getUserG();
			this.loading = false;
			// console.log(brandlist);
		},
		mounted() {

		},
		destroyed() {},
		methods: {
			getcatdiG() { //获取分类
				var list = {
					dictionaries: 'Vehicle',
					pageNum: 0,
					pageSize: 0
				};
				console.log(list);
				this.$api.dicti.catdiG(list, (res) => {
					console.log(res);
					if(res.code===0){
						this.Fromlabel[5].options = res.list.map(iterator => {
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
			getUserG() { //获取用户
				this.$api.staUser.userG({pageNum: 0,pageSize: 0}, (res) => {
					// console.log(res);
					if (res.code == 0 && res.list.length!=0) {
						this.Fromlabel[16].options = res.list.map(iterator => {
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
			previewCK(list) { //图片预览
				this.previewlist = [list];
			},
			deviceG() { //获取设备信息
				this.$api.yDevice.deviceG((res) => {
					console.log(res);
					if (res.code == 0) {
						let item = res.catLendEntity;
						this.FromModel.number = item.equipmentName.split('\u0000')[0]
						this.FromModel.number = item.equipmentName
						this.FromModel.type = item.equipmentNumber
						this.FromModel.carColor = item.color
						this.Fromlabel[0].options[0] = 'http://192.168.1.106:8879/ABC' + item.url.split('ABC')[1]
						this.FromModel.img = this.Fromlabel[0].options[0]
						this.$message.success('获取成功');
					} else {
						this.$message.error(res.message);
					}
				});
			},
			DGlist(item) {
				console.log(item);
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
				this.FromModel = {number: '',type: '',img: '',carColor: ''}
				this.Fromlabel[0].options = []
				console.log(this.FromModel);
			},
			searchmod(e) {
				console.log(e);
				this.searchiut = e;
				this.getCaretails(1);
			},
			// 确定添加数据
			conAddlist(imglist) {
				// var _this = this
				console.log('打印确定数据！');
				console.log(imglist);
				console.log(this.FromModel);
				this.FromModel.province = this.FromModel.sumOne[0];
				this.FromModel.city = this.FromModel.sumOne[1];
				this.FromModel.area = this.FromModel.sumOne[2];
				if (this.FromModel.img != '' && this.FromModel.img.search("192.168.1.106") != -1) {
					console.log('执行图片上传');
					let list = [this.FromModel.img]
					// console.log(list);
					this.$util.DiGuiUpimg(list, (res) => {
						console.log(res)
						this.FromModel.img = res[0].url
						this.addstudent();
					})
					return
				}
				this.addstudent();
			},

			vehiclescrapGet(id, callback) { //详情
				this.$api.brand.vehiclescrapGet(id, (res) => {
					console.log(res);
					if (res.code == 0) {
						callback(res.catInfoEntity)
					} else {
						this.$message.error(res.message);
					}
				});
			},
			// 添加车辆
			addstudent() {
				console.log(this.FromModel);
				this.$api.brand.CaretailsAdd(this.FromModel, (res) => {
					console.log(res);
					this.disabled = false;
					if (res.code == 0) {
						this.$message.success(res.message);
						this.FromModel = {}
						this.Fromlabel[0].options = []
						this.getCaretails(this.pageNum); //获取车辆
					} else {
						this.$message.error(res.message);
					}
				});
			},
			getCaretails(pageNum) { //获取车辆
				this.loading = true;
				var list = {
					pageNum: pageNum,
					pageSize: this.pageSize,
					number: this.searchiut,
				};
				// console.log(list);
				this.$api.brand.getCaretails(list, (res) => {
					console.log(res);
					this.loading = false;
					if (res.code == 0) {
						this.tableList = res.list;
						this.total = res.total;
						this.pageSize = res.pageSize;
						// console.log(this.tableList)
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
				// console.log(index);
				console.log(row);
			},
			deleteDete() { //确认删除
				this.loading = true;
				console.log(this.detelist);
				let li = [this.detelist.id];
				console.log(li);
				// console.log(this.detelist.id);
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
			showDetailsList(index, list) { //打开详情
				// console.log(index);
				console.log(list);
				// this.loading = true;
				this.vehiclescrapGet(list.id, res => {
					this.Detailslist = res;
					const sumOne = [];
					sumOne[0] = res.province;
					sumOne[1] = res.city;
					sumOne[2] = res.area;
					this.Detailslist.sumOne = sumOne;
					this.Detailslist.img = list.img
					this.Fromlabel[0].options[0] = list.img
					this.showDetails = true;
					console.log(this.Detailslist);
				});

			},
			edit(item) { //编辑接口
				// console.log('111111111111')
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
