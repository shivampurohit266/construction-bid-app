import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { getData, postDataWithToken } from '../../../../../helper/api';
import { url } from '../../../../../helper/helper';
import File from '../../../../../images/file-icon.png';
import AddCustomer from '../../../modals/AddCustomer';
import { useHistory } from 'react-router-dom';
import { Prompt } from 'react-router';
import Files from 'react-files';
import Datetime from 'react-datetime';
import ProgressBar from 'react-bootstrap/ProgressBar';
import SweetAlert from 'react-bootstrap-sweetalert';
import './CreateFromScratch.css';
const CreateFromScratch = ({ t, location }) => {
  const history = useHistory();
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const [clients, setClients] = useState([]);
  const [success, setSucces] = useState(false);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const [task, setTask] = useState({
    customer: '',
    clientName: '',
    clientAddress: '',
    description: '',
    attachment: [],
    startDate: '',
    startDate1: '',
    endDate: '',
    estimation: '',
  });
  const [errors, setErrors] = useState({
    customer: '',
    clientName: '',
    clientAddress: '',
    description: '',
    attachment: '',
    startDate: '',
    endDate: '',
    estimation: '',
  });

  const {
    customer,
    clientName,
    clientAddress,
    attachment,
    startDate,
    endDate,
    startDate1,
    estimation,
    description,
  } = task;

  const token = localStorage.getItem('token');

  const getCustomers = async () => {
    await getData(`${url}/api/resources-client-list/Client`, token).then(
      (result) => {
        const { data } = result;

        setClients(data?.data);
      }
    );
  };

  useEffect(() => {
    getCustomers();
  }, []);

  const addCustomer = () => {
    getCustomers();
  };

  useEffect(() => {
    if (customer === 'Add new') {
      setIsAddCustomerModalOpen(true);
    }
  }, [customer]);

  const createProj = async () => {
    setLoading(true);
    let hasErrors = false;
    let newErrors = { ...errors };

    if (hasErrors) {
      setErrors(newErrors);
      return;
    } else {
      const formData = new FormData();
      formData.append('client_id', customer);
      formData.append('name', clientName);
      formData.append('address', clientAddress);
      formData.append('description', description);
      formData.append('start_date', startDate);
      formData.append('end_date', endDate);
      formData.append('original_estimation', estimation);
      for (const key of Object.keys(attachment)) {
        if (attachment[key] !== null) {
          formData.append('attachment[]', attachment[key]);
        }
      }
      await postDataWithToken(
        `${url}/api/project/create_scratch`,
        formData,
        token
      )
        .then((result) => {
          console.log(result);
          //const { data } = result;
          if (result.status === 201) {
            setLoading(false);
            setSucces(true);
            setWarning(false);
            setRedirect(false);
          }
        })
        .catch((errors) => {
          console.log('error=>', errors);
        });
    }
  };

  const onFilesChange = (files) => {
    setTask({
      ...task,
      attachment: files,
    });
    setLoaded(50);

    if (loaded <= 100) {
      setTimeout(setLoaded(100), 2000); // wait 2 seconds, then reset to false
    }
  };

  const handleKeyDownCus = (evt) => {
    if (['Enter'].includes(evt.key)) {
      evt.preventDefault();
    }
  };

  const inputPropsDate = {
    onKeyDown: handleKeyDownCus,
    placeholder: 'DD-MM-YYYY',
    className: 'form-control-date',
  };

  const valid = (current) => {
    let yesterday = moment().subtract(1, 'day');
    if (current) {
      return current.isAfter(yesterday);
    }
  };

  const valid2 = (current) => {
    const startDate1 = moment(startDate);
    return current.isAfter(startDate1);
  };

  const Remove_img = () => {
    setTask({
      ...task,
      attachment: '',
    });
    setLoaded(0);
  };

  const onFilesError = (error, file) => {
    setErrors({
      ...errors,
      attachment: error.message,
    });
  };

  const onConfirmError = () => {
    setSucces(false);
    setWarning(true);
    setRedirect(false);
    history.push('/manage-projects');
  };
  console.log(task);
  return (
    <>
      {redirect && !success ? (
        <Prompt
          when={redirect}
          message={t('marketplace.feeds.list_details.leave_page')}
        />
      ) : (
        ''
      )}

      <>
        {success ? (
          <SweetAlert
            success
            closeOnClickOutside={true}
            title={t('myBusiness.report.SuccessPopup')}
            onConfirm={onConfirmError}
          ></SweetAlert>
        ) : (
          ''
        )}
        <div className='card' style={{ maxWidth: '730px' }}>
          <div className='card-body'>
            <section className='card-one'>
              <div className='subcard-one'>
                <label htmlFor='customer' className='title'>
                  {t('projectManagment.Create.add_customer')}
                </label>
                <label className='report-customer'>
                  <div className='select_and_button'>
                    <select
                      required
                      name='customer'
                      id='customer'
                      className='select-customer'
                      onChange={(e) => {
                        setTask({
                          ...task,
                          customer: e.target.value,
                        });
                        setErrors({
                          ...errors,
                          customer: '',
                        });
                      }}
                    >
                      <option>{t('myBusiness.report.select_customer')}</option>
                      {clients &&
                        clients.map((client) => {
                          return (
                            <option
                              key={client.ur_resource_id}
                              value={client.ur_resource_id}
                            >
                              {client.first_name} {client.last_name} |{' '}
                              {client.company}
                            </option>
                          );
                        })}
                      <option>Add new</option>
                    </select>
                  </div>
                  <p className='error'>{errors.customer}</p>
                </label>
              </div>
              <div className='subcard-one'>
                <label className='title'>
                  {t('projectManagment.Create.name')}
                </label>
                <input
                  className='task-name'
                  type='text'
                  onChange={(e) =>
                    setTask({
                      ...task,
                      clientName: e.target.value,
                    })
                  }
                />
              </div>
              <p className='error' style={{ textAlign: 'center' }}>
                {errors.taskName}
              </p>
              <div className='subcard-one'>
                <label className='title'>
                  {t('projectManagment.Create.address')}
                </label>
                <input
                  className='add-address'
                  type='text'
                  placeholder={t('projectManagment.Create.add_address')}
                  onChange={(e) =>
                    setTask({
                      ...task,
                      clientAddress: e.target.value,
                    })
                  }
                />
                <label></label>
                <textarea
                  className='task-description'
                  type='text'
                  placeholder={t('projectManagment.Create.description')}
                  onChange={(e) =>
                    setTask({
                      ...task,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <p className='error' style={{ textAlign: 'center' }}>
                {errors.taskAddress}
              </p>
              <p className='error' style={{ textAlign: 'center' }}>
                {errors.description}
              </p>
            </section>
            <section className='card-two'>
              <div className='subcard-two'>
                <label className='title'>
                  {t('projectManagment.Create.attachment')}
                </label>
                <div className='form-group'>
                  <div className='file-select'>
                    <Files
                      className='files-dropzone'
                      onChange={(e) => onFilesChange(e)}
                      onError={(e) => onFilesError(e)}
                      accepts={[
                        'image/gif',
                        '.doc ',
                        '.docx',
                        'image/jpeg',
                        'image/png',
                        'image/jpg',
                        '.svg',
                        '.pdf',
                      ]}
                      multiple
                      maxFileSize={10000000}
                      minFileSize={10}
                      clickable
                    >
                      <label htmlFor='attachment'>
                        {attachment.length <= 0 ? (
                          <img src={File} alt='...' />
                        ) : (
                          attachment.map((url, i) => (
                            <div key={i}>
                              <img
                                style={{
                                  height: '100px',
                                }}
                                src={
                                  attachment.length <= 0
                                    ? File
                                    : url.preview.url
                                }
                                alt='...'
                              />
                            </div>
                          ))
                        )}
                        <span className='status'>
                          {' '}
                          {t(
                            'marketplace.feeds.list_details.Upload_status'
                          )}{' '}
                        </span>
                        <ProgressBar
                          now={loaded}
                          style={{ marginBottom: '1rem' }}
                        />
                        <small className='form-text text-muted'>
                          {t('marketplace.feeds.list_details.ext')}
                        </small>
                      </label>
                    </Files>
                  </div>
                  <p style={{ color: '#eb516d', fontSize: '15px' }}>
                    {/* {this.state.img_name ? this.state.img_name : ""} */}
                    {errors.attachment ? errors.attachment : ''}
                  </p>
                  {task.attachment ? (
                    <button
                      type='button'
                      onClick={Remove_img}
                      className='btn btn-danger'
                    >
                      {t('marketplace.feeds.list_details.Remove')}
                    </button>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </section>
            <section className='card-three'>
              <div className='subcard-three'>
                <label className='title'>
                  {t('projectManagment.Create.start_date')}
                </label>
                <div className='start-date'>
                  <Datetime
                    onChange={(e) =>
                      setTask({
                        ...task,
                        startDate: e,
                        startDate1: e,
                      })
                    }
                    className='form-control-date'
                    isValidDate={valid}
                    name='start_date'
                    dateFormat='DD-MM-YYYY'
                    value={startDate1}
                    timeFormat={false}
                    style={{ fontSize: '15px' }}
                    // type="date"
                    locale={`${
                      localStorage.getItem('_lng') === 'fi' ? 'fr-fi' : 'en-US'
                    } `}
                    inputProps={inputPropsDate}
                  />
                </div>
              </div>
              <div className='subcard-three'>
                <label className='title'>
                  {t('projectManagment.Create.end_date')}
                </label>
                <div className='end-date'>
                  <Datetime
                    onChange={(e) =>
                      setTask({
                        ...task,
                        endDate: e,
                      })
                    }
                    isValidDate={valid2}
                    name='end_date'
                    className='form-control-date'
                    dateFormat='DD-MM-YYYY'
                    value={endDate}
                    timeFormat={false}
                    type='date'
                    locale={`${
                      localStorage.getItem('_lng') === 'fi' ? 'fr-fi' : 'en-US'
                    } `}
                    inputProps={inputPropsDate}
                  />
                </div>
              </div>
              <div className='subcard-three'>
                <label className='title'>
                  {t('projectManagment.Create.original_estimation')}
                </label>
                <input
                  className='estimation'
                  value={estimation}
                  type='text'
                  onChange={(e) =>
                    setTask({
                      ...task,
                      estimation: e.target.value,
                    })
                  }
                />
              </div>
            </section>
            <div className='buttons'>
              <div>
                <button className='publish' onClick={createProj}>
                  {t('projectManagment.Create.create_project')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
      <AddCustomer
        show={isAddCustomerModalOpen}
        handleClose={() => setIsAddCustomerModalOpen(false)}
        addCus={addCustomer}
        relod={getCustomers}
      />
    </>
  );
};

export default withTranslation()(CreateFromScratch);
