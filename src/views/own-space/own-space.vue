<style lang="less" scoped>
@import "./own-space.less";
</style>

<template>
  <div class="own-space">
    <Card class="own-space-new">
      <div class="own-wrap">
        <div style="width:240px">
          <Menu active-name="基本信息" theme="light" @on-select="changeMenu">
            <MenuItem name="基本信息">基本信息</MenuItem>
            <MenuItem name="安全设置">安全设置</MenuItem>
          </Menu>
        </div>
        <div style="padding: 8px 40px;width:100%">
          <div class="title">{{currMenu}}</div>
          <div>
            <div v-show="currMenu=='基本信息'">
              <Form ref="userForm" :model="userForm" :label-width="90" label-position="left">
                <FormItem label="用户头像：">
                  <upload-pic-thumb
                    @on-change="userForm.avatar=$event"
                    :multiple="false"
                    ref="uploadThumb"
                  ></upload-pic-thumb>
                </FormItem>
                <FormItem label="昵称：" prop="nickName">
                  <Input v-model="userForm.nickName" style="width: 250px" />
                </FormItem>
                <FormItem label="电话：" prop="mobile">
                  <Input v-model="userForm.mobile" style="width: 250px" />
                </FormItem>
                <FormItem label="邮箱：" prop="email">
                  <Input v-model="userForm.email" style="width: 250px" />
                </FormItem>
                <FormItem label="性别：">
                  <RadioGroup v-model="userForm.sex">
                    <Radio v-for="(item, i) in dictSex" :key="i" :label="item.value">{{item.title}}</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="个人简介：" prop="description">
                  <Input
                    v-model="userForm.description"
                    type="textarea"
                    style="width: 250px"
                    :autosize="{minRows: 3,maxRows: 5}"
                    placeholder="个人简介"
                  ></Input>
                </FormItem>
                <FormItem label="国家/地区：">
                  <Select v-model="area" style="width: 250px">
                    <Option :value="86">中国</Option>
                  </Select>
                </FormItem>
                <FormItem label="所在省市：">
                  <al-cascader
                    v-model="userForm.addressArray"
                    @on-change="changeAddress"
                    data-type="code"
                    level="2"
                    style="width:250px"
                  />
                </FormItem>
                <FormItem label="街道地址：" prop="street">
                  <Input v-model="userForm.street" style="width: 250px" />
                </FormItem>
                <FormItem label="用户类型：">
                  <span>{{ userForm.typeTxt }}</span>
                </FormItem>
                <FormItem label="注册时间：">
                  <span>{{ userForm.createTime }}</span>
                </FormItem>
                <FormItem>
                  <Button
                    type="primary"
                    style="width: 100px;margin-right:5px"
                    :loading="saveLoading"
                    @click="saveEdit"
                  >保存</Button>
                </FormItem>
              </Form>
            </div>
            <div v-show="currMenu=='安全设置'" class="safe">
              <div class="item">
                <div>
                  <div class="title">账户密码</div>
                  <div v-if="userForm.passStrength" class="desc">
                    当前密码强度：
                    <span
                      v-if="userForm.passStrength=='弱'"
                      class="red"
                    >{{userForm.passStrength}}</span>
                    <span v-if="userForm.passStrength=='中'" class="middle">{{userForm.passStrength}}</span>
                    <span v-if="userForm.passStrength=='强'" class="green">{{userForm.passStrength}}</span>
                  </div>
                </div>
                <div>
                  <a @click="changePass">修改</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import {
  userInfoEdit,
} from "@/api/index";
import uploadPicThumb from "@/views/my-components/rbac/upload-pic-thumb";
import checkPassword from "@/views/my-components/rbac/check-password";
import Cookies from "js-cookie";
export default {
  components: {
    uploadPicThumb,
    checkPassword
  },
  name: "ownspace_index",
  data() {
    return {
      area: 86,
      userForm: {
        id: "",
        avatar: "",
        username: "",
        sex: "",
        mobile: "",
        email: "",
        status: "",
        type: "",
        typeTxt: "",
        address: "",
        addressArray: []
      },
      codeError: "",
      initPhone: "",
      initEmail: "",
      saveLoading: false,
      sending: false,
      jumping: false,
      currMenu: "基本信息",
      dictSex: this.$store.state.dict.sex
    };
  },
  methods: {
    init() {
      let v = JSON.parse(Cookies.get("userInfo"));
      // 转换null为""
      for (let attr in v) {
        if (v[attr] == null) {
          v[attr] = "";
        }
      }
      let str = JSON.stringify(v);
      let userInfo = JSON.parse(str);
      userInfo.addressArray = [];
      this.userForm = userInfo;
      this.$refs.uploadThumb.setData(userInfo.avatar);
      if (userInfo.address) {
        this.userForm.address = userInfo.address;
        this.userForm.addressArray = JSON.parse(userInfo.address);
      }
      if (this.userForm.type == 0) {
        this.userForm.typeTxt = "普通用户";
      } else if (this.userForm.type == 1) {
        this.userForm.typeTxt = "管理员";
      }
    },
    changePass() {
      this.$router.push({
        name: "change_pass"
      });
    },
    changeMenu(v) {
      this.currMenu = v;
    },
    saveEdit() {
      this.saveLoading = true;
      let params = this.userForm;
      delete params.roles;
      userInfoEdit(params).then(res => {
        this.saveLoading = false;
        if (res.success) {
          this.$Message.success("保存成功");
          // 更新用户信息
          Cookies.set("userInfo", this.userForm);
          // 更新头像
          this.$store.commit("setAvatarPath", this.userForm.avatar);
        }
      });
    },
    changeAddress() {
      this.userForm.address = JSON.stringify(this.userForm.addressArray);
    },
  },
  mounted() {
    this.init();
  }
};
</script>
