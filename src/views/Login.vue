<template>
  <div class="login">
    <Row type="flex" justify="center" align="middle" @keydown.enter.native="submitLogin">
      <Col style="width: 368px;">
        <Header/>
        <Row>
          <Tabs>
            <TabPane :label="$t('usernameLogin')" name="username" icon="md-person">
                <Form
                        ref="usernameLoginForm"
                        :model="form"
                        :rules="rules"
                        class="form">
                    <FormItem prop="username">
                        <Input
                                v-model="form.username"
                                prefix="ios-contact"
                                size="large"
                                clearable
                                placeholder="请输入用户名"
                                autocomplete="off"
                        />
                    </FormItem>
                    <FormItem prop="password">
                        <Input
                                type="password"
                                v-model="form.password"
                                prefix="ios-lock"
                                size="large"
                                clearable
                                placeholder="请输入密码"
                                autocomplete="off"
                        />
                    </FormItem>
                </Form>
            </TabPane>
          </Tabs>
          <Row>
            <Button
              class="login-btn"
              type="primary"
              size="large"
              :loading="loading"
              @click="submitLogin"
              long>
              <span v-if="!loading">{{ $t('login') }}</span>
              <span v-else>{{ $t('logining') }}</span>
            </Button>
          </Row>
        </Row>
      </Col>
      <LangSwitch />
    </Row>
  </div>
</template>

<script>
import { login, userInfo, initCaptcha, drawCodeImage } from "@/api/index";
import Cookies from "js-cookie";
import Header from "@/views/main-components/header";
import LangSwitch from "@/views/main-components/lang-switch";
import util from "@/libs/util.js";
export default {
  components: {
    LangSwitch,
    Header
  },
  data() {
    return {
      captchaId: "",
      captchaImg: "",
      loadingCaptcha: true,
      error: false,
      saveLogin: true,
      getSms: "获取验证码",
      loading: false,
      sending: false,
      errorCode: "",
      form: {
        username: "",
        password: "",
        code: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        imgCode: [
          {
            required: false,
            message: "验证码不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    getCaptchaImg() {
      this.loadingCaptcha = true;
      initCaptcha().then(res => {
        this.loadingCaptcha = false;
        if (res.success) {
          this.captchaId = res.result;
          this.captchaImg = drawCodeImage + this.captchaId;
        }
      });
    },
    submitLogin() {
        this.$refs.usernameLoginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            login({
              username: this.form.username,
              password: this.form.password,
              code: this.form.imgCode,
              captchaId: this.captchaId,
              saveLogin: this.saveLogin
            }).then(res => {
              if (res.success) {
                console.log(res);
                this.setStore("accessToken", res.result);
                Cookies.set("lastLoginUser", this.form.username);
                Cookies.set(this.form.username, this.form.password, {expires: 7});
                  // 获取用户信息

                console.log(this.getStore("accessToken"));
                userInfo().then(res => {
                  if (res.success) {
                    // 避免超过大小限制
                    delete res.result.permissions;
                    let roles = [];
                    res.result.roles.forEach(e => {
                      roles.push(e.name);
                    });
                    this.setStore("roles", roles);
                    this.setStore("saveLogin", this.saveLogin);
                    if (this.saveLogin) {
                      // 保存7天
                      Cookies.set("userInfo", JSON.stringify(res.result), {
                        expires: 7
                      });
                    } else {
                      Cookies.set("userInfo", JSON.stringify(res.result));
                    }
                    this.setStore("userInfo", res.result);
                    this.$store.commit("setAvatarPath", res.result.avatar);
                    // 加载菜单
                    util.initRouter(this);
                    this.$router.push({
                      name: "home_index"
                    });
                  } else {
                    this.loading = false;
                  }
                });
              } else {
                this.loading = false;
                //this.getCaptchaImg();
              }
            });
          }
        });
    },
     getCookie() {
       this.form.username = Cookies.get("lastLoginUser");
        if (this.form.username) {
            this.form.password = Cookies.get(this.form.username);
        }
     }
  },
  mounted() {
    //this.getCaptchaImg();
    this.getCookie();
  }
};
</script>

<style lang="less">
@import "./login.less";
</style>
