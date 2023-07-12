import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { getData, postDataWithToken } from '../../../../../helper/api';
import { url } from '../../../../../helper/helper';
import AddCustomer from '../../../modals/AddCustomer/addCustomer';
import { useHistory } from 'react-router-dom';
import Datetime from 'react-datetime';
import { Prompt } from 'react-router';
import SweetAlert from 'react-bootstrap-sweetalert';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Files from 'react-files';
import File from '../../../../../images/file-icon.png';
const CreateFromAggrement = ({ t, location }) => {
  const history = useHistory();
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const [success, setSucces] = useState(false);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [clients, setClients] = useState([]);

  const [task, setTask] = useState({
    agreementInfo: '',
    client_id: '',
    clientName: '',
    clientAddress: '',
    aggrement_id: '',
    clientDescription: '',
    attachment: [],
    startDate: '',
    startDate1: '',
    endDate: '',
    estimation: '',
  });
  const [errors, setErrors] = useState({
    agreementInfo: '',
    client_id: '',
    clientName: '',
    clientAddress: '',
    attachment: [],
    aggrement_id: '',
    clientDescription: '',
    startDate: '',
    endDate: '',
    estimation: '',
  });

  const {
    agreementInfo,
    client_id,
    clientName,
    clientAddress,
    aggrement_id,
    clientDescription,
    startDate,
    startDate1,
    attachment,
    endDate,
    estimation,
  } = task;

  const token = localStorage.getItem('token');

  const getAgreement = async () => {
    await getData(`${url}/api/project/aggrement_list`, token).then((result) => {
      console.log(result?.data, client_id);
      setClients(result?.data);
      const agreement = result?.data.find((result) => {
        if (result.agreement_id === Number(aggrement_id)) {
          setTask({
            ...task,
            clientName: result?.agreement_names,
            clientAddress: result?.agreement_client_address,
            startDate: result?.agreement_start_date,
            endDate: result?.agreement_end_date,
          });
        }
      });
    });
  };

  useEffect(() => {
    getAgreement();
  }, [client_id]);

  const createAgreement = async () => {
    setLoading(true);
    let hasErrors = false;
    let newErrors = { ...errors };

    if (hasErrors) {
      setErrors(newErrors);
      return;
    } else {
      const formData = new FormData();
      formData.append('client_id', client_id);
      formData.append('name', clientName);
      formData.append('address', clientAddress);
      formData.append('aggrement_id', aggrement_id);
      formData.append('description', clientDescription);
      formData.append('start_date', startDate);
      formData.append('end_date', endDate);
      formData.append('original_estimation', estimation);
      for (const key of Object.keys(attachment)) {
        if (attachment[key] !== null) {
          formData.append('attachment[]', attachment[key]);
        }
      }
      await postDataWithToken(
        `${url}/api/project/create_from_aggrement`,
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

  const checkallfields = () => {
    if (client_id || clientName || clientAddress) {
      setRedirect(true);
    } else {
      setRedirect(false);
    }
  };

  useEffect(() => {
    setInterval(() => {
      checkallfields();
    }, 1000);
  }, []);

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
      {/* <Header active={'bussiness'} /> */}
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
                <label className='title'>
                  {' '}
                  {t('projectManagment.Create.choose_agreement')}
                </label>
                <label className='report-customer'>
                  <div className='select_and_button'>
                    <select
                      required
                      name='agreement'
                      id='agreement'
                      className='select-customer'
                      onChange={(e) => {
                        setTask({
                          ...task,
                          agreementInfo: e.target.value,
                          client_id:
                            e.target.options[
                              e.target.options.selectedIndex
                            ].getAttribute('id'),
                          aggrement_id:
                            e.target.options[
                              e.target.options.selectedIndex
                            ].getAttribute('agdata'),
                        });
                        setErrors({
                          ...errors,
                          agreementInfo: '',
                          client_id: '',
                        });
                      }}
                    >
                      <option value=''>
                        {' '}
                        {t('projectManagment.Create.select_agreement')}
                      </option>
                      {clients &&
                        clients.map((c) => (
                          <option
                            id={c.agreement_client_id}
                            agdata={c.agreement_id}
                          >
                            {' '}
                            {c.agreement_names}
                          </option>
                        ))}
                    </select>
                  </div>
                  <p className='error'>{errors.agreementInfo}</p>
                </label>
              </div>
              <div className='subcard-one'>
                <label className='title'>
                  {' '}
                  {t('projectManagment.Create.name')}
                </label>
                <input
                  type='text'
                  className='task-name'
                  placeholder='Name'
                  value={clientName}
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
                  {' '}
                  {t('projectManagment.Create.address')}
                </label>
                <input
                  className='add-address'
                  placeholder={t('projectManagment.Create.add_address')}
                  value={clientAddress}
                  onChange={(e) =>
                    setTask({
                      ...task,
                      clientAddress: e.target.value,
                    })
                  }
                ></input>
                <label></label>
                <textarea
                  className='task-description'
                  type='text'
                  placeholder={t('projectManagment.Create.description')}
                  onChange={(e) =>
                    setTask({
                      ...task,
                      clientDescription: e.target.value,
                    })
                  }
                />
              </div>
              <p className='error' style={{ textAlign: 'center' }}>
                {errors.clientAddress}
              </p>
              <p className='error' style={{ textAlign: 'center' }}>
                {errors.clientDescription}
              </p>
            </section>
            <section className='card-two'>
              <div className='subcard-two'>
                <label className='title'>
                  {' '}
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
                        {attachment?.length <= 0 ? (
                          <img src={File} alt='...' />
                        ) : (
                          attachment?.map((url, i) => (
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
                  {' '}
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
                    value={startDate ? startDate : startDate1}
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
                  {' '}
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
                  {' '}
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
                <button className='publish' onClick={createAgreement}>
                  {t('projectManagment.Create.create_project')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default withTranslation()(CreateFromAggrement);
