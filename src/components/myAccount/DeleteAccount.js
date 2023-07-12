import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { url } from '../../helper/helper';
import Logo from '../../images/Full-Logo-lighter.png';

import { getData } from '../../helper/api';
import { useParams } from 'react-router-dom';
const DeleteAccount = ({ t, history }) => {
  const code = useParams();

  const deleteComfirmation = async () => {
    const token = await localStorage.getItem('token');
    await getData(
      `${url}/api/confirm/delete_user_account/${code.id}`,
      token
    ).then((res) => {
      console.log(res);
      setTimeout(() => {
        history.push('/login');
      }, 3000);
    });
  };

  useEffect(() => {
    deleteComfirmation();
  }, []);
  return (
    <div className='login-page'>
      <div className='content'>
        <div className='logo'>
          <img src={Logo} alt='' style={{ width: '196px', height: '45px' }} />
        </div>
        <div className='card'>
          <div className='card-body'>
            <div className='head'>
              <h3>{t('login.delete')}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(DeleteAccount);
