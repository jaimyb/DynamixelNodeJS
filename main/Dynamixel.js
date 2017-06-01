var SerialPort = require('serialport');
var Gpio = require('pigpio').Gpio;
var motor = new Gpio(18, {mode:Gpio.OUPUT});
var buffer = new ArrayBuffer(9);
var uint8 = new Uint8Array(buffer);

port = new SerialPort('/dev/ttyAMA0', {
	baudrate: 1000000,
	parser: SerialPort.parsers.readline("\n")
});

port.on("open", function () {
 	console.log('open');
  	port.on('data', function(data) {
    	console.log("Data received!");
  	});
});

function getData(ID){
	
	var start = 0xFF;
	var id = ID;
	var length =  0x04;
	var ins = 0x02;
	var param1 = 0x2B;
	var param2 = 0x01;

	port.on('data', function(data) {
    	console.log("Data received!");
  	});


	var checksum = ~(id + length + ins + param1 + param2) & 0xFF;
	
	motor.digitalWrite(1);

	uint8.set([start, start, id, length, ins, param1, param2, checksum],0);
	port.write(uint8);

	setTimeout(function(){
		motor.digitalWrite(0);
	},0);

	
	console.log(checksum);
	console.log(uint8);


}

setInterval(function(){
	getData(1);
},100);


