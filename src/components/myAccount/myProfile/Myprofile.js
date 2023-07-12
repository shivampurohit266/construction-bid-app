import React, { useEffect, useState } from "react";
import Header from "../../shared/Header";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Sidebar from "../../shared/Sidebar";
import { url, base_url } from "../../../helper/helper";
import File from "../../../images/file-icon.png";
import { ReactComponent as Global } from "../../../images/global.svg";
import { ReactComponent as ID } from "../../../images/id.svg";
import { ReactComponent as Location } from "../../../images/location.svg";
import { ReactComponent as Edit } from "../../../images/edit.svg";
import Alert from "react-bootstrap/Alert";
import { createStars } from "../../../helper/starRatings/starRatings";
import "./Myprofile.css";
import { dateFunc } from "../../../helper/dateFunc/date";
import { getData } from "../../../helper/api";

const Myprofile = ({ t, location }) => {
  const [img, setImg] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [place, setPlace] = useState("");
  const [companyID, setCompanyID] = useState("");
  const [website, setWebiste] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [tax, setTax] = useState("");
  const [business, setBusiness] = useState("");
  const [construction, setConstruction] = useState([]);
  const [constructionList, setConstructionList] = useState("");
  const [savedConstruction, setSavedConstruction] = useState([]);
  const [state, setState] = useState("");
  const [availability, setAvailability] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [skills, setSkills] = useState([]);
  const [city, setCity] = useState([]);
  const [profileURL, setProfileURL] = useState("");
  const [usernameURL, setUsernameURL] = useState("");
  const [visibility, setVisibility] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [alert, setAlert] = useState(false);
  const [workHistoryData, setWorkHistoryData] = useState([]);
  const stateId = localStorage.getItem("state_id");
  const lang = localStorage.getItem("_lng");
  const token = localStorage.getItem("token");
  console.log(workHistoryData, ">>>>>>>>>");

  const allProfileData = async () => {
    const token = await localStorage.getItem("token");
    await getData(
      `${url}/api/my-account-detail`,
      token
    )
      .then((res) => {
        if (res?.data?.work_address_states) {
          // res?.data?.work_address_states.map((state) => {
          //   if (state.state_id === Number(stateId)) {
          //     setState(state.state_name);
          //   }
          // });
          const statename = res?.data?.work_address_states.map((state) => {
            if (state.state_id === Number(stateId)) {
              setState(state.state_name);
            }
          });
        }

        if (res?.data?.work_history?.data) {
          setWorkHistoryData(res?.data?.work_history?.data);
        }
        console.log(res?.data?.work_history?.data, "++++");
        if (res?.data?.profile[0]) {
          const a = res?.data?.profile[0];
          console.log(a, "[]");
          setImg(a.company_logo);
          setVisibility(a.visibility);
          setName(a.full_name);
          setCompanyName(a.company_name);
          setCompanyID(a.company_id);
          setProfileURL(a.code);
          setUsernameURL(a.username);
          setTax(a.tax_registration);
          setCompanyType(a.company_type);
          if (a.avatar_location === null) {
            setPlace("Not available");
          } else setPlace(a.avatar_location);

          if (a.company_website === "null") {
            setWebiste("Not Available");
          } else setWebiste(a.company_website);

          if (a.business_insurance === null) {
            setBusiness("Not Available");
          } else setBusiness(a.business_insurance);

          //setConstruction(a.licenses);
          var b = a.licenses?.split(",").map(function (item) {
            return parseInt(item, 6);
          });
          setConstruction(a.licenses_arr);
          const mapLicenses = a.licenses_arr?.map((license) => license.id);
          setConstructionList(mapLicenses);
          const commonElements = a.licenses_arr?.filter((license) => {
            return b.includes(license.id);
          });

          setSavedConstruction(commonElements);

          setAvailability(a.availability);

          setIntroduction(a.introduction);

          setSkills(a.skills_arr);

          setCity(a.city_arr);
        }
      })

      .catch((err) => {
        console.log(err);
      });
  };

  const getProfileData = async () => {
    await getData(`${url}/api/profile`, token)
      .then((res) => {
        console.log(res);
        const a = res?.data[0];
        console.log(a);
        setImg(a.company_logo);
        setVisibility(a.visibility);
        setName(a.full_name);
        setCompanyName(a.company_name);
        setCompanyID(a.company_id);
        setProfileURL(a.code);
        setUsernameURL(a.username);
        setTax(a.tax_registration);
        setCompanyType(a.company_type);
        if (a.avatar_location === null) {
          setPlace("Not available");
        } else setPlace(a.avatar_location);

        if (a.company_website === "null") {
          setWebiste("Not Available");
        } else setWebiste(a.company_website);

        if (a.business_insurance === null) {
          setBusiness("Not Available");
        } else setBusiness(a.business_insurance);

        //setConstruction(a.licenses);
        var b = a.licenses?.split(",").map(function (item) {
          return parseInt(item, 6);
        });
        setConstruction(a.licenses_arr);
        const mapLicenses = a.licenses_arr?.map((license) => license.id);
        setConstructionList(mapLicenses);
        const commonElements = a.licenses_arr?.filter((license) => {
          return b.includes(license.id);
        });

        setSavedConstruction(commonElements);

        setAvailability(a.availability);

        setIntroduction(a.introduction);

        setSkills(a.skills_arr);

        setCity(a.city_arr);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getState = async () => {
    await getData(`${url}/api/state/${lang}`, token)
      .then((res) => {
        res.data.data.map((state) => {
          if (state.state_id === Number(stateId)) {
            setState(state.state_name);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getWorkHistory = async () => {
    await getData(
      `${url}/api/account/work-history-listing`,
      token
    )
      .then((res) => {
        console.log(res.data);
        if (res?.data) {
          setWorkHistoryData(res?.data?.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getFeedback = async () => {
    await getData(`${url}/api/rating/get_review`, token).then((res) =>
      setFeedback(sortArray(res?.data))
    );
  };

  const sortArray = (feeds) => {
    return feeds?.reverse(function (a, b) {
      return b - a;
    });
  };

  useEffect(() => {
    allProfileData();
    // getProfileData();
    // getState();
    // getWorkHistory();
    getFeedback();
  }, []);
  console.log(visibility, availability);
  return (
    <>
      {/* <Header /> */}
      <div className="sidebar-toggle"></div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active" aria-current="page">
            <Link
              to="/index"
              className="breadcrumb-item active"
              aria-current="page"
            >
              {t("header.marketplace")}
            </Link>
          </li>
          <p style={{ margin: "0 6px" }}>/</p>
          <Link to="/myaccount">
            <li className="breadcrumb-item active" aria-current="page">
              {t("account.title")}
            </li>
          </Link>
        </ol>
      </nav>
      <div className="main-content">
        <Sidebar dataFromParent={location.pathname} />
        <div className="page-content">
          <div className="container-fluid">
            <div className="myProfile-edit">
              <Edit />
              <Link to="/myaccount">
                {" "}
                <h3>{t("account.editProfile")}</h3>
              </Link>
              {alert && (
                <Alert
                  variant="success"
                  className="myProfile-alert"
                  style={{
                    fontSize: "13px",
                    zIndex: 1,
                    position: "absolute",
                    width: "40rem",

                    top: "0",
                    left: "45%",
                    right: "0",
                  }}
                >
                  Your profile URL has been copied to your clipboard.
                </Alert>
              )}
            </div>
            <div className="card">
              <div className="card-body">
                <div className="myProfile">
                  <section className="myProfile-left">
                    <div className="myProfile-image-name">
                      <img
                        className="myProfile-img"
                        src={
                          img === null
                            ? File
                            : url + "/images/marketplace/company_logo/" + img
                        }
                        alt=""
                      />
                      <div className="myProfile-name">
                        {" "}
                        <h3>{name}</h3>
                        <p>{companyName}</p>
                      </div>
                    </div>
                    <p>
                      <Location className="myProfile-icons" />
                      {state}
                    </p>
                    <p>
                      <ID className="myProfile-icons" />
                      {companyID}
                    </p>
                    <p>
                      <Global className="myProfile-icons" />
                      {website}
                    </p>
                    <p>
                      {t("account.companyType")}:
                      <span>
                        {" "}
                        {companyType === 1
                          ? lang === "en"
                            ? "Sole proprietor"
                            : "Toiminimiyrittäjä"
                          : companyType === 2
                          ? lang === "en"
                            ? "Pvt Ltd"
                            : "Osakeyhtiö"
                          : companyType === 3
                          ? lang === "en"
                            ? "Freelancer"
                            : "Kevytyrittäjä"
                          : ""}
                      </span>
                    </p>
                    <p>
                      {t("account.taxRegistration")}:{"  "}
                      <span>
                        {tax === 0
                          ? lang === "en"
                            ? "No"
                            : "ei"
                          : tax === 1
                          ? lang === "en"
                            ? "Yes"
                            : "Joo"
                          : ""}
                      </span>
                    </p>
                    <p>
                      {t("account.businessInsurance")}:{" "}
                      <span>
                        {business === 0
                          ? lang === "en"
                            ? "No"
                            : "ei"
                          : business === 1
                          ? lang === "en"
                            ? "Yes"
                            : "Joo"
                          : ""}
                      </span>
                    </p>
                    <p>
                      {t("account.constructionLicenses")}:
                      <span>
                        {savedConstruction &&
                          savedConstruction?.map((construct) => (
                            <p key={construct.id}>{construct.licenses}</p>
                          ))}
                      </span>
                    </p>
                    <p>
                      {t("account.availability")}:{" "}
                      <span>
                        {" "}
                        {availability === 1
                          ? lang === "en"
                            ? "More than 30hrs/week"
                            : "Enemmän kuin 30h/vk"
                          : availability === 2
                          ? lang === "en"
                            ? "Less than 30 hrs/week"
                            : "Vähemmän kuin 30h/vk"
                          : availability === 3
                          ? lang === "en"
                            ? "As needed - open to offers"
                            : "Tarpeen mukaan"
                          : lang === "en"
                          ? "None"
                          : "Ei mikään näistä"}
                      </span>
                    </p>
                  </section>
                  <section className="myProfile-right">
                    <div className="myProfile-chat">
                      {/* <button>{t('account.inviteChat')}</button> */}
                      {visibility === 1 ? (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${base_url}/public-profile/${usernameURL}/${profileURL}`
                            );
                            setAlert(true);
                            setTimeout(() => {
                              setAlert(false);
                            }, 3000);
                          }}
                        >
                          {t("account.shareProfile")}
                        </button>
                      ) : (
                        ""
                      )}
                      {/* {<button onClick={() => getProfileURL()}>Share profile</button>} */}
                    </div>
                    <p className="myProfile-intro">{introduction}</p>

                    <div className="myProfile-skills">
                      <h3> {t("account.skillsAndInterests")}</h3>
                      <ul>
                        {skills &&
                          skills.map((skill) => (
                            <li key={skill.id}>{skill.skills_identifier}</li>
                          ))}
                      </ul>
                    </div>

                    <div className="myProfile-skills">
                      <h3>{t("account.workLocation")}</h3>
                      <ul>
                        {city &&
                          city.map((c) => (
                            <li key={c.id}>{c.city_identifier}</li>
                          ))}
                      </ul>
                    </div>
                  </section>
                </div>
                {workHistoryData?.length && (
                  <section>
                    <h2 className="mt-5 mb-4">{t("account.work_history")}</h2>
                    <div className="row">
                      {workHistoryData.map((data, index) => {
                        return (
                          <div className="col-12 col-md-3">
                            <div className="d-flex mb-4 myAcc-work-history-section">
                              <img
                                src={`${url}/images/marketplace/work-history/${data.image}`}
                              />
                            </div>
                            <p className="myAcc-work-history-section-p">
                              {data.title}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}
                <section className="feedback">
                  <div className="container-fluid" style={{ padding: "0px" }}>
                    <h2 className="mt-5 mb-4">{t("account.feedback")}</h2>
                    <div className="card">
                      <div className="card-body" style={{ padding: "0px" }}>
                        <div className="row" style={{ margin: "0px" }}>
                          {feedback?.map((feed) => {
                            const {
                              id,
                              closing_reason,
                              message_to_contractor,
                              rating,
                              sender_first_name,
                              sender_last_name,
                              created_at,
                            } = feed;
                            return (
                              <div
                                className="col-12"
                                style={{
                                  padding: "1.5rem 0px",
                                  borderBottom: "1px solid lightgray",
                                }}
                                key={id}
                              >
                                <h4>{closing_reason}</h4>
                                <p>{message_to_contractor}</p>
                                <p>{dateFunc(created_at, lang)}</p>
                                <div className="rate-container">
                                  <div className="rating-stars">
                                    {createStars(rating)}
                                  </div>
                                  <div className="rate-number">{rating}/5</div>
                                </div>
                                <h5 className="sender-name">
                                  {sender_first_name} {sender_last_name}
                                </h5>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withTranslation()(Myprofile);
