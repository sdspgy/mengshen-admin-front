<template>
    <div>
        <div style="margin-top: 15px;">
            <Input placeholder="请输入内容" v-model="search.content" style="max-width: 500px">
                <Select v-model="search.select" slot="prepend" placeholder="请选择" style="width: 200px">
                    <Option label="id查询" value="1"></Option>
                    <Option label="openid查询" value="2"></Option>
                    <Option label="昵称查询暂未实现" value="3"></Option>
                </Select>
                <Button slot="append" @click="searchUser()">搜索用户</Button>
            </Input>
        </div>
        <Row>
            <Table :columns="columns" :data="users" ref="table"></Table>
        </Row>
        <Modal title=修改数据 v-model="dialogFormVisible" :mask-closable="false" width="50%">
            <Form :model="form" :label-width="120">
                <FormItem label="玩家id">
                    <Input v-model="form.userId" autocomplete="off" :disabled="true"/>
                </FormItem>
                <FormItem label="添加钻石">
                    <Input v-model="form.diamond" autocomplete="off"/>
                </FormItem>
                <FormItem label="添加金币">
                    <Input v-model="form.gold" autocomplete="off"/>
                </FormItem>
                <FormItem label="更新等级">
                    <Input v-model="form.level" autocomplete="off"/>
                </FormItem>
                <FormItem label="添加经验">
                    <Input v-model="form.exp" autocomplete="off"/>
                </FormItem>
                <FormItem label="添加道具（id1,num1;id2,num2）">
                    <Input v-model="form.items" autocomplete="off"/>
                </FormItem>
                <FormItem label="扩建等级 如果想扩满填-1">
                    <Input v-model="form.extendLevel" autocomplete="off"/>
                </FormItem>
            </Form>
            <Button @click="oneKeyAdd(1)" :loading="updateUserLoading">一键添加道具</Button>
            <Button @click="oneKeyAdd(2)" :loading="updateUserLoading">一键添加家具</Button>
            <Button @click="oneKeyAdd(3)" :loading="updateUserLoading">一键添加员工</Button>
            <Button @click="oneKeyAdd(4)" :loading="updateUserLoading">一键添加货物</Button>
            <div slot="footer" class="dialog-footer">
                <Button @click="skipNewGuide()">跳过新手</Button>
                <Button @click="hideDialog()">取 消</Button>
                <Button type="primary" @click="updateUser()" :loading="updateUserLoading">确 定</Button>
            </div>
        </Modal>
        <Modal title=查看背包道具和货物 v-model="dialogFormVisible2" :mask-closable="false" width="50%">
            <h2>道具列表</h2>
            <Table :columns="columnsWithBag" :data="bagItems" ref="table"></Table>
            <h2>货物列表</h2>
            <Table :columns="columnsWithBag" :data="bagGoods" ref="table"></Table>
            <div slot="footer" class="dialog-footer">
                <Button @click="hideDialog2()">取 消</Button>
            </div>
        </Modal>

        <Modal :title=this.vipInfo.id v-model="dialogFormVisible9" :mask-closable="false" width="50%">
            <div v-if="vipInfo.expireDate">过期时间：{{Time2DefaultFormat(vipInfo.expireDate)}}</div>
            <div v-else>该玩家不是VIP</div>
            <div>是否领过首次奖励：{{vipInfo.firstDraw}}</div>
            <div>是否今日抽奖：{{vipInfo.todayDraw}}</div>

            <div slot="footer" class="dialog-footer">
                <Button @click="hideDialog9()">取 消</Button>
            </div>
        </Modal>
        <Modal title=股票管理 v-model="dialogFormVisible4" :mask-closable="false" width="50%">
            <h2>股票管理</h2>
            <Table :columns="columnsWithStock" :data="stocks" ref="table"></Table>
            <div slot="footer" class="dialog-footer">
                <Button @click="hideDialog4()">取 消</Button>
                <Button type="primary" @click="updateStock()">确 定</Button>
            </div>
        </Modal>

        <Modal title=员工上岗信息 v-model="dialogFormVisible5" :mask-closable="false" width="675">
            <Row v-for="(item, i) in posts" :key="i">
                <h2>店铺{{item.id}}</h2>
                <Table :columns="columnsWithPosts" :data="item.positions" ref="table"></Table>
                <br/>
            </Row>
            <div slot="footer" class="dialog-footer">
                <Button @click="hideDialog5()">取 消</Button>
            </div>
        </Modal>

        <Modal title=所有员工信息 v-model="dialogFormVisible6" :mask-closable="false" width="800">
            <Table :columns="columnsWithAllStaff" :data="allStaff" ref="table"></Table>
            <Row type="flex" justify="end" class="page">
                <Page
                        :current="staffCurrentpage"
                        :total="staffTotal"
                        :page-size="staffPagesize"
                        @on-change="handleStaffCurrentChange"
                        @on-page-size-change="handleStaffSizeChange"
                        :page-size-opts="[10,20,50]"
                        size="small"
                        show-total
                        show-elevator
                        show-sizer>
                </Page>
            </Row>
            <div slot="footer" class="dialog-footer">
                <Button @click="hideDialog6()">取 消</Button>
            </div>
        </Modal>

        <Modal title=员工详情 v-model="dialogFormVisible7" :mask-closable="false" width="675">
            <h2>玩家{{form.userId}}的员工</h2>
            <div>
                <Row>
                    <Col span="8"> 员工ID</Col>
                    <Col span="16">{{currStaff.staffId}}</Col>
                </Row>
                <Row>
                    <Col span="8"> 模板ID</Col>
                    <Col span="16">{{currStaff.xmlId}}-{{currStaffTemplate.name}}</Col>
                </Row>
                <Row>
                    <Col span="8"> 是否unique</Col>
                    <Col span="16">{{currStaff.unique}}</Col>
                </Row>
                <Row>
                    <Col span="8"> 员工特长</Col>
                    <Col span="16">{{currStaff.advantages}}</Col>
                </Row>
                <Row>
                    <Col span="8"> 员工特质</Col>
                    <Col span="16">{{currStaff.special}}</Col>
                </Row>
                <Row>
                    <Col span="8"> 好感度</Col>
                    <Col span="16">阶段：{{currStaff.favorStage}}等级：{{currStaff.favorLevel}}经验：{{currStaff.favorExp}}</Col>
                </Row>
                <Row>
                    <Col span="8"> 解锁表情</Col>
                    <Col span="16">{{currStaff.unlockFaces}}</Col>
                </Row>
                <Row>
                    <Col span="8"> 解锁动作</Col>
                    <Col span="16">{{currStaff.unlockActions}}</Col>
                </Row>
            </div>
            <div slot="footer" class="dialog-footer">
                <Button @click="hideDialog7()">取 消</Button>
            </div>
        </Modal>

        <Modal title=店铺信息 v-model="dialogFormVisible8" :mask-closable="false" width="1000">
            <Button v-for="(item, i) in markets" :key="i" @click="showMarket(i)" :disabled=isMarketShow(i)
                    style="margin: 4px">店铺{{i+1}}
            </Button>
            <Row v-for="(item, i) in markets" :key="i">
                <Row v-show="isMarketShow(i)">
                    <h2>{{item.name}} -- 店铺等级：{{item.exFrequency}} -- 招牌等级：{{item.signboardLevel}} --
                        店铺人气值：{{item.popularity}} -- 当前店铺{{i+1}}</h2><br>
                    <h3>墙纸:{{item.wallPaper}} -- {{decoShopFilter(item.wallPaper)}} --
                        人气值：{{decoShop2Popularity(item.wallPaper)}}</h3><br>
                    <h3>货架和地面装饰</h3>
                    <Table :columns="columnsWithShelves" :data="item.shelves" ref="table"></Table>
                    <h3>墙上装饰</h3>
                    <Table :columns="columnsWithWallDeco" :data="item.wallDeco" ref="table"></Table>
                    <h3>地板</h3>
                    <Button @click="openFloors()" v-if="!isOpenFloors">查看地板</Button>
                    <Button @click="closeFloors()" v-if="isOpenFloors">关闭地板</Button>
                    <Table :columns="columnsWithFloors" :data="floorsMap2Array(item.floors)" ref="table"
                           v-show="isOpenFloors"></Table>
                    <br/>
                </Row>
            </Row>
            <div slot="footer" class="dialog-footer">
                <Button @click="hideDialog8()">取 消</Button>
            </div>
        </Modal>

        <Row type="flex" justify="end" class="page">
            <Page
                    :current="currentpage"
                    :total="total"
                    :page-size="pagesize"
                    @on-change="handleCurrentChange"
                    @on-page-size-change="handleSizeChange"
                    :page-size-opts="[10,20,50]"
                    size="small"
                    show-total
                    show-elevator
                    show-sizer>
            </Page>
        </Row>

    </div>
</template>

<script>
    import {
        updateUser,
        getAllUsers,
        getBags,
        searchUser,
        recharge,
        queryStock,
        updateStock,
        getItemList,
        getStaffPostInfo,
        getAllStaffInfo,
        getStaffInfo,
        openVip,
        getMarkets,
        skipNewGuide
    } from "@/api/index";
    import util from "../../../libs/util";
    import BreadcrumbNav from "../../main-components/breadcrumb-nav";

    export default {
        name: "allUsers",
        components: {BreadcrumbNav},
        mounted() {
            this.getUsers();
            this.getItemList();
        },
        data() {
            return {
                columns: [
                    {type: "index", width: 60, align: "center"},
                    {
                        title: "id", key: "id", width: 100, align: "center", render: (h, params) => {
                            return h("div", params.row.user.id);
                        }
                    },
                    {
                        title: "openid", key: "openid", width: 100, align: "center", render: (h, params) => {
                            return h("div", params.row.user.openid);
                        }
                    },
                    {title: "accessToken", key: "accessToken", width: 200, align: "center"},
                    {
                        title: "昵称", key: "nickName", width: 100, align: "center", render: (h, params) => {
                            return h("div", params.row.user.nickName);
                        }
                    },
                    {
                        title: "金币", key: "gold", width: 100, align: "center", render: (h, params) => {
                            return h("div", params.row.user.gold);
                        }
                    },
                    {
                        title: "钻石", key: "diamond", width: 100, align: "center", render: (h, params) => {
                            return h("div", params.row.user.diamond);
                        }
                    },
                    {
                        title: "等级", key: "level", width: 100, align: "center", render: (h, params) => {
                            return h("div", params.row.user.level);
                        }
                    },
                    {
                        title: "头像", key: "avatar", width: 100, align: "center", render: (h, params) => {
                            return h("Avatar", {props: {src: params.row.user.avatar}});
                        }
                    },
                    {
                        title: "创建时间", key: "createTime", width: 100, align: "center", render: (h, params) => {
                            return h("div", util.Time2DefaultFormat(params.row.user.createTime))
                        }
                    },
                    {
                        title: "修改数据", key: "action", width: 100, align: "center",
                        render: (h, params) => {
                            return h("div", [h("Button", {
                                props: {type: "primary", size: "small"}, on: {
                                    click: () => {
                                        this.openDialog(params.row.user.id);
                                    }
                                }
                            }, "修改数据")]);
                        }
                    },
                    {
                        title: "vip", key: "action", width: 100, align: "center",
                        render: (h, params) => {
                            return h("div", [h("Button", {
                                props: {type: "primary", size: "small"}, on: {
                                    click: () => {
                                        this.openDialog9(params.row.user.id, params.row.vip);
                                    }
                                }
                            }, "vip信息")]);
                        }
                    },
                    {
                        title: "股票管理", key: "action", width: 100, align: "center",
                        render: (h, params) => {
                            return h("div", [h("Button", {
                                props: {type: "primary", size: "small"}, on: {
                                    click: () => {
                                        this.openDialog4(params.row.user.id);
                                    }
                                }
                            }, "股票管理")]);
                        }
                    },
                    {
                        title: "查看背包", key: "action", width: 100, align: "center",
                        render: (h, params) => {
                            return h("div", [h("Button", {
                                props: {type: "primary", size: "small"}, on: {
                                    click: () => {
                                        this.openDialog2(params.row.user.id);
                                    }
                                }
                            }, "查看背包")]);
                        }
                    },
                    {
                        title: "员工", key: "action", width: 200, align: "center",
                        render: (h, params) => {
                            return h("div", [
                                h("Button", {
                                    props: {type: "primary", size: "small"}, on: {
                                        click: () => {
                                            this.openDialog5(params.row.user.id);
                                        }
                                    }
                                }, "上岗员工"),
                                h("Button", {
                                    props: {type: "primary", size: "small"}, on: {
                                        click: () => {
                                            this.openDialog6(params.row.user.id);
                                        }
                                    }
                                }, "所有员工")
                            ]);
                        }
                    },
                    {
                        title: "店铺信息", key: "action", width: 100, align: "center",
                        render: (h, params) => {
                            return h("div", [h("Button", {
                                props: {type: "primary", size: "small"}, on: {
                                    click: () => {
                                        this.openDialog8(params.row.user.id)
                                    }
                                }
                            }, "查看店铺")]);
                        }
                    },
                ],
                columnsWithBag: [
                    {type: "index", width: 60, align: "center"},
                    {title: "xmlId", key: "xmlId", width: 100, align: "center"},
                    {title: "数量", key: "num", width: 100, align: "center"},
                    {title: "名字", key: "name", width: 180, align: "center"},
                ],
                columnsWithStock: [
                    {type: "index", width: 60, align: "center"},
                    {title: "角色ID", key: "stockId", width: 100, align: "center"},
                    {title: "数量", key: "num", width: 100, align: "center"},
                ],
                columnsWithPosts: [
                    {
                        title: "岗位", key: "positionId", width: 100, align: "center", render: (h, params) => {
                            let p = ''
                            switch (params.row.positionId) {
                                case 0:
                                    p = '收银员';
                                    break;
                                case 1:
                                    p = '售货员';
                                    break;
                                case 2:
                                    p = '招揽员';
                                    break;
                                case 3:
                                    p = '理货员';
                                    break;
                                default:
                                    p = '未知'
                            }
                            return h("div", p)
                        }
                    },
                    {title: "是否有新岗位", key: "hasNewPos", width: 120, align: "center"},
                    {title: "岗位总分", key: "sumScore", width: 120, align: "center"},
                    {
                        title: "岗位员工ID(点击员工查看员工详情)",
                        key: "staffIds",
                        width: 300,
                        align: "center",
                        render: (h, params) => {
                            let handles = [];
                            params.row.staffIds.forEach(o => {
                                if (o > 0) {
                                    handles.push(h("Button", {
                                        props: {size: "small"},
                                        style: {marginRight: "5px"},
                                        on: {
                                            click: () => {
                                                this.openDialog7(o);
                                            }
                                        }
                                    }, o));
                                }
                            })
                            return h("div", handles)
                        }
                    },
                ],
                columnsWithAllStaff: [
                    {type: "index", width: 60, align: "center"},
                    {title: "xmlId", key: "xmlId", width: 100, align: "center"},
                    {title: "staffId", key: "staffId", width: 60, align: "center"},
                    {title: "isNew", key: "isNew", width: 80, align: "center"},
                    {title: "等级", key: "level", width: 60, align: "center"},
                    {title: "unique", key: "unique", width: 60, align: "center"},
                    {title: "灵巧", key: "patience", width: 60, align: "center"},
                    {title: "智慧", key: "intelligence", width: 60, align: "center"},
                    {title: "亲和", key: "glamour", width: 60, align: "center"},
                    {title: "体力", key: "power", width: 60, align: "center"},
                    {
                        title: "操作", key: "action", width: 100, align: "center",
                        render: (h, params) => {
                            return h("div", [h("Button", {
                                props: {type: "primary", size: "small"}, on: {
                                    click: () => {
                                        this.openDialog7(params.row.staffId);
                                    }
                                }
                            }, "员工详情")]);
                        }
                    },

                ],
                columnsWithShelves: [
                    {type: "index", width: 60, align: "center"},
                    {title: "id", key: "id", width: 100, align: "center"},
                    {title: "x坐标", key: "x", width: 80, align: "center"},
                    {title: "y坐标", key: "y", width: 80, align: "center"},
                    {title: "xmlId", key: "xmlId", width: 100, align: "center"},
                    {
                        title: "名称", width: 120, align: "center", render: (h, params) => {
                            return h("div", this.decoShopFilter(params.row.xmlId));
                        }
                    },
                    {
                        title: "人气值", width: 80, align: "center", render: (h, params) => {
                            return h("div", this.decoShop2Popularity(params.row.xmlId));
                        }
                    },
                    {title: "旋转", key: "reversal", width: 80, align: "center"},
                    {title: "金币收益", key: "goldIncome", width: 100, align: "center"},
                    {
                        title: "开始时间", key: "startTime", width: 100, align: "center", render: (h, params) => {
                            return h("div", params.row.startTime ? util.Time2DefaultFormat(params.row.startTime) : '');
                        }
                    },
                    {title: "sumExp", key: "sumExp", width: 100, align: "center"},
                    {title: "售卖货物", key: "warehouseProductStr", width: 60, align: "center"},
                ],
                columnsWithWallDeco: [
                    {type: "index", width: 60, align: "center"},
                    {title: "id", key: "id", width: 100, align: "center"},
                    {title: "x坐标", key: "x", width: 80, align: "center"},
                    {title: "y坐标", key: "y", width: 80, align: "center"},
                    {title: "xmlId", key: "xmlId", width: 100, align: "center"},
                    {
                        title: "名称", width: 120, align: "center", render: (h, params) => {
                            return h("div", this.decoShopFilter(params.row.xmlId));
                        }
                    },
                    {
                        title: "人气值", width: 80, align: "center", render: (h, params) => {
                            return h("div", this.decoShop2Popularity(params.row.xmlId));
                        }
                    },
                    {title: "旋转", key: "reversal", width: 100, align: "center"},
                ],
                isOpenFloors: false,
                columnsWithFloors: [
                    {type: "index", width: 60, align: "center"},
                    {title: "id", key: "id", width: 100, align: "center"},
                    {
                        title: "x坐标", width: 80, align: "center", render: (h, params) => {
                            return h("div", Math.floor(params.row.id / 1000));
                        }
                    },
                    {
                        title: "y坐标", width: 80, align: "center", render: (h, params) => {
                            return h("div", params.row.id % 1000);
                        }
                    },
                    {title: "xmlId", key: "xmlId", width: 100, align: "center"},
                    {
                        title: "名称", width: 120, align: "center", render: (h, params) => {
                            return h("div", this.decoShopFilter(params.row.xmlId));
                        }
                    },
                    {
                        title: "人气值", width: 80, align: "center", render: (h, params) => {
                            return h("div", this.decoShop2Popularity(params.row.xmlId));
                        }
                    },
                ],
                posts: [],
                allStaff: [],
                users: [],
                vipInfo: {},
                markets: [],
                currMarket: 0,
                loading: true,
                updateUserLoading: false,
                pagesize: 10,
                currentpage: 1,
                total: 0,
                staffPagesize: 10,
                staffCurrentpage: 1,
                staffTotal: 0,
                form: {
                    userId: '',
                    diamond: '',
                    gold: '',
                    level: '',
                    exp: '',
                    extendLevel: '',
                    items: '',
                    rechargeNum: '',
                    pid: '',
                    deltaNum: ''
                },
                dialogFormVisible: false,
                dialogFormVisible2: false,
                dialogFormVisible3: false,
                dialogFormVisible4: false,
                dialogFormVisible5: false,
                dialogFormVisible6: false,
                dialogFormVisible7: false,
                dialogFormVisible8: false,
                dialogFormVisible9: false,
                formLabelWidth: '120px',
                currStaff: {},
                currStaffTemplate: {},
                bagItems: [],
                bagGoods: [],
                stocks: [],
                search: {
                    content: '',
                    select: '1'
                },
                itemData: {
                    itemList: {},
                    decoShopList: {},
                    staffList: {},
                    goodList: {}
                }
            }
        },
        methods: {
            getUsers() {
                getAllUsers({per_page: this.pagesize, cur_page: this.currentpage}).then(res => {
                    if (res.status === 200) {
                        console.log(res.data.users)
                        this.users = res.data.users;
                        this.total = res.data.total;
                        this.loading = false;
                    }
                })
            },
            handleSizeChange(value) {
                this.pagesize = value;
                this.getUsers();
            },
            handleCurrentChange(value) {
                this.currentpage = value;
                this.getUsers();
            },
            handleStaffSizeChange(value) {
                this.staffPagesize = value;
                this.getAllStaffInfo();
            },
            handleStaffCurrentChange(value) {
                this.staffCurrentpage = value;
                this.getAllStaffInfo();
            },
            openDialog(id) {
                this.form = {
                    userId: id,
                    diamond: '',
                    gold: '',
                    level: '',
                    exp: '',
                    items: '',
                    extendLevel: ''
                };
                this.dialogFormVisible = true;
            },
            hideDialog() {
                this.updateUserLoading = false;
                this.dialogFormVisible = false;
            },
            openDialog2(id) {
                this.bagItems = [];
                this.bagGoods = [];
                getBags({userId: id}).then(res => {
                    if (res.status === 200) {
                        this.bagItems = res.data.bagItems;
                        this.bagGoods = res.data.bagGoods;
                    }
                })
                this.dialogFormVisible2 = true;
            },
            hideDialog2() {
                this.dialogFormVisible2 = false;
            },
            updateUser() {
                if (this.updateUserLoading) {
                    this.$Message.error('点击过快');
                    this.updateUserLoading = false;
                    return
                }
                this.updateUserLoading = true;
                updateUser(this.form).then(res => {
                    if (res.status === 200) {
                        this.$Message.success('修改成功');
                    } else {
                        this.$Message.error(res.data);
                    }
                    this.hideDialog();
                    this.getUsers();
                })
            },
            skipNewGuide() {
                skipNewGuide({userId: this.form.userId}).then(res => {
                    if (res.status === 200) {
                        this.$Message.success('修改成功');
                    }
                    this.hideDialog();
                })
            },
            searchUser() {
                searchUser({type: this.search.select, content: this.search.content}).then(res => {
                    if (res.status === 200) {
                        this.users = res.data.users;
                        this.total = res.data.total;
                        this.loading = false;
                    }
                })
            },
            openDialog3(id) {
                this.form = {
                    userId: id,
                    diamond: '',
                    gold: '',
                    level: '',
                    exp: '',
                    items: '',
                    rechargeNum: ''
                };
                this.dialogFormVisible3 = true;
            },
            hideDialog3() {
                this.dialogFormVisible3 = false;
            },
            recharge() {
                recharge({userId: this.form.userId, num: this.form.rechargeNum}).then(res => {
                    if (res.status === 200) {
                        this.$Message.success('充值成功');
                    }
                })
                this.dialogFormVisible3 = false;
            },
            openDialog4(id) {
                this.form = {
                    userId: id,
                    pid: '',
                    deltaNum: ''
                };
                queryStock({userId: id}).then(res => {
                    if (res.status === 200) {
                        debugger
                        this.stocks = res.data.stocks;
                        this.dialogFormVisible4 = true;
                    } else {
                        this.$Message.error(`没找到玩家`)
                    }
                })
                this.dialogFormVisible4 = true;
            },
            hideDialog4() {
                this.dialogFormVisible4 = false;
            },
            updateStock() {
                updateStock(this.form).then(res => {
                    if (res.status === 200) {
                        this.stocks = res.data.stocks;
                        this.$Message.info('修改成功');
                    }
                });
            },
            openDialog5(id) {
                this.form.userId = id;
                getStaffPostInfo({userId: id}).then(res => {
                    if (res.status === 200) {
                        this.posts = res.data.posts;
                    }
                })
                this.dialogFormVisible5 = true;
            },
            hideDialog5() {
                this.dialogFormVisible5 = false;
            },
            openDialog6(id) {
                this.form.userId = id;
                this.getAllStaffInfo();
                this.dialogFormVisible6 = true;
            },
            getAllStaffInfo() {
                getAllStaffInfo({
                    userId: this.form.userId,
                    per_page: this.staffPagesize,
                    cur_page: this.staffCurrentpage
                }).then(res => {
                    if (res.status === 200) {
                        this.allStaff = res.data.allStaff;
                        this.staffTotal = res.data.total;
                    }
                })
            },
            hideDialog6() {
                this.dialogFormVisible6 = false;
            },
            openDialog7(staffId) {
                this.getStaffInfo(staffId);
                this.dialogFormVisible7 = true;
            },
            hideDialog7() {
                this.dialogFormVisible7 = false;
            },
            getStaffInfo(staffId) {
                getStaffInfo({userId: this.form.userId, staffId: staffId}).then(res => {
                    if (res.status === 200) {
                        this.currStaff = res.data.staff;
                        this.currStaffTemplate = {};
                        this.itemData.staffList.forEach(o => {
                            if (o.id == this.currStaff.xmlId) {
                                this.currStaffTemplate = o;
                            }
                        })
                    }
                });

            },
            oneKeyAdd(type) {
                let items = [];
                let badType = [19, 20, 21, 22, 23, 30];
                switch (type) {
                    case 1:// 道具
                        items = this.itemData.itemList.filter(o => o.stacking && o.stacking > 999)
                            .filter(o => badType.findIndex(v => v === o.type) < 0).map(obj => `${obj.id},100`);
                        break;
                    case 2:// 家具
                        items = this.itemData.decoShopList.filter(o => o.stacking && o.stacking > 999).map(obj => `${obj.id},100`);
                        break;
                    case 3:// 员工
                        items = this.itemData.staffList.map(obj => `${obj.id},1`);
                        break;
                    case 4:// 货物
                        items = this.itemData.goodList.map(obj => `${obj.id},100`);
                }
                this.form.items = items.join(';');
                this.updateUser();
            },
            getItemList() {
                getItemList().then(res => {
                    if (res.status === 200) {
                        this.itemData.decoShopList = res.data.decoShopList;
                        this.itemData.itemList = res.data.itemList;
                        this.itemData.staffList = res.data.staffList;
                        this.itemData.goodList = res.data.goodList;
                    }
                });
            },
            openVip(id) {
                openVip({userId: id, day: 30}).then(res => {
                    if (res.status === 200 || res == 'hh') {
                        this.$Message.info('修改成功');
                    }
                })
            },
            openDialog8(userId) {
                this.form.userId = userId;
                this.getMarkets();
                this.dialogFormVisible8 = true;
            },
            hideDialog8() {
                this.dialogFormVisible8 = false;
            },
            openFloors() {
                this.isOpenFloors = true;
            },
            closeFloors() {
                this.isOpenFloors = false;
            },
            openDialog9(id, vip) {
                this.vipInfo = {};
                this.vipInfo = vip;
                this.vipInfo.id = id + '';
                this.dialogFormVisible9 = true;
            },
            hideDialog9() {
                this.dialogFormVisible9 = false;
            },
            getMarkets() {
                getMarkets({userId: this.form.userId}).then(res => {
                    if (res.status === 200) {
                        this.markets = res.data.markets;
                    }
                })
            },
            showMarket(index) {
                this.isOpenFloors = false;
                this.currMarket = index;
            },
            isMarketShow(index) {
                return this.currMarket === index;
            },
            decoShopFilter(xmlId) {
                let str = "没找到"
                this.itemData.decoShopList.forEach(o => {
                    if (o.id == xmlId) {
                        str = o.name;
                    }
                })
                return str;
            },
            decoShop2Popularity(xmlId) {
                let str = "0"
                this.itemData.decoShopList.forEach(o => {
                    if (o.id == xmlId) {
                        str = o.popularity;
                    }
                })
                return str;
            },
            floorsMap2Array(map) {
                let arr = [];
                for (var key in map) {
                    arr.push({id: key, xmlId: map[key]})
                }
                return arr;
            },
            Time2DefaultFormat(time) {
                return util.Time2DefaultFormat(time)
            }
        },

    }
</script>

<style scoped>

</style>
