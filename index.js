var request = require("request");
var Service, Characteristic;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-mythtv", "MythTV", MythtTV);
}

function MythtTV(log, config) {
    this.log = log;
    this.name = config["name"] || 'MythtTV';
    this.host = config["frontend"] || 'localhost';
    this.port = config["port"] || '6547';
    this.pollingInterval = config["polling_interval"] || 3;
    this.debug = config["debug"] || false;
    this.service = new Service.OccupancySensor(this.name);
    this.playing = false;

    this.service
        .getCharacteristic(Characteristic.OccupancyDetected)
        .on('get', this.getState.bind(this));

    var self = this;

    var callback = function (err, value) {
        setTimeout(function () {
            self.getState(callback);
        }, self.pollingInterval * 1000);

        if (err !== null)
            return;

        self.service
            .getCharacteristic(Characteristic.OccupancyDetected)
            .updateValue(value);
    };

    self.getState(callback);
}

MythtTV.prototype.getState = function (callback) {
    var self = this;

    request.get({
        url: "http://" + self.host + ":" + self.port + "/Frontend/GetStatus",
        headers: {
            Accept: 'text/javascript'
        }
    }, function (err, response, body) {
        if (err || response.statusCode !== 200) {
            var statusCode = response ? response.statusCode : 1;
            self.log("Error getting state (status code %s): %s", statusCode, err);
            callback(err);
            return;
        }

        var data = JSON.parse(body);
        data = data.FrontendStatus.State;
        var playing = false;

        if (data.state === "idle") {
            if (self.debug)
                self.log('MythTV Frontend is idle.');

            playing = false;
        } else {
            if (self.debug)
                self.log('MythTV Frontend is %s.', data.state);
            playing = true;
        };

        callback(null, playing);
    });
}

MythtTV.prototype.getServices = function () {
    return [this.service];
}
