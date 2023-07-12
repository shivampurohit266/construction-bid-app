import React, { Component } from "react";
import axios from "axios";
import { url } from "../../../helper/helper";
import { withTranslation } from "react-i18next";
import SweetAlert from "react-bootstrap-sweetalert";
import { postDataWithToken } from "../../../helper/api";

class ProjectPlanModal extends Component {
  state = {
    template_name: "",
    type: "",
    template_name_err: "",
    type_err: "",
    error: Boolean,
    msg: "",
    succes: false,
  };

  handleTemplateName = (event) => {
    if (event.target.value !== "") {
      const { name, value } = event.target;
      this.setState({ [name]: value });
    }
  };

  componentDidMount = () => {
    this.interval = setInterval(() => {
      if (this.state.template_name.length >= 1) {
        this.setState({ template_name_err: "" });
      }
      if (this.state.type.length >= 1) {
        this.setState({ type_err: " " });
      }
    }, 1000);
  };
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  vaiidate = () => {
    let template_name_err = "";
    let type_err = "";

    if (!this.state.template_name) {
      template_name_err = "template name is required";
    }
    // if (!this.state.type && this.state.type != "--Type--") {
    //   type_err = "type is required";
    // }
    if (template_name_err || type_err) {
      this.setState({
        template_name_err,
        type_err,
      });
      return false;
    }
    return true;
  };

  handleSubmit = async () => {
    if (this.vaiidate()) {
      const token = await localStorage.getItem("token");
      const data = new FormData();
      const arrDataBoth = {workArr: this.props.data.items, matAtt: this.props.data.itemsMaterial}
      const taxBoth = {workTax: this.props.data.taxWork, matTax: this.props.data.taxMat}
      const profitBoth = {workProfit: this.props.data.profitWork, matProfit: this.props.data.profitMat}
      const items_costBoth = {workItems_cost: this.props.data.items_costWork, matItems_cost: this.props.data.items_costMat}
      const totalBoth = {workTotal: this.props.data.totalWork, matTotal: this.props.data.totalMat}
      const tax_calcBoth = {worktax_calc: this.props.data.tax_calcWork, mattax_calc: this.props.data.tax_calcMat}
      const profit_calcBoth = {workprofit_calc: this.props.data.profit_calcWork, matprofit_calc: this.props.data.profit_calcMat}
      if(this.props.data.type === "Work"){
        data.set("items", this.props.data.items);
        data.set("est_time", this.props.data.est_time);
        data.set("sub_total", this.props.data.sub_total);
        data.set("tax", this.props.data.taxWork);
        data.set("profit", this.props.data.profitWork);
        data.set("items_cost", this.props.data.items_costWork);
        data.set("template_name", this.state.template_name);
        data.set("type", this.props.data.type);
        data.set("total", this.props.data.totalWork);
        data.set("tax_calc", this.props.data.tax_calcWork);
        data.set("profit_calc", this.props.data.profit_calcWork);
        data.set("seperate", 0);
      }else if(this.props.data.type === "Material"){
        data.set("items", this.props.data.itemsMaterial);
        data.set("est_time", this.props.data.est_time);
        data.set("sub_total", this.props.data.sub_total);
        data.set("tax", this.props.data.taxMat);
        data.set("profit", this.props.data.profitMat);
        data.set("items_cost", this.props.data.items_costMat);
        data.set("template_name", this.state.template_name);
        data.set("type", this.props.data.type);
        data.set("total", this.props.data.totalMat);
        data.set("tax_calc", this.props.data.tax_calcMat);
        data.set("profit_calc", this.props.data.profit_calcMat);
        data.set("seperate", 0);
      }else{
        data.set("items", JSON.stringify(arrDataBoth))
        data.set("est_time", this.props.data.est_time);
        data.set("sub_total", this.props.data.sub_total);
        data.set("tax", JSON.stringify(taxBoth));
        data.set("profit", JSON.stringify(profitBoth));
        data.set("items_cost", JSON.stringify(items_costBoth));
        data.set("template_name", this.state.template_name);
        data.set("type", this.props.data.type);
        data.set("total", JSON.stringify(totalBoth));
        data.set("tax_calc", JSON.stringify(tax_calcBoth));
        data.set("profit_calc", JSON.stringify(profit_calcBoth));
        data.set("seperate", 0);
      }
      // data.set("est_time", this.props.data.est_time);
      // data.set("sub_total", this.props.data.sub_total);
      // data.set("tax", this.props.data.tax);
      // data.set("profit", this.props.data.profit);
      // data.set("items_cost", this.props.data.items_cost);
      // data.set("template_name", this.state.template_name);
      // data.set("type", this.props.data.type);
      // data.set("total", this.props.data.total);
      // data.set("tax_calc", this.props.data.tax_calc);
      // data.set("profit_calc", this.props.data.profit_calc);
      // data.set("seperate", 0);
      await postDataWithToken(`${url}/api/pro-plan/create`, data, token)
        .then((res) => {
          this.setState({
            error: false,
            msg: "Saved successfully!",
            Close: "Close",
            modal: "modal",
            items: "",
            est_time: "",
            sub_total: "",
            tax: "",
            profit: "",
            tax_calc: "",
            profit_calc: "",
            items_cost: "",
            total: "",
            phase: "",
            selectArea: "",
            succes: "Your Request have been submit succesfully",
          });
          // alert("Saved successfully");
          // this.props.reset();
          // window.location.reload();
        })
        .catch((err) => {
          this.setState({ error: true, msg: err.response.data.error });
          alert(err.response.data.error);
          //console.log(err.response.data);
        });
    }
  };

  data_remove = () => {
    this.setState({
      template_name_err: "",
      type_err: "",
    });
  };
  render() {
    const { t, i18n } = this.props;
    const { succes } = this.state;
    // const aa = this.itemsInput.value?.filter((x) => x.items != "")
    // const a  = this.props?.data.items ?  this.props?.data.items?.filter((x) => x.items != "") : " ";

    return (
      <div>
        {succes ? (
          <SweetAlert
            success
            // closeOnClickOutside={true}
            title={t("login.SuccessPopup")}
            // title={t("list_details.success1")}
            onConfirm={()=>window.location.reload()}
          >
            {/* {t("list_details.success")} */}
          </SweetAlert>
        ) : (
          ""
        )}

        <div
          className="modal fade"
          id="save"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          data-backdrop="static"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <div className="modal-header" style={{ paddingLeft: 0, paddingRight: 0 }}>
                  {/* <h5 className="modal-title" id="exampleModalLabel">
                      {t("modals.project_plan.heading")}
                    </h5> */}

                  <button
                    type="button"
                    className="close close-planning-modal"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={this.data_remove}
                    style={{ marginLeft: 'auto' }}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="row">
                  <div className="col-md-11">
                    <div className="form-group mb-5">
                      <div className="profile flex">
                        <div className="content">
                          <h4> {t("ProjectPlanModal.unique_plan_name")}</h4>
                        </div>
                      </div>
                    </div>
                    <div className="form-group ">
                      <input
                        className="form-control"
                        placeholder="Template name"
                        name="template_name"
                        onChange={this.handleTemplateName}
                      />
                      <p style={{ color: "#eb516d " }}>
                        {this.state.template_name_err}
                      </p>
                    </div>
                    {/* <div className="form-group ">
                      <select
                        onChange={this.handleTemplateName}
                        name="type"
                        className="form-control"
                      >
                        <option value="">{t("ProjectPlanModal.Type")}</option>
                        <option value="Work">
                          {" "}
                          {t("ProjectPlanModal.Work")}{" "}
                        </option>
                        <option value="Material">
                          {" "}
                          {t("ProjectPlanModal.Material")}{" "}
                        </option>
                        <option value="Both">
                          {" "}
                          {t("ProjectPlanModal.Both")}{" "}
                        </option>
                      </select>

                      <p style={{ color: "#eb516d " }}>{this.state.type_err}</p>
                    </div> */}
                    <button
                      type="button"
                      className="btn btn-primary mt-3"
                      data-dismiss={this.state.modal}
                      aria-label={this.state.Close}
                      onClick={this.handleSubmit}
                      style={{ borderRadius: 0, padding: '5px 15px' }}
                    >
                      {t("ProjectPlanModal.Submit")}
                    </button>
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

export default withTranslation()(ProjectPlanModal);
