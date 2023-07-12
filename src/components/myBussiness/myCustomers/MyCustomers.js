import React, { Component } from 'react';
import axios from 'axios';
import Header from '../../shared/Header';
import { Link } from 'react-router-dom';
import BussinessSidebar from '../../shared/BussinessSidebar';
import { Helper, url } from '../../../helper/helper';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { withTranslation } from 'react-i18next';
import { Prompt } from 'react-router';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import SweetAlert from 'react-bootstrap-sweetalert';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Breadcrumb from '../../shared/Breadcrumb';
import Sidebar from '../../shared/Sidebar';
import { getData } from '../../../helper/api';
class MyResources extends Component {
  state = {
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    company: '',
    type: 'Client',
    payment_t: '',
    payment_days: '',
    phone_err: '',
    type_err: false,
    success: 0,
    loading: false,
    errors: null,
    email_unq: null,
    succes: false,
    disable: false,
    country_id: '',
    country_code: '',
  };

  componentDidMount = (params) => {
    this.loadAcc();
    this.selectCountry(this.state.country_id);
    this._isMounted = true;
    this.axiosCancelSource = axios.CancelToken.source();

    this.myRef = React.createRef();
    this.loadData(this.axiosCancelSource);
    this.interval = setInterval(() => {
      this.checkallfields();
    }, 1000);
    this.setState({
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      company: '',
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.country_id !== this.state.country_id) {
      this.selectCountry(this.state.country_id);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this._isMounted = false;
  }

  loadAcc = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/account`, token).then((result) => {
      if (result.data[0]) {
        const acc = result.data[0];
        this.setState({
          country_id: acc.address_country,
        });
      }
    });
  };

  selectCountry = (id) => {
    if (id === 72) {
      this.setState({
        country_code: 'fi',
      });
    } else if (id === 67) {
      this.setState({
        country_code: 'ee',
      });
    } else if (id === 195) {
      this.setState({
        country_code: 'es',
      });
    }
  };

  loadData = async () => {
    if (this.props.match.params.id) {
      const token = await localStorage.getItem('token');
      axios
        .get(`${url}/api/resource/${this.props.match.params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          //console.log("result", result.data.data);
          const {
            first_name,
            last_name,
            email,
            company,
            type,
            phone,
            payment_t,
          } = result.data.data;
          this.setState({
            first_name: first_name,
            last_name: last_name,
            email: email,
            company: company,
            type: type,
            payment_t: payment_t,
            phone,
            disable: true,
          });
          // NotificationManager.success(' Form Submit Success ');
        })
        .catch((err) => {
          //console.log(err);
        });
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ email_unq: null, errors: null });

    const token = await localStorage.getItem('token');
    this.setState({ loading: true });
    const data = new FormData();
    data.set('first_name', this.state.first_name);
    data.set('last_name', this.state.last_name);
    data.set('phone', this.state.phone);
    data.set('email', this.state.email);
    data.set('company', this.state.company);
    data.set('type', this.state.type);
    data.set('payment_days', this.state.payment_days);
    data.set('payment_t', this.state.payment_t);

    axios
      .post(`${url}/api/resources`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        //console.log("error_same_mail", res.data.error_same_mail);
        if (res.data?.error_same_mail) {
          this.setState({
            email_unq: res.data?.error_same_mail,
            loading: false,
          });
        }
        if (!res.data?.error_same_mail) {
          this.setState({
            success: 1,
            first_name: '',
            last_name: '',
            phone: '',
            email: '',
            company: '',
            type: '',
            phone_err: '',
            loading: false,
            succes: 'Your Request have been submit succesfully',
            redirect_page: false,
          });
          const { t, i18n } = this.props;
          this.myRef.current.scrollTo(0, 0);
          NotificationManager.success(t('myBusiness.client.form_submit'));
          // {t("mycustomer.success1")}
        }
        // this.props.history.push("/customers-list");
      })
      .catch((err) => {
        this.setState({ loading: false });
        if (err.response.status === 401) {
          if (err.response.data.error.phone) {
            this.setState({
              phone_err: err.response.data.error.phone[0],
            });
          }
        }
        // //console.log("err",err);
        // if (err.response.status === 406) {
        //   if (err.response.data.error.email) {
        //     this.setState({
        //       email_unq: err.response.data.error.email[0],
        //     });
        //   }
        // }
        // if (err.response.status === 500) {
        //   this.setState({ errors: "Some Issue Occured" });
        // }
        this.setState({ success: 2 });
        this.myRef.current.scrollTo(0, 0);
      });
  };

  handleUpdate = async (event) => {
    event.preventDefault();
    const token = await localStorage.getItem('token');
    this.setState({ loading: true });
    const params = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      company: this.state.company,
      type: this.state.type,
      phone: this.state.phone,
      payment_days: this.state.payment_days,
      payment_t: this.state.payment_t,
    };

    axios
      .put(`${url}/api/resource/update/${this.props.match.params.id}`, null, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.setState({
          success: 1,
          loading: false,
          succes: 'Your Request have been submit succesfully',
          redirect_page: false,
          first_name: '',
          last_name: '',
          email: '',
          company: '',
          phone: '',
        });
        this.myRef.current.scrollTo(0, 0);
      })
      .catch((err) => {
        if (err.response.status === 406) {
          if (err.response.data.error.email) {
            this.setState({
              email_unq: err.response.data.error.email[0],
            });
          }
        }
        this.setState({ loading: false, redirect_page: false });
      });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    if (value === 'Henkilöasiakas' || value === 'Consumer customer') {
      this.setState({
        payment_days: 14,
      });
    } else if (value === 'Yritysasiakas' || value === 'Business') {
      this.setState({
        payment_days: 7,
      });
    }
  };

  checkallfields() {
    if (
      this.state.first_name ||
      this.state.last_name ||
      this.state.email ||
      this.state.company
    ) {
      this.setState({
        redirect_page: true,
      });
    } else {
      this.setState({
        redirect_page: false,
      });
    }
  }

  onConfirmError = () => {
    this.setState({
      server: false,
      validation: false,
      success: false,
      redirect_page: false,
      state: '',
    });
    this.props.history.push('/customers-list');
  };

  render() {
    const { t, i18n } = this.props;

    let alert, loading;
    if (this.state.loading === true) {
      loading = (
        <Spinner animation='border' role='status'>
          <span className='sr-only'> {t('myBusiness.client.Loading')} </span>
        </Spinner>
      );
    }
    if (this.state.success === 1) {
      alert = (
        <Alert variant='success' style={{ fontSize: '13px' }}>
          {this.props.match.params.id
            ? t('myBusiness.client.cus_upd')
            : t('myBusiness.client.cus_ins')}
        </Alert>
      );
    } else if (this.state.success === 2 && this.state.errors) {
      alert = (
        <Alert variant='danger' style={{ fontSize: '13px' }}>
          {Object.entries(this.state.errors).map(([key, value]) => {
            const stringData = value.reduce((result, item) => {
              return `${item} `;
            }, '');
            return stringData;
          })}
        </Alert>
      );
    }
    const { succes, payment_t, payment_days, phone_err } = this.state;
    //console.log(payment_t, payment_days);
    console.log(this.state.country_code, this.state.country_id);
    return (
      <React.Fragment>
        <Prompt
          when={this.state.redirect_page}
          message={t('myBusiness.client.leave_page')}
        />
        <div>
          {/* <Header active={'bussiness'} /> */}
          <Breadcrumb>
            <Link
              to='/business-dashboard'
              className='breadcrumb-item active'
              aria-current='page'
            >
              {t('myBusiness.client.heading')}
            </Link>
            <li className='breadcrumb-item active' aria-current='page'>
              {t('myBusiness.client.heading_2')}
            </li>
          </Breadcrumb>
          <div className='main-content'>
            <Sidebar dataFromParent={this.props.location.pathname} />
            <div ref={this.myRef} className='page-content'>
              {alert ? alert : null}
              {succes ? (
                <SweetAlert
                  success
                  closeOnClickOutside={true}
                  title={t('myBusiness.client.SuccessPopup')}
                  // title={t("mycustomer.success")}
                  onConfirm={this.onConfirmError}
                >
                  {/* {t("translation.success.SuccessPopup")}   */}
                </SweetAlert>
              ) : (
                ''
              )}

              <NotificationContainer />
              <div className='container-fluid'>
                <h3 className='head3'>
                  {t('myBusiness.client.create_customers')}
                </h3>

                <div className='card custom-card'>
                  <form
                    onSubmit={
                      this.props.match.params.id
                        ? this.handleUpdate
                        : this.handleSubmit
                    }
                  >
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-12 col-md-6'>
                          <div className='form-group'>
                            <label htmlFor='first_name'>
                              {t('myBusiness.client.first_name')}
                            </label>
                            <input
                              id='first_name'
                              name='first_name'
                              onChange={this.handleChange}
                              className='form-control'
                              type='text'
                              value={this.state.first_name}
                              required
                              autoFocus={true}
                            />
                          </div>
                        </div>
                        <div className='col-12 col-md-6'>
                          <div className='form-group'>
                            <label htmlFor='last_name'>
                              {t('myBusiness.client.last_name')}
                            </label>
                            <input
                              id='last_name'
                              name='last_name'
                              onChange={this.handleChange}
                              className='form-control'
                              type='text'
                              value={this.state.last_name}
                              required
                            />
                          </div>
                        </div>
                        <div className='col-12 col-md-6'>
                          <div className='form-group'>
                            <label htmlFor='email'>
                              {t('myBusiness.client.email')}
                            </label>
                            <input
                              id='email'
                              name='email'
                              onChange={this.handleChange}
                              className='form-control'
                              type='email'
                              value={this.state.email}
                              required
                              readOnly={this.props.match?.url != '/mycustomers'}
                            />
                            <p style={{ color: '#eb516d ' }}>
                              {this.state.email_unq
                                ? this.state.email_unq
                                : null}
                            </p>
                          </div>
                        </div>
                        <div className='col-12 col-md-6'>
                          <div className='form-group'>
                            <label htmlFor='m-payment'>
                              {' '}
                              {t('myBusiness.client.payment_t')}{' '}
                            </label>
                            <select
                              value={this.state.mat_pay}
                              onChange={this.handleChange}
                              name='payment_t'
                              id='m-payment'
                              required
                              className='form-control'
                            >
                              <option value=''>
                                {t('myBusiness.client.Select')}{' '}
                              </option>
                              <option value='Consumer customer'>
                                {' '}
                                {t('myBusiness.client.consumer_c')}{' '}
                              </option>
                              <option value='Business'>
                                {' '}
                                {t('myBusiness.client.busines')}{' '}
                              </option>
                            </select>
                            <p style={{ color: '#eb516d ' }}>
                              {this.state.mat_pay_err === true
                                ? 'Payment is required'
                                : null}
                            </p>
                          </div>
                        </div>
                        <div className='col-12 col-md-6'>
                          <div className='form-group'>
                            <label htmlFor='company'>
                              {t('myBusiness.client.phone')}
                            </label>
                            {/* <input
                            id="phone"
                            name="phone"
                            onChange={this.handleChange}
                            className="form-control"
                            type="text"
                            value={this.state.phone}
                            required
                            maxLength="18"
                          /> */}
                            <PhoneInput
                              // containerClass="custom_sign"
                              searchClass='custon_cust'
                              className='form-control'
                              country={
                                this.state.country_code
                                  ? this.state.country_code
                                  : ''
                              }
                              //enableAreaCodes={true}
                              //autoFormat={true}
                              //countryCodeEditable={false}
                              onChange={(phone) => this.setState({ phone })}
                              value={this.state.phone ? this.state.phone : ''}
                            />
                            {phone_err ? (
                              <p style={{ color: 'red', fontSize: '15px' }}>
                                {' '}
                                {phone_err}{' '}
                              </p>
                            ) : (
                              ''
                            )}
                          </div>
                          {/* </div> */}
                        </div>

                        {this.state.payment_t === 'Business' ? (
                          <div className='col-12 col-md-6'>
                            <div className='form-group'>
                              <label htmlFor='company'>
                                {t('myBusiness.client.company')}
                              </label>
                              <input
                                id='company'
                                name='company'
                                onChange={this.handleChange}
                                className='form-control'
                                type='text'
                                value={this.state.company}
                                required
                              />
                            </div>
                          </div>
                        ) : (
                          ''
                        )}

                        <div
                          className={`col-12 col-md-6 ${
                            this.state.payment_t === 'Consumer customer'
                              ? ''
                              : ''
                          }`}
                        >
                          {payment_t === 'Henkilöasiakas' ||
                          payment_t === 'Consumer customer' ? (
                            <div className='form-group'>
                              <label htmlFor='company'>
                                {' '}
                                {t('myBusiness.client.days_c')}
                              </label>

                              <input
                                id='payment_days'
                                name='payment_days'
                                onChange={this.handleChange}
                                className='form-control'
                                type='number'
                                value={this.state.payment_days}
                                required
                              />
                            </div>
                          ) : payment_t === 'Yritysasiakas' ||
                            payment_t === 'Business' ? (
                            <div className='form-group'>
                              <label htmlFor='company'>
                                {t('myBusiness.client.days_c')}
                              </label>

                              <input
                                id='payment_days'
                                name='payment_days'
                                onChange={this.handleChange}
                                className='form-control'
                                type='number'
                                value={this.state.payment_days}
                                required
                              />
                            </div>
                          ) : (
                            ''
                          )}
                          {/* </>
                            : ""} */}
                        </div>
                        {this.state.phone_err ? (
                          <p style={{ color: '#eb516d ' }}>
                            {this.state.phone_err === true
                              ? 'Phone Number is required'
                              : null}
                          </p>
                        ) : null}

                        <div className='col-12'>
                          <button className='btn btn-success'>
                            {loading ? loading : ''}{' '}
                            {this.props.match.params.id
                              ? t('myBusiness.client.Update')
                              : t('myBusiness.client.Create')}
                            {/* "Create" */}
                          </button>
                          {/* )} */}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withTranslation()(MyResources);
