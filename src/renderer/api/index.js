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
const globalData = {
    serialPort: null,
    callbackMap: {}
}
const core = {
    isOpenPort: () => {
        if (globalData.serialPort == null) return false
        if (globalData.serialPort.isOpen) return true;
        return false;
    },
    openPort: (port, baudrate) => {
        let lockerSerialPort
        if (lockerSerialPort != null) {
            if (lockerSerialPort.isOpen) {
                serialport.close(error => { })
                lockerSerialPort = null
            }
            lockerSerialPort = new SerialPort(port, { baudRate: baudrate })

            lockerSerialPort.on('open', function (error) {
                if (error) {
                    return console.log('Error: ', error.message)
                }
            })
            lockerSerialPort.on('data', function (data) {
                executeRespectiveCallback(data, globalData.callbackMap)
            })
        }

        globalData.serialPort = lockerSerialPort;
    },
    openBox: (lockerSerialPort, selectedLockers, callback) => {
        callbackMap.openBox = callback
        let command = convertSelectedLockersToCommand(selectedLockers)
        let messageToDevice = `OPEN${command}\n`
        lockerSerialPort.write(messageToDevice)
    },
    queryBox: (lockerSerialPort, callback) => {
        let messageToDevice = `deligram?\n`
        lockerSerialPort.write(messageToDevice)
        callbackMap.queryBox = callback
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
    init: (port, baudrate) => core.openPort(port, baudrate),
    listPort: () => core.listSerialPort(),
    isopen: () => core.isOpenPort()
}

export default serialport