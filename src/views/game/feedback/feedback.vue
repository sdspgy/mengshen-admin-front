<template>
  <div class='basic'>
    <Row>
      <Col :span='24'>
        <Card>
          <div>
            反馈信息(tip:查询自动忽略时分秒，删除没有忽略)
          </div>

          <div style="margin-top: 15px">

            <Row :gutter="24">
              <Col :span="8">
                <DatePicker v-model="queryBytime.selectTime"
                            type="datetimerange"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="请选择时间日期"
                            style="width: 350px">
                </DatePicker>
                <Button type="primary" @click="getFeedback()">查询</Button>
              </Col>

              <Col :span="8">
                <DatePicker v-model="delBytime.delTime"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="请选择时间日期"
                            style="width: 200px">
                </DatePicker>
                <Button type="primary" @click="delFeedbackBytime()">删除该时间之前</Button>
              </Col>
              <Button type="primary" @click="getFeedbackEx()">导出excel表</Button>
            </Row>
          </div>
        </Card>
      </Col>
    </Row>
    <Row>
      <Table :columns="columns" :data="feedbacks" ref="table"></Table>
    </Row>
    <Row type="flex" justify="end" class="page">
      <Page
              :current="currentpage"
              :total="total"
              :page-size="pagesize"
              @on-change="handleCurrentChange"
              @on-page-size-change="handleSizeChange"
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
    import {delFeedbackBytime,getFeedback,getFeedbackEx,delFeedbackById} from "@/api/index";
    import util from "../../../libs/util";
    export default {
        name: "feedback",
        data() {
            return {
                columns: [
                    {type: "index", width: 60, align: "center"},
                    {title: "openID", key: "name", width: 80,align: "center"},
                    {title: "用户ID", key: "userId", width: 80,align: "center"},
                    {title: "反馈时间", key: "subTime", width: 110, align: "center",render: (h, params) => {return h("div", util.Time2DefaultFormat(params.row.subTime))}},
                    {title: "内容", key: "contentStr", width: 200,align: "center"},
                    {title: "操作", key: "action", width: 100, align: "center",
                        render: (h, params) => {
                            return h("div", [
                                h("Button", {props: {type: "error", size: "small"}, on: {click: () => {this.delFeedback(params.row.zid);}}}, "删除")]);
                        }
                    }],
                feedbacks: [],
                loading: true,
                pagesize: 10,
                currentpage: 1,
                total: 0,
                form: {
                    zid: ''
                },
                dialogFormVisible: false,
                formLabelWidth: '120px',
                delBytime: {
                    delTime: new Date()
                },
                queryBytime: {
                    selectTime: [new Date(), new Date()]
                }
            }
        },
        methods: {
            delFeedback(zid) {
                delFeedbackById({zid:zid}).then(res=>{
                    if (res.status === 200) {
                        this.currentpage = 1;
                        this.feedbacks = res.data.feedbacks;
                        this.total = res.data.total;
                    }
                });
            },
            getFeedbackEx() {
                getFeedbackEx().then(res =>{
                    let url = window.URL.createObjectURL(new Blob([res.data]))
                    let link = document.createElement('a')
                    link.style.display = 'none'
                    link.href = url
                    link.setAttribute('download', '反馈.xlsx');
                    document.body.appendChild(link)
                    link.click()
                });
            },

            getFeedback() {
                let timeStamp = [];
                this.queryBytime.selectTime.forEach(o=>{
                    timeStamp.push(o.getTime());
                })
                getFeedback({per_page:this.pagesize,cur_page:this.currentpage,selectTime:timeStamp}).then(res=>{
                    if (res.status === 200) {
                        this.feedbacks = res.data.feedbacks;
                        this.total = res.data.total;
                    }
                });
            },
            handleSizeChange(value) {
                this.pagesize = value;
                this.getFeedback();
            },
            handleCurrentChange(value) {
                this.currentpage = value;
                this.getFeedback();
            },
            delFeedbackBytime() {
                delFeedbackBytime({time:util.Time2DefaultFormat(this.delBytime.delTime)}).then(res=>{
                    if (res.status === 200) {
                        this.$Message.info("删除成功");
                        this.currentpage = 1;
                        this.getFeedback();
                    }
                });
            }
        },
    }
</script>

<style scoped>

</style>
