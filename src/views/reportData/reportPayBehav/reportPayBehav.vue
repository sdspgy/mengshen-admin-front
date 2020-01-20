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
        <div id="payChartGroup"></div>
        <div id="payChart"></div>
        <Row>
            <Table height="300" highlight-row border :columns="columnsPay" :data="payBehavs"
                   ref="table"></Table>
        </Row>
        <Row>
            <Table height="300" highlight-row border :columns="columnsPayPeople" :data="payBehavs"
                   ref="table"></Table>
        </Row>
    </div>
</template>

<script>
    import {queryPaymentBehavior} from '@/api/index';
    import {weekChange} from '@/libs/changeWeek';

    export default {
        name: "reportPayBehav",
        data() {
            return {
                defaultData: {
                    yestoday: 1,
                    week: 7,
                    month: 30
                },
                data: "7",
                payBehavs: [],
                payBehavesChart: [],
                charts: [],
                columnsPay: [
                    {
                        title: '日期（星期）',
                        key: 'ds',
                        width: 150,
                        fixed: 'left'
                    },
                    {
                        title: '[0,10}',
                        key: 'one',
                        width: 150
                    },
                    {
                        title: '(10,50]',
                        key: 'two',
                        width: 150
                    },
                    {
                        title: '(50,100]',
                        key: 'three',
                        width: 150
                    },
                    {
                        title: '(100,200]',
                        key: 'foure',
                        width: 150
                    },
                    {
                        title: '(200,500]',
                        key: 'five',
                        width: 150
                    },
                    {
                        title: '(500,1000]',
                        key: 'six',
                        width: 150
                    },
                    {
                        title: '1000以上',
                        key: 'seven',
                        width: 150
                    }
                ],
                columnsPayPeople: [
                    {
                        title: '日期（星期）',
                        key: 'ds',
                        width: 150,
                        fixed: 'left'
                    },
                    {
                        title: '[0,10}',
                        key: 'onePeople',
                        width: 150
                    },
                    {
                        title: '(10,50]',
                        key: 'twoPeople',
                        width: 150
                    },
                    {
                        title: '(50,100]',
                        key: 'threePeople',
                        width: 150
                    },
                    {
                        title: '(100,200]',
                        key: 'fourePeople',
                        width: 150
                    },
                    {
                        title: '(200,500]',
                        key: 'fivePeople',
                        width: 150
                    },
                    {
                        title: '(500,1000]',
                        key: 'sixPeople',
                        width: 150
                    },
                    {
                        title: '1000以上',
                        key: 'sevenPeople',
                        width: 150
                    }
                ],
                pyaGroupChart: {},
                surveyOneLine: {},
            }
        },
        methods: {
            init() {
                this.queryPay();
            },
            queryPay() {
                let params = {
                    gameid: parseInt(this.getStore('gameid')),
                    date: parseInt(this.data)
                };
                queryPaymentBehavior(params).then(e => {
                    if (e.success) {
                        let shareDailyResultTypes = e.shareDailyResultTypes;
                        let payBehav = e.payBehavMap;

                        let payBehavs = [];
                        let numberMap = new Map();
                        for (let key in payBehav) {
                            //每天总付费次数
                            let i = 0;
                            for (let keys in payBehav[key]) {
                                i += payBehav[key][keys].length;
                            }
                            numberMap.set(key, i);

                            let payBehavObject = new Object();
                            payBehavObject.ds = weekChange(key);

                            let sunMoneyOne = 0,
                                sunMoneyTwo = 0,
                                sunMoneyThree = 0,
                                sunMoneyFoure = 0,
                                sunMoneyFive = 0,
                                sunMoneySix = 0,
                                sunMoneySeven = 0;
                            let peopleSetOne = new Set(),
                                peopleSetTwo = new Set(),
                                peopleSetThree = new Set(),
                                peopleSetFoure = new Set(),
                                peopleSetFive = new Set(),
                                peopleSetSix = new Set(),
                                peopleSetSeven = new Set();

                            payBehav[key].collectOne.forEach(item => {
                                sunMoneyOne += item.amount;
                                peopleSetOne.add(item.userid);
                            })
                            let sumPeopleOne = peopleSetOne.size;
                            payBehavObject.one = sunMoneyOne / this.getStore("currencyRate");
                            payBehavObject.onePeople = sumPeopleOne;

                            payBehav[key].collectTwo.forEach(item => {
                                sunMoneyTwo += item.amount;
                                peopleSetTwo.add(item.userid);
                            })
                            let sumPeopleTwo = peopleSetTwo.size;
                            payBehavObject.two = sunMoneyTwo / this.getStore("currencyRate");
                            payBehavObject.twoPeople = sumPeopleTwo;

                            payBehav[key].collectThree.forEach(item => {
                                sunMoneyThree += item.amount;
                                peopleSetThree.add(item.userid);
                            })
                            let sumPeopleThree = peopleSetThree.size;
                            payBehavObject.three = sunMoneyThree / this.getStore("currencyRate");
                            payBehavObject.threePeople = sumPeopleThree;

                            payBehav[key].collectFoure.forEach(item => {
                                sunMoneyFoure += item.amount;
                                peopleSetFoure.add(item.userid);
                            })
                            let sumPeopleFoure = peopleSetFoure.size;
                            payBehavObject.foure = sunMoneyFoure / this.getStore("currencyRate");
                            payBehavObject.fourePeople = sumPeopleFoure;

                            payBehav[key].collectFive.forEach(item => {
                                sunMoneyFive += item.amount;
                                peopleSetFive.add(item.userid);
                            })
                            let sumPeopleFive = peopleSetFive.size;
                            payBehavObject.five = sunMoneyFive / this.getStore("currencyRate");
                            payBehavObject.fivePeople = sumPeopleFive;

                            payBehav[key].collectSix.forEach(item => {
                                sunMoneySix += item.amount;
                                peopleSetSix.add(item.userid);
                            })
                            let sumPeopleSix = peopleSetSix.size;
                            payBehavObject.six = sunMoneySix / this.getStore("currencyRate");
                            payBehavObject.sixPeople = sumPeopleSix;

                            payBehav[key].collectSeven.forEach(item => {
                                sunMoneySeven += item.amount;
                                peopleSetSeven.add(item.userid);
                            })
                            let sumPeopleSeven = peopleSetSeven.size;
                            payBehavObject.seven = sunMoneySeven / this.getStore("currencyRate");
                            payBehavObject.sevenPeople = sumPeopleSeven;

                            payBehavs.push(payBehavObject);
                        }

                        //折线图
                        let charts = [];
                        shareDailyResultTypes.sort(this.compareR);
                        shareDailyResultTypes.forEach(item => {
                            let i = item.dauNum == 0 ? 0 : ((numberMap.get(item.ds) || 0) / item.dauNum).toFixed(3);
                            let chartObject = new Object();
                            chartObject.ds = item.ds.substr(5, 5);
                            chartObject.value = i;
                            charts.push(chartObject);
                        })

                        payBehavs.sort(this.compare);

                        //付费行为汇总--分组柱状图
                        let payBehavTotalOne = 0,
                            payBehavTotalOneP = 0,
                            payBehavTotalTwo = 0,
                            payBehavTotalTwoP = 0,
                            payBehavTotalThree = 0,
                            payBehavTotalThreeP = 0,
                            payBehavTotalFoure = 0,
                            payBehavTotalFoureP = 0,
                            payBehavTotalFive = 0,
                            payBehavTotalFiveP = 0,
                            payBehavTotalSix = 0,
                            payBehavTotalSixP = 0,
                            payBehavTotalSeven = 0,
                            payBehavTotalSevenP = 0;

                        payBehavs.forEach(item => {
                            payBehavTotalOne += item.one;
                            payBehavTotalOneP += item.onePeople;
                            payBehavTotalTwo += item.two;
                            payBehavTotalTwoP += item.twoPeople;
                            payBehavTotalThree += item.three;
                            payBehavTotalThreeP += item.threePeople;
                            payBehavTotalFoure += item.foure;
                            payBehavTotalFoureP += item.fourePeople;
                            payBehavTotalFive += item.five;
                            payBehavTotalFiveP += item.fivePeople;
                            payBehavTotalSix += item.six;
                            payBehavTotalSixP += item.sixPeople;
                            payBehavTotalSeven += item.seven;
                            payBehavTotalSevenP += item.sevenPeople;
                        })

                        let payBehavesChart = [];

                        let payBehavTotalOneObjectChart = new Object();
                        payBehavTotalOneObjectChart.name = '付费额';
                        payBehavTotalOneObjectChart.payNum = '[0,10]';
                        payBehavTotalOneObjectChart.value = payBehavTotalOne;
                        payBehavesChart.push(payBehavTotalOneObjectChart);

                        let payBehavTotalOnePObjectChart = new Object();
                        payBehavTotalOnePObjectChart.name = '付费人数';
                        payBehavTotalOnePObjectChart.payNum = '[0,10]';
                        payBehavTotalOnePObjectChart.value = payBehavTotalOneP;
                        payBehavesChart.push(payBehavTotalOnePObjectChart);

                        let payBehavTotalTwoObjectChart = new Object();
                        payBehavTotalTwoObjectChart.name = '付费额';
                        payBehavTotalTwoObjectChart.payNum = '(10,50]';
                        payBehavTotalTwoObjectChart.value = payBehavTotalTwo;
                        payBehavesChart.push(payBehavTotalTwoObjectChart);

                        let payBehavTotalTwoPObjectChart = new Object();
                        payBehavTotalTwoPObjectChart.name = '付费人数';
                        payBehavTotalTwoPObjectChart.payNum = '(10,50]';
                        payBehavTotalTwoPObjectChart.value = payBehavTotalTwoP;
                        payBehavesChart.push(payBehavTotalTwoPObjectChart);

                        let payBehavTotalThreeObjectChart = new Object();
                        payBehavTotalThreeObjectChart.name = '付费额';
                        payBehavTotalThreeObjectChart.payNum = '(50,100]';
                        payBehavTotalThreeObjectChart.value = payBehavTotalThree;
                        payBehavesChart.push(payBehavTotalThreeObjectChart);

                        let payBehavTotalThreePObjectChart = new Object();
                        payBehavTotalThreePObjectChart.name = '付费人数';
                        payBehavTotalThreePObjectChart.payNum = '(50,100]';
                        payBehavTotalThreePObjectChart.value = payBehavTotalThreeP;
                        payBehavesChart.push(payBehavTotalThreePObjectChart);

                        let payBehavTotalFoureObjectChart = new Object();
                        payBehavTotalFoureObjectChart.name = '付费额';
                        payBehavTotalFoureObjectChart.payNum = '(100,200]';
                        payBehavTotalFoureObjectChart.value = payBehavTotalFoure;
                        payBehavesChart.push(payBehavTotalFoureObjectChart);

                        let payBehavTotalFourePObjectChart = new Object();
                        payBehavTotalFourePObjectChart.name = '付费人数';
                        payBehavTotalFourePObjectChart.payNum = '(100,200]';
                        payBehavTotalFourePObjectChart.value = payBehavTotalFoureP;
                        payBehavesChart.push(payBehavTotalFourePObjectChart);

                        let payBehavTotalFiveObjectChart = new Object();
                        payBehavTotalFiveObjectChart.name = '付费额';
                        payBehavTotalFiveObjectChart.payNum = '(200,500]';
                        payBehavTotalFiveObjectChart.value = payBehavTotalFive;
                        payBehavesChart.push(payBehavTotalFiveObjectChart);

                        let payBehavTotalFivePObjectChart = new Object();
                        payBehavTotalFivePObjectChart.name = '付费人数';
                        payBehavTotalFivePObjectChart.payNum = '(200,500]';
                        payBehavTotalFivePObjectChart.value = payBehavTotalFiveP;
                        payBehavesChart.push(payBehavTotalFivePObjectChart);

                        let payBehavTotalSixObjectChart = new Object();
                        payBehavTotalSixObjectChart.name = '付费额';
                        payBehavTotalSixObjectChart.payNum = '(500,1000]';
                        payBehavTotalSixObjectChart.value = payBehavTotalSix;
                        payBehavesChart.push(payBehavTotalSixObjectChart);

                        let payBehavTotalSixPObjectChart = new Object();
                        payBehavTotalSixPObjectChart.name = '付费人数';
                        payBehavTotalSixPObjectChart.payNum = '(500,1000]';
                        payBehavTotalSixPObjectChart.value = payBehavTotalSixP;
                        payBehavesChart.push(payBehavTotalSixPObjectChart);

                        let payBehavTotalSevenObjectChart = new Object();
                        payBehavTotalSevenObjectChart.name = '付费额';
                        payBehavTotalSevenObjectChart.payNum = '1000以上';
                        payBehavTotalSevenObjectChart.value = payBehavTotalSeven;
                        payBehavesChart.push(payBehavTotalSevenObjectChart);

                        let payBehavTotalSevenPObjectChart = new Object();
                        payBehavTotalSevenPObjectChart.name = '付费人数';
                        payBehavTotalSevenPObjectChart.payNum = '1000以上';
                        payBehavTotalSevenPObjectChart.value = payBehavTotalSevenP;
                        payBehavesChart.push(payBehavTotalSevenPObjectChart);

                        this.payBehavs = payBehavs;
                        this.payBehavesChart = payBehavesChart;
                        this.charts = charts;
                        this.surveyOneLine.changeData(this.charts);
                        this.pyaGroupChart.changeData(this.payBehavesChart);
                    }
                })
            },
            reportLineChart() {
                // 分组柱状图
                this.pyaGroupChart = new G2.Chart({
                    container: 'payChartGroup',
                    forceFit: true,
                    height: 500
                });
                this.pyaGroupChart.source(this.payBehavesChart);
                this.pyaGroupChart.interval().position('payNum*value').color('name')
                    .adjust([{
                        type: 'dodge',
                        marginRatio: 1 / 32
                    }]);
                this.pyaGroupChart.render();
                // 折线图
                this.surveyOneLine = new G2.Chart({
                    container: 'payChart',
                    forceFit: true,
                    height: 500
                });
                this.surveyOneLine.source(this.handelRetentionOne, {});
                this.surveyOneLine.scale('value', {
                    min: 0,
                    alias: '人均付费次数',
                });
                this.surveyOneLine.scale('ds', {
                    // range: [0, 1]
                    tickCount: 6,
                });
                this.surveyOneLine.tooltip({
                    crosshairs: {
                        type: 'line'
                    }
                });
                // 坐标轴文本旋转
                this.surveyOneLine.axis('ds', {
                    label: {
                        rotate: -Math.PI / 2.5,
                        textAlign: 'end',
                        textBaseline: 'middle'
                    }
                });
                this.surveyOneLine.line().position('ds*value').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
                this.surveyOneLine.point().position('ds*value')
                    .size(4)
                    .shape('circle')
                    .style({
                        stroke: '#fff',
                        lineWidth: 1
                    })
                    .color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
                this.surveyOneLine.area().position('ds*value').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
                this.surveyOneLine.render();
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
            compareR: function (obj1, obj2) {
                var val1 = obj1.ds;
                var val2 = obj2.ds;
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            },
        },
        mounted() {
            this.reportLineChart();
            this.init();
        },
    }
</script>

<style scoped>

</style>
