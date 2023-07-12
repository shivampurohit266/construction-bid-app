import React, { Component, useEffect, useMemo, useState } from "react";
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
import TemplateTabs from "./TemplateTabs";
import "./CreateProject.css";
import { getData, modifyDataWithTokenAndParams } from "../../../helper/api";
import "./ProjectPlanningNew.css";
import SweetAlert from "react-bootstrap-sweetalert";
import ProjectPlanMobile from "./ProjectPlanMobile";
import "./ProjectPlanMobile.scss";

const ProjectPlanningNew = ({ t }) => {
  const [succesUpdate, setSuccesUpdate] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [row_phase, setRow_phase] = useState([
    { items: "", unit: "", dur: "", cost: "", mat: 0 },
  ]);
  const [row_phaseMat, setRow_phaseMat] = useState([
    { items: "", unit: "", dur: "", cost: "", mat: 0 },
  ]);
  const [loaded, setLoaded] = useState(0);
  const [taxInput, setTaxInput] = useState(0);
  const [taxInputWork, setTaxInputWork] = useState(0);
  const [taxInputMat, setTaxInputMat] = useState(0);
  const [profitInput, setProfitInput] = useState(0);
  const [profitInputWork, setProfitInputWork] = useState(0);
  const [profitInputMat, setProfitInputMat] = useState(0);
  const [items_cost_subtotalWork, setItems_cost_subtotalWork] = useState(0);
  const [items_cost_subtotalMat, setItems_cost_subtotalMat] = useState(0);
  const [items_cost_subtotal, setItems_cost_subtotal] = useState(0);
  const [template_name, setTemplate_name] = useState("");

  const [items, setItems] = useState("");
  const [itemsMaterial, setItemsMaterial] = useState("");
  const [est_time, setEst_time] = useState("");
  const [est_cost, setEst_cost] = useState("");
  const [type, setType] = useState("Work");
  const [allTamp, setAllTamp] = useState([]);
  const [tax_calcWork, setTax_calcWork] = useState("");
  const [tax_calcMat, setTax_calcMat] = useState("");
  const [profit_calcWork, setProfit_calcWork] = useState("");
  const [profit_calcMat, setProfit_calcMat] = useState("");
  const [totalWork, setTotalWork] = useState("");
  const [totalMat, setTotalMat] = useState("");

  const tampName = window.location.pathname.split("new/")[1];

  useEffect(() => {
    loadNames();
    if (tampName) {
      loadTemplate(tampName);
    }
  }, [type]);
  const loadNames = async () => {
    const token = await localStorage.getItem("token");
    await getData(`${url}/api/pro-plan/names/${type}`, token)
      .then((result) => {
        if (result.data?.data) {
          setAllTamp(result.data?.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const reset = () => {
    setRow_phase([{ items: "", unit: "", dur: "", cost: "", mat: 0 }]);
    setRow_phaseMat([{ items: "", unit: "", dur: "", cost: "", mat: 0 }]);
    setTaxInput(0);
    setProfitInput(0);
    setTaxInputWork(0);
    setProfitInputWork(0);
    setTaxInputMat(0);
    setProfitInputMat(0);
    setItems_cost_subtotal(0);
    setItems_cost_subtotalMat(0);
    setItems_cost_subtotalWork(0);
    setLoaded(0);
  };

  const addRow = () => {
    // let row = this.state.rows;
    let row_phases = [...row_phase];
    // row.push(this.state.phase);
    let key = ["items", "unit", "dur", "cost", "mat"];
    let ggs = `${""},${""},${""},${""},${0}`.split(",");
    let result = {};
    key.forEach((key, i) => (result[key] = ggs[i]));
    row_phases.push(result);
    setRow_phase(row_phases);
    return false;
  };
  const addRowMaterial = () => {
    // let row = this.state.rows;
    let row_phases = [...row_phaseMat];
    // row.push(this.state.phase);
    let key = ["items", "unit", "dur", "cost", "mat"];
    let ggs = `${""},${""},${""},${""},${0}`.split(",");
    let result = {};
    key.forEach((key, i) => (result[key] = ggs[i]));
    row_phases.push(result);
    setRow_phaseMat(row_phases);
    return false;
  };

  const deleteRow = (index) => {
    let row_phases = [...row_phase];
    row_phases.splice(index, 1);
    setRow_phase(row_phases);
  };
  const deleteRowMat = (index) => {
    let row_phases = [...row_phaseMat];
    row_phases.splice(index, 1);
    setRow_phaseMat(row_phases);
  };

  const saveData = async () => {
    setItems(JSON.stringify(row_phase));
    setItemsMaterial(JSON.stringify(row_phaseMat));

    setTax_calcWork(
      Number((items_cost_subtotalWork * taxInputWork) / 100).toFixed(2)
    );
    setProfit_calcWork(
      Number((items_cost_subtotalWork * profitInputWork) / 100).toFixed(2)
    );
    setTotalWork(
      Number(
        items_cost_subtotalWork +
          (items_cost_subtotalWork * taxInputWork) / 100 +
          (items_cost_subtotalWork * profitInputWork) / 100
      ).toFixed(2)
    );

    setTax_calcMat(
      Number((items_cost_subtotalMat * taxInputMat) / 100).toFixed(2)
    );
    setProfit_calcMat(
      Number((items_cost_subtotalMat * profitInputMat) / 100).toFixed(2)
    );
    setTotalMat(
      Number(
        items_cost_subtotalMat +
          (items_cost_subtotalMat * taxInputMat) / 100 +
          (items_cost_subtotalMat * profitInputMat) / 100
      ).toFixed(2)
    );
  };

  const updateData = async () => {
    await saveData();
    const token = await localStorage.getItem("token");
    let params = {};
    let row_phasess = [];
    if (type === "Work") {
      row_phasess = row_phase;
      params = {
        items: JSON.stringify(row_phasess),
        est_time: est_time,
        sub_total: est_cost,
        tax: taxInputWork,
        profit: profitInputWork,
        tax_calc: Number(
          (items_cost_subtotalWork * taxInputWork) / 100
        ).toFixed(2),
        profit_calc: Number(
          (items_cost_subtotalWork * profitInputWork) / 100
        ).toFixed(2),
        items_cost: items_cost_subtotalWork,
        total: Number(
          items_cost_subtotalWork +
            (items_cost_subtotalWork * taxInputWork) / 100 +
            (items_cost_subtotalWork * profitInputWork) / 100
        ).toFixed(2),
      };
    } else if (type === "Material") {
      row_phasess = row_phaseMat;
      params = {
        items: JSON.stringify(row_phasess),
        est_time: est_time,
        sub_total: est_cost,
        tax: taxInputMat,
        profit: profitInputMat,
        tax_calc: Number((items_cost_subtotalMat * taxInputMat) / 100).toFixed(
          2
        ),
        profit_calc: Number(
          (items_cost_subtotalMat * profitInputMat) / 100
        ).toFixed(2),
        items_cost: items_cost_subtotalMat,
        total: Number(
          items_cost_subtotalMat +
            (items_cost_subtotalMat * taxInputMat) / 100 +
            (items_cost_subtotalMat * profitInputMat) / 100
        ).toFixed(2),
      };
    } else {
      const workArr = JSON.stringify(row_phase);
      const matArr = JSON.stringify(row_phaseMat);
      const arrData = { workArr: workArr, matAtt: matArr };
      row_phasess = arrData;
      params = {
        items: JSON.stringify(row_phasess),
        est_time: est_time,
        sub_total: est_cost,
        tax: JSON.stringify({ workTax: taxInputWork, matTax: taxInputMat }),
        profit: JSON.stringify({
          workProfit: profitInputWork,
          matProfit: profitInputMat,
        }),
        tax_calc: JSON.stringify({
          worktax_calc: Number(
            (items_cost_subtotalWork * taxInputWork) / 100
          ).toFixed(2),
          mattax_calc: Number(
            (items_cost_subtotalMat * taxInputMat) / 100
          ).toFixed(2),
        }),
        profit_calc: JSON.stringify({
          workprofit_calc: Number(
            (items_cost_subtotalWork * profitInputWork) / 100
          ).toFixed(2),
          matprofit_calc: Number(
            (items_cost_subtotalMat * profitInputMat) / 100
          ).toFixed(2),
        }),
        items_cost: JSON.stringify({
          workItems_cost: items_cost_subtotalWork,
          matItems_cost: items_cost_subtotalMat,
        }),
        total: JSON.stringify({
          workTotal: Number(
            items_cost_subtotalWork +
              (items_cost_subtotalWork * taxInputWork) / 100 +
              (items_cost_subtotalWork * profitInputWork) / 100
          ).toFixed(2),
          matTotal: Number(
            items_cost_subtotalMat +
              (items_cost_subtotalMat * taxInputMat) / 100 +
              (items_cost_subtotalMat * profitInputMat) / 100
          ).toFixed(2),
        }),
      };
    }

    modifyDataWithTokenAndParams(
      `${url}/api/pro-plan/update/${template_name}`,
      params,
      token
    )
      .then((res) => {
        // alert("Updated successfully!");
        setSuccesUpdate(true);
      })
      .catch((err) => {
        alert("Error occured");
      });
  };

  let row_phases = [...row_phase];
  let row_phasesMat = [...row_phaseMat];
  const ChangeItemName = ({ e, idx }) => {
    row_phases[idx].items = e.target.value;
  };
  const changeWorkArr = () => {
    setRow_phase(row_phases);
  };
  const changeMatArr = () => {
    setRow_phaseMat(row_phasesMat);
  };

  const ChangeItemNameMat = ({ e, idx }) => {
    row_phasesMat[idx].items = e.target.value;
  };

  const ChangeUnit = ({ e, idx }) => {
    row_phases[idx].unit = e.target.value;
    setRow_phase(row_phases);
  };
  const ChangeUnitMat = ({ e, idx }) => {
    row_phasesMat[idx].unit = e.target.value;
    setRow_phaseMat(row_phasesMat);
  };

  const ChangeQuantity = ({ e, idx }) => {
    row_phases[idx].dur = e.target.value;
    row_phases[idx].mat = e.target.value * row_phases[idx].cost;
  };
  const ChangeQuantityMat = ({ e, idx }) => {
    row_phasesMat[idx].dur = e.target.value;
    row_phasesMat[idx].mat = e.target.value * row_phasesMat[idx].cost;
  };

  const ChangePrice = ({ e, idx }) => {
    row_phases[idx].cost = e.target.value;
    row_phases[idx].mat = e.target.value * row_phases[idx].dur;
  };
  const ChangePriceMat = ({ e, idx }) => {
    row_phasesMat[idx].cost = e.target.value;
    row_phasesMat[idx].mat = e.target.value * row_phasesMat[idx].dur;
  };
  let myTaxValue = taxInput;
  let myProfitValue = profitInput;
  const ChangeTaxInput = (val) => {
    myTaxValue = val;
  };
  const ChangeProfitInput = (val) => {
    myProfitValue = val;
  };
  const BlurTaxInputWork = (e) => {
    setTaxInputWork(myTaxValue);
  };
  const BlurTaxInputMat = (e) => {
    setTaxInputMat(myTaxValue);
  };
  const BlurProfitInputWork = (e) => {
    setProfitInputWork(myProfitValue);
  };
  const BlurProfitInputMat = (e) => {
    setProfitInputMat(myProfitValue);
  };

  const loadTemplate = async (e) => {
    const val = e?.target?.value ? e.target.value : e;
    setTemplate_name(val);
    const token = await localStorage.getItem("token");
    await getData(`${url}/api/pro-plan/template/${val}`, token)
      .then((result) => {
        const {
          type,
          items,
          tax,
          profit,
          tax_calc,
          profit_calc,
          items_cost,
          template_name,
          total,
          id,
        } = result.data;
        if (type === "Work") {
          setType("Work");
          items && setRow_phase(JSON.parse(items));
          setTaxInputWork(tax);
          setProfitInputWork(profit);
          setLoaded(loaded + 1);
        } else if (type === "Material") {
          setType("Material");
          items && setRow_phaseMat(JSON.parse(items));
          setTaxInputMat(tax);
          setProfitInputMat(profit);
          setLoaded(loaded + 1);
        } else {
          const myItems = items && JSON.parse(items);
          const myTax = tax && JSON.parse(tax);
          const myProfit = profit && JSON.parse(profit);
          setType("Both");
          setRow_phase(JSON.parse(myItems.workArr));
          setRow_phaseMat(JSON.parse(myItems.matAtt));
          setTaxInputWork(myTax.workTax);
          setProfitInputWork(myProfit.workProfit);
          setTaxInputMat(myTax.matTax);
          setProfitInputMat(myProfit.matProfit);
          setLoaded(loaded + 1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const TampBody = (props) => {
    let subtotalWork = 0;
    let subtotalMat = 0;
    let estTime = 0;
    let estCost = 0;
    return (
      <>
        {props.row_phase.map((r, index) => {
          if (props.row_phase1 === "Work") {
            subtotalWork += Number(r.mat);
            setItems_cost_subtotalWork(subtotalWork);
          } else if (props.row_phase1 === "Mat") {
            subtotalMat += Number(r.mat);
            setItems_cost_subtotalMat(subtotalMat);
          }
          estTime += Number(r.dur);
          estTime += Number(r.cost);
          setItems_cost_subtotal(
            items_cost_subtotalWork + items_cost_subtotalMat
          );
          setEst_time(estTime);
          setEst_cost(estCost);
          return (
            <Row
              t={t}
              phase={r}
              key={index}
              idx={index}
              //   items={this.state.items}
              deleteRow={props.deleteRow}
              ChangeItemName={props.ChangeItemName}
              changeWorkArr={props.changeWorkArr}
              ChangeUnit={props.ChangeUnit}
              ChangeQuantity={props.ChangeQuantity}
              ChangePrice={props.ChangePrice}
              //   unit={this.state.selectOption}
            />
          );
        })}
      </>
    );
  };

  const WorkTapm = () => {
    return (
      <div
        id="work"
        className={type === "Work" ? "active tab-pane" : "tab-pane"}
      >
        <div className="row project_plan">
          <div className="col-sm-2">
            <div className="form-group text-right">
              <label className="d-xl-none">&nbsp;</label>
              <div className="dropdown mt-2">
                <select
                  onChange={loadTemplate}
                  className="btn btn-light dropdown-toggle"
                >
                  <option value="">{t("myBusiness.offer.template")}</option>
                  {allTamp.map((data, idx) => {
                    return (
                      <option value={data?.template_name}>
                        {data?.template_name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div id="project-planning-table">
          <table id="mytable" className="table table-bordered table-sm">
            <thead>
              <tr className="text-right">
                <th className="text-left work-item">
                  {t("project_planning.items")}
                </th>
                <th className="work-item-detail">
                  {t("myBusiness.offer.unit")}
                </th>
                <th className="work-item-detail">
                  {t("myBusiness.offer.duration")}
                </th>
                <th className="work-item-detail">
                  {t("myBusiness.offer.cost_hr")}
                </th>
                <th className="work-item-detail">
                  {t("myBusiness.offer.total_cost")}
                </th>
              </tr>
            </thead>
            <tbody>
              <TampBody
                row_phase={row_phase}
                row_phase1={"Work"}
                deleteRow={deleteRow}
                ChangeItemName={ChangeItemName}
                changeWorkArr={changeWorkArr}
                ChangeUnit={ChangeUnit}
                ChangeQuantity={ChangeQuantity}
                ChangePrice={ChangePrice}
              />
              <tr className="add-row-btn">
                <button
                  onClick={() => addRow()}
                  type="button"
                  className="add_item_btn"
                >
                  {t("myBusiness.template.addItem")}
                </button>
              </tr>

              <tr className="text-right sub-total-field ">
                <td className="td-remove-border" data-label="Items: "></td>

                <td data-label="Duration(hrs): ">
                  {t("myBusiness.offer.sub_total")}{" "}
                </td>
                <td
                  colSpan="3"
                  data-label="Total cost: "
                  id="3result"
                  className="sub-total"
                >
                  {Number(items_cost_subtotalWork).toFixed(2)}
                </td>
              </tr>

              <tr className="text-right tax-tr">
                <td colSpan="2" data-label="Items: ">
                  {t("myBusiness.offer.tax")}%
                </td>

                <td
                //   data-label="Duration(hrs): "
                //   className="tax"
                //   contentEditable="true"
                //   suppressContentEditableWarning={true}
                >
                  <input
                    defaultValue={taxInputWork ? taxInputWork : null}
                    type="number"
                    placeholder="0"
                    onChange={(e) => ChangeTaxInput(e.target.value)}
                    onBlur={() => BlurTaxInputWork()}
                  />
                </td>
                <td colSpan="2" data-label="Total cost: " className="tax_res">
                  {Number(
                    (items_cost_subtotalWork * taxInputWork) / 100
                  ).toFixed(2)}
                </td>
              </tr>
              <tr className="text-right profit-tr">
                <td colSpan="2" data-label="Items: ">
                  {t("myBusiness.offer.profit")}%
                </td>

                <td
                //   data-label="Duration(hrs): "
                //   className="profit"
                //   contentEditable="true"
                //   suppressContentEditableWarning={true}
                >
                  <input
                    defaultValue={profitInputWork ? profitInputWork : null}
                    type="number"
                    placeholder="0"
                    onChange={(e) => ChangeProfitInput(e.target.value)}
                    onBlur={() => BlurProfitInputWork()}
                  />
                </td>
                <td
                  colSpan="2"
                  data-label="Total cost: "
                  className="profit_res"
                >
                  {Number(
                    (items_cost_subtotalWork * profitInputWork) / 100
                  ).toFixed(2)}
                </td>
              </tr>
              <tr className="text-right total-tr">
                <td colSpan="2" data-label="Items: ">
                  {t("myBusiness.offer.total")}{" "}
                </td>

                <td colSpan="3" data-label="Duration(hrs): " className="total">
                  {Number(
                    items_cost_subtotalWork +
                      (items_cost_subtotalWork * taxInputWork) / 100 +
                      (items_cost_subtotalWork * profitInputWork) / 100
                  ).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {loaded > 0 ? (
          <button onClick={updateData} className="btn btn-primary">
            {t("myBusiness.offer.upd_curr")}
          </button>
        ) : (
          <div className="d-flex justify-content-between flex-wrap">
            <div>
              <button
                onClick={saveData}
                data-toggle="modal"
                data-target="#save"
                className="btn btn-primary btn-without-radius"
              >
                {t("myBusiness.offer.save_curr")}
              </button>

              <button className="btn btn-without-radius bg-grey">
              {t("myBusiness.template.copyQuotation")}
              </button>
            </div>

            <div>
              <button
                onClick={() => reset()}
                className="btn btn-without-radius bg-grey mr-0"
              >
                {t("myBusiness.template.reset")}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  const MaterialTapm = () => {
    return (
      <div
        id="material"
        className={type === "Material" ? "active tab-pane" : "tab-pane"}
      >
        <div className="row project_plan">
          <div className="col-sm-2">
            <div className="form-group text-right">
              <label className="d-xl-none">&nbsp;</label>
              <div className="dropdown mt-2">
                <select
                  onChange={loadTemplate}
                  className="btn btn-light dropdown-toggle"
                >
                  <option value="">{t("myBusiness.offer.template")}</option>
                  {allTamp.map((data, idx) => {
                    return (
                      <option value={data?.template_name}>
                        {data?.template_name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div id="project-planning-table">
          <table id="mytable" className="table table-bordered table-sm">
            <thead>
              <tr className="text-right">
                <th className="text-left work-item">
                  {/* {t("project_planning.items")} */}
                  {t("myBusiness.template.MaterialItem")}
                </th>
                <th className="work-item-detail">
                  {t("myBusiness.offer.unit")}
                </th>
                <th className="work-item-detail">
                  {t("myBusiness.offer.duration")}
                </th>
                <th className="work-item-detail">
                  {t("myBusiness.offer.cost_hr")}
                </th>
                <th className="work-item-detail">
                  {t("myBusiness.offer.total_cost")}
                </th>
              </tr>
            </thead>
            <tbody>
              <TampBody
                row_phase={row_phaseMat}
                row_phase1={"Mat"}
                deleteRow={deleteRowMat}
                ChangeItemName={ChangeItemNameMat}
                changeWorkArr={changeMatArr}
                ChangeUnit={ChangeUnitMat}
                ChangeQuantity={ChangeQuantityMat}
                ChangePrice={ChangePriceMat}
              />
              <tr className="add-row-btn">
                <button
                  onClick={() => addRowMaterial()}
                  type="button"
                  className="add_item_btn"
                >
                  {t("myBusiness.template.addItem")}
                </button>
              </tr>

              <tr className="text-right sub-total-field ">
                <td className="td-remove-border" data-label="Items: "></td>

                <td data-label="Duration(hrs): ">
                  {t("myBusiness.offer.sub_total")}{" "}
                </td>
                <td
                  colSpan="3"
                  data-label="Total cost: "
                  id="3result"
                  className="sub-total"
                >
                  {Number(items_cost_subtotalMat).toFixed(2)}
                </td>
              </tr>

              <tr className="text-right tax-tr">
                <td colSpan="2" data-label="Items: ">
                  {t("myBusiness.offer.tax")}%
                </td>

                <td
                //   data-label="Duration(hrs): "
                //   className="tax"
                //   contentEditable="true"
                //   suppressContentEditableWarning={true}
                >
                  <input
                    defaultValue={taxInputMat ? taxInputMat : null}
                    type="number"
                    placeholder="0"
                    onChange={(e) => ChangeTaxInput(e.target.value)}
                    onBlur={() => BlurTaxInputMat()}
                  />
                </td>
                <td colSpan="2" data-label="Total cost: " className="tax_res">
                  {Number((items_cost_subtotalMat * taxInputMat) / 100).toFixed(
                    2
                  )}
                </td>
              </tr>
              <tr className="text-right profit-tr">
                <td colSpan="2" data-label="Items: ">
                  {t("myBusiness.offer.profit")}%
                </td>

                <td
                //   data-label="Duration(hrs): "
                //   className="profit"
                //   contentEditable="true"
                //   suppressContentEditableWarning={true}
                >
                  <input
                    defaultValue={profitInputMat ? profitInputMat : null}
                    type="number"
                    placeholder="0"
                    onChange={(e) => ChangeProfitInput(e.target.value)}
                    onBlur={() => BlurProfitInputMat()}
                  />
                </td>
                <td
                  colSpan="2"
                  data-label="Total cost: "
                  className="profit_res"
                >
                  {Number(
                    (items_cost_subtotalMat * profitInputMat) / 100
                  ).toFixed(2)}
                </td>
              </tr>
              <tr className="text-right total-tr">
                <td colSpan="2" data-label="Items: ">
                  {t("myBusiness.offer.total")}{" "}
                </td>

                <td colSpan="3" data-label="Duration(hrs): " className="total">
                  {Number(
                    items_cost_subtotalMat +
                      (items_cost_subtotalMat * taxInputMat) / 100 +
                      (items_cost_subtotalMat * profitInputMat) / 100
                  ).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {loaded > 0 ? (
          <button onClick={updateData} className="btn btn-primary">
            {t("myBusiness.offer.upd_curr")}
          </button>
        ) : (
          <div className="d-flex justify-content-between flex-wrap">
            <div>
              <button
                onClick={saveData}
                data-toggle="modal"
                data-target="#save"
                className="btn btn-primary btn-without-radius"
              >
                {t("myBusiness.offer.save_curr")}
              </button>

              <button className="btn btn-without-radius bg-grey">
              {t("myBusiness.template.copyQuotation")}
              </button>
            </div>

            <div>
              <button
                onClick={() => reset()}
                className="btn btn-without-radius bg-grey mr-0"
              >
                {t("myBusiness.template.reset")}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  const WorkMaterialTapm = () => {
    return (
      <div
        id="work-material"
        className={type === "Both" ? "active tab-pane" : "tab-pane"}
      >
        <div className="row project_plan">
          <div className="col-sm-2">
            <div className="form-group text-right">
              <label className="d-xl-none">&nbsp;</label>
              <div className="dropdown mt-2">
                <select
                  onChange={loadTemplate}
                  className="btn btn-light dropdown-toggle"
                >
                  <option value="">{t("myBusiness.offer.template")}</option>
                  {allTamp.map((data, idx) => {
                    return (
                      <option value={data?.template_name}>
                        {data?.template_name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div id="project-planning-table">
          <table id="mytable" className="table table-bordered table-sm">
            <thead>
              <tr className="text-right">
                <th className="text-left work-item">
                  {t("project_planning.items")}
                </th>
                <th className="work-item-detail">
                  {t("myBusiness.offer.unit")}
                </th>
                <th className="work-item-detail">
                  {t("myBusiness.offer.duration")}
                </th>
                <th className="work-item-detail">
                  {t("myBusiness.offer.cost_hr")}
                </th>
                <th className="work-item-detail">
                  {t("myBusiness.offer.total_cost")}
                </th>
              </tr>
            </thead>
            <tbody>
              <TampBody
                row_phase={row_phase}
                row_phase1={"Work"}
                deleteRow={deleteRow}
                ChangeItemName={ChangeItemName}
                changeWorkArr={changeWorkArr}
                ChangeUnit={ChangeUnit}
                ChangeQuantity={ChangeQuantity}
                ChangePrice={ChangePrice}
              />
              <tr className="add-row-btn">
                <button
                  onClick={() => addRow()}
                  type="button"
                  className="add_item_btn"
                >
                  {t("myBusiness.template.addItem")}
                </button>
              </tr>
              <tr className="text-right sub-total-field">
                <td className="td-remove-border" data-label="Items: "></td>

                <td data-label="Duration(hrs): ">
                  {t("myBusiness.offer.sub_total")}{" "}
                </td>
                <td
                  colSpan="3"
                  data-label="Total cost: "
                  id="3result"
                  className="sub-total"
                >
                  {Number(items_cost_subtotalWork).toFixed(2)}
                </td>
              </tr>

              <tr className="text-right tax-tr">
                <td colSpan="2" data-label="Items: ">
                  {t("myBusiness.offer.tax")}%
                </td>

                <td
                //   data-label="Duration(hrs): "
                //   className="tax"
                //   contentEditable="true"
                //   suppressContentEditableWarning={true}
                >
                  <input
                    defaultValue={taxInputWork ? taxInputWork : null}
                    type="number"
                    placeholder="0"
                    onChange={(e) => ChangeTaxInput(e.target.value)}
                    onBlur={() => BlurTaxInputWork()}
                  />
                </td>
                <td colSpan="2" data-label="Total cost: " className="tax_res">
                  {Number(
                    (items_cost_subtotalWork * taxInputWork) / 100
                  ).toFixed(2)}
                </td>
              </tr>
              <tr className="text-right profit-tr">
                <td colSpan="2" data-label="Items: ">
                  {t("myBusiness.offer.profit")}%
                </td>

                <td
                //   data-label="Duration(hrs): "
                //   className="profit"
                //   contentEditable="true"
                //   suppressContentEditableWarning={true}
                >
                  <input
                    defaultValue={profitInputWork ? profitInputWork : null}
                    type="number"
                    placeholder="0"
                    onChange={(e) => ChangeProfitInput(e.target.value)}
                    onBlur={() => BlurProfitInputWork()}
                  />
                </td>
                <td
                  colSpan="2"
                  data-label="Total cost: "
                  className="profit_res"
                >
                  {Number(
                    (items_cost_subtotalWork * profitInputWork) / 100
                  ).toFixed(2)}
                </td>
              </tr>
              <tr className="text-right total-tr">
                <td colSpan="2" data-label="Items: ">
                  {t("myBusiness.offer.total")}{" "}
                </td>

                <td colSpan="3" data-label="Duration(hrs): " className="total">
                  {Number(
                    items_cost_subtotalWork +
                      (items_cost_subtotalWork * taxInputWork) / 100 +
                      (items_cost_subtotalWork * profitInputWork) / 100
                  ).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
          <table id="mytable" className="table table-bordered table-sm">
            <thead>
              <tr className="text-right">
                <th className="text-left work-item">
                  {/* {t("project_planning.items")} */}
                  {t("myBusiness.template.MaterialItem")}
                </th>
                <th className="work-item-detail">
                  {t("myBusiness.offer.unit")}
                </th>
                <th className="work-item-detail">
                  {t("myBusiness.offer.duration")}
                </th>
                <th className="work-item-detail">
                  {t("myBusiness.offer.cost_hr")}
                </th>
                <th className="work-item-detail">
                  {t("myBusiness.offer.total_cost")}
                </th>
              </tr>
            </thead>
            <tbody>
              <TampBody
                row_phase={row_phaseMat}
                row_phase1={"Mat"}
                deleteRow={deleteRowMat}
                ChangeItemName={ChangeItemNameMat}
                changeWorkArr={changeMatArr}
                ChangeUnit={ChangeUnitMat}
                ChangeQuantity={ChangeQuantityMat}
                ChangePrice={ChangePriceMat}
              />
              <tr className="add-row-btn">
                <button
                  onClick={() => addRowMaterial()}
                  type="button"
                  className="add_item_btn"
                >
                  {t("myBusiness.template.addItem")}
                </button>
              </tr>
              <tr className="text-right sub-total-field">
                <td className="td-remove-border" data-label="Items: "></td>

                <td data-label="Duration(hrs): ">
                  {t("myBusiness.offer.sub_total")}{" "}
                </td>
                <td
                  colSpan="3"
                  data-label="Total cost: "
                  id="3result"
                  className="sub-total"
                >
                  {Number(items_cost_subtotalMat).toFixed(2)}
                </td>
              </tr>

              <tr className="text-right tax-tr">
                <td colSpan="2" data-label="Items: ">
                  {t("myBusiness.offer.tax")}%
                </td>

                <td
                //   data-label="Duration(hrs): "
                //   className="tax"
                //   contentEditable="true"
                //   suppressContentEditableWarning={true}
                >
                  <input
                    defaultValue={taxInputMat ? taxInputMat : null}
                    type="number"
                    placeholder="0"
                    onChange={(e) => ChangeTaxInput(e.target.value)}
                    onBlur={() => BlurTaxInputMat()}
                  />
                </td>
                <td colSpan="2" data-label="Total cost: " className="tax_res">
                  {Number((items_cost_subtotalMat * taxInputMat) / 100).toFixed(
                    2
                  )}
                </td>
              </tr>
              <tr className="text-right profit-tr">
                <td colSpan="2" data-label="Items: ">
                  {t("myBusiness.offer.profit")}%
                </td>

                <td
                //   data-label="Duration(hrs): "
                //   className="profit"
                //   contentEditable="true"
                //   suppressContentEditableWarning={true}
                >
                  <input
                    defaultValue={profitInputMat ? profitInputMat : null}
                    type="number"
                    placeholder="0"
                    onChange={(e) => ChangeProfitInput(e.target.value)}
                    onBlur={() => BlurProfitInputMat()}
                  />
                </td>
                <td
                  colSpan="2"
                  data-label="Total cost: "
                  className="profit_res"
                >
                  {Number(
                    (items_cost_subtotalMat * profitInputMat) / 100
                  ).toFixed(2)}
                </td>
              </tr>
              <tr className="text-right total-tr">
                <td colSpan="2" data-label="Items: ">
                  {t("myBusiness.offer.total")}{" "}
                </td>

                <td colSpan="3" data-label="Duration(hrs): " className="total">
                  {Number(
                    items_cost_subtotalMat +
                      (items_cost_subtotalMat * taxInputMat) / 100 +
                      (items_cost_subtotalMat * profitInputMat) / 100
                  ).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {loaded > 0 ? (
          <button onClick={updateData} className="btn btn-primary">
            {t("myBusiness.offer.upd_curr")}
          </button>
        ) : (
          <div className="d-flex justify-content-between flex-wrap">
            <div>
              <button
                onClick={saveData}
                data-toggle="modal"
                data-target="#save"
                className="btn btn-primary btn-without-radius"
              >
                {t("myBusiness.offer.save_curr")}
              </button>

              <button className="btn btn-without-radius bg-grey">
              {t("myBusiness.template.copyQuotation")}
              </button>
            </div>

            <div>
              <button
                onClick={() => reset()}
                className="btn btn-without-radius bg-grey mr-0"
              >
                {t("myBusiness.template.reset")}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  const commonProps = {
    items: items,
    itemsMaterial: itemsMaterial,
    est_time: est_time,
    sub_total: est_cost,
    tax: taxInput,
    profit: profitInput,
    taxWork: taxInputWork,
    profitWork: profitInputWork,
    taxMat: taxInputMat,
    profitMat: profitInputMat,
    tax_calcWork: tax_calcWork,
    profit_calcWork: profit_calcWork,
    totalWork: totalWork,
    tax_calcMat: tax_calcMat,
    profit_calcMat: profit_calcMat,
    totalMat: totalMat,
    items_costWork: items_cost_subtotalWork,
    items_costMat: items_cost_subtotalMat,
    type: type,
  };
  return (
    <React.Fragment>
      {/* <Prompt
        when={this.state.redirect_page}
        message={t("myBusiness.offer.leave_page")}
      /> */}
      <div>
        {/* <Header active={"bussiness"} /> */}
        <Breadcrumb>
          <li className="breadcrumb-item active project-planning">
            <Link to="/business-dashboard" aria-current="page">
              {t("myBusiness.offer.heading")}
            </Link>
          </li>
          <li className="breadcrumb-item active project-planning">
            <Link to="/proposal-listing" aria-current="page">
              {t("myBusiness.offer.proposal")}
            </Link>
          </li>
          <li
            className="breadcrumb-item active project-planning"
            aria-current="page"
          >
            {t("myBusiness.offer.create")}
          </li>
        </Breadcrumb>
        <div className="main-content">
          <Sidebar dataFromParent={window.location.pathname} />
          <div className="page-content project-planning-mobile">
            <div className="container-fluid">
              <h3 className="head3">{t("myBusiness.offer.heading1")}</h3>
              <div className="card" style={{ maxWidth: "1150px" }}>
                <div className="card-body">
                  <div className="project-planning-tabs">
                    {width >= 769 && (
                      <TemplateTabs type={type} setType={setType} reset={reset}>
                        <>
                          <WorkTapm />
                          <MaterialTapm />
                          <WorkMaterialTapm />
                        </>
                      </TemplateTabs>
                    )}
                    {width < 769 && <ProjectPlanMobile />}
                  </div>
                </div>
              </div>
              <ProjectPlanModal data={commonProps} />
            </div>
          </div>
        </div>
        {succesUpdate ? (
          <SweetAlert
            success
            // closeOnClickOutside={true}
            title={t("login.SuccessPopup")}
            // title={t("list_details.success1")}
            onConfirm={() => window.location.reload()}
          >
            {/* {t("list_details.success")} */}
          </SweetAlert>
        ) : (
          ""
        )}
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(ProjectPlanningNew);

// export const TableMobile = (props) => {
//   let subtotal = 0;
//   let totalCost = 0;
//   let totalDur = 0;
//   return (
//     <div className="template_mobile">
//       <div className="template_mobile_container">
//         <div className="template_mobile_to">
//           <div className="dropdown mt-3 d-flex">
//             <div className="form-group text-right">
//               <label className="d-xl-none">&nbsp;</label>
//               <div className="dropdown mt-2">
//                 <select
//                   // onChange={loadTemplate}
//                   className="btn btn-light dropdown-toggle"
//                 >
//                   <option value="">
//                     {props.t("myBusiness.offer.template")}
//                   </option>
//                   {/* {allTamp.map((data, idx) => {
//                     return (
//                       <option value={data?.template_name}>
//                         {data?.template_name}
//                       </option>
//                     );
//                   })} */}
//                 </select>
//               </div>
//             </div>
//           </div>
//           {props.type === "Work" ? <h1>Work Row</h1> : <h1>Material Row</h1>}
//         </div>
//         <div className="template_table">
//           <div className="template_table_title">
//             <h5>Item Name</h5>
//             <h5>Item Price &#8364;</h5>
//             <h5>total Price &#8364;</h5>
//             {/* <h5>Item Title</h5> */}
//           </div>
//         </div>
//       </div>
//       {props.row_phase.map((r, index) => {
//         // props.this.setSubTotalMobil(r.mat)
//         // props.this.setState({items_cost: subtotal})
//         subtotal += Number(r.mat);
//         totalCost += Number(r.cost);
//         totalDur += Number(r.dur);
//         return (
//           <div className="template_table_item customerIDCell">
//             <div
//               data-value={r.items}
//               className="prop_items"
//               // contentEditable="true"
//               suppressContentEditableWarning={true}
//               data-label="Items: "
//             >
//               {r.items}
//               <div>
//                 <span
//                   className="duration"
//                   // contentEditable="true"
//                   suppressContentEditableWarning={true}
//                   data-label="Duration(hrs): "
//                 >
//                   {r.dur}
//                 </span>{" "}
//                 hrs
//               </div>
//             </div>
//             <div>
//               <span
//                 className="cost_hr"
//                 suppressContentEditableWarning={true}
//                 // contentEditable="true"
//                 data-label="Cost/hr: "
//               >
//                 {r.cost}
//               </span>
//             </div>
//             <div>
//               <span className="mat_cost" data-label="Total cost: ">
//                 {r.mat}
//               </span>
//             </div>
//             <div>
//               <img
//                 // onClick={(e) => props.this.handleEditMobileValue(r, index)}
//                 src={EditIcon}
//                 alt="EditIcon"
//               />
//             </div>
//             <div>
//               <img
//                 // onClick={(e) => props.this.deleteRow(index)}
//                 src={DeleteIcon}
//                 width={20}
//                 alt="EditIcon"
//               />
//             </div>
//           </div>
//         );
//       })}
//       <div className="template_mobile_container">
//         <div className="sub_total_area">
//           <div>
//             <button
//               // onClick={props.this.handleProjectPlaningModal}
//               className="add_item_btn"
//             >
//               Add Items
//             </button>
//           </div>
//           <div className="sub_total_box">
//             <div className="sub_total_items border-bottom">
//               <div>Sub total</div>
//               <div id="3resul">
//                 {/* {subtotal ? subtotal : props.this.state.items_cost} */}
//               </div>
//             </div>
//             <div className="sub_total_items">
//               <div>
//                 <span>Total Tax</span>
//                 <div className="tax_re">
//                   {/* {((subtotal * props.this.state.tax) / 100).toFixed(2)} */}
//                 </div>
//               </div>
//               <div>Add tax in %</div>
//               <div className="sub_total_input_box">
//                 <input
//                   className="tax"
//                   type="number"
//                   // value={props.this.state.tax}
//                   // onChange={(e) =>
//                   //   props.this.setState({ tax: e.target.value })
//                   // }
//                 />
//               </div>
//             </div>
//             <div className="sub_total_items border-bottom">
//               <div>
//                 <span>Total Profit</span>
//                 <div className="profit_re">
//                   {/* {((subtotal * props.this.state.profit) / 100).toFixed(2)} */}
//                 </div>
//               </div>
//               <div>Add Profit in %</div>
//               <div className="sub_total_input_box">
//                 <input
//                   type="number"
//                   className="profit"
//                   // value={props.this.state.profit}
//                   // onChange={(e) =>
//                   //   props.this.setState({ profit: e.target.value })
//                   // }
//                 />
//               </div>
//             </div>
//             <div className="sub_total_items border-bottom">
//               <div>Grand Total</div>
//               <div>
//                 <strong className="tota">
//                   {/* {subtotal
//                       ? (
//                           subtotal +
//                           (subtotal * props.this.state.tax) / 100 +
//                           (subtotal * props.this.state.profit) / 100
//                         ).toFixed(2)
//                       : props.this.state.total} */}
//                 </strong>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="save_template_btn">
//           {/* <div className="save_template_left">
//             {props.this.state.loaded > 0 ? (
//               <button
//                 onClick={() =>
//                   props.this.updateDataMobile({
//                     subtotal: subtotal,
//                     totalCost: totalCost,
//                     totalDur: totalDur,
//                   })
//                 }
//                 className="btn btn-primary clk-mobile-tamp"
//               >
//                 {props.t("myBusiness.offer.upd_curr")}
//               </button>
//             ) : (
//               <button
//                 onClick={() =>
//                   props.this.saveDataMobile({
//                     subtotal: subtotal,
//                     totalCost: totalCost,
//                     totalDur: totalDur,
//                   })
//                 }
//                 data-toggle="modal"
//                 data-target="#save"
//                 className="btn btn-primary clk-mobile-tamp"
//               >
//                 {props.t("myBusiness.offer.save_curr")}
//               </button>
//             )}
//           </div> */}
//           <div className="save_template_right">
//             {/* <button className="copy_btn">copy</button> */}
//             <button
//               className="reset_btn"
//               onClick={() => window.location.reload()}
//             >
//               reset
//             </button>
//           </div>
//         </div>
//       </div>
//       {props.isAddItem && (
//         <ProjectPlanningModal
//           handleClose={props.handleProjectPlaningModal}
//           handleSelectMobile={props.handleSelectMobile}
//           mobileItemName={props.state.mobileItemName}
//         />
//       )}
//     </div>
//   );
// };

export const Row = (props) => {
  let name = props.phase.items
  return (
    <tr className="i-val customerIDCell">
      <td className="custom_items">
        <span
          //   id="myRemove"
          className="text-left"
          contentEditable="false"
          suppressContentEditableWarning={true}
          onClick={(e) => props.deleteRow(props.idx)}
        >
          × &nbsp;
        </span>
        <span
        //   data-value={props.phase.items}
        //   className="text-right prop_items"
        //   contentEditable="true"
        //   suppressContentEditableWarning={true}
        //   data-label="Items: "
        //   onKeyPress={(e)=>console.log(e)}
        >
          <input
            onChange={(e) => props.ChangeItemName({ e: e, idx: props.idx })}
            onBlur={() => props.changeWorkArr()}
            defaultValue={props.phase.items ? props.phase.items : null}
            placeholder={props.t("myBusiness.template.itemName")}
          />
        </span>
      </td>
      <td>
        <select
          onChange={(e) => props.ChangeUnit({ e: e, idx: props.idx })}
          className="form-control"
          value={props.phase.unit}
        >
          <option value="">{props.t("myBusiness.template.select")}</option>
          <option value="Hrs">{props.t("myBusiness.template.HRS")}</option>
          <option value="Lts">{props.t("myBusiness.template.LTS")}</option>
          <option value="Pcs">{props.t("myBusiness.template.PCS")}</option>
          <option value="Kg">{props.t("myBusiness.template.KG")}</option>
        </select>
      </td>
      <td
      // className="duration text-right"
      // contentEditable="true"
      // suppressContentEditableWarning={true}
      // data-label="Duration(hrs): "
      >
        <input
          type={"number"}
          onChange={(e) => props.ChangeQuantity({ e: e, idx: props.idx })}
          onBlur={() => props.changeWorkArr()}
          defaultValue={props.phase.dur ? props.phase.dur : null}
          placeholder="0"
        />
      </td>
      <td
      // className="cost_hr text-right"
      // suppressContentEditableWarning={true}
      // contentEditable="true"
      // data-label="Cost/hr: "
      >
        <input
          type={"number"}
          onChange={(e) => props.ChangePrice({ e: e, idx: props.idx })}
          onBlur={() => props.changeWorkArr()}
          defaultValue={props.phase.cost ? props.phase.cost : null}
          placeholder="0"
        />
      </td>
      <td className="text-left" data-label="Total cost: ">
        {props.phase.mat}
      </td>
    </tr>
  );
};
