<template>
    <div>
        <RadioGroup v-model="type" @on-change="init()">
            <Radio label="0">
                <span>安装</span>
            </Radio>
            <Radio label="1">
                <span>活跃</span>
            </Radio>
        </RadioGroup>
        <div class="deviceG2">
            <div id="deviceG2"></div>
        </div>

    </div>
</template>

<script>
    import {queryDevice} from '@/api/index';
    import {weekChange} from '@/libs/changeWeek';

    export default {
        name: "reportDevice",
        data() {
            return {
                type: "0",
                chartDevice: [],
                G2Device: {},
            }
        },
        methods: {
            init() {
                this.queryDevices();
            },
            queryDevices() {
                let params = {
                    gameid: parseInt(this.getStore('gameid')),
                    type: parseInt(this.type)
                }
                queryDevice(params).then(e => {
                    if (e.success) {
                        let devices = e.deviceDis;
                        let dailyInstallNum = e.shareDailyResultTypes[0].installNum,
                            dailyDauNum = e.shareDailyResultTypes[0].dauNum;
                        let chartDevice = [];
                        let i = devices.length > 20 ? 20 : devices.length;
                        if (this.type == "0") {
                            for (; i > 0; i--) {
                                let deviceObj = new Object();
                                deviceObj.name = devices[i].device;
                                deviceObj.value = devices[i].deviceInstallNumbers;
                                deviceObj.precentage = (dailyInstallNum == 0 ? 0 : (devices[i].deviceInstallNumbers / dailyInstallNum).toFixed(2));
                                chartDevice.push(deviceObj);
                            }
                        } else {
                            for (; i > 0; i--) {
                                let deviceObj = new Object();
                                deviceObj.name = devices[i].device;
                                deviceObj.value = devices[i].deviceDauNumbers;
                                deviceObj.precentage = (dailyDauNum == 0 ? 0 : (devices[i].deviceDauNumbers / dailyDauNum).toFixed(2));
                                chartDevice.push(deviceObj);
                            }
                        }
                        this.chartDevice = chartDevice;
                        this.G2Device.changeData(this.chartDevice);
                    }
                })
            },
            defaultG2() {
                this.G2Device = new G2.Chart({
                    container: 'deviceG2',
                    forceFit: true,
                    height: 500
                });
                this.G2Device.source(this.chartDevice, {});
                this.G2Device.coord().transpose();
                // 坐标轴文本旋转
                this.G2Device.axis('name', {
                    label: {
                        rotate: -Math.PI / 0.5,
                        textAlign: 'end',
                        textBaseline: 'middle'
                    }
                });
                this.G2Device.tooltip({
                    // showCrosshairs: true, //纵坐标线
                    // showItemMarker: false, //去小原点
                    onShow: function onShow(ev) {
                        const items = ev.items;
                        items[0].name = null;
                        items[0].name = items[0].title;
                        items[0].value = '' + items[0].value + ';' + items[0].origin.precentage + '%';
                    },
                    offsetX: -30
                });
                this.G2Device.interval()
                    .position('name*value');
                this.G2Device.scale('value', {
                    alias: '数量',
                });
                // 柱状图添加文本
                this.chartDevice.forEach(function (obj) {
                    this.G2Device.guide().text({
                        position: [obj.name, obj.value],
                        content: obj.value,
                        style: {
                            textAlign: 'center',
                            textBaseline: 'bottom'
                        },
                        offsetY: 5,
                        offsetX: 7,
                    });
                });
                this.G2Device.render();
            }
        },
        mounted() {
            this.defaultG2();
            this.init();
        },
    }
</script>

<style scoped>
    .deviceG2 {
        width: 50%;
        margin: 100px auto;
    }
</style>
