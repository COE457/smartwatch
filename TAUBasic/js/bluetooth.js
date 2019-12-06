////
////var BLEconnect = document.getElementById("BLEconnect");
////var BLEstopscan = document.getElementById("BLEstopscan");
////var BLEdisconnect = document.getElementById("BLEdisconnect");
//
//var remoteDevice = null;
//var adapter = tizen.bluetooth.getLEAdapter();
//
//window.onload= function () {
//
//	function connectFail(error) 
//	{
//	   console.log("Failed to connect to device: " + e.message);
//	}
//
//	function connectSuccess() 
//	{
//	//	   console.log("Connected to device");    
//	}
//
//
//	function showGATTService(service, indent)
//	{
//	   if (indent === undefined) 
//	   {
//	      indent = "";
//	   }
//
//		   console.log(indent + "Service " + service.uuid + ". Has " + service.characteristics.length 
//		               + " characteristics and " + service.services.length + " sub-services.");
//
//	   for (var i = 0; i < service.services.length; i++) 
//	   {
//	      showGATTService(service.services[i], indent + "   ");
//	   }
//	} 	
//	
//
//
//	function onDeviceFound(device)
//	{
//	   if (remoteDevice === null) 
//	   {
//	      remoteDevice = device;
//	      console.log("Found device name: " + device.name + " txpowerlevel: " + device.txpowerlevel + "  . Connecting...");
//
//	      device.connect(function connectSuccess() 
//	       { 		      
//		        console.log("Connected to device"); 
//		        
//		        var i = 0, service = null;
//		        var serviceUUIDs = remoteDevice.uuids;
//		        console.log("remoteDevice.uuids: "+ serviceUUIDs); 
//		        console.log("remoteDevice.uuids.length :"+ serviceUUIDs.length); 
//		        for (i; i < serviceUUIDs.length; i++) 
//		        {
//		           service = remoteDevice.getService(serviceUUIDs[i]);
//		           showGATTService(service);
//		        }		        
//			      
//	       }  , connectFail);	      	     
//	   }
//
//	   adapter.stopScan();
//	}
//
//	adapter.startScan(onDeviceFound);
//	
//}
//
//var myhandler2 = function () {
//	remoteDevice.disconnect();
//}
//
//
//var myhandler3 = function () {
//	adapter.stopScan()
//}

//BLEconnect.addEventListener("click", myhandler1, false);
//BLEdisconnect.addEventListener("click", myhandler2, false);
//BLEstopscan.addEventListener("click", myhandler3, false);


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
