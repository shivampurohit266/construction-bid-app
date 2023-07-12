import React, { Component } from "react";
import axios from "axios";
import Avatar from "../../../../images/avatar4.jpg";
import { Helper, url } from "../../../../helper/helper";
import { withTranslation } from "react-i18next";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import SweetAlert from "react-bootstrap-sweetalert";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

class Accept extends Component {
  state = {
    tb_message: "",
    agreed: false,
    success: false,
  };
  // componentDidMount = () => {
  //   this.setState({
  //     avatar: this.props.avatar,
  //   });
  // };
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleCheck = () => {
    this.setState({ agreed: !this.state.agreed });
  };

  handleSubmit = async () => {
    const token = await localStorage.getItem("token");
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append("tb_message", this.state.tb_message);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `${url}/api/bid/accept/${this.props.id
      }/${this.props.userId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        this.setState({
          success: true,
        });
        const { history } = this.props;
        const { type } = this.props;
        console.log(history, type);
        if (type === "Offer") {
          //window.location.reload();
        } else if (type === "Request") {
          //history.push('/my-actions/listings');
        }
      })
      .catch((error) => {
        //console.log('error', error)
      });
  };

  // NotificationManager.success("Status updated success ");
  // handleSubmit = async () => {
  //   const token = await localStorage.getItem("token");
  //   const data = new FormData();
  //   data.set("tb_message", this.state.tb_message);
  //   const response = await axios.post(
  //     `${url}/api/bid/accept/${
  //       this.props.id
  //     }/${this.refs.tb_user_id.value.trim()}`,
  //     data,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   NotificationManager.success('Status updated success ' );
  //   // window.location.reload();
  //   //console.log(response);
  // };

  onConfirmError = () => {
    this.setState({ server: false });
    this.props.history.push("/my-actions/listings");
  };

  render() {
    const { t, i18n, show, handleClose, userId } = this.props;

    const { success } = this.state;
    console.log("**********Inside", this.props.id);
    console.log("***************userId", this.props.userId);
    return (
      <div>
        {success ? (
          <SweetAlert
            success
            closeOnClickOutside={true}
            // title={t("list_details.success1")}
            title={t("login.SuccessPopup")}
            onConfirm={this.onConfirmError}
          >
            {/* {t("list_details.success")} */}
          </SweetAlert>
        ) : (
          ""
        )}
        {/* Modal  */}
        {/* <NotificationContainer /> */}
        <Modal
          isOpen={show}
          toggle={() => handleClose()}
          className={"modalPropu"}
          centered
        >
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
                <div className="form-group mb-5">
                  <div className="profile d-flex justify-content-between">
                    <img id="company_logo" src={this.props.avatar} alt="" height="40px" width="40px" />

                    {/* {this.props.avatar} */}
                    <div className="content">
                      {/* <h4 id="company_logo"></h4> */}
                      <h4 id="name"></h4>
                      <h4 id="bd_id"></h4>
                      <p>
                        <b>
                          <strong>
                          {t("modals.accept.amount")} {this.props.tb_quote} {this.props.left}
                          <b id="bid"></b>
                          {this.props.right}
                          </strong>
                        </b>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <textarea
                    name="tb_message"
                    onChange={this.handleChange}
                    id="message"
                    className="form-control"
                    placeholder={t("modals.accept.Your_message")}
                  ></textarea>
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
                  type="button"
                  // disabled={!this.state.tb_message}
                  onClick={this.handleSubmit}
                  className="btn btn-outline-dark mt-3"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  {/* Assign contract */}
                  {t("modals.accept.Assign_contract")}
                </button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(Accept);
