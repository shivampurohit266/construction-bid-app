import React, { useState, useRef } from 'react';
import { withTranslation } from 'react-i18next';
import axios from 'axios';
import { url } from '../../../../helper/helper';

import './addCustomer.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import { postDataWithToken } from '../../../../helper/api';

const AddCustomer = (props) => {
  const [success, setSuccess] = useState('');
  const [consumer, setConsumer] = useState(false);
  const [business, setBusiness] = useState(false);
  const [type, setType] = useState('');
  const [inputs, setInputs] = useState({
    first: '',
    last: '',
    email: '',
    company: '',
    phone: '',
    days: '',
  });
  const [errors, setErrors] = useState({
    first: '',
    last: '',
    email: '',
    phone: '',
    days: '',
    type: '',
  });

  const { first, last, email, phone, days, company } = inputs;

  const handleChange = (e) => {
    const { value, name } = e.target;
    setInputs({ ...inputs, [name]: value });

    const newErrors = { ...errors };
    newErrors[name] = '';
    setErrors(newErrors);
  };

  const Type = (e) => {
    setType(e.target.value);

    if (e.target.value === 'Consumer customer') {
      setConsumer(true);
      setBusiness(false);
      setInputs({ ...inputs, days: 14 });
    }
    if (e.target.value === 'Business') {
      setBusiness(true);
      setConsumer(false);
      setInputs({ ...inputs, days: 7 });
    }
    if (e.target.value === 'select') {
      setBusiness(false);
      setConsumer(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { t } = props;

    let hasErrors = false;
    let newErrors = { ...errors };
    console.log(first, last, type, email);
    if (!first) {
      hasErrors = true;
      newErrors.first = t('modals.errors.first_name');
    }
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (reg.test(email) === false) {
      hasErrors = true;
      newErrors.email = t('modals.errors.invalid');
    }

    if (!email) {
      hasErrors = true;
      newErrors.email = t('modals.errors.email');
    }
    if (!phone) {
      hasErrors = true;
      newErrors.phone = t('modals.errors.phone');
    }
    if (!last) {
      hasErrors = true;
      newErrors.last = t('modals.errors.last_name');
    }

    if (type === '' || type === 'Select') {
      hasErrors = true;
      newErrors.type = t('modals.errors.type');
    }

    if (!days) {
      hasErrors = true;
      newErrors.days = t('modals.errors.days');
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    } else sendData();
  };
  const ref = useRef(null);
  const sendData = async () => {
    const token = localStorage.getItem('token');

    const data = new FormData();
    data.set('first_name', first);
    data.set('last_name', last);
    data.set('phone', phone);
    data.set('email', email);
    data.set('company', company);
    data.set('type', 'Client'); //business or consumer
    data.set('payment_days', days);
    data.set('payment_t', type);
    await postDataWithToken(`${url}/api/resources`, data, token)
      .then((res) => {
        setSuccess(1);
        ref.current.scrollTo(0, 0);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className='report-modal' ref={ref}>
      {success ? (
        <SweetAlert
          success
          closeOnClickOutside={true}
          title={props.t('login.SuccessPopup')}
          onConfirm={props.handleClose}
        ></SweetAlert>
      ) : (
        ''
      )}
      <h3> {props.t('account.Add_Customer')}</h3>
      <span className='close-modal' onClick={props.handleClose}>
        X
      </span>
      <form className='report-modal-form' onSubmit={handleSubmit}>
        <div className='left-right'>
          <label className='report-customer'>
            {' '}
            {props.t('account.first_name')}
            <input
              name='first'
              value={first}
              type='text'
              className={
                errors.first
                  ? 'select-customer modal-select-customer has-error'
                  : 'select-customer modal-select-customer'
              }
              placeholder={props.t('account.first_name')}
              onChange={handleChange}
            />
            <div className='addCustomer-error'>{errors.first}</div>
          </label>
          <label className='report-customer'>
            {' '}
            {props.t('account.last_name')}
            <input
              name='last'
              value={last}
              type='text'
              className={
                errors.first
                  ? 'select-customer modal-select-customer has-error'
                  : 'select-customer modal-select-customer'
              }
              placeholder={props.t('account.last_name')}
              onChange={handleChange}
            />
            <div className='addCustomer-error'>{errors.last}</div>
          </label>
        </div>
        <div className='left-right'>
          <label className='report-customer'>
            {' '}
            {props.t('account.email')}
            <input
              name='email'
              value={email}
              type='email'
              className={
                errors.first
                  ? 'select-customer modal-select-customer has-error'
                  : 'select-customer modal-select-customer'
              }
              placeholder={props.t('account.email')}
              onChange={handleChange}
            />
            <div className='addCustomer-error'>{errors.email}</div>
          </label>
          <label className='report-customer'>
            {' '}
            {props.t('account.Type')}
            <select
              onChange={Type}
              className={
                errors.first
                  ? 'select-customer modal-select-customer has-error'
                  : 'select-customer modal-select-customer'
              }
              placeholder={props.t('account.Type')}
            >
              <option value='select'>{props.t('account.Select')}</option>
              <option value='Consumer customer'>
                {props.t('mycustomer.Consumer_customer')}
              </option>
              <option value='Business'>{props.t('mycustomer.Business')}</option>
            </select>
            <div className='addCustomer-error'>{errors.type}</div>
          </label>
        </div>
        <div className='left-right'>
          <label className='report-customer modal-phone'>
            {' '}
            {props.t('account.phone')}
            <input
              type='text'
              name='phone'
              value={phone}
              className={
                business
                  ? 'select-customer modal-select-customer'
                  : 'select-customer modal-phone'
              }
              onChange={handleChange}
              placeholder={props.t('account.phone')}
            />
            <div className='addCustomer-error'>{errors.phone}</div>
          </label>
          {business ? (
            <label className='report-customer'>
              {' '}
              {props.t('account.company')}
              <input
                name='company'
                value={company}
                type='text'
                className='select-customer modal-select-customer'
                placeholder={props.t('account.company')}
                onChange={handleChange}
              />
            </label>
          ) : (
            ''
          )}
        </div>

        {consumer || business ? (
          <label className='report-customer modal-phone'>
            {' '}
            {props.t('create_report.days')}
            <input
              type='number'
              className='select-customer modal-select-customer'
              placeholder={props.t('')}
              // value={days || ""}
              defaultValue={days}
              name='days'
              onChange={handleChange}
            />
            <div className='addCustomer-error'>{errors.days}</div>
          </label>
        ) : (
          ''
        )}
        <button type='submit' className='addcustomer-btn'>
          {props.t('businessinfo.Submit')}
        </button>
      </form>
    </div>
  );
};

export default withTranslation()(AddCustomer);
