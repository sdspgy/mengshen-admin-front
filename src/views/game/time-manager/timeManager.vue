<template>
  <div>
    主服务器时间：<DatePicker type="datetime" placeholder="选择日期时间" style="width: 200px" :value="timeVal" @on-change="timeVal=$event" format="yyyy-MM-dd HH:mm:ss"></DatePicker>
    <Button type="primary" @click="updateServerTime('')">修改所有服务器时间</Button>
    <Button type="error" @click="updateServerTime('1')">重置所有服务器时间</Button>

    <div v-show="nowTimes.length>0">
      <h2>子服务器当前时间</h2>
      <Row>
        <Table border :columns="nowTimeColumns" :data="nowTimes" ref="table"></Table>
      </Row>
    </div>

    <div v-show="results.length>0">
      <h2>修改服务器时间results</h2>
      <Row>
        <Table border :columns="resultColumns" :data="results" ref="table"></Table>
      </Row>
    </div>


  </div>

</template>

<script>
    import {
        getServerTime,
        updateServerTime
    } from "@/api/index";
    import util from "../../../libs/util";

    export default {
        name: "timeManager",
        data() {
            return {
                timeVal: '',
                nowTimes: [],
                results:[],
                nowTimeColumns: [
                    {type: "index", width: 60, align: "center"},
                    {title: "服务器名称", key: "name", align: "center", width: 150},
                    {title: "服务器地址", key: "address", align: "center", width: 150,},
                    {title: "端口", key: "port", align: "center", width: 100,},
                    {title: "请求url", key: "requestUrl", align: "center", width: 200,},
                    {title: "请求状态", key: "success", align: "center", width: 100,},
                    {title: "时间 or 错误信息", key: "msg", align: "center", width: 300,render: (h, params) => {
                        let msgOrTime = params.row.msg;
                            if (params.row.success) {
                                msgOrTime = util.Time2DefaultFormat(JSON.parse(params.row.msg).data.now);
                            }
                            return h("div", msgOrTime);
                        }},
                ],
                resultColumns: [
                    {type: "index", width: 60, align: "center"},
                    {title: "服务器名称", key: "name", align: "center", width: 150},
                    {title: "服务器地址", key: "address", align: "center", width: 150,},
                    {title: "端口", key: "port", align: "center", width: 100,},
                    {title: "请求url", key: "requestUrl", align: "center", width: 200,},
                    {title: "请求状态", key: "success", align: "center", width: 100,},
                    {title: "返回信息", key: "msg", align: "center", width: 300,},
                ],
            };
        },
        methods: {
            getServerTime() {
                getServerTime().then(res => {
                    this.timeVal = new Date(JSON.parse(res.nowMaster).data.now);
                    this.nowTimes = res.nowChildrenTimes;
                    }
                );
            },
            updateServerTime(reset){
                updateServerTime({newTime:util.formatDate(new Date(this.timeVal),'yyyy-MM-dd HH:mm:ss'),reset:reset}).then(res =>{
                    this.results = [];
                    this.getServerTime();
                    this.$Message.success("操作成功");
                    this.results = res.result;


                });
            }
        },
        mounted() {
            this.getServerTime();
        }
    }
</script>

<style scoped>

</style>
