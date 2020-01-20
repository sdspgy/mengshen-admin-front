<template>
    <div>
        <div>
            <RadioGroup v-model="isDevice" @on-change="init()">
                <Radio label="用户"></Radio>
                <Radio label="设备"></Radio>
            </RadioGroup>
        </div>
        <div>
            <RadioGroup v-model="phone" @on-change="init()">
                <Radio label="ALL">
                    <Icon type="logo-windows"></Icon>
                    <span>ALL</span>
                </Radio>
                <Radio label="ANDROID">
                    <Icon type="logo-android"></Icon>
                    <span>ANDROID</span>
                </Radio>
                <Radio label="IOS">
                    <Icon type="logo-apple"></Icon>
                    <span>IOS</span>
                </Radio>
            </RadioGroup>
        </div>
        <div>
            <RadioGroup v-model="data" type="button" size="large" @on-change="init()">>
                <Radio label="今天"></Radio>
                <Radio label="昨天"></Radio>
                <Radio label="7日"></Radio>
                <Radio label="30日"></Radio>
            </RadioGroup>
        </div>
        <div>
            <RadioGroup v-model="dauOrInstall" @on-change="init()">
                <Radio label="活跃"></Radio>
                <Radio label="新增"></Radio>
            </RadioGroup>
        </div>
        <div id="surveyOneLine"></div>
        <div class="roundChart">
            <div id="davChart"></div>
            <div id="installChart"></div>
        </div>

        <Row>
            <Table height="300" highlight-row border :columns="columns" :data="listData"
                   ref="table"></Table>
        </Row>

        <div id="surveyManyLine"></div>

        <Row>
            <Table height="300" highlight-row border :columns="retentionTable" :data="retentionDataList"
                   ref="table"></Table>
        </Row>
    </div>
</template>

<script>
    import {queryDaily} from '@/api/index';

    const initData = {
        '今天': 0,
        '昨天': 1,
        '7日': 7,
        '30日': 30
    }
    const initPhone = {
        'ALL': 0,
        'ANDROID': 1,
        'IOS': 2
    }

    export default {
        name: "reportData",
        data() {
            return {
                isDevice: '用户',
                phone: 'ALL',
                data: '7日',
                dauOrInstall: '活跃',
                listData: [],
                payList: [],
                retentionDataList: [],
                datas: [],
                realtimeStatis: [],
                handelPayCount: [],
                finalTable: [],
                columnsHeadrReal: [
                    {
                        title: '日期（星期）',
                        key: 'ds',
                        width: 150,
                        fixed: 'left'
                    },
                    {
                        title: '～时',
                        key: 'dayOfHour',
                        width: 150,
                        fixed: 'left'
                    }
                ],
                columnsHeadr: [
                    {
                        title: '日期（星期）',
                        key: 'ds',
                        width: 150,
                        fixed: 'left'
                    }
                ],
                columnsOver: [
                    {
                        title: '注册数',
                        key: 'installNum',
                        width: 150
                    },
                    {
                        title: '活跃数',
                        key: 'dauNum',
                        width: 150
                    },
                    {
                        title: '付费人数',
                        key: 'payCount',
                        width: 150
                    },
                    {
                        title: '付费总额',
                        key: 'payAmount',
                        width: 150
                    },
                    {
                        title: '付费率',
                        key: 'payRate',
                        width: 150
                    },
                    {
                        title: 'ARPU',
                        key: 'ARPU',
                        width: 150
                    },
                    {
                        title: 'ARPPU',
                        key: 'ARPPU',
                        width: 150
                    },
                    {
                        title: '注册付费率',
                        key: 'payInstallRate',
                        width: 150
                    },
                    {
                        title: '注册付费人数',
                        key: 'payInstallCount',
                        width: 150
                    },
                    {
                        title: '注册付费总额',
                        key: 'payInstallAmount',
                        width: 150
                    },
                    {
                        title: '注付ARPU',
                        key: 'payInstallARPU',
                        width: 150
                    },
                    {
                        title: '注付ARPPU',
                        key: 'payInstallARPPU',
                        width: 150
                    },
                    {
                        title: '付费次数',
                        key: 'payTimes',
                        width: 150
                    },
                    {
                        title: '注册付费次数',
                        key: 'payInstallTimes',
                        width: 150
                    }
                ],
                columns: [],
                retentionTable: [
                    // {
                    //     type: 'selection',
                    //     width: 60,
                    //     align: 'center',
                    //     fixed: 'left'
                    // },
                    // {
                    //     type: 'index',
                    //     width: 60,
                    //     align: 'center',
                    //     fixed: 'left'
                    // },
                    {
                        title: '日期（星期）',
                        key: 'ds',
                        width: 150,
                        fixed: 'left'
                    },
                    {
                        title: '1日',
                        key: 'oneRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '2日',
                        key: 'twoRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '3日',
                        key: 'threeRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '4日',
                        key: 'fourRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '5日',
                        key: 'fiveRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '6日',
                        key: 'sixRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '7日',
                        key: 'sevenRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '8日',
                        key: 'eightRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '9日',
                        key: 'nineRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '10日',
                        key: 'tenRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '11日',
                        key: 'elevenRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '12日',
                        key: 'twelveRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '13日',
                        key: 'thirteenRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '14日',
                        key: 'fourteenRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '15日',
                        key: 'fifteenRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '16日',
                        key: 'sixteenRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '17日',
                        key: 'seventeenRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '18日',
                        key: 'eighteenRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '19日',
                        key: 'nineteenRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '20日',
                        key: 'twentyteenRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '21日',
                        key: 'twentyOneteenRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '22日',
                        key: 'twentyTwoRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '23日',
                        key: 'twentyThreeRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '24日',
                        key: 'twentyFourRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '25日',
                        key: 'twentyFiveRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '26日',
                        key: 'twentySixRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '27日',
                        key: 'twentySevenRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '28日',
                        key: 'twentyEightRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '29日',
                        key: 'twentyNineRetentionPercentage',
                        width: 150
                    },
                    {
                        title: '30日',
                        key: 'thirtyRetentionPercentage',
                        width: 150
                    }
                ],
                surveyOneLine: {},
                surveyManyLine: {},
                davChart: {},
                chartData: [],
                map_pieChartD: {},
                map_pieChartI: {},
            };
        },
        methods: {
            init() {
                this.initTable();
                this.queryDaily();
            },
            surveyManyLineChart() {
                /*---------------------多折线图-------------------*/
                this.surveyManyLine = new G2.Chart({
                    container: 'surveyManyLine',
                    forceFit: true,
                    height: 500
                });
                this.surveyManyLine.source(this.handelPayCount, {});
                this.surveyManyLine.scale('value', {
                    min: 0,
                    alias: '人数',
                });
                this.surveyManyLine.scale('time', {
                    tickCount: 6,
                });
                this.surveyManyLine.tooltip({
                    crosshairs: {
                        type: 'line'
                    }
                });
                // 坐标轴文本旋转
                this.surveyManyLine.axis('time', {
                    label: {
                        rotate: -Math.PI / 2.5,
                        textAlign: 'end',
                        textBaseline: 'middle'
                    }
                });
                this.surveyManyLine.axis('time', {
                    label: {
                        formatter: val => {
                            return val;
                        }
                    }
                });
                //设置图列居中显示
                this.surveyManyLine.legend({
                    position: 'bottom', //图列位置
                    align: 'center', //图例的对齐方式
                    itemWidth: null
                });
                this.surveyManyLine
                    .line()
                    .position('time*value')
                    .color('type')
                    .shape('smooth');
                this.surveyManyLine
                    .point()
                    .position('time*value')
                    .color('type')
                    .size(4)
                    .shape('circle')
                    .style({
                        stroke: '#fff',
                        lineWidth: 1
                    });
                this.surveyManyLine.render();
            },
            surveyOneLineChart() {
                /*---------------------单折线图-------------------*/
                this.surveyOneLine = new G2.Chart({
                    container: 'surveyOneLine',
                    forceFit: true,
                    height: 500
                });
                this.surveyOneLine.source(this.datas, {});
                this.surveyOneLine.scale('value', {
                    min: 0,
                    alias: '人数',
                });
                this.surveyOneLine.scale('time', {
                    // range: [0, 1]
                    tickCount: 6,
                });
                this.surveyOneLine.tooltip({
                    crosshairs: {
                        type: 'line'
                    }
                });
                // 坐标轴文本旋转
                this.surveyOneLine.axis('time', {
                    label: {
                        rotate: -Math.PI / 2.5,
                        textAlign: 'end',
                        textBaseline: 'middle'
                    }
                });
                this.surveyOneLine.line().position('time*value').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
                this.surveyOneLine.point().position('time*value')
                    .size(4)
                    .shape('circle')
                    .style({
                        stroke: '#fff',
                        lineWidth: 1
                    })
                    .color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
                this.surveyOneLine.area().position('time*value').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
                this.surveyOneLine.render();
                // return this.surveyOneLine;
            },
            roundChart() {
                this.davChart = new G2.Chart({
                    container: 'davChart',
                    // forceFit: true,
                    height: 500,
                    width: 500,
                })
                ;
                this.davChart.source(this.chartData, {});
                this.davChart.coord('theta', {
                    radius: 0.75
                });
                this.davChart.tooltip({
                    showTitle: false,
                    // itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
                });
                this.davChart.intervalStack()
                    .position('dauNum')
                    .color('os')
                    .label('dauNum', {
                        formatter: (val, item) => {
                            return this.map_pieChartD[item.point.os] + '|' + val;
                        }
                    })
                    .tooltip('os*dauNum', (os, dauNum) => {
                        return {
                            name: os,
                            value: dauNum
                        };
                    })
                    .style({
                        lineWidth: 1,
                        stroke: '#fff'
                    });
                this.davChart.render();

                this.installChart = new G2.Chart({
                    container: 'installChart',
                    // forceFit: true,
                    height: 500,
                    width: 500,
                })
                ;
                this.installChart.source(this.chartData, {});
                this.installChart.coord('theta', {
                    radius: 0.75
                });
                this.installChart.tooltip({
                    showTitle: false,
                    // itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
                });
                this.installChart.intervalStack()
                    .position('installNum')
                    .color('os')
                    .label('installNum', {
                        formatter: (val, item) => {
                            return this.map_pieChartI[item.point.os] + '|' + val;
                        }
                    })
                    .tooltip('os*installNum', (os, dauNum) => {
                        return {
                            name: os,
                            value: dauNum
                        };
                    })
                    .style({
                        lineWidth: 1,
                        stroke: '#fff'
                    });
                this.installChart.render();
            },
            initTable() {
                if (initData[this.data] == 1 || initData[this.data] == 0) {
                    this.columns = this.columnsHeadrReal.concat(this.columnsOver);
                } else {
                    this.columns = this.columnsHeadr.concat(this.columnsOver);
                }

                let tables = [];
                let selection = new Object();
                selection.type = 'selection';
                selection.width = 60;
                selection.align = 'center';
                selection.fixed = 'left';
                let index = new Object();
                index.type = 'index';
                index.width = 60;
                index.align = 'center';
                index.fixed = 'left';
                let title = new Object();
                title.title = '日期（星期）';
                title.key = 'ds';
                title.width = 150;
                title.fixed = 'left';
                // let days = [];
                // for (let i = 1; i <= 30; i++) {
                //     let dayObj = new Object();
                //     dayObj.title = i + '日';
                //     dayObj.key = [i + 'day'];
                //     dayObj.width = 150;
                //     days.push(dayObj);
                // }
                tables.push(selection);
                tables.push(index);
                tables.push(title);
                // let finalTable = tables.concat(days);
                // this.finalTable = finalTable;
            },
            queryDaily() {
                let params = {
                    gameid: parseInt(this.getStore('gameid')),
                    deviceType: parseInt(this.isDevice === '用户' ? 0 : 1),
                    osType: initPhone[this.phone],
                    data: parseInt(initData[this.data]),
                    hxType: parseInt(this.dauOrInstall === '活跃' ? 0 : 1),
                }
                queryDaily(params).then(e => {
                    if (e.success) {
                        let percentage = this.androidIosProportions(e.androidIosProportions);
                        this.listData = this.tableDataProcess(e.shareDailyResultTypes, percentage);
                        this.payList = e.payList;
                        this.retentionDataList = this.saturday(e.shareRetentionList);
                        this.datas = this.f2DI(e.dauNumOrInstallNumList, initData[this.data].toString(), this.listData, parseInt(this.dauOrInstall === '活跃' ? 0 : 1));
                        this.handelPayCount = this.makeCavas(this.listData, initData[this.data]);
                        this.chartData = this.makePieChart(e.androidIosProportions);
                        this.surveyOneLine.changeData(this.datas);
                        this.surveyManyLine.changeData(this.handelPayCount);
                        this.davChart.changeData(this.chartData);
                        this.installChart.changeData(this.chartData);
                    }
                });
            },
            makePieChart: function (info) {
                let dauNumTotal = 0,
                    installNumTotal = 0;
                info.forEach(item => {
                    dauNumTotal += item.dauNum;
                    installNumTotal += item.installNum;
                })
                var map_pieChartD = {},
                    map_pieChartI = {};
                info.map(function (obj) {
                    map_pieChartD[obj.os] = (obj.dauNum / dauNumTotal * 100).toFixed(2) + '%';
                    map_pieChartI[obj.os] = (obj.installNum / installNumTotal * 100).toFixed(2) + '%';
                })
                this.map_pieChartD = map_pieChartD;
                this.map_pieChartI = map_pieChartI;
                return info;
            },
            androidIosProportions: (data) => {
                if (data) {
                    let dauNumSum = 0,
                        installNumSum = 0,
                        androidDauNum = 0,
                        androidInstallNum = 0,
                        iosDauNum = 0,
                        iosInstallNum = 0,
                        info = [];
                    data.forEach((item) => {
                        dauNumSum += item.dauNum;
                        installNumSum += item.installNum;
                        if (item.os == 'android') {
                            androidDauNum = item.dauNum;
                            androidInstallNum = item.installNum;
                        }
                        if (item.os == 'iOS') {
                            iosDauNum = item.dauNum;
                            iosInstallNum = item.installNum;
                        }
                    })
                    info.push(((androidDauNum / dauNumSum * 100).toFixed(2)) + '%');
                    info.push(((iosDauNum / dauNumSum * 100).toFixed(2)) + '%');
                    info.push(((androidInstallNum / installNumSum * 100).toFixed(2)) + '%');
                    info.push(((iosInstallNum / installNumSum * 100).toFixed(2)) + '%');
                    return info;
                }
            },
            tableDataProcess: function (data, info) {
                if (data) {
                    let activeNum = 0,
                        newIntall = 0,
                        payTotal = 0,
                        payCount = 0;

                    data.forEach((item) => {
                        activeNum += item.dauNum;
                        newIntall += item.installNum;
                        payTotal += item.payAmount;
                        payCount += item.payCount;

                        item.ds = this.weekFunction(item.ds);
                        item.payAmount = item.payAmount / this.getStore("currencyRate");
                        item.payRate = item.dauNum == 0 ? 0 : (item.payCount * 100 / item.dauNum).toFixed(2) + '%';
                        item.ARPU = item.dauNum == 0 ? 0 : (item.payAmount / item.dauNum).toFixed(2);
                        item.ARPPU = item.payCount == 0 ? 0 : (item.payAmount / item.payCount).toFixed(2);
                        item.payInstallAmount = item.payInstallAmount / this.getStore("currencyRate");
                        item.payInstallRate = item.installNum == 0 ? 0 : (item.payInstallCount * 100 / item.installNum).toFixed(2) + '%';
                        item.payInstallARPU = item.installNum == 0 ? 0 : (item.payInstallAmount / item.installNum).toFixed(2);
                        item.payInstallARPPU = item.payInstallCount == 0 ? 0 : (item.payInstallAmount / item.payInstallCount).toFixed(2);
                    });

                    let realtimeArray = [];
                    let realtimeObject1 = new Object();
                    realtimeObject1.title = '活跃';
                    realtimeObject1.value = '人数:' + activeNum;
                    realtimeObject1.payRate = 'Android:' + info[0];
                    realtimeObject1.payARPU = 'iOS:' + info[1];
                    let realtimeObject2 = new Object();
                    realtimeObject2.title = '新增';
                    realtimeObject2.payRate = 'Android:' + info[2];
                    realtimeObject2.payARPU = 'iOS:' + info[3];
                    realtimeObject2.value = '人数:' + newIntall;
                    let realtimeObject3 = new Object();
                    realtimeObject3.title = '付费';

                    realtimeObject3.value = '总额:' + payTotal / this.getStore("currencyRate");
                    realtimeObject3.payRate = ' 付费率:' + (activeNum == 0 ? 0 : (payCount * 100 / activeNum).toFixed(2) + '%');
                    realtimeObject3.payARPUs = 'ARPU:' + (activeNum == 0 ? 0 : (payTotal / this.getStore("currencyRate") / activeNum).toFixed(2));
                    realtimeObject3.payARPPU = 'ARPPU:' + (payCount == 0 ? 0 : (payTotal / this.getStore("currencyRate") / payCount).toFixed(2));

                    realtimeArray.push(realtimeObject1);
                    realtimeArray.push(realtimeObject2);
                    realtimeArray.push(realtimeObject3);
                    this.realtimeStatis = realtimeArray;
                }
                return data;
            },
            saturday: function (data) {
                if (data) {
                    data.forEach((item, index) => {
                        let week = new Date(item.ds);
                        let dateweek = week.getDay();
                        let i = 7 - dateweek;
                        let saturdays = [];
                        switch (i) {
                            case 7:
                                saturdays = ['oneRetentionPercentage', 'eightRetentionPercentage', 'fifteenRetentionPercentage'];
                                item.ds = item.ds + "(七)";
                                break
                            case 1:
                                saturdays = ['sevenRetentionPercentage', 'fourteenRetentionPercentage'];
                                item.ds = item.ds + "(六)";
                                break
                            case 2:
                                saturdays = ['sixRetentionPercentage', 'thirteenRetentionPercentage'];
                                item.ds = item.ds + "(五)";
                                break
                            case 3:
                                saturdays = ['fiveRetentionPercentage', 'twelveRetentionPercentage'];
                                item.ds = item.ds + "(四)";
                                break
                            case 4:
                                saturdays = ['fourRetentionPercentage', 'elevenRetentionPercentage'];
                                item.ds = item.ds + "(三)";
                                break
                            case 5:
                                saturdays = ['threeRetentionPercentage', 'tenRetentionPercentage'];
                                item.ds = item.ds + "(二)";
                                break
                            case 6:
                                saturdays = ['twoRetentionPercentage', 'nineRetentionPercentage'];
                                item.ds = item.ds + "(一)";
                                break
                            default:
                        }
                        ;
                        item.special = saturdays;
                        item.oneSpecial = saturdays[0];
                        item.twoSpecial = saturdays[1];
                    })
                    return data;
                }
            },
            f2DI: function (data, date, listData, type) {
                let datas = [];
                if (date == 0 || date == 1) {
                    listData.forEach(info => {
                        let item = new Object();
                        if (type == 0) {
                            item.value = info.dauNum;
                        } else {
                            item.value = info.installNum;
                        }
                        item.time = info.dayOfHour + '时';
                        datas.push(item);
                    });
                } else {
                    data.forEach((item, index) => {
                        let info = new Object();
                        info.time = this.getTime(index);
                        info.value = item;
                        datas.push(info);
                    });
                }
                if (date == "7" || date == "30" || date == "0") {
                    //该方法会改变原来的数组，而不会创建新的数组
                    datas.reverse();
                }
                return datas;
            },
            getTime: function (index) {
                let myDate = new Date();
                myDate.setTime(myDate.getTime() - 24 * 60 * 60 * 1000 * (index + 1));
                let dateTime = (myDate.getMonth() + 1) + "-" + myDate.getDate();
                return dateTime;
            },
            weekFunction: function (ds) {
                let week = new Date(ds);
                let dateweek = week.getDay();
                let i = 7 - dateweek;
                switch (i) {
                    case 7:
                        ds = ds + "(七)";
                        break
                    case 1:
                        ds = ds + "(六)";
                        break
                    case 2:
                        ds = ds + "(五)";
                        break
                    case 3:
                        ds = ds + "(四)";
                        break
                    case 4:
                        ds = ds + "(三)";
                        break
                    case 5:
                        ds = ds + "(二)";
                        break
                    case 6:
                        ds = ds + "(一)";
                        break
                    default:
                }
                return ds;
            },
            makeCavas: (data, date) => {
                if (data) {
                    if (date == 0) {
                        data.sort(function (a, b) {
                            return b.dayOfHour - a.dayOfHour;
                        });
                    }
                    let handelPayCount = [];
                    data.forEach((item, index) => {
                        let infopayCount = new Object();
                        if (date != 7 && date != 30) {
                            infopayCount.time = item.dayOfHour + '时';
                        } else {
                            infopayCount.time = (item.ds).substr(5, 5);
                        }
                        infopayCount.value = item.payCount;
                        infopayCount.type = '付费人数';
                        handelPayCount.push(infopayCount);
                        let infopayAmount = new Object();
                        if (date != 7 && date != 30) {
                            infopayAmount.time = item.dayOfHour + '时';
                        } else {
                            infopayAmount.time = (item.ds).substr(5, 5);
                        }
                        infopayAmount.value = item.payAmount;
                        infopayAmount.type = '付费金额';
                        handelPayCount.push(infopayAmount);
                        let infopayTimes = new Object();
                        if (date != 7 && date != 30) {
                            infopayTimes.time = item.dayOfHour + '时';
                        } else {
                            infopayTimes.time = (item.ds).substr(5, 5);
                        }
                        infopayTimes.value = item.payTimes;
                        infopayTimes.type = '付费次数';
                        handelPayCount.push(infopayTimes);
                        let infopayInstallCount = new Object();
                        if (date != 7 && date != 30) {
                            infopayInstallCount.time = item.dayOfHour + '时';
                        } else {
                            infopayInstallCount.time = (item.ds).substr(5, 5);
                        }
                        infopayInstallCount.value = item.payInstallCount;
                        infopayInstallCount.type = '安装付费人数';
                        handelPayCount.push(infopayInstallCount);
                        let infopayInstallAmount = new Object();
                        if (date != 7 && date != 30) {
                            infopayInstallAmount.time = item.dayOfHour + '时';
                        } else {
                            infopayInstallAmount.time = (item.ds).substr(5, 5);
                        }
                        infopayInstallAmount.value = item.payInstallAmount;
                        infopayInstallAmount.type = '安装付费金额';
                        handelPayCount.push(infopayInstallAmount);
                        let infoPayInstallTimes = new Object();
                        if (date != 7 && date != 30) {
                            infoPayInstallTimes.time = item.dayOfHour + '时';
                        } else {
                            infoPayInstallTimes.time = (item.ds).substr(5, 5);
                        }
                        infoPayInstallTimes.value = item.payInstallTimes;
                        infoPayInstallTimes.type = '安装付费次数';
                        handelPayCount.push(infoPayInstallTimes);
                    });
                    if (date == 7 || date == 30 || date == 0) {
                        handelPayCount.reverse();
                    }
                    return handelPayCount;
                }
            },
        },
        mounted() {
            this.surveyOneLineChart();
            this.surveyManyLineChart();
            this.roundChart();
            this.init();
        }
    }
</script>

<style scoped>
    .roundChart {
        display: flex;
        justify-content: space-around;
    }
</style>
