(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-33502936"],{"01c5":function(t,e,a){},"1f34":function(t,e,a){"use strict";a.r(e);var l=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"app-container"},[a("div",{staticClass:"filter-container"},[a("el-input",{staticClass:"filter-item",staticStyle:{width:"200px"},attrs:{placeholder:"用户名"},model:{value:t.listQuery.title,callback:function(e){t.$set(t.listQuery,"title",e)},expression:"listQuery.title"}}),a("el-button",{staticClass:"filter-item",attrs:{type:"primary",icon:"el-icon-search"}},[t._v(" 搜索 ")]),a("el-button",{directives:[{name:"permission",rawName:"v-permission",value:["admin"],expression:"['admin']"}],staticClass:"filter-item",staticStyle:{"margin-left":"10px"},attrs:{type:"primary",icon:"el-icon-plus"}},[t._v(" 新增 ")])],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.listLoading,expression:"listLoading"}],key:t.tableKey,staticStyle:{width:"100%"},attrs:{data:t.list,border:"",fit:"","highlight-current-row":""}},[a("el-table-column",{attrs:{label:"序号",type:"index",align:"center",width:"50"}}),a("el-table-column",{attrs:{label:"用户头像",width:"180",align:"center"},scopedSlots:t._u([{key:"default",fn:function(t){var e=t.row;return[a("img",{staticStyle:{width:"60px",height:"60px","border-radius":"50%"},attrs:{src:e.imgurl}})]}}])}),a("el-table-column",{attrs:{label:"用户名",width:"180",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){var l=e.row;return[a("span",[t._v(t._s(l.username))])]}}])}),a("el-table-column",{attrs:{label:"角色",width:"180",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){var l=e.row;return[a("span",[t._v(t._s(l.role))])]}}])}),a("el-table-column",{attrs:{label:"邮箱",width:"200",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){var l=e.row;return[a("span",[t._v(t._s(l.email))])]}}])}),a("el-table-column",{attrs:{label:"用户简介",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){var l=e.row;return[a("span",[t._v(t._s(l.content))])]}}])}),a("el-table-column",{attrs:{label:"修改时间",width:"180",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){var l=e.row;return[a("span",[t._v(t._s(l.time))])]}}])}),a("el-table-column",{attrs:{label:"操作",align:"center",width:"380","class-name":"small-padding fixed-width"},scopedSlots:t._u([{key:"default",fn:function(e){e.row,e.$index;return[a("el-button",{attrs:{icon:"el-icon-edit-outline",type:"primary",size:"small "}},[t._v(" 编辑用户 ")]),a("el-button",{attrs:{icon:"el-icon-delete",size:"small ",type:"danger"}},[t._v(" 删除 ")]),a("el-button",{attrs:{icon:"el-icon-setting",size:"small"}},[t._v(" 角色设置 ")])]}}])})],1),a("el-pagination",{staticClass:"pagination",attrs:{"current-page":t.listQuery.page,"page-sizes":[2,5,10,20],"page-size":t.listQuery.limit,layout:"total, sizes, prev, pager, next, jumper",total:t.total},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1)},n=[],i=a("c24f"),s={name:"ComplexTable",filters:{},data:function(){return{tableKey:0,list:null,total:0,listLoading:!0,listQuery:{page:1,limit:2}}},created:function(){this.getList()},methods:{getList:function(){var t=this;this.listLoading=!0,Object(i["e"])(this.listQuery).then((function(e){t.list=e.data.data,t.total=e.data.cont,t.listLoading=!1}))},handleFilter:function(){this.listQuery.page=1,this.getList()},handleSizeChange:function(t){console.log(t)},handleCurrentChange:function(t){console.log(t)}}},r=s,o=(a("2a78"),a("2877")),c=Object(o["a"])(r,l,n,!1,null,"9fd2fd52",null);e["default"]=c.exports},"2a78":function(t,e,a){"use strict";var l=a("01c5"),n=a.n(l);n.a}}]);