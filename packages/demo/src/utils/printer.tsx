import { Preferences } from "@capacitor/preferences";
import { ZebraBluetoothPrinter, ZebraPrinter } from "zebra";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const SelectedPrinterContext = createContext<{
  printer: ZebraBluetoothPrinter | null;
  setPrinter: (printer: ZebraBluetoothPrinter | null) => void;
}>({
  printer: null,
  setPrinter: () => {},
});

export function SelectedPrinterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [printer, setPrinter] = useState<ZebraBluetoothPrinter | null>(null);
  const value = useMemo(() => ({ printer, setPrinter }), [printer]);

  useEffect(() => {
    (async () => {
      const printerRaw = await Preferences.get({
        key: "selected_printer",
      });

      if (printerRaw && printerRaw.value) {
        setPrinter(JSON.parse(printerRaw.value));
      }
    })();
  }, []);

  return (
    <SelectedPrinterContext.Provider value={value}>
      {children}
    </SelectedPrinterContext.Provider>
  );
}

export function useSelectedPrinter() {
  return useContext(SelectedPrinterContext).printer;
}

export function usePrinterDiscovery() {
  const [printers, setPrinters] = useState<ZebraBluetoothPrinter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startDiscovery = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { printers } = await ZebraPrinter.searchPrinters();
      setPrinters(printers);
    } catch (error) {
      setPrinters([]);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const factoryReset = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await ZebraPrinter.factoryReset();
      setPrinters([]);
      await Preferences.remove({ key: "selected_printer" });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { printers, isLoading, error, startDiscovery, factoryReset };
}

export function useSelectPrinter(printer: ZebraBluetoothPrinter) {
  const { setPrinter } = useContext(SelectedPrinterContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectPrinter = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await Preferences.set({
        key: "selected_printer",
        value: JSON.stringify(printer),
      });

      setPrinter(printer);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    } finally {
      setIsLoading(false);
    }
  }, [printer, setPrinter]);

  return { selectPrinter, isLoading, error };
}

export function usePrintLabel() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const printer = useSelectedPrinter();

  const print = useCallback(
    async (zplString: string, quantity: number = 1) => {
      if (!printer) {
        setError("No printer selected");
        return;
      }

      setError(null);

      const quantityFormattedZpl = zplString.replace(
        "\n^XZ",
        `\n^PQ${quantity}\n^XZ`
      );

      setIsLoading(true);

      try {
        await ZebraPrinter.connectToPrinter({ printer });
        await ZebraPrinter.printLabel({ zpl: quantityFormattedZpl });
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError(String(e));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [printer]
  );

  return { print, isLoading, error };
}
