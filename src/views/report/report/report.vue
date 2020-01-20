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
        <!-- 创建图表容器 -->
<!--        <div id="c1"></div>-->
<!--        <Button @click="changeAntvData" type="info">Antv</Button>-->
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
                time: [],
                data: [
                    {genre: 'Sports', sold: 275},
                    {genre: 'Strategy', sold: 115},
                    {genre: 'Action', sold: 120},
                    {genre: 'Shooter', sold: 350},
                    {genre: 'Other', sold: 150}
                ],
                chart: {},
            }
        },
        methods: {
            init() {
                this.getGames();
                // this.antvG2Text();
            },
            changeAntvData() {
                const data = [
                    {genre: 'Sports', sold: 105},
                    {genre: 'Strategy', sold: 105},
                    {genre: 'Action', sold: 105},
                    {genre: 'Shooter', sold: 105},
                    {genre: 'Other', sold: 105}
                ]
                this.chart.changeData(data);
            },
            antvG2Text() {
                this.chart = new G2.Chart({
                    container: 'c1', // 指定图表容器 ID
                    width: 600, // 指定图表宽度
                    height: 300 // 指定图表高度
                });
                // Step 2: 载入数据源
                this.chart.source(this.data);
                // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
                this.chart.interval().position('genre*sold').color('genre')
                // Step 4: 渲染图表
                this.chart.render();
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
