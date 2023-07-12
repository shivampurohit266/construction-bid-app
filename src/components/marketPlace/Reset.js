import React, { Component } from 'react';
import Button from '../shared/Button';
import Logo from '../../images/Full-Logo-lighter.png';
import axios from 'axios';
import { Helper, url } from '../../helper/helper';
import Alert from 'react-bootstrap/Alert';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import { withTranslation } from 'react-i18next';

class Reset extends Component {
  state = {
    email: '',
    password: '',
    password_confirmation: '',
    status: null,
  };

  componentDidMount = () => {
    this.getEmail(this.props.match.params.token);
  };

  getEmail = (token) => {
    axios
      .post(`${url}/api/hash/${token}`)
      .then((result) => {
        this.setState({ email: result?.data });
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.password !== this.state.password_confirmation) {
      return alert(`passwords don't match`);
    }

    const data = new FormData();
    data.set('email', this.state.email);
    data.set('token', this.props.match?.params?.token);
    data.set('password', this.state.password);
    data.set('password_confirmation', this.state.password_confirmation);

    axios
      .post(`${url}/api/password/reset`, data)
      .then((res) => {
        NotificationManager.success('Reset password Success');
        // alert("Success");
        this.props.history.push('/');
      })
      .catch((err) => {
        this.setState({ status: 422 });
      });

    for (var pair of data.entries()) {
      //console.log(pair[0] + ", " + pair[1]);
    }
  };

  render() {
    const { t, i18n } = this.props;
    let alert;
    if (this.state.status === 422) {
      alert = (
        <Alert variant='danger' style={{ fontSize: '13px' }}>
          {t('reset.Please_try_again')}
        </Alert>
      );
    }
    if (this.state.status === 422 && this.state.password.length < 6) {
      alert = (
        <Alert variant='danger' style={{ fontSize: '13px' }}>
          {t('reset.six_characters')}
        </Alert>
      );
    }

    return (
      <div className='login-page'>
        <NotificationContainer />
        <div className='content'>
          <div className='logo'>
            <img
              src={Logo}
              alt='logo'
              style={{ width: '196px', height: '45px' }}
            />
          </div>
          <div className='card'>
            <div className='card-body'>
              <div className='head'>
                <h3> {t('reset.Reset_password')} </h3>
              </div>
              <form onSubmit={this.handleSubmit}>
                <div className='form-group'>
                  <label
                    style={{
                      marginLeft: '30%',
                      fontWeight: '600',
                    }}
                  >
                    {t('reset.For')} {this.state.email}
                  </label>
                </div>
                <div className='form-group'>
                  <input
                    className='form-control'
                    onChange={this.handleChange}
                    name='email'
                    type='hidden'
                    placeholder='Email id'
                    required
                    value={this.state.email}
                  />
                </div>
                <div className='form-group'>
                  <input
                    className='form-control'
                    onChange={this.handleChange}
                    name='password'
                    type='password'
                    placeholder={t('reset.password')}
                    required
                  />
                </div>
                <div className='form-group'>
                  <input
                    className='form-control'
                    onChange={this.handleChange}
                    name='password_confirmation'
                    type='password'
                    placeholder={t('reset.confirm_password')}
                    required
                  />
                </div>
                {/* <Button title={t("reset.Reset")} /> */}
                <button className='btn btn-dark'> {t('reset.Reset')} </button>
                <div style={{ fontSize: '13px', marginTop: '15px' }}>
                  {alert ? alert : null}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Reset);
