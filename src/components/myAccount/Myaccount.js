import React, { Component } from "react";
import axios from "axios";
import Header from "../shared/Header";
import { Redirect } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import Alert from "react-bootstrap/Alert";
import { base_url, Helper, url, userRole } from "../../helper/helper";
import i18n from "../../locales/i18n";
import { Translation } from "react-i18next";
import File from "../../images/file-icon.png";
// import { notify } from 'react-notify-toast'
import { withTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Files from "react-files";
import { Link } from "react-router-dom";
import Professional from "./professional";
import PaymentDetails from "./PaymentDetails";
import "./Myaccount.css";
import ProfileVisibility from "./profileVisibility";
import { getData, postDataWithToken } from "../../helper/api";
import Phone from "../../helper/phone/phone";
import DeleteModal from "../myBussiness/modals/DeleteModal";
import Membership from "./Membership";
import addWorkSvg from "../../images/addWork.svg";
import WorkHistoryModal from "../myBussiness/modals/WorkHistoryModal";
const defaultState = {
  email: null,
  emailError: null,
};

class Myaccount extends Component {
  state = {
    logo: null,
    logo_preview: null,

    work: "",
    insurance: "",
    succes: "",
    agreement_material_guarantee: "",
    agreement_work_guarantee: "",
    agreement_insurances: "",
    agreement_panelty: "",
    username: "",
    first_name: "",
    last_name: "",
    company_id: "",
    company_website: "",
    address: "",
    email: "",
    phone: "",
    zip: "",
    password: "",
    old_password: "",
    con_password: "",
    lang: localStorage.getItem("_lng"),
    password_err: false,
    con_password_err: false,
    info: [],
    success: Boolean,
    errors: [],
    translated: false,
    defaultState,
    subtype: "",
    userName_error: "",
    userNameStatus: "",
    user_id: "",
    showVisibility: false,
    visibility: "",
    states: "",
    cities: "",
    stateId: localStorage.getItem("state_id"),
    state: "",
    city: "",
    language: "",
    stateSaved: "",
    change: false,
    citySaved: "",
    country_id: "",
    country_code: "",
    package_price: "",
    package_price_terms_period: "",
    package_display_text: "",
    price_packages_country_id: null,
    lang: "",
    isPerviewModal: false,
    workHistoryModal: false,
    workHistoryData: [],
    workHistoryId: "",
    allAccountData: "",
    packageDisplay: "",
    addressCity: "",
    allSkills: "",
  };

  componentDidMount = () => {
    this.loadAllMyAccountData();
    // this.loadData();
    // this.getWorkHistory();
    // this.getState();
    this.selectCountry(this.state.country_id);
    this.getCities(this.state.stateId);
    this.myRef = React.createRef();
  };

  loadAllMyAccountData = async () => {
    const token = await localStorage.getItem("token");
    await getData(
      `${url}/api/my-account-detail`,
      token
    )
      .then((res) => {
        if (res?.data?.skills) {
          const skill = res?.data?.skills;
          this.setState({
            allSkills: skill,
          });
        }
        if (res?.data?.packages_list) {
          const list = res?.data?.packages_list;
          this.setState({
            packageDisplay: list,
          });
        }
        if (res?.data?.work_history?.data) {
          const list = res?.data?.work_history?.data;
          this.setState({
            workHistoryData: list,
          });
        }
        if (res?.data?.work_address_city) {
          const cityAddress = res?.data?.work_address_city;
          this.setState({
            addressCity: cityAddress,
          });
        }
        if (res?.data?.address_states) {
          this.setState({
            states: res?.data?.address_states,
          });
        }
        if (res?.data?.profile[0]) {
          const acc = res?.data?.profile[0];
          localStorage.setItem("state_id", acc.address_state);
          this.setState({
            logo_preview: acc.company_logo,
            user_id: acc.id,
            first_name: acc.first_name,
            last_name: acc.last_name,
            username: acc.username,
            package_price: acc.package_price,
            package_price_terms_period: acc.package_price_terms_period,
            price_packages_country_id: acc.price_packages_country_id,
            company_id: acc.company_id
              ? acc.company_id
              : "_" + Math.random().toString(36).substr(2, 9),
            address: acc.address,
            email: acc.email,
            stateSaved: acc.address_state,
            country_id: acc.address_country,
            //stateId: acc.address_state,
            citySaved: acc.address_city,

            phone: acc.phone,
            zip: acc.zip != "undefined" && acc.zip != "null" ? acc.zip : "",
            company_website:
              acc.company_website == "null" ||
              acc.company_website == "undefined"
                ? ""
                : acc.company_website,
            // company_website: acc.company_website,
            work: acc.work,
            lang: acc.language,
            subtype: acc.subtype,
            insurance: acc.insurance,
            agreement_material_guarantee: acc.agreement_material_guarantee,
            agreement_work_guarantee: acc.agreement_work_guarantee,
            agreement_insurances: acc.agreement_insurances,
            agreement_panelty: acc.agreement_panelty,
            allAccountData: acc,
          });
        }

        // if (res.data) {
        //   this.setState({
        //     workHistoryData: res?.data?.data,
        //   });
        // }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getWorkHistory = async () => {
    const token = await localStorage.getItem("token");
    await getData(
      `${url}/api/account/work-history-listing`,
      token
    )
      .then((res) => {
        console.log(res.data.data, ">>>>>>>>>>>>>");
        if (res.data) {
          this.setState({
            workHistoryData: res?.data?.data,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // loadData = async () => {
  //   const token = await localStorage.getItem("token");
  //   await getData(`${url}/api/account`, token)
  //     .then((result) => {
  //       console.log(result);
  //       if (result.data[0]) {
  //         const acc = result.data[0];
  //         localStorage.setItem("state_id", acc.address_state);
  //         this.setState({
  //           logo_preview: acc.company_logo,
  //           user_id: acc.id,
  //           first_name: acc.first_name,
  //           last_name: acc.last_name,
  //           username: acc.username,
  //           package_price: acc.package_price,
  //           package_price_terms_period: acc.package_price_terms_period,
  //           price_packages_country_id: acc.price_packages_country_id,
  //           company_id: acc.company_id
  //             ? acc.company_id
  //             : "_" + Math.random().toString(36).substr(2, 9),
  //           address: acc.address,
  //           email: acc.email,
  //           stateSaved: acc.address_state,
  //           country_id: acc.address_country,
  //           //stateId: acc.address_state,
  //           citySaved: acc.address_city,

  //           phone: acc.phone,
  //           zip: acc.zip != "undefined" && acc.zip != "null" ? acc.zip : "",
  //           company_website:
  //             acc.company_website == "null" ||
  //             acc.company_website == "undefined"
  //               ? ""
  //               : acc.company_website,
  //           // company_website: acc.company_website,
  //           work: acc.work,
  //           lang: acc.language,
  //           subtype: acc.subtype,
  //           insurance: acc.insurance,
  //           agreement_material_guarantee: acc.agreement_material_guarantee,
  //           agreement_work_guarantee: acc.agreement_work_guarantee,
  //           agreement_insurances: acc.agreement_insurances,
  //           agreement_panelty: acc.agreement_panelty,
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       //console.log("err", err);
  //     });
  // };

  deleteAccount = async () => {
    const token = await localStorage.getItem("token");
    await postDataWithToken(`${url}/api/account/delete`, {}, token).then(
      (res) => {
        if (res.data.success) {
          localStorage.removeItem("token");
          this.props.history.push("/login");
        }
      }
    );
  };

  handlePreviewModal = (e) => {
    e.preventDefault();
    this.setState({ isPerviewModal: !this.state.isPerviewModal });
  };
  handlePreviewWorkHistoryModal = (e) => {
    e.preventDefault();
    this.setState({ workHistoryModal: !this.state.workHistoryModal });
  };
  selectCountry = (id) => {
    if (id === 72) {
      this.setState({
        country_code: "fi",
      });
    } else if (id === 67) {
      this.setState({
        country_code: "ee",
      });
    } else if (id === 195) {
      this.setState({
        country_code: "es",
      });
    }
  };
  //handlers
  // handleChange1 = (event) => {
  //   this.setState({ logo: null });
  //   if (
  //     event.target.files[0].name.split(".").pop() == "jpeg" ||
  //     event.target.files[0].name.split(".").pop() == "png" ||
  //     event.target.files[0].name.split(".").pop() == "jpg" ||
  //     event.target.files[0].name.split(".").pop() == "gif" ||
  //     event.target.files[0].name.split(".").pop() == "svg"
  //   ) {
  //     this.setState({
  //       logo: event.target.files[0],
  //       logo_preview: URL.createObjectURL(event.target.files[0]),
  //     });
  //   } else {
  //     this.setState({ logo: null });
  //     alert("File type not supported");
  //   }
  // };

  handleState = (event) => {
    this.setState({
      state: event.target.value,
      change: true,
    });
  };

  // getState = async () => {
  //   const token = await localStorage.getItem("token");
  //   const lan = await localStorage.getItem("_lng");
  //   await getData(`${url}/api/state/${lan}`, token)
  //     .then((res) => {
  //       this.setState({ states: res?.data?.data });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  onFilesChange = (files) => {
    // //console.log(files);
    if (files[0]) {
      this.setState({
        logo: files[0],
        logo_preview: URL.createObjectURL(files[0]),
        loaded1: 50,
        file_err: "",
        img_name: files[0].name,
      });
      if (this.state.loaded1 <= 100) {
        setTimeout(
          function () {
            this.setState({ loaded1: 100 });
          }.bind(this),
          2000
        ); // wait 2 seconds, then reset to false
      }
    }
  };

  onFilesError = (error, file) => {
    //console.log(file, 'error code ' + error.code + ': ' + error.message)
    this.setState({
      file_err: error.message,
      img_name: "",
    });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  handlePwd = async (event) => {
    event.preventDefault();
    if (this.state.password == "" || this.state.old_password == "") {
      this.setState({ password_err: true });
    }
    if (this.state.con_password === this.state.password) {
      const data = new FormData();
      data.set("password", this.state.password);
      data.set("old_password", this.state.old_password);

      const token = await localStorage.getItem("token");
      await postDataWithToken(`${url}/api/storePwd`, data, token)
        .then((result) => {
          this.setState({ success: true, password_err: false });
          this.myRef.current.scrollTo(0, 0);
        })
        .catch((err) => {
          //console.log(err.response);
          this.setState({ success: false });
          this.myRef.current.scrollTo(0, 0);
        });
    } else {
      this.setState({
        con_password_err: true,
      });
    }

    // Display the key/value pairs
    // for (var pair of data.entries()) {
    //   //console.log(pair[0] + ", " + pair[1]);
    // }
  };
  handleSubmit = async (event) => {
    // if (this.state.password == "" || this.state.old_password == "") {
    //   this.setState({ password_err: true });
    // }

    event.preventDefault();
    const data = new FormData();
    // if (this.state.logo !== null) {
    data.set("company_logo", this.state.logo);
    // }
    data.set("first_name", this.state.first_name);
    data.set("last_name", this.state.last_name);
    data.set("address", this.state.address);
    // data.set("email", this.state.email);
    data.set("phone", this.state.phone);
    data.set("zip", this.state.zip);
    data.set("company_id", this.state.company_id);
    data.set("company_website", this.state.company_website);
    data.set("lang", this.state.lang);
    data.set("username", this.state.username);
    data.set("address_state", this.state.state);
    data.set("address_city", this.state.city);
    // data.set("password", this.state.password);
    // data.set("old_password", this.state.old_password);

    const token = await localStorage.getItem("token");
    await postDataWithToken(`${url}/api/storeDetails`, data, token)
      .then((result) => {
        this.setState({ success: true, password_err: false });
        this.myRef.current.scrollTo(0, 0);
      })
      .catch((err) => {
        //console.log(err.response);
        // Object.entries(err.response.data.error).map(([key, value]) => {
        // this.setState({ errors: err.response.data.error });
        // })
        // this.setState({ success: false });
        this.myRef.current.scrollTo(0, 0);
      });

    // Display the key/value pairs
    for (var pair of data.entries()) {
      //console.log(pair[0] + ", " + pair[1]);
    }
  };

  handlePropDetails = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.set("work", this.state.work);
    data.set("insurance", this.state.insurance);
    // insurance
    const token = await localStorage.getItem("token");
    await postDataWithToken(`${url}/api/storePropDetails`, data, token)
      .then((result) => {
        this.setState({ success: true });
        this.myRef.current.scrollTo(0, 0);
      })
      .catch((err) => {
        //console.log(err.response);
        this.setState({ errors: "fields required", success: false });
        this.myRef.current.scrollTo(0, 0);
      });
  };

  handleAgreeDetails = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.set("agreement_work_guarantee", this.state.agreement_work_guarantee);
    data.set(
      "agreement_material_guarantee",
      this.state.agreement_material_guarantee
    );
    data.set("agreement_insurances", this.state.agreement_insurances);
    data.set("agreement_panelty", this.state.agreement_panelty);

    const token = await localStorage.getItem("token");
    await postDataWithToken(`${url}/api/storeAgreeDetails`, data, token)
      .then((result) => {
        this.setState({ success: true });
        this.myRef.current.scrollTo(0, 0);
      })
      .catch((err) => {
        //console.log(err.response);
        this.setState({ errors: "fields required", success: false });
        this.myRef.current.scrollTo(0, 0);
      });
  };

  changeLanguage = async (event) => {
    const token = localStorage.getItem("token");
    const { name, value } = event.target;

    const formData = new FormData();
    formData.append("user_id", this.state.user_id);
    formData.append("language_code", value);

    const data = await postDataWithToken(
      `${url}/api/update_language`,
      formData,
      token
    );
    console.log(data?.data?.status, ">>>>>>>>>>>");
    if (data?.data?.status) {
      localStorage.setItem("_lng", value);
      i18n.changeLanguage(value);
    }

    // window.location.reload()
    this.setState({ translated: true, lang: value });
    this.myRef.current.scrollTo(0, 0);
  };

  handleChangeEmail = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  validate() {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!this.state.email || reg.test(this.state.email) === false) {
      this.setState({ emailError: "Email Field is Invalid" });
      return false;
    }
    return true;
  }

  getUserName = async (e) => {
    this.setState({ username: e.target.value });
    if (!e.target.value) {
      this.setState({ userNameStatus: "" });
    }
    if (e.target.value) {
      await getData(`${url}/api/check_username?username=${e.target.value}`, {})
        .then((result) => {
          this.setState({
            userNameStatus: result.data.status,
            userName_error: "",
          });
        })
        .catch((err) => {
          //console.log(err, '---------', err.response?.data?.status);
          if (err.response?.data) {
            this.setState({
              userNameStatus: err.response?.data?.status,
            });
          }
        });
    }
  };

  getUser = (userNameStatus) => {
    // const { userNameStatus}=this.state;
    if (userNameStatus === true) {
      return "3px solid green";
    } else if (userNameStatus === false) {
      return "3px solid red";
    } else {
      return "2px solid black";
    }
  };

  emailSubmit = (e) => {
    e.preventDefault();
    // if (this.validate()) {
    //   //console.log(this.state.email);
    //   this.setState(defaultState);
    //   // notify.show("please check you email")
    // }

    var myHeaders = new Headers();
    const token = localStorage.getItem("token");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append("email", this.state.email);
    formdata.append("token", localStorage.getItem("token"));

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`${url}/api/email_update`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        //console.log("result=====" , result);
        if (result.message) {
          this.setState({ succes: result.message });
        }
      })
      .catch((error) => console.log("error", error));
  };

  phn_number = (value) => {
    // const { name, value } = event.target;
    console.log(value);
    this.setState({ phone: value });
  };

  closeVisibilityModal = () => {
    this.setState({ ...this.state, showVisibility: false });
  };

  setVisibility = (id) => {
    this.setState({ ...this.state, visibility: id });
  };

  handleCity = (event) => {
    this.setState({
      city: event.target.value,
      change: true,
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.state !== this.state.state) {
      this.getCities(this.state.state);
    }
    if (prevState.stateSaved !== this.state.stateSaved) {
      this.getCities(this.state.stateSaved);
    }
    if (prevState.cities === undefined) {
      this.getCities(Number(this.state.stateId));
    }
  };
  getCities = async (id) => {
    const token = await localStorage.getItem("token");
    if (id && this.state.lang) {
      console.log("Chalaaaaaa");
      await getData(`${url}/api/cityId/${id}/${this.state.lang}`, token)
        .then((result) => {
          this.setState({
            cities: result?.data.data,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  render() {
    const { t, i18n } = this.props;
    console.log(this.state.price_packages_country_id, this.state.package_price);
    let alert;
    if (this.state.success === false) {
      alert = (
        <Alert variant="danger" style={{ fontSize: "13px", zIndex: 1 }}>
          {"Passwords don't match"}
        </Alert>
      );
    }
    if (this.state.success === true) {
      alert = (
        <Alert variant="success" style={{ fontSize: "13px" }}>
          <label htmlFor="panelty-terms">
            {t("myagreement.Successfully_Updated")}
          </label>
        </Alert>
      );
    }
    if (this.state.translated === true) {
      alert = (
        <Alert variant="success" style={{ fontSize: "13px" }}>
          <label htmlFor="panelty-terms">
            {t("myagreement.Translation_successful")}
          </label>
        </Alert>
      );
    }
    return (
      <div>
        {/* <Header active={'market'} /> */}
        <div className="sidebar-toggle"></div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              {/* <label htmlFor="panelty-terms">
                {t("myagreement.Marketplace")}
              </label> */}
              <Link
                to="/index"
                className="breadcrumb-item active"
                aria-current="page"
              >
                {t("header.marketplace")}
              </Link>
            </li>

            <li className="breadcrumb-item active" aria-current="page">
              {t("account.title")}
            </li>
          </ol>
        </nav>
        <div className="main-content">
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div ref={this.myRef} className="page-content">
            {alert ? alert : null}

            <div className="container-fluid ">
              <div className="myAcc-title">
                <h3 className="head3">{t("account.title")}</h3>
                <div className="myAcc-profile">
                  {this.state.showVisibility ? (
                    <ProfileVisibility
                      close={this.closeVisibilityModal}
                      id={this.state.visibility}
                    />
                  ) : (
                    ""
                  )}

                  <Link className="head3" to="/myprofile">
                    {t("account.viewMyPublicProfile")}
                  </Link>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      this.setState({ ...this.state, showVisibility: true })
                    }
                  >
                    {t("account.profileVisibility")}
                  </button>
                </div>
              </div>

              <div className="card">
                <form onSubmit={this.handleSubmit}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <div className="form-group account_pic">
                          <div className="file-select file-sel inline">
                            {/* <input
                          onChange={this.handleChange1}
                          type="file"
                          id="attachment1"
                        /> */}
                            <Files
                              className="files-dropzone"
                              onChange={(e) => this.onFilesChange(e)}
                              onError={(e) => this.onFilesError(e)}
                              accepts={[
                                "image/gif",
                                "image/jpeg",
                                "image/png",
                                "image/jpg",
                                ".svg",
                              ]}
                              multiple={false}
                              // maxFileSize={2145757}
                              minFileSize={10}
                              clickable
                            >
                              <div
                                className="selected-img"
                                style={{
                                  display: "none",
                                }}
                              >
                                <img src={this.state.logo_preview} alt="" />
                                {/* <span>  {t("account.remove")} </span> */}
                              </div>
                              <label htmlFor="attachment1">
                                <img
                                  style={{ width: "150px", height: "150px" }}
                                  src={
                                    this.state.logo_preview === null
                                      ? File
                                      : url +
                                        "/images/marketplace/company_logo/" +
                                        this.state.logo_preview
                                  }
                                  alt=""
                                />
                                <span className="status">
                                  {userRole === "company"
                                    ? t("account.company_logo")
                                    : t("account.company_logo1")}
                                </span>
                              </label>
                            </Files>
                            <p
                              style={{
                                color: this.state.img_name
                                  ? "black"
                                  : "#eb516d",
                                fontSize: "15px",
                              }}
                            >
                              {this.state.file_err ? this.state.file_err : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6"></div>
                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label htmlFor="first_name">
                            {t("account.first_name")}
                          </label>

                          <input
                            onChange={this.handleChange}
                            id="first_name"
                            name="first_name"
                            className="form-control"
                            type="text"
                            required
                            value={this.state.first_name}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label htmlFor="first_name">
                            {t("account.last_name")}
                          </label>

                          <input
                            name="last_name"
                            value={this.state.last_name}
                            onChange={this.handleChange}
                            id="last_name"
                            required
                            className="form-control"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label htmlFor="first_name">
                            {t("account.address")}
                          </label>

                          <input
                            onChange={this.handleChange}
                            id="street1"
                            name="address"
                            className="form-control"
                            type="text"
                            required
                            value={this.state.address}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label htmlFor="zip">{t("account.zip")}</label>
                          <input
                            name="zip"
                            onChange={this.handleChange}
                            id="zip"
                            required
                            value={this.state.zip}
                            className="form-control"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label htmlFor="first_name">
                            {t("account.state")}
                          </label>

                          <select
                            onChange={this.handleState}
                            value={
                              !this.state.change
                                ? this.state.stateSaved
                                : this.state.state
                            }
                            name="state"
                          >
                            <option>{t("account.professional.select")}</option>
                            {this.state.states &&
                              this.state.states?.map((state) => {
                                return (
                                  <option
                                    key={state.state_id}
                                    value={state.state_id}
                                  >
                                    {state.state_name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label htmlFor="first_name">
                            {t("account.city")}
                          </label>
                          <select
                            onChange={this.handleCity}
                            value={
                              !this.state.change
                                ? this.state.citySaved
                                : this.state.city
                            }
                            name="city"
                          >
                            <option>{t("account.professional.select")}</option>
                            {this.state.cities &&
                              this.state.cities?.map((city) => {
                                return (
                                  <option
                                    key={city.city_id}
                                    value={city.city_id}
                                  >
                                    {city.city_identifier}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>

                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label htmlFor="phone">{t("account.phone")}</label>
                          {/* <Phone
                            country={this.state.country_id}
                            onChange={(e) => this.phn_number(e)}
                            phone={this.state.phone}
                          /> */}
                          <PhoneInput
                            country={this.state.country_code}
                            // inputProps={{
                            //   name: 'phone',
                            //   required: true,
                            //   // autoFocus: true
                            // }}
                            // enableAreaCodes={true}
                            // countryCodeEditable={false}
                            onChange={(e) => this.phn_number(e)}
                            value={this.state.phone ? this.state.phone : ""}
                          />
                        </div>

                        {/* <input
                            name="phone"
                            value={this.state.phone}
                            onChange={this.handleChange}
                            id="phone"
                            className="form-control"
                            type="text"
                          /> */}
                      </div>

                      {/* <div className="col-xl-4 col-lg-5 col-md-6 offset-xl-1">
                        <div className="form-group">
                          <Translation>
                            {(t) => (
                              <label htmlFor="email">{t("account.email")}</label>
                            )}
                          </Translation>
                          <input
                            name="email"
                            onChange={this.handleChange}
                            id="email"
                            value={this.state.email}
                            className="form-control"
                            type="text"
                          />
                        </div>
                      </div> */}
                      {localStorage.getItem("Login_user_role") !==
                      "consumer" ? (
                        <>
                          <div className="col-12 col-md-6">
                            <div className="form-group">
                              <label htmlFor="company_id">
                                {" "}
                                {t("account.Customer_ID")}{" "}
                              </label>
                              <input
                                name="company_id"
                                onChange={this.handleChange}
                                id="company_id"
                                value={this.state.company_id}
                                className="form-control"
                                type="text"
                                // disabled="disabled"
                              />
                            </div>
                          </div>

                          <div className="col-12 col-md-6">
                            <div className="form-group">
                              <label htmlFor="company_website">
                                {" "}
                                {t("account.Customer_Website")}{" "}
                              </label>
                              <input
                                name="company_website"
                                onChange={this.handleChange}
                                id="company_website"
                                value={this.state.company_website}
                                className="form-control"
                                type="url"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        ""
                      )}

                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label htmlFor="language">
                            {t("account.language")}
                          </label>

                          <select
                            value={localStorage.getItem("_lng")}
                            onChange={this.changeLanguage}
                            name="language"
                            id="language"
                            className="form-control"
                          >
                            <option value="en">{t("account.EN")} </option>
                            <option value="fi">{t("account.FI")} </option>
                            <option value="es">{t("ES")}</option>
                            <option value="est">{t("EST")} </option>
                          </select>
                          {/* <input name="language" onChange={this.handleChange}
                            id="language" placeholder="Enter current password"
                            className="form-control"
                            type="password"
                          /> */}
                        </div>
                      </div>

                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label htmlFor="first_name">
                            {localStorage.getItem("Login_user_role") ===
                            "consumer"
                              ? t("account.username")
                              : t("account.companyname")}
                          </label>

                          <input
                            onChange={this.handleChange}
                            id="first_name"
                            required
                            name="username"
                            className="form-control"
                            type="text"
                            value={this.state.username}
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <button className="btn btn-success">
                          {t("account.saveChanges")}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Professional */}

            <div className="container-fluid">
              <h3 className="head3">{t("account.professionalDetail")}</h3>
              <Professional
                visibility={(id) => this.setVisibility(id)}
                allAccountData={this.state.allAccountData}
                addressCity={this.state.addressCity}
                allSkills={this.state.allSkills}
              />
            </div>

            {/*Work history */}
            <div className="container-fluid">
              <h3 className="head3">{t("account.work_history")}</h3>
              <div className="card">
                <div className="card-body">
                  <div className="row myAcc-work-cards">
                    <div className="col-12 col-md-3">
                      <div
                        className="d-flex mb-5 myAcc-work-history-section-cursor"
                        onClick={(e) => this.handlePreviewWorkHistoryModal(e)}
                      >
                        <img src={addWorkSvg} width={43} height={43} />
                        <p className="myAcc-work-history-section-p">
                          {t("account.work_history_addNew")}
                        </p>
                      </div>
                    </div>
                    {this.state.workHistoryData?.map((data, index) => {
                      return (
                        <div
                          onClick={(e) => {
                            this.handlePreviewWorkHistoryModal(e);
                            this.setState({ workHistoryId: data?.id });
                          }}
                          className="col-12 col-md-3"
                        >
                          <div className="d-flex myAcc-work-history-section-cursor">
                            <img
                              className="myAcc-work-history-img"
                              src={`${url}/images/marketplace/work-history/${data?.image}`}
                            />
                          </div>
                          <p className="myAcc-work-history-section-p">
                            {data.title}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            {/* Payment details */}
            <div className="container-fluid">
              <h3 className="head3">{t("account.payment_details")}</h3>
              <PaymentDetails />
            </div>
            {this.state.country_id !== 195 ? (
              <div className="container-fluid" id="membership">
                <h3 className="head3">{t("account.account_membership")}</h3>
                <Membership
                  price={this.state.package_price}
                  period={this.state.package_price_terms_period}
                  lang={this.state.lang}
                  subtype={this.state.subtype}
                  address={this.state.country_id}
                  price_packages_country_id={
                    this.state.price_packages_country_id
                  }
                  packageDisplay={this.state.packageDisplay}
                />
              </div>
            ) : (
              ""
            )}

            {/* Update Password & email*/}
            <div className="container-fluid">
              <h3 className="head3">{t("account.passwordAndEmail")}</h3>

              <div className="card">
                <div className="card-body">
                  <form onSubmit={this.handlePwd}>
                    <div className="row">
                      <div className="col-12">
                        <h3 className="head3">
                          {t("account.changeYourPassword")}
                        </h3>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label htmlFor="password">
                            {t("account.old_password")}
                          </label>
                          <input
                            name="old_password"
                            onChange={this.handleChange}
                            id="password"
                            placeholder={t("account.Enter_current")}
                            className="form-control"
                            type="password"
                            required
                          />
                          <p style={{ color: "#eb516d " }}>
                            {this.state.password_err === true
                              ? "Password is required"
                              : null}
                          </p>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label htmlFor="password">
                            {t("account.password")}
                          </label>
                          <input
                            name="password"
                            onChange={this.handleChange}
                            id="password"
                            placeholder={t("account.Enter_new")}
                            className="form-control"
                            type="password"
                            required
                          />
                          <p style={{ color: "#eb516d " }}>
                            {this.state.password_err === true
                              ? "Password is required"
                              : null}
                          </p>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label htmlFor="password">
                            {t("account.con_password")}
                          </label>
                          <input
                            name="con_password"
                            onChange={this.handleChange}
                            // id="conferm_pass"
                            placeholder={t("account.con_password")}
                            // placeholder="Confirm password"
                            className="form-control"
                            type="password"
                            required
                          />
                          <p style={{ color: "#eb516d " }}>
                            {this.state.con_password_err === true
                              ? t("account.con_pass_err")
                              : null}
                          </p>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group">
                          <button className="btn btn-success">
                            {t("account.saveChanges")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  <form onSubmit={this.emailSubmit}>
                    <div className="row">
                      <div className="col-12">
                        <h3 className="head3">
                          {t("account.updateYourEmail")}
                        </h3>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label htmlFor="email">{t("account.email")}</label>
                          <input
                            name="email"
                            onChange={this.handleChangeEmail}
                            id="email"
                            value={this.state.email}
                            className="form-control"
                            type="text"
                            disabled="disabled"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <button type="submit" className="btn btn-success">
                            {t("account.Email_verification")}
                          </button>
                        </div>
                      </div>
                      <span className="text-danger">
                        {this.state.emailError}
                      </span>
                      <span className="text-succes">{this.state.succes}</span>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Proposal Details */}
            {userRole !== "consumer" ? (
              <>
                <div className="container-fluid">
                  <h3 className="head3">{t("account.proposal_guarantee")}</h3>

                  <div className="card">
                    <form onSubmit={this.handlePropDetails}>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-12 col-md-6">
                            <div className="form-group">
                              <label htmlFor="work">
                                {t("account.guarantees_for_work")}
                              </label>
                              <textarea
                                maxLength="162"
                                id="work"
                                onChange={this.handleChange}
                                name="work"
                                value={this.state.work}
                                className="form-control"
                                required
                              ></textarea>
                            </div>
                          </div>
                          <div className="col-12 col-md-6">
                            <div className="form-group">
                              <label htmlFor="insurance">
                                {t("account.insurance")}
                              </label>
                              <textarea
                                maxLength="162"
                                id="insurance"
                                onChange={this.handleChange}
                                name="insurance"
                                value={this.state.insurance}
                                className="form-control"
                                required
                              ></textarea>
                            </div>
                          </div>
                          <div className="col-12">
                            <button className="btn btn-success">
                              {t("account.saveChanges")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Agreement Details */}
                <div className="container-fluid">
                  <h3 className="head3">{t("account.agreement_guarantee")}</h3>
                  <div className="card">
                    <form onSubmit={this.handleAgreeDetails}>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-12 col-md-6">
                            <div className="form-group">
                              <label htmlFor="materials">
                                {t("account.materials_quarantees")}{" "}
                              </label>
                              <textarea
                                value={this.state.agreement_material_guarantee}
                                onChange={this.handleChange}
                                name="agreement_material_guarantee"
                                style={{ height: "70px" }}
                                id="materials"
                                className="form-control"
                                required
                              ></textarea>
                            </div>
                          </div>
                          <div className="col-12 col-md-6">
                            <div className="form-group">
                              <label htmlFor="work-quarantees">
                                {t("account.work_quarantees")}
                              </label>
                              <textarea
                                value={this.state.agreement_work_guarantee}
                                onChange={this.handleChange}
                                name="agreement_work_guarantee"
                                style={{ height: "70px" }}
                                id="work-quarantees"
                                className="form-control"
                                required
                              ></textarea>
                            </div>
                          </div>
                          <div className="col-12 col-md-6">
                            <div className="form-group">
                              <label htmlFor="agreement-insurances">
                                {t("account.agreement_insurances")}
                              </label>
                              <textarea
                                value={this.state.agreement_insurances}
                                onChange={this.handleChange}
                                name="agreement_insurances"
                                style={{ height: "70px" }}
                                id="agreement_insurances"
                                className="form-control"
                                required
                              ></textarea>
                            </div>
                          </div>
                          <div className="col-12 col-md-6">
                            <div className="form-group">
                              <label htmlFor="panelty-terms">
                                {t("account.panelty_terms")}
                              </label>
                              <textarea
                                value={this.state.agreement_panelty}
                                onChange={this.handleChange}
                                name="agreement_panelty"
                                style={{ height: "70px" }}
                                id="panelty-terms"
                                className="form-control"
                                required
                              ></textarea>
                            </div>
                          </div>
                          <div className="col-12">
                            <button className="btn btn-success">
                              {t("account.saveChanges")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>

                  <DeleteModal
                    deleteAccount={this.deleteAccount}
                    show={this.state.isPerviewModal}
                    handleClose={() => this.setState({ isPerviewModal: false })}
                  />
                </div>
              </>
            ) : (
              ""
            )}
            <div className="container-fluid">
              <h3 className="head3">{t("account.manage-account")}</h3>
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-12">
                      <button
                        className="btn btn-danger "
                        // data-toggle='modal'
                        // data-target='#delete-modal'
                        onClick={(e) => this.handlePreviewModal(e)}
                      >
                        {" "}
                        {t("account.deleteAccount")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <WorkHistoryModal
          id={this.state.workHistoryId}
          show={this.state.workHistoryModal}
          handleClose={() =>
            this.setState({ workHistoryModal: false, workHistoryId: "" })
          }
          getWorkHistory={this.getWorkHistory}
        />
      </div>
    );
  }
}

export default withTranslation()(Myaccount);
