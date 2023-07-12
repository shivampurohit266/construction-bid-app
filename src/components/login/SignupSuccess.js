import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Logo from '../../images/Full-Logo-lighter.png';
import i18n from '../../locales/i18n';
import { withTranslation } from 'react-i18next';
const SignupSuccess = (props) => {
  const { t } = props;

  const [lng, setLng] = useState(localStorage.getItem('_lng'));
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('_lng', lng);
    // window.location.reload();
    setLng(localStorage.getItem('_lng'));
  };

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
            <div className='registration-confirm'>
              {t('registerSuccess.login')}

              <button onClick={() => props.history.push('/')}>
                {t('registerSuccess.back')}
              </button>
            </div>
          </div>
        </div>
        <p className='back-link'>
          {' '}
          <Link to='/'>{t('registerSuccess.signIn')}</Link>
        </p>
        <div className='Login_lang row'>
          <button
            style={{ fontSize: '13px', padding: '5px' }}
            className={
              localStorage.getItem('_lng') === 'fi'
                ? 'btn font-weight-bold'
                : 'btn'
            }
            onClick={() => changeLanguage('fi')}
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
            onClick={() => changeLanguage('en')}
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
            onClick={() => changeLanguage('es')}
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
            onClick={() => changeLanguage('est')}
          >
            {t('login.Estonian')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(SignupSuccess);
