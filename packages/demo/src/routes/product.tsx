import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { products } from "../data/products";
import { IoIosArrowBack } from "react-icons/io";
import Barcode from "react-barcode";
import { Button } from "../components/button";
import { usePrintLabel } from "../utils/printer";
import { getLabel1 } from "../utils/label";

function Info({ title, value }: { title: string; value?: string }) {
  return (
    <div className="flex">
      <p className="w-1/2">{title}:</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}

export default function Product() {
  const { id } = useParams();
  const product = useMemo(
    () => products.find((p) => p.id === Number(id || "0")),
    [id]
  );
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const { print } = usePrintLabel();

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const decreaseQty = useCallback(() => {
    setQty((prev) => Math.max(1, prev - 1));
  }, [setQty]);

  const increaseQty = useCallback(() => {
    setQty((prev) => prev + 1);
  }, [setQty]);

  const setQtyValue = useCallback(
    (value: number) => {
      setQty(Math.max(1, value));
    },
    [setQty]
  );

  const handlePrint = useCallback(() => {
    const zpl = getLabel1({
      ...product,
      date: new Date().toLocaleDateString(),
    });

    print(zpl, qty);
  }, [print, product, qty]);

  return (
    <div>
      <button onClick={handleBack} className="fixed top-4 left-3">
        <IoIosArrowBack size={32} />
      </button>
      <div className="bg-white p-2 rounded-xl">
        <img src={product?.img} className="rounded-xl" />
      </div>
      <div className="bg-white rounded-xl">
        <div className="mt-4 flex p-4 gap-x-6">
          <div className="w-1/2">
            <Info title="Title" value={product?.title} />
            <Info title="Color" value={product?.color} />
            <Info title="Price" value={product?.price + "$"} />
          </div>
          <div className="w-1/2">
            <Info title="Color" value={product?.color} />
            <Info title="Brand" value={product?.brand} />
          </div>
        </div>
        <div className="w-full flex justify-center mt-1">
          <Barcode value={product?.barcode || ""} />
        </div>
      </div>
      <div className="flex gap-x-4 mt-4 justify-center">
        <button
          className="text-4xl border-white border-2 rounded-full h-12 w-12"
          onClick={decreaseQty}
        >
          -
        </button>
        <input
          type="number"
          value={qty}
          min={1}
          onChange={(e) => setQty(Number(e.target.value))}
          onBlur={(e) => setQtyValue(Number(e.target.value))}
          className="w-10 bg-transparent text-center"
        />
        <button
          className="text-4xl border-white border-2 rounded-full h-12 w-12"
          onClick={increaseQty}
        >
          +
        </button>
      </div>
      <Button className="rounded-xl w-full mt-4" onClick={handlePrint}>
        Print
      </Button>
    </div>
  );
}
