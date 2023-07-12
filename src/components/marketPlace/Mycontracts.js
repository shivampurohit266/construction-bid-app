import React, { Component } from 'react';
import axios from 'axios';
import Header from '../shared/Header';
import Sidebar from '../shared/Sidebar';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { Helper, url } from '../../helper/helper';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import moment from 'moment';
import Pagination from '../myBussiness/pagination/pagination';
import { getData } from '../../helper/api';

class Mycontracts extends Component {
  feeds_search = [];
  state = {
    feeds: [],
    status: '',
    search: '',
    proposal_submitted: false,
    loaded: false,
    left: null,
    right: null,
    loading: false,
    currentPage: 1,
    postsPerPage: 10,
  };

  componentDidMount = () => {
    this._isMounted = true;

    this.loadNotif();
    this.loadConfig();
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadConfig = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/config/currency`, token)
      .then((result) => {
        if (this._isMounted) {
          const { left, right } = result.data;
          this.setState({ left, right });
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

  loadNotif = () => {
    const token = localStorage.getItem('token');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${url}/api/contracts`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.data) {
          this.setState({ feeds: result.data, loaded: true });
          this.feeds_search = this.state.feeds;
        }
      })
      .catch((error) => {
        //console.log('error', error)
      });
    // const token = await localStorage.getItem("token");
    // const response = await axios.get(`${url}/api/contracts`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    //   cancelToken: axiosCancelSource.token,
    // });
    // if (response.status === 200) {
    // this.setState({ feeds: response.data.data, loaded: true });
    // this.feeds_search = this.state.feeds;
    // }
  };

  handleStatus = async (id, status) => {
    this.setState({ loaded: false });
    const token = await localStorage.getItem('token');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${url}/api/contracts/status/${id}/${status}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        this.loadNotif();
        //console.log(result)
        if (status == 3) {
          NotificationManager.success(
            'Proposal Request Status updated success'
          );
        }
        if (status == 4) {
          NotificationManager.success('Cancel Status updated success');
        }
        this.setState({ proposal_submitted: true });
      })
      .catch((error) => {
        //console.log('error', error)
      });
    // const response = await axios.post(
    //   `${url}/api/contracts/status/${id}/${status}`,
    //   null,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );
    // if (response.status === 200 && status === 3) {
    // if (status == 3) {
    //   NotificationManager.success('Proposal Request Status updated success');
    // }
    // this.setState({ proposal_submitted: true });
    // }
    // if (status == 4) {
    //   NotificationManager.success('Cancel Status updated success');
    // }
  };

  handleChange = (event) => {
    this.setState(
      { feeds: this.feeds_search, status: event.target.value },
      () => {
        if (this.state.status == '--Select--') {
          this.loadNotif();
        }
        this.setState((prevstate) => ({
          feeds: prevstate.feeds?.filter((data) => {
            return data.tender_status == this.state.status;
          }),
        }));
      }
    );
  };

  handleSearch = (event) => {
    this.setState(
      { feeds: this.feeds_search, search: event.target.value },
      () => {
        if (this.state.search == '--Select--') {
          this.loadNotif();
        }
        this.setState((prevstate) => ({
          feeds: prevstate.feeds?.filter((data) => {
            if (this.state.search == 'Work' || this.state.search == 'Material')
              return data.tender_category_type.includes(this.state.search);

            return data.tender_type.includes(this.state.search);
          }),
        }));
      }
    );
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

  getdate = (d) => {
    return moment(d).format('DD-MMMM-YYYY');
  };

  render() {
    // const aa = localStorage.getItem("Login_user_id");

    const Login_user_id = this.state.feeds?.filter(
      (x) => x.notification_user_id != localStorage.getItem('Login_user_id')
    );

    const data_feed = Login_user_id.filter((x) => x.bid_status !== 2);

    const { t, i18n } = this.props;
    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const currentPosts = data_feed?.slice(indexOfFirstPost, indexOfLastPost);
    const length = data_feed ? data_feed.length : '';

    let alert;
    if (this.state.proposal_submitted === true) {
      alert = (
        <Alert variant='success' style={{ fontSize: '13px' }}>
          {t('my_contracts.Proposal_Requested')}
        </Alert>
      );
    }

    const feed = currentPosts
      ? currentPosts.map((feed, i) => (
          <div className='card mb-1' key={i}>
            <div className='card-body'>
              <div className='row'>
                <div className='col-lg-4'>
                  <p>
                    {feed.tender_title}
                    <br />
                    <b className='fw-500'>{feed.sender}</b>
                    <br />
                    <span className='date'>
                      {' '}
                      {t('my_contracts.Started')}{' '}
                      {this.getdate(feed.created_at)}{' '}
                    </span>
                  </p>
                  <p>
                    {feed.tender_status === 4 ? (
                      <span className='badge badge-tag badge-danger'>
                        {t('my_contracts.Pending')}
                      </span>
                    ) : feed.tender_status === 3 ? (
                      <span className='badge badge-tag badge-danger'>
                        {t('my_contracts.Completed')}
                      </span>
                    ) : feed.tender_status === 5 ? (
                      <span className='badge badge-tag badge-danger'>
                        {t('my_contracts.cancel')}
                      </span>
                    ) : feed.tender_status === 6 ? (
                      <div>
                        <span className='badge badge-tag badge-info'>
                          {t('my_contracts.Ongoing')}
                        </span>
                        <span className='badge badge-tag badge-secondary'>
                          {t('my_contracts.Sent')}
                        </span>
                      </div>
                    ) : (
                      <span className='badge badge-tag badge-info'>
                        {t('my_contracts.Ongoing')}
                      </span>
                    )}

                    {/* <span className="badge badge-tag badge-secondary">My Contract</span>
                                <span className="badge badge-tag badge-primary">My Job</span>
                                <span className="badge badge-tag badge-info">Ongoing</span>
                                <span className="badge badge-tag badge-success">Complete</span>
                                <span className="badge badge-tag badge-warning">Pending</span>
                                <span className="badge badge-tag badge-danger">Cancel</span> */}
                  </p>
                </div>

                <div className='col-lg-4'>
                  <b className='fw-500'>
                    {this.state.left}
                    {feed.tb_quote
                      ? feed.tb_quote
                      : feed.tender_rate
                      ? feed.tender_rate
                      : feed.tender_cost_per_unit}
                    {this.state.right}/{' '}
                    {feed.tender_budget ? feed.tender_budget : feed.tender_unit}
                  </b>
                  <br />
                  <span className='date'>
                    {feed.tender_available_from} - {feed.tender_available_to}
                  </span>
                </div>
                {/* { feed.tender_status} */}
                {feed.created_by_type !== 'Employee' ? (
                  <div className='col-lg-4'>
                    {feed.tender_type !== 'Offer' ? (
                      <>
                        {feed.bid_status !== 3 || feed.bid_status === 1 ? (
                          feed.sender_isLogged &&
                          feed.bid_status !== 2 &&
                          feed.sender_isLogged &&
                          feed.tender_status !== 5 &&
                          feed.sender_isLogged &&
                          feed.tender_status !== 6 ? (
                            <button
                              href='#'
                              onClick={() =>
                                this.handleStatus(feed.notification_bid_id, 3)
                              }
                              className='btn btn-outline-dark mt-3 mr-5'
                            >
                              {t('my_contracts.request_proposal')}
                            </button>
                          ) : null
                        ) : null}
                      </>
                    ) : feed.bid_status === 1 ? (
                      <Link
                        className='btn btn-primary button_bid custom'
                        to={{
                          pathname: `/business-proposal-create/${feed.notification_bid_id}/${feed.notification_user_id}`,
                          state: {
                            data: feed.tender_title,
                          },
                        }}
                      >
                        {t('my_contracts.submit_proposal')}
                      </Link>
                    ) : (
                      ''
                    )}

                    {feed.tender_status === 5 ||
                    feed.bid_status === 2 ? null : (
                      <button
                        href='#'
                        onClick={() =>
                          this.handleStatus(feed.notification_bid_id, 4)
                        }
                        className='btn btn-gray mt-3'
                      >
                        {t('my_contracts.cancel')}
                      </button>
                    )}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        ))
      : [];
    console.log(feed);
    return (
      <div>
        {/* <Header active={'market'} /> */}
        <div className='sidebar-toggle'></div>
        <nav aria-label='breadcrumb'>
          <ol className='breadcrumb'>
            <Link
              to='/feeds'
              className='breadcrumb-item active'
              aria-current='page'
            >
              {t('header.marketplace')}
            </Link>
            <li className='breadcrumb-item active' aria-current='page'>
              {t('my_contracts.title')}
            </li>
          </ol>
        </nav>
        <div className='main-content'>
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className='page-content'>
            <div className='container-fluid'>
              {alert ? alert : null}
              <NotificationContainer />
              <h3 className='head3'>{t('my_contracts.title')}</h3>
              <div className='card'>
                <div className='card-body'>
                  <div className='filter'>
                    <div className='row align-items-center'>
                      <div className='col-xl col-md-6 col-sm-6'>
                        <div className='form-group'>
                          <label htmlFor='type1'>
                            {t('my_contracts.search.type1')}{' '}
                          </label>
                          <select
                            onChange={this.handleSearch}
                            id='type1'
                            className='form-control'
                          >
                            <option> {t('my_contracts.search.Select')} </option>
                            <option> {t('my_contracts.search.Work')} </option>
                            <option>
                              {' '}
                              {t('my_contracts.search.Material')}{' '}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className='col-xl col-md-6 col-sm-6'>
                        <div className='form-group'>
                          <label htmlFor='type2'>
                            {t('my_contracts.search.type2')}{' '}
                          </label>
                          <select
                            onChange={this.handleSearch}
                            id='type2'
                            className='form-control'
                          >
                            <option> {t('my_contracts.search.Select')} </option>
                            <option> {t('my_contracts.search.Offer')} </option>
                            <option>
                              {' '}
                              {t('my_contracts.search.Request')}{' '}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className='col-xl-3 col-md-6 col-sm-6'>
                        <div className='form-group'>
                          <label htmlFor='Sort'>
                            {t('my_contracts.search.sort_by')}
                          </label>
                          <select
                            onChange={this.handleChange}
                            id='Sort'
                            className='form-control'
                          >
                            <option value='1'>
                              {' '}
                              {t('my_contracts.Ongoing')}{' '}
                            </option>
                            <option value='3'>
                              {' '}
                              {t('my_contracts.Completed')}{' '}
                            </option>
                            <option value='4'>
                              {' '}
                              {t('my_contracts.Pending')}{' '}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className='col-xl col-md-6 col-sm-6'>
                        <label className='d-none d-sm-block'>&nbsp;</label>
                        <div className='form-group'>
                          <div className='form-check form-check-inline'>
                            <input
                              type='checkbox'
                              className='form-check-input'
                              id='exampleCheck1'
                            />
                            <label
                              className='form-check-label'
                              htmlFor='exampleCheck1'
                            >
                              {t('my_contracts.search.closed_contract')}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {this.state.loaded === false ? (
                <Spinner animation='border' role='status'>
                  <span className='sr-only'> {t('my_contracts.Loading')} </span>
                </Spinner>
              ) : (
                feed
              )}
              {/* this.state.loaded != false &&  */}
              {length > 10 ? (
                <div className='row' style={{ width: '100%' }}>
                  {/* <div className="col-md-4" >
                    <h3 className="total_rec"> Show once   </h3>
                  </div> */}
                  <div className='col-md-6'>
                    <h3 className='total_rec'> Show once </h3>
                    <select
                      id='dropdown_custom'
                      onChange={this.handleChange1}
                      value={this.state.postsPerPage}
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
      </div>
    );
  }
}

export default withTranslation()(Mycontracts);
