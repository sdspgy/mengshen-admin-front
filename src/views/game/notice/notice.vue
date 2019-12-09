<template>
  <div class="search">
    <Row>
      <Button @click="getNotices">查询</Button>
      <Button @click='openAddDialog'>添加</Button>
    </Row>
    <Row>
      <Table :loading="loading" border :columns="columns" :data="notices" ref="table"></Table>
    </Row>
    <Row>
      <Modal :title=dialogFormTitle v-model="dialogFormVisible" :mask-closable="false" width="50%">
        <Form :model="form" :label-width="120">

          <FormItem label="公告起止时间">
            <DatePicker v-model="form.duration"
                        type="datetimerange"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="请选择时间日期"
                        style="width: 50%;max-width: 350px"
                        :options="disabledDate">
            </DatePicker>
          </FormItem>

          <FormItem label="公告类型">
            <Input v-model="form.typeStr" autocomplete="off" placeholder="请输入公告类型，最大输入6字" :maxlength="formTypeStrMaxlength"/>
          </FormItem>

          <FormItem label="标题" >
            <Input v-model="form.title" autocomplete="off" placeholder="请输入标题，最大输入20字" :maxlength="formTitleMaxlength"/>
          </FormItem>

          <FormItem label="跳转" >
            <Input v-model="form.frontSkipPos" autocomplete="off" placeholder="请输入跳转"/>
          </FormItem>

          <FormItem label="优先级" >
            <Input v-model="form.priority" autocomplete="off" placeholder="请输入优先级"/>
          </FormItem>

          <FormItem label="内容"  style="height: 100px">
            <Input v-model="form.content" autocomplete="off" type="textarea" placeholder="请输入公告内容"
                      :autosize="{ minRows: 2, maxRows: 5}"/>
          </FormItem>

          <FormItem label="标题图片" >
            <Input v-model="form.titleImg" autocomplete="off" placeholder="请输入标题图片链接"/>
          </FormItem>

          <FormItem label="广告图片" >
            <Input v-model="form.adImg" autocomplete="off" placeholder="请输入广告图片链接"/>
          </FormItem>

          <FormItem label="跳转后界面图片" >
            <Input v-model="form.skipImg" autocomplete="off" placeholder="请输入跳转图片链接"/>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="hideAddDialog()">取 消</Button>
          <Button type="primary" @click="addNotice()" v-show="!isEdit">确定添加</Button>
          <Button type="primary" @click="editNotice()" v-show="isEdit">确定修改</Button>
        </div>
      </Modal>
    </Row>
    <Row type="flex" justify="end" class="page">
      <Page
              :current="page.cur_page"
              :total="page.total"
              :page-size="page.per_page"
              @on-change="changePage"
              @on-page-size-change="changePageSize"
              :page-size-opts="[10,20,50]"
              size="small"
              show-total
              show-elevator
              show-sizer
      ></Page>
    </Row>
  </div>

</template>

<script>
    import {
        getNoticeListData,
        addNotice,
        deleteNotice,
        editNotice
    } from "@/api/index";
    import util from "../../../libs/util";

    export default {
        name: "notice",
        data() {
            return {
                loading: false,
                page: {
                    per_page: 10,
                    cur_page: 1,
                    total: 0
                },
                formTypeStrMaxlength:6,
                formTitleMaxlength: 20,
                notices: [],
                columns: [
                    {type: "index", width: 60, align: "center"},
                    {title: "公告ID", key: "id", width: 80},
                    {title: "发布时间", key: "publishTime", width: 110, align: "center",render: (h, params) => {return h("div", util.Time2DefaultFormat(params.row.publishTime))}},
                    {title: "开始时间", key: "startTime", width: 110, align: "center",render: (h, params) => {return h("div", util.Time2DefaultFormat(params.row.startTime))}},
                    {title: "结束时间", key: "endTime", width: 110, align: "center",render: (h, params) => {return h("div", util.Time2DefaultFormat(params.row.endTime))}},
                    {title: "跳转", key: "frontSkipPos", width: 80, align: "center",},
                    {title: "跳转图片", key: "skipImg", width: 110, align: "center",},
                    {title: "标题", key: "title", width: 80, align: "center",},
                    {title: "公告类型", key: "typeStr", width: 100, align: "center",},
                    {title: "优先级", key: "priority", width: 100, align: "center",},
                    {title: "内容", key: "content", width: 200, align: "center",},
                    {title: "操作", key: "action", width: 200, align: "center",
                        render: (h, params) => {
                            return h("div", [
                                h("Button", {props: {type: "info", size: "small"}, on: {click: () => {this.openEditDialog(params.row);}}}, "编辑"),
                                h("Button", {props: {type: "error", size: "small"}, on: {click: () => {this.deleteNotice(params.row.id);}}}, "删除")]);
                        }
                    }],
                dialogFormVisible: false,
                dialogFormTitle: '',
                isEdit: false,
                form: {
                    id: -1,
                    title: '',
                    typeStr: '',
                    priority: '',
                    titleImg: '',
                    adImg: '',
                    duration: [],
                    content: '',
                    frontSkipPos: '',
                    skipImg: ''
                },
                disabledDate: {
                    disabledDate(date) {
                        return date.getTime() < new Date(new Date().toLocaleDateString()).getTime();
                    }
                }
            }
        },
        methods: {
            init() {
                this.getNotices();
            },
            getNotices() {
                getNoticeListData(this.page).then(res => {
                    this.notices = res.data.notices;
                    this.page.total = res.data.total;
                });
            },
            openAddDialog() {
                this.clearFrom();
                this.dialogFormTitle = '添加游戏公告';
                this.isEdit = false;
                this.dialogFormVisible = true;
            },
            hideAddDialog() {
                this.clearFrom();
                this.dialogFormVisible = false;
                this.getNotices();
            },
            openEditDialog(scopeRow) {
                this.clearFrom();
                this.dialogFormTitle = '修改游戏公告';
                this.isEdit = true;
                this.form.id = scopeRow.id;
                this.dialogFormVisible = true;
                this.form.title = scopeRow.title;
                this.form.typeStr = scopeRow.typeStr;
                this.form.priority = scopeRow.priority;
                this.form.titleImg = scopeRow.titleImg;
                this.form.adImg = scopeRow.adImg;
                this.form.duration.push(new Date(scopeRow.startTime));
                this.form.duration.push(new Date(scopeRow.endTime));
                this.form.content = scopeRow.content;
                this.form.frontSkipPos = scopeRow.frontSkipPos;
                this.form.skipImg = scopeRow.skipImg;
            },
            clearFrom() {
                this.form.id = -1;
                this.form.title = '';
                this.form.typeStr = '';
                this.form.priority = '';
                this.form.titleImg = '';
                this.form.adImg = '';
                this.form.duration = [];
                this.form.content = '';
                this.form.frontSkipPos = '';
                this.form.skipImg = '';
            },
            checkFrom() {
                if (this.form.duration.length !== 2) {
                    this.$Message.error('请选择时间');
                    return false;
                }
                if (!this.form.title || !this.form.typeStr || !this.form.priority || !this.form.content || !this.form.frontSkipPos) {
                    this.$Message.error('参数异常');
                    return false;
                }
                if (this.form.title.length > 20 || this.form.typeStr.length > 6) {
                    this.$Message.error('长度过长');
                    return false;
                }
                this.form.duration.forEach((item, index) => {
                    this.form.duration[index] = item.getTime();
                });
                return true;
            },
            addNotice() {
                if (!this.checkFrom()) {
                    return;
                }
                addNotice(this.form).then(res=>{
                    this.hideAddDialog();
                    if (res.status === 200){
                        this.$Message.success('添加成功');
                    }
                });
            },
            editNotice() {
                editNotice(this.form).then(res=>{
                    this.hideAddDialog();
                    if (res.status === 200){
                        this.$Message.success('修改成功');
                    }
                });
            },
            deleteNotice(id) {
                deleteNotice({id:id}).then(res=>{
                    if (res.status === 200){
                        this.$Message.success('删除成功');
                    }
                    this.getNotices();
                });
            },
            changePage(v) {
                this.page.cur_page = v;
                this.getNotices();
            },
            changePageSize(v) {
                this.page.per_page = v;
                this.getNotices();
            }
        },
        mounted() {
            this.init();
        }

    }
</script>

<style scoped>

</style>
