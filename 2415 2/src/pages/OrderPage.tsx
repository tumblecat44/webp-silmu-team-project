import { useState, useEffect, type FormEvent } from "react";

type Product = {
  name: string;
  price: number;
  color: string;
  brand: string;
};

export default function OrderPage() {
  // 입력값
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productColor, setProductColor] = useState("");
  const [productBrand, setProductBrand] = useState("");

  // 주문 목록
  const [orders, setOrders] = useState<Product[]>([]);

  // 총합 상태
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const total = orders.reduce((acc, product) => acc + product.price, 0);
    setTotal(() => total);
  }, [orders]);

  const changeProductName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductName(() => e.target.value);
  };
  const changeProductPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductPrice(() => parseInt(e.target.value));
  };
  const changeProductColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductColor(() => e.target.value);
  };
  const changeProductBrand = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductBrand(() => e.target.value);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      productName === "" ||
      productPrice === 0 ||
      productColor === "" ||
      productBrand === ""
    ) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const newProduct: Product = {
      name: productName,
      price: productPrice,
      color: productColor,
      brand: productBrand,
    };

    setOrders((prev) => [...prev, newProduct]);
    setProductName(() => "");
    setProductPrice(() => 0);
    setProductColor(() => "");
    setProductBrand(() => "");
  };

  const onDelete = (index: number) => {
    setOrders((prev) => prev.filter((_, i) => i !== index));
  };

  const onDeleteAll = () => {
    setOrders(() => []);
  };

  return (
    <div className="flex flex-col">
      <form
        action=""
        className="pb-8 border-b-2 border-b-black  p-4 gap-y-2 flex flex-col mt-4"
        onSubmit={onSubmit}
      >
        {/*상품 입력 */}
        <p className="text-xl font-bold">상품 입력</p>
        <div className="flex flex-col gap-y-0.5">
          <label htmlFor="productName">상품명 (string)</label>
          <input
            className="border-2 border-black p-2 rounded-md"
            type="text"
            id="productName"
            name="productName"
            placeholder="예: 모나미 볼펜"
            value={productName}
            onChange={changeProductName}
          />
        </div>
        <div className="flex flex-col gap-y-0.5">
          <label htmlFor="productPrice">가격 (int)</label>
          <input
            className="border-2 border-black p-2 rounded-md"
            type="number"
            id="productPrice"
            name="productPrice"
            placeholder="예: 1500"
            value={productPrice === 0 ? "" : productPrice}
            onChange={changeProductPrice}
          />
        </div>
        <div className="flex flex-col gap-y-0.5">
          <label htmlFor="productColor">색상 (string)</label>
          <input
            className="border-2 border-black p-2 rounded-md"
            type="text"
            id="productColor"
            name="productColor"
            placeholder="예: 검정, 빨강, 파랑"
            value={productColor}
            onChange={changeProductColor}
          />
        </div>
        <div className="flex flex-col gap-y-0.5">
          <label htmlFor="productBrand">브랜드 (string)</label>
          <input
            className="border-2 border-black p-2 rounded-md"
            type="text"
            id="productBrand"
            name="productBrand"
            placeholder="예: 모나미, 동아, 제트스트림"
            value={productBrand}
            onChange={changeProductBrand}
          />
        </div>

        <button
          className="w-full bg-purple-950 text-white px-2 py-3 rounded-md mt-2 text-lg"
          type="submit"
        >
          추가
        </button>
      </form>

      <div className="p-4 pt-6 border-b-2 border-b-black">
        {/* 주문 목록 */}
        <p className="text-xl font-bold">주문 목록</p>
        {orders.length === 0 ? (
          <p className="mt-4 text-gray-400 text-lg">아직 주문이 없습니다.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-y-2">
            {orders.map((product, index) => (
              <li
                key={index}
                className="shadow-md rounded-md flex flex-row justify-between items-center p-4"
              >
                <div className="flex flex-col">
                  <p className="font-semibold text-lg">{product.name}</p>
                  <p className="text-md text-gray-400">
                    {product.color} / {product.brand}
                  </p>
                  <p className="text-sm font-medium">
                    {product.price.toLocaleString()}원
                  </p>
                </div>

                <button
                  className="text-red-600"
                  onClick={() => onDelete(index)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 pt-6">
        {/* 결제 정보 */}
        <p className="text-xl font-bold">결제 정보</p>
        <div className="shadow-md p-4 flex flex-col gap-y-2 mt-4 rounded-md">
          <p className="text-gray-900 text-lg">총 {orders.length}건</p>
          <p className="text-gray-900 font-extrabold text-2xl">
            {total.toLocaleString()}원
          </p>
          <button
            className="w-full bg-purple-950 text-white px-2 py-3 rounded-md mt-2 text-lg"
            onClick={onDeleteAll}
          >
            전체 삭제
          </button>
        </div>
      </div>
    </div>
  );
}
