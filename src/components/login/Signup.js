import React, { Component } from 'react';
// import EmailId from "../marketPlace/EmailId";
import Button from '../shared/Button';
import Logo from '../../images/Full-Logo-lighter.png';
import axios from 'axios';
import { url, web_url } from '../../helper/helper';
import Alert from 'react-bootstrap/Alert';
import { withTranslation } from 'react-i18next';
import { Link, Redirect } from 'react-router-dom';
import './signup.css';
import Spinner from 'react-bootstrap/Spinner';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import i18n from '../../locales/i18n';
import { getData, postDataWithToken, postData } from '../../helper/api';
import ReactFlagsSelect from 'react-flags-select';

class Signup extends Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('token');
    // //console.log(token);
    let loggedIn = true;

    if (token === null) {
      loggedIn = false;
    }
    if (token) {
      this.state = {
        loggedIn,
      };
    }
  }

  state = {
    loggedIn: false,
    first_name: '',
    last_name: '',
    email: '',
    country: '',
    phone: '',
    username: '',
    password: '',
    type: '',
    c_password: '',
    subtype: '',
    errors: [],
    show_errors: false,
    status: null,
    isChecked: false,
    loading: false,
    userName_error: '',
    userNameStatus: '',
    complete: !!this.props.complete || false,
    confirmation: false,
    promo: '',
    countries: [],
    country_id: '',
    lang: localStorage.getItem('_lng'),
    code: '',
    packages: [],
    package_id: '',
    change: false,
    package_price: '',
    package_term_period: '',
    allErrors: {
      first_name: '',
      last_name: '',
      email: '',
      country_id: '',
      phone: '',
      password: '',
      c_password: '',
      package_id: '',
      subtype: '',
    },
  };

  getData = async () => {
    const lang = localStorage.getItem('_lng');
    const res = await getData(`${url}/api/country/${lang}`);
    this.setState({
      countries: res?.data?.data,
    });
  };

  componentDidMount() {
    const lang = localStorage.getItem('_lng');
    const params = this.props.history.location.search;
    const urlParams = new URLSearchParams(params);
    const packageId = urlParams.get('id');
    const userType = urlParams.get('usertype');
    const countryId = urlParams.get('countryId');
    const languageId = urlParams.get('language');
    this.setState({
      package_id: packageId ? Number(packageId) : null,
      subtype: userType ? userType : null,
      country_id: countryId ? countryId : null,
      lang: languageId ? languageId : 'fi',
      params: params ? true : false,
    });

    this.getData();

    if (lang) {
      this.onSelect();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const lang = localStorage.getItem('_lng');
    const params = this.props.history.location.search;
    const urlParams = new URLSearchParams(params);
    const countryId = urlParams.get('countryId');
    const languageId = urlParams.get('language');
    console.log(countryId);
    if (prevState.lang !== lang && !params) {
      this.setState({
        lang: lang,
      });

      this.onSelect();
      // this.packageSelection(this.state.subtype);
    }
    if (prevState.country_id === undefined) {
      this.setState({
        country_id: countryId,
      });
      // this.packageSelection(this.state.subtype);
    }
    if (prevState.params !== this.state.params) {
      this.setState({
        lang: languageId,
      });

      this.changeLanguage(this.state.lang);
      // this.packageSelection(this.state.subtype);
    }

    if (
      prevState.country_id !== this.state.country_id &&
      this.state.params === false
    ) {
      this.setState({
        country_id:
          this.state.country === 'FI'
            ? 72
            : this.state.country === 'ES'
            ? 195
            : this.state.country === 'EE'
            ? 67
            : null,
      });

      // this.packageSelection(this.state.subtype);
    }

    if (
      this.state.params === true &&
      prevState.country_id !== this.state.country_id
    ) {
      this.setState({
        country_id: Number(countryId),
        country:
          this.state.country_id === 72
            ? 'FI'
            : this.state.country_id === 195
            ? 'ES'
            : this.state.country_id === 67
            ? 'EE'
            : null,
      });

      // this.packageSelection(this.state.subtype);
    }

    if (prevState.code !== this.state.code) {
      this.setState({
        country: this.state.code,
        country_id: this.state.countries.find((country) =>
          country.country_code === 'EE'
            ? 67
            : country.country_code === 'ES'
            ? 195
            : country.country_code === 'FI'
            ? 72
            : null
        )?.country_id,
      });
    }
    if (prevState.subtype !== this.state.subtype) {
      this.setState({
        selected_package: '',
      });
      this.packageSelection(this.state.subtype);
    }

    if (prevState.package_id !== this.state.package_id) {
      this.state.packages.map((pack) => {
        if (pack.id == this.state.package_id) {
          this.setState({
            package_id: pack.id,
            package_price: pack.package_price,
            package_term_period: pack.package_price_terms_period,
            user_type: pack.user_type,
          });
        }
      });
    }

    if (prevState.selected_package === this.state.selected_package) {
      // this.packageSelection(this.state.subtype);
    }
  }

  confirmationModal = () => {
    const { t } = this.props;
    return (
      <div className='registration-confirm'>
        {this.props.t('success.confirmation')}
        <button onClick={() => this.props.history.push('/')}>
          {t('login.back_to_login')}
        </button>
      </div>
    );
  };

  onSelect = (code) => {
    const { allErrors } = this.state;

    const newErrors = { ...allErrors };

    newErrors['country_id'] = '';
    this.setState({
      code: code,
      allErrors: newErrors,
    });

    if (this.state.lang === 'fi') {
      this.setState({
        country: 'FI',
        country_id: 72,
        allErrors: newErrors,
      });
    } else if (this.state.lang === 'es') {
      this.setState({
        country: 'ES',
        country_id: 195,
        allErrors: newErrors,
      });
    } else if (this.state.lang === 'est') {
      this.setState({
        country: 'EE',
        country_id: 67,
        allErrors: newErrors,
      });
    } else if (this.state.lang === 'en') {
      this.setState({
        country: code,
        allErrors: newErrors,
        country_id: this.state.countries.find(
          (country) => country.country_code === code
        )?.country_id,
      });
    } else {
    }
  };

  changeLang = () => {
    if (this.state.lang === 'fi') {
      this.setState({
        country: 'FI',
        country_id: 72,
      });
    } else if (this.state.lang === 'es') {
      this.setState({
        country: 'ES',
        country_id: 195,
      });
    } else if (this.state.lang === 'est') {
      this.setState({
        country: 'EE',
        country_id: 67,
      });
    }
  };

  packageSelection = async (val) => {
    const data = new FormData();
    data.set('country_id', this.state.country_id);
    data.set('language_id', this.state.lang);
    data.set('user_type', val);
    const res = await postData(`${url}/api/packages/list`, data);
    console.log(res);
    const selectedPackage = res?.data?.data?.filter(
      (pack) => pack.id === this.state.package_id
    );

    this.setState({
      packages: res?.data?.data,
      selected_package: Object.assign({}, selectedPackage),
    });
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });

    const { allErrors } = this.state;

    const newErrors = { ...allErrors };

    newErrors[name] = '';

    this.setState({ allErrors: newErrors });
  };

  handleSubmit = (event) => {
    console.log(event, 'event');
    event.preventDefault();
    //   //
    // const { password } = this.state;
    // const re = new RegExp("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$");
    // const isOk = re.test(password);

    // //console.log("isOk " ,isOk);

    // if(!isOk) {
    //     return alert('weak!');
    // }

    // alert('A password was submitted that was ' + password.length + ' characters long.');
    //   this.setState({ status: null, show_errors: false });
    const {
      allErrors,
      first_name,
      last_name,
      country_id,
      email,
      phone,
      password,
      c_password,
      package_id,
      subtype,
    } = this.state;
    let hasErrors = false;
    let newErrors = { ...allErrors };

    if (typeof email !== 'undefined') {
      let pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(email)) {
        hasErrors = true;
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!first_name) {
      hasErrors = true;
      newErrors.first_name = 'First name required';
    }

    if (!last_name) {
      hasErrors = true;
      newErrors.last_name = 'Last name required';
    }
    if (!country_id) {
      hasErrors = true;
      newErrors.country_id = 'Country required';
    }
    if (!phone) {
      hasErrors = true;
      newErrors.phone = 'Phone required';
    }

    if (phone && phone.length < 11) {
      hasErrors = true;
      newErrors.phone = 'Invalid phone number';
    }

    if (!password) {
      hasErrors = true;
      newErrors.password = 'Password required';
    }

    if (!c_password) {
      hasErrors = true;
      newErrors.c_password = 'Please confirm password';
    }

    if (password !== c_password) {
      hasErrors = true;
      newErrors.password = 'Password does not match';
    }
    // if (!subtype) {
    //   hasErrors = true;
    //   newErrors.subtype = 'Please select user type';
    // }
    // if (!package_id) {
    //   hasErrors = true;
    //   newErrors.package_id = 'Please select a package';
    // }
    // if (package_id == null && country_id == 195) {
    //   hasErrors = false;
    //   newErrors.package_id = 'No packages selection at the moment';
    // }
    if (hasErrors) {
      this.setState({ allErrors: newErrors });

      return;
    }

    if (this.state.userNameStatus === false) {
      return this.setState({ userName_error: true });
    }

    if (this.state.password !== this.state.c_password) {
      const { t } = this.props;

      return this.setState({ pass_noMach: t('success.pass_mat') });
    } else {
      this.setState({
        pass_noMach: '',
      });
    }
    this.setState({ loading: true });
    console.log('dataaaaaa');
    axios
      .post(`${url}/api/register?`, {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        country_id: this.state.country_id,
        country: this.state.country,
        phone: this.state.phone,
        password: this.state.password,
        email_notification: this.state.isChecked === true ? 1 : 0,
        c_password: this.state.c_password,
        subtype: this.state.subtype,
        username: this.state.username,
        package_id: this.state.package_id,
        package_price: this.state.package_price,
        package_term_period: this.state.package_term_period,
        user_type: this.state.user_type,
        language: localStorage.getItem('_lng')
          ? localStorage.getItem('_lng')
          : 'fi',
        company_id: '_' + Math.random().toString(36).substr(2, 9),
        promo_code: this.state.promo,
      })
      .then((res) => {
        //         alert(res);
        // return false;

        this.setState({ loading: false });

        if (res.status) {
          this.props.history.push('/register-success');
          // return <Redirect to={"/register-success"} />
        }
      })
      .catch((err) => {
        const { t } = this.props;
        if (err?.response?.status === 401) {
          this.setState({ errors: t('success.all_fields_are_required') });
        }

        if (
          err?.response?.status === 401 &&
          err?.response?.data?.error?.email?.length &&
          err?.response?.data?.error?.email[0] ===
            'The email has already been taken.'
        ) {
          this.setState({ errors: t('success.email_taken') });
        }
        if (
          err?.response?.status === 401 &&
          err?.response?.data?.error?.subtype?.length &&
          err?.response?.data?.error?.subtype[0] ===
            'The subtype field is required.'
        ) {
          this.setState({ errors: 'The subtype field is required.' });
        }
        /*  if (
          err?.response?.status === 401 &&
          err?.response?.data?.error?.phone[0] ===
            "The phone field is required."
        ) {
          this.setState({ errors: t("success.phone_required") });
        } */

        if (err?.response?.status === 500) {
          this.setState({ status: 500 });
        }
        this.setState({ show_errors: true, loading: false });
      });
  };

  changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('_lng', lng);

    // window.location.reload();
  };

  handleChange1 = () => {
    //console.log('handleChange', this.refs.complete.checked); // Never gets logged
    this.setState({
      complete: this.refs.complete.checked,
    });
  };

  handleOnChange = () => {
    this.setState({
      isChecked: !this.state.isChecked,
    });
  };

  getUserName = async (e) => {
    this.setState({ username: e.target.value });
    if (!e.target.value) {
      this.setState({ userNameStatus: '' });
    }
    if (e.target.value) {
      axios
        .get(`${url}/api/check_username?username=${e.target.value}`, {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        })
        .then((result) => {
          // console.log("result.data", result.data);
          // console.log("result", result);
          this.setState({
            userNameStatus: result.data.status,
            userName_error: '',
          });
        })
        .catch((err) => {
          if (err.response?.data) {
            this.setState({
              userNameStatus: err.response?.data?.status,
            });
          }
          //    Object.entries(err.response.data.error).map(([key, value]) => {
          //   this.setState({ errors: err.response.data.error });
          // });
        });
    }
    // // const token = await localStorage.getItem("token");
    // const response = await axios.get(`${url}/api/check_username?username=${e.target.value}`);
    // // console.log("response", response);
    // if (response?.status === 200) {
    //   this.setState({
    //     response: response,
    //   })
    // } else {
    //   this.setState({
    //     response: "",
    //   })
    // }
  };
  changePhone = (e) => {
    this.setState({ phone: e });

    const { allErrors } = this.state;

    const newErrors = { ...allErrors };

    newErrors['phone'] = '';
    this.setState({ allErrors: newErrors });
  };

  getUser = (userNameStatus) => {
    // const { userNameStatus}=this.state;
    if (userNameStatus === true) {
      return '3px solid green';
    } else if (userNameStatus === false) {
      return '3px solid red';
    } else {
      return '2px solid black';
    }
  };

  render() {
    const { t } = this.props;
    if (this.state.loggedIn === true) {
      return <Redirect to='/index' />;
    }
    const {
      first_name,
      last_name,
      email,
      phone,
      password,
      c_password,
      country_id,
      package_id,
      subtype,
    } = this.state.allErrors;

    // console.log(
    //   this.state.countries.find(
    //     (country) => country.country_code === this.state.country
    //   )?.country_id
    // );
    let alert, loading;
    if (this.state.show_errors === true) {
      alert = (
        <div style={{ paddingTop: '10px' }}>
          <Alert variant='danger' style={{ fontSize: '13px' }}>
            {this.state.errors}
          </Alert>
        </div>
      );
    }
    if (this.state.status === 500) {
      alert = (
        <div style={{ paddingTop: '10px' }}>
          <Alert variant='danger' style={{ fontSize: '13px' }}>
            {t('success.unique')}
          </Alert>
        </div>
      );
    }
    if (this.state.loading === true) {
      loading = (
        <Spinner animation='border' role='status'>
          <span className='sr-only'> {t('login.Loading')} </span>
        </Spinner>
      );
    }

    const { pass_noMach, userNameStatus } = this.state;

    return (
      <div className='login-page'>
        <div className='content'>
          <div className='logo'>
            <img
              src={Logo}
              alt={Logo}
              style={{ width: '196px', height: '45px' }}
            />
          </div>
          <div className='card'>
            <div className='card-body'>
              {this.state.confirmation ? this.confirmationModal() : ''}
              <div
                className='head'
                style={
                  this.state.confirmation
                    ? { display: 'none' }
                    : { display: 'block' }
                }
              >
                <h3>{t('login.welcome')}</h3>
                <p className='tag_cla'>{t('login.tag')}</p>
              </div>
              <form
                noValidate
                className='formstart'
                onSubmit={this.handleSubmit}
                style={
                  this.state.confirmation
                    ? { display: 'none' }
                    : { display: 'block' }
                }
              >
                <div className='signup_error'>{country_id}</div>
                <div
                  className={`form-group ${country_id ? 'borderError' : ''}`}
                >
                  <ReactFlagsSelect
                    selected={
                      this.state.country !== undefined
                        ? this.state.country
                        : this.changeLang()
                    }
                    name='country_id'
                    onSelect={this.onSelect}
                    countries={this.state.countries?.map(
                      (countries) => countries.country_code
                    )}
                  />
                </div>
                <span className='signup_error'>{first_name}</span>
                <div
                  className={`form-group ${first_name ? 'borderError' : ''}`}
                >
                  <input
                    style={
                      this.state.confirmation
                        ? { display: 'none' }
                        : { display: 'block' }
                    }
                    onChange={this.handleChange}
                    className='form-control'
                    name='first_name'
                    type='text'
                    placeholder={t('account.first_name')}
                  />
                </div>
                <div className='signup_error'>{last_name}</div>
                <div className={`form-group ${last_name ? 'borderError' : ''}`}>
                  <input
                    onChange={this.handleChange}
                    className='form-control'
                    name='last_name'
                    type='text'
                    placeholder={t('account.last_name')}
                  />
                </div>

                <div className='signup_error'>{email}</div>
                <div className={`form-group ${email ? 'borderError' : ''}`}>
                  {/* <EmailId /> */}
                  <input
                    className='form-control'
                    onChange={this.handleChange}
                    name='email'
                    type='email'
                    placeholder={t('account.email')}
                  />
                  <div className='invalid-feedback'>
                    {t('login.valid_email')}
                  </div>
                </div>
                <div className='signup_error'>{phone}</div>
                <div className={`custom_phn ${phone ? 'borderError' : ''}`}>
                  <PhoneInput
                    // containerClass="custom_sign"
                    name='phone'
                    searchClass='custon_sign'
                    country={
                      this.state.country
                        ? this.state.country.toLowerCase()
                        : 'fi'
                    }
                    enableAreaCodes={true}
                    countryCodeEditable={false}
                    onChange={this.changePhone}
                    value={this.state.phone}
                  />
                </div>
                <div className='signup_error'>{password}</div>
                <div className={`form-group ${password ? 'borderError' : ''}`}>
                  <input
                    onChange={this.handleChange}
                    className='form-control'
                    type='password'
                    name='password'
                    placeholder={t('account.password')}
                  />
                  <span className='icon-eye show-pwd'></span>
                </div>
                <div className='signup_error'>{c_password}</div>
                <div
                  className={`form-group ${c_password ? 'borderError' : ''}`}
                >
                  <input
                    onChange={this.handleChange}
                    className={`form-control ${
                      pass_noMach ? 'validation_err' : ''
                    }`}
                    type='password'
                    name='c_password'
                    placeholder={t('account.old_password1')}
                  />
                </div>
                {pass_noMach ? (
                  <p className='color_red error_font'> {pass_noMach} </p>
                ) : (
                  ''
                )}
                <>
                  <h4 className='text-center'>{t('login.are_you')}</h4>
                  <div className='form-group'>
                    <div className='signup_error'>{subtype}</div>
                    <div
                      className={`form-group ${subtype ? 'borderError' : ''}`}
                    ></div>
                    <select
                      onChange={this.handleChange}
                      name='subtype'
                      value={this.state.subtype}
                      className='form-control'
                    >
                      <option value='' disabled>
                        {' '}
                        {t('login.Select')}{' '}
                      </option>
                      <option value='company'> {t('login.company1')} </option>
                      <option value='individual'>
                        {' '}
                        {t('login.individual')}{' '}
                      </option>
                      <option value='consumer'> {t('login.consumer')} </option>
                      <option value='proppu-handyman'>
                        {t('login.handyman')}
                      </option>
                      <option value='property-manager'>
                        {t('login.manager')}
                      </option>
                    </select>
                  </div>
                  {this.state.packages?.length > 0 &&
                  this.state.country_id === 72 &&
                  this.state.subtype !== 'consumer' ? (
                    <>
                      <div className='signup_error'>{package_id}</div>
                      <div
                        className={`form-group ${
                          package_id ? 'borderError' : ''
                        }`}
                      >
                        <div className='form-group'>
                          <select
                            className='form-control'
                            name='package_id'
                            onChange={this.handleChange}
                          >
                            {this.state.package_id === null ? (
                              <option selected disabled value=''>
                                {' '}
                                {t('login.Select1')}{' '}
                              </option>
                            ) : (
                              <option>
                                {this.state.selected_package
                                  ? this.state.selected_package[0]
                                      ?.package_display_text
                                  : t('login.Select1')}
                              </option>
                            )}

                            {this.state.packages?.map((pack) => {
                              const {
                                id,
                                package_price,
                                package_price_terms_period,
                                package_title,
                                user_type,
                                package_display_text,
                              } = pack;
                              return (
                                <>
                                  <option key={id} value={id}>
                                    {/* {user_type}- {package_title}, {package_price}/
                                  {package_price_terms_period}
                                  {package_price_terms_period > 1
                                    ? 'mos'
                                    : 'mo'} */}
                                    {package_display_text}
                                  </option>
                                </>
                              );
                            })}
                          </select>
                        </div>
                        <p> {t('login.freeTrial')} </p>
                      </div>
                    </>
                  ) : (
                    ''
                  )}

                  {this.state.subtype ? (
                    <>
                      <div className='form-group'>
                        <input
                          onChange={this.getUserName}
                          className='form-control'
                          style={{
                            border: this.getUser(this.state.userNameStatus),
                          }}
                          type='text'
                          autocomplete='off'
                          name='username'
                          placeholder={
                            this.state.subtype === 'company' ||
                            this.state.subtype === 'individual'
                              ? t('login.company')
                              : t('account.username1')
                          }
                        />
                        {/* <span className="icon-eye show-pwd"></span> */}
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                  {this.state.subtype === 'consumer' &&
                  this.state.userNameStatus === true ? (
                    <p style={{ fontSize: '15px', color: 'green' }}>
                      {' '}
                      {t('login.userNameAvailable')}{' '}
                    </p>
                  ) : this.state.subtype === 'consumer' &&
                    this.state.userNameStatus === false ? (
                    <p style={{ fontSize: '15px', color: 'red' }}>
                      {' '}
                      {t('login.userNameNotAvailable')}{' '}
                    </p>
                  ) : this.state.subtype !== 'consumer' &&
                    this.state.userNameStatus === true ? (
                    <p style={{ fontSize: '15px', color: 'green' }}>
                      {' '}
                      {t('login.CompanyNameAvailable')}{' '}
                    </p>
                  ) : this.state.subtype !== 'consumer' &&
                    this.state.userNameStatus === false ? (
                    <p style={{ fontSize: '15px', color: 'red' }}>
                      {' '}
                      {t('login.CompanyNameNotAvailable')}{' '}
                    </p>
                  ) : (
                    ''
                  )}
                  {/* {this.state.userName_error ? t("c_material_list.request.fill_req") : ""} */}
                  <div className='form-group'>
                    <input
                      onChange={(e) =>
                        this.setState({ ...this.state, promo: e.target.value })
                      }
                      value={this.state.promo}
                      className='form-control'
                      type='text'
                      placeholder={t('login.promo')}
                    />
                    {/* <span className="icon-eye show-pwd"></span> */}
                  </div>
                </>
                <div className='form-group signup-checkbox'>
                  <input
                    type='checkbox'
                    checked={this.state.complete}
                    ref='complete'
                    onChange={this.handleChange1}
                  />{' '}
                  <label className='terms_sign'>
                    {localStorage.getItem('_lng') === 'en' ? (
                      <>
                        {t('login.terms_c')}
                        <a
                          // to="/terms-of-use"
                          href={`${web_url}/our-privacy/`}
                          target='_blank'
                        >
                          {t('login.Privacy_statement')}
                        </a>
                        {''}
                        {t('login.and')}
                        <a
                          // to="/terms-of-use"
                          href={`${web_url}/terms-service/`}
                          target='_blank'
                        >
                          {t('login.terms_c_l')}
                        </a>
                      </>
                    ) : (
                      <>
                        {t('login.terms_c')}
                        <a href={`${web_url}/our-privacy/`} target='_blank'>
                          {t('login.privacyFI')}{' '}
                        </a>{' '}
                        {t('login.andFI')}
                        <a href={`${web_url}/terms-service/`} target='_blank'>
                          {t('login.termsFI')}
                        </a>
                        {this.state.lang === 'fi' ? 'ja hyväksyn ne.' : ''}
                      </>
                    )}
                  </label>
                </div>
                <div className='form-group signup-checkbox'>
                  {/* <input
                    type="checkbox" 
                      onChange={this.handleChange1}
                  /> <label className="terms_sign"> {t('login.Promotional')} </label> */}
                  <input
                    type='checkbox'
                    id='topping'
                    name='topping'
                    value='Paneer'
                    checked={this.state.isChecked}
                    onChange={this.handleOnChange}
                  />{' '}
                  <label className='terms_sign'>
                    {' '}
                    {t('login.Promotional')}{' '}
                  </label>
                </div>
                {loading ? (
                  loading
                ) : (
                  <>
                    <Button
                      dis={this.state.complete}
                      title={t('account.Register')}
                    />
                  </>
                )}
                {alert ? alert : null}
              </form>
            </div>
          </div>
          <p className='back-link'>
            {' '}
            <Link to='/'> {t('login.back_to')}</Link>
          </p>
          <div className='Login_lang row'>
            <button
              style={{ fontSize: '13px', padding: '5px' }}
              className={
                localStorage.getItem('_lng') === 'fi'
                  ? 'btn font-weight-bold'
                  : 'btn'
              }
              onClick={() => this.changeLanguage('fi')}
            >
              {t('login.Finland')}
            </button>
            <div class='sep'>|</div>
            <button
              style={{ fontSize: '13px', padding: '5px' }}
              className={
                localStorage.getItem('_lng') === 'en'
                  ? 'btn font-weight-bold'
                  : 'btn'
              }
              onClick={() => this.changeLanguage('en')}
            >
              {t('login.English(US)')}
            </button>
            <div class='sep'>|</div>
            <button
              style={{ fontSize: '13px', padding: '5px' }}
              className={
                localStorage.getItem('_lng') === 'es'
                  ? 'btn font-weight-bold'
                  : 'btn'
              }
              onClick={() => this.changeLanguage('es')}
            >
              {t('login.Spain')}
            </button>
            <div className='sep'>|</div>
            <button
              style={{ fontSize: '13px', padding: '5px' }}
              className={
                localStorage.getItem('_lng') === 'est'
                  ? 'btn font-weight-bold'
                  : 'btn'
              }
              onClick={() => this.changeLanguage('est')}
            >
              {t('login.Estonian')}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Signup);
