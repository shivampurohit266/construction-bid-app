import React, { Component } from "react";
import axios from "axios";
import DefaultImg from "../../images/DefaultImg.png";
import Header from "../shared/Header";
import Sidebar from "../shared/Sidebar";
import { Helper, url } from "../../helper/helper";
import Decline from "./listingdetails/Modals/Decline";
import ProgressBar from "react-bootstrap/ProgressBar";
import Alert from "react-bootstrap/Alert";
import { withTranslation } from "react-i18next";
import Image from "../../images/DefaultImg.png";
import SweetAlert from "react-bootstrap-sweetalert";
import Files from "react-files";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
// import Carousel from 'react-bootstrap/Carousel';
import Carousel from "./Carousel/Carousel";
import Breadcrumb from "../shared/Breadcrumb";
import { deleteData, getData, postDataWithToken } from "../../helper/api";
import Accordion from "./RenoCalcAccordion/RenoCalcAccordion";
import Info from "../../images/carbon_information.png";
import { dateFunc } from "../../helper/dateFunc/date";
const rx_live = /^[+-]?\d*(?:[.,]\d*)?$/;
const letters = /^[A-Za-z ]+$/;

class Materialofferdetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
      slider: [],
      cities: [],
      imgs: [],
      active: null,
      tb_quote: "",
      isChecked: false,
      tb_description: "",
      tb_quantity: "",
      tb_city_id: "",
      tb_city_id_err: false,
      tb_delivery_type: null,
      tb_delivery_type_err: false,
      tb_delivery_charges: "",
      tb_warrenty: "",
      warrenty_err: false,
      tb_warrenty_type: "",
      attachment: "",
      featured_image: null,
      img_preview: null,
      loaded1: 0,
      loaded: 0,
      errors: [],
      show_errors: false,
      show_msg: false,
      saved: [],
      refresh: false,
      success: false,
      left: null,
      right: null,
      Submit_loding: false,
      loading_save: false,
      showDeclineModal: false,
      type: localStorage.getItem("Login_user_role"),
      lang: localStorage.getItem("_lng"),
      area: "",
      query: "",
      checked: "",
      numero: "",
      numero2: "",
      numero3: "",
      numero4: "",
      date: "",
      date2: "",
      name: "",
    };
    this.myRef = React.createRef();
  }

  componentDidMount = () => {
    this.loadData();
    this.loadCity();
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

  loadCity = async () => {
    const token = await localStorage.getItem("token");
    let lang = await localStorage.getItem("_lng");
    await getData(`${url}/api/state/${lang}`, token)
      .then((result) => {
        this.setState({ cities: result.data.data });
      })
      .catch((err) => {
        //console.log(err.response);
      });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({
      file_err: "",
      warrenty_err: false,
      tb_city_id_err: false,
      tb_delivery_type_err: false,
      Submit_loding: true,
    });
    // if (
    //   this.state.tb_warrenty == "--Select--" ||
    //   this.state.tb_warrenty == null
    // ) {
    //   return this.setState({ warrenty_err: true });
    // }
    // if (this.state.tb_quote == "") {
    //   return this.setState({ tb_quote_err: true })
    // } else {
    //    this.setState({ tb_quote_err: false })
    // }
    // if (this.state.tb_quantity == "") {
    //   return this.setState({ tb_quantity_err: true })
    // } else {
    //   this.setState({ tb_quantity_err: false })
    // }
    // if (this.state.tb_description == "") {
    //   return this.setState({ tb_description_err: true })
    // } else {
    //   this.setState({ tb_description_err: false })
    // }
    // if (this.state.tb_city_id == "") {
    //   return  this.setState({ tb_city_id_err: true })
    // } else {
    //   this.setState({ tb_city_id_err: false })
    // }
    // if (this.state.tb_delivery_charges == "") {
    //   return  this.setState({ tb_delivery_charges_err: true })
    // } else {
    //   this.setState({ tb_delivery_charges_err: false })
    // }
    // if (this.state.tb_warrenty == "") {
    //   return  this.setState({ tb_warrenty_type_err: true })
    // } else {
    //   this.setState({ tb_warrenty_type_err: false })
    // }
    // if (this.state.tb_warrenty_type == "") {
    //   this.myRef.current.scrollTo(5, 0);
    //   return  this.setState({ tb_warrenty_err : true })
    // }else {
    //   this.setState({ tb_warrenty_err: false })
    // }
    // // if (this.state.attachment == "") {
    // //   return this.setState({ attachment_err: true })
    // // } else {
    // //   this.setState({ attachment_err: false })
    // // }
    // if (this.state.isChecked == false) {
    //  return this.setState({ agree_team_err: true })
    //  } else{
    //   this.setState({ agree_team_err: false })
    //  }

    // if (this.state.tb_city_id == "--Select--" || this.state.tb_city_id == 0) {
    //   return this.setState({ tb_city_id_err: true });
    // }
    // if (
    //   this.state.tb_delivery_type == "--Select--" ||
    //   this.state.tb_delivery_type == null
    // ) {
    //   return this.setState({ tb_delivery_type_err: true });
    // }

    const token = await localStorage.getItem("token");

    const data = new FormData();
    if (this.state.details.tender_type === "Offer") {
      data.set("tb_tender_id", this.props.match.params.id);
      data.set("tb_quote", this.state.tb_quote);
      data.set("tb_description", this.state.tb_description);
      data.set("tb_quantity", this.state.tb_quantity);
      data.set("tb_city_id", this.state.tb_city_id);
      // data.set("tb_delivery_type", this.state.tb_delivery_type);
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
            show_msg: true,
            Submit_loding: false,
            tb_quote: 0,
            tb_quantity: 0,
            tb_delivery_charges: 0,
            tb_warrenty: 0,
            tb_description: "",
            attachment: null,
            loaded1: 0,
            success: "Your Request have been submit succesfully",
          });
          this.loadData();
          // this.props.history.push('/my-bids');
          //setTimeout(this.setState({position: 1}), 3000);
        })
        .catch((err) => {
          //console.log(err.response.data);
          this.myRef.current.scrollTo(0, 0);
          this.setState({ Submit_loding: false, show_errors: true });
        });
    } else {
      data.set("tb_tender_id", this.props.match.params.id);
      data.set("tb_quote", this.state.tb_quote);
      data.set("tb_description", this.state.tb_description);
      data.set("tb_quantity", this.state.tb_quantity);
      data.set("tb_city_id", this.state.tb_city_id);
      // data.set("tb_delivery_type", this.state.tb_delivery_type);
      data.set("tb_delivery_charges", this.state.tb_delivery_charges);
      data.set("tb_warrenty", this.state.tb_warrenty);
      data.set("tb_warrenty_type", this.state.tb_warrenty_type);
      data.set("name", this.state.name);
      data.append("attachment", this.state.attachment);
      // data.append("featured_image", this.state.featured_image);
      await postDataWithToken(`${url}/api/bid/create-bid-contact`, data, token)
        .then((result) => {
          //console.log(result);
          this.myRef.current.scrollTo(0, 0);
          this.setState({
            show_msg: true,
            Submit_loding: false,
            tb_quote: 0,
            tb_quantity: 0,
            tb_delivery_charges: 0,
            tb_warrenty: 0,
            tb_description: "",
            attachment: null,
            loaded1: 0,
            success: "Your Request have been submit succesfully",
          });
          this.loadData();
          // this.props.history.push('/my-bids');
          //setTimeout(this.setState({position: 1}), 3000);
        })
        .catch((err) => {
          //console.log(err.response.data);
          this.myRef.current.scrollTo(0, 0);
          this.setState({ Submit_loding: false, show_errors: true });
        });
    }
  };
  handleChange = (event) => {
    const { name, value } = event.target;
    if (letters.test(value))
      this.setState({
        name: value,
      });
  };

  handleChange1 = (event) => {
    if (rx_live.test(event.target.value))
      this.setState({ tb_quote: event.target.value });
  };
  handleChange2 = (event) => {
    if (rx_live.test(event.target.value))
      this.setState({ tb_quantity: event.target.value });
  };
  handleChange3 = (event) => {
    // if (event.target.value !== "--Select--") {
    this.setState({ tb_city_id: event.target.value });
    // }
  };
  handleChange4 = (event) => {
    this.setState({ tb_delivery_type: event.target.value });
  };
  handleChange5 = (event) => {
    this.setState({ tb_delivery_charges: event.target.value });
    // alert(JSON.stringify(event.target.value));
    // return false;
  };
  handleChange6 = (event) => {
    if (rx_live.test(event.target.value))
      this.setState({ tb_warrenty: event.target.value });
  };
  handleChange7 = (event) => {
    this.setState({ tb_warrenty_type: event.target.value });
  };
  handleChange8 = (event) => {
    this.setState({ tb_description: event.target.value });
  };

  Remove_img = () => {
    this.setState({ attachment: "", loaded1: 0, file_err: "", img_name: "" });
  };

  onFilesChange = (files) => {
    if (files[0]) {
      this.setState({ attachment: files[0], loaded1: 50, file_err: "" });
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
    });
  };

  // handleChange9 = (event) => {
  //   if (event.target.files[0].size > 2097152) {
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

  // handleChange10 = (event) => {
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

  save = async (id) => {
    this.setState({
      loading_save: true,
    });
    const token = await localStorage.getItem("token");
    const data = new FormData();
    data.set("uft_tender_id", id);
    await postDataWithToken(`${url}/api/saved/add`, data, token)
      .then((result) => {
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

  NewlineText(props) {
    const text = props.text;
    if (text) {
      const newText = text.split("\n").map((str) => <p>{str}</p>);
      return newText;
    } else return null;
  }

  remove = async (id) => {
    this.setState({ feedid: id });
    const token = await localStorage.getItem("token");

    this.setState({ savedLoaded: true, loading_save: true });
    await deleteData(`${url}/api/saved/remove/${id}`, token)
      .then((result) => {
        // //console.log("remove");
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
            const vals = this.state.slider
              ? Object.values(this.state.slider)
              : [];
            this.setState({ imgs: vals });
          }
        );
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  onConfirmError = () => {
    this.setState({ server: false, validation: false, success: false });
    this.props.history.push("/my-actions");
  };
  toggleChange = () => {
    this.setState({
      isChecked: !this.state.isChecked,
    });
  };

  render() {
    const { t, i18n } = this.props;
    console.log(this.state.renoArea);
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
          {t("success.mat_bid")}
        </Alert>
      );
    }

    // const values = this.state.saved ? Object.values(this.state.saved) : [];
    // const classname = (id) =>
    //   values?.map((item) => {
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
    console.log(this.state.details);
    if (this.state.details.tender_type === "Request") {
      chunk = (
        <div>
          <div className="form-group">
            <label htmlFor="delivery-charges">
              {t("marketplace.feeds.list_details.delivery_charges")}
            </label>
            <select
              required
              onChange={this.handleChange5}
              className="form-control"
              id="delivery-charges"
            >
              <option value="">
                {" "}
                {t("marketplace.feeds.list_details.Select")}{" "}
              </option>
              <option value="Included">
                {t("marketplace.feeds.list_details.included")}
              </option>
              <option value="Not include">
                {" "}
                {t("marketplace.feeds.list_details.Not_Include")}{" "}
              </option>
            </select>
            <p style={{ color: "#eb516d " }}>
              {this.state.tb_warrenty_type_err === true
                ? "Delivery is required"
                : null}
            </p>
          </div>
          <div className="form-group">
            <label htmlFor="warranty">
              {t("marketplace.feeds.list_details.warranty")}
            </label>
            <div className="d-flex input-group">
              <input
                onChange={this.handleChange6}
                id="warranty"
                className="form-control"
                type="text"
                maxLength="2"
                placeholder="0"
                required
                max="99"
                value={this.state.tb_warrenty}
              />
              <select
                required
                onChange={this.handleChange7}
                className="form-control"
              >
                <option value="">
                  {" "}
                  {t("marketplace.feeds.list_details.Select")}{" "}
                </option>
                {/* <option value="Days">Days</option> */}
                <option value="Month">
                  {" "}
                  {t("marketplace.feeds.list_details.Month")}{" "}
                </option>
                <option value="Year">
                  {" "}
                  {t("marketplace.feeds.list_details.Year")}{" "}
                </option>
              </select>
            </div>
            <p style={{ color: "#eb516d ", float: "right" }}>
              {this.state.tb_warrenty_err === true
                ? "Warrenty type is required"
                : null}
            </p>
          </div>
        </div>
      );
    }

    let tender_delivery_type_cost = this.state.details.tender_delivery_type_cost
      ? this.state.details.tender_delivery_type_cost
      : [];

    // //console.log("this.state.imgs", this.state.file_err ? this.state.file_err : "")
    const { success, Submit_loding } = this.state;
    var nf = new Intl.NumberFormat();
    //console.log("nf.format(number)", nf.format("586521478525"));
    return (
      <div>
        {/* <Header active={'market'} /> */}
        <Breadcrumb>
          <li className="breadcrumb-item active" aria-current="page">
            {/* {t("header.marketplace")} */}
            <Link
              to="/feeds"
              className="breadcrumb-item active"
              aria-current="page"
            >
              {t("header.marketplace")}
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {/* {this.state.details.tender_category_type === "Material" && this.state.details.tender_type ? 
             <>  {t("list_details.Material_offer")} </>
              :
              <>
              {this.state.details.tender_category_type}  {" "}
              {this.state.details.tender_type} {t("list_details.details")}
              </>
              }  */}

            {this.state.details.tender_category_type === "Material" &&
            this.state.details.tender_type === "Offer"
              ? t("marketplace.feeds.list_details.material_offer")
              : ""}
            {this.state.details.tender_category_type === "Material" &&
            this.state.details.tender_type === "Request"
              ? t("marketplace.feeds.list_details.Material_offer0")
              : ""}
          </li>
        </Breadcrumb>
        <div className="main-content">
          <Sidebar />
          <div ref={this.myRef} className="page-content">
            {alert ? alert : null}

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

            <div className="container-fluid">
              <h3 className="head3">
                {" "}
                {this.state.details.tender_category_type === "Material" &&
                this.state.details.tender_type === "Offer"
                  ? t("marketplace.feeds.list_details.material_offer")
                  : this.state.details.tender_category_type === "Material" &&
                    this.state.details.tender_type === "Request"
                  ? t("marketplace.feeds.list_details.Material_offer0")
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
                              {" "}
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
                      {/* <Carousel
                        featuredImage={this.state.details.tender_featured_image}
                        images={this.state.imgs}
                      /> */}
                      <Carousel
                        featuredImage={this.state.details.tender_slider_images}
                        images={this.state.imgs}
                      />
                      <div className="details-content">
                        <div className="head">
                          <h4>{this.state.details.tender_title}</h4>
                          <p>
                            {this.state.details.tender_type === "Offer"
                              ? t("marketplace.feeds.list_details.Offer")
                              : t("marketplace.feeds.list_details.Request")}
                          </p>
                        </div>
                        <this.NewlineText
                          text={this.state.details.tender_description}
                        />

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
                              {this.state.details.tender_type === "Request"
                                ? t(
                                    "marketplace.feeds.list_details.volume_need"
                                  )
                                : t("marketplace.feeds.list_details.budget")}
                            </th>
                            <td>
                              {this.state.details.tender_cost_per_unit
                                ? this.state.details.tender_cost_per_unit + "€/"
                                : this.state.details.tender_quantity}{" "}
                              {/* {this.state.details?.tender_cost_per_unit} */}
                              {/* {t("list_details.pcs")} */}
                              {this.state.details.tender_unit}
                            </td>
                          </tr>
                          {this.state.details.tender_type !== "Request" ? (
                            <tr>
                              <th>
                                {" "}
                                {t("marketplace.feeds.list_details.Qnt")}{" "}
                              </th>
                              <td>{this.state.details.tender_quantity}</td>
                            </tr>
                          ) : (
                            ""
                          )}
                          <tr>
                            <th>
                              {t("marketplace.feeds.list_details.location")}
                            </th>
                            <td>
                              {" "}
                              {this.state.details.tender_state === "All regions"
                                ? t(
                                    "marketplace.feeds.list_details.All_regions"
                                  )
                                : this.state.details.tender_state}
                              {/* {this.state.details.tender_pincode}{" "}
                              {this.state.details.tender_city} */}
                            </td>
                          </tr>
                          {this.state.details.tender_type !== "Request" ? (
                            <tr>
                              <th>
                                {t("marketplace.feeds.list_details.warranty")}
                              </th>
                              <td>{this.state.details.tender_warranty}</td>
                            </tr>
                          ) : (
                            ""
                          )}

                          {this.state.details.tender_type !== "Request" ? (
                            <tr>
                              <th>
                                {t("marketplace.feeds.list_details.delivery")}{" "}
                              </th>
                              <td>
                                {this.state.details.tender_delivery_type ===
                                "Included"
                                  ? t("marketplace.feeds.list_details.Included")
                                  : this.state.details.tender_delivery_type ===
                                    "Not included"
                                  ? t(
                                      "marketplace.feeds.list_details.Not_included"
                                    )
                                  : this.state.details.tender_delivery_type}

                                {/* {tender_delivery_type_cost[0].type === "Included" ?  " " : tender_delivery_type_cost[0].type} */}
                                {/* {tender_delivery_type_cost.map(
                                  (t) =>
                                    `${t.type} : ${this.state.left} ${t.cost} ${this.state.right} | `
                                )} */}
                              </td>
                            </tr>
                          ) : (
                            ""
                          )}

                          {this.state.details.tender_category_type ===
                            "Material" &&
                          this.state.details.tender_type === "Offer" &&
                          this.state.details.extra === 2 ? (
                            <tr>
                              <th>
                                {t("marketplace.feeds.list_details.material_offer_include")}
                              </th>
                              <td>
                                {t("marketplace.feeds.list_details.included")}
                              </td>
                            </tr>
                          ) : this.state.details.tender_category_type ===
                              "Material" &&
                            this.state.details.tender_type === "Request" &&
                            this.state.details.extra === 2 ? (
                            <tr>
                              <th>
                                {t("marketplace.feeds.list_details.material_request_include")}
                              </th>
                              <td>
                                {t("marketplace.feeds.list_details.included")}
                              </td>
                            </tr>
                          ) : (
                            ""
                          )}

                          <tr>
                            <th>
                              {t("marketplace.feeds.list_details.expires_in")}
                            </th>
                            <td>
                              {dateFunc(
                                this.state?.details?.tender_expiry_date,
                                this.state?.lang
                              )}
                            </td>
                          </tr>
                        </table>
                      </div>

                      {/* <div className='faqs__questionnaire-companies'>
                        <Accordion title={t('requestForms.textThirtyThree')}>
                          <ul>
                            <li>{'ji'}</li>
                          </ul>
                        </Accordion>
                        <Accordion title={t('requestForms.textThirtyEight')}>
                          <ul>
                            <li>{'ji'}</li>
                          </ul>
                        </Accordion>
                        <Accordion title={t('requestForms.textFortyEight')}>
                          <ul>
                            <li>{'ji'}</li>
                          </ul>
                        </Accordion>
                        <Accordion title={t('requestForms.textFortyNine')}>
                          <ul>
                            <li>{'ji'}</li>
                          </ul>
                        </Accordion>
                        <Accordion title={t('requestForms.textFiftySeven')}>
                          <ul>
                            <li>{'ji'}</li>
                          </ul>
                        </Accordion>
                        <Accordion title={t('requestForms.textSixtyTwo')}>
                          <ul>
                            <li>{'ji'}</li>
                          </ul>
                        </Accordion>
                        <Accordion title={t('requestForms.textSixtyFive')}>
                          <ul>
                            <li>{'ji'}</li>
                          </ul>
                        </Accordion>
                        <Accordion title={t('requestForms.textSeventySix')}>
                          <ul>
                            <li>{'ji'}</li>
                          </ul>
                        </Accordion>
                        <Accordion title={t('requestForms.textSixtyTwo')}>
                          <ul>
                            <li>{'ji'}</li>
                          </ul>
                        </Accordion>
                        <Accordion title={t('requestForms.textSixtyFive')}>
                          <ul>
                            <li>{'ji'}</li>
                          </ul>
                        </Accordion>
                      </div>*/}
                    </div>

                    <div className="col-md">
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
                                  <span>{this.state.details.tb_quote}</span>
                                  &nbsp;
                                  {`${
                                    this.state.left != null
                                      ? this.state.left
                                      : " "
                                  }${this.state.right}/${
                                    this.state.details.tender_unit != undefined
                                      ? this.state.details.tender_unit
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
                                      "marketplace.feeds.list_details.quantity"
                                    )}
                                  </strong>
                                </label>
                              </div>
                              <div className="col-6">
                                <label className="d-flex align-items-center">
                                  <span>{this.state.details.tb_quantity}</span>
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
                                      "marketplace.feeds.list_details.shipping_from"
                                    )}
                                  </strong>
                                </label>
                              </div>
                              <div className="col-6">
                                <label className="d-flex align-items-center">
                                  <span>{this.state.details.tb_bdcity_id}</span>
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="row align-items-center">
                              <div className="col-6">
                                <label className="d-flex">
                                  <strong>
                                    {t(
                                      "marketplace.feeds.list_details.delivery_type"
                                    )}
                                  </strong>
                                </label>
                              </div>
                              <div className="col-6">
                                <label className="d-flex align-items-center">
                                  <span>
                                    {this.state.details.tb_delivery_charges}{" "}
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>

                          {this.state.details.tb_status !== 2 ? (
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
                                data-user_id={this.state.details.tb_bduser_id}
                                // data-toggle='modal'
                                // data-target='#decline'
                              >
                                {t("marketplace.feeds.list_details.Withdraw")}
                              </button>
                            </>
                          ) : (
                            " "
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
                            <form onSubmit={this.handleSubmit}>
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
                                  onChange={this.handleChange8}
                                  id="message"
                                  name="tb_description"
                                  className="form-control"
                                  type="text"
                                  required
                                  // placeholder="message"
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
                            <form onSubmit={this.handleSubmit}>
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
                                    <label className="align-items-center metrial_offer">
                                      {`${
                                        this.state.left != null
                                          ? this.state.left
                                          : " "
                                      }${
                                        this.state.right != null
                                          ? this.state.right
                                          : ""
                                      }/${
                                        this.state.details.tender_unit !=
                                        undefined
                                          ? this.state.details.tender_unit
                                          : ""
                                      }`}
                                      {/* {`${this.state.left}${this.state.right}/${this.state.details.tender_unit}`} */}
                                      <input
                                        class="metrial_detail"
                                        onChange={this.handleChange1}
                                        className="form-control"
                                        maxLength="8"
                                        type="text"
                                        placeholder="0"
                                        value={this.state.tb_quote}
                                      />
                                      <p style={{ color: "#eb516d " }}>
                                        {this.state.tb_quote_err === true
                                          ? "Your quote is required"
                                          : null}
                                      </p>
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row align-items-center">
                                  <div className="col-5">
                                    <label className="d-flex">
                                      {t(
                                        "marketplace.feeds.list_details.quantity"
                                      )}
                                    </label>
                                  </div>
                                  <div className="col-7">
                                    <label className="align-items-center metrial_offer">
                                      {this.state.details.tender_unit}{" "}
                                      <input
                                        class="metrial_detail"
                                        onChange={this.handleChange2}
                                        className="form-control"
                                        maxLength="8"
                                        type="text"
                                        required
                                        placeholder="0"
                                        value={this.state.tb_quantity}
                                      />
                                      <p style={{ color: "#eb516d " }}>
                                        {this.state.tb_quantity_err === true
                                          ? "Quantity is required"
                                          : null}
                                      </p>
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <label htmlFor="shipping-from">
                                  {t(
                                    "marketplace.feeds.list_details.shipping_from"
                                  )}
                                </label>
                                <select
                                  onChange={this.handleChange3}
                                  id="shipping-from"
                                  className="form-control"
                                  required
                                >
                                  <option value="">
                                    {" "}
                                    {t(
                                      "marketplace.feeds.list_details.Select"
                                    )}{" "}
                                  </option>
                                  {this.state.cities?.map(
                                    ({ state_identifier, state_id }, index) => {
                                      if (state_identifier !== undefined) {
                                        return state_identifier ===
                                          "All regions" ? (
                                          <option value={state_id}>
                                            {" "}
                                            {t(
                                              "marketplace.feeds.list_details.All_regions"
                                            )}{" "}
                                          </option>
                                        ) : (
                                          <option key={index} value={state_id}>
                                            {" "}
                                            {state_identifier}{" "}
                                          </option>
                                        );
                                      }
                                    }
                                  )}
                                </select>
                                <p style={{ color: "#eb516d " }}>
                                  {this.state.tb_city_id_err === true
                                    ? "Shipping from is required"
                                    : null}
                                </p>
                                {/* <p style={{ color: "#eb516d " }}>
                                  {this.state.tb_city_id_err === true
                                    ? "City is required"
                                    : null}
                                </p> */}
                              </div>
                              {/* <div className="form-group">
                              <label htmlFor="delivery-type">
                                {t("list_details.delivery_type")}
                              </label>
                              <select
                                onChange={this.handleChange4}
                                id="delivery-type"
                                className="form-control"
                                value={this.state.tb_delivery_type}
                              >
                                <option>--Select--</option>
                                <option>Road</option>
                                <option>Flight</option>
                                <option>Ship</option>
                              </select>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.tb_delivery_type_err === true
                                  ? "Delivery type is required"
                                  : null}
                              </p>
                            </div> */}

                              {chunk ? chunk : null}
                              <div className="form-group">
                                <label htmlFor="message">
                                  {t("marketplace.feeds.list_details.message")}:
                                </label>
                                <textarea
                                  onChange={this.handleChange8}
                                  id="message"
                                  name="tb_description"
                                  className="form-control"
                                  required
                                  // placeholder="message"
                                  value={this.state.tb_description}
                                ></textarea>
                                <p style={{ color: "#eb516d " }}>
                                  {this.state.tb_description_err === true
                                    ? "Description is required"
                                    : null}
                                </p>
                              </div>
                              <div className="form-group">
                                <label htmlFor="attachment">
                                  {t(
                                    "marketplace.feeds.list_details.attachment"
                                  )}
                                </label>
                                <div className="file-select">
                                  {/* <input
                                    onChange={this.handleChange9}
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
                                      "image/jpeg",
                                      "image/png",
                                      "image/jpg",
                                      ".svg",
                                      ".docx",
                                      ".doc",
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
                                      <ProgressBar now={this.state.loaded1} />
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
                                  {this.state.attachment_err === true
                                    ? "Upload status is required"
                                    : null}
                                </p>
                                {this.state.attachment ? (
                                  <button
                                    type="button"
                                    onClick={this.Remove_img}
                                    className="btn btn-danger"
                                  >
                                    {" "}
                                    {t(
                                      "marketplace.feeds.list_details.Remove"
                                    )}{" "}
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                              {/* <div className="form-group">
                            <label htmlFor="main">{t("list_details.image")}</label>
                            <div className="file-select">
                              <input
                                onChange={this.handleChange10}
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
                                <p style={{ color: "#eb516d " }}>
                                  {this.state.agree_team_err === true
                                    ? "Accept all terms and conditions"
                                    : null}
                                </p>
                              </div>
                              <button
                                className="btn btn-secondary"
                                type="submit"
                                disabled={Submit_loding}
                              >
                                {Submit_loding ? (
                                  <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                  </Spinner>
                                ) : (
                                  ""
                                )}{" "}
                                {t(
                                  "marketplace.feeds.list_details.Submit_your_bid"
                                )}
                              </button>

                              {/* {this.state.loading_save ?
                                    (
                                      <Spinner animation="border" role="status" className="center">
                                        <span className="sr-only ">{t("feeds.search.Loading")}</span>
                                      </Spinner>
                                    ) : ( */}
                              <button
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
                                    ></i>{" "}
                                    {t(
                                      "marketplace.feeds.list_details.save_bid"
                                    )}{" "}
                                  </>
                                )}
                                {/*                                              
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

                                        {t("list_details.save_bid")} */}
                              </button>
                              {/* ) */}
                              {/* } */}
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

export default withTranslation()(Materialofferdetails);
