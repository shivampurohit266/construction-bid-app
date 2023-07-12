import React, { useEffect, useState } from "react";
import Header from "../shared/Header";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import { url, urlPDF } from "../../helper/helper";
import axios from "axios";
import { useParams } from "react-router-dom";
import File from "../../images/file-icon.png";
import { ReactComponent as Global } from "../../images/global.svg";
import { ReactComponent as ID } from "../../images/id.svg";
import { ReactComponent as Location } from "../../images/location.svg";
import { createStars } from "../../helper/starRatings/starRatings";
import Alert from "react-bootstrap/Alert";
import { getData } from "../../helper/api";
import { dateFunc } from "../../helper/dateFunc/date";
import WorkPortfolioModal from "../myBussiness/modals/WorkPortfolioModal";
//import './Myprofile.css';

const BidersProfile = ({ t, location }) => {
  const params = useParams();

  const [img, setImg] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [place, setPlace] = useState("");
  const [companyID, setCompanyID] = useState("");
  const [website, setWebiste] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [tax, setTax] = useState("");
  const [business, setBusiness] = useState("");
  const [construction, setConstruction] = useState("");
  const [availability, setAvailability] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [skills, setSkills] = useState([]);
  const [city, setCity] = useState([]);
  const [profileURL, setProfileURL] = useState("");
  const [usernameURL, setUsernameURL] = useState("");
  const [alert, setAlert] = useState(false);
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [stateID, setStateID] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState("");
  const [workHistoryData, setWorkHistoryData] = useState([]);
  const [workPortfolioId, setWorkPortfolioId] = useState("");
  const [workPortfolioModal, setWorkPortfolioModal] = useState(false);

  const stateId = localStorage.getItem("state_id");
  const token = localStorage.getItem("token");
  const lang = localStorage.getItem("_lng");
  const getProfileData = async () => {
    await getData(`${url}/api/user-profile-detail/${params.id}`, token)
      .then((res) => {
        console.log(res?.data,"??????");
        setData(res?.data);
        if(res?.data?.profile[0]){
        const a = res?.data?.profile[0];

        setImg(a.company_logo);
        setName(a.full_name);
        setCompanyName(a.company_name);
        setPhone(a.phone);
        setProfileURL(a.profile_url_code);
        setUsernameURL(a.username);
        setStateID(a.work_location_state);
        setUserId(a?.user_id);
        if (a.avatar_location === null) {
          setPlace("Not available");
        } else setPlace(a.avatar_location);

        setCompanyID(a.company_id);

        if (a.company_website === null) {
          setWebiste("Not Available");
        } else setWebiste(a.company_website);

        setTax(a.tax_registration);

        if (a.business_insurance === null) {
          setBusiness(t("account.NotAvailable"));
        } else setBusiness(a.business_insurance);

        setCompanyType(a.company_type);

        setConstruction(a.construction_licenses);

        setAvailability(a.availability);

        setIntroduction(a.introduction);

        setSkills(a.skills_arr);

        setCity(a.city_arr);
      }
      if(res?.data?.work_history?.data) {
        setWorkHistoryData(res?.data?.work_history?.data);
      }
      if(res?.data?.review_rating){
        setFeedback(sortArray(res?.data?.review_rating))
        }
      })
      .catch((err) => {
        console.log(err,"???");
      });
  };
  // console.log(stateID,"????");
  const getState = async () => {
    await getData(`${url}/api/state/${lang}`, token)
      .then((res) => {
        res.data.data.map((state) => {
          if (state.state_id === stateID) {
            setState(state.state_name);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getWorkHistory = async () => {
    if(userId){
    await getData(
      `${url}/api/account/get-user-work-history-listing/${userId}`,
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
    }
  };
  const getFeedback = async () => {
    if(userId){
    await getData(`${url}/api/rating/get_users_review/${userId}`, token).then((res) =>{
      if(res?.data){
      setFeedback(sortArray(res.data))
      }
    }
    );
    }
  };
  const sortArray = (feeds) => {
    return feeds?.reverse(function (a, b) {
      return b - a;
    });
  };

  useEffect(() => {
    getProfileData();
    getState();
  }, []);
  useEffect(() => {
    // getWorkHistory();
    // getFeedback();
  }, [userId]);
  console.log(data);
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
              <Link to="/myaccount">
                {" "}
                <h3>{t("account.Profile")}</h3>
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
            {data === undefined ? (
              <div className="card">
                <div className="card-body">
                  <h3 style={{ textAlign: "center" }}>
                    {t("account.privateProfile")}
                  </h3>
                </div>
              </div>
            ) : (
              ""
            )}
            {data ? (
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
                        {availability === 2 ? (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `${url}/profile/${usernameURL}/${profileURL}`
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
                  {workHistoryData?.length > 0  && (
                    <section>
                      <h2 className="mt-5 mb-4">Work history/Portfolio</h2>
                      <div className="row">
                        {workHistoryData.map((data, index) => {
                          return (
                            <div
                            key={index}
                              onClick={() => {
                                setWorkPortfolioModal(true);
                                setWorkPortfolioId(data?.id);
                              }}
                              className="col-12 col-md-3"
                            >
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
                  {feedback?.length > 0 &&
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
}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      {/* <div className='modal-header'>
                <button
                  id='close'
                  type='button'
                  className='close'
                  data-dismiss='modal'
                  aria-label='Close'
                  onClick={(e) => this.remover(e)}
                >
                  <span aria-hidden='true'>× </span>
                </button>
              </div> */}

      <WorkPortfolioModal
        id={workPortfolioId}
        userId={userId}
        show={workPortfolioModal}
        handleClose={() => {
          setWorkPortfolioModal(false);
          setWorkPortfolioId("");
        }}
      />
    </>
  );
};

export default withTranslation()(BidersProfile);
