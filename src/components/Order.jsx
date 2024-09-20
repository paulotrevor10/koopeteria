import menu from "../assets/menu.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faCoins,
  faDeleteLeft,
  faTimes,
  faSave,
  faEdit,
  faSpinner,
  faTags,
  faTrash,
  faUser,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addOrder, deleteOrder, updateOrder } from "../service/Service";
import { useState } from "react";
import { ErrorAlert, SuccessAlert } from "../Alerts/Alerts";

export default function Order({
  orders,
  clerk,
  regularBill,
  discountedBill,
  fetchOrders,
  fetchRegularBill,
  fetchDiscountedBill,
  error,
}) {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState({});

  // Form validation

  const validationSchema = Yup.object({
    orderName: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, "Invalid")
      .required("Required"),
    price: Yup.number().min(0, "Invalid").required("Required"),
    isDiscounted: Yup.boolean(),
  });

  // Delete order
  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      fetchOrders();
      fetchDiscountedBill();
      fetchRegularBill();

      setAlertMessage("Order deleted successfully!");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 5000);
    } catch (error) {
      setAlertMessage("Failed to delete order. Please try again.");
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 5000);
    }
  };

  // Edit order
  const handleEdit = (id) => {
    setIsEditing(true);
    setOrderId(id);
    const orderToEdit = orders.find((order) => order.id === id);
    setEditedOrder(orderToEdit);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedOrder((prevOrder) => ({
      ...prevOrder,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save Order
  const handleSave = async () => {
    try {
      await updateOrder(orderId, editedOrder);
      setAlertMessage("Order updated successfully!");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 5000);
      setIsEditing(false);
      setOrderId(null);
      fetchOrders();
      fetchDiscountedBill();
      fetchRegularBill();
    } catch (error) {
      setAlertMessage("Failed to update order. Please try again.");
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 5000);
    }
  };

  return (
    <div className="bg-c-quaternary p-4 text-gray-800 lg:flex gap-4 ">
      <div className="p-4 shadow-c-shadow bg-slate-50 ">
        <img src={menu} alt="menu" className="max-w-40 mx-auto md:max-w-80" />
      </div>

      <div className="w-full mt-4 md:mt-0">
        <Formik
          initialValues={{ orderName: "", price: "", isDiscounted: false }}
          validationSchema={validationSchema}
          // Add Order
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              if (values.orderName.toLowerCase().includes("espresso")) {
                values.isDiscounted = true;
              }
              await addOrder(values);
              setAlertMessage("Order placed successfully!");
              setShowSuccessAlert(true);
              setTimeout(() => setShowSuccessAlert(false), 5000);
              resetForm();
              fetchOrders();
              fetchDiscountedBill();
              fetchRegularBill();
            } catch (error) {
              setAlertMessage("Failed to place order. Please try again.");
              setShowErrorAlert(true);
              setTimeout(() => setShowErrorAlert(false), 5000);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ touched, errors, values, isSubmitting }) => (
            <Form>
              <div className="text-right p-4 bg-c-quinary shadow-c-shadow">
                <FontAwesomeIcon icon={faCoffee} />
                <span className="ml-2 text-xl font-bold">Order</span>
              </div>
              <hr />
              <div className="relative overflow-x-auto shadow-c-shadow ">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-slate-50 uppercase bg-c-blue">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Order Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3">
                        On 5% Promo?
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-c-quinary">
                      <td className="px-6 py-4">
                        <Field
                          type="text"
                          name="orderName"
                          className={`w-44 bg-gray-50 border ${
                            touched.orderName && errors.orderName
                              ? "border-red-500"
                              : "border-gray-300"
                          } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 text-xs`}
                          placeholder="Order Name"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Field
                          type="number"
                          name="price"
                          className={`w-44 bg-gray-50 border ${
                            touched.price && errors.price
                              ? "border-red-500"
                              : "border-gray-300"
                          } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 text-xs`}
                          placeholder="Price"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Field
                          type="checkbox"
                          name="isDiscounted"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          checked={
                            values.orderName.toLowerCase().includes("espresso")
                              ? true
                              : values.isDiscounted
                          }
                          disabled={values.orderName
                            .toLowerCase()
                            .includes("espresso")}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="py-1.5 px-3 me-2 text-xs font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100"
                        >
                          <FontAwesomeIcon
                            icon={faSpinner}
                            className={`animate-spin mr-2 ${
                              isSubmitting ? "" : "hidden"
                            }`}
                          />
                          Place Order
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Form>
          )}
        </Formik>

        {/* Order List */}
        <div className="shadow-c-shadow bg-c-quinary mt-4">
          <div className="text-right p-4">
            <FontAwesomeIcon icon={faUserCircle} />
            <span className="text-xl font-bold ml-2">{clerk.name}</span>
            <small className="block font-light">Attending Clerk</small>
          </div>
          <hr />
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-slate-50 uppercase bg-c-blue">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Order Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    On 5% Promo?
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {error ? (
                  <tr className="bg-c-quinary">
                    <td colSpan="4" className="px-6 py-4 text-center">
                      {error}
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr className="bg-c-quinary">
                    <td colSpan="4" className="px-6 py-4 text-center">
                      Order is empty
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="bg-c-quinary">
                      <td className="px-6 py-4">
                        {isEditing && orderId === order.id ? (
                          <input
                            type="text"
                            name="orderName"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-1.5 text-xs"
                            value={editedOrder.orderName}
                            onChange={handleChange}
                          />
                        ) : (
                          order.orderName
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing && orderId === order.id ? (
                          <input
                            type="number"
                            name="price"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-1.5 text-xs"
                            value={editedOrder.price}
                            onChange={handleChange}
                          />
                        ) : (
                          "$ " + order.price.toFixed(2)
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          name="isDiscounted"
                          checked={
                            isEditing && orderId === order.id
                              ? editedOrder.isDiscounted
                              : order.isDiscounted
                          }
                          disabled={!(isEditing && orderId === order.id)}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        {isEditing && orderId === order.id ? (
                          <>
                            <FontAwesomeIcon
                              size="lg"
                              icon={faSave}
                              className="mr-4 cursor-pointer hover:text-green-600"
                              title="save"
                              onClick={handleSave}
                            />
                            <FontAwesomeIcon
                              size="lg"
                              icon={faTimes}
                              className="cursor-pointer hover:text-yellow-600"
                              title="cancel"
                              onClick={() => {
                                setIsEditing(false);
                                setOrderId(null);
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon
                              size="lg"
                              icon={faEdit}
                              className="mr-4 cursor-pointer hover:text-c-secondary"
                              title="edit"
                              onClick={() => handleEdit(order.id)}
                            />
                            <FontAwesomeIcon
                              size="lg"
                              icon={faTrash}
                              className="cursor-pointer hover:text-red-600"
                              title="delete"
                              onClick={() => handleDelete(order.id)}
                            />
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <hr />

            <div className="flex items-center justify-center gap-4 p-4 md:justify-start">
              <div className="shadow-c-shadow p-4 rounded">
                <div className="inline-block">
                  <span className="font-bold text-xl">
                    {"$ " + regularBill.toFixed(2)}
                  </span>
                </div>
                <small className="block text-xs">Regular Bill</small>
              </div>

              <div className="shadow-c-shadow p-4 rounded">
                <div className="inline-block">
                  <span className="font-bold text-xl">
                    {"$ " + discountedBill.toFixed(2)}
                  </span>
                  <FontAwesomeIcon icon={faTags} className="ml-1" size="xs" />
                </div>
                <small className="block text-xs">Discounted Bill</small>
              </div>
            </div>
          </div>

          {showSuccessAlert && (
            <SuccessAlert
              message={alertMessage}
              onClose={() => setShowSuccessAlert(false)}
            />
          )}

          {showErrorAlert && (
            <ErrorAlert
              message={alertMessage}
              onClose={() => setShowErrorAlert(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
