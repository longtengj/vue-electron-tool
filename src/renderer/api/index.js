require('dotenv').config()
import SerialPort from 'serialport'
// import VirtualSerialPort from 'virtual-serialport'
import {
    executeRespectiveCallback,
    responseMessageToComputer,
    convertSelectedLockersToCommand
} from './utils'

let globalData = {
    serialPort: null,
    callbackMap: {},
}
let option = {
    baudRate: 115200,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    autoOpen: false
}
let tmpData = {
    curPort: null,
    curPortState: false,
    portSelect: '',
    options: option,
    callback: new Map()
}



const core = {
    isOpenPort: () => {
        console.log("isOpenPort", globalData.serialPort);
        if (globalData.serialPort == null) return false
        console.log("isOpenPort", globalData.serialPort.isOpen());
        if (globalData.serialPort.isOpen()) return true;
        return false;
    },
    init: (port, baudrate) => {
        let lockerSerialPort
        if (globalData.serialPort != null) {
            globalData.serialPort.close(error => { })
        }
        lockerSerialPort = new SerialPort(port, { baudRate: baudrate })

        lockerSerialPort.on('open', function (error) {
            // if (error) {
            //     return console.log('Error: ', error.message)
            // }
        })
        lockerSerialPort.on('data', function (data) {
            executeRespectiveCallback(data, globalData.callbackMap)
        })

        globalData.serialPort = lockerSerialPort;
    },
    openBox: (selectedLockers, callback) => {
        if (core.isOpenPort()) {
            globalData.callbackMap.openBox = callback
            let command = convertSelectedLockersToCommand(selectedLockers)
            let messageToDevice = `OPEN${command}\n`
            console.log("openBox", selectedLockers);
            globalData.serialPort.write(messageToDevice)
        }
    },
    queryBox: (callback) => {
        let messageToDevice = `deligram?\n`
        globalData.serialPort.write(messageToDevice)
        globalData.callbackMap.queryBox = callback
    },
    listSerialPort: () => {
        let portList = []
        SerialPort.list((err, ports) => {
            console.log("串口列表");
            ports.forEach(port => {
                console.log(port.comName);
                console.log(port.pnpId);
                console.log(port.manufacturer);
                portList.push({
                    value: port.comName,
                    label: port.manufacturer
                });
            });
        })
        return portList
    },
    sendData: (serialSend) => {
        if (tmpData.curPortState === false) {
            console.log('serialport 未打开串口')
            return
        }
        tmpData.curPort.write(serialSend + '\r\n', err => {
            if (err) console.log(err)
            console.log('发送成功', serialSend)
        })
    },
    openPort: (portSelect, option, openedcallback, closedcallback) => {
        if (portSelect === '') {
            console.log('未选择串口')
            return
        }

        if (tmpData.curPortState === true) {
            tmpData.curPort.close(err => {
                if (err) {
                    return console.log('Error closing port: ', err.message)
                }
                console.log('close ok')
                tmpData.curPortState = false
                closedcallback(err)
            })
            return
        }

        tmpData.curPort = new SerialPort(portSelect, option, function (err) {
            if (err) {
                console.log('Error: ', err.message)
                tmpData.curPortState = false
                closedcallback(err)
            }
        })

        const Readline = SerialPort.parsers.Readline
        const parser = new Readline({ delimiter: '\r\n' })
        tmpData.curPort.pipe(parser)
        parser.on('data', data => {
            console.log("Readline", data, tmpData.callback)
            tmpData.callback.forEach((value, key, map) => {
                console.log("m[" + key + "] = " + value);
                value(data)
            })
        })

        tmpData.curPort.on('error', function (err) {
            console.log('something error' + err)
        })

        tmpData.curPort.open(err => {
            if (err) {
                return console.log('Error opening port: ', err.message)
            }
            console.log('open success')
            tmpData.curPortState = true
            openedcallback(err)
            tmpData.portSelect = portSelect
        })
    },
    regCallback: (key, callback) => {
        tmpData.callback.set(key, callback);
    },
    unregCallback: (key, callback) => {
        tmpData.callback.delete(key, callback);
    },
    test: () => {
    }
}

const serialport = {
    init: (port, baudrate) => core.init(port, baudrate),
    open: (port, option, openedcallback, closedcallback) => core.openPort(port, option, openedcallback, closedcallback),
    close: (port) => closePort(port),
    listPort: () => core.listSerialPort(),
    isopen: () => core.isOpenPort(),
    // send: (data, callback) => core.openBox(data, callback)
    send: (data) => core.sendData(data),
    regCallback: (key, callback) => core.regCallback(key, callback),
    unregCallback: (key, callback) => core.unregCallback(key, callback)
}

export default {
    serialport,
    tmpData
}

/* <Option v-for="item in portList"
:key="item.label"
:value="`${item.value}  -  [厂家：${item.label} ]`"></Option> */