<template>
    <div>
        <Modal v-model="showModal"
               title="通信配置"
               :mask-closable="false"
               :width="800"
               :closable="false">
            <Form ref="addDevice"
                  :model="formItem"
                  :label-width="120"
                  :rules="ruleValidate"
                  inline>
                <FormItem label="通信端口"
                          :label-width="120"
                          prop="port">
                    <Select placeholder="请选择通信端口"
                            v-model='formItem.port'>
                        <Option v-for="(dtype,index) in ports"
                                :key="dtype.value"
                                :value="`${dtype.value}  -  [厂家：${dtype.label} ]`"></Option>
                    </Select>
                    <span></span>
                </FormItem>
                <FormItem label="波特率"
                          prop="baudrate">
                    <Select v-model="formItem.baudrate"
                            :disabled="formItem.port==null">
                        <Option v-for="(baudrate,index) in baudrates"
                                :key="baudrate.lable"
                                :value="baudrate.value"></Option>
                    </Select>
                    <span></span>
                </FormItem>
                <FormItem label="打开端口"
                          prop="open">
                    <i-switch v-model="open"
                              :disabled="formItem.port==null "
                              @on-change="openSerialPort"
                              size="large">
                        <span slot="open">On</span>
                        <span slot="close">Off</span>
                    </i-switch>
                    <span></span>
                </FormItem>
            </Form>
            <div slot="footer">
                <Form ref="dataToDevice"
                      :label-width="120"
                      :rules="ruleValidate">
                    <FormItem label="发送数据">
                        <Input v-model="cmd"
                               placeholder="cmd data...">
                        <Select v-model="selectCmd"
                                slot="prepend"
                                style="width: 80px">
                            <Option value="day">cmd1:111</Option>
                            <Option value="month">cmd2:111</Option>
                        </Select>
                        <Button slot="append"
                                @click="sendDataToDevice">
                            <Icon type="ios-upload-outline" />发送</Button>
                        </Input>
                        <span></span>
                    </FormItem>
                    <FormItem label="接收数据">
                        <Input v-model="formItem.textarea"
                               type="textarea"
                               :rows="8"
                               placeholder="receive data..."
                               clearable></Input>
                        <span></span>
                    </FormItem>
                </Form>
                <Button type="default"
                        :disabled="loading"
                        @click="cancel(true)">取消</Button>
                <Button type="primary"
                        :loading="loading"
                        @click="addDevice">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                formItem: { port: null, baudrate: 15200, openPort: "打开" },
                showModal: true,
                loading: false,
                ruleValidate: {
                    port: [{ required: true, message: '端口不能为空', trigger: 'blur' }],
                    baudrate: [{ required: true, message: '波特率不能为空' }],
                },
                baudrates: [
                    {
                        value: 9600,
                        label: "9600"
                    },
                    {
                        value: 19200,
                        label: "19200"
                    },
                    {
                        value: 38400,
                        label: "38400"
                    },
                    {
                        value: 57600,
                        label: "57600"
                    },
                    {
                        value: 115200,
                        label: "115200"
                    }
                ],
                ports: [],
                // open: this.$serialport.isopen(),
                open: false,
                selectCmd: "",
                cmd: ''
            }
        },
        created() {
            this.getDevicePorts()
            this.formItem.baudrate = localStorage.getItem('baudrate')
        },
        computed: {
            // baudrate() {
            //     return this.$store.state.baudrate;
            // }
        },
        watch: {
        },
        methods: {
            cancel(up = false) {
                this.$emit('cancel', 'serialport', up);
            },
            deviceChange(index) {
            },
            async getDevicePorts() {
                this.ports = this.$serialport.listPort()
            },
            openSerialPort() {
                console.log(this.formItem.port, this.formItem.baudrate, this.open);
                if (this.formItem.port == "") {
                    return;
                }
                this.$serialport.init(this.formItem.port, this.formItem.baudrate);

                // this.open = this.$serialport.isopen()

                localStorage.setItem('baudrate', this.formItem.baudrate);
            },
            sendDataToDevice() {
                console.log("sendDataToDevice" + this.formItem.port, this.formItem.baudrate, this.open);
                this.$serialport.send(this.selectCmd + this.cmd, function (err, result) {
                    alert(`Opened Lockers : ${result}`)
                })
            },
            async addDevice() {
                this.$refs.addDevice.validate(async (valid) => {
                    if (valid) {
                        this.loading = true;
                        this.$Message.loading({ content: "添加中...", duration: 0 });
                        try {

                            this.$Message.destroy()
                            this.$Notice.success({
                                title: '添加成功'
                            });
                        } catch (error) {
                            this.$throw(error)
                        }
                        this.loading = false;
                        this.cancel(true)
                    }
                })

            },
        }
    }
</script>

