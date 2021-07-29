<template>
    <!-- 系统提示 -->
    <div class="confirm-dialog">
        <el-dialog :title="tit" :visible.sync="showMsg" :show-close="false" width="30%" center>
            <div>{{ftit}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="$emit('update:showMsg', false)">取 消</el-button>
                <el-button :type="type" @click="dialogConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'ConfirmDialog',
    props: {
        showMsg: Boolean,
        tit: {
            type: String,
            default: '系统消息',
        },
        ftit: {
            type: String,
            default: '系统消息',
        },
        type: {
            type: String,
            default: 'primary',
        },
    },
    components: {},
    data() {
        return {
            // 是否同步展示
            // visible: false,
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    destroyed() {},
    methods: {
        /**
			 *@description: 确定执行的方法
			 *@param{}
			 *@return:
			 */
        dialogConfirm() {
            this.$emit('confirm');
            this.$emit('update:showMsg', false);
        },
    },
};
</script>
<style lang='scss' scoped>
    //@import url(); 引入公共css类
</style>
