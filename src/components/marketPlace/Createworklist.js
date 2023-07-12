import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../shared/Header';
import Sidebar from '../shared/Sidebar';
import File from '../../images/file-icon.png';
import { Helper, url } from '../../helper/helper';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Datetime from 'react-datetime';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import { Prompt } from 'react-router';
import SweetAlert from 'react-bootstrap-sweetalert';
import 'react-datetime/css/react-datetime.css';
// import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
// import Select from "react-select";
import { Multiselect } from 'multiselect-react-dropdown';
import Files from 'react-files';
import PDFView from './models/material_model';
import 'moment/locale/fi';
import Breadcrumb from '../shared/Breadcrumb';
import { getData, postDataWithToken } from '../../helper/api';

const arr = [];
const allcity = [];
const lest = [];
const lest1 = [];

const rx_live = /^[+-]?\d*(?:[.,]\d*)?$/;

class Createworklist extends Component {
  fileObj = [];
  fileArray = [];
  files = [];

  fileObj1 = [];
  fileArray1 = [];
  files1 = [];

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit1 = this.handleSubmit1.bind(this);
    this.loadCategory = this.loadCategory.bind(this);
    this.loadState = this.loadState.bind(this);
    //this.loadState1 = this.loadState1.bind(this);
    this.loadConfig = this.loadConfig.bind(this);

    this.state = {
      main_img_validation: false,
      title: '',
      title_err: false,
      title1: '',
      title_err1: false,
      categoryId: '',
      categoryId_err: false,
      categoryId1: '',
      categoryId_err1: false,
      productcat: [],
      cities: [],
      cities1: [],
      states: [],
      states1: [],
      budget: '',
      budget_err: false,
      budget1: '',
      budget_err1: false,
      rate: '',
      rate_err: false,
      rate1: '',
      rate_err1: false,
      available_from: '',
      available_from_format: '',
      available_to: '',
      available_to_format: '',
      available_from_err: false,
      available_to_err: false,
      available_from1_format: '',
      available_to1: '',
      available_to1_format: '',
      available_from_err1: false,
      available_to_err1: false,
      isPerviewModal: false,
      // city: [],
      selectedValue: [],
      options: [
        { name: 'Srigar', id: 1 },
        { name: 'Sam', id: 2 },
      ],
      state: '',
      city_err: false,
      //city1: [],
      state: '',
      state1: '',
      city_err: false,
      state_err1: false,
      pincode: '',
      pincode_err: false,
      pincode1: '',
      pincode_err1: false,
      post_expiry_date: '',
      // moment().add(1, 'days').format('DD-MM-YYYY HH:mm:ss')
      post_expiry_date1: '',
      // moment().add(1, 'days').format('DD-MM-YYYY HH:mm:ss')
      upd_post_expiry_date: '',
      post_expiry_date_err: false,
      upd_post_expiry_date1: '',
      post_expiry_date_err1: false,
      description: '',
      description_err: false,
      description1: '',
      description_err1: false,
      featured_image: null,
      attachment: null,
      slider_image: [],
      featured_image1: null,
      attachment1: null,
      slider_image1: [],
      featured_image_err: false,
      attachment_err: false,
      attachment_img: null,
      slider_image_err: false,
      featured_image_err1: false,
      attachment_err1: false,
      slider_image_err1: false,
      checked: false,
      mat_checked: 0,
      attachment_preview: null,
      attachment_preview1: null,
      attachment_P: null,
      slider_image_preview: [null],
      slider_image_preview1: [null],
      errors: [],
      show_errors: false,
      show_msg: false,
      loading: false,
      loaded: 0,
      loaded1: 0,
      loaded2: 0,
      loaded3: 0,
      loaded4: 0,
      loaded7: 0,
      configs: [],
      datepicker_date_format: '',
      datepicker_time_format: '',
      redirect_page: false,
      tender_type: 'Request',
      success: false,
      request_m: '',
      request_w: '',
      tender_types: '',
      Login_user_permissions: localStorage.getItem('Login_user_permissions')
        ? localStorage.getItem('Login_user_permissions')
        : [],
    };
    this.myRef = React.createRef();
  }

  componentDidMount = () => {
    if (this.props.match.params.id) {
      this.loadData();
    }
    this.loadCategory();
    this.loadState();
    //this.loadState1();
    this.loadConfig();
    this.interval = setInterval(() => {
      this.checkallfields();
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate = (prevProps, prevState) => {
    console.log(prevState.tender_type, this.state.tender_type);
  };
  loadData = async () => {
    const token = await localStorage.getItem('token');
    await getData(
      `${url}/api/material-offer-detail/${this.props.match.params.id}`,
      token
    )
      .then((result) => {
        console.log(result);
        const { data } = result;

        if (data[0].tender_type === 'Request') {
          this.setState({
            title: data[0].tender_title,
            categoryId: data[0].tender_category_id,
            quantity: data[0].tender_quantity,
            budget: data[0].tender_budget,
            rate: data[0].tender_rate,
            available_from: data[0].tender_available_from,
            available_to: data[0].tender_available_to,
            description: data[0].tender_description,
            unit: data[0].tender_unit,
            city: data[0].tender_city_id,
            state: data[0].city_state_id,
            pincode: data[0].tender_pincode,
            mat_checked: data[0].extra, // extra
            post_expiry_date: moment(data[0].tender_expiry_date).format(
              'DD-MM-YYYY HH:mm:ss'
            ),
            upd_post_expiry_date: data[0].tender_expiry_date,
            featured_image: data[0].tender_featured_image,
            attachment: data[0].tender_attachment,
            attachment_preview: data[0].tender_featured_image,
            attachment_P: data[0].tender_attachment,
            tender_type: data[0].tender_type,
          });
          this.setState(
            {
              slider_image: data[0].tender_slider_images,
            },
            () => {
              const vals =
                url +
                '/images/marketplace/material/' +
                Object.values(this.state.slider_image);
              this.fileArray = [vals];
            }
          );

          this.ChangeCityByStateID(this.state.state);
        }
        if (data[0].tender_type === 'Offer') {
          this.setState({
            title1: data[0].tender_title,
            categoryId1: data[0].tender_category_id,
            quantity1: data[0].tender_quantity,
            budget1: data[0].tender_budget,
            available_from1: data[0].tender_available_from,
            available_to1: data[0].tender_available_to,
            description1: data[0].tender_description,
            unit1: data[0].tender_unit,
            city: data[0].tender_city_id,
            state: data[0].city_state_id,
            cost_per_unit1: data[0].tender_cost_per_unit,
            pincode1: data[0].tender_pincode,
            row_phase: data[0].tender_delivery_type_cost,
            mat_checked: data[0].extra,
            post_expiry_date1: moment(data[0].tender_expiry_date).format(
              'DD-MM-YYYY HH:mm:ss'
            ),
            upd_post_expiry_date1: data[0].tender_expiry_date,

            featured_image1: data[0].tender_featured_image,
            attachment_P: data[0].tender_attachment,

            attachment_preview1: data[0].tender_featured_image,
            warranty1: data[0].tender_warranty,
            attachment1: data[0].tender_attachment,
            tender_type: data[0].tender_type,
          });
          this.setState(
            {
              slider_image1: data[0].tender_slider_images,
            },
            () => {
              const vals =
                url +
                '/images/marketplace/material/' +
                Object.values(this.state.slider_image1);
              this.fileArray1 = [vals];
            }
          );
          this.ChangeCityByStateID(this.state.state);
        }
      })
      .catch((err) => {
        // //console.log(err);
      });
  };

  ChangeCityByStateID = async (state) => {
    this.setState({ cities: [] });
    const token = localStorage.getItem('token');
    let lang = localStorage.getItem('_lng');
    await getData(`${url}/api/cityId/${state}/${lang}`, token)
      .then((result) => {
        this.setState({ cities: result.data.data });
      })
      .catch((err) => {
        // //console.log(err.response);
      });
  };

  loadState = async () => {
    const token = await localStorage.getItem('token');
    let lang = await localStorage.getItem('_lng');
    await getData(`${url}/api/state_new/${lang}`, token)
      .then((result) => {
        this.setState({ states: result?.data.data });
      })
      .catch((err) => {
        // //console.log(err.response);
      });
  };
  // loadState1 = async () => {
  //   const token = await localStorage.getItem('token');
  //   let lang = await localStorage.getItem('_lng');
  //   await getData(`${url}/api/state_new/${lang}`, token)
  //     .then((result) => {
  //       this.setState({ states1: result?.data.data });
  //     })
  //     .catch((err) => {
  //       // //console.log(err.response);
  //     });
  // };

  loadConfig = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/config`, token)
      .then((result) => {
        this.setState({ configs: result.data.data });
        if (this.state.configs) {
          this.state.configs.map((config) => {
            if (config.configuration_name == 'datepicker_date_format') {
              this.setState({
                datepicker_date_format: config.configuration_val,
              });
            }
            if (config.configuration_name == 'datepicker_time_format') {
              this.setState({
                datepicker_time_format: config.configuration_val,
              });
            }
          });
        }
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  loadCategory = async () => {
    const token = await localStorage.getItem('token');
    let lang = localStorage.getItem('_lng');
    await getData(`${url}/api/category/${lang}`, token)
      .then((result) => {
        // //console.log(result.data.data);
        this.setState({ productcat: result.data.data });
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  loadCities = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/city`, token)
      .then((result) => {
        // //console.log("=============result.data.data============", result.data.data);
        this.setState({ cities: result.data.data });
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  removeImg3 = (event) => {
    event.preventDefault();
    this.fileArray = [];
    this.files = [];
    this.setState({ slider_image: [], loaded2: 0, request_m: '' });
  };

  handleState = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleChange1 = (event) => {
    this.setState({ title: event.target.value });
  };
  handleChange2 = (event) => {
    this.setState({ categoryId: event.target.value });
  };
  handleChange_2 = (event) => {
    this.setState({ categoryId1: event.target.value });
  };
  handleChange3 = (event) => {
    // if (event.target.value) {
    this.setState({ budget: event.target.value });
    // }
  };
  handleChange4 = (event) => {
    if (rx_live.test(event.target.value))
      this.setState({ rate: event.target.value });
  };
  handleChangeRate = (event) => {
    if (rx_live.test(event.target.value))
      this.setState({ rate1: event.target.value });
  };
  handleChange5 = (event) => {
    this.setState({ available_to: '' });
    this.setState({
      available_from: moment(event._d).format('YYYY-MM-DD'),
      available_from_format: moment(event._d).format('DD-MM-YYYY'),
    });
  };
  handleChange_5 = (event) => {
    this.setState({ available_to1: '' });
    this.setState({
      available_from1: moment(event._d).format('YYYY-MM-DD'),
      available_from1_format: moment(event._d).format('DD-MM-YYYY'),
    });
  };
  handleChange6 = (event) => {
    this.setState({
      available_to: moment(event._d).format('YYYY-MM-DD'),
      available_to_format: moment(event._d).format('DD-MM-YYYY'),
    });
  };
  handleChange_6 = (event) => {
    this.setState({
      available_to1: moment(event._d).format('YYYY-MM-DD'),
      available_to1_format: moment(event._d).format('DD-MM-YYYY'),
    });
  };
  handleChange7 = (event) => {
    this.setState({ city: event.target.value });
  };
  // handleChange_7 = (event) => {
  //   this.setState({ city1: event.target.value });
  // };
  ChangeCity = async (event) => {
    this.setState({ cities: [], state: event.target.value });
    const token = localStorage.getItem('token');
    let lang = localStorage.getItem('_lng');
    await getData(`${url}/api/cityId/${event.target.value}/${lang}`, token)
      // .then(result => result.json())
      .then((result) => {
        const d = result.data.data.filter((x) => x.city_id);
        // //console.log("result.data.data", d)
        if (d) {
          this.setState({ cities: d });
        }
        allcity.push(d);
      })
      .catch((err) => {
        //console.log(err.response);
      });
  };
  // ChangeCity1 = async (event) => {
  //   this.setState({ cities1: [], state1: event.target.value });
  //   const token = localStorage.getItem('token');
  //   let lang = localStorage.getItem('_lng');
  //   await getData(`${url}/api/cityId/${event.target.value}/${lang}`, token)
  //     .then((result) => {
  //       const d = result?.data.data?.filter((x) => x.city_id);
  //       // //console.log("result.data.data", d)
  //       if (d) {
  //         this.setState({ cities1: d });
  //       }

  //       // this.setState({ cities1: result.data.data });
  //     })
  //     .catch((err) => {
  //       //console.log(err.response);
  //     });
  // };
  handleChange8 = (event) => {
    this.setState({ pincode: event.target.value });
  };
  handleChange9 = (event) => {
    this.setState({
      post_expiry_date: event._d,
      upd_post_expiry_date: event._d,
    });
  };
  handleChange_9 = (event) => {
    this.setState({
      post_expiry_date1: event._d,
      upd_post_expiry_date: event._d,
    });
  };
  handleChange10 = (event) => {
    this.setState({ description: event.target.value });
  };

  removeImg_0 = () => {
    this.setState({
      attachment_preview: null,
      featured_image: [],
      loaded: 0,
      file_err_attachment_preview: '',
      img_name_attachment: '',
    });
  };

  onFilesChange = (files) => {
    console.log(URL.createObjectURL(files[0]));
    if (files[0]) {
      this.setState({
        featured_image: files[0],
        loaded: 50,
        featured_image_err: false,
        attachment_preview: URL.createObjectURL(files[0]),

        file_err_attachment_preview: '',
        img_name_attachment: files[0].name,
        main_img_validation: false,
      });
      if (this.state.loaded <= 100) {
        setTimeout(
          function () {
            this.setState({ loaded: 100 });
          }.bind(this),
          2000
        ); // wait 2 seconds, then reset to false
      }
    }
  };

  onFilesError = (error, file) => {
    // //console.log(file, 'error code ' + error.code + ': ' + error.message)
    this.setState({
      file_err_attachment_preview: error.message,
    });
  };

  removeImg_1 = () => {
    this.setState({
      attachment_img: null,
      featured_image1: null,
      loaded1: 0,
      file_err_attachment_img: '',
    });
  };
  removeImg_3 = () => {
    this.setState({
      attachment_preview1: null,
      featured_image1: null,
      loaded3: 0,
      file_err_attachment_preview1: '',
    });
  };

  onFilesChange5 = (files) => {
    if (files[0]) {
      this.setState({
        featured_image1: files[0],
        loaded3: 50,
        featured_image_err1: false,
        attachment_preview1: URL.createObjectURL(files[0]),
        file_err_attachment_preview1: '',
        main_img_validation: false,
      });
      if (this.state.loaded3 <= 100) {
        setTimeout(
          function () {
            this.setState({ loaded3: 100 });
          }.bind(this),
          2000
        ); // wait 2 seconds, then reset to false
      }
    }
  };

  onFilesError5 = (error, file) => {
    this.setState({
      file_err_attachment_preview1: error.message,
      // loaded3: 0,
    });
  };

  removeImg_2 = () => {
    this.setState({
      attachment_img: null,
      attachment: null,
      loaded1: 0,
    });
  };

  onFilesChange1 = (files) => {
    if (files[0]) {
      this.setState({
        attachment: files[0],
        loaded1: 50,
        attachment_err: false,
        attachment_img: URL.createObjectURL(files[0]),
        file_err_attachment_img: '',
        img_name_attachment_img: files[0].name,
      });
      if (this.state.loaded1 <= 100) {
        setTimeout(
          function () {
            this.setState({ loaded1: 100 });
          }.bind(this),
          2000
        ); // wait 2 seconds, then reset to false
      }
    }
  };

  onFilesError1 = (error, file) => {
    this.setState({
      file_err_attachment_img: error.message,
    });
  };

  removeImg_4 = () => {
    this.setState({
      loaded4: 0,
      attachment1: null,
      file_err_attachment_img1: '',
    });
  };

  onFilesChange6 = (files) => {
    if (files[0]) {
      console.log('files[0]', files[0]);
      console.log(URL.createObjectURL(files[0]));
      this.setState({
        attachment1: files[0],
        loaded4: 50,
        attachment_err1: false,
        // attachment1: URL.createObjectURL(files[0]),
        file_err_attachment_img1: '',
      });
      if (this.state.loaded4 <= 100) {
        setTimeout(
          function () {
            this.setState({ loaded4: 100 });
          }.bind(this),
          2000
        ); // wait 2 seconds, then reset to false
      }
    }
  };

  onFilesError6 = (error, file) => {
    this.setState({
      file_err_attachment_img1: error.message,
    });
  };

  onFilesChange3 = (files) => {
    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        this.files.push(file);
      });
      this.fileObj = [];
      this.fileArray = [];
      this.fileObj.push(this.files);
      for (let i = 0; i < this.fileObj[0].length; i++) {
        this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]));
        console.log(this.files);
      }
      this.setState({
        slider_image: this.files,
        loaded2: 50,
        slider_image_err: false,
        slider_image_preview: files,
        request_m: '',
      });
      if (this.state.loaded2 <= 100) {
        setTimeout(
          function () {
            this.setState({ loaded2: 100 });
          }.bind(this),
          2000
        ); // wait 2 seconds, then reset to false
      }
    }
  };

  onFilesError3 = (error, file) => {
    this.setState({
      request_m: error.message,
    });
    // //console.log('error code ' + error.code + ': ' + error.message)
  };

  removeImg7 = (event) => {
    event.preventDefault();
    this.fileArray1 = [];
    this.files1 = [];
    this.setState({
      slider_image1: [],
      loaded7: 0,
      slider_image_preview1: [],
      request_w: '',
    });
  };

  onFilesChange7 = (files) => {
    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        this.files1.push(file);
      });
      // this.files.push(files[0])
      this.fileObj1 = [];
      this.fileArray1 = [];
      this.fileObj1.push(this.files1);
      for (let i = 0; i < this.fileObj1[0].length; i++) {
        this.fileArray1.push(URL.createObjectURL(this.fileObj1[0][i]));
      }
      this.setState({
        slider_image1: this.files1,
        loaded7: 50,
        slider_image_err1: false,
        slider_image_preview1: this.fileArray1,
        request_w: '',
      });
      if (this.state.loaded7 <= 100) {
        setTimeout(
          function () {
            this.setState({ loaded7: 100 });
          }.bind(this),
          2000
        ); // wait 2 seconds, then reset to false
      }
    }
  };

  onFilesError7 = (error, file) => {
    this.setState({
      request_w: error.message,
    });
  };

  handleCheck = (event) => {
    this.setState({ checked: !this.state.checked }, () => {
      if (this.state.checked) {
        this.setState({ mat_checked: 1 });
      } else {
        this.setState({ mat_checked: 0 });
      }
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({
      request_m: '',
      file_err_attachment_img: '',
      file_err_attachment_preview: '',
      title_err: false,
      categoryId_err: false,
      pincode_err: false,
      post_expiry_date_err: false,
      description_err: false,
      budget_err: false,
      rate_err: false,
      city_err: false,
      state_err: false,
      featured_image_err: false,
      attachment_err: false,
      slider_image_err: false,
      available_from_err: false,
      available_to_err: false,
      delivery_cost_err: false,
      warranty_err: false,
    });
    if (this.state.title.length <= 0) {
      this.setState({ title_err: true });
    }
    if (this.state.categoryId == '--Select--' || this.state.categoryId == '') {
      this.setState({ categoryId_err: true });
    }
    if (
      this.state.post_expiry_date == '' ||
      this.state.post_expiry_date == undefined
    ) {
      this.setState({ post_expiry_date_err: true });
    }
    if (this.state.description.length <= 0) {
      this.setState({ description_err: true });
    }
    // if (this.state.rate.length <= 0) {
    //   this.setState({ rate_err: true });
    // }
    if (this.state.available_from.length <= 0) {
      this.setState({ available_from_err: true });
    }
    if (this.state.available_to.length <= 0) {
      this.setState({ available_to_err: true });
    }
    if (this.state.budget == '--Select--' || this.state.budget == '') {
      this.setState({ budget_err: true });
    }
    if (this.state.state.length <= 0) {
      this.setState({ state_err: true });
    }

    // if (this.state.city == "--Select--" || this.state.city == "") {
    //   this.setState({ city_err: true });
    // }
    // if (this.state.featured_image == null) {
    //   this.setState({ featured_image_err: true });
    // }
    // if (this.state.attachment == null) {
    //   this.setState({ attachment_err: true });
    // }
    // if (this.state.slider_image.length <= 0) {
    //   this.setState({ slider_image_err: true });
    // }

    this.validateImg();
    const date = moment(this.state.post_expiry_date).format(
      'DD-MM-YYYY h:mm:ss'
    );

    const token = await localStorage.getItem('token');
    this.setState({ loading: true });
    const data = new FormData();
    data.set('title', this.state.title);
    data.set('categoryId', this.state.categoryId);
    data.set('budget', this.state.budget);
    data.set('rate', this.state.rate);
    data.set('available_from', this.state.available_from);
    data.set('available_to', this.state.available_to);
    data.set('state', this.state.state);
    data.set('city', lest);
    data.set('pincode', this.state.pincode);
    data.set('extra', this.state.mat_checked);
    data.set(
      'post_expiry_date',
      date != 'Invalid date' ? date : this.state.post_expiry_date
    );
    data.set('description', this.state.description);
    data.append('featured_image', this.state.featured_image);
    data.append('attachment', this.state.attachment);
    for (const key of Object.keys(this.state.slider_image)) {
      data.append('slider_image[]', this.state.slider_image[key]);
    }
    if (this.state.main_img_validation === true) {
      this.setState({ loading: false });
      return;
    } else
      await axios
        .post(`${url}/api/work-request/create`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        // await postDataWithToken(`${url}/api/work-request/create`, data, token)
        .then((res) => {
          this.setState({
            file_err_attachment_preview: '',
            file_err_attachment_img: '',
            slider_image: '',
            attachment_img: '',
            show_msg: true,
            loading: false,
            title: '',
            categoryId: '',
            budget: '',
            rate: '',
            available_from: '',
            available_to: '',
            city: '',
            state: '',
            pincode: '',
            post_expiry_date: '',
            description: '',
            loaded: 0,
            loaded1: 0,
            loaded2: 0,
            featured_image: null,
            attachment_preview: null,
            attachment: null,
            slider_image: [],
            redirect_page: false,
            success: 'Your Request have been submit succesfully',
          });
          this.fileArray = [];
          this.myRef.current.scrollTo(0, 0);
          // this.props.history.push("/work-list");
        })
        .catch((err) => {
          // Object.entries(err.response.data.error).map(([key, value]) => {
          //   this.setState({ errors: err.response.data.error });
          // }); show_errors: true,
          this.setState({ loading: false });
          this.myRef.current.scrollTo(0, 0);
        });

    // Display the key/value pairs
    // for (var pair of data.entries()) {
    //   //console.log(pair[0] + ", " + pair[1]);
    // }
  };

  handleUpdate = async (event) => {
    event.preventDefault();
    this.setState({
      request_m: '',
      file_err_attachment_img: '',
      file_err_attachment_preview: '',
      title_err: false,
      categoryId_err: false,
      pincode_err: false,
      post_expiry_date_err: false,
      description_err: false,
      budget_err: false,
      rate_err: false,
      state_err: false,
      city_err: false,
      featured_image_err: false,
      attachment_err: false,
      slider_image_err: false,
      available_from_err: false,
      available_to_err: false,
      delivery_cost_err: false,
      warranty_err: false,
    });
    if (this.state.title.length <= 0) {
      this.setState({ title_err: true });
    }
    if (this.state.categoryId == '--Select--' || this.state.categoryId == '') {
      this.setState({ categoryId_err: true });
    }
    // if (this.state.pincode.length <= 0) {
    //   this.setState({ pincode_err: true });
    // }
    if (
      this.state.post_expiry_date == '' ||
      this.state.post_expiry_date == undefined
    ) {
      this.setState({ post_expiry_date_err: true });
    }
    if (this.state.description.length <= 0) {
      this.setState({ description_err: true });
    }
    // if (this.state.rate.length <= 0) {
    //   this.setState({ rate_err: true });
    // }
    if (this.state.available_from.length <= 0) {
      this.setState({ available_from_err: true });
    }
    if (this.state.available_to.length <= 0) {
      this.setState({ available_to_err: true });
    }
    if (this.state.state.length <= 0) {
      this.setState({ state_err: true });
    }
    if (this.state.budget == '--Select--' || this.state.budget == '') {
      this.setState({ budget_err: true });
    }

    // if (this.state.city == "--Select--" || this.state.city == "") {
    //   this.setState({ city_err: true });
    // }
    // if (this.state.featured_image == null) {
    //   this.setState({ featured_image_err: true });
    // }
    // if (this.state.attachment == null) {
    //   this.setState({ attachment_err: true });
    // }
    // if (this.state.slider_image.length <= 0) {
    //   this.setState({ slider_image_err: true });
    // }

    const token = await localStorage.getItem('token');
    this.setState({ loading: true });
    const data = new FormData();
    data.set('title', this.state.title);
    data.set('categoryId', this.state.categoryId);
    data.set('budget', this.state.budget);
    data.set('rate', this.state.rate);
    data.set('available_from', this.state.available_from);
    data.set('available_to', this.state.available_to);
    data.set('city', lest);
    data.set('state', this.state.state);
    data.set('pincode', this.state.pincode);
    data.set('extra', this.state.mat_checked);
    data.set('post_expiry_date', moment(this.state.upd_post_expiry_date));
    data.set('description', this.state.description);
    data.append('featured_image', this.state.featured_image);
    data.append('attachment', this.state.attachment);
    for (const key of Object.keys(this.state.slider_image)) {
      data.append('slider_image[]', this.state.slider_image[key]);
    }
    await postDataWithToken(
      `${url}/api/work-request/update/${this.props.match.params.id}`,
      data,
      token
    )
      .then((res) => {
        this.myRef.current.scrollTo(0, 0);
        this.setState({
          slider_image: [],
          file_err_attachment_preview: '',
          file_err_attachment_img: '',
          attachment_img: '',
          success: 'Your Request have been submit succesfully',
          redirect_page: false,
          title: '',
          categoryId: '',
          budget: '',
          rate: '',
          available_to: '',
          state: '',
          city: '',
          pincode: '',
          post_expiry_date: '',
          description: '',
        });
        // this.props.history.push("/work-list");
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
        this.myRef.current.scrollTo(0, 0);
      });

    // Display the key/value pairs
    for (var pair of data.entries()) {
      // //console.log(pair[0] + ", " + pair[1]);
    }
  };

  onConfirmError = () => {
    this.setState({
      server: false,
      validation: false,
      success: false,
      redirect_page: false,
      state: '',
    });
    this.props.history.push('/work-list');
  };

  // work offer
  handleSubmit1 = async (event) => {
    event.preventDefault();
    this.setState({
      request_w: '',
      file_err_attachment_preview1: '',
      file_err_attachment_img1: '',
      title_err1: false,
      categoryId_err1: false,
      pincode_err1: false,
      post_expiry_date_err1: false,
      description_err1: false,
      budget_err1: false,
      rate_err1: false,
      city_err: false,
      state_err1: false,
      featured_image_err: false,
      attachment_err: false,
      slider_image_err: false,
      available_from_err1: false,
      available_to_err1: false,
      delivery_cost_err1: false,
      warranty_err1: false,
    });
    if (this.state.title1.length <= 0) {
      this.setState({ title_err1: true });
    }
    if (
      this.state.categoryId1 == '--Select--' ||
      this.state.categoryId1 == ''
    ) {
      this.setState({ categoryId_err1: true });
    }
    if (this.state.pincode1.length <= 0) {
      this.setState({ pincode_err1: true });
    }
    if (
      this.state.post_expiry_date1 == '' ||
      this.state.post_expiry_date1 == undefined
    ) {
      this.setState({ post_expiry_date_err1: true });
    }
    if (this.state.description1.length <= 0) {
      this.setState({ description_err1: true });
    }
    if (this.state.rate1.length <= 0) {
      this.setState({ rate_err1: true });
    }
    if (this.state.state.length <= 0) {
      this.setState({ state_err1: true });
    }
    if (this.state.available_from1?.length <= 0) {
      this.setState({ available_from_err1: true });
    }
    if (this.state.available_to1.length <= 0) {
      this.setState({ available_to_err1: true });
    }
    if (this.state.budget1 == '--Select--' || this.state.budget1 == '') {
      this.setState({ budget_err1: true });
    }
    // if (this.state.city1 == "--Select--" || this.state.city1 == "") {
    //   this.setState({ city_err1: true });
    // }

    // if (this.state.featured_image1 == null) {
    //   this.setState({ featured_image_err1: true });
    // }
    // if (this.state.attachment1 == null) {
    //   this.setState({ attachment_err1: true });
    // }
    // if (this.state.slider_image1.length <= 0) {
    //   this.setState({ slider_image_err1: true });
    // }

    this.validateImg();

    const date = moment(this.state.post_expiry_date1).format(
      'DD-MM-YYYY h:mm:ss'
    );
    const token = await localStorage.getItem('token');
    this.setState({ loading: true });
    const data = new FormData();
    data.set('title', this.state.title1);
    data.set('categoryId', this.state.categoryId1);
    data.set('budget', this.state.budget1);
    data.set('rate', this.state.rate1);
    data.set('available_from', this.state.available_from1);
    data.set('available_to', this.state.available_to1);
    data.set('city', lest);
    data.set('state', this.state.state);
    data.set('pincode', this.state.pincode1);
    data.set('extra', this.state.mat_checked);
    data.set(
      'post_expiry_date',
      date != 'Invalid date' ? date : this.state.post_expiry_date1
    );
    data.set('description', this.state.description1);
    data.append('featured_image', this.state.featured_image1);
    data.append('attachment', this.state.attachment1);
    for (const key of Object.keys(this.state.slider_image1)) {
      data.append('slider_image[]', this.state.slider_image1[key]);
    }

    if (this.state.main_img_validation === true) {
      this.setState({ loading: false });
      return;
    } else
      await axios
        .post(`${url}/api/work-offers/create`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        // await postDataWithToken(`${url}/api/work-offers/create`, data, token)
        .then((res) => {
          this.setState({
            file_err_attachment_preview1: '',
            file_err_attachment_img1: '',
            loaded4: '',
            loaded3: '',
            loaded7: '',
            attachment1: '',
            show_msg: true,
            loading: false,
            title1: '',
            state1: '',
            categoryId1: '',
            budget1: '',
            rate1: '',
            available_from1: '',
            available_to1: '',
            city1: '',
            pincode1: '',
            post_expiry_date1: '',
            description1: '',
            loaded_: 0,
            loaded_1: 0,
            loaded_2: 0,
            featured_image1: null,
            attachment_preview1: null,
            // attachment1: null,
            slider_image1: [],
            success: 'Your Request have been submit succesfully',
            redirect_page: false,
          });
          this.fileArray1 = [];
          this.myRef.current.scrollTo(0, 0);
          // this.props.history.push("/work-list");
        })
        .catch((err) => {
          // //console.log(err.response.data);
          // Object.entries(err.response.data.error).map(([key, value]) => {
          //   this.setState({ errors: err.response.data.error });
          // }); show_errors: true,
          this.setState({ loading: false });
          this.myRef.current.scrollTo(0, 0);
        });

    for (var pair of data.entries()) {
      // //console.log(pair[0] + ", " + pair[1]);
    }
  };

  handleUpdate1 = async (event) => {
    event.preventDefault();
    this.setState({
      request_w: '',
      file_err_attachment_preview1: '',
      file_err_attachment_img1: '',
      title_err1: false,
      categoryId_err1: false,
      pincode_err1: false,
      post_expiry_date_err1: false,
      description_err1: false,
      budget_err1: false,
      rate_err1: false,
      city_err: false,
      featured_image_err: false,
      attachment_err: false,
      slider_image_err: false,
      available_from_err1: false,
      available_to_err1: false,
      delivery_cost_err1: false,
      warranty_err1: false,
    });
    if (this.state.title1.length <= 0) {
      this.setState({ title_err1: true });
    }
    if (
      this.state.categoryId1 == '--Select--' ||
      this.state.categoryId1 == ''
    ) {
      this.setState({ categoryId_err1: true });
    }
    if (this.state.pincode1.length <= 0) {
      this.setState({ pincode_err1: true });
    }
    if (
      this.state.post_expiry_date1 == '' ||
      this.state.post_expiry_date1 == undefined
    ) {
      this.setState({ post_expiry_date_err1: true });
    }
    if (this.state.description1.length <= 0) {
      this.setState({ description_err1: true });
    }
    if (this.state.rate1.length <= 0) {
      this.setState({ rate_err1: true });
    }
    if (this.state.available_from1.length <= 0) {
      this.setState({ available_from_err1: true });
    }
    if (this.state.available_to1.length <= 0) {
      this.setState({ available_to_err1: true });
    }
    if (this.state.budget1 == '--Select--' || this.state.budget1 == '') {
      this.setState({ budget_err1: true });
    }
    if (this.state.city == '--Select--' || this.state.city == '') {
      this.setState({ city_err: true });
    }
    if (this.state.featured_image1 == null) {
      this.setState({ featured_image_err1: true });
    }
    if (this.state.attachment1 == null) {
      this.setState({ attachment_err1: true });
    }
    if (this.state.slider_image1.length <= 0) {
      this.setState({ slider_image_err1: true });
    }
    console.log(this.state.featured_image1);
    const token = await localStorage.getItem('token');
    this.setState({ loading: true });
    const data = new FormData();
    data.set('title', this.state.title1);
    data.set('categoryId', this.state.categoryId1);
    data.set('budget', this.state.budget1);
    data.set('available_from', this.state.available_from1);
    data.set('available_to', this.state.available_to1);
    data.set('city', this.state.city);
    data.set('state', this.state.state);
    data.set('pincode', this.state.pincode1);
    data.set('extra', this.state.mat_checked);
    data.set('post_expiry_date', moment(this.state.upd_post_expiry_date));
    data.set('description', this.state.description1);
    data.append('featured_image', this.state.featured_image1);
    data.append('attachment', this.state.attachment1);
    for (const key of Object.keys(this.state.slider_image1)) {
      data.append('slider_image[]', this.state.slider_image1[key]);
    }
    await postDataWithToken(
      `${url}/api/work-offer/update/${this.props.match.params.id}`,
      data,
      token
    )
      .then((res) => {
        // //console.log(res);
        this.myRef.current.scrollTo(0, 0);
        this.setState({
          file_err_attachment_preview1: '',
          file_err_attachment_img1: '',
          attachment1: '',
          success: 'Your Request have been submit succesfully',
          redirect_page: false,
        });
        // this.props.history.push("/work-list");
      })
      .catch((err) => {
        // //console.log(err.response);
        this.setState({
          loading: false,
        });
        this.myRef.current.scrollTo(0, 0);
      });

    for (var pair of data.entries()) {
      // //console.log(pair[0] + ", " + pair[1]);
    }
  };

  checkallfields() {
    if (
      this.state.title ||
      this.state.categoryId ||
      this.state.budget ||
      this.state.rate ||
      this.state.available_to ||
      this.state.state ||
      this.state.city ||
      this.state.pincode ||
      this.state.description
    ) {
      this.setState({
        redirect_page: true,
      });
    } else {
      this.setState({
        redirect_page: false,
      });
    }
    if (
      this.state.title1 ||
      this.state.categoryId1 ||
      this.state.budget1 ||
      this.state.available_from1 ||
      this.state.available_to1 ||
      this.state.state ||
      this.state.city?.length > 0 ||
      this.state.description1
    ) {
      this.setState({
        redirect_page1: true,
      });
    } else {
      this.setState({
        redirect_page1: false,
      });
    }
  }

  //   handleChange = (event) => {
  //     //console.log("event.target.selectedOptions", event.target.selectedOptions)
  //     //console.log("event.target.value=======", event.target.value)
  //     const selected=[];
  //     let selectedOption=(event.target.selectedOptions);

  //     for (let i = 0; i < selectedOption.length; i++){
  //         selected.push(selectedOption.item(i).value)
  //     }

  //     this.setState({selCategories: selected});
  //   }

  //   handleChange(event) {
  //     //console.log("event",event)
  //     var isChecked = event.target.checked;
  //     var item = event.target.value;

  //     this.setState(prevState => ({
  //        checkedItems: prevState.checkedItems.set(item, isChecked)
  //        }));
  // }

  onSelect(selectedList, selectedItem) {
    // this.setState({ city : [selectedList]})
    lest.push(selectedItem.city_id);
    // //console.log(selectedList, "=----------------", selectedItem)
  }

  onRemove(selectedList, removedItem) {
    const d = lest.indexOf(removedItem.city_id);
    lest.splice(d, 1);
  }

  // onSelect1(selectedList, selectedItem) {
  //   lest1.push(selectedItem.city_id);
  // }

  // onRemove1(selectedList, removedItem) {
  //   const d = lest1.indexOf(removedItem.city_id);
  //   lest1.splice(d, 1);
  //   // //console.log("=============", d)
  // }

  offer_dataClear = () => {
    this.setState({
      title: '',
      categoryId: '',
      quantity: '',
      description: '',
      unit: '',
      city: '',
      state: '',
      pincode: '',
      work_checked: '',
      post_expiry_date: '',
      featured_image: '',
      attachment: '',
      // slider_image: [],
      categoryId: '',
      budget: '',
      rate: '',
      available_from: '',
      available_to: '',
      budget: '',
      rate: '',
      available_from: '',
      available_to: '',
      featured_image: '',
      attachment_preview: '',
      loaded: false,
      loaded3: false,
      featured_image1: '',
    });
  };

  request_dataClear = () => {
    this.setState({
      title1: '',
      categoryId1: '',
      quantity1: '',
      description1: '',
      unit1: '',
      state1: '',
      pincode1: '',
      post_expiry_date1: '',
      categoryId1: '',
      budget1: '',
      rate1: '',
      available_from1: '',
      available_to1: '',
      featured_image1: '',
      attachment_preview1: '',
      loaded: false,
      loaded3: false,
    });
  };

  validateImg = () => {
    if (this.state.featured_image) {
      this.setState({ main_img_validation: false });
    }
    if (this.state.attachment_preview1) {
      this.setState({ main_img_validation: false });
    }
    this.setState({ loading: false });
  };
  handlePreviewModal = (e) => {
    e.preventDefault();
    this.setState({ isPerviewModal: !this.state.isPerviewModal });
  };
  handleFormSubmit = (e) => {
    if (this.props.match.params.id) {
      this.handleUpdate(e);
    } else {
      this.handleSubmit(e);
    }
  };
  handleFormSubmit1 = (e) => {
    if (this.props.match.params.id) {
      this.handleUpdate1(e);
    } else {
      this.handleSubmit1(e);
    }
  };

  getTenderType = (e) => {
    this.setState({
      tender_types: e,
    });
  };

  render() {
    const { t, i18n } = this.props;

    var yesterday = moment().subtract(1, 'day');
    function valid(current) {
      return current.isAfter(yesterday);
    }

    var yestday = moment();
    function valids(current) {
      return current.isAfter(yestday);
    }
    var workStartDate = this.state.available_from
      ? moment(this.state.available_from)
      : null;
    function valid2(current) {
      return current.isAfter(workStartDate);
    }
    var availableStartDate = this.state.available_from1
      ? moment(this.state.available_from1)
      : null;
    function valid3(current) {
      return current.isAfter(availableStartDate);
    }

    let alert, loading;
    if (this.state.show_errors === true) {
      alert = (
        <Alert variant='danger' style={{ fontSize: '13px', zIndex: 1 }}>
          {Object.entries(this.state.errors).map(([key, value]) => {
            const stringData = value.reduce((result, item) => {
              return `${item} `;
            }, '');
            return stringData;
          })}
        </Alert>
      );
    }
    if (this.state.show_msg === true) {
      alert = (
        <Alert variant='success' style={{ fontSize: '13px' }}>
          {t('success.work_ins')}
        </Alert>
      );
    }
    if (this.state.loading === true) {
      loading = (
        <Spinner animation='border' role='status'>
          <span className='sr-only'> {t('success.Loading')}</span>
        </Spinner>
      );
    }

    const categoryId = this.state.productcat
      ? this.state.productcat?.map(({ category_id, category_name }, index) => (
          <option key={index} value={category_id}>
            {category_name}
          </option>
        ))
      : [];
    const categoryId1 = this.state.productcat
      ? this.state.productcat?.map(({ category_id, category_name }, index) => (
          <option key={index} value={category_id}>
            {category_name}
          </option>
        ))
      : [];

    const stateList = this.state.states
      ? this.state.states?.map(({ state_id, state_name }, index) => {
          if (state_id !== undefined) {
            return (
              <>
                {' '}
                {state_name === 'All regions' ? (
                  <option key={index} value={state_id}>
                    {' '}
                    {t('list_details.All_regions')}{' '}
                  </option>
                ) : (
                  <option key={index} value={state_id}>
                    {' '}
                    {state_name}{' '}
                  </option>
                )}{' '}
              </>
            );
          }
        })
      : [];
    // const stateList1 = this.state.states1
    //   ? this.state.states1?.map(({ state_id, state_name }, index) => {
    //       if (state_id !== undefined) {
    //         return (
    //           <>
    //             {' '}
    //             {state_name === 'All regions' ? (
    //               <option key={index} value={state_id}>
    //                 {' '}
    //                 {t('list_details.All_regions')}{' '}
    //               </option>
    //             ) : (
    //               <option key={index} value={state_id}>
    //                 {' '}
    //                 {state_name}{' '}
    //               </option>
    //             )}{' '}
    //           </>
    //         );
    //       }
    //     })
    //   : [];

    const { success, request_m, request_w } = this.state;

    const category_Id = this.state.productcat
      ? this.state.productcat?.filter(
          (x) => x.category_id === Number(this.state.categoryId)
        )
      : [];
    const category_Id1 = this.state.productcat
      ? this.state.productcat?.filter(
          (x) => x.category_id === Number(this.state.categoryId1)
        )
      : [];
    const state_Id = this.state.states
      ? this.state.states?.filter(
          (x) => x.state_id === Number(this.state.state)
        )
      : [];
    const state_Id1 = this.state.states
      ? this.state.states?.filter(
          (x) => x.state_id === Number(this.state.state)
        )
      : [];

    // const date1 = this.state.available_to ? this.state.available_to : "Work End" ;
    const preview_array = {
      title: this.state.title ? this.state.title : this.state.title1,
      categoryId: category_Id[0]?.category_name
        ? category_Id[0]?.category_name
        : category_Id1
        ? category_Id1[0]?.category_name
        : '',
      quantity: this.state.quantity
        ? this.state.quantity
        : this.state.quantity1,
      description: this.state.description
        ? this.state.description
        : this.state.description1,
      unit: this.state.unit ? this.state.unit : this.state.unit1,
      state: state_Id[0]?.state_name
        ? state_Id[0]?.state_name
        : state_Id1[0]?.state_name,
      pincode: this.state.pincode ? this.state.pincode : this.state.pincode1,
      post_expiry_date: this.state.post_expiry_date
        ? this.state.post_expiry_date
        : this.state.post_expiry_date1,
      featured_image: this.state.attachment_preview
        ? this.state.attachment_preview
        : this.state.attachment_preview1,
      // attachment: this.state.attachment_img ,
      // slider_image: this.fileArray,
      work_checked: this.state.work_checked,
      cost_per_unit: this.state.cost_per_unit1,
      warranty: this.state.warranty,
      delivery_type: this.state.delivery_type1,
      delivery_cost: this.state.delivery_cost1,
      warranty: this.state.warranty
        ? this.state.warranty
        : this.state.warranty1,

      budget: this.state.budget ? this.state.budget : this.state.budget1,
      rate: this.state.rate ? this.state.rate : this.state.rate1,
      available_from: this.state.available_from
        ? this.state.available_from
        : this.state.available_from1,
      available_to: this.state.available_to
        ? this.state.available_to
        : this.state.available_to1,
    };

    const { Login_user_permissions } = this.state;

    const handleKeyDownCus = (evt) => {
      if (['Enter'].includes(evt.key)) {
        evt.preventDefault();
      }
    };

    const inputPropsDate = {
      onKeyDown: handleKeyDownCus,
      placeholder: 'DD-MM-YYYY',
    };

    const filter_work_offer =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === 'marketplace_work_create_offer'
          )
        : [];

    const Login_user_role = localStorage.getItem('Login_user_role')
      ? localStorage.getItem('Login_user_role')
      : '';
    //console.log("Login_user_role", Login_user_role);
    console.log(this.state.available_from, this.state.available_from_format);
    return (
      <React.Fragment>
        {this.state.redirect_page ? (
          <Prompt
            when={this.state.redirect_page}
            message={t('marketplace.feeds.list_details.leave_page')}
          />
        ) : (
          ''
        )}
        {this.state.redirect_page1 ? (
          <Prompt
            when={this.state.redirect_page1}
            message={t('marketplace.feeds.list_details.leave_page')}
          />
        ) : (
          ''
        )}
        <div>
          {/* <Header active={'market'} /> */}
          <Breadcrumb>
            <Link
              to='/feeds'
              className='breadcrumb-item active'
              aria-current='page'
            >
              {t('header.marketplace')}
            </Link>
            <li className='breadcrumb-item active' aria-current='page'>
              {t('marketplace.work.create_work_list.title')}
            </li>
          </Breadcrumb>
          <div className='main-content'>
            <Sidebar dataFromParent={this.props.location.pathname} />
            <div ref={this.myRef} className='page-content'>
              {alert ? alert : null}

              {success ? (
                <SweetAlert
                  success
                  closeOnClickOutside={true}
                  title={t('login.SuccessPopup')}
                  onConfirm={this.onConfirmError}
                >
                  {/* {t("list_details.success")} */}
                </SweetAlert>
              ) : (
                ''
              )}

              <div className='container-fluid'>
                <h3 className='head3'>
                  {t('marketplace.work.create_work_list.title')}
                </h3>
                <div className='card'>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col'>
                        <div className='form-group'>
                          {/* <label>{t("c_material_list.request.type_list")}</label>
                          <small
                            className="form-text text-muted"
                            style={{ fontSize: "15px" }}
                          >
                            {t("c_material_list.request.sub_title")}
                          </small> */}
                          <ul
                            className='nav tablist flex-nowrap'
                            id='listing-type'
                            role='tablist'
                          >
                            {this.props.match.params.id ? (
                              this.state.tender_type === 'Request' ? (
                                <li className='nav-item' role='presentation'>
                                  <a
                                    className={`nav-link ${
                                      this.state.tender_type === 'Request'
                                        ? 'active'
                                        : ''
                                    }`}
                                    id='type-request-tab'
                                    data-toggle='pill'
                                    href='#type-request'
                                    role='tab'
                                    aria-controls='type-request'
                                    aria-selected='true'
                                    onClick={() => {
                                      this.request_dataClear();
                                      this.getTenderType('Request');
                                    }}
                                  >
                                    {t('marketplace.feeds.request')}
                                  </a>
                                </li>
                              ) : filter_work_offer[0] ===
                                'marketplace_work_create_offer' ? (
                                <li className='nav-item' role='presentation'>
                                  {Login_user_role !== 'consumer' ? (
                                    <a
                                      className={`nav-link ${
                                        this.state.tender_type === 'Offer'
                                          ? 'active'
                                          : ''
                                      }`}
                                      id='type-offer-tab'
                                      data-toggle='pill'
                                      href='#type-offer'
                                      role='tab'
                                      aria-controls='type-offer'
                                      aria-selected='false'
                                      onClick={() => {
                                        this.offer_dataClear();
                                        this.getTenderType('Offer');
                                      }}
                                    >
                                      {t('marketplace.feeds.offer')}
                                    </a>
                                  ) : (
                                    ''
                                  )}
                                </li>
                              ) : (
                                ''
                              )
                            ) : (
                              <React.Fragment>
                                <li className='nav-item' role='presentation'>
                                  <a
                                    className={`nav-link ${
                                      this.state.tender_type === 'Request'
                                        ? 'active'
                                        : ''
                                    }`}
                                    id='type-request-tab'
                                    data-toggle='pill'
                                    href='#type-request'
                                    role='tab'
                                    aria-controls='type-request'
                                    aria-selected='true'
                                    onClick={() => {
                                      this.request_dataClear();
                                      this.getTenderType('Request');
                                    }}
                                  >
                                    {t('marketplace.feeds.request')}
                                  </a>
                                </li>
                                {filter_work_offer[0] ===
                                'marketplace_work_create_offer' ? (
                                  <li className='nav-item' role='presentation'>
                                    {Login_user_role !== 'consumer' ? (
                                      <a
                                        className={`nav-link ${
                                          this.state.tender_type === 'Offer'
                                            ? 'active'
                                            : ''
                                        }`}
                                        id='type-offer-tab'
                                        data-toggle='pill'
                                        href='#type-offer'
                                        role='tab'
                                        aria-controls='type-offer'
                                        aria-selected='false'
                                        onClick={() => {
                                          this.offer_dataClear();
                                          this.getTenderType('Offer');
                                        }}
                                      >
                                        {t('marketplace.feeds.offer')}
                                      </a>
                                    ) : (
                                      ''
                                    )}
                                  </li>
                                ) : (
                                  ''
                                )}
                              </React.Fragment>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className='tab-content' id='type-tabContent'>
                      <div
                        className={
                          this.state.tender_type === 'Request'
                            ? 'tab-pane fade show active'
                            : 'tab-pane fade'
                        }
                        id='type-request'
                        role='tabpanel'
                        aria-labelledby='type-request'
                      >
                        <form
                          name='type-request'
                          // onSubmit={
                          //   this.props.match.params.id
                          //     ? this.handleUpdate
                          //     : this.handleSubmit
                          // }
                        >
                          <div className='row'>
                            <div className='col-12 col-md-5'>
                              <div className='form-group'>
                                <label htmlFor='title'>
                                  {t(
                                    'marketplace.work.create_work_list.request.input_title'
                                  )}
                                </label>
                                <input
                                  id='title'
                                  style={
                                    this.state.title_err === true
                                      ? { border: '1px solid #eb516d' }
                                      : {}
                                  }
                                  onChange={this.handleChange1}
                                  name='title'
                                  type='text'
                                  value={this.state.title}
                                  className='form-control'
                                  placeholder=''
                                  required
                                />
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.title_err === true
                                    ? `${t(
                                        'marketplace.work.create_work_list.request.title_req'
                                      )} `
                                    : null}
                                </p>
                              </div>
                              <div className='form-group'>
                                <label htmlFor='categoryId'>
                                  {t(
                                    'marketplace.work.create_work_list.request.category'
                                  )}
                                </label>
                                <select
                                  style={
                                    this.state.categoryId_err === true
                                      ? { border: '1px solid #eb516d' }
                                      : {}
                                  }
                                  onChange={this.handleChange2}
                                  name='categoryId'
                                  id='categoryId'
                                  value={this.state.categoryId}
                                  required
                                  className='form-control'
                                >
                                  <option value=''>
                                    {' '}
                                    {t(
                                      'marketplace.work.create_work_list.request.Select'
                                    )}
                                  </option>
                                  {categoryId}
                                </select>
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.categoryId_err === true
                                    ? `${t(
                                        'marketplace.work.create_work_list.request.categoryId_req'
                                      )} `
                                    : null}
                                </p>
                              </div>
                              <div className='row'>
                                <div className='col-8'>
                                  <div className='form-group'>
                                    <label htmlFor='budget'>
                                      {t(
                                        'marketplace.work.create_work_list.request.budget'
                                      )}
                                    </label>
                                    <select
                                      style={
                                        this.state.budget_err === true
                                          ? { border: '1px solid #eb516d' }
                                          : {}
                                      }
                                      onChange={this.handleChange3}
                                      name='budget'
                                      id='budget'
                                      value={this.state.budget}
                                      className='form-control'
                                      required
                                    >
                                      <option value=''>
                                        {t(
                                          'marketplace.work.create_work_list.request.Select'
                                        )}
                                      </option>
                                      <option value='Fixed'>
                                        {t(
                                          'marketplace.work.create_work_list.request.Fixed'
                                        )}
                                      </option>
                                      <option value='Hourly'>
                                        {t(
                                          'marketplace.work.create_work_list.request.Hourly'
                                        )}
                                      </option>
                                      <option value='per_m2'>
                                        {t(
                                          'marketplace.work.create_work_list.request.cost/m2'
                                        )}
                                      </option>
                                    </select>
                                    <p style={{ color: '#eb516d ' }}>
                                      {this.state.budget_err === true
                                        ? `${t(
                                            'marketplace.work.create_work_list.request.budget_req'
                                          )} `
                                        : null}
                                    </p>
                                  </div>
                                </div>

                                <div className='col-4'>
                                  <div className='form-group'>
                                    <label htmlFor='rate'>
                                      {t(
                                        'marketplace.work.create_work_list.request.rate'
                                      )}
                                    </label>
                                    <input
                                      id='rate'
                                      style={
                                        this.state.rate_err === true
                                          ? { border: '1px solid #eb516d' }
                                          : {}
                                      }
                                      onChange={this.handleChange4}
                                      name='rate'
                                      // type="number"
                                      type='text'
                                      maxLength='8'
                                      className='form-control'
                                      placeholder='0'
                                      value={this.state.rate}
                                      min='0'
                                      // required
                                    />
                                    {/* <p style={{ color: "#eb516d " }}>
                                      {this.state.rate_err === true
                                        ? "Rate is required"
                                        : null}
                                    </p> */}
                                  </div>
                                </div>
                              </div>
                              <div className='row'>
                                <div className='col-lg-6 col-xs-12'>
                                  <div className='form-group'>
                                    <label htmlFor='available_from'>
                                      {t(
                                        'marketplace.work.create_work_list.request.work_start'
                                      )}
                                    </label>
                                    <div
                                      style={
                                        this.state.available_from_err === true
                                          ? { border: '1px solid #eb516d' }
                                          : {}
                                      }
                                    >
                                      <Datetime
                                        onChange={(date) =>
                                          this.handleChange5(date)
                                        }
                                        isValidDate={valid}
                                        inputProps={inputPropsDate}
                                        id='available_from_start'
                                        name='available_from_start'
                                        dateFormat='DD-MM-YYYY'
                                        locale={`${
                                          localStorage.getItem('_lng') === 'fi'
                                            ? 'fr-fi'
                                            : 'en-US'
                                        } `}
                                        value={this.state.available_from_format}
                                        timeFormat={false}
                                      />
                                    </div>
                                    <p style={{ color: '#eb516d ' }}>
                                      {this.state.available_from_err === true
                                        ? `${t(
                                            'marketplace.work.create_work_list.request.available_from_req'
                                          )} `
                                        : null}
                                    </p>
                                  </div>
                                </div>

                                <div className='col-lg-6 col-xs-12'>
                                  <div className='form-group'>
                                    <label htmlFor='available_to'>
                                      {t(
                                        'marketplace.work.create_work_list.request.work_end'
                                      )}
                                    </label>
                                    <div
                                      style={
                                        this.state.available_to_err === true
                                          ? { border: '1px solid #eb516d' }
                                          : {}
                                      }
                                    >
                                      <Datetime
                                        onChange={(date) =>
                                          this.handleChange6(date)
                                        }
                                        isValidDate={valid2}
                                        name='available_from_end'
                                        value={this.state.available_to_format}
                                        dateFormat='DD-MM-YYYY'
                                        timeFormat={false}
                                        locale={`${
                                          localStorage.getItem('_lng') === 'fi'
                                            ? 'fr-fi'
                                            : 'en-US'
                                        } `}
                                        // type="date"
                                        // closeOnSelect={true}
                                        inputProps={inputPropsDate}
                                      />
                                    </div>
                                    <p style={{ color: '#eb516d ' }}>
                                      {this.state.available_to_err === true
                                        ? `${t(
                                            'marketplace.work.create_work_list.request.available_to_req'
                                          )} `
                                        : null}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className='form-group'>
                                <label htmlFor='state'>
                                  {t('marketplace.feeds.state')}
                                </label>
                                <select
                                  onChange={this.ChangeCity}
                                  style={
                                    this.state.state_err === true
                                      ? { border: '1px solid #eb516d' }
                                      : {}
                                  }
                                  name='state'
                                  id='state'
                                  value={this.state.state}
                                  className='form-control'
                                  required
                                >
                                  <option value=''>
                                    {t(
                                      'marketplace.work.create_work_list.request.Select'
                                    )}
                                  </option>
                                  {stateList}
                                </select>
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.state_err === true
                                    ? `${t(
                                        'marketplace.work.create_work_list.request.state_r'
                                      )} `
                                    : null}
                                </p>
                              </div>

                              <div className='form-group'>
                                <label htmlFor='city'>
                                  {t(
                                    'marketplace.work.create_work_list.request.city'
                                  )}
                                </label>
                                {/* <select
                                  onChange={this.handleChange7}
                                  style={
                                    this.state.city_err === true
                                      ? { border: "1px solid #eb516d" }
                                      : {}
                                  }
                                  name="city"
                                  id="city"
                                  className="form-control"
                                  value={this.state.city}
                                  >
                                  <option>{t("c_material_list.request.Select")}  </option>
                                  {cityList}
                                </select> */}

                                <Multiselect
                                  options={this.state.cities} // Options to display in the dropdown
                                  selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                  onSelect={(e) => this.check(e)} // Function will trigger on select event
                                  selectedValues={this.state.city} // Preselected value to persist in dropdown
                                  onSelect={this.onSelect} // Function will trigger on select event
                                  onRemove={this.onRemove} // Function will trigger on remove event
                                  displayValue='city_identifier' //
                                  emptyRecordMsg={t(
                                    'marketplace.work.create_work_list.offer.No_Options_Available'
                                  )}
                                  placeholder={t(
                                    'marketplace.work.create_work_list.request.Select'
                                  )}
                                  // showCheckbox={true}
                                />
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.city_err === true
                                    ? 'City is required'
                                    : null}
                                </p>
                              </div>

                              {/* <div className="form-group">
                                <label htmlFor="pincode">
                                  {t("c_material_list.request.pincode")}
                                </label>
                                <input
                                  style={
                                    this.state.pincode_err === true
                                      ? { border: "1px solid #eb516d" }
                                      : {}
                                  }
                                  id="pincode"
                                  onChange={this.handleChange8}
                                  name="pincode"
                                  maxLength="10"
                                  type="text"
                                  className="form-control"
                                  value={this.state.pincode}
                                  placeholder=""
                                  required
                                />
                                <p style={{ color: "#eb516d " }}>
                                  {this.state.pincode_err === true
                                    ? "Pincode is required"
                                    : null}
                                </p>
                              </div> */}
                              <div className='form-group'>
                                <label htmlFor='post_expiry_date'>
                                  {t(
                                    'marketplace.work.create_work_list.request.post_expires_in1'
                                  )}
                                </label>
                                <div
                                  style={
                                    this.state.post_expiry_date_err === true
                                      ? { border: '1px solid #eb516d' }
                                      : {}
                                  }
                                >
                                  {/* <Datetime
                                    onChange={(date) =>
                                      this.handleChange9(date)
                                    }
                                    isValidDate={valid}
                                    name="post_expiry_date"
                                    // type="number"
                                    value={this.state.post_expiry_date}
                                    dateFormat="DD-MM-YYYY"
                                    timeFormat={false}
                                    // closeOnSelect={true}
                                    // type={"date"}
                                    locale={`${localStorage.getItem("_lng") === "fi" ? "fr-fi" : 'en-US'} `}
                                    inputProps={{ placeholder: date_0, type: "number" }}
                                  // inputProps={ inputProps }
                                  /> */}
                                  <Datetime
                                    onChange={(date) =>
                                      this.handleChange9(date)
                                    }
                                    isValidDate={valids}
                                    name='post_expiry_date'
                                    // type="number"
                                    value={this.state.post_expiry_date}
                                    dateFormat='DD-MM-YYYY'
                                    timeFormat={false}
                                    // closeOnSelect={true}
                                    // type={"date"}
                                    locale={`${
                                      localStorage.getItem('_lng') === 'fi'
                                        ? 'fr-fi'
                                        : 'en-US'
                                    } `}
                                    inputProps={inputPropsDate}
                                    // inputProps={{ placeholder: this.state.post_expiry_date1 !== "Invalid date" ? moment(this.state.post_expiry_date1).format('DD-MM-YYYY') : this.state.post_expiry_date1, type: "number" }}

                                    // inputProps={ inputProps }
                                  />
                                  {/* <Datetime
                                    onChange={(date) => this.handleChange9(date)}
                                    name="post_expiry_date"
                                    isValidDate={valids}
                                    value={this.state.post_expiry_date}
                                    dateFormat={this.state.datepicker_date_format}
                                    // timeFormat={this.state.datepicker_time_format}
                                    type="date"
                                    required
                                    viewMode="days"
                                    timeFormat={false}
                                    locale={`${localStorage.getItem("_lng") === "fi" ? "fr-fi" : 'en-US'} `}
                                    inputProps={{ placeholder: date_0 != "Invalid date" ? date_0 : this.state.post_expiry_date, type: "number" }}
                                  /> */}
                                </div>
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.post_expiry_date_err === true
                                    ? t(
                                        'marketplace.work.create_work_list.request.Date_f'
                                      )
                                    : null}
                                </p>
                              </div>

                              <div className='form-group'>
                                <div className='form-check form-check-inline'>
                                  <input
                                    type='checkbox'
                                    className='form-check-input'
                                    id='material1'
                                    checked={
                                      this.state.mat_checked === 1
                                        ? true
                                        : false
                                    }
                                    value='1'
                                    onChange={this.handleCheck}
                                  />
                                  <label
                                    className='form-check-label'
                                    htmlFor='material1'
                                  >
                                    {t(
                                      'marketplace.work.create_work_list.request.material'
                                    )}
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className='col-12 col-md-7'>
                              <div className='form-group'>
                                <label htmlFor='Desc'>
                                  {t(
                                    'marketplace.work.create_work_list.request.description'
                                  )}
                                </label>
                                <textarea
                                  onChange={this.handleChange10}
                                  style={
                                    this.state.description_err === true
                                      ? { border: '1px solid #eb516d' }
                                      : {}
                                  }
                                  name='description'
                                  id='Desc'
                                  value={this.state.description}
                                  className='form-control'
                                  required
                                ></textarea>
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.description_err === true
                                    ? `${t(
                                        'marketplace.work.create_work_list.request.descrip_req'
                                      )} `
                                    : null}
                                </p>
                              </div>
                              <div className='row'>
                                <div className='col-12 col-sm-6'>
                                  <div className='form-group'>
                                    <label htmlFor='main'>
                                      {t(
                                        'marketplace.work.create_work_list.request.main'
                                      )}
                                    </label>
                                    <div
                                      className='file-select'
                                      style={
                                        this.state.featured_image_err === true
                                          ? { border: '1px solid #eb516d' }
                                          : {}
                                      }
                                    >
                                      {/* <input
                                        onChange={this.handleChange11}
                                        name="featured_image"
                                        type="file"
                                        id="main"
                                      /> */}

                                      <Files
                                        className='files-dropzone'
                                        onChange={(e) => this.onFilesChange(e)}
                                        onError={(e) => this.onFilesError(e)}
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
                                              this.props.match.params.id
                                                ? url +
                                                  '/images/marketplace/material/' +
                                                  this.state.attachment_preview
                                                : this.state
                                                    .attachment_preview !== null
                                                ? this.state.attachment_preview
                                                : File
                                            }
                                            alt=''
                                          />
                                          <span className='status'>
                                            {' '}
                                            {t(
                                              'marketplace.work.create_work_list.Upload_status'
                                            )}
                                          </span>
                                          <ProgressBar
                                            now={this.state.loaded}
                                          />
                                        </label>
                                      </Files>
                                      <p
                                        style={{
                                          color: this.state.img_name
                                            ? 'black'
                                            : '#eb516d',
                                          fontSize: '15px',
                                        }}
                                      >
                                        {this.state.file_err_attachment_preview
                                          ? this.state
                                              .file_err_attachment_preview
                                          : ''}
                                      </p>
                                      <small className='form-text text-muted'>
                                        {t(
                                          'marketplace.work.create_work_list.file_ext'
                                        )}
                                      </small>

                                      {this.state.attachment_preview ? (
                                        <button
                                          style={{ marginTop: '10px' }}
                                          onClick={this.removeImg_0}
                                          className='btn btn-danger'
                                        >
                                          {t(
                                            'marketplace.work.create_work_list.request.Remove'
                                          )}
                                        </button>
                                      ) : (
                                        ''
                                      )}
                                      {this.state.main_img_validation && (
                                        <div
                                          style={{
                                            color: 'red',

                                            fontSize: '1.4rem',
                                          }}
                                        >
                                          Image required
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className='col-12 col-sm-6'>
                                  <div
                                    className='form-group'
                                    style={
                                      this.state.attachment_err === true
                                        ? {
                                            //border: "1px solid #eb516d"
                                          }
                                        : {}
                                    }
                                  >
                                    <label htmlFor='attachment'>
                                      {t(
                                        'marketplace.work.create_work_list.request.attachment'
                                      )}
                                    </label>
                                    <div className='file-select'>
                                      {/* <input
                                        onChange={this.handleChange12}
                                        name="attachment"
                                        type="file"
                                        id="attachment"
                                      /> */}

                                      <Files
                                        className='files-dropzone'
                                        onChange={(e) => this.onFilesChange1(e)}
                                        onError={(e) => this.onFilesError1(e)}
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
                                        <label htmlFor='attachment'>
                                          {/* Drop files here or click to upload */}
                                          <img
                                            src={
                                              this.props.match.params.id
                                                ? url +
                                                  '/images/marketplace/material/' +
                                                  this.state.attachment_img
                                                : this.state.attachment_img !==
                                                  null
                                                ? this.state.attachment_img
                                                : File
                                            }
                                            alt=''
                                            style={{
                                              width: '50% !important',
                                              height: '50% !important',
                                            }}
                                          />

                                          <span className='status'>
                                            {t(
                                              'marketplace.work.create_work_list.Upload_status'
                                            )}
                                          </span>
                                          <ProgressBar
                                            now={this.state.loaded1}
                                          />
                                        </label>
                                      </Files>

                                      <p
                                        style={{
                                          color: this.state.img_name
                                            ? 'black'
                                            : '#eb516d',
                                          fontSize: '15px',
                                        }}
                                      >
                                        {this.state.file_err_attachment_img
                                          ? this.state.file_err_attachment_img
                                          : ''}{' '}
                                      </p>

                                      {this.state.attachment_img ? (
                                        <button
                                          style={{ marginTop: '10px' }}
                                          onClick={this.removeImg_1}
                                          className='btn btn-danger'
                                        >
                                          {t(
                                            'marketplace.work.create_work_list.request.Remove'
                                          )}
                                        </button>
                                      ) : (
                                        ''
                                      )}

                                      {/* <label htmlFor="attachment">
                                          <span className="status">{t("c_work_list.Upload_status")}</span>
                                          <ProgressBar now={this.state.loaded1} />
                                        </label> */}
                                      {/* {this.state.attachment_img ?
                                        <button
                                          style={{ marginTop: "10px" }}
                                          onClick={this.removeImg_1}
                                          className="btn btn-danger"
                                        >
                                          {t("c_material_list.request.Remove")}
                                        </button>
                                        : ""} 
                                        */}
                                      <small className='form-text text-muted'>
                                        {t(
                                          'marketplace.work.create_work_list.request.attachment_text'
                                        )}
                                      </small>
                                      <p style={{ color: '#eb516d ' }}>
                                        {this.state.attachment_err === true
                                          ? null //"Attachment is required"
                                          : null}
                                      </p>
                                    </div>

                                    {this.state.attachment_P ? (
                                      <label htmlFor='attachments'>
                                        <a
                                          href={
                                            url +
                                            '/images/marketplace/material/' +
                                            this.state.attachment_P
                                          }
                                          target='_blank'
                                          className='attachment'
                                        >
                                          <i className='icon-paperclip'></i>
                                          {this.state.attachment_P}
                                        </a>
                                      </label>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                              <div className='row'>
                                <div className='col-12 col-sm-6'>
                                  <div className='form-group'>
                                    <label>
                                      {t(
                                        'marketplace.work.create_work_list.request.product_images'
                                      )}
                                    </label>
                                    <div
                                      className='file-select'
                                      style={
                                        this.state.slider_image_err === true
                                          ? { border: '1px solid #eb516d' }
                                          : {}
                                      }
                                    >
                                      {/* <input
                                            onChange={this.handleChange13}
                                            multiple
                                            name="slider_image[]"
                                            type="file"
                                            id="file1"
                                          /> */}

                                      <Files
                                        className='files-dropzone'
                                        onChange={(e) => this.onFilesChange3(e)}
                                        onError={(e) => this.onFilesError3(e)}
                                        accepts={[
                                          'image/gif',
                                          'image/jpeg',
                                          'image/png',
                                          'image/jpg',
                                          '.svg',
                                        ]}
                                        multiple
                                        dragActiveClassName={
                                          'files-dropzone-active'
                                        }
                                        //maxFileSize={3145757}
                                        // minFileSize={0}
                                        maxFileSize={10000000}
                                        clickable
                                      >
                                        <label htmlFor='file1'>
                                          {this.fileArray.length <= 0 ? (
                                            <img src={File} alt='...' />
                                          ) : (
                                            this.fileArray.map((url, i) => (
                                              <div key={i}>
                                                <img
                                                  style={{
                                                    height: '100px',
                                                  }}
                                                  src={
                                                    this.fileArray.length <= 0
                                                      ? File
                                                      : url
                                                  }
                                                  alt='...'
                                                />
                                              </div>
                                            ))
                                          )}
                                          <span className='status'>
                                            {' '}
                                            {t(
                                              'marketplace.work.create_work_list.Upload'
                                            )}
                                          </span>
                                          <ProgressBar
                                            now={this.state.loaded2}
                                          />
                                        </label>
                                      </Files>
                                      <small className='form-text text-muted'>
                                        {t(
                                          'marketplace.work.create_work_list.file_ext'
                                        )}
                                      </small>
                                      {this.state.slider_image.length === 0 ? (
                                        ''
                                      ) : (
                                        <button
                                          style={{ marginTop: '10px' }}
                                          onClick={this.removeImg3}
                                          className='btn btn-danger'
                                        >
                                          {t(
                                            'marketplace.work.create_work_list.Remove'
                                          )}
                                        </button>
                                      )}
                                      {request_m ? (
                                        <p
                                          style={{
                                            color: 'red',
                                            fontSize: '15px',
                                          }}
                                        >
                                          {' '}
                                          {request_m}{' '}
                                        </p>
                                      ) : (
                                        ''
                                      )}
                                      <small
                                        className='form-text text-muted'
                                        style={{
                                          fontSize: '13px',
                                          marginTop: '10px',
                                        }}
                                      >
                                        {t(
                                          'marketplace.work.create_work_list.request.product_images_text'
                                        )}
                                      </small>
                                      {/* <p style={{ color: "#eb516d " }}>
                                            {this.state.slider_image_err === true
                                              ? "Slider image is required"
                                              : null}
                                          </p> */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-12'>
                              {loading ? (
                                loading
                              ) : (
                                <button
                                  className='btn btn-primary'
                                  onClick={(e) => this.handleFormSubmit(e)}
                                >
                                  {' '}
                                  {t(
                                    'marketplace.work.create_work_list.Submit1'
                                  )}
                                </button>
                              )}
                              <button
                                className='btn btn-gray ml-4'
                                onClick={(e) => this.handlePreviewModal(e)}
                              >
                                {t(
                                  'marketplace.work.create_work_list.request.preview'
                                )}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>

                      <div
                        className={
                          this.state.tender_type === 'Offer'
                            ? 'tab-pane fade show active'
                            : 'tab-pane fade'
                        }
                        id='type-offer'
                        role='tabpanel'
                        aria-labelledby='type-offer'
                      >
                        <form
                          name='type-offer'
                          // onSubmit={
                          //   this.props.match.params.id
                          //     ? this.handleUpdate1
                          //     : this.handleSubmit1
                          // }
                        >
                          <div className='row'>
                            <div className='col-12 col-md-5'>
                              <div className='form-group'>
                                <label htmlFor='title1'>
                                  {t(
                                    'marketplace.work.create_work_list.request.input_title'
                                  )}
                                </label>
                                <input
                                  id='title1'
                                  style={
                                    this.state.title_err1 === true
                                      ? { border: '1px solid #eb516d' }
                                      : {}
                                  }
                                  onChange={this.handleState}
                                  name='title1'
                                  type='text'
                                  className='form-control'
                                  placeholder=''
                                  value={this.state.title1}
                                  required
                                />
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.title_err1 === true
                                    ? `${t(
                                        'marketplace.work.create_work_list.request.title_req'
                                      )} `
                                    : null}
                                </p>
                              </div>
                              <div className='form-group'>
                                <label htmlFor='category1'>
                                  {t(
                                    'marketplace.work.create_work_list.request.category'
                                  )}
                                </label>
                                <select
                                  style={
                                    this.state.categoryId_err1 === true
                                      ? { border: '1px solid #eb516d' }
                                      : {}
                                  }
                                  onChange={this.handleChange_2}
                                  name='categoryId1'
                                  id='category1'
                                  value={this.state.categoryId1}
                                  className='form-control'
                                  required
                                >
                                  <option value=''>
                                    {t(
                                      'marketplace.work.create_work_list.offer.Select'
                                    )}
                                  </option>
                                  {categoryId1}
                                </select>
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.categoryId_err1 === true
                                    ? `${t(
                                        'marketplace.work.create_work_list.request.categoryId_req'
                                      )} `
                                    : null}
                                </p>
                              </div>

                              {/* <div className="form-group">
                                <label htmlFor="budget1">
                                  {t("c_work_list.budget")}
                                </label>
                                <select
                                  style={
                                    this.state.budget_err1 === true
                                      ? { border: "1px solid #eb516d" }
                                      : {}
                                  }
                                  onChange={this.handleState}
                                  name="budget1"
                                  id="budget1"
                                  value={this.state.budget1}
                                  required
                                  className="form-control"
                                >
                                  <option value="">{t("c_work_list.Select")}</option>
                                  <option value="Fixed">{t("c_work_list.Fixed")}</option>
                                  <option value="Hourly">{t("c_work_list.Hourly")}</option>
                                  <option value="per_m2">{t("c_work_list.cost/m2")}</option>
                                </select>
                                <p style={{ color: "#eb516d " }}>
                                  {this.state.budget_err1 === true
                                    ? "Budget is required"
                                    : null}
                                </p>
                              </div> */}
                              <div className='row'>
                                <div className='col-8'>
                                  <div className='form-group'>
                                    <label htmlFor='budget1'>
                                      {t(
                                        'marketplace.work.create_work_list.budget'
                                      )}
                                    </label>
                                    <select
                                      style={
                                        this.state.budget_err1 === true
                                          ? { border: '1px solid #eb516d' }
                                          : {}
                                      }
                                      onChange={this.handleState}
                                      name='budget1'
                                      id='budget1'
                                      value={this.state.budget1}
                                      required
                                      className='form-control'
                                    >
                                      <option value=''>
                                        {t(
                                          'marketplace.work.create_work_list.Select'
                                        )}
                                      </option>
                                      <option value='Fixed'>
                                        {t(
                                          'marketplace.work.create_work_list.Fixed'
                                        )}
                                      </option>
                                      <option value='Hourly'>
                                        {t(
                                          'marketplace.work.create_work_list.Hourly'
                                        )}
                                      </option>
                                      <option value='per_m2'>
                                        {t(
                                          'marketplace.work.create_work_list.cost/m2'
                                        )}
                                      </option>
                                    </select>
                                    {/* <p style={{ color: "#eb516d " }}>
                                  {this.state.budget_err1 === true
                                    ? "Budget is required"
                                    : null}
                                </p> */}
                                  </div>
                                </div>

                                <div className='col-4'>
                                  <div className='form-group'>
                                    <label htmlFor='rate'>
                                      {t(
                                        'marketplace.work.create_work_list.rate1'
                                      )}
                                    </label>
                                    <input
                                      id='rate'
                                      style={
                                        this.state.rate_err === true
                                          ? { border: '1px solid #eb516d' }
                                          : {}
                                      }
                                      onChange={this.handleChangeRate}
                                      name='rate1'
                                      // type="number"
                                      type='text'
                                      maxLength='8'
                                      className='form-control'
                                      placeholder='0'
                                      value={this.state.rate1}
                                      min='0'
                                      required
                                    />
                                    {/* <p style={{ color: "#eb516d " }}>
                                      {this.state.rate_err === true
                                        ? "Rate is required"
                                        : null}
                                    </p> */}
                                  </div>
                                </div>
                              </div>

                              <div className='form-group'>
                                <label htmlFor='availablity'>
                                  {t(
                                    'marketplace.work.create_work_list.availablity'
                                  )}
                                </label>
                                <div className='row'>
                                  <div className='col-6'>
                                    <div
                                      style={
                                        this.state.available_from_err1 === true
                                          ? { border: '1px solid #eb516d' }
                                          : {}
                                      }
                                    >
                                      <Datetime
                                        onChange={(date) =>
                                          this.handleChange_5(date)
                                        }
                                        isValidDate={valid}
                                        name='available_from1'
                                        dateFormat='DD-MM-YYYY'
                                        value={
                                          this.state.available_from1_format
                                        }
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
                                    <p style={{ color: '#eb516d ' }}>
                                      {this.state.available_from_err1 === true
                                        ? `${t(
                                            'marketplace.work.create_work_list.request.available_from_req'
                                          )} `
                                        : null}
                                    </p>
                                  </div>
                                  <div className='col-6'>
                                    <div
                                      style={
                                        this.state.available_to_err1 === true
                                          ? { border: '1px solid #eb516d' }
                                          : {}
                                      }
                                    >
                                      <Datetime
                                        onChange={(date) =>
                                          this.handleChange_6(date)
                                        }
                                        isValidDate={valid3}
                                        name='available_to1'
                                        dateFormat='DD-MM-YYYY'
                                        value={this.state.available_to1_format}
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
                                    <p style={{ color: '#eb516d ' }}>
                                      {this.state.available_to_err1 === true
                                        ? `${t(
                                            'marketplace.work.create_work_list.request.available_to_req'
                                          )} `
                                        : null}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className='form-group'>
                                <label htmlFor='state'>
                                  {t(
                                    'marketplace.work.create_work_list.offer.state_word'
                                  )}
                                </label>
                                <select
                                  onChange={this.ChangeCity}
                                  style={
                                    this.state.state_err1 === true
                                      ? { border: '1px solid #eb516d' }
                                      : {}
                                  }
                                  name='state'
                                  id='state'
                                  value={this.state.state}
                                  className='form-control'
                                  required
                                >
                                  <option value=''>
                                    {t(
                                      'marketplace.work.create_work_list.Select'
                                    )}
                                  </option>
                                  {stateList}
                                </select>
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.state_err1 === true
                                    ? `${t(
                                        'marketplace.work.create_work_list.request.state_r'
                                      )} `
                                    : null}
                                </p>
                              </div>
                              <div className='form-group'>
                                <label htmlFor='city'>
                                  {t(
                                    'marketplace.work.create_work_list.request.city'
                                  )}
                                </label>
                                {/* <select
                                  onChange={this.handleChange_7}
                                  style={
                                    this.state.city_err1 === true
                                      ? { border: "1px solid #eb516d" }
                                      : {}
                                  }
                                  name="city"
                                  id="city"
                                  value={this.state.city1}
                                  className="form-control"
                                >
                                  <option>{t("c_work_list.Select")} 0000 </option>
                                {cityList1}
                                </select> */}

                                <Multiselect
                                  options={this.state.cities} // Options to display in the dropdown
                                  selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                  // onSelect={(e) => this.check(e)} // Function will trigger on select event
                                  selectedValues={this.state.city} // Preselected value to persist in dropdown
                                  onSelect={this.onSelect} // Function will trigger on select event
                                  onRemove={this.onRemove} // Function will trigger on remove event
                                  displayValue='city_identifier' //
                                  emptyRecordMsg={t(
                                    'marketplace.work.create_work_list.offer.No_Options_Available'
                                  )}
                                  placeholder={t(
                                    'marketplace.work.create_work_list.request.Select'
                                  )}
                                  // showCheckbox={true}
                                />
                                {/* <p style={{ color: "#eb516d " }}>
                                  {this.state.city_err1 === true
                                    ? "City is required"
                                    : null}
                                </p> */}
                              </div>
                              {/* <div className="form-group">
                                <label htmlFor="pincode1">
                                  {t("c_material_list.request.pincode")}
                                </label>
                                <input
                                  style={
                                    this.state.pincode_err1 === true
                                      ? { border: "1px solid #eb516d" }
                                      : {}
                                  }
                                  onChange={this.handleState}
                                  name="pincode1"
                                  maxLength="10"
                                  id="pincode1"
                                  type="text"
                                  className="form-control"
                                  placeholder=""
                                  value={this.state.pincode1}
                                  required
                                />
                                <p style={{ color: "#eb516d " }}>
                                  {this.state.pincode_err1 === true
                                    ? "Pincode is required"
                                    : null}
                                </p>
                              </div> */}
                              <div className='form-group'>
                                <label htmlFor='post_expiry_date'>
                                  {t(
                                    'marketplace.work.create_work_list.request.post_expires_in'
                                  )}
                                </label>
                                <div
                                  style={
                                    this.state.post_expiry_date_err1 === true
                                      ? { border: '1px solid #eb516d' }
                                      : {}
                                  }
                                >
                                  <Datetime
                                    onChange={(date) =>
                                      this.handleChange_9(date)
                                    }
                                    isValidDate={valids}
                                    name='post_expiry_date1'
                                    // type="number"
                                    value={this.state.post_expiry_date1}
                                    dateFormat='DD-MM-YYYY'
                                    timeFormat={false}
                                    // closeOnSelect={true}
                                    // type={"date"}
                                    locale={`${
                                      localStorage.getItem('_lng') === 'fi'
                                        ? 'fr-fi'
                                        : 'en-US'
                                    } `}
                                    inputProps={inputPropsDate}
                                    // inputProps={{ placeholder: this.state.post_expiry_date1 !== "Invalid date" ? moment(this.state.post_expiry_date1).format('DD-MM-YYYY') : this.state.post_expiry_date1, type: "number" }}

                                    // inputProps={ inputProps }
                                  />
                                  {/* <Datetime
                                    onChange={(date) => this.handleChange_9(date)}
                                    name="post_expiry_date1"
                                    isValidDate={valids}
                                    value={this.state.post_expiry_date1}
                                    dateFormat={this.state.datepicker_date_format}
                                    // timeFormat={this.state.datepicker_time_format}
                                    type="date"
                                    required
                                    viewMode="days"
                                    timeFormat={false}
                                    locale={`${localStorage.getItem("_lng") === "fi" ? "fr-fi" : 'en-US'} `}
                                    // open
                                    // closeOnSelect={true}
                                    // disableOnClickOutside={false}
                                    inputProps={{ placeholder: date_exp != "Invalid date" ? date_exp : this.state.post_expiry_date1, type: "number" }}
                                  /> */}
                                </div>
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.post_expiry_date_err1 === true
                                    ? t(
                                        'marketplace.work.create_work_list.request.Date_f'
                                      )
                                    : null}
                                </p>
                              </div>

                              <div className='form-group'>
                                <div className='form-check form-check-inline'>
                                  <input
                                    type='checkbox'
                                    className='form-check-input'
                                    id='material2'
                                    checked={
                                      this.state.mat_checked === 1
                                        ? true
                                        : false
                                    }
                                    value='1'
                                    onChange={this.handleCheck}
                                  />
                                  <label
                                    className='form-check-label'
                                    htmlFor='material2'
                                  >
                                    {t(
                                      'marketplace.work.create_work_list.offer.material'
                                    )}
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className='col-12 col-md-7'>
                              <div className='form-group'>
                                <label htmlFor='Desc1'>
                                  {t(
                                    'marketplace.work.create_work_list.request.description'
                                  )}
                                </label>
                                <textarea
                                  style={
                                    this.state.description_err1 === true
                                      ? { border: '1px solid #eb516d' }
                                      : {}
                                  }
                                  onChange={this.handleState}
                                  name='description1'
                                  id='Desc1'
                                  value={this.state.description1}
                                  required
                                  className='form-control'
                                ></textarea>
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.description_err1 === true
                                    ? `${t(
                                        'marketplace.work.create_work_list.request.descrip_req'
                                      )} `
                                    : null}
                                </p>
                              </div>
                              <div className='row'>
                                <div className='col-12 col-sm-6'>
                                  <div className='form-group'>
                                    <label htmlFor='main1'>
                                      {t(
                                        'marketplace.work.create_work_list.request.main'
                                      )}
                                    </label>
                                    <div
                                      className='file-select'
                                      style={
                                        this.state.featured_image_err1 === true
                                          ? { border: '1px solid #eb516d' }
                                          : {}
                                      }
                                    >
                                      {/* <input
                                        onChange={this.handleChange_11}
                                        name="featured_image1"
                                        type="file"
                                        id="main1"
                                      /> */}
                                      <Files
                                        className='files-dropzone'
                                        onChange={(e) => this.onFilesChange5(e)}
                                        onError={(e) => this.onFilesError5(e)}
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
                                        <label htmlFor='main1'>
                                          <img
                                            src={
                                              this.props.match.params.id
                                                ? url +
                                                  '/images/marketplace/material/' +
                                                  this.state.attachment_preview1
                                                : this.state
                                                    .attachment_preview1 !==
                                                  null
                                                ? this.state.attachment_preview1
                                                : File
                                            }
                                            alt=''
                                          />
                                          <span className='status'>
                                            {t(
                                              'marketplace.work.create_work_list.Upload_status'
                                            )}
                                          </span>
                                          <ProgressBar
                                            now={this.state.loaded3}
                                          />
                                        </label>
                                      </Files>
                                      <p
                                        style={{
                                          color: this.state.img_name
                                            ? 'black'
                                            : '#eb516d',
                                          fontSize: '15px',
                                        }}
                                      >
                                        {this.state.file_err_attachment_preview1
                                          ? this.state
                                              .file_err_attachment_preview1
                                          : ''}{' '}
                                      </p>
                                      {this.state.attachment_preview1 ? (
                                        <button
                                          style={{ marginTop: '10px' }}
                                          onClick={this.removeImg_3}
                                          className='btn btn-danger'
                                        >
                                          {t(
                                            'marketplace.work.create_work_list.request.Remove'
                                          )}
                                        </button>
                                      ) : (
                                        ''
                                      )}
                                      {this.state.main_img_validation && (
                                        <div
                                          style={{
                                            color: 'red',

                                            fontSize: '1.4rem',
                                          }}
                                        >
                                          Image required
                                        </div>
                                      )}
                                      <small className='form-text text-muted'>
                                        {t(
                                          'marketplace.work.create_work_list.file_ext'
                                        )}
                                      </small>
                                      {/* <p style={{ color: "#eb516d " }}>
                                        {this.state.featured_image_err1 === true
                                          ? "Featured image is required"
                                          : null}
                                      </p> */}
                                    </div>
                                  </div>
                                </div>
                                <div className='col-12 col-sm-6'>
                                  <div
                                    className='form-group'
                                    style={
                                      this.state.attachment_err1 === true
                                        ? {
                                            // border: "1px solid #eb516d"
                                          }
                                        : {}
                                    }
                                  >
                                    <label htmlFor='attachment1'>
                                      {t(
                                        'marketplace.work.create_work_list.request.attachment'
                                      )}
                                    </label>
                                    <div className='file-select'>
                                      {/* <input
                                        onChange={this.handleChange_12}
                                        type="file"
                                        id="attachment1"
                                      /> */}
                                      <Files
                                        className='files-dropzone'
                                        onChange={(e) => this.onFilesChange6(e)}
                                        onError={(e) => this.onFilesError6(e)}
                                        accepts={[
                                          'image/gif',
                                          'image/jpeg',
                                          '.doc',
                                          '.docx',
                                          'image/png',
                                          'image/jpg',
                                          '.svg',
                                        ]}
                                        multiple={false}
                                        maxFileSize={10000000}
                                        minFileSize={10}
                                        clickable
                                      >
                                        <label
                                          name='attachment'
                                          htmlFor='attachment1'
                                        >
                                          {/* <img src={this.state.attachment1} alt="" /> */}
                                          <img
                                            src={
                                              this.props.match.params.id
                                                ? url +
                                                  '/images/marketplace/material/' +
                                                  this.state.attachment1
                                                : this.state.attachment1 !==
                                                  null
                                                ? this.state.attachment1
                                                : File
                                            }
                                            alt=''
                                          />
                                          <span className='status'>
                                            {t(
                                              'marketplace.work.create_work_list.Upload_status'
                                            )}
                                          </span>
                                          <ProgressBar
                                            now={this.state.loaded4}
                                          />
                                        </label>
                                      </Files>
                                      <p
                                        style={{
                                          color: this.state.img_name
                                            ? 'black'
                                            : '#eb516d',
                                          fontSize: '15px',
                                        }}
                                      >
                                        {this.state.file_err_attachment_img1
                                          ? this.state.file_err_attachment_img1
                                          : ''}{' '}
                                      </p>
                                      {this.state.attachment1 ? (
                                        <button
                                          style={{ marginTop: '10px' }}
                                          onClick={this.removeImg_4}
                                          className='btn btn-danger'
                                        >
                                          {t(
                                            'marketplace.work.create_work_list.request.Remove'
                                          )}
                                        </button>
                                      ) : (
                                        ''
                                      )}
                                      <small className='form-text text-muted'>
                                        {t(
                                          'marketplace.work.create_work_list.request.attachment_text'
                                        )}
                                      </small>
                                      {/* <p style={{ color: "#eb516d " }}>
                                        {this.state.attachment_err1 === true
                                          ? null // "Attachment is required"
                                          : null}
                                      </p> */}
                                    </div>
                                    {this.state.attachment_P ? (
                                      <label htmlFor='attachment1'>
                                        <a
                                          href={
                                            url +
                                            '/images/marketplace/material/' +
                                            this.state.attachment_P
                                          }
                                          target='_blank'
                                          className='attachment'
                                        >
                                          <i className='icon-paperclip'></i>
                                          {this.state.attachment_P}
                                        </a>
                                      </label>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                              <div className='row'>
                                <div className='col-12 col-sm-6'>
                                  <div className='form-group'>
                                    <label>
                                      {t(
                                        'marketplace.work.create_work_list.request.product_images'
                                      )}
                                    </label>
                                    <div
                                      className='file-select'
                                      style={
                                        this.state.slider_image_err1 === true
                                          ? { border: '1px solid #eb516d' }
                                          : {}
                                      }
                                    >
                                      {/* <input
                                        onChange={this.handleChange_13}
                                        multiple
                                        name="slider_image1[]"
                                        type="file"
                                        id="file11"
                                      /> */}
                                      <Files
                                        className='files-dropzone'
                                        onChange={(e) => this.onFilesChange7(e)}
                                        onError={(e) => this.onFilesError7(e)}
                                        accepts={[
                                          'image/gif',
                                          'image/jpeg',
                                          'image/png',
                                          'image/jpg',
                                          '.svg',
                                        ]}
                                        multiple
                                        maxFileSize={10000000}
                                        minFileSize={10}
                                        clickable
                                      >
                                        <label htmlFor='file11'>
                                          {this.fileArray1.length <= 0 ? (
                                            <img src={File} alt='...' />
                                          ) : (
                                            this.fileArray1.map((url, i) => (
                                              <div key={i}>
                                                <img
                                                  style={{
                                                    height: '100px',
                                                  }}
                                                  src={
                                                    this.fileArray1.length <= 0
                                                      ? File
                                                      : url
                                                  }
                                                  alt='...'
                                                />
                                              </div>
                                            ))
                                          )}
                                          <span className='status'>
                                            {t(
                                              'marketplace.work.create_work_list.Upload'
                                            )}
                                          </span>
                                          <ProgressBar
                                            now={this.state.loaded7}
                                          />
                                        </label>
                                      </Files>
                                      <small className='form-text text-muted'>
                                        {t(
                                          'marketplace.work.create_work_list.file_ext'
                                        )}
                                      </small>
                                      {this.state.slider_image1 == '' ? (
                                        ''
                                      ) : (
                                        <button
                                          style={{ marginTop: '10px' }}
                                          onClick={this.removeImg7}
                                          className='btn btn-danger'
                                        >
                                          {t(
                                            'marketplace.work.create_work_list.Remove'
                                          )}
                                        </button>
                                      )}
                                      {request_w ? (
                                        <p
                                          style={{
                                            color: 'red',
                                            fontSize: '15px',
                                          }}
                                        >
                                          {' '}
                                          {request_w}{' '}
                                        </p>
                                      ) : (
                                        ''
                                      )}
                                      <small
                                        className='form-text text-muted'
                                        style={{
                                          fontSize: '13px',
                                          marginTop: '10px',
                                        }}
                                      >
                                        {t(
                                          'marketplace.work.create_work_list.request.product_images_text'
                                        )}
                                      </small>
                                      <p style={{ color: '#eb516d ' }}>
                                        {this.state.slider_image_err1 === true
                                          ? 'Slider image is required'
                                          : null}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-12'>
                              {loading ? (
                                loading
                              ) : (
                                <button
                                  onClick={(e) => this.handleFormSubmit1(e)}
                                  className='btn btn-success'
                                >
                                  {t(
                                    'marketplace.work.create_work_list.Submit'
                                  )}
                                </button>
                              )}
                              <button
                                className='btn btn-gray  ml-4 mt-3'
                                onClick={(e) => this.handlePreviewModal(e)}
                              >
                                {t(
                                  'marketplace.work.create_work_list.request.pre'
                                )}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>

                      {/* <button
                        onClick={this.hiddenFields}
                        className="btn btn-gray mb-md-0 mb-3 mr-4"
                        data-toggle="modal"
                        data-target="#preview-info"
                      >
                        {t("c_material_list.request.preview")}
                      </button> */}
                    </div>
                  </div>

                  <PDFView
                    tender_type={this.state.tender_types}
                    preview_array={preview_array}
                    show={this.state.isPerviewModal}
                    handleClose={() => this.setState({ isPerviewModal: false })}
                    // userInfo={""}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withTranslation()(Createworklist);
