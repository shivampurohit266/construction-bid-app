import React, { useState, useEffect, useRef } from 'react';
import { withTranslation } from 'react-i18next';
import { Multiselect } from 'multiselect-react-dropdown';
import Alert from 'react-bootstrap/Alert';
import { url } from '../../../../helper/helper';
import ClipLoader from 'react-spinners/ClipLoader';
import Datetime from 'react-datetime';
import moment from 'moment';
import { dateFunc } from '../../../../helper/dateFunc/date';
import { useHistory } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import File from '../../../../images/file-icon.png';
import Files from 'react-files';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Attachment from '../../../../images/Vector-8.png';
import Url from '../../../../images/vector-7.png';
import { postDataWithToken } from '../../../../helper/api';
import './DetailTaskPanel.css';
const Checkpoint = [
  {
    id: 1,
    name: 'Signature',
    value: 'Signature',
    file: null,
    selected: '',
    loaded: 0,
  },
  {
    id: 2,
    name: 'Report',
    value: 'Report',
    file: null,
    selected: '',
    loaded: 0,
  },
  { id: 3, name: 'Image', value: 'Image', file: null, selected: '', loaded: 0 },
  {
    id: 4,
    name: 'Audits',
    value: 'Audits',
    file: null,
    selected: '',
    loaded: 0,
  },
];
const DetailTaskPanel = ({
  t,
  show,
  params,
  taskId,
  resource,
  drawerToggleTask,
  backdrop,
}) => {
  const history = useHistory();
  const inputReference = useRef();
  const lang = localStorage.getItem('_lng');
  const [customers, setCustomers] = useState([]);
  const [edit, setEdit] = useState(false);
  const [success, setSucces] = useState(false);
  const [alert, setAlert] = useState(false);
  const [totalHrs, setTotalHrs] = useState(0);
  const [redirect, setRedirect] = useState(false);
  const [warning, setWarning] = useState(false);
  const [timeDetails, setTimeDetails] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkpoints, setCheckpoints] = useState(Checkpoint);
  const [task, setTask] = useState({
    taskName: '',
    taskDescription: '',
    attachment: [],
    assignee: [],
    savedAssignee: [],
    reporter: '',
    checkpoint: [],
    savedCheckpoint: [],
    reporterId: '',
    startDate: '',
    startDate1: '',
    selectedDate: '',
    endDate: '',
    estimation: '',
    status: '',
    comment: '',
    addHrs: '',
    attachment_url: '',
    signature_url: '',
    report_url: '',
    image_url: '',
    audits_url: '',
    editHrs: false,
    editDate: false,
    editComment: false,
    editCheckpoint: false,
    created_at: '',
  });
  const [errors, setErrors] = useState({
    taskName: '',
    taskDescription: '',
    attachment: [],
    assignee: [],
    savedAssignee: [],
    reporter: '',
    checkpoint: [],
    savedCheckpoint: [],
    reporterId: '',
    startDate: '',
    endDate: '',
    selectedDate: '',
    estimation: '',
    comment: '',
    addHrs: '',
    status: '',
    created_at: '',
  });
  const {
    taskDescription,
    attachment,
    assignee,
    savedAssignee,
    reporter,
    reporterId,
    startDate,
    startDate1,
    endDate,
    status,
    estimation,
    taskName,
    selectedDate,
    checkpoint,
    savedCheckpoint,
    comment,
    addHrs,
    attachment_url,
    signature_url,
    report_url,
    image_url,
    audits_url,
    editHrs,
    editDate,
    editComment,
    editCheckpoint,
    created_at,
  } = task;

  const multiselectRef = useRef();
  const multiselectRef2 = useRef();

  const resetSelectField = () => {
    multiselectRef.current.resetSelectedValues();
    multiselectRef2.current.resetSelectedValues();
  };

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('Login_user_id');
  // const getResourcesCustomers = async () => {
  //   await getData(`${url}/api/project/create_quicktask_form`, token).then(
  //     (result) => {
  //       let customers = result?.data?.customers.map(
  //         ({ ur_id, first_name, last_name }) => {
  //           return { id: ur_id, full_name: first_name + ' ' + last_name };
  //         }
  //       );
  //       setCustomers(customers);
  //       setResources(result?.data?.resources);
  //     }
  //  );
  // };

  const getCustomers = (resources) => {
    return resources?.map(({ ur_id, first_name, last_name }) => {
      return { id: ur_id, full_name: first_name + ' ' + last_name };
    });
  };

  const taskDetails = async () => {
    const token = localStorage.getItem('token');
    await postDataWithToken(
      `${url}/api/project/edit_task`,
      {
        project_id: params.id,
        task_id: taskId?.toString(),
      },
      token
    ).then((result) => {
      if (result?.data?.task === undefined) {
        setTask({
          ...task,
          taskName: '',
          comment: '',
          addHrs: '',
          taskDescription: '',
          attachment: [],
          assignee: [],
          savedAssignee: [],
          reporter: '',
          reporterId: '',
          startDate: '',
          endDate: '',
          attachment_url: '',
          estimation: '',
          status: '',
          checkpoint: [],
          savedCheckpoint: [],
          editHrs: true,
          editDate: true,
          editComment: true,
          editCheckpoint: true,
          created_at: '',
        });
        setEdit(true);
        setTotalHrs(0);
        setTimeDetails(result?.data?.task?.time);
        getCheckpoints(checkpoints, '');

        //setCheckpoints(getCheckpoints(checkpoints, undefined));
      } else {
        const {
          task_name,
          checkpoint,
          description,
          created_at,
          start_date,
          end_date,
          duration,
          status,
          attachment,
          report_to,
          assignee_to,
          pro_user_id,
          attachment_url,
          checkpoint_signature_url,
          checkpoint_report_url,
          checkpoint_image_url,
          checkpoint_audits_url,
        } = result?.data?.task;
        setTimeDetails(result?.data?.task?.time);
        setTotalHrs(result?.data?.total_logged_hours);

        setTask({
          ...task,
          taskName: task_name,
          addHrs: '',
          comment: '',
          taskDescription: description,
          attachment: attachment ? JSON.parse(attachment) : [],
          assignee: assignee_to?.split(','),
          savedAssignee: resource?.filter(
            (el) => assignee_to?.split(',').indexOf(el.ur_id.toString()) >= 0
          ),

          reporterId: report_to,
          reporter: resource?.find(
            ({ ur_resource_id }) => ur_resource_id === report_to
          ),
          startDate: new Date(start_date).toLocaleDateString('es-CL'),
          endDate: new Date(end_date).toLocaleDateString('es-CL'),
          estimation: duration,
          status: status,
          attachment_url: attachment_url,
          editHrs: false,
          signature_url: checkpoint_signature_url,
          report_url: checkpoint_report_url,
          image_url: checkpoint_image_url,
          audits_url: checkpoint_audits_url,
          editDate: false,
          created_at: created_at,
          editComment: false,
          checkpoint: checkpoint?.split(','),
          editCheckpoint: false,
          savedCheckpoint: checkpoints?.filter(
            (el) => checkpoint?.split(',').indexOf(el.value) >= 0
          ),
        });
        setEdit(pro_user_id == userId ? true : false);
        getCheckpoints(checkpoints, checkpoint?.split(','));
      }
    });
  };

  const getCheckpoints = (selectedList, selectedItem) => {
    console.log(selectedList, selectedItem);
    setCheckpoints((prev) => {
      const checkpointValue = prev?.filter((point) => {
        return selectedItem?.includes(point.value);
      });
      console.log(checkpointValue);
      if (checkpointValue?.length > 0) {
        return prev.map((item) =>
          selectedItem.includes(item.value)
            ? { ...item, selected: item.value, file: null, loaded: 0 }
            : item
        );
      }
      if (checkpointValue?.length === 0) {
        return prev.map((item) =>
          item.selected !== '' ? { ...item, selected: '' } : item
        );
      }
      return [...prev, { ...selectedList }];
    });
  };

  const onRemoveCustomers = (selectedList, removedItem) => {
    const mapCustomers = selectedList.map((customer) => customer.id);
    const filter = mapCustomers.filter(
      (customer) => customer !== removedItem.id
    );
    setTask({
      ...task,
      assignee: filter,
    });
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
  };
  const onSelect = (selectedList, selectedItem) => {
    const selected = selectedList.map((checkpoint) => checkpoint.value);
    let list = [];
    list.push(...selected, selectedItem.value);
    let unique = [...new Set(list)];
    setTask({
      ...task,
      checkpoint: unique,
    });

    setCheckpoints((prev) => {
      const checkpointValue = prev.find((point) => {
        return point.value === selectedItem.value;
      });

      if (checkpointValue) {
        return prev.map((item) =>
          item.value === selectedItem.value
            ? { ...item, selected: selectedItem.value }
            : item
        );
      }

      return [...prev, { ...selectedItem }];
    });
  };

  const onRemove = (selectedList, removedItem) => {
    const mapCheckpoints = selectedList.map((checkpoint) => checkpoint.value);
    const filter = mapCheckpoints.filter(
      (checkpoint) => checkpoint !== removedItem.value
    );
    setTask({
      ...task,
      checkpoint: filter,
    });

    setCheckpoints((prev) => {
      const checkpointValue = prev.find((point) => {
        return point.value === removedItem.value;
      });

      if (checkpointValue) {
        return prev.map((item) =>
          item.value === removedItem.value ? { ...item, selected: '' } : item
        );
      }
      return [...prev, { ...removedItem }];
    });
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

  const valid3 = (current) => {
    const startDate1 = moment();
    const startDate2 = moment(created_at).subtract(1, 'day');

    return current.isAfter(startDate2) && current.isBefore(startDate1);
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
    disabled: !edit,
  };

  const inputPropsDate2 = {
    onKeyDown: handleKeyDownCus,
    placeholder: 'DD-MM-YYYY',
    className: 'form-control-date',
    disabled: editDate,
  };

  const onFilesChange = (files) => {
    setTask({
      ...task,
      attachment: files,
    });
  };

  const onFilesError = (error, file) => {
    setErrors({
      ...errors,
      attachment: error.message,
    });
  };

  const onImageUpload = (file) => {
    setCheckpoints((prev) => {
      const checkpointValue = prev.find((point) => {
        return point.value === file.selected;
      });
      if (checkpointValue) {
        return prev.map((item) =>
          item.value === file.selected
            ? { ...item, file: file.file, loaded: 100 }
            : item
        );
      }
      return [...prev, { ...file }];
    });
  };

  const Remove_img = (file) => {
    setCheckpoints((prev) => {
      const checkpointValue = prev.find((point) => {
        return point.value === file.selected;
      });

      if (checkpointValue) {
        return prev.map((item) =>
          item.value === file.selected
            ? { ...item, file: null, loaded: 0 }
            : item
        );
      }
      return [...prev, { ...file }];
    });
  };

  let drawerClasses = 'side-drawer';
  if (show) {
    drawerClasses = 'side-drawer open';
  }

  const getName = () => {
    return resource?.find((res) => res.ur_resource_id == reporterId)
      ?.first_name;
  };

  const checkValue = () => {
    if (reporterId === '--Select--') {
      return '';
    } else if (reporterId === '') {
      return '';
    } else {
      return 'table-name';
    }
  };

  const checker = (arr) => {
    return arr.every((v) => v === true);
  };

  const createTask = async () => {
    setLoading(true);
    let hasErrors = false;
    let newErrors = { ...errors };
    if (!taskName) {
      setLoading(false);
      hasErrors = true;
      newErrors.taskName = t('myBusiness.report.addTitle');
    }
    const checkSignature = checkpoints.map((checks) => checks.selected === '');
    const checkFile = checkpoints.map((checks) => checks.file == null);

    if (
      status === 'Done' &&
      checker(checkSignature) === true &&
      savedCheckpoint.length === 0
      // || (status === 'Done' && checker(checkFile) === true)
    ) {
      setLoading(false);
      setAlert(true);
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    } else {
      const formData = new FormData();
      formData.append('task_name', taskName);
      formData.append('assignee_to', assignee);
      formData.append('report_to', reporterId);
      formData.append('description', taskDescription);
      formData.append('start_date', startDate);
      formData.append('end_date', endDate);
      formData.append('duration', estimation);
      formData.append('status', status.replace(/\s/g, ''));
      formData.append('parent_id', 0);
      formData.append(
        'id',
        taskId != '[object Object]' ? taskId.toString() : ''
      );
      formData.append('comment', comment);
      formData.append('hours', addHrs);
      formData.append('date', selectedDate);
      formData.append('project_id', params.id);
      formData.append('checkpoint', checkpoint);
      formData.append(
        'add_time',
        addHrs || selectedDate || comment ? '1' : '0'
      );
      for (const key of Object.keys(attachment)) {
        if (attachment[key] !== null) {
          formData.append('attachment[]', attachment[key]);
        }
      }
      checkpoints.map((check) => {
        for (const key of Object.keys(check.file || {})) {
          if (check.file[key] !== null) {
            formData.append(check.selected?.toLowerCase(), check.file[key]);
          }
        }
      });

      await postDataWithToken(`${url}/api/project/update_task`, formData, token)
        .then((result) => {
          //const { data } = result;
          if (result.status === 200) {
            setLoading(false);
            setSucces(true);
            setWarning(false);
            setAlert(false);
            setRedirect(false);
            // window.location.reload();
          }
        })
        .catch((errors) => {
          console.log('error=>', errors);
        });
    }
  };

  const addHours = async () => {
    setLoading(true);
    let hasErrors = false;
    let newErrors = { ...errors };

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    const formData = new FormData();
    formData.append('project_id', params.id);
    formData.append('task_id', taskId?.toString());
    formData.append('comment', comment);
    formData.append('hours', addHrs);
    formData.append('date', selectedDate);
    checkpoints.map((check) => {
      for (const key of Object.keys(check.file || {})) {
        if (check.file[key] !== null) {
          formData.append('checkpoint', check.file[key]);
        }
      }
    });
    await postDataWithToken(`${url}/api/project/add_task_time`, formData, token)
      .then((result) => {
        console.log(result);
        if (result.status === 201) {
          setLoading(false);
          setSucces(true);
          setWarning(false);
          setAlert(false);
          setRedirect(false);
          // window.location.reload();
        }
      })
      .catch((errors) => {
        console.log('error=>', errors);
      });
  };

  const checkallfields = () => {
    if (
      taskDescription ||
      attachment ||
      assignee ||
      reporter ||
      startDate ||
      endDate ||
      status ||
      estimation ||
      taskName
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
    drawerToggleTask();
  };

  useEffect(() => {
    if (show) {
      taskDetails();
    }
    inputReference.current.focus();
  }, [params.id, taskId, show]);
  useEffect(() => {
    if (backdrop === undefined) {
      setTask({
        ...task,
        taskName: '',
        addHrs: '',
        taskDescription: '',
        comment: '',
        attachment: [],
        assignee: [],
        savedAssignee: [],
        reporter: '',
        reporterId: '',
        startDate1: '',
        startDate: '',
        selectedDate: '',
        endDate: '',
        attachment_url: '',
        estimation: '',
        status: '',
        // editHrs: true,
        // editDate: true,
        // editComment: true,
        checkpoint: [],
        savedCheckpoint: [],
        created_at: '',
      });
      getCheckpoints(checkpoints, '');
      resetSelectField();
    }
  }, [backdrop]);
  console.log(addHrs, comment, task);

  return (
    <div className={drawerClasses}>
      {alert ? (
        <Alert variant='danger' style={{ fontSize: '13px' }}>
          {t('Please select checkpoint to close the task!')}
        </Alert>
      ) : (
        ''
      )}
      {loading ? (
        <div
          className='loader-container'
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: '1',
          }}
        >
          <ClipLoader color={'#0790c9'} size={150} />
        </div>
      ) : (
        ''
      )}
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
      <div className='page-content' style={{ background: 'transparent' }}>
        <div className='card' style={{ maxWidth: '730px' }}>
          <div className='card-body'>
            <h3 className='task-panel-title'>
              {' '}
              {t('projectManagment.Manage.task_creation')}
            </h3>
            <input
              readOnly={!edit}
              value={taskName}
              className='estimation'
              ref={inputReference}
              //style={{ border: 'none', cursor: 'pointer' }}
              placeholder={t('projectManagment.Manage.task_title')}
              onChange={(e) => {
                setTask({
                  ...task,
                  taskName: e.target.value,
                });
              }}
            />
            <section className='card-two'>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    width: '94px',
                    height: '35px',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    backgroundColor: ' #F3F3F3',
                    marginRight: '2rem',
                  }}
                >
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
                    clickable={edit}
                  >
                    <img
                      src={Attachment}
                      alt='attachment'
                      style={{ width: '20px', height: '20px' }}
                    />
                    <div style={{ textAlign: 'center', marginLeft: '2rem' }}>
                      {t('projectManagment.Manage.attach')}
                    </div>
                  </Files>
                </div>

                <div
                  style={{
                    display: 'flex',
                    width: '94px',
                    height: '35px',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    backgroundColor: ' #F3F3F3',
                  }}
                >
                  <img
                    src={Url}
                    alt='attachment'
                    style={{ width: '20px', height: '20px' }}
                  />
                  <div style={{ textAlign: 'center' }}>Share</div>
                </div>
              </div>
              <div className='status-checkpoint-container'>
                <div className='subcard-four'>
                  <select
                    onChange={(e) =>
                      setTask({
                        ...task,
                        status: e.target.value,
                      })
                    }
                    className='task-name'
                    style={{ backgroundColor: ' #E0E0E0' }}
                    disabled={!edit}
                  >
                    <option selected disabled>
                      {status === 'Inprogress'
                        ? t('projectManagment.Manage.in_progress')
                        : status === 'Todo'
                        ? t('projectManagment.Manage.to_do')
                        : status === 'Done'
                        ? t('projectManagment.Manage.done')
                        : t('projectManagment.Manage.status')}
                    </option>
                    {[
                      t('projectManagment.Manage.to_do'),
                      t('projectManagment.Manage.in_progress'),
                      t('projectManagment.Manage.done'),
                    ].map((resource, index) => {
                      return (
                        <option key={index} value={resource}>
                          {resource}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className='subcard-four'>
                  <span className='p-float-label'>
                    <Multiselect
                      options={checkpoints}
                      //selectedValues={(e) => setCheckpoints(e.value)}
                      selectedValues={savedCheckpoint}
                      displayValue='name'
                      onSelect={onSelect}
                      onRemove={onRemove}
                      selectedList={savedCheckpoint}
                      disable={!edit}
                      placeholder={t('projectManagment.Manage.checkpoint')}
                      ref={multiselectRef2}
                      //disable={editCheckpoint || !edit}
                    />
                  </span>
                </div>
              </div>
              <div
                className='subcard-one'
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: '1rem',
                }}
              >
                <label className='title'>
                  {' '}
                  {t('projectManagment.Manage.description')}
                </label>
                <textarea
                  className='task-description'
                  readOnly={!edit}
                  value={taskDescription}
                  type='text'
                  placeholder={t('projectManagment.Manage.description')}
                  onChange={(e) =>
                    setTask({
                      ...task,
                      taskDescription: e.target.value,
                    })
                  }
                />
              </div>
              <div
                className='subcard-one'
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginBottom: '1rem',
                }}
              >
                {attachment?.map((attach) => {
                  return (
                    <div
                      style={{
                        width: '135px',
                        height: '107px',
                        backgroundColor: '#F4F5F7',
                        alignSelf: 'center',
                        marginRight: '1rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ width: '135px', height: '107px' }}>
                        <img
                          src={
                            attach?.preview?.url
                              ? attach?.preview?.url
                              : attachment_url + attach
                          }
                          style={{ width: '135px', height: '107px' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className='subcard-one'>
                <label className='title'>
                  {' '}
                  {t('projectManagment.Manage.assignee')}
                </label>

                <span className='p-float-label'>
                  <Multiselect
                    options={getCustomers(resource)}
                    selectedValues={getCustomers(savedAssignee)}
                    displayValue='full_name'
                    onRemove={onRemoveCustomers}
                    onSelect={onSelectCustomers}
                    selectedList={getCustomers(savedAssignee)}
                    disable={!edit}
                    ref={multiselectRef}
                    placeholder={t('account.professional.select')}
                  />
                </span>
              </div>
              <div className='subcard-one'>
                <label className='title'>
                  {' '}
                  {t('projectManagment.Manage.reporter')}
                </label>

                <select
                  onChange={(e) =>
                    setTask({
                      ...task,
                      reporter: reporter ? reporter : '',
                      reporterId: e.target.value,
                    })
                  }
                  value={reporterId || ''}
                  className='task-name'
                  disabled={!edit}
                >
                  <option value={''}>
                    {reporter
                      ? reporter.first_name + ' ' + reporter.last_name
                      : t('account.professional.select')}
                  </option>
                  {resource &&
                    resource.map((resource) => {
                      return (
                        <option
                          key={resource.id}
                          value={resource.ur_resource_id}
                        >
                          {resource.first_name} {resource.last_name}
                        </option>
                      );
                    })}
                </select>
              </div>
            </section>

            <section className='card-two'>
              <div className='subcard-three'>
                <label className='title'>
                  {' '}
                  {t('projectManagment.Manage.start_date')}
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
                    isValidDate={valid}
                    name='start_date'
                    dateFormat='DD-MM-YYYY'
                    value={startDate ? startDate : startDate1}
                    timeFormat={false}
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
                  {t('projectManagment.Manage.end_date')}
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
                    dateFormat='DD-MM-YYYY'
                    value={endDate}
                    timeFormat={false}
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
                  {t('projectManagment.Manage.original_estimation')}
                </label>
                <input
                  className='estimation'
                  type='text'
                  value={estimation}
                  onChange={(e) =>
                    setTask({
                      ...task,
                      estimation: e.target.value,
                    })
                  }
                />
              </div>
            </section>

            <section className='card-three'>
              <h3 className='task-plan-creation'>
                {' '}
                {t('projectManagment.Manage.task_progress')}
              </h3>
              <div className='subcard-three'>
                <label
                  className='title'
                  style={{ color: editHrs ? '#e0e1e1' : '' }}
                >
                  {t('projectManagment.Manage.add_hours')}
                </label>
                <input
                  className='estimation'
                  type='number'
                  value={addHrs}
                  readOnly={editHrs}
                  onChange={(e) =>
                    setTask({
                      ...task,
                      addHrs: e.target.value,
                    })
                  }
                />
              </div>
              <div className='subcard-three'>
                <label
                  className='title'
                  style={{ color: editDate ? '#e0e1e1' : '' }}
                >
                  {t('projectManagment.Manage.date')}
                </label>
                <div className='selected-date'>
                  <Datetime
                    onChange={(e) =>
                      setTask({
                        ...task,
                        selectedDate: e,
                      })
                    }
                    isValidDate={valid3}
                    name='end_date'
                    dateFormat='DD-MM-YYYY'
                    value={selectedDate}
                    timeFormat={false}
                    // type="date"
                    locale={`${
                      localStorage.getItem('_lng') === 'fi' ? 'fr-fi' : 'en-US'
                    } `}
                    inputProps={inputPropsDate2}
                  />
                </div>
              </div>
              <div className='subcard-three'>
                <label
                  className='title'
                  style={{ color: !totalHrs && !estimation ? '#e0e1e1' : '' }}
                >
                  {t('projectManagment.Manage.log_hours')}
                </label>
                <div className='task-progress-bar'>
                  <progress max={estimation} value={totalHrs}></progress>
                  <p>
                    {totalHrs} {t('projectManagment.Manage.hours_logged')}
                  </p>
                </div>
              </div>
              <div className='subcard-three'>
                <label className='title'>
                  {' '}
                  {t('projectManagment.Manage.checkpoint')}
                </label>
                <div className='form-group'>
                  {checkpoints?.map(({ file, selected, loaded, index }) => {
                    if (selected !== '') {
                      return (
                        <>
                          <label>{selected}</label>
                          <div
                            style={{ marginBottom: '1rem' }}
                            onClick={() => setSelectedSection(index)}
                          >
                            <div className='file-select'>
                              <Files
                                className='files-dropzone'
                                onChange={(file) =>
                                  onImageUpload({ file, selected })
                                }
                                //onError={(e) => onFilesError2(e)}
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
                                multiple={false}
                                maxFileSize={10000000}
                                minFileSize={10}
                                clickable
                              >
                                <label htmlFor='attachment'>
                                  {file === null ? (
                                    <img src={File} alt='...' />
                                  ) : (
                                    file?.map((url, i) => {
                                      return (
                                        <div key={i}>
                                          <img
                                            style={{
                                              height: '100px',
                                            }}
                                            src={
                                              file?.length <= 0
                                                ? File
                                                : url?.preview?.url
                                            }
                                            alt='...'
                                          />
                                        </div>
                                      );
                                    })
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
                              {errors.attachment ? errors.attachment : ''}
                            </p>
                            {file ? (
                              <button
                                type='button'
                                onClick={() => Remove_img({ selected })}
                                className='btn btn-danger'
                              >
                                {t('marketplace.feeds.list_details.Remove')}
                              </button>
                            ) : (
                              ''
                            )}
                          </div>
                        </>
                      );
                    }
                  })}
                </div>
              </div>
            </section>
            <section className='card-three'>
              <div className='subcard-three'>
                <label
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '15px',
                    // height: '25px',
                    // width: '25px',
                    // borderRadius: '50%',
                    // backgroundColor: 'lightgreen',
                  }}
                >
                  <div className={checkValue()}>{getName()?.charAt(0)}</div>
                </label>
                <textarea
                  className='task-description'
                  type='text'
                  value={comment}
                  readOnly={editComment}
                  placeholder={t('projectManagment.Manage.add_comment')}
                  style={{ color: editComment ? '#e0e1e1' : '' }}
                  onChange={(e) =>
                    setTask({
                      ...task,
                      comment: e.target.value,
                    })
                  }
                />
              </div>
            </section>

            <div className='buttons'>
              {edit ? (
                <>
                  <div>
                    <button className='publish-task' onClick={createTask}>
                      {t('projectManagment.Manage.submit_task')}
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  <button className='publish-task' onClick={addHours}>
                    {t('projectManagment.Manage.add_hours')}
                  </button>
                </div>
              )}
            </div>
            <section className='time-details-container'>
              {timeDetails?.map((detail, i) => {
                const {
                  created_at,
                  updated_at,
                  description,
                  signature,
                  report,
                  image,
                  audits,
                  hours,
                } = detail;
                return (
                  <div
                    className='task-hours-details'
                    style={{ background: i % 2 === 0 ? '#f3f3f3' : 'white' }}
                  >
                    <div>Task created: {dateFunc(created_at, lang)}</div>
                    <div>Task updated: {dateFunc(updated_at, lang)}</div>
                    <div>Comment: {description}</div>
                    <div>Logged hours: {hours}</div>
                    <div>
                      <img
                        src={signature_url + signature}
                        alt=''
                        style={{
                          width: '100px',
                          marginRight: '1rem',
                          display: !signature ? 'none' : '',
                        }}
                      />
                      <img
                        src={report_url + report}
                        alt=''
                        style={{
                          width: '100px',
                          marginRight: '1rem',
                          display: !report ? 'none' : '',
                        }}
                      />
                      <img
                        src={image_url + image}
                        alt=''
                        style={{
                          width: '100px',
                          marginRight: '1rem',
                          display: !image ? 'none' : '',
                        }}
                      />
                      <img
                        src={audits_url + audits}
                        alt=''
                        style={{
                          width: '100px',
                          display: !audits ? 'none' : '',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(DetailTaskPanel);
