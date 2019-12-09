<template>
  <div id="sendMail">
    <Form ref="form" :model="form" :label-width="80">
      <FormItem label="标题">
        <Input v-model="form.title"></Input>
      </FormItem>
      <FormItem label="内容">
        <Input
                type="textarea"
                autosize
                placeholder=""
                v-model="form.content">
        </Input>
      </FormItem>
      <FormItem label="奖励">
        <Input v-model="form.reward"></Input>
      </FormItem>
      <FormItem>
        <RadioGroup v-model="form.type" @on-change="disableUserId">
        <Radio label="1" >全服</Radio>
        <Radio label="2" >指定玩家（useid集合）</Radio>
        <Radio label="3" >指定玩家(openid的集合)</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="玩家ID">
        <Input v-model="form.userId" :disabled="disabledInput"/>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="onSubmit">发送邮件</Button>
      </FormItem>
    </Form>
    <h2 v-show="succ.length>0">发送成功的玩家信息</h2>
    <ul class="file-list" v-for="(item,index) in succ" :key="index">
      <li><span style="font-size:15px;">{{ item }}</span></li>
    </ul>
    <h2 v-show="fail.length>0">发送失败的玩家信息</h2>
    <ul class="file-list" v-for="(item,index) in fail" :key="index">
      <li><span style="font-size:15px;">{{ item }}</span></li>
    </ul>
  </div>

</template>

<script>
    import {sendMail} from "@/api/index";
    export default {
        name: "sendMail",
        data() {
            return {
                form: {
                    userId: '-1',
                    title: '',
                    content: '',
                    type: '1',
                    reward:'',
                },
                succ: [],
                fail: [],
                disabledInput: true
            }
        },
        methods: {
            disableUserId(label) {
                if (label == 1) {
                    this.form.userId = '-1';
                    this.disabledInput = true;
                } else {
                    this.form.userId = '';
                    this.disabledInput = false;
                }
            },
            onSubmit() {
                sendMail(this.form).then(res=>{
                    if (res.status === 200){
                         console.log(res);
                      
                        var succCnt = 0;
                        var failCnt = 0;
                        if(res.data.succ){
                            this.succ = res.data.succ;
                            succCnt = this.succ.length;
                        }

                        if(res.data.fail){
                            this.fail = res.data.fail;
                            failCnt = this.fail.length;
                        }
                        this.$Message.success('发送成功'+succCnt+"个,失败了"+failCnt+"个！");
                    }else if(res.status === -1){
                        this.$Message.error(res.data);
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
