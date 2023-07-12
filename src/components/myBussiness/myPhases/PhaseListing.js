import React, { Component } from "react";
import axios from "axios";
import Header from "../../shared/Header";
import BussinessSidebar from "../../shared/BussinessSidebar";
import { url } from "../../../helper/helper";
import { Link } from "react-router-dom";
import Datetime from "react-datetime";
import { withTranslation } from "react-i18next";
import SweetAlert from "react-bootstrap-sweetalert";
import Pagination from "../pagination/pagination";
import Sidebar from "../../shared/Sidebar";

class PhaseListing extends Component {
  state = {
    search: null,
    phases: [],
    loading: false,
    currentPage: 1,
    postsPerPage: 10,
    successDelete: false,
  };

  componentDidMount = () => {
    this._isMounted = true;
    this.axiosCancelSource = axios.CancelToken.source();

    this.loadPhases(this.axiosCancelSource);
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.axiosCancelSource.cancel();
  }

  loadPhases = async (axiosCancelSource) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/phase/work/en`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        if (this._isMounted) {
          this.setState({ phases: result.data.data });
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

  deletePhase = async (id) => {
    const token = await localStorage.getItem("token");
    axios
      .delete(`${url}/api/phase/work_delete/${this.state.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.loadPhases();
        this.setState({ successDelete: true });
        this.onCancel();
        this.axiosCancelSource = axios.CancelToken.source();
        this.loadPhases(this.axiosCancelSource);
      })
      .catch((err) => {
        //console.log(err.response);
      });
  };

  paginate = (number) => {
    this.setState({
      currentPage: number,
    });
  };

  handleChange = (e) => {
    this.setState({
      postsPerPage: e.target.value,
    });
  };

  searchSpace = (event) => {
    let keyword = event.target.value;
    this.setState({ search: keyword, currentPage: 1 });
  };

  onCancel = () => {
    this.setState({
      statusSuccess: false,
      statusValid: false,
      deleteValid: false,
      id: "",
    });
  };

  onConfirm = (id) => {
    if (id) {
      this.setState({ id: id, deleteValid: true });
    }
  };

  onConfirmError = () => {
    this.setState({ successDelete: false });
  };

  render() {
    const { t, i18n } = this.props;
    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const items =
      typeof this.state.phases !== "undefined"
        ? this.state.phases?.filter((data) => {
            if (this.state.search == null) return data;
            else if (
              data.area_identifier.includes(this.state.search) ||
              data.aw_identifier
                .toLowerCase()
                .includes(this.state.search.toLowerCase())
            ) {
              return data;
            }
          })
        : [];

    const currentPosts = items?.slice(indexOfFirstPost, indexOfLastPost);
    const length = items ? items.length : "";

    const phaseList = currentPosts
      ? currentPosts?.map((phase, index) => (
          <tr
            key={index}
            style={{ background: index % 2 === 0 ? "#f3f3f3" : "white" }}
          >
            {/* <td style={{ width: "50px" }}>
            <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`check2${index}`}
                />
                <label
                  className="form-check-label"
                  htmlFor={`check2${index}`}
                ></label>
              </div>
            {index + 1}
          </td> */}
            <td>
              <div className="table-cell">
                <p className="table-cell-head">{t("phase.phase")} #</p>
                <p className="table-cell-value">{phase.aw_area_id}</p>
              </div>
            </td>
            <td>
              <div className="table-cell">
                <p className="table-cell-head">{t("phase.work_area")}</p>
                <p className="table-cell-value">{phase.aw_identifier}</p>
              </div>
            </td>
            <td>
              <div className="table-cell">
                <p className="table-cell-head">{t("phase.area_name")}</p>
                <p className="table-cell-value">{phase.area_identifier}</p>
              </div>
            </td>
            <td>
              <div className="table-cell">
                <p className="table-cell-head">Action</p>
                <p className="table-cell-value">
                  <p className="action-btns-wrap">
                    <Link
                      className="btn btn-dark"
                      style={{ marginRight: "10px" }}
                      to={{
                        pathname: `/myphases/${phase.aw_id}`,
                      }}
                    >
                      {t("phase.Edit")}
                    </Link>
                    {/* <button
                      onClick={() => this.deletePhase(phase.aw_area_id)}
                      className="btn btn-danger"
                    >
                      {t("phase.Delete")} 
                    </button>
                    */}
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => this.onConfirm(phase.aw_id)}
                    >
                      <i className="icon-trash"></i> {t("mycustomer.Delete")}{" "}
                    </button>
                  </p>
                </p>
              </div>
            </td>
          </tr>
        ))
      : [];
    const { deleteValid, successDelete } = this.state;

    return (
      <div>
        {deleteValid ? (
          <SweetAlert
            warning
            showCancel
            confirmBtnText={t("phase.yes_d")}
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="success"
            cancelBtnText={t("phase.cancel")}
            title={t("phase.are_u_s")}
            onConfirm={(e) => this.deletePhase(e)}
            onCancel={this.onCancel}
            focusCancelBtn
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
            // title={t("phase.delete_success")}
            onConfirm={this.onConfirmError}
          >
            {/* {t("list_details.success")} */}
          </SweetAlert>
        ) : (
          ""
        )}

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
            <li className="breadcrumb-item active" aria-current="page">
              {t("phase.list_phase")}
            </li>
          </ol>
        </nav>
        <div className="main-content">
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className="page-content">
            <div className="container-fluid">
              <h3 className="head3">{t("feeds.search.title")}</h3>
              <div className="card">
                <div className="card-body">
                  <div className="filter">
                    <div className="row align-items-center">
                      <div className="col-lg-4 col-md-6">
                        <div className="form-group">
                          <label htmlFor="Name">{`${t("invoice.name")}`}</label>
                          <input
                            id="client"
                            onChange={this.searchSpace}
                            type="search"
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <h2 className="head2">{t("phase.list_phase")}</h2>
                  <div className="btn-group">
                    <Link
                      className="btn btn-blue text-uppercase"
                      to="/myphases"
                    >
                      {t("c_material_list.listing.create")}
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table custom-table">
                      <thead>
                        <tr>
                          {/* <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="check1"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="check1"
                              ></label>
                            </div> */}

                          {/* <th style={{ width: "50px" }}>
                            {t("account.Serial_No")}

                          </th> */}
                          <th>{t("phase.phase")} #</th>
                          <th>{t("phase.work_area")}</th>
                          <th>{t("phase.area_name")}</th>
                          <th> </th>
                        </tr>
                      </thead>
                      <tbody> {phaseList} </tbody>
                    </table>

                    {length > 10 ? (
                      <div className="row" style={{ width: "100%" }}>
                        {/* <div className="col-md-4" >
                        <h3 className="total_rec"> Total {length}  </h3>
                      </div> */}
                        <div className="col-md-6">
                          <h3 className="total_rec"> Show once </h3>
                          <select
                            id="dropdown_custom"
                            onChange={this.handleChange}
                          >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="40">40</option>
                            <option value="80">80</option>
                            <option value="100">100</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <Pagination
                            postsPerPage={this.state.postsPerPage}
                            totalPosts={length}
                            paginate={this.paginate}
                            currentPage={this.state.currentPage}
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
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

export default withTranslation()(PhaseListing);
