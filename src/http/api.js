/**
 *@author: wanggang
 *@date: 2020-04-27 14:31:18
 *@description: api接口请求文件
 */
import {
	get,
	post,
	postJson,
	postForm,
} from './http';
import httpli from './index';

const api = {
	// 测试模块
	test: {
		// 测试普通get请求路径拼接
		testGet1(id, callback) {
			get(httpli.apili, '/getTest1/${id}').then((res) => {
				callback(res);
			});
		},
		// 测试post请求
		testPost1(params, callback) {
			post('/postTest1', params).then((res) => {
				callback(res);
			});
		},
	},
	//车辆管理
	brand: {
		//添加车辆  
		CaretailsAdd(params, callback) {
			post(httpli.apili, 'vehiclescrap/catinfo/save', params).then((res) => {
				callback(res);
			});
		},
		//编辑车辆
		CaretailsUpdate(params, callback) {
			post(httpli.apili, 'vehiclescrap/catinfo/update', params).then((res) => {
				callback(res);
			});
		},
		
		// 根据id车辆获取车主信息
		vehiclescrapGet(params, callback) {
			get(httpli.apili, 'vehiclescrap/catinfo/info/'+params).then((res) => {
				callback(res);
			});
		},
		// 获取车辆信息  旧接口地址Caretails/getAll
		getCaretails(params, callback) {
			post(httpli.apili, 'vehiclescrap/catinfo/list', params).then((res) => {
				callback(res);
			});
		},
		//添加车辆图片
		CaretailsAddimg(params, callback) {
			post(httpli.apili, 'img/addList', params).then((res) => {
				callback(res);
			});
		},
		// 删除车辆信息
		deleteCaretails(params, callback) {
			post(httpli.apili, 'vehiclescrap/catinfo/delete',params).then((res) => {
				callback(res);
			});
		},
	},
	group:{
		// 查验分类管理
		//添加
		catgroupAdd(params, callback) {
			post(httpli.apili, 'vehiclescrap/catgroup/save', params).then((res) => {
				callback(res);
			});
		},
		//获取
		catgroupGet(params, callback) {
			post(httpli.apili, 'vehiclescrap/catgroup/list', params).then((res) => {
				callback(res);
			});
		},
		//删除
		catgroupDelete(params, callback) {
			post(httpli.apili, 'vehiclescrap/catgroup/delete', params).then((res) => {
				callback(res);
			});
		},
		//修改
		catgroupUpdate(params, callback) {
			post(httpli.apili, 'vehiclescrap/catgroup/update', params).then((res) => {
				callback(res);
			});
		},
		// 属性管理
		//添加
		catattrA(params, callback) {
			post(httpli.apili, 'vehiclescrap/catattribute/save', params).then((res) => {
				callback(res);
			});
		},
		//获取
		catattrG(params, callback) {
			post(httpli.apili, 'vehiclescrap/catattribute/list', params).then((res) => {
				callback(res);
			});
		},
		//删除
		catattrD(params, callback) {
			post(httpli.apili, 'vehiclescrap/catattribute/delete', params).then((res) => {
				callback(res);
			});
		},
		//修改
		catattrU(params, callback) {
			post(httpli.apili, 'vehiclescrap/catattribute/update', params).then((res) => {
				callback(res);
			});
		}
	},
	check:{
		//查验单
		//获取
		checklistG(params, callback) {
			get(httpli.apili, 'vehiclescrap/catattributegrouping/checklist/'+params).then((res) => {
				callback(res);
			});
		},
		//提交
		checklistA(id,params, callback) {
			post(httpli.apili, 'vehiclescrap/catattributegrouping/testing/'+id, params).then((res) => {
				callback(res);
			});
		},
	},
	//仓库管理
	store:{
		// 仓位管理
		//添加
		catwareA(params, callback) {
			post(httpli.apili, 'vehiclescrap/catwarehouse/save', params).then((res) => {
				callback(res);
			});
		},
		//获取
		catwareG(params, callback) {
			post(httpli.apili, 'vehiclescrap/catwarehouse/list', params).then((res) => {
				callback(res);
			});
		},
		// 根据id获取仓库
		checklistGet(params, callback) {
			get(httpli.apili, 'vehiclescrap/catattributegrouping/info/'+params).then((res) => {
				callback(res);
			});
		},
		//修改
		catwareU(params, callback) {
			post(httpli.apili, 'vehiclescrap/catwarehouse/update', params).then((res) => {
				callback(res);
			});
		},
		//删除
		catwareD(params, callback) {
			post(httpli.apili, 'vehiclescrap/catwarehouse/delete', params).then((res) => {
				callback(res);
			});
		},
		// 入库管理
		//添加
		housingA(params, callback) {
			post(httpli.apili, 'vehiclescrap/catwarehousing/save', params).then((res) => {
				callback(res);
			});
		},
		//获取
		housingG(params, callback) {
			post(httpli.apili, 'vehiclescrap/catwarehousing/list', params).then((res) => {
				callback(res);
			});
		},
		// 根据id获取仓库
		housingGet(params, callback) {
			get(httpli.apili, 'vehiclescrap/catwarehousing/info/'+params).then((res) => {
				callback(res);
			});
		},
		//修改
		housingU(params, callback) {
			post(httpli.apili, 'vehiclescrap/catwarehousing/update', params).then((res) => {
				callback(res);
			});
		},
		//删除
		housingD(params, callback) {
			post(httpli.apili, 'vehiclescrap/catwarehousing/delete', params).then((res) => {
				callback(res);
			});
		},
	},
	//拆解管理
	ding:{
		// 车辆拆解管理
		//添加
		dilingA(id, params, callback) {
			post(httpli.apili, 'vehiclescrap/cadismantling/save/' + id, params).then((res) => {
				callback(res);
			});
		},
		//获取库存
		dilingG(params, callback) {
			post(httpli.apili, 'vehiclescrap/cadismantling/list', params).then((res) => {
				callback(res);
			});
		},
		//修改
		dilingU(params, callback) {
			post(httpli.apili, 'vehiclescrap/cadismantling/update', params).then((res) => {
				callback(res);
			});
		},
		//删除
		dilingD(params, callback) {
			post(httpli.apili, 'vehiclescrap/cadismantling/delete', params).then((res) => {
				callback(res);
			});
		},
	},
	//设备管理
	device:{
		// 设备管理
		//添加
		deviceA(params, callback) {
			post(httpli.apili, 'vehiclescrap/catequipment/save', params).then((res) => {
				callback(res);
			});
		},
		//获取
		deviceG(params, callback) {
			post(httpli.apili, 'vehiclescrap/catequipment/list', params).then((res) => {
				callback(res);
			});
		},
		//修改
		deviceU(params, callback) {
			post(httpli.apili, 'vehiclescrap/catequipment/update', params).then((res) => {
				callback(res);
			});
		},
		//删除
		deviceD(params, callback) {
			post(httpli.apili, 'vehiclescrap/catequipment/delete', params).then((res) => {
				callback(res);
			});
		},
		// 设备申请
		//添加
		catmakeA(params, callback) {
			post(httpli.apili, 'vehiclescrap/catmake/access', params).then((res) => {
				callback(res);
			});
		},
		//获取
		catmakeG(params, callback) {
			post(httpli.apili, 'vehiclescrap/catmake/list', params).then((res) => {
				callback(res);
			});
		},
		//修改
		catmakeU(params, callback) {
			post(httpli.apili, 'vehiclescrap/catmake/update', params).then((res) => {
				callback(res);
			});
		},
		//删除
		catmakeD(params, callback) {
			post(httpli.apili, 'vehiclescrap/catmake/delete', params).then((res) => {
				callback(res);
			});
		},
		//退还
		catmakeS(params, callback) {
			post(httpli.apili, 'vehiclescrap/catmake/still', params).then((res) => {
				callback(res);
			});
		},
	},
	order:{
		// 订单管理
		//添加
		orderA(params, callback) {
			post(httpli.apili, 'vehiclescrap/catplace/save', params).then((res) => {
				callback(res);
			});
		},
		//获取
		orderG(params, callback) {
			post(httpli.apili, 'vehiclescrap/catplace/list', params).then((res) => {
				callback(res);
			});
		},
		//根据订单号获取详细信息
		orderGet(params, callback) {
			post(httpli.apili, 'vehiclescrap/catplace/oddNumbers', params).then((res) => {
				callback(res);
			});
		},
		//修改
		orderU(params, callback) {
			post(httpli.apili, 'vehiclescrap/catplace/update', params).then((res) => {
				callback(res);
			});
		},
		//删除
		orderD(params, callback) {
			post(httpli.apili, 'vehiclescrap/catplace/delete', params).then((res) => {
				callback(res);
			});
		},
	},
	dicti:{
		//字典管理
		//添加
		catdiA(params, callback) {
			post(httpli.apili, 'vehiclescrap/catdictionaries/save', params).then((res) => {
				callback(res);
			});
		},
		//获取
		catdiG(params, callback) {
			post(httpli.apili, 'vehiclescrap/catdictionaries/list', params).then((res) => {
				callback(res);
			});
		},
		//修改
		catdiU(params, callback) {
			post(httpli.apili, 'vehiclescrap/catdictionaries/update', params).then((res) => {
				callback(res);
			});
		},
		//删除
		catdiD(params, callback) {
			post(httpli.apili, 'vehiclescrap/catdictionaries/delete', params).then((res) => {
				callback(res);
			});
		},
	},
	dment:{
		//部门管理
		//添加
		dmentA(params, callback) {
			post(httpli.apili, 'vehiclescrap/catdepartment/save', params).then((res) => {
				callback(res);
			});
		},
		//获取
		dmentG(params, callback) {
			post(httpli.apili, 'vehiclescrap/catdepartment/list', params).then((res) => {
				callback(res);
			});
		},
		//修改
		dmentU(params, callback) {
			post(httpli.apili, 'vehiclescrap/catdepartment/update', params).then((res) => {
				callback(res);
			});
		},
		//删除
		dmentD(params, callback) {
			post(httpli.apili, 'vehiclescrap/catdepartment/delete', params).then((res) => {
				callback(res);
			});
		},
	},
	staUser:{
		//部门用户管理
		//添加
		userA(params, callback) {
			post(httpli.apili, 'vehiclescrap/catuser/save', params).then((res) => {
				callback(res);
			});
		},
		//获取
		userG(params, callback) {
			post(httpli.apili, 'vehiclescrap/catuser/list', params).then((res) => {
				callback(res);
			});
		},
		//修改
		userU(params, callback) {
			post(httpli.apili, 'vehiclescrap/catuser/update', params).then((res) => {
				callback(res);
			});
		},
		//删除
		userD(params, callback) {
			post(httpli.apili, 'vehiclescrap/catuser/delete', params).then((res) => {
				callback(res);
			});
		},
	},
	yDevice:{
		//获取设备拍摄照片
		deviceG( callback) {
			get(httpli.apilT, 'healthy').then((res) => {
				callback(res);
			});
		},
	},
	// 对象服务器接口
	yunoss: {
		// 删除图片
		delImg(params, callback) {
			postForm(httpli.apili, 'oss/deleteFile', params).then((res) => {
				callback(res);
			});
		},
		// 上传图片
		uploadImg(params, callback) {
			postForm(httpli.apili, 'oss/uploadfile', params).then((res) => {
				callback(res);
			});
		},
		// 上传图片新地址
		upImg(params, callback) {
			postJson(httpli.apilT, 'upload', params).then((res) => {
				callback(res);
			});
		},
	},
	// 主页管理相关接口

};
export default api;
