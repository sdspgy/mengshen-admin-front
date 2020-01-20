<template>
    <div>
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
            <Form-item label="游戏ID" prop="gameid"><Input type="text" v-model="searchForm.gameid" clearable
                                                         placeholder="请输入游戏id" style="width: 200px"/></Form-item>
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
        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        <Row>
            <Table :loading="loading" border :columns="columnspro" :data="data"   sortable="custom" ref="table"></Table>
            <!-- <Table :columns="exportColumns" :data="exportData" ref="exportTable" style="display:none"></Table> -->
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
                        title: '日期',
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
                data: [

                ],
                searchForm: {
                    source: '0',
                    creativeid:'',
                    clientid:'',
                    gameid: 1,
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
                key:'all',
                showcreative:false,
                showclient:false
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
                        //
                        this.clientmap = (res.clients).map(item =>({
                            key:item.serverid,
                            name:item.serverName,
                        }));
                        let allObject2 = new Object();
                        allObject2.key = '-1'
                        allObject2.name = '所有服'
                        this.clientmap.unshift(allObject2);

                        this.data = this.tableDataProcess(res.msg);
                    }
                });
            },
            showclients(val) {
                debugger
                if (val=='all'){
                    this.showcreative=false;
                    this.showclient=false;
                    delete this.searchForm.creative;
                    this.searchForm.clientid='';
                }else if(val=='creative'){
                    this.showcreative=true;
                    this.showclient=false;
                    this.searchForm.creative = '0';
                    this.searchForm.clientid='';
                }else {
                    this.showcreative=false;
                    this.showclient=true;
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
            tableDataProcess(data){
                if (data) {
                    data.forEach((item) => {
                        debugger
                        item.payInstallRate = item.installNum == 0 ? 0 : (item.payInstallCount * 100 / item.installNum).toFixed(2) + "%";
                        item.payInstallARPU = item.installNum == 0 ? 0 : (item.payInstallAmount / item.installNum).toFixed(2);
                        item.payInstallARPPU = item.payInstallCount == 0 ? 0 : (item.payInstallAmount / item.payInstallCount).toFixed(2);
                    })
                }
                return data;
            },
        },
        mounted() {
            this.init();
        }
    }
</script>

<style scoped>

</style>
