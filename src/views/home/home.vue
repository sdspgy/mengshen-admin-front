<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>

<template>
    <div>
        <div>
            <Row :gutter="10">
                <Col :md="24" :lg="8">
                    <Row class-name="home-page-row1" :gutter="10">
                        <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                            <Card>
                                <Row type="flex" class="user-infor">
                                    <Col span="8">
                                        <Row class-name="made-child-con-middle" type="flex" align="middle"><img
                                                class="avator-img" :src="avatarPath"/>
                                        </Row>
                                    </Col>
                                    <Col span="16" style="padding-left:6px;">
                                        <Row class-name="made-child-con-middle" type="flex" align="middle">
                                            <div>
                                                <b class="card-user-infor-name">{{ username }}</b>
                                                <p>宝宝超市后台管理系统 欢迎您的使用</p>
                                            </div>
                                        </Row>
                                    </Col>
                                </Row>


                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
        <div>
            <h1>点击左侧菜单查看详情</h1>
        </div>
    </div>
</template>

<script>
    import Cookies from "js-cookie";
    import "gitalk/dist/gitalk.css";

    export default {
        name: "home",
        components: {
        },
        data() {
            return {
                username: ""
            };
        },
        computed: {
            avatarPath() {
                return localStorage.avatorImgPath;
            }
        },
        methods: {
            init() {
                let userInfo = JSON.parse(Cookies.get("userInfo"));
                this.username = userInfo.username;
            }
        },
        mounted() {
            this.init();
        }
    };
</script>
