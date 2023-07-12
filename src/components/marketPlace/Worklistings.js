import React, { Component } from 'react';
import axios from 'axios';
// import { Redirect } from "react-router-dom";
import Header from '../shared/Header';
import Sidebar from '../shared/Sidebar';
import { url } from '../../helper/helper';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Pagination from '../myBussiness/pagination/pagination';
import Spinner from 'react-bootstrap/Spinner';
import { ReactComponent as Trash } from '../../images/trash.svg';
import { ReactComponent as Edit } from '../../images/edit.svg';
import { ReactComponent as Duplicate } from '../../images/duplicate.svg';
import Delete from './listingdetails/Modals/Delete';
import Breadcrumb from '../shared/Breadcrumb';
import { dateFunc } from '../../helper/dateFunc/date';
class Worklistings extends Component {
  materials_search = [];
  constructor(props) {
    super(props);
    this.state = {
      role: '',
      works: [],
      productcats: [],
      productcat: '',
      search: null,
      checked: true,
      left: null,
      right: null,
      currentPage: 1,
      postsPerPage: 10,
      loading: false,
      deleteID: '',
      deleteModal: false,
      lang: localStorage.getItem('_lng'),
    };
    this.loadConfig = this.loadConfig.bind(this);
  }

  componentDidMount = async () => {
    this._isMounted = true;
    this.axiosCancelSource = axios.CancelToken.source();

    this.loadData(this.axiosCancelSource);
    this.loadConfig(this.axiosCancelSource);
    this.loadCategory(this.axiosCancelSource);
  };

  loadData = async (axiosCancelSource) => {
    const token = await localStorage.getItem('token');
    axios
      .get(`${url}/api/work-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        if (this._isMounted) {
          const { role, data } = result.data;
          this.materials_search = data;
          console.log(result);
          this.setState({
            role,
            works: data,
            loading: result.data?.data ? true : false,
          });
          console.log(this.state.works);
        }
      })
      .catch((err) => {
        console.error(err);
        if (axios.isCancel(err)) {
          //console.log("Request canceled", err.message);
        } else {
          //console.log(err.response);
        }
      });
  };

  loadCategory = async (axiosCancelSource) => {
    if (this._isMounted) {
      const token = await localStorage.getItem('token');
      let lang = localStorage.getItem('_lng');
      axios
        .get(`${url}/api/category/${lang}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cancelToken: axiosCancelSource.token,
        })
        .then((result) => {
          this.setState({ productcats: result.data.data });
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            // //console.log("Request canceled", err.message);
          } else {
            //console.log(err.response);
          }
        });
    }
  };

  loadConfig = async (axiosCancelSource) => {
    const token = await localStorage.getItem('token');
    axios
      .get(`${url}/api/config/currency`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
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

  searchSpace = (event) => {
    let keyword = event.target.value;
    this.setState({ search: keyword, currentPage: 1 });
  };

  handleChange = (event) => {
    this.setState({ works: this.materials_search });
    this.setState({ productcat: event.target.value }, () => {
      if (this.state.productcat === '--Select--') {
        // this.loadData(this.axiosCancelSource);
        this.setState((prevstate) => ({
          works: prevstate.works,
        }));
        return true;
      }
      this.setState((prevstate) => ({
        works: prevstate.works.filter((data) => {
          return data.category.includes(this.state.productcat);
        }),
      }));
    });
  };

  handleCheck = (params) => {
    this.setState({ checked: !this.state.checked });
    if (this.state.checked) {
      this.setState({
        works: this.state.works.filter((data) => {
          return data.tender_type.includes('Offer');
        }),
      });
    } else this.loadData(this.axiosCancelSource);
  };

  handleCheck1 = (params) => {
    this.setState({ checked: !this.state.checked });
    if (this.state.checked) {
      this.setState({
        works: this.state.works.filter((data) => {
          return data.tender_type.includes('Request');
        }),
      });
    } else this.loadData(this.axiosCancelSource);
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

  handleDuplicate = (id) => {
    const token = localStorage.getItem('token');
    console.log(`${url}/api/tender/duplicate/${id}`);
    axios
      .get(`${url}/api/tender/duplicate/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  closeModal = () => {
    this.setState({ ...this.state, deleteModal: false });
  };

  render() {
    const { t } = this.props;

    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;

    const productLoop = this.state.productcats
      ? this.state.productcats.map(({ category_id, category_name }, index) => (
          <option value={category_name}>{category_name}</option>
        ))
      : [];

    const items = this.state.works
      ? this.state.works?.filter((data) => {
          if (this.state.search == null) return data;
          else if (
            data?.tender_type
              .toLowerCase()
              .includes(this.state.search.toLowerCase()) ||
            data?.tender_title
              .toLowerCase()
              .includes(this.state.search.toLowerCase())
          ) {
            return data;
          }
        })
      : [];

    const currentPosts = items?.slice(indexOfFirstPost, indexOfLastPost);
    const length = items ? items.length : '';

    const itemsList = currentPosts?.map((work, i) => (
      <tr
        key={work.tender_id}
        className={
          localStorage.getItem('Login_user_role') === 'company' &&
          work.create_by_type === 'Self'
            ? 'compnay'
            : 'employee'
        }
        style={{ background: i % 2 === 0 ? '#f3f3f3' : 'white' }}
      >
        {/* <td style={{ width: "50px" }}> */}

        {localStorage.getItem('Login_user_role') === 'company' ? (
          <td>
            <div className='table-cell'>
              <p className='table-cell-head'>
                {t('marketplace.work.manage_work.listing.Created_by')}
              </p>
              <p className='table-cell-value'>
                {work.create_by_type === 'Self'
                  ? t('marketplace.work.manage_work.listing.Self')
                  : t('marketplace.work.manage_work.listing.Employee')}
              </p>
            </div>
          </td>
        ) : (
          ''
        )}
        {/* <div className="form-check">
            <input type="checkbox" className="form-check-input" id={`check2${work.tender_id}`} />
            <label className="form-check-label" htmlFor={`check2${work.tender_id}`}></label>
          </div> */}
        {/* </td> */}
        <td
          data-label='Title: '
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <div className='table-cell'>
            <p className='table-cell-head'>
              {t('marketplace.work.manage_work.listing.title')}
            </p>
            <p className='table-cell-value'>
              <Link to={`/listing-detail/${work.tender_id}`}>
                <span style={{ color: '#126fbb' }}>{work.tender_title}</span>
              </Link>
              {/* <span>
                {' '}
                {work.tender_type === 'Offer'
                  ? t('c_material_list.listing.offer')
                  : t('c_material_list.listing.request')}
              </span> */}
            </p>
          </div>
        </td>

        <td data-label='Start Date: '>
          <div className='table-cell'>
            <p className='table-cell-head'>
              {t('marketplace.work.manage_work.listing.created_at')}
            </p>
            <p className='table-cell-value'>
              {dateFunc(work.created_at, this.state.lang)}
            </p>
          </div>
        </td>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'>
              {t('marketplace.work.manage_work.listing.status')}
            </p>
            <p className='table-cell-value'>
              {work.expire_status == 'expire' ? (
                <span className='badge badge-warning'>
                  {' '}
                  {t('marketplace.work.manage_work.listing.Expired')}
                </span>
              ) : (
                <span className='badge badge-primary'>
                  {' '}
                  {t('marketplace.work.manage_work.listing.Posted')}
                </span>
              )}
            </p>
          </div>
        </td>
        <td data-label='Current bid: '>
          <div className='table-cell'>
            <p className='table-cell-head'>
              {t('marketplace.work.manage_work.listing.current_bid')}
            </p>
            <p className='table-cell-value'>
              {work.quote
                ? `${this.state.left} ${work.quote} ${this.state.right}`
                : `${this.state.left} 0.00 ${this.state.right}`}
            </p>
          </div>
        </td>
        <td>
          <div className='table-cell'>
            <p className='table-cell-head'></p>
            <p className='table-cell-value'>
              <p className='action-btns-wrap'>
                <Link to={`/listing-detail/edit/${work.tender_id}`}>
                  <Edit style={{ width: '25px', cursor: 'pointer' }} />
                </Link>

                {this.state.deleteModal ? (
                  <Delete
                    id={work.tender_id}
                    value={this.state.deleteID}
                    handleDelete={this.closeModal}
                    name={work.tender_title}
                  />
                ) : (
                  ''
                )}

                <Duplicate
                  onClick={() => this.handleDuplicate(work.tender_id)}
                  style={{
                    width: '25px',
                    marginLeft: '10px',
                    cursor: 'pointer',
                  }}
                />
                {!work.quote ? (
                  <Trash
                    onClick={(e) =>
                      this.setState({
                        ...this.state,
                        deleteID: work.tender_id,
                        deleteModal: true,
                      })
                    }
                    style={{
                      width: '25px',
                      marginLeft: '10px',
                      cursor: 'pointer',
                    }}
                  />
                ) : (
                  ''
                )}
              </p>
            </p>
          </div>
        </td>
      </tr>
    ));

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
            {t('header.work_list')}
          </li>
        </Breadcrumb>
        <div className='main-content'>
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className='page-content'>
            <div className='container-fluid'>
              <h3 className='head3'>
                {' '}
                {t('marketplace.work.manage_work.listing.title1')}{' '}
              </h3>
              <div className='card'>
                <div className='card-body'>
                  <div className='filter'>
                    <div className='row align-items-center'>
                      <div className='col-6 col-md-4'>
                        <div className='form-group'>
                          <label htmlFor='product'>
                            {t('marketplace.work.manage_work.listing.product')}
                          </label>
                          <input
                            id='product'
                            onChange={(e) => this.searchSpace(e)}
                            type='search'
                            className='form-control'
                          />
                        </div>
                      </div>
                      <div className='col-6 col-md-4'>
                        <div className='form-group'>
                          <label htmlFor='productcat'>
                            {t(
                              'marketplace.work.manage_work.listing.product_category'
                            )}
                          </label>
                          <select
                            onChange={this.handleChange}
                            name='productcat'
                            id='productcat'
                            className='form-control'
                          >
                            <option>--Select--</option>
                            {productLoop}
                          </select>
                        </div>
                      </div>
                      <div className='col-12 col-md-4'>
                        <div className='form-group'>
                          <div className='form-check form-check-inline signup-checkbox'>
                            <input
                              onChange={this.handleCheck}
                              type='checkbox'
                              className='form-check-input'
                              id='exampleCheck1'
                            />
                            <label
                              className='form-check-label'
                              htmlFor='exampleCheck1'
                            >
                              {t('marketplace.work.manage_work.listing.offer')}
                            </label>
                          </div>
                          <div className='form-check form-check-inline signup-checkbox'>
                            <input
                              onChange={this.handleCheck1}
                              type='checkbox'
                              className='form-check-input'
                              id='exampleCheck2'
                            />
                            <label
                              className='form-check-label'
                              htmlFor='exampleCheck2'
                            >
                              {t(
                                'marketplace.work.manage_work.listing.request'
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='card'>
                <div className='card-header'>
                  <h2 className='head2'>
                    {t('marketplace.work.manage_work.listing.my_listings')}
                  </h2>
                  <div className='btn-group'>
                    <Link
                      className='btn btn-blue text-uppercase'
                      to='/create-work-list'
                    >
                      {t('marketplace.work.manage_work.listing.create')}
                    </Link>
                  </div>
                </div>
                <div className='card-body'>
                  <div className='table-responsive'>
                    {this.state.loading == false ? (
                      <Spinner animation='border' role='status'>
                        <span className='sr-only'>Loading...</span>
                      </Spinner>
                    ) : (
                      <>
                        <table
                          className='table custom-table'
                          style={{ boxShadow: 'none' }}
                        >
                          <thead>
                            <tr>
                              {localStorage.getItem('Login_user_role') ===
                              'company' ? (
                                <th width='6%'>
                                  {t(
                                    'marketplace.work.manage_work.listing.Created_by'
                                  )}
                                </th>
                              ) : (
                                ''
                              )}
                              <th>
                                {t(
                                  'marketplace.work.manage_work.listing.title'
                                )}
                              </th>
                              <th>
                                {t(
                                  'marketplace.work.manage_work.listing.created_at'
                                )}
                              </th>
                              <th>
                                {t(
                                  'marketplace.work.manage_work.listing.status'
                                )}
                              </th>
                              <th>
                                {t(
                                  'marketplace.work.manage_work.listing.current_bid'
                                )}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {' '}
                            {this.state.loading == true ? itemsList : ''}
                          </tbody>
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
                      </>
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

export default withTranslation()(Worklistings);
