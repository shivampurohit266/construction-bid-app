import React, { Component, useMemo, useState } from "react";
import axios from "axios";
import { url } from "../../../helper/helper";
import Header from "../../shared/Header";
import BussinessSidebar from "../../shared/BussinessSidebar";
import ProjectPlanModal from "../modals/ProjectPlanModal";
import ProjectPlanOpen from "../modals/ProjectPlanOpen";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Prompt } from "react-router";
import Breadcrumb from "../../shared/Breadcrumb";
import Sidebar from "../../shared/Sidebar";
import "./CreateProject.css";
import EditIcon from "../../../EditIcon.svg";
import DeleteIcon from "../../../delete-button.svg";
import ProjectPlanningModal from "./ProjectPlanningModal";

class ProjectPlanning extends Component {
  state = {
    rows: [],
    area: [],
    phases: [],
    row_phase: [],
    phase: '',
    items: '',
    est_time: 0,
    sub_total: 0,
    tax: 0,
    profit: 0,
    tax_calc: 0,
    profit_calc: 0,
    items_cost: 0,
    total: 0,
    type: '',
    loaded: 0,
    template_name: '',
    id: 0,
    redirect_page: false,
    left: null,
    right: null,
    isPlanOpen: false,
    isAddItem: false,
    windowWidth: window.innerWidth,
    mobileItemName: "",
    btnActive: '',
    btnTabFirst: 'active',
    selectOption: '',
    selectOptionNewRow: '',
  };

  handleSelectOption = (e) => {
    this.setState({ selectOption: e.target.value });
    // console.log(e.target.value);
  }

  handleSelectOptionNewRow = (e) => {
    this.setState({ selectOptionNewRow: e.target.value });
  }

  handleActiveButton = (e) => {
    const clicked = e.target.id;
    this.setState({ btnTabFirst: '' });

    if (this.state.btnActive === clicked) {
      this.setState({ btnActive: 'active' });
    } else {
      this.setState({ btnActive: clicked })
    }

  }

  handlePlanOpen = () => {
    this.setState({
      isPlanOpen: !this.state.isPlanOpen,
    });
  };

  handleProjectPlaningModal = () => {
    this.setState({
      isAddItem: !this.state.isAddItem,
    });
  };

  componentDidMount = () => {
    this._isMounted = true;
    this.axiosCancelSource = axios.CancelToken.source();

    this.loadArea(this.axiosCancelSource);
    this.loadConfig(this.axiosCancelSource);
    // this.interval = setInterval(() => {
    //   this.checkallfields();
    // }, 1000);
  };
  // handleWindowResize = () => {
  //   this.setState({
  //     windowWidth: window.innerWidth,
  //   });
  // };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.loaded !== this.state.loaded) {
      this.loadTemplate(this.state.template_name);
    }

    // window.addEventListener("resize", this.handleWindowResize);

    // return () => {
    //   window.removeEventListener('resize', this.handleWindowResize);
    // };
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.axiosCancelSource.cancel();
    clearInterval(this.interval);
  }

  handleTemplate = (value) => {
    console.log('value', value);
    if (value) {
      this.setState((prevState) => {
        return {
          loaded: prevState.loaded + 1,
          template_name: value,
        };
      });
    } else if (!value) {
      this.setState({
        loaded: 0,
        template_name: '',
      });
    } else {
    }
  };

  deleteRow = (index) => {
    var row_phase = [...this.state.row_phase];
    row_phase.splice(index, 1);
    this.setState({ row_phase });
  };

  reset = () => {
    this.setState({
      rows: [],
      row_phase: [],
      phase: '',
      items: '',
      est_time: 0,
      sub_total: 0,
      tax: 0,
      profit: 0,
      tax_calc: 0,
      profit_calc: 0,
      items_cost: 0,
      total: 0,
      type: '',
      loaded: 0,
      template_name: '',
      id: 0,
    });
  };

  loadConfig = async (axiosCancelSource) => {
    const token = await localStorage.getItem('token');
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

  saveData = async (event) => {
    console.log(typeof this.itemsInput.value, "???????eeeevvvv");
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
  saveDataMobile = async (event) => {
    console.log(JSON.stringify(this.state.row_phase), "??????evevev");
    this.setState({
      items: JSON.stringify(this.state.row_phase),
      est_time: event.totalDur,
      sub_total: event.totalCost,
      tax: this.state.tax,
      profit: this.state.profit,
      tax_calc: ((event.subtotal * this.state.tax) / 100).toFixed(2),
      profit_calc: ((event.subtotal * this.state.profit) / 100).toFixed(2),
      items_cost: event.subtotal,
      total: (
        event.subtotal +
        (event.subtotal * this.state.tax) / 100 +
        (event.subtotal * this.state.profit) / 100
      ).toFixed(2),
    });
    console.log(this.state.items, "?????????items");
  };

  updateDataMobile = async (event) => {
    this.saveDataMobile(event);
    const token = await localStorage.getItem("token");

    // if (this.state.row_phase?.filter((x) => x.items == "")) {

    // }

    const params = {
      items: this.state.items,
      est_time: this.state.est_time,
      sub_total: this.state.sub_total,
      tax: this.state.tax,
      profit: this.state.profit,
      items_cost: this.state.items_cost,
      total: this.state.total,
      tax_calc: this.state.tax_calc,
      profit_calc: this.state.profit_calc,
    };

    axios
      .put(`${url}/api/pro-plan/update/${this.state.template_name}`, null, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        this.setState({
          error: false,
          msg: "Updated successfully!",
        });
        alert(this.state.msg);
        // window.location.reload();
      })
      .catch((err) => {
        this.setState({ error: true, msg: err.response.data.error });
        alert("Error occured");
        // window.location.reload();
      });
  };
  updateData = async () => {
    this.saveData();
    const token = await localStorage.getItem('token');

    // if (this.state.row_phase?.filter((x) => x.items == "")) {

    // }

    const params = {
      items: this.state.items,
      est_time: this.state.est_time,
      sub_total: this.state.sub_total,
      tax: this.state.tax,
      profit: this.state.profit,
      items_cost: this.state.items_cost,
      total: this.state.total,
      tax_calc: this.state.tax_calc,
      profit_calc: this.state.profit_calc,
    };

    axios
      .put(`${url}/api/pro-plan/update/${this.state.template_name}`, null, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        this.setState({
          error: false,
          msg: 'Updated successfully!',
        });
        alert(this.state.msg);
        // window.location.reload();
      })
      .catch((err) => {
        this.setState({ error: true, msg: err.response.data.error });
        alert('Error occured');
        // window.location.reload();
      });
  };

  loadTemplate = async (val) => {
    const token = await localStorage.getItem('token');
    await axios
      .get(`${url}/api/pro-plan/template/${val}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        //console.log("result", result.data);
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
        } = result.data;
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
        });
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  loadArea = async (axiosCancelSource) => {
    const token = await localStorage.getItem('token');
    let lang = localStorage.getItem('_lng');
    await axios
      .get(`${url}/api/pro-plan/area/${lang}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        this.setState({ area: result?.data?.data });
      })
      .catch((err) => {
        //console.log(err);
      });

    // if (response.status === 200) {
    //   if (this._isMounted) {
    //     this.setState({ area: response.data.data });
    //   }
    // }
  };

  changePhase = (event) => {
    if (event.target.value !== '--Select--') {
      this.setState({ selectArea: event.target.value });
    } else {
      this.setState({ selectArea: '' });
    }
    this.setState({ phases: [], phase: '' });
    const token = localStorage.getItem('token');
    let lang = localStorage.getItem('_lng');
    axios
      .get(`${url}/api/pro-plan/phase/${event.target.value}/${lang}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.setState({ phases: result.data });
      })
      .catch((err) => {
        //console.log(err.response);
      });
  };

  handleSelect = (event) => {
    if (event.target.value !== '--Select--') {
      // this.setState({ phase: event.target.value });
      let rows = this.state.rows;
      let row_phase = this.state.row_phase;
      rows.push(this.state.phase);
      let keys = ['items', 'dur', 'cost', 'mat'];
      let gg = `${event.target.value},${0},${0},${0}`.split(',');
      let result = {};
      keys.forEach((key, i) => (result[key] = gg[i]));
      row_phase.push(result);
      this.setState({
        rows: rows,
        row_phase: row_phase,
        phase: event.target.value,
      });
    } else {
      this.setState({ phase: '' });
    }
  };
  handleSelectMobileValue = (event) => {
    if (event.target.value !== "--Select--") {
      this.setState({
        isAddItem: true,
        mobileItemName: { items: event.target.value },
      });
    }
  };
  handleEditMobileValue = (event, index) => {
    event.idx = index;
    console.log(event, ">>>>>>>handleEditMobileValue", index);
    if (event.items) {
      this.setState({ isAddItem: true, mobileItemName: event });
    }
  };
  handleSelectMobile = (event) => {
    console.log(event, "?????event");
    if (event.itemName !== "" && event.itemPrice && event.quantity) {
      // this.setState({ phase: event.target.value });
      let rows = this.state.rows;
      let row_phase = this.state.row_phase;
      rows.push(this.state.phase);
      let keys = ["items", "dur", "cost", "mat"];
      let gg = `${event.itemName},${event.quantity},${event.itemPrice},${event.quantity * event.itemPrice
        }`.split(",");
      let result = {};
      keys.forEach((key, i) => (result[key] = gg[i]));
      if (event.idx || event.idx === 0) {
        row_phase[row_phase.findIndex((el, index) => index === event.idx)] =
          result;
      } else {
        row_phase.push(result);
      }
      this.setState({
        rows: rows,
        row_phase: row_phase,
        phase: event.itemName,
        isAddItem: false,
        mobileItemName: "",
      });
    } else {
      this.setState({ phase: "" });
    }
  };

  removeTemplate = async (e, id) => {
    e.preventDefault();
    const token = await localStorage.getItem('token');
    await axios
      .delete(`${url}/api/pro-plan/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        //   this.loadArea(this.axiosCancelSource);
        // this.loadConfig(this.axiosCancelSource);
        alert('deleted');
        window.location.reload();
      })
      .catch((err) => {
        //console.log(err);
      });

    // if (response.status === 200) {
    //   alert("deleted");
    //   window.location.reload();
    // }
  };

  handleAppend = (event) => {
    event.preventDefault();
    let rows = this.state.rows;
    let row_phase = this.state.row_phase;
    if (this.state.phase) {
      rows.push(this.state.phase);
      let keys = ['items', 'unit', 'dur', 'cost', 'mat'];
      let gg = `${this.state.phase},${0},${0},${0}`.split(',');
      let result = {};
      keys.forEach((key, i) => (result[key] = gg[i]));
      row_phase.push(result);
      this.setState({ rows: rows, row_phase: row_phase });
    }
  };

  setSubTotalMobil = (val) => {
    // this.setState((prevState) => {
    //   return {
    //     items_cost: prevState.items_cost + 1,
    //   };
    // })
    this.setState({ items_cost: this.state.items_cost + 1 });
  };

  addRow = () => {
    let row = this.state.rows;
    let row_phases = this.state.row_phase;
    row.push(this.state.phase);
    let key = ['items', 'unit', 'dur', 'cost', 'mat'];
    let ggs = `${''},${0},${0},${0},${0}`.split(',');
    let result = {};
    key.forEach((key, i) => (result[key] = ggs[i]));
    row_phases.push(result);
    this.setState({ rows: row, row_phase: row_phases });
    return false;
  };
  addRowMobile = () => {
    let row = this.state.rows;
    let row_phases = this.state.row_phase;
    row.push(this.state.phase);
    let key = ["items", "dur", "cost", "mat"];
    let ggs = `${""},${10},${20},${200}`.split(",");
    let result = {};
    key.forEach((key, i) => (result[key] = ggs[i]));
    row_phases.push(result);
    this.setState({ rows: row, row_phase: row_phases });
    return false;
  };

  checkallfields() {
    if (
      this.state.items ||
      this.state.est_time != '0' ||
      this.state.sub_total != '0' ||
      this.state.tax != '0' ||
      this.state.profit != '0' ||
      this.state.tax_calc != '0' ||
      this.state.profit_calc != '0' ||
      this.state.items_cost != '0' ||
      this.state.total != '0' ||
      this.state.phase
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

  render() {

    const _ = this.state.row_phase?.filter((x) => x.items == '');

    //  // console.log("this.state.row_phase", this.state.row_phase)
    //  // console.log("====", _ );
    //  // const aa = this.state.items.length > 0 ? this.state.items?.filter((x) => x.items != "") :"";
    //  // console.log("=====6523====");
    //  // if (this.state.items) {
    //  // const a = this.state.items?.filter((x) => x.items == 'any');
    //  // console.log("????????????",a );
    //  // console.log("==///////",JSON.parse(this.state.items));

    const { t } = this.props;

    const commonProps = {
      items: this.state.items,
      est_time: this.state.est_time,
      sub_total: this.state.sub_total,
      tax: this.state.tax,
      profit: this.state.profit,
      tax_calc: this.state.tax_calc,
      profit_calc: this.state.profit_calc,
      items_cost: this.state.items_cost,
      total: this.state.total,
    };
    let selectUnit = '';

    return (
      <React.Fragment>
        <Prompt
          when={this.state.redirect_page}
          message={t('myBusiness.offer.leave_page')}
        />
        <div>
          {/* <Header active={"bussiness"} /> */}
          <Breadcrumb>
            <li className='breadcrumb-item active project-planning'>
              <Link
                to='/business-dashboard'

                aria-current='page'
              >
                {t('myBusiness.offer.heading')}
              </Link>
            </li>
            <li className='breadcrumb-item active project-planning'>
              <Link
                to='/proposal-listing'
                aria-current='page'
              >
                {t('myBusiness.offer.proposal')}
              </Link>
            </li>
            <li className='breadcrumb-item active project-planning' aria-current='page'>
              {t('myBusiness.offer.create')}
            </li>
          </Breadcrumb>
          <div className='main-content'>
            <Sidebar dataFromParent={this.props.location.pathname} />
            <div className="page-content">
              <div className="container-fluid">
                <h3 className="head3">{t("myBusiness.offer.heading1")}</h3>
                {this.state.windowWidth > 575 ? (
                  <div className="card" style={{ maxWidth: "1150px" }}>
                    <div className="card-body">
                      <div className="project-planning-tabs">
                        <ul className="nav nav-pills row">
                          <li className="active col"><a className='active' data-toggle="pill" href="#work">Work</a></li>
                          <li className="col"><a data-toggle="pill" href="#material">Material</a></li>
                          <li className="col"><a data-toggle="pill" href="#work-material">Work and Material</a></li>

                        </ul>

                        <div className="tab-content">
                          <div id="work" className="tab-pane active">
                            <form>
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
                              <div className="row project_plan">
                                {/* <div className="col-6 col-md-4">
                                  <div className="form-group">
                                    <label>{t("myBusiness.offer.area")}</label>
                                    <select
                                      onChange={this.changePhase}
                                      className="form-control"
                                    >
                                      <option> {t("myproposal.Select")} </option>
                                      {this.state.area
                                        ? this.state.area.map(
                                          ({ area_id, area_identifier }, index) => (
                                            <option key={index} value={area_id}>
                                              {area_identifier}
                                            </option>
                                          )
                                        )
                                        : []}
                                    </select>
                                  </div>
                                </div> */}
                                {/* <div className="col-6 col-md-4">
                                  <div className="form-group">
                                    <label>{t("myBusiness.offer.phase")}</label>
                                    <select
                                      onChange={this.handleSelect}
                                      // name="phase"
                                      className="form-control"
                                    >
                                      <option>
                                        {" "}
                                        {t("myBusiness.offer.Select")}{" "}
                                      </option>
                                      {this.state.phases
                                        ? this.state.phases?.map(
                                          ({ aw_id, aw_identifier }, index) => {
                                            if (aw_id !== undefined) {
                                              return (
                                                <option
                                                  key={index}
                                                  value={aw_identifier}
                                                >
                                                  {aw_identifier}
                                                </option>
                                              );
                                            }
                                          }
                                        )
                                        : []}
                                    </select>*/}
                                {/* <button
                              onClick={this.handleAppend}
                              className="btn btn-primary"
                            >
                              Add
                            </button> */}
                                {/* </div>
                                </div> */}
                                {/* <div className="col-6 col-md-2">
                                  <div className="form-group">
                                    <button
                                      onClick={this.addRow}
                                      type="button"
                                      className="btn btn-primary"
                                    >
                                      {t("myBusiness.offer.AddRow")}
                                    </button>

                                    {/* <button onClick={this.addRow}  className="btn btn-primary"> Add Row </button> */}

                                {/*{this.state.loaded > 0 ? (
                                  <button
                                    onClick={(e) =>
                                      this.removeTemplate(e, this.state.id)
                                    }
                                    className="btn btn-danger"
                                  >
                                    {t("myBusiness.offer.Delete")}
                                  </button>
                                ) : null}
                              </div>
                          </div> */}
                                <div className="col-sm-2">
                                  <div className="form-group text-right">
                                    <label className="d-xl-none">&nbsp;</label>
                                    <div className="dropdown mt-2">
                                      <a
                                        className="btn btn-light dropdown-toggle"
                                        type="button"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                      >
                                        {t("myBusiness.offer.template")}
                                      </a>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <button
                                          // onClick={(e) => e.preventDefault()}
                                          // data-toggle="modal"
                                          // data-target="#open"
                                          className="dropdown-item"
                                          type="button"
                                          onClick={() => this.handlePlanOpen()}
                                        >
                                          {t("myBusiness.offer.save_temp")}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </form>
                            {/* <div className="mt-4"></div> */}
                            {/* <h5 className="head6">
                        {t("myBusiness.offer.new_task")}
                      </h5> */}
                            <div id='project-planning-table' className="table-responsive scroller">
                              <table
                                id="mytable"
                                className="table table-bordered table-sm"
                              >
                                <thead>
                                  <tr className="text-right">
                                    <th className="text-left work-item">
                                      {t("project_planning.items")}
                                    </th>
                                    <th className='work-item-detail'>{t("myBusiness.offer.duration")}</th>
                                    <th className='work-item-detail'>{t("myBusiness.offer.cost_hr")}</th>
                                    <th className='work-item-detail'>{t("myBusiness.offer.total_cost")}</th>
                                    <th className='work-item-detail'>Unit</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.row_phase.map((r, index) => (
                                    <Row
                                      phase={r}
                                      key={index}
                                      idx={index}
                                      items={this.state.items}
                                      deleteRow={this.deleteRow}
                                      unit={this.state.selectOption}
                                    />
                                  ))}
                                  {/*
                                  <tr
                                    style={{ lineHeight: "30px", fontWeight: "bold" }}
                                    className="text-right"
                                  >
                                    <td data-label="Items: ">

                                    </td>
                                    <td>
                                      <select value={this.selectOption} onChange={(e) => {
                                        this.handleSelectOption(e)

                                      }} >
                                        <option> Select</option>
                                        <option value="HRS">HRS</option>
                                        <option value="LTS">LTS</option>
                                        <option value="PCS">PCS</option>
                                        <option value="KG">KG</option>
                                      </select>
                                    </td>

                                    <td data-label="Duration(hrs): " id="1result">
                                      {this.state.est_time}
                                    </td>
                                    <td data-label="Cost/hr: "></td>
                                    <td data-label="Total cost: "></td>
                                  </tr> */}

                                  <tr className='add-row-btn'>
                                    <button
                                      onClick={this.addRow}
                                      type="button"
                                      className="add_item_btn"
                                    >
                                      Add Item
                                    </button>
                                  </tr>
                                  {/* <tr>
                              <td data-label="Items: ">&nbsp;</td>
                              <td></td>
                              <td data-label="Duration(hrs): "></td>
                              <td data-label="Cost/hr: "></td>
                              <td data-label="Total cost: "></td>
                            </tr> */}

                                  <tr className="text-right">
                                    <td className='td-remove-border' data-label="Items: "></td>

                                    <td data-label="Duration(hrs): ">
                                      {this.state.left}{" "}
                                      {t("myBusiness.offer.sub_total")}{" "}
                                      {this.state.right}
                                    </td>
                                    {/* <td data-label="Cost/hr: " id="2result">
                                {this.state.sub_total}
                              </td> */}
                                    <td colSpan='3' data-label="Total cost: " id="3result" className='sub-total'>
                                      {this.state.items_cost}
                                    </td>
                                  </tr>

                                  <tr className="text-right tax-tr">
                                    <td colSpan="2" data-label="Items: ">
                                      {t("myBusiness.offer.tax")}%
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
                                    <td colSpan="2" data-label="Items: ">
                                      {t("myBusiness.offer.profit")}%
                                    </td>

                                    <td
                                      data-label="Duration(hrs): "
                                      className="profit"
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      {this.state.profit}
                                    </td>
                                    {/* <td data-label="Duration(hrs): "></td> */}
                                    <td colSpan="2"
                                      data-label="Total cost: "
                                      className="profit_res"
                                    >
                                      {this.state.profit_calc}
                                    </td>
                                  </tr>
                                  <tr className="text-right">
                                    <td colSpan="2" data-label="Items: ">
                                      {this.state.left} {t("myBusiness.offer.total")}{" "}
                                      {this.state.right}
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
                            </div>

                            {this.state.loaded > 0 ? (
                              <button
                                onClick={this.updateData}
                                className="btn btn-primary clk"
                              >
                                {t("myBusiness.offer.upd_curr")}
                              </button>
                            ) : (
                              <div className='d-flex justify-content-between flex-wrap'>
                                <div>
                                  <button
                                    onClick={this.saveData}
                                    data-toggle="modal"
                                    data-target="#save"
                                    className="btn btn-primary clk btn-without-radius"
                                  >
                                    {t("myBusiness.offer.save_curr")}
                                  </button>

                                  <button className="btn btn-without-radius bg-grey">
                                    Copy quotation
                                  </button>
                                </div>

                                <div>
                                  <button className="btn btn-without-radius bg-grey mr-0">
                                    Reset
                                  </button>
                                </div>
                              </div>

                            )}
                          </div>
                          <div id="material" className="tab-pane fade">
                            <form>
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
                              <div className="row project_plan">
                                {/* <div className="col-6 col-md-4">
                                  <div className="form-group">
                                    <label>{t("myBusiness.offer.area")}</label>
                                    <select
                                      onChange={this.changePhase}
                                      className="form-control"
                                    >
                                      <option> {t("myproposal.Select")} </option>
                                      {this.state.area
                                        ? this.state.area.map(
                                          ({ area_id, area_identifier }, index) => (
                                            <option key={index} value={area_id}>
                                              {area_identifier}
                                            </option>
                                          )
                                        )
                                        : []}
                                    </select>
                                  </div>
                                </div> */}
                                {/* <div className="col-6 col-md-4">
                                  <div className="form-group">
                                    <label>{t("myBusiness.offer.phase")}</label>
                                    <select
                                      onChange={this.handleSelect}
                                      // name="phase"
                                      className="form-control"
                                    >
                                      <option>
                                        {" "}
                                        {t("myBusiness.offer.Select")}{" "}
                                      </option>
                                      {this.state.phases
                                        ? this.state.phases?.map(
                                          ({ aw_id, aw_identifier }, index) => {
                                            if (aw_id !== undefined) {
                                              return (
                                                <option
                                                  key={index}
                                                  value={aw_identifier}
                                                >
                                                  {aw_identifier}
                                                </option>
                                              );
                                            }
                                          }
                                        )
                                        : []}
                                    </select>
                                    {/* <button
                              onClick={this.handleAppend}
                              className="btn btn-primary"
                            >
                              Add
                            </button> */}
                                {/* </div>
                                </div>  */}
                                {/* <div className="col-6 col-md-2">
                                  <div className="form-group">
                                    <button
                                      onClick={this.addRow}
                                      type="button"
                                      className="btn btn-primary"
                                    >
                                      {t("myBusiness.offer.AddRow")}
                                    </button> */}

                                {/* <button onClick={this.addRow}  className="btn btn-primary"> Add Row </button> */}

                                {/* {this.state.loaded > 0 ? (
                                      <button
                                        onClick={(e) =>
                                          this.removeTemplate(e, this.state.id)
                                        }
                                        className="btn btn-danger"
                                      >
                                        {t("myBusiness.offer.Delete")}
                                      </button>
                                    ) : null}
                                  </div>
                                </div> */}
                                <div className="col-sm-2">
                                  <div className="form-group text-right">
                                    <label className="d-xl-none">&nbsp;</label>
                                    <div className="dropdown mt-2">
                                      <a
                                        className="btn btn-light dropdown-toggle"
                                        type="button"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                      >
                                        {t("myBusiness.offer.template")}
                                      </a>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <button
                                          // onClick={(e) => e.preventDefault()}
                                          // data-toggle="modal"
                                          // data-target="#open"
                                          className="dropdown-item"
                                          type="button"
                                          onClick={() => this.handlePlanOpen()}
                                        >
                                          {t("myBusiness.offer.save_temp")}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </form>
                            {/* <div className="mt-4"></div> */}
                            {/* <h5 className="head6">
                        {t("myBusiness.offer.new_task")}
                      </h5> */}
                            <div id='project-planning-table' className="table-responsive scroller">
                              <table
                                id="mytable"
                                className="table table-bordered table-sm"
                              >
                                <thead>
                                  <tr className="text-right">
                                    <th className="text-left work-item">
                                      {t("project_planning.items")}
                                    </th>
                                    <th className='work-item-detail'>{t("myBusiness.offer.duration")}</th>
                                    <th className='work-item-detail'>{t("myBusiness.offer.cost_hr")}</th>
                                    <th className='work-item-detail'>{t("myBusiness.offer.total_cost")}</th>
                                    <th className='work-item-detail'>Unit</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.row_phase.map((r, index) => (
                                    <Row
                                      phase={r}
                                      key={index}
                                      idx={index}
                                      items={this.state.items}
                                      deleteRow={this.deleteRow}
                                      unit={this.state.selectOption}
                                    />
                                  ))}
                                  {/*
                                  <tr
                                    style={{ lineHeight: "30px", fontWeight: "bold" }}
                                    className="text-right"
                                  >
                                    <td data-label="Items: ">
                                     {t("myBusiness.offer.est_time")}
                                      </td>
                                    <td>
                                      <select value={this.selectOption} onChange={(e) => {
                                        this.handleSelectOption(e)
                                        // selectUnit = e.target.value;
                                      }} >
                                        <option> Select</option>
                                        <option value="HRS">HRS</option>
                                        <option value="LTS">LTS</option>
                                        <option value="PCS">PCS</option>
                                        <option value="KG">KG</option>
                                      </select>
                                    </td>

                                    <td data-label="Duration(hrs): " id="1result">
                                      {this.state.est_time}
                                    </td>
                                    <td data-label="Cost/hr: "></td>
                                    <td data-label="Total cost: "></td>
                                  </tr> */}

                                  <tr className='add-row-btn'>
                                    <button
                                      onClick={this.addRow}
                                      type="button"
                                      className="add_item_btn"
                                    >
                                      Add Item
                                    </button>
                                  </tr>
                                  {/* <tr>
                              <td data-label="Items: ">&nbsp;</td>
                              <td></td>
                              <td data-label="Duration(hrs): "></td>
                              <td data-label="Cost/hr: "></td>
                              <td data-label="Total cost: "></td>
                            </tr> */}

                                  <tr className="text-right">
                                    <td className='td-remove-border' data-label="Items: "></td>

                                    <td data-label="Duration(hrs): ">
                                      {this.state.left}{" "}
                                      {t("myBusiness.offer.sub_total")}{" "}
                                      {this.state.right}
                                    </td>
                                    {/* <td data-label="Cost/hr: " id="2result">
                                {this.state.sub_total}
                              </td> */}
                                    <td colSpan='3' data-label="Total cost: " id="3result" className='sub-total'>
                                      {this.state.items_cost}
                                    </td>
                                  </tr>

                                  <tr className="text-right tax-tr">
                                    <td colSpan="2" data-label="Items: ">
                                      {t("myBusiness.offer.tax")}%
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
                                    <td colSpan="2" data-label="Items: ">
                                      {t("myBusiness.offer.profit")}%
                                    </td>

                                    <td
                                      data-label="Duration(hrs): "
                                      className="profit"
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      {this.state.profit}
                                    </td>
                                    {/* <td data-label="Duration(hrs): "></td> */}
                                    <td colSpan="2"
                                      data-label="Total cost: "
                                      className="profit_res"
                                    >
                                      {this.state.profit_calc}
                                    </td>
                                  </tr>
                                  <tr className="text-right">
                                    <td colSpan="2" data-label="Items: ">
                                      {this.state.left} {t("myBusiness.offer.total")}{" "}
                                      {this.state.right}
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
                            </div>

                            {this.state.loaded > 0 ? (
                              <button
                                onClick={this.updateData}
                                className="btn btn-primary clk"
                              >
                                {t("myBusiness.offer.upd_curr")}
                              </button>
                            ) : (
                              <div className='d-flex justify-content-between flex-wrap'>
                                <div>
                                  <button
                                    onClick={this.saveData}
                                    data-toggle="modal"
                                    data-target="#save"
                                    className="btn btn-primary clk btn-without-radius"
                                  >
                                    {t("myBusiness.offer.save_curr")}
                                  </button>

                                  <button className="btn btn-without-radius bg-grey">
                                    Copy quotation
                                  </button>
                                </div>

                                <div>
                                  <button className="btn btn-without-radius bg-grey mr-0">
                                    Reset
                                  </button>
                                </div>
                              </div>

                            )}
                          </div>
                          <div id="work-material" className="tab-pane fade">
                            <form>
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
                              <div className="row project_plan">
                                {/* <div className="col-6 col-md-4">
                                  <div className="form-group">
                                    <label>{t("myBusiness.offer.area")}</label>
                                    <select
                                      onChange={this.changePhase}
                                      className="form-control"
                                    >
                                      <option> {t("myproposal.Select")} </option>
                                      {this.state.area
                                        ? this.state.area.map(
                                          ({ area_id, area_identifier }, index) => (
                                            <option key={index} value={area_id}>
                                              {area_identifier}
                                            </option>
                                          )
                                        )
                                        : []}
                                    </select>
                                  </div>
                                </div> */}
                                {/* <div className="col-6 col-md-4">
                                  <div className="form-group">
                                    <label>{t("myBusiness.offer.phase")}</label>
                                    <select
                                      onChange={this.handleSelect}
                                      // name="phase"
                                      className="form-control"
                                    >
                                      <option>
                                        {" "}
                                        {t("myBusiness.offer.Select")}{" "}
                                      </option>
                                      {this.state.phases
                                        ? this.state.phases?.map(
                                          ({ aw_id, aw_identifier }, index) => {
                                            if (aw_id !== undefined) {
                                              return (
                                                <option
                                                  key={index}
                                                  value={aw_identifier}
                                                >
                                                  {aw_identifier}
                                                </option>
                                              );
                                            }
                                          }
                                        )
                                        : []}
                                    </select>
                                    {/* <button
                              onClick={this.handleAppend}
                              className="btn btn-primary"
                            >
                              Add
                            </button> */}
                                {/* </div>
                                </div> */}
                                {/* <div className="col-6 col-md-2">
                                  <div className="form-group">
                                    <button
                                      onClick={this.addRow}
                                      type="button"
                                      className="btn btn-primary"
                                    >
                                      {t("myBusiness.offer.AddRow")}
                                    </button>

                                    {/* <button onClick={this.addRow}  className="btn btn-primary"> Add Row </button> */}

                                {/*{this.state.loaded > 0 ? (
                                      <button
                                        onClick={(e) =>
                                          this.removeTemplate(e, this.state.id)
                                        }
                                        className="btn btn-danger"
                                      >
                                        {t("myBusiness.offer.Delete")}
                                      </button>
                                    ) : null}
                                  </div>
                                </div> */}
                                <div className="col-sm-2">
                                  <div className="form-group text-right">
                                    <label className="d-xl-none">&nbsp;</label>
                                    <div className="dropdown mt-2">
                                      <a
                                        className="btn btn-light dropdown-toggle"
                                        type="button"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                      >
                                        {t("myBusiness.offer.template")}
                                      </a>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <button
                                          // onClick={(e) => e.preventDefault()}
                                          // data-toggle="modal"
                                          // data-target="#open"
                                          className="dropdown-item"
                                          type="button"
                                          onClick={() => this.handlePlanOpen()}
                                        >
                                          {t("myBusiness.offer.save_temp")}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </form>
                            {/* <div className="mt-4"></div> */}
                            {/* <h5 className="head6">
                        {t("myBusiness.offer.new_task")}
                      </h5> */}
                            <div id='project-planning-table' className="table-responsive scroller">
                              <table
                                id="mytable"
                                className="table table-bordered table-sm"
                              >
                                <thead>
                                  <tr className="text-right">
                                    <th className="text-left work-item">
                                      {t("project_planning.items")}
                                    </th>
                                    <th className='work-item-detail'>{t("myBusiness.offer.duration")}</th>
                                    <th className='work-item-detail'>{t("myBusiness.offer.cost_hr")}</th>
                                    <th className='work-item-detail'>{t("myBusiness.offer.total_cost")}</th>
                                    <th className='work-item-detail'>Unit</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.row_phase.map((r, index) => (
                                    <Row
                                      phase={r}
                                      key={index}
                                      idx={index}
                                      items={this.state.items}
                                      deleteRow={this.deleteRow}
                                      unit={this.state.selectOption}
                                    />
                                  ))}

                                  {/* <tr
                                    style={{ lineHeight: "30px", fontWeight: "bold" }}
                                    className="text-right"
                                  >
                                    <td data-label="Items: ">
                                      {/* {t("myBusiness.offer.est_time")} */}
                                  {/*</td>
                                    <td>
                                      <select value={this.selectOption} onChange={(e) => {
                                        this.handleSelectOption(e)
                                        // selectUnit = e.target.value;
                                      }} >
                                        <option> Select</option>
                                        <option value="HRS">HRS</option>
                                        <option value="LTS">LTS</option>
                                        <option value="PCS">PCS</option>
                                        <option value="KG">KG</option>
                                      </select>
                                    </td>

                                    <td data-label="Duration(hrs): " id="1result">
                                      {this.state.est_time}
                                    </td>
                                    <td data-label="Cost/hr: "></td>
                                    <td data-label="Total cost: "></td>
                                  </tr> */}

                                  <tr className='add-row-btn'>
                                    <button
                                      onClick={this.addRow}
                                      type="button"
                                      className="add_item_btn"
                                    >
                                      Add Item
                                    </button>
                                  </tr>
                                  {/* <tr>
                              <td data-label="Items: ">&nbsp;</td>
                              <td></td>
                              <td data-label="Duration(hrs): "></td>
                              <td data-label="Cost/hr: "></td>
                              <td data-label="Total cost: "></td>
                            </tr> */}

                                  <tr className="text-right">
                                    <td className='td-remove-border' data-label="Items: "></td>

                                    <td data-label="Duration(hrs): ">
                                      {this.state.left}{" "}
                                      {t("myBusiness.offer.sub_total")}{" "}
                                      {this.state.right}
                                    </td>
                                    {/* <td data-label="Cost/hr: " id="2result">
                                {this.state.sub_total}
                              </td> */}
                                    <td colSpan='3' data-label="Total cost: " id="3result" className='sub-total'>
                                      {this.state.items_cost}
                                    </td>
                                  </tr>

                                  <tr className="text-right tax-tr">
                                    <td colSpan="2" data-label="Items: ">
                                      {t("myBusiness.offer.tax")}%
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
                                    <td colSpan="2" data-label="Items: ">
                                      {t("myBusiness.offer.profit")}%
                                    </td>

                                    <td
                                      data-label="Duration(hrs): "
                                      className="profit"
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      {this.state.profit}
                                    </td>
                                    {/* <td data-label="Duration(hrs): "></td> */}
                                    <td colSpan="2"
                                      data-label="Total cost: "
                                      className="profit_res"
                                    >
                                      {this.state.profit_calc}
                                    </td>
                                  </tr>
                                  <tr className="text-right">
                                    <td colSpan="2" data-label="Items: ">
                                      {this.state.left} {t("myBusiness.offer.total")}{" "}
                                      {this.state.right}
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
                            </div>

                            {this.state.loaded > 0 ? (
                              <button
                                onClick={this.updateData}
                                className="btn btn-primary clk"
                              >
                                {t("myBusiness.offer.upd_curr")}
                              </button>
                            ) : (
                              <div className='d-flex justify-content-between flex-wrap'>
                                <div>
                                  <button
                                    onClick={this.saveData}
                                    data-toggle="modal"
                                    data-target="#save"
                                    className="btn btn-primary clk btn-without-radius"
                                  >
                                    {t("myBusiness.offer.save_curr")}
                                  </button>

                                  <button className="btn btn-without-radius bg-grey">
                                    Copy quotation
                                  </button>
                                </div>

                                <div>
                                  <button className="btn btn-without-radius bg-grey mr-0">
                                    Reset
                                  </button>
                                </div>
                              </div>

                            )}
                          </div>

                        </div>
                      </div>
                      {/* <div className="btn-tab row">
                        <div className="col">
                          <button id='work-btn' className={`${this.state.btnActive === "work-btn" ? 'active' : ''} ${this.state.btnTabFirst}`} onClick={this.handleActiveButton}>Work</button>
                        </div>
                        <div className="col">
                          <button id='material-btn' className={`${this.state.btnActive === "material-btn" ? 'active' : ''}`} onClick={this.handleActiveButton}>Material</button>
                        </div>
                        <div className="col">
                          <button id='work-material-btn' className={`${this.state.btnActive === "work-material-btn" ? 'active' : ''}`} onClick={this.handleActiveButton}>Work and Material</button>
                        </div>
                      </div> */}

                    </div>
                  </div>
                ) : (
                  <TableMobile t={t} this={this} />
                )}
                <ProjectPlanModal reset={this.reset} data={commonProps} />
                <ProjectPlanOpen
                  show={this.state.isPlanOpen}
                  handleClose={this.handlePlanOpen}
                  onSelectedName={this.handleTemplate}
                />
              </div>
            </div>
          </div >
        </div >
      </React.Fragment >
    );
  }
}
export const TableMobile = (props) => {
  // const itemsMap = useMemo(()=>{
  //   return(
  //     props.this.state.row_phase
  //   )
  // },[props.this.state.row_phase])
  let subtotal = 0;
  let totalCost = 0;
  let totalDur = 0;
  console.log(">>>>>>>>>itemsMap", subtotal);
  return (
    <div className="template_mobile">
      <div className="template_mobile_container">
        <h3>Create Project Plan</h3>
        <div className="template_mobile_to">
          <form>
            <input
              type="hidden"
              ref={(input) => {
                props.this.itemsInput = input;
              }}
              id="items"
            />
            <input
              type="hidden"
              ref={(input) => {
                props.this.est_timeInput = input;
              }}
              id="est_time"
            />
            <input
              type="hidden"
              ref={(input) => {
                props.this.sub_totalInput = input;
              }}
              id="sub_total"
            />
            <input
              type="hidden"
              ref={(input) => {
                props.this.taxInput = input;
              }}
              id="tax"
            />
            <input
              type="hidden"
              ref={(input) => {
                props.this.profitInput = input;
              }}
              id="profit"
            />
            <input
              type="hidden"
              ref={(input) => {
                props.this.tax_calcInput = input;
              }}
              id="tax_calc"
            />
            <input
              type="hidden"
              ref={(input) => {
                props.this.profit_calcInput = input;
              }}
              id="profit_calc"
            />
            <input
              type="hidden"
              ref={(input) => {
                props.this.items_costInput = input;
              }}
              id="items_cost"
            />
            <input
              type="hidden"
              ref={(input) => {
                props.this.totalInput = input;
              }}
              id="total"
            />
          </form>
          <div className="search_box">
            <label>{props.t("myBusiness.offer.area")}</label>
            <select onChange={props.this.changePhase} className="form-control">
              <option> {props.t("myproposal.Select")} </option>
              {props.this.state.area
                ? props.this.state.area.map(
                  ({ area_id, area_identifier }, index) => (
                    <option key={index} value={area_id}>
                      {area_identifier}
                    </option>
                  )
                )
                : []}
            </select>
          </div>
          <div className="search_box mt-3">
            <label>{props.t("myBusiness.offer.phase")}</label>
            <select
              onChange={props.this.handleSelectMobileValue}
              // name="phase"
              className="form-control"
            >
              <option> {props.t("myBusiness.offer.Select")} </option>
              {props.this.state.phases
                ? props.this.state.phases?.map(
                  ({ aw_id, aw_identifier }, index) => {
                    if (aw_id !== undefined) {
                      return (
                        <option key={index} value={aw_identifier}>
                          {aw_identifier}
                        </option>
                      );
                    }
                  }
                )
                : []}
            </select>
          </div>
          <div className="dropdown mt-3 d-flex">
            <div>
              <a
                className="btn btn-light dropdown-toggle"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {props.t("myBusiness.offer.template")}
              </a>
              <div className="dropdown-menu dropdown-menu-right">
                <button
                  // onClick={(e) => e.preventDefault()}
                  // data-toggle="modal"
                  // data-target="#open"
                  className="dropdown-item"
                  type="button"
                  onClick={() => props.this.handlePlanOpen()}
                >
                  {props.t("myBusiness.offer.save_temp")}
                </button>
              </div>
            </div>
            {props.this.state.loaded > 0 ? (
              <div className="ml-5">
                <button
                  onClick={(e) =>
                    props.this.removeTemplate(e, props.this.state.id)
                  }
                  className="btn btn-danger"
                >
                  {props.t("myBusiness.offer.Delete")}
                </button>
              </div>
            ) : null}
          </div>
        </div>
        <div className="template_table">
          <div className="template_table_title">
            <h5>Item Name</h5>
            <h5>Item Price &#8364;</h5>
            <h5>total Price &#8364;</h5>
            {/* <h5>Item Title</h5> */}
          </div>
        </div>
      </div>
      {props.this.state.row_phase.map((r, index) => {
        // props.this.setSubTotalMobil(r.mat)
        // props.this.setState({items_cost: subtotal})
        subtotal += Number(r.mat);
        totalCost += Number(r.cost);
        totalDur += Number(r.dur);
        console.log("&&&&&&&&&", subtotal, totalCost, totalDur);
        return (
          <div className="template_table_item customerIDCell">
            <div
              data-value={r.items}
              className="prop_items"
              // contentEditable="true"
              suppressContentEditableWarning={true}
              data-label="Items: "
            >
              {r.items}
              <div>
                <span
                  className="duration"
                  // contentEditable="true"
                  suppressContentEditableWarning={true}
                  data-label="Duration(hrs): "
                >
                  {r.dur}
                </span>{" "}
                hrs
              </div>
            </div>
            <div>
              <span
                className="cost_hr"
                suppressContentEditableWarning={true}
                // contentEditable="true"
                data-label="Cost/hr: "
              >
                {r.cost}
              </span>
            </div>
            <div>
              <span className="mat_cost" data-label="Total cost: ">
                {r.mat}
              </span>
            </div>
            <div>
              <img
                onClick={(e) => props.this.handleEditMobileValue(r, index)}
                src={EditIcon}
                alt="EditIcon"
              />
            </div>
            <div>
              <img
                onClick={(e) => props.this.deleteRow(index)}
                src={DeleteIcon}
                width={20}
                alt="EditIcon"
              />
            </div>
          </div>
        );
      })}
      {/* <div className="template_table_item">
      <div>
        Asbestikartoitus
        <div>
          <span>30kg</span>
        </div>
      </div>
      <div>
        <span>10 &#8364;</span>
      </div>
      <div>
        <span>100 &#8364;</span>
      </div>
      <div>
        <img src={EditIcon} alt="EditIcon" />
      </div>
    </div>
    <div className="template_table_item">
      <div>
        Asbestikartoitus
        <div>
          <span>30kg</span>
        </div>
      </div>
      <div>
        <span>10 &#8364;</span>
      </div>
      <div>
        <span>100 &#8364;</span>
      </div>
      <div>
        <img src={EditIcon} alt="EditIcon" />
      </div>
    </div> */}
      <div className="template_mobile_container">
        <div className="sub_total_area">
          <div>
            <button
              onClick={props.this.handleProjectPlaningModal}
              className="add_item_btn"
            >
              Add Items
            </button>
          </div>
          {subtotal ? (
            <div className="sub_total_box">
              <div className="sub_total_items border-bottom">
                <div>Sub total</div>
                <div id="3resul">
                  {subtotal ? subtotal : props.this.state.items_cost}
                </div>
              </div>
              <div className="sub_total_items">
                <div>
                  <span>Total Tax</span>
                  <div className="tax_re">
                    {((subtotal * props.this.state.tax) / 100).toFixed(2)}
                  </div>
                </div>
                <div>Add tax in %</div>
                <div className="sub_total_input_box">
                  <input
                    className="tax"
                    type="number"
                    value={props.this.state.tax}
                    onChange={(e) =>
                      props.this.setState({ tax: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="sub_total_items border-bottom">
                <div>
                  <span>Total Profit</span>
                  <div className="profit_re">
                    {((subtotal * props.this.state.profit) / 100).toFixed(2)}
                  </div>
                </div>
                <div>Add Profit in %</div>
                <div className="sub_total_input_box">
                  <input
                    type="number"
                    className="profit"
                    value={props.this.state.profit}
                    onChange={(e) =>
                      props.this.setState({ profit: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="sub_total_items border-bottom">
                <div>Grand Total</div>
                <div>
                  <strong className="tota">
                    {subtotal
                      ? (
                        subtotal +
                        (subtotal * props.this.state.tax) / 100 +
                        (subtotal * props.this.state.profit) / 100
                      ).toFixed(2)
                      : props.this.state.total}
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="save_template_btn">
          <div className="save_template_left">
            {props.this.state.loaded > 0 ? (
              <button
                onClick={() =>
                  props.this.updateDataMobile({
                    subtotal: subtotal,
                    totalCost: totalCost,
                    totalDur: totalDur,
                  })
                }
                className="btn btn-primary clk-mobile-tamp"
              >
                {props.t("myBusiness.offer.upd_curr")}
              </button>
            ) : (
              <button
                onClick={() =>
                  props.this.saveDataMobile({
                    subtotal: subtotal,
                    totalCost: totalCost,
                    totalDur: totalDur,
                  })
                }
                data-toggle="modal"
                data-target="#save"
                className="btn btn-primary clk-mobile-tamp"
              >
                {props.t("myBusiness.offer.save_curr")}
              </button>
            )}
          </div>
          <div className="save_template_right">
            {/* <button className="copy_btn">copy</button> */}
            <button
              className="reset_btn"
              onClick={() => window.location.reload()}
            >
              reset
            </button>
          </div>
        </div>
      </div>
      {props.this.state.isAddItem && (
        <ProjectPlanningModal
          handleClose={props.this.handleProjectPlaningModal}
          handleSelectMobile={props.this.handleSelectMobile}
          mobileItemName={props.this.state.mobileItemName}
        />
      )}
    </div>
  );
};

export const Row = (props) => {
  // console.log(props.selectOptionNewRow, 'row props check');
  // console.log(props.handleSelectOptionNewRow(), 'test');
  return (
    <tr className='i-val customerIDCell'>
      {/* <td >
      <span
        id="myRemove"
        className="text-left "
        contentEditable="false"
        onClick={(e) => props.deleteRow(props.idx)}
        loading="true"
        suppressContentEditableWarning={true}>
        ×  </span>

      <sapn data-value={props.phase.items}
        className="text-left new_poro"
        data-label="Items: "
        contentEditable="true"
        suppressContentEditableWarning={true}>
        {props.phase.items}  </sapn>

        </td> */}

      <td
        className='custom_items'
      // data-value={props.phase.items}
      // className="text-left "
      // contenteditable="true"
      // data-label="Items: "
      >
        <span
          // className="remove-row"
          id='myRemove'
          className='text-left '
          contentEditable='false'
          suppressContentEditableWarning={true}
          onClick={(e) => props.deleteRow(props.idx)}
        >
          × &nbsp;
        </span>
        <span
          data-value={props.phase.items}
          className='text-right prop_items'
          contentEditable='true'
          suppressContentEditableWarning={true}
          data-label='Items: '
        >
          &nbsp; {props.phase.items}
        </span>
      </td>

      {/* <span
  // onClick={(e) => props.deleteRow(props.idx)}
  className="remove-row"
  id="myRemove"
>
  ×  &nbsp;
</span> */}
      <td
        className='duration text-right'
        contentEditable='true'
        suppressContentEditableWarning={true}
        data-label='Duration(hrs): '
      >
        {props.phase.dur}
      </td>
      <td
        className='cost_hr text-right'
        suppressContentEditableWarning={true}
        contentEditable='true'
        data-label='Cost/hr: '
      >
        {props.phase.cost}
      </td>
      <td className='mat_cost text-right' data-label='Total cost: '>
        {props.phase.mat}
      </td>
      <td>
        {/* {console.log(props.state.selectOptionNewRow, 'selectOptionRow')} */}
        <select className="form-control"
          value={props.selectOptionNewRow}
        // onChange={(e) => props.handleSelectOptionNewRow(props.e)}
        >
          <option> Select </option>
          <option value="HRS">HRS</option>
          <option value="LTS">LTS</option>
          <option value="PCS">PCS</option>
          <option value="KG">KG</option>
        </select>
      </td>
      {/* <td>
<span
  // onClick={(e) => props.deleteRow(props.idx)}
  className="remove-row"
  id="myRemove"
>  × </span>
</td> */}
    </tr>
  );
};
export default withTranslation()(ProjectPlanning);
