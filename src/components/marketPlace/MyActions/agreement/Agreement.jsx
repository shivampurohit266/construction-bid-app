import React, { useState, useEffect, Component } from 'react';
import axios from 'axios';
//import { url } from '../../../../helper/helper';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import AgreementProposalModal from '../../../myBussiness/modals/AgreementProposalModal';
import { useLocation } from 'react-router-dom';
import Pagination from '../../../myBussiness/pagination/pagination';
import './agreement.css';
import OfferProposalModal from '../../../myBussiness/modals/OfferProposalModal';
import ReviewRatingModal from '../../../myBussiness/modals/ReviewRatingModal';
import { Helper, userRole, url } from '../../../../helper/helper';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import moment from 'moment';
import './agreement.css';
import { getData } from '../../../../helper/api';
import { dateFunc } from '../../../../helper/dateFunc/date';

class Agreement extends Component {
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
    isModalOpen: false,
    isAcceptModalOpen: false,
    lng: '',
    notif: [],
    count: [],
    unread: 0,
    isRatingModal: false,
    propObj: [],
    lang: localStorage.getItem('_lng'),
  };

  componentDidMount = async () => {
    this._isMounted = true;
    this.loadAgreements();
    this.loadDrafts();
    this.loadNotif();
    // this.loadUnreadNotif();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.changed !== this.state.changed) {
      this.loadAgreements();
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

  handlePreviewModal = (e) => {
    e.preventDefault();
    this.setState({ isRatingModal: !this.state.isRatingModal });
  };

  loadNotif = async () => {
    const token = localStorage.getItem('token');
    await getData(`${url}/api/getBidsNotif`, token)
      .then((response) => {
        console.log(response);
        this.setState({
          notif: response.data.data.filter(
            (res) => res.notification_type === 'agreement_message'
          ),
          count: response.data.data
            // .filter((res) => res.notification_type === 'agreement_message')
            .map((res) => res.notification_bid_id),
        });
      })
      .catch((err) => {
        if (err?.response?.status >= 400 && err?.response?.status <= 499) {
          localStorage.clear();
          console.log(err);
          this.loadNotif();
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
      agreement_id: args[4],
      isModalOpen: args[5] === 1 ? !this.state.isModalOpen : false,
      isAcceptModalOpen:
        args[5] === 2 || args[5] === 3 || args[5] === 4
          ? !this.state.isAcceptModalOpen
          : false,
    });
  };

  viewRating = async (...args) => {
    this.setState({
      agreement_id: args[0],
      propObj: args,
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

  loadDrafts = async () => {
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

  render() {
    const { t, i18nUse } = this.props;
    const { isModalOpen } = this.state;

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
          ) => {
            // const found = this.state.notif?.find(
            //   (notif) => notif.notification_sender_id === agreement_user_id
            // );
            // const {
            //   notification_sender_id,
            //   notification_bid_id,
            //   notification_id,
            // } = found || {};
            // console.log(
            //   notification_sender_id,
            //   notification_bid_id,
            //   notification_id,
            //   agreement_client_id,
            //   agreement_user_id
            // );
            return (
              <tr
                key={agreement_id}
                style={{ background: i % 2 === 0 ? '#f3f3f3' : 'white' }}
              >
                {/* <td style={{ width: "50px" }}> {i + 1}  </td> */}
                <td data-label='AgreeName: '>
                  <div className='table-cell'>
                    <p className='table-cell-head'>
                      {t('myproposal.agree_name')}
                    </p>
                    <p className='table-cell-value'>{agreement_names}</p>
                  </div>
                </td>
                <td data-label='Date: '>
                  <div className='table-cell'>
                    <p className='table-cell-head'>{t('myproposal.Date')}</p>
                    <p className='table-cell-value'>
                      {dateFunc(updated_at, this.state.lang)}
                    </p>
                  </div>
                </td>
                {/* <td data-label='Type: '> {agreement_client_type}</td>
              <td data-label='Email: '> {agreement_client_email}</td> */}
                <td data-label='Status: '>
                  <div className='table-cell'>
                    <p className='table-cell-head'>{t('account.status')}</p>
                    <p className='table-cell-value'>
                      {agreement_status === 0
                        ? `${t('myproposal.Draft')}`
                        : agreement_status === 1
                        ? `${t('myproposal.Send')}`
                        : agreement_status === 2
                        ? `${t('myproposal.Accepted')}`
                        : agreement_status === 3
                        ? `${t('myproposal.Declined')}`
                        : agreement_status === 4
                        ? `${t('myproposal.Revision')}`
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
                              `${url}/images/marketplace/agreement/pdf/${agreement_pdf}`,
                              '_blank'
                            )
                          }
                          // data-toggle='modal'
                          // data-target='#agreement-proposal'
                          type='button'
                          className='btn btn-outline-dark revv-btn'
                          style={{ marginRight: '20px' }}
                        >
                          <i
                            className='fa fa-download fa-2x'
                            aria-hidden='true'
                          ></i>{' '}
                          &nbsp;&nbsp;
                          <i
                            className='fa fa-print fa-2x	'
                            aria-hidden='true'
                          ></i>
                        </button>
                      </div>
                      {sender_isLogged ? (
                        <div
                          style={{
                            display: 'flex',
                          }}
                        >
                          {agreement_status === 4 ? (
                            <div>
                              <Link
                                to={{
                                  pathname: `/business-agreement-create/${agreement_request_id}/${agreement_client_id}/update`,
                                }}
                                type='button'
                                className='btn btn-outline-dark mt-3'
                                style={{ marginRight: '20px' }}
                              >
                                {t('myagreement.Edit')}
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
                                {t('myagreement.Decline')}
                              </button>
                            </div>
                          ) : null}
                          {/* <button
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
                        </button> */}

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
                                    {t('myagreement.Accept')}
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
                                    {t('myagreement.Decline')}
                                  </button>

                                  <Link
                                    to={{
                                      pathname: `/business-agreement-create/${agreement_request_id}/${agreement_client_id}/update`,
                                    }}
                                    type='button'
                                    className='btn btn-outline-dark mt-3 mr-4'
                                    style={{ marginRight: '20px' }}
                                  >
                                    {t('myagreement.Revise')}
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
                            flexWrap: 'wrap',
                          }}
                        >
                          {agreement_status === 1 ? (
                            <div className="accept-decline-btn d-flex flex-wrap">
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
                                    // data-toggle='modal'
                                    // data-target='#agreement-proposal'
                                    className='btn btn-outline-success mt-3'
                                    style={{ marginRight: '20px' }}
                                  >
                                    {t('myagreement.Accept')}
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
                                    {t('myagreement.Decline')}
                                  </button>
                                </>
                              ) : (
                                ''
                              )}
                            </div>
                          ) : null}

                          {agreement_status === 1 ? (
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
                              type='button'
                              className='btn btn-outline-dark mt-3'
                            >
                              {t('myagreement.Revise')}
                            </button>
                          ) : null}
                          {agreement_status === 2 ? (
                            <>
                              <div style={{ marginTop: '10px' }}>
                                <button
                                  type='button'
                                  className='btn btn-outline-dark revv-btn'
                                  onClick={(e) => {
                                    this.handlePreviewModal(e);
                                    this.viewRating(
                                      agreement_user_id,
                                      agreement_id,
                                      agreement_client_id
                                    );
                                  }}
                                >
                                  Rate
                                </button>
                              </div>
                            </>
                          ) : null}
                          {/* <AgreementProposalModal
                          propsObj={this.state.properties}
                          show={this.state.isAcceptModalOpen}
                          handleClose={() =>
                            this.setState({ isAcceptModalOpen: false })
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
                        onClick={() => {
                          this.viewProposal(
                            agreement_user_id,
                            agreement_id,
                            agreement_client_id,
                            table,
                            agreement_id,
                            1
                          );
                          this.readNotif(
                            this.state.notif?.find(
                              (notif) =>
                                notif.notification_sender_id ===
                                  agreement_user_id &&
                                notif.notification_bid_id === agreement_id
                            )?.notification_sender_id === agreement_user_id
                              ? [
                                  'agreement_message',
                                  agreement_user_id,
                                  agreement_id,
                                ]
                              : this.state.notif?.find(
                                  (notif) =>
                                    notif.notification_sender_id ===
                                      agreement_client_id &&
                                    notif.notification_bid_id ===
                                      agreement_id &&
                                    notif.sender_isLogged === sender_isLogged
                                )?.notification_sender_id ===
                                agreement_client_id
                              ? [
                                  'agreement_message',
                                  agreement_client_id,
                                  agreement_id,
                                ]
                              : ''
                          );
                        }}
                        type='button'
                        className={
                          this.state.notif?.find(
                            (notif) =>
                              notif.notification_sender_id ===
                                agreement_user_id &&
                              notif.notification_bid_id === agreement_id
                          )?.notification_sender_id === agreement_user_id
                            ? 'btn btn-outline-success revv-btn notification-badges'
                            : this.state.notif?.find(
                                (notif) =>
                                  notif.notification_sender_id ===
                                    agreement_client_id &&
                                  notif.notification_bid_id === agreement_id &&
                                  notif.sender_isLogged === sender_isLogged
                              )?.notification_sender_id === agreement_client_id
                            ? 'btn btn-outline-success revv-btn notification-badges'
                            : 'btn btn-outline-dark revv-btn'
                        }
                        style={{ margin: '1rem' }}
                      >
                        {t('myproposal.message')}
                        <li
                          data-badge={
                            this.state.count.filter((x) => x === agreement_id)
                              .length
                          }
                        ></li>
                      </button>
                    </p>
                  </div>
                </td>
              </tr>
            );
          }
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
        <td style={{ width: '50px' }}>{i + 1}</td>
        <td> {x.agreement_names} </td>
        <td>{x.agreement_client_type}</td>
        <td> {this.getdate(x.updated_at)} </td>
        <td data-label='Status: '>
          {x.agreement_status === 0
            ? `${t('myproposal.Draft')}`
            : x.agreement_status === 1
            ? `${t('myproposal.Send')}`
            : x.agreement_status === 2
            ? `${t('myproposal.Accepted')}`
            : x.agreement_status === 3
            ? `${t('myproposal.Declined')}`
            : x.agreement_status === 4
            ? `${t('myproposal.Revision')}`
            : null}
        </td>
        <td>
          {' '}
          <Link
            className='btn btn-blue'
            to={{
              pathname: `/business-agreement-create/${x.agreement_request_id}/${x.agreement_client_id}/update`,
              state: {
                proposal_request_id: this.state.proposal_request_id,
              },
            }}
          >
            {t('myagreement.Update_Agreement')}
          </Link>
        </td>
      </tr>
    ));

    return (
      <>
        <Tabs>
          <div className='card'>
            <div className='card-body custome_tabs_agre'>
              <h3 className='head3'>{t('myagreement.searchFilters')}</h3>

              <div className='row'>
                <div className='col-sm-4'>
                  <TabList>
                    <Tab>
                      {' '}
                      {t(
                        'marketplace.work.manage_work.listing.my_listings'
                      )}{' '}
                    </Tab>
                    <Tab>
                      {t('marketplace.work.manage_work.listing.Draft')}{' '}
                    </Tab>
                  </TabList>
                </div>
                <div className='col-sm-8'>
                  <div className='filter'>
                    <div className='row align-items-center'>
                      <div className='col-lg-4 col-md-6'>
                        <div className='form-group'>
                          <label htmlFor='name'>
                            {t('myagreement.agreement_req_id')}
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
                  {t('marketplace.work.manage_work.listing.my_listings')}
                </h2>
                {userRole !== 'consumer' ? (
                  <div className='btn-group'>
                    <Link
                      className='btn btn-blue text-uppercase'
                      to='/myagreement'
                    >
                      {t('marketplace.work.manage_work.listing.create')}
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

                        <th>{t('myproposal.agree_name')}</th>
                        <th>{t('myproposal.Date')}</th>
                        {/* <th>
                        {t('c_material_list.listing.prop_company')}
                      </th>
                      <th>{t('account.email')}</th> */}

                        <th>{t('account.status')}</th>
                        {/* <th>{t('myproposal.Message')}</th> */}
                        <th>{t('myproposal.action')}</th>
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
                  {t('marketplace.work.manage_work.listing.Draft')}
                </h2>
                <div className='btn-group'>
                  <Link
                    className='btn btn-blue text-uppercase'
                    to='/myagreement'
                  >
                    {t('marketplace.work.manage_work.listing.create')}
                  </Link>
                </div>
              </div>
              <div className='card-body'>
                <div className='table-responsive'>
                  <table className='table'>
                    <thead>
                      <tr style={{ fontSize: '15px' }}>
                        <th style={{ width: '50px' }}>
                          {t('account.Serial_No')}
                        </th>

                        <th>{t('myproposal.agree_name')}</th>
                        <th>
                          {t(
                            'marketplace.work.manage_work.listing.prop_company_email'
                          )}
                        </th>
                        <th>{t('myproposal.Date')}</th>
                        <th>{t('account.status')}</th>
                        <th>{t('myproposal.action')}</th>
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
                            ? `${t("myproposal.Draft")}`
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
        <OfferProposalModal
          propsObj={this.state.properties}
          proposal_id={this.state.agreement_id}
          table={'pro_agreement'}
          show={isModalOpen}
          handleClose={() => this.setState({ isModalOpen: false })}
          loadOffers={this.loadAgreements}
        />
        <AgreementProposalModal
          propsObj={this.state.properties}
          show={this.state.isAcceptModalOpen}
          handleClose={() => this.setState({ isAcceptModalOpen: false })}
          proposal_id={this.state.agreement_id}
          table={'pro_agreement'}
          loadAgreements={this.loadAgreements}
        />
        <ReviewRatingModal
          show={this.state.isRatingModal}
          handleClose={() => this.setState({ isRatingModal: false })}
          propObj={this.state.propObj}
        />
      </>
    );
  }
}

export default withTranslation()(Agreement);
