<template>
  <div>
    <Form :model="form" :label-width="120">
      <FormItem label="服务端版本号">
        <Input v-model="form.version" autocomplete="off" placeholder="请输入服务端版本号"/>
      </FormItem>

      <FormItem label="app版本号">
        <Input v-model="form.appVersion" autocomplete="off" placeholder="请输入app版本号"/>
      </FormItem>

      <FormItem label="停服公告标题">
        <Input v-model="form.title" autocomplete="off" placeholder="请输入停服公告标题"/>
      </FormItem>

      <FormItem label="停服公告">
        <Input v-model="form.maintenanceMsg" autocomplete="off" type="textarea" placeholder="请输入公告内容"
               :autosize="{ minRows: 3, maxRows: 5}"/>
      </FormItem>

      <FormItem label="白名单(openid半角逗号分隔)">
        <Input v-model="form.whiteList" autocomplete="off" placeholder="请输入停服后可进入游戏的白名单openid英文逗号分隔"/>
      </FormItem>
    </Form>
    <Button type="primary" @click="updateStopServerNotice()">更新停服公告</Button>
    <br/><br/>
    <div v-show="!isOpenServer">
      <h3 style="color: #ff0000">当前处于停服状态</h3>
      <Button type="primary" @click="changeServerState(true)">开服</Button>
    </div>
    <div v-show="isOpenServer">
      <h3 style="color: #1bd70b">当前处于开服状态</h3>
      <Button type="error" @click="changeServerState(false)">停服</Button>
    </div>


  </div>
</template>

<script>
    import {getStopServerInfo, updateStopServerNotice, changeServerState} from "@/api/index";

    export default {
        name: "serverManager",
        data() {
            return {
                form: {
                    version: '',
                    appVersion: '',
                    whiteList: '',
                    maintenanceMsg: '',
                    title: '',
                },
                isOpenServer: true,
            }
        },
        methods: {
            init() {
                getStopServerInfo().then(res => {
                    if (res.status === 200) {
                        this.form = res.data.announce;
                        this.isOpenServer = res.data.isOpenServer;
                    }
                });
            },
            updateStopServerNotice() {
                updateStopServerNotice(this.form).then(res => {
                    if (res.status === 200) {
                        this.$Message.success('修改成功');
                        this.form = res.data.announce;
                    }
                })
            },
            changeServerState(isOpen) {
                this.isOpenServer = isOpen;
                changeServerState({isOpenServer: this.isOpenServer}).then(res => {
                    if (res.status === 200) {
                        if (res.data.isOpenServer) {
                            this.$Message.success('开服');
                        }else {
                            this.$Message.error('停服');
                        }
                        this.isOpenServer = res.data.isOpenServer;
                    }
                    this.init();
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
