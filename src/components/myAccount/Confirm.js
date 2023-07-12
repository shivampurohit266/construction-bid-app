import React, { Component } from "react";
import axios from "axios";
import { url } from "../../helper/helper";
import Header from "../../components/shared/Header";
import { Link } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import { withTranslation } from "react-i18next";
import "./confirm.css";
import { Translation } from "react-i18next";

// import BussinessSidebar from "../../components/shared/BussinessSidebar";
// import {  Modal , Button} from 'react-bootstrap';
// import SweetAlert from 'react-bootstrap-sweetalert';
// import Alert from "react-bootstrap/Alert";

const defaultState = {
  email: null,
  emailError: null,
};

class Confirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      alert: null,
      show_m: false,
      email: "",
      defaultState,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // handleClose = () => {
  //     this.setState({
  //         show: false
  //     });
  // }
  // handleShow = () => {
  //     this.setState({
  //         show: true
  //     });
  // }

  componentDidMount = () => {
    this.loadData();
    this.myRef = React.createRef();
  };

  loadData = async () => {
    const token = await localStorage.getItem("token");
    const { data } = await axios.get(`${url}/api/account`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //console.log(data, "data");
    this.setState({
      //   logo_preview: data.company_logo,
      user_id: data[0].user_id,
      first_name: data[0].first_name,
      last_name: data[0].last_name,
      email: data[0].email,
      //   company_id: data.company_id
      //     ? data.company_id
      //     : "_" + Math.random().toString(36).substr(2, 9),
      //   address: data.address,
      //   phone: data.phone,
      //   zip: data.zip,
      // company_website: data.company_website == "null" ? "" : data.company_website,
      //   company_website:data.company_website,
      //   work: data.work,
      //   insurance: data.insurance,
      //   agreement_material_guarantee: data.agreement_material_guarantee,
      //   agreement_work_guarantee: data.agreement_work_guarantee,
      //   agreement_insurances: data.agreement_insurances,
      //   agreement_panelty: data.agreement_panelty,
    });
  };

  onCancel = () => {
    this.setState({
      alert: false,
    });
  };

  onConfirm = () => {
    this.setState({
      alert: true,
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
  handleChangeEmail = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.validate()) {
      //console.log(this.state.email);
      this.setState(defaultState);

      let id = this.props.match.params.id;
      const token = localStorage.getItem("token");
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      var formdata = new FormData();
      formdata.append("email", this.state.email);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      fetch(`${url}/api/prousersemail/${id}`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          if (res.email == "The email has already been taken.") {
            this.setState({ emailError: res.email });
            this.loadData();
          }
          if (res == "Email updated successfuly") {
            this.setState({ succes: res });
            this.props.history.push("/myaccount");
          }
        })
        .catch((error) => console.log("error", error));
    }
  };

  render() {
    const { t } = this.props;
    return (
      <div>
        {/* <Header active={"bussiness"} /> */}
        <div className="sidebar-toggle"></div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <Link
              to="/business-dashboard"
              className="breadcrumb-item active"
              aria-current="page"
            >
              {t("mycustomer.heading")}
            </Link>
            <Link
              to="/agreement-listing"
              className="breadcrumb-item active"
              aria-current="page"
            >
              {t("b_sidebar.agreement.agreement")}
            </Link>
            <li className="breadcrumb-item active" aria-current="page">
              {t("c_material_list.listing.create")}
            </li>
          </ol>
        </nav>
        <div className="main-content">
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div ref={this.myRef} className="page-content">
            {alert ? alert : null}

            {/* <div className="outer_dev">
                        <div className="row custom_box">
                            <div className="aside">
                                {
                                    this.state.show_m ?
                                        <SweetAlert success title="Good job!" onConfirm={this.onConfirm} onCancel={this.onCancel}>
                                            <div style={{ color: "black" }}>
                                                You clicked the button!
                                            </div>
                                        </SweetAlert> : ""}
                            </div>
                        </div>
                    </div> */}

            {/* Email Confirmation */}
            <div className="container-fluid">
              <Translation>
                {(t) => (
                  <h3 style={{ paddingBottom: "1%" }} className="head3">
                    {t("account.email")}
                  </h3>
                )}
              </Translation>
              <div className="card" style={{ maxWidth: "1120px" }}>
                <form onSubmit={this.handleSubmit}>
                  <div className="card-body">
                    <div className="mt-3"></div>

                    <div className="row">
                      <div className="col-xl-4 col-lg-5 col-md-6 ">
                        <div className="form-group">
                          <Translation>
                            {(t) => (
                              <label htmlFor="email">
                                {t("account.email")}
                              </label>
                            )}
                          </Translation>
                          <input
                            name="email"
                            onChange={this.handleChangeEmail}
                            id="email"
                            value={this.state.email || ""}
                            className="form-control"
                            type="text"
                            // disabled="disabled"
                          />
                        </div>
                        <span className="text-danger">
                          {this.state.emailError}
                        </span>
                        <span className="text-succes">{this.state.succes}</span>
                      </div>
                    </div>
                    <div>
                      <div className="form-group">
                        <label className="d-none d-xl-block">&nbsp;</label>
                        <div className="clear"></div>

                        <button className="btn btn-success">
                          {t("account.Update_Email")}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleClose}>
                            Save Changes
                       </Button>
                    </Modal.Footer>
                    </Modal> */}
        </div>
      </div>
    );
  }
}

export default withTranslation()(Confirm);
