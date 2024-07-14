import { useEffect, useState } from "react";
import "./App.css";
import { fetchDataFromApi } from "./utils/api";
import { Line } from "react-chartjs-2";
import {
  Chart as chartjs,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
} from "chart.js";
chartjs.register(LineElement, CategoryScale, LinearScale, PointElement, Legend);
function App() {
  const [customers, setCustomers] = useState();
  const [transactions, setTransactions] = useState();
  const [selectCustomer, setSelectCustomer] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const dataa = async () => {
    await fetchDataFromApi()
      .then((res) => {
        setCustomers(res.record.customers);
        setTransactions(res.record.transactions);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  useEffect(() => {
    dataa();
  }, []);

  const getTotalTransactions = (customerId) => {
    return transactions
      .filter((tran) => tran.customer_id === customerId)
      .reduce((total, tran) => total + tran.amount, 0);
  };

  const getTransactionDataForCustomer = (customerId) => {
    const customerTransactions = transactions.filter(
      (transaction) => transaction.customer_id === customerId
    );
    const transactionData = customerTransactions.reduce((acc, transaction) => {
      acc[transaction.date] = (acc[transaction.date] || 0) + transaction.amount;
      return acc;
    }, {});

    const labels = Object.keys(transactionData).sort();
    const data = labels.map((date) => transactionData[date]);

    return {
      labels,
      datasets: [
        {
          label: "Transaction Amount",
          data,
          fill: false,
          borderColor: "rgba(75,192,192,1)",
          tension: 0.4,
          pointBorderColor: "aqua",
          backgroundColor: "aqua",
          borderColor: "blue",
        },
      ],
    };
  };

  return (
    <>
    <div className="text-center"><h1 className="text-white mainH1">Transactions <i class="fa-brands fa-ubuntu fs-2"></i></h1> </div>
  
   <div className="table-responsive text-center  my-4">
        <div className="search-container my-5">
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            name="search"
            placeholder="Search..."
            className="search-input"
          />
          <i className="fas fa-search search-btn fs-4"></i>
        </div>

        <table className="table table-striped rounded-3">
          <thead>
            <tr>
              <th scope="col">CUSTUMER Id</th>
              <th scope="col"> CUSTUMER NAME</th>
              <th scope="col">TOTAL TRANSACTIONS</th>
              <th scope="col">TRANSACTIONS PER DAY</th>
            </tr>
          </thead>
          <tbody id="bodyTable">
            {loading ? (
              "loading...."
            ) : (
              <>
                {customers
                  .filter((item) => {
                    return search.toLowerCase() === ""
                      ? item
                      : item.name.toLowerCase().includes(search);
                  })
                  .map((cus, idx) => (
                    <tr key={idx} className="rtt">
                      <td>{cus.id}</td>
                      <td>{cus.name}</td>
                      <td>{getTotalTransactions(cus.id)}</td>
                      <td className="">
                        <button
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop"
                          className="test  test position-relative overflow-hidden"
                          onClick={() => setSelectCustomer(cus)}
                        >
                          {" "}
                          <i className="visitIcon"> View </i>{" "}
                        </button>
                      </td>
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        </table>
      </div>
   
      <div className="modal" id="staticBackdrop">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">
                {" "}
                {selectCustomer?.name} Transactions
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h5 className=" text-center">
                {" "}
                Total Transactions Amount :
                {selectCustomer && getTotalTransactions(selectCustomer.id)}
              </h5>
              {selectCustomer && (
                <Line data={getTransactionDataForCustomer(selectCustomer.id)} />
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
