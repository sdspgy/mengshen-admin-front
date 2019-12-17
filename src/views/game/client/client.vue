<template>
    <div>
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
            <!-- <Form-item label="游戏ID" prop="gameid"><Input type="text" v-model="searchForm.gameid" clearable
                                                          placeholder="请输入游戏id" style="width: 200px"/></Form-item>-->
            <!-- <span v-if="drop"> -->
            <Form-item label="游戏ID" prop="gameid">
                <Select v-model="searchForm.gameid" style="width:200px">
                    <Option v-for="item in games" :value="item.gameid" :key="item.gameid">{{ item.name }}</Option>
                </Select>
            </Form-item>
            <Form-item label="分服码" prop="serverid"><Input type="text" v-model="searchForm.serverid" clearable
                                                            placeholder="请输入分服码" style="width: 200px"/></Form-item>
        </Form>
        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        <Button style="margin: 10px 10px;" @click="add" type="primary" icon="md-add"
                v-show="this.$route.meta.permTypes.includes('add')">添加新服
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
            <Form ref="serverForm" :model="serverForm" :label-width="80" :rules="serverFormValidate">
                <!--                <FormItem label="游戏ID" prop="gameid"><Input v-model="creativeForm.gameid" placeholder=""/></FormItem>-->
                <FormItem label="游戏名称" prop="gameid">
                    <Select v-model="serverForm.gameid" style="width:200px">
                        <Option v-for="item in games" :value="item.gameid" :key="item.gameid">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="分服码" prop="serverid" :error="errorServerid"><Input
                        v-model="serverForm.serverid"/></FormItem>
                <FormItem label="分服名称" prop="serverName" :error="errorServerName"><Input
                        v-model="serverForm.serverName"/></FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelServer">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="submitServer">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {queryAllClientReq, addClient, editClient, deleteClient} from '@/api/index';

    export default {
        name: 'gameServer',
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
                        title: '分服码',
                        key: 'serverid',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '分服名称',
                        key: 'serverName',
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
                    serverid: '',
                    pageNumber: 1,
                    pageSize: 10
                },
                total: 0,
                submitLoading: false,
                serverModalVisible: false,
                serverForm: {
                    id: '',
                    gameid: '',
                    serverid: '',
                    serverName: ''
                },
                games: []
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
                queryAllClientReq(this.searchForm).then(res => {
                    debugger
                    // this.loading = false;
                    if (res.success) {
                        this.data = res.result[1].records;
                        this.games = res.result[0].records;
                        this.total = res.result.total;
                    }
                });
            },
            changePage(v) {
                this.searchForm.pageNumber = v;
                this.queryAllServer();
                this.clearSelectAll();
            },
            changePageSize(v) {
                this.searchForm.pageSize = v;
                this.queryAllServer();
            },
            clearSelectAll() {
                this.$refs.table.selectAll(false);
            },
            submitAdvert() {
                debugger
                this.$refs.serverForm.validate(valid => {
                    if (valid) {
                        if (this.modalType == 0) {
                            // 添加 避免编辑后传入id
                            delete this.serverForm.id;
                            if (this.serverForm.serverid == '' || this.serverForm.serverid == undefined) {
                                this.errorServerid = '分服码不能为空';
                                return;
                            }
                            if (this.serverForm.serverName == '' || this.serverForm.serverName == undefined) {
                                this.errorServerName = '分服名称不能为空';
                                return;
                            }
                            this.submitLoading = true;
                            addClient({
                                gameid: this.serverForm.gameid,
                                serverid: this.serverForm.serverid,
                                serverName: this.serverForm.serverName
                            }).then(res => {
                                this.submitLoading = false;
                                if (res.success) {
                                    this.$Message.success('操作成功');
                                    this.queryAllServer();
                                    this.serverModalVisible = false;
                                }
                            });
                        } else {
                            // 编辑
                            this.submitLoading = true;
                            editClient({
                                id: this.serverForm.id,
                                gameid: this.serverForm.gameid,
                                serverid: this.serverForm.creativeid,
                                serverName: this.serverForm.creativeName
                            }).then(res => {
                                this.submitLoading = false;
                                if (res.success) {
                                    this.$Message.success('操作成功');
                                    this.queryAllServer();
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
                this.modalTitle = '添加分服';
                this.$refs.serverForm.resetFields();
                this.serverModalVisible = true;
            },
            edit(v) {
                this.modalType = 1;
                this.modalTitle = '编辑分服';
                this.$refs.serverForm.resetFields();
                // 转换null为""
                for (let attr in v) {
                    if (v[attr] == null) {
                        v[attr] = '';
                    }
                }
                let str = JSON.stringify(v);
                let data = JSON.parse(str);
                this.serverForm = data;
                this.serverModalVisible = true;
            },
            remove(v) {
                this.$Modal.confirm({
                    title: '确认删除',
                    content: '您确认要删除分服名为： ' + v.serverName + '?',
                    loading: true,
                    onOk: () => {
                        deleteClient(v.id).then(res => {
                            this.$Modal.remove();
                            if (res.success) {
                                this.$Message.success('删除成功');
                                this.queryAllServer();
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