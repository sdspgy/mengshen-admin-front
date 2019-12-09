<template>
<div>
  <Row>
    <Table :columns="columns" :data="activities" ref="table"></Table>
  </Row>
  <Modal title=修改数据 v-model="dialogFormVisible" :mask-closable="false" width="50%">
    <Form :label-width="120">
      <FormItem label="活动id">
        <Input v-model="activityId" autocomplete="off" :disabled="true"/>
      </FormItem>
      <FormItem label="活动xmlid">
        <Input v-model="templateId" autocomplete="off" :disabled="true"/>
      </FormItem>
      <FormItem label="活动起止时间">
            <DatePicker v-model="activityDuration"
                        type="datetimerange"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="请选择时间日期"
                        style="width: 50%;max-width: 350px"
                        :options="disabledDate">
            </DatePicker>
      </FormItem>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="hideDialog()">取 消</Button>
      <Button type="primary" @click="changeAct()">确 定</Button>
    </div>
  </Modal>
</div>
</template>

<script>
    import {showActs, changeAct} from "@/api/index";
    import util from "../../../libs/util";
    import BreadcrumbNav from "../../main-components/breadcrumb-nav";
    export default {
        name: "showActs",
        components: {BreadcrumbNav},
        mounted() {
            this.showActs();
        },
        data() {
            return {
                columns:[
                    {type: "index", width: 60, align: "center"},
                    {title: "activityId", key: "activityId", width: 100,align: "center",render: (h, params) => {return h("div", params.row.activityId);}},
                    {title: "templateId", key: "templateId", width: 100,align: "center",render: (h, params) => {return h("div", params.row.templateId);}},
                    {title: "status", key: "status", width: 200,align: "center"},
                    {title: "openTime", key: "openTime", width: 200,align: "center", render: (h, params) => {return h("div", util.Time2DefaultFormat(params.row.openTime))}},
                    {title: "endTime", key: "endTime", width: 200,align: "center",render: (h, params) => {return h("div", util.Time2DefaultFormat(params.row.endTime))}},
                     {title: "操作", key: "action", width: 200, align: "center",
                        render: (h, params) => {
                            return h("div", [
                                h("Button", {props: {type: "info", size: "small"}, on: {click: () => {this.openEditDialog(params.row);}}}, "编辑"),
                                h("Button", {props: {type: "error", size: "small"}, on: {click: () => {this.deleteNotice(params.row.id);}}}, "删除")]);
                        }
                    }
                    ], 
                
                activityId: '',
                templateId: '',
                activityDuration: [],
                activities:[],
                dialogFormVisible: false,
                 disabledDate: {
                    disabledDate(date) {
                        return date.getTime() < new Date(new Date().toLocaleDateString()).getTime();
                    }
                }
            }
        },
        methods: {
            showActs() {
                showActs().then(res=>{
                    if (res.status === 200) {
                        console.log(res.data.activities)
                        this.activities = res.data.activities;
                    }
                })
            },
            changeAct() {
                changeAct({activityId: this.activityId, openTime: this.activityDuration[0].getTime(), endTime: this.activityDuration[1].getTime()}).then(res=>{
                    if (res.status === 200) {
                        console.log(res.data.activities)
                        this.activities = res.data.activities;
                    }else{
                       this.$Message.error(res.data); 
                    }

                    this.hideDialog();
                })
               
            },
            hideDialog() {
                this.dialogFormVisible = false;
            },
            openEditDialog(scopeRow) {
                this.dialogFormVisible = true;
                this.activityId = scopeRow.activityId;
                this.templateId = scopeRow.templateId;
                this.activityDuration.push(new Date(scopeRow.openTime));
                this.activityDuration.push(new Date(scopeRow.endTime));
            },
        },

    }
</script>

<style scoped>

</style>
