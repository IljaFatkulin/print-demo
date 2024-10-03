import { products } from "../data/products";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col gap-y-2">
        {products.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.barcode}
            className="flex border border-2 border-gray-300 rounded-lg p-2 gap-2 bg-white items-center"
          >
            <img src={product.img} className="h-28 max-w-28" />
            <div className="flex justify-between w-full pl-4 pr-6">
              <div>
                <p className="font-medium">{product.title}</p>
              </div>
              <div>
                <p className="font-bold">{product.price}$</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
