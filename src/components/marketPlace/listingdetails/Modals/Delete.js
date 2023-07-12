import React from 'react';
import './Delete.css';
import { url } from '../../../../helper/helper';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import SweetAlert from 'react-bootstrap-sweetalert';

const Delete = ({ id, value, handleDelete, name, t, isOpen }) => {
  const [success, setSuccess] = React.useState(false);
  const token = localStorage.getItem('token');
  //console.log(handleDelete, isOpen);
  const DeleteListing = () => {
    axios
      .get(`${url}/api/tender/delete/${value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setSuccess(true);
      });
  };
  return (
    <div
      className='delete-listing'
      style={id === value ? { display: 'block' } : { display: 'none' }}
    >
      {success ? (
        <SweetAlert
          success
          closeOnClickOutside
          title={t('success.listing_deleted')}
          onConfirm={() => window.location.reload()}
        />
      ) : (
        ''
      )}
      <h3>
        {t('success.text')}
        {`${name}?`}
      </h3>

      <button
        className='btn btn-danger delete-listing-btn'
        onClick={() => DeleteListing()}
      >
        {t('success.delete')}
      </button>
      <button
        className='btn btn-secondary cancel-listing-btn'
        onClick={() => handleDelete()}
      >
        {t('success.cancel')}
      </button>
    </div>
  );
};

export default withTranslation()(Delete);
