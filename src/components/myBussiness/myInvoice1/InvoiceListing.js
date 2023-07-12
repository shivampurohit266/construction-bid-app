import React, { Component } from "react";
import axios from "axios";
import Header from "../../shared/Header";
import BussinessSidebar from "../../shared/BussinessSidebar";
import SendInvoice from "../modals/SendInvoice";
import { url } from "../../../helper/helper";
import { Link } from "react-router-dom";
import Datetime from "react-datetime";
import moment from "moment";
import { withTranslation } from "react-i18next";
// import ReactDOM from "react-dom";
import Modal from "./model";
// import ReactToPrint from "react-to-print";
// import Print from '../modals/Print';
// import { data } from "jquery";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
// import PrintViewInvoice from "../modals/PrintViewInvoice";
import Pagination from "../pagination/pagination";
import SweetAlert from "react-bootstrap-sweetalert";
import Sidebar from "../../shared/Sidebar";

class InvoiceListing extends Component {
  feeds_search = [];

  state = {
    resources: [],
    search: null,
    // type: "",
    pdf: null,
    left: null,
    right: null,
    modal: false,
    name: "",
    modalInputName: "",
    paymentloding: false,
    modals: false,
    modalInputNames: "",
    loading: false,
    currentPage: 1,
    postsPerPage: 10,
    empty_pro: "",
    successDelete: false,
  };

  componentDidMount = async () => {
    this._isMounted = true;
    this.axiosCancelSource = axios.CancelToken.source();

    this.loadResources(this.axiosCancelSource);
    this.loadConfig(this.axiosCancelSource);
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.axiosCancelSource.cancel();
  }

  loadConfig = async (axiosCancelSource) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/config/currency`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        if (this._isMounted) {
          const { left, right } = result.data;
          this.setState({ left, right });
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          // //console.log("Request canceled", err.message);
        } else {
          //console.log(err.response);
        }
      });
  };

  loadResources = async (axiosCancelSource) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/invoice/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        // //console.log("result", result.data)
        if (this._isMounted) {
          const { data } = result.data;
          this.feeds_search = data;
          this.setState({ resources: data });
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          // //console.log("Request canceled", err.message);
        } else {
          //console.log(err.response);
        }
      });
  };

  searchDate = (event) => {
    //console.log("event", event);
    this.setState({ resources: this.feeds_search });
    if (event == "") {
      this.setState((prevstate) => ({
        resources: prevstate.resources,
      }));
    } else {
      this.setState((prevstate) => ({
        resources: prevstate.resources.filter((data) => {
          return data.date.includes(moment(event._d).format("DD-MM-YYYY"));
        }),
      }));
    }
    // this.setState((prevstate) => ({
    //   resources: prevstate.resources.filter((data) => {
    //     return data.date.includes(moment(event._d).format("DD-MM-YYYY"));
    //   }),
    // }));
  };

  searchSpace = (event) => {
    let keyword = event.target.value;
    this.setState({ search: keyword, currentPage: 1 });
  };

  downloadPDF = async (id) => {
    const token = await localStorage.getItem("token");
    await axios
      .get(`${url}/api/invoice/download/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        window.open(
          `${url}/images/marketplace/invoice/pdf/${result.data}`,
          "_blank"
        );
      })
      .catch((err) => {
        //console.log(err.response);
      });
  };

  sendPDF = async (id) => {
    const token = await localStorage.getItem("token");
    await axios
      .get(`${url}/api/invoice/download/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.setState({ pdf: result.data });
      })
      .catch((err) => {
        //console.log(err.response);
      });
  };

  modalOpen(id) {
    // //console.log("id====|>>", id)
    this.setState({ modal: true, payid: id });
  }

  modalClose() {
    this.setState({
      modalInputName: "",
      modal: false,
    });
  }

  modalOpen1(id) {
    this.setState({ modals: true, id: id });
  }

  modalClose1() {
    this.setState({
      modalInputNames: "",
      modals: false,
    });
  }

  payment = (id) => {
    this.setState({ paymentloding: true });
    const token = localStorage.getItem("token");

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append("payment_status", "1");
    formdata.append("id", id);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`${url}/api/invoice/updatepayment`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          paymentloding: false,
          modalInputName: "",
          modal: false,
          successDelete: true,
        });
      })
      .catch((error) => {
        //console.log('error', error)
        this.setState({ paymentloding: false });
      });

    this.loadResources(this.axiosCancelSource);
  };

  onConfirmError = () => {
    this.setState({ successDelete: false });
  };

  getdata = (id) => {
    const token = localStorage.getItem("token");
    axios
      .get(`${url}/api/invoice/get/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        //cancelToken: axiosCancelSource.token,
      })
      .then((res) => {
        if (this._isMounted) {
          const { data } = res.data.data;
          this.feeds_search = data;
          this.setState({ res: res.data.data });
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          //console.log("Request canceled", err.message);
        } else {
          //console.log(err.response);
        }
      });
  };

  paginate = (number) => {
    this.setState({
      currentPage: number,
    });
  };

  handleChange = (e) => {
    this.setState({
      postsPerPage: e.target.value,
    });
  };

  updteVlue = () => {
    this.setState({
      postsPerPage: 10,
    });
  };

  render() {
    const status_0 = this.state.resources?.filter((data) => data.sent == 1);
    const status_1 = this.state.resources?.filter((data) => data.sent == 0);

    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    // const currentPosts0 = status_0?.slice(indexOfFirstPost, indexOfLastPost);
    // const length = status_1 ? status_1.length : "";

    const { t } = this.props;
    const items =
      typeof status_0 !== "undefined"
        ? status_0?.filter((data) => {
            if (this.state.search == null) return data;
            else if (
              data.User_detail[0]?.email.includes(this.state.search) ||
              data.invoice_names
                .toLowerCase()
                .includes(this.state.search.toLowerCase()) ||
              data.sent
            ) {
              return data;
            }
          })
        : [];
    //console.log("items", items)

    const currentPosts0 = items?.slice(indexOfFirstPost, indexOfLastPost);
    const length = items ? items.length : "";

    const resource = currentPosts0
      ? currentPosts0?.map((resource, index) => (
          <tr
            key={index}
            style={{ background: index % 2 === 0 ? "#f3f3f3" : "white" }}
          >
            <td>
              {/* <div className="form-check">
            <input
            type="checkbox"
            className="form-check-input"
            id={`check2${index}`}
            />
            <label
              className="form-check-label"
              htmlFor={`check2${index}`}
            ></label>
          </div> */}
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.invoice.Serial_No")}</p>
                <p className="table-cell-value">{index + 1}</p>
              </div>
            </td>
            <td>
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.invoice.invoice")} #</p>
                <p className="table-cell-value">{resource.invoice_number}</p>
              </div>
            </td>
            <td>
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.invoice.invoice_title")}</p>
                <p className="table-cell-value">{resource.invoice_names}</p>
              </div>
            </td>
            <td>
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.invoice.account")} #</p>
                <p className="table-cell-value">{resource.acc_no}</p>
              </div>
            </td>
            <td>
              <div className="table-cell">
                <p className="table-cell-head">
                  {t("c_material_list.listing.type")}
                </p>
                <p className="table-cell-value">{resource.client_type}</p>
              </div>
            </td>
            <td>
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.invoice.email")}</p>
                <p className="table-cell-value">
                  {resource?.client_detail[0]?.email}
                </p>
              </div>
            </td>
            <td>
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.invoice.date")}</p>
                <p className="table-cell-value">{resource.date}</p>
              </div>
            </td>
            {/* <td>{resource.agreement_names}</td> */}
            <td>
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.invoice.total")}</p>
                <p className="table-cell-value">
                  {this.state.left} {resource.total} {this.state.right}
                </p>
              </div>
            </td>

            <td>
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.invoice.payment")}</p>
                <p className="table-cell-value">
                  <p className="action-btns-wrap">
                    {resource.payment_status == 0 ? (
                      <>
                        <button
                          className="btn btn-primary"
                          onClick={(e) => this.modalOpen(resource.id)}
                        >
                          {t("myBusiness.invoice.Pending")}
                        </button>
                      </>
                    ) : (
                      " "
                    )}
                    {resource.payment_status == 1 ? (
                      <button className="btn btn-light">
                        {" "}
                        {t("myBusiness.invoice.Payment_Paid")}{" "}
                      </button>
                    ) : (
                      ""
                    )}
                  </p>
                </p>
              </div>
            </td>

            <td>
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.invoice.Pdf")}</p>
                <p className="table-cell-value">
                  <button
                    onClick={() => this.downloadPDF(resource.id)}
                    className="btn btn-black"
                    style={{ marginRight: "10px" }}
                  >
                    <i className="fa fa-download fa-2x" aria-hidden="true"></i>{" "}
                    &nbsp;&nbsp;
                    <i className="fa fa-print fa-2x	" aria-hidden="true"></i>
                  </button>
                </p>
              </div>
            </td>

            <td>
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.invoice.Action")}</p>
                <p className="table-cell-value">
                  <button
                    onClick={() => this.sendPDF(resource.id)}
                    className="btn btn-light"
                    data-toggle="modal"
                    data-target="#send-invoice"
                  >
                    {" "}
                    <i className="icon-attachment"></i> {t("myBusiness.invoice.Send")}
                  </button>
                </p>
              </div>
            </td>
          </tr>
        ))
      : [];

    const item =
      typeof status_1 !== "undefined"
        ? status_1?.filter((data) => {
            if (this.state.search == null) return data;
            else if (
              data.client_detail[0]?.email.includes(this.state.search) ||
              data.invoice_names
                .toLowerCase()
                .includes(this.state.search.toLowerCase())
            ) {
              return data;
            }
          })
        : [];

    const currentPosts1 = item?.slice(indexOfFirstPost, indexOfLastPost);
    const length1 = item ? item.length : "";

    //console.log(currentPosts1 , "draft");
    const resource_draft = currentPosts1
      ? currentPosts1?.map((resource, index) => (
          <tr
            key={index}
            style={{ background: index % 2 === 0 ? "#f3f3f3" : "white" }}
          >
            <td>
              {/* <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`check2${index}`}
                />
                <label
                  className="form-check-label"
                  htmlFor={`check2${index}`}
                ></label>
              </div> */}
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.invoice.Serial_No")}</p>
                <p className="table-cell-value">{index + 1}</p>
              </div>
            </td>
            <td>
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.invoice.invoice")} #</p>
                <p className="table-cell-value">{resource.invoice_number}</p>
              </div>
            </td>
            <td>
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.invoice.prop_name")}</p>
                <p className="table-cell-value">{resource.invoice_names}</p>
              </div>
            </td>
            <td>
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.invoice.account")} #</p>
                <p className="table-cell-value">{resource.acc_no}</p>
              </div>
            </td>
            {/* <td>{resource.client_type}</td> */}
            {/* <td>{resource.User_detail[0].email}</td> */}
            <td>
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.invoice.date")}</p>
                <p className="table-cell-value">{resource.date}</p>
              </div>
            </td>

            <td>
              <div className="table-cell">
                <p className="table-cell-head"></p>
                <p className="table-cell-value">
                  <Link
                    className="btn btn-blue"
                    to={{
                      pathname: `/invoice/${resource.id}/draft`,
                      // state:  this.state.user_title ,
                      // state: {
                      //   data: this.state.user_title,
                      // }
                    }}
                  >
                    {" "}
                    {t("myBusiness.invoice.update_invoice")}{" "}
                  </Link>
                </p>
              </div>
            </td>
          </tr>
        ))
      : [];

    //console.log("currentPosts1", currentPosts1);

    const { successDelete } = this.state;

    return (
      <>
        {/* <div ref={(el) => (this.componentRef = el)}> */}
        {successDelete ? (
          <SweetAlert
            success
            closeOnClickOutside={true}
            title={t("myBusiness.invoice.SuccessPopup")}
            // title={t("invoice.success")}
            onConfirm={this.onConfirmError}
          >
            {/* {t("list_details.success")} */}
          </SweetAlert>
        ) : (
          ""
        )}

        {/* <Header active={"bussiness"} /> */}
        <div className="sidebar-toggle"></div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <Link
              to="/business-dashboard"
              className="breadcrumb-item active"
              aria-current="page"
            >
              {t("myBusiness.invoice.heading")}
            </Link>
            <li className="breadcrumb-item active" aria-current="page">
              {t("myBusiness.invoice.heading")}
            </li>
          </ol>
        </nav>
        <div className="main-content">
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className="page-content">
            <div className="container-fluid">
              <h3 className="head3">{t("myBusiness.invoice.title")}</h3>

              {/* <div className="card">
                <div className="card-body">
                  <div className="filter">
                    <div className="row align-items-center">
                      <div className="col-lg-4 col-md-6">
                        <div className="form-group">
                          <label htmlFor="date">{t("myproposal.date")}</label>
                          <Datetime
                            id="date"
                            name="date"
                            onChange={(date) => this.searchDate(date)}
                            dateFormat="DD-MM-YYYY"
                            timeFormat={false}
                          />
                        </div>
                      </div>
                      <div className="col-lg-5 col-md-6">
                        <div className="form-group">
                          <label htmlFor="client">
                            {`${t("invoice.client")} / ${t("invoice.name")}`}
                          </label>
                          <input
                            id="client"
                            onChange={this.searchSpace}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* <div className="card"> */}
              {/* <div className="card-header">
                  <h2 className="head2">{t("invoice.heading")}</h2>
                  <div className="btn-group">
                    <Link className="btn btn-blue text-uppercase" to="/invoice">
                      {t("c_material_list.listing.create")}
                    </Link>
                  </div>
                </div> */}

              {/* <div className="card-body">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr style={{ fontSize: "15px" }}>
                          <th style={{ width: "50px" }}>
                            <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="check1"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="check1"
                              ></label>
                            </div>
                          </th>
                          <th>{t("invoice.invoice")} #</th>
                          <th>{t("myproposal.prop_name")}</th>
                          <th>{t("invoice.account")} #</th>
                          <th>{t("c_material_list.listing.type")} </th>
                          <th>{t("account.email")}</th>
                          <th>{t("myproposal.date")}</th>
                          <th>{t("invoice.total")}</th>
                          <th>{t("invoice.payment")}</th>
                        </tr>
                      </thead>
                      <tbody> {resource} </tbody>
                    </table>
                  </div>
                  <SendInvoice pdf={this.state.pdf} />
                </div> */}

              <Tabs>
                <div className="card">
                  <div className="card custome_tabs_agre">
                    <div className="row">
                      <div className=" col-lg-4 col-md-4 col-sm-12">
                        <TabList>
                          <Tab onClick={(e) => this.updteVlue()}>
                            {" "}
                            {t("myBusiness.invoice.heading")}{" "}
                          </Tab>
                          <Tab onClick={(e) => this.updteVlue()}>
                            {" "}
                            {t("myBusiness.invoice.draft")}{" "}
                          </Tab>
                        </TabList>
                      </div>

                      <div className="col-sm-8">
                        <div className="filter">
                          <div className="row align-items-center">
                            <div className="col-lg-5 col-md-6">
                              <div className="form-group">
                                <label htmlFor="client">
                                  {`${t("myBusiness.invoice.client")} / ${t(
                                    "myBusiness.invoice.name"
                                  )}`}
                                </label>
                                <input
                                  id="client"
                                  onChange={this.searchSpace}
                                  type="search"
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="form-group">
                                <label htmlFor="date">
                                  {t("myBusiness.invoice.date")}
                                </label>
                                <Datetime
                                  id="date"
                                  name="date"
                                  onChange={(date) => this.searchDate(date)}
                                  dateFormat="DD-MM-YYYY"
                                  timeFormat={false}
                                  closeOnSelect={true}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <TabPanel>
                  <div className="card">
                    <div className="card-header">
                      <h2 className="head2">{t("myBusiness.invoice.heading")}</h2>
                      <div className="btn-group">
                        <Link
                          className="btn btn-blue text-uppercase"
                          to="/invoice-tabs"
                        >
                          {t("myBusiness.invoice.create")}
                        </Link>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table custom-table">
                          <thead>
                            <tr>
                              <th width="6%">
                                {/* <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="check1"
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="check1"
                                  ></label>
                                </div> */}
                                {t("myBusiness.invoice.Serial_No")}
                              </th>
                              <th>{t("myBusiness.invoice.invoice")} #</th>
                              <th>{t("myBusiness.invoice.invoice_title")}</th>
                              <th>{t("myBusiness.invoice.account")} #</th>
                              <th>{t("myBusiness.invoice.type")} </th>
                              <th>{t("myBusiness.invoice.email")}</th>
                              <th>{t("myBusiness.invoice.date")}</th>
                              <th>{t("myBusiness.invoice.total")}</th>
                              <th>{t("myBusiness.invoice.payment")}</th>
                              <th>{t("myBusiness.invoice.Pdf")}</th>
                              <th>{t("myBusiness.invoice.Action")}</th>
                            </tr>
                          </thead>
                          <tbody> {resource} </tbody>
                        </table>

                        {length > 10 ? (
                          <div className="row" style={{ width: "100%" }}>
                            {/* <div className="col-md-4" >
                              <h3 className="total_rec"> Total {length}  </h3>
                            </div> */}

                            <div className="col-md-6">
                              <h3 className="total_rec"> Show once </h3>
                              <select
                                id="dropdown_custom"
                                onChange={this.handleChange}
                              >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="40">40</option>
                                <option value="80">80</option>
                                <option value="100">100</option>
                              </select>
                            </div>
                            <div className="col-md-6">
                              <Pagination
                                postsPerPage={this.state.postsPerPage}
                                totalPosts={length}
                                paginate={this.paginate}
                                currentPage={this.state.currentPage}
                              />
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <SendInvoice
                        pdf={this.state.pdf}
                        loadResources={this.loadResources}
                      />
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="card">
                    <div className="card-header">
                      <h2 className="head2">{t("myBusiness.invoice.draft")} </h2>
                      <div className="btn-group">
                        <Link
                          className="btn btn-blue text-uppercase"
                          to="/invoice-tabs"
                        >
                          {t("myBusiness.invoice.create")}
                        </Link>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table custom-table">
                          <thead>
                            <tr>
                              <th width="6%">
                                {/* <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="check1"
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="check1"
                                  ></label>
                                </div> */}
                                {t("account.Serial_No")}
                              </th>
                              <th>{t("myBusiness.invoice.invoice")} #</th>
                              <th>{t("myBusiness.invoice.prop_name")}</th>
                              <th>{t("myBusiness.invoice.account")} #</th>
                              {/* <th>{t("c_material_list.listing.type")} </th>
                                <th>{t("account.email")}</th> */}
                              <th>{t("myBusiness.invoice.date")}</th>
                              {/* <th>{t("invoice.total")}</th> */}
                              {/* <th>{t("invoice.payment")}</th> */}
                            </tr>
                          </thead>
                          <tbody> {resource_draft} </tbody>
                        </table>

                        {length1 > 10 ? (
                          <div className="row" style={{ width: "100%" }}>
                            {/* <div className="col-md-4" >
                              <h3 className="total_rec"> Total {length1}  </h3>
                            </div> */}
                            <div className="col-md-6">
                              <h3 className="total_rec"> Show once </h3>
                              <select
                                id="dropdown_custom"
                                onChange={this.handleChange}
                              >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="40">40</option>
                                <option value="80">80</option>
                                <option value="100">100</option>
                              </select>
                            </div>
                            <div className="col-md-6">
                              <Pagination
                                postsPerPage={this.state.postsPerPage}
                                totalPosts={length1}
                                paginate={this.paginate}
                                currentPage={this.state.currentPage}
                              />
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <SendInvoice pdf={this.state.pdf} />
                    </div>
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>

        <Modal
          className="custom_model"
          style={{ backgroung: "white" }}
          show={this.state.modal}
          handleClose={(e) => this.modalClose(e)}
          centered
        >
          <br />
          <h2> {t("myBusiness.invoice.do_youPay")} </h2>
          <div className="row buttonsDiv">
            <div className="col-md-6">
              <button
                className="btn btn-primary button"
                disabled={this.state.paymentloding}
                onClick={() => this.payment(this.state.payid)}
              >
                {this.state.paymentloding ? (
                  <i className="fa fa-spinner fa-spin"></i>
                ) : (
                  ""
                )}{" "}
                {t("myBusiness.invoice.Yes")}
              </button>
            </div>
            <div className="col-md-6">
              <button
                className="btn btn-secondary button"
                onClick={(e) => this.modalClose(e)}
              >
                {t("myBusiness.invoice.NO")}
              </button>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default withTranslation()(InvoiceListing);
