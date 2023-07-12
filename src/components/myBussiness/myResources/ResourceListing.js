/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import axios from "axios";
import Header from "../../shared/Header";
import BussinessSidebar from "../../shared/BussinessSidebar";
import { Helper, url } from "../../../helper/helper";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import Pagination from '../../myBussiness/pagination/pagination';
import ReactPaginate from "react-paginate";

import SweetAlert from "react-bootstrap-sweetalert";
import Breadcrumb from "../../shared/Breadcrumb";
import Sidebar from "../../shared/Sidebar";

class ResourceListing extends Component {
  feeds_search = [];

  state = {
    resources: [],
    search: null,
    type: "",
    loading: false,
    deleteValid: false,
    successDelete: false,
    currentPage: 1,
    postsPerPage: 20,
    total: 0,
    pageCount: 0,
    from: 0,
    per_page: 0,
    current_page: 0,
    user_id: localStorage.getItem("Login_user_id"),
  };

  componentDidMount = async () => {
    this._isMounted = true;
    this.axiosCancelSource = axios.CancelToken.source();

    this.loadResources(this.axiosCancelSource);
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.axiosCancelSource.cancel();
  }

  loadResources = async (axiosCancelSource) => {
    const token = await localStorage.getItem("token");
    axios
      .get(
        `${url}/api/resources-client-list?page=${this.state.currentPage}&user_type=${this.state.type}&search_val=${this.state.search}&postsPerPage=${this.state.postsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cancelToken: axiosCancelSource.token,
        }
      )
      .then((result) => {
        // if (this._isMounted) {
        const { data } = result;
        this.feeds_search = data;
        this.setState({
          resources: data.data,
          currentPage: data.current_page,
          current_page: data.current_page,
          pageCount: data.last_page,
          from: data.from,
          last_page: data.last_page,
          per_page: data.per_page,
          postsPerPage: data.per_page,
          to: data.to,
          total: data.total,
          loading: true,
        });
        // }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          //console.log("Request canceled", err.message);
        } else {
          //console.log(err.response);
        }
      });
  };

  handleKeyDown = (e) => {
    this.setState({});
    this.axiosCancelSource = axios.CancelToken.source();
    this.loadResources(this.axiosCancelSource);
  };

  handleChange2 = (e) => {
    this.setState({ type: e.target.value });

    this.axiosCancelSource = axios.CancelToken.source();
    this.loadResources(this.axiosCancelSource);
  };

  handleDelete = async (id) => {
    const token = await localStorage.getItem("token");
    await axios
      .delete(`${url}/api/resource/delete/${this.state.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.axiosCancelSource = axios.CancelToken.source();
        this.setState({ successDelete: true });
        this.loadResources(this.axiosCancelSource);
        this.onCancel();
      })
      .catch((err) => {
        //console.log(err);
      });
    // if (response.status === 200) {
    //   // window.location.reload();
    // this.axiosCancelSource = axios.CancelToken.source();

    // this.loadResources(this.axiosCancelSource);
    // this.onCancel();
    // }
  };

  searchSpace = (event) => {
    let keyword = event.target.value;
    this.setState({ search: keyword, currentPage: 1 });
    this.axiosCancelSource = axios.CancelToken.source();
    this.loadResources(this.axiosCancelSource);
  };

  handleChange = (event) => {
    this.setState({ resources: this.feeds_search });
    this.setState({ type: event.target.value }, () => {
      if (this.state.type == "--Select--") {
        // window.location.reload();
        this.setState((prevstate) => ({
          resources: prevstate.resources,
        }));
        return true;
      }
      this.setState((prevstate) => ({
        resources: prevstate.resources.filter((data) => {
          return data.ur_resource_type.includes(this.state.type);
        }),
      }));
    });
  };

  paginate = async(number) => {
    await Promise.resolve(this.setState(() => ({ currentPage: number })));
    this.axiosCancelSource = axios.CancelToken.source();
    this.loadResources(this.axiosCancelSource, this.state.currentPage);
  };

  handleChange1 = async(e) => {
    const val = e.target.value
    await Promise.resolve(this.setState(() => ({ postsPerPage: val, })));
    this.axiosCancelSource = axios.CancelToken.source();
    this.loadResources(this.axiosCancelSource, this.state.currentPage);
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

  handlePageClick = async (data) => {
    const page = data.selected >= 0 ? data.selected + 1 : 0;
    await Promise.resolve(this.setState(() => ({ currentPage: page })));
    this.axiosCancelSource = axios.CancelToken.source();
    this.loadResources(this.axiosCancelSource, this.state.currentPage);
  };

  render() {
    const { t, i18n } = this.props;

    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;

    const items =
      typeof this.state.f !== "undefined"
        ? this.state.resources?.filter((data) => {
            if (this.state.search == null) return data;
            else if (
              data.first_name
                .toLowerCase()
                .includes(this.state.search.toLowerCase()) ||
              data.company
                .toLowerCase()
                .includes(this.state.search.toLowerCase())
            ) {
              return data;
            }
          })
        : [];

    const resource = this.state.resources
      ? this.state.resources?.map((resource, i) => (
          <tr
            key={resource.ur_id}
            style={{ background: i % 2 === 0 ? "#f3f3f3" : "white" }}
          >
            {/* <td style={{ width: "50px" }}>
            {i + 1}
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`check2${resource.id}`}
              />
              <label
                className="form-check-label"
                htmlFor={`check2${resource.id}`}
              ></label>
            </div>
          </td> */}
            <td data-label="First Name: ">
              <div className="table-cell">
                <p className="table-cell-head">{t("projectManagment.Resources.first_name")}</p>
                <p className="table-cell-value">{resource.first_name}</p>
              </div>
            </td>
            <td data-label="Last Name: ">
              <div className="table-cell">
                <p className="table-cell-head">{t("projectManagment.Resources.last_name")}</p>
                <p className="table-cell-value">{resource.last_name}</p>
              </div>
            </td>
            <td data-label="Last Name: ">
              <div className="table-cell">
                <p className="table-cell-head">{t("projectManagment.Resources.phone")}</p>
                <p className="table-cell-value">{resource.phone}</p>
              </div>
            </td>
            <td data-label="Email: ">
              <div className="table-cell">
                <p className="table-cell-head">{t("projectManagment.Resources.email")}</p>
                <p className="table-cell-value">{resource.email}</p>
              </div>
            </td>
            <td data-label="Company: ">
              <div className="table-cell">
                <p className="table-cell-head">{t("projectManagment.Resources.company")}</p>
                <p className="table-cell-value">{resource.company}</p>
              </div>
            </td>
            <td data-label="Type: ">
              <div className="table-cell">
                <p className="table-cell-head">{t("projectManagment.Resources.type")}</p>
                <p className="table-cell-value">
                  {resource.ur_resource_type === "Employee"
                    ? t("projectManagment.Resources.Employee")
                    : resource.ur_resource_type === "Resource"
                    ? t("projectManagment.Resources.Resource")
                    : ""}
                </p>
              </div>
            </td>
            {/* {t("projectManagment.Resources.Employee")} 
{t("projectManagment.Resources.Resources")} */}
            {/* <td data-label="Status: ">
            {resource.status === 1 ? t("projectManagment.Resources.Active") : t("projectManagment.Resources.Inactive")}
          </td>  */}
            {/* {resource.ur_user_id} || { this.state.user_id} */}
            {resource.ur_user_id === Number(this.state.user_id) ? (
              <>
                <td data-label="View: ">
                  {/* :""} */}
                  <div className="table-cell">
                    <p className="table-cell-head">View</p>
                    <p className="table-cell-value">
                      <Link
                        to={{ pathname: `myresources/${resource.ur_id}` }}
                        className="btn btn-info"
                      >
                        <i className="icon-edit"></i> {t("projectManagment.Resources.Details")}
                      </Link>
                    </p>
                  </div>
                </td>

                <td data-label="Delete: ">
                  <div className="table-cell">
                    <p className="table-cell-head">Delete</p>
                    <p className="table-cell-value">
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => this.onConfirm(resource.ur_id)}
                      >
                        <i className="icon-trash"></i> {t("projectManagment.Resources.Delete")}{" "}
                      </button>
                    </p>
                  </div>
                  {/* <button
              onClick={(e) => this.handleDelete(resource.id)}
              className="btn btn-light"
            >
              <i className="icon-trash"></i> {t("projectManagment.Resources.Delete")}
            </button> */}
                </td>
              </>
            ) : (
              <>
                <td data-label="View: "></td>
                <td data-label="Delete: "></td>
              </>
            )}
          </tr>
        ))
      : [];

    const { deleteValid, successDelete, total } = this.state;

    return (
      <div>
        {deleteValid ? (
          <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, delete it!"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="success"
            cancelBtnText="cancel"
            title="Are you sure?"
            onConfirm={(e) => this.handleDelete(e)}
            onCancel={this.onCancel}
            focusCancelBtn
          >
            {t("projectManagment.Resources.You_will")}
          </SweetAlert>
        ) : (
          ""
        )}

        {successDelete ? (
          <SweetAlert
            success
            closeOnClickOutside={true}
            // title={t("login.SuccessPopup")}
            title={t("projectManagment.Resources.delete_success")}
            onConfirm={this.onConfirmError}
          >
            {t("projectManagment.Resources.success")}
          </SweetAlert>
        ) : (
          ""
        )}

        {/* <Header active={"bussiness"} /> */}
        <Breadcrumb>
          <Link
            to="/business-dashboard"
            className="breadcrumb-item active"
            aria-current="page"
          >
            {t("projectManagment.Resources.heading")}
          </Link>
          <li className="breadcrumb-item active" aria-current="page">
            {t("projectManagment.Resources.myResource")}
          </li>
        </Breadcrumb>
        <div className="main-content">
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className="page-content">
            <div className="container-fluid">
              <h3 className="head3">{t("projectManagment.Resources.title1")}</h3>
              <div className="card">
                <div className="card-body">
                  <div className="filter">
                    <div className="row align-items-center">
                      <div className="col-lg-4 col-md-6">
                        <div className="form-group">
                          <label htmlFor="name">
                            {t("projectManagment.Resources.resource_company")}
                          </label>
                          <input
                            id="name"
                            onChange={this.searchSpace}
                            type="search"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-lg-5 col-md-6">
                        <div className="form-group">
                          <label htmlFor="type">
                            {t("projectManagment.Resources.resource_type")}
                          </label>
                          <select
                            name="type"
                            id="type"
                            onChange={this.handleChange2}
                            onKeyDown={this.handleKeyDown}
                            className="form-control"
                          >
                            <option value={""}>
                              {" "}
                              {t("projectManagment.Resources.Select")}{" "}
                            </option>
                            <option value={"Resource"}>
                              {" "}
                              {t("projectManagment.Resources.Resource")}{" "}
                            </option>
                            <option value={"Employee"}>
                              {" "}
                              {t("projectManagment.Resources.Employee")}{" "}
                            </option>
                            {/*<option>  {t("projectManagment.Resources.Select")} </option> */}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <h2 className="head2">
                    {t("projectManagment.Resources.my_listings1")}
                  </h2>
                  <div className="btn-group">
                    <Link
                      className="btn btn-blue text-uppercase"
                      to="/myresources"
                    >
                      {t("projectManagment.Resources.create")}
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table custom-table">
                      <thead>
                        <tr>
                          {/* <th style={{ width: "50px" }}>
                            {t("projectManagment.Resources.Serial_No")}
                          </th> */}
                          <th>{t("projectManagment.Resources.first_name")}</th>
                          <th>{t("projectManagment.Resources.last_name")}</th>
                          <th>{t("projectManagment.Resources.phone")}</th>
                          <th>{t("projectManagment.Resources.email")}</th>
                          <th>{t("projectManagment.Resources.company")}</th>
                          <th>{t("projectManagment.Resources.type")}</th>
                          {/* <th>{t("projectManagment.Resources.status")}</th> */}
                        </tr>
                      </thead>
                      <tbody>{resource}</tbody>
                    </table>
                    {total > 20 ? (
                      // <div className="homple_number">
                      //   <ReactPaginate
                      //     pageCount={this.state.pageCount}
                      //     initialPage={this.state.currentPage - 1}
                      //     forcePage={this.state.currentPage - 1}
                      //     pageRangeDisplayed={2}
                      //     marginPagesDisplayed={2}
                      //     previousLabel="&#x276E;"
                      //     nextLabel="&#x276F;"
                      //     containerClassName="uk-pagination uk-flex-center"
                      //     activeClassName="uk-active"
                      //     disabledClassName="uk-disabled"
                      //     onPageChange={this.handlePageClick}
                      //     disableInitialCallback={true}
                      //   />
                      // </div>
                      <div
                    className='row'
                    style={{ width: '100%', marginLeft: '0px' }}
                  >
                    <div className='col-md-6'>
                      <h3 className='total_rec'> Show once </h3>
                      <select value={this.state.postsPerPage} id='dropdown_custom' onChange={this.handleChange1}>
                        <option value='10'>10</option>
                        <option value='20'>20</option>
                        <option value='40'>40</option>
                        <option value='80'>80</option>
                        <option value='100'>100</option>
                      </select>
                    </div>
                    <div className='col-md-6'>
                      <Pagination
                        postsPerPage={this.state.postsPerPage}
                        totalPosts={total}
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

export default withTranslation()(ResourceListing);
