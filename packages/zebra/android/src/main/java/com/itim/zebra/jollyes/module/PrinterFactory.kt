package com.itim.zebra.jollyes.module

import com.itim.zebra.jollyes.BluetoothPrinterEntity
import com.itim.zebra.jollyes.PrinterEntity

class PrinterFactory {
    fun createPrinter(printerEntity: PrinterEntity): AbstractPrinter {
        return when (printerEntity) {
            is BluetoothPrinterEntity -> {
                BluetoothPrinter(printerEntity)
            }
            else -> {
                throw Exception("Error unable to specific the printer type")
            }
        }
    }
}