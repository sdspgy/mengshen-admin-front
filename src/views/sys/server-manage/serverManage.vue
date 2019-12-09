<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <div v-if="currServer">
              <h2>当前操作主服务器</h2>
              <h4>服务器名称:{{currServer.name}}</h4>
              <h4>服务器地址:{{currServer.address}}</h4>
              <h4>服务器端口:{{currServer.port}}</h4>
            </div>
            <div v-else>
              <h2>还未选择操作主服务器</h2>
            </div>
            <hr><br>
          </Row>
          <Row>
            <Modal :title=dialogFormTitle v-model="dialogFormVisible" :mask-closable="false" width="50%">
              <Form :model="serverForm" :label-width="120">

                <FormItem label="服务器名称">
                  <Input v-model="serverForm.name" autocomplete="off" placeholder="请输入服务器名称"/>
                </FormItem>

                <FormItem label="服务器地址" >
                  <Input v-model="serverForm.address" autocomplete="off" placeholder="请输入服务器地址ip或域名  例10.10.10.10 或 www.huai.com "/>
                </FormItem>

                <FormItem label="端口" >
                  <Input v-model="serverForm.port" autocomplete="off" placeholder="请输入端口号，default_port:80"/>
                </FormItem>
              </Form>
              <div slot="footer">
                <Button @click="hideAddDialog()">取 消</Button>
                <Button type="primary" @click="addServer()" v-show="!isEdit">添加</Button>
                <Button type="primary" @click="editServer()" v-show="isEdit">修改</Button>
              </div>
            </Modal>
          </Row>
          <Row>
            <Modal title="查看服务器组" v-model="viewDialogFormVisible" :mask-closable="false" width="1000px">
              <h2>当前服务器</h2>
              <h4>服务器名称:{{viewServer.name}}</h4>
              <h4>服务器地址:{{viewServer.address}}</h4>
              <h4>服务器端口:{{viewServer.port}}</h4>
              <h2>当前子服务器列表</h2>
              <Button @click="openAddDialogWithChildren" type="primary" icon="md-add">添加子服务器</Button>
              <Table border :columns="columns" :data="childrenData" ref="table" sortable="custom"></Table>
              <div slot="footer">
                <Button @click="hideViewDialog()">取 消</Button>
              </div>
            </Modal>
          </Row>
          <Row class="operation">
            <Button @click="openAddDialog" type="primary" icon="md-add" v-show="this.$route.meta.permTypes.includes('add')">添加主服务器</Button>
            <Button @click="getServerByPage" v-show="this.$route.meta.permTypes.includes('view')">刷新</Button>
          </Row>
          <Row>
            <Alert show-icon>
              已选择
              <span class="select-count">{{selectCount}}</span> 项
              <a class="select-clear" @click="clearSelectAll">清空</a>
            </Alert>
          </Row>
          <Row>
            <h2>主服务器列表</h2>
            <Table
                    :loading="loading"
                    border
                    :columns="columns"
                    :data="data"
                    ref="table"
                    sortable="custom"
                    @on-sort-change="changeSort"
                    @on-selection-change="changeSelect"
            ></Table>
          </Row>
          <Row type="flex" justify="end" class="page">
            <Page
                    :current="pageNumber"
                    :total="total"
                    :page-size="pageSize"
                    @on-change="changePage"
                    @on-page-size-change="changePageSize"
                    :page-size-opts="[10,20,50]"
                    size="small"
                    show-total
                    show-elevator
                    show-sizer
            ></Page>
          </Row>
        </Card>
      </Col>
    </Row>

  </div>
</template>

<script>
    import {getServerByPage,addServer,updateServer,disableServer,enableServer,setDefaultServer,getDefaultServer,getServerListByParentId} from "@/api/index";
    export default {
        name: "serverManage",
        data(){
            return{
                currServer: "",
                loading: true,
                selectList: [],
                selectCount: 0,
                dialogFormVisible: false,
                viewDialogFormVisible: false,
                dialogFormTitle: '',
                isEdit: false,
                columns: [
                    {
                        type: "selection",
                        width: 60,
                        align: "center"
                    },
                    {
                        type: "index",
                        width: 60,
                        align: "center"
                    },
                    {
                        title: "服务器名称",
                        key: "name",
                        align: "center",
                        width: 150,
                        sortable: true
                    },
                    {
                        title: "服务器地址",
                        key: "address",
                        align: "center",
                        width: 150,
                        sortable: true
                    },
                    {
                        title: "端口",
                        key: "port",
                        align: "center",
                        width: 100,
                    },
                    {
                        title: "状态",
                        key: "state",
                        align: "center",
                        width: 100,
                        sortable: true,
                        render: (h, params) => {
                            if (params.row.status == 0) {
                                return h("div", [h("Tag", {props: {color: "blue"}}, "正常")]);
                            } else if (params.row.status == -1) {
                                return h("div", [h("Tag", {props: {color: "red"}}, "弃用")]);
                            }
                        }
                    },
                    {
                        title: "创建时间",
                        key: "createTime",
                        align: "center",
                        width: 180,
                        sortable: true,
                        sortType: "desc"
                    },
                    {
                        title: "更新时间",
                        key: "updateTime",
                        align: "center",
                        width: 180,
                        sortable: true
                    },
                    {
                        title: "操作",
                        key: "action",
                        align: "center",
                        width: 300,
                        render: (h, params) => {
                            let enableOrDisable = "";
                            let showButton = "";
                            let editButton = h("Button", {props: {type: "primary", size: "small",disabled:!this.$route.meta.permTypes.includes('edit')}, style: {marginRight: "5px"}, on: {click: () => {this.openEditDialog(params.row);}}}, "编辑");
                            if (params.row.status == 0) {
                                enableOrDisable = h("Button", {props: {size: "small",disabled:!this.$route.meta.permTypes.includes('disable')}, style: {marginRight: "5px"}, on: {click: () => {this.disable(params.row);}}}, "禁用");
                            } else {
                                enableOrDisable = h("Button", {props: {type: "success", size: "small",disabled:!this.$route.meta.permTypes.includes('enable')}, style: {marginRight: "5px"}, on: {click: () => {this.enable(params.row);}}}, "启用");
                            };
                            let setDefaultButton = "";
                            if (params.row.parentId == "0") {
                                showButton = h("Button", {props: {type: "info", size: "small"}, style: {marginRight: "5px"}, on: {click: () => {this.openShowDialog(params.row);}}}, "查看");
                                setDefaultButton = h("Button", {props: {type: "info", size: "small",disabled:this.currServer.id == params.row.id}, style: {marginRight: "5px"}, on: {click: () => {this.setDefault(params.row);}}}, "设为操作服");
                            }
                            return h("div", [showButton,editButton, enableOrDisable, setDefaultButton]);
                        }
                    }
                ],
                data: [],
                childrenData: [],
                serverForm: {
                    name: "",
                    address: "",
                    port:"",
                    parentId: "0"
                },
                viewServer: {},
                sortColumn: "createTime",
                sortType: "desc",
                pageNumber: 1,
                pageSize: 10,
                total: 0,
            }
        },
        methods:{
            init(){
                this.getServerByPage();
                this.getDefault();
            },
            getServerByPage(){
                let params = {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize,
                    sort: this.sortColumn,
                    order: this.sort,
                };
                this.loading = true;
              getServerByPage(params).then(res=>{
                  this.loading = false;
                  if (res.success) {
                      this.data = res.result.records;
                      this.total = res.result.total
                      if (res.result.content || res.result.totalElements){
                          this.data =  res.result.content;
                          this.total = res.result.totalElements;
                      }
                  }
              })
            },
            refresh(){
                if (this.viewDialogFormVisible){
                    this.getServerListByParentId()
                } else {
                    this.getServerByPage();
                }
            },
            addServer(){
                if (!this.checkFormData()) {
                    return;
                }
                addServer(this.serverForm).then(res=>{
                    if (res.success) {
                        this.hideAddDialog();
                        this.refresh();
                    }
                })
            },
            editServer(){
                if (!this.checkFormData()) {
                    return;
                }
                updateServer(this.serverForm).then(res=>{
                    if (res.success) {
                        this.hideAddDialog();
                        this.refresh();
                    }
                })
            },
            checkFormData(){
                if (!this.serverForm.name){
                    this.$Message.error("请输入服务器名称");
                    return false;
                }
                if (!this.serverForm.address){
                    this.$Message.error("请输入服务器地址");
                    return false;
                }
                if (!this.serverForm.port){
                    this.serverForm.port = 80;
                }
                return true;
            },
            clearSelectAll() {
                this.$refs.table.selectAll(false);
            },
            changeSelect(e) {
                this.selectList = e;
                this.selectCount = e.length;
            },
            changePage(v) {
                this.pageNumber = v;
                this.getServerByPage();
                this.clearSelectAll();
            },
            changePageSize(v) {
                this.pageSize = v;
                this.getServerByPage();
            },
            changeSort(e) {
                this.sortColumn = e.key;
                this.sortType = e.order;
                if (e.order == "normal") {
                    this.sortType = "";
                }
                this.getServerByPage();
            },
            openAddDialog() {
                this.dialogFormTitle = '添加服务器';
                this.serverForm = {};
                this.serverForm.parentId = "0";
                this.isEdit = false;
                this.dialogFormVisible = true;
            },
            hideAddDialog() {
                this.dialogFormVisible = false;
                this.refresh();
            },
            openAddDialogWithChildren() {
                this.openAddDialog();
                this.dialogFormTitle = '添加子服务器';
                this.serverForm.parentId = this.viewServer.id;
            },
            hideViewDialog() {
                this.viewDialogFormVisible = false;
                this.getServerByPage();
            },
            openShowDialog(scopeRow){
                this.viewServer = scopeRow;
                this.getServerListByParentId();
                this.viewDialogFormVisible = true;
            },
            getServerListByParentId(){
                getServerListByParentId({parentId:this.viewServer.id}).then(res=>{
                    if (res.success) {
                        this.childrenData = res.result;
                    }
                })
            },
            openEditDialog(scopeRow) {
                this.dialogFormTitle = '修改服务器';
                this.isEdit = true;
                this.serverForm = scopeRow;
                this.dialogFormVisible = true;
            },
            enable(v) {
                this.$Modal.confirm({
                    title: "确认启用",
                    content: "您确认要启用服务器 " + v.name + " ?",
                    loading: true,
                    onOk: () => {
                        enableServer({id:v.id}).then(res => {
                            this.$Modal.remove();
                            if (res.success) {
                                this.$Message.success("操作成功");
                                this.refresh();
                            }
                        });
                    }
                });
            },
            disable(v) {
                this.$Modal.confirm({
                    title: "确认禁用",
                    content: "您确认要禁用服务器 " + v.name + " ?",
                    loading: true,
                    onOk: () => {
                        disableServer({id:v.id}).then(res => {
                            this.$Modal.remove();
                            if (res.success) {
                                this.$Message.success("操作成功");
                                this.refresh();
                            }
                        });
                    }
                });
            },
            setDefault(v) {
                this.$Modal.confirm({
                    title: "确认设置",
                    content: "您确认要 " + v.name + " 为默认操作服务器?",
                    loading: true,
                    onOk: () => {
                        setDefaultServer({id:v.id}).then(res => {
                            this.$Modal.remove();
                            if (res.success) {
                                this.$Message.success(res.message);
                            }else {
                                this.$Message.error(res.message);
                            }
                            this.getDefault();
                        });
                    }
                });
            },
            getDefault(){
                this.currServer = "";
                getDefaultServer().then(res => {
                    if (res.success) {
                        this.currServer = res.result;
                    }
                })
            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style scoped>

</style>
