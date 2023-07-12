import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { url } from "../../../../helper/helper";
import { getData, postData, postDataWithToken } from "../../../../helper/api";
import { withTranslation } from "react-i18next";

const TasksAndPlanningModal = (props) => {
  const t = props.t;
  const params = useParams();
  const [resources, setResources] = useState([]);
  const [type, setType] = useState("Work");
  const [allTamp, setAllTamp] = useState([]);
  const [row_work, setRow_work] = useState([
    {
      task_name: "",
      start_date: new Date(),
      end_date: new Date(),
      duration: 0,
      assignee_to: "",
      report_to: "",
    },
  ]);
  const [row_material, setRow_material] = useState([
    {
      task_name: "",
      start_date: new Date(),
      end_date: new Date(),
      duration: 0,
      assignee_to: "",
      report_to: "",
    },
  ]);

  const taskListing = async () => {
    const token = localStorage.getItem("token");
    await getData(`${url}/api/project/task_listing/${params.id}`, token).then(
      (result) => {
        console.log(result?.data?.resources, "???>>>>>");
        setResources(result?.data?.resources);
      }
    );
  };

  const addTask = async () => {
    const token = localStorage.getItem("token");
    let data = { type: type, project_id: params.id, data: row_work };
    if (type === "Work") {
      const WorkArr = { workArr: row_work, materialArr: [] };
      data = { type: type, project_id: params.id, data: WorkArr };
    } else if (type === "Material") {
      const MaterialArr = { workArr: [], materialArr: row_material };
      data = { type: type, project_id: params.id, data: MaterialArr };
    } else {
      const BothArr = { workArr: row_work, materialArr: row_material };
      data = { type: type, project_id: params.id, data: BothArr };
    }

    await postDataWithToken(
      `${url}/api/project/add_task_planning`,
      data,
      token
    ).then((result) => {
      console.log(result);
      props.handleClose();
      reset();
    });
  };

  useEffect(() => {
    taskListing();
    loadNames();
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
          const myItems = JSON.parse(items).map((data) => {
            return {
              task_name: data.items,
              start_date: new Date(),
              end_date: new Date(),
              duration: 0,
              assignee_to: "",
              report_to: "",
            };
          });
          items && setRow_work(myItems);
          // setTaxInputWork(tax);
          // setProfitInputWork(profit);
          // setLoaded(loaded + 1);
        } else if (type === "Material") {
          setType("Material");
          const myItems = JSON.parse(items).map((data) => {
            return {
              task_name: data.items,
              start_date: new Date(),
              end_date: new Date(),
              duration: 0,
              assignee_to: "",
              report_to: "",
            };
          });
          items && setRow_material(myItems);
          // setTaxInputMat(tax);
          // setProfitInputMat(profit);
          // setLoaded(loaded + 1);
        } else {
          const myItems = items && JSON.parse(items);
          const myItemsWork = JSON.parse(myItems.workArr).map((data) => {
            return {
              task_name: data.items,
              start_date: new Date(),
              end_date: new Date(),
              duration: 0,
              assignee_to: "",
              report_to: "",
            };
          });
          const myItemsMat = JSON.parse(myItems.matAtt).map((data) => {
            return {
              task_name: data.items,
              start_date: new Date(),
              end_date: new Date(),
              duration: 0,
              assignee_to: "",
              report_to: "",
            };
          });
          setType("Both");
          setRow_work(myItemsWork);
          setRow_material(myItemsMat);
          // setTaxInputWork(myTax.workTax);
          // setProfitInputWork(myProfit.workProfit);
          // setTaxInputMat(myTax.matTax);
          // setProfitInputMat(myProfit.matProfit);
          // setLoaded(loaded + 1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleMat = (event) => {
    event.preventDefault();
    const rowsInput = {
      task_name: "",
      start_date: new Date(),
      end_date: new Date(),
      duration: 0,
      assignee_to: "",
      report_to: "",
    };
    setRow_material([...row_material, rowsInput]);
  };
  const handleWork = (event) => {
    event.preventDefault();
    const rowsInput = {
      task_name: "",
      start_date: new Date(),
      end_date: new Date(),
      duration: 0,
      assignee_to: "",
      report_to: "",
    };
    setRow_work([...row_work, rowsInput]);
  };

  const deleteRowWork = (index) => {
    const rows = [...row_work];
    rows.splice(index, 1);
    setRow_work(rows);
  };
  const deleteRowMaterial = (index) => {
    const rows = [...row_material];
    rows.splice(index, 1);
    setRow_material(rows);
  };

  const handleChangeWork = (index, evnt) => {
    let { name, value } = evnt.target;
    let rowsInput = [...row_work];
    rowsInput[index][name] = value;
    setRow_work(rowsInput);
  };
  const handleChangeMaterial = (index, evnt) => {
    let { name, value } = evnt.target;
    let rowsInput = [...row_material];
    rowsInput[index][name] = value;
    setRow_material(rowsInput);
  };

  const handleAsigneeWork = (index, event) => {
    let rows = [...row_work];
    rows[index]["assignee_to"] = event.target.value;
  };
  const handleReporteeWork = (index, event) => {
    let rows = [...row_work];
    rows[index]["report_to"] = event.target.value;
    console.log(event, "event");
  };
  const handleAsigneeMaterial = (index, event) => {
    let rows = [...row_material];
    rows[index]["assignee_to"] = event.target.value;
  };
  const handleReporteeMaterial = (index, event) => {
    let rows = [...row_material];
    rows[index]["report_to"] = event.target.value;
    console.log(event, "event");
  };
  const handleChangeStartDate = (index, date) => {
    let rows = [...row_work];
    rows[index]["start_date"] = date;
    setRow_work(rows);
  };
  const handleChangeEndDate = (index, date) => {
    let rows = [...row_work];
    rows[index]["end_date"] = date;
    setRow_work(rows);
  };
  const handleChangeStartDateMat = (index, date) => {
    let rows = [...row_material];
    rows[index]["start_date"] = date;
    setRow_material(rows);
  };
  const handleChangeEndDateMat = (index, date) => {
    let rows = [...row_material];
    rows[index]["end_date"] = date;
    setRow_material(rows);
  };

  const handleChangeDuration = (index, event) => {
    let rows = [...row_work];
    rows[index]["duration"] = event.target.value;
    setRow_work(rows);
  };
  const handleChangeDurationMat = (index, event) => {
    let rows = [...row_material];
    rows[index]["duration"] = event.target.value;
    setRow_material(rows);
  };
  const reset = () => {
    setRow_material([
      {
        task_name: "",
        start_date: new Date(),
        end_date: new Date(),
        duration: 0,
        assignee_to: "",
        report_to: "",
      },
    ]);
    setRow_work([
      {
        task_name: "",
        start_date: new Date(),
        end_date: new Date(),
        duration: 0,
        assignee_to: "",
        report_to: "",
      },
    ]);
  };
  return (
    <div>
      <Modal
        isOpen={props.show}
        toggle={() => {
          props.handleClose();
          reset();
        }}
        className={"modalPropu"}
        centered
        dialogClassName="modal-20w"
      >
        <ModalHeader
          toggle={() => {
            props.handleClose();
            reset();
          }}
          className="d-flex justify-content-between"
        >
          {" "}
          <div className="modal-title"></div>
        </ModalHeader>

        <ModalBody>
          <div className="filter mt-4 project-planning-tabs invoice-tabs mb-3">
            <ul class="nav nav-tabs row">
              <li
                className="active col d-flex justify-content-center"
                onClick={() => {
                  setType("Work");
                  reset();
                }}
              >
                <a
                  className="active flex-grow-1 d-flex  align-items-center"
                  data-toggle="tab"
                  href="#work"
                >
                  <div>Work</div>
                </a>
              </li>
              <li
                className="col d-flex justify-content-center"
                onClick={() => {
                  setType("Material");
                  reset();
                }}
              >
                <a
                  data-toggle="tab"
                  href="#material"
                  className="flex-grow-1 d-flex align-items-center"
                >
                  <div>Material</div>
                </a>
              </li>
              <li
                className="col d-flex justify-content-center "
                onClick={() => {
                  setType("Both");
                  reset();
                }}
              >
                <a
                  data-toggle="tab"
                  href="#work-material-both"
                  className="flex-grow-1 d-flex align-items-center"
                >
                  <div>Work and Material</div>
                </a>
              </li>
            </ul>
          </div>
          <div
            id="project-planning-table"
            className="tab-content project-management-modal project-test-planning-modal"
          >
            <div id="work" className="tab-pane active">
              <div className="row project_plan">
                <div className="col-sm-6 col-lg-2">
                  <div className="form-group">
                    <label className="d-xl-none">&nbsp;</label>
                    <div id="invoice-tamp-select" className="dropdown mt-2">
                      <select
                        onChange={loadTemplate}
                        className="btn btn-light dropdown-toggle"
                      >
                        <option value="">
                          {t("myBusiness.offer.template")}
                        </option>
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
              <div className="table-responsive-lg scroller mt-3 mb-5 invoice-table">
                <table
                  style={{ tableLayout: "fixed" }}
                  className="table table-bordered table-sm table-responsive"
                >
                  <thead>
                    <tr className="text-right">
                      {/* <th className="close-icon-cell"></th> */}
                      <th
                        className="close-icon-cell"
                        style={{ width: "50px" }}
                      ></th>

                      <th className="text-left">Task Name</th>
                      <th>Start date</th>
                      <th>End date</th>
                      <th>Duration</th>
                      <th>Assignee</th>
                      <th>Reportee</th>
                    </tr>
                  </thead>

                  <tbody>
                    {row_work.map((r, index) => {
                      console.log(r, "???");
                      return (
                        <>
                          <tr
                            key={index}
                            className="text-right i-val customerIDCell"
                          >
                            <td
                              className="remove-row1 text-center"
                              onClick={() => deleteRowWork(index)}
                            >
                              ×
                            </td>

                            <td>
                              <input
                                type="text"
                                value={r.task_name}
                                onChange={(evnt) =>
                                  handleChangeWork(index, evnt)
                                }
                                name="task_name"
                                className="form-control"
                                style={{ fontSize: "13px" }}
                              />
                            </td>
                            <td>
                              <DatePicker
                                className="date-picker"
                                onChange={(date) => {
                                  handleChangeStartDate(index, date);
                                }}
                                selected={r.start_date}
                                dateFormat="dd/MM/yyyy"
                                closeCalendar={false}
                              />
                            </td>
                            <td>
                              <DatePicker
                                style={{ border: 0 }}
                                className="date-picker"
                                onChange={(date) => {
                                  handleChangeEndDate(index, date);
                                }}
                                selected={r.end_date}
                                dateFormat="dd/MM/yyyy"
                                closeCalendar={false}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={r.duration}
                                onChange={(evnt) =>
                                  handleChangeDuration(index, evnt)
                                }
                                className="form-control"
                                style={{ fontSize: "13px" }}
                              />
                            </td>
                            <td>
                              <select
                                class="form-control"
                                onChange={(event) => {
                                  handleAsigneeWork(index, event);
                                }}
                              >
                                <option value="">Select</option>
                                {resources &&
                                  resources.map((data, idx) => {
                                    return (
                                      <option value={data?.ur_id}>
                                        {data?.first_name}
                                      </option>
                                    );
                                  })}
                              </select>
                            </td>

                            <td>
                              <select
                                class="form-control"
                                onChange={(event) => {
                                  handleReporteeWork(index, event);
                                }}
                              >
                                <option value="">Select</option>
                                {resources &&
                                  resources.map((data, idx) => {
                                    return (
                                      <option value={data?.ur_id}>
                                        {data?.first_name}
                                      </option>
                                    );
                                  })}
                              </select>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                    <tr className="text-left">
                      <td colSpan="7">
                        <button
                          onClick={handleWork}
                          className="btn btn-link p-0"
                        >
                          Add row
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="buttons">
                  <button onClick={addTask} className="btn btn-primary p-2">
                    Add task
                  </button>
                </div>
              </div>
            </div>

            <div id="material" className="tab-pane fade">
              <div className="row project_plan">
                <div className="col-sm-6 col-lg-2">
                  <div className="form-group">
                    <label className="d-xl-none">&nbsp;</label>
                    <div id="invoice-tamp-select" className="dropdown mt-2">
                      <select
                        onChange={loadTemplate}
                        className="btn btn-light dropdown-toggle"
                      >
                        <option value="">
                          {t("myBusiness.offer.template")}
                        </option>
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
              <div className="table-responsive-lg scroller mt-3 mb-5 invoice-table">
                <table
                  style={{ tableLayout: "fixed" }}
                  className="table table-bordered table-sm table-responsive"
                >
                  <thead>
                    <tr className="text-right">
                      <th
                        style={{ width: "50px" }}
                        className="close-icon-cell"
                      ></th>
                      <th className="text-left" style={{ width: "100%" }}>
                        Task Name
                      </th>
                      {/* <th>Start date</th>
                      <th>End date</th>
                      <th>Duration</th>
                      <th>Assignee</th>
                      <th>Reportee</th> */}
                    </tr>
                  </thead>

                  <tbody>
                    {row_material.map((r, index) => {
                      console.log(r, "???");
                      return (
                        <>
                          <tr
                            key={index}
                            className="text-right i-val customerIDCell"
                          >
                            <td
                              className="remove-row1 text-center"
                              colSpan="1"
                              onClick={() => deleteRowMaterial(index)}
                            >
                              ×
                            </td>
                            <td colSpan="5">
                              <input
                                type="text"
                                value={r.task_name}
                                onChange={(evnt) =>
                                  handleChangeMaterial(index, evnt)
                                }
                                name="task_name"
                                className="form-control"
                                style={{ fontSize: "13px" }}
                              />
                            </td>
                          </tr>
                        </>
                      );
                    })}
                    <tr className="text-left">
                      <td colSpan="2">
                        <button
                          onClick={handleMat}
                          className="btn btn-link p-0"
                        >
                          Add row
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="buttons">
                  <button onClick={addTask} className="btn btn-primary p-2">
                    Add task
                  </button>
                </div>
              </div>
            </div>

            <div id="work-material-both" className="tab-pane fade">
              <div className="row project_plan">
                <div className="col-sm-6 col-lg-2">
                  <div className="form-group">
                    <label className="d-xl-none">&nbsp;</label>
                    <div id="invoice-tamp-select" className="dropdown mt-2">
                      <select
                        onChange={loadTemplate}
                        className="btn btn-light dropdown-toggle"
                      >
                        <option value="">
                          {t("myBusiness.offer.template")}
                        </option>
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
              <div className="table-responsive-lg scroller mt-3 mb-5 invoice-table">
                <table
                  style={{ tableLayout: "fixed" }}
                  className="table table-bordered table-sm table-responsive"
                >
                  <thead>
                    <tr className="text-right">
                      <th
                        className="close-icon-cell"
                        style={{ width: "50px" }}
                      ></th>
                      <th className="text-left">Task Name</th>
                      <th>Start date</th>
                      <th>End date</th>
                      <th>Duration</th>
                      <th>Assignee</th>
                      <th>Reportee</th>
                    </tr>
                  </thead>

                  <tbody>
                    {row_work.map((r, index) => {
                      // console.log(r, "???");
                      return (
                        <>
                          <tr
                            key={index}
                            className="text-right i-val customerIDCell"
                          >
                            <td
                              className="remove-row1 text-center"
                              onClick={() => deleteRowWork(index)}
                            >
                              ×
                            </td>
                            <td>
                              <input
                                type="text"
                                value={r.task_name}
                                onChange={(evnt) =>
                                  handleChangeWork(index, evnt)
                                }
                                name="task_name"
                                className="form-control"
                                style={{ fontSize: "13px" }}
                              />
                            </td>
                            <td>
                              <DatePicker
                                className="date-picker"
                                onChange={(date) => {
                                  handleChangeStartDate(index, date);
                                }}
                                selected={r.start_date}
                                dateFormat="dd/MM/yyyy"
                                closeCalendar={false}
                              />
                            </td>
                            <td>
                              <DatePicker
                                style={{ border: 0 }}
                                className="date-picker"
                                onChange={(date) => {
                                  handleChangeEndDate(index, date);
                                }}
                                selected={r.end_date}
                                dateFormat="dd/MM/yyyy"
                                closeCalendar={false}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={r.duration}
                                onChange={(evnt) =>
                                  handleChangeDuration(index, evnt)
                                }
                                className="form-control"
                                style={{ fontSize: "13px" }}
                              />
                            </td>
                            <td>
                              <select
                                class="form-control"
                                onChange={(event) => {
                                  handleAsigneeWork(index, event);
                                }}
                              >
                                <option value="">Select</option>
                                {resources &&
                                  resources.map((data, idx) => {
                                    return (
                                      <option value={data?.ur_id}>
                                        {data?.first_name}
                                      </option>
                                    );
                                  })}
                              </select>
                            </td>

                            <td>
                              <select
                                class="form-control"
                                onChange={(event) => {
                                  handleReporteeWork(index, event);
                                }}
                              >
                                <option value="">Select</option>
                                {resources &&
                                  resources.map((data, idx) => {
                                    return (
                                      <option value={data?.ur_id}>
                                        {data?.first_name}
                                      </option>
                                    );
                                  })}
                              </select>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                    <tr className="text-left">
                      <td colSpan="7">
                        <button
                          onClick={handleWork}
                          className="btn btn-link p-0"
                        >
                          Add row
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  style={{ tableLayout: "fixed" }}
                  className="table table-bordered table-sm table-responsive work-material-work-table"
                >
                  <thead>
                    <tr className="text-right">
                      {/* <th className="close-icon-cell"></th> */}
                      <th style={{ width: "50px" }}></th>
                      <th className="text-left">Task Name</th>
                      {/* <th>Start date</th>
                      <th>End date</th>
                      <th>Duration</th>
                      <th>Assignee</th>
                      <th>Reportee</th> */}
                    </tr>
                  </thead>

                  <tbody>
                    {row_material.map((r, index) => {
                      // console.log(r, "???");
                      return (
                        <>
                          <tr
                            key={index}
                            className="text-right i-val customerIDCell"
                          >
                            <td
                              className="remove-row1 text-center"
                              onClick={() => deleteRowMaterial(index)}
                            >
                              ×
                            </td>
                            <td>
                              <input
                                type="text"
                                value={r.task_name}
                                onChange={(evnt) =>
                                  handleChangeMaterial(index, evnt)
                                }
                                name="task_name"
                                className="form-control"
                                style={{ fontSize: "13px" }}
                              />
                            </td>
                          </tr>
                        </>
                      );
                    })}
                    <tr className="text-left">
                      <td colSpan="2">
                        <button
                          onClick={handleMat}
                          className="btn btn-link p-0"
                        >
                          Add row
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="buttons">
                  <button onClick={addTask} className="btn btn-primary p-2">
                    Add task
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default withTranslation()(TasksAndPlanningModal);
