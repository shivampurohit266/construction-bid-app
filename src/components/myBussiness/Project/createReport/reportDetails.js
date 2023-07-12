import React, { useState, useEffect } from 'react';
import Header from '../../../shared/Header';
import BusinessInfo from '../../modals/BusinessInfo';
import ClipLoader from 'react-spinners/ClipLoader';
import { composeInitialProps, withTranslation } from 'react-i18next';
import { Prompt } from 'react-router';
import img from '../../../../images/DefaultImg.png';
import Spinner from 'react-bootstrap/Spinner';
import imageCompression from 'browser-image-compression';
import AddCustomer from '../../modals/AddCustomer';
import Datetime from 'react-datetime';
import moment from 'moment';
import { Link } from 'react-router-dom';
import File from '../../../../images/file-icon.png';
import { ReactComponent as Edit } from '../../../../images/edit.svg';
import { ReactComponent as Delete } from '../../../../images/trash.svg';
import { ReactComponent as Plus } from '../../../../images/plus.svg';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Files from 'react-files';
import { useHistory } from 'react-router-dom';
import { url } from '../../../../helper/helper';
import Autosuggest from 'react-autosuggest';
import './reportDetails.css';
import Preview from './Preview report/Preview';
import Sidebar from '../../../shared/Sidebar';
import SweetAlert from 'react-bootstrap-sweetalert';
import Breadcrumb from '../../../shared/Breadcrumb';
import { getData, postDataWithToken } from '../../../../helper/api';
import EmailId from '../../../marketPlace/EmailId';

let arrayOfarrays = [];
let arrayOfImages = [];
let arrayOfDescription = [];

const ReportDetails = ({ t, location }) => {
  const token = localStorage.getItem('token');
  const [task, setTask] = useState([]);
  const [show, setShow] = useState(false);
  const [filteredProject, setFilteredProject] = useState('');
  const [prod_img, setProd_img] = useState([]);
  const [prod_desc, setProd_desc] = useState([]);
  const [prod_data, setProd_data] = useState([]);
  const [success, setSucces] = useState(false);
  const [warning, setWarning] = useState(false);
  const [success2, setSucces2] = useState(false);
  const [warning2, setWarning2] = useState(false);
  const [clientId, setClientId] = useState('');
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [email, setEmail] = useState(null);
  const [emails, setEmails] = useState([]);
  const [website, setWebsite] = useState(null);
  const [phone, setPhone] = useState(null);
  const [zipCode, setZipCode] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [count, setCount] = useState(0);
  const [selectedSection, setSelectedSection] = useState('');
  const [suggestion, setSuggestion] = useState([]);
  const [value, setValue] = useState('');
  const [firstName, setFistName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [errors, setErrors] = useState({
    title: '',
    date: '',
    address: '',
    comments: '',
    main_img: '',
    customer: '',
    fiName: '',
    laName: '',
    emailId: '',
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

  const [report, setReport] = useState({
    name: '',
    address: '',
    status: '',
    project_id: '',
    task_id: '',
    date: '',
    customer: '',
    // fiName: firstName,
    // laName: lastName,
    emailId: '',
  });

  const history = useHistory();
  const {
    name,
    address,
    status,
    project_id,
    task_id,
    date,
    fiName,
    laName,
    emailId,
    customer,
  } = report;

  useEffect(() => {
    getCustomers();
    getProjects();
    getAccount();
  }, []);

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

  const getCustomers = async () => {
    const result = await getData(
      `${url}/api/resources-client-list/Client`,
      token
    );
    const data2 = result?.data;

    if (data2 && data2 !== undefined) {
      setClients(data2?.data);

      const client = data2?.data?.map((client) => {
        console.log(client);
        const firstName = client.first_name;
        const lastName = client.last_name;
        setClientId(client.ur_resource_id);
        setFistName(firstName);
        setLastName(lastName);
        return { firstName, lastName };
      });
    }
  };

  const getProjects = async () => {
    const result = await getData(`${url}/api/projectGet`, token);

    const data = result?.data;

    setProjects(data?.data);
  };

  const getAccount = async () => {
    await getData(`${url}/api/account`, token)
      .then(({ data }) => {
        console.log(data);
        const acc = data[0];
        setCompanyLogo(acc.company_logo);
        setCompanyId(acc.company_id);
        setFullName(acc.full_name);
        setEmail(acc.email);
        setWebsite(acc.company_website);
        setPhone(acc.phone);
        setZipCode(acc.zip);
        setUserAddress(acc.address);
        //setEmails(acc.email ? acc.email.split(',') : []);
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
  console.log(customer, clientId);
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
    if (name && name.length < 5) {
      setLoading(false);
      hasErrors = true;
      newErrors.name = t('myBusiness.report.titleLength');
    }

    if (!address) {
      setLoading(false);
      hasErrors = true;
      newErrors.address = t('myBusiness.report.addAddress');
    }

    if (!date) {
      setLoading(false);
      hasErrors = true;
      newErrors.date = t('myBusiness.report.addDate');
    }

    if (!comments.sec0) {
      setLoading(false);
      hasErrors = true;
      newErrors.comments = t('myBusiness.report.addComment');
    }
    if (
      (!customer && !emailId) ||
      (customer === 'Select Customer' && !emailId)
    ) {
      setLoading(false);
      hasErrors = true;
      newErrors.fiName = t('myBusiness.report.addCustomer');
      newErrors.laName = t('myBusiness.report.addCustomer');
      newErrors.emailId = t('myBusiness.report.addEmail');
    }
    if (!imagePreview.sec0) {
      setLoading(false);
      hasErrors = true;
      newErrors.main_img = t('myBusiness.report.addImage');
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
        customer !== 'Select Customer' ? customer : ''
      );
      formData.append('pr_name', name);
      formData.append('pr_date', moment(date).format('DD-MM-YYYY HH:mm:ss'));
      formData.append('pr_address', address);
      formData.append('pr_status', status);
      formData.append('pr_project_id', project_id);
      formData.append('pr_task_id', task_id);
      formData.append('pr_emails', inputProps.value);
      formData.append('sent', 1);
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
        `${url}/api/project_report/create`,
        formData,
        token
      )
        .then((result) => {
          //const { data } = result;

          setLoading(false);
          setSucces(true);
          setWarning(false);
          arrayOfDescription = [];
          arrayOfImages = [];
          setRedirect(false);

          //history.push('/create-report');
        })
        .catch((errors) => {
          console.log('error=>', errors);
        });
    }
  };
  console.log(imageFull);
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
      formData.append('pr_date', moment(date).format('DD-MM-YYYY HH:mm:ss'));
      formData.append('pr_status', status);
      formData.append('pr_project_id', project_id);
      formData.append('pr_task_id', task_id);

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
      )
        .then(
          (res) => {
            setLoading(false);
            //const { data } = res;
            setSucces2(true);
            setWarning2(false);
            setRedirect(false);
            arrayOfDescription = [];
            arrayOfImages = [];
          },
          () => {}
        )
        .catch((errors) => {
          console.log('error=>', errors);
        });
    }
  };

  useEffect(() => {
    const data = projects?.filter((pro) => clientId == pro.client_id);

    setFilteredProject(data);
  }, [clientId]);

  const handleBusinessInfo = (val) => {};

  const valid = (current) => {
    var yesterday = moment().subtract(1, 'day');
    //let yesterday = moment();
    if (current) {
      return current.isAfter(yesterday);
    }
  };

  const checkallfields = () => {
    if (name || date || address || comments || imageFull) {
      setRedirect(true);
    } else {
      setRedirect(false);
    }
  };

  const closeModal = () => {
    setShow(false);
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
        setImgErrors({
          ...imgErrors,
          ['sec' + selectedSection]: '',
        });
        setSecLoaded({ ...secLoaded, ['sec' + selectedSection]: 50 });
        setTimeout(() => {
          setSecLoaded({ ...secLoaded, ['sec' + selectedSection]: 100 });
        }, 2000);
      });
    }
  };

  const handleCommentsDynamic = (e) => {
    const { value } = e.target;
    setComments({ ...comments, ['sec' + selectedSection]: value });
  };

  const sendProdDesc = () => {
    const comment = comments['sec' + selectedSection];

    if (!comment) {
      return;
    }
    let array = [comment];
    arrayOfDescription.push(comment);
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

  const deleteData = (e) => {
    const el = e.currentTarget.parentElement.parentElement;
    el.addEventListener('click', () => {
      el.remove();
    });
  };

  const getSuggestions = (value) => {
    setReport({ ...report, emailId: value });
    setErrors({ ...errors, emailId: '' });
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : emails?.filter(
          (email) => email.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  const getSuggestionValue = (suggestion) => suggestion;

  const renderSuggestion = (suggestion) => <div>{suggestion}</div>;

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestion(getSuggestions(value));
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestion([]);
  };

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    placeholder: t('myBusiness.report.place_email'),
    value,
    className: 'form-control',
    onChange: onChange,
  };

  const handleDelete = (item) => {
    setEmails(emails.filter((i) => i !== item));
  };

  useEffect(() => {
    setInterval(() => {
      checkallfields();
    }, 1000);
  }, []);

  const onConfirmError = () => {
    setSucces(false);
    setWarning(true);
    setSucces2(false);
    setWarning2(true);
    setRedirect(false);
    history.push('/report-listing');
  };
  console.log(imgErrors.err0, imageFull['sec0'], report);
  // const CreateElement = () => {
  //   return (
  //     <div
  //       //onClick={() => setSelectedSection(count)}
  //       className='image-comments'
  //       style={count < 1 ? { display: 'none' } : { display: 'flex' }}
  //     >
  //       <div className='report-image'>
  //         <p>Upload Image</p>
  //         <Files
  //           className='edit-files-dropzone'
  //           onChange={onFilesChangeDynamic}
  //           onError={(e) =>
  //             setImgErrors({
  //               ...imgErrors,
  //               //err1: e.message + ': limit 3.14MB',
  //             })
  //           }
  //           accepts={[
  //             'image/gif',
  //             'image/jpeg',
  //             'image/png',
  //             'image/jpg',
  //             '.svg',
  //           ]}
  //           multiple={false}
  //           maxFileSize={3145757}
  //           minFileSize={10}
  //           clickable
  //         >
  //           <label htmlFor='main' style={{ cursor: 'pointer' }}>
  //             <img
  //               src={
  //                 imagePreview[`sec${selectedSection}`] !== null
  //                   ? imagePreview[`sec${selectedSection}`]
  //                   : File
  //               }
  //             />

  //             <span className='status'>
  //               {t('c_material_list.request.Upload_status')}
  //             </span>
  //             <ProgressBar now={secLoaded[`sec${selectedSection}`]} />
  //           </label>
  //           {imgErrors[`sec${selectedSection}`] && (
  //             <div style={{ color: 'red' }}>
  //               {imgErrors[`sec${selectedSection}`]}
  //             </div>
  //           )}
  //         </Files>
  //       </div>
  //       <div className='report-comments'>
  //         <label>
  //           <p>Comments</p>
  //           <textarea type='text' onChange={(e) => handleCommentsDynamic(e)} />
  //         </label>
  //       </div>
  //       <div className='edit-delete'>
  //         <div className='report-details-edit'>
  //           <Edit />
  //         </div>
  //         <div className='report-details-edit'>
  //           <Delete />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // const addElementOnClick = () => {
  //   setElementsList(
  //     elementsList.concat(<CreateElement id={elementsList.length} />)
  //   );

  //   setSelectedSection(count);
  //   setCount(count + 1);
  //   return prod_img.length < count ||
  //     (count === 0 && prod_desc.length < count) ||
  //     count === 0
  //     ? sendImgAndDescription()
  //     : null;
  // };
  return (
    <>
      <div>
        {redirect && !success ? (
          <Prompt
            when={redirect}
            message={t('marketplace.feeds.list_details.leave_page')}
          />
        ) : (
          ''
        )}
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
                title={t('myBusiness.report.SuccessPopup')}
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
              <h3 className='head3'>{t('myBusiness.report.createReport')}</h3>
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
                clientId={customer !== 'Select Customer' ? customer : ''}
                date={date}
                clientAddress={address}
                filteredProjects={filteredProject}
                task={task}
                taskId={task_id}
                prod_data={prod_data}
                imageFull={imageFull}
                imagePreview={imagePreview}
                comments={comments}
                closeModal={closeModal}
                emails={emailId}
              />

              <AddCustomer />
              <BusinessInfo onInfo={handleBusinessInfo} />

              <div className='card' style={{ maxWidth: '1120px' }}>
                <div className='card-body'>
                  <div className='row'>
                    <div className='col-xl-12 col-lg-12'>
                      <div className='form-group'>
                        {/* <form noValidate action='' className='report-details-form'> */}
                        <label htmlFor='name' className='report-project-title'>
                          {' '}
                          {t('myBusiness.report.title')}
                          <input
                            name=''
                            id='name'
                            onChange={(e) => {
                              setReport({ ...report, name: e.target.value });
                              setErrors({ ...errors, name: '' });
                            }}
                            className='select-customer'
                            placeholder={t('myBusiness.report.title')}
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
                          <a
                            href='#'
                            data-toggle='modal'
                            data-target='#edit-info'
                          >
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
                          <a
                            href='#'
                            data-toggle='modal'
                            data-target='#add-cus'
                          >
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
                              {t('myBusiness.report.select_project')}
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
                            required
                            name='customer'
                            id='customer'
                            className='select-customer'
                            onChange={(e) => {
                              setClientId(e.target.value);
                              setReport({
                                ...report,
                                customer: e.target.value,
                                fiName: firstName,
                                laName: lastName,
                              });
                              setErrors({
                                ...errors,
                                //name: '',
                                customer: '',
                                fiName: '',
                                laName: '',
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
                          </select>
                        </div>
                        <p className='error'>{!emailId ? errors.fiName : ''}</p>
                      </label>

                      <div className='form-group'>
                        <label htmlFor='mails'>
                          {t('myBusiness.report.mailToSeveral')}
                        </label>
                        {emails?.map((item, i) => (
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
                        ))}
                        <Autosuggest
                          suggestions={suggestion}
                          onSuggestionsFetchRequested={
                            onSuggestionsFetchRequested
                          }
                          onSuggestionsClearRequested={
                            onSuggestionsClearRequested
                          }
                          getSuggestionValue={getSuggestionValue}
                          renderSuggestion={renderSuggestion}
                          inputProps={inputProps}
                        />
                      </div>
                      <p className='error'>
                        {!fiName && !laName ? errors.emailId : ''}
                      </p>
                    </div>

                    <div className='date-exec-case'>
                      <label>
                        {t('myBusiness.report.date')}
                        <Datetime
                          onChange={(e) => {
                            setReport({ ...report, date: e._d });
                            setErrors({ ...errors, date: '' });
                          }}
                          isValidDate={valid}
                          value={date}
                          dateFormat='DD-MM-YYYY'
                          timeFormat={false}
                          locale={`${
                            localStorage.getItem('_lng') === 'fi'
                              ? 'fr-fi'
                              : 'en-US'
                          } `}
                        />
                        <p className='error'>{errors.date}</p>
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
                    <option value=''> {t('myBusiness.report.selectTask')}</option>
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
                    onClick={() => setSelectedSection(0)}
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
                        clickable
                      >
                        <label htmlFor='main' style={{ cursor: 'pointer' }}>
                          <img
                            src={
                              imagePreview.sec0 !== null
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
                          type='text'
                          name='sec0'
                          onChange={(e) => {
                            handleCommentsDynamic(e);
                            setErrors({ ...errors, comments: '' });
                          }}
                        />
                        {errors.comments && (
                          <p className='error' style={{ fontSize: '1.4rem' }}>
                            {errors.comments}
                          </p>
                        )}
                      </label>
                    </div>
                    <div className='edit-delete' id='0'>
                      <div
                        className='report-details-edit'
                        onClick={(e) => deleteData(e)}
                      >
                        <Delete />
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedSection(1)}
                    className='image-comments'
                    style={
                      count < 1 ? { display: 'none' } : { display: 'flex' }
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
                        clickable
                      >
                        <label htmlFor='main' style={{ cursor: 'pointer' }}>
                          <img
                            src={
                              imagePreview.sec1 !== null
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
                          type='text'
                          onChange={(e) => handleCommentsDynamic(e)}
                        />
                      </label>
                    </div>
                    <div className='edit-delete'>
                      <div
                        className='report-details-edit'
                        onClick={(e) => deleteData(e)}
                      >
                        <Delete />
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => setSelectedSection(2)}
                    className='image-comments'
                    style={
                      count < 2 ? { display: 'none' } : { display: 'flex' }
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
                        clickable
                      >
                        <label htmlFor='main' style={{ cursor: 'pointer' }}>
                          <img
                            src={
                              imagePreview.sec2 !== null
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
                          type='text'
                          onChange={(e) => handleCommentsDynamic(e)}
                        />
                      </label>
                    </div>
                    <div className='edit-delete'>
                      <div
                        className='report-details-edit'
                        onClick={(e) => deleteData(e)}
                      >
                        <Delete />
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => setSelectedSection(3)}
                    className='image-comments'
                    style={
                      count < 3 ? { display: 'none' } : { display: 'flex' }
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
                        clickable
                      >
                        <label htmlFor='main' style={{ cursor: 'pointer' }}>
                          <img
                            src={
                              imagePreview.sec3 !== null
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
                          type='text'
                          onChange={(e) => handleCommentsDynamic(e)}
                        />
                      </label>
                    </div>
                    <div className='edit-delete'>
                      <div
                        className='report-details-edit'
                        onClick={(e) => deleteData(e)}
                      >
                        <Delete />
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => setSelectedSection(4)}
                    className='image-comments'
                    style={
                      count < 4 ? { display: 'none' } : { display: 'flex' }
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
                        clickable
                      >
                        <label htmlFor='main' style={{ cursor: 'pointer' }}>
                          <img
                            src={
                              imagePreview.sec4 !== null
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
                          type='text'
                          onChange={(e) => handleCommentsDynamic(e)}
                        />
                      </label>
                    </div>
                    <div className='edit-delete'>
                      <div
                        className='report-details-edit'
                        onClick={(e) => deleteData(e)}
                      >
                        <Delete />
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => setSelectedSection(5)}
                    className='image-comments'
                    style={
                      count < 5 ? { display: 'none' } : { display: 'flex' }
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
                        clickable
                      >
                        <label htmlFor='main' style={{ cursor: 'pointer' }}>
                          <img
                            src={
                              imagePreview.sec5 !== null
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
                          type='text'
                          onChange={(e) => handleCommentsDynamic(e)}
                        />
                      </label>
                    </div>
                    <div className='edit-delete'>
                      <div
                        className='report-details-edit'
                        onClick={(e) => deleteData(e)}
                      >
                        <Delete />
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => setSelectedSection(6)}
                    className='image-comments'
                    style={
                      count < 6 ? { display: 'none' } : { display: 'flex' }
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
                        clickable
                      >
                        <label htmlFor='main' style={{ cursor: 'pointer' }}>
                          <img
                            src={
                              imagePreview.sec6 !== null
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
                          type='text'
                          onChange={(e) => handleCommentsDynamic(e)}
                        />
                      </label>
                    </div>
                    <div className='edit-delete'>
                      <div
                        className='report-details-edit'
                        onClick={(e) => deleteData(e)}
                      >
                        <Delete />
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => setSelectedSection(7)}
                    className='image-comments'
                    style={
                      count < 7 ? { display: 'none' } : { display: 'flex' }
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
                        clickable
                      >
                        <label htmlFor='main' style={{ cursor: 'pointer' }}>
                          <img
                            src={
                              imagePreview.sec7 !== null
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
                          type='text'
                          onChange={(e) => handleCommentsDynamic(e)}
                        />
                      </label>
                    </div>
                    <div className='edit-delete'>
                      <div
                        className='report-details-edit'
                        onClick={(e) => deleteData(e)}
                      >
                        <Delete />
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => setSelectedSection(8)}
                    className='image-comments'
                    style={
                      count < 8 ? { display: 'none' } : { display: 'flex' }
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
                        clickable
                      >
                        <label htmlFor='main' style={{ cursor: 'pointer' }}>
                          <img
                            src={
                              imagePreview.sec8 !== null
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
                          type='text'
                          onChange={(e) => handleCommentsDynamic(e)}
                        />
                      </label>
                    </div>
                    <div className='edit-delete'>
                      <div
                        className='report-details-edit'
                        onClick={(e) => deleteData(e)}
                      >
                        <Delete />
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => setSelectedSection(9)}
                    className='image-comments'
                    style={
                      count < 9 ? { display: 'none' } : { display: 'flex' }
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
                        clickable
                      >
                        <label htmlFor='main' style={{ cursor: 'pointer' }}>
                          <img
                            src={
                              imagePreview.sec9 !== null
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
                          type='text'
                          onChange={(e) => handleCommentsDynamic(e)}
                        />
                      </label>
                    </div>
                    <div className='edit-delete'>
                      <div
                        className='report-details-edit'
                        onClick={(e) => deleteData(e)}
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
                          setCount(count + 1);
                          return prod_img.length < count ||
                            (count === 0 && prod_desc.length < count) ||
                            count === 0
                            ? sendImgAndDescription()
                            : null;
                        }}
                        //onClick={addElementOnClick}
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
                  {/* </form> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{' '}
    </>
  );
};

export default withTranslation()(ReportDetails);
