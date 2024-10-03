package com.itim.zebra.jollyes.module

import com.zebra.sdk.comm.Connection
import com.zebra.sdk.comm.ConnectionException
import com.zebra.sdk.printer.SettingsSetter
import com.zebra.sdk.printer.SGD
import com.zebra.sdk.util.internal.FileUtilities
import java.io.InputStream

abstract class AbstractPrinter {
    protected lateinit var connection: Connection

    fun isConnected(): Boolean {
        if (!this::connection.isInitialized) {
            return false
        }

        var ok = connection.isConnected

        try {
            connection.write(byteArrayOf(1))
        } catch (e: ConnectionException) {
            ok = false
        }

        return ok
    }

    @Throws(ConnectionException::class)
    abstract fun getId(): String;

    @Throws(ConnectionException::class)
    abstract suspend fun createConnection(): AbstractPrinter

    @Throws(ConnectionException::class)
    abstract suspend fun connect(): Boolean

    fun setConfiguration(settings: Map<String, String>) {
        for ((key, value) in settings) {
            SGD.SET(key, value, connection)
        }
    }

    @Throws(ConnectionException::class)
    fun sendFile(filePath: InputStream?) {
        if (!::connection.isInitialized) {
            throw ConnectionException("Printer has not connected yet")
        }

        FileUtilities.sendFileContentsInChunks(
            connection,
            filePath
        )
    }
}