import React, { useState, useEffect, Component } from 'react';
import axios from 'axios';

import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import AgreementProposalModal from '../../../myBussiness/modals/AgreementProposalModal';
import OfferProposalModal from '../../../myBussiness/modals/OfferProposalModal';
import Spinner from 'react-bootstrap/Spinner';
import { useLocation } from 'react-router-dom';
import Pagination from '../../../myBussiness/pagination/pagination';
import './proposal.css';
import { relativeTimeRounding } from 'moment';
import { getData } from '../../../../helper/api';
import Header from '../../../shared/Header';
import BussinessSidebar from '../../../shared/BussinessSidebar';
import { Helper, url, userRole, web_url } from '../../../../helper/helper';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import moment from 'moment';
import { dateFunc } from '../../../../helper/dateFunc/date';

class Proposal extends Component {
  state = {
    proposals: [],
    changed: false,
    properties: [],
    proposal_id: 0,
    search: null,
    loading: false,
    currentPage: 1,
    postsPerPage: 10,
    messages: [],
    last_status: 0,
    isModalOpen: false,
    isAcceptModal: false,
    userId: localStorage.getItem('user_id'),
    lng: '',
    notif: [],
    count: [],
    unread: 0,
    lang: localStorage.getItem('_lng'),
  };

  componentDidMount = async () => {
    this._isMounted = true;
    this.loadProposals();
    this.loadDrafts();
    this.loadNotif();
    // this.loadUnreadNotif();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.changed !== this.state.changed) {
      this.loadProposals();
    }
  };
  componentDidUpdate = (prevProps, prevState) => {
    const lng = localStorage.getItem('_lng');

    if (this.state.lng !== lng) {
      this.setState({ lng: lng });
    }
    if (prevState.unread !== this.state.unread) {
      this.loadNotif();
    }
  };
  componentWillUnmount() {
    this._isMounted = false;
  }

  loadNotif = async () => {
    const token = localStorage.getItem('token');
    await getData(`${url}/api/getBidsNotif`, token)
      .then((response) => {
        console.log(response);
        this.setState({
          notif: response.data.data.filter(
            (res) => res.notification_type === 'proposal_message'
          ),
          count: response.data.data
            // .filter((res) => res.notification_type === 'proposal_message')
            .map((res) => res.notification_bid_id),
        });
      })
      .catch((err) => {
        if (err?.response?.status >= 400 && err?.response?.status <= 499) {
          localStorage.clear();
          console.log(err);
        }
        if (axios.isCancel(err)) {
        }
      });
  };

  loadUnreadNotif = async () => {
    const token = localStorage.getItem('token');
    await getData(`${url}/api/notification/unread`, token)
      .then((response) => {
        this.setState({
          unread: response.data.data,
        });
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
        }
      });
  };

  readNotif = async (args) => {
    const token = localStorage.getItem('token');
    await getData(
      `${url}/api/notification/read_messages/${args[0]}/${args[1]}/${args[2]}`,

      token
    )
      .then((res) => {
        console.log(res);
        this.loadNotif();
      })
      .catch(() => {});
  };

  viewProposal = async (...args) => {
    this.setState({
      properties: args,
      proposal_id: args[4],
      isModalOpen: args[5] === 1 ? !this.state.isModalOpen : false,
      isAcceptModal:
        args[5] === 2 || args[5] === 3 || args[5] === 4
          ? !this.state.isAcceptModal
          : false,
    });
    localStorage.setItem('user_id', args[0]);
  };

  handleSubmit = async (...args) => {
    const token = await localStorage.getItem('token');
    await getData(
      `${url}/api/proposal/upd/${args[0]}/${args[1]}/${args[2]}`,
      token
    )
      .then((result) => {
        // this.loadProposals();
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  loadProposals = async () => {
    const token = await localStorage.getItem('token');
    const result = await getData(`${url}/api/proposal/get-new`, token);

    if (this._isMounted) {
      this.setState({ proposals: result.data });
    }
  };

  searchSpace = (event) => {
    this.setState({ search: event.target.value, currentPage: 1 });
  };

  loadDrafts = async () => {
    const token = await localStorage.getItem('token');

    await getData(`${url}/api/proposal/get/drafts`, token)
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

  updteVlue = () => {
    this.setState({
      postsPerPage: 10,
    });
  };

  render() {
    const { t, i18n } = this.props;

    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;

    let proposalsList =
      typeof this.state.proposals !== 'string'
        ? this.state.proposals?.filter((data) => {
            if (this.state.search == null) return data;
            else if (
              data.proposal_request_id.toString().includes(this.state.search) ||
              data.proposal_names
                .toLowerCase()
                .includes(this.state.search.toLowerCase()) ||
              data.proposal_client_company
                .toLowerCase()
                .includes(this.state.search.toLowerCase())
            )
              return data;
          })
        : [];
    const currentPosts = proposalsList?.slice(
      indexOfFirstPost,
      indexOfLastPost
    );
    const length = proposalsList ? proposalsList.length : '0';
    console.log(this.state.notif, this.state.count);
    const proposal = currentPosts?.map((data, i) => {
      // const found =
      //   this.state.notif &&
      //   this.state.notif?.find(
      //     (notif) => notif.notification_sender_id === data?.proposal_client_id
      //   );

      // const {
      //   notification_sender_id,
      //   notification_bid_id,
      //   notification_id,
      //   notification_user_id,
      //   sender_isLogged,
      // } = found || {};
      console.log(
        data,
        this.state.count.filter((x) => x === data?.proposal_client_id).length
      );
      return (
        <tr
          key={data.proposal_id}
          style={{ background: i % 2 === 0 ? '#f3f3f3' : 'white' }}
        >
          {/* <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={`check2${data.proposal_id}`}
            />
            <label
              className="form-check-label"
              htmlFor={`check2${data.proposal_id}`}
            ></label>
          </div> */}
          {/* {this.state.currentPage === 2 ? this.state.postsPerPage + i + 1 : i + 1} */}
          {/* <td style={{ width: "50px" }}>

          {i + 1}
        </td> */}
          {/* <td data-label="Request ID: ">{proposal_request_id}</td> */}
          <td data-label='PropName: '>
            <div className='table-cell'>
              <p className='table-cell-head'>{t('myproposal.prop_name')}</p>
              <p className='table-cell-value'>{data.proposal_names}</p>
            </div>
          </td>
          <td data-label='Date: '>
            <div className='table-cell'>
              <p className='table-cell-head'>{t('myproposal.date')}</p>
              <p className='table-cell-value'>
                {dateFunc(data.updated_at, this.state.lang)}
              </p>
            </div>
          </td>
          {/* <td data-label='Type: '>{data.proposal_client_company}</td>
        <td data-label='Email: '>{data.proposal_client_email}</td> */}
          {/* <td data-label="Message: ">{notification_message}</td> */}
          <td data-label='Status: '>
            <div className='table-cell'>
              <p className='table-cell-head'>{t('account.status')}</p>
              <p className='table-cell-value'>
                {data.proposal_status === 0
                  ? `${t('myproposal.Draft')}`
                  : data.proposal_status === 1
                  ? `${t('myproposal.Send1')}`
                  : data.proposal_status === 2
                  ? `${t('myproposal.Accepted')}`
                  : data.proposal_status === 3
                  ? `${t('myproposal.Declined')}`
                  : data.proposal_status === 4
                  ? `${t('myproposal.Revision')}`
                  : data.proposal_status === 5
                  ? `${t('myproposal.Accepted')}`
                  : null}
              </p>
            </div>
          </td>

          <td data-label='Action: ' style={{ whiteSpace: 'nowrap' }}>
            <div className='table-cell'>
              <p className='table-cell-head'>{t('myproposal.action')}</p>
              <p className='table-cell-value'>
                <div
                  className='actn-btn'
                  style={{
                    display: 'flex',
                  }}
                >
                  <button
                    onClick={(e) =>
                      window.open(
                        `${url}/images/marketplace/proposal/pdf/${data.proposal_pdf}`,
                        '_blank'
                      )
                    }
                    type='button'
                    className='btn btn-outline-dark mt-3 pdf-bt'
                    style={{ marginRight: '20px' }}
                  >
                    <i className='fa fa-download fa-2x' aria-hidden='true'></i>{' '}
                    &nbsp;&nbsp;
                    <i className='fa fa-print fa-2x	' aria-hidden='true'></i>
                  </button>
                </div>
                {data.sender_isLogged ? (
                  <div
                    className='actn-btn'
                    style={{
                      display: 'flex',
                    }}
                  >
                    {data.proposal_status === 4 ? (
                      // data?.proposal_user_id === localStorage.getItem("Login_user_id") ?
                      <div>
                        <Link
                          to={{
                            pathname: `/business-proposal-create/${data.proposal_request_id}/${data.proposal_client_id}/update`,
                          }}
                          type='button'
                          className='btn btn-outline-dark mt-3'
                          style={{ marginRight: '20px' }}
                        >
                          {t('myproposal.Edit')}
                        </Link>
                        <button
                          onClick={() =>
                            this.viewProposal(
                              data?.proposal_user_id,
                              data?.proposal_id,
                              data?.proposal_client_id,
                              data?.table,
                              data?.proposal_id,
                              3
                            )
                          }
                          data-toggle='modal'
                          data-target='#agreement-proposal'
                          type='button'
                          className='btn btn-outline-danger mt-3'
                          style={{ marginRight: '20px' }}
                        >
                          {t('myproposal.Decline')}
                        </button>
                      </div>
                    ) : // :""
                    null}
                    {/* {data?.proposal_user_id === localStorage.getItem("Login_user_id") ?
                  <> */}
                    {/* {data.proposal_status !== 2 ? (
                    <button
                      onClick={() =>
                        this.viewProposal(
                          data?.proposal_user_id,
                          data?.proposal_id,
                          data?.proposal_client_id,
                          data?.table,
                          data?.proposal_id,
                          4
                        )
                      }
                      data-toggle="modal"
                      data-target="#agreement-proposal"
                      type="button"
                      className="btn btn-outline-primary mt-3 mr-4"
                    >
                      {t("myproposal.View_notes")}
                    </button>
                  ) : null} */}

                    <div className='mt-3 mr-4'>
                      {data.proposal_status === 2 &&
                      data.proposal_status !== 5 ? (
                        <div>
                          <Link
                            to={{
                              pathname: `/business-agreement-create/${data.proposal_id}/${data.proposal_client_id}`,
                              state: {
                                data: data.proposal_names,
                              },
                            }}
                            className='btn btn-outline-primary mt-0 mr-5'
                          >
                            {' '}
                            {t('myproposal.Submit_agreement')}
                          </Link>
                        </div>
                      ) : (
                        ' '
                      )}
                    </div>
                    {/* </>
                  :""} */}
                    {/* {data.proposal_client_type} */}
                    {data.proposal_client_type === 'resource' &&
                    data.proposal_status === 1 ? (
                      <React.Fragment>
                        {data?.proposal_user_id ===
                        localStorage.getItem('Login_user_id') ? (
                          <>
                            <button
                              onClick={() =>
                                this.viewProposal(
                                  data?.proposal_user_id,
                                  data?.proposal_id,
                                  data?.proposal_client_id,
                                  data?.table,
                                  data?.proposal_id,
                                  2,
                                  'resource'
                                )
                              }
                              className='btn btn-outline-dark mt-3 mr-4'
                              data-toggle='modal'
                              data-target='#agreement-proposal'
                              type='button'
                            >
                              {t('myproposal.Accept')}
                            </button>
                            <button
                              onClick={() =>
                                this.viewProposal(
                                  data?.proposal_user_id,
                                  data?.proposal_id,
                                  data?.proposal_client_id,
                                  data?.table,
                                  data?.proposal_id,
                                  3,
                                  'resource'
                                )
                              }
                              className='btn btn-outline-dark mt-3 mr-4'
                              data-toggle='modal'
                              data-target='#agreement-proposal'
                              type='button'
                            >
                              {t('myproposal.Decline')}
                            </button>
                          </>
                        ) : (
                          ''
                        )}

                        <Link
                          to={{
                            pathname: `/business-proposal-create/${data.proposal_request_id}/${data.proposal_client_id}/update`,
                          }}
                          type='button'
                          className='btn btn-outline-dark mt-3 mr-4 rev-btn'
                          style={{ marginRight: '20px' }}
                        >
                          {t('myproposal.Revise')}
                        </Link>
                      </React.Fragment>
                    ) : null}
                    {/* <AgreementProposalModal
                    propsObj={this.state.properties}
                    show={this.state.isAcceptModal}
                    handleClose={() => this.setState({ isAcceptModal: false })}
                    proposal_id={this.state.proposal_id}
                    table={"pro_proposal"}
                    //page_url={this.props.match.url}
                    loadAgreements={this.loadProposals}
                  /> */}
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                    }}
                  >
                    {data.proposal_status === 1 ? (
                      <div>
                        {data?.proposal_user_id !==
                        localStorage.getItem('Login_user_id') ? (
                          <>
                            <button
                              type='button'
                              onClick={() =>
                                this.viewProposal(
                                  data?.proposal_user_id,
                                  data?.proposal_id,
                                  data?.proposal_client_id,
                                  data?.table,
                                  data?.proposal_id != null
                                    ? data?.proposal_id
                                    : '',
                                  2
                                )
                              }
                              data-toggle='modal'
                              data-target='#agreement-proposal'
                              className='btn btn-outline-success mt-3'
                              style={{ marginRight: '20px' }}
                            >
                              {t('myproposal.Accept')}
                            </button>
                            <button
                              type='button'
                              onClick={() =>
                                this.viewProposal(
                                  data?.proposal_user_id,
                                  data?.proposal_id,
                                  data?.proposal_client_id,
                                  data?.table,
                                  data?.proposal_id != null
                                    ? data?.proposal_id
                                    : '',
                                  3
                                )
                              }
                              data-toggle='modal'
                              data-target='#agreement-proposal'
                              className='btn btn-outline-danger mt-3'
                              style={{ marginRight: '20px' }}
                            >
                              {t('myproposal.Decline')}
                            </button>
                          </>
                        ) : (
                          ''
                        )}
                      </div>
                    ) : null}
                    {data?.proposal_status === 1 ? (
                      <button
                        onClick={() =>
                          this.viewProposal(
                            data?.proposal_user_id,
                            data?.proposal_id,
                            data?.proposal_client_id,
                            data?.table,
                            data?.proposal_id != null ? data?.proposal_id : '',
                            4
                          )
                        }
                        data-toggle='modal'
                        data-target='#agreement-proposal'
                        type='button'
                        className='btn btn-outline-dark mt-3 revv-btn'
                      >
                        {t('myproposal.Revise')}
                      </button>
                    ) : null}
                    <br />
                  </div>
                )}
              </p>
            </div>
          </td>
          <td>
            <button
              onClick={() => {
                this.viewProposal(
                  data?.proposal_user_id,
                  data?.proposal_id,
                  data?.proposal_client_id,
                  data?.table,
                  data?.proposal_id,
                  1
                );
                this.readNotif(
                  this.state.notif?.find(
                    (notif) =>
                      notif.notification_sender_id === data?.proposal_user_id &&
                      notif.notification_bid_id === data?.proposal_id
                  )?.notification_sender_id === data?.proposal_user_id
                    ? [
                        'proposal_message',
                        data?.proposal_user_id,
                        data?.proposal_id,
                      ]
                    : this.state.notif?.find(
                        (notif) =>
                          notif.notification_sender_id ===
                            data?.proposal_client_id &&
                          notif.notification_bid_id === data?.proposal_id &&
                          notif.sender_isLogged === data?.sender_isLogged
                      )?.notification_sender_id === data?.proposal_client_id
                    ? [
                        'proposal_message',
                        data?.proposal_client_id,
                        data?.proposal_id,
                      ]
                    : ''
                );
              }}
              data-toggle='modal'
              data-target='#offer-contracts'
              type='button'
              className={
                this.state.notif?.find(
                  (notif) =>
                    notif.notification_sender_id === data?.proposal_user_id &&
                    notif.notification_bid_id === data?.proposal_id
                )?.notification_sender_id === data?.proposal_user_id
                  ? 'btn btn-outline-success revv-btn notification-badges'
                  : this.state.notif?.find(
                      (notif) =>
                        notif.notification_sender_id ===
                          data?.proposal_client_id &&
                        notif.notification_bid_id === data?.proposal_id &&
                        notif.sender_isLogged === data?.sender_isLogged
                    )?.notification_sender_id === data?.proposal_client_id
                  ? 'btn btn-outline-success revv-btn notification-badges'
                  : 'btn btn-outline-dark revv-btn'
              }
              style={{ margin: '1rem' }}
            >
              {t('myproposal.message')}
              <li
                data-badge={
                  this.state.count.filter((x) => x === data?.proposal_id).length
                }
              ></li>
            </button>
          </td>
        </tr>
      );
    });

    let proposalsList1 =
      typeof this.state.drafts !== 'string'
        ? this.state.drafts?.filter((val) => {
            if (this.state.search == null) return val;
            else if (
              val.proposal_request_id.toString().includes(this.state.search) ||
              val.proposal_names
                .toLowerCase()
                .includes(this.state.search.toLowerCase())
            )
              return val;
          })
        : [];

    const currentPosts1 = proposalsList1?.slice(
      indexOfFirstPost,
      indexOfLastPost
    );
    const length1 = proposalsList1 ? proposalsList1.length : '0';

    const draft_map = currentPosts1?.map((x, i) => (
      <tr key={i} style={{ background: i % 2 === 0 ? '#f3f3f3' : 'white' }}>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>{t('account.Serial_No')}</p>
            <p className='table-cell-value'>{i + 1}</p>
          </div>
        </td>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>{t('myproposal.prop_name')}</p>
            <p className='table-cell-value'>{x.proposal_names} </p>
          </div>
        </td>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>
              {t('c_material_list.listing.prop_company')}
            </p>
            <p className='table-cell-value'>{x.proposal_client_type} </p>
          </div>
        </td>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>{t('account.date')}</p>
            <p className='table-cell-value'> {this.getdate(x.updated_at)}</p>
          </div>
        </td>
        <td data-label='Status: '>
          <div className='table-cell'>
            <p className='table-cell-head'>{t('account.status')}</p>
            <p className='table-cell-value'>
              {' '}
              {x.proposal_status === 0
                ? 'Draft'
                : x.proposal_status === 1
                ? 'Send'
                : x.proposal_status === 2
                ? 'Accepted'
                : x.proposal_status === 3
                ? 'Declined'
                : x.proposal_status === 4
                ? 'Revision'
                : null}
            </p>
          </div>
        </td>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>Action</p>
            <p className='table-cell-value'>
              <Link
                className='btn btn-blue'
                to={{
                  pathname: `/business-proposal-create/${x.proposal_request_id}/${x.proposal_client_id}/update`,

                  state: {
                    data: this.state.user_title,
                  },
                }}
              >
                {t('myproposal.Edit_Proposal')}
              </Link>
            </p>
          </div>
        </td>
      </tr>
    ));
    //

    return (
      <>
        <Tabs>
          <div className='card'>
            <div className='card-body'>
              <h3 className='head3'>{t('myagreement.searchFilters')}</h3>

              <div className='row'>
                <div className='col-sm-4'>
                  <TabList>
                    <Tab onClick={(e) => this.updteVlue()}>
                      {' '}
                      {t(
                        'marketplace.work.manage_work.listing.prop_listings'
                      )}{' '}
                    </Tab>
                    <Tab onClick={(e) => this.updteVlue()}>
                      {' '}
                      {t('marketplace.work.manage_work.listing.Draft')}{' '}
                    </Tab>
                  </TabList>
                </div>

                <div className='col-sm-8'>
                  <div className='filter'>
                    <div className='row align-items-center'>
                      {/* <div className="col-lg-4 col-md-6"> */}
                      <div className='col-sm-6 form-group '>
                        <label htmlFor='name'>
                          {t('myproposal.prop_req_id')}
                        </label>
                        <input
                          id='name'
                          type='search'
                          className='form-control'
                          onChange={this.searchSpace}
                        />
                      </div>
                      {/* </div> */}
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
                  {t('marketplace.work.manage_work.listing.prop_listings')}
                </h2>
                {userRole !== 'consumer' ? (
                  <div className='btn-group'>
                    <Link
                      className='btn btn-blue text-uppercase'
                      to='/myproposal'
                    >
                      {t('myBusiness.offer.create')}
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
                        {/* <input
                                type="checkbox"
                                className="form-check-input"
                                id="check1"
                                />
                                <label
                                className="form-check-label"
                                htmlFor="check1"
                              ></label> */}
                        {/* <th style={{ width: "50px" }}>
                              <div className="form-check">
                              {t("account.Serial_No")}
                            </div>
                          </th> */}
                        <th>{t('myproposal.prop_name')}</th>
                        <th>{t('myproposal.date')}</th>
                        {/* <th>
                            {t('c_material_list.listing.prop_company')}
                          </th>
                          <th>{t('account.email')}</th> */}
                        <th>{t('account.status')}</th>
                        {/* <th>{t('myproposal.Message')}</th> */}
                        <th style={{ width: '250px' }}>
                          {t('myproposal.action')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>{proposal}</tbody>
                  </table>

                  {length > 10 && proposalsList.length >= 10 ? (
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
                  {t('marketplace.work.manage_work.listing.Draft')}
                </h2>
                <div className='btn-group'>
                  <Link
                    className='btn btn-blue text-uppercase'
                    to='/myproposal'
                  >
                    {t('myBusiness.offer.create')}
                  </Link>
                </div>
              </div>
              <div className='card-body'>
                <div className='table-responsive'>
                  <table className='table custom-table'>
                    <thead>
                      <tr>
                        <th width='6%'>
                          {/* <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="check2"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="check2"
                              ></label>
                            </div> */}
                          {t('account.Serial_No')}
                        </th>

                        <th>{t('myproposal.prop_name')}</th>
                        <th>{t('myBusiness.offer.prop_company')}</th>
                        <th>{t('account.email')}</th>
                        <th>{t('account.status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {draft_map}
                      {/* {typeof currentPosts1 !== "string"
                          ? (
                            currentPosts1?.filter((val) => {
                              if (this.state.search == null) return val;
                              else if (
                                val.proposal_request_id
                                  .toString()
                                  .includes(this.state.search) ||
                                val.proposal_names
                                  .toLowerCase()
                                  .includes(this.state.search.toLowerCase())
                              )
                                return val;
                              
                            }).map((x, i) => (
                              <tr key={i} style={{ background: i % 2 === 0 ? '#f3f3f3' : 'white' }}>
                                <td style={{ width: "50px" }}>
                                  
                                  {i + 1}
                                </td>
                                <td> {x.proposal_names} </td>
                                <td>{x.proposal_client_type}</td>
                                <td> {this.getdate(x.updated_at)} </td>
                                <td data-label="Status: ">
                                  {x.proposal_status === 0
                                    ? "Draft"
                                    : x.proposal_status === 1
                                      ? "Send"
                                      : x.proposal_status === 2
                                        ? "Accepted"
                                        : x.proposal_status === 3
                                          ? "Declined"
                                          : x.proposal_status === 4
                                            ? "Revision"
                                            : null}
                                </td>
                                <td>
                                  <Link
                                    className="btn btn-blue"
                                    to={{
                                      pathname: `/business-proposal-create/${x.proposal_request_id}/${x.proposal_client_id}/update`,
                                      
                                      state: {
                                        data: this.state.user_title,
                                      }
                                    }}
                                  >
                                    {t("myproposal.Edit_Proposal")}
                                  </Link></td>
                              </tr>
                            ))
                          ) : ""} */}
                    </tbody>
                  </table>

                  {length1 > 10 ? (
                    <div className='row' style={{ width: '100%' }}>
                      {/* <div className="col-md-4" >
                          <h3 className="total_rec"> Total {length1}  </h3>
                        </div> */}
                      <div className='col-md-6'>
                        <h3 className='total_rec'> Show once </h3>
                        <select
                          id='dropdown_custom'
                          onChange={this.handleChange}
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
        <OfferProposalModal
          propsObj={this.state.properties}
          proposal_id={this.state.proposal_id}
          table={'pro_proposal'}
          show={this.state.isModalOpen}
          handleClose={() => this.setState({ isModalOpen: false })}
          loadOffers={this.loadProposals}
        />
        <AgreementProposalModal
          propsObj={this.state.properties}
          show={this.state.isAcceptModal}
          handleClose={() => this.setState({ isAcceptModal: false })}
          proposal_id={this.state.proposal_id}
          table={'pro_proposal'}
          loadAgreements={this.loadProposals}
        />
      </>
    );
  }
}

export default withTranslation()(Proposal);
