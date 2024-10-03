package com.itim.zebra.jollyes

abstract class PrinterEntity(
    val uniqueName: String
)

class BluetoothPrinterEntity(uniqueName: String, val mac: String) : PrinterEntity(uniqueName)
