/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import axios from "axios";
import Header from "../../shared/Header";
import BussinessSidebar from "../../shared/BussinessSidebar";
import { Helper, url } from "../../../helper/helper";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import SweetAlert from "react-bootstrap-sweetalert";
import Pagination from "../pagination/pagination";
import ReactPaginate from "react-paginate";
import Breadcrumb from "../../shared/Breadcrumb";
import Sidebar from "../../shared/Sidebar";

class ResourceListing extends Component {
  feeds_search = [];

  state = {
    resources: [],
    search: null,
    type: "",
    isPopupShown: false,
    deleteValid: false,
    successDelete: false,
    loading: false,
    Login_user_permissions: localStorage.getItem("Login_user_permissions"),
    user_id: localStorage.getItem("Login_user_id"),
    currentPage: 1,
    postsPerPage: 20,
    total: 0,
    pageCount: 0,
    from: 0,
    per_page: 0,
    current_page: 0,
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
        `${url}/api/resources-client-list/Client?page=${this.state.currentPage}?postsPerPage=${this.state.postsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cancelToken: axiosCancelSource.token,
        }
      )
      .then((result) => {
        //console.log("result =========", result, this._isMounted);
        // if (this._isMounted) {
        const { data } = result;
        // this.feeds_search = data;
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

  handleDelete = (e) => {
    const id = this.state.id;
    const token = localStorage.getItem("token");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${url}/api/resource/delete/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        this.setState({ successDelete: true, deleteValid: false });
        this.axiosCancelSource = axios.CancelToken.source();
        this.loadResources(this.axiosCancelSource);
      })
      .catch((error) => console.log("error-------", error));
  };

  searchSpace = (event) => {
    let keyword = event.target.value;
    this.setState({ search: keyword, currentPage: 1 });
  };

  handleChange = (event) => {
    this.setState({ resources: this.feeds_search });
    this.setState({ type: event.target.value }, () => {
      if (this.state.type == "--Select--") {
        // window.location.reload();
        // this.setState((prevstate) => ({
        //   resources: prevstate.resources ? prevstate.resources : ""
        // }));
        this.axiosCancelSource = axios.CancelToken.source();
        this.loadResources(this.axiosCancelSource);
      }
      this.setState((prevstate) => ({
        resources: prevstate.resources?.filter((data) => {
          return data.ur_resource_type?.includes(this.state.type);
        }),
      }));
    });
  };

  onConfirm = (id) => {
    if (id) {
      this.setState({ id: id, deleteValid: true });
    }
  };

  successDelete = () => {
    this.setState({ successDelete: false });
  };

  onCancel = () => {
    this.setState({
      statusSuccess: false,
      statusValid: false,
      deleteValid: false,
      id: "",
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

  handlePageClick = async (data) => {
    const page = data.selected >= 0 ? data.selected + 1 : 0;
    await Promise.resolve(this.setState(() => ({ currentPage: page })));
    this.axiosCancelSource = axios.CancelToken.source();
    this.loadResources(this.axiosCancelSource, this.state.currentPage);
  };

  render() {
    const {
      deleteValid,
      successDelete,
      Login_user_permissions,
      resources,
      total,
    } = this.state;
    const { t, i18n } = this.props;

    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;

    const filter_mybusiness_clients_edit = JSON.parse(
      Login_user_permissions
    )?.filter((x) => x === "mybusiness_clients_edit");
    const filter_mybusiness_clients_delete = JSON.parse(
      Login_user_permissions
    )?.filter((x) => x === "mybusiness_clients_delete");

    const items =
      resources?.length > 0
        ? resources.filter((data) => {
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
    // //console.log("this.state.resources", this.state.resources);
    //console.log("resources", resources);

    const resource = resources
      ? resources.map((resource, i) => (
          <tr
            key={resource.ur_id}
            style={{ background: i % 2 === 0 ? "#f3f3f3" : "white" }}
          >
            {/* <td style={{ width: "50px" }}>
            {i + 1}
          </td> */}
            <td data-label="First Name: ">
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.client.name")}</p>
                <p className="table-cell-value">
                  {resource.first_name} {resource.last_name}
                </p>
              </div>
            </td>
            {/* <td data-label="Last Name: "></td> */}
            <td data-label="Phone: ">
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.client.phone")}</p>
                <p className="table-cell-value">{resource.phone}</p>
              </div>
            </td>
            <td data-label="Email: ">
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.client.email")}</p>
                <p className="table-cell-value">{resource.email}</p>
              </div>
            </td>
            <td data-label="Company: ">
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.client.company")}</p>
                <p className="table-cell-value">{resource.company}</p>
              </div>
            </td>
            {/* <td data-label="Type: ">{resource.ur_resource_type === "Client" ? t("mycustomer.Client") : "" }</td> */}
            <td data-label="payment_t: ">
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.client.type")}</p>
                <p className="table-cell-value">
                  {resource.payment_t === "Business"
                    ? t("myBusiness.client.Business")
                    : t("myBusiness.client.Consumer_customer")}
                </p>
              </div>
            </td>
            <td data-label="payment_days: ">
              <div className="table-cell">
                <p className="table-cell-head">{t("myBusiness.client.termsOfpayment")}</p>
                <p className="table-cell-value">{resource.payment_days}</p>
              </div>
            </td>

            {/* <td data-label="Status: ">
            {resource.active === 1 && resource.confirmed === 1 ? t("myBusiness.client.Active") : t("mycustomer.Inactive")}
          </td> */}

            {resource.ur_user_id === Number(this.state.user_id) ? (
              <>
                {filter_mybusiness_clients_edit[0] ===
                "mybusiness_clients_edit" ? (
                  <td data-label="View: ">
                    <div className="table-cell">
                      <p className="table-cell-head"></p>
                      <p className="table-cell-value">
                        <Link
                          to={{
                            pathname: `mycustomers_edit/${resource.ur_id}`,
                          }}
                          className="btn btn-info"
                        >
                          <i className="icon-edit"></i>{" "}
                          {t("myBusiness.client.Details")}
                        </Link>
                      </p>
                    </div>
                  </td>
                ) : (
                  ""
                )}
                {filter_mybusiness_clients_delete[0] ===
                "mybusiness_clients_delete" ? (
                  <td data-label="Delete: ">
                    <div className="table-cell">
                      <p className="table-cell-head"></p>
                      <p className="table-cell-value">
                        <button
                          type="button"
                          className="btn btn-light"
                          onClick={() => this.onConfirm(resource.ur_id)}
                        >
                          <i className="icon-trash"></i>{" "}
                          {t("myBusiness.client.Delete")}{" "}
                        </button>
                      </p>
                    </div>
                  </td>
                ) : (
                  ""
                )}
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

    return (
      <div>
        {deleteValid ? (
          <SweetAlert
            warning
            showCancel
            confirmBtnText={t("myBusiness.client.delete")}
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="success"
            cancelBtnText={t("myBusiness.client.cancel")}
            title={t("myBusiness.client.Are_you")}
            onConfirm={(e) => this.handleDelete(e)}
            onCancel={this.onCancel}
            focusCancelBtn
          >
            {t("myBusiness.client.You_will")}
          </SweetAlert>
        ) : (
          ""
        )}

        {successDelete ? (
          <SweetAlert
            success
            title={t("myBusiness.client.succesD")}
            onConfirm={this.successDelete}
          >
            {t("myBusiness.client.sucessDM")}
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
            {t("myBusiness.client.heading")}
          </Link>
          <li className="breadcrumb-item active" aria-current="page">
            {t("myBusiness.client.heading_2")}
          </li>
        </Breadcrumb>
        <div className="main-content">
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className="page-content">
            <div className="container-fluid">
              <h3 className="head3">{t("myagreement.searchFilters")}</h3>
              <div className="card">
                <div className="card-body">
                  <div className="filter">
                    <div className="row align-items-center">
                      <div className="col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
                        <div className="form-group">
                          <label htmlFor="name">
                            {t("myBusiness.client.resource_company")}
                          </label>
                          <input
                            id="name"
                            onChange={this.searchSpace}
                            type="search"
                            className="form-control"
                          />
                        </div>
                      </div>
                      {/* <div className="col-lg-5 col-md-6">
                        <div className="form-group">
                          <label htmlFor="type">
                            {t("mycustomer.resource_type")}
                          </label>
                          <select
                            name="type"
                            id="type"
                            onChange={this.handleChange}
                            className="form-control"
                          >
                            <option>  {t("mycustomer.Select")}    </option>
                            <option> {t("mycustomer.Sub_Contractor")}  </option>
                            <option> {t("mycustomer.Supplier")}  </option>
                            <option> {t("mycustomer.Client")}  </option>
                          </select>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <h2 className="head2"> {t("myBusiness.client.client_listings")} </h2>
                  <div className="btn-group">
                    <Link
                      className="btn btn-blue text-uppercase"
                      to="/mycustomers"
                    >
                      {t("myBusiness.client.create")}
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table custom-table">
                      <thead>
                        <tr>
                          {/* <th style={{ width: "50px" }}>
                            {t("account.Serial_No")}
                          </th> */}
                          <th>{t("myBusiness.client.name")}</th>
                          {/* <th>{t("account.last_name")}</th> */}
                          <th>{t("myBusiness.client.phone")}</th>
                          <th>{t("myBusiness.client.email")}</th>
                          <th>{t("myBusiness.client.company")}</th>
                          <th>{t("myBusiness.client.type")}</th>
                          <th>{t("myBusiness.client.termsOfpayment")}</th>
                          {/* <th>{t("mycustomer.days_c")}</th> */}
                          {/* <th>{t("account.status")}</th> */}
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
