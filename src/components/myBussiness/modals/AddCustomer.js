import React, { Component } from 'react';
import axios from 'axios';
import { url } from '../../../helper/helper';
import { withTranslation } from 'react-i18next';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import Spinner from 'react-bootstrap/Spinner';
import { postDataWithToken } from '../../../helper/api';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { getData } from '../../../helper/api';
class AddCustomer extends Component {
  state = {
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    company: '',
    type: 'Client',
    payment_t: '',
    payment_days: '',
    type_err: false,
    success: 0,
    succes: false,
    errors: [],
    phone_err: '',
    country_id: '',
    country_code: '',
  };

  componentDidMount = () => {
    this._isMounted = true;
    this.loadData();
    this.selectCountry(this.state.country_id);
    // this.props.relod();
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.country_id !== this.state.country_id) {
      this.selectCountry(this.state.country_id);
    }
  }

  loadData = async () => {
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

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.state.type === '' || this.state.type === '--Select--') {
      this.setState({ type_err: true });
    }
    if (this.state.first_name == '') {
      return this.setState({
        first_name_err: true,
      });
    } else {
      this.setState({
        first_name_err: '',
      });
    }
    if (this.state.last_name == '') {
      return this.setState({
        last_name_err: true,
      });
    } else {
      this.setState({
        last_name_err: '',
      });
    }
    if (this.state.email == '') {
      return this.setState({
        email_err: true,
      });
    } else {
      this.setState({
        email_err: '',
      });
    }
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!this.state.email || reg.test(this.state.email) === false) {
      this.setState({ email_err: 'Email Field is Invalid' });
      return true;
    } else {
      // return false;
      this.setState({
        email_err: '',
      });
    }
    // if (this.state.company == "") {
    //   return this.setState({
    //     company_err: true
    //   })
    // } else {
    //   this.setState({
    //     company_err: ""
    //   })
    // }
    // if (this.state.phone.length < 6) {
    //   return this.setState({
    //     phone_err: true
    //   })
    // } else {
    //   this.setState({
    //     phone_err: ""
    //   })
    // }
    this.setState({ loading: true });
    const token = await localStorage.getItem('token');

    const data = new FormData();
    data.set('first_name', this.state.first_name);
    data.set('last_name', this.state.last_name);
    data.set('phone', this.state.phone);
    data.set('email', this.state.email);
    data.set('company', this.state.company);
    data.set('type', this.state.type);
    data.set('payment_days', this.state.payment_days);
    data.set('payment_t', this.state.payment_t);
    await postDataWithToken(`${url}/api/resources`, data, token)
      .then((res) => {
        //console.log("res", res.data.error_same_mail);
        if (res.data?.error_same_mail == 'Email already exist') {
          const { t } = this.props;
          this.setState({
            email_err: t('account.first_name'),
            loading: false,
          });
        } else {
          this.setState({
            success: 1,
            first_name: '',
            last_name: '',
            phone: '',
            email: '',
            company: '',
            succes: true,
            loading: false,
            phone_err: '',
          });
        }
        // alert("Created!");
        this.props.addCus();
        this.props.handleClose();
      })
      .catch((err) => {
        if (err.response.status === 401) {
          if (err.response.data.error.phone) {
            this.setState({
              phone_err: err.response.data.error.phone[0],
              loading: false,
            });
          }
        }
        //console.log("=======", err);
      });
  };

  onConfirmError = () => {
    this.setState({ server: false, validation: false, succes: false });
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

  render() {
    const { t } = this.props;
    const { succes, payment_t, payment_days, phone_err } = this.state;
    const { show, handleClose } = this.props;
    return (
      <div>
        {succes ? (
          <SweetAlert
            success
            closeOnClickOutside={true}
            title={t('login.SuccessPopup')}
            // title={t("list_details.success1")}
            onConfirm={this.onConfirmError}
          >
            {/* {t("list_details.success")} */}
          </SweetAlert>
        ) : (
          ''
        )}
        {/* <div
          className="modal fade"
          id="add-cus"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="editInfoModalLabel"
          aria-hidden="true"
        > */}
        <Modal
          isOpen={show}
          toggle={() => handleClose()}
          className={'modalPropu'}
          centered
        >
          <ModalHeader toggle={() => handleClose()}>
            {t('account.Add_Customer')}
          </ModalHeader>
          <ModalBody>
            <form onSubmit={this.handleSubmit}>
              <div className='row'>
                <div className='col-md-6'>
                  <div className='form-group'>
                    <label htmlFor='first_name'>
                      {t('account.first_name')}
                    </label>
                    <input
                      id='first_name'
                      name='first_name'
                      onChange={this.handleChange}
                      className='form-control'
                      type='text'
                      value={this.state.first_name}
                      required
                    />
                    <p style={{ color: '#eb516d ' }}>
                      {this.state.first_name_err === true
                        ? 'First name is required'
                        : null}
                    </p>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className='form-group'>
                    <label htmlFor='last_name'>{t('account.last_name')}</label>
                    <input
                      id='last_name'
                      name='last_name'
                      onChange={this.handleChange}
                      className='form-control'
                      type='text'
                      value={this.state.last_name}
                      required
                    />
                    <p style={{ color: '#eb516d ' }}>
                      {this.state.last_name_err
                        ? 'Last name is required'
                        : null}
                    </p>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className='form-group'>
                    <label htmlFor='email'>{t('account.email')}</label>
                    <input
                      id='email'
                      name='email'
                      onChange={this.handleChange}
                      className='form-control'
                      type='email'
                      value={this.state.email}
                      required
                    />
                    <p style={{ color: '#eb516d ' }}>
                      {this.state.email_err ? this.state.email_err : null}
                    </p>
                  </div>
                </div>

                <div className='col-md-6'>
                  <div className='form-group'>
                    <label htmlFor='m-payment'>
                      {' '}
                      {t('mycustomer.payment_t')}{' '}
                    </label>
                    <select
                      // value={this.state.mat_pay}
                      onChange={this.handleChange}
                      name='payment_t'
                      id='m-payment'
                      // required
                      className='form-control'
                    >
                      <option value=''>{t('myagreement.Select')} </option>
                      <option value='Consumer customer'>
                        {' '}
                        {t('mycustomer.consumer_c')}{' '}
                      </option>
                      <option value='Business'>
                        {' '}
                        {t('mycustomer.busines')}{' '}
                      </option>
                    </select>
                    <p style={{ color: '#eb516d ' }}>
                      {this.state.mat_pay_err === true
                        ? 'Payment is required'
                        : null}
                    </p>
                  </div>
                </div>

                <div className='col-md-6'>
                  {/* <div className="form-group"> */}
                  <label htmlFor='company' className='custon_phn'>
                    {t('account.phone')}
                  </label>
                  {/* </div> */}
                  {/* <input
                          id="phone"
                          name="phone"
                          onChange={this.handleChange}
                          className="form-control"
                          type="text"
                          value={this.state.phone}
                        /> */}
                  <PhoneInput
                    country={this.state.country_code}
                    enableAreaCodes={true}
                    countryCodeEditable={false}
                    onChange={(phone) => this.setState({ phone })}
                    value={this.state.phone}
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

                {this.state.payment_t === 'Business' ? (
                  <div className='col-md-6'>
                    <div className='form-group'>
                      <label htmlFor='company'>{t('account.company')}</label>
                      <input
                        id='company'
                        name='company'
                        onChange={this.handleChange}
                        className='form-control'
                        type='text'
                        value={this.state.company}
                        // required
                      />
                      <p style={{ color: '#eb516d ' }}>
                        {this.state.company_err ? 'Company is required' : null}
                      </p>
                    </div>
                  </div>
                ) : (
                  ''
                )}

                <div className='col-md-6'>
                  {payment_days ? (
                    <>
                      {payment_t === 'Henkilöasiakas' ||
                      payment_t === 'Consumer customer' ? (
                        <div>
                          <div className='form-group' style={{ margin: '0px' }}>
                            <label htmlFor='company'>
                              {' '}
                              {t('mycustomer.days_c')}
                            </label>

                            <input
                              id='payment_days'
                              name='payment_days'
                              onChange={this.handleChange}
                              className='form-control'
                              type='text'
                              value={this.state.payment_days}
                              // required
                            />
                          </div>
                        </div>
                      ) : payment_t === 'Yritysasiakas' ||
                        payment_t === 'Business' ? (
                        <div>
                          <div className='form-group' style={{ margin: '0px' }}>
                            <label htmlFor='company'>
                              {t('mycustomer.days_c')}
                            </label>
                            <input
                              id='payment_days'
                              name='payment_days'
                              onChange={this.handleChange}
                              className='form-control'
                              type='text'
                              value={this.state.payment_days}
                              // required
                            />
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                    </>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              {this.state.loading ? (
                <Spinner animation='border' role='status'>
                  <span className='sr-only'> {t('success.Loading')} </span>
                </Spinner>
              ) : (
                <button className='btn btn-primary mt-3'>
                  {t('mycustomer.Submit')}
                </button>
              )}
            </form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(AddCustomer);
