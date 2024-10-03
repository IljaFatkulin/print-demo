import {
  usePrinterDiscovery,
  useSelectedPrinter,
  useSelectPrinter,
} from "../utils/printer";
import { ZebraBluetoothPrinter } from "zebra";
import { Button } from "./button";

export function FoundPrinter({ printer }: { printer: ZebraBluetoothPrinter }) {
  const currentPrinter = useSelectedPrinter();
  const { selectPrinter, isLoading, error } = useSelectPrinter(printer);
  const { address } = printer;

  return (
    <>
      <Button
        variant={currentPrinter?.address === address ? "gray" : "outline_gray"}
        className="rounded-xl py-1 px-1"
        onClick={selectPrinter}
        disabled={isLoading}
      >
        {isLoading ? "Selecting..." : `Connect to ${address}`}
        {currentPrinter?.address === address && " (selected)"}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
}

export function SearchPrinters() {
  const { printers, error, isLoading, startDiscovery } = usePrinterDiscovery();

  return (
    <div className="mb-3">
      <Button
        className="font-bold text-xl w-full rounded-xl"
        onClick={startDiscovery}
        disabled={isLoading}
      >
        {isLoading ? "Searching..." : "Search printers"}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <ul className="flex flex-col gap-2 mt-2">
        {printers.map((printer) => (
          <li key={printer.address}>
            <FoundPrinter printer={printer} />
          </li>
        ))}
      </ul>
    </div>
  );
}
