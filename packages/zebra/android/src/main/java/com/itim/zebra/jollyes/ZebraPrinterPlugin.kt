package com.itim.zebra.jollyes

import android.Manifest.permission
import android.app.Activity
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.content.Intent
import android.location.LocationManager
import android.os.Build
import android.util.Log
import androidx.activity.result.ActivityResult
import com.getcapacitor.JSObject
import com.getcapacitor.PermissionState
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.ActivityCallback
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission
import com.getcapacitor.annotation.PermissionCallback
import com.itim.zebra.jollyes.module.PrinterFactory
import kotlinx.coroutines.CoroutineName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import org.json.JSONArray


@CapacitorPlugin(
    name = "ZebraPrinter",
    permissions = [
        Permission(
            alias = "bluetooth",
            strings = [
                permission.BLUETOOTH_SCAN,
                permission.BLUETOOTH_CONNECT,
                permission.ACCESS_FINE_LOCATION,
                permission.ACCESS_COARSE_LOCATION
            ]
        ),
        Permission(
            alias = "bluetooth_old",
            strings = [
                permission.BLUETOOTH,
                permission.BLUETOOTH_ADMIN,
                permission.ACCESS_FINE_LOCATION,
                permission.ACCESS_COARSE_LOCATION
            ]
        )
    ]
)
class ZebraPrinterPlugin: Plugin() {
    private lateinit var printerRepository: PrinterRepository

    @Override
    override fun load() {
        super.load()

        printerRepository = PrinterRepository(
            context,
            dispatcher = Dispatchers.Main,
            factory = PrinterFactory()
        )
    }

    private var searchJob: Job? = null
    private val searchScope = CoroutineScope(CoroutineName("SearchScope"))

    fun searchForPrinters(call: PluginCall) {
        Log.d("ZebraPrinterPlugin", "Starting to search for bluetooth printers...")

        searchJob = searchScope.launch {
            printerRepository.getBluetoothZebraPrinters().catch {
                call.reject(it.message)
            }.collectLatest {
                val printersObj = JSObject()

                val printersArray = it.map { printer ->
                    BluetoothPrinterEntity(
                        printer.discoveryDataMap["DEVICE_UNIQUE_ID"].orEmpty(),
                        mac = printer.address,
                    )
                }.map { printer ->
                    val printerObj = JSObject()
                    printerObj.put("name", printer.uniqueName)
                    printerObj.put("address", printer.mac)
                    printerObj
                }

                printersObj.put("printers", JSONArray(printersArray))

                call.resolve(printersObj)
                searchJob?.cancel()
            }
        }
    }

    @PermissionCallback
    fun bluetoothPermissionCallback(call: PluginCall) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (getPermissionState("bluetooth") == PermissionState.GRANTED) {
                searchForPrinters(call)
            } else {
                call.reject("Permissions needed to search for printers");
            }
        } else {
            if (getPermissionState("bluetooth_old") == PermissionState.GRANTED) {
                searchForPrinters(call)
            } else {
                call.reject("Permissions needed to search for printers");
            }
        }
    }

    fun requestBluetoothPermission(call: PluginCall) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (getPermissionState("bluetooth") != PermissionState.GRANTED) {
                requestPermissionForAlias("bluetooth", call, "bluetoothPermissionCallback")
            } else {
                searchForPrinters(call)
            }
        } else {
            if (getPermissionState("bluetooth_old") != PermissionState.GRANTED) {
                requestPermissionForAlias("bluetooth_old", call, "bluetoothPermissionCallback")
            } else {
                searchForPrinters(call)
            }
        }
    }

    @ActivityCallback
    fun enableBluetoothCallback(call: PluginCall?, result: ActivityResult) {
        if (call == null) {
            return;
        }

        if (result.resultCode == Activity.RESULT_OK) {
            requestBluetoothPermission(call);
        } else {
            call.reject("Bluetooth is required to search printers")
        }
    }

    fun requestEnableBluetooth(call: PluginCall) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            requestBluetoothPermission(call);
            return;
        }

        val bluetoothManager = context.getSystemService(BluetoothManager::class.java)
        val bluetoothAdapter: BluetoothAdapter? = bluetoothManager.adapter

        if (bluetoothAdapter == null) {
            call.reject("Bluetooth not supported")
            return
        }

        if (!bluetoothAdapter.isEnabled) {
            val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
            startActivityForResult(call, enableBtIntent, "enableBluetoothCallback")
            return;
        }

        requestBluetoothPermission(call);
    }

    fun requestEnableLocation(call: PluginCall) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            requestEnableBluetooth(call);
            return;
        }

        val locationManager = context.getSystemService(LocationManager::class.java)

        if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
            requestEnableBluetooth(call)
        } else {
            call.reject("Location services is required to search printers")
        }
    }

    @PluginMethod
    fun searchPrinters(call: PluginCall) {
        if (searchJob?.isActive == true) {
            call.reject("Previous search is not finished yet")
        }

        requestEnableLocation(call)
    }

    private var connectJob: Job? = null
    private val connectScope = CoroutineScope(CoroutineName("ConnectScope"))

    @PluginMethod
    fun connectToPrinter(call: PluginCall) {
        if (connectJob?.isActive == true) {
            call.reject("Previous connection is not finished yet")
        }

        val printerObj = call.getObject("printer");

        val printer = BluetoothPrinterEntity(
            uniqueName = printerObj.getString("name").toString(),
            mac = printerObj.getString("address").toString(),
        )

        connectJob = connectScope.launch {
            try {
                printerRepository.connectToPrinter(printer)
                call.resolve()
            } catch (e: Exception) {
                call.reject(e.message)
            } finally {
                connectJob?.cancel()
            }
        }
    }

    private var printJob: Job? = null
    private val printScope = CoroutineScope(CoroutineName("PrintScope"))

    @PluginMethod
    fun printLabel(call: PluginCall) {
        if (printJob?.isActive == true) {
            call.reject("Previous print is not finished yet")
        }

        val zpl = call.getString("zpl");

        if (zpl.isNullOrEmpty()) {
            call.reject("Label design was not provided")
        }

        printJob = printScope.launch {
            try {
                printerRepository.sendStringToPrinter(zpl.toString())
                call.resolve()
            } catch (e: Exception) {
                call.reject(e.message)
            } finally {
                printJob?.cancel()
            }
        }
    }

    @PluginMethod
    fun factoryReset(call: PluginCall) {
        printJob = printScope.launch {
            try {
                printerRepository.sendStringToPrinter("^XA^JUF^XZ");
                call.resolve()
            } catch (e: Exception) {
                call.reject(e.message)
            } finally {
                printJob?.cancel()
            }
        }
    }
}
