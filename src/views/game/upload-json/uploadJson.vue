<template>
  <div>
    <Divider>JSON上传</Divider>
    <Upload
      multiple
      ref="upload"
      type="drag"
      accept=".json, .JSON"
      :max-size="5000"
      :before-upload="handleUpload"
      action="#"
    >
      <div style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>点击或者拖拽到此次上传文件</p>
      </div>
    </Upload>
    <div>
      <ul class="file-list" v-for="(file,index) in fileList" :key="index">
        <li>文件名: <span style="font-size:15px;">{{ file.name }} </span> <Button @click="deleteFile(index)">删除</Button></li>
      </ul>
    </div>
    <Button type="primary"  @click="upload" v-if="this.$route.meta.permTypes.includes('upload')">上传</Button>
    <Button type="primary"  @click="upload" v-else="!this.$route.meta.permTypes.includes('upload')" disabled>上传</Button>

    <h2 v-show="succesList.length>0">成功信息</h2>
    <ul class="file-list" v-for="(item,index) in succesList" :key="index">
      <li><span style="font-size:15px;">{{ item }}</span></li>
    </ul>
    <h2 v-show="errorList.length>0">错误信息</h2>
    <ul class="file-list" v-for="(item,index) in errorList" :key="index">
      <li><span style="font-size:15px;">{{ item }}</span></li>
    </ul>

    <Divider>查看服务器JSON</Divider>
    <Input type="text" v-model="fileName" clearable placeholder="请输入文件名 xxx.json" style="width: 200px"/>
    <Button @click="openDialog">查看服务器JSON</Button>

    <Modal title=服务器JSON v-model="dialogFormVisible" :mask-closable="false" width="1000">
      <Button @click="clickCopyPre()">点击复制</Button><br>
      <pre id="copyPre">
        {{jsonStr}}
      </pre>
      <div slot="footer" class="dialog-footer">
        <Button @click="hideDialog()">取 消</Button>
      </div>
    </Modal>

    <Divider>服务器列表</Divider>

    <Row  v-show="this.$route.meta.permTypes.includes('other')">
      <Table border :columns="columns" :data="serverList" ref="table"></Table>
      <Button @click="loadRemoteConfig()" type="info" :loading="loading">加载远程配置</Button>
    </Row>
  </div>
</template>

<script>
    import {uploadJson,loadRemoteConfigs,getListByEnable,getJsonByName} from "@/api/index";

    export default {
        name: "uploadJson",
        data () {
            return {
                fileList: [],
                errorList: [],
                succesList: [],
                serverList: [],
                isShow: true,
                loading: false,
                fileName:'',
                jsonStr:'',
                jsonStrFormat: '',
                dialogFormVisible: false,
                columns: [
                    {type: "index", width: 60, align: "center"},
                    {title: "服务器名称", key: "name", align: "center", width: 150},
                    {title: "服务器地址", key: "address", align: "center", width: 150,},
                    {title: "端口", key: "port", align: "center", width: 100,},
                    {title: "请求url", key: "requestUrl", align: "center", width: 200,},
                    {title: "加载状态", key: "success", align: "center", width: 100,
                        render: (h, params) => {
                            if (this.isShow) {
                                return h("div", params.row.success);
                            } else  {
                                return '';
                            }
                        }},
                    {title: "加载远程配置返回信息", key: "msg", align: "center", width: 300,},
                ],
            }
        },
        methods: {
            init() {
                this.getServerList();
            },
            handleUpload (file) {
                this.fileList.push(file);
                return false;
            },
            upload () {
                console.log('>>>>', this.fileList)
                if (this.fileList.length == 0) {
                    this.$Message.error('未选择文件！');
                    return;
                }
                let formData = new FormData();
                for(var i=0; i< this.fileList.length; i++){
                    formData.append("file",this.fileList[i]);
                }
                uploadJson(formData).then(res=>{
                    if (res.status === 200) {
                        this.fileList = [];
                        this.$Message.success('上传成功');
                        this.succesList = res.data.succ;
                        this.errorList = res.data.error;
                    }else {
                        this.$Message.error(res.data);
                    }
                })
            },
            deleteFile(index) {
                this.fileList.splice(index,1);
            },
            getServerList() {
                if (!this.$route.meta.permTypes.includes('other')) {
                    return
                }
                getListByEnable().then(res =>{
                    if (res.success){
                        this.isShow = false;
                        this.serverList = res.result;
                    }
                })
            },
            loadRemoteConfig() {
                this.loading = true;
                loadRemoteConfigs().then(res=>{
                    this.loading = false;
                    this.serverList = res.result;
                })
            },
            openDialog() {
                this.getJsonByName();
            },
            hideDialog() {
                this.dialogFormVisible = false;
            },
            getJsonByName(){
                this.jsonStr = '';
                getJsonByName({fileName: this.fileName}).then(res=>{
                    if (res.status === 200){
                        if (res.data.error){
                            this.hideDialog();
                            this.$Message.error(res.data.error);
                        }else {
                            this.dialogFormVisible = true;
                            this.jsonStr = res.data.jsonStr;
                        }
                    }
                })
            },
            clickCopyPre(){
                var div = document.getElementById('copyPre');
                if (document.body.createTextRange) {
                    var range = document.body.createTextRange();
                    range.moveToElementText(div);
                    range.select();
                } else if (window.getSelection) {
                    var selection = window.getSelection();
                    var range = document.createRange();
                    range.selectNodeContents(div);
                    selection.removeAllRanges();
                    selection.addRange(range);
                } else {
                    console.warn("none");
                }
                document.execCommand("Copy"); // 执行浏览器复制命令

                this.$Message.success(`复制成功`);
            },
        },
        mounted() {
            this.init();
        }

    }
</script>

<style scoped>

  #loadResult{
    max-width: 90%;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }
  pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; }

</style>
