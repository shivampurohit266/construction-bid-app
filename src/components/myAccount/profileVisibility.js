import React, { useEffect, useState } from 'react';
import './profileVisibility.css';
import { ReactComponent as X } from '../../images/x.svg';
import { url } from '../../helper/helper';
import { withTranslation } from 'react-i18next';
import axios from 'axios';
import { postDataWithToken } from '../../helper/api';

const ProfileVisibility = ({ close, id, t }) => {
  const [visibility, setVisibility] = useState('');
  const [succes, setSucces] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    setVisibility(id);
  }, []);

  const sendVisibility = async () => {
    await postDataWithToken(
      `${url}/api/profile_visibility`,
      { visibility: visibility },
      token
    )
      .then((result) => {
        if (result.status === 200) {
          setSucces(true);
          setTimeout(() => {
            close();
          }, 3000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className='profile-modal'>
      <div className='profile-close'>
        <h3>{t('account.acc_visibility')}</h3>
        <X style={{ cursor: 'pointer' }} onClick={() => close()} />
      </div>
      <select
        onChange={(e) => setVisibility(e.target.value)}
        value={visibility}
      >
        <option value='1'>{t('account.public')}</option>
        <option value='0'>{t('account.private')}</option>
      </select>

      <p>{t('account.profile_text')}</p>
      <div className='profile-message'>
        <button className='btn btn-blue' onClick={() => sendVisibility()}>
          {t('account.Update')}
        </button>
        {succes ? <p className='alert-success'>{t('account.visibility_updated')}</p> : ''}
      </div>
    </div>
  );
};

export default withTranslation()(ProfileVisibility);
