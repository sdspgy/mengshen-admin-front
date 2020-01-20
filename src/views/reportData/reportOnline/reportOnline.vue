<template>
    <div>
        <!--时间-->
        <div>
            <RadioGroup v-model="data" type="button" size="large" @on-change="init()">
                <Radio label="1">昨天</Radio>
                <Radio label="7">7日</Radio>
                <Radio label="30">30日</Radio>
            </RadioGroup>
        </div>
        <Row>
            <Table height="300" highlight-row @on-row-click="clickOnlineTable" border :columns="columns" :data="tableV"
                   ref="table"></Table>
        </Row>
        <div id="onlineG2"></div>
    </div>
</template>

<script>
    import {queryOnline} from '@/api/index';
    import {weekChange} from '@/libs/changeWeek';

    export default {
        name: "reportOnline",
        data() {
            return {
                defaultData: {
                    yestoday: 1,
                    week: 7,
                    month: 30
                },
                data: "7",
                columns: [
                    {
                        title: '日期（星期）',
                        key: 'ds',
                        width: 150,
                        fixed: 'left'
                    },
                    {
                        title: '持续时长',
                        key: 'duration',
                        width: 150,
                        fixed: 'left'
                    },
                    {
                        title: '人数',
                        key: 'durationNumbers',
                        width: 150,
                        fixed: 'left'
                    },
                    {
                        title: '留存用户数',
                        key: 'durationRetentionNumbers',
                        width: 150,
                        fixed: 'left'
                    },
                ],
                tableV: [],
                charts: [],
                pyaGroupChart: {},
            }
        },
        methods: {
            init() {
                this.queryOnline();

            },
            queryOnline() {
                let params = {
                    gameid: parseInt(this.getStore('gameid')),
                    date: parseInt(this.data)
                }
                queryOnline(params).then(e => {
                    if (e.success) {
                        let onlines = e.onlineDurationDistributions;
                        onlines.sort(this.compare);
                        let firstData = [];
                        onlines.forEach(item => {
                            item.ds = weekChange(item.ds);
                            //取出最近一天的
                            if (item.ds == onlines[0].ds) {
                                firstData.push(item);
                            }
                        })
                        //处理分组柱状图数据
                        let charts = [];
                        firstData.forEach(item => {
                            let peoplesObj = new Object();
                            peoplesObj.name = '人数';
                            peoplesObj.duration = item.duration;
                            peoplesObj.value = item.durationNumbers;
                            let dauNumObj = new Object();
                            dauNumObj.name = '留存用户数';
                            dauNumObj.duration = item.duration;
                            dauNumObj.value = item.durationRetentionNumbers;
                            charts.push(peoplesObj);
                            charts.push(dauNumObj);
                        })
                        this.charts = charts;
                        this.tableV = onlines;
                        this.pyaGroupChart.changeData(this.charts);
                    }
                })
            },
            clickOnlineTable(data) {
                let firstData = [];
                this.tableV.forEach(item => {
                    if (item.ds == data.ds) {
                        firstData.push(item);
                    }
                })
                let charts = [];
                firstData.forEach(item => {
                    let peoplesObj = new Object();
                    peoplesObj.name = '人数';
                    peoplesObj.duration = item.duration;
                    peoplesObj.value = item.durationNumbers;
                    let dauNumObj = new Object();
                    dauNumObj.name = '留存用户数';
                    dauNumObj.duration = item.duration;
                    dauNumObj.value = item.durationRetentionNumbers;
                    charts.push(peoplesObj);
                    charts.push(dauNumObj);
                })
                this.charts = charts;
                this.pyaGroupChart.changeData(this.charts);
            },
            G2Online() {
                // 分组柱状图
                this.pyaGroupChart = new G2.Chart({
                    container: 'onlineG2',
                    forceFit: true,
                    height: 500
                });
                this.pyaGroupChart.source(this.charts);
                this.pyaGroupChart.interval().position('duration*value').color('name')
                    .adjust([{
                        type: 'dodge',
                        marginRatio: 1 / 32
                    }]);
                this.pyaGroupChart.render();
            },
            compare: function (obj1, obj2) {
                var val1 = obj1.ds;
                var val2 = obj2.ds;
                if (val1 < val2) {
                    return 1;
                } else if (val1 > val2) {
                    return -1;
                } else {
                    return 0;
                }
            },
        },
        mounted() {
            this.G2Online();
            this.init();
        }
        ,
    }
</script>

<style scoped>

</style>
