<template>
  <div>
    <Upload
            multiple
            ref="upload"
            type="drag"
            accept=".jpg, .jpeg, .png, .gif, .bmp"
            :max-size="5000"
            :before-upload="handleUpload"
            action="#"
    >
      <div style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>点击或者拖拽到此次上传图片</p>
      </div>
    </Upload>
    <div>
      <ul class="file-list" v-for="(file,index) in fileList" :key="index">
        <li>文件名: <span style="font-size:15px;">{{ file.name }} </span> <Button @click="deleteFile(index)">删除</Button></li>
      </ul>
    </div>
    <Row>
      <Col v-for="(item, i) in types" :key="i" style="float: left;margin: 10px">
        <Button type="primary"  @click="upload(item.type)">上传{{item.name}}图片</Button>
      </Col>
    </Row>

    <h2 v-show="succesList.length>0">成功信息</h2>
    <ul class="file-list" v-for="(item,index) in succesList" :key="index">
      <li><span style="font-size:15px;">{{ item }}</span></li>
    </ul>
    <h2 v-show="errorList.length>0">错误信息</h2>
    <ul class="file-list" v-for="(item,index) in errorList" :key="index">
      <li><span style="font-size:15px;">{{ item }}</span></li>
    </ul>


  </div>
</template>

<script>
    import uploadPicInput from "../../my-components/rbac/upload-pic-input";
    import {getUploadImgConfig,uploadImg} from "@/api/index";
    export default {
        name: "uploadImg",
        components: {
            uploadPicInput
        },
        data() {
            return {
                fileList: [],
                errorList: [],
                succesList: [],
                types:[],
            }
        },
        methods: {
            getUploadImgConfig(){
                getUploadImgConfig().then(res=>{
                    this.types = [];
                    res.result.forEach(obj=>{
                        this.types.push({type:obj.split(",")[0],name:obj.split(",")[1]})
                    })
                })
            },
            handleUpload (file) {
                this.fileList.push(file);
                return false;
            },
            upload (type) {
                console.log('>>>>', this.fileList)
                if (this.fileList.length == 0) {
                    this.$Message.error('未选择文件！');
                    return;
                }
                let formData = new FormData();
                for(var i=0; i< this.fileList.length; i++){
                    formData.append("file",this.fileList[i]);
                }
                formData.append("type",type);
                uploadImg(formData).then(res=>{
                    debugger
                    if (res.code === 200) {
                        this.fileList = [];
                        this.$Message.info('上传成功');
                        this.succesList = res.result.succ;
                        this.errorList = res.result.error;
                    }
                })
            },
            deleteFile(index) {
                this.fileList.splice(index,1);
            },
        },
        mounted() {
            this.getUploadImgConfig();
        }
    }
</script>

<style scoped>

</style>
