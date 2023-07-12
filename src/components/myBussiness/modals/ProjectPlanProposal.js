import React, { Component } from "react";
import axios from "axios";
import { url } from "../../../helper/helper";
import { withTranslation } from "react-i18next";
import { Prompt } from "react-router";
import $ from "jquery";
import SweetAlert from "react-bootstrap-sweetalert";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { withRouter } from "react-router";

const initialState = {
  rows: [],
  area: [],
  phases: [],
  row_phase: [],
  phase: "",
  items: "",
  est_time: 0,
  sub_total: 0,
  tax: 0,
  profit: 0,
  tax_calc: 0,
  profit_calc: 0,
  items_cost: 0,
  total: 0,
  type: "",
  loaded: false,
  template_name: "",
  template_names: [],
  id: 0,
  temp_mod: 0,
  seperate: 0,
  succes: false,
  succesMessage: "",
};

class ProjectPlanProposal extends Component {
  state = {
    rows: [],
    area: [],
    phases: [],
    row_phase: [],
    phase: "",
    items: "",
    est_time: 0,
    sub_total: 0,
    tax: 0,
    profit: 0,
    tax_calc: 0,
    profit_calc: 0,
    items_cost: 0,
    total: 0,
    type: "",
    loaded: false,
    template_name: "",
    template_names: [],
    id: 0,
    temp_mod: 0,
    seperate: 0,
    t: this.props.t,
  };

  componentDidMount() {
    $("#goto").change(function () {
      if ($(this).val() === "") {
        const lng =
          localStorage.getItem("_lng") === "fi"
            ? "Oletko varma, että haluat siirtyä toiselle sivulle?"
            : "Are you sure you want to move to a different page?";
        if (window.confirm(lng)) {
          $("#add-plan").modal("hide");
          window.location.href = "#/proposal-projectplanning";
        } else {
          $(this).val("Name");
        }
      }
    });
    this.interval = setInterval(() => {
      this.checkallfields();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate(prevProps) {
    if (this.props.onType !== prevProps.onType) {
      console.log("prev=>", prevProps);
      console.log("props =>", this.props);
      this.setState(initialState);
      this.setState({ row_phase: [] });
      this.loadNames(this.props.onType);
      this.loadArea();
    }
    if (this.props.tempName !== prevProps.tempName) {
      console.log("prev1=>", prevProps);
      console.log("props1 =>", this.props);
      this.setState(initialState);
      this.setState({ loaded: true });
      this.loadNames(this.props.onType);
      this.loadArea();
      this.loadTemplate(this.props.tempName);
    }
  }

  saveData = async () => {
    this.setState({
      items: this.itemsInput.value,
      est_time: this.est_timeInput.value,
      sub_total: this.sub_totalInput.value,
      tax: this.taxInput.value,
      profit: this.profitInput.value,
      tax_calc: this.tax_calcInput.value,
      profit_calc: this.profit_calcInput.value,
      items_cost: this.items_costInput.value,
      total: this.totalInput.value,
    });
  };

  deleteRow = (index) => {
    var row_phase = [...this.state.row_phase];
    row_phase.splice(index, 1);

    let elements = document.getElementById("myRemove");
    this.setState({ row_phase }, () => {
      this.calculateColumnR(1);
      this.calculateColumnR(2);
      this.calcMultipleR(elements);
      this.calculateColumnR(3);
      this.calcTaxR();
      this.calcProfitR();
      this.calcTotalR();
    });
    this.setState({ temp_mod: 1 });
  };

  calcTotalR = () => {
    var sub_total = $("#3result").text();
    var tax_res = $(".tax_res").text();
    var profit_res = $(".profit_res").text();
    var total =
      parseFloat(sub_total) + parseFloat(tax_res) + parseFloat(profit_res);
    $(`.total`).text(Math.round(total));
    $(`#total`).val(Math.round(total));
  };

  calcProfitR = () => {
    var mat_cost = $("#3result").text();
    var profit = $(".profit").text();
    $(`.profit_res`).text(Math.round((profit / 100) * mat_cost));
  };

  calcTaxR = () => {
    var mat_cost = $("#3result").text();
    var tax = $(".tax").text();
    $(`.tax_res`).text(Math.round((tax / 100) * mat_cost));
  };

  calcMultipleR = (e) => {
    var parent = $(e).closest("tr");
    var duration =
      parent.find(".duration").text() === ""
        ? 1
        : parent.find(".duration").text();
    var cost_hr =
      parent.find(".cost_hr").text() === ""
        ? 1
        : parent.find(".cost_hr").text();
    var total = duration * cost_hr;
    parent.find(".mat_cost").text(Math.round(total));
  };

  calculateColumnR = (params) => {
    var total = 0;
    $("table tr.i-val").each(function () {
      var value = parseInt($("td", this).eq(params).text());

      if (!isNaN(value)) {
        total += value;
      }
    });
    $(`#${params}result`).text(total);
  };

  handleItemsAdd = () => {
    const { t } = this.props;

    if (window.confirm(t("modals.project_plan.add_all_fileds"))) {
      if (this.state.seperate === 1) {
        const token = localStorage.getItem("token");
        const params = {
          items: this.itemsInput.value,
          est_time: this.est_timeInput.value,
          sub_total: this.sub_totalInput.value,
          tax: this.taxInput.value,
          profit: this.profitInput.value,
          tax_calc: this.tax_calcInput.value,
          profit_calc: this.profit_calcInput.value,
          items_cost: this.items_costInput.value,
          total: this.totalInput.value,
        };

        return axios
          .put(`${url}/api/pro-plan/update/${this.state.template_name}`, null, {
            params: params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            console.log("res", res);
            this.props.onSelectWorkTemplate(
              this.itemsInput.value,
              this.totalInput.value,
              this.props.onType,
              this.state.template_name,
              this.state.id
            );
            this.props.handleClose();
          })
          .catch((err) => {
            console.log(err);
          });
      }

      if (this.state.id === 0 && this.state.temp_mod === 0) {
        const token = localStorage.getItem("token");
        const params = {
          items: this.itemsInput.value,
          est_time: this.est_timeInput.value,
          sub_total: this.sub_totalInput.value,
          tax: this.taxInput.value,
          profit: this.profitInput.value,
          tax_calc: this.tax_calcInput.value,
          profit_calc: this.profit_calcInput.value,
          items_cost: this.items_costInput.value,
          total: this.totalInput.value,
          type: this.props.onType,
          seperate: 1,
          template_name: `${+new Date()}_${this.props.onType}`,
        };

        return axios
          .post(`${url}/api/pro-plan/create`, params, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            console.log("res", res);
            this.setState({
              id: res.data.id,
              template_name: res.data.template_name,
            });
            this.props.onSelectWorkTemplate(
              this.itemsInput.value,
              this.totalInput.value,
              this.props.onType,
              this.state.template_name,
              this.state.id
            );
            this.props.handleClose();
          })
          .catch((err) => {
            console.log("============", err?.response?.data.error);
            if (err?.response?.data?.error) {
              this.setState({
                succes: true,
                succesMessage: err?.response?.data?.error,
              });
            }
          });
      }
      if (this.state.temp_mod === 1) {
        const token = localStorage.getItem("token");
        const params = {
          items: this.itemsInput.value,
          est_time: this.est_timeInput.value,
          sub_total: this.sub_totalInput.value,
          tax: this.taxInput.value,
          profit: this.profitInput.value,
          tax_calc: this.tax_calcInput.value,
          profit_calc: this.profit_calcInput.value,
          items_cost: this.items_costInput.value,
          total: this.totalInput.value,
          type: this.props.onType,
          seperate: 1,
          template_name: `${+new Date()}_${this.props.onType}`,
        };

        return axios
          .post(`${url}/api/pro-plan/create`, params, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            this.setState({
              id: res.data.id,
              template_name: res.data.template_name,
            });
            this.props.onSelectWorkTemplate(
              this.itemsInput.value,
              this.totalInput.value,
              this.props.onType,
              this.state.template_name,
              this.state.id
            );
            this.props.handleClose();
          })
          .catch(() => {});
      } else {
        this.props.onSelectWorkTemplate(
          this.itemsInput.value,
          this.totalInput.value,
          this.props.onType,
          this.state.template_name,
          this.state.id
        );
        this.props.handleClose();
      }
      if (this.state.temp_mod === 1) {
        const token = localStorage.getItem("token");
        const params = {
          items: this.itemsInput.value,
          est_time: this.est_timeInput.value,
          sub_total: this.sub_totalInput.value,
          tax: this.taxInput.value,
          profit: this.profitInput.value,
          tax_calc: this.tax_calcInput.value,
          profit_calc: this.profit_calcInput.value,
          items_cost: this.items_costInput.value,
          total: this.totalInput.value,
          type: this.props.onType,
          seperate: 1,
          template_name: `${+new Date()}_${this.props.onType}`,
        };

        return axios
          .post(`${url}/api/pro-plan/create`, params, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            this.setState({
              id: res.data.id,
              template_name: res.data.template_name,
            });
            this.props.onSelectWorkTemplate(
              this.itemsInput.value,
              this.totalInput.value,
              this.props.onType,
              this.state.template_name,
              this.state.id
            );
            this.props.handleClose();
          })
          .catch(() => {});
      }
    }
  };

  handleName = (event) => {
    if (event.target.value === "Name" || event.target.value === "") {
      const lng =
        localStorage.getItem("_lng") === "fi"
          ? "Oletko varma, että haluat siirtyä toiselle sivulle?"
          : "Are you sure you want to move to a different page?";
      if (window.confirm(lng)) {
        this.props.history.push("/proposal-projectplanning");
      }
    }

    this.setState({ template_name: event.target.value, loaded: false });
    this.loadTemplate(event.target.value);
  };

  loadTemplate = async (val) => {
    const token = localStorage.getItem("token");
    axios
      .get(`${url}/api/pro-plan/template/${val}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        const {
          type,
          items,
          est_time,
          sub_total,
          tax,
          profit,
          tax_calc,
          profit_calc,
          items_cost,
          template_name,
          total,
          id,
          seperate,
        } = result?.data;
        this.setState({
          row_phase: JSON.parse(items),
          type: type,
          est_time: est_time,
          sub_total: sub_total,
          tax: tax,
          profit: profit,
          tax_calc: tax_calc,
          profit_calc: profit_calc,
          items_cost: items_cost,
          template_name: template_name,
          total: total,
          id: id,
          seperate: 1,
        });
      })
      .catch(() => {});
  };

  loadNames = async (val) => {
    const token = localStorage.getItem("token");
    axios
      .get(`${url}/api/pro-plan/names/${val}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        if (result.data?.data) {
          this.setState({ template_names: result.data.data });
        }
      })
      .catch(() => {});
  };

  loadArea = async () => {
    const token = localStorage.getItem("token");
    let lang = localStorage.getItem("_lng");
    axios
      .get(`${url}/api/pro-plan/area/${lang}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        console.log(result);
        if (result.data?.data) {
          this.setState({ area: result.data.data });
        }
      })
      .catch(() => {});
  };
  changePhase = (event) => {
    this.setState({ phases: [], phase: "" });
    const token = localStorage.getItem("token");
    let lang = localStorage.getItem("_lng");
    axios
      .get(`${url}/api/pro-plan/phase/${event.target.value}/${lang}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.setState({ phases: result.data });
      })
      .catch(() => {});
  };

  handleSelect = (event) => {
    if (event.target.value !== "--Select--") {
      this.setState({ phase: event.target.value });
      let rows = this.state.rows;
      let row_phase = this.state.row_phase;
      rows.push(this.state.phase);
      let keys = ["items", "dur", "cost", "mat"];
      let gg = `${event.target.value},${0},${0},${0}`.split(",");
      let result = {};
      keys.forEach((key, i) => (result[key] = gg[i]));
      row_phase.push(result);
      this.setState({ rows: rows, row_phase: row_phase });
    } else {
      this.setState({ phase: "" });
    }
  };

  addRow = () => {
    let rows = this.state.rows;
    let row_phase = this.state.row_phase;
    rows.push(this.state.phase);
    let keys = ["items", "dur", "cost", "mat"];
    let gg = `${""},${0},${0},${0}`.split(",");
    let result = {};
    keys.forEach((key, i) => (result[key] = gg[i]));
    row_phase.push(result);
    this.setState({ rows: rows, row_phase: row_phase });
  };

  checkallfields() {
    if (
      this.state.est_time ||
      this.state.items ||
      this.state.sub_total ||
      this.state.tax ||
      this.state.profit ||
      this.state.tax_calc ||
      this.state.profit_calc ||
      this.state.items_cost ||
      this.state.total
    ) {
      this.setState({
        redirect_page: true,
      });
    } else {
      this.setState({
        redirect_page: false,
      });
    }
  }

  onConfirmError = () => {
    this.setState({
      succes: "",
      succesMessage: "",
    });
  };

  render() {
    const { t, onType, show, handleClose } = this.props;
    const { succes, succesMessage } = this.state;

    const isMaterial = onType === "Material";
    return (
      <>
        <Prompt
          when={this.state.redirect_page}
          message={t("marketplace.feeds.list_details.leave_page")}
        />
        <div>
          {succes ? (
            <SweetAlert
              warning
              closeOnClickOutside={true}
              title={succesMessage}
              onConfirm={this.onConfirmError}
            ></SweetAlert>
          ) : (
            ""
          )}
          <Modal
            isOpen={this.props.show}
            toggle={() => this.props.handleClose()}
            className={"modalPropu"}
            centered
          >
            <ModalHeader
              toggle={() => this.props.handleClose()}
              className="d-flex justify-content-between"
            >
              <div className="modal-title">
                {t("modals.project_plan.heading")}
              </div>
            </ModalHeader>
            <ModalBody>
              <input
                type="hidden"
                ref={(input) => {
                  this.itemsInput = input;
                }}
                id="items"
              />
              <input
                type="hidden"
                ref={(input) => {
                  this.est_timeInput = input;
                }}
                id="est_time"
              />
              <input
                type="hidden"
                ref={(input) => {
                  this.sub_totalInput = input;
                }}
                id="sub_total"
              />
              <input
                type="hidden"
                ref={(input) => {
                  this.taxInput = input;
                }}
                id="tax"
              />
              <input
                type="hidden"
                ref={(input) => {
                  this.profitInput = input;
                }}
                id="profit"
              />
              <input
                type="hidden"
                ref={(input) => {
                  this.tax_calcInput = input;
                }}
                id="tax_calc"
              />
              <input
                type="hidden"
                ref={(input) => {
                  this.profit_calcInput = input;
                }}
                id="profit_calc"
              />
              <input
                type="hidden"
                ref={(input) => {
                  this.items_costInput = input;
                }}
                id="items_cost"
              />
              <input
                type="hidden"
                ref={(input) => {
                  this.totalInput = input;
                }}
                id="total"
              />

              <div className="row">
                <div className="col-md">
                  <div className="form-group">
                    <label>{t("modals.project_plan.select_area")}</label>
                    <select
                      onChange={this.changePhase}
                      className="form-control"
                    >
                      <option> {t("modals.project_plan.Select")} </option>
                      {this.state.area?.map(
                        ({ area_id, area_identifier }, index) => (
                          <option key={index} value={area_id}>
                            {area_identifier}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>{t("modals.project_plan.add_work_phase")}</label>
                    <div className="flex-group">
                      <select
                        onChange={this.handleSelect}
                        name="phase"
                        className="form-control"
                      >
                        <option> {t("modals.project_plan.Select")} </option>
                        {this.state.phases?.map(
                          ({ aw_id, aw_identifier }, index) => {
                            if (aw_id !== undefined) {
                              return (
                                <option key={index} value={aw_identifier}>
                                  {aw_identifier}
                                </option>
                              );
                            } else {
                              return null;
                            }
                          }
                        )}
                      </select>
                      <button
                        onClick={this.addRow}
                        type="button"
                        className="btn btn-primary mt-5"
                      >
                        {t("modals.project_plan.AddRow")}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-md">
                  <div className="form-group">
                    <label>{t("modals.project_plan.template_name")}</label>
                    <div className="flex-group">
                      <select
                        onChange={this.handleName}
                        name="type"
                        className="form-control"
                        id="goto"
                      >
                        <option value="Name">
                          {" "}
                          {t("modals.project_plan.Name")}{" "}
                        </option>
                        {this.state.template_names?.map(
                          ({ template_name }, index) => (
                            <option key={index} value={template_name}>
                              {template_name}
                            </option>
                          )
                        )}
                        <option value="">
                          {" "}
                          {t("modals.project_plan.Create_template")}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <p>{t("modals.project_plan.note")} </p>
              <div className="table-responsive-sm scroller mt-3">
                <table
                  id="mytable"
                  className="table table-bordered table-sm table-product-modal"
                >
                  <thead>
                    <tr className="text-right">
                      <th className="text-left">
                        {t("modals.project_plan.items")}
                      </th>
                      <th>
                        {t(
                          isMaterial
                            ? "modals.project_plan.amount"
                            : "modals.project_plan.duration"
                        )}
                      </th>
                      <th>
                        {t(
                          isMaterial
                            ? "modals.project_plan.unit_cost"
                            : "modals.project_plan.cost_hr"
                        )}
                      </th>
                      <th>{t("modals.project_plan.total_cost")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.row_phase.map((r, index) => (
                      <Row
                        phase={r}
                        idx={index}
                        key={index}
                        items={this.state.items}
                        deleteRow={this.deleteRow}
                      />
                    ))}

                    <tr
                      style={{ lineHeight: "30px", fontWeight: "bold" }}
                      className="text-right"
                    >
                      <td data-label="Items: ">
                        {t("project_planning.est_time")}
                      </td>
                      <td data-label="Duration(hrs): " id="1result">
                        {this.state.est_time}
                      </td>
                      <td data-label="Cost/hr: "></td>
                      <td data-label="Total cost: "></td>
                    </tr>
                    <tr>
                      <td data-label="Items: "> &nbsp; </td>
                      <td data-label="Duration(hrs): "></td>
                      <td data-label="Cost/hr: "></td>
                      <td data-label="Total cost: "></td>
                    </tr>
                    <tr className="text-right">
                      <td data-label="Items: "></td>
                      <td data-label="Duration(hrs): ">
                        {this.props.left} {t("project_planning.sub_total")}{" "}
                        {this.props.right}
                      </td>
                      <td data-label="Cost/hr: " id="2result">
                        {this.state.sub_total}
                      </td>
                      <td data-label="Total cost: " id="3result">
                        {this.state.items_cost}
                      </td>
                    </tr>
                    <tr className="text-right">
                      <td data-label="Items: ">{t("project_planning.tax")}%</td>
                      <td
                        data-label="Duration(hrs): "
                        className="tax"
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                      >
                        {this.state.tax}
                      </td>
                      <td
                        colSpan="2"
                        data-label="Total cost: "
                        className="tax_res"
                      >
                        {this.state.tax_calc}
                      </td>
                    </tr>
                    <tr className="text-right">
                      <td data-label="Items: ">
                        {t("project_planning.profit")}%
                      </td>
                      <td
                        data-label="Duration(hrs):"
                        className="profit"
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                      >
                        {this.state.profit}
                      </td>
                      <td data-label="Duration(hrs): "></td>
                      <td data-label="Total cost: " className="profit_res">
                        {this.state.profit_calc}
                      </td>
                    </tr>
                    <tr className="text-right">
                      <td data-label="Items: ">
                        {this.props.left} {t("project_planning.total")}{" "}
                        {this.props.right}
                      </td>
                      <td
                        colSpan="3"
                        data-label="Duration(hrs): "
                        className="total"
                      >
                        {this.state.total}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button
                  onClick={this.handleItemsAdd}
                  type="button"
                  className="btn btn-primary mt-3 clk1"
                >
                  {t("modals.project_plan.add_to_proposal")}
                </button>
              </div>
            </ModalBody>
          </Modal>
          {/* <div
            className="modal fade"
            id="add-plan"
            data-backdrop="static"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    {t("modals.project_plan.heading")}
                  </h5>

                  <button
                    type="button"
                    className="close "
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <input
                    type="hidden"
                    ref={(input) => {
                      this.itemsInput = input;
                    }}
                    id="items"
                  />
                  <input
                    type="hidden"
                    ref={(input) => {
                      this.est_timeInput = input;
                    }}
                    id="est_time"
                  />
                  <input
                    type="hidden"
                    ref={(input) => {
                      this.sub_totalInput = input;
                    }}
                    id="sub_total"
                  />
                  <input
                    type="hidden"
                    ref={(input) => {
                      this.taxInput = input;
                    }}
                    id="tax"
                  />
                  <input
                    type="hidden"
                    ref={(input) => {
                      this.profitInput = input;
                    }}
                    id="profit"
                  />
                  <input
                    type="hidden"
                    ref={(input) => {
                      this.tax_calcInput = input;
                    }}
                    id="tax_calc"
                  />
                  <input
                    type="hidden"
                    ref={(input) => {
                      this.profit_calcInput = input;
                    }}
                    id="profit_calc"
                  />
                  <input
                    type="hidden"
                    ref={(input) => {
                      this.items_costInput = input;
                    }}
                    id="items_cost"
                  />
                  <input
                    type="hidden"
                    ref={(input) => {
                      this.totalInput = input;
                    }}
                    id="total"
                  />

                  <div className="row">
                    <div className="col-md">
                      <div className="form-group">
                        <label>{t("modals.project_plan.select_area")}</label>
                        <select
                          onChange={this.changePhase}
                          className="form-control"
                        >
                          <option> {t("modals.project_plan.Select")} </option>
                          {this.state.area?.map(
                            ({ area_id, area_identifier }, index) => (
                              <option key={index} value={area_id}>
                                {area_identifier}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{t("modals.project_plan.add_work_phase")}</label>
                        <div className="flex-group">
                          <select
                            onChange={this.handleSelect}
                            name="phase"
                            className="form-control"
                          >
                            <option> {t("modals.project_plan.Select")} </option>
                            {this.state.phases?.map(
                              ({ aw_id, aw_identifier }, index) => {
                                if (aw_id !== undefined) {
                                  return (
                                    <option key={index} value={aw_identifier}>
                                      {aw_identifier}
                                    </option>
                                  );
                                } else {
                                  return null;
                                }
                              }
                            )}
                          </select>
                          <button
                            onClick={this.addRow}
                            type="button"
                            className="btn btn-primary"
                          >
                            {t("modals.project_plan.AddRow")}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-md">
                      <div className="form-group">
                        <label>{t("modals.project_plan.template_name")}</label>
                        <div className="flex-group">
                          <select
                            onChange={this.handleName}
                            name="type"
                            className="form-control"
                            id="goto"
                          >
                            <option value="Name">
                              {" "}
                              {t("modals.project_plan.Name")}{" "}
                            </option>
                            {this.state.template_names?.map(
                              ({ template_name }, index) => (
                                <option key={index} value={template_name}>
                                  {template_name}
                                </option>
                              )
                            )}
                            <option value="">
                              {" "}
                              {t("modals.project_plan.Create_template")}{" "}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p>{t("modals.project_plan.note")} </p>
                  <div className="table-responsive-sm scroller mt-3">
                    <table
                      id="mytable"
                      className="table table-bordered table-sm"
                    >
                      <thead>
                        <tr className="text-right">
                          <th className="text-left">
                            {t("modals.project_plan.items")}
                          </th>
                          <th>
                            {t(
                              isMaterial
                                ? "modals.project_plan.amount"
                                : "modals.project_plan.duration"
                            )}
                          </th>
                          <th>
                            {t(
                              isMaterial
                                ? "modals.project_plan.unit_cost"
                                : "modals.project_plan.cost_hr"
                            )}
                          </th>
                          <th>{t("modals.project_plan.total_cost")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.row_phase.map((r, index) => (
                          <Row
                            phase={r}
                            idx={index}
                            key={index}
                            items={this.state.items}
                            deleteRow={this.deleteRow}
                          />
                        ))}

                        <tr
                          style={{ lineHeight: "30px", fontWeight: "bold" }}
                          className="text-right"
                        >
                          <td data-label="Items: ">
                            {t("project_planning.est_time")}
                          </td>
                          <td data-label="Duration(hrs): " id="1result">
                            {this.state.est_time}
                          </td>
                          <td data-label="Cost/hr: "></td>
                          <td data-label="Total cost: "></td>
                        </tr>
                        <tr>
                          <td data-label="Items: "> &nbsp; </td>
                          <td data-label="Duration(hrs): "></td>
                          <td data-label="Cost/hr: "></td>
                          <td data-label="Total cost: "></td>
                        </tr>
                        <tr className="text-right">
                          <td data-label="Items: "></td>
                          <td data-label="Duration(hrs): ">
                            {this.props.left} {t("project_planning.sub_total")}{" "}
                            {this.props.right}
                          </td>
                          <td data-label="Cost/hr: " id="2result">
                            {this.state.sub_total}
                          </td>
                          <td data-label="Total cost: " id="3result">
                            {this.state.items_cost}
                          </td>
                        </tr>
                        <tr className="text-right">
                          <td data-label="Items: ">
                            {t("project_planning.tax")}%
                          </td>
                          <td
                            data-label="Duration(hrs): "
                            className="tax"
                            contentEditable="true"
                            suppressContentEditableWarning={true}
                          >
                            {this.state.tax}
                          </td>
                          <td
                            colSpan="2"
                            data-label="Total cost: "
                            className="tax_res"
                          >
                            {this.state.tax_calc}
                          </td>
                        </tr>
                        <tr className="text-right">
                          <td data-label="Items: ">
                            {t("project_planning.profit")}%
                          </td>
                          <td
                            data-label="Duration(hrs):"
                            className="profit"
                            contentEditable="true"
                            suppressContentEditableWarning={true}
                          >
                            {this.state.profit}
                          </td>
                          <td data-label="Duration(hrs): "></td>
                          <td data-label="Total cost: " className="profit_res">
                            {this.state.profit_calc}
                          </td>
                        </tr>
                        <tr className="text-right">
                          <td data-label="Items: ">
                            {this.props.left} {t("project_planning.total")}{" "}
                            {this.props.right}
                          </td>
                          <td
                            colSpan="3"
                            data-label="Duration(hrs): "
                            className="total"
                          >
                            {this.state.total}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <button
                      onClick={this.handleItemsAdd}
                      type="button"
                      className="btn btn-primary mt-3 clk1"
                    >
                      {t("modals.project_plan.add_to_proposal")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </>
    );
  }
}

const Row = (props) => (
  <tr className="i-val customerIDCell">
    <td className="custom_items">
      <div className="td-main d-flex align-items-center">
        <span
          id="myRemove"
          className="text-left text-dark"
          contentEditable="false"
          suppressContentEditableWarning={true}
          onClick={() => props.deleteRow(props.idx)}
        >
          × &nbsp;
        </span>
        <span
          data-value={props.phase.items}
          className="text-right prop_items"
          contentEditable="true"
          suppressContentEditableWarning={true}
          data-label="Items: "
        >
          {/* &nbsp;  */}
          {props.phase.items.trim()}
        </span>
      </div>
    </td>
    <td
      className="duration text-right"
      contentEditable="true"
      suppressContentEditableWarning={true}
      data-label="Duration(hrs): "
    >
      {props.phase.dur}
    </td>
    <td
      className="cost_hr text-right"
      contentEditable="true"
      suppressContentEditableWarning={true}
      data-label="Cost/hr: "
    >
      {props.phase.cost}
    </td>
    <td className="mat_cost text-right" data-label="Total cost: ">
      {props.phase.mat}
    </td>
  </tr>
);

export default withTranslation()(withRouter(ProjectPlanProposal));
