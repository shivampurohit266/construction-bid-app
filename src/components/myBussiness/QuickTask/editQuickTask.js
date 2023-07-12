import React, { useState, useEffect } from 'react';
import Datetime from 'react-datetime';
import { Link } from 'react-router-dom';
import Sidebar from '../../shared/Sidebar';
import File from '../../../images/file-icon.png';
import { url } from '../../../helper/helper';
import { withTranslation } from 'react-i18next';
import AddCustomer from '../../myBussiness/modals/AddCustomer';
import moment from 'moment';
import Files from 'react-files';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Breadcrumb from '../../shared/Breadcrumb';
//import './quickTask.css';
import { getData } from '../../../helper/api';
import { postDataWithToken } from '../../../helper/api';

const EditQuickTask = ({ t, location }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [task, setTask] = useState({
    customer: '',
    taskName: '',
    taskAddress: '',
    taskDescription: '',
    attachment: [],
    assignee: '',
    reporter: '',
    startDate: '',
    startDate1: '',
    endDate: '',
    estimation: '',
  });
  const [errors, setErrors] = useState({
    customer: '',
    taskName: '',
    taskAddress: '',
    taskDescription: '',
    attachment: '',
    assignee: '',
    reporter: '',
    startDate: '',
    endDate: '',
    estimation: '',
  });
  const [loaded, setLoaded] = useState(0);

  const {
    customer,
    taskName,
    taskAddress,
    taskDescription,
    attachment,
    assignee,
    reporter,
    startDate,
    startDate1,
    endDate,
    estimation,
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

  const handleKeyDownCus = (evt) => {
    if (['Enter'].includes(evt.key)) {
      evt.preventDefault();
    }
  };

  const inputPropsDate = {
    onKeyDown: handleKeyDownCus,
    placeholder: 'DD-MM-YYYY',
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

  const onFilesError = (error, file) => {
    setErrors({
      ...errors,
      attachment: error.message,
    });
  };

  const Remove_img = () => {
    setTask({
      ...task,
      attachment: '',
    });
    setLoaded(0);
  };

  useEffect(() => {
    getCustomers();
  }, []);

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
  useEffect(() => {
    if (customer === 'Add new') {
      setIsAddCustomerModalOpen(true);
    }
  }, [customer]);

  const createTask = async () => {
    setLoading(true);
    let hasErrors = false;
    let newErrors = { ...errors };

    if (!customer) {
      setLoading(false);
      hasErrors = true;
      newErrors.customer = t('myBusiness.task.customer');
    }
    if (!taskName) {
      setLoading(false);
      hasErrors = true;
      newErrors.taskName = t('myBusiness.task.name');
    }
    if (!taskAddress) {
      setLoading(false);
      hasErrors = true;
      newErrors.taskAddress = t('myBusiness.task.address');
    }
    if (!taskDescription) {
      setLoading(false);
      hasErrors = true;
      newErrors.taskDescription = t('myBusiness.task.description');
    }
    if (!attachment) {
      setLoading(false);
      hasErrors = true;
      newErrors.attachment = t('myBusiness.task.attachment');
    }
    if (!startDate) {
      setLoading(false);
      hasErrors = true;
      newErrors.startDate = t('myBusiness.task.start_date');
    }
    if (!endDate) {
      setLoading(false);
      hasErrors = true;
      newErrors.endDate = t('myBusiness.task.end_date');
    }
    if (!estimation) {
      setLoading(false);
      hasErrors = true;
      newErrors.estimation = t('myBusiness.task.estimation');
    }
    if (hasErrors) {
      setErrors(newErrors);
      return;
    } else {
      const formData = new FormData();
      formData.append(
        'task_customer_id',
        customer !== 'Select Customer' ? customer : ''
      );
      formData.append('task_name', taskName);
      formData.append('task_address', taskAddress);
      formData.append('task_description', taskDescription);
      formData.append('start_date', startDate);
      formData.append('end_date', endDate);
      formData.append('estimation', estimation);

      for (const key of Object.keys(attachment)) {
        if (attachment[key] !== null) {
          formData.append('attachment[]', attachment[key]);
        }
      }

      await postDataWithToken(
        `${url}/pms/project/create/quicktask`,
        formData,
        token
      )
        .then((result) => {
          //const { data } = result;

          setLoading(false);
          // setSucces(true);
          // setWarning(false);

          // setRedirect(true);
        })
        .catch((errors) => {
          console.log('error=>', errors);
        });
    }
  };

  const addCustomer = () => {
    getCustomers();
  };

  return (
    <>
      <div className='sidebar-toggle'></div>

      <Breadcrumb>
        <Link
          to='/business-dashboard'
          className='breadcrumb-item active'
          aria-current='page'
        >
          {t('myBusiness.task.heading')}
        </Link>

        <li className='breadcrumb-item active' aria-current='page'>
          {t('myBusiness.task.create')}
        </li>
      </Breadcrumb>
      <div className='main-content'>
        <Sidebar dataFromParent={location.pathname} />
        <div className='page-content'>
          <div className='container-fluid'>
            <div className='myProfile-edit'></div>
            <div className='card'>
              <div className='card-body'>
                <section className='card-one'>
                  <div className='subcard-one'>
                    <label htmlFor='customer' className='title'>
                      Add Customer
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
                          <option>
                            {t('myBusiness.report.select_customer')}
                          </option>
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
                    <label className='title'>Task Name</label>
                    <input
                      className='task-name'
                      type='text'
                      onChange={(e) =>
                        setTask({
                          ...task,
                          taskName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <p className='error' style={{ textAlign: 'center' }}>
                    {errors.taskName}
                  </p>
                  <div className='subcard-one'>
                    <label className='title'>Task Address</label>
                    <input
                      className='add-address'
                      type='text'
                      placeholder='add address'
                      onChange={(e) =>
                        setTask({
                          ...task,
                          taskAddress: e.target.value,
                        })
                      }
                    />

                    <label></label>
                    <textarea
                      className='description'
                      type='text'
                      placeholder='description'
                      onChange={(e) =>
                        setTask({
                          ...task,
                          taskDescription: e.target.value,
                        })
                      }
                    />
                  </div>
                  <p className='error' style={{ textAlign: 'center' }}>
                    {errors.taskAddress}
                  </p>
                  <p className='error' style={{ textAlign: 'center' }}>
                    {errors.taskDescription}
                  </p>
                </section>
                <section className='card-two'>
                  <div className='subcard-two'>
                    <label className='title'>Attachment</label>
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
                  <div className='subcard-two'>
                    <label className='title'>Assignee</label>
                    <input
                      className='task-name'
                      type='text'
                      onChange={(e) =>
                        setTask({
                          ...task,
                          assignee: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className='subcard-two'>
                    <label className='title'>Reporter</label>
                    <input
                      className='task-name'
                      type='text'
                      onChange={(e) =>
                        setTask({
                          ...task,
                          reporter: e.target.value,
                        })
                      }
                    />
                  </div>
                </section>
                <section className='card-three'>
                  <div className='subcard-three'>
                    <label className='title'>Start date</label>
                    <div className='start-date'>
                      <Datetime
                        onChange={(e) =>
                          setTask({
                            ...task,
                            startDate: e,
                            startDate1: e,
                          })
                        }
                        isValidDate={valid}
                        name='start_date'
                        dateFormat='DD-MM-YYYY'
                        value={startDate1}
                        timeFormat={false}
                        // type="date"
                        locale={`${
                          localStorage.getItem('_lng') === 'fi'
                            ? 'fr-fi'
                            : 'en-US'
                        } `}
                        inputProps={inputPropsDate}
                      />
                    </div>
                  </div>
                  <div className='subcard-three'>
                    <label className='title'>End date</label>
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
                        dateFormat='DD-MM-YYYY'
                        value={endDate}
                        timeFormat={false}
                        // type="date"
                        locale={`${
                          localStorage.getItem('_lng') === 'fi'
                            ? 'fr-fi'
                            : 'en-US'
                        } `}
                        inputProps={inputPropsDate}
                      />
                    </div>
                  </div>
                  <div className='subcard-three'>
                    <label className='title'>Original Estimation</label>
                    <input
                      className='estimation'
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
                    <button className='publish' onClick={createTask}>
                      Publish Task
                    </button>
                  </div>
                  <div>
                    <button className='save'>Save</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <AddCustomer
            show={isAddCustomerModalOpen}
            handleClose={() => setIsAddCustomerModalOpen(false)}
            addCus={addCustomer}
            relod={getCustomers}
          />
        </div>
      </div>
    </>
  );
};

export default withTranslation()(EditQuickTask);
