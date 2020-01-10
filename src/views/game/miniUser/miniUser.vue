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

        <Modal
                :title="modalTitle"
                v-model="ModalVisible"
                :mask-closable="false"
                :width="500"
                :styles="{top: '30px'}"
        >
            <Form ref="userForm" :model="userForm" :label-width="70">
                <!--                <FormItem label="角色分配" prop="roles">-->
                <!--                    <Select v-model="userForm.roles" multiple>-->
                <!--                        <Option v-for="item in roleList" :value="item.id" :key="item.id" :label="item.name">-->
                <!--                            <span style="margin-right:10px;">{{ item.name }}</span>-->
                <!--                            &lt;!&ndash;                            <span style="color:#ccc;">{{ item.description }}</span>&ndash;&gt;-->
                <!--                        </Option>-->
                <!--                    </Select>-->
                <!--                </FormItem>-->
                <FormItem label="角色分配" prop="roles">
                    <Select v-model="userForm.roles" style="width:200px">
                        <Option v-for="item in roleList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="ModalVisible = false">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="submitMiniUser">提交</Button>
            </div>
        </Modal>

        <Modal
                :title="modalGrantTitle"
                v-model="ModalVisibleGrant"
                :mask-closable="false"
                :width="500"
                :styles="{top: '30px'}"
        >
            <Form ref="gameForm" :model="gameForm" :label-width="70">
                <FormItem label="游戏分配" prop="games">
                    <Select v-model="gameForm.games" multiple>
                        <Option v-for="item in games" :value="item.id" :key="item.id" :label="item.name">
                            <span style="margin-right:10px;">{{ item.name }}</span>
                        </Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="ModalVisibleGrant = false">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="submitMiniGrant">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {queryAllUser, getAllMiniRoleList, editMiniUser, getAllGame, editMiniUserGrant} from '@/api/index';

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
                    // {
                    //     title: '微信图片地址',
                    //     key: 'avatarUrl',
                    //     width: 300
                    // },
                    {
                        title: "头像",
                        key: "avatarUrl",
                        width: 80,
                        align: "center",
                        render: (h, params) => {
                            return h("Avatar", {
                                props: {
                                    src: params.row.avatarUrl
                                }
                            });
                        }
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
                                '角色分配'
                            );
                            let grantButton = h(
                                'Button',
                                {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled: !this.$route.meta.permTypes.includes('add')
                                    },
                                    style: {marginRight: '5px'},
                                    on: {
                                        click: () => {
                                            this.add(params.row);
                                        }
                                    }
                                },
                                '授权游戏'
                            );
                            return h('div', [editButton, grantButton]);
                        }
                    }
                ],
                data: [],
                searchForm: {
                    name: '',
                    pageNumber: 1,
                    pageSize: 10
                },
                miniUserForm: [],
                userForm: {
                    roles: []
                },
                gameForm: {
                    games: []
                },
                roleList: [],
                modalType: 1,
                modalTitle: '分配角色',
                modalGrantTitle: '分配游戏',
                ModalVisible: false,
                ModalVisibleGrant: false,
                total: 0,
                submitLoading: false,
                games: [],
            }
                ;
        },
        mounted() {
            this.init();
            this.getRoleList();
            this.getGames();
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
            edit(v) {
                this.modalType = 1;
                this.modalTitle = '角色分配';
                this.$refs.userForm.resetFields();
                let openId = v.openId;

                // 转换null为""
                for (let attr in v) {
                    if (v[attr] == null) {
                        v[attr] = '';
                    }
                }
                let str = JSON.stringify(v);
                let data = JSON.parse(str);
                this.miniUserForm = data;
                this.ModalVisible = true;
            },
            add(v) {
                this.modalGrantTitle = '分配游戏';
                this.$refs.userForm.resetFields();
                let openId = v.openId;

                // 转换null为""
                for (let attr in v) {
                    if (v[attr] == null) {
                        v[attr] = '';
                    }
                }
                let str = JSON.stringify(v);
                let data = JSON.parse(str);
                this.miniUserForm = data;
                this.ModalVisibleGrant = true;
            },
            submitMiniUser() {
                this.$refs.userForm.validate(valid => {
                    if (valid) {
                        // 编辑
                        this.submitLoading = true;
                        editMiniUser({
                            openId: this.miniUserForm.openId,
                            roleId: this.userForm.roles,
                        }).then(res => {
                            this.submitLoading = false;
                            if (res.success) {
                                this.$Message.success("操作成功");
                                this.ModalVisible = false;
                            }
                        });
                    }
                });
            },
            submitMiniGrant() {
                this.$refs.gameForm.validate(valid => {
                    if (valid) {
                        // 编辑
                        this.submitLoading = true;
                        editMiniUserGrant({
                            openId: this.miniUserForm.openId,
                            gameIds: this.gameForm.games,
                        }).then(res => {
                            this.submitLoading = false;
                            if (res.success) {
                                this.$Message.success("操作成功");
                                this.ModalVisibleGrant = false;
                            }
                        });
                    }
                });
            },
            getRoleList() {
                getAllMiniRoleList().then(res => {
                    if (res.success) {
                        this.roleList = JSON.parse(res.msg);
                    }
                });
            },
            getGames() {
                getAllGame().then(res => {
                    if (res.success) {
                        this.games = JSON.parse(res.msg);
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>
