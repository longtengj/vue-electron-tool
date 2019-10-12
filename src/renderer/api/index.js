require('dotenv').config()
import SerialPort from 'serialport'
// import VirtualSerialPort from 'virtual-serialport'
import {
    executeRespectiveCallback,
    responseMessageToComputer,
    convertSelectedLockersToCommand
} from './utils'

let lockerSerialPort = null
let callbackMap = {}
let SP = process.env.NODE_ENV === 'DEV' ? SerialPort : SerialPort
lockerSerialPort = new SP('com1', { baudRate: 57600 })

lockerSerialPort.on('open', function (error) { })

lockerSerialPort.on('data', function (data) {
    executeRespectiveCallback(data, callbackMap)
})

if (process.env.NODE_ENV === 'DEV') {
    lockerSerialPort.on("dataToDevice", function (data) {
        let result = responseMessageToComputer(data)
        lockerSerialPort.writeToComputer(`${result}`)
    })
}

export function openBox(selectedLockers, callback) {
    callbackMap.openBox = callback
    let command = convertSelectedLockersToCommand(selectedLockers)
    let messageToDevice = `OPEN${command}\n`
    lockerSerialPort.write(messageToDevice)
}

export function queryBox(callback) {
    let messageToDevice = `deligram?\n`
    lockerSerialPort.write(messageToDevice)
    callbackMap.queryBox = callback
}