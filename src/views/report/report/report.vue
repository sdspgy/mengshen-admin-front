<template>
    <div>
        <Select v-model="searchForm.gameid" style="width:200px">
            <Option v-for="item in games" :value="item.gameid" :key="item.gameid">{{ item.name }}</Option>
        </Select>
        <Row>
            <Col span="12">
                <DatePicker v-model="time" type="daterange" format="yyyy-MM-dd" placeholder="选择开始时间"
                            style="width: 200px"></DatePicker>
            </Col>
        </Row>
        <Button @click="download" type="info">下载</Button>
    </div>

</template>

<script>
    import {queryAllAdvertReq, downloadReportReq} from '@/api/index';

    export default {
        name: "report",
        data() {
            return {
                games: [],
                searchForm: {
                    gameid: '',
                },
                time: []
            }
        },
        methods: {
            init() {
                this.getGames()
            },
            getGames() {
                queryAllAdvertReq(this.gameid).then(res => {
                    if (res.success) {
                        this.games = res.result[0].records;
                    }
                });
            },
            download() {
                let t = this.time;
                if (this.searchForm.gameid == '' || undefined) {
                    alert('请选择游戏');
                    return;
                }
                if (this.time[0] == '') {
                    alert("请输入时间");
                    return;
                }
                let gameid = this.searchForm.gameid,
                    beginData = this.timeUtil(this.time[0]),
                    overData = this.timeUtil(this.time[1]);
                // let url = `https://report.nuojuekeji.com/api/report/generateReport?startDs=${beginData}&endDs=${overData}&gameId=${gameid}`;
                window.location.href = `https://report.nuojuekeji.com/api/report/generateReport?startDs=${beginData}&endDs=${overData}&gameId=${gameid}`;
                //
                // let url = 'https://report.nuojuekeji.com/api/report/generateReport?startDs=2019-11-18&endDs=2019-12-16&gameId=8';
                // downloadReportReq(url).then(res => {
                //     debugger
                //     // const blob = new Blob([response.data]);
                //     // const fileName = 'user.xls';
                //     // const linkNode = document.createElement('a');
                //     //
                //     // linkNode.download = fileName; //a标签的download属性规定下载文件的名称
                //     // linkNode.style.display = 'none';
                //     // linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
                //     // document.body.appendChild(linkNode);
                //     // linkNode.click();  //模拟在按钮上的一次鼠标单击
                //     //
                //     // URL.revokeObjectURL(linkNode.href); // 释放URL 对象
                //     // document.body.removeChild(linkNode);
                //
                // });
            },
            timeUtil(time) {
                return time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style scoped>

</style>
