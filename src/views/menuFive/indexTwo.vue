<template>
	<!-- 设备记录 -->
	<div class="flex_columns ">
		<h6 class="flex_jufy_center" style="font-size: 2.25rem;margin: 0.625rem 0;">设备记录</h6>
		<el-header>
			<el-row :gutter="12" class="flex_wrap">
				<el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2">
					<el-button type="primary" @click="addshow()">添加申请</el-button>
				</el-col>
				<el-col :xs="12" :sm="10" :md="8" :lg="7" :xl="5">
					<el-input placeholder="请输入查询的设备名" v-model="searchiut" clearable @change="searchmod">
						<el-button slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
				<el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2">
					<el-select v-model="Letter"clearable  placeholder="请选择查询类型" @change="selectCK"
						:disabled="brandlist.length==0">
						<el-option v-for="(item ,index) in brandlist" :key="index" :label="item.label"
							:value="item.value"></el-option>
					</el-select>
				</el-col>
			</el-row>
		</el-header>
		<el-main>
			<el-table :data="tableList" height="495" stripe border v-loading="loading" >
				<el-table-column label="序号" align="center" :width="60">
					<template slot-scope="scope"><p>{{scope.$index+1}}</p></template>
				</el-table-column>
				<el-table-column v-for="(item ,index) in tableName" :key="index" :prop="item.key" :label="item.label"
					:width="item.width" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column label="照片" align="center">
					<template slot-scope="scope">
						<el-image style="width: 70px; height: 50px" :src="scope.row.url" fit="fill"
							@click="previewCK(scope.row.url)" :preview-src-list="previewlist">
							<div slot="error" class="image-slot flex_jufy_center" style="height: 100%; width: 100%;">
								<p>暂无图片</p>
							</div>
						</el-image>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="right"  fixed="right" width="170">
					<template slot-scope="scope">
						<el-button size="mini" type="info" class="m_b" @click="catmakeS(scope.row)" v-if="scope.row.examine == 0">退还</el-button>
						<el-button size="mini" type="success" class="m_b":disabled="true" v-else>已退还</el-button>
						<!-- <el-button size="mini" type="warning" @click="showDetailsList(scope.$index, scope.row)" v-if="scope.row.quantity != 0">修改</el-button> -->
						<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)":disabled="scope.row.examine != 0?false : true">删除</el-button>
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
		<comfrom :showMsg.sync="show" :fromLabel="Fromlabel" tit="添加申请" :fromModel="FromModel" @conModify="conAddlist"
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

				Letter: 0, //是否启用
				brandlist: [{
						label: "未退还",
						value: 0
					},
					{
						label: "已退还",
						value: 1
					},
				],
				Detailslist: {}, //详情数据
				previewlist: [''], //图片预览
				Fromlabel: [{
						label: '设备选择',
						key: 'equipmentId',
						rules: [{
							required: true,
							message: '请选择内容',
						}],
						options: [],
						type: 'select',
					},
					{
						label: '使用时间',
						key: 'Time',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						// disabled: true,
						vformat:'yyyy-MM-dd',
						format:'yyyy 年 MM 月 dd 日',
						type2: 'daterange',
						type: 'date-picker',
					},
					{
						label: '数量',
						key: 'altogether',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'input',
						type2: 'number',
					},
					{
						label: '申请人',
						key: 'name',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'input',
					},
					{
						label: '用途',
						key: 'purpose',
						type: 'textarea',
					},
				],
				FromModel: {
					makeStartDate:'',
					makeEndDate:'',
					Time:['123','123']
				},
				tableName: [{ // 表格渲染数据
						label: '仓库名',
						key: 'warehouseName',
						width: '120',
					},
					{
						label: '设备名',
						key: 'equipmentName',
						width: '120',
					},
					{
						label: '数量',
						key: 'quantity',
						width: '70',
					},
					{
						label: '申请人',
						key: 'name',
						width: '100',
					},
					{
						label: '申请时间',
						key: 'makeStart',
						width: '100',
					},
					{
						label: '结束时间',
						key: 'makeEnd',
						width: '100',
					},
					{
						label: '用途',
						key: 'purpose',
						width: '170',
					},
					{
						label: '创建时间',
						key: 'addTime',
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
			this.getCaretails(this.pageNum); //获取设备
			this.getcatwareG();
			this.loading = false;
		},
		mounted() {

		},
		destroyed() {},
		methods: {
			selectCK(e) {
				// console.log(e);
				this.Letter = e;
				this.getCaretails(1);
			},
			previewCK(list) { //图片预览
				this.previewlist = [list];
			},
			getcatwareG() { //获取设备
				this.$api.device.deviceG({
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
						label: iterator.equipmentName,
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
				this.disabled = false;
				// this.FromModel = {}
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
			// 添加设备申请
			addstudent() {
				this.FromModel.makeStartDate = this.FromModel.Time[0]
				this.FromModel.makeEndDate = this.FromModel.Time[1]
				console.log(this.FromModel);
				this.$api.device.catmakeA(this.FromModel, (res) => {
					console.log(res);
					if (res.code == 0) {
						this.$message.success(res.message);
						this.FromModel = {}
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
					warehouseName: this.searchiut,
					examine:this.Letter
				};
				if(list.examine===''){
					delete list.examine
				}
				console.log(list);
				this.$api.device.catmakeG(list, (res) => {
					console.log(res);
					this.loading = false;
					if (res.code == 0) {
						this.tableList = res.list;
						this.total = res.total;
						this.pageSize = res.pageSize;
						// console.log(this.tableList)
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
				console.log(index);
				console.log(row);
			},
			deleteDete() { //确认删除
				console.log(this.detelist);
				// let li = [this.detelist.id];
				// console.log(li);
				// console.log(this.detelist.id);
				this.$api.device.catmakeD(this.detelist, (res) => {
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
				let li = [list.makeStart,list.makeEnd]
				this.$set(this.FromModel,'altogether',list.quantity)
				this.FromModel.Time = li;
				console.log(this.FromModel);
				this.show = true;
				this.disabled = false;
			},
			edit(item) { //编辑接口
				console.log('执行编辑接口')
				console.log(item)
				this.$api.device.catmakeU(item, (res) => {
					console.log(res);
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum); //获取设备
					} else {
						this.$message.error(res.message);
					}
				});
			},
			catmakeS(item){//退还接口
				this.$api.device.catmakeS(item, (res) => {
					console.log(res);
					if (res.code == 0) {
						this.$message.success(res.message);
						this.getCaretails(this.pageNum); //获取设备
					} else {
						this.$message.error(res.message);
					}
				});
			}
		},
	};
</script>
<style lang="scss">
	// .m_b{
	// 	margin-bottom: 0.625rem;
	// }
</style>
