import { WebPlugin } from '@capacitor/core';

import type { ZebraBluetoothPrinter, ZebraPrinterPlugin } from './definitions';

export class ZebraPrinterWeb extends WebPlugin implements ZebraPrinterPlugin {
  async searchPrinters(): Promise<{ printers: ZebraBluetoothPrinter[] }> {
    throw this.unimplemented('Not implemented on web.');
  }
  async connectToPrinter(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }
  async printLabel(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }
  async factoryReset(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }
}
