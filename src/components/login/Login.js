import React, { Component } from 'react';
import Button from '../shared/Button';
import Logo from '../../images/Full-Logo-lighter.png';
import axios from 'axios';
import { HashRouter as Router, Link, Redirect } from 'react-router-dom';
import { url } from '../../helper/helper';
import Alert from 'react-bootstrap/Alert';
import { withTranslation } from 'react-i18next';
import i18n from '../../locales/i18n';
import { postDataWithToken } from '../../helper/api';

class Login extends Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('token');
    const Lang = localStorage.getItem('_lng');
    if(Lang){
    i18n.changeLanguage(Lang);
    }
    // //console.log(token);
    let loggedIn = true;

    if (token === null) {
      loggedIn = false;
    }
    this.state = {
      loggedIn,
    };
  }

  state = {
    email: '',
    password: '',
    err: '',
    loggedIn: false,
    user_id: '',
  };

  handleChange1 = (event) => {
    this.setState({ email: event.target.value });
  };
  handleChange2 = (event) => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (!this.state.email || !this.state.password) {
      const { t } = this.props;

      return this.setState({ err: t('success.all_fields_are_required') });
    }

    const data = new FormData();
    data.set('email', this.state.email);
    data.set('password', this.state.password);

    const { history } = this.props;

    axios
      .post(`${url}/api/login`, data)
      .then((res) => {
        console.log(res.data);
        this.setState({
          user_id: res?.data?.success.login_user_id,
        });
        localStorage.setItem('token', res?.data?.success.token);
        localStorage.setItem('Login_user_id', res?.data?.success.login_user_id);
        localStorage.setItem('Login_user_role', res?.data?.role[0]);
        localStorage.setItem(
          'Login_user_uuid',
          res?.data?.success.login_user_uuid
        );

        localStorage.setItem(
          'Login_user_permissions',
          JSON.stringify(res?.data?.permissions)
        );

        history.push('/Dashboard');
        //window.location.reload();
      })
      .catch((err) => {
        const { t } = this.props;
        console.log(t);
        if (err?.response?.data?.error === 'not_verified') {
          this.setState({ err: 'Email address is not verified' });
        } else if (err?.response?.data?.error === 'deactivated') {
          this.setState({
            err: t('login.deactivated'),
          });
        } else this.setState({ err: t('success.authentication_failed') });
        //console.log(err.response);
      });
  };

  changeLanguage = async (lng) => {
    i18n.changeLanguage(lng);
    const token = localStorage.getItem('token');
    const value = localStorage.setItem('_lng', lng);
    const formData = new FormData();
    formData.append('user_id', this.state.user_id);
    // formData.append('language_code', value);
    // i18n.changeLanguage(value);
    // await postDataWithToken(`${url}/api/update_language_flag`, formData, token);

    // window.location.reload();
  };

  render() {
    const { t, i18n } = this.props;

    if (this.state.loggedIn === true) {
      return <Redirect to='/index' />;
    }

    let alert;
    if (this.state.err) {
      alert = (
        <div style={{ paddingTop: '10px' }}>
          <Alert variant='danger' style={{ fontSize: '15px' }}>
            {this.state.err}
          </Alert>
        </div>
      );
    }

    return (
      <div className='login-page'>
        <div className='content'>
          <div className='logo'>
            <img src={Logo} alt='' style={{ width: '196px', height: '45px' }} />
          </div>
          <div className='card'>
            <div className='card-body'>
              <div className='head'>
                <h3>{t('login.welcome')}</h3>
                <h4>{t('login.login')}</h4>
              </div>
              <form className='formstart' onSubmit={this.handleSubmit}>
                <div className='form-group'>
                  <input
                    className='form-control'
                    onChange={this.handleChange1}
                    name='email'
                    type='email'
                    placeholder={t('login.email')}
                  />

                  <div className='invalid-feedback'>
                    {t('login.valid_crede')}
                  </div>
                </div>
                <div className='form-group'>
                  <input
                    className='form-control'
                    onChange={this.handleChange2}
                    name='password'
                    type='password'
                    placeholder={t('login.Password')}
                  />
                </div>
                <button className='btn btn-dark'> {t('login.signin')} </button>
                {alert ? alert : null}
              </form>
            </div>
          </div>

          <Link className='back-link' to='/forgot'>
            {t('login.for_msg')}
          </Link>
          <div className='info'>
            <p className='text-center'>
              {t('login.reg_msg')}
              <Link className='btn btn-outline-blue' to='/register'>
                {t('login.get_started')}
              </Link>
            </p>
          </div>

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
            <div className='sep'>|</div>
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
            <div className='sep'>|</div>
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

export default withTranslation()(Login);
