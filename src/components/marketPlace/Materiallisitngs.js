import React, { Component } from 'react';
import axios from 'axios';
// import { Redirect } from "react-router-dom";
import Header from '../shared/Header';
import Sidebar from '../shared/Sidebar';
import { Helper, url } from '../../helper/helper';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import { HashRouter as Router, Link } from 'react-router-dom';
import Pagination from '../myBussiness/pagination/pagination';
import Spinner from 'react-bootstrap/Spinner';
import { ReactComponent as Trash } from '../../images/trash.svg';
import { ReactComponent as Edit } from '../../images/edit.svg';
import { ReactComponent as Duplicate } from '../../images/duplicate.svg';
import SweetAlert from 'react-bootstrap-sweetalert';
import Delete from './listingdetails/Modals/Delete';
import Breadcrumb from '../shared/Breadcrumb';
import { getData } from '../../helper/api';
import { dateFunc } from '../../helper/dateFunc/date';
class Materiallisitngs extends Component {
  materials_search = [];
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      role: '',
      materials: [],
      productcats: [],
      productcat: '',
      search: null,
      checked: true,
      left: null,
      right: null,
      loading: false,
      currentPage: 1,
      postsPerPage: 10,
      allChecked: false,
      deleteModal: false,
      deleteID: '',
      lang: localStorage.getItem('_lng'),
    };
  }

  componentDidMount = () => {
    this._isMounted = true;
    this.loadData();
    this.loadConfig();
    this.loadCategory();
  };
  componentWillUnmount = () => {
    this._isMounted = false;
  };

  loadData = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/material-list`, token)
      .then((result) => {
        //alert(result);
        console.log(result);
        const { role, data } = result.data;

        this.materials_search = data;
        this.setState({
          role,
          materials: data,
          loading: result?.data?.data ? true : false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  loadConfig = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/config/currency`, token)
      .then((result) => {
        const { left, right } = result.data;
        this.setState({ left, right });
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  loadCategory = async () => {
    let lang = await localStorage.getItem('_lng');
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/category/${lang}`, token)
      .then((result) => {
        this.setState({ productcats: result.data.data });
      })
      .catch((err) => {});
  };

  searchSpace = (event) => {
    let keyword = event.target.value;
    this.setState({ search: keyword, currentPage: 1 });
  };

  handleChange = (event) => {
    this.setState({ materials: this.materials_search });
    this.setState({ productcat: event.target.value }, () => {
      if (this.state.productcat == '--Select--') {
        this.setState((prevstate) => ({
          materials: prevstate.materials,
        }));
        return true;
      }
      this.setState((prevstate) => ({
        materials: prevstate.materials.filter((data) => {
          return data.category.includes(this.state.productcat);
        }),
      }));
    });
  };

  handleCheck = (params) => {
    this.setState({ checked: !this.state.checked });
    if (this.state.checked) {
      this.setState({
        materials: this.state.materials.filter((data) => {
          return data.tender_type.includes('Offer');
        }),
      });
    } else this.loadData();
  };

  handleCheck1 = (params) => {
    this.setState({ checked: !this.state.checked });
    if (this.state.checked) {
      this.setState({
        materials: this.state.materials.filter((data) => {
          return data.tender_type.includes('Request');
        }),
      });
    } else this.loadData();
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

  handleDuplicate = async (id) => {
    const token = localStorage.getItem('token');
    await getData(`${url}/api/tender/duplicate/${id}`, token)
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
    const { t, i18n } = this.props;
    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;

    const productLoop = this.state.productcats
      ? this.state.productcats?.map(({ category_id, category_name }, index) => (
          <option key={index} value={category_name}>
            {category_name}
          </option>
        ))
      : [];
    //console.log("moment()._i", moment()._d);
    const items = this.state.materials
      ? this.state.materials.filter((data) => {
          if (this.state.search == null) return data;
          else if (
            data.tender_type
              .toLowerCase()
              .includes(this.state.search.toLowerCase()) ||
            data.tender_title
              .toLowerCase()
              .includes(this.state.search.toLowerCase())
          ) {
            return data;
          }
        })
      : [];

    const currentPosts = items?.slice(indexOfFirstPost, indexOfLastPost);
    const length = items ? items.length : '';

    const itemsList = currentPosts
      ? currentPosts.map((material, index) => (
          <tr
            key={material.tender_id}
            className={
              localStorage.getItem('Login_user_role') === 'company' &&
              material.create_by_type === 'Self'
                ? 'compnay'
                : 'employee'
            }
            style={{ background: index % 2 === 0 ? '#f3f3f3' : 'white' }}
          >
            {/* {index + 1} */}
            {/* <div className="form-check" >
              <input
              type="checkbox"
              className="form-check-input"
              // id="check2"
              id={`check2${material.tender_id}`}
              />
              <label className="form-check-label" htmlFor={`check2${material.tender_id}`}></label>
            </div> */}
            {localStorage.getItem('Login_user_role') === 'company' ? (
              <td>
                <div className='table-cell'>
                  <p className='table-cell-head'>
                    {t(
                      'marketplace.material.manage_material.listing.Created_by'
                    )}
                  </p>
                  <p className='table-cell-value'>
                    {material.create_by_type === 'Self'
                      ? t('marketplace.material.manage_material.listing.Self')
                      : t(
                          'marketplace.material.manage_material.listing.Employee'
                        )}
                  </p>
                </div>
              </td>
            ) : (
              ''
            )}
            <td
              data-label='Title: '
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              {/* <Link to={`/listing-detail/${material.tender_id}`}>
              <span style={{ color: '#126fbb' }}>
                {material.tender_title}
              </span>
            </Link> */}
              {/* <span>
                {material.tender_type === 'Offer'
                  ? t('c_material_list.listing.offer')
                  : t('c_material_list.listing.request')}
              </span> */}
              <div className='table-cell'>
                <p className='table-cell-head'>
                  {t('marketplace.material.manage_material.listing.title')}
                </p>
                <p className='table-cell-value'>
                  <Link to={`/listing-detail/${material.tender_id}`}>
                    <span style={{ color: '#126fbb' }}>
                      {material.tender_title}
                    </span>
                  </Link>
                </p>
              </div>
            </td>

            <td data-label='Start Date: '>
              <div className='table-cell'>
                <p className='table-cell-head'>
                  {t('marketplace.material.manage_material.listing.created_at')}
                </p>
                <p className='table-cell-value'>
                  {dateFunc(material.created_at, this.state.lang)}
                </p>
              </div>
            </td>
            <td>
              {/* {material.tender_expiry_date ?  */}
              {/* {this.get(material.tender_expiry_date)}   */}
              {/* {moment().format('DD-MM-yyyy hh:mm:ss')}   ===  {moment(material.tender_expiry_date).format('MM-DD-yyyy hh:mm:ss')} */}
              {/* {moment(material.tender_expiry_date).format('DD-MM-yyyy hh:mm:ss') > moment().format('DD-MM-yyyy hh:mm:ss') ? "aa" : "bb"} */}
              {/* {material.expire_status} */}
              <div className='table-cell'>
                <p className='table-cell-head'>
                  {t('marketplace.material.manage_material.listing.status')}
                </p>
                <p className='table-cell-value'>
                  {material.expire_status == 'expire' ? (
                    <span className='badge badge-warning'>
                      {t(
                        'marketplace.material.manage_material.listing.Expired'
                      )}{' '}
                    </span>
                  ) : (
                    <span className='badge badge-primary'>
                      {' '}
                      {t(
                        'marketplace.material.manage_material.listing.Posted'
                      )}{' '}
                    </span>
                  )}
                </p>
              </div>
            </td>
            <td data-label='Current bid: '>
              <div className='table-cell'>
                <p className='table-cell-head'>
                  {t(
                    'marketplace.material.manage_material.listing.current_bid'
                  )}
                </p>
                <p className='table-cell-value'>
                  {material.quote
                    ? `${this.state.left} ${material.quote} ${this.state.right}`
                    : `${this.state.left} 0.00  ${this.state.right}`}
                </p>
              </div>
            </td>
            <td>
              <div className='table-cell'>
                <p className='table-cell-head'></p>
                <p className='table-cell-value'>
                  <p className='action-btns-wrap'>
                    <Link to={`/listing-detail/edit/${material.tender_id}`}>
                      <Edit style={{ width: '25px', cursor: 'pointer' }} />
                    </Link>

                    {this.state.deleteModal ? (
                      <Delete
                        id={material.tender_id}
                        value={this.state.deleteID}
                        handleDelete={this.closeModal}
                        name={material.tender_title}
                      />
                    ) : (
                      ''
                    )}

                    <Duplicate
                      onClick={() => this.handleDuplicate(material.tender_id)}
                      style={{
                        width: '25px',
                        marginLeft: '10px',
                        cursor: 'pointer',
                      }}
                    />
                    {!material.quote ? (
                      <Trash
                        onClick={(e) =>
                          this.setState({
                            ...this.state,
                            deleteID: material.tender_id,
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
          /*  <td data-label="View: ">
           <Link
             to={{
               pathname: `/listing-detail/${material.tender_id}`,
             }}
             className="btn btn-info"
           >
             {t("c_material_list.listing.Details")}
           </Link>
         </td> */
        ))
      : [];

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
            {t(
              'marketplace.material.manage_material.listing.material_listings'
            )}
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
                      <div className='col-6 col-md-4'>
                        <div className='form-group'>
                          <label htmlFor='product'>
                            {t(
                              'marketplace.material.manage_material.listing.product'
                            )}
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
                              'marketplace.material.manage_material.listing.product_category'
                            )}
                          </label>
                          <select
                            onChange={this.handleChange}
                            name='productcat'
                            id='productcat'
                            className='form-control'
                          >
                            <option>
                              {' '}
                              {t(
                                'marketplace.material.manage_material.listing.Select'
                              )}
                            </option>
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
                              {t(
                                'marketplace.material.manage_material.listing.offer'
                              )}
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
                                'marketplace.material.manage_material.listing.request'
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
                    {t(
                      'marketplace.material.manage_material.listing.my_listings'
                    )}
                  </h2>
                  <div className='btn-group'>
                    <Link
                      className='btn btn-blue text-uppercase'
                      to='/create-material-list'
                    >
                      {t('marketplace.material.manage_material.listing.create')}
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
                                    'marketplace.material.manage_material.listing.Created_by'
                                  )}
                                </th>
                              ) : (
                                ''
                              )}
                              {/* <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="check1"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="check1"
                              ></label>
                             
                            </div> */}
                              <th>
                                {t(
                                  'marketplace.material.manage_material.listing.title'
                                )}
                              </th>
                              <th>
                                {t(
                                  'marketplace.material.manage_material.listing.created_at'
                                )}
                              </th>
                              <th>
                                {t(
                                  'marketplace.material.manage_material.listing.status'
                                )}
                              </th>
                              <th>
                                {t(
                                  'marketplace.material.manage_material.listing.current_bid'
                                )}
                              </th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.loading == true ? itemsList : ''}{' '}
                          </tbody>
                        </table>
                        {length > 10 ? (
                          <div className='row' style={{ width: '100%' }}>
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
                    {/* { this.state.loading == false ?  <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                      </Spinner> :  ""} */}
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

export default withTranslation()(Materiallisitngs);
