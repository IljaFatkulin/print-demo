import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { SearchPrinters } from "../components/search-printers";
import { usePrinterDiscovery, useSelectedPrinter } from "../utils/printer";
import { Button } from "../components/button";
import { useCallback } from "react";

export default function Connect() {
  const printer = useSelectedPrinter();
  const { factoryReset, error } = usePrinterDiscovery();

  const handleFactoryReset = useCallback(() => {
    factoryReset();
  }, [factoryReset]);

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <p className="text-xl">
        Printer:{" "}
        <span className="font-bold">{printer?.address || "not connected"}</span>
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="font-bold w-full mt-10 ">Search printers</Button>
        </DialogTrigger>
        <DialogOverlay className="fixed inset-0 z-10 bg-gray-700 bg-opacity-60 z-40" />
        <DialogContent className="p-4 fixed bg-white z-50 w-[calc(100%-100px)] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl">
          <DialogTitle />
          <SearchPrinters />
        </DialogContent>
      </Dialog>
      <Button variant="outline_red" onClick={handleFactoryReset}>
        Factory reset
      </Button>
    </div>
  );
}
