require('dotenv').config()
import SerialPort from 'serialport'
// import VirtualSerialPort from 'virtual-serialport'
import {
    executeRespectiveCallback,
    responseMessageToComputer,
    convertSelectedLockersToCommand
} from './utils'

// let lockerSerialPort = null
// let callbackMap = {}

// openPort("COM7", 115200)

// if (process.env.NODE_ENV === 'DEV') {
//     lockerSerialPort.on("dataToDevice", function (data) {
//         let result = responseMessageToComputer(data)
//         lockerSerialPort.writeToComputer(`${result}`)
//     })
// }
let globalData = {
    serialPort: null,
    callbackMap: {}
}
const core = {
    isOpenPort: () => {
        console.log("isOpenPort", globalData.serialPort);
        if (globalData.serialPort == null) return false
        console.log("isOpenPort", globalData.serialPort.isOpen());
        if (globalData.serialPort.isOpen()) return true;
        return false;
    },
    openPort: () => {

    },
    closePort: () => {

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
    }

}



const serialport = {
    init: (port, baudrate) => core.init(port, baudrate),
    open: (port) => openPort(port),
    close: (port) => closePort(port),
    listPort: () => core.listSerialPort(),
    isopen: () => core.isOpenPort(),
    send: (data, callback) => core.openBox(data, callback)
}

export default serialport