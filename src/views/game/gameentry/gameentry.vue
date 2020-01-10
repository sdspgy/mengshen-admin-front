<template>
    <div>
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
            <!-- <Form-item label="游戏ID" prop="gameid"><Input type="text" v-model="searchForm.gameid" clearable
                                                          placeholder="请输入游戏id" style="width: 200px"/></Form-item>-->
            <!-- <span v-if="drop"> -->
            <Form-item label="游戏名" prop="name"><Input type="text" v-model="searchForm.name" clearable
                                                          placeholder="请输入游戏名" style="width: 200px"/></Form-item>
        </Form>
        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        <Button style="margin: 10px 10px;" @click="add" type="primary" icon="md-add"
                v-show="this.$route.meta.permTypes.includes('add')">添加新游戏
        </Button>
        <Row>
            <Table :loading="loading" border :columns="columns" :data="data"   sortable="custom" ref="table"></Table>
            <!-- <Table :columns="exportColumns" :data="exportData" ref="exportTable" style="display:none"></Table> -->
        </Row>
        <Row type="flex" justify="end" class="page">
            <Page
                    :current="searchForm.pageNumber"
                    :total="total"
                    :page-size="searchForm.pageSize"
                    @on-change="changePage"
                    @on-page-size-change="changePageSize"
                    :page-size-opts="[10, 20, 50]"
                    size="small"
                    show-total
                    show-elevator
                    show-sizer
            ></Page>
        </Row>

        <!-- 编辑or添加 -->
        <Modal :title="modalTitle" v-model="serverModalVisible" :mask-closable="false" :width="500">
            <Form ref="gameForm" :model="gameForm" :label-width="80" :rules="gameFormValidate">
                <!--                <FormItem label="游戏ID" prop="gameid"><Input v-model="creativeForm.gameid" placeholder=""/></FormItem>-->
                <FormItem label="id" prop="parentId" :error="errorid" v-if="hide" ><Input
                        v-model="gameForm.parentId"/></FormItem>
                <FormItem label="游戏id" prop="gameid" :error="errorGameid"><Input
                        v-model="gameForm.gameid"/></FormItem>
                <FormItem label="游戏名" prop="name" :error="errorGameName"><Input
                        v-model="gameForm.name"/></FormItem>
                <FormItem label="游戏别名" prop="alias" :error="errorAlias"><Input
                        v-model="gameForm.alias"/></FormItem>
                <FormItem label="游戏logo，服务器图片地址" prop="logo" :error="errorLogo"><Input
                        v-model="gameForm.logo"/></FormItem>
                <FormItem label="月KPI" prop="monthKpi" :error="errorMonthKpi"><Input
                        v-model="gameForm.monthKpi"/></FormItem>
                <FormItem label="年KPI" prop="yearKpi" :error="errorYearKpi"><Input
                        v-model="gameForm.yearKpi"/></FormItem>
                <FormItem label="当月总收入" prop="currMonthKpi" :error="errorCurrMonthKpi"><Input
                        v-model="gameForm.currMonthKpi"/></FormItem>
                <FormItem label="当年总收入" prop="currYearKpi" :error="errorCurrYearKpi"><Input
                        v-model="gameForm.currYearKpi"/></FormItem>
                <FormItem label="货币类型" prop="currency" :error="errorCurrency"><Input
                        v-model="gameForm.currency"/></FormItem>
                <FormItem label="货币汇率（相较RMB)" prop="currencyRate" :error="errorCurrencyRate"><Input
                        v-model="gameForm.currencyRate"/></FormItem>
                <FormItem label="是否开启etl" prop="stats" :error="errorSstats"><Input
                        v-model="gameForm.stats"/></FormItem>
                <FormItem label="世界时区" prop="timeZone" :error="errorTimeZone"><Input
                        v-model="gameForm.timeZone"/></FormItem>
                <FormItem label="安装总用户" prop="install" :error="errorInstall"><Input
                        v-model="gameForm.install"/></FormItem>
                <FormItem label="付费总额" prop="payAmount" :error="errorPayAmount"><Input
                        v-model="gameForm.payAmount"/></FormItem>
                <FormItem label="统计几日留存 0 不开启日志统计" prop="retention"><Input
                        v-model="gameForm.retention"/></FormItem>
                <FormItem label="上线时间" prop="onlineDate" :error="errorOnlineDate">
                    <DatePicker v-model="gameForm.onlineDate"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm:ss"
                                placeholder="请选择时间日期"
                                style="width: 200px">
                    </DatePicker>
                </FormItem>
                <FormItem label="etl触发时间" prop="etlTriggerTime" :error="EtlTriggerTime">
                    <DatePicker v-model="gameForm.etlTriggerTime"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm:ss"
                                placeholder="请选择时间日期"
                                style="width: 200px">
                    </DatePicker>
                </FormItem>
                <FormItem label="etl触发id" prop="etlTriggerId"><Input
                        v-model="gameForm.etlTriggerId"/></FormItem>
                <FormItem label="etl当前状态" prop="etlStatus"><Input
                        v-model="gameForm.etlStatus"/></FormItem>
                <FormItem label="统计优先级" prop="etlOrder"><Input
                        v-model="gameForm.etlOrder"/></FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelServer">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="submitServer">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {queryAllGameReq, addGame, editGame, deleteGame} from '@/api/index';

    export default {
        name: 'game',
        comments: {},
        data() {
            return {
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        fixed: 'left'
                    },
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
                        title: '游戏ID',
                        key: 'gameid',
                        width: 150
                        // sortable: true,
                        // fixed: 'left'
                    },
                    {
                        title: '游戏名',
                        key: 'name',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '游戏别名',
                        key: 'alias',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '游戏logo，服务器图片地址',
                        key: 'logo',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '月KPI',
                        key: 'monthKpi',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '年KPI',
                        key: 'yearKpi',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '当前月总收入',
                        key: 'currMonthKpi',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '当年总收入',
                        key: 'currYearKpi',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '货币类型',
                        key: 'currency',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '货币汇率',
                        key: 'currencyRate',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '是否开启etl',
                        key: 'stats',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '世界时区',
                        key: 'timeZone',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '安装总用户',
                        key: 'install',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '付费总额',
                        key: 'payAmount',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '统计几日留存',
                        key: 'retention',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '上线时间',
                        key: 'onlineDate',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: 'etl触发时间',
                        key: 'etlTriggerTime',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: 'etl触发id',
                        key: 'etlTriggerId',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: 'etl当前状态',
                        key: 'etlStatus',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '统计优先级',
                        key: 'etlOrder',
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
                    {
                        title: '操作',
                        key: 'action',
                        width: 200,
                        align: 'center',
                        // fixed: 'right',
                        render: (h, params) => {
                            let enableOrDisable = '';
                            let editButton = h(
                                'Button',
                                {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled: !this.$route.meta.permTypes.includes('edit')
                                    },
                                    style: {marginRight: '5px'},
                                    on: {
                                        click: () => {
                                            this.edit(params.row);
                                        }
                                    }
                                },
                                '编辑'
                            );
                            let deleteButton = h(
                                'Button',
                                {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        disabled: !this.$route.meta.permTypes.includes('delete')
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row);
                                        }
                                    }
                                },
                                '删除'
                            );
                            return h('div', [editButton, deleteButton]);
                        }
                    }
                ],
                data: [],
                searchForm: {
                    gameid: '',
                    name: '',
                    pageNumber: 1,
                    pageSize: 10
                },
                total: 0,
                submitLoading: false,
                serverModalVisible: false,
                gameForm: {
                    parentId: '',
                    gameid: '',
                    name: '',
                    alias: '',
                    logo: '',
                    monthKpi: '',
                    yearKpi: '',
                    currMonthKpi: '',
                    currYearKpi: '',
                    currency: '',
                    currencyRate: '',
                    stats: '',
                    timeZone: '',
                    install: '',
                    payAmount: '',
                    retention: '',
                    onlineDate: new Date(),
                    etlTriggerTime: new Date(),
                    etlTriggerId: '',
                    etlStatus: '',
                    etlOrder: ''
                },
                hide:false,
                games: []
            };
        },
        methods: {
            init() {
                this.queryAllGame();
            },
            handleSearch() {
                this.queryAllGame();
            },
            queryAllGame() {
                queryAllGameReq(this.searchForm).then(res => {
                    // this.loading = false;
                    if (res.success) {
                        this.data = res.result.records;
                        this.games = res.result.records;
                        this.total = res.result.total;
                    }
                });
            },
            changePage(v) {
                this.searchForm.pageNumber = v;
                this.queryAllGame();
                this.clearSelectAll();
            },
            changePageSize(v) {
                this.searchForm.pageSize = v;
                this.queryAllGame();
            },
            clearSelectAll() {
                this.$refs.table.selectAll(false);
            },
            submitServer() {
                this.$refs.gameForm.validate(valid => {
                    if (valid) {
                        if (this.modalType == 0) {
                            // 添加 避免编辑后传入id
                            if (this.gameForm.parentId == '' || this.gameForm.parentId == undefined) {
                                this.errorid = '编号id不能为空';
                                return;
                            }
                            if (this.gameForm.gameid == '' || this.gameForm.gameid == undefined) {
                                this.errorGameid = '游戏id不能为空';
                                return;
                            }
                            if (this.gameForm.name == '' || this.gameForm.name == undefined) {
                                this.errorGameName = '游戏名不能为空';
                                return;
                            }
                            if (this.gameForm.alias == '' || this.gameForm.alias == undefined) {
                                this.errorAlias = '游戏别名不能为空';
                                return;
                            }
                            if (this.gameForm.logo == '' || this.gameForm.logo == undefined) {
                                this.errorLogo = '游戏Logo不能为空';
                                return;
                            }
                            if (this.gameForm.monthKpi == '' || this.gameForm.monthKpi == undefined) {
                                this.errorMonthKpi = '游戏月KPI不能为空';
                                return;
                            }
                            if (this.gameForm.yearKpi == '' || this.gameForm.yearKpi == undefined) {
                                this.errorYearKpi = '游戏年KPI不能为空';
                                return;
                            }
                            if (this.gameForm.currMonthKpi == '' || this.gameForm.currMonthKpi == undefined) {
                                this.errorCurrMonthKpi = '游戏当月总收入不能为空';
                                return;
                            }
                            if (this.gameForm.currYearKpi == '' || this.gameForm.currYearKpi == undefined) {
                                this.errorCurrYearKpi = '游戏当年总收入不能为空';
                                return;
                            }
                            if (this.gameForm.currency == '' || this.gameForm.currency == undefined) {
                                this.errorCurrency = '游戏货币类型不能为空';
                                return;
                            }
                            if (this.gameForm.currencyRate == '' || this.gameForm.currencyRate == undefined) {
                                this.errorCurrencyRate = '游戏货币汇率不能为空';
                                return;
                            }
                            if (this.gameForm.stats == '' || this.gameForm.stats == undefined) {
                                this.errorSstats = '游戏是否开启elt状态不能为空';
                                return;
                            }
                            if (this.gameForm.timeZone == '' || this.gameForm.timeZone == undefined) {
                                this.errorTimeZone = '游戏世界时区不能为空';
                                return;
                            }
                            if (this.gameForm.install == '' || this.gameForm.install == undefined) {
                                this.errorInstall = '游戏总安装数不能为空';
                                return;
                            }
                            if (this.gameForm.payAmount == '' || this.gameForm.payAmount == undefined) {
                                this.errorPayAmount = '游戏总付费额不能为空';
                                return;
                            }
                            if (this.gameForm.onlineDate == '' || this.gameForm.onlineDate == undefined) {
                                this.errorOnlineDate = '游戏上线时间不能为空';
                                return;
                            }
                            if (this.gameForm.etlTriggerTime == '' || this.gameForm.etlTriggerTime == undefined) {
                                this.EtlTriggerTime = '游戏elt触发时间不能为空';
                                return;
                            }
                            this.submitLoading = true;
                            addGame({
                                parentId: this.gameForm.parentId,
                                gameid: this.gameForm.gameid,
                                name: this.gameForm.name,
                                alias: this.gameForm.alias,
                                logo: this.gameForm.alias,
                                monthKpi: this.gameForm.monthKpi,
                                yearKpi: this.gameForm.yearKpi,
                                currMonthKpi: this.gameForm.currMonthKpi,
                                currYearKpi: this.gameForm.currYearKpi,
                                currency: this.gameForm.currency,
                                currencyRate: this.gameForm.currencyRate,
                                stats: this.gameForm.stats,
                                timeZone: this.gameForm.timeZone,
                                install: this.gameForm.install,
                                payAmount: this.gameForm.payAmount,
                                retention: this.gameForm.retention,
                                onlineDate: this.gameForm.onlineDate,
                                etlTriggerTime: this.gameForm.etlTriggerTime,
                                etlTriggerId: this.gameForm.etlTriggerId,
                                etlStatus: this.gameForm.etlStatus,
                                etlOrder: this.gameForm.etlOrder
                            }).then(res => {
                                this.submitLoading = false;
                                if (res.success) {
                                    this.$Message.success('操作成功');
                                    this.queryAllGame();
                                    this.serverModalVisible = false;
                                }
                            });
                        } else {
                            // 编辑
                            this.submitLoading = true;
                            editGame({
                                parentId: this.gameForm.parentId,
                                gameid: this.gameForm.gameid,
                                name: this.gameForm.name,
                                alias: this.gameForm.alias,
                                logo: this.gameForm.alias,
                                monthKpi: this.gameForm.monthKpi,
                                yearKpi: this.gameForm.yearKpi,
                                currMonthKpi: this.gameForm.currMonthKpi,
                                currYearKpi: this.gameForm.currYearKpi,
                                currency: this.gameForm.currency,
                                currencyRate: this.gameForm.currencyRate,
                                stats: this.gameForm.stats,
                                timeZone: this.gameForm.timeZone,
                                install: this.gameForm.install,
                                payAmount: this.gameForm.payAmount,
                                retention: this.gameForm.retention,
                                onlineDate: this.gameForm.onlineDate,
                                etlTriggerTime: this.gameForm.etlTriggerTime,
                                etlTriggerId: this.gameForm.etlTriggerId,
                                etlStatus: this.gameForm.etlStatus,
                                etlOrder: this.gameForm.etlOrder
                            }).then(res => {
                                this.submitLoading = false;
                                if (res.success) {
                                    this.$Message.success('操作成功');
                                    this.queryAllGame();
                                    this.serverModalVisible = false;
                                }
                            });
                        }
                    }
                });
            },
            cancelAdvert() {
                this.serverModalVisible = false;
            },
            add() {
                this.modalType = 0;
                this.modalTitle = '添加游戏';
                this.$refs.gameForm.resetFields();
                this.serverModalVisible = true;
                this.hide = true;
            },
            edit(v) {
                this.modalType = 1;
                this.modalTitle = '编辑游戏';
                this.$refs.gameForm.resetFields();
                // 转换null为""
                for (let attr in v) {
                    if (v[attr] == null) {
                        v[attr] = '';
                    }
                }
                let str = JSON.stringify(v);
                let data = JSON.parse(str);
                this.gameForm = data;
                this.serverModalVisible = true;
                this.hide = false;
            },
            remove(v) {
                this.$Modal.confirm({
                    title: '确认删除',
                    content: '您确认要删除游戏名为： ' + v.name + '?',
                    loading: true,
                    onOk: () => {
                        deleteGame(v.parentId).then(res => {
                            this.$Modal.remove();
                            if (res.success) {
                                this.$Message.success('删除成功');
                                this.queryAllGame();
                            }
                        });
                    }
                });
            }
        },
        mounted() {
            this.init();
        }
    };
</script>

<style scoped>

</style>
