import React, { Component } from "react";
import axios from "axios";
import { url } from "../../../helper/helper";
import Header from "../../shared/Header";
import BussinessSidebar from "../../shared/BussinessSidebar";
import { Link } from "react-router-dom";
// import $ from 'jquery';
import { withTranslation } from "react-i18next";
import Breadcrumb from "../../shared/Breadcrumb";
import Sidebar from "../../shared/Sidebar";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

class BusinessProposal extends Component {
  state = {
    feeds: [],
    drafts: [],
    notification_bid_id: 0,
    notification_sender_id: 0,
    proposal_client_id: 0,
    proposal_request_id: 0,
    draft: "",
    user_title: "",
    viewRequest: false,
    viewDraft: false,
  };

  handleRequestModalClose = () => {
    this.setState({
      viewRequest: !this.state.viewRequest,
      viewDraft: false,
      proposal_request_id: 0,
    });
  };

  handleDraftModalClose = () => {
    this.setState({
      viewDraft: !this.state.viewDraft,
      viewRequest: false,
      notification_bid_id: 0,
      notification_sender_id: 0,
    });
  };

  componentDidMount = async () => {
    this._isMounted = true;
    this.axiosCancelSource = axios.CancelToken.source();

    this.loadNotif(this.axiosCancelSource);
    this.loadDrafts(this.axiosCancelSource);
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.axiosCancelSource.cancel();
  }

  loadNotif = async (axiosCancelSource) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/request_contracts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        const data = result.data?.data.filter(
          (x) =>
            x.notification_sender_id != localStorage.getItem("Login_user_id")
        );
        // //console.log("result=========>", result.data.data)
        if (this._isMounted) {
          this.setState({ feeds: data });
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

  loadDrafts = async (axiosCancelSource) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/proposal/get/drafts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        if (this._isMounted) {
          this.setState({ drafts: result.data });
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

  handleNameChange = (e) => {
    // //console.log("e.target.value ", e.target.value)
    if (e.target.value !== "") {
      const { selectedIndex } = e.target.options;
      const { feeds } = this.state;
      const { notification_bid_id, notification_sender_id } =
        feeds[selectedIndex - 1];
      // //console.log("==========",this.state.feeds)
      this.setState({
        notification_bid_id,
        notification_sender_id,
        user_title: e.target.value,
      });
    } else {
      this.setState({
        notification_bid_id: 0,
        notification_sender_id: 0,
        user_title: e.target.value,
      });
    }
  };

  handleNameChange1 = (e) => {
    if (e.target.value !== "") {
      const { selectedIndex } = e.target.options;
      const { drafts } = this.state;
      const { proposal_client_id, proposal_request_id, draft } =
        drafts[selectedIndex - 1];
      this.setState({ proposal_client_id, proposal_request_id, draft });
    } else {
      this.setState({
        proposal_client_id: 0,
        proposal_request_id: 0,
        draft: 0,
      });
    }
  };

  // onChangeUser(event) {
  //   //console.log(event.target.value)
  //   return event.target.value;
  // }

  render() {
    const { t } = this.props;
    // //console.log("this.state.feeds", this.state.feeds)

    //const Api_data =  this.state.feeds.filter((x) => x.bid_status != 1 )
    const Api_data = this.state.feeds;
    // var myDiv = document.querySelector('#tender_title');

    return (
      <div>
        {/* <Header active={"bussiness"} /> */}
        <Breadcrumb>
          <Link
            to="/business-dashboard"
            className="breadcrumb-item active"
            aria-current="page"
          >
            {t("myBusiness.offer.heading")}
          </Link>
          <Link
            to="/proposal-listing"
            className="breadcrumb-item active"
            aria-current="page"
          >
            {t("myBusiness.offer.proposal")}
          </Link>
          <li className="breadcrumb-item active" aria-current="page">
            {t("myBusiness.offer.create")}
          </li>
        </Breadcrumb>
        <div className="main-content">
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className="page-content">
            <div className="container-fluid">
              <div
                className="card"
                style={{ maxWidth: "1120px", maxHeight: "70vh" }}
              >
                <div className="card-body">
                  <ul className="nav tablist">
                    <li className="nav-item">
                      <Link className="nav-link" to="/business-proposal-create">
                        {t("myBusiness.offer.scratch")}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <button
                        className="nav-link"
                        type="button"
                        onClick={() => this.handleRequestModalClose()}
                      >
                        {t("myBusiness.offer.prop_request")}
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="nav-link"
                        type="button"
                        onClick={() => this.handleDraftModalClose()}
                      >
                        {t("myBusiness.offer.prop_upd")}
                      </button>
                    </li>
                  </ul>
                  {/* <Modal
                    isOpen={this.state.viewRequest}
                    toggle={() => this.handleRequestModalClose()}
                    className={"modalPropu"}
                    centered
                  >
                    <ModalHeader
                      toggle={() => this.handleRequestModalClose()}
                    ></ModalHeader>
                    <ModalBody>
                      <div className="form-group">
                        <label htmlFor="select-proposal" />
                        {t("myproposal.Select_proposal_agreement")}
                        <div className="row">
                          <div className="col-md-8">
                            <div
                              onChange={this.handleNameChange}
                              id="select-agreement"
                            >
                              <div>
                                <select
                                  className="form-control"
                                  onChange={this.onChangeUser}
                                >
                                  <option value="">
                                    {" "}
                                    {t("myproposal.Select")}{" "}
                                  </option>
                                  {Api_data && Api_data.length > 0 && (
                                    <>
                                      {Api_data ? (
                                        <>
                                          {Api_data.map((user, index) => {
                                            return (
                                              <>
                                                {" "}
                                                <option key={index} id={index}>
                                                  {user.tender_title}
                                                </option>{" "}
                                              </>
                                            );
                                          })}{" "}
                                        </>
                                      ) : (
                                        []
                                      )}
                                    </>
                                  )}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 mt-md-0 mt-4">
                            {this.state.notification_bid_id > 0 ||
                            this.state.notification_sender_id > 0 ? (
                              <Link
                                className="btn btn-blue"
                                to={{
                                  pathname: `/business-proposal-create/${this.state.notification_bid_id}/${this.state.notification_sender_id}`,                     
                                  state: {
                                    data: this.state.user_title,
                                  },
                                }}
                              >
                                {t("myproposal.Create_Proposal")}
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </ModalBody>
                  </Modal> */}
                  {/* <Modal
                    isOpen={this.state.viewDraft}
                    toggle={() => this.handleDraftModalClose()}
                    className={"modalPropu"}
                    centered
                  >
                    <ModalHeader
                      toggle={() => this.handleDraftModalClose()}
                    ></ModalHeader>
                    <ModalBody>
                      <div className="form-group">
                        <label htmlFor="select-proposal" />
                        {t("myproposal.Select_proposal_agreement")}
                        <div className="row">
                          <div className="col-md-8">
                            <select
                              onChange={this.handleNameChange1}
                              id="select-agreement"
                              className="form-control"
                            >
                              <option value="">
                                {" "}
                                {t("myproposal.Select")}{" "}
                              </option>
                              {typeof this.state.drafts !== "string"
                                ? this.state.drafts.map(
                                    (
                                      {
                                        proposal_request_id,
                                        proposal_client_type,
                                        proposal_names,
                                      },
                                      index
                                    ) => (
                                      <option
                                        key={index}
                                      >{`${proposal_names}`}</option>
                                    )
                                  )
                                : []}
                            </select>
                          </div>
                          <div className="col-md-4 mt-md-0 mt-4">
                            {this.state.proposal_request_id > 0 ? (
                              <Link
                                className="btn btn-blue"
                                to={{
                                  pathname: `/business-proposal-create/${this.state.proposal_request_id}/${this.state.proposal_client_id}/${this.state.draft}`,
                                }}
                              >
                                {t("myproposal.Update_Proposal")}
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </ModalBody>
                  </Modal> */}
                </div>
              </div>
              {this.state.viewRequest && (
                 <div
                 className="card"
                 style={{ maxWidth: "1120px", maxHeight: "70vh" }}
               >
                 <div className="card-body">
                <div className="form-group">
                  <label htmlFor="select-proposal" />
                  {t("myBusiness.offer.Select_proposal_agreement")}
                  <div className="row">
                    <div className="col-md-8">
                      <div
                        onChange={this.handleNameChange}
                        id="select-agreement"
                      >
                        <div>
                          <select
                            className="form-control"
                            onChange={this.onChangeUser}
                          >
                            <option value=""> {t("myBusiness.offer.Select_from_req")} </option>
                            {Api_data && Api_data.length > 0 && (
                              <>
                                {Api_data ? (
                                  <>
                                    {Api_data.map((user, index) => {
                                      return (
                                        <>
                                          {" "}
                                          <option key={index} id={index}>
                                            {user.tender_title}
                                          </option>{" "}
                                        </>
                                      );
                                    })}{" "}
                                  </>
                                ) : (
                                  []
                                )}
                              </>
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mt-md-0 mt-4">
                      {this.state.notification_bid_id > 0 ||
                      this.state.notification_sender_id > 0 ? (
                        <Link
                          className="btn btn-blue"
                          to={{
                            pathname: `/business-proposal-create/${this.state.notification_bid_id}/${this.state.notification_sender_id}`,
                            state: {
                              data: this.state.user_title,
                            },
                          }}
                        >
                          {t("myBusiness.offer.Create_Proposal")}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
                </div>
                </div>
              )}
              {this.state.viewDraft && (
                 <div
                 className="card"
                 style={{ maxWidth: "1120px", maxHeight: "70vh" }}
               >
                 <div className="card-body">
                <div className="form-group">
                  <label htmlFor="select-proposal" />
                  {t("myBusiness.offer.Select_proposal_agreement")}
                  <div className="row">
                    <div className="col-md-8">
                      <select
                        onChange={this.handleNameChange1}
                        id="select-agreement"
                        className="form-control"
                      >
                        <option value=""> {t("myBusiness.offer.Select_from_draft")} </option>
                        {typeof this.state.drafts !== "string"
                          ? this.state.drafts.map(
                              (
                                {
                                  proposal_request_id,
                                  proposal_client_type,
                                  proposal_names,
                                },
                                index
                              ) => (
                                <option
                                  key={index}
                                >{`${proposal_names}`}</option>
                              )
                            )
                          : []}
                      </select>
                    </div>
                    <div className="col-md-4 mt-md-0 mt-4">
                      {this.state.proposal_request_id > 0 ? (
                        <Link
                          className="btn btn-blue"
                          to={{
                            pathname: `/business-proposal-create/${this.state.proposal_request_id}/${this.state.proposal_client_id}/${this.state.draft}`,
                          }}
                        >
                          {t("myBusiness.offer.Update_Proposal")}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
                </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(BusinessProposal);
