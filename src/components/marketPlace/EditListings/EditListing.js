import React, { useEffect, useState, useMemo } from 'react';
import Header from '../../shared/Header';
import { Link, useParams } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import axios from 'axios';
import { url } from '../../../helper/helper';
import Sidebar from '../../shared/Sidebar';
import Files from 'react-files';
import ProgressBar from 'react-bootstrap/ProgressBar';
import File from '../../../images/file-icon.png';
import { Multiselect } from 'multiselect-react-dropdown';
import Datetime from 'react-datetime';
import moment from 'moment';
import SweetAlert from 'react-bootstrap-sweetalert';
import Alert from 'react-bootstrap/Alert';

import './editListing.css';
import { getData, postDataWithToken } from '../../../helper/api';

const EditListing = ({ t, location, history }) => {
  const [success, setSuccess] = useState(false);
  const [checked, setChecked] = useState(false);
  const [extra, setExtra] = useState('');
  const [states, setStates] = useState([]);
  const [filteredState, setFilteredState] = useState('');
  const [slider, setSlider] = useState([]);
  const [details, setDetails] = useState('');
  const [category, setCategory] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [attachment_text, setAttachment_text] = useState('');
  const [requestOrOffer, setRequestOrOffer] = useState('');
  const [type, setType] = useState('');
  const [selectedValue, setSelectedValue] = useState([]);
  const [cannotEdit, setCannotEdit] = useState(false);

  let [work, setWork] = useState({
    budget: '',
    rate: '',
    start: '',
    end: '',
  });

  let { budget, rate, start, end } = work;
  const [offer, setOffer] = useState({
    costUnit: '',
    delivery: '',
    warranty: '',
  });

  const { costUnit, delivery, warranty } = offer;
  let [pictures, setPictures] = useState({
    loaded: 0,
    load_att: 0,
    load_product: 0,
    main_preview: null,
    main_img: null,
    attachment_preview: null,
    attachment_img: null,
    featured_attachment: '',
    fileArray_preview: [],
    fileArray_images: [],
    featured_image: '',
    slider_image: [],
    file_error: '',
    file_att_error: '',
    product_error: '',
  });
  let {
    //loaded,
    //main_preview,
    //main_img,
    //attachment_preview,
    // attachment_img,
    //fileArray_preview,
    //fileArray_images,
    //featured_image,
    //load_att,
    //load_product,
    //featured_attachment,
    //file_error,
    //file_att_error,
    //product_error,
  } = pictures;

  const [form, setForm] = useState({
    title: '',
    volume: '',
    unit: '',
    state: '',
    city: [],
    expires: '',
    description: '',
    workOrMat: '',
    selectedCity: [],
    selectedCategory: '',
    category1: '',
    featured_image: '',
    attachment_img: null,
    attachment_preview: null,
    featured_attachment: '',
    fileArray_preview: [],
    fileArray_images: [],
    loaded: 0,
    load_att: 0,
    load_product: 0,
    main_preview: null,
    main_img: null,
    attachment_preview: null,
    featured_attachment: '',
    fileArray_preview: [],
    fileArray_images: [],
    featured_image: '',
    slider_image: [],
    file_error: '',
    file_att_error: '',
    product_error: '',
  });

  const {
    title,
    volume,
    unit,
    state,
    city,
    description,
    workOrMat,
    expires,
    selectedCategory,
    featured_image,
    attachment_img,
    attachment_preview,
    featured_attachment,
    fileArray_preview,
    fileArray_images,
    file_error,
    file_att_error,
    product_error,
    load_att,
    load_product,
    loaded,
    main_preview,
    main_img,
    category1,
  } = form;
  console.log(category1, fileArray_images);
  const token = localStorage.getItem('token');
  const lng = localStorage.getItem('_lng');

  const { id } = useParams();

  useEffect(() => {
    LoadDetails();
    getState();
    loadCategory();
    //loadFeed();
  }, []);

  //test
  const loadCategory = async () => {
    await getData(`${url}/api/category/${lng}`, token)
      .then((result) => {
        setCategory(result?.data.data);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response === undefined) {
          loadCategory();
        }
      });
  };

  const loadFeed = async () => {
    await getData(`${url}/api/feed-detail/${id}`, token)
      .then((result) => {
        setDetails(result.data[0]);
        const vals = Object.values(result?.data[0].tender_slider_images);
        setSlider(vals);
        setPictures({
          ...pictures,
          featured_image: result?.data[0].tender_featured_image,
          featured_attachment: result?.data[0].tender_attachment,
        });
        setSelectedValue(result?.data[0].tender_city_arr);
        const mapCities = result?.data[0].tender_city_arr.map((city) => {
          return city.id;
        });
        //setCitiesList(mapCities);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  console.log(citiesList, selectedValue, city);
  const getCities = async () => {
    const allRegions = state === '957' ? [] : state;
    await getData(`${url}/api/cityId/${allRegions}/${lng}`, token)
      .then((result) => {
        setForm({ ...form, city: result?.data.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(state);
  //hook to stop too many rerenders and calls of getCities
  useMemo(() => {
    getCities();
  }, [state]);

  const refreshState = () => {
    if (states === undefined) {
      setStates([]);
      getState();
    }
  };

  useEffect(() => {
    refreshState();
  }, [states]);

  const getState = async () => {
    await getData(`${url}/api/state/${lng}`, token)
      .then((res) => {
        setStates(res?.data?.data);
      })
      .catch((err) => {
        if (err) {
          getState();
        }
        console.log(err);
      });
  };

  //this functon is to get the name of the State
  const FilterState = () => {
    if (states) {
      states.filter((stat) => {
        if (stat.state_id === state) {
          setFilteredState(stat.state_name);
        }
      });
    }
  };

  useMemo(() => FilterState(), [states]);

  const LoadDetails = async () => {
    await getData(`${url}/api/tender/edit/${id}`, token)
      .then((res) => {
        if (res === undefined) {
          setCannotEdit(true);
        }

        const details = res?.data;
        setForm({
          ...form,
          title: details.tender_title,
          volume: details.tender_quantity,
          unit: details.tender_unit,
          state: details.tender_state,
          expires: details.tender_expiry_date,
          description: details.tender_description,
          workOrMat: details.extra,
          selectedCategory: details.tender_category_id,
          category1: details.category,
          //city: details.tender_city,
          featured_attachment: details.tender_attachment,
          featured_image: details.tender_featured_image,
        });
        const check = details.extra === 2 || details.extra === 1 ? true : false;
        setChecked(check);
        setExtra(details.extra);
        //setAttachment_text(details.tender_attachment);
        setSelectedValue(details.city_state_arr);
        setCitiesList(details.tender_city_id);
        setRequestOrOffer(details.tender_type);
        setOffer({
          ...offer,
          costUnit: details.tender_cost_per_unit,
          delivery: details.tender_delivery_type,
          warranty: details.tender_warranty,
        });
        setType(details.tender_category_type);
        setSlider(JSON.parse(details.tender_slider_images));
        setWork({
          ...work,
          budget: details.tender_budget,
          rate: details.tender_rate,
          start: details.tender_available_from,
          end: details.tender_available_to,
        });
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response?.data === 'some one made a bid cannot edit ') {
          setCannotEdit(true);
        }
      });
  };
  console.log(slider);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const removeImg = (e) => {
    e.preventDefault();
    setForm({
      ...form,
      main_preview: null,
      loaded: 0,
      featured_image: null,
    });
  };

  const removeImgAtt = (e) => {
    e.preventDefault();
    setForm({
      ...form,
      attachment_preview: null,
      load_att: 0,
      featured_attachment: null,
    });
    setAttachment_text('');
  };

  const removeProductImg = (e) => {
    e.preventDefault();
    setForm({ ...form, fileArray_preview: [], load_product: 0 });
    setSlider([]);
  };

  //main preview is the image that has been added
  //featured_image is the image that is fetched from the DB
  //main_img is the image that will be sent to the DB
  const onFilesChange = (files) => {
    if (files[0]) {
      setForm({
        ...form,
        main_preview: files[0].preview.url,
        main_img: files[0],
        loaded: 100,
        file_error: '',
      });
    }
  };

  const onFilesAttachment = (files) => {
    if (files[0]) {
      setForm({
        ...form,
        attachment_preview: files[0].preview.url,
        attachment_img: files[0],
        load_att: 100,
        file_att_error: '',
      });
    }
  };

  const productImages = (param) => {
    console.log(param);
    if (param.length > 0) {
      let files = [];
      Array.from(param).forEach((file) => {
        files.push(file);
      });
      let fileObj = [];
      let fileArray_preview = [];
      fileObj.push(files);

      for (let i = 0; i < fileObj[0].length; i++) {
        fileArray_preview.push(URL.createObjectURL(fileObj[0][i]));
      }

      setForm({
        ...form,
        fileArray_preview: fileArray_preview,
        fileArray_images: param,
        load_product: 100,
        product_error: '',
      });
    }
  };

  const onSelect = (selectedList, selectedItem) => {
    console.log(selectedList);
    let list = [];
    selectedList.map((value) => {
      list.push(value.id);
      list.push(value.city_id);
    });
    //remove any undefined values from array
    list = list.filter((elem) => elem !== undefined);
    //makes sure we don't have duplicate values
    let unique = [...new Set(list)];
    setCitiesList(unique);
  };

  const onRemove = (selectedList, removedItem) => {
    let list = [];
    selectedList.map((city) => {
      list.push(city.id);
      list.push(city.city_id);
    });
    list = list.filter((elem) => elem !== undefined);
    let unique = [...new Set(list)];
    setCitiesList(unique);
  };

  const selectUnit = (e) => {
    setForm({ ...form, unit: e.target.value });
  };

  const handleDate = (e) => {
    setForm({ ...form, expires: e._d });
  };

  const valid = (current) => {
    let yesterday = moment();
    if (current) {
      return current.isAfter(yesterday);
    }
  };

  const submitMaterialRequest = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('categoryId', selectedCategory);
    data.set('quantity', volume);
    data.set('description', description);
    data.set('unit', unit);
    data.set('city', citiesList);
    data.set('pincode', '');
    data.set('state', state);
    data.set('extra', extra);
    data.set('post_expiry_date', moment(expires));

    {
      !featured_image
        ? data.append('featured_image', main_img)
        : data.append('featured_image', featured_image);
    }
    {
      !featured_attachment
        ? data.append('attachment', attachment_img)
        : data.append('attachment', featured_attachment);
    }
    {
      if (!fileArray_images.length && slider) {
        for (const key of Object.keys(slider)) {
          data.append('slider_image[]', slider[key]);
        }
        if (!fileArray_images.length && !slider.length) {
          data.append('slider_image[]', []);
        }
      } else
        for (const key of Object.keys(fileArray_images)) {
          data.append('slider_image[]', fileArray_images[key]);
        }
    }

    if (workOrMat === null) {
      setForm({ ...form, workOrMat: 0 });
    }

    if (!file_error && !file_att_error && !product_error) {
      await postDataWithToken(
        `${url}/api/material-request/update/${id}`,
        data,
        token
      )
        .then((res) => {
          setSuccess(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const submitMaterialOffer = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('categoryId', selectedCategory);
    data.set('quantity', volume);
    data.set('description', description);
    data.set('unit', unit);
    data.set('city', citiesList);
    data.set('pincode', '');
    data.set('state', state);
    data.set('extra', extra);
    data.set('post_expiry_date', moment(expires));
    data.set('cost_per_unit', costUnit);
    data.set('warranty', warranty);
    data.set('delivery_type', delivery);
    data.set('tender_delivery_type_cost', []);
    {
      !featured_image
        ? data.append('featured_image', main_img)
        : data.append('featured_image', featured_image);
    }
    {
      !featured_attachment
        ? data.append('attachment', attachment_img)
        : data.append('attachment', featured_attachment);
    }
    {
      if (!fileArray_images.length && slider) {
        for (const key of Object.keys(slider)) {
          data.append('slider_image[]', slider[key]);
        }
        if (!fileArray_images.length && !slider.length) {
          data.append('slider_image[]', []);
        }
      } else
        for (const key of Object.keys(fileArray_images)) {
          data.append('slider_image[]', fileArray_images[key]);
        }
    }

    if (workOrMat === null) {
      setForm({ ...form, workOrMat: 0 });
    }

    if (!file_error && !file_att_error && !product_error) {
      await postDataWithToken(
        `${url}/api/material-offer/update/${id}`,
        data,
        token
      )
        .then((res) => {
          setSuccess(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const submitWork = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('categoryId', selectedCategory);
    data.set('budget', budget);
    data.set('description', description);
    data.set('available_from', moment(start));
    data.set('available_to', moment(end));
    data.set('rate', rate);
    data.set('city', citiesList);
    data.set('pincode', '');
    data.set('state', state);
    data.set('extra', extra);
    data.set('post_expiry_date', moment(expires));

    {
      !featured_image
        ? data.append('featured_image', main_img)
        : data.append('featured_image', featured_image);
    }
    {
      !featured_attachment
        ? data.append('attachment', attachment_img)
        : data.append('attachment', featured_attachment);
    }
    {
      if (!fileArray_images.length && slider) {
        for (const key of Object.keys(slider)) {
          data.append('slider_image[]', slider[key]);
        }
        if (!fileArray_images.length && !slider.length) {
          data.append('slider_image[]', []);
        }
      } else
        for (const key of Object.keys(fileArray_images)) {
          data.append('slider_image[]', fileArray_images[key]);
        }
    }

    if (workOrMat === null) {
      setForm({ ...form, workOrMat: 0 });
    }

    if (!file_error && !file_att_error && !product_error) {
      const isOfferOrRequest = requestOrOffer === 'Offer' ? 'offer' : 'request';
      await postDataWithToken(
        `${url}/api/work-${isOfferOrRequest}/update/${id}`,
        data,
        token
      )
        .then((res) => {
          setSuccess(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getValue = () => {
    //for some reason sometimes workOrMat can be null
    if (workOrMat === null) {
      setForm({ ...form, workOrMat: 0 });
    } //if type material and if initial value of workOrMat is 0
    if (type === 'Material' && workOrMat === 0 && !checked) {
      setExtra(2);
      setChecked(true);
    }
    if (type === 'Material' && workOrMat === 0 && checked) {
      setExtra(0);
      setChecked(false);
    }
    //if type material and if initial value of workOrMat is 2
    if (type === 'Material' && workOrMat === 2 && !checked) {
      setExtra(2);
      setChecked(true);
    }
    if (type === 'Material' && workOrMat === 2 && checked) {
      setExtra(0);
      setChecked(false);
    }
    if (type === 'Work' && workOrMat === 0 && !checked) {
      setExtra(1);
      setChecked(true);
    }
    if (type === 'Work' && workOrMat === 0 && checked) {
      setExtra(0);
      setChecked(false);
    }
    if (type === 'Work' && workOrMat === 1 && !checked) {
      setExtra(1);
      setChecked(true);
    }
    if (type === 'Work' && workOrMat === 1 && checked) {
      setExtra(0);
      setChecked(false);
    }
  };
  console.log(details, cannotEdit);
  return (
    <>
      {/* <Header /> */}
      <div className='sidebar-toggle'></div>
      <nav aria-label='breadcrumb'>
        <ol className='breadcrumb'>
          <Link
            to='/feeds'
            className='breadcrumb-item active'
            aria-current='page'
          >
            {t('header.marketplace')}
          </Link>
          <li className='breadcrumb-item active' aria-current='page'>
            {t('marketplace.feeds.list_details.Edit')}
          </li>
        </ol>
      </nav>
      <div className='main-content'>
        <Sidebar dataFromParent={location.pathname} />
        <div className='page-content'>
          {cannotEdit && (
            <Alert variant='danger'>
              <p className='cannot-bid'>
                {' '}
                {t('marketplace.material.edit_material_list.offer.editListing')}
              </p>
            </Alert>
          )}
          {success ? (
            <SweetAlert
              success
              closeOnClickOutside
              title={t('login.SuccessPopup')}
              onConfirm={() =>
                type === 'Material'
                  ? history.push('/material-list')
                  : history.push('/work-list')
              }
            />
          ) : (
            ''
          )}
          <h2>{t('b_sidebar.proposal.listing1')}</h2>
          <div className='editMaterials'>
            <form
              onSubmit={
                type === 'Material'
                  ? requestOrOffer === 'Offer'
                    ? submitMaterialOffer
                    : submitMaterialRequest
                  : type === 'Work'
                  ? submitWork
                  : null
              }
              className='editMaterials-form'
            >
              <section className='editMaterials-left'>
                <label className='editMaterials-label'>
                  {t(
                    'marketplace.material.edit_material_list.request.input_title'
                  )}
                  <input
                    type='text'
                    name='title'
                    value={title}
                    onChange={handleChange}
                  />
                </label>
                <label className='editMaterials-label'>
                  {t(
                    'marketplace.material.edit_material_list.request.category'
                  )}
                  <select
                    onChange={(e) =>
                      setForm({ ...form, selectedCategory: e.target.value })
                    }
                  >
                    <option value={details && details.tender_category_id}>
                      {category1}
                    </option>
                    {category &&
                      category.map((categ) => {
                        return (
                          <option
                            key={categ.category_id}
                            value={categ.category_id}
                          >
                            {categ.category_name}
                          </option>
                        );
                      })}
                  </select>
                </label>
                {type === 'Material' ? (
                  <div className='editMaterials-volume edit-make-column'>
                    {requestOrOffer === 'Offer' ? (
                      <label className='editMaterials-label edit-cost'>
                        {t(
                          'marketplace.material.edit_material_list.offer.cost_unit'
                        )}
                        <input
                          type='number'
                          onChange={(e) =>
                            setOffer({ ...offer, costUnit: e.target.value })
                          }
                          value={costUnit}
                        />
                      </label>
                    ) : (
                      ''
                    )}

                    <label className='editMaterials-label edit-cost-volume'>
                      {t('marketplace.all_list_details.volume_need')}
                      <input
                        type='number'
                        value={volume}
                        name='volume'
                        onChange={handleChange}
                      />
                    </label>
                    <label className='editMaterials-label'>
                      {t(
                        'marketplace.material.edit_material_list.request.unit'
                      )}
                      <select name='' id='' onChange={selectUnit}>
                        <option value={unit}>{unit}</option>
                        <option value='Kg'>Kg</option>
                        <option value='M2'>M2</option>
                        <option value='Liter'>Liter</option>
                        <option value='Pcs'>Pcs</option>
                      </select>
                    </label>
                  </div>
                ) : (
                  <div className='editMaterials-volume'>
                    <label className='editMaterials-label edit-cost-volume'>
                      {t('marketplace.work.edit_work_list.budget')}
                      <select
                        onChange={(e) =>
                          setWork({ ...work, budget: e.target.value })
                        }
                      >
                        <option value={budget}>{budget}</option>
                        <option value='Fixed'>Fixed</option>
                        <option value='Hourly'>Hourly</option>
                        <option value='cost/m2'>cost/m2</option>
                      </select>
                    </label>
                    <label htmlFor='' className='editMaterials-label'>
                      {t('marketplace.work.edit_work_list.rate')}
                      <input
                        type='number'
                        value={rate}
                        onChange={(e) =>
                          setWork({ ...work, rate: e.target.value })
                        }
                      />
                    </label>
                  </div>
                )}

                {type === 'Material' && requestOrOffer === 'Offer' ? (
                  <label className='editMaterials-label'>
                    {t(
                      'marketplace.material.edit_material_list.offer.delivery_type'
                    )}
                    <select
                      name=''
                      id=''
                      onChange={(e) =>
                        setOffer({ ...offer, delivery: e.target.value })
                      }
                    >
                      <option selected disabled>
                        {delivery === 'Included'
                          ? t(
                              'marketplace.material.edit_material_list.offer.Included'
                            )
                          : t(
                              'marketplace.material.edit_material_list.offer.Not_included'
                            )}
                      </option>
                      <option
                        value={t(
                          'marketplace.material.edit_material_list.offer.Included'
                        )}
                      >
                        {t(
                          'marketplace.material.edit_material_list.offer.Included'
                        )}
                      </option>
                      <option
                        value={t(
                          'marketplace.material.edit_material_list.offer.Not_included'
                        )}
                      >
                        {t(
                          'marketplace.material.edit_material_list.offer.Not_included'
                        )}
                      </option>
                    </select>
                  </label>
                ) : (
                  ''
                )}
                {type === 'Material' && requestOrOffer === 'Offer' ? (
                  <label className='editMaterials-label'>
                    {t(
                      'marketplace.material.edit_material_list.offer.warranty'
                    )}
                    <input
                      type='number'
                      value={warranty}
                      onChange={(e) =>
                        setOffer({ ...offer, warranty: e.target.value })
                      }
                    />
                  </label>
                ) : (
                  ''
                )}
                {type === 'Work' ? (
                  <div className='editMaterials-volume edit-make-column'>
                    <label className='editMaterials-label '>
                      {requestOrOffer === 'Offer'
                        ? 'Availability'
                        : 'Work start'}

                      <Datetime
                        onChange={(e) => setWork({ ...work, start: e._d })}
                        isValidDate={valid}
                        value={start}
                        dateFormat='DD-MM-YYYY'
                        timeFormat={false}
                        locale={`${
                          localStorage.getItem('_lng') === 'fi'
                            ? 'fr-fi'
                            : 'en-US'
                        } `}
                      />
                    </label>
                    <label className='editMaterials-label'>
                      {requestOrOffer === 'Offer' ? 'End' : 'Work end'}

                      <Datetime
                        onChange={(e) => setWork({ ...work, end: e._d })}
                        isValidDate={valid}
                        value={end}
                        dateFormat='DD-MM-YYYY'
                        timeFormat={false}
                        locale={`${
                          localStorage.getItem('_lng') === 'fi'
                            ? 'fr-fi'
                            : 'en-US'
                        } `}
                      />
                    </label>
                  </div>
                ) : (
                  ''
                )}

                <label className='editMaterials-label'>
                  {t('marketplace.feeds.state')}
                  <select
                    name=''
                    id=''
                    onChange={(e) =>
                      setForm({ ...form, state: e.target.value })
                    }
                  >
                    <option value={state}>{filteredState}</option>
                    {states &&
                      states.map((stat) => {
                        return (
                          <option key={stat.state_id} value={stat.state_id}>
                            {stat.state_name}
                          </option>
                        );
                      })}
                  </select>
                </label>
                <span
                  style={{
                    color: '#000',
                    fontSize: '1.4rem',
                    fontWeight: '500',
                  }}
                >
                  {t('marketplace.material.edit_material_list.request.city')}
                </span>
                <Multiselect
                  selectedValues={selectedValue}
                  options={city}
                  displayValue='city_identifier'
                  onRemove={onRemove}
                  onSelect={onSelect}
                  emptyRecordMsg={t(
                    'marketplace.material.edit_material_list.offer.No_Options_Available'
                  )}
                  placeholder={t(
                    'marketplace.material.edit_material_list.request.Select'
                  )}
                />

                <label className='editMaterials-label'>
                  {t(
                    'marketplace.material.edit_material_list.request.post_expires_in'
                  )}
                  <Datetime
                    onChange={(e) => handleDate(e)}
                    isValidDate={valid}
                    value={expires}
                    dateFormat='DD-MM-YYYY'
                    timeFormat={false}
                    locale={`${
                      localStorage.getItem('_lng') === 'fi' ? 'fr-fi' : 'en-US'
                    } `}
                  />
                </label>
                <label className='editMaterials-check'>
                  <input
                    type='checkbox'
                    checked={checked}
                    onChange={() => getValue()}
                  />
                  {type === 'Material'
                    ? t('my_bid.work')
                    : t('my_bid.material')}

                  <span style={{ marginLeft: '5px' }}>
                    {t(
                      'marketplace.material.edit_material_list.offer.Included'
                    )}
                  </span>
                </label>
                <button className='btn-success edit-save' type='submit'>
                  {t('create_report.save')}
                </button>
              </section>
              <section className='editMaterials-right'>
                <label className='editMaterials-label'>
                  {t(
                    'marketplace.material.edit_material_list.request.description'
                  )}
                  <textarea
                    id=''
                    cols='30'
                    rows='10'
                    value={description}
                    name='description'
                    onChange={handleChange}
                  ></textarea>
                </label>
                <div className='edit-form-group'>
                  <div className='form-group'>
                    <label htmlFor='main'>
                      {t(
                        'marketplace.material.edit_material_list.request.main'
                      )}
                    </label>

                    <Files
                      className='edit-files-dropzone'
                      onChange={onFilesChange}
                      onError={(e) =>
                        setForm({
                          ...form,
                          file_error: e.message + ': limit 10MB',
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
                      <label htmlFor='main'>
                        <img
                          src={
                            main_preview !== null
                              ? main_preview
                              : url +
                                '/images/marketplace/material/' +
                                featured_image
                          }
                        />
                        <span className='status'>
                          {t(
                            'marketplace.material.edit_material_list.request.Upload_status'
                          )}
                        </span>
                        <ProgressBar now={loaded} />
                      </label>
                    </Files>
                    {file_error ? (
                      <p style={{ color: 'red', fontSize: '1.2rem' }}>
                        {file_error}
                      </p>
                    ) : (
                      ''
                    )}

                    {main_preview || featured_image ? (
                      <button
                        style={{ marginTop: '10px' }}
                        onClick={(e) => removeImg(e)}
                        className='btn btn-danger'
                      >
                        {t(
                          'marketplace.material.edit_material_list.request.Remove'
                        )}
                      </button>
                    ) : (
                      ''
                    )}
                    <small className='form-text text-muted'>
                      {t('marketplace.material.edit_material_list.request.ext')}
                    </small>
                  </div>
                  <div className='form-group'>
                    <label htmlFor='attachment'>
                      {t(
                        'marketplace.material.edit_material_list.request.attachment'
                      )}
                    </label>
                    <Files
                      className='edit-files-dropzone'
                      onChange={onFilesAttachment}
                      onError={(e) =>
                        setForm({
                          ...form,
                          file_att_error: e.message + ': limit 10MB',
                        })
                      }
                      accepts={[
                        'image/gif',
                        'image/jpeg',
                        'image/png',
                        '.pdf',
                        '.doc',
                        '.docx',
                      ]}
                      multiple={false}
                      maxFileSize={10000000}
                      minFileSize={10}
                      clickable
                    >
                      {' '}
                      <label htmlFor='attachment'>
                        <img
                          src={
                            attachment_preview !== null
                              ? attachment_preview
                              : url +
                                '/images/marketplace/material/' +
                                featured_attachment
                          }
                        />

                        <span className='status'>
                          {' '}
                          {t(
                            'marketplace.material.edit_material_list.request.Upload_status'
                          )}{' '}
                        </span>
                        <ProgressBar now={load_att} />
                      </label>
                      {attachment_text ? (
                        <label htmlFor='attachments'>
                          <a
                            href={
                              url +
                              '/images/marketplace/material/' +
                              attachment_text
                            }
                            target='_blank'
                            className='attachment'
                          >
                            <i className='icon-paperclip'></i>
                            {attachment_text}
                          </a>
                        </label>
                      ) : (
                        ''
                      )}
                      {file_att_error ? (
                        <p style={{ color: 'red', fontSize: '1.2rem' }}>
                          {file_att_error}
                        </p>
                      ) : (
                        ''
                      )}
                    </Files>
                    {attachment_preview || featured_attachment ? (
                      <button
                        style={{ marginTop: '10px' }}
                        onClick={(e) => removeImgAtt(e)}
                        className='btn btn-danger'
                      >
                        {t(
                          'marketplace.material.edit_material_list.request.Remove'
                        )}
                      </button>
                    ) : (
                      ''
                    )}
                    <small className='form-text text-muted'>
                      {t(
                        'marketplace.material.edit_material_list.request.attachment_text'
                      )}
                    </small>
                  </div>
                  <div className='form-group'>
                    <label>
                      {t(
                        'marketplace.material.edit_material_list.request.product_images'
                      )}
                    </label>
                    <Files
                      className='edit-files-dropzone'
                      onChange={(e) => productImages(e)}
                      onError={(e) =>
                        setForm({
                          ...pictures,
                          product_error: e.message + ': limit 10MB',
                        })
                      }
                      accepts={[
                        'image/gif',
                        'image/jpeg',
                        'image/png',
                        'image/jpg',
                        '.svg',
                      ]}
                      multiple
                      dragActiveClassName={'files-dropzone-active'}
                      maxFileSize={10000000}
                      clickable
                    >
                      <label htmlFor='file1'>
                        {fileArray_preview && fileArray_preview.length <= 0
                          ? slider &&
                            slider.map((img, i) => {
                              if (img !== ',' && img !== '') {
                                return (
                                  <img
                                    key={i}
                                    src={
                                      url +
                                      '/images/marketplace/material/' +
                                      img
                                    }
                                  />
                                );
                              }
                            })
                          : fileArray_preview.map((url, i) => (
                              <div key={i}>
                                <img
                                  style={{
                                    height: '100px',
                                  }}
                                  src={
                                    fileArray_preview.length <= 0 ? File : url
                                  }
                                  alt='...'
                                />
                              </div>
                            ))}
                        <span className='status'>
                          {' '}
                          {t(
                            'marketplace.material.edit_material_list.request.Upload'
                          )}{' '}
                        </span>
                        <ProgressBar now={load_product} />
                      </label>
                      {product_error ? (
                        <p style={{ color: 'red', fontSize: '1.2rem' }}>
                          {product_error}
                        </p>
                      ) : (
                        ''
                      )}
                    </Files>
                    {fileArray_preview?.length || slider?.length ? (
                      <button
                        style={{ marginTop: '10px' }}
                        onClick={(e) => removeProductImg(e)}
                        className='btn btn-danger'
                      >
                        {t(
                          'marketplace.material.edit_material_list.request.Remove'
                        )}
                      </button>
                    ) : (
                      ''
                    )}

                    <small className='form-text text-muted'>
                      {t(
                        'marketplace.material.edit_material_list.request.attachment_text'
                      )}
                    </small>
                  </div>
                </div>
              </section>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default withTranslation()(EditListing);
