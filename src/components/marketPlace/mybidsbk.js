import React, { Component } from "react";
import axios from "axios";
import Header from "../shared/Header";
import Sidebar from "../shared/Sidebar";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { Helper, url } from "../../helper/helper";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";

class Mybid extends Component {
  feeds_search = [];
  state = {
    feeds: [],
    status: "",
    search: "",
    proposal_submitted: false,

    loaded: false,
    left: null,
    right: null,
  };

  componentDidMount = () => {
    this._isMounted = true;
    this.axiosCancelSource = axios.CancelToken.source();

    this.loadNotif(this.axiosCancelSource);
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
          //console.log("Request canceled", err.message);
        } else {
          //console.log(err.response);
        }
      });
  };

  loadNotif = async (axiosCancelSource) => {
    const token = await localStorage.getItem("token");
    const response = await axios.get(`${url}/api/contracts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cancelToken: axiosCancelSource.token,
    });

    if (response.status === 200) {
      this.setState({ feeds: response.data.data, loaded: true });
      this.feeds_search = this.state.feeds;
    }
  };

  handleStatus = async (id, status) => {
    this.setState({ loaded: false });
    const token = await localStorage.getItem("token");
    const response = await axios.post(
      `${url}/api/contracts/status/${id}/${status}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200 && status === 3) {
      this.setState({ proposal_submitted: true });
    }

    this.loadNotif(this.axiosCancelSource);
  };

  handleChange = (event) => {
    this.setState(
      { feeds: this.feeds_search, status: event.target.value },
      () => {
        if (this.state.status == "--Select--") {
          this.loadNotif(this.axiosCancelSource);
        }
        this.setState((prevstate) => ({
          feeds: prevstate.feeds.filter((data) => {
            return data.tender_status == this.state.status;
          }),
        }));
      }
    );
  };

  handleSearch = (event) => {
    this.setState(
      { feeds: this.feeds_search, search: event.target.value },
      () => {
        if (this.state.search == "--Select--") {
          this.loadNotif(this.axiosCancelSource);
        }
        this.setState((prevstate) => ({
          feeds: prevstate.feeds.filter((data) => {
            if (this.state.search == "Work" || this.state.search == "Material")
              return data.tender_category_type.includes(this.state.search);

            return data.tender_type.includes(this.state.search);
          }),
        }));
      }
    );
  };

  render() {
    const { t, i18n } = this.props;

    let alert;
    if (this.state.proposal_submitted === true) {
      alert = (
        <Alert variant="success" style={{ fontSize: "13px" }}>
          {t("my_contracts.Proposal_Requested")}
        </Alert>
      );
    }

    const feed = this.state.feeds
      ? this.state.feeds.map((feed) => (
        <div className="card mb-1">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6">
                <p>
                  {feed.tender_title}
                  <br />
                  <span className="date">{feed.created_at} </span>&nbsp;
                  <span className="date"> {t("my_contracts.Material/Work")}  </span>&nbsp;
                  <span className="date"> {t("my_contracts.Request/Offer")} </span>
                </p>
              </div>
              <div className="col-lg-3">
                <p>
                  {feed.tender_status === 4 ? (
                    <span className="badge badge-tag badge-danger"> {t("my_contracts.Pending")} </span>
                  ) : feed.tender_status === 3 ? (
                    <span className="badge badge-tag badge-danger"> {t("my_contracts.Complete")}</span>
                  ) : feed.tender_status === 5 ? (
                    <span className="badge badge-tag badge-danger">{t("my_contracts.Cancel")}</span>
                  ) : feed.tender_status === 6 ? (
                    <div>
                      <span className="badge badge-tag badge-info"> {t("my_contracts.Ongoing")}</span>
                      <span className="badge badge-tag badge-secondary">
                        {t("my_contracts.Sent")}
                      </span>
                    </div>
                  ) : (
                    <span className="badge badge-tag badge-info">{t("my_contracts.Ongoing")}</span>
                  )}
                  {/* <span className="badge badge-tag badge-secondary">My Contract</span>
                        <span className="badge badge-tag badge-primary">My Job</span>
                        <span className="badge badge-tag badge-info">Ongoing</span>
                        <span className="badge badge-tag badge-success">Complete</span>
                        <span className="badge badge-tag badge-warning">Pending</span>
                        <span className="badge badge-tag badge-danger">Cancel</span> */}
                </p>
              </div>
              <div className="col-lg-3">
                {feed.bid_status !== 3 || feed.bid_status === 1 ? (
                  feed.sender_isLogged &&
                    feed.bid_status !== 2 &&
                    feed.sender_isLogged &&
                    feed.tender_status !== 5 &&
                    feed.sender_isLogged &&
                    feed.tender_status !== 6 ? (
                    <button
                      href="#"
                      onClick={() =>
                        this.handleStatus(feed.notification_bid_id, 3)
                      }
                      className="btn btn-outline-dark mt-3 mr-5"
                    >
                      {t("my_contracts.request_proposal")}
                    </button>
                  ) : null
                ) : null}

                {feed.bid_status === 3 &&
                  feed.tender_status !== 6 &&
                  !feed.sender_isLogged ? (
                  <Link
                    className="btn btn-outline-dark mt-3 mr-5"
                    to={{
                      pathname: `/business-proposal-create/${feed.notification_bid_id}/${feed.notification_sender_id}`,
                    }}
                  >
                    {t("my_contracts.submit_proposal")}
                  </Link>
                ) : null}
                {feed.tender_status === 5 ? null : (
                  <button
                    href="#"
                    onClick={() =>
                      this.handleStatus(feed.notification_bid_id, 4)
                    }
                    className="btn btn-gray mt-3"
                  >
                    {t("my_contracts.cancel")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))
      : [];

    return (
      <div>
        {/* <Header active={"market"} /> */}
        <div className="sidebar-toggle"></div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <Link
              to="/feeds"
              className="breadcrumb-item active"
              aria-current="page"
            >
              {t("header.marketplace")}
            </Link>
            <li className="breadcrumb-item active" aria-current="page">
              {t("my_contracts.title")}
            </li>
          </ol>
        </nav>
        <div className="main-content">
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className="page-content">
            <div className="container-fluid">
              {alert ? alert : null}
              <h3 className="head3"> {t("my_contracts.My_Bids")} </h3>
              <div className="card">
                <div className="card-body">
                  <div className="filter">
                    <div className="row align-items-center">

                    </div>
                  </div>
                </div>
              </div>
              {this.state.loaded === false ? (
                <Spinner animation="border" role="status">
                  <span className="sr-only">{t("my_contracts.Loading")} </span>
                </Spinner>
              ) : (
                feed
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Mybid);
