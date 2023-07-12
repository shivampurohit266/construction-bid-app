import React, { useState, useEffect } from 'react';
import Datetime from 'react-datetime';
import { Link } from 'react-router-dom';
import Sidebar from '../../../../shared/Sidebar';
import { useHistory } from 'react-router-dom';
import File from '../../../../../images/file-icon.png';
import { url } from '../../../../../helper/helper';
import { withTranslation } from 'react-i18next';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Prompt } from 'react-router';
import AddCustomer from '../../../modals/AddCustomer';
import moment from 'moment';
import { Multiselect } from 'multiselect-react-dropdown';
import Files from 'react-files';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Breadcrumb from '../../../../shared/Breadcrumb';
import './quickTask.css';
import { getData } from '../../../../../helper/api';
import { postDataWithToken } from '../../../../../helper/api';
import AddHrs from '../../../QuickTask/addHrs';
const QuickTask = ({ t, location }) => {
  const history = useHistory();
  const [clients, setClients] = useState([]);
  const [success, setSucces] = useState(false);
  const [warning, setWarning] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  //const [selectedCustomer, setSelectedCustomer] = useState('');
  const [resources, setResources] = useState([]);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [task, setTask] = useState({
    customer: '',
    taskName: '',
    taskAddress: '',
    taskDescription: '',
    attachment: [],
    assignee: [],
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
    assignee: [],
    reporter: '',
    startDate: '',
    endDate: '',
    estimation: '',
  });
  const [loaded, setLoaded] = useState(0);
  const [imgName, setImgName] = useState('');
  const [checkpoint, setCheckpoint] = useState([]);
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
        if (data !== undefined) {
          setClients(data?.data);
        }
      }
    );
  };

  const handleKeyDownCus = (evt) => {
    if (['Enter'].includes(evt.key)) {
      evt.preventDefault();
    }
  };
  const getResourcesCustomers = async () => {
    await getData(`${url}/api/project/create_quicktask_form`, token).then(
      (result) => {
        let customers = result?.data?.customers.map(
          ({ ur_id, first_name, last_name }) => {
            return { id: ur_id, full_name: first_name + ' ' + last_name };
          }
        );
        setCustomers(customers);

        setResources(result?.data?.resources);
      }
    );
  };

  const inputPropsDate = {
    onKeyDown: handleKeyDownCus,
    placeholder: 'DD-MM-YYYY',
    className: 'form-control-date',
  };

  const onFilesChange = (files) => {
    setTask({
      ...task,
      attachment: files,
    });
    setLoaded(50);
    setImgName(files[0].name);

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

    setImgName('');
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
    console.log('Add new ==>');
    console.log(customer);
    if (customer === 'Add new') {
      console.log('Here...');
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
      formData.append('client_id', customer);
      formData.append('name', taskName);
      formData.append('address', taskAddress);
      formData.append('assignee_to_selection', assignee);
      formData.append('report_to', reporter);
      formData.append('task_description', taskDescription);
      formData.append('start_date', startDate);
      formData.append('end_date', endDate);
      formData.append('deadline', estimation);

      for (const key of Object.keys(attachment)) {
        if (attachment[key] !== null) {
          formData.append('attachment[]', attachment[key]);
        }
      }

      await postDataWithToken(
        `${url}/api/project/create_quicktask`,
        formData,
        token
      )
        .then((result) => {
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

  const addCustomer = () => {
    getCustomers();
  };

  useEffect(() => {
    getResourcesCustomers();
  }, []);

  console.log(resources);
  const onRemoveCustomers = (selectedList, removedItem) => {
    const mapCustomers = selectedList.map((customer) => customer.id);
    const filter = mapCustomers.filter(
      (customer) => customer !== removedItem.id
    );
    setTask({
      ...task,
      assignee: filter,
    });
    //setSelectedCustomers(filter);
  };

  const onSelectCustomers = (selectedList, selectedItem) => {
    const selected = selectedList.map((customer) => customer.id);
    let list = [];
    list.push(...selected, selectedItem.id);
    let unique = [...new Set(list)];
    setTask({
      ...task,
      assignee: unique,
    });
    //setSelectedCustomers(unique);
  };
  const checkallfields = () => {
    if (
      customer ||
      taskName ||
      taskAddress ||
      taskDescription ||
      startDate ||
      endDate ||
      attachment ||
      assignee ||
      reporter
    ) {
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

  const onConfirmError = () => {
    setSucces(false);
    setWarning(true);
    setRedirect(false);
    history.push('/manage-projects');
  };
  console.log(task, selectedCustomers, redirect);
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
      <div className='sidebar-toggle'></div>

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
                {' '}
                {t('projectManagment.Create.task_name')}
              </label>
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
              <label className='title'>
                {' '}
                {t('projectManagment.Create.task_address')}
              </label>
              <input
                className='add-address'
                type='text'
                placeholder={t('projectManagment.Create.add_address')}
                onChange={(e) =>
                  setTask({
                    ...task,
                    taskAddress: e.target.value,
                  })
                }
              />

              <label></label>
              <textarea
                className='task-description'
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
                                attachment.length <= 0 ? File : url.preview.url
                              }
                              alt='...'
                            />
                          </div>
                        ))
                      )}
                      <span className='status'>
                        {' '}
                        {t('marketplace.feeds.list_details.Upload_status')}{' '}
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
              <label className='title'>
                {' '}
                {t('projectManagment.Create.assignee')}
              </label>
              {/* <input
                      className='task-name'
                      type='text'
                      onChange={(e) =>
                        setTask({
                          ...task,
                          assignee: e.target.value,
                        })
                      }
                    /> */}

              <span className='p-float-label'>
                <Multiselect
                  options={customers}
                  selectedValues={(e) =>
                    setTask({
                      ...task,
                      assignee: e.value,
                    })
                  }
                  displayValue='full_name'
                  onRemove={onRemoveCustomers}
                  onSelect={onSelectCustomers}
                  // selectedList={savedConstruction}
                  placeholder={t('account.professional.select')}
                />
              </span>
            </div>
            <div className='subcard-two'>
              <label className='title'>
                {' '}
                {t('projectManagment.Create.reporter')}
              </label>
              {/* <input
                      className='task-name'
                      value={resources}
                      type='text'
                      onChange={(e) =>
                        setTask({
                          ...task,
                          reporter: e.target.value,
                        })
                      }
                    /> */}
              <select
                onChange={(e) =>
                  setTask({
                    ...task,
                    reporter: e.target.value,
                  })
                }
                value={reporter}
                className='task-name'
              >
                <option>{t('account.professional.select')}</option>
                {resources &&
                  resources.map((resource) => {
                    return (
                      <option key={resource.id} value={resource.id}>
                        {resource.first_name} {resource.last_name}
                      </option>
                    );
                  })}
              </select>
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
                {t('projectManagment.Create.publish')}
              </button>
            </div>
            <div>
              <button className='save'>Save</button>
            </div>
          </div>
          {/* <section>
                  <AddHrs />
                </section> */}
        </div>
      </div>

      <AddCustomer
        show={isAddCustomerModalOpen}
        handleClose={() => setIsAddCustomerModalOpen(false)}
        addCus={addCustomer}
        relod={getCustomers}
      />
    </>
  );
};

export default withTranslation()(QuickTask);
