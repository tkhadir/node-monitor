var os = require('os')
var osUtils = require('os-utils')
var cp = require('child_process')

let data = []

data.push(os.cpus().length + ' cors cpu')
data.push('total mem system : ' + Math.trunc(os.totalmem() / 1073741824) + ' GB')
data.push('free mem system : ' + Math.trunc(os.freemem() / 1073741824) + ' GB')

osUtils.cpuUsage(function (v) {
    data.push('CPU Usage (%): ' + Math.trunc(v * 100) + ' %')
})


let mountedon = '/'

var ps = cp.spawn("df", ["-BK", mountedon]);
var _ret = "";

ps.stdout.on("data", function (data) {
    _ret = data.toString();
});

ps.on('error', function (err) {
    console.log(err)
    //chain(err)
});

ps.on('close', function () {
    var storageDeviceInfo;
    if (_ret.split('\n')[1]) {
        var arr = _ret.split('\n')[1].split(/[\s,]+/);
        storageDeviceInfo = {};
        storageDeviceInfo.usedSize = Math.trunc((parseInt(arr[2].replace("K", "")) * 1024) / 1073741824);    // exp "300K" => 300
        storageDeviceInfo.totalSize = Math.trunc(((parseInt(arr[3].replace("K", "")) * 1024) / 1073741824) + storageDeviceInfo.usedSize);
    }
    data.push('disk drive mem used : ' + storageDeviceInfo.usedSize)
    data.push('disk drive mem total : ' + storageDeviceInfo.totalSize)
    console.table(data)
})
