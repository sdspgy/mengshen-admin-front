<template>
    <div>
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
            <!-- <span v-if="drop"> -->
            <Form-item label="按用户或设备" prop="source">
                <Select v-model="searchForm.source"  @on-change="handleSearch" style="width:200px">
                    <Option value="0">按用户</Option>
                    <Option value="1">按设备</Option>
                </Select>
            </Form-item>
            <Form-item label="按OS" prop="os">
                <Select v-model="searchForm.os"  @on-change="handleSearch" style="width:200px">
                    <Option value="0">all</Option>
                    <Option value="1">android</Option>
                    <Option value="2">ios</Option>
                    <Option value="-1">none</Option>
                </Select>
            </Form-item>
            <Form-item label="日期" prop="day">
                <Select v-model="searchForm.day" @on-change="handleSearch" style="width:200px">
                    <Option value="0">今天</Option>
                    Option             <Option value="1">昨天</Option>
                    <Option value="7">7天</Option>
                    <Option value="30">30天</Option>
                </Select>
            </Form-item>
            <Form-item label="渠道或分服" prop="key">
                <Select v-model="key" @on-change="showclients" style="width:200px">
                    <Option value="all">概况</Option>
                    <Option value="creative">渠道</Option>
                    <Option value="client">分服</Option>
                </Select>
            </Form-item>
            <Form-item label="渠道" prop="creative" v-if="showcreative">
                <Select v-model="searchForm.creative" style="width:200px">
                    <Option v-for="item in creativemap" :value="item.key" :key="item.key">{{ item.name}}</Option>
                </Select>
            </Form-item>
            <Form-item label="分服" prop="client" v-if="showclient">
                <Select v-model="searchForm.clientid" style="width:200px">
                    <Option v-for="item in clientmap" :value="item.key" :key="item.key">{{ item.name }}</Option>
                </Select>
            </Form-item>
        </Form>
        <div id="surveyOneLine"></div>
        <Row>
            <Table :loading="loading" border :columns="columnspro" :data="data"  height="300" sortable="custom" ref="table"></Table>
            <!-- <Table :columns="exportColumns" :data="exportData" ref="exportTable" style="display:none"></Table> -->
        </Row>
        <div class="roundChart" v-if="showcc">
            <div id="davChart"></div>
            <div id="installChart"></div>
        </div>
        <Row v-if="showcc">
            <Table height="300" highlight-row border :columns="columnscc" :data="sharePayResultTypesCC" @on-current-change=onRowTap ref="table"></Table>
        </Row>
    </div>
</template>

<script>
    import {queryAllPayReq} from '@/api/index';

    export default {
        name: 'pay',
        comments: {},
        data() {
            return {
                columnspro:[],
                columns: [
                    // {
                    // 	type: 'expand',
                    // 	width: 50,
                    // 	fixed: 'left',
                    // 	render: (h, params) => {
                    // 		return h(expandRow, {
                    // 			props: {
                    // 				row: params.row
                    // 			}
                    // 		});
                    // 	}
                    // },
                    {
                        type: 'index',
                        width: 60,
                        align: 'center',
                        fixed: 'left'
                    },
                    {
                        title: '日期(星期)',
                        key: 'ds',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '操作系统',
                        key: 'os',
                        width: 150,
                        checkAccess: [2]
                        // sortable: true,
                        // fixed: 'left'
                    },
                    {
                        title: '小时',
                        key:'dayOfHour',
                        width: 150,
                        checkAccess: [3]
                        //   render:(h,params)=>{
                        //       return h('div', { style: {
                        //               display:(params.row.dayOfHour==0)?"none":"inline-block",
                        //               color: '#FF7D41'
                        //       }
                        //       },params.row.dayOfHour);
                        // },
                        // sortable: true
                    },
                    {
                        title: '渠道',
                        key: 'creative',
                        width: 150,
                        checkAccess: [4]
                        // sortable: true
                    },
                    {
                        title: '服',
                        key: 'clientid',
                        width: 150,
                        checkAccess: [1]
                        // sortable: true
                    },
                    {
                        title: '注册数',
                        key: 'installNum',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '新付费率',
                        key: 'payInstallRate',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '新付费ARPU',
                        key: 'payInstallARPU',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '新付费ARPPU',
                        key: 'payInstallARPPU',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '新付费人数',
                        key: 'payInstallCount',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '新付费总额',
                        key: 'payInstallAmount',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '新付费次数',
                        key: 'payInstallTimes',
                        width: 150
                        // sortable: true
                    },
                    // {
                    // 	title: '创建时间',
                    // 	key: 'createTime',
                    // 	sortable: true,
                    // 	sortType: 'desc',
                    // 	width: 150
                    // },
                ],
                columnscc:[
                    {
                        type: 'index',
                        width: 60,
                        align: 'center',
                        fixed: 'left'
                    },
                    {
                        title: '日期(星期)',
                        key: 'ds',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '操作系统',
                        key: 'os',
                        width: 150,
                        // sortable: true,
                        // fixed: 'left'
                    },
                    {
                        title: '注册数',
                        key: 'installNum',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '新付费率',
                        key: 'payInstallRate',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '新付费ARPU',
                        key: 'payInstallARPU',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '新付费ARPPU',
                        key: 'payInstallARPPU',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '新付费人数',
                        key: 'payInstallCount',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '新付费总额',
                        key: 'payInstallAmount',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '新付费次数',
                        key: 'payInstallTimes',
                        width: 150
                        // sortable: true
                    },
                ],
                data: [

                ],
                searchForm: {
                    source: '0',
                    creativeid:'',
                    clientid:'',
                    gameid: parseInt(this.getStore('gameid')),
                    day: '7',
                    os: '0',
                    page:1
                },
                total: 0,
                games: [],
                sharePayResultTypesCC: [],
                creatives:[],
                clients:[],
                clientmap:[],
                creativemap:[],
                surveyOneLine: {},
                davChart: {},
                chartData: [],
                map_pieChartD: {},
                map_pieChartI: {},
                datas: [],
                key:'all',
                showcreative:false,
                showclient:false,
                showcc:true
            };
        },
        methods: {
            init() {
                this.queryAllServer();
            },
            handleSearch() {
                this.queryAllServer();
            },
            queryAllServer() {
                this.columnspro = JSON.parse(JSON.stringify(this.columns));
                if(this.searchForm.day!=0&&this.searchForm.day!=1){
                    this.handleColumns(3)
                }
                if(this.searchForm.os == 0&&this.searchForm.clientid ==''&&this.searchForm.creative ==null){
                    this.handleColumns(2)
                }
                if(this.searchForm.clientid ==''){
                    this.handleColumns(1)
                }
                if(this.searchForm.creative == null){
                    this.handleColumns(4)
                }
                queryAllPayReq(this.searchForm).then(res => {
                    // this.loading = false;
                    if (res.success) {
                        this.sharePayResultTypesCC = res.sharePayResultTypesCC;
                        this.creatives = res.creatives;
                        this.clients = res.clients;
                        //
                        this.creativemap = (res.creatives).map(item => ({
                            key: item.creativeid,
                            name: item.creativeName,
                        }));
                        let allObject = new Object();
                        allObject.key = '0';
                        allObject.name = '全渠道';
                        this.creativemap.unshift(allObject);
                        let creativeMap = new Map();
                        this.creativemap.forEach((item, index) => {
                            creativeMap.set(item.key, item.name)
                        })
                        //
                        this.clientmap = (res.clients).map(item =>({
                            key:item.serverid,
                            name:item.serverName,
                        }));
                        let allObject2 = new Object();
                        allObject2.key = '-1'
                        allObject2.name = '所有服'
                        this.clientmap.unshift(allObject2);
                        let clientMap = new Map();
                        this.clientmap.forEach((item, indx) => {
                            clientMap.set(item.key, item.name)
                        })

                        this.data = this.tableDataProcess(res.msg,creativeMap,clientMap);
                        this.sharePayResultTypesCC = this.tableDataProcess(res.sharePayResultTypesCC,creativeMap,clientMap);

                        let datac = [];
                        this.data.forEach(item=>{
                            datac.push(item.installNum);
                        });
                        this.datas = this.f2DI(datac,this.searchForm.day, this.data,0);
                        this.onRowTap(this.sharePayResultTypesCC[1]);
                        this.surveyOneLine.changeData(this.datas);

                    }
                });
            },
            showclients(val) {
                if (val=='all'){
                    this.showcreative=false;
                    this.showclient=false;
                    this.showcc=true;
                    delete this.searchForm.creative;
                    this.searchForm.clientid='';
                    this.handleSearch();
                }else if(val=='creative'){
                    this.showcreative=true;
                    this.showclient=false;
                    this.showcc=false;
                    this.searchForm.creative = '0';
                    this.searchForm.clientid='';
                    this.handleSearch();
                }else {
                    this.showcreative=false;
                    this.showclient=true;
                    this.showcc=false;
                    delete this.searchForm.creative;
                    this.searchForm.clientid = '-1';
                    this.handleSearch();
                }
            },
            handleColumns(access) {
                this.columnspro.map((item, index) => {
                    let checkAccess = item.checkAccess
                    if(checkAccess){
                        if (checkAccess - Number(access) == 0) {
                            this.columnspro.splice(index, 1)
                        } else {
                            console.log(index)
                        }
                    }
                })
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
            onRowTap(currentRow, oldCurrentRow){
                let msg = [];
                let b = JSON.parse(JSON.stringify(this.sharePayResultTypesCC));
                b.forEach(item =>{
                    if(item.ds == currentRow.ds){
                        var a ={os:item.os,dauNum:item.dauNum,installNum:item.installNum};
                        msg.push(a);
                    }
                })
                this.chartData = this.makePieChart(msg);
                this.davChart.changeData(this.chartData);
                this.installChart.changeData(this.chartData);
            },
            tableDataProcess(data, creativeMap, clientMap){
                if (data) {
                    data.forEach((item) => {
                        item.ds = this.weekFunction(item.ds);
                        item.client = clientMap.get(String(item.clientid)) === undefined ? item.client : clientMap.get(String(item.clientid));
                        item.creative = creativeMap.get(item.creative) === undefined ? item.creative : creativeMap.get(item.creative);
                        item.payInstallRate = item.installNum == 0 ? 0 : (item.payInstallCount * 100 / item.installNum).toFixed(2) + "%";
                        item.payInstallAmount = item.payInstallAmount / this.getStore("currencyRate");
                        item.payInstallARPU = item.installNum == 0 ? 0 : (item.payInstallAmount / item.installNum).toFixed(2);
                        item.payInstallARPPU = item.payInstallCount == 0 ? 0 : (item.payInstallAmount / item.payInstallCount).toFixed(2);

                    })
                }
                return data;
            },
        },
        mounted() {
            this.init();
            this.roundChart();
            this.surveyOneLineChart();
        }
    }
</script>

<style scoped>
    .roundChart {
        display: flex;
        justify-content: space-around;
    }
</style>
