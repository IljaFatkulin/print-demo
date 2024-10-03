package com.itim.zebra.jollyes

import android.content.Context
import android.util.Log
import com.itim.zebra.jollyes.module.AbstractPrinter
import com.itim.zebra.jollyes.module.PrinterFactory
import com.zebra.sdk.comm.ConnectionException
import com.zebra.sdk.printer.discovery.BluetoothDiscoverer
import com.zebra.sdk.printer.discovery.DiscoveredPrinter
import com.zebra.sdk.printer.discovery.DiscoveryHandler
import com.zebra.sdk.settings.SettingsException
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.callbackFlow
import java.io.ByteArrayInputStream
import java.io.InputStream
import java.nio.charset.StandardCharsets

class PrinterRepository(private val context: Context, private val dispatcher: CoroutineDispatcher = Dispatchers.IO, private val factory: PrinterFactory) {
    private lateinit var abstractPrinter: AbstractPrinter

    fun getBluetoothZebraPrinters() = callbackFlow {
        BluetoothDiscoverer.findPrinters(context, object : DiscoveryHandler {
            val discoveredPrinters: MutableList<DiscoveredPrinter> = mutableListOf()

            override fun foundPrinter(printer: DiscoveredPrinter) {
                Log.d("PrinterRepo", "Found one printers:");
                Log.d("PrinterRepo", printer.toString());

                discoveredPrinters.add(printer)
            }

            override fun discoveryFinished() {
                Log.d("PrinterRepo", "Discovery finished. Found printers:");
                for (printer in discoveredPrinters) {
                    Log.d("PrinterRepo", printer.toString());
                }

                trySend(discoveredPrinters)
            }

            override fun discoveryError(message: String) {
                Log.d("PrinterRepo", "An error occurred during discovery : $message");
                throw Exception(message);
            }
        })

        awaitClose()
    }

    fun configurePrinter() {
        val settingsToSendToThePrinter: MutableMap<String, String> = LinkedHashMap()

        settingsToSendToThePrinter["device.friendly_name"] = "Jollyes ZQ320+"
        settingsToSendToThePrinter["ezpl.print_width"] = "576" // 72 * 8
        settingsToSendToThePrinter["zpl.print_orientation"] = "nor"
        settingsToSendToThePrinter["ezpl.media_type"] = "mark"
        settingsToSendToThePrinter["ezpl.print_method"] = "direct thermal"
        settingsToSendToThePrinter["ezpl.print_mode"] = "tear off"
        settingsToSendToThePrinter["ezpl.tear_off"] = "0"
        settingsToSendToThePrinter["media.type"] = "label"
        settingsToSendToThePrinter["media.sense_mode"] = "bar"
        settingsToSendToThePrinter["device.languages"] = "zpl"
        settingsToSendToThePrinter["wlan.country_code"] = "europe"


        abstractPrinter.setConfiguration(settingsToSendToThePrinter)
        sendStringToPrinter("^XA^MNN^XZ^XA^JUS^XZ");
    }

    suspend fun connectToPrinter(printer: BluetoothPrinterEntity, nTry: Int = 0) {
        if (!this::abstractPrinter.isInitialized || printer.mac !== abstractPrinter.getId()) {
            abstractPrinter = factory.createPrinter(printer)
        }

        if (abstractPrinter.isConnected()) {
            try {
                configurePrinter()
            } catch (e: SettingsException) {
                throw Exception("Printer connected. Failed to configure: " + e.message)
            }

            return;
        }

        try {
            abstractPrinter.createConnection().connect()
        } catch (e: ConnectionException) {
            if (nTry > 3) {
                throw Exception("Failed to connect. Tried " + nTry.toString() +" times. Error: " + e.message)
            }

            delay(500)
        }

        connectToPrinter(printer, nTry + 1)
    }

    fun sendStringToPrinter(zplString: String) {
        val stream: InputStream =
            ByteArrayInputStream(zplString.toByteArray(StandardCharsets.UTF_8))

        return abstractPrinter.sendFile(stream)
    }
}