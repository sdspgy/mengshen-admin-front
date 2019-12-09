<template>
  <div id="random">
    <Form ref="form" :label-width="120">
      <FormItem label="玩家ID">
        <Input v-model="userId"></Input>
      </FormItem>
      <FormItem label="随机次数">
        <Input v-model="cnt"></Input>
      </FormItem>
      <FormItem label="抽取方式">
        <Select v-model="typeId" placeholder="抽取方式">
          <Option label="5连抽" value="5"></Option>
          <Option label="单抽" value="1"></Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="onSubmit">开始随机</Button>
      </FormItem>
    </Form>

    <Table :columns="columns" :data="staffs" ref="table"></Table>
  </div>
</template>

<script>
    import {randomDiamondStaff} from "@/api/index";

    export default {
        name: "diamondRecruit",
        data() {
            return {
                columns: [
                    {type: "index", width: 60, align: "center"},
                    {title: "xmlId", key: "xmlId", width: 150, align: "center"},
                    {title: "数量", key: "num", width: 150, align: "center",},
                ],
                userId: '',
                cnt: '',
                typeId: '5',
                staffs: []
            }
        },
        methods: {
            onSubmit() {
                this.staffs = [];
                if (!this.userId || !this.cnt) {
                    this.$Message.error('参数为空');
                    return
                }
                randomDiamondStaff({userId: this.userId, cnt: this.cnt, typeId: this.typeId}).then(res => {
                    if (res.status == 200) {
                        this.staffs = res.data.staffs;
                    } else {
                        if (res.code !== 403){
                            this.$Message.error('系统错误');
                        }
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
