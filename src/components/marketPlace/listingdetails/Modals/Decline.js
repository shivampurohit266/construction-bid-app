import React, { Component } from "react";
// import axios from "axios";
import { url } from "../../../../helper/helper";
import { withTranslation } from "react-i18next";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import Spinner from "react-bootstrap/Spinner";
import SweetAlert from "react-bootstrap-sweetalert";
import { Link } from "react-router-dom";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

class Decline extends Component {
  state = {
    tb_message: "",
    tb_reason: "",
    tb_feedback: "",
    loading: false,
    successDelete: false,
    deleteValid: false,
  };

  handleChange = (event) => {
    if (event.target.value != "--Select--") {
      const { name, value } = event.target;
      this.setState({ [name]: value });
    }
    //console.log(event.target.name);
    if (event.target.name == "tb_reason") {
      this.setState({ tb_reason_err: "" });
    }
    if (event.target.name == "tb_message") {
      this.setState({ tb_message_err: "" });
    }
    if (event.target.name == "tb_feedback") {
      this.setState({ tb_feedback_err: "" });
    }
  };

  handleCheck = () => {
    this.setState({ agreed: !this.state.agreed });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const token = await localStorage.getItem("token");
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    var formdata = new FormData();
    formdata.append("tb_message", this.state.tb_message);
    formdata.append("tb_reason", this.state.tb_reason);
    formdata.append("tb_feedback", this.state.tb_feedback);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    const ids = this.props.userId
      ? `/${this.props.userId}`
      : "";
    fetch(`${url}/api/bid/decline/${this.props.id}/${this.props.userId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        //console.log(result);
        if (result.error) {
          this.setState({ loading: false });
        }
        if (result.error?.tb_feedback) {
          this.setState({
            tb_feedback_err: "The feedback field is required.",
          });
        }
        if (result.error?.tb_message) {
          this.setState({
            tb_message_err: "The message field is required.",
          });
        }
        if (result.error?.tb_reason) {
          this.setState({
            tb_reason_err: "The reason field is required.",
          });
        }
        if (result?.data) {
          NotificationManager.success("Status updated success ");
          this.setState({
            tb_message: "",
            successDelete: true,
            tb_reason: "",
            tb_feedback: "",
            tb_reason_err: "",
            tb_message_err: "",
            tb_feedback_err: "",
          });
          window.location.reload();
          // this.setState({loading : false})
        }
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false, deleteValid: true });
        //console.log('error', error)
      });
  };

  onConfirmError = () => {
    this.setState({ successDelete: false, deleteValid: false });
  };

  render() {
    const { t, show, handleClose } = this.props;
    const { deleteValid, successDelete } = this.state;
    console.log("=-=", this.props.id);
    return (
      <div>
        {/* Modal  */}

        {deleteValid ? (
          <SweetAlert
            warning
            closeOnClickOutside={true}
            title="something wants to wrong"
            onConfirm={this.onConfirmError}
          >
            {t("mycustomer.You_will")}
          </SweetAlert>
        ) : (
          ""
        )}

        {successDelete ? (
          <SweetAlert
            success
            closeOnClickOutside={true}
            title={t("login.SuccessPopup")}
            onConfirm={this.onConfirmError}
          >
            {/* {t("list_details.success")} */}
          </SweetAlert>
        ) : (
          ""
        )}

        {/* <div
          className="modal fade"
          id="decline"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        > */}
        <Modal
          isOpen={show}
          toggle={() => handleClose()}
          className={"modalPropu"}
          centered
        >
          <NotificationContainer />

          <ModalHeader toggle={() => handleClose()}></ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-md-11">
                <input
                  ref="tb_user_id"
                  name="tb_user_id"
                  id="tb_user_id"
                  className="form-control"
                  type="hidden"
                />
                <div className="form-group">
                  <label htmlFor="reason">{t("modals.decline.reason")}</label>
                  <select
                    name="tb_reason"
                    onChange={this.handleChange}
                    id="reason"
                    required
                    className="form-control"
                  >
                    <option value="">{t("modals.decline.select")}</option>
                    <option>{t("modals.decline.Applied_by_mistake")}</option>
                    <option>
                      {t("modals.decline.Scheduling_conflict_with_client")}
                    </option>
                    <option>{t("modals.decline.Unresponsive_client")} </option>
                    <option>
                      {t("modals.decline.Inappropriate_client_behavior")}
                    </option>
                    <option>{t("modals.decline.Don't_want")}</option>
                  </select>
                  {this.state.tb_reason_err ? (
                    <p style={{ color: "red", font: "15px" }}>
                      {" "}
                      {this.state.tb_reason_err}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="message1">
                    {t("modals.decline.message1")}
                  </label>
                  <textarea
                    name="tb_message"
                    onChange={this.handleChange}
                    id="message1"
                    className="form-control"
                    required
                  ></textarea>
                  {this.state.tb_message_err ? (
                    <p style={{ color: "red", font: "15px" }}>
                      {" "}
                      {this.state.tb_message_err}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="feedback">
                    {t("modals.decline.feedback")}
                  </label>
                  <input
                    name="tb_feedback"
                    onChange={this.handleChange}
                    id="feedback"
                    className="form-control"
                    type="text"
                    required
                  />
                  {this.state.tb_feedback_err ? (
                    <p style={{ color: "red", font: "15px" }}>
                      {" "}
                      {this.state.tb_feedback_err}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group mb-5">
                  <div className="form-check">
                    {/* <input
                          onClick={this.handleCheck}
                          type="checkbox"
                          className="form-check-input"
                          id="agreement"
                        /> */}
                    {/* <label className="form-check-label" htmlFor="agreement"> */}
                    {/* {t("modals.accept.check")} */}
                    {/* <Link to="/terms" target="_blank"> {t("modals.accept.terms_and_condition")}</Link> */}
                    {/* </label> */}
                  </div>
                </div>

                <button
                  onClick={this.handleSubmit}
                  type="button"
                  className="btn btn-outline-dark mt-3"
                  disabled={
                    this.state.tb_feedback &&
                      this.state.tb_message &&
                      this.state.tb_reason
                      ? false
                      : true
                  }
                // data-dismiss="modal"
                // aria-label="Close"
                >
                  <span style={{ position: "relative", bottom: "2px" }}>
                    {this.state.loading == true ? (
                      <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                    ) : null}
                    {t("modals.decline.Confirm")}
                  </span>
                </button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(Decline);
