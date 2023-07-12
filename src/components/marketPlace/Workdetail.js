import React, { Component } from "react";
import axios from "axios";
import Header from "../shared/Header";
import Sidebar from "../shared/Sidebar";
import { Helper, url } from "../../helper/helper";

import Alert from "react-bootstrap/Alert";
import Decline from "./listingdetails/Modals/Decline";
import ProgressBar from "react-bootstrap/ProgressBar";
import { withTranslation } from "react-i18next";
import Image from "../../images/DefaultImg.png";
import Info from "../../images/carbon_information.png";
import Spinner from "react-bootstrap/Spinner";
import Files from "react-files";
import SweetAlert from "react-bootstrap-sweetalert";
import { Link } from "react-router-dom";
import Carousel from "./Carousel/Carousel";
import Breadcrumb from "../shared/Breadcrumb";
import moment from "moment";
import { deleteData, getData, postDataWithToken } from "../../helper/api";
import "./workdetail.css";
const rx_live = /^[+-]?\d*(?:[.,]\d*)?$/;
const letters = /^[A-Za-z ]+$/;
class Workdetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
      slider: [],
      imgs: [],
      active: null,
      tb_quote: "",
      tb_description: null,
      tb_quantity: 0.0,
      isChecked: false,
      tb_city_id: 0,
      tb_delivery_type: "Road",
      tb_delivery_charges: 0.0,
      tb_warrenty: 0,
      tb_warrenty_type: "Days",
      attachment: null,
      featured_image: null,
      img_preview: null,
      loaded1: 0,
      loaded: 0,
      errors: [],
      show_errors: false,
      show_msg: false,
      saved: [],
      refresh: false,
      agree_team_err: false,
      left: null,
      right: null,
      loading_save: false,
      success: false,
      showDeclineModal: false,
      name: "",
      type: localStorage.getItem("Login_user_role"),
    };
    this.myRef = React.createRef();
  }

  componentDidMount = () => {
    this.loadData();
    this.loadSaved();
    this.loadConfig();
  };

  loadConfig = async () => {
    const token = await localStorage.getItem("token");
    await getData(`${url}/api/config/currency`, token)
      .then((result) => {
        const { left, right } = result.data;
        this.setState({ left, right });
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.refresh !== this.state.refresh) {
      this.loadData();
      this.loadSaved();
    }
  }

  handleSubmit = async (event) => {
    // if (this.state.isChecked == false) {
    //   return this.setState({ agree_team_err: true })
    // } else {
    // this.setState({ loading_save: true })
    // }
    event.preventDefault();
    const token = await localStorage.getItem("token");
    const data = new FormData();
    if (this.state.details.tender_type === "Offer") {
      data.set("tb_tender_id", this.props.match.params.id);
      data.set("tb_quote", this.state.tb_quote);
      data.set("tb_description", this.state.tb_description);
      data.set("tb_quantity", this.state.tb_quantity);
      data.set("tb_city_id", this.state.tb_city_id);
      data.set("tb_delivery_type", this.state.tb_delivery_type);
      data.set("tb_delivery_charges", this.state.tb_delivery_charges);
      data.set("tb_warrenty", this.state.tb_warrenty);
      data.set("tb_warrenty_type", this.state.tb_warrenty_type);
      data.append("attachment", this.state.attachment);
      // data.append("featured_image", this.state.featured_image);
      await postDataWithToken(`${url}/api/bid/create`, data, token)
        .then((result) => {
          //console.log(result);
          this.myRef.current.scrollTo(0, 0);
          this.setState({
            success: true,
            show_msg: true,
            tb_quote: 0,
            tb_description: "",
            attachment: null,
            loaded1: 0,
            loading_save: false,
          });
          this.loadData();
          this.loadSaved();
          this.loadConfig();
        })
        .catch((err) => {
          //console.log(err.response.data);
          this.myRef.current.scrollTo(0, 0);
          this.setState({ show_errors: true, loading_save: false });
        });
    } else {
      data.set("tb_tender_id", this.props.match.params.id);
      data.set("tb_quote", this.state.tb_quote);
      data.set("tb_description", this.state.tb_description);
      data.set("tb_quantity", this.state.tb_quantity);
      data.set("tb_city_id", this.state.tb_city_id);
      data.set("tb_delivery_type", this.state.tb_delivery_type);
      data.set("tb_delivery_charges", this.state.tb_delivery_charges);
      data.set("tb_warrenty", this.state.tb_warrenty);
      data.set("tb_warrenty_type", this.state.tb_warrenty_type);
      data.set("tb_name", this.state.name);
      data.append("attachment", this.state.attachment);
      // data.append("featured_image", this.state.featured_image);
      await postDataWithToken(`${url}/api/bid/create-bid-contact`, data, token)
        .then((result) => {
          //console.log(result);
          this.myRef.current.scrollTo(0, 0);
          this.setState({
            success: true,
            show_msg: true,
            tb_quote: 0,
            tb_description: "",
            attachment: null,
            loaded1: 0,
            loading_save: false,
          });
          this.loadData();
          this.loadSaved();
          this.loadConfig();
        })
        .catch((err) => {
          //console.log(err.response.data);
          this.myRef.current.scrollTo(0, 0);
          this.setState({ show_errors: true, loading_save: false });
        });
    }
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    if (letters.test(value)) {
      this.setState({
        name: value,
      });
    }
  };
  handleChange1 = (event) => {
    if (rx_live.test(event.target.value))
      //if (/^(\d*([.,](?=\d{3}))?\d+)+((?!\2)[.,]\d\d)?$/.test(event.target.value))
      this.setState({ tb_quote: event.target.value });
  };
  handleChange2 = (event) => {
    this.setState({ tb_description: event.target.value });
  };

  Remove_img = () => {
    this.setState({ attachment: "", loaded1: 0, file_err: "", img_name: "" });
  };

  onFilesChange = (files) => {
    // //console.log(files[0]);
    if (files[0]) {
      this.setState({
        attachment: files[0],
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
    this.setState({
      file_err: error.message,
      // attachment: "",
      // img_name: '',
      // loaded1: 0
    });
  };

  // handleChange3 = (event) => {
  //   if (event.target?.files[0]?.size > 2097152) {
  //     return alert("cannot be more than 2 mb");
  //   }
  //   if (
  //     event.target.files[0].name.split(".").pop() == "pdf" ||
  //     event.target.files[0].name.split(".").pop() == "docx" ||
  //     event.target.files[0].name.split(".").pop() == "doc" ||
  //     event.target.files[0].name.split(".").pop() == "jpeg" ||
  //     event.target.files[0].name.split(".").pop() == "png" ||
  //     event.target.files[0].name.split(".").pop() == "jpg" ||
  //     event.target.files[0].name.split(".").pop() == "gif" ||
  //     event.target.files[0].name.split(".").pop() == "svg"
  //   ) {
  //     this.setState({ attachment: event.target.files[0], loaded1: 50 });
  //     if (this.state.loaded1 <= 100) {
  //       setTimeout(
  //         function () {
  //           this.setState({ loaded1: 100 });
  //         }.bind(this),
  //         2000
  //       ); // wait 2 seconds, then reset to false
  //     }
  //   } else {
  //     this.setState({ attachment: null });
  //     return alert("File type not supported");
  //   }
  // };
  // handleChange4 = (event) => {
  //   this.setState({ featured_image: null });
  //   if (
  //     event.target.files[0].name.split(".").pop() == "jpeg" ||
  //     event.target.files[0].name.split(".").pop() == "png" ||
  //     event.target.files[0].name.split(".").pop() == "jpg" ||
  //     event.target.files[0].name.split(".").pop() == "gif" ||
  //     event.target.files[0].name.split(".").pop() == "svg"
  //   ) {
  //     this.setState({
  //       featured_image: event.target.files[0],
  //       loaded: 50,
  //       featured_image_err: false,
  //       img_preview: URL.createObjectURL(event.target.files[0]),
  //     });
  //     if (this.state.loaded <= 100) {
  //       setTimeout(
  //         function () {
  //           this.setState({ loaded: 100 });
  //         }.bind(this),
  //         2000
  //       ); // wait 2 seconds, then reset to false
  //     }
  //   } else {
  //     this.setState({ featured_image: null });
  //     alert("File type not supported");
  //   }
  // };

  loadSaved = async () => {
    const token = await localStorage.getItem("token");
    await getData(`${url}/api/saved-icon`, token)
      .then((result) => {
        this.setState({ saved: result.data.data });
      })
      .catch((err) => {
        //console.log(err.response);
      });
  };

  save = async (id) => {
    this.setState({
      loading_save: true,
    });
    const token = await localStorage.getItem("token");
    const data = new FormData();
    data.set("uft_tender_id", id);
    await postDataWithToken(`${url}/api/saved/add`, data, token)
      .then((result) => {
        //console.log("result", result);
        this.setState({ refresh: false, loading_save: false });
        this.setState({ refresh: true });
      })
      .catch((err) => {
        //console.log(err);
        this.setState({
          disable_cla: false,
          savedLoaded: false,
          loading_save: false,
        });
      });
  };

  remove = async (id) => {
    this.setState({ feedid: id });
    const token = await localStorage.getItem("token");

    this.setState({ savedLoaded: true, loading_save: true });
    await deleteData(`${url}/api/saved/remove/${id}`, token)
      .then((result) => {
        this.setState({ refresh: false });
        this.setState({
          refresh: true,
          savedLoaded: false,
          loading_save: false,
        });
      })
      .catch((err) => {
        this.setState({
          loading_feed: false,
          disable_cla: false,
          savedLoaded: false,
          loading_save: false,
        });
        // if (err?.response?.status === 404) {
        //   return alert("Saved job doesn't belong to the user");
        // }
        // return alert("Some issue occured");
      });
  };

  loadData = async () => {
    const token = await localStorage.getItem("token");
    await getData(`${url}/api/feed-detail/${this.props.match.params.id}`, token)
      .then((result) => {
        this.setState({ details: result.data[0] });
        this.setState(
          {
            slider: this.state.details.tender_slider_images,
          },
          () => {
            if (this.state.slider) {
              const vals = Object.values(this.state.slider);
              this.setState({ imgs: vals });
            }
          }
        );
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  toggleChange = () => {
    this.setState({
      isChecked: !this.state.isChecked,
    });
  };

  onConfirmError = () => {
    this.setState({ success: false });
    this.props.history.push("/my-actions");
  };

  render() {
    const { t, i18n } = this.props;
    console.log(this.state.details.tender_type);
    let chunk, alert;
    if (this.state.show_errors === true) {
      alert = (
        <Alert variant="danger" style={{ fontSize: "13px" }}>
          {t("success.bid_once")}
        </Alert>
      );
    }
    if (this.state.show_msg === true) {
      alert = (
        <Alert variant="success" style={{ fontSize: "13px" }}>
          {t("success.work_bid")}
        </Alert>
      );
    }

    // const values = Object.values(this.state.saved);
    // const classname = (id) =>
    //   values.map((item) => {
    //     if (item.uft_tender_id === id) {
    //       return "icon-heart";
    //     }
    //   });
    const classname = (id) =>
      Array.isArray(this.state.saved)
        ? this.state.saved.map((item) => {
            if (item.uft_tender_id === id) {
              return "icon-heart";
            }
          })
        : [];

    if (this.state.details.tender_type === "Request") {
      chunk = (
        <div>
          <div className="form-group">
            <label htmlFor="delivery-charges">
              {t("marketplace.feeds.list_details.delivery_charges")}
            </label>
            <input
              id="delivery-charges"
              className="form-control"
              type="text"
              placeholder="800"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="warranty">
              {t("marketplace.feeds.list_details.warranty")}
            </label>
            <div className="d-flex input-group">
              <input
                id="warranty"
                className="form-control"
                type="text"
                placeholder="20"
                required
              />
              <select className="form-control">
                <option value="">
                  {" "}
                  {t("marketplace.feeds.list_details.Select")}{" "}
                </option>
                <option value="days">
                  {" "}
                  {t("marketplace.feeds.list_details.Days")}{" "}
                </option>
                <option value="Months">
                  {" "}
                  {t("marketplace.feeds.list_details.Months")}{" "}
                </option>
              </select>
            </div>
          </div>
        </div>
      );
    }

    const { success } = this.state;
    return (
      <div>
        {/* <Header active={'market'} /> */}
        {success ? (
          <SweetAlert
            success
            closeOnClickOutside={true}
            title={t("login.SuccessPopup")}
            // title={t("list_details.success1")}
            onConfirm={this.onConfirmError}
          >
            {/* {t("list_details.success")} */}
          </SweetAlert>
        ) : (
          ""
        )}

        <Breadcrumb>
          <li className="breadcrumb-item active" aria-current="page">
            <Link
              to={{
                pathname: `/feeds`,
              }}
              className="breadcrumb-item active"
            >
              {t("header.marketplace")}
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {/* {this.state.details.tender_category_type}{" "} */}
            {this.state.details.tender_category_type === "Work" &&
            this.state.details.tender_type === "Request"
              ? t("marketplace.feeds.list_details.head_work")
              : ""}{" "}
            {""}
            {/* {this.state.details.tender_category_type}{" "} */}
            {this.state.details.tender_category_type === "Work" &&
            this.state.details.tender_type === "Offer"
              ? t("marketplace.feeds.list_details.workoffer")
              : ""}{" "}
            {""}
            {t("marketplace.feeds.list_details.details")}
          </li>
        </Breadcrumb>
        <div className="main-content">
          <Sidebar />
          <div ref={this.myRef} className="page-content">
            {alert ? alert : null}
            <div className="container-fluid">
              <h3 className="head3">
                {/* {this.state.details.tender_category_type}{" "}
                {this.state.details.tender_type} {t("list_details.details")} */}
                {this.state.details.tender_category_type === "Work" &&
                this.state.details.tender_type === "Offer"
                  ? t("marketplace.feeds.list_details.workoffer")
                  : this.state.details.tender_category_type === "Work" &&
                    this.state.details.tender_type === "Request"
                  ? t("marketplace.feeds.list_details.head_work")
                  : ""}{" "}
                {t("marketplace.feeds.list_details.details")}
              </h3>
              <div className="card">
                <div className="card-body">
                  <div className="row details-view">
                    <div className="col-md">
                      <h5>
                        {this.state.details.applied == "applied" ? (
                          <span>
                            <i>
                              <b> </b>
                              <strong className="text-success">
                                {" "}
                                {t(
                                  "marketplace.feeds.list_details.all_already"
                                )}{" "}
                              </strong>
                            </i>
                          </span>
                        ) : null}
                      </h5>
                      <Carousel
                        featuredImage={this.state.details.tender_featured_image}
                        images={this.state.imgs}
                      />

                      <div className="details-content">
                        <div className="head">
                          <h4>{this.state.details.tender_title}</h4>
                          <p>
                            {this.state.details.tender_type === "Offer"
                              ? t("marketplace.feeds.list_details.Offer_workD")
                              : t(
                                  "marketplace.feeds.list_details.Request_workD"
                                )}
                          </p>
                          {/* Alok */}
                        </div>
                        {this.state.details.tender_description
                          ?.split("\n")
                          .map((str) => (
                            <p>{str}</p>
                          ))}
                        <p>
                          {t("marketplace.feeds.list_details.Category")}
                          <a href="javascript:void(0)" className="badge">
                            {this.state.details.category}
                          </a>
                        </p>

                        {this.state.details.tender_attachment ? (
                          <a
                            href={
                              url +
                              "/images/marketplace/material/" +
                              this.state.details.tender_attachment
                            }
                            target="_blank"
                            className="attachment"
                          >
                            <i className="icon-paperclip"></i>
                            {this.state.details.tender_attachment}
                          </a>
                        ) : null}

                        <table>
                          <tr>
                            <th>
                              {" "}
                              {t("marketplace.feeds.list_details.budget")}{" "}
                            </th>
                            <td>
                              {this.state.details.tender_budget
                                ? this.state.details.tender_budget === "Hourly"
                                  ? t("marketplace.feeds.list_details.Hourly")
                                  : this.state.details.tender_budget === "Fixed"
                                  ? t("marketplace.feeds.list_details.Fixed")
                                  : this.state.details.tender_budget
                                : ""}
                            </td>
                          </tr>

                          {this.state.details.tender_type === "Request" ? (
                            <tr>
                              <th>
                                {t("marketplace.feeds.list_details.rate")}
                              </th>
                              <td>
                                {this.state.left}{" "}
                                {this.state.details.tender_rate}{" "}
                                {this.state.right}
                              </td>
                            </tr>
                          ) : (
                            ""
                          )}

                          {/* {this.state.details.tender_rate > 0 ?
                          <tr>
                            <th> {t("list_details.rate")} </th>
                            <td>{this.state.details.tender_rate}</td>
                          </tr>
                          :""} */}
                          {/* 
                          {this.state.details.tender_type === "Request" ? (
                            <tr>
                              <th>{t("list_details.rate")}</th>
                              <td>
                                {this.state.left}{" "}
                                {this.state.details.tender_rate}{" "}
                                {this.state.right}
                              </td>
                            </tr>
                          ) : (
                            ""
                          )} */}

                          <tr>
                            <th>
                              {t("marketplace.feeds.list_details.location")}
                            </th>
                            <td>
                              {this.state.details.tender_state === "All regions"
                                ? t(
                                    "marketplace.feeds.list_details.All_regions"
                                  )
                                : this.state.details.tender_state}
                            </td>
                          </tr>

                          {this.state.details.tender_type === "Request" ? (
                            <tr>
                              <th>
                                {t(
                                  "marketplace.feeds.list_details.work_starts"
                                )}
                              </th>
                              <td>
                                {moment(
                                  this.state.details.tender_available_from
                                ).format("DD-MM-YYYY")}
                              </td>
                            </tr>
                          ) : (
                            ""
                          )}
                          {this.state.details.tender_type === "Request" ? (
                            <tr>
                              <th>
                                {t("marketplace.feeds.list_details.work_ends")}
                              </th>
                              <td>
                                {moment(
                                  this.state.details.tender_available_to
                                ).format("DD-MM-YYYY")}
                              </td>
                            </tr>
                          ) : (
                            <tr>
                              <th>
                                {t(
                                  "marketplace.feeds.list_details.availability"
                                )}
                              </th>
                              <td>
                                {this.state.details.tender_available_from} -{" "}
                                {this.state.details.tender_available_to}
                              </td>
                            </tr>
                          )}

                          {this.state.details.tender_category_type === "Work" &&
                          this.state.details.tender_type === "Offer" &&
                          this.state.details.extra === 1 ? (
                            <tr>
                              <th>{t("marketplace.feeds.work_offer")}</th>
                              <td>
                                {t("marketplace.feeds.list_details.included")}
                              </td>
                            </tr>
                          ) : this.state.details.tender_category_type ===
                              "Work" &&
                            this.state.details.tender_type === "Request" &&
                            this.state.details.extra === 1 ? (
                            <tr>
                              <th>{t("marketplace.feeds.work_request")}</th>
                              <td>
                                {t("marketplace.feeds.list_details.included")}
                              </td>
                            </tr>
                          ) : (
                            ""
                          )}
                          {/* {this.state.details.extra === 1 ? (
                            <tr>
                              <th>{t("marketplace.feeds.material")}</th>
                              <td>
                                {t("marketplace.feeds.list_details.included")}
                              </td>
                            </tr>
                          ) : (
                            ""
                          )} */}

                          <tr>
                            <th>
                              {t("marketplace.feeds.list_details.expires_in")}
                            </th>
                            <td>
                              {moment(
                                this.state.details.tender_expiry_date
                              ).format("DD-MM-YYYY HH:mm:ss")}
                            </td>
                          </tr>
                        </table>
                      </div>
                    </div>
                    <div className="col-md">
                      {/* {this.state.details.isUser} */}

                      {this.state.details.applied == "applied" ? (
                        <div className="details-form">
                          <div className="form-group">
                            <div className="row align-items-center">
                              <div className="col-6">
                                <label className="d-flex ">
                                  <strong>
                                    {t(
                                      "marketplace.feeds.list_details.your_quote"
                                    )}
                                  </strong>
                                </label>
                              </div>
                              <div className="col-6">
                                <label className="d-flex align-items-center">
                                  <span>{this.state.details?.tb_quote}</span>
                                  &nbsp;
                                  {`${this.state.left}${
                                    this.state.right != null
                                      ? this.state.right
                                      : ""
                                  }/${
                                    this.state.details?.tender_unit != null
                                      ? this.state.details?.tender_unit
                                      : ""
                                  }`}
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="row align-items-center">
                              <div className="col-6">
                                <label className="d-flex ">
                                  <strong>
                                    {t(
                                      "marketplace.feeds.list_details.message"
                                    )}
                                  </strong>
                                </label>
                              </div>
                              <div className="col-6">
                                <label className="d-flex align-items-center">
                                  <span>{this.state.details.tb_message}</span>
                                </label>
                              </div>
                            </div>
                          </div>

                          {this.state.details.tb_status != 2 ? (
                            <>
                              <Decline
                                userId={this.state.details.tb_bduser_id}
                                show={this.state.showDeclineModal}
                                handleClose={() =>
                                  this.setState({ showDeclineModal: false })
                                }
                                id={this.props.match.params.id}
                              />
                              <button
                                onClick={() =>
                                  this.setState({
                                    showDeclineModal:
                                      !this.state.showDeclineModal,
                                  })
                                }
                                className="btn btn-gray open-DeclineDialog"
                                // data-user_id={this.state.details.tb_bduser_id}
                                // data-toggle='modal'
                                // data-target='#decline'
                              >
                                {t("marketplace.feeds.list_details.Withdraw")}
                              </button>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        <div className="details-form">
                          {this.state.details.isUser &&
                          this.state.details.tender_type === "Request" ? (
                            <h4>
                              {t(
                                "marketplace.feeds.list_details.CannotBid_ownRequest"
                              )}
                            </h4>
                          ) : this.state.details.isUser &&
                            this.state.details.tender_type === "Offer" ? (
                            <h4>
                              {t(
                                "marketplace.feeds.list_details.CannotBid_ownOffer"
                              )}
                            </h4>
                          ) : "" ||
                            (this.state.type === "consumer" &&
                              this.state.details.tender_type === "Request") ? (
                            <div>
                              <h4>
                                {" "}
                                {t(
                                  "marketplace.feeds.list_details.Cannot_bid"
                                )}{" "}
                              </h4>
                            </div>
                          ) : this.state.details.isUser === 0 &&
                            this.state.details.cannot_bid === 1 ? (
                            <h4>
                              {t("marketplace.feeds.list_details.cannot_bid")}
                            </h4>
                          ) : this.state.details.tender_type === "Request" ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                this.handleSubmit(e);
                              }}
                            >
                              <div className="form-group">
                                <div
                                  className="col-5"
                                  style={{
                                    paddingLeft: "0px",
                                    marginBottom: "2rem",
                                  }}
                                >
                                  <label className="d-flex ">
                                    {t(
                                      "marketplace.feeds.list_details.contact"
                                    )}
                                  </label>
                                </div>
                                <div
                                  className="row align-items-center"
                                  style={{ marginBottom: "1rem" }}
                                >
                                  <div
                                    className="col-5"
                                    style={{ paddingRight: "0px" }}
                                  >
                                    <label className="d-flex ">
                                      {t(
                                        "marketplace.feeds.list_details.your_quote1"
                                      )}
                                      <span
                                        class="hovertext"
                                        data-hover={t(
                                          "marketplace.feeds.list_details.dataHover1"
                                        )}
                                      >
                                        <img src={Info} alt="info icon" />
                                      </span>
                                    </label>
                                  </div>
                                  <div className="col-7">
                                    <label className="d-flex align-items-center">
                                      {this.state.details.tender_budget ===
                                      this.state.right
                                        ? null
                                        : this.state.left}
                                      {this.state.details.tender_budget ===
                                      "Fixed"
                                        ? null
                                        : this.state.right}
                                      {/* {this.state.details.tender_budget ===
                                        'Fixed'
                                        ? '€'
                                        : '/'} */}
                                      {this.state.details.tender_budget ===
                                      "Hourly"
                                        ? t(
                                            "marketplace.feeds.list_details.Hour"
                                          )
                                        : this.state.details.tender_budget ===
                                          "per_m2"
                                        ? "m2"
                                        : ""}{" "}
                                      <input
                                        onChange={this.handleChange1}
                                        className="form-control"
                                        maxLength="8"
                                        type="text"
                                        required
                                        placeholder="0"
                                        value={this.state.tb_quote}
                                      />
                                    </label>
                                  </div>
                                </div>
                                <div className="row align-items-center">
                                  <div className="col-5">
                                    <label className="d-flex">
                                      {" "}
                                      {t("marketplace.feeds.list_details.name")}
                                    </label>
                                  </div>
                                  <div className="col-7">
                                    <label className="d-flex align-items-center">
                                      <input
                                        onChange={this.handleChange}
                                        className="form-control"
                                        type="text"
                                        name="name"
                                        value={this.state.name}
                                      ></input>
                                    </label>
                                  </div>
                                </div>
                              </div>

                              <div className="form-group">
                                <label htmlFor="message">
                                  {t("marketplace.feeds.list_details.message")}:
                                  <span
                                    class="hovertext"
                                    data-hover={t(
                                      "marketplace.feeds.list_details.dataHover2"
                                    )}
                                  >
                                    <img src={Info} alt="info icon" />
                                  </span>
                                </label>
                                <textarea
                                  onChange={this.handleChange2}
                                  id="message"
                                  className="form-control"
                                  required
                                  value={this.state.tb_description}
                                ></textarea>
                              </div>
                              <div className="form-group">
                                <label htmlFor="attachment">
                                  {t(
                                    "marketplace.feeds.list_details.attachment"
                                  )}
                                </label>
                                <div className="file-select">
                                  {/* <input
                                    onChange={this.handleChange3}
                                    name="attachment"
                                    type="file"
                                    id="attachment" 
                                  /> */}
                                  <Files
                                    className="files-dropzone"
                                    onChange={(e) => this.onFilesChange(e)}
                                    onError={(e) => this.onFilesError(e)}
                                    accepts={[
                                      "image/gif",
                                      ".doc ",
                                      ".docx",
                                      "image/jpeg",
                                      "image/png",
                                      "image/jpg",
                                      ".svg",
                                      ".pdf",
                                    ]}
                                    multiple={false}
                                    maxFileSize={3145757}
                                    minFileSize={10}
                                    clickable
                                  >
                                    <label htmlFor="attachment">
                                      <img src={File} />
                                      <span className="status">
                                        {" "}
                                        {t(
                                          "marketplace.feeds.list_details.Upload_status"
                                        )}{" "}
                                      </span>
                                      <ProgressBar
                                        now={this.state.loaded1}
                                        style={{ marginBottom: "1rem" }}
                                      />
                                      <small className="form-text text-muted">
                                        {t(
                                          "marketplace.feeds.list_details.ext"
                                        )}
                                      </small>
                                    </label>
                                  </Files>
                                  <small
                                    className="form-text text-muted"
                                    style={{ fontSize: "90%" }}
                                  >
                                    {t(
                                      "marketplace.feeds.list_details.disclaimer"
                                    )}
                                  </small>
                                </div>
                                <p
                                  style={{ color: "#eb516d", fontSize: "15px" }}
                                >
                                  {/* {this.state.img_name ? this.state.img_name : ""} */}
                                  {this.state.file_err
                                    ? this.state.file_err
                                    : ""}
                                </p>
                                {this.state.attachment ? (
                                  <button
                                    type="button"
                                    onClick={this.Remove_img}
                                    className="btn btn-danger"
                                  >
                                    {t("marketplace.feeds.list_details.Remove")}
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                              {/* <div className="form-group">
                            <label htmlFor="main">{t("list_details.image")}</label>
                            <div className="file-select">
                              <input
                                onChange={this.handleChange4}
                                name="featured_image"
                                type="file"
                                id="main"
                              />
                              <label htmlFor="main">
                                <img
                                  src={
                                    this.state.img_preview
                                      ? this.state.img_preview
                                      : File
                                  }
                                />
                                <span className="status">Upload status</span>
                                <ProgressBar now={this.state.loaded} />
                              </label>
                              <small className="form-text text-muted">
                                jpeg, png, jpg, gif, svg
                              </small>
                            </div>
                          </div> */}
                              <div className="form-group">
                                <div className="form-check"></div>
                              </div>
                              <button className="btn btn-success" type="submit">
                                {t("marketplace.feeds.list_details.send")}
                              </button>
                              <button
                                // onClick={(e) => {
                                //   e.preventDefault();
                                //   this.save(this.state.details.tender_id);
                                // }}
                                disabled={
                                  this.state.loading_save ? true : false
                                }
                                onClick={
                                  classname(
                                    this.state.details.tender_id
                                  ).filter(function (el) {
                                    return el;
                                  }) == "icon-heart"
                                    ? () =>
                                        this.remove(
                                          this.state.details.tender_id
                                        )
                                    : () =>
                                        this.save(this.state.details.tender_id)
                                }
                                className="btn btn-light"
                                type="button"
                              >
                                {this.state.loading_save ? (
                                  <Spinner
                                    animation="border"
                                    role="status"
                                    className="center"
                                  >
                                    <span className="sr-only ">
                                      {t("marketplace.feeds.Loading")}
                                    </span>
                                  </Spinner>
                                ) : (
                                  <>
                                    <i
                                      className={
                                        classname(
                                          this.state.details.tender_id
                                        ).filter(function (el) {
                                          return el;
                                        }) == "icon-heart"
                                          ? "icon-heart"
                                          : "icon-heart-o"
                                      }
                                    ></i>
                                    {t(
                                      "marketplace.feeds.list_details.Save_this_job"
                                    )}
                                  </>
                                )}
                                {/* <i
                                  className={
                                    classname(
                                      this.state.details.tender_id
                                    ).filter(function (el) {
                                      return el;
                                    }) == "icon-heart"
                                      ? "icon-heart"
                                      : "icon-heart-o custom_heart"
                                  }
                                ></i> */}
                                {/* {t("list_details.Save_this_job")} */}
                              </button>
                            </form>
                          ) : this.state.details.tender_type === "Offer" ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                this.handleSubmit(e);
                              }}
                            >
                              <div className="form-group">
                                <div className="row align-items-center">
                                  <div className="col-5">
                                    <label className="d-flex ">
                                      {t(
                                        "marketplace.feeds.list_details.your_quote"
                                      )}
                                    </label>
                                  </div>
                                  <div className="col-7">
                                    <label className="d-flex align-items-center">
                                      {this.state.details.tender_budget ===
                                      this.state.right
                                        ? null
                                        : this.state.left}
                                      {this.state.details.tender_budget ===
                                      "Fixed"
                                        ? null
                                        : this.state.right}
                                      {/* {this.state.details.tender_budget ===
                                        'Fixed'
                                        ? '€'
                                        : '/'} */}
                                      {this.state.details.tender_budget ===
                                      "Hourly"
                                        ? t(
                                            "marketplace.feeds.list_details.Hour"
                                          )
                                        : this.state.details.tender_budget ===
                                          "per_m2"
                                        ? "m2"
                                        : ""}{" "}
                                      <input
                                        onChange={this.handleChange1}
                                        className="form-control"
                                        maxLength="8"
                                        type="text"
                                        required
                                        placeholder="0"
                                        value={this.state.tb_quote}
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>

                              <div className="form-group">
                                <label htmlFor="message">
                                  {t("marketplace.feeds.list_details.message")}:
                                </label>
                                <textarea
                                  onChange={this.handleChange2}
                                  id="message"
                                  className="form-control"
                                  required
                                  value={this.state.tb_description}
                                ></textarea>
                              </div>
                              <div className="form-group">
                                <label htmlFor="attachment">
                                  {t(
                                    "marketplace.feeds.list_details.attachment"
                                  )}
                                </label>
                                <div className="file-select">
                                  {/* <input
                                    onChange={this.handleChange3}
                                    name="attachment"
                                    type="file"
                                    id="attachment" 
                                  /> */}
                                  <Files
                                    className="files-dropzone"
                                    onChange={(e) => this.onFilesChange(e)}
                                    onError={(e) => this.onFilesError(e)}
                                    accepts={[
                                      "image/gif",
                                      ".doc ",
                                      ".docx",
                                      "image/jpeg",
                                      "image/png",
                                      "image/jpg",
                                      ".svg",
                                      ".pdf",
                                    ]}
                                    multiple={false}
                                    maxFileSize={3145757}
                                    minFileSize={10}
                                    clickable
                                  >
                                    <label htmlFor="attachment">
                                      <img src={File} />
                                      <span className="status">
                                        {" "}
                                        {t(
                                          "marketplace.feeds.list_details.Upload_status"
                                        )}{" "}
                                      </span>
                                      <ProgressBar
                                        now={this.state.loaded1}
                                        style={{ marginBottom: "1rem" }}
                                      />
                                      <small className="form-text text-muted">
                                        {t(
                                          "marketplace.feeds.list_details.ext"
                                        )}
                                      </small>
                                    </label>
                                  </Files>
                                  <small
                                    className="form-text text-muted"
                                    style={{ fontSize: "90%" }}
                                  >
                                    {t(
                                      "marketplace.feeds.list_details.disclaimer"
                                    )}
                                  </small>
                                </div>
                                <p
                                  style={{ color: "#eb516d", fontSize: "15px" }}
                                >
                                  {/* {this.state.img_name ? this.state.img_name : ""} */}
                                  {this.state.file_err
                                    ? this.state.file_err
                                    : ""}
                                </p>
                                {this.state.attachment ? (
                                  <button
                                    type="button"
                                    onClick={this.Remove_img}
                                    className="btn btn-danger"
                                  >
                                    {t("marketplace.feeds.list_details.Remove")}
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                              {/* <div className="form-group">
                            <label htmlFor="main">{t("list_details.image")}</label>
                            <div className="file-select">
                              <input
                                onChange={this.handleChange4}
                                name="featured_image"
                                type="file"
                                id="main"
                              />
                              <label htmlFor="main">
                                <img
                                  src={
                                    this.state.img_preview
                                      ? this.state.img_preview
                                      : File
                                  }
                                />
                                <span className="status">Upload status</span>
                                <ProgressBar now={this.state.loaded} />
                              </label>
                              <small className="form-text text-muted">
                                jpeg, png, jpg, gif, svg
                              </small>
                            </div>
                          </div> */}
                              <div className="form-group">
                                <div className="form-check"></div>
                              </div>

                              <button
                                className="btn btn-secondary"
                                type="submit"
                              >
                                {t(
                                  "marketplace.feeds.list_details.Submit_your_bid"
                                )}
                              </button>
                              <button
                                // onClick={(e) => {
                                //   e.preventDefault();
                                //   this.save(this.state.details.tender_id);
                                // }}
                                disabled={
                                  this.state.loading_save ? true : false
                                }
                                onClick={
                                  classname(
                                    this.state.details.tender_id
                                  ).filter(function (el) {
                                    return el;
                                  }) == "icon-heart"
                                    ? () =>
                                        this.remove(
                                          this.state.details.tender_id
                                        )
                                    : () =>
                                        this.save(this.state.details.tender_id)
                                }
                                className="btn btn-light"
                                type="button"
                              >
                                {this.state.loading_save ? (
                                  <Spinner
                                    animation="border"
                                    role="status"
                                    className="center"
                                  >
                                    <span className="sr-only ">
                                      {t("marketplace.feeds.Loading")}
                                    </span>
                                  </Spinner>
                                ) : (
                                  <>
                                    <i
                                      className={
                                        classname(
                                          this.state.details.tender_id
                                        ).filter(function (el) {
                                          return el;
                                        }) == "icon-heart"
                                          ? "icon-heart"
                                          : "icon-heart-o"
                                      }
                                    ></i>
                                    {t(
                                      "marketplace.feeds.list_details.Save_this_job"
                                    )}
                                  </>
                                )}
                                {/* <i
                                  className={
                                    classname(
                                      this.state.details.tender_id
                                    ).filter(function (el) {
                                      return el;
                                    }) == "icon-heart"
                                      ? "icon-heart"
                                      : "icon-heart-o custom_heart"
                                  }
                                ></i> */}
                                {/* {t("list_details.Save_this_job")} */}
                              </button>
                            </form>
                          ) : (
                            ""
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Workdetail);
