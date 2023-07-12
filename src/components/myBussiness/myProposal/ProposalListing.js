import React, { Component } from 'react';
import axios from 'axios';
import Header from '../../shared/Header';
import BussinessSidebar from '../../shared/BussinessSidebar';
import { Helper, url, userRole } from '../../../helper/helper';
import { Link } from 'react-router-dom';
import AgreementProposalModal from '../../myBussiness/modals/AgreementProposalModal';
import { withTranslation } from 'react-i18next';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import moment from 'moment';
import OfferProposalModal from '../../myBussiness/modals/OfferProposalModal';
import Pagination from '../pagination/pagination';
import { getData } from '../../../helper/api';
import Breadcrumb from '../../shared/Breadcrumb';
import Sidebar from '../../shared/Sidebar';
import { dateFunc } from '../../../helper/dateFunc/date';
class ProposalListing extends Component {
  state = {
    proposals: [],
    changed: false,
    properties: [],
    proposal_id: 0,
    search: null,
    loading: false,
    currentPage: 1,
    postsPerPage: 10,
    isModalOpen: false,
    isAcceptModal: false,
    lng: '',
    Login_user_role: localStorage.getItem('Login_user_role'),
    listing_type: '',
    lang: localStorage.getItem('_lng'),
  };

  componentDidMount = async () => {
    this._isMounted = true;

    this.loadProposals();
    this.loadDrafts();
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (prevState.changed !== this.state.changed) {
      this.loadProposals();
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
        //console.log(err.response);
      });
  };

  loadProposals = async () => {
    const token = await localStorage.getItem('token');
    const result = await getData(`${url}/api/proposal/get-new`, token);
    if (this._isMounted && result?.data) {
      this.setState({ proposals: result.data });
    }
    // await axios
    //   .get(`${url}/api/proposal/get-new`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //     cancelToken: axiosCancelSource.token,
    //   })
    //   .then((result) => {
    //     // console.log(result.data);
    //     if (this._isMounted) {
    //       this.setState({ proposals: result.data });
    //     }
    //     // console.log(this.state.proposals);
    //   })
    //   .catch((err) => {
    //     if (axios.isCancel(err)) {
    //       //console.log("Request canceled", err.message);
    //     } else {
    //       //console.log(err.response);
    //     }
    //   });
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
    let d = moment(date).format('Do-MMMM');
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
      postsPerPage: 10,
      listing_type: e,
    });
  };

  render() {
    const { t, i18n } = this.props;
    console.log(this.state.listing_type);
    const { isModalOpen } = this.state;
    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;

    let proposalsList =
      typeof this.state.proposals !== 'string'
        ? this.state.proposals.filter((data) => {
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

    const proposal = currentPosts?.map((data, i) => (
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
            <p className='table-cell-head'>
              {t('myBusiness.offer.listing.prop_name')}
            </p>
            <p className='table-cell-value'>{data.proposal_names}</p>
          </div>
        </td>
        <td data-label='Date: '>
          <div className='table-cell'>
            <p className='table-cell-head'>
              {t('myBusiness.offer.listing.date')}
            </p>
            <p className='table-cell-value'>
              {dateFunc(data.updated_at, this.state.lang)}
            </p>
          </div>
        </td>
        {/* <td data-label='Type: '>{data.proposal_client_company}</td>
        <td data-label='Email: '>{data.user_email}</td> */}
        {/* <td data-label="Message: ">{notification_message}</td> */}
        <td data-label='Status: '>
          <div className='table-cell'>
            <p className='table-cell-head'>
              {t('myBusiness.offer.listing.status')}
            </p>
            <p className='table-cell-value'>
              {data.proposal_status === 0
                ? `${t('myBusiness.offer.listing.Draft')}`
                : data.proposal_status === 1
                ? `${t('myBusiness.offer.listing.Send1')}`
                : data.proposal_status === 2
                ? `${t('myBusiness.offer.listing.Accepted')}`
                : data.proposal_status === 3
                ? `${t('myBusiness.offer.listing.Declined')}`
                : data.proposal_status === 4
                ? `${t('myBusiness.offer.listing.Revision')}`
                : data.proposal_status === 5
                ? `${t('myBusiness.offer.listing.Accepted')}`
                : null}
            </p>
          </div>
        </td>

        <td data-label='Action: '>
          <div className='table-cell'>
            <p className='table-cell-head'>
              {t('myBusiness.offer.listing.action')}
            </p>
            <p className='table-cell-value'>
              <p className='action-btns-wrap'>
                <button
                  onClick={(e) =>
                    window.open(
                      `${url}/images/marketplace/proposal/pdf/${data.proposal_pdf}`,
                      '_blank'
                    )
                  }
                  type='button'
                  className='btn btn-outline-dark mb-3 pdf-bt d-flex align-items-center'
                >
                  <i className='fa fa-download' aria-hidden='true'></i> &nbsp;
                  <i className='fa fa-print	' aria-hidden='true'></i>
                </button>
                {data.sender_isLogged ? (
                  <div
                    className='actn-btn'
                    style={{
                      display: 'flex',
                    }}
                  >
                    {data.proposal_status === 4 ? (
                      <div>
                        <Link
                          to={{
                            pathname: `/business-proposal-create/${data.proposal_request_id}/${data.proposal_client_id}/update`,
                          }}
                          type='button'
                          className='btn btn-outline-dark mb-3'
                          style={{ marginLeft: '15px' }}
                        >
                          {t('myBusiness.offer.listing.Edit')}
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
                          className='btn btn-outline-danger mb-3'
                          style={{ marginLeft: '15px' }}
                        >
                          {t('myBusiness.offer.listing.Decline')}
                        </button>
                      </div>
                    ) : // :""
                    null}
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
                        data-toggle='modal'
                        data-target='#agreement-proposal'
                        type='button'
                        className='btn btn-outline-primary mb-3 mr-4'
                      >
                        {t('myBusiness.offerView_notes')}
                      </button> 
                    ) : null}*/}

                    {data.proposal_status === 2 &&
                    data.proposal_status !== 5 ? (
                      <div className='mb-3 ml-2 mr-1'>
                        <Link
                          to={{
                            pathname: `/business-agreement-create/${data.proposal_id}/${data.proposal_client_id}`,
                            state: {
                              data: data.proposal_names,
                            },
                          }}
                          className='btn btn-outline-primary'
                        >
                          {' '}
                          {t('myBusiness.offer.listing.Submit_agreement')}
                        </Link>
                      </div>
                    ) : (
                      ' '
                    )}
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
                              className='btn btn-outline-dark mb-3'
                              data-toggle='modal'
                              data-target='#agreement-proposal'
                              type='button'
                              style={{ marginLeft: '15px' }}
                            >
                              {t('myBusiness.offer.listing.Accept')}
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
                              className='btn btn-outline-dark mb-3'
                              data-toggle='modal'
                              data-target='#agreement-proposal'
                              type='button'
                              style={{ marginLeft: '15px' }}
                            >
                              {t('myBusiness.offer.listing.Decline')}
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
                          className='btn btn-outline-dark mb-3 mr-4 rev-btn'
                          style={{ marginLeft: '15px' }}
                        >
                          {t('myBusiness.offer.listing.Revise')}
                        </Link>
                      </React.Fragment>
                    ) : null}
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
                              className='btn btn-outline-success mb-3'
                              style={{ marginLeft: '15px' }}
                            >
                              {t('myBusiness.offer.listing.Accept')}
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
                              className='btn btn-outline-danger mb-3'
                              style={{ marginLeft: '15px' }}
                            >
                              {t('myBusiness.offer.listing.Decline')}
                            </button>
                          </>
                        ) : (
                          ''
                        )}
                      </div>
                    ) : null}
                    {data.proposal_status === 1 ? (
                      <>
                        <button
                          onClick={() =>
                            this.viewProposal(
                              data?.proposal_user_id,
                              data?.proposal_id,
                              data?.proposal_client_id,
                              data?.table,
                              data?.proposal_id != null
                                ? data?.proposal_id
                                : '',
                              4
                            )
                          }
                          data-toggle='modal'
                          data-target='#agreement-proposal'
                          type='button'
                          className='btn btn-outline-dark mb-3 revv-btn'
                          style={{ marginLeft: '15px' }}
                        >
                          {t('myBusiness.offer.listing.Revise')}
                        </button>
                      </>
                    ) : null}

                    <br />
                  </div>
                )}
              </p>
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
                    data?.proposal_user_id,
                    data?.proposal_id,
                    data?.proposal_client_id,
                    data?.table,

                    data?.proposal_id,
                    1
                  )
                }
                data-toggle='modal'
                data-target='#offer-contracts'
                type='button'
                className='btn btn-outline-dark revv-btn'
              >
                {t('myBusiness.offer.listing.message')}
              </button>
            </p>
          </div>
        </td>
      </tr>
    ));

    // draft

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
            <p className='table-cell-head'>
              {t('myBusiness.offer.listing.Serial_No')}
            </p>
            <p className='table-cell-value'>{i + 1}</p>
          </div>
        </td>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>
              {t('myBusiness.offer.listing.prop_name')}
            </p>
            <p className='table-cell-value'>{x.proposal_names}</p>
          </div>
        </td>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>
              {t('c_material_list.listing.prop_company')}
            </p>
            <p className='table-cell-value'>{x.proposal_client_type}</p>
          </div>
        </td>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>
              {t('myBusiness.offer.listing.email')}
            </p>
            <p className='table-cell-value'>
              {dateFunc(x.updated_at, this.state.lang)}
            </p>
          </div>
        </td>
        <td data-label='Status: '>
          <div className='table-cell'>
            <p className='table-cell-head'>
              {t('myBusiness.offer.listing.status')}
            </p>
            <p className='table-cell-value'>
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
            <p className='table-cell-head'>
              {t('myBusiness.offer.listing.action')}
            </p>
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
                {t('myBusiness.offer.listing.Edit_Proposal')}
              </Link>
            </p>
          </div>
        </td>
      </tr>
    ));
    //

    return (
      <div>
        {/* <Header active={"bussiness"} /> */}
        <Breadcrumb>
          <Link
            to='/business-dashboard'
            className='breadcrumb-item active'
            aria-current='page'
          >
            {t('myBusiness.offer.listing.breadcrumb_heading')}
          </Link>
          <li className='breadcrumb-item active' aria-current='page'>
            {t('myBusiness.offer.listing.proposal')}
          </li>
        </Breadcrumb>
        <div className='main-content'>
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className='page-content'>
            <div className='container-fluid'>
              <h3 className='head3'>{t('myBusiness.offer.listing.title')}</h3>
              {/* <div className="card">
                <div className="card-body">
                  <div className="filter">
                    <div className="row align-items-center">
                      <div className="col-lg-4 col-md-6">
                        <div className="form-group">
                          <label htmlFor="name">
                            {t("myBusiness.offerprop_req_id")}
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
                  <div className='custome_tabs_agre'>
                    <div className='row'>
                      <div className='col-sm-12 col-md-6'>
                        <TabList>
                          <Tab onClick={(e) => this.updteVlue('listing')}>
                            {' '}
                            {t('myBusiness.offer.listing.prop_listings')}{' '}
                          </Tab>
                          {this.state.Login_user_role !== 'consumer' && (
                            <Tab onClick={(e) => this.updteVlue()}>
                              {' '}
                              {t('myBusiness.offer.listing.Draft')}{' '}
                            </Tab>
                          )}
                        </TabList>
                      </div>

                      <div className='col-sm-12 col-md-6'>
                        <div className='filter'>
                          <div className='row align-items-center'>
                            {/* <div className="col-lg-4 col-md-6"> */}
                            <div className='col-md-8 form-group '>
                              <label htmlFor='name'>
                                {t('myBusiness.offer.listing.prop_req_id')}
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
                        {t('myBusiness.offer.listing.listing_heading')}
                      </h2>
                      {userRole !== 'consumer' ? (
                        <div className='btn-group'>
                          <Link
                            className='btn btn-blue text-uppercase'
                            to='/myproposal'
                          >
                            {t('myBusiness.offer.listing.create')}
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
                              <th>{t('myBusiness.offer.listing.prop_name')}</th>
                              <th>{t('myBusiness.offer.listing.date')}</th>
                              {/* <th>
                                {t('c_material_list.listing.prop_company')}
                              </th>
                              <th>{t('account.email')}</th> */}
                              <th>{t('myBusiness.offer.listing.status')}</th>
                              {/* <th>{t('myBusiness.offerMessage')}</th> */}
                              <th>{t('myBusiness.offer.listing.action')}</th>
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
                        {t('myBusiness.offer.listing.Draft')}
                      </h2>
                      {userRole !== 'consumer' &&
                      this.state.listing_type !== 'draft' ? (
                        <div className='btn-group'>
                          <Link
                            className='btn btn-blue text-uppercase'
                            to='/myproposal'
                          >
                            {t('myBusiness.offer.listing.create')}
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
                              <th width='5%'>
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
                                {t('myBusiness.offer.listing.Serial_No')}
                              </th>

                              <th>{t('myBusiness.offer.listing.prop_name')}</th>
                              <th>
                                {t('myBusiness.offer.listing.prop_company')}
                              </th>
                              <th>{t('myBusiness.offer.listing.email')}</th>
                              <th>{t('myBusiness.offer.listing.status')}</th>
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
                                        {t("myBusiness.offer.listing.Edit_Proposal")}
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
            </div>
          </div>
        </div>
        <OfferProposalModal
          propsObj={this.state.properties}
          proposal_id={this.state.proposal_id}
          table={'pro_proposal'}
          loadOffers={this.loadProposals}
          show={isModalOpen}
          handleClose={() => {
            this.setState({ isModalOpen: false });
          }}
          messages={this.state.messages}
        />
        <AgreementProposalModal
          propsObj={this.state.properties}
          proposal_id={this.state.proposal_id}
          show={this.state.isAcceptModal}
          handleClose={() => this.setState({ isAcceptModal: false })}
          table={'pro_proposal'}
          page_url={this.props.match.url}
          loadAgreements={this.loadProposals}
        />
      </div>
    );
  }
}

export default withTranslation()(ProposalListing);
