/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, memo } from 'react';
import axios from 'axios';
import Header from '../shared/Header';
import Sidebar from '../shared/Sidebar';
import Spinner from 'react-bootstrap/Spinner';
import { withTranslation } from 'react-i18next';
import { url } from '../../helper/helper';
import { Link } from 'react-router-dom';
import Image from '../../images/DefaultImg.png';
// import ReactPaginate from 'react-paginate';
import Pagination from "../myBussiness/pagination/pagination";
import Debounce from '../shared/Debounce';
import Breadcrumb from '../shared/Breadcrumb';
import moment from 'moment';
import { dateFuncExp } from '../../helper/dateFunc/date';
import { deleteData, getData, postDataWithToken } from '../../helper/api';

class Feeds extends Component {
  feeds_search = [];
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      feeds: [],
      productcat: [],
      cat: '',
      city: '',
      states: [],
      cities: [],
      search: null,
      checked: false,
      offer_api: 0,
      request_check: false,
      extra: true,
      extra1: true,
      extra2: true,
      offer: false,
      request: 0,
      active: true,
      saved: [],
      savedLoaded: false,
      ids: [],
      refresh: false,
      loaded: false,
      loading: false,
      current_page: 1,
      next_page_url: null,
      prevY: 0,
      feed_loading: true,
      pageCount: 1,
      loading_feed: false,
      feed_heart_off: false,
      feed_heart_on: false,
      loading_save: false,
      currentPage: 1,
      postsPerPage: 20,
      extra_include: [],
      type: '',
    };

    this.loadData = this.loadData.bind(this);
    this.loadCategory = this.loadCategory.bind(this);
    this.loadSaved = this.loadSaved.bind(this);
    this.loadState = this.loadState.bind(this);
    this.searchSpace = this.searchSpace.bind(this);
  }

  componentDidMount = () => {
    this._isMounted = true;

    var options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };

    this.observer = new IntersectionObserver(
      this.handleObserver.bind(this),
      options
    );
    this.observer.observe(this.loadingRef);

    this.loadData(this.state.currentPage);
    setTimeout(() => this.loadCategory(), 1000);
    setTimeout(() => this.getState(), 2000);
    setTimeout(() => this.loadSaved(), 3000);
    setTimeout(() => this.loadState(), 4000);
  };

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.refresh !== this.state.refresh) {
      // this.loadData(this.axiosCancelSource, this.state.current_page);
      // this.loadCategory();
      this.loadSaved();
      if (prevState.type !== this.state.type) {
        this.loadData();
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleObserver(entities, observer) {
    const y = entities[0].boundingClientRect.y;
    if (this.state.prevY > y) {
      if (this.state.next_page_url) {
        this.setState({ current_page: this.state.current_page + 1 });
      }
    }
    this.setState({ prevY: y });
  }

  getState = async () => {
    if (this._isMounted) {
      const token = localStorage.getItem('token');
      let lang = localStorage.getItem('_lng');

      await getData(`${url}/api/state/${lang}`, token)
        .then((result) => {
          if (result) {
            this.setState({ get_State: result.data?.data });
          }
        })
        .catch(() => {});
    }
  };
  ChangeCity = async (event) => {
    this.setState({ cities: [] });
    const token = localStorage.getItem('token');
    let lang = localStorage.getItem('_lng');
    await getData(`${url}/api/cityId/${event.target.value}/${lang}`, token)
      .then((result) => {
        if (this._isMounted) {
          this.setState({ cities: result?.data?.data });
        }
      })
      .catch(() => {});
  };

  loadSaved = async () => {
    if (this._isMounted) {
      const token = localStorage.getItem('token');
      await getData(`${url}/api/saved-icon`, token)
        .then((result) => {
          this.setState({ saved: result?.data?.data });
        })
        .catch(() => {});
    }
  };

  loadData = async (current_page) => {
    if (this._isMounted) {
      this.setState({ loading: true });
      const { offer_api, search, city, request, extra_include, type } =
        this.state;
      console.log(type);
      const token = localStorage.getItem('token');
      await postDataWithToken(
        `${url}/api/feeds_new?postsPerPage=${this.state.postsPerPage}`,
        {
          page: `${current_page}`,
          offer: offer_api,
          request: request,
          search: search,
          state: city,
          extra_include: extra_include,
          type: type,
        },
        token
      )
        .then((result) => {
          const feeds = result?.data?.data;
          this.feeds_search = feeds;

          if (result.data.data) {
            this.setState({
              feed_loading: false,
              feed_data: result.data.data,
              // feeds: result.data.data,
              pageCount: result?.data.last_page,
              from: result?.data.from,
              last_page: result?.data.last_page,
              per_page: result?.data.per_page,
              to: result?.data.to,
              total: result?.data.total,
              postsPerPage: result?.data.per_page,
            });
          }

          let newdata = result?.data?.data.filter((data) => {
            if (this.state.request && this.state.offer) {
              return data;
            }
            if (this.state.extra && this.state.extra1) {
              return data;
            }
            if (this.state.offer) {
              return data.type.includes('Offer');
            }
            if (this.state.request) {
              return data.type.includes('Request');
            }
            if (this.state.extra) {
              return data.category_type.includes('Material');
            }
            if (this.state.extra1) {
              return data.category_type.includes('Work');
            }

            if (this.state.cat !== '' || this.state.cat !== '--Select--') {
              return data.category.includes(this.state.cat);
            }
            // else {
            return data;
            // }
          });
          console.log(newdata);
          // //console.log("result.data.data", result.data.data);
          this.setState({
            feeds: newdata,
            loaded: true,
            loading: false,
            next_page_url: result.data.next_page_url,
          });
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
          } else {
            // alert("Error occured please login again");
            // this.loadData(axiosCancelSource, current_page);
          }
        });
    }
  };

  loadCategory = async () => {
    if (this._isMounted) {
      const token = localStorage.getItem('token');
      let lang = await localStorage.getItem('_lng');

      await getData(`${url}/api/category/${lang}`, token)
        .then((result) => {
          this.setState({ productcat: result?.data?.data });
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
          } else {
          }
        });
    }
  };

  searchSpace = (event) => {
    let keyword = event.target.value;

    this.setState({ search: keyword, currentPage: 1 }, () => {
      if (keyword.length >= 3) {
        this.loadData();
      }
      if (!keyword.length) {
        this.loadData();
      }
    });
  };

  handleChange = (event) => {
    this.setState({ feeds: this.feeds_search });
    if (event.target.value === '--Select--') {
      return this.setState({ feeds: this.feeds_search });
    }
    this.setState({ cat: event.target.value }, () => {
      this.setState((prevstate) => ({
        feeds: prevstate.feeds.filter((data) => {
          return data.category.includes(this.state.cat);
        }),
      }));
    });
  };

  handleCity = (event) => {
    this.setState({ feeds: this.feeds_search });
    this.setState({ city: event.target.value }, () => {
      // if (this.state.city == "--Select--") {
      //   window.location.reload();
      // }
      this.setState((prevstate) => ({
        feeds: prevstate.feeds.filter((data) => {
          return data.city.includes(this.state.city);
        }),
      }));
    });
  };

  getOffer = () => {
    this.setState({ currentPage: 1 });
    this.setState({ checked: !this.state.checked }, () => {
      if (this.state.checked) {
        this.setState({ offer_api: 1 }, () => this.loadData());
      } else this.setState({ offer_api: 0 }, () => this.loadData());
    });
  };

  getRequest = (e) => {
    this.setState({ currentPage: 1 });
    this.setState({ request_check: !this.state.request_check }, () => {
      if (this.state.request_check) {
        this.setState({ request: 1 }, () => this.loadData());
      } else {
        this.setState({ request: 0 }, () => {
          this.loadData();
        });
      }
    });
  };

  getMaterialWork = (e) => {
    this.setState({ currentPage: 1 });
    const isChecked = e.target.checked;
    if (isChecked) {
      this.setState(
        {
          extra_include: [...this.state.extra_include, e.target.value],
        },
        () => this.loadData(),
        console.log(this.state.extra_include)
      );
    } else {
      const index = this.state.extra_include.indexOf(e.target.value);
      this.state.extra_include.splice(index, 1);
      this.setState(
        { extra_include: this.state.extra_include },
        () => console.log(this.state.extra_include),
        this.loadData()
      );
    }
  };

  loadState = async () => {
    const token = localStorage.getItem('token');
    let lang = localStorage.getItem('_lng');

    await getData(`${url}/api/state/${lang}`, token)
      .then((result) => {
        this.setState({ states: result?.data?.data });
      })
      .catch(() => {});
  };

  remove = async (id) => {
    this.setState({ feedid: id, feed_heart_on: true, loading_save: true });
    const token = localStorage.getItem('token');

    this.setState({ savedLoaded: true, loading_save: true });
    await deleteData(`${url}/api/saved/remove/${id}`, token)
      .then(() => {
        this.setState({ refresh: false });
        this.setState({
          refresh: true,
          savedLoaded: false,
          loading_save: false,
        });
        this.loadSaved(this.axiosCancelSource);
      })
      .catch(() => {
        this.setState({
          savedLoaded: false,
          loading_save: false,
        });
        // if (err?.response?.status === 404) {
        //   return alert("Saved job doesn't belong to the user");
        // }
        // return alert("Some issue occured");
      });
  };

  save = async (id) => {
    this.setState({
      feedid: id,
      loading_feed: true,
      feed_heart_off: true,
      loading_save: true,
    });
    const token = localStorage.getItem('token');
    this.setState({ savedLoaded: true });
    const data = new FormData();
    data.set('uft_tender_id', id);
    await postDataWithToken(`${url}/api/saved/add`, data, token)
      .then(() => {
        this.setState({ refresh: false });
        this.setState({
          refresh: true,
          savedLoaded: false,
          loading_feed: false,
          loading_save: false,
        });
        this.loadSaved(this.axiosCancelSource);
      })
      .catch(() => {
        this.setState({
          loading_feed: false,
          loading_save: false,
          savedLoaded: false,
        });
        // alert("Some issue occured");
      });
  };

  url(_type, category) {
    if (category === 'Material') {
      return 'material-offer-detail';
    }
    if (category === 'Work') {
      return 'work-detail';
    }
    return null;
  }

  budget(budget, cost_per_unit, unit) {
    const { t } = this.props;
    if (budget !== null) {
      return t('marketplace.feeds.budget');
    }
    if (cost_per_unit !== null) {
      return t('marketplace.feeds.cost');
    }
    if (unit !== null) {
      return 'unit';
    }
  }

  changeType(e) {
    const { name, value } = e.target;
    if (value === '--Select--') {
      this.setState({ [name]: '' });
    }
    this.setState({ [name]: value }, () => {
      this.loadData();
    });
  }

  paginate = async(number) => {
    await Promise.resolve(this.setState(() => ({ currentPage: number })));
    this.loadData(this.state.currentPage);
  };

  handleChange1 = async(e) => {
    const val = e.target.value
    await Promise.resolve(this.setState(() => ({ postsPerPage: val, })));
    this.loadData(this.state.currentPage);
  };

  handlePageClick = async (data) => {
    const page = data.selected >= 0 ? data.selected + 1 : 0;
    await Promise.resolve(this.setState(() => ({ currentPage: page })));

    this.loadData(this.state.currentPage);
  };
  //for breakpoints in text
  NewlineText(props) {
    const text = props.text;
    const newText = text.split('\n').map((str) => <p>{str}</p>);

    return newText;
  }

  //for breakpoints in text
  NewlineText(props) {
    const text = props.text;
    if (text) {
      const newText = text.split('\n').map((str, i) => <p key={i}>{str}</p>);
      return newText;
    } else return null;
  }

  render() {
    const { t } = this.props;
    const items = this.state.feeds;
    console.log(this.state.cat);
    // Additional css
    const loadingCSS = {
      height: '100px',
      margin: '30px',
    };

    const classname = (id) =>
      Array.isArray(this.state.saved)
        ? this.state.saved.map((item) => {
            if (item.uft_tender_id === id) {
              return 'icon-heart';
            }
          })
        : [];

    const { total } = this.state;
    return (
      <div>
        {/* <Header active={'market'} /> */}
        <Breadcrumb>
          <li className='breadcrumb-item active' aria-current='page'>
            {t('header.marketplace')}
          </li>
        </Breadcrumb>
        <div className='main-content'>
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className='page-content'>
            <div className='container-fluid'>
              <h3 className='head3'>{t('marketplace.feeds.title')}</h3>
              <div className='card'>
                <div className='card-body'>
                  <div className='filter'>
                    <div className='row align-items-center'>
                      <div className='col-lg-2 col-md-4'>
                        <div className='form-group'>
                          <label htmlFor='product'>
                            {t('marketplace.feeds.Search')}
                          </label>
                          <input
                            id='product'
                            onChange={(e) => this.searchSpace(e)}
                            type='search'
                            className='form-control'
                          />
                        </div>
                      </div>

                      <div className='col-lg-2 col-md-4 form-group'>
                        <label htmlFor='city'>
                          {' '}
                          {t('marketplace.feeds.choose_area')}
                        </label>
                        <select
                          onChange={(e) => this.changeType(e)}
                          className='form-control'
                          name='city'
                        >
                          <option> {t('marketplace.feeds.Select')} </option>
                          {this.state.get_State
                            ? this.state.get_State.map((x, i) => (
                                <>
                                  <option key={i} value={x.state_id}>
                                    {x.state_identifier}
                                  </option>
                                </>
                              ))
                            : ''}
                        </select>
                      </div>
                      <div className='col-lg-2 col-md-4 form-group'>
                        <label htmlFor='city'>
                          {' '}
                          {t('marketplace.feeds.choose_type')}
                        </label>{' '}
                        <select
                          onChange={(e) => this.changeType(e)}
                          className='form-control'
                          name='type'
                        >
                          <option> {t('marketplace.feeds.Select')} </option>
                          <option value='Material'>
                            {' '}
                            {t('marketplace.feeds.Material')}{' '}
                          </option>
                          <option value='Work'>
                            {' '}
                            {t('marketplace.feeds.Work')}{' '}
                          </option>
                        </select>
                      </div>

                      <div className='col-lg-6 col-sm-12'>
                        <p className='feeds_lable'>
                          {' '}
                          {t('marketplace.feeds.job_type')}{' '}
                        </p>
                        <div className='form-group'>
                          <div className='form-check form-check-inline'>
                            <input
                              onClick={this.getOffer}
                              value={this.state.checked}
                              type='checkbox'
                              className='form-check-input'
                              id='exampleCheck1'
                            />
                            <label
                              className='form-check-label'
                              htmlFor='exampleCheck1'
                            >
                              {t('marketplace.feeds.offer')}
                            </label>
                          </div>

                          <div className='form-check form-check-inline'>
                            <input
                              onChange={this.getRequest}
                              type='checkbox'
                              value={this.state.request_check}
                              className='form-check-input'
                              id='exampleCheck2'
                            />
                            <label
                              className='form-check-label'
                              htmlFor='exampleCheck2'
                            >
                              {t('marketplace.feeds.request')}
                            </label>
                          </div>
                          {this.state.type === 'Work' ? (
                            <div className='form-check form-check-inline'>
                              <input
                                onChange={(e) => this.getMaterialWork(e)}
                                value='1'
                                type='checkbox'
                                className='form-check-input'
                                id='exampleCheck3'
                              />
                              <label
                                className='form-check-label'
                                htmlFor='exampleCheck3'
                              >
                                {t('marketplace.feeds.material')}
                              </label>
                            </div>
                          ) : (
                            ''
                          )}
                          {this.state.type === 'Material' ? (
                            <div className='form-check form-check-inline'>
                              <input
                                onChange={(e) => this.getMaterialWork(e)}
                                value='2'
                                type='checkbox'
                                className='form-check-input'
                                id='exampleCheck4'
                              />
                              <label
                                className='form-check-label'
                                htmlFor='exampleCheck4'
                              >
                                {t('marketplace.feeds.work')}
                              </label>
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
              <h2 className='head2'>{t('marketplace.feeds.Job_Feeds')}</h2>
              <div className='card'>
                <div className='card-header'></div>
                <div className='card-body'>
                  <div className='feeds' style={{ maxWidth: '100%' }}>
                    {this.state.loaded === true && items?.length === 0 ? (
                      <div className='item'>
                        <h3>{t('marketplace.feeds.No_jobs_found')}</h3>
                      </div>
                    ) : this.state.loaded === false ? (
                      <Spinner animation='border' role='status'>
                        <span className='sr-only'>
                          {t('marketplace.feeds.Loading')}
                        </span>
                      </Spinner>
                    ) : (
                      items?.map((feed, i) => (
                        <div key={i} className='item'>
                          <Link
                            to={{
                              pathname: `/${this.url(
                                feed.type,
                                feed.category_type
                              )}/${feed.id}`,
                            }}
                            style={{
                              textDecoration: 'none',
                              color: 'black',
                            }}
                          >
                            <div className='img-box'>
                              {feed?.featured_image &&
                              feed?.featured_image != 'null' ? (
                                <div>
                                  {' '}
                                  <img
                                    src={`${url}/images/marketplace/material/${feed.featured_image}`}
                                    alt='featured'
                                    max-width='180px'
                                    height='100%'
                                    style={{ maxHeight: '160px' }}
                                  />{' '}
                                </div>
                              ) : (
                                <img
                                  src={Image}
                                  alt='Trulli'
                                  width='350'
                                  maxheight='180px'
                                  height='100%'
                                />
                              )}
                            </div>
                          </Link>

                          <div className='content-box'>
                            <Link
                              to={{
                                pathname: `/${this.url(
                                  feed.type,
                                  feed.category_type
                                )}/${feed.id}`,
                              }}
                              style={{
                                textDecoration: 'none',
                                color: 'black',
                              }}
                            >
                              <h3>{feed.title}</h3>
                              <h5 className='text-success'>
                                {feed.applied == 'applied' ? (
                                  <span>
                                    <i>
                                      <strong>
                                        {t('marketplace.feeds.applied')}
                                      </strong>
                                    </i>
                                  </span>
                                ) : null}
                              </h5>
                              <this.NewlineText
                                text={
                                  feed.description.length > 100
                                    ? `${feed.description.substring(0, 150)}...`
                                    : feed.description
                                }
                              />

                              <p className='m-0'>
                                <span className='badge badge-secondary'>
                                  {feed.type !== 'Request'
                                    ? t('marketplace.feeds.Offer')
                                    : t('marketplace.feeds.Request')}
                                </span>
                                <span className='badge badge-secondary'>
                                  {feed.category_type === 'Material'
                                    ? t('marketplace.feeds.Material')
                                    : t('marketplace.feeds.Work')}
                                </span>
                                <span className='badge badge-secondary'>
                                  {feed.extra === 2
                                    ? `${t('marketplace.feeds.Work_included')}`
                                    : feed.extra === 1
                                    ? `${t(
                                        'marketplace.feeds.Material_included'
                                      )}`
                                    : null}
                                </span>
                                <span className='badge badge-secondary'>
                                  {feed.state_identifier === 'All regions'
                                    ? t('marketplace.feeds.all_r')
                                    : feed.state_identifier}
                                </span>
                              </p>

                              <ul>
                                <li>
                                  <span className='cl-light'>
                                    {this.budget(
                                      feed.budget,
                                      feed.cost_per_unit,
                                      feed.unit
                                    )}
                                  </span>
                                  <span className='cl-light'>
                                    {feed.budget === 'per_m2'
                                      ? t('marketplace.feeds.cost/m2')
                                      : feed.budget === 'Hourly'
                                      ? t('marketplace.feeds.hourly')
                                      : feed.budget === 'PCS'
                                      ? t('marketplace.feeds.PCS')
                                      : feed.budget === 'Fixed'
                                      ? t('marketplace.feeds.Fixed')
                                      : feed.cost_per_unit
                                      ? `${feed.cost_per_unit}€/${feed.unit}`
                                      : feed.unit}
                                  </span>
                                </li>
                                <li>
                                  <span className='cl-light'>
                                    {t('marketplace.feeds.qnt')}
                                  </span>
                                  <span className='cl-light'>
                                    {feed.quantity ? feed.quantity : feed.rate}
                                  </span>
                                </li>
                                <li>
                                  <span className='cl-light'>
                                    {t('marketplace.feeds.Time_left')}
                                  </span>
                                  <span className='cl-light'>
                                    {dateFuncExp(feed.time_left)}
                                  </span>
                                </li>
                              </ul>
                            </Link>

                            {this.state.savedLoaded === true &&
                            this.state.feedid === feed.id ? (
                              <a key={feed.id} className='add-favorites'>
                                <Spinner
                                  key={feed.id}
                                  animation='border'
                                  role='status'
                                >
                                  <span key={feed.id} className='sr-only'>
                                    {t('marketplace.feeds.Loading')}
                                  </span>
                                </Spinner>
                              </a>
                            ) : feed.id ? (
                              <a
                                // id={feed.id}
                                className={`add-favorites ${
                                  this.state.loading_save
                                    ? 'disable'
                                    : 'shubham'
                                } `}
                                onClick={
                                  classname(feed.id).filter(function (el) {
                                    return el;
                                  }) == 'icon-heart'
                                    ? () => this.remove(feed.id)
                                    : () => this.save(feed.id)
                                }
                              >
                                <i
                                  className={
                                    classname(feed.id).filter(function (el) {
                                      return el;
                                    }) == 'icon-heart'
                                      ? 'icon-heart'
                                      : 'icon-heart-o'
                                  }
                                ></i>
                              </a>
                            ) : (
                              <a
                                id={feed.id}
                                className={`add-favorites`}
                                onClick={
                                  classname(feed.id).filter(function (el) {
                                    return el;
                                  }) == 'icon-heart'
                                    ? ''
                                    : ''
                                }
                              >
                                <i
                                  className={
                                    classname(feed.id).filter(function (el) {
                                      return el;
                                    }) == 'icon-heart'
                                      ? 'icon-heart'
                                      : 'icon-heart-o'
                                  }
                                ></i>
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    )}

                    {total > 20 ? (
                      // <div className='homple_number'>
                      //   <ReactPaginate
                      //     pageCount={this.state.pageCount}
                      //     initialPage={this.state.currentPage - 1}
                      //     forcePage={this.state.currentPage - 1}
                      //     pageRangeDisplayed={2}
                      //     marginPagesDisplayed={2}
                      //     previousLabel='&#x276E;'
                      //     nextLabel='&#x276F;'
                      //     containerClassName='uk-pagination uk-flex-center'
                      //     activeClassName='uk-active'
                      //     disabledClassName='uk-disabled'
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
                      ''
                    )}
                  </div>
                  <div
                    ref={(loadingRef) => (this.loadingRef = loadingRef)}
                    style={loadingCSS}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(memo(Feeds));
