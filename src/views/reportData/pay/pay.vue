<template>
    <div>
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
            <!-- <span v-if="drop"> -->
            <Form-item label="按用户或设备" prop="source">
                <Select v-model="searchForm.source" style="width:200px">
                    <Option value="0">按用户</Option>
                    <Option value="1">按设备</Option>
                </Select>
            </Form-item>
            <Form-item label="按OS" prop="os">
                <Select v-model="searchForm.os" style="width:200px">
                    <Option value="0">all</Option>
                    <Option value="1">android</Option>
                    <Option value="2">ios</Option>
                    <Option value="-1">none</Option>
                </Select>
            </Form-item>
            <Form-item label="日期" prop="day">
                <Select v-model="searchForm.day" style="width:200px">
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
        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        <div id="surveyManyLine"></div>
        <Row>
            <Table :loading="loading" border :columns="columnspro" :data="data"   sortable="custom" ref="table"></Table>
            <!-- <Table :columns="exportColumns" :data="exportData" ref="exportTable" style="display:none"></Table> -->
        </Row>
        <Row v-if="showcc">
            <Table height="300" highlight-row border :columns="columnscc" :data="sharePayResultTypesCC"
                   ref="table"></Table>
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
                        key: 'client',
                        width: 150,
                        checkAccess: [1]
                        // sortable: true
                    },
                    {
                        title: '活跃数',
                        key: 'dauNum',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '注册数',
                        key: 'installNum',
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
                        title: '付费次数',
                        key: 'payTimes',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '安装付费人数',
                        key: 'payInstallCount',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '安装付费金额',
                        key: 'payInstallAmount',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '安装付费次数',
                        key: 'payInstallTimes',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: 'snid',
                        key: 'snid',
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
                        title: '活跃数',
                        key: 'dauNum',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '注册数',
                        key: 'installNum',
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
                        title: '付费次数',
                        key: 'payTimes',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '安装付费人数',
                        key: 'payInstallCount',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '安装付费金额',
                        key: 'payInstallAmount',
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
                        title: '安装付费次数',
                        key: 'payInstallTimes',
                        width: 150
                        // sortable: true
                    },
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
                creatives:[],
                clients:[],
                clientmap:[],
                creativemap:[],
                surveyManyLine: {},
                handelPayCount: [],
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
                queryAllPayReq(this.searchForm).then(res => {
                    // this.loading = false;
                    if (res.success) {
                        this.data = res.msg;
                        this.sharePayResultTypesCC = res.sharePayResultTypesCC;
                        this.creatives = res.creatives;
                        this.clients = res.clients;
                        this.surveyManyLine.changeData(this.handelPayCount);
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

                        this.handelPayCount = this.makeCavas(this.data, this.searchForm.day);
                        this.surveyManyLine.changeData(this.handelPayCount);
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
                }else if(val=='creative'){
                    this.showcreative=true;
                    this.showclient=false;
                    this.showcc=false;
                    this.searchForm.creative = '0';
                    this.searchForm.clientid='';
                }else {
                    this.showcreative=false;
                    this.showclient=true;
                    this.showcc=false;
                    delete this.searchForm.creative;
                    this.searchForm.clientid = '-1';
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
            tableDataProcess(data, creativeMap, clientMap){
                if (data) {
                    data.forEach((item) => {
                        item.ds = this.weekFunction(item.ds);
                        item.client = clientMap.get(String(item.clientid)) === undefined ? item.client : clientMap.get(String(item.clientid));
                        item.creative = creativeMap.get(item.creative) === undefined ? item.creative : creativeMap.get(item.creative);
                        item.payRate = item.dauNum == 0 ? 0 : (item.payCount * 100 / item.dauNum).toFixed(2) + "%";
                        item.ARPPU = item.payCount == 0 ? 0 : (item.payAmount / item.payCount).toFixed(2);
                        item.payInstallRate = item.installNum == 0 ? 0 : (item.payInstallCount * 100 / item.installNum).toFixed(2) + "%";
                        item.payInstallARPU = item.installNum == 0 ? 0 : (item.payInstallAmount / item.installNum).toFixed(2);
                        item.payInstallARPPU = item.payInstallCount == 0 ? 0 : (item.payInstallAmount / item.payInstallCount).toFixed(2);
                        item.payAmount = item.payAmount / this.getStore("currencyRate");
                        item.payInstallAmount = item.payInstallAmount / this.getStore("currencyRate");
                    })
                }
                return data;
            },
        },
        mounted() {
            this.init();
            this.surveyManyLineChart();
        }
    };
</script>

<style scoped>

</style>