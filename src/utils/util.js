import api from '../http/api.js';
import http from '../http/index';

const util = {
	upimg,
	DiGui, //递归上传图片
	DiGuiUpimg, //递归上传图片
	OSSdeleteIMG,
	DiGuiDelete, //递归删除图
	DiGuiDeleimg
}
/**
 * 递归上传图片
 * @param str
 * @param rep
 * @param repl
 * @returns {void | string | never}
 */
function DiGui(list, backImgeUrl, index, length, successBack, errorBack) {
	api.yunoss.upImg({
		file: list[index]
	}, (res) => {
		// console.log(res);
		if (res.code == 0) {
			index++;
			if (index >= length) {
				backImgeUrl.push(res);
				successBack(backImgeUrl);
			} else {
				backImgeUrl.push(res);
				DiGui(list, backImgeUrl, index, length, successBack, errorBack);
			}
		} else {
			console.log(res);
			errorBack();
		}
	});
}

function DiGuiUpimg(imgli, successBack) {
	// showloading('正在上传图片');
	DiGui(imgli, [], 0, imgli.length, data => {
		successBack(data);
	}, () => {
		error('上传失败');
	})
}

/**
 * 单个上传图片
 * @param str
 * @param rep
 * @param repl
 * @returns {void | string | never}
 */
function upimg(imgli, callback) {
	let api =  http.apili;
	uni.uploadFile({
		url: api + "/oss/uploadfile",
		// files: files,
		filePath: imgli,
		name: 'file',
		// formData: param,
		header: {
			'login': '123'
		},
		success: (uploadFileRes) => {
			// console.log(uploadFileRes)
			if (uploadFileRes.statusCode != 200) {
				uni.hideLoading();
				uni.showToast({
					title: "文件上传失败！",
					icon: "none"
				});
				return;
			}
			callback(JSON.parse(uploadFileRes.data));
		},
		fail: function(e) {
			console.log(JSON.stringify(e));
			uni.hideLoading();
			uni.showToast({
				title: "文件上传失败！",
				icon: "none"
			});
		},
	});
}
/**
 * 递归删除服务器图片
 * @param str
 * @param rep
 * @param repl
 * @returns {void | string | never}
 */
function DiGuiDelete(list, backImgeUrl, index, length, successBack, errorBack) {
	api.yunoss.delImg({
		url: list[index].imgAddress.substring(27)
	}, (res) => {
		console.log(res);
		console.log(list[index].imgAddress.substring(27));
		if (res.code == '200') {
			index++;
			if (index >= length) {
				backImgeUrl.push(res);
				successBack(backImgeUrl);
			} else {
				backImgeUrl.push(res);
				DiGuiDelete(list, backImgeUrl, index, length, successBack, errorBack);
			}
		} else {
			errorBack();
		}

	});
}

function DiGuiDeleimg(imgli, successBack) {
	DiGuiDelete(imgli, [], 0, imgli.length, data => {
		successBack(data);
	}, () => {
		error('上传失败');
	})
}

/**
 * 单个删除服务器图片
 * @param str
 * @param rep
 * @param repl
 * @returns {void | string | never}
 */
function OSSdeleteIMG(imglist, callback) {
	if (imglist instanceof Array) {
		for (let i = 0; i < imglist.length; i++) {
			api.yunoss.delImg({
				url: imglist[i].imgAddress.substring(27)
			}, (res) => {
				console.log(res);
			});
		}
		callback({
			status: 0,
			msg: '删除成功'
		})
	} else {
		let url = imglist.substring(27);
		api.yunoss.delImg({
			url: url
		}, (res) => {
			// console.log(res);
			callback(res)
		});
	}


}
export default util