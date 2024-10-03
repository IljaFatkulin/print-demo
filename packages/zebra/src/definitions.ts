export type ZebraBluetoothPrinter = {
  name: string;
  address: string;
};
export interface ZebraPrinterPlugin {
  printLabel(options: { zpl: string }): Promise<void>;
  searchPrinters(): Promise<{ printers: ZebraBluetoothPrinter[] }>;
  connectToPrinter(options: { printer: ZebraBluetoothPrinter }): Promise<void>;
  factoryReset(): Promise<void>;
}
