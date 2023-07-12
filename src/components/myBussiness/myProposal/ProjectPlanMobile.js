import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { getData, modifyDataWithTokenAndParams } from "../../../helper/api";
import { url } from "../../../helper/helper";
import EditIcon from "../../../EditIcon.svg";
import DeleteIcon from "../../../delete-button.svg";
import ProjectPlanningModal from "./ProjectPlanningModal";
import ProjectPlanModal from "../modals/ProjectPlanModal";
import TemplateTabs from "./TemplateTabs";
import SweetAlert from "react-bootstrap-sweetalert";
import { Modal, ModalBody } from "reactstrap";

const ProjectPlanMobile = ({ t }) => {
  const [succesUpdate, setSuccesUpdate] = useState(false);
  const [type, setType] = useState("Work");
  const [forWhat, setForWhat] = useState("");
  const [isAddItem, setIsAddItem] = useState(false);
  const [mobileItemName, setMobileItemName] = useState("");
  const [row_phase, setRow_phase] = useState([]);
  const [row_phaseMat, setRow_phaseMat] = useState([]);
  const [allTamp, setAllTamp] = useState([]);
  const [taxInput, setTaxInput] = useState(0);
  const [taxInputWork, setTaxInputWork] = useState(0);
  const [taxInputMat, setTaxInputMat] = useState(0);
  const [profitInput, setProfitInput] = useState(0);
  const [profitInputWork, setProfitInputWork] = useState(0);
  const [profitInputMat, setProfitInputMat] = useState(0);
  const [items_cost_subtotalWork, setItems_cost_subtotalWork] = useState(0);
  const [items_cost_subtotalMat, setItems_cost_subtotalMat] = useState(0);
  const [template_name, setTemplate_name] = useState("");
  const [loaded, setLoaded] = useState(0);

  const [items, setItems] = useState("");
  const [itemsMaterial, setItemsMaterial] = useState("");
  const [est_time, setEst_time] = useState(0);
  const [est_cost, setEst_cost] = useState(0);
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

  const handleSelectMobile = (event) => {
    if (
      event.itemName !== "" &&
      event.itemPrice &&
      event.quantity &&
      event.forWhat === "Work"
    ) {
      console.log(event);
      let row_phases = [...row_phase];
      // row.push(this.state.phase);
      let key = ["items", "unit", "dur", "cost", "mat"];
      let ggs = `${event.itemName},${event.unit},${event.quantity},${
        event.itemPrice
      },${event.quantity * event.itemPrice}`.split(",");
      let result = {};
      key.forEach((key, i) => (result[key] = ggs[i]));
      if (event.idx || event.idx === 0) {
        row_phases[row_phases.findIndex((el, index) => index === event.idx)] =
          result;
      } else {
        row_phases.push(result);
      }
      setRow_phase(row_phases);
      setIsAddItem(false);
      setMobileItemName("");
      return false;
    } else if (
      event.itemName !== "" &&
      event.itemPrice &&
      event.quantity &&
      event.forWhat === "Material"
    ) {
      console.log(event);
      let row_phases = [...row_phaseMat];
      // row.push(this.state.phase);
      let key = ["items", "unit", "dur", "cost", "mat"];
      let ggs = `${event.itemName},${event.unit},${event.quantity},${
        event.itemPrice
      },${event.quantity * event.itemPrice}`.split(",");
      let result = {};
      key.forEach((key, i) => (result[key] = ggs[i]));
      if (event.idx || event.idx === 0) {
        row_phases[row_phases.findIndex((el, index) => index === event.idx)] =
          result;
      } else {
        row_phases.push(result);
      }
      setRow_phaseMat(row_phases);
      setIsAddItem(false);
      setMobileItemName("");
      return false;
    }
  };

  const handleEditMobileValue = (event, index) => {
    event.idx = index;
    if (event.items) {
      setIsAddItem(true);
      setMobileItemName(event);
    }
  };

  const handleProjectPlaningModal = () => {
    setIsAddItem(!isAddItem);
    setForWhat("");
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

  const reset = () => {
    setRow_phase([]);
    setRow_phaseMat([]);
    setTaxInput(0);
    setProfitInput(0);
    setTaxInputWork(0);
    setProfitInputWork(0);
    setTaxInputMat(0);
    setProfitInputMat(0);
    // setItems_cost_subtotal(0);
    setItems_cost_subtotalMat(0);
    setItems_cost_subtotalWork(0);
    setLoaded(0);
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
  console.log(forWhat, "?????");
  const WorkTapm = () => {
    let subtotal = 0;
    return (
      <div
        id="work"
        className={type === "Work" ? "active tab-pane" : "tab-pane"}
      >
        <div className="template_mobile">
          <div className="template_mobile_container">
            <div className="template_mobile_to">
              <div className="dropdown mt-3 d-flex">
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
                          <option key={idx} value={data?.template_name}>
                            {data?.template_name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h2>{t("myBusiness.template.workRow")}</h2>
          <div className="template_table">
            <div className="template_table_title">
              <h5>{t("myBusiness.template.itemName")}</h5>
              <h5>{t("myBusiness.template.itemPrice")} &#8364;</h5>
              <h5>{t("myBusiness.template.totalPrice")} &#8364;</h5>
              {/* <h5>Item Title</h5> */}
            </div>
          </div>
          {row_phase.map((r, index) => {
            // props.this.setSubTotalMobil(r.mat)
            // props.this.setState({items_cost: subtotal})
            subtotal += Number(r.mat);
            setItems_cost_subtotalWork(subtotal);
            // totalCost += Number(r.cost);
            // totalDur += Number(r.dur);
            return (
              <div key={index} className="template_table_item customerIDCell">
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
                    {r.unit}
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
                    onClick={(e) => {
                      handleEditMobileValue(r, index);
                      setForWhat("Work");
                    }}
                    src={EditIcon}
                    alt="EditIcon"
                  />
                </div>
                <div>
                  <img
                    onClick={(e) => deleteRow(index)}
                    src={DeleteIcon}
                    width={20}
                    alt="EditIcon"
                  />
                </div>
              </div>
            );
          })}
          <div className="template_mobile_container">
            <div className="sub_total_area">
              <div>
                <button
                  onClick={() => {
                    handleProjectPlaningModal();
                    setForWhat("Work");
                  }}
                  className="add_item_btn"
                >
                  {t("myBusiness.template.addItem")}
                </button>
              </div>
              {subtotal ? (
                <div className="sub_total_box">
                  <div className="sub_total_items border-bottom">
                    <div>{t("myBusiness.template.subTotal")}</div>
                    <div id="3resul">{subtotal}</div>
                  </div>
                  <div className="sub_total_items">
                    <div>
                      <span>{t("myBusiness.template.totalTax")}</span>
                      <div className="tax_re">
                        {((subtotal * taxInputWork) / 100).toFixed(2)}
                      </div>
                    </div>
                    <div>{t("myBusiness.template.addTaxIn")}</div>
                    <div className="sub_total_input_box">
                      <input
                        className="tax"
                        type="number"
                        defaultValue={taxInputWork ? taxInputWork : null}
                        onChange={(e) => ChangeTaxInput(e.target.value)}
                        onBlur={(e) => BlurTaxInputWork(e)}
                      />
                    </div>
                  </div>
                  <div className="sub_total_items border-bottom">
                    <div>
                      <span>{t("myBusiness.template.totalProfit")}</span>
                      <div className="profit_re">
                        {((subtotal * profitInputWork) / 100).toFixed(2)}
                      </div>
                    </div>
                    <div>{t("myBusiness.template.addProfitIn")}</div>
                    <div className="sub_total_input_box">
                      <input
                        type="number"
                        className="profit"
                        defaultValue={profitInputWork ? profitInputWork : null}
                        onChange={(e) => ChangeProfitInput(e.target.value)}
                        onBlur={(e) => BlurProfitInputWork()}
                      />
                    </div>
                  </div>
                  <div className="sub_total_items mb-4">
                    <div>{t("myBusiness.template.grandTotal")}</div>
                    <div>
                      <strong className="tota">
                        {(
                          subtotal +
                          (subtotal * taxInputWork) / 100 +
                          (subtotal * profitInputWork) / 100
                        ).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="save_template_btn">
              <div className="save_template_left">
                {loaded > 0 ? (
                  <button
                    onClick={updateData}
                    className="btn btn-primary clk-mobile-tamp"
                  >
                    {t("myBusiness.offer.upd_curr")}
                  </button>
                ) : (
                  <button
                    onClick={saveData}
                    data-toggle="modal"
                    data-target="#save"
                    className="btn btn-primary clk-mobile-tamp"
                  >
                    {t("myBusiness.offer.save_curr")}
                  </button>
                )}
              </div>
              <div className="save_template_right">
                {/* <button className="copy_btn">copy</button> */}
                <button className="reset_btn" onClick={() => reset()}>
                {t("myBusiness.template.reset")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const MaterialTapm = () => {
    let subtotal = 0;
    return (
      <div
        id="material"
        className={type === "Material" ? "active tab-pane" : "tab-pane"}
      >
        <div className="template_mobile">
          <div className="template_mobile_container">
            <div className="template_mobile_to">
              <div className="dropdown mt-3 d-flex">
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
                          <option key={idx} value={data?.template_name}>
                            {data?.template_name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h2>{t("myBusiness.template.materialRow")}</h2>
          <div className="template_table">
            <div className="template_table_title">
              <h5>{t("myBusiness.template.itemName")}</h5>
              <h5>{t("myBusiness.template.itemPrice")} &#8364;</h5>
              <h5>{t("myBusiness.template.totalPrice")} &#8364;</h5>
              {/* <h5>Item Title</h5> */}
            </div>
          </div>
          {row_phaseMat.map((r, index) => {
            // props.this.setSubTotalMobil(r.mat)
            // props.this.setState({items_cost: subtotal})
            subtotal += Number(r.mat);
            setItems_cost_subtotalMat(subtotal);
            // totalCost += Number(r.cost);
            // totalDur += Number(r.dur);
            return (
              <div key={index} className="template_table_item customerIDCell">
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
                    {r.unit}
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
                    onClick={(e) => {
                      handleEditMobileValue(r, index);
                      setForWhat("Material");
                    }}
                    src={EditIcon}
                    alt="EditIcon"
                  />
                </div>
                <div>
                  <img
                    onClick={(e) => deleteRowMat(index)}
                    src={DeleteIcon}
                    width={20}
                    alt="EditIcon"
                  />
                </div>
              </div>
            );
          })}
          <div className="template_mobile_container">
            <div className="sub_total_area">
              <div>
                <button
                  onClick={() => {
                    handleProjectPlaningModal();
                    setForWhat("Material");
                  }}
                  className="add_item_btn"
                >
                  {t("myBusiness.template.addItem")}
                </button>
              </div>
              {subtotal ? (
                <div className="sub_total_box">
                  <div className="sub_total_items border-bottom">
                    <div>{t("myBusiness.template.subTotal")}</div>
                    <div id="3resul">{subtotal}</div>
                  </div>
                  <div className="sub_total_items">
                    <div>
                      <span>{t("myBusiness.template.totalTax")}</span>
                      <div className="tax_re">
                        {((subtotal * taxInputMat) / 100).toFixed(2)}
                      </div>
                    </div>
                    <div>{t("myBusiness.template.addTaxIn")}</div>
                    <div className="sub_total_input_box">
                      <input
                        className="tax"
                        type="number"
                        defaultValue={taxInputMat ? taxInputMat : null}
                        onChange={(e) => ChangeTaxInput(e.target.value)}
                        onBlur={(e) => BlurTaxInputMat()}
                      />
                    </div>
                  </div>
                  <div className="sub_total_items border-bottom">
                    <div>
                      <span>{t("myBusiness.template.totalProfit")}</span>
                      <div className="profit_re">
                        {((subtotal * profitInputMat) / 100).toFixed(2)}
                      </div>
                    </div>
                    <div>{t("myBusiness.template.addProfitIn")}</div>
                    <div className="sub_total_input_box">
                      <input
                        type="number"
                        className="profit"
                        defaultValue={profitInputMat ? profitInputMat : null}
                        onChange={(e) => ChangeProfitInput(e.target.value)}
                        onBlur={(e) => BlurProfitInputMat()}
                      />
                    </div>
                  </div>
                  <div className="sub_total_items mb-4">
                    <div>{t("myBusiness.template.grandTotal")}</div>
                    <div>
                      <strong className="tota">
                        {(
                          subtotal +
                          (subtotal * taxInputMat) / 100 +
                          (subtotal * profitInputMat) / 100
                        ).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="save_template_btn">
              <div className="save_template_left">
                {loaded > 0 ? (
                  <button
                    onClick={updateData}
                    className="btn btn-primary clk-mobile-tamp"
                  >
                    {t("myBusiness.offer.upd_curr")}
                  </button>
                ) : (
                  <button
                    onClick={saveData}
                    data-toggle="modal"
                    data-target="#save"
                    className="btn btn-primary clk-mobile-tamp"
                  >
                    {t("myBusiness.offer.save_curr")}
                  </button>
                )}
              </div>
              <div className="save_template_right">
                {/* <button className="copy_btn">copy</button> */}
                <button className="reset_btn" onClick={() => reset()}>
                {t("myBusiness.template.reset")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const WorkMaterialTapm = () => {
    let subtotalWork = 0;
    let subtotalMat = 0;
    return (
      <div
        id="work-material"
        className={type === "Both" ? "active tab-pane" : "tab-pane"}
      >
        <div className="template_mobile">
          <div className="template_mobile_container">
            <div className="template_mobile_to">
              <div className="dropdown mt-3 d-flex">
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
                          <option key={idx} value={data?.template_name}>
                            {data?.template_name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h2>{t("myBusiness.template.workRow")}</h2>
          <div className="template_table">
            <div className="template_table_title">
              <h5>{t("myBusiness.template.itemName")}</h5>
              <h5>{t("myBusiness.template.itemPrice")} &#8364;</h5>
              <h5>{t("myBusiness.template.totalPrice")} &#8364;</h5>
              {/* <h5>Item Title</h5> */}
            </div>
          </div>
          {row_phase.map((r, index) => {
            // props.this.setSubTotalMobil(r.mat)
            // props.this.setState({items_cost: subtotal})
            subtotalWork += Number(r.mat);
            setItems_cost_subtotalWork(subtotalWork);
            // totalCost += Number(r.cost);
            // totalDur += Number(r.dur);
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
                    {r.unit}
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
                    onClick={(e) => {
                      handleEditMobileValue(r, index);
                      setForWhat("Work");
                    }}
                    src={EditIcon}
                    alt="EditIcon"
                  />
                </div>
                <div>
                  <img
                    onClick={(e) => deleteRow(index)}
                    src={DeleteIcon}
                    width={20}
                    alt="EditIcon"
                  />
                </div>
              </div>
            );
          })}
          <div className="template_mobile_container">
            <div className="sub_total_area">
              <div>
                <button
                  onClick={() => {
                    handleProjectPlaningModal();
                    setForWhat("Work");
                  }}
                  className="add_item_btn"
                >
                  {t("myBusiness.template.addItem")}
                </button>
              </div>
              {subtotalWork ? (
                <div className="sub_total_box">
                  <div className="sub_total_items border-bottom">
                    <div>{t("myBusiness.template.subTotal")}</div>
                    <div id="3resul">{subtotalWork}</div>
                  </div>
                  <div className="sub_total_items">
                    <div>
                      <span>{t("myBusiness.template.totalTax")}</span>
                      <div className="tax_re">
                        {((subtotalWork * taxInputWork) / 100).toFixed(2)}
                      </div>
                    </div>
                    <div>{t("myBusiness.template.addTaxIn")}</div>
                    <div className="sub_total_input_box">
                      <input
                        className="tax"
                        type="number"
                        defaultValue={taxInputWork? taxInputWork : null}
                        onChange={(e) => ChangeTaxInput(e.target.value)}
                        onBlur={(e) => BlurTaxInputWork()}
                      />
                    </div>
                  </div>
                  <div className="sub_total_items border-bottom">
                    <div>
                      <span>{t("myBusiness.template.totalProfit")}</span>
                      <div className="profit_re">
                        {((subtotalWork * profitInputWork) / 100).toFixed(2)}
                      </div>
                    </div>
                    <div>{t("myBusiness.template.addProfitIn")}</div>
                    <div className="sub_total_input_box">
                      <input
                        type="number"
                        className="profit"
                        defaultValue={profitInputWork? profitInputWork : null}
                        onChange={(e) => ChangeProfitInput(e.target.value)}
                        onBlur={(e) => BlurProfitInputWork()}
                      />
                    </div>
                  </div>
                  <div className="sub_total_items mb-4">
                    <div>{t("myBusiness.template.grandTotal")}</div>
                    <div>
                      <strong className="tota">
                        {(
                          subtotalWork +
                          (subtotalWork * taxInputWork) / 100 +
                          (subtotalWork * profitInputWork) / 100
                        ).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <h2>{t("myBusiness.template.materialRow")}</h2>
          <div className="template_table">
            <div className="template_table_title">
              <h5>{t("myBusiness.template.itemName")}</h5>
              <h5>{t("myBusiness.template.itemPrice")} &#8364;</h5>
              <h5>{t("myBusiness.template.totalPrice")} &#8364;</h5>
              {/* <h5>Item Title</h5> */}
            </div>
          </div>
          {row_phaseMat.map((r, index) => {
            // props.this.setSubTotalMobil(r.mat)
            // props.this.setState({items_cost: subtotal})
            subtotalMat += Number(r.mat);
            setItems_cost_subtotalMat(subtotalMat);
            // totalCost += Number(r.cost);
            // totalDur += Number(r.dur);
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
                    {r.unit}
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
                    onClick={(e) => {
                      handleEditMobileValue(r, index);
                      setForWhat("Material");
                    }}
                    src={EditIcon}
                    alt="EditIcon"
                  />
                </div>
                <div>
                  <img
                    onClick={(e) => deleteRowMat(index)}
                    src={DeleteIcon}
                    width={20}
                    alt="EditIcon"
                  />
                </div>
              </div>
            );
          })}
          <div className="template_mobile_container">
            <div className="sub_total_area">
              <div>
                <button
                  onClick={() => {
                    handleProjectPlaningModal();
                    setForWhat("Material");
                  }}
                  className="add_item_btn"
                >
                  {t("myBusiness.template.addItem")}
                </button>
              </div>
              {subtotalMat ? (
                <div className="sub_total_box">
                  <div className="sub_total_items border-bottom">
                    <div>{t("myBusiness.template.subTotal")}</div>
                    <div id="3resul">{subtotalMat}</div>
                  </div>
                  <div className="sub_total_items">
                    <div>
                      <span>{t("myBusiness.template.totalTax")}</span>
                      <div className="tax_re">
                        {((subtotalMat * taxInputMat) / 100).toFixed(2)}
                      </div>
                    </div>
                    <div>{t("myBusiness.template.addTaxIn")}</div>
                    <div className="sub_total_input_box">
                      <input
                        className="tax"
                        type="number"
                        defaultValue={taxInputMat?taxInputMat:null}
                        onChange={(e) => ChangeTaxInput(e.target.value)}
                        onBlur={(e) => BlurTaxInputMat()}
                      />
                    </div>
                  </div>
                  <div className="sub_total_items border-bottom">
                    <div>
                      <span>{t("myBusiness.template.totalProfit")}</span>
                      <div className="profit_re">
                        {((subtotalMat * profitInputMat) / 100).toFixed(2)}
                      </div>
                    </div>
                    <div>{t("myBusiness.template.addProfitIn")}</div>
                    <div className="sub_total_input_box">
                      <input
                        type="number"
                        className="profit"
                        defaultValue={profitInputMat?profitInputMat:null}
                        onChange={(e) => ChangeProfitInput(e.target.value)}
                        onBlur={(e) => BlurProfitInputMat()}
                      />
                    </div>
                  </div>
                  <div className="sub_total_items mb-4">
                    <div>{t("myBusiness.template.grandTotal")}</div>
                    <div>
                      <strong className="tota">
                        {(
                          subtotalMat +
                          (subtotalMat * taxInputMat) / 100 +
                          (subtotalMat * profitInputMat) / 100
                        ).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="save_template_btn">
              <div className="save_template_left">
                {loaded > 0 ? (
                  <button
                    onClick={updateData}
                    className="btn btn-primary clk-mobile-tamp"
                  >
                    {t("myBusiness.offer.upd_curr")}
                  </button>
                ) : (
                  <button
                    onClick={saveData}
                    data-toggle="modal"
                    data-target="#save"
                    className="btn btn-primary clk-mobile-tamp"
                  >
                    {t("myBusiness.offer.save_curr")}
                  </button>
                )}
              </div>
              <div className="save_template_right">
                {/* <button className="copy_btn">copy</button> */}
                <button className="reset_btn" onClick={() => reset()}>
                {t("myBusiness.template.reset")}
                </button>
              </div>
            </div>
          </div>
        </div>
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
  console.log(commonProps, "????>>");
  return (
    <>
      <TemplateTabs type={type} setType={setType} reset={reset}>
        <>
          <WorkTapm />
          <MaterialTapm />
          <WorkMaterialTapm />
        </>
      </TemplateTabs>
      <Modal isOpen={isAddItem}
        toggle={() => {
          handleProjectPlaningModal()
        }}
        className={"modalPropu"}
        centered
        size={"sm"}>
          <ModalBody>
            {isAddItem && (
              <ProjectPlanningModal
                handleClose={() => handleProjectPlaningModal()}
                handleSelectMobile={(data) => handleSelectMobile(data)}
                mobileItemName={mobileItemName}
                forWhat={forWhat}
              />
            )}
          </ModalBody>
      </Modal>
      {/* {isAddItem && (
        <ProjectPlanningModal
          handleClose={() => handleProjectPlaningModal()}
          handleSelectMobile={(data) => handleSelectMobile(data)}
          mobileItemName={mobileItemName}
          forWhat={forWhat}
        />
      )} */}
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
      <ProjectPlanModal data={commonProps} />
    </>
  );
};
export default withTranslation()(ProjectPlanMobile);
