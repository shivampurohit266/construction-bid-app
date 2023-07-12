import React, { Component } from 'react';
import Button from '../shared/Button';
import Logo from '../../images/Full-Logo-lighter.png';
import axios from 'axios';
import { Helper, url } from '../../helper/helper';
import { HashRouter as Router, Link, Redirect } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import { withTranslation } from 'react-i18next';

class Forgot extends Component {
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
    email: '',
    errors: '',
    show_errors: false,
    show_msg: false,
  };

  handleChange = (event) => {
    this.setState({ email: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { t } = this.props;
    if (!this.state.email)
      this.setState({ errors: t('success.all_fields_are_required') });

    const email = {
      email: this.state.email,
    };
    axios
      .post(`${url}/api/password/email?`, {
        email: email.email,
        language: localStorage.getItem('_lng')
          ? localStorage.getItem('_lng')
          : 'fi',
      })
      .then((res) => {
        this.setState({ show_msg: true });
      })
      .catch((err) => {
        const { t } = this.props;

        this.setState({
          show_errors: true,
          errors: t('login.email_not_found'),
        });
        //console.log(err);
      });
  };

  render() {
    const { t, i18n } = this.props;
    if (this.state.loggedIn === true) {
      return <Redirect to='/index' />;
    }
    let alert;
    if (this.state.show_errors === true) {
      alert = (
        <div style={{ paddingTop: '10px' }}>
          <Alert variant='danger' style={{ fontSize: '13px' }}>
            {this.state.errors}
          </Alert>
        </div>
      );
    }
    if (this.state.show_msg === true) {
      alert = (
        <div style={{ paddingTop: '10px' }}>
          {' '}
          <Alert variant='success' style={{ fontSize: '13px' }}>
            {t('login.Email_sent!')}
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
                <h3>{t('login.for_msg')}</h3>
              </div>
              <form className='formstart' onSubmit={this.handleSubmit}>
                <div className='form-group'>
                  {/* <EmailId /> */}
                  <input
                    className='form-control'
                    onChange={this.handleChange}
                    name='email'
                    type='email'
                    placeholder={t('login.email')}
                  />
                  <div className='invalid-feedback'>
                    {t('login.valid_email')}
                  </div>
                </div>
                {/* <Button title={t("login.Reset")} /> */}
                <button className='btn btn-dark'> {t('login.Reset')} </button>
                {alert ? alert : null}
              </form>
            </div>
          </div>
          <Link className='back-link' to='/'>
            {t('login.back_msg')}
          </Link>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Forgot);
