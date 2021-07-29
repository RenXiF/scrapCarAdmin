<template>
	<!-- 查验分类管理 -->
	<div class="flex_columns ">
		<h6 class="flex_jufy_center" style="font-size: 2.25rem;margin: 0.625rem 0;">分类管理</h6>
		<el-header>
			<el-button type="primary" @click="addshow()"class="lefte">添加分类</el-button>
			<el-select clearable v-model="brandLetter" placeholder="请选择查询分类" @change="selectCK"
				:disabled="brandlist.length===0" class="lefte">
				<el-option v-for="(item ,index) in brandlist" :key="index" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<el-button type="primary" @click="addshowTwo()"class="lefte">添加属性</el-button>
		</el-header>
		<el-main>
			<el-table :data="datalist" height="505" stripe border v-loading="loading">
				<el-table-column v-for="(item ,index) in tableName" :key="index" :prop="item.key" :label="item.label"
					:width="item.width" :show-overflow-tooltip="true" v-if="brandLetter==''">
				</el-table-column>
				<el-table-column v-for="(item ,index) in tableNameTwo" :key="index" :prop="item.key" :label="item.label"
					:width="item.width" :show-overflow-tooltip="true" v-if="brandLetter!=''">
				</el-table-column>
				<!-- <el-table-column label="logo" width="100" align="center">
					<template slot-scope="scope">
						<el-image @click="yulan(scope.row.sortImg)" style="width: 70px; height: 50px"
							:src="scope.row.sortImg" fit="fill" :preview-src-list="srcList"></el-image>
					</template>
				</el-table-column> -->
				<el-table-column label="文本类型" width="130" align="center" v-if="brandLetter!=''">
					<template slot-scope="scope">
						<el-tag type="success">{{FromlabelTwo[1].options[scope.row.frame-1].label}}</el-tag>
						<!-- <el-tag type="danger" v-else-if="">待审核</el-tag> -->
					</template>
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
		<comfrom :showMsg.sync="showTwo" :fromLabel="FromlabelTwo" :tit="Fromlabeltit" :fromModel="FromModelTwo"
			@conModify="conAddlistTwo" :disabled.sync="disabled"></comfrom>
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
				showtitIndex: 0,
				show: false,
				showMsg: false,
				showTwo: false,
				ftit: '',
				detelist: {},
				disabled: false,
				tableList: [], // 所有表格数据
				datalist: [], //原始数据

				choicelist: {}, //已选择的数据
				deleteindex: 0, //删除的下标
				Fromlabeltit: '添加分类',

				srcList: [''], //大图预览
				brandlist: [
				// 	{
				// 	label: "全部",
				// 	value: 0
				// },
				],
				brandLetter: "", //是否启用

				Fromlabel: [{
					label: '名称',
					key: 'groupingName',
					rules: [{
						required: true,
						message: '请填写内容',
					}],
					type: 'input',
				}, ],
				FromModel: {},

				FromlabelTwo: [{
						label: '分类选择',
						key: 'groupingId',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'select',
						disabled: false,
						options: []
					},
					{
						label: '文本类型',
						key: 'frame',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'select',
						disabled: false,
						options: [{
								label: '单选',
								value: 1
							},
							{
								label: '输入框',
								value: 2
							},
							{
								label: '大型输入框',
								value: 3
							}
						]
					},
					{
						label: '名称',
						key: 'attributeName',
						rules: [{
							required: true,
							message: '请填写内容',
						}],
						type: 'input',
					},
				],
				FromModelTwo: {},
				tableName: [{
						label: '分类名称',
						key: 'groupingName',
						width: '170',
					},
					{
						label: '创建时间',
						key: 'addTime',
						width: '160',
					}
				],
				tableNameTwo: [{
						label: '属性名称',
						key: 'attributeName',
						width: '170',
					},
					// {
					// 	label: '文本类型',
					// 	key: 'frame',
					// 	width: '160',
					// },
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
			var _this = this;
			this.getCaretails(this.pageNum);
			setTimeout(function() {
				_this.screen();
			}, 1000)
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
				this.Fromlabeltit = '添加分类';
				// this.Fromlabel[0].disabled = false;
				// this.screen();
				this.disabled = false;
				delete this.FromModel.groupingName;
				// console.log(this.Fromlabel);
			},
			addshowTwo() {
				this.showTwo = true;
				this.Fromlabeltit = '添加属性';
				this.disabled = false;
				delete this.FromModelTwo.attributeName;
				// console.log(this.Fromlabel);
			},
			// 确定添加数据
			conAddlist(imglist) {
				console.log(imglist);
				console.log(this.FromModel);
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
			// 添加分类
			addstudent() {
				this.$api.group.catgroupAdd(this.FromModel, (res) => {
					console.log(res);
					if (res.code == 0) {
						delete this.FromModel.groupingName;
						this.$message.success(res.message);
						this.Fromlabel[0].disabled = false;
						
						this.getCaretails(this.pageNum);
						var _this = this;
						setTimeout(function() {
							_this.screen();
						}, 1000)
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
				this.$api.group.catgroupUpdate(this.FromModel, (res) => {
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
					groupingId: this.brandLetter,
					pageNum: pageNum,
					pageSize: this.pageSize
				};
				console.log(list);
				if (this.brandLetter != "") {//查询属性
					console.log('11111111');
					this.$api.group.catattrG(list, (res) => {
						console.log(res);
						this.loading = false;
						if(res.list){
							this.datalist = res.list;
							this.total = res.total;
							this.pageSize = res.pageSize;
							return;
						}
						this.$message.error(res.message);
					});
				} else {//查询分类
					console.log('2222222222');
					this.$api.group.catgroupGet(list, (res) => {
						console.log(res);
						this.loading = false;
						if(res.list){
							this.datalist = res.list;
							this.total = res.total;
							this.pageSize = res.pageSize;
							return;
						}
						this.$message.error(res.message);
					});
				}
			},
			screen() {
				this.FromlabelTwo[0].options = this.datalist.map(iterator => {
					return {
						label: iterator.groupingName,
						value: iterator.id,
					}
				});
				this.brandlist = this.datalist.map(iterator => {
					return {
						label: iterator.groupingName,
						value: iterator.id,
					}
				});
				console.log(this.brandlist)
			},
			//删除
			handleDelete(index, row) {
				this.detelist = row;
				this.ftit = '确认删除' + row.groupingName + '?';
				this.showMsg = true;
				// 提示是否确认删除
				// console.log(index);
				console.log(row);
				if(this.brandLetter==""){
					this.ftit = '确认删除' + row.groupingName + '?';
					return;
				}
				this.ftit = '确认删除' + row.attributeName + '?';
			},
			deleteDete() {
				this.loading = true;
				console.log(this.detelist);
				console.log(li);
				let li = [this.detelist.id];
				if (this.brandLetter=="") {
					this.$api.group.catgroupDelete(li, (res) => {
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
					return;
				}
				this.$api.group.catattrD(li, (res) => {
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
				
				if(this.brandLetter==""){
					this.show = true;
					this.disabled = false;
					this.FromModel = row;
					console.log(this.FromModel);
					return;
				}
				this.showTwo = true;
				this.disabled = false;
				this.FromModelTwo = row;
				console.log(this.FromModelTwo);
			},
		},
	};
</script>
<style lang="scss">
	.lefte{
		margin-right: 0.625rem;
	}
</style>
