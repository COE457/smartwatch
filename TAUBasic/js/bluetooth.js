var adapter = tizen.bluetooth.getDefaultAdapter();

var discoverDevicesSuccessCallback = {
	/* When a device is found */
	ondevicefound : function(device) {
		console.log('Found device - name hh: ' + device.name);
	}
};

/* Discover devices */
adapter.discoverDevices(discoverDevicesSuccessCallback, null);

/* When a known device is found */
function onGotDevices(devices) {
	console.log(devices);
	console.log('The number of known devices: ' + devices.length);
	console.log('Found device - name: ' + devices[0].name);
	

}

/* Retrieve known devices */
adapter.getKnownDevices(onGotDevices);

/** ************************LEAdapter******************************** */
var adapterLE = tizen.bluetooth.getLEAdapter();

function connectFail(error) {
	console.log('Failed to connect to device: ' + error.message);
}

function connectSuccess() {
	console.log('Connected to device');
}
var remoteDevice = "null";

function onDeviceFound(device) {
	console.log("Im here ");

	console.log(device);
	console.log(device.address);
	console.log(device.uuids);
	console.log(device.manufacturerData.id);


	console.log("Im here 1");

	if (remoteDevice === null) {
		remoteDevice = device;
		console.log('Found device ' + device.name + '. Connecting...');

		device.connect(connectSuccess, connectFail);
	}
console.log("Im here 2");
	adapterLE.stopScan();
}
adapterLE.startScan(onDeviceFound);
