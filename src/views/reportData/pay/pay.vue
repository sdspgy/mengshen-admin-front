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
                <Select v-model="searchForm.day"  @on-change="handleSearch" style="width:200px">
                    <Option value="0">今天</Option>
                    <Option value="1">昨天</Option>
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
        <div id="surveyManyLine"></div>
        <Row>
            <Table :loading="loading" border :columns="columnspro" :data="data"  height="300" sortable="custom" ref="table"></Table>
            <!-- <Table :columns="exportColumns" :data="exportData" ref="exportTable" style="display:none"></Table> -->
        </Row>
        <Row v-if="showcc">
            <Table height="300" highlight-row border :columns="columnsrrpc" :data="retentionTitlestable"
                   ref="table"></Table>
        </Row>
        <div class="roundChart" v-if="showcc">
            <div id="davChart"></div>
            <div id="installChart"></div>
        </div>
        <Row v-if="showcc">
            <Table height="300" highlight-row border :columns="columnscc" :data="sharePayResultTypesCC" ref="tablecc" @on-current-change=onRowTap></Table>
        </Row>
    </div>
</template>

<script>
    import {queryAllPayReq,queryAllregisteredRevenuePercentageReq} from '@/api/index';

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
                        key: 'client',
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
                        title: '活跃数',
                        key: 'dauNum',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '付费人数',
                        key: 'payCount',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '付费金额',
                        key: 'payAmount',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '付费率',
                        key: 'payRate',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: 'ARPU',
                        key: 'ARPU',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: 'ARPPU',
                        key: 'ARPPU',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '注册付费率',
                        key: 'payInstallRate',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '注册付费人数',
                        key: 'payInstallCount',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '注册付费金额',
                        key: 'payInstallAmount',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '注付ARPU',
                        key: 'payInstallARPU',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '注付ARPPU',
                        key: 'payInstallARPPU',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '付费次数',
                        key: 'payTimes',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '注册付费次数',
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
                columnscc: [
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
                        title: '注册数',
                        key: 'installNum',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '活跃数',
                        key: 'dauNum',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '付费人数',
                        key: 'payCount',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '付费金额',
                        key: 'payAmount',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '付费率',
                        key: 'payRate',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: 'ARPU',
                        key: 'ARPU',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: 'ARPPU',
                        key: 'ARPPU',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '注册付费率',
                        key: 'payInstallRate',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '注册付费人数',
                        key: 'payInstallCount',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '注册付费金额',
                        key: 'payInstallAmount',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '注付ARPU',
                        key: 'payInstallARPU',
                        width: 150
                        // sortable: true
                    },{
                        title: '注付ARPPU',
                        key: 'payInstallARPPU',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '付费次数',
                        key: 'payTimes',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '注册付费次数',
                        key: 'payInstallTimes',
                        width: 150
                        // sortable: true
                    },
                ],
                columnsrrpc:[
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
                        // sortable: true
                    },
                    {
                        title: '注册数',
                        key: 'dr',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '1日',
                        key: '0day',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '2日',
                        key: '1day',
                        width: 150
                    },
                    {
                        title: '3日',
                        key: '2day',
                        width: 150
                    },
                    {
                        title: '4日',
                        key: '3day',
                        width: 150
                    },
                    {
                        title: '5日',
                        key: '4day',
                        width: 150
                    },
                    {
                        title: '6日',
                        key: '5day',
                        width: 150
                    },
                    {
                        title: '7日',
                        key: '6day',
                        width: 150
                    },
                    {
                        title: '8日',
                        key: '7day',
                        width: 150
                    },
                    {
                        title: '9日',
                        key: '8day',
                        width: 150
                    },
                    {
                        title: '10日',
                        key: '9day',
                        width: 150
                    },
                    {
                        title: '11日',
                        key: '10day',
                        width: 150
                    },
                    {
                        title: '12日',
                        key: '11day',
                        width: 150
                    },
                    {
                        title: '13日',
                        key: '12day',
                        width: 150
                    },
                    {
                        title: '14日',
                        key: '13day',
                        width: 150
                    },
                    {
                        title: '15日',
                        key: '14day',
                        width: 150
                    },
                    {
                        title: '16日',
                        key: '15day',
                        width: 150
                    },
                    {
                        title: '17日',
                        key: '16day',
                        width: 150
                    },
                    {
                        title: '18日',
                        key: '17day',
                        width: 150
                    },
                    {
                        title: '19日',
                        key: '18day',
                        width: 150
                    },
                    {
                        title: '20日',
                        key: '19day',
                        width: 150
                    },
                    {
                        title: '21日',
                        key: '20day',
                        width: 150
                    },
                    {
                        title: '22日',
                        key: '21day',
                        width: 150
                    },
                    {
                        title: '23日',
                        key: '22day',
                        width: 150
                    },
                    {
                        title: '24日',
                        key: '23day',
                        width: 150
                    },
                    {
                        title: '25日',
                        key: '24day',
                        width: 150
                    },
                    {
                        title: '26日',
                        key: '25day',
                        width: 150
                    },
                    {
                        title: '27日',
                        key: '26day',
                        width: 150
                    },
                    {
                        title: '28日',
                        key: '27day',
                        width: 150
                    },
                    {
                        title: '29日',
                        key: '28day',
                        width: 150
                    },
                    {
                        title: '30日',
                        key: '29day',
                        width: 150
                    }
                ],
                data: [],
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
                retentionTitlestable:[],
                creatives:[],
                clients:[],
                clientmap:[],
                creativemap:[],
                surveyManyLine: {},
                handelPayCount: [],
                davChart: {},
                chartData: [],
                map_pieChartD: {},
                map_pieChartI: {},
                key:'all',
                showcreative:false,
                showclient:false,
                showcc:true,
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
                if(this.searchForm.os == 0){
                    this.columnsrrpc.map((item, index) => {
                        let checkAccess = item.checkAccess
                        if(checkAccess){
                            if (checkAccess - Number(2) == 0) {
                                this.columnsrrpc.splice(index, 1)
                            } else {
                                console.log(index)
                            }
                        }
                    })
                }
                queryAllPayReq(this.searchForm).then(res => {
                    // this.loading = false;
                    if (res.success) {
                        this.data = res.msg;
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

                        this.tableDataProcess(this.data,creativeMap,clientMap);
                        this.tableDataProcess(this.sharePayResultTypesCC,creativeMap,clientMap);
                        this.onRowTap(this.sharePayResultTypesCC[1]);

                        this.handelPayCount = this.makeCavas(this.data, this.searchForm.day);
                        this.surveyManyLine.changeData(this.handelPayCount);
                        // debugger
                        // let a=this.chartData;
                        // this.davChart.changeData(this.chartData);
                        // this.installChart.changeData(this.chartData);
                    }
                });
                var searchFormtwo = {gameid: this.searchForm.gameid, day: this.searchForm.day, os: this.searchForm.os};
                queryAllregisteredRevenuePercentageReq(searchFormtwo).then(res =>{
                    if (res.success) {
                        let retentionTitlestable = res.msg;
                        let retentionTitlestableOS = res.msgOS

                        if (this.searchForm.os == "0") {
                                this.retentionTitlestable=this.tableDataProcessb(retentionTitlestable);
                        } else {
                            this.retentionTitlestable=this.tableDataProcessb(retentionTitlestableOS);
                        }
                    }
                })

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
            tableDataProcessb: function (data) {
                if(data) {
                    let bArray = [];
                    for (let key in data) {
                        let bObj = {};
                        bObj.ds =  this.weekFunction(data[key][0].ds);
                        for (let i = 0; i <= 29; i++) {
                            bObj[i + 'day'] = 0;
                        }
                        data[key].forEach(item => {
                            bObj.dr = item.dr;
                            if(item.os){
                                bObj.os = item.os;
                            };
                            for (let i = item.date; i <= item.day; i++) {
                                bObj[i + 'day'] = item.income;
                            }
                        })
                        bArray.push(bObj)
                    }
                    data = bArray
                }
                return data;
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
                        item.payRate = item.dauNum == 0 ? 0 : (item.payCount * 100 / item.dauNum).toFixed(2) + "%";
                        item.payAmount = Number(item.payAmount) / this.getStore("currencyRate");
                        item.ARPU = item.dauNum == 0 ? 0 : (Number(item.payAmount) / item.dauNum).toFixed(2);
                        item.ARPPU = item.payCount == 0 ? 0 : (Number(item.payAmount) / item.payCount).toFixed(2);
                        item.payInstallRate = item.installNum == 0 ? 0 : (item.payInstallCount * 100 / item.installNum).toFixed(2) + "%";
                        item.payInstallAmount =  Number(item.payInstallAmount) / this.getStore("currencyRate");
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
            this.surveyManyLineChart();
        }
    };
</script>

<style scoped>
    .roundChart {
        display: flex;
        justify-content: space-around;
    }
</style>