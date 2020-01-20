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
            <Table height="300" highlight-row border :columns="columns" :data="tableV"
                   ref="table"></Table>
        </Row>
        <!--        类型-->
        <Form ref="from" class="" :model="value_visitType" :label-width="80">
            <FormItem label="" prop="value">
                <Select v-model="value_visitType.index" style="width:200px"
                        @on-change="changeType()">
                    <Option v-for="item in visitType" :value="item.value"
                            :key="item.value">{{ item.text }}
                    </Option>
                </Select>
            </FormItem>
        </Form>
        <div id="visitChart"></div>
    </div>
</template>

<script>
    import {queryVisit} from '@/api/index';
    import {weekChange} from '@/libs/changeWeek';

    export default {
        name: "reportVisit",
        data() {
            return {
                defaultData: {
                    yestoday: 1,
                    week: 7,
                    month: 30
                },
                data: "7",
                value_visitType: {
                    index: 0
                },
                defaultVisitType: [
                    {
                        name: 'visits',
                        value: 0
                    },
                    {
                        name: 'averageVisits',
                        value: 1,
                    }, {
                        name: 'averageStayTime',
                        value: 2
                    }
                ],
                visitType: [
                    {
                        text: '访问次数',
                        value: 0
                    },
                    {
                        text: '平均访问次数',
                        value: 1
                    },
                    {
                        text: '平均停留时间',
                        value: 2
                    }
                ],
                columns: [
                    {
                        title: '日期（星期）',
                        key: 'ds',
                        width: 150,
                        fixed: 'left'
                    },
                    {
                        title: '访问次数',
                        key: 'visits',
                        width: 150,
                        fixed: 'left'
                    },
                    {
                        title: '平均访问次数',
                        key: 'averageVisits',
                        width: 150,
                        fixed: 'left'
                    },
                    {
                        title: '平均停留时间',
                        key: 'averageStayTime',
                        width: 150,
                        fixed: 'left'
                    },
                ],
                visitG2: {},
                tableV: [],
                charts: [],
            }
        },
        methods: {
            init() {
                this.queryVisit();
            },
            queryVisit() {
                const that = this;
                let params = {
                    gameid: parseInt(that.getStore('gameid')),
                    date: parseInt(that.data)
                }
                queryVisit(params).then(e => {
                    if (e.success) {
                        let visits = e.visitTrendings;
                        visits.forEach(item => {
                            item.ds = weekChange(item.ds);
                            item.averageVisits = Number(item.averageVisits).toFixed(2);
                            item.averageStayTime = Number(item.averageStayTime).toFixed(2);
                        })
                        let typeString = '';
                        for (let key in that.visitType) {
                            if (that.defaultVisitType[key].value == that.value_visitType.index.toString()) {
                                typeString = that.defaultVisitType[key].name;
                                break;
                            }
                        }
                        let charts = [];
                        visits.forEach(item => {
                            let chartObject = new Object();
                            chartObject.ds = item.ds.substr(5, 5);
                            chartObject.value = Number(item[typeString]);
                            charts.push(chartObject);
                        })
                        that.tableV = visits;
                        that.charts = charts;
                        that.visitG2.changeData(that.charts);
                    }
                })
            },
            visitG2F() {
                this.visitG2 = new G2.Chart({
                    container: 'visitChart',
                    forceFit: true,
                    height: 500
                });
                this.visitG2.source(this.charts, {});
                this.visitG2.scale('value', {
                    min: 0,
                    // alias: '',
                });
                this.visitG2.scale('ds', {
                    // range: [0, 1]
                    tickCount: 6,
                });
                this.visitG2.tooltip({
                    crosshairs: {
                        type: 'line'
                    }
                });
                // 坐标轴文本旋转
                this.visitG2.axis('ds', {
                    label: {
                        rotate: -Math.PI / 2.5,
                        textAlign: 'end',
                        textBaseline: 'middle'
                    }
                });
                this.visitG2.line().position('ds*value').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
                this.visitG2.point().position('ds*value')
                    .size(4)
                    .shape('circle')
                    .style({
                        stroke: '#fff',
                        lineWidth: 1
                    })
                    .color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
                this.visitG2.area().position('ds*value').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
                this.visitG2.render();
            },
            changeType() {
                this.init();
            }
        },
        mounted() {
            this.visitG2F();
            this.init();
        }
        ,
    }
</script>

<style scoped>

</style>
