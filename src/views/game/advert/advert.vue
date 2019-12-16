<template>
    <div>
        <Form ref="creativeForm" :model="searchForm" inline :label-width="70" class="search-form">
            <Form-item label="游戏ID" prop="gameid">
                <Select v-model="searchForm.gameid" style="width:200px">
                    <Option v-for="item in games" :value="item.gameid" :key="item.gameid">{{ item.name }}</Option>
                </Select>
            </Form-item>
            <!--                <Input type="text" v-model="searchForm.gameid" clearable-->
            <!--                                                         placeholder="请输入游戏id" style="width: 200px"/></Form-item>-->
            <!-- <span v-if="drop"> -->
            <Form-item label="广告码" prop="advertName"><Input type="text" v-model="searchForm.advertName" clearable
                                                            placeholder="请输入广告码" style="width: 200px"/></Form-item>
        </Form>
        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
        <Button style="margin: 10px 10px;" @click="add" type="primary" icon="md-add"
                v-show="this.$route.meta.permTypes.includes('add')">添加广告
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
        <Modal :title="modalTitle" v-model="advertModalVisible" :mask-closable="false" :width="500">
            <Form ref="advertForm" :model="advertForm" :label-width="80" :rules="advertFormValidate">
                <!--                <FormItem label="游戏ID" prop="gameid"><Input v-model="advertForm.gameid" placeholder=""/></FormItem>-->
                <!--                <FormItem label="广告码" prop="advertid" :error="errorAdvertid"><Input v-model="advertForm.advertid"/>-->
                <!--                </FormItem>-->
                <FormItem label="游戏名称" prop="gameid">
                    <Select v-model="advertForm.gameid" style="width:200px">
                        <Option v-for="item in games" :value="item.gameid" :key="item.gameid">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="广告名称" prop="advertName" :error="errorAdvertName"><Input
                        v-model="advertForm.advertName"/></FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelAdvert">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="submitAdvert">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {queryAllAdvertReq, addAdvert, editAdvert, deleteAdvert} from '@/api/index';

    export default {
        name: "advert",
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
                        title: '广告ID',
                        key: 'advertid',
                        width: 150
                        // sortable: true
                    },
                    {
                        title: '广告名称',
                        key: 'advertName',
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
                    advertName: '',
                    pageNumber: 1,
                    pageSize: 10
                },
                total: 0,
                submitLoading: false,
                advertModalVisible: false,
                advertForm: {
                    id: '',
                    gameid: '',
                    advertid: '',
                    advertName: ''
                },
                games: []
            };
        },
        methods: {
            init() {
                this.queryAllAdvert();
            },
            handleSearch() {
                this.queryAllAdvert();
            },
            queryAllAdvert() {
                queryAllAdvertReq(this.searchForm).then(res => {
                    // this.loading = false;
                    if (res.success) {
                        this.data = res.result[1].records;
                        this.games = res.result[0].records;
                        this.total = res.result[1].records.length;
                    }
                });
            },
            changePage(v) {
                this.searchForm.pageNumber = v;
                this.queryAllAdvert();
                this.clearSelectAll();
            },
            changePageSize(v) {
                this.searchForm.pageSize = v;
                this.queryAllAdvert();
            },
            clearSelectAll() {
                this.$refs.table.selectAll(false);
            },
            submitAdvert() {
                this.$refs.advertForm.validate(valid => {
                    if (valid) {
                        if (this.modalType == 0) {
                            // 添加 避免编辑后传入id
                            delete this.advertForm.id;
                            // if (this.advertForm.advertid == '' || this.advertForm.advertid == undefined) {
                            //     this.errorAdvertid = '广告码不能为空';
                            //     return;
                            // }
                            if (this.advertForm.advertName == '' || this.advertForm.advertName == undefined) {
                                this.errorAdvertName = '广告名称不能为空';
                                return;
                            }
                            this.submitLoading = true;
                            addAdvert({
                                gameid: this.advertForm.gameid,
                                advertid: this.advertForm.advertid,
                                advertName: this.advertForm.advertName
                            }).then(res => {
                                this.submitLoading = false;
                                if (res.success) {
                                    this.$Message.success('操作成功');
                                    this.queryAllAdvert();
                                    this.advertModalVisible = false;
                                }
                            });
                        } else {
                            // 编辑
                            this.submitLoading = true;
                            editAdvert({
                                id: this.advertForm.id,
                                gameid: this.advertForm.gameid,
                                advertid: this.advertForm.advertid,
                                advertName: this.advertForm.advertName
                            }).then(res => {
                                this.submitLoading = false;
                                if (res.success) {
                                    this.$Message.success('操作成功');
                                    this.queryAllAdvert();
                                    this.advertModalVisible = false;
                                }
                            });
                        }
                    }
                });
            },
            cancelAdvert() {
                this.advertModalVisible = false;
            },
            add() {
                this.modalType = 0;
                this.modalTitle = '添加广告';
                this.$refs.advertForm.resetFields();
                this.advertModalVisible = true;
            },
            edit(v) {
                this.modalType = 1;
                this.modalTitle = '编辑广告';
                this.$refs.advertForm.resetFields();
                // 转换null为""
                for (let attr in v) {
                    if (v[attr] == null) {
                        v[attr] = '';
                    }
                }
                let str = JSON.stringify(v);
                let data = JSON.parse(str);
                this.advertForm = data;
                this.advertModalVisible = true;
            },
            remove(v) {
                this.$Modal.confirm({
                    title: '确认删除',
                    content: '您确认要删除广告名为： ' + v.advertName + '?',
                    loading: true,
                    onOk: () => {
                        deleteAdvert(v.id).then(res => {
                            this.$Modal.remove();
                            if (res.success) {
                                this.$Message.success('删除成功');
                                this.queryAllAdvert();
                            }
                        });
                    }
                });
            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style scoped>

</style>
