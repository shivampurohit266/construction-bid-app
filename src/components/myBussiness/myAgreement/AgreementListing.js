import React, { Component } from 'react';
import axios from 'axios';
import Header from '../../shared/Header';
import BussinessSidebar from '../../shared/BussinessSidebar';
import { Helper, userRole, url } from '../../../helper/helper';
import OfferProposalModal from '../../myBussiness/modals/OfferProposalModal';
import { Link } from 'react-router-dom';
import AgreementProposalModal from '../../myBussiness/modals/AgreementProposalModal';
import { withTranslation } from 'react-i18next';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import moment from 'moment';
import Pagination from '../pagination/pagination';
import Sidebar from '../../shared/Sidebar';
import { getData } from '../../../helper/api';
import { dateFunc } from '../../../helper/dateFunc/date';

class AgreementListing extends Component {
  state = {
    agreements: [],
    changed: false,
    properties: [],
    agreement_id: 0,
    search: null,
    posts: [],
    loading: false,
    currentPage: 1,
    postsPerPage: 10,
    messages: [],
    last_status: 0,
    isAcceptModal: false,
    lng: '',
    Login_user_role: localStorage.getItem('Login_user_role'),
    listing_type: '',
    lang: localStorage.getItem('_lng'),
  };

  componentDidMount = async () => {
    this._isMounted = true;

    this.loadAgreements();
    this.loadDrafts();
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (prevState.changed !== this.state.changed) {
      this.loadAgreements();
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    const lng = localStorage.getItem('_lng');

    if (this.state.lng !== lng) {
      this.setState({ lng: lng });
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  viewProposal = async (...args) => {
    this.setState({
      properties: args,
      agreement_id: args[4],
      isModalOpen: args[5] === 1 ? !this.state.isModalOpen : false,
      isAcceptModal:
        args[5] === 2 || args[5] === 3 || args[5] === 4
          ? !this.state.isAcceptModal
          : false,
    });
  };

  loadAgreements = async () => {
    this.setState({ loading: true });
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/agreement/get-new`, token)
      .then((result) => {
        if (this._isMounted) {
          this.setState({ agreements: result.data, posts: result.data });
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          //console.log("Request canceled", err.message);
        } else {
          //console.log(err.response);
        }
      });
    this.setState({ loading: false });
  };

  handleSubmit = async (...args) => {
    const token = await localStorage.getItem('token');
    await getData(
      `${url}/api/agreement/upd/${args[0]}/${args[1]}/${args[2]}`,
      token
    )
      .then((result) => {
        window.location.reload();
      })
      .catch((err) => {
        //console.log(err.response);
      });
  };

  loadDrafts = async (axiosCancelSource) => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/agreement/get/drafts`, token)
      .then((result) => {
        if (this._isMounted) {
          this.setState({ drafts: result.data });
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

  searchSpace = (event) => {
    this.setState({ search: event.target.value, currentPage: 1 });
  };

  getdate = (date) => {
    let d = moment(date).format('Do-MMMM-YYYY');
    return d;
  };

  paginate = (number) => {
    this.setState({
      currentPage: number,
    });
  };

  handleChange1 = (e) => {
    this.setState({
      postsPerPage: e.target.value,
    });
  };

  updteVlue = (e) => {
    this.setState({
      listing_type: e,
    });
  };

  render() {
    const { t, i18n } = this.props;

    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;

    let agreementsList =
      typeof this.state.agreements !== 'string'
        ? this.state.agreements.filter((data) => {
            if (this.state.search == null) return data;
            else if (
              data.agreement_request_id
                .toString()
                .includes(this.state.search) ||
              data.agreement_names
                .toLowerCase()
                .includes(this.state.search.toLowerCase())
            )
              return data;
          })
        : [];

    const currentPosts = agreementsList?.slice(
      indexOfFirstPost,
      indexOfLastPost
    );
    const length = agreementsList ? agreementsList.length : '0';

    let agreement = currentPosts
      ? currentPosts.map(
          (
            {
              agreement_id,
              agreement_request_id,
              agreement_client_id,
              agreement_client_type,
              agreement_status,
              agreement_client_email,
              sender_isLogged,
              agreement_pdf,
              proposal_client_company,
              agreement_names,
              updated_at,
              agreement_user_id,
              table,
            },
            i
          ) => (
            <tr
              key={agreement_id}
              style={{ background: i % 2 === 0 ? '#f3f3f3' : 'white' }}
            >
              {/* <td style={{ width: "50px" }}> {i + 1}  </td> */}
              <td data-label='AgreeName: '>
                <div className='table-cell'>
                  <p className='table-cell-head'>
                    {t('myBusiness.contract.agree_name')}
                  </p>
                  <p className='table-cell-value'>{agreement_names}</p>
                </div>
              </td>
              <td data-label='Date: '>
                <div className='table-cell'>
                  <p className='table-cell-head'>
                    {t('myBusiness.contract.Date')}
                  </p>
                  <p className='table-cell-value'>
                    {dateFunc(updated_at, this.state.lang)}
                  </p>
                </div>
              </td>
              {/* <td data-label='Type: '> {agreement_client_type}</td>
              <td data-label='Email: '> {agreement_client_email}</td> */}
              <td data-label='Status: '>
                <div className='table-cell'>
                  <p className='table-cell-head'>
                    {t('myBusiness.contract.status')}
                  </p>
                  <p className='table-cell-value'>
                    {agreement_status === 0
                      ? `${t('myBusiness.contract.Draft')}`
                      : agreement_status === 1
                      ? `${t('myBusiness.contract.Send')}`
                      : agreement_status === 2
                      ? `${t('myBusiness.contract.Accepted')}`
                      : agreement_status === 3
                      ? `${t('myBusiness.contract.Declined')}`
                      : agreement_status === 4
                      ? `${t('myBusiness.contract.Revision')}`
                      : null}
                  </p>
                </div>
              </td>

              <td data-label='Action: '>
                <div className='table-cell'>
                  <p className='table-cell-head'>
                    {t('myBusiness.contract.action')}
                  </p>
                  <p className='table-cell-value'>
                    <button
                      onClick={(e) =>
                        window.open(
                          `${url}/images/marketplace/agreement/pdf/${agreement_pdf}`,
                          '_blank'
                        )
                      }
                      type='button'
                      className='btn btn-outline-dark revv-btn'
                      style={{ marginRight: '20px' }}
                    >
                      <i
                        className='fa fa-download fa-1x'
                        aria-hidden='true'
                      ></i>{' '}
                      &nbsp;&nbsp;
                      <i className='fa fa-print fa-1x	' aria-hidden='true'></i>
                    </button>
                    {sender_isLogged ? (
                      <div
                        style={{
                          display: 'flex',
                        }}
                      >
                        {agreement_status === 4 ? (
                          <div
                            style={{
                              display: 'flex',
                            }}
                          >
                            <Link
                              to={{
                                pathname: `/business-agreement-create/${agreement_request_id}/${agreement_client_id}/update`,
                              }}
                              type='button'
                              className='btn btn-outline-dark mt-3'
                              style={{ marginRight: '20px' }}
                            >
                              {t('myBusiness.contract.Edit')}
                            </Link>
                            <button
                              onClick={() =>
                                this.viewProposal(
                                  agreement_user_id,
                                  agreement_id,
                                  agreement_client_id,
                                  table,
                                  agreement_id,
                                  3
                                )
                              }
                              data-toggle='modal'
                              data-target='#agreement-proposal'
                              type='button'
                              className='btn btn-outline-danger mt-3'
                              style={{ marginRight: '20px' }}
                            >
                              {t('myBusiness.contract.Decline')}
                            </button>
                          </div>
                        ) : null}
                        {/* {agreement_status !== 2 ? (
                          <button
                            onClick={() =>
                              this.viewProposal(
                                agreement_user_id,
                                agreement_id,
                                agreement_client_id,
                                table,
                                agreement_id,
                                4
                              )
                            }
                            data-toggle="modal"
                            data-target="#agreement-proposal"
                            type="button"
                            className="btn btn-outline-primary mt-3 mr-4"
                          >
                            {t("myagreement.View_notes")}
                          </button>
                        ) : null} */}

                        {agreement_client_type === 'resource' &&
                        agreement_status === 1 ? (
                          <React.Fragment>
                            {agreement_user_id !==
                            localStorage.getItem('Login_user_id') ? (
                              <>
                                <button
                                  onClick={() =>
                                    this.viewProposal(
                                      agreement_user_id,
                                      agreement_id,
                                      agreement_client_id,
                                      table,
                                      agreement_id,
                                      2,
                                      'resource'
                                    )
                                  }
                                  className='btn btn-outline-dark mt-3 mr-4'
                                  data-toggle='modal'
                                  data-target='#agreement-proposal'
                                  type='button'
                                >
                                  {t('myBusiness.contract.Accept')}
                                </button>
                                <button
                                  onClick={() =>
                                    this.viewProposal(
                                      agreement_user_id,
                                      agreement_id,
                                      agreement_client_id,
                                      table,
                                      agreement_id,
                                      3,
                                      'resource'
                                    )
                                  }
                                  className='btn btn-outline-dark mt-3 mr-4'
                                  data-toggle='modal'
                                  data-target='#agreement-proposal'
                                  type='button'
                                >
                                  {t('myBusiness.contract.Decline')}
                                </button>

                                <Link
                                  to={{
                                    pathname: `/business-agreement-create/${agreement_request_id}/${agreement_client_id}/update`,
                                  }}
                                  type='button'
                                  className='btn btn-outline-dark mt-3 mr-4'
                                  style={{ marginRight: '20px' }}
                                >
                                  {t('myBusiness.contract.Revise')}
                                </Link>
                              </>
                            ) : (
                              ''
                            )}
                          </React.Fragment>
                        ) : null}
                      </div>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                        }}
                      >
                        {agreement_status === 1 ? (
                          <div>
                            {agreement_user_id !==
                            localStorage.getItem('Login_user_id') ? (
                              <>
                                <button
                                  type='button'
                                  onClick={() =>
                                    this.viewProposal(
                                      agreement_user_id,
                                      agreement_id,
                                      agreement_client_id,
                                      table,
                                      agreement_id,
                                      2
                                    )
                                  }
                                  data-toggle='modal'
                                  data-target='#agreement-proposal'
                                  className='btn btn-outline-success mt-3'
                                  style={{ marginRight: '20px' }}
                                >
                                  {t('myBusiness.contract.Accept')}
                                </button>
                                <button
                                  type='button'
                                  onClick={() =>
                                    this.viewProposal(
                                      agreement_user_id,
                                      agreement_id,
                                      agreement_client_id,
                                      table,
                                      agreement_id,
                                      3
                                    )
                                  }
                                  data-toggle='modal'
                                  data-target='#agreement-proposal'
                                  className='btn btn-outline-danger mt-3'
                                  style={{ marginRight: '20px' }}
                                >
                                  {t('myBusiness.contract.Decline')}
                                </button>
                              </>
                            ) : (
                              ''
                            )}
                            <button
                              onClick={() =>
                                this.viewProposal(
                                  agreement_user_id,
                                  agreement_id,
                                  agreement_client_id,
                                  table,
                                  agreement_id,
                                  4
                                )
                              }
                              data-toggle='modal'
                              data-target='#agreement-proposal'
                              type='button'
                              className='btn btn-outline-dark mt-3'
                            >
                              {t('myBusiness.contract.Revise')}
                            </button>
                          </div>
                        ) : null}
                        {agreement_status === 1 ? <></> : null}

                        {/* <AgreementProposalModal
                          propsObj={this.state.properties}
                          show={this.state.isAcceptModal}
                          handleClose={() =>
                            this.setState({ isAcceptModal: false })
                          }
                          proposal_id={this.state.agreement_id}
                          table={"pro_agreement"}
                          loadAgreements={this.loadAgreements}
                        /> */}
                      </div>
                    )}
                  </p>
                </div>
              </td>
              <td>
                <div className='table-cell'>
                  <p className='table-cell-head'></p>
                  <p className='table-cell-value'>
                    <button
                      onClick={() =>
                        this.viewProposal(
                          agreement_user_id,
                          agreement_id,
                          agreement_client_id,
                          table,
                          agreement_id,
                          1
                        )
                      }
                      type='button'
                      className='btn btn-outline-dark revv-btn'
                      style={{ margin: '1rem' }}
                    >
                      {t('myBusiness.contract.message')}
                    </button>
                  </p>
                </div>
              </td>
            </tr>
          )
        )
      : [];
    console.log(agreement);
    const filter_draft =
      typeof this.state.drafts !== 'string'
        ? this.state.drafts?.filter((val) => {
            if (this.state.search == null) return val;
            else if (
              val.agreement_request_id.toString().includes(this.state.search) ||
              val.agreement_names
                .toLowerCase()
                .includes(this.state.search.toLowerCase())
            )
              return val;
          })
        : [];

    // draft
    const currentPosts1 = filter_draft?.slice(
      indexOfFirstPost,
      indexOfLastPost
    );
    const length1 = filter_draft ? filter_draft.length : '0';
    //

    const agreement_draft = currentPosts1?.map((x, i) => (
      <tr key={i} style={{ background: i % 2 === 0 ? '#f3f3f3' : 'white' }}>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>
              {t('myBusiness.contract.Serial_No')}
            </p>
            <p className='table-cell-value'>{i + 1}</p>
          </div>
          {/* <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`check2${x.agreement_id}`}
              />
              <label
                className="form-check-label"
                htmlFor={`check2${x.agreement_id}`}
              ></label>
            </div> */}
        </td>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>
              {t('myBusiness.contract.agree_name')}
            </p>
            <p className='table-cell-value'>{x.agreement_names}</p>
          </div>
        </td>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>
              {t('myBusiness.contract.prop_company_email')}
            </p>
            <p className='table-cell-value'>{x.agreement_client_type}</p>
          </div>
        </td>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>{t('myBusiness.contract.Date')}</p>
            <p className='table-cell-value'>
              {dateFunc(x.updated_at, this.state.lang)}
            </p>
          </div>
        </td>
        <td data-label='Status: '>
          <div className='table-cell'>
            <p className='table-cell-head'>{t('myBusiness.contract.status')}</p>
            <p className='table-cell-value'>
              {x.agreement_status === 0
                ? `${t('myBusiness.contract.Draft')}`
                : x.agreement_status === 1
                ? `${t('myBusiness.contract.Send')}`
                : x.agreement_status === 2
                ? `${t('myBusiness.contract.Accepted')}`
                : x.agreement_status === 3
                ? `${t('myBusiness.contract.Declined')}`
                : x.agreement_status === 4
                ? `${t('myBusiness.contract.Revision')}`
                : null}
            </p>
          </div>
        </td>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>{t('myBusiness.contract.action')}</p>
            <p className='table-cell-value'>
              <Link
                className='btn btn-blue'
                to={{
                  pathname: `/business-agreement-create/${x.agreement_request_id}/${x.agreement_client_id}/update`,
                  state: {
                    proposal_request_id: this.state.proposal_request_id,
                  },
                }}
              >
                {t('myBusiness.contract.Update_Agreement')}
              </Link>
            </p>
          </div>
        </td>
      </tr>
    ));

    return (
      <div>
        {/* <Header active={"bussiness"} /> */}
        <div className='sidebar-toggle'></div>
        <nav aria-label='breadcrumb'>
          <ol className='breadcrumb'>
            <Link
              to='/business-dashboard'
              className='breadcrumb-item active'
              aria-current='page'
            >
              {t('myBusiness.contract.heading')}
            </Link>
            <li className='breadcrumb-item active' aria-current='page'>
              {t('myBusiness.contract.agreement')}
            </li>
          </ol>
        </nav>
        <div className='main-content'>
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className='page-content'>
            <div className='container-fluid'>
              <h3 className='head3'>{t('myBusiness.contract.Search_title')}</h3>
              {/* <div className="card">
                <div className="card-body">
                  <div className="filter">
                    <div className="row align-items-center">
                      <div className="col-lg-4 col-md-6">
                        <div className="form-group">
                          <label htmlFor="name">
                            {t("myBusiness.contract.agreement_req_id")}
                          </label>
                          <input
                            id="name"
                            type="text"
                            className="form-control"
                            onChange={this.searchSpace}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

              <Tabs>
                <div className='card'>
                  <div className='card custome_tabs_agre'>
                    <div className='row'>
                      <div className='col-sm-4'>
                        <TabList>
                          <Tab onClick={(e) => this.updteVlue('listing')}>
                            {' '}
                            {t('myBusiness.contract.title')}
                          </Tab>
                          {this.state.Login_user_role !== 'consumer' && (
                            <Tab onClick={(e) => this.updteVlue('draft')}>
                              {' '}
                              {t('myBusiness.contract.Draft')}
                            </Tab>
                          )}
                        </TabList>
                      </div>
                      <div className='col-sm-8'>
                        <div className='filter'>
                          <div className='row align-items-center'>
                            <div className='col-lg-4 col-md-6'>
                              <div className='form-group'>
                                <label htmlFor='name'>
                                  {t('myBusiness.contract.agreement_req_id')}
                                </label>
                                <input
                                  id='name'
                                  type='search'
                                  className='form-control'
                                  onChange={this.searchSpace}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <TabPanel>
                  <div className='card'>
                    <div className='card-header'>
                      <h2 className='head2'>
                        {t('myBusiness.contract.title')}
                      </h2>
                      {userRole !== 'consumer' ? (
                        <div className='btn-group'>
                          <Link
                            className='btn btn-blue text-uppercase'
                            to='/myagreement'
                          >
                            {t('myBusiness.contract.create')}
                          </Link>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className='card-body'>
                      <div className='table-responsive'>
                        <table className='table custom-table'>
                          <thead>
                            <tr>
                              {/* <th style={{ width: "50px" }}>
                                {t("account.Serial_No")}
                              </th> */}

                              <th>{t('myBusiness.contract.agree_name')}</th>
                              <th>{t('myBusiness.contract.Date')}</th>
                              {/* <th>
                                {t('c_material_list.listing.prop_company')}
                              </th>
                              <th>{t('account.email')}</th> */}

                              <th>{t('myBusiness.contract.status')}</th>
                              {/* <th>{t('myBusiness.contract.Message')}</th> */}
                              <th>{t('myBusiness.contract.action')}</th>
                            </tr>
                          </thead>
                          <tbody>{agreement}</tbody>
                        </table>

                        {length > 10 ? (
                          <div className='row' style={{ width: '100%' }}>
                            {/* <div className="col-md-4" >
                              <h3 className="total_rec"> Total {length}  </h3>
                            </div> */}
                            <div className='col-md-6'>
                              <h3 className='total_rec'> Show once </h3>
                              <select
                                id='dropdown_custom'
                                onChange={this.handleChange1}
                              >
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
                                totalPosts={length}
                                paginate={this.paginate}
                                currentPage={this.state.currentPage}
                              />
                            </div>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className='card'>
                    <div className='card-header'>
                      <h2 className='head2'>
                        {t('myBusiness.contract.Draft')}
                      </h2>
                      {userRole !== 'consumer' &&
                      this.state.listing_type !== 'draft' ? (
                        <div className='btn-group'>
                          <Link
                            className='btn btn-blue text-uppercase'
                            to='/myagreement'
                          >
                            {t('myBusiness.contract.create')}
                          </Link>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className='card-body'>
                      <div className='table-responsive'>
                        <table className='table custom-table'>
                          <thead>
                            <tr>
                              <th width='6%'>
                                {t('myBusiness.contract.Serial_No')}
                              </th>

                              <th>{t('myBusiness.contract.agree_name')}</th>
                              <th>
                                {t('myBusiness.contract.prop_company_email')}
                              </th>
                              <th>{t('myBusiness.contract.Date')}</th>
                              <th>{t('myBusiness.contract.status')}</th>
                              <th>{t('myBusiness.contract.action')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {agreement_draft}
                            {/* {typeof currentPosts1 !== "string" ? currentPosts1?.filter((val) => {
                              if (this.state.search == null) return val;
                              else if (
                                val.agreement_request_id
                                  .toString()
                                  .includes(this.state.search) ||
                                val.agreement_names
                                  .toLowerCase()
                                  .includes(this.state.search.toLowerCase())
                              ) return val;
                            }).map((x, i) => (
                              <tr key={i}  style={{ background : i % 2 === 0 ? '#f3f3f3' : 'white' }}>
                                < td style={{ width: "50px" }}>
                                {i + 1}
                                  <div className="form-check">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id={`check2${x.agreement_id}`}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={`check2${x.agreement_id}`}
                                    ></label>
                                  </div>
                                </td>
                                <td> {x.agreement_names} </td>
                                <td>{x.agreement_client_type}</td>
                                <td> {this.getdate(x.updated_at)} </td>
                                <td data-label="Status: ">
                                  {x.agreement_status === 0
                                    ? `${t("myBusiness.contract.Draft")}`
                                    : x.agreement_status === 1
                                      ? `${t("myproposal.Send")}`
                                      : x.agreement_status === 2
                                        ? `${t("myproposal.Accepted")}`
                                        : x.agreement_status === 3
                                          ? `${t("myproposal.Declined")}`
                                          : x.agreement_status === 4
                                            ? `${t("myproposal.Revision")}`
                                            : null}
                                </td>
                                <td> <Link
                                  className="btn btn-blue"
                                  to={{
                                    pathname: `/business-agreement-create/${x.agreement_request_id}/${x.agreement_client_id}/update`,
                                    state: {
                                      proposal_request_id: this.state.proposal_request_id,
                                    }
                                  }}
                                >
                                  {t("myagreement.Update_Agreement")}
                                </Link></td>
                              </tr>
                            ))

                              : " "} */}
                          </tbody>
                        </table>
                        {length1 > 10 ? (
                          <div className='row' style={{ width: '100%' }}>
                            {/* <div className="col-md-4">
                              <h3 className="total_rec"> Total {length1}  </h3>
                            </div> */}
                            <div className='col-md-6'>
                              <h3 className='total_rec'> Show once </h3>
                              <select
                                id='dropdown_custom'
                                onChange={this.handleChange1}
                              >
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
                                totalPosts={length1}
                                paginate={this.paginate}
                                currentPage={this.state.currentPage}
                              />
                            </div>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
        <OfferProposalModal
          propsObj={this.state.properties}
          proposal_id={this.state.agreement_id}
          table={'pro_agreement'}
          show={this.state.isModalOpen}
          handleClose={() => this.setState({ isModalOpen: false })}
          loadOffers={this.loadAgreements}
        />
        <AgreementProposalModal
          propsObj={this.state.properties}
          show={this.state.isAcceptModal}
          handleClose={() => this.setState({ isAcceptModal: false })}
          proposal_id={this.state.agreement_id}
          table={'pro_agreement'}
          loadAgreements={this.loadAgreements}
        />
      </div>
    );
  }
}

export default withTranslation()(AgreementListing);
