import Navigation from "./components/navigation";
import RoutesList from "./routes";
import { SelectedPrinterProvider } from "./utils/printer";

function App() {
  return (
    <div className="bg-slate-200">
      <div className="w-full flex justify-center items-center h-16 bg-white fixed top-0">
        <p className="font-bold text-[#E05252] text-xl">Scandiweb print demo</p>
      </div>
      <div className="p-4 min-h-[calc(100vh-128px)] overflow-y-auto mt-16 mb-16">
        <SelectedPrinterProvider>
          <RoutesList />
        </SelectedPrinterProvider>
      </div>
      <Navigation />
    </div>
  );
}

export default App;
