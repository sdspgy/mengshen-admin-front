<template>
  <div>
    <Row>
      <Input v-model="page.operation.channel" placeholder="请输入渠道" style="width: 200px"
             @keyup.enter.native="queryOperation()"></Input>
      <Button @click='queryOperation()' type="primary">查询</Button>
      <Button @click='openDialog()'>添加随机兑换码</Button>
      <Button @click='openDialogWithDIY()'>添加自定义兑换码</Button>

    </Row>
    <Row>
      <Table :columns="columnsWithOperation" :data="operations" ref="table" stripe></Table>
    </Row>
    <Row type="flex" justify="end" class="page">
      <Page
              :current="page.operation.cur_page"
              :total="page.operation.total"
              :page-size="page.operation.per_page"
              @on-change="handleCurrentChange"
              @on-page-size-change="handleSizeChange"
              :page-size-opts="[10,20,50]"
              size="small"
              show-total
              show-elevator
              show-sizer>
      </Page>
    </Row>

    <Modal :title="isDIY?'添加自定义兑换码礼包':'添加随机兑换码礼包'" v-model="dialogFormVisible" :mask-closable="false" width="50%">
      <Form :model="form" :label-width="120">

        <FormItem label="礼包起止时间">
          <DatePicker v-model="form.formTime"
                      type="datetimerange"
                      format="yyyy-MM-dd HH:mm:ss"
                      placeholder="请选择时间日期"
                      style="width: 50%;max-width: 350px"
                      :options="expireTimeOption">
          </DatePicker>
        </FormItem>

        <FormItem label="道具列表">
          <Select v-model="itemType" @on-change="changeItemType">
            <Option
                    v-for="item in itemTypes"
                    :key="item.type"
                    :label="item.label"
                    :value="item.type">
            </Option>
          </Select>
          <Select v-model="addItemId">
            <Option
                    v-for="item in itemList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
            </Option>
          </Select>

          <Input v-model.number="addItemNum" autocomplete="off" style="width: 160px"
                 placeholder="请输入道具数量" @keyup.enter.native="addReward()"></Input>

          <Button @click='addReward()'>添加</Button>

          <Button @click='clearRewards()'>清空</Button>
          <Table :columns="columnsWithRewards" :data="form.rewards" ref="table"></Table>

        </FormItem>

        <FormItem :label="isDIY?'自定义兑换码':'兑换码数量'">
          <Input v-model="form.createNum" autocomplete="off" placeholder="请输入生成兑换码数量，默认为1" v-if="!isDIY"/>
          <Input v-model="form.diyCdk" autocomplete="off" placeholder="请输入要生成的兑换码，英文半角逗号分隔" v-if="isDIY"/>
        </FormItem>

        <FormItem label="使用次数">
          <Input v-model="form.totalNum" autocomplete="off" placeholder="请输入兑换码使用次数，默认为1，无限制使用为-1"/>
        </FormItem>

        <FormItem label="渠道">
          <Input v-model="form.channel" autocomplete="off" placeholder="请输入渠道"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="hideDialog()">取 消</Button>
        <Button type="primary" @click="addcdkey()">确定添加</Button>
      </div>
    </Modal>

    <Modal title=查看兑换码 v-model="dialogSeeVisible" :mask-closable="false" width="900px">
      <Table :columns="columnsWithCDkey" :data="cdkeys" ref="table" stripe></Table>
      <Row type="flex" justify="end" class="page">
        <Page
                :current="page.cdkey.currentpage"
                :total="page.cdkey.total"
                :page-size="page.cdkey.pagesize"
                @on-change="handleCDkeyCurrentChange"
                @on-page-size-change="handleCDkeySizeChange"
                :page-size-opts="[10,20,50]"
                size="small"
                show-total
                show-elevator
                show-sizer>
        </Page>
      </Row>
      <div slot="footer">
        <Button @click="exportExcel" type="primary">导出Excel</Button>
        <Button @click="hideCDkeyDialog()">取 消</Button>
      </div>
    </Modal>

    <Modal title=导出Excel v-model="dialogExportExcelVisible" :mask-closable="false" width="50%">
      <span>因数据量太大将采取分批次下载，请选择下载批次！如若下载失败，请联系技术人员！</span>
      <br>
      <Button @click="exportExcelInBatches(n)" tBype="primary" :key="n"
              v-for="n in Math.ceil(page.cdkey.total/downloadDataLimit)"
              style="width: 200px;margin: 10px">{{(n - 1) * downloadDataLimit +1}}-{{n * downloadDataLimit }}
      </Button>
    </Modal>

    <Modal title=已领取玩家 v-model="dialogSeeUserVisible" :mask-closable="false" width="50%">
      <Table :columns="columnsWithUsers" :data="users" ref="table" stripe></Table>
      <Row type="flex" justify="end" class="page">
        <Page
                :current="page.user.currentpage"
                :total="page.user.total"
                :page-size="page.user.pagesize"
                @on-change="handleUserCurrentChange"
                @on-page-size-change="handleUserSizeChange"
                :page-size-opts="[10,20,50]"
                size="small"
                show-total
                show-elevator
                show-sizer>
        </Page>
      </Row>
      <div slot="footer">
        <Button @click="hideSeeUserDialog()">取 消</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
    import {getOperation, getItemList, addcdkey, getCDkeys, getUseUsers, exportExcel, deleteCDkey} from "@/api/index";
    import util from "../../../libs/util";

    export default {
        name: 'cdkey',
        mounted() {
            this.getItemList();
            this.getOperation();
        },
        data() {
            return {
                columnsWithOperation: [
                    {type: "index", width: 60, align: "center"},
                    {
                        title: "生成时间", key: "createTime", width: 180, align: "center", render: (h, params) => {
                            return h("div", util.Time2DefaultFormat(params.row.createTime))
                        }
                    },
                    {
                        title: "开始时间", key: "startTime", width: 180, align: "center", render: (h, params) => {
                            return h("div", util.Time2DefaultFormat(params.row.startTime))
                        }
                    },
                    {
                        title: "结束时间", key: "endTime", width: 180, align: "center", render: (h, params) => {
                            return h("div", util.Time2DefaultFormat(params.row.endTime))
                        }
                    },
                    {
                        title: "道具内容", key: "rewards", width: 200, align: "center", render: (h, params) => {
                            return h("div", this.formatReward(params.row.rewards))
                        }
                    },
                    {title: "生成数量", key: "createNum", width: 120, align: "center",render: (h, params) => {
                            let discardNum = "";
                            if (params.row.discardNum && params.row.discardNum>0){
                                discardNum = `(-${params.row.discardNum})`
                            }
                            return h("div", params.row.createNum + discardNum)
                        }},
                    {title: "可使用次数", key: "totalNum", width: 120, align: "center"},
                    {title: "渠道", key: "channel", width: 120, align: "center"},
                    {
                        title: "操作", key: "action", width: 100, align: "center", render: (h, params) => {
                            return h("div", [h("Button", {
                                props: {type: "primary", size: "small"}, on: {
                                    click: () => {
                                        this.openCDkeyDialog(params.row);
                                    }
                                }
                            }, "查看")]);
                        }
                    }],
                columnsWithRewards: [
                    {type: "index", width: 60, align: "center"},
                    {title: "道具ID", key: "id", width: 120, align: "center"},
                    {
                        title: "道具名称", key: "id", width: 120, align: "center", render: (h, params) => {
                            return h("div", this.formatItem(params.row.id))
                        }
                    },
                    {title: "道具数量", key: "num", width: 120, align: "center"},
                    {
                        title: "操作", key: "action", width: 100, align: "center", render: (h, params) => {
                            return h("div", [h("Button", {
                                props: {type: "error", size: "small"}, on: {
                                    click: () => {
                                        this.delReward(params.index);
                                    }
                                }
                            }, "删除")]);
                        }
                    }
                ],
                columnsWithCDkey: [
                    {type: "index", width: 60, align: "center"},
                    {title: "兑换码ID", key: "key", width: 110, align: "center"},
                    {
                        title: "领取状态", key: "useNum", width: 120, align: "center", render: (h, params) => {
                            return h("div", params.row.useNum > 0 ? '已领取' : '未领取')
                        }
                    },
                    {
                        title: "领取时间", key: "fistUseTime", width: 120, align: "center", render: (h, params) => {
                            return h("div", params.row.fistUseTime ? util.Time2DefaultFormat(params.row.fistUseTime) : '未领取')
                        }
                    },
                    {title: "用户ID", key: "fistUsrUserId", width: 120, align: "center"},
                    {title: "已使用次数", key: "useNum", width: 110, align: "center"},
                    {
                        title: "操作", key: "action", width: 200, align: "center", render: (h, params) => {
                            let deleteButton = ''
                            if (this.$route.meta.permTypes.includes('delete')) {
                                deleteButton = h("Button", {
                                    props: {type: "error", size: "small"}, on: {
                                        click: () => {
                                            this.deleteCDkey(params.row);
                                        }
                                    }
                                }, "删除");
                            }
                            return h("div", [
                                h("Button", {
                                    props: {type: "primary", size: "small"}, on: {
                                        click: () => {
                                            this.openSeeUserDialog(params.row.key);
                                        }
                                    }
                                }, "使用详情"),
                                deleteButton
                            ]);
                        }
                    }],
                columnsWithUsers: [
                    {type: "index", width: 60, align: "center"},
                    {title: "兑换码", key: "key", width: 110, align: "center"},
                    {title: "用户ID", key: "userId", width: 110, align: "center"},
                    {
                        title: "领取时间", key: "useTime", width: 110, align: "center", render: (h, params) => {
                            return h("div", util.Time2DefaultFormat(params.row.useTime))
                        }
                    },
                ],
                /** 添加礼包对话框显示 */
                dialogFormVisible: false,
                /** 礼包查看操作对话框显示 */
                dialogSeeVisible: false,
                /** 查看所有用户数据 */
                dialogSeeUserVisible: false,
                dialogExportExcelVisible: false,
                downloadDataLimit: 50000,
                formLabelWidth: '120px',
                page: {
                    operation: {
                        per_page: 10,
                        cur_page: 1,
                        total: 0,
                        channel: ''
                    },
                    cdkey: {
                        pagesize: 10,
                        currentpage: 1,
                        total: 0,
                        currentOperation: {}
                    },
                    user: {
                        pagesize: 10,
                        currentpage: 1,
                        total: 0,
                        key: ''
                    }
                },
                /** 根据筛选条件后所有礼包数据 */
                operations: [],
                /** 查看礼包，当前礼包内的所有cdkey数据 */
                cdkeys: [],
                /** 查看cdkey下所有使用用户 */
                users: [],
                /** 提交到后端的添加数据 */
                isDIY: false,
                form: {
                    diyCdk: '',
                    formTime: [],
                    rewards: [],
                    createNum: '',
                    totalNum: '',
                    channel: ''
                },
                /** 道具下拉框，需要请求后端获取道具数据 */
                itemType: 0,
                itemList: [],
                itemLists: [],
                itemData: {
                    itemList: {},
                    decoShopList: {},
                    staffList: {},
                    goodList: {}
                },
                itemTypes: [{type: 0, label: '货币'}, {type: 1, label: '道具'}, {type: 2, label: '家具'}, {
                    type: 3,
                    label: '员工'
                }, {type: 4, label: '货物'}],
                addItemId: '',
                addItemNum: '',
                /** 时间选择禁止选择当天前的日期 */
                expireTimeOption: {
                    disabledDate(date) {
                        return date.getTime() < new Date(new Date().toLocaleDateString()).getTime();
                    }
                }
            }
        },
        methods: {
            getItemList() {
                getItemList().then(res => {
                    if (res.status === 200) {
                        this.itemData.decoShopList = res.data.decoShopList;
                        this.itemData.itemList = res.data.itemList;
                        this.itemData.staffList = res.data.staffList;
                        this.itemData.goodList = res.data.goodList;

                        /** 显示奖励时用 */
                        this.itemLists = [{id: -1, name: '经验'}, {id: -2, name: '黄金'}, {id: -3, name: '钻石'}];
                        res.data.decoShopList.forEach((obj) => {
                            this.itemLists.push({id: obj.id, name: obj.name});
                        });
                        res.data.itemList.forEach((obj) => {
                            this.itemLists.push({id: obj.id, name: obj.name});
                        });
                        res.data.staffList.forEach((obj) => {
                            this.itemLists.push({id: obj.id, name: obj.name});
                        });
                        res.data.goodList.forEach((obj) => {
                            this.itemLists.push({id: obj.id, name: obj.name});
                        });
                    }
                });
            },
            changeItemType() {
                this.itemList = [];
                this.clearAddItem();
                switch (this.itemType) {
                    case 0:
                        this.itemList.push({id: -1, name: '经验'});
                        this.itemList.push({id: -2, name: '黄金'});
                        this.itemList.push({id: -3, name: '钻石'});
                        return;
                    case 1:
                        this.itemList = this.itemData.itemList;
                        return;
                    case 2:
                        this.itemList = this.itemData.decoShopList;
                        return;
                    case 3:
                        this.itemList = this.itemData.staffList;
                        return;
                    case 4:
                        this.itemList = this.itemData.goodList;
                }
            },
            queryOperation() {
                this.page.operation.currentpage = 1;
                this.getOperation();
            },
            getOperation() {
                getOperation(this.page.operation).then(res => {
                    if (res.status === 200) {
                        this.operations = res.data.operations;
                        this.page.operation.total = res.data.total;
                    }
                });
            },
            handleSizeChange(value) {
                this.page.operation.per_page = value;
                this.getOperation();
            },
            handleCurrentChange(value) {
                this.page.operation.cur_page = value;
                this.getOperation();
            },
            handleCDkeySizeChange(value) {
                this.page.cdkey.pagesize = value;
                this.getCDkey();
            },
            handleCDkeyCurrentChange(value) {
                this.page.cdkey.currentpage = value;
                this.getCDkey();
            },
            handleUserSizeChange(value) {
                this.page.user.pagesize = value;
                this.getUseUser();
            },
            handleUserCurrentChange(value) {
                this.page.user.currentpage = value;
                this.getUseUser();
            },
            openDialog() {
                if (this.itemList.length <= 0) {
                    this.getItemList();
                }
                this.itemType = 0;
                this.changeItemType();
                this.form = {
                    diyCdk: '',
                    rewards: [],
                    createNum: '',
                    totalUseNum: '',
                    channel: '',
                    rewardStr: ''
                };
                this.dialogFormVisible = true;
                this.isDIY = false;
            },
            openDialogWithDIY() {
                this.openDialog();
                this.isDIY = true;
            },
            hideDialog() {
                this.dialogFormVisible = false;
            },
            addcdkey() {
                if (!this.form.formTime) {
                    this.$Message.error('请选择时间');
                    return;
                }
                if (!this.form.rewards || this.form.rewards.length === 0) {
                    this.$Message.error('请添加道具');
                    return;
                }
                if (!this.form.channel) {
                    this.$Message.error('请输入渠道');
                    return;
                }
                if (!this.form.createNum) {
                    this.form.createNum = 1;
                }
                if (!this.form.totalNum) {
                    this.form.totalNum = 1;
                }
                if (this.isDIY && !this.form.diyCdk) {
                    this.$Message.error('请输入自定义兑换码');
                    return;
                }
                this.form.formTime.forEach((item, index) => {
                    this.form.formTime[index] = item.getTime();
                });
                this.form.rewards.forEach((item, index) => {
                    this.form.rewards[index] = item.id + ',' + item.num;
                })
                this.form.rewardStr = this.form.rewards.join(';')
                this.form.isDiy = this.isDIY;
                this.hideDialog();
                addcdkey(this.form).then(res => {
                    if (res.status === 200) {
                        if (res.data.error) {
                            this.$Message.error(res.data.error);
                            return
                        }
                        if (res.data.insertFail) {
                            this.$Message.error('兑换码' + res.data.insertFail.slice(0, -1) + '已存在');
                        }
                        if (res.data.success > 0) {
                            this.$Message.success('成功生成' + res.data.success + '条CDkey');
                        }
                        this.getOperation();
                    }
                });
            },
            addReward() {
                if (!this.addItemNum || !this.addItemId || this.addItemNum <= 0) {
                    this.$Message.error('请正确添加');
                    return;
                }
                this.form.rewards.push({id: this.addItemId, num: this.addItemNum});

                /** 合并相同id >> 暂时可以不用 */
                let newArr = []
                this.form.rewards.forEach(el => {
                    const result = newArr.findIndex(ol => {
                        return el.id === ol.id
                    })
                    if (result !== -1) {
                        newArr[result].num = newArr[result].num + el.num
                    } else {
                        newArr.push(el)
                    }
                })
                this.form.rewards = newArr;
                // this.form.rewards.forEach(obj => {
                //   const result = this.itemData.staffList.findIndex(ol => {
                //     return obj.id === ol.id
                //   })
                //   if (result !== -1 && obj.num > 1) {
                //     this.$message({
                //       type: 'warning',
                //       message: `员工${obj.id}的数量超过上限，已重置`
                //     });
                //     obj.num = 1;
                //   }
                // })
                /** 合并相同id >> end */

                this.clearAddItem();
            },
            clearAddItem() {
                this.addItemId = '';
                this.addItemNum = '';
            },
            clearRewards() {
                this.form.rewards = [];
            },
            delReward(index) {
                this.form.rewards.splice(index, 1);
            },
            openCDkeyDialog(scopeRow) {
                this.page.cdkey.currentOperation = scopeRow;
                this.page.cdkey.currentpage = 1;
                this.getCDkey();
                this.dialogSeeVisible = true;
            },
            getCDkey() {
                getCDkeys({
                    per_page: this.page.cdkey.pagesize,
                    cur_page: this.page.cdkey.currentpage,
                    operationId: this.page.cdkey.currentOperation.operationId
                }).then(res => {
                    if (res.status === 200) {
                        this.page.cdkey.total = res.data.total;
                        this.cdkeys = res.data.cdkeys;
                    }
                });
            },
            hideCDkeyDialog() {
                this.dialogSeeVisible = false;
                this.getOperation();
            },
            openSeeUserDialog(key) {
                this.page.user.key = key;
                this.page.user.currentpage = 1;
                this.getUseUser();
                this.dialogSeeUserVisible = true;
            },
            deleteCDkey(row) {
                if (row.useNum > 0) {
                    this.$Message.error('该条cdkey已被使用');
                    return;
                }
                this.$Modal.confirm({
                    title: "确认删除",
                    content: "您确认要删除 " + row.key + " ?",
                    loading: true,
                    onOk: () => {
                        deleteCDkey({key: row.key}).then(res => {
                            this.$Modal.remove();
                            if (res.status === 200) {
                                if (res.data.error){
                                    this.$Message.error(res.data.error);
                                } else {
                                    this.$Message.success('成功删除' + res.data.success + '条CDkey');
                                }
                                this.getCDkey();
                            }
                        })
                    }
                });
            },
            getUseUser() {
                getUseUsers({
                    per_page: this.page.user.pagesize,
                    cur_page: this.page.user.currentpage,
                    key: this.page.user.key
                }).then(res => {
                    if (res.status === 200) {
                        this.page.user.total = res.data.total;
                        this.users = res.data.users;
                    }
                });
            },
            exportExcel() {
                if (this.page.cdkey.total > this.downloadDataLimit) {
                    this.dialogExportExcelVisible = true;
                    return;
                }
                this.getExportExcel(0, this.page.cdkey.total);
            },
            exportExcelInBatches(n) {
                this.getExportExcel((n - 1) * this.downloadDataLimit, this.downloadDataLimit);
            },
            getExportExcel(startIndex, pageSize) {
                exportExcel({
                    operationId: this.page.cdkey.currentOperation.operationId,
                    startIndex: startIndex,
                    pageSize: pageSize
                }).then(res => {
                    let url = window.URL.createObjectURL(new Blob([res.data]))
                    let link = document.createElement('a')
                    link.style.display = 'none'
                    link.href = url
                    let fileName = res.headers['content-disposition'].split('filename=');
                    fileName[1] = util.Time2DefaultFormat(new Date().getTime()) + ".xlsx";
                    link.setAttribute('download', fileName[1]);

                    document.body.appendChild(link)
                    link.click()
                });
            },
            hideSeeUserDialog() {
                this.dialogSeeUserVisible = false;
            },
            formatReward(rewardStr) {
                let rowElement = rewardStr.split(';');
                let array = [];
                rowElement.forEach((obj) => {
                    const result = this.itemLists.findIndex(ol => {
                        return parseInt(obj.split(',')[0]) === ol.id
                    })
                    if (result !== -1) {
                        array.push(this.itemLists[result].name + '*' + obj.split(',')[1]);
                    } else {
                        array.push(obj.split(',')[0] + '*' + obj.split(',')[1]);
                    }
                })
                return array.join(', ');
            },
            formatItem(id) {
                let name = '';
                this.itemLists.forEach((o) => {
                    if (o.id === id) {
                        name = o.name;
                    }
                })
                return name;
            },
        }
    }
</script>

<style scoped>

</style>

