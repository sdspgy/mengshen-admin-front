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
            <Form-item label="渠道码" prop="creativeid"><Input type="text" v-model="searchForm.creativeid" clearable
                                                            placeholder="请输入渠道码" style="width: 200px"/></Form-item>
        </Form>
        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        <Button style="margin: 10px 10px;" @click="add" type="primary" icon="md-add"
                v-show="this.$route.meta.permTypes.includes('add')">添加渠道
        </Button>
        <Row>
            <Table :loading="loading" border :columns="columns" :data="data" sortable="custom" ref="table"></Table>
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
        <Modal :title="modalTitle" v-model="creativeModalVisible" :mask-closable="false" :width="500">
            <Form ref="creativeForm" :model="creativeForm" :label-width="80" :rules="creativeFormValidate">
                <!--                <FormItem label="游戏ID" prop="gameid"><Input v-model="creativeForm.gameid" placeholder=""/></FormItem>-->
                <FormItem label="游戏名称" prop="gameid">
                    <Select v-model="creativeForm.gameid" style="width:200px">
                        <Option v-for="item in games" :value="item.gameid" :key="item.gameid">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="渠道码" prop="creativeid" :error="errorCreativeid"><Input
                        v-model="creativeForm.creativeid"/></FormItem>
                <FormItem label="渠道名称" prop="creativeName" :error="errorCreativeName"><Input
                        v-model="creativeForm.creativeName"/></FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelCreative">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="submitCreative">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {queryAllCreativeReq, addCreative, editCreative, deleteCreative} from '@/api/index';

    export default {
        name: 'gameCreative',
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
                        title: '渠道码',
                        key: 'creativeid',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '渠道名称',
                        key: 'creativeName',
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
                    creativeid: '',
                    pageNumber: 1,
                    pageSize: 10
                },
                total: 0,
                submitLoading: false,
                creativeModalVisible: false,
                creativeForm: {
                    id: '',
                    gameid: '',
                    creativeid: '',
                    creativeName: ''
                },
                games: []
            };
        },
        methods: {
            init() {
                this.queryAllCreative();
            },
            handleSearch() {
                this.queryAllCreative();
            },
            queryAllCreative() {
                queryAllCreativeReq(this.searchForm).then(res => {
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
                this.queryAllCreative();
                this.clearSelectAll();
            },
            changePageSize(v) {
                this.searchForm.pageSize = v;
                this.queryAllCreative();
            },
            clearSelectAll() {
                this.$refs.table.selectAll(false);
            },
            submitCreative() {
                this.$refs.creativeForm.validate(valid => {
                    if (valid) {
                        if (this.modalType == 0) {
                            // 添加 避免编辑后传入id
                            delete this.creativeForm.id;
                            if (this.creativeForm.creativeid == '' || this.creativeForm.creativeid == undefined) {
                                this.errorCreativeid = '渠道码不能为空';
                                return;
                            }
                            if (this.creativeForm.creativeName == '' || this.creativeForm.creativeName == undefined) {
                                this.errorCreativeName = '渠道名称不能为空';
                                return;
                            }
                            this.submitLoading = true;
                            addCreative({
                                gameid: this.creativeForm.gameid,
                                creativeid: this.creativeForm.creativeid,
                                creativeName: this.creativeForm.creativeName
                            }).then(res => {
                                this.submitLoading = false;
                                if (res.success) {
                                    this.$Message.success('操作成功');
                                    this.queryAllCreative();
                                    this.creativeModalVisible = false;
                                }
                            });
                        } else {
                            // 编辑
                            this.submitLoading = true;
                            editCreative({
                                id: this.creativeForm.id,
                                gameid: this.creativeForm.gameid,
                                creativeid: this.creativeForm.creativeid,
                                creativeName: this.creativeForm.creativeName
                            }).then(res => {
                                this.submitLoading = false;
                                if (res.success) {
                                    this.$Message.success('操作成功');
                                    this.queryAllCreative();
                                    this.creativeModalVisible = false;
                                }
                            });
                        }
                    }
                });
            },
            cancelCreative() {
                this.creativeModalVisible = false;
            },
            add() {
                this.modalType = 0;
                this.modalTitle = '添加渠道';
                this.$refs.creativeForm.resetFields();
                this.creativeModalVisible = true;
            },
            edit(v) {
                this.modalType = 1;
                this.modalTitle = '编辑渠道';
                this.$refs.creativeForm.resetFields();
                // 转换null为""
                for (let attr in v) {
                    if (v[attr] == null) {
                        v[attr] = '';
                    }
                }
                let str = JSON.stringify(v);
                let data = JSON.parse(str);
                this.creativeForm = data;
                this.creativeModalVisible = true;
            },
            remove(v) {
                this.$Modal.confirm({
                    title: '确认删除',
                    content: '您确认要删除渠道名为： ' + v.creativeName + '?',
                    loading: true,
                    onOk: () => {
                        deleteCreative(v.id).then(res => {
                            this.$Modal.remove();
                            if (res.success) {
                                this.$Message.success('删除成功');
                                this.queryAllCreative();
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

<style></style>
