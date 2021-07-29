<template>
	<el-upload class="upload-demo" ref="upload" :action="action" :on-success="IMGsuccess" :on-error="IMGerror" :multiple="multiple"
	 :on-change="handleChange" :headers="headers" show-file-list :file-list="fileList" list-type="picture" :limit="limit"
	 :auto-upload="autoUpload" :accept="accept" :before-upload="beforeAvatarUpload">
		<el-button slot="trigger" size="small" type="primary">选择图片</el-button>
		<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传图片到服务器</el-button>
		<div slot="tip" class="el-upload__tip flex_columns flex_wrap">只能上传{{accept}}文件，且不超过{{limit}}张图片，上传文件大小不能超过{{fileSize}}MB!</div>
		<div slot="tip" class="el-upload__tip" v-if="title!=''">{{title}}</div>
	</el-upload>
</template>
<script>
	export default {
		props: {
			action: {
				type: String,
				default: "http://192.168.0.117:8888/oss/uploadfile"
			},
			accept: {
				type: String,
				default: "image/jpeg,image/jpg,image/png"
			},
			headers:{
				type: Object,
				default () {
					return {login: '123'};
				},
			},
			title:{
				type: String,
				default: ""
			},
			multiple: {
				type: Boolean,
				default: false
			},
			autoUpload: {
				type: Boolean,
				default: false
			},
			limit: {
				type: Number,
				default: 1
			},
			fileSize: {
				type: Number,
				default: 2
			},
		},
		data() {
			return {
				fileList: [],
				suclist:[],
				length:0
			};
		},
		created() {},
		methods: {
			submitUpload() {
				this.$refs.upload.submit();
			},
			handleChange(file, fileList) {
				// console.log("文件被改变");
				// console.log(file);
				// console.log(fileList);
			},
			IMGsuccess(response, file, fileList) {
				console.log(response);
				// console.log(file);
				// console.log(fileList);
				this.suclist.push(response);
				// console.log(this.suclist);
				let i = this.suclist.length;
				// console.log(i);
				// console.log(fileList.length);
				// console.log(this.fileList.length);
				if(fileList.length == i){
					console.log('=====================');
					this.fileList = fileList;
					console.log(this.fileList);
					this.QueDing();
				}
			},
			IMGerror(err, file, fileList) {
				// console.log(response);
				this.$message.error('上传失败！')
				console.log(err);
				console.log(fileList);
			},
			QueDing(){
				this.$emit('upSuccess', this.fileList,this.key);
				this.$refs.upload.clearFiles();
				this.fileList = [];
				this.suclist = [];
			},
			beforeAvatarUpload(file) {
				
				// console.log(file);
				// const isImg = file.type === 'image/jpeg' || file.type === 'image/png';
				const isLt2M = file.size / 1024 / 1024 < this.fileSize;
				// if (!isImg) {
				// 	this.$message.error('上传图片只能是 JPG 格式!');
				// }
				if (!isLt2M) {
					this.$message.error('上传文件大小不能超过 ' + this.fileSize + 'MB!');
				}
				// return isImg && isLt2M;
				return isLt2M;
			}
		}
	};
</script>
<style>
</style>
