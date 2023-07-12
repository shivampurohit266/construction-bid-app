import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Logo from '../../images/Full-Logo-lighter.png';

class Terms_of_use extends Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('token');
    // //console.log(token);
    let loggedIn = true;

    if (token == null) {
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
  };

  render() {
    const { t, i18n } = this.props;

    // if (this.state.loggedIn === true) {
    //     return <Redirect to="/index" />;
    // }

    return (
      <div className='login-page'>
        <div className='content'>
          <div className='logo'>
            <img src={Logo} alt={Logo} />
          </div>
          <div className='card' style={{ marginTop: '-10%' }}>
            <div className='card-body'>
              <div className='head'>
                <h3>{t('login.welcome')}</h3>
                <p className='tag_cla'>{t('login.tag')}</p>
              </div>
            </div>
          </div>
        </div>

        <br />
      </div>
    );
  }
}

export default withTranslation()(Terms_of_use);
