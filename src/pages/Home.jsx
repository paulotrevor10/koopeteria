import Footer from "../components/Footer";
import Header from "../components/Header";
import Order from "../components/Order";
import Promo from "../components/Promo";
import { useState } from "react";
import { useEffect } from "react";
import {
  getOrders,
  getRegularBill,
  getDiscountedBill,
} from "../service/Service";

export default function Home() {
  const [orders, setOrders] = useState([]);
  const [clerk, setClerk] = useState({});
  const [regularBill, setRegularBills] = useState(0);
  const [discountedBill, setDiscountedBill] = useState(0);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      setError("Unable to get orders. Something went wrong");
    }
  };

  const fetchRegularBill = async () => {
    try {
      const data = await getRegularBill();
      setClerk(data.clerk);
      setRegularBills(data.totalBill);
    } catch (error) {
      console.error("Failed to fetch regular bill:", error);
    }
  };

  const fetchDiscountedBill = async () => {
    try {
      const data = await getDiscountedBill();

      setDiscountedBill(data.totalBill);
    } catch (error) {
      console.error("Failed to fetch discounted bill:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchRegularBill();
    fetchDiscountedBill();
  }, []);

  return (
    <div className="">
      <Header />
      <Promo />
      <Order
        orders={orders}
        regularBill={regularBill}
        clerk={clerk}
        discountedBill={discountedBill}
        fetchOrders={fetchOrders}
        fetchRegularBill={fetchRegularBill}
        fetchDiscountedBill={fetchDiscountedBill}
        error={error}
      />
      <Footer />
    </div>
  );
}
