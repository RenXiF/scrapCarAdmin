<template>
	<!-- 设备管理 -->
	<div class="flex_columns ">
		<h6 class="flex_jufy_center" style="font-size: 2.25rem;margin: 0.625rem 0;">设备管理</h6>
		<el-header>
			<el-row :gutter="12" class="flex_wrap">
				<el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2">
					<el-button type="primary" @click="addshow()">添加设备</el-button>
				</el-col>
				<el-col :xs="12" :sm="10" :md="8" :lg="7" :xl="5">
					<el-input placeholder="请输入查询的设备" v-model="searchiut" clearable @change="searchmod">
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
				<el-table-column label="照片" width="100" align="center">
					<template slot-scope="scope">
						<el-image style="width: 70px; height: 50px" :src="scope.row.url" fit="fill"
							@click="previewCK(scope.row.url)" :preview-src-list="previewlist">
							<div slot="error" class="image-slot flex_jufy_center" style="height: 100%; width: 100%;">
								<p>暂无图片</p>
							</div>
						</el-image>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="right">
					<template slot-scope="scope">
						<!-- <el-button size="mini" @click="handleUpload(scope.$index, scope.row)">上传图片</el-button> -->
						<el-button size="mini" @click="showDetailsList(scope.$index, scope.row)">修改</el-button>
						<el-button size="mini" :disabled="scope.row.already == 0?false:true" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
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
		<comfrom :showMsg.sync="show" :fromLabel="Fromlabel" tit="添加设备" :fromModel="FromModel" @conModify="conAddlist"
			:disabled.sync="disabled" @handleNodeClickDG="DGlist" size="small"></comfrom>
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

				searchiut: "", //搜索

				ftit: '',
				detelist: {},
				disabled: false,
				tableList: [], // 所有表格数据

				Detailslist: {}, //详情数据
				previewlist: [''], //图片预览
				Fromlabel: [{
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
						label: '设备名',
						key: 'equipmentName',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'input',
					},
					{
						label: '设备编号',
						key: 'equipmentNumber',
						type: 'input',
					},
					{
						label: '型号',
						key: 'model',
						type: 'input',
					},
					{
						label: '数量',
						rules: [{
							required: true,
							message: '请选择内容',
						}],
						key: 'quantity',
						type: 'input',
						type2: 'number',
					},
					{
						label: '备注',
						key: 'remarks',
						type: 'input',
					},
					{
						label: '设备照片',
						key: 'oneImg',
						limit: 1,
						type: 'uploadImg',
					},
				],
				FromModel: {},
				tableName: [{ // 表格渲染数据
						label: '仓库名',
						key: 'name',
						width: '120',
					},
					{
						label: '设备名',
						key: 'equipmentName',
						width: '150',
					},
					{
						label: '设备编号',
						key: 'equipmentNumber',
						width: '100',
					},
					{
						label: '型号',
						key: 'model',
						width: '100',
					},
					{
						label: '总数量',
						key: 'quantity',
						width: '100',
					},
					{
						label: '已借出',
						key: 'already',
						width: '100',
					},
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

				catwarelist: [], //仓库列表
				pageNum: 1, // 第几页
				pageSize: 10, // 每页数
				total: 5, // 数据总条数
			};
		},
		computed: {},
		watch: {},
		created() {
			this.getCaretails(this.pageNum); //获取设备
			this.getcatwareG();
			this.loading = false;
		},
		mounted() {

		},
		destroyed() {},
		methods: {
			previewCK(list) { //图片预览
				this.previewlist = [list];
			},
			getcatwareG() { //获取仓库
				this.$api.store.catwareG({
					pageNum: 0,
					pageSize: 0,
				}, (res) => {
					// console.log(res);
					if (res.code == 0) {
						this.catwarelist = res.list;
						this.screen();
						return;
					}
					this.$message.error(res.message);
				});
			},
			screen() {
				this.Fromlabel[0].options = this.catwarelist.map(iterator => {
					return {
						label: iterator.name,
						value: iterator.id,
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
				// this.disabled = true;
				this.FromModel = {}
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
				if (imglist.length != 0) {
					for (let i = 0; i < imglist.length; i++) {
						if (imglist[i].response.data.url && i == 0) {
							this.FromModel.url = imglist[i].response.data.url;
						}
					}
					console.log(this.FromModel);
				}
				if (this.FromModel.id) {
					this.edit(this.FromModel);
					return;
				}
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
			// 添加设备
			addstudent() {
				console.log(this.FromModel);
				this.$api.device.deviceA(this.FromModel, (res) => {
					console.log(res);
					this.disabled = false;
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum); //获取设备
					} else {
						this.$message.error(res.message);
					}
				});
			},
			getCaretails(pageNum) { //获取设备
				this.loading = true;
				this.tableList = [];
				var list = {
					pageNum: pageNum,
					pageSize: this.pageSize,
					equipmentName: this.searchiut,
				};
				console.log(list);
				this.$api.device.deviceG(list, (res) => {
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
				this.ftit = '确认删除' + row.equipmentName + '?';
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
				this.$api.device.deviceD(li, (res) => {
					console.log(res);
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum); //获取设备
					} else {
						this.$message.error(res.message);
					}
				});
			},
			showDetailsList(index, list) { //打开详情
				console.log(index);
				console.log(list);
				this.FromModel = list;
				this.show = true;
				this.disabled = false;
			},
			edit(item) { //编辑接口
				console.log('111111111111')
				console.log(item)
				this.$api.device.deviceU(item, (res) => {
					console.log(res);
					this.disabled = false;
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum); //获取设备
					} else {
						this.$message.error(res.message);
					}
				});
			},
		},
	};
</script>
<style lang="scss">
	.logo_img {
		max-width: 80%;
		max-height: 80%;
	}
</style>
