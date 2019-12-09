<template>
  <div id="random">
    <Form ref="form" :label-width="100">
      <FormItem label="goldCostFairId">
        <Input v-model="configId"/>
      </FormItem>
      <FormItem label="随机次数">
        <Input v-model="cnt"/>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="onSubmit">开始随机</Button>
      </FormItem>
    </Form>

    <Table :columns="columns" :data="staffs" ref="table"></Table>
  </div>
</template>

<script>
    import {randomGoldStaff} from "@/api/index";
    export default {
        name: "goldRecruit",
        data() {
            return {
                columns: [
                    {type: "index", width: 60, align: "center"},
                    {title: "xmlId", key: "xmlId", width: 150, align: "center"},
                    {title: "数量", key: "num", width: 150, align: "center",},
                ],
                configId: '',
                cnt: '',
                staffs: []
            }
        },
        methods: {
            onSubmit() {
                this.staffs = [];
                randomGoldStaff({configId:this.configId,cnt:this.cnt}).then(res=>{

                });
                this.axios.get(`randomGoldStaff?configId=${this.configId}&cnt=${this.cnt}`)
                    .then(data => {
                        if (data.status === 200) {
                            this.staffs = data.data.staffs
                        } else {
                            this.$alert(data.data, '系统错误', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.$message({
                                        type: 'info',
                                        message: `action: ${action}`
                                    });
                                }
                            });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        }
    }
</script>

<style scoped>

</style>
