package com.itim.zebra.jollyes.module

import android.util.Log
import com.itim.zebra.jollyes.BluetoothPrinterEntity
import com.zebra.sdk.comm.BluetoothConnection
import kotlin.coroutines.suspendCoroutine

class BluetoothPrinter(
        private val printerEntity: BluetoothPrinterEntity
) : AbstractPrinter() {
    override suspend fun createConnection(): BluetoothPrinter = suspendCoroutine {
        connection = BluetoothConnection(printerEntity.mac)

        it.resumeWith(Result.success(this))
        Log.i("PrinterConnection", "Bluetooth connection created")
    }

    override fun getId(): String {
        return printerEntity.mac;
    }

    override suspend fun connect() = suspendCoroutine {
        connection.open()

        it.resumeWith(Result.success(true))
        Log.i("PrinterConnection", "Bluetooth connected")
    }
}