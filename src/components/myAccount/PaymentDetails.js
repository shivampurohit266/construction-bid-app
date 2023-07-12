import React, { useState, useRef, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { postDataWithToken, getData } from "../../helper/api";
import { url } from "../../helper/helper";
const PaymentDetails = ({ t }) => {
  const token = localStorage.getItem("token");
  const [accountNumber, setAccountNumber] = useState("");
  const [succes, setSucces] = useState(false);
  const storePaymentDetails = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.set("account_number", accountNumber);
    await postDataWithToken(`${url}/api/storePaymentDetails`, data, token)
      .then((result) => {
        if (result.status === 200) {
          setSucces(true);
          //successRef.current.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            setSucces(false);
          }, 3000);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const invoiceData = async () => {
    const result = await getData(`${url}/api/account`, token);
    const acc = result?.data;
    if (acc?.length && acc?.length > 0) {
      setAccountNumber(acc[0]?.invoice_account_number);
    }
  };
  useEffect(() => {
    invoiceData();
  }, []);

  const successRef = useRef(null);

  return (
    <div className="card">
      {succes ? (
        <div
          className="alert-success"
          style={{ padding: "1rem" }}
          ref={successRef}
        >
          Successfully Updated!
        </div>
      ) : (
        ""
      )}
      <form onSubmit={storePaymentDetails}>
        <div className="card-body">
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label>{t("account.account_number")}</label>
                <input
                  type="text"
                  className="form-control"
                  value={accountNumber}
                  onChange={(e) => {
                    setAccountNumber(e.target.value);
                    //setErrors({ ...errors, company_error: '' });
                  }}
                />
                {/* <div className='prof-error'>{company_error}</div> */}
              </div>
            </div>

            <div className="col-12">
              <button className="btn btn-success" type="submit">
                {t("account.saveChanges")}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default withTranslation()(PaymentDetails);
