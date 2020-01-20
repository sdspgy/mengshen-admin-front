<template>
    <div>
        <!--OS-->
        <div>
            <RadioGroup v-model="phone" @on-change="init()">
                <Radio label="0">
                    <Icon type="logo-windows"></Icon>
                    <span>ALL</span>
                </Radio>
                <Radio label="1">
                    <Icon type="logo-android"></Icon>
                    <span>ANDROID</span>
                </Radio>
                <Radio label="2">
                    <Icon type="logo-apple"></Icon>
                    <span>IOS</span>
                </Radio>
            </RadioGroup>
        </div>
        <!--时间-->
        <div>
            <RadioGroup v-model="data" type="button" size="large" @on-change="init()">
                <Radio label="1">昨天</Radio>
                <Radio label="7">7日</Radio>
                <Radio label="30">30日</Radio>
            </RadioGroup>
        </div>
        <!--类型-->
        <Form ref="from" class="" :model="reportLevelForm" :label-width="80">
            <FormItem label="" prop="value">
                <Select v-model="reportLevelForm.index" style="width:200px"
                        @on-change="changeType()">
                    <Option v-for="item in option_levelType" :value="item.value"
                            :key="item.value">{{ item.text }}
                    </Option>
                </Select>
            </FormItem>
        </Form>

        <Row>
            <Table height="300" highlight-row border :columns="columsLevel" :data="dauLevelData"
                   ref="table"></Table>
        </Row>
        <div id="levelChart"/>

        <Row>
            <Table height="300" highlight-row border :columns="columsLevelSum" :data="dauLevelDataSum"
                   ref="table"></Table>
        </Row>
    </div>
</template>

<script>
    import {queryLevel} from '@/api/index';
    import {weekChange} from '@/libs/changeWeek';

    export default {
        name: "reportLevel",
        data() {
            return {
                defaultPhone: {
                    all: 0,
                    android: 1,
                    ios: 2
                },
                defaultData: {
                    yestoday: 1,
                    week: 7,
                    month: 30
                },
                phone: "0",
                data: "7",
                option_levelType: [
                    {
                        text: '活跃等级分布',
                        value: 0
                    },
                    {
                        text: '注册等级分布',
                        value: 1
                    },
                    {
                        text: '付费等级分布',
                        value: 2
                    },
                    {
                        text: '新付费等级分布',
                        value: 3
                    },
                    {
                        text: '新注册付费等级分布',
                        value: 4
                    },
                ],
                levelType: {
                    dau_level: 0,
                    install_level: 1,
                    pay_level: 2,
                    new_pay_level: 3,
                    pay_install_level: 4
                },
                reportLevelForm: {
                    index: 0
                },
                columnsHeadr: [
                    {
                        title: '日期（星期）',
                        key: 'ds',
                        width: 150,
                        fixed: 'left'
                    }
                ],
                columsOs: [
                    {
                        title: '操作系统',
                        key: 'os',
                        width: 150,
                        fixed: 'left'
                    }
                ],
                columsLevel: [],
                columsLevelSum: [],
                dauLevelData: [],
                dauLevelDataSum: [],
                chartArr: [],

                levelG2: {},
            }
        },
        methods: {
            init() {
                this.queryLevel();
            },
            changeType() {
                this.queryLevel();
            },
            queryLevel() {
                let params = {
                    gameid: parseInt(this.getStore('gameid')),
                    date: parseInt(this.data),
                    levelType: parseInt(this.reportLevelForm.index),
                    os: this.phone
                }
                queryLevel(params).then(e => {
                    if (e.success) {
                        const dauLevel = e.levelDau;
                        const dauLevelSum = e.levelDauSum;

                        //最大等级-----------
                        if (dauLevel && dauLevelSum) {
                            let maxLevel = 0;
                            let dauLevelKeys = Object.keys(dauLevel).sort(function (o1, o2) {
                                if (o1 < o2) {
                                    return 1;
                                } else if (o1 > o2) {
                                    return -1;
                                } else {
                                    return 0;
                                }
                            });
                            if (Object.keys(dauLevel).length > 0 && Object.keys(dauLevelSum).length > 0) {
                                let maxDate = dauLevelKeys[0];
                                let maxDauLevel = dauLevel[maxDate];
                                maxLevel = maxDauLevel[maxDauLevel.length - 1].level;
                            }

                            // 处理表头-----------
                            let titleLevel = [];
                            for (let i = 1; i <= maxLevel; i++) {
                                let dauLevelTitle = new Object();
                                dauLevelTitle.title = i + '级';
                                dauLevelTitle.key = i + 'level';
                                dauLevelTitle.width = 150;
                                titleLevel.push(dauLevelTitle);
                            }

                            let dauLevels = [],
                                dauLevelSuns = [];
                            for (let key in dauLevel) {
                                let dauLevelObj = {};
                                dauLevelObj.ds = weekChange(dauLevel[key][0].ds);
                                dauLevelObj.os = weekChange(dauLevel[key][0].os);
                                for (let i = 1; i <= maxLevel; i++) {
                                    dauLevelObj[i + 'level'] = 0;
                                }
                                dauLevel[key].forEach(item => {
                                    if (this.reportLevelForm.index == this.levelType.dau_level) {
                                        dauLevelObj[item.level + 'level'] = item.dauNum == 0 ? 0 : (item.dauLevelNumbers / item.dauNum * 100).toFixed(2);
                                    } else if (this.reportLevelForm.index == this.levelType.install_level) {
                                        dauLevelObj[item.level + 'level'] = item.installNum == 0 ? 0 : (item.installLevelNumbers / item.installNum * 100).toFixed(2);
                                    } else if (this.reportLevelForm.index == this.levelType.pay_level) {
                                        dauLevelObj[item.level + 'level'] = item.payCount == 0 ? 0 : (item.payLevelNumbers / item.payCount * 100).toFixed(2);
                                    } else if (this.reportLevelForm.index == this.levelType.new_pay_level) {
                                        dauLevelObj[item.level + 'level'] = item.newPayCount == 0 ? 0 : (item.newPayLevelNumbers / item.newPayCount * 100).toFixed(2);
                                    } else if (this.reportLevelForm.index == this.levelType.pay_install_level) {
                                        dauLevelObj[item.level + 'level'] = item.payInstallCount == 0 ? 0 : (item.payInstallLevelNumbers / item.payInstallCount * 100).toFixed(2);
                                    }
                                })
                                dauLevels.push(dauLevelObj);
                            }
                            //聚合数据----------
                            let dauLevelSumTitleNum = Math.ceil(maxLevel / 10);
                            let chartArr = [];
                            let titleLevelSum = [];
                            for (let i = 1; i <= dauLevelSumTitleNum; i++) {
                                let dauLevelSumTitle = new Object();
                                dauLevelSumTitle[i * 10 + 'level'] = (i * 10 - 9) + "~" + i * 10 + '级';
                                dauLevelSumTitle.title = (i * 10 - 9) + "~" + i * 10 + '级';
                                dauLevelSumTitle.key = i * 10 + 'level';
                                dauLevelSumTitle.width = 150;
                                titleLevelSum.push(dauLevelSumTitle);
                            }

                            for (let key in dauLevelSum) {
                                let dauLevelSumObject = {};
                                dauLevelSumObject.ds = weekChange(dauLevelSum[key][0].ds);
                                dauLevelSumObject.os = weekChange(dauLevelSum[key][0].os);
                                dauLevelSum[key].forEach((item, index) => {
                                    //层叠柱状图data处理
                                    let chartObj = new Object();
                                    chartObj.name = ((index + 1) * 10 - 9) + "~" + (index + 1) * 10 + '级';
                                    chartObj.time = key.substr(5, 5);

                                    dauLevelSumObject[(index + 1) * 10 + 'level'] = item.dauNum == 0 ? 0 : (item.dauLevelNumbers / item.dauNum * 100).toFixed(2);
                                    chartObj.value = item.dauNum == 0 ? 0 : parseFloat((item.dauLevelNumbers / item.dauNum * 100).toFixed(2));

                                    chartArr.push(chartObj);
                                })
                                dauLevelSuns.push(dauLevelSumObject);
                            }
                            chartArr.sort(function (a, b) {
                                if (a.time < b.time) {
                                    return -1;
                                } else if (a.time > b.time) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            })
                            dauLevels.sort(function (obj1, obj2) {
                                var val1 = obj1.ds;
                                var val2 = obj2.ds;
                                if (val1 < val2) {
                                    return 1;
                                } else if (val1 > val2) {
                                    return -1;
                                } else {
                                    return 0;
                                }
                            });
                            dauLevelSuns.sort(function (obj1, obj2) {
                                var val1 = obj1.ds;
                                var val2 = obj2.ds;
                                if (val1 < val2) {
                                    return 1;
                                } else if (val1 > val2) {
                                    return -1;
                                } else {
                                    return 0;
                                }
                            });
                            if (this.phone == this.defaultPhone.android || this.phone == this.defaultPhone.ios) {
                                this.columsLevel = this.columnsHeadr.concat(this.columsOs).concat(titleLevel);
                                this.columsLevelSum = this.columnsHeadr.concat(this.columsOs).concat(titleLevelSum);
                            } else {
                                this.columsLevel = this.columnsHeadr.concat(titleLevel);
                                this.columsLevelSum = this.columnsHeadr.concat(titleLevelSum);
                            }
                            this.dauLevelData = dauLevels;
                            this.dauLevelDataSum = dauLevelSuns;
                            this.chartArr = chartArr;
                        }
                        this.levelG2.changeData(this.chartArr);
                    }
                })
            },

            levelCharts() {
                this.levelG2 = new G2.Chart({
                    container: 'levelChart',
                    forceFit: true,
                    height: 500
                });
                this.levelG2.source(this.chartArr, {
                    value: {
                        min: 0,
                        formatter(val) {
                            return val +'%';
                        }
                    }
                });
                this.levelG2.axis('time', {
                    label: {
                        rotate: -Math.PI / 2.5,
                        textAlign: 'end',
                        textBaseline: 'middle'
                    }
                });
                this.levelG2.intervalStack()
                    .position('time*value')
                    .color('name').adjust('stack').shape('text');
                this.levelG2.render();
            },
            compares: function (obj1, obj2) {
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
            this.levelCharts();
            this.init();
        },
    }
</script>

<style scoped>

</style>
