import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { url } from "../../../helper/helper";
import File from "../../../images/file-icon.png";
import { ReactComponent as Global } from "../../../images/global.svg";
import { ReactComponent as ID } from "../../../images/id.svg";
import { ReactComponent as Location } from "../../../images/location.svg";
import Logo from "../../../images/Full-Logo-lighter.png";
import i18n from "../../../locales/i18n";
import FavLogo from "../../../images/favicon-32.png";
import { getData } from "../../../helper/api";
import { createStars } from "../../../helper/starRatings/starRatings";
import "./sharedProfile.css";
import { dateFunc } from "../../../helper/dateFunc/date";
import Header from "../../shared/Header";
import WorkPortfolioModal from "../../myBussiness/modals/WorkPortfolioModal";

const SharedProfile = ({ t }) => {
  const token = localStorage.getItem("token");
  const [img, setImg] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [place, setPlace] = useState("");
  const [companyID, setCompanyID] = useState("");
  const [userID, setUserID] = useState("");
  const [website, setWebiste] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [tax, setTax] = useState("");
  const [business, setBusiness] = useState("");
  const [construction, setConstruction] = useState([]);
  const [constructionList, setConstructionList] = useState("");
  const [savedConstruction, setSavedConstruction] = useState([]);
  const [state, setState] = useState("");
  const [stateId, setStateId] = useState("");
  const [availability, setAvailability] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [skills, setSkills] = useState([]);
  const [city, setCity] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [data, setData] = useState("");
  const [workHistoryData, setWorkHistoryData] = useState([]);
  const [workPortfolioModal, setWorkPortfolioModal] = useState(false);
  const [workPortfolioId, setWorkPortfolioId] = useState("");

  const lang = localStorage.getItem("_lng");

  const login = localStorage.getItem("Login_user_id");

  const { profileURL } = useParams();

  const allData = () => {
    axios
      .get(`${url}/api/user-profile-detail/${profileURL}`)
      .then((res) => {
        setData(res?.data?.data);
        if (res?.data?.profile[0]) {
          const a = res?.data?.profile[0];

          setUserID(a?.user_id);
          setStateId(a?.work_location_state);
          setImg(a?.company_logo);
          setName(a?.full_name);
          setCompanyName(a?.company_name);

          if (a?.avatar_location === null) {
            setPlace("Not available");
          } else setPlace(a?.avatar_location);

          setCompanyID(a?.company_id);

          if (a?.company_website === "null") {
            setWebiste("Not Available");
          } else setWebiste(a?.company_website);

          setTax(a?.tax_registration);

          if (a?.business_insurance === null) {
            setBusiness("Not Available");
          } else setBusiness(a?.business_insurance);

          setCompanyType(a?.company_type);
          var b = a?.licenses?.split(",").map(function (item) {
            return parseInt(item, 6);
          });
          setConstruction(a?.licenses_arr);
          const mapLicenses = a?.licenses_arr?.map((license) => license.id);
          setConstructionList(mapLicenses);
          if(b?.length>0){
            const commonElements = a.licenses_arr?.filter((license) => {
              return b.includes(license.id);
            });
            setSavedConstruction(commonElements);
          }

          //setConstruction(a.construction_licenses);

          setAvailability(a?.availability);

          setIntroduction(a?.introduction);

          setSkills(a?.skills_arr);

          setCity(a?.city_arr);
        }
        if (res?.data?.work_address_states) {
          stateId &&
            res.data.work_address_states.map((state) => {
              if (state.state_id === Number(stateId)) {
                setState(state.state_name);
              }
            });
        }

        if (res?.data?.work_history?.data) {
          userID && setWorkHistoryData(res?.data?.work_history?.data);
        }

        if (res?.data?.review_rating) {
          userID && setFeedback(sortArray(res?.data?.review_rating));
        }
      })
      .catch((err) => {
        console.log(err);
        setData("Profile visibility hidden")
      });
  };
  const getProfileData = () => {
    axios
      .get(`${url}/api/user-profile/${profileURL}`, token)
      .then((res) => {
        setData(res?.data?.data);
        const a = res?.data[0];

        setUserID(a?.user_id);
        setStateId(a?.work_location_state);
        setImg(a.company_logo);
        setName(a.full_name);
        setCompanyName(a.company_name);

        if (a.avatar_location === null) {
          setPlace("Not available");
        } else setPlace(a.avatar_location);

        setCompanyID(a.company_id);

        if (a.company_website === "null") {
          setWebiste("Not Available");
        } else setWebiste(a.company_website);

        setTax(a.tax_registration);

        if (a.business_insurance === null) {
          setBusiness("Not Available");
        } else setBusiness(a.business_insurance);

        setCompanyType(a.company_type);
        var b = a.licenses?.split(",").map(function (item) {
          return parseInt(item, 6);
        });
        setConstruction(a.licenses_arr);
        const mapLicenses = a.licenses_arr?.map((license) => license.id);
        setConstructionList(mapLicenses);
      if(b.length>0){
        const commonElements = a.licenses_arr?.filter((license) => {
          return b.includes(license.id);
        });
        setSavedConstruction(commonElements);
      }


        //setConstruction(a.construction_licenses);

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
    stateId &&
      (await getData(`${url}/api/state/${lang}`, token)
        .then((res) => {
          res.data.data.map((state) => {
            if (state.state_id === Number(stateId)) {
              setState(state.state_name);
            }
          });
        })
        .catch((err) => {
          console.log(err);
        }));
  };

  const getFeedback = async () => {
    userID &&
      (await getData(
        `${url}/api/rating/get_users_review/${userID}`,
        token
      ).then((res) => setFeedback(sortArray(res?.data))));
  };
  const sortArray = (feeds) => {
    return feeds?.reverse(function (a, b) {
      return b - a;
    });
  };

  const getWorkHistory = async () => {
    userID &&
      (await getData(
        `${url}/api/account/get-user-work-history-listing/${userID}`,
        token
      )
        .then((res) => {
          console.log(res?.data);
          if (res?.data) {
            setWorkHistoryData(res?.data?.data);
          }
        })
        .catch((err) => {
          console.log(err);
        }));
  };

  // useEffect(() => {
  //   // getProfileData();
  // }, []);
  useEffect(() => {
    allData();
    // getState();
  }, [stateId]);
  // useEffect(() => {
  //   //   // allData();
  //   //   // getWorkHistory();
  //   //   // getFeedback();
  // }, [userID]);

  return (
    <>
      {token ? (
        <Header />
      ) : (
        <div className="public-profile">
          <div className="profile-header">
            <div className="profile-header-left">
              <Link to="/">
                <img
                  src={Logo}
                  width="155px"
                  alt="Proppu logo"
                  className="desktop-logo"
                />
                <img src={FavLogo} alt="Proppu logo" className="mobile-logo" />
              </Link>
            </div>
            <div className="profile-header-right">
              <a href="https://www.proppu.com/what-is-proppu/" target="_blank">
                {t("login.what_is_proppu")}
              </a>
              <Link to="/">{t("login.login_header")}</Link>
              <Link className="profile-sign-up" to="/register">
                {t("login.sign_up_header")}
              </Link>
            </div>
          </div>
        </div>
      )}
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            {data === "Profile visibility hidden" ? (
              <div className="card">
                <div className="card-body">
                  <h3 style={{ textAlign: "center" }}>
                    The user's profile is private!
                  </h3>
                </div>
              </div>
            ) : (
              ""
            )}
            {data === undefined ? (
              <div className="card shared-profile-main">
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
                          {construction === 1
                            ? "Vedeneristys"
                            : construction === 2
                            ? "Sertifikaatti"
                            : construction === 3
                            ? "Työturvallisuuskortti"
                            : construction === 4
                            ? "Tulityökortti"
                            : construction === 5
                            ? "Valttikortti"
                            : construction === 6
                            ? "Muu koulutus/pätevyys"
                            : "Not Available"}
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
                  {workHistoryData?.length > 0 && (
                    <section>
                      <h2 className="mt-5 mb-4">{t("account.work_history")}</h2>
                      <div className="row">
                        {workHistoryData.map((data, index) => {
                          return (
                            <div
                              key={index}
                              className="col-12 col-md-6 col-lg-4"
                              onClick={() => {
                                setWorkPortfolioModal(true);
                                setWorkPortfolioId(data?.id);
                              }}
                            >
                              <div
                                className="d-flex mb-4 myAcc-work-history-section work-history-img"
                                style={{ cursor: "pointer" }}
                              >
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
                  {feedback?.length && feedback?.length > 0 && (
                    <section className="feedback">
                      <div
                        className="container-fluid"
                        style={{ padding: "0px" }}
                      >
                        <h2 className="mt-5 mb-4">{t("account.feedback")}</h2>
                        <div className="card">
                          <div className="card-body" style={{ padding: "0px" }}>
                            <div className="row" style={{ margin: "0px" }}>
                              {feedback?.map((feed, idx) => {
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
                                    key={idx}
                                  >
                                    <h4>{closing_reason}</h4>
                                    <p>{message_to_contractor}</p>
                                    <p>{dateFunc(created_at, lang)}</p>
                                    <div className="rate-container">
                                      <div className="rating-stars">
                                        {createStars(rating)}
                                      </div>
                                      <div className="rate-number">
                                        {rating}/5
                                      </div>
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
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <WorkPortfolioModal
        id={workPortfolioId}
        userId={userID}
        show={workPortfolioModal}
        handleClose={() => {
          setWorkPortfolioModal(false);
          setWorkPortfolioId("");
        }}
      />
    </>
  );
};

export default withTranslation()(SharedProfile);
