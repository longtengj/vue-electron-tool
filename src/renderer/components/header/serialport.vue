<template>
    <div>
        <Modal v-model="showModal"
               title="通信配置"
               :mask-closable="false"
               :width="800"
               :closable="false">
            <Row>
                <Col span="10">
                <Menu active-name="1">
                    <MenuGroup title="串口设置">
                        <MenuItem name="1">
                        <Row>
                            <Col span="6">
                            <span>端口:</span>
                            </Col>
                            <Col span="12">
                            <Select v-model="portSelect"
                                    size="small">
                                <Option v-for="item in portList"
                                        :value="item.value"
                                        :key="item.value">{{ item.value }}</Option>
                            </Select>
                            </Col>
                            <Col span="6">
                            <Button type="primary"
                                    shape="circle"
                                    size="small"
                                    icon="ios-loop"
                                    @click="getDevicePorts"
                                    style="margin:0 auto;display:block"></Button>
                            </Col>
                        </Row>
                        </MenuItem>
                        <MenuItem name="2">
                        <Row>
                            <Col span="6">
                            <span>波特率:</span>
                            </Col>
                            <Col span="12">
                            <Select v-model="baudrateSelect"
                                    size="small">
                                <Option v-for="item in baudrateList"
                                        :value="item.value"
                                        :key="item.value">{{ item.label }}</Option>
                            </Select>
                            </Col>
                        </Row>
                        </MenuItem>
                        <MenuItem name="3">
                        <Row>
                            <Col span="6">
                            <span>数据位:</span>
                            </Col>
                            <Col span="12">
                            <Select v-model="databitSelect"
                                    size="small">
                                <Option v-for="item in databitList"
                                        :value="item.value"
                                        :key="item.value">{{ item.label }}</Option>
                            </Select>
                            </Col>
                        </Row>
                        </MenuItem>
                        <MenuItem name="4">
                        <Row>
                            <Col span="6">
                            <span>停止位:</span>
                            </Col>
                            <Col span="12">
                            <Select v-model="stopbitSelect"
                                    size="small">
                                <Option v-for="item in stopbitList"
                                        :value="item.value"
                                        :key="item.value">{{ item.label }}</Option>
                            </Select>
                            </Col>
                        </Row>
                        </MenuItem>
                        <MenuItem name="5">
                        <Row>
                            <Col span="6">
                            <span>校验:</span>
                            </Col>
                            <Col span="12">
                            <Select v-model="paritySelect"
                                    size="small">
                                <Option v-for="item in parityList"
                                        :value="item.value"
                                        :key="item.value">{{ item.label }}</Option>
                            </Select>
                            </Col>
                        </Row>
                        </MenuItem>
                        <MenuItem name="6">
                        <Row>
                            <Col span="24">
                            <Button :type="portButtonColor"
                                    long
                                    @click="toOpeningPort">{{portButtonLabel}}</Button>
                            </Col>
                        </Row>
                        </MenuItem>
                    </MenuGroup>
                    <MenuGroup title="统计分析">
                        <MenuItem name="21">
                        <Row>
                            <Col span="12">
                            <Icon type="ios-upload"></Icon>
                            <span style="margin-left:10px">发送</span>
                            </Col>
                            <Col span="12">
                            <span>{{sendCnt}} bytes</span>
                            </Col>
                        </Row>

                        </MenuItem>
                        <MenuItem name="22">
                        <Row>
                            <Col span="12">
                            <Icon type="ios-download"></Icon>
                            <span style="margin-left:10px">接收</span>
                            </Col>
                            <Col span="12">
                            <span>{{recvCnt}} bytes</span>
                            </Col>
                        </Row>
                        </MenuItem>
                    </MenuGroup>
                </Menu>
                </Col>
                <Col span="14">
                <div style="background:#eee;">
                    <div>
                        <Input v-model="serialSend">
                        <Select v-model="serialSendFormat"
                                slot="prepend"
                                placement='top'
                                style="width: 80px">
                            <Option value="serialSendStr">字符串</Option>
                            <Option value="serialSendHex">十六进制</Option>
                        </Select>
                        <Button slot="append"
                                icon="android-send"
                                @click="toSendData"
                                style="background-color:#2d8cf0"></Button>
                        </Input>
                        <Checkbox v-model="sendEnter"
                                  size='large'>\r\n</Checkbox>
                    </div>
                    <span>
                    </span>
                    <p slot="title">数据接收区</p>
                    <Table stripe
                           border
                           :columns="columns"
                           :data="recvAreaData"></Table>
                </div>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="default"
                        :disabled="loading"
                        @click="cancel(true)">关闭</Button>

            </div>
        </Modal>
    </div>
</template>
<script>
    export default {
        name: 'landing-page',
        components: {},
        methods: {},
        created() {
            console.log("serialportdebuger created", this.$serialport.tmpData.curPortState)
            this.getDevicePorts()
            this.$serialport.serialport.regCallback("serialportdebuger", this.receDataCallback)

        },
        destroyed() {
            console.log("serialportdebuger destroyed")
            this.$serialport.serialport.unregCallback("serialportdebuger", this.receDataCallback)
        },
        data: function () {
            return {
                showModal: true,
                loading: false,
                curPortState: this.$serialport.tmpData.curPortState,
                columns: [
                    {
                        title: 'Length',
                        key: 'length',
                        filters: [
                            {
                                label: 'cmd',
                                value: 1
                            },
                            {
                                label: 'data',
                                value: 2
                            }
                        ],
                        filterMultiple: false,
                        filterMethod(value, row) {
                            if (value === 1) {
                                return row.length > 10;
                            } else if (value === 2) {
                                return row.length < 10;
                            }
                        }
                    },
                    {
                        title: 'Data',
                        key: 'data'
                    }
                ],
                recvAreaData: [],
                serialSend: '',
                serialSendFormat: 'serialSendStr',
                portList: [],
                portSelect: this.$serialport.tmpData.portSelect,
                baudrateList: [
                    {
                        value: 9600,
                        label: '9600'
                    },
                    {
                        value: 19200,
                        label: '19200'
                    },
                    {
                        value: 38400,
                        label: '38400'
                    },
                    {
                        value: 57600,
                        label: '57600'
                    },
                    {
                        value: 115200,
                        label: '115200'
                    }
                ],
                baudrateSelect: 115200,
                databitList: [
                    {
                        value: 5,
                        label: '5'
                    },
                    {
                        value: 6,
                        label: '6'
                    },
                    {
                        value: 7,
                        label: '7'
                    },
                    {
                        value: 8,
                        label: '8'
                    }
                ],
                databitSelect: 8,
                stopbitList: [
                    {
                        value: 1,
                        label: '1'
                    },
                    {
                        value: 1.5,
                        label: '1.5'
                    },
                    {
                        value: 2,
                        label: '2'
                    }
                ],
                stopbitSelect: 1,
                parityList: [
                    {
                        value: 'none',
                        label: 'none'
                    },
                    {
                        value: 'Even',
                        label: 'Even'
                    },
                    {
                        value: 'Odd',
                        label: 'Odd'
                    },
                    {
                        value: 'Mark',
                        label: 'Mark'
                    },
                    {
                        value: 'Space',
                        label: 'Space'
                    }
                ],
                paritySelect: 'none',
                portButtonColor: 'primary',
                portButtonLabel: this.getOpenStatus(),
                sendEnter: true,
                sendCnt: 0,
                recvCnt: 0
            }
        },
        methods: {
            cancel(up = false) {
                this.$emit('cancel', 'serialport', up);
            },
            getDevicePorts() {
                this.portList = this.$serialport.serialport.listPort()
            },
            getOpenStatus() {
                if (this.$serialport.tmpData.curPortState) {
                    return '关闭串口'
                } else {
                    return '打开串口'
                }
            },
            receDataCallback(data) {
                this.recvCnt += data.length
                this.recvAreaData.push({
                    length: this.recvCnt,
                    data: data
                })
            },
            toSendData() {
                this.$serialport.serialport.send(this.serialSend + '\r\n')
                this.sendCnt += this.serialSend.length
            },
            toOpeningPort() {
                if (this.portSelect === '') {
                    console.log('未选择串口')
                    return
                }

                let option = {
                    baudRate: this.baudrateSelect,
                    dataBits: this.databitSelect,
                    stopBits: this.stopbitSelect,
                    parity: this.paritySelect,
                    autoOpen: false
                }

                console.log('选择串口', this.portSelect, option)
                this.$serialport.serialport.open(this.portSelect, option, this.openedcallback, this.closedcallback)
            },
            openedcallback(err) {
                console.log('serialportdebuger', err)
                this.portButtonLabel = '关闭串口'
            },
            closedcallback(err) {
                console.log('serialportdebuger', err)
                this.portButtonLabel = '打开串口'
                this.portButtonColor = 'primary'
            }
        },
        mounted: function () {
            console.log('serialportdebuger mounted')
        }
    }
</script>

<style lang="less">
</style>