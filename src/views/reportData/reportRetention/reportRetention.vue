<template>
    <div>
        <div>
            <RadioGroup v-model="isDevice" @on-change="init()">
                <Radio label="0">用户</Radio>
                <Radio label="1">设备</Radio>
            </RadioGroup>
        </div>
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
                <Radio label="3">
                    <Icon type="ios-bookmark"></Icon>
                    <span>NONE</span>
                </Radio>
            </RadioGroup>
        </div>
        <div>
            <RadioGroup v-model="data" type="button" size="large" @on-change="init()">
                <Radio label="0">今天</Radio>
                <Radio label="1">昨天</Radio>
                <Radio label="7">7日</Radio>
                <Radio label="30">30日</Radio>
            </RadioGroup>
        </div>
        <div>
            <RadioGroup v-model="creativeOrClient" @on-change="creativeOrClientChange()">
                <Radio label="2">概况</Radio>
                <Radio label="0">渠道</Radio>
                <Radio label="1">分服</Radio>
            </RadioGroup>
        </div>

        <Form v-show="showCreativeOrClient" ref="from" class="" :model="reportRetentionForm" :label-width="80">
            <FormItem label="" prop="key">
                <Select v-model="reportRetentionForm.index" style="width:200px"
                        @on-change="changeCreativeOrClient()">
                    <Option v-for="item in creativeOrClients" :value="item.key"
                            :key="item.key">{{ item.name }}
                    </Option>
                </Select>
            </FormItem>
        </Form>

        <div>{{retentionTitle}}</div>
        <div id="reportLine"></div>
        <Row>
            <Table height="300" highlight-row @on-row-click="clickRetention"
                   :row-class-name="retentionListClass" border
                   :columns="columns"
                   :data="retentionList" ref="table"></Table>
        </Row>
        <Row>
            <Table height="300" highlight-row border :columns="payColumns" :data="payRentenTable"
                   ref="table"></Table>
        </Row>
        <Row>
            <Table height="300" highlight-row border :columns="payColumns" :data="payInstallRetenTable"
                   ref="table"></Table>
        </Row>
    </div>
</template>

<script>
    import {queryRetention, queryPayRetention} from '@/api/index';
    import {weekChange} from '@/libs/changeWeek';

    export default {
        name: "reportRetention",

        data() {
            return {
                defaultIsDeviceDef: {
                    user: 0,
                    device: 1
                },
                defaultPhone: {
                    all: 0,
                    android: 1,
                    ios: 2,
                    none: 3
                },
                defaultData: {
                    today: 0,
                    yestoday: 1,
                    week: 7,
                    month: 30
                },
                defaultCreativeOrClient: {
                    survey: 2,
                    creative: 0,
                    client: 1
                },

                isDevice: "0",
                phone: "0",
                data: "7",
                creativeOrClient: "2",
                isOs: 0,
                indexStatu: 2,
                index: "0",

                reportRetentionForm: {
                    index: "0"
                },
                showCreativeOrClient: true,
                creativeOrClients: [],
                columns: [],
                payColumns: [],
                columnsHeadr: [
                    {
                        title: '日期（星期）',
                        key: 'ds',
                        width: 150,
                        fixed: 'left'
                    }
                ],
                columnsReal: [
                    {
                        title: '～时',
                        key: 'dayOfHour',
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
                columsCreative:
                    [
                        {
                            title: '渠道',
                            key: 'creative',
                            width: 150,
                            fixed: 'left'
                        }
                    ],
                columsClient:
                    [
                        {
                            title: '分服',
                            key: 'client',
                            width: 150,
                            fixed: 'left'
                        }
                    ],
                retentionTable:
                    [
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
                payRenDayTitles:
                    [
                        {
                            title: '1日',
                            key: '1day',
                            width: 150
                        },
                        {
                            title: '2日',
                            key: '2day',
                            width: 150
                        },
                        {
                            title: '3日',
                            key: '3day',
                            width: 150
                        },
                        {
                            title: '4日',
                            key: '4day',
                            width: 150
                        },
                        {
                            title: '5日',
                            key: '5day',
                            width: 150
                        },
                        {
                            title: '6日',
                            key: '6day',
                            width: 150
                        },
                        {
                            title: '7日',
                            key: '7day',
                            width: 150
                        },
                        {
                            title: '8日',
                            key: '8day',
                            width: 150
                        },
                        {
                            title: '9日',
                            key: '9day',
                            width: 150
                        },
                        {
                            title: '10日',
                            key: '10day',
                            width: 150
                        },
                        {
                            title: '11日',
                            key: '11day',
                            width: 150
                        },
                        {
                            title: '12日',
                            key: '12day',
                            width: 150
                        },
                        {
                            title: '13日',
                            key: '13day',
                            width: 150
                        },
                        {
                            title: '14日',
                            key: '14day',
                            width: 150
                        },
                        {
                            title: '15日',
                            key: '15day',
                            width: 150
                        },
                        {
                            title: '16日',
                            key: '16day',
                            width: 150
                        },
                        {
                            title: '17日',
                            key: '17day',
                            width: 150
                        },
                        {
                            title: '18日',
                            key: '18day',
                            width: 150
                        },
                        {
                            title: '19日',
                            key: '19day',
                            width: 150
                        },
                        {
                            title: '20日',
                            key: '20day',
                            width: 150
                        },
                        {
                            title: '21日',
                            key: '21day',
                            width: 150
                        },
                        {
                            title: '22日',
                            key: '22day',
                            width: 150
                        },
                        {
                            title: '23日',
                            key: '23day',
                            width: 150
                        },
                        {
                            title: '24日',
                            key: '24day',
                            width: 150
                        },
                        {
                            title: '25日',
                            key: '25day',
                            width: 150
                        },
                        {
                            title: '26日',
                            key: '26day',
                            width: 150
                        },
                        {
                            title: '27日',
                            key: '27day',
                            width: 150
                        },
                        {
                            title: '28日',
                            key: '28day',
                            width: 150
                        },
                        {
                            title: '29日',
                            key: '29day',
                            width: 150
                        },
                        {
                            title: '30日',
                            key: '30day',
                            width: 150
                        }
                    ],
                retentionList:
                    [],
                payRentenTable: [],
                handelRetentionOne:
                    [],
                surveyOneLine: {},
                arrayCreate:
                    [],
                creatives:
                    [],
                creativeMap:
                    [],
                arrayClient:
                    [],
                clients:
                    [],
                clientMap:
                    [],
                payInstallRetenTable:
                    [],
                retentionTitle: '',
            }
                ;
        },
        methods: {
            init() {
                if(this.getStore('parentId') == 0){
                    this.isShow = true
                }else {
                    this.isShow = false
                }

                // show渠道/服选择器
                if (parseInt(this.creativeOrClient) == this.defaultCreativeOrClient.creative || parseInt(this.creativeOrClient) == this.defaultCreativeOrClient.client) {
                    this.showCreativeOrClient = true;
                } else {
                    this.showCreativeOrClient = false;
                }

                if (this.phone == this.defaultPhone.none) {
                    this.isOs = 1;
                } else {
                    this.isOs = 0;
                }

                // 处理表头
                let colum = this.columnsHeadr;
                let payColum = [];
                if (this.phone != this.defaultPhone.none && !(this.phone == this.defaultPhone.all && this.creativeOrClient == this.defaultCreativeOrClient.survey)) {
                    colum = colum.concat(this.columsOs);

                }
                if (this.data == this.defaultData.today || this.data == this.defaultData.yestoday) {
                    colum = colum.concat(this.columnsReal);
                }
                this.indexStatu = 2;
                if (this.creativeOrClient == this.defaultCreativeOrClient.client) {
                    colum = colum.concat(this.columsClient);
                    this.indexStatu = 1;
                }
                if (this.creativeOrClient == this.defaultCreativeOrClient.creative) {
                    colum = colum.concat(this.columsCreative);
                    this.indexStatu = 0;
                }
                payColum = colum;
                payColum = payColum.concat(this.payRenDayTitles);
                colum = colum.concat(this.retentionTable);
                this.columns = colum;
                this.payColumns = payColum;

                this.queryRetention();
            },
            queryRetention() {
                let params = {
                    gameid: parseInt(this.getStore('gameid')),
                    deviceType: this.isDevice,
                    osType: this.phone,
                    isOs: this.isOs,
                    data: this.data,
                    ccType: this.indexStatu,
                    ccNum: this.reportRetentionForm.index,
                    page: 1,
                }
                if (this.indexStatu == 1) {
                    params.ccNum = this.reportRetentionForm.index;
                }
                if (this.indexStatu == 0) {
                    params.ccNum = this.reportRetentionForm.index;
                }
                queryRetention(params).then(e => {
                    if (e.success) {
                        let retentionList = [];
                        retentionList = this.saturday(e.shareRetentionList);
                        //放入Map,creativeid为key
                        let creativeMap = new Map();
                        (e.creatives).forEach((item, index) => {
                            creativeMap.set(item.creativeid, item.creativeName)
                        })

                        let clients = (e.clients).map(item => ({
                            key: item.serverid,
                            name: item.serverName,
                        }));

                        let object = new Object();
                        object.key = '-1';
                        object.name = '所有服';
                        clients.unshift(object);

                        let clientMap = new Map();
                        (clients).forEach((item, index) => {
                            clientMap.set(item.key, item.name)
                        })

                        retentionList.forEach(item => {
                            item.creative = creativeMap.get(item.creative) === undefined ? item.creative : creativeMap.get(item.creative);
                            item.client = clientMap.get(String(item.clientid)) === undefined ? item.client : clientMap.get(String(item.clientid));
                        })
                        let handelRetentionOne = this.makeRetentionOne(retentionList[5]);
                        this.retentionList = retentionList;
                        this.handelRetentionOne = handelRetentionOne;
                        this.surveyOneLine.changeData(handelRetentionOne);
                    }
                });

                let payRentenData = {
                    gameid: parseInt(this.getStore('gameid')),
                    date: parseInt(this.data),
                    device: parseInt(this.isDevice) == this.defaultIsDeviceDef.user ? false : true,
                }
                if (this.phone != this.defaultPhone.none) {
                    payRentenData.os = this.phone;
                }
                if (this.indexStatu == this.defaultCreativeOrClient.client) {
                    payRentenData.clientid = this.reportRetentionForm.index;
                    this.creativeOrClients = this.clients;
                }
                if (this.indexStatu == this.defaultCreativeOrClient.creative) {
                    payRentenData.creative = this.reportRetentionForm.index;
                    this.creativeOrClients = this.creatives;
                }
                queryPayRetention(payRentenData).then(e => {
                    if (e.success) {
                        const payReten = e.sharePayRetentionMap;
                        const installPayReten = e.shareInstallPayRetentionMap;
                        /**
                         * 渠道信息
                         * @param creativeMap 替换表格数据
                         * @param creativeNames 替换选择头
                         */
                        let creatives = (e.creatives).map(item => ({
                            key: item.creativeid,
                            name: item.creativeName,
                        }));

                        let clients = (e.clients).map(item => ({
                            key: item.serverid,
                            name: item.serverName,
                        }));

                        let creativeNames = [];
                        creativeNames.push('全渠道');
                        (e.creatives).forEach(item => {
                            creativeNames.push(item.creativeName);
                        });

                        let allObject = new Object();
                        allObject.key = '0';
                        allObject.name = '全渠道';
                        creatives.unshift(allObject);
                        //放入Map,creativeid为key
                        let creativeMap = new Map();
                        creatives.forEach((item, index) => {
                            creativeMap.set(item.key, item.name)
                        })

                        let clientNames = [];
                        clientNames.push('所有服');
                        (e.clients).forEach(item => {
                            clientNames.push(item.serverName);
                        });

                        let object = new Object();
                        object.key = '0';
                        object.name = '所有服';
                        clients.unshift(object);

                        let clientMap = new Map();
                        clients.forEach((item, indx) => {
                            clientMap.set(item.key, item.name)
                        })
                        this.arrayCreate = creativeNames;
                        this.creatives = creatives;
                        this.creativeMap = creativeMap;
                        this.arrayClient = clientNames;
                        this.clients = clients;
                        this.clientMap = clientMap;
                        /**
                         * -----------------安装付费留存-------------
                         */
                        if (installPayReten) {
                            let payInstallRetenArray = [];
                            for (let key in installPayReten) {
                                let payInstallRentenObj = {};
                                payInstallRentenObj.ds = weekChange(installPayReten[key][0].ds);
                                payInstallRentenObj.os = installPayReten[key][0].os;
                                payInstallRentenObj.creative = creativeMap.get(installPayReten[key][0].creative) === undefined ? installPayReten[key][0].creative : creativeMap.get(installPayReten[key][0].creative);
                                payInstallRentenObj.client = clientMap.get(String(installPayReten[key][0].clientid));
                                for (let i = 1; i <= 30; i++) {
                                    payInstallRentenObj[i + 'day'] = 0;
                                }
                                installPayReten[key].forEach(item => {
                                    payInstallRentenObj[item.dr + 'day'] = item.payInstallCount == 0 ? 0 : (item.retention / item.payInstallCount * 100).toFixed(2);
                                })
                                payInstallRetenArray.push(payInstallRentenObj);
                            }
                            payInstallRetenArray.sort(this.compare);
                            this.payInstallRetenTable = payInstallRetenArray;
                        }
                        /**
                         * -------------付费留存---------------
                         */
                        if (payReten) {
                            let payRetenArray = [];
                            for (let key in payReten) {
                                let payRentenObj = {};
                                payRentenObj.ds = weekChange(payReten[key][0].ds);
                                payRentenObj.os = payReten[key][0].os;
                                payRentenObj.creative = creativeMap.get(payReten[key][0].creative) === undefined ? payReten[key][0].creative : creativeMap.get(payReten[key][0].creative);
                                payRentenObj.client = clientMap.get(String(payReten[key][0].clientid));
                                for (let i = 1; i <= 30; i++) {
                                    payRentenObj[i + 'day'] = 0;
                                }
                                payReten[key].forEach(item => {
                                    payRentenObj[item.dr + 'day'] = item.payCount == 0 ? 0 : (item.retention / item.payCount * 100).toFixed(2);
                                })
                                payRetenArray.push(payRentenObj);
                            }
                            payRetenArray.sort(this.compare);
                            this.payRentenTable = payRetenArray;
                        }
                    }
                })
            },
            creativeOrClientChange() {
                // 还原
                this.reportRetentionForm.index = "0";
                this.init();
            },
            changeCreativeOrClient() {
                this.init();
            },
            clickRetention(data) {
                this.retentionTitle = data.ds;
                this.surveyOneLine.changeData(this.makeRetentionOne(data));
            }
            ,
            makeRetentionOne: function (data) {
                let handelRetentionOne = [];
                if (data) {
                    let info1 = new Object();
                    info1.time = 1;
                    info1.value = parseFloat(data.oneRetentionPercentage);
                    handelRetentionOne.push(info1);
                    let info2 = new Object();
                    info2.time = 2;
                    info2.value = parseFloat(data.twoRetentionPercentage);
                    handelRetentionOne.push(info2);
                    let info3 = new Object();
                    info3.time = 3;
                    info3.value = parseFloat(data.threeRetentionPercentage);
                    handelRetentionOne.push(info3);
                    let info4 = new Object();
                    info4.time = 4;
                    info4.value = parseFloat(data.fourRetentionPercentage);
                    handelRetentionOne.push(info4);
                    let info5 = new Object();
                    info5.time = 5;
                    info5.value = parseFloat(data.fiveRetentionPercentage);
                    handelRetentionOne.push(info5);
                    let info6 = new Object();
                    info6.time = 6;
                    info6.value = parseFloat(data.sixRetentionPercentage);
                    handelRetentionOne.push(info6);
                    let info7 = new Object();
                    info7.time = 7;
                    info7.value = parseFloat(data.sevenRetentionPercentage);
                    handelRetentionOne.push(info7);
                    let info8 = new Object();
                    info8.time = 8;
                    info8.value = parseFloat(data.eightRetentionPercentage);
                    handelRetentionOne.push(info8);
                    let info9 = new Object();
                    info9.time = 9;
                    info9.value = parseFloat(data.nineRetentionPercentage);
                    handelRetentionOne.push(info9);
                    let info10 = new Object();
                    info10.time = 10;
                    info10.value = parseFloat(data.tenRetentionPercentage);
                    handelRetentionOne.push(info10);
                    let info11 = new Object();
                    info11.time = 11;
                    info11.value = parseFloat(data.elevenRetentionPercentage);
                    handelRetentionOne.push(info11);
                    let info12 = new Object();
                    info12.time = 12;
                    info12.value = parseFloat(data.twelveRetentionPercentage);
                    handelRetentionOne.push(info12);
                    let info13 = new Object();
                    info13.time = 13;
                    info13.value = parseFloat(data.thirteenRetentionPercentage);
                    handelRetentionOne.push(info13);
                    let info14 = new Object();
                    info14.time = 14;
                    info14.value = parseFloat(data.fourteenRetentionPercentage);
                    handelRetentionOne.push(info14);
                    let info15 = new Object();
                    info15.time = 15;
                    info15.value = parseFloat(data.fifteenRetentionPercentage);
                    handelRetentionOne.push(info15);
                }
                return handelRetentionOne;
            }
            ,
            reportLineChart() {
                /*---------------------单折线图-------------------*/
                this.surveyOneLine = new G2.Chart({
                    container: 'reportLine',
                    forceFit: true,
                    height: 500
                });
                this.surveyOneLine.source(this.handelRetentionOne, {});
                this.surveyOneLine.scale('value', {
                    min: 0,
                    alias: '留存率',
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
                                break
                            case 1:
                                saturdays = ['sevenRetentionPercentage', 'fourteenRetentionPercentage'];
                                break
                            case 2:
                                saturdays = ['sixRetentionPercentage', 'thirteenRetentionPercentage'];
                                break
                            case 3:
                                saturdays = ['fiveRetentionPercentage', 'twelveRetentionPercentage'];
                                break
                            case 4:
                                saturdays = ['fourRetentionPercentage', 'elevenRetentionPercentage'];
                                break
                            case 5:
                                saturdays = ['threeRetentionPercentage', 'tenRetentionPercentage'];
                                break
                            case 6:
                                saturdays = ['twoRetentionPercentage', 'nineRetentionPercentage'];
                                break
                            default:
                        }
                        ;
                        item.special = saturdays;
                        item.oneSpecial = saturdays[0];
                        item.twoSpecial = saturdays[1];
                        item.ds = weekChange(item.ds);
                    })
                    return data;
                }
            }
            ,
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
            }
            ,
            retentionListClass(row, index) {

            }
            ,
        },
        mounted() {
            this.reportLineChart();
            this.init();
        }
    }
</script>

<style scoped>
    .ivu-table .demo-table-info-cell-address {
        background-color: #187;
        color: #fff;
    }
</style>
