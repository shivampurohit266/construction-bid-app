import React, { useState, useEffect } from 'react';
import Header from '../../../shared/Header';
import { withTranslation } from 'react-i18next';
import AddCustomer from '../../modals/AddCustomer';
import { Link } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import ClipLoader from 'react-spinners/ClipLoader';

import { ReactComponent as Edit } from '../../../../images/edit.svg';
import { ReactComponent as Delete } from '../../../../images/trash.svg';
import { ReactComponent as Plus } from '../../../../images/plus.svg';
import { url } from '../../../../helper/helper';
import { useParams } from 'react-router-dom';
import Sidebar from '../../../shared/Sidebar';
import { getData, postDataWithToken } from '../../../../helper/api';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Files from 'react-files';
import Preview from './Preview report/Preview';
import Datetime from 'react-datetime';
import img from '../../../../images/DefaultImg.png';
import BusinessInfo from '../../modals/BusinessInfo';
import moment from 'moment';
import File from '../../../../images/file-icon.png';
import Autosuggest from 'react-autosuggest';
import SweetAlert from 'react-bootstrap-sweetalert';
import Breadcrumb from '../../../shared/Breadcrumb';
import { ReportEdit } from '../../../../router/bussinessRouter';

let arrayOfarrays = [];
let arrayOfImages = [];
let arrayOfDescription = [];
let prdImages = [];
let prdDatas = [];

const EditReport = ({ t, location, history }) => {
  //const [show, setShow] = useState(false);
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState('');
  const [records, setRecords] = useState([]);
  const [clientId, setClientId] = useState('');
  const [title, setTitle] = useState('');
  const [addressEdit, setAddressEdit] = useState('');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filteredProject, setFilteredProject] = useState('');
  const [success, setSucces] = useState(false);
  const [task, setTask] = useState([]);
  const [show, setShow] = useState(false);
  const [success2, setSucces2] = useState(false);
  const [warning, setWarning] = useState(false);
  const [warning2, setWarning2] = useState(false);
  const [prod_img, setProd_img] = useState([]);
  const [prod_desc, setProd_desc] = useState([]);
  const [prod_data, setProd_data] = useState([]);
  const [emails, setEmails] = useState([]);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [email, setEmail] = useState(null);
  const [firstName, setFistName] = useState('');
  const [lastName, setLastName] = useState('');
  const [website, setWebsite] = useState(null);
  const [phone, setPhone] = useState(null);
  const [zipCode, setZipCode] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [suggestion, setSuggestion] = useState([]);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [prdImage, setPrdImage] = useState([]);
  const [prdData, setPrdData] = useState([]);
  const [prdId, setPrdId] = useState(0);
  const [selectProject, setSelectProject] = useState('');
  const [array, setArray] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [clicked, setClicked] = useState(false);
  //let emailsArray = [emails[0]?.split(',')];
  const [errors, setErrors] = useState({
    title: '',
    date: '',
    address: '',
    comments: '',
    main_img: '',
    createAt: '',
    fiName: '',
    laName: '',
    emailId: '',
    customer: '',
  });

  const [comments, setComments] = useState({
    sec0: '',
    sec1: '',
    sec2: '',
    sec3: '',
    sec4: '',
    sec5: '',
    sec6: '',
    sec7: '',
    sec8: '',
    sec9: '',
  });

  const [imgErrors, setImgErrors] = useState({
    err0: '',
    err1: '',
    err2: '',
    err3: '',
    err4: '',
    err5: '',
    err6: '',
    err7: '',
    err8: '',
    err9: '',
  });

  const [imageFull, setImageFull] = useState({
    sec0: null,
    sec1: null,
    sec2: null,
    sec3: null,
    sec4: null,
    sec5: null,
    sec6: null,
    sec7: null,
    sec8: null,
    sec9: null,
  });

  const [imagePreview, setImagePreview] = useState({
    sec0: null,
    sec1: null,
    sec2: null,
    sec3: null,
    sec4: null,
    sec5: null,
    sec6: null,
    sec7: null,
    sec8: null,
    sec9: null,
  });
  const [secLoaded, setSecLoaded] = useState({
    sec0: 0,
    sec1: 0,
    sec2: 0,
    sec3: 0,
    sec4: 0,
    sec5: 0,
    sec6: 0,
    sec7: 0,
    sec8: 0,
    sec9: 0,
  });

  const [editItems, setEditItems] = useState({
    sec0: false,
    sec1: false,
    sec2: false,
    sec3: false,
    sec4: false,
    sec5: false,
    sec6: false,
    sec7: false,
    sec8: false,
    sec9: false,
  });

  const [editComments, setEditComments] = useState({
    sec0: false,
    sec1: false,
    sec2: false,
    sec3: false,
    sec4: false,
    sec5: false,
    sec6: false,
    sec7: false,
    sec8: false,
    sec9: false,
  });
  const [edit2, setEdit2] = useState(false);
  const [edit, setEdit] = useState({
    sec0: false,
    sec1: false,
    sec2: false,
    sec3: false,
    sec4: false,
    sec5: false,
    sec6: false,
    sec7: false,
    sec8: false,
    sec9: false,
  });

  const [report, setReport] = useState({
    name: '',
    address: '',
    status: '',
    project_id: '',
    task_id: '',
    date: '',
    fiName: firstName,
    laName: lastName,
    customer: '',
    createAt: createdAt,
    emailId: '',
  });

  const [count, setCount] = useState(0);
  const token = localStorage.getItem('token');
  const { id } = useParams();
  const {
    name,
    address,
    status,
    project_id,
    task_id,
    date,
    createAt,
    fiName,
    laName,
    emailId,
    emailsList,
    customer,
  } = report;

  const handleSubmit = (e) => {
    e.preventDefault();
    sendImgAndDescription();

    saveReport();
  };

  const handleSubmitDraft = (e) => {
    e.preventDefault();
    sendImgAndDescription();
    createDraft();
  };

  const getAccount = async () => {
    await getData(`${url}/api/account`, token)
      .then(({ data }) => {
        const acc = data[0];
        setCompanyLogo(acc.company_logo);
        setCompanyId(acc.company_id);
        setFullName(acc.full_name);
        setEmail(acc.email);
        setWebsite(acc.company_website);
        setPhone(acc.phone);
        setZipCode(acc.zip);
        setUserAddress(acc.address);
      })
      .catch(() => {});
  };

  const getTask = async () => {
    try {
      const response = await getData(
        `${url}/api/projectTaskList/${project_id}`,
        token
      );
      if (response !== undefined) {
        setTask(response.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTask();
  }, [project_id]);

  const saveReport = async () => {
    setLoading(true);
    let hasErrors = false;
    let newErrors = { ...errors };

    if (!name) {
      setLoading(false);
      hasErrors = true;
      newErrors.name = t('myBusiness.report.addTitle');
    }

    if (!address) {
      setLoading(false);
      hasErrors = true;
      newErrors.address = t('myBusiness.report.addAddress');
    }

    if (edit2 && !date) {
      setLoading(false);
      hasErrors = true;
      newErrors.createAt = t('myBusiness.report.addDate');
    }

    if (!comments) {
      setLoading(false);
      hasErrors = true;
      newErrors.comments = t('myBusiness.report.addComment');
    }

    if (!imagePreview) {
      setLoading(false);
      hasErrors = true;
      newErrors.main_img = t('myBusiness.report.addImage');
    }

    if (
      (!clientId && !emailId && (emails?.length == 0 || emails == undefined)) ||
      (clientId === t('myBusiness.report.addCustomer') &&
        !emailId &&
        (emails?.length == 0 || emails == undefined))
    ) {
      setLoading(false);
      hasErrors = true;
      newErrors.fiName = t('myBusiness.report.addCustomer');
      newErrors.laName = t('myBusiness.report.addCustomer');
      newErrors.emailId = t('myBusiness.report.addEmail');
      newErrors.emails = t('myBusiness.report.addEmail');
    }
    if (imageFull && imageFull['sec' + selectedSection]?.extension === 'txt') {
      setLoading(false);
      hasErrors = true;
      newErrors.main_img = t('myBusiness.report.onlyImages');
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    } else {
      const formData = new FormData();
      formData.append(
        'pr_customer_id',
        clientId !== t('myBusiness.report.select_customer') ? clientId : ''
      );
      formData.append('pr_name', name);
      formData.append('pr_address', address);
      formData.append('pr_status', status);
      formData.append(
        'pr_date',
        moment(edit2 === false ? createdAt : date).format('DD-MM-YYYY HH:mm:ss')
      );
      formData.append('pr_project_id', project_id);
      formData.append('pr_task_id', task_id);
      formData.append('pr_id', id);
      formData.append('pr_emails', emails);
      formData.append('sent', 1);
      for (const key of Object.keys(imageFull, editItems)) {
        if (imageFull[key] !== null && editItems[key] === true) {
          formData.append('prd_image[]', imageFull[key]);
        }
      }

      for (const key of Object.keys(comments, editComments)) {
        if (comments[key] && editComments[key] === true) {
          formData.append('prd_description[]', comments[key]);
        }
      }

      await postDataWithToken(
        `${url}/api/project_report/update`,
        formData,
        token
      ).then((result) => {
        //const { data } = result;
        setSucces(true);
        setWarning(false);
        setLoading(false);

        arrayOfDescription = [];
        arrayOfImages = [];
      });
    }
  };

  const createDraft = async () => {
    setLoading(true);
    let hasErrors = false;
    let newErrors = { ...errors };

    if (!name) {
      setLoading(false);
      hasErrors = true;
      newErrors.name = t('myBusiness.report.addTitle');
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    } else {
      const formData = new FormData();
      formData.append('pr_customer_id', clientId);
      formData.append('pr_name', name);
      formData.append('pr_address', address);
      formData.append('pr_status', status);
      formData.append('pr_project_id', project_id);
      formData.append('pr_task_id', task_id);
      formData.append('pr_emails', emails);
      formData.append('pr_date', moment(date).format('DD-MM-YYYY'));
      formData.append('sent', 0);
      for (const key of Object.keys(imageFull)) {
        if (imageFull[key] !== null) {
          formData.append('prd_image[]', imageFull[key]);
        }
      }

      for (const key of Object.keys(comments)) {
        if (comments[key]) {
          formData.append('prd_description[]', comments[key]);
        }
      }
      await postDataWithToken(
        `${url}/api/project_report/create/draft`,
        formData,
        token
      ).then(
        (res) => {
          //const { data } = res;
          setLoading(false);
          setSucces2(true);
          setWarning2(false);

          arrayOfDescription = [];
          arrayOfImages = [];
        },
        () => {}
      );
    }
  };

  useEffect(() => {
    const data = projects.filter((pro) => clientId == pro.client_id);
    setFilteredProject(data);
  }, [clientId]);

  const handleBusinessInfo = (val) => {};

  const valid = (current) => {
    var yesterday = moment().subtract(1, 'day');
    if (current) {
      return current.isAfter(yesterday);
    }
  };

  const handleImageUpload = async (file) => {
    console.log('originalFile instanceof Blob', file instanceof Blob); // true
    console.log(`originalFile size ${file.size / 1024 / 1024} MB`);
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      console.log(
        'compressedFile instanceof Blob',
        compressedFile instanceof Blob
      ); // true
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      );
      setImageFull({
        ...imageFull,
        ['sec' + selectedSection]: compressedFile,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onFilesChangeDynamic = (files) => {
    if (files) {
      files.map((file) => {
        setErrors({ ...errors, main_img: '' });
        setImagePreview({
          ...imagePreview,
          ['sec' + selectedSection]: file.preview.url,
        });
        // setImageFull({
        //   ...imageFull,
        //   ['sec' + selectedSection]: file,
        // });
        handleImageUpload(file);
        setEditItems({ ...editItems, ['sec' + selectedSection]: true });
        //setEditComments({ ...editComments, ['sec' + selectedSection]: true });
        setEdit({ ...edit, ['sec' + selectedSection]: true });
        setImgErrors({ ...imgErrors, ['sec' + selectedSection]: '' });
        setSecLoaded({ ...secLoaded, ['sec' + selectedSection]: 50 });
        setTimeout(() => {
          setSecLoaded({ ...secLoaded, ['sec' + selectedSection]: 100 });
        }, 2000);
      });
    }
  };

  const handleCommentsDynamic = (e) => {
    console.log(e);
    const { value } = e.target;
    setComments({
      ...comments,
      ['sec' + selectedSection]: value,
    });
    setEditComments({ ...editComments, ['sec' + selectedSection]: true });
  };

  const sendProdDesc = () => {
    const comment = comments['sec' + selectedSection];

    if (!comment) {
      return;
    }
    let array = [comment];
    arrayOfDescription.push(array);
    setProd_desc(arrayOfDescription);
  };

  const sendImgAndDescription = () => {
    sendProdImg();
    sendProdDesc();
    sendProdData();
  };

  const sendProdImg = () => {
    const img = imageFull['sec' + selectedSection];

    if (!img) {
      return;
    }
    let array = [img];
    arrayOfImages.push(img);
    setProd_img(arrayOfImages);
  };

  //this function is to send image and comments to Preview component
  const sendProdData = () => {
    const img = imageFull['sec' + selectedSection];
    const comment = comments['sec' + selectedSection];
    if (!img || !comment) {
      return;
    }
    let array = [img, comment];
    arrayOfarrays.push(array);

    setProd_data(arrayOfarrays);
  };

  ///
  const closeModal = () => {
    setShow(false);
  };

  const getRecords = async () => {
    await postDataWithToken(
      `${url}/api/project_report/list`,
      {
        search: '',
      },
      token
    ).then((result) => {
      const { data } = result;
      const getById = data?.data?.filter((res) => res.pr_id === Number(id));
      setRecords(getById);
      if (getById !== undefined) {
        setReport({
          ...report,
          address: getById[0]?.pr_address,
          name: getById[0]?.pr_name,
          status: getById[0]?.pr_status,
          task_id: getById[0]?.project_task?.id,
        });
      }
    });
  };

  useEffect(() => {
    const data = projects.filter((pro) => clientId == pro.client_id);
    setFilteredProject(data);
  }, [clientId]);

  const getProjects = async () => {
    await getData(`${url}/api/projectGet`, token).then((result) => {
      const { data } = result;

      setProjects(data?.data);
    });
  };
  console.log(projects);

  const selectedProject = (id) => {
    console.log(projects);
    return projects?.find((project) => project?.id === id)?.name;
  };

  //console.log(selectedProject(145));
  const getEdit = async () => {
    await getData(`${url}/api/project_report/edit/${id}`, token).then(
      (response) => {
        const { project_report } = response?.data;
        if (project_report !== undefined) {
          setArray(project_report);
          project_report.map((res) => {
            const {
              pr_name,
              pr_address,
              pr_date,
              prd_image,
              prd_data,
              prd_id,
              pr_emails,
              pr_customer_id,
              pr_project_id,
            } = res;

            setSelectProject(selectedProject(pr_project_id));

            console.log(pr_emails, prd_image, pr_project_id);
            setTitle(pr_name);
            setAddressEdit(pr_address);
            setCreatedAt(pr_date);
            setCustomerId(pr_customer_id);
            prdDatas.push(prd_data);
            setPrdId(prd_id);
            setCount(project_report.length - 1);
            if (pr_emails !== 'undefined') {
              setEmails(
                pr_emails !== 'null' || pr_emails !== ''
                  ? pr_emails?.split(',').filter((str) => str !== '')
                  : ''
              );
            }

            setReport({
              ...report,
              emailId: pr_emails !== 'null' ? pr_emails : '',
              address: pr_address,
              name: pr_name,
              project_id: pr_project_id,
            });

            array.push(prd_id);
            project_report.map((data, i) => {
              setImageFull((imageFull) => ({
                ...imageFull,
                ['sec' + i]: `${url}/images/project_report/` + data.prd_image,
              }));
            });

            project_report.map((data, i) => {
              setComments((prev) => ({ ...prev, ['sec' + i]: data.prd_data }));
            });

            setPrdImage(prdImage);
            setPrdData(prd_data);
          });
        }
      }
    );
  };

  const getCustomers = async () => {
    await getData(`${url}/api/resources-client-list/Client`, token).then(
      (result) => {
        if (result) {
          const { data } = result;

          setClients(data?.data);
          const client = data?.data?.map((client) => {
            if (client.ur_resource_id === customerId) {
              const firstName = client.first_name;
              const lastName = client.last_name;

              setClientId(client.ur_resource_id);
              setFistName(firstName);
              setLastName(lastName);
              return { firstName, lastName };
            }
          });
        }
      }
    );
  };

  // useEffect(() => {
  //   getEdit();
  // }, []);
  useEffect(() => {
    getTask();
  }, [project_id]);

  useEffect(() => {
    getProjects();
    getRecords();
    getAccount();
    getEdit();
  }, []);
  useEffect(() => {
    getCustomers();
  }, [customerId]);

  // const handleKeyDownCus = (evt) => {
  //   if (['Enter'].includes(evt.key)) {
  //     evt.preventDefault();
  //   }
  // };

  const handleKeyDown = (evt) => {
    if (['Enter', 'Tab', ','].includes(evt.key)) {
      evt.preventDefault();

      if (report?.emailId) {
        setEmails([...emails, inputProps?.value]);
        setReport({ ...report, emailId: '' });
      }
    }
  };

  const getSuggestions = (value) => {
    setReport({ ...report, emailId: value });
    setErrors({ ...errors, emailId: '' });
    const inputValue = value?.trim().toLowerCase();
    const inputLength = inputValue?.length;

    return inputLength === 0
      ? []
      : emails?.filter(
          (email) => email?.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  const getSuggestionValue = (suggestion) => suggestion;

  const renderSuggestion = (suggestion) => <div>{suggestion}</div>;

  const onChange = (event, { newValue }) => {
    setValue(newValue);
    setReport({ ...report, emailId: '' });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onSuggestionsFetchRequested = ({ value }) => {
    if (value !== undefined) {
      setSuggestion(getSuggestions(value));
    }
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestion([]);
  };

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    placeholder: t('myBusiness.report.place_email'),
    value: emailId ? emailId : '',
    className: 'form-control',
    onChange: onChange,
    onKeyDown: handleKeyDown,
  };

  const handleDelete = (item) => {
    setEmails(emails?.filter((i) => i !== item));
    setReport({ ...report, emailId: '' });
  };

  const deleteItem = async (id) => {
    await getData(
      `${url}/api/project_report/report_data/delete_data/${id.prd_id}`,
      token
    )
      .then((res) => {
        if (res?.status === 200) {
          window.location.reload();
        }
      })
      .then((err) => {
        console.log(err);
      });
  };

  const onConfirmError = () => {
    setSucces(false);
    setWarning(true);
    setSucces2(true);
    setWarning2(false);
    history.push('/report-listing');
  };
  console.log(selectProject, customerId, project_id);

  return (
    <>
      {/* <Header active={'bussiness'} /> */}
      <Breadcrumb>
        <Link
          to='/business-dashboard'
          className='breadcrumb-item active'
          aria-current='page'
        >
          {t('myBusiness.report.heading')}
        </Link>

        <li className='breadcrumb-item active' aria-current='page'>
          {t('myBusiness.report.title_create')}
        </li>
      </Breadcrumb>

      <div className='main-content'>
        <Sidebar dataFromParent={location.pathname} />

        <div className='page-content'>
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
              title={t('myBusiness.report.reportUpdated')}
              onConfirm={onConfirmError}
            ></SweetAlert>
          ) : (
            ''
          )}
          {success2 ? (
            <SweetAlert
              success
              closeOnClickOutside={true}
              title={t('myBusiness.report.reportSaved')}
              onConfirm={onConfirmError}
            ></SweetAlert>
          ) : (
            ''
          )}
          <div className='container-fluid'>
            <h3 className='head3'>{t('myBusiness.report.edit_report')}</h3>
            <div className='row mt-4' style={{ maxWidth: '1120px' }}>
              <div className='col text-right'>
                <button
                  //onClick={this.hiddenFields}
                  className='btn btn-primary ml-3 mb-3 clk3'
                  data-toggle='modal'
                  data-target='#preview-report'
                >
                  {t('myBusiness.report.preview')}
                </button>
                <button
                  className='btn btn-gray ml-3 mb-3 clk3'
                  type='button'
                  onClick={(e) => handleSubmitDraft(e)}
                >
                  {t('myBusiness.report.save')}
                </button>

                <button
                  className='btn btn-primary ml-3 mb-3 clk3'
                  type='button'
                  onClick={(e) => handleSubmit(e)}
                >
                  {t('myBusiness.report.sendAndSubmit')}
                </button>
              </div>
            </div>
            <Preview
              userImage={companyLogo}
              companyId={companyId}
              email={email}
              executiveName={fullName}
              projectId={project_id}
              client={clients}
              phone={phone}
              zipCode={zipCode}
              userAddress={userAddress}
              clientId={clientId}
              date={date}
              clientAddress={address}
              filteredProjects={filteredProject}
              task={task}
              taskId={task_id}
              prod_data={prod_data}
              editImages={prdImages}
              editItems={editItems}
              editComments={editComments}
              prdDatas={prdDatas}
              comments={comments}
              imagePreview={imagePreview}
              edit={edit}
              imageFull={imageFull}
              createdAt={createdAt}
              closeModal={closeModal}
              emails={emails}
              emailId={emailId}
            />
          </div>

          <AddCustomer />

          <BusinessInfo onInfo={handleBusinessInfo} />

          <form
            className='card'
            style={{ maxWidth: '1120px' }}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className='card-body'>
              <div className='row'>
                <div className='col-xl-12 col-lg-12'>
                  <div className='form-group'>
                    <label htmlFor='name' className='report-project-title'>
                      {t('myBusiness.report.title')}
                      <input
                        name=''
                        id='name'
                        value={name}
                        onChange={(e) => {
                          setReport({ ...report, name: e.target.value });
                          setErrors({ ...errors, name: '' });
                        }}
                        className='select-customer'
                        placeholder='Title'
                      ></input>
                      <p className='error'>{errors.name}</p>
                    </label>
                  </div>
                </div>
              </div>
              <div className='report-details-spread'>
                <div className='img-business-info'>
                  <img
                    src={
                      companyLogo === null
                        ? img
                        : url +
                          '/images/marketplace/company_logo/' +
                          companyLogo
                    }
                    alt=''
                    style={{ width: '150px' }}
                  />
                  <div className='expand-edit'>
                    {' '}
                    <label>
                      <a
                        data-toggle='collapse'
                        href='#business-info'
                        role='button'
                        aria-expanded='false'
                        aria-controls='business-info'
                      >
                        [+]
                      </a>{' '}
                      {t('myBusiness.report.generalInfo')}{' '}
                      <a href='#' data-toggle='modal' data-target='#edit-info'>
                        {t('myBusiness.report.edit')}
                      </a>
                      <div className='collapse' id='business-info'>
                        <p>{companyId}</p>
                        <p>{fullName}</p>
                        <p>{email}</p>
                        <p>{website}</p>
                      </div>
                    </label>
                    <label style={{ marginLeft: '7px' }}>
                      <a href='#' data-toggle='modal' data-target='#add-cus'>
                        {' '}
                        [+]{' '}
                      </a>
                    </label>
                  </div>
                  <label htmlFor='customer' className='report-customer'>
                    {/* {t('myBusiness.report.customer')} */}
                    {t('myBusiness.report.projects')}
                    <div className='select_and_button'>
                      <select
                        required
                        name='customer'
                        id='customer'
                        className='select-customer'
                        onChange={(e) => {
                          setReport({
                            ...report,
                            project_id: e.target.value,
                          });
                        }}
                      >
                        <option value=''>
                          {project_id !== ''
                            ? selectedProject(project_id)
                            : t('myBusiness.report.select_project')}
                        </option>
                        {projects &&
                          projects.map((data, idx) => {
                            return (
                              <option key={idx} value={data.id}>
                                {data.name}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    <p className='error'>{!emailId ? errors.fiName : ''}</p>
                  </label>
                  <label htmlFor='customer' className='report-customer'>
                    {t('myBusiness.report.customer')}
                    <div className='select_and_button'>
                      <select
                        //required

                        name='customer'
                        id='customer'
                        className='select-customer'
                        onChange={(e) => {
                          setClientId(e.target.value);
                          setReport({
                            ...report,
                            fiName: firstName,
                            laName: lastName,
                          });
                          setErrors({
                            ...errors,
                            fiName: '',
                            laName: '',
                          });
                          //setEdit1(true);
                        }}
                      >
                        <option selected disabled>
                          {customerId === null
                            ? `${t('myBusiness.report.select_customer')}`
                            : firstName && lastName
                            ? `${firstName} ${lastName}`
                            : `${t('myBusiness.report.select_customer')}`}
                        </option>
                        <option value={t('myBusiness.report.select_customer')}>
                          {t('myBusiness.report.select_customer')}
                        </option>
                        {clients &&
                          clients.map((client) => {
                            return (
                              <>
                                <option
                                  key={client.ur_resource_id}
                                  value={client.ur_resource_id}
                                >
                                  {client.first_name} {client.last_name} |{' '}
                                  {client.company}
                                </option>
                              </>
                            );
                          })}
                      </select>
                    </div>
                    <p className='error'>
                      {!emailId && emails?.length === 0
                        ? errors.fiName && errors.laName
                        : ''}
                    </p>
                  </label>
                  <div className='form-group'>
                    <label htmlFor='mails'>
                      {t('myBusiness.report.mailToSeveral')}
                    </label>
                    {emails &&
                      emails?.map((item, i) =>
                        item ? (
                          <div className='tag-item' key={i}>
                            {item}
                            <button
                              type='button'
                              className='button'
                              onClick={() => handleDelete(item)}
                            >
                              &times;
                            </button>
                          </div>
                        ) : (
                          []
                        )
                      )}
                    {/* <input
                      id='customer-info'
                      className='form-control'
                      type='text'
                      value={emailsArray ? emailsArray : ''}
                      readOnly={true}
                    /> */}
                    <Autosuggest
                      suggestions={suggestion !== undefined ? suggestion : ''}
                      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                      onSuggestionsClearRequested={onSuggestionsClearRequested}
                      getSuggestionValue={getSuggestionValue}
                      renderSuggestion={renderSuggestion}
                      inputProps={inputProps}
                    />
                  </div>
                  <p className='error'>
                    {(!clientId && emails?.length === 0) ||
                    (clientId === t('myBusiness.report.addCustomer') &&
                      emails?.length === 0)
                      ? errors.emailId && errors.emails
                      : ''}
                  </p>
                </div>
                <div className='date-exec-case'>
                  <label>
                    {t('myBusiness.report.date')}
                    <Datetime
                      onChange={(e) => {
                        setReport({
                          ...report,
                          date: e._d,
                          createAt: createdAt,
                        });
                        setErrors({ ...errors, date: '', createAt: '' });
                        setEdit2(true);
                      }}
                      isValidDate={valid}
                      value={!edit2 ? createdAt : date}
                      dateFormat='DD-MM-YYYY'
                      timeFormat={false}
                      locale={`${
                        localStorage.getItem('_lng') === 'fi'
                          ? 'fr-fi'
                          : 'en-US'
                      } `}
                    />
                    <p className='error'>{errors.date}</p>
                    <p className='error'>{errors.createAt}</p>
                  </label>
                  {/*          <div className="exec-case" >
                  {/*    <div className="exec-case">
                    <label>
                      Executive name
                      <input type="text" />
                    </label>
                    <label>
                      Case
                      <input type="text" />
                    </label>
                  </div> */}
                  <label
                    htmlFor='textarea'
                    className='report-project task-address'
                  >
                    {t('myBusiness.report.clientAddress')}
                    <textarea
                      value={address}
                      placeholder={t('myBusiness.report.clientAddress')}
                      onChange={(e) => {
                        setReport({ ...report, address: e.target.value });
                        setErrors({ ...errors, address: '' });
                      }}
                      required
                      id='textarea'
                      className='select-customer'
                    ></textarea>
                    <p className='error'>{errors.address}</p>
                  </label>
                </div>
              </div>

              {/* <div className='project-task'>
                <label htmlFor='project' className='report-project'>
                  {t('myBusiness.report.selectProject')}
                  <select
                    onChange={(e) => {
                      setReport({ ...report, project_id: e.target.value });
                    }}
                    className='select-customer'
                  >
                    <option>{t('myBusiness.report.projectName')}</option>
                    {filteredProject &&
                      filteredProject.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                  </select>
                </label>
                <label htmlFor='task' className='report-project'>
                  {t('myBusiness.report.task')}
                  <select
                    name=''
                    id='task'
                    className='select-customer'
                    onChange={(e) => {
                      setReport({ ...report, task_id: e.target.value });
                    }}
                  >
                    <option value=''>{t('myBusiness.report.selectTask')}</option>
                    {task &&
                      task.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.task_name}
                        </option>
                      ))}
                  </select>
                </label>
              </div> */}
              <div
                className='image-comments'
                onClick={() => {
                  setSelectedSection(0);
                }}
              >
                <div className='report-image'>
                  <p> {t('myBusiness.report.uploadImage')}</p>
                  <Files
                    className='edit-files-dropzone'
                    onChange={onFilesChangeDynamic}
                    onError={(e) =>
                      setImgErrors({
                        ...imgErrors,
                        err0: e.message + ': limit 10MB',
                      })
                    }
                    accepts={[
                      'image/gif',
                      'image/jpeg',
                      'image/png',
                      'image/jpg',
                      '.svg',
                    ]}
                    multiple={false}
                    maxFileSize={10000000}
                    minFileSize={10}
                    clickable={imageFull.sec0 !== null ? false : true}
                  >
                    <label htmlFor='main' style={{ cursor: 'pointer' }}>
                      <img
                        src={
                          imageFull.sec0 !== null && editItems.sec0 === false
                            ? imageFull.sec0
                            : imagePreview.sec0 !== null &&
                              editItems.sec0 === true
                            ? imagePreview.sec0
                            : File
                        }
                      />

                      <span className='status'>
                        {t('myBusiness.report.upload_status')}
                      </span>

                      <ProgressBar now={secLoaded.sec0} />
                    </label>
                    {imgErrors.err0 && (
                      <div style={{ color: 'red' }}>{imgErrors.err0}</div>
                    )}
                    {errors.main_img && (
                      <p className='error' style={{ fontSize: '1.4rem' }}>
                        {errors.main_img}
                      </p>
                    )}
                  </Files>
                </div>
                <div className='report-comments'>
                  <label>
                    <p>{t('myBusiness.report.comments')}</p>
                    <textarea
                      placeholder={t('myBusiness.report.placeholder')}
                      value={!editComments.sec0 ? comments.sec0 : null}
                      type='text'
                      name='sec0'
                      onChange={(e) => {
                        handleCommentsDynamic(e);
                        setErrors({ ...errors, comments: '' });
                      }}
                      readOnly={prdDatas[0] !== undefined ? true : false}
                    />
                    {errors.comments && (
                      <p className='error' style={{ fontSize: '1.4rem' }}>
                        {errors.comments}
                      </p>
                    )}
                  </label>
                </div>
                <div className='edit-delete'>
                  <button
                    type='submit'
                    className='report-details-edit'
                    onClick={() => deleteItem(array[0])}
                  >
                    <Delete />
                  </button>
                </div>
              </div>

              <div
                onClick={() => {
                  setSelectedSection(1);
                }}
                className='image-comments'
                style={
                  imageFull.sec1 === null && count < 1
                    ? { display: 'none' }
                    : { display: 'flex' }
                }
              >
                <div className='report-image'>
                  <p> {t('myBusiness.report.uploadImage')}</p>
                  <Files
                    className='edit-files-dropzone'
                    onChange={onFilesChangeDynamic}
                    onError={(e) =>
                      setImgErrors({
                        ...imgErrors,
                        err1: e.message + ': limit 10MB',
                      })
                    }
                    accepts={[
                      'image/gif',
                      'image/jpeg',
                      'image/png',
                      'image/jpg',
                      '.svg',
                    ]}
                    multiple={false}
                    maxFileSize={10000000}
                    minFileSize={10}
                    clickable={imageFull.sec1 !== null ? false : true}
                  >
                    <label htmlFor='main' style={{ cursor: 'pointer' }}>
                      <img
                        src={
                          imageFull.sec1 !== null && editItems.sec1 === false
                            ? imageFull.sec1
                            : imagePreview.sec1 !== null &&
                              editItems.sec1 === true
                            ? imagePreview.sec1
                            : File
                        }
                      />

                      <span className='status'>
                        {t('myBusiness.report.upload_status')}
                      </span>
                      <ProgressBar now={secLoaded.sec1} />
                    </label>
                    {imgErrors.err1 && (
                      <div style={{ color: 'red' }}>{imgErrors.err1}</div>
                    )}
                  </Files>
                </div>
                <div className='report-comments'>
                  <label>
                    <p>{t('myBusiness.report.comments')}</p>
                    <textarea
                      placeholder={t('myBusiness.report.placeholder')}
                      value={!editComments.sec1 ? comments.sec1 : null}
                      type='text'
                      onChange={(e) => handleCommentsDynamic(e)}
                      readOnly={prdDatas[1] !== undefined ? true : false}
                    />
                  </label>
                </div>
                <div className='edit-delete'>
                  <button
                    type='submit'
                    className='report-details-edit'
                    onClick={() => deleteItem(array[1])}
                  >
                    <Delete />
                  </button>
                </div>
              </div>
              <div
                onClick={() => {
                  setSelectedSection(2);
                }}
                className='image-comments'
                style={
                  imageFull.sec2 === null && count < 2
                    ? { display: 'none' }
                    : { display: 'flex' }
                }
              >
                <div className='report-image'>
                  <p> {t('myBusiness.report.uploadImage')}</p>
                  <Files
                    className='edit-files-dropzone'
                    onChange={onFilesChangeDynamic}
                    onError={(e) =>
                      setImgErrors({
                        ...imgErrors,
                        err2: e.message + ': limit 10MB',
                      })
                    }
                    accepts={[
                      'image/gif',
                      'image/jpeg',
                      'image/png',
                      'image/jpg',
                      '.svg',
                    ]}
                    multiple={false}
                    maxFileSize={10000000}
                    minFileSize={10}
                    clickable={imageFull.sec2 !== null ? false : true}
                  >
                    <label htmlFor='main' style={{ cursor: 'pointer' }}>
                      <img
                        src={
                          imageFull.sec2 !== null && editItems.sec2 === false
                            ? imageFull.sec2
                            : imagePreview.sec2 !== null &&
                              editItems.sec2 === true
                            ? imagePreview.sec2
                            : File
                        }
                      />

                      <span className='status'>
                        {t('myBusiness.report.upload_status')}
                      </span>
                      <ProgressBar now={secLoaded.sec2} />
                    </label>
                    {imgErrors.err2 && (
                      <div style={{ color: 'red' }}>{imgErrors.err2}</div>
                    )}
                  </Files>
                </div>
                <div className='report-comments'>
                  <label>
                    <p>{t('myBusiness.report.comments')}</p>
                    <textarea
                      placeholder={t('myBusiness.report.placeholder')}
                      value={!editComments.sec2 ? comments.sec2 : null}
                      type='text'
                      onChange={(e) => handleCommentsDynamic(e)}
                      readOnly={prdDatas[2] !== undefined ? true : false}
                    />
                  </label>
                </div>
                <div className='edit-delete'>
                  <button
                    type='submit'
                    className='report-details-edit'
                    onClick={() => deleteItem(array[2])}
                  >
                    <Delete />
                  </button>
                </div>
              </div>
              <div
                onClick={() => {
                  setSelectedSection(3);
                }}
                className='image-comments'
                style={
                  imageFull.sec3 === null && count < 3
                    ? { display: 'none' }
                    : { display: 'flex' }
                }
              >
                <div className='report-image'>
                  <p> {t('myBusiness.report.uploadImage')}</p>
                  <Files
                    className='edit-files-dropzone'
                    onChange={onFilesChangeDynamic}
                    onError={(e) =>
                      setImgErrors({
                        ...imgErrors,
                        err3: e.message + ': limit 10MB',
                      })
                    }
                    accepts={[
                      'image/gif',
                      'image/jpeg',
                      'image/png',
                      'image/jpg',
                      '.svg',
                    ]}
                    multiple={false}
                    maxFileSize={10000000}
                    minFileSize={10}
                    clickable={imageFull.sec3 !== null ? false : true}
                  >
                    <label htmlFor='main' style={{ cursor: 'pointer' }}>
                      <img
                        src={
                          imageFull.sec3 !== null && editItems.sec3 === false
                            ? imageFull.sec3
                            : imagePreview.sec3 !== null &&
                              editItems.sec3 === true
                            ? imagePreview.sec3
                            : File
                        }
                      />

                      <span className='status'>
                        {t('myBusiness.report.upload_status')}
                      </span>
                      <ProgressBar now={secLoaded.sec3} />
                    </label>
                    {imgErrors.err3 && (
                      <div style={{ color: 'red' }}>{imgErrors.err3}</div>
                    )}
                  </Files>
                </div>
                <div className='report-comments'>
                  <label>
                    <p>{t('myBusiness.report.comments')}</p>
                    <textarea
                      placeholder={t('myBusiness.report.placeholder')}
                      value={!editComments.sec3 ? comments.sec3 : null}
                      type='text'
                      onChange={(e) => handleCommentsDynamic(e)}
                      readOnly={prdDatas[3] !== undefined ? true : false}
                    />
                  </label>
                </div>
                <div className='edit-delete'>
                  <button
                    type='submit'
                    className='report-details-edit'
                    onClick={() => deleteItem(array[3])}
                  >
                    <Delete />
                  </button>
                </div>
              </div>
              <div
                onClick={() => {
                  setSelectedSection(4);
                }}
                className='image-comments'
                style={
                  imageFull.sec4 === null && count < 4
                    ? { display: 'none' }
                    : { display: 'flex' }
                }
              >
                <div className='report-image'>
                  <p> {t('myBusiness.report.uploadImage')}</p>
                  <Files
                    className='edit-files-dropzone'
                    onChange={onFilesChangeDynamic}
                    onError={(e) =>
                      setImgErrors({
                        ...imgErrors,
                        err4: e.message + ': limit 10MB',
                      })
                    }
                    accepts={[
                      'image/gif',
                      'image/jpeg',
                      'image/png',
                      'image/jpg',
                      '.svg',
                    ]}
                    multiple={false}
                    maxFileSize={10000000}
                    minFileSize={10}
                    clickable={imageFull.sec4 !== null ? false : true}
                  >
                    <label htmlFor='main' style={{ cursor: 'pointer' }}>
                      <img
                        src={
                          imageFull.sec4 !== null && editItems.sec4 === false
                            ? imageFull.sec4
                            : imagePreview.sec4 !== null &&
                              editItems.sec4 === true
                            ? imagePreview.sec4
                            : File
                        }
                      />

                      <span className='status'>
                        {t('myBusiness.report.upload_status')}
                      </span>
                      <ProgressBar now={secLoaded.sec4} />
                    </label>
                    {imgErrors.err4 && (
                      <div style={{ color: 'red' }}>{imgErrors.err4}</div>
                    )}
                  </Files>
                </div>
                <div className='report-comments'>
                  <label>
                    <p>{t('myBusiness.report.comments')}</p>
                    <textarea
                      placeholder={t('myBusiness.report.placeholder')}
                      value={!editComments.sec4 ? comments.sec4 : null}
                      type='text'
                      onChange={(e) => handleCommentsDynamic(e)}
                      readOnly={prdDatas[4] !== undefined ? true : false}
                    />
                  </label>
                </div>
                <div className='edit-delete'>
                  <div
                    className='report-details-edit'
                    onClick={() => deleteItem(array[4])}
                  >
                    <Delete />
                  </div>
                </div>
              </div>
              <div
                onClick={() => {
                  setSelectedSection(5);
                }}
                className='image-comments'
                style={
                  imageFull.sec5 === null && count < 5
                    ? { display: 'none' }
                    : { display: 'flex' }
                }
              >
                <div className='report-image'>
                  <p> {t('myBusiness.report.uploadImage')}</p>
                  <Files
                    className='edit-files-dropzone'
                    onChange={onFilesChangeDynamic}
                    onError={(e) =>
                      setImgErrors({
                        ...imgErrors,
                        err5: e.message + ': limit 10MB',
                      })
                    }
                    accepts={[
                      'image/gif',
                      'image/jpeg',
                      'image/png',
                      'image/jpg',
                      '.svg',
                    ]}
                    multiple={false}
                    maxFileSize={10000000}
                    minFileSize={10}
                    clickable={imageFull.sec5 !== null ? false : true}
                  >
                    <label htmlFor='main' style={{ cursor: 'pointer' }}>
                      <img
                        src={
                          imageFull.sec5 !== null && editItems.sec5 === false
                            ? imageFull.sec5
                            : imagePreview.sec5 !== null &&
                              editItems.sec5 === true
                            ? imagePreview.sec5
                            : File
                        }
                      />

                      <span className='status'>
                        {t('myBusiness.report.upload_status')}
                      </span>
                      <ProgressBar now={secLoaded.sec5} />
                    </label>
                    {imgErrors.err5 && (
                      <div style={{ color: 'red' }}>{imgErrors.err5}</div>
                    )}
                  </Files>
                </div>
                <div className='report-comments'>
                  <label>
                    <p>{t('myBusiness.report.comments')}</p>
                    <textarea
                      placeholder={t('myBusiness.report.placeholder')}
                      value={!editComments.sec5 ? comments.sec5 : null}
                      type='text'
                      onChange={(e) => handleCommentsDynamic(e)}
                      readOnly={prdDatas[5] !== undefined ? true : false}
                    />
                  </label>
                </div>
                <div className='edit-delete'>
                  <div
                    className='report-details-edit'
                    onClick={() => deleteItem(array[5])}
                  >
                    <Delete />
                  </div>
                </div>
              </div>
              <div
                onClick={() => {
                  setSelectedSection(6);
                }}
                className='image-comments'
                style={
                  imageFull.sec6 === null && count < 6
                    ? { display: 'none' }
                    : { display: 'flex' }
                }
              >
                <div className='report-image'>
                  <p> {t('myBusiness.report.uploadImage')}</p>
                  <Files
                    className='edit-files-dropzone'
                    onChange={onFilesChangeDynamic}
                    onError={(e) =>
                      setImgErrors({
                        ...imgErrors,
                        err6: e.message + ': limit 10MB',
                      })
                    }
                    accepts={[
                      'image/gif',
                      'image/jpeg',
                      'image/png',
                      'image/jpg',
                      '.svg',
                    ]}
                    multiple={false}
                    maxFileSize={10000000}
                    minFileSize={10}
                    clickable={imageFull.sec6 !== null ? false : true}
                  >
                    <label htmlFor='main' style={{ cursor: 'pointer' }}>
                      <img
                        src={
                          imageFull.sec6 !== null && editItems.sec6 === false
                            ? imageFull.sec6
                            : imagePreview.sec6 !== null &&
                              editItems.sec6 === true
                            ? imagePreview.sec6
                            : File
                        }
                      />

                      <span className='status'>
                        {t('myBusiness.report.upload_status')}
                      </span>
                      <ProgressBar now={secLoaded.sec6} />
                    </label>
                    {imgErrors.err6 && (
                      <div style={{ color: 'red' }}>{imgErrors.err6}</div>
                    )}
                  </Files>
                </div>
                <div className='report-comments'>
                  <label>
                    <p>{t('myBusiness.report.comments')}</p>
                    <textarea
                      placeholder={t('myBusiness.report.placeholder')}
                      value={!editComments.sec6 ? comments.sec6 : null}
                      type='text'
                      onChange={(e) => handleCommentsDynamic(e)}
                      readOnly={prdDatas[6] !== undefined ? true : false}
                    />
                  </label>
                </div>
                <div className='edit-delete'>
                  <div
                    className='report-details-edit'
                    onClick={() => deleteItem(array[6])}
                  >
                    <Delete />
                  </div>
                </div>
              </div>
              <div
                onClick={() => {
                  setSelectedSection(7);
                }}
                className='image-comments'
                style={
                  imageFull.sec7 === null && count < 7
                    ? { display: 'none' }
                    : { display: 'flex' }
                }
              >
                <div className='report-image'>
                  <p> {t('myBusiness.report.uploadImage')}</p>
                  <Files
                    className='edit-files-dropzone'
                    onChange={onFilesChangeDynamic}
                    onError={(e) =>
                      setImgErrors({
                        ...imgErrors,
                        err7: e.message + ': limit 10MB',
                      })
                    }
                    accepts={[
                      'image/gif',
                      'image/jpeg',
                      'image/png',
                      'image/jpg',
                      '.svg',
                    ]}
                    multiple={false}
                    maxFileSize={10000000}
                    minFileSize={10}
                    clickable={imageFull.sec7 !== null ? false : true}
                  >
                    <label htmlFor='main' style={{ cursor: 'pointer' }}>
                      <img
                        src={
                          imageFull.sec7 !== null && editItems.sec7 === false
                            ? imageFull.sec7
                            : imagePreview.sec7 !== null &&
                              editItems.sec7 === true
                            ? imagePreview.sec7
                            : File
                        }
                      />

                      <span className='status'>
                        {t('myBusiness.report.upload_status')}
                      </span>
                      <ProgressBar now={secLoaded.sec7} />
                    </label>
                    {imgErrors.err7 && (
                      <div style={{ color: 'red' }}>{imgErrors.err7}</div>
                    )}
                  </Files>
                </div>
                <div className='report-comments'>
                  <label>
                    <p>{t('myBusiness.report.comments')}</p>
                    <textarea
                      placeholder={t('myBusiness.report.placeholder')}
                      value={!editComments.sec7 ? comments.sec7 : null}
                      type='text'
                      onChange={(e) => handleCommentsDynamic(e)}
                      readOnly={prdDatas[7] !== undefined ? true : false}
                    />
                  </label>
                </div>
                <div className='edit-delete'>
                  <div
                    className='report-details-edit'
                    onClick={() => deleteItem(array[7])}
                  >
                    <Delete />
                  </div>
                </div>
              </div>
              <div
                onClick={() => {
                  setSelectedSection(8);
                }}
                className='image-comments'
                style={
                  imageFull.sec8 === null && count < 8
                    ? { display: 'none' }
                    : { display: 'flex' }
                }
              >
                <div className='report-image'>
                  <p> {t('myBusiness.report.uploadImage')}</p>
                  <Files
                    className='edit-files-dropzone'
                    onChange={onFilesChangeDynamic}
                    onError={(e) =>
                      setImgErrors({
                        ...imgErrors,
                        err8: e.message + ': limit 10MB',
                      })
                    }
                    accepts={[
                      'image/gif',
                      'image/jpeg',
                      'image/png',
                      'image/jpg',
                      '.svg',
                    ]}
                    multiple={false}
                    maxFileSize={10000000}
                    minFileSize={10}
                    clickable={imageFull.sec8 !== null ? false : true}
                  >
                    <label htmlFor='main' style={{ cursor: 'pointer' }}>
                      <img
                        src={
                          imageFull.sec8 !== null && editItems.sec8 === false
                            ? imageFull.sec8
                            : imagePreview.sec8 !== null &&
                              editItems.sec8 === true
                            ? imagePreview.sec8
                            : File
                        }
                      />

                      <span className='status'>
                        {t('myBusiness.report.upload_status')}
                      </span>
                      <ProgressBar now={secLoaded.sec8} />
                    </label>
                    {imgErrors.err8 && (
                      <div style={{ color: 'red' }}>{imgErrors.err8}</div>
                    )}
                  </Files>
                </div>
                <div className='report-comments'>
                  <label>
                    <p>{t('myBusiness.report.comments')}</p>
                    <textarea
                      placeholder={t('myBusiness.report.placeholder')}
                      value={!editComments.sec8 ? comments.sec8 : null}
                      type='text'
                      onChange={(e) => handleCommentsDynamic(e)}
                      readOnly={prdDatas[8] !== undefined ? true : false}
                    />
                  </label>
                </div>
                <div className='edit-delete'>
                  <div
                    className='report-details-edit'
                    onClick={() => deleteItem(array[8])}
                  >
                    <Delete />
                  </div>
                </div>
              </div>
              <div
                onClick={() => {
                  setSelectedSection(9);
                }}
                className='image-comments'
                style={
                  imageFull.sec9 === null && count < 9
                    ? { display: 'none' }
                    : { display: 'flex' }
                }
              >
                <div className='report-image'>
                  <p> {t('myBusiness.report.uploadImage')}</p>
                  <Files
                    className='edit-files-dropzone'
                    onChange={onFilesChangeDynamic}
                    onError={(e) =>
                      setImgErrors({
                        ...imgErrors,
                        err9: e.message + ': limit 10MB',
                      })
                    }
                    accepts={[
                      'image/gif',
                      'image/jpeg',
                      'image/png',
                      'image/jpg',
                      '.svg',
                    ]}
                    multiple={false}
                    maxFileSize={10000000}
                    minFileSize={10}
                    clickable={imageFull.sec9 !== null ? false : true}
                  >
                    <label htmlFor='main' style={{ cursor: 'pointer' }}>
                      <img
                        src={
                          imageFull.sec9 !== null && editItems.sec9 === false
                            ? imageFull.sec9
                            : imagePreview.sec9 !== null &&
                              editItems.sec9 === true
                            ? imagePreview.sec9
                            : File
                        }
                      />

                      <span className='status'>
                        {t('myBusiness.report.upload_status')}
                      </span>
                      <ProgressBar now={secLoaded.sec9} />
                    </label>
                    {imgErrors.err9 && (
                      <div style={{ color: 'red' }}>{imgErrors.err9}</div>
                    )}
                  </Files>
                </div>
                <div className='report-comments'>
                  <label>
                    <p>{t('myBusiness.report.comments')}</p>
                    <textarea
                      placeholder={t('myBusiness.report.placeholder')}
                      value={!editComments.sec9 ? comments.sec9 : null}
                      type='text'
                      onChange={(e) => handleCommentsDynamic(e)}
                      readOnly={prdDatas[9] !== undefined ? true : false}
                    />
                  </label>
                </div>
                <div className='edit-delete'>
                  <div
                    className='report-details-edit'
                    onClick={() => deleteItem(array[9])}
                  >
                    <Delete />
                  </div>
                </div>
              </div>
              {count === 10 ? (
                <p style={{ color: 'red' }}>
                  Maximum number of reports reached
                </p>
              ) : (
                <div style={{ display: 'flex', width: '30%' }}>
                  <Plus
                    style={{ width: '25px', cursor: 'pointer' }}
                    onClick={() => {
                      setCount((initialCount) => initialCount + 1);
                      setClicked(true);
                    }}
                  />
                  <div style={{ margin: 'auto' }}>
                    {t('myBusiness.report.moreImages')}
                  </div>
                </div>
              )}
              <div className='row mt-4'>
                <div className='col text-right'>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className='btn btn-primary ml-3 mb-3 clk3'
                    data-toggle='modal'
                    data-target='#preview-report'
                  >
                    {t('myBusiness.report.preview')}
                  </button>
                  <button
                    className='btn btn-gray ml-3 mb-3 clk3'
                    type='button'
                    onClick={(e) => handleSubmitDraft(e)}
                  >
                    {t('myBusiness.report.save')}
                  </button>

                  {/* <button
                  className='report-preview'
                  type='button'
                  onClick={() => {
                    setShow(true);
                    return prod_data.length <= count ? sendProdData() : null;
                  }}
                >
                  Preview Report
                </button> */}

                  <button
                    className='btn btn-primary ml-3 mb-3 clk3'
                    type='button'
                    onClick={(e) => handleSubmit(e)}
                  >
                    {t('myBusiness.report.sendAndSubmit')}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default withTranslation()(EditReport);
