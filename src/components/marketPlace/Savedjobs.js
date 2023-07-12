import React, { Component } from 'react';
import axios from 'axios';
import Header from '../shared/Header';
import Sidebar from '../shared/Sidebar';
import Spinner from 'react-bootstrap/Spinner';
import { Helper, url } from '../../helper/helper';
import { HashRouter as Router, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Image from '../../images/DefaultImg.png';
import Pagination from '../myBussiness/pagination/pagination';
import Breadcrumb from '../shared/Breadcrumb';
import { dateFuncExp } from '../../helper/dateFunc/date';
class Savedjobs extends Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);

    this.state = {
      jobs: [],
      removed: false,
      savedLoaded: false,
      loading: false,
      currentPage: 1,
      postsPerPage: 10,
    };
  }

  componentDidMount = () => {
    this._isMounted = true;
    this.axiosCancelSource = axios.CancelToken.source();

    this.loadData(this.axiosCancelSource);
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.removed !== this.state.removed) {
      this.loadData(this.axiosCancelSource);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.axiosCancelSource.cancel();
  }

  loadData = async (axiosCancelSource) => {
    const token = await localStorage.getItem('token');
    axios
      .get(`${url}/api/saved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        //console.log("result jobs", result)
        if (this._isMounted) {
          this.setState({ jobs: result.data.data, loaded: true });
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

  remove = async (id) => {
    this.setState({ feedid: id, savedLoaded: true });
    const token = await localStorage.getItem('token');
    await axios
      .delete(`${url}/api/saved/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        //console.log("result", result)
        // this.setState({ removed: false });
        this.setState({ removed: true, savedLoaded: false });
        // window.location.reload(false);
      })
      .catch((err) => {
        // if (err.response.status === 404) {
        //   return alert("Saved job doesn't belong to the user");
        // }
        // return alert("Some issue occured");
      });
    this.setState({ savedLoaded: false });
    this.axiosCancelSource = axios.CancelToken.source();

    this.loadData(this.axiosCancelSource);
  };

  url(type, category) {
    if (category === 'Material') {
      return 'material-offer-detail';
    }
    if (category === 'Work') {
      return 'work-detail';
    }
    return null;
  }

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

  // Render Funtion
  render() {
    const { t, i18n } = this.props;
    let i = 1;
    const saveJob = this.state.jobs ? this.state.jobs : '';

    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const currentPosts = saveJob?.slice(indexOfFirstPost, indexOfLastPost);
    const length = currentPosts ? currentPosts.length : '';

    //console.log("vcurrentPosts", currentPosts)

    return (
      <div>
        {/* <Header active={'market'} /> */}
        <Breadcrumb>
          <Link
            to='/feeds'
            className='breadcrumb-item active'
            aria-current='page'
          >
            {t('header.marketplace')}
          </Link>
          <li className='breadcrumb-item active' aria-current='page'>
            {t('marketplace.saved_jobs.Saved')}
          </li>
        </Breadcrumb>
        <div className='main-content'>
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className='page-content'>
            <div className='container-fluid'>
              <div className='card'>
                <div className='card-header'>
                  <h3 className='head3 mb-0'>
                    {t('marketplace.saved_jobs.saved_job')}
                  </h3>
                </div>
                <div className='card-body'>
                  <div className='feeds' style={{ maxWidth: '100%' }}>
                    {currentPosts ? (
                      currentPosts.length <= 0 ? (
                        <div className='item'>
                          <h3> {t('marketplace.saved_jobs.No_found')} </h3>
                        </div>
                      ) : (
                        currentPosts.map((feed) => (
                          <div className='item' key={feed[0].tender_id}>
                            <div className='img-box'>
                              {feed[0].tender_featured_image ? (
                                <img
                                  src={`${url}/images/marketplace/material/${feed[0].tender_featured_image}`}
                                  alt='featured'
                                  style={{ maxHeight: '160px' }}
                                />
                              ) : (
                                <img
                                  src={Image}
                                  alt='Trulli'
                                  width='350'
                                  height='100%'
                                />
                              )}
                            </div>
                            <div className='content-box'>
                              <h3>
                                <Link
                                  to={{
                                    pathname: `/${this.url(
                                      feed[0].tender_type,
                                      feed[0].tender_category_type
                                    )}/${feed[0].tender_id}`,
                                  }}
                                  style={{
                                    textDecoration: 'none',
                                    color: 'black',
                                  }}
                                >
                                  {feed[0].tender_title}
                                </Link>
                              </h3>
                              <p>
                                {feed[0].tender_description &&
                                feed[0].tender_description.length > 100
                                  ? `${feed[0].tender_description.substring(
                                      0,
                                      150
                                    )}...`
                                  : feed[0].tender_description}
                                .
                              </p>
                              <p className='m-0'>
                                <span className='badge badge-secondary'>
                                  {feed[0].tender_type === 'Request'
                                    ? t(
                                        'marketplace.saved_jobs.tender_type_request'
                                      )
                                    : t(
                                        'marketplace.saved_jobs.tender_type_offer'
                                      )}
                                </span>
                                <span className='badge badge-secondary'>
                                  {feed[0].tender_category_type === 'Work'
                                    ? t(
                                        'marketplace.saved_jobs.tender_category_type_work'
                                      )
                                    : t(
                                        'marketplace.saved_jobs.tender_category_type_material'
                                      )}
                                </span>
                                <span className='badge badge-secondary'>
                                  {feed[0].extra === 2
                                    ? t('marketplace.saved_jobs.work_included')
                                    : feed[0].extra === 1
                                    ? t(
                                        'marketplace.saved_jobs.material_included'
                                      )
                                    : null}
                                </span>
                              </p>
                              <ul>
                                <li>
                                  <span className='cl-light'>
                                    {' '}
                                    {t('marketplace.saved_jobs.Budget')}
                                  </span>
                                  <span>
                                    {feed[0].tender_budget}
                                    {t('marketplace.saved_jobs.€/pcs')}{' '}
                                  </span>
                                </li>
                                <li>
                                  <span className='cl-light'>
                                    {' '}
                                    {t('marketplace.saved_jobs.qnt')}{' '}
                                  </span>
                                  <span>
                                    {feed[0].tender_quantity
                                      ? feed[0].tender_quantity
                                      : feed[0].tender_rate}
                                  </span>
                                </li>
                                <li>
                                  <span className='cl-light'>
                                    {' '}
                                    {t('marketplace.saved_jobs.Time_left')}{' '}
                                  </span>
                                  <span>
                                    {dateFuncExp(feed[0].tender_expiry_date)}
                                  </span>
                                </li>
                              </ul>
                              {this.state.savedLoaded === true &&
                              this.state.feedid === feed[0].tender_id ? (
                                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                                <a
                                  id={feed[0].tender_id}
                                  className='add-favorites'
                                >
                                  <Spinner
                                    animation='border'
                                    role='status'
                                    key={feed[0].tender_id}
                                  >
                                    <span
                                      key={feed[0].tender_id}
                                      className='sr-only'
                                    >
                                      {' '}
                                      {t('marketplace.saved_jobs.Loading')}{' '}
                                    </span>
                                  </Spinner>
                                </a>
                              ) : (
                                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                                <a
                                  key={feed[0].tender_id}
                                  id={feed[0].tender_id}
                                  onClick={() => this.remove(feed[0].tender_id)}
                                  className={`add-favorites ${
                                    this.state.savedLoaded == true
                                      ? 'disable'
                                      : ''
                                  }`}
                                >
                                  <i className='icon-heart'></i>
                                </a>
                              )}
                            </div>
                          </div>
                        ))
                      )
                    ) : null}
                    {length > 10 ? (
                      <div className='row' style={{ width: '100%' }}>
                        <div className='col-md-4'>
                          <h3 className='total_rec'> Total {length} </h3>
                        </div>
                        <div className='col-md-4 '>
                          <select
                            id='dropdown_custom'
                            className='custom_pag'
                            onChange={this.handleChange}
                            value={this.state.postsPerPage}
                          >
                            <option value='10'>10</option>
                            <option value='20'>20</option>
                            <option value='40'>40</option>
                            <option value='80'>80</option>
                            <option value='100'>100</option>
                          </select>
                        </div>
                        <div className='col-md-4'>
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
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Savedjobs);
