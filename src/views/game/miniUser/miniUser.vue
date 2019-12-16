<template>
    <div>
        <!--        <Form ref="form" :model="searchForm" inline :label-width="70" class="search-form">-->
        <!--            <Form-item label="用户名" prop="name"><Input type="text" v-model="searchForm.name" clearable-->

        <!--                                                      placeholder="请输入用户名" style="width: 200px"/></Form-item>-->
        <!--        </Form>-->
        <!--        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>-->
        <Row>
            <Table border :columns="columns" :data="data" sortable="custom" ref="table"></Table>
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
    </div>
</template>

<script>
    import {queryAllUser} from '@/api/index';

    export default {
        name: "miniUser",
        data() {
            return {
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        fixed: 'left'
                    },
                    {
                        type: 'index',
                        width: 60,
                        align: 'center',
                        fixed: 'left'
                    },
                    {
                        title: 'openID',
                        key: 'openId',
                        width: 150
                    },
                    {
                        title: '微信名',
                        key: 'name',
                        width: 150
                    },
                    {
                        title: '微信图片地址',
                        key: 'avatarUrl',
                        width: 300
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 200,
                        align: 'center',
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
                            return h('div', [editButton]);
                        }
                    }
                ],
                data: [],
                searchForm: {
                    name: '',
                    pageNumber: 1,
                    pageSize: 10
                },
                total: 0,
                submitLoading: false,
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.queryAll();
            },
            handleSearch() {
                this.queryAll();
            },
            queryAll() {
                queryAllUser(this.searchForm).then(res => {
                    if (res.success) {
                        this.data = res.msg.records;
                        this.total = res.count;
                    }
                });
            },
            changePage(v) {
                this.searchForm.pageNumber = v;
                this.queryAll();
                this.clearSelectAll();
            },
            changePageSize(v) {
                this.searchForm.pageSize = v;
                this.queryAll();
            },
            clearSelectAll() {
                this.$refs.table.selectAll(false);
            },
        }
    }
</script>

<style scoped>

</style>
