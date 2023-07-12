import React, { useEffect, useState, useRef } from "react";
import { withTranslation } from "react-i18next";
import { url } from "../../helper/helper";
import { postData, postDataWithToken } from "../../helper/api";
const Membership = ({
  t,
  address,
  lang,
  subtype,
  packageDisplay,
  price_packages_country_id,
}) => {
  const [succes, setSucces] = useState(false);
  const [packages, setPackages] = useState([]);
  const [packageId, setPackageId] = useState("");
  console.log(packageDisplay, ">>>>>>>>>>>>>>>>");
  const packageSelection = async () => {
    const data = new FormData();
    data.set("country_id", address);
    data.set("language_id", lang);
    data.set("user_type", subtype);
    // const res = await postData(`${url}/api/packages/list`, data);

    // setPackages(res?.data?.data);
    packageDisplay.length && setPackages(packageDisplay);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPackageId(value);
  };

  const saveChanges = async (event) => {
    event.preventDefault();
    const token = await localStorage.getItem("token");

    const data = new FormData();

    data.set("package_id", packageId);
    data.set(
      "package_price",

      packages?.find((pack) => pack.id == packageId).package_price
    );
    data.set(
      "package_term_period",

      packages?.find((pack) => pack.id == packageId).package_price_terms_period
    );

    postDataWithToken(`${url}/api/storePackageDetails`, data, token)
      .then((result) => {
        //this.myRef.current.scrollTo(0, 0);
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
        // Object.entries(err.response.data.error).map(([key, value]) => {
        // this.setState({ errors: err.response.data.error });
        // })
        // this.setState({ success: false });
        //this.myRef.current.scrollTo(0, 0);
      });
  };
  useEffect(() => {
    packageSelection();
  }, [address, lang, subtype]);
  const successRef = useRef(null);

  return (
    <div>
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
        <form onSubmit={saveChanges}>
          <div className="card-body">
            <div className="row">
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label>{t("account.account_package")}</label>
                  <div className="form-group">
                    <select
                      className="form-control"
                      name="package_id"
                      onChange={handleChange}
                    >
                      <option selected disabled value="">
                        {" "}
                        {/* &euro;{price}- {period}/{period > 1 ? 'mos' : 'mo'} -{' '}
                        {subtype} */}
                        {
                          packages?.find(
                            (pack) => pack.id === price_packages_country_id
                          )?.package_display_text
                        }
                      </option>

                      <>
                        {packages?.map((pack) => {
                          const {
                            id,
                            package_price,
                            package_price_terms_period,
                            package_title,
                            user_type,
                            package_display_text,
                          } = pack;
                          return (
                            <>
                              <option key={id} value={id}>
                                {/* {user_type}- {package_title}, {package_price}/
                                {package_price_terms_period}
                                {package_price_terms_period > 1
                                  ? 'mos'
                                  : 'mo'}{' '} */}
                                {package_display_text}
                              </option>
                            </>
                          );
                        })}
                      </>
                    </select>
                  </div>
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
    </div>
  );
};

export default withTranslation()(Membership);
