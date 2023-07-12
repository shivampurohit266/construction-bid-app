import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../shared/Header';
import Sidebar from '../shared/Sidebar';
import File from '../../images/file-icon.png';
import { Helper, url } from '../../helper/helper';
import Alert from 'react-bootstrap/Alert';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import Spinner from 'react-bootstrap/Spinner';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Datetime from 'react-datetime';
import { Prompt } from 'react-router';
import { Multiselect } from 'multiselect-react-dropdown';
import SweetAlert from 'react-bootstrap-sweetalert';
import Files from 'react-files';
// import CurrencyFormat from 'react-currency-format';
import PDFView from './models/material_model';
import 'moment/locale/fi';
// import 'moment/locale/en';
import Breadcrumb from '../shared/Breadcrumb';
import { getData, postDataWithToken } from '../../helper/api';

const lest = [];

const rx_live = /^[+-]?\d*(?:[,.]\d*)?$/;

class Createmateriallist extends Component {
  fileObj = [];
  fileArray = [];
  files = [];

  fileObj1 = [];
  fileArray1 = [];
  files1 = [];
  _isMounted = false;
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit1 = this.handleSubmit1.bind(this);
    this.loadCategory = this.loadCategory.bind(this);
    this.loadState = this.loadState.bind(this);
    this.loadConfig = this.loadConfig.bind(this);

    this.state = {
      main_img_validation: false,
      title: '',
      title1: '',
      title_err: false,
      title1_err: false,
      categoryId: '',
      categoryId1: '',
      categoryId_err: false,
      state_err: false,
      state_err1: false,
      categoryId_err1: false,
      productcat: [],
      //productcat1: [],
      cities: [],
      cities1: [],
      quantity: '',
      quantity1: '',
      quantity_err: false,
      quantity_err1: false,
      unit: 'kg',
      unit1: 'kg',
      unit_err: false,
      unit_err1: false,
      city: [],
      state: '',
      states: [],
      states1: [],
      city_err: false,
      city_err1: false,
      cost_per_unit: '',
      cost_per_unit1: '',
      cost_per_unit_err: false,
      cost_per_unit_err1: false,
      warranty: '',
      warranty1: '',
      warranty_err: false,
      warranty_err1: false,
      warranty_type: 1,
      pincode: '',
      pincode1: '',
      pincode_err: false,
      pincode_err1: false,
      post_expiry_date: '',
      // moment().add(1, 'days').format('DD-MM-YYYY HH:mm:ss)'
      post_expiry_date1: '',
      // moment().add(1, 'days').format('DD-MM-YYYY HH:mm:ss')
      upd_post_expiry_date: '',
      post_expiry_date_err: false,
      post_expiry_date_err1: false,
      description: '',
      description1: '',
      description_err: '',
      description_err1: '',
      featured_image: null,
      featured_image1: null,
      featured_image_err: null,
      featured_image_err1: null,
      attachment_img: null,
      attachment: null,
      attachment_P: null,
      attachment1: null,
      attachment_img1: null,
      attachment_err: null,
      attachment_err1: null,
      slider_image: [],
      slider_image1: [],
      attachment_img1: null,
      slider_image_err: false,
      slider_image_err1: false,
      attachment_preview: null,
      attachment_preview1: null,
      slider_image_preview: [null],
      slider_image_preview1: [null],
      delivery_type: '',
      delivery_type1: '',
      delivery_cost: [],
      delivery_cost1: [],
      delivery_type_err: false,
      delivery_type_err1: false,
      delivery_cost_err: false,
      delivery_cost_err1: false,
      checked: false,
      work_checked: 0,
      errors: [],
      show_errors: false,
      show_msg: false,
      loading: false,
      loaded: 0,
      loaded_: 0,
      loaded1: 0,
      loaded_1: 0,
      loaded2: 0,
      loaded_2: 0,
      isPerviewModal: false,
      configs: [],
      row_phase: [],
      datepicker_date_format: '',
      datepicker_time_format: '',
      success: false,
      tender_type: 'Request',
      // redirect_page:true,
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
    this._isMounted = true;
    if (this._isMounted) {
      if (this.props.match.params.id) {
        this.loadData();
      }
      this.loadCategory();
      //this.loadCategory1();
      this.loadState();
      //this.loadState1();
      this.loadConfig();

      this.interval = setInterval(() => {
        this.checkallfields();
      }, 1000);
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.interval);
  }

  loadData = async () => {
    const token = await localStorage.getItem('token');
    await getData(
      `${url}/api/material-offer-detail/${this.props.match.params.id}`,
      token
    )
      .then((result) => {
        const { data } = result;
        console.log(data);
        if (data[0].tender_type === 'Request') {
          this.setState({
            title: data[0].tender_title,
            categoryId: data[0].tender_category_id,
            quantity: data[0].tender_quantity,
            description: data[0].tender_description,
            unit: data[0].tender_unit,
            city: data[0].tender_city_id,
            state: data[0].city_state_id,
            pincode: data[0].tender_pincode,
            work_checked: data[0].extra, // extra
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
            description1: data[0].tender_description,
            unit1: data[0].tender_unit,
            city: data[0].tender_city_id,
            state: data[0].city_state_id,
            cost_per_unit1: data[0].tender_cost_per_unit,
            pincode1: data[0].tender_pincode,
            row_phase: data[0].tender_delivery_type_cost,
            work_checked: data[0].extra,
            post_expiry_date1: moment(data[0].tender_expiry_date).format(
              'DD-MM-YYYY HH:mm:ss'
            ),
            upd_post_expiry_date: data[0].tender_expiry_date,
            featured_image1: data[0].tender_featured_image,
            attachment1: data[0].tender_attachment,
            attachment_preview1: data[0].tender_featured_image,
            attachment_P: data[0].tender_attachment,
            warranty1: data[0].tender_warranty,
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
        //console.log(err);
      });
  };

  addDelivery = (event) => {
    event.preventDefault();
    if (this.state.delivery_type1.length > 0 && this.state.delivery_cost1 > 0) {
      let row_phase = this.state.row_phase;
      let keys = ['type', 'cost'];
      let gg =
        `${this.state.delivery_type1},${this.state.delivery_cost1}`.split(',');
      let result = {};

      var index = row_phase.findIndex(function (obj) {
        return obj.type === gg[0];
      });
      if (index === -1) {
        // Object with the specific type not found.
        keys.forEach((key, i) => (result[key] = gg[i]));
        row_phase.push(result);
        this.setState({ row_phase: row_phase });
      }
    }
  };

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
    let lang = await localStorage.getItem('_lng');
    await getData(`${url}/api/category/${lang}`, token)
      .then((result) => {
        this.setState({ productcat: result.data.data });
      })
      .catch((err) => {
        console.log(err.response);
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
        console.log(err.response);
      });
  };

  removeImg = (event) => {
    event.preventDefault();
    this.fileArray = [];
    this.files = [];
    this.setState({ slider_image: [], loaded2: 0, request_m: '' });
  };

  handleState = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleState1 = (e) => {
    if (rx_live.test(e.target.value))
      // const { name, value } = event.target;
      this.setState({ quantity1: e.target.value });
  };

  handleChange1 = (event) => {
    this.setState({ title: event.target.value });
  };
  // redirect_page:true,
  handleChange2 = (event) => {
    this.setState({ categoryId: event.target.value });
  };
  handleChange_2 = (event) => {
    this.setState({ categoryId1: event.target.value });
  };
  handleChange13 = (event) => {
    // if (event.target.value !== "--Select--") {
    this.setState({ delivery_type1: event.target.value });
    // }
  };
  handleChange15 = (event) => {
    this.setState({ cost_per_unit: event.target.value });
  };
  handleChange16 = (event) => {
    this.setState({ delivery_cost1: event.target.value });
  };
  handleChange3 = (event) => {
    if (rx_live.test(event.target.value))
      this.setState({ quantity: event.target.value });
    // this.setState({ depositedAmount : evt.target.value });
  };
  handleState_cost = (e) => {
    if (rx_live.test(e.target.value))
      this.setState({ cost_per_unit1: e.target.value });
  };
  handleChange4 = (event) => {
    this.setState({ unit: event.target.value });
  };
  handleChange_4 = (event) => {
    this.setState({ unit1: event.target.value });
  };
  handleChange5 = (event) => {
    this.setState({ city: event.target.value });
  };
  ChangeCity = async (event) => {
    this.setState({ cities: [], state: event.target.value });
    const token = localStorage.getItem('token');
    let lang = localStorage.getItem('_lng');
    await getData(`${url}/api/cityId/${event.target.value}/${lang}`, token)
      .then((result) => {
        if (result?.data.data) {
          const d = result.data.data.filter((x) => x.city_id);
          this.setState({ cities: d });
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  ChangeCityByStateID = async (state) => {
    this.setState({ cities: [] });
    const token = localStorage.getItem('token');
    let lang = localStorage.getItem('_lng');
    await getData(`${url}/api/cityId/${state}/${lang}`, token)
      .then((result) => {
        this.setState({ cities: result?.data.data });
      })
      .catch((err) => {
        //console.log(err.response);
      });
  };

  handleChange6 = (event) => {
    this.setState({ pincode: event.target.value });
  };
  handleChange14 = (event) => {
    this.setState({ warranty: event.target.value });
  };
  handleChange7 = (event) => {
    // //console.log("event.target.valuee", event)
    this.setState({
      post_expiry_date: event._d,
      upd_post_expiry_date: event._d,
    });
  };
  handleChange_7 = (event) => {
    this.setState({
      post_expiry_date1: event._d,
      upd_post_expiry_date: event._d,
    });
  };
  handleChange8 = (event) => {
    this.setState({ description: event.target.value });
  };

  removeImg_1 = () => {
    this.setState({
      attachment_preview: null,
      featured_image: [],
      loaded: 0,
      file_err_attachment_preview: '',
    });
  };

  onFilesChange = (files) => {
    console.log(files[0]);
    if (files[0]) {
      this.setState({
        featured_image: files[0],
        loaded: 50,
        featured_image_err: false,
        attachment_preview: URL.createObjectURL(files[0]),
        file_err_attachment_preview: '',
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

  removeImg_2 = () => {
    this.setState({
      attachment_preview1: null,
      loaded_: 0,
      file_err_attachment_preview1: '',
    });
  };

  onFilesChange5 = (files) => {
    if (files[0]) {
      this.setState({
        featured_image1: files[0],
        loaded_: 50,
        featured_image_err1: false,
        attachment_preview1: URL.createObjectURL(files[0]),
        file_err_attachment_preview1: '',
        main_img_validation: false,
      });
      if (this.state.loaded_ <= 100) {
        setTimeout(
          function () {
            this.setState({ loaded_: 100 });
          }.bind(this),
          2000
        ); // wait 2 seconds, then reset to false
      }
    }
  };

  onFilesError5 = (error, file) => {
    // //console.log(file, 'error code ' + error.code + ': ' + error.message)
    this.setState({
      file_err_attachment_preview1: error.message,
      // loaded3: 0,
    });
  };

  removeImg0 = () => {
    this.setState({
      attachment: '',
      file_err_attachment_img: '',
      attachment_img: null,
      loaded1: 0,
    });
  };

  onFilesChange1 = (files) => {
    if (files[0]) {
      this.setState({
        attachment: files[0],
        loaded1: 50,
        attachment_err: false,
        file_err_attachment_img: '',
        attachment_img: URL.createObjectURL(files[0]),
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
    //console.log('error code ' + error.code + ': ' + error.message)
    this.setState({
      file_err_attachment_img: error.message,
    });
  };

  removeImg_3 = () => {
    this.setState({
      attachment_img1: null,
      loaded_1: 0,
      attachment_preview: null,
      file_err_attachment_img1: '',
    });
  };
  onFilesChange6 = (files) => {
    if (files[0]) {
      this.setState({
        attachment1: files[0],
        loaded_1: 50,
        attachment_err1: false,
        attachment_img1: URL.createObjectURL(files[0]),
        file_err_attachment_img1: '',
      });
      if (this.state.loaded_1 <= 100) {
        setTimeout(
          function () {
            this.setState({ loaded_1: 100 });
          }.bind(this),
          2000
        ); // wait 2 seconds, then reset to false
      }
    }
  };

  onFilesError6 = (error, file) => {
    // //console.log('error code ' + error.code + ': ' + error.message)
    this.setState({
      file_err_attachment_img1: error.message,
    });
  };

  onFilesChange3 = (files) => {
    // //console.log(files)
    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        this.files.push(file);
      });
      // this.files.push(files[0])
      this.fileObj = [];
      this.fileArray = [];
      this.fileObj.push(this.files);
      for (let i = 0; i < this.fileObj[0].length; i++) {
        this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]));
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
    // //console.log('error code ' + error.code + ': ' + error.message)
    this.setState({
      request_m: error.message,
      // loaded2: 0
    });
  };

  removeImg1 = (event) => {
    event.preventDefault();
    this.fileArray1 = [];
    this.files1 = [];
    this.setState({
      slider_image1: [],
      loaded_2: 0,
      slider_image_preview1: [],
      request_w: '',
    });
  };

  onFilesChange7 = (files) => {
    // //console.log(files)
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
      // //console.log("this.fileArray1", this.fileArray1);
      this.setState({
        slider_image1: this.files1,
        loaded_2: 50,
        // slider_image_err1: false,
        slider_image_preview1: this.fileArray1,
        request_w: '',
      });
      if (this.state.loaded_2 <= 100) {
        setTimeout(
          function () {
            this.setState({ loaded_2: 100 });
          }.bind(this),
          2000
        ); // wait 2 seconds, then reset to false
      }
    }
  };

  onFilesError7 = (error, file) => {
    this.setState({ request_w: error.message });
    // //console.log('error code ' + error.code + ': ' + error.message)
  };

  handleCheck = (event) => {
    this.setState({ checked: !this.state.checked }, () => {
      if (this.state.checked) {
        this.setState({ work_checked: 2 });
      } else {
        this.setState({ work_checked: 0 });
      }
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    this.setState({
      request_m: '',
      file_err_attachment_img: '',
      title_err: false,
      quantity_err: false,
      pincode_err: false,
      post_expiry_date_err: false,
      description_err: false,
      categoryId_err: false,
      state_err: false,
      unit_err: false,
      city_err: false,
      cost_per_unit_err: false,
      delivery_type_err: false,
      delivery_cost_err: false,
      warranty_err: false,
    });
    if (this.state.title.length <= 0) {
      this.setState({ title_err: true });
    }
    if (this.state.quantity.length <= 0) {
      this.setState({ quantity_err: true });
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

    if (this.state.categoryId == '--Select--' || this.state.categoryId == '') {
      this.setState({ categoryId_err: true });
    }
    if (this.state.state == '') {
      this.setState({ state_err: true });
    }
    if (this.state.unit == 'select' || this.state.unit == '') {
      this.setState({ unit_err: true });
    }
    this.validateImg();
    const date = moment(this.state.post_expiry_date).format(
      'DD-MM-YYYY h:mm:ss'
    );

    const token = await localStorage.getItem('token');
    this.setState({ loading: true });
    const data = new FormData();
    data.set('title', this.state.title);
    data.set('categoryId', this.state.categoryId);
    data.set('quantity', this.state.quantity);
    data.set('description', this.state.description);
    data.set('unit', this.state.unit);
    data.set('city', lest);
    data.set('state', this.state.state);
    data.set('pincode', this.state.pincode);
    data.set('extra', this.state.work_checked);
    data.set(
      'post_expiry_date',
      date != 'Invalid date' ? date : this.state.post_expiry_date
    );
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
        .post(`${url}/api/material-request/create`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        // await postDataWithToken(`${url}/api/material-request/create`, data, token)
        .then((res) => {
          //console.log(res);
          this.setState({
            file_err_attachment_preview: '',
            attachment_img1: '',
            attachment_img: '',
            redirect_page: false,
            show_msg: true,
            loading: false,
            state: '',
            title: '',
            categoryId: '',
            quantity: '',
            description: '',
            unit: '',
            city: '',
            pincode: '',
            work_checked: 0,
            post_expiry_date: '',
            featured_image: null,
            attachment_preview: null,
            loaded: 0,
            loaded1: 0,
            loaded2: 0,
            attachment: null,
            slider_image: [],
            success: 'Your Request have been submit succesfully',
            redirect_page: false,
            redirect_page1: false,
          });
          this.fileArray = [];
          this.myRef.current.scrollTo(0, 0);
          // this.props.history.push("/material-list");
        })
        .catch((err) => {
          this.setState({
            loading: false,
          });
          this.myRef.current.scrollTo(0, 0);
        });
  };

  handleUpdate = async (event) => {
    event.preventDefault();
    this.setState({
      request_m: '',
      file_err_attachment_img: '',
      title_err: false,
      quantity_err: false,
      pincode_err: false,
      post_expiry_date_err: false,
      description_err: false,
      categoryId_err: false,
      unit_err: false,
      city_err: false,
      state_err: false,
      // featured_image_err: false,
      // attachment_err: false,
      //slider_image_err: false,
      cost_per_unit_err: false,
      delivery_type_err: false,
      delivery_cost_err: false,
      warranty_err: false,
    });
    if (this.state.title.length <= 0) {
      this.setState({ title_err: true });
    }
    if (this.state.quantity.length <= 0) {
      this.setState({ quantity_err: true });
    }

    if (
      this.state.post_expiry_date == '' ||
      this.state.post_expiry_date == undefined
    ) {
      this.setState({ post_expiry_date_err: true });
    }

    if (this.state.state == '') {
      this.setState({ state_err: true });
    }
    if (this.state.categoryId == '--Select--' || this.state.categoryId == '') {
      this.setState({ categoryId_err: true });
    }
    if (this.state.unit == 'select' || this.state.unit == '') {
      this.setState({ unit_err: true });
    }

    const token = await localStorage.getItem('token');
    this.setState({ loading: true });
    const data = new FormData();
    data.set('title', this.state.title);
    data.set('categoryId', this.state.categoryId);
    data.set('quantity', this.state.quantity);
    data.set('description', this.state.description);
    data.set('unit', this.state.unit);
    data.set('city', this.state.city);
    data.set('state', this.state.state);
    data.set('pincode', this.state.pincode);
    data.set('extra', this.state.work_checked);
    data.set('post_expiry_date', moment(this.state.upd_post_expiry_date));
    data.append('featured_image', this.state.featured_image);
    data.append('attachment', this.state.attachment);

    for (const key of Object.keys(this.state.slider_image)) {
      data.append('slider_image[]', this.state.slider_image[key]);
    }
    await postDataWithToken(
      `${url}/api/material-request/update/${this.props.match.params.id}`,
      data,
      token
    )
      .then((res) => {
        // //console.log(res);
        this.myRef.current.scrollTo(0, 0);

        this.setState({
          success: 'Your Request have been submit succesfully',
          pincode: '',
          redirect_page: false,
          title: '',
          city: '',
          description: '',
          quantity: '',
          state: '',
          categoryId: '',
        });
        // this.props.history.push("/material-list");
      })
      .catch((err) => {
        //console.log(err.response);
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
    this.props.history.push('/material-list');
  };

  // material request

  // material offer
  handleSubmit1 = async (event) => {
    event.preventDefault();
    this.setState({
      request_w: '',
      file_err_attachment_img1: '',
      file_err_attachment_preview1: '',
      title1_err: false,
      quantity_err1: false,
      pincode_err1: false,
      post_expiry_date_err1: false,
      description_err1: false,
      categoryId_err1: false,
      unit_err1: false,
      state_err1: false,
      cost_per_unit_err1: false,
      delivery_type_err1: false,
      delivery_cost_err1: false,
      warranty_err1: false,
    });
    if (this.state.title1.length <= 0) {
      this.setState({ title1_err: true });
    }
    if (this.state.quantity1.length <= 0) {
      this.setState({ quantity_err1: true });
    }
    if (this.state.state.length <= 0) {
      this.setState({ state_err: true });
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
    if (
      this.state.categoryId1 == '--Select--' ||
      this.state.categoryId1 == ''
    ) {
      this.setState({ categoryId_err1: true });
    }

    if (this.state.unit1 == 'select' || this.state.unit1 == '') {
      this.setState({ unit_err1: true });
    }

    if (this.state.cost_per_unit1.length <= 0) {
      this.setState({ cost_per_unit_err1: true });
    }
    if (
      this.state.delivery_type1 == '--Select--' ||
      this.state.delivery_type1 == ''
    ) {
      this.setState({ delivery_type_err1: true });
    }
    if (this.state.delivery_cost1.length <= 0) {
      this.setState({ delivery_cost_err1: true });
    }
    if (this.state.warranty1.length <= 0) {
      this.setState({ warranty_err1: true });
    }

    this.validateImg();

    const date = moment(this.state.post_expiry_date1).format(
      'DD-MM-YYYY h:mm:ss'
    );
    const token = await localStorage.getItem('token');
    this.setState({ loading: true });
    const data = new FormData();
    data.set('title', this.state.title1);
    data.set('categoryId', this.state.categoryId1);
    data.set('quantity', this.state.quantity1);
    data.set('description', this.state.description1);
    data.set('unit', this.state.unit1);
    data.set('cost_per_unit', this.state.cost_per_unit1);
    data.set('warranty', this.state.warranty1);
    data.set('delivery_type', this.state.delivery_type1);
    data.set('delivery_cost[]', this.state.delivery_cost1);
    data.set('tender_delivery_type_cost', JSON.stringify(this.state.row_phase));
    data.set('city', lest);
    data.set('state', this.state.state);
    data.set('pincode', this.state.pincode1);
    data.set('extra', this.state.work_checked);
    data.set(
      'post_expiry_date',
      date != 'Invalid date' ? date : this.state.post_expiry_date1
    );
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
        .post(`${url}/api/material-offers/create`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          //console.log(res);
          this.setState({
            attachment1: '',
            slider_image1: '',
            // attachment1: null,
            show_msg: true,
            loading: false,
            title1: '',
            categoryId1: '',
            state: '',
            quantity1: '',
            description1: '',
            unit1: '',
            city: '',
            cost_per_unit1: '',
            pincode1: '',
            delivery_cost1: [],
            delivery_type1: [],
            work_checked1: 0,
            post_expiry_date1: '',
            featured_image1: null,
            attachment_preview1: null,
            loaded_: 0,
            warranty1: '',
            loaded_1: 0,
            loaded_2: 0,
            attachment_img1: '',
            success: 'Your Request have been submit succesfully',
            redirect_page: false,
            redirect_page1: false,
            slider_image1: [],
          });
          this.fileArray1 = [];
          this.myRef.current.scrollTo(0, 0);
          // this.props.history.push("/material-list");
        })
        .catch((err) => {
          // Object.entries(err.response.data.error).map(([key, value]) => {
          //   this.setState({ errors: err.response.data.error });
          // }); show_errors: true,
          this.setState({ loading: false });
          this.myRef.current.scrollTo(0, 0);
        });
  };

  handleUpdate1 = async (event) => {
    event.preventDefault();
    this.setState({
      request_w: '',
      file_err_attachment_img1: '',
      file_err_attachment_preview1: '',
      title1_err: false,
      quantity_err1: false,
      pincode_err1: false,
      post_expiry_date_err1: false,
      description_err1: false,
      categoryId_err1: false,
      unit_err1: false,
      state_err1: false,
      cost_per_unit_err1: false,
      delivery_type_err1: false,
      delivery_cost_err1: false,
      warranty_err1: false,
    });
    if (this.state.title1.length <= 0) {
      this.setState({ title1_err: true });
    } else {
      this.setState({ title1_err: false });
    }
    if (this.state.quantity1.length <= 0) {
      this.setState({ quantity_err1: true });
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
    if (this.state.state.length <= 0) {
      this.setState({ state_err1: true });
    }
    if (
      this.state.categoryId1 == '--Select--' ||
      this.state.categoryId1 == ''
    ) {
      this.setState({ categoryId_err1: true });
    }
    if (this.state.unit1 == 'select' || this.state.unit1 == '') {
      this.setState({ unit_err1: true });
    }

    if (this.state.cost_per_unit1.length <= 0) {
      this.setState({ cost_per_unit_err1: true });
    }
    if (
      this.state.delivery_type1 == '--Select--' ||
      this.state.delivery_type1 == ''
    ) {
      this.setState({ delivery_type_err1: true });
    }
    if (this.state.delivery_cost1.length <= 0) {
      this.setState({ delivery_cost_err1: true });
    }
    if (this.state.warranty1.length <= 0) {
      this.setState({ warranty_err1: true });
    }
    const token = await localStorage.getItem('token');
    this.setState({ loading: true });
    const data = new FormData();
    data.set('title', this.state.title1);
    data.set('categoryId', this.state.categoryId1);
    data.set('budget', this.state.budget);
    data.set('quantity', this.state.quantity1);
    data.set('description', this.state.description1);
    data.set('unit', this.state.unit1);
    data.set('cost_per_unit', this.state.cost_per_unit1);
    data.set('warranty', this.state.warranty1);
    data.set('delivery_type', this.state.delivery_type1);
    data.set('delivery_cost[]', this.state.delivery_cost1);
    data.set('tender_delivery_type_cost', JSON.stringify(this.state.row_phase));
    data.set('city', this.state.city);
    data.set('state', this.state.state);
    data.set('pincode', this.state.pincode1);
    data.set('extra', this.state.work_checked);
    data.set('post_expiry_date', moment(this.state.upd_post_expiry_date));
    data.append('featured_image', this.state.featured_image1);
    data.append('attachment', this.state.attachment1);

    for (const key of Object.keys(this.state.slider_image1)) {
      data.append('slider_image[]', this.state.slider_image1[key]);
    }
    await postDataWithToken(
      `${url}/api/material-offer/update/${this.props.match.params.id}`,
      data,
      token
    )
      .then((res) => {
        //console.log(res);
        // if (res.data.status === 200) {

        this.myRef.current.scrollTo(0, 0);
        this.setState({
          attachment_img1: '',
          success: 'Your Request have been submit succesfully',
          redirect_page: false,
        });
        // }

        // if (res.data.status === 401) {
        //   this.setState({
        //     message: res.data.message
        //   })
        // }
        // this.props.history.push("/material-list");
      })
      .catch((err) => {
        //console.log(err.response);
        this.setState({
          loading: false,
        });
        this.myRef.current.scrollTo(0, 0);
      });

    // Display the key/value pairs
    // //console.log(JSON.stringify(this.state.row_phase));
    // for (var pair of data.entries()) {
    //   //console.log(pair[0] + ", " + pair[1]);
    // }
  };

  onSelect(selectedList, selectedItem) {
    lest.push(selectedItem.city_id);
  }

  onRemove(selectedList, removedItem) {
    const d = lest.indexOf(removedItem.city_id);
    lest.splice(d, 1);
  }

  checkallfields() {
    if (
      this.state.title ||
      this.state.categoryId ||
      this.state.quantity ||
      this.state.state ||
      this.state.city.length > 0 ||
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
      this.state.quantity1 ||
      this.state.delivery_type1.length > 0 ||
      this.state.description1 ||
      this.state.city.length > 0 ||
      this.state.warranty1
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
  handleOnchange = (val) => {
    this.setState({
      city: val,
    });
  };

  offer_dataClear = () => {
    this.setState({
      title: '',
      title1: '',
      categoryId: '',
      quantity: '',
      quantity1: '',
      description: '',
      description1: '',
      unit: '',
      unit1: '',
      city: '',
      state: '',
      pincode: '',
      pincode1: '',
      work_checked: '',
      cost_per_unit1: '',
      post_expiry_date: '',
      post_expiry_date1: '',
      attachment_preview: '',
      attachment_preview1: '',
      featured_image: '',
      attachment_img: '',
      attachment: '',
      categoryId: '',
      delivery_type1: '',
      delivery_type: '',
      cost_per_unit: '',
      delivery_cost1: '',
      warranty: '',
      warranty1: '',
      slider_image: '',
      unit: '',
    });
  };

  //     work_checked: this.state.work_checked,
  //     cost_per_unit: this.state.cost_per_unit1,
  //     warranty: this.state.warranty,
  //     delivery_type: this.state.delivery_type1,
  //     delivery_cost: this.state.delivery_cost1,
  //     warranty: this.state.warranty ? this.state.warranty : this.state.warranty1,

  request_dataClear = () => {
    this.setState({
      title1: '',
      categoryId1: '',
      quantity1: '',
      description1: '',
      unit1: '',
      state: '',
      pincode1: '',
      post_expiry_date1: '',
      attachment_preview1: '',
      categoryId1: '',
      slider_image1: '',
      featured_image: '',
      delivery_type: '',
      cost_per_unit: '',
      warranty: '',
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
    console.log(e);
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

    var yesterday = moment();
    function valid(current) {
      if (current) {
        return current.isAfter(yesterday);
      }
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
          {t('success.mat_ins')}
        </Alert>
      );
    }
    if (this.state.loading === true) {
      loading = (
        <Spinner animation='border' role='status'>
          <span className='sr-only'> {t('success.Loading')} </span>
        </Spinner>
      );
    }

    const categoryId = this.state.productcat
      ? this.state.productcat.map(({ category_id, category_name }, index) => (
          <option key={index} value={category_id}>
            {category_name}
          </option>
        ))
      : [];
    const categoryId1 = this.state.productcat
      ? this.state.productcat.map(({ category_id, category_name }, index) => (
          <option key={index} value={category_id}>
            {category_name}
          </option>
        ))
      : [];

    const stateList = this.state.states
      ? this.state.states.map(({ state_id, state_name }, index) => {
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
    const stateList1 = this.state.states1
      ? this.state.states1.map(({ state_id, state_identifier }, index) => {
          if (state_id !== undefined) {
            return (
              <>
                {' '}
                {state_identifier === 'All regions' ? (
                  <option key={index} value={state_id}>
                    {' '}
                    {t('list_details.All_regions')}{' '}
                  </option>
                ) : (
                  <option key={index} value={state_id}>
                    {' '}
                    {state_identifier}{' '}
                  </option>
                )}{' '}
              </>
            );
          }
        })
      : [];

    const cityList = this.state.cities
      ? this.state.cities.map(({ city_id, city_identifier }, index) => {
          if (city_id !== undefined) {
            return (
              <option key={index} value={city_id}>
                {city_identifier}
              </option>
            );
          }
        })
      : [];

    const cityList1 = this.state.cities1
      ? this.state.cities1.map(({ city_id, city_identifier }, index) => {
          if (city_id !== undefined) {
            return (
              <option key={index} value={city_id}>
                {city_identifier}
              </option>
            );
          }
        })
      : [];

    const { success, request_m, request_w } = this.state;

    const date_0 = this.state.post_expiry_date
      ? moment(this.state.post_expiry_date).format('DD-MM-YYYY HH:mm:ss')
      : moment(this.state.post_expiry_date).format('DD-MM-YYYY HH:mm:ss');

    const date_exp = this.state.post_expiry_date1
      ? moment(this.state.post_expiry_date1).format('DD-MM-YYYY HH:mm:ss')
      : '';
    const category_Id = this.state.productcat?.filter(
      (x) => x.category_id === Number(this.state.categoryId)
    );

    const category_Id1 = this.state.productcat?.filter(
      (x) => x.category_id === Number(this.state.categoryId1)
    );

    const state_Id = this.state.states?.filter(
      (x) => x.state_id === Number(this.state.state)
    );
    const state_Id1 = this.state.states?.filter(
      (x) => x.state_id === Number(this.state.state)
    );

    // //console.log(this.state.states, this.state.state1 , state_Id1[0]?.state_identifier);
    const preview_array = {
      title: this.state.title ? this.state.title : this.state.title1,
      quantity: this.state.quantity
        ? this.state.quantity
        : this.state.quantity1,
      description: this.state.description
        ? this.state.description
        : this.state.description1,
      unit: this.state.unit ? this.state.unit : this.state.unit1,
      pincode: this.state.pincode ? this.state.pincode : this.state.pincode1,
      post_expiry_date: this.state.post_expiry_date
        ? this.state.post_expiry_date
        : this.state.post_expiry_date1,
      featured_image: this.state.attachment_preview
        ? this.state.attachment_preview
        : this.state.attachment_preview1,
      // attachment: this.state.attachment_img ,
      // slider_image: this.fileArray,
      // categoryId : category_Id[0]?.category_name ? category_Id[0]?.category_name : category_Id1 ? category_Id1[0]?.category_name : "",
      // state: state_Id[0]?.state_identifier ? state_Id[0]?.state_identifier : state_Id1[0]?.state_identifier ,
      work_checked: this.state.work_checked,
      cost_per_unit: this.state.cost_per_unit1,
      warranty: this.state.warranty,
      delivery_type: this.state.delivery_type1,
      delivery_cost: this.state.delivery_cost1,
      warranty: this.state.warranty
        ? this.state.warranty
        : this.state.warranty1,
    };
    const { Login_user_permissions } = this.state;

    const filter_marketplace_offer =
      Login_user_permissions.length > 0
        ? JSON.parse(Login_user_permissions)?.filter(
            (x) => x === 'marketplace_materials_create_offer'
          )
        : [];

    const Login_user_role = localStorage.getItem('Login_user_role')
      ? localStorage.getItem('Login_user_role')
      : '';
    console.log(loading);
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
          ' '
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
              {t('marketplace.material.create_material_list.request.title')}
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
                  // title={t("list_details.success_cret")}
                  title={t('login.SuccessPopup')}
                  onConfirm={this.onConfirmError}
                >
                  {/* {t("list_details.success")}  */}
                </SweetAlert>
              ) : (
                ''
              )}

              <div className='container'>
                <h3 className='head3'>
                  {t('marketplace.material.create_material_list.request.title')}
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
                                    onClick={this.offer_dataClear}
                                  >
                                    {t(
                                      'marketplace.material.create_material_list.request.request'
                                    )}
                                  </a>
                                </li>
                              ) : filter_marketplace_offer[0] ===
                                'marketplace_materials_create_offer' ? (
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
                                      onClick={this.offer_dataClear}
                                    >
                                      {t(
                                        'marketplace.material.create_material_list.offer.offer'
                                      )}
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
                                      this.offer_dataClear();
                                      this.getTenderType('Request');
                                    }}
                                  >
                                    {t(
                                      'marketplace.material.create_material_list.request.request'
                                    )}
                                  </a>
                                </li>
                                {filter_marketplace_offer[0] ===
                                'marketplace_materials_create_offer' ? (
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
                                        {t(
                                          'marketplace.material.create_material_list.offer.offer'
                                        )}
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
                        <form noValidate name='type-request'>
                          <div className='row'>
                            <div className='col-12 col-md-5'>
                              <div className='form-group'>
                                <label htmlFor='title'>
                                  {t(
                                    'marketplace.material.create_material_list.request.input_title'
                                  )}
                                </label>
                                <input
                                  required
                                  id='title'
                                  onChange={this.handleChange1}
                                  name='title'
                                  type='text'
                                  value={this.state.title}
                                  className='form-control'
                                  style={
                                    this.state.title_err === true
                                      ? { border: '1px solid #eb516d' }
                                      : {}
                                  }
                                  // placeholder="Title"
                                />
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.title_err === true
                                    ? t(
                                        'marketplace.material.create_material_list.request.title_req'
                                      )
                                    : null}
                                </p>
                              </div>
                              <div className='form-group'>
                                <label htmlFor='categoryId'>
                                  {t(
                                    'marketplace.material.create_material_list.request.category'
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
                                  className='form-control'
                                  value={this.state.categoryId}
                                  required
                                >
                                  <option value=''>
                                    {' '}
                                    {t(
                                      'marketplace.material.create_material_list.request.Select'
                                    )}{' '}
                                  </option>
                                  {categoryId}
                                </select>
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.categoryId_err === true
                                    ? `${t(
                                        'marketplace.material.create_material_list.request.Category'
                                      )} `
                                    : null}
                                </p>
                              </div>
                              <div className='row'>
                                <div className='col-8'>
                                  <div className='form-group'>
                                    <label htmlFor='quantity'>
                                      {t(
                                        'marketplace.material.create_material_list.request.vol_need'
                                      )}
                                    </label>
                                    <input
                                      onChange={this.handleChange3}
                                      style={
                                        this.state.quantity_err === true
                                          ? { border: '1px solid #eb516d' }
                                          : {}
                                      }
                                      name='quantity'
                                      id='quantity'
                                      maxLength='8'
                                      type='text'
                                      value={this.state.quantity}
                                      className='form-control'
                                      placeholder='0'
                                      required
                                    />
                                    {/* <CurrencyFormat thousandSeparator={true}
                                      onChange={this.handleChange3}
                                      style={
                                        this.state.quantity_err === true
                                          ? { border: "1px solid #eb516d" }
                                          : {}
                                      }
                                      name="quantity"
                                      id="quantity"
                                      type="text"
                                      value={this.state.quantity}
                                      className="form-control"
                                      placeholder="0"
                                      required
                                      // prefix={'$'} 
                                      /> */}
                                    <p style={{ color: '#eb516d ' }}>
                                      {this.state.quantity_err === true
                                        ? t(
                                            'marketplace.material.create_material_list.request.quantity_req'
                                          )
                                        : null}
                                    </p>
                                  </div>
                                </div>
                                <div className='col-4'>
                                  <div className='form-group'>
                                    <label htmlFor='unit'>
                                      {t(
                                        'marketplace.material.create_material_list.request.unit'
                                      )}
                                    </label>
                                    <select
                                      required
                                      onChange={this.handleChange4}
                                      value={this.state.unit}
                                      style={
                                        this.state.unit_err === true
                                          ? { border: '1px solid #eb516d' }
                                          : {}
                                      }
                                      name='unit'
                                      id='unit'
                                      className='form-control'
                                    >
                                      {' '}
                                      <option value=''>
                                        {' '}
                                        {t(
                                          'marketplace.material.create_material_list.request.Select'
                                        )}{' '}
                                      </option>
                                      <option value='Kg'>
                                        {' '}
                                        {t(
                                          'marketplace.material.create_material_list.request.Kg'
                                        )}
                                      </option>
                                      <option value='M2'>
                                        {' '}
                                        {t(
                                          'marketplace.material.create_material_list.request.M2'
                                        )}
                                      </option>
                                      <option value='Liter'>
                                        {t(
                                          'marketplace.material.create_material_list.request.Liter'
                                        )}
                                      </option>
                                      <option value='Pcs'>
                                        {t(
                                          'marketplace.material.create_material_list.request.Pcs'
                                        )}
                                      </option>
                                    </select>
                                    <p style={{ color: '#eb516d ' }}>
                                      {this.state.unit_err === true
                                        ? 'Unit is required'
                                        : null}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className='form-group'>
                                <label htmlFor='state'>
                                  {t(
                                    'marketplace.material.create_material_list.request.state_word'
                                  )}
                                </label>
                                <select
                                  required
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
                                >
                                  <option value=''>
                                    {' '}
                                    {t(
                                      'marketplace.material.create_material_list.request.city_p'
                                    )}{' '}
                                  </option>
                                  {stateList}
                                </select>
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.state_err === true
                                    ? `${t(
                                        'marketplace.material.create_material_list.request.state_r'
                                      )} `
                                    : null}
                                </p>
                              </div>

                              <div className='form-group'>
                                <label htmlFor='city'>
                                  {t(
                                    'marketplace.material.create_material_list.request.city'
                                  )}
                                </label>

                                <Multiselect
                                  options={this.state.cities} // Options to display in the dropdown
                                  selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                  placeholder=''
                                  onSelect={(e) => this.check(e)} // Function will trigger on select event
                                  selectedValues={this.state.city} // Preselected value to persist in dropdown
                                  onSelect={this.onSelect} // Function will trigger on select event
                                  onRemove={this.onRemove} // Function will trigger on remove event
                                  displayValue='city_identifier' //
                                  emptyRecordMsg={t(
                                    'marketplace.material.create_material_list.offer.No_Options_Available'
                                  )}
                                  placeholder={t(
                                    'marketplace.material.create_material_list.request.Select'
                                  )}
                                  // showCheckbox={true}
                                />

                                {/* <p style={{ color: "#eb516d " }}>
                                  {this.state.city_err === true
                                    ? "City is required"
                                    : null}
                                </p> */}
                              </div>

                              <div className='form-group'>
                                <label htmlFor='expires'>
                                  {t(
                                    'marketplace.material.create_material_list.request.post_expires_in'
                                  )}
                                </label>
                                <div
                                  style={
                                    this.state.post_expiry_date_err === true
                                      ? { border: '1px solid #eb516d' }
                                      : {}
                                  }
                                >
                                  <Datetime
                                    onChange={(date) =>
                                      this.handleChange7(date)
                                    }
                                    isValidDate={valid}
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
                                    inputProps={{ placeholder: 'DD-MM-YYYY' }}
                                    // inputProps={{ placeholder: this.state.post_expiry_date1 !== "Invalid date" ? moment(this.state.post_expiry_date1).format('DD-MM-YYYY') : this.state.post_expiry_date1, type: "number" }}

                                    // inputProps={ inputProps }
                                  />
                                  {/* <Datetime
                                    onChange={(date) => this.handleChange7(date)}
                                    name="post_expiry_date"
                                    isValidDate={valid}
                                    value={this.state.post_expiry_date}
                                    dateFormat={this.state.datepicker_date_format}
                                    // timeFormat={this.state.datepicker_time_format}
                                    viewMode="days"
                                    timeFormat={false}
                                    locale={`${localStorage.getItem("_lng") === "fi" ? "fr-fi" : 'en-US'} `}
                                    // locale('en-US')
                                    inputProps={{ placeholder: date_0 != "Invalid date" ? date_0 : this.state.post_expiry_date, type: "number" }}
                                  /> */}
                                </div>
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.post_expiry_date_err === true
                                    ? t(
                                        'marketplace.material.create_material_list.request.Date_f'
                                      )
                                    : null}
                                </p>
                                {/* "Date field is required" */}
                              </div>

                              <div className='form-group'>
                                <div className='form-check form-check-inline'>
                                  <input
                                    type='checkbox'
                                    className='form-check-input'
                                    id='work'
                                    checked={
                                      this.state.work_checked === 2
                                        ? true
                                        : false
                                    }
                                    value='2'
                                    onChange={this.handleCheck}
                                  />
                                  <label
                                    className='form-check-label'
                                    htmlFor='work'
                                  >
                                    {t(
                                      'marketplace.material.create_material_list.request.work'
                                    )}
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className='col-12 col-md-7'>
                              <div className='form-group'>
                                <label htmlFor='Desc'>
                                  {t(
                                    'marketplace.material.create_material_list.request.description'
                                  )}
                                </label>
                                <textarea
                                  required
                                  onChange={this.handleChange8}
                                  name='description'
                                  style={
                                    this.state.description_err === true
                                      ? { border: '1px solid #eb516d' }
                                      : {}
                                  }
                                  id='Desc'
                                  value={this.state.description}
                                  className='form-control'
                                ></textarea>
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.description_err === true
                                    ? 'Description is required'
                                    : null}
                                </p>
                              </div>
                              <div className='row'>
                                <div className='col-12 col-sm-6'>
                                  <div className='form-group'>
                                    <label htmlFor='main'>
                                      {t(
                                        'marketplace.material.create_material_list.request.main'
                                      )}
                                    </label>
                                    <div
                                      style={
                                        this.state.featured_image_err === true
                                          ? { border: '1px solid #eb516d' }
                                          : {}
                                      }
                                      className='file-select'
                                    >
                                      {/* <input
                                        onChange={this.handleChange9}
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
                                              this.props.match?.params.id
                                                ? url +
                                                  '/images/marketplace/material/' +
                                                  this.state.attachment_preview
                                                : this.state
                                                    .attachment_preview !== null
                                                ? this.state.attachment_preview
                                                : File
                                            }
                                          />
                                          <span className='status'>
                                            {t(
                                              'marketplace.material.create_material_list.request.Upload_status'
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
                                      {this.state.attachment_preview ? (
                                        <button
                                          style={{ marginTop: '10px' }}
                                          onClick={this.removeImg_1}
                                          className='btn btn-danger'
                                        >
                                          {t(
                                            'marketplace.material.create_material_list.request.Remove'
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
                                          'marketplace.material.create_material_list.request.ext'
                                        )}
                                      </small>
                                      <p style={{ color: '#eb516d ' }}>
                                        {this.state.featured_image_err === true
                                          ? 'Featured image is required'
                                          : null}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className='col-12 col-sm-6'>
                                  <div className='form-group'>
                                    <label htmlFor='attachment'>
                                      {t(
                                        'marketplace.material.create_material_list.request.attachment'
                                      )}
                                    </label>
                                    <div
                                      className='file-select'
                                      style={
                                        this.state.attachment_err === true
                                          ? {
                                              // border: "1px solid #eb516d"
                                            }
                                          : {}
                                      }
                                    >
                                      {/* <input
                                        onChange={this.handleChange10}
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
                                          <img
                                            src={
                                              this.props.match.params.id
                                                ? url +
                                                  '/images/marketplace/material/' +
                                                  this.state.attachment_preview
                                                : this.state.attachment_img !==
                                                  null
                                                ? this.state.attachment_img
                                                : File
                                            }
                                          />
                                          {/* <img src={this.state.attachment_img ? this.state.attachment_img : File} /> */}
                                          <span className='status'>
                                            {' '}
                                            {t(
                                              'marketplace.material.create_material_list.request.Upload_status'
                                            )}{' '}
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
                                          onClick={this.removeImg0}
                                          className='btn btn-danger'
                                        >
                                          {t(
                                            'marketplace.material.create_material_list.request.Remove'
                                          )}
                                        </button>
                                      ) : (
                                        ''
                                      )}
                                      <small className='form-text text-muted'>
                                        {t(
                                          'marketplace.material.create_material_list.request.attachment_text'
                                        )}
                                      </small>
                                      <p style={{ color: '#eb516d ' }}>
                                        {/* {this.state.attachment_err === true
                                          ? null // "Attachment is required"
                                          : null} */}
                                        {this.state.file_size
                                          ? this.state.file_size
                                          : ''}
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
                                        'marketplace.material.create_material_list.request.product_images'
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
                                        onChange={this.handleChange11}
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
                                        maxFileSize={10000000}
                                        // minFileSize={0}
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
                                              'marketplace.material.create_material_list.request.Upload'
                                            )}{' '}
                                          </span>
                                          <ProgressBar
                                            now={this.state.loaded2}
                                          />
                                        </label>
                                      </Files>
                                      <small className='form-text text-muted'>
                                        {t(
                                          'marketplace.material.create_material_list.request.ext'
                                        )}
                                      </small>
                                      {this.state.slider_image == '' ? (
                                        ''
                                      ) : (
                                        <button
                                          style={{ marginTop: '10px' }}
                                          onClick={this.removeImg}
                                          className='btn btn-danger'
                                        >
                                          {t(
                                            'marketplace.material.create_material_list.request.Remove'
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
                                          'marketplace.material.create_material_list.request.product_images_text'
                                        )}
                                      </small>
                                      <p style={{ color: '#eb516d ' }}>
                                        {this.state.slider_image_err === true
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
                                  className='btn btn-primary'
                                  onClick={(e) => this.handleFormSubmit(e)}
                                >
                                  {' '}
                                  {t(
                                    'marketplace.material.create_material_list.request.Submit'
                                  )}{' '}
                                </button>
                              )}
                              <button
                                onClick={(e) => this.handlePreviewModal(e)}
                                className='btn btn-gray mt-3 ml-4'
                                // data-toggle='modal'
                                // data-target='#preview-info'
                              >
                                {t(
                                  'marketplace.material.create_material_list.request.preview'
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
                          noValidate
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
                                <label htmlFor='title'>
                                  {t(
                                    'marketplace.material.create_material_list.request.input_title'
                                  )}
                                </label>
                                <input
                                  required
                                  id='title1'
                                  style={
                                    this.state.title1_err === true
                                      ? { border: '1px solid #eb516d' }
                                      : {}
                                  }
                                  onChange={this.handleState}
                                  name='title1'
                                  type='text'
                                  value={this.state.title1}
                                  className='form-control'
                                  // placeholder=''
                                />
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.title1_err === true
                                    ? t(
                                        'marketplace.material.create_material_list.request.title_req'
                                      )
                                    : null}
                                </p>
                              </div>
                              <div className='form-group'>
                                <label htmlFor='category'>
                                  {t(
                                    'marketplace.material.create_material_list.request.category'
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
                                  id='categoryId1'
                                  value={this.state.categoryId1}
                                  className='form-control'
                                  required
                                >
                                  <option value=''>
                                    {' '}
                                    {t(
                                      'marketplace.material.create_material_list.request.Select'
                                    )}{' '}
                                  </option>
                                  {categoryId1}
                                </select>
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.categoryId_err1 === true
                                    ? `${t(
                                        'marketplace.material.create_material_list.request.Category'
                                      )} `
                                    : null}
                                </p>
                              </div>
                              <div className='row'>
                                <div className='col-8'>
                                  {/* <div className="input-group"><input name="cost_per_unit1" id="unitCost" type="number" className="form-control" placeholder="" required="" value="66"/><div className="input-group-prepend"><span className="input-group-text">€</span></div><p style={{color: "rgb(235, 81, 109)" }}></p></div> */}
                                  <div
                                    className='form-group'
                                    // style={{ width: "100px" }}
                                  >
                                    <label htmlFor='unitCost'>
                                      {t(
                                        'marketplace.material.create_material_list.offer.cost_unit'
                                      )}
                                    </label>
                                    <div
                                      className='input-group'
                                      style={
                                        this.state.cost_per_unit_err1 === true
                                          ? { border: '1px solid #eb516d' }
                                          : {}
                                      }
                                    >
                                      <input
                                        onChange={this.handleState_cost}
                                        name='cost_per_unit1'
                                        id='unitCost'
                                        maxLength='8'
                                        type='text'
                                        pattern='[+-]?\d+(?:[.,]\d+)?'
                                        className='form-control'
                                        placeholder='0'
                                        required
                                        min='0'
                                        value={this.state.cost_per_unit1}
                                      />
                                      <div className='input-group-prepend'>
                                        <span className='input-group-text'>
                                          €
                                        </span>
                                      </div>
                                      <p style={{ color: '#eb516d ' }}>
                                        {this.state.cost_per_unit_err1 === true
                                          ? `${t(
                                              'marketplace.material.create_material_list.request.cost_per_unit'
                                            )} `
                                          : null}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className='col-4'>
                                  <div className='form-group'>
                                    <label htmlFor='unit1'>
                                      {t(
                                        'marketplace.material.create_material_list.request.unit'
                                      )}
                                    </label>{' '}
                                    &nbsp;
                                    <select
                                      style={
                                        this.state.unit_err1 === true
                                          ? { border: '1px solid #eb516d' }
                                          : {}
                                      }
                                      name='unit1'
                                      value={this.state.unit1}
                                      onChange={this.handleChange_4}
                                      id='unit1'
                                      className='form-control'
                                      required
                                    >
                                      {' '}
                                      <option value=''>
                                        {' '}
                                        {t(
                                          'marketplace.material.create_material_list.request.Select'
                                        )}{' '}
                                      </option>
                                      <option value='Kg'>
                                        {' '}
                                        {t(
                                          'marketplace.material.create_material_list.request.Kg'
                                        )}
                                      </option>
                                      <option value='M2'>
                                        {' '}
                                        {t(
                                          'marketplace.material.create_material_list.request.M2'
                                        )}
                                      </option>
                                      <option value='Liter'>
                                        {t(
                                          'marketplace.material.create_material_list.request.Liter'
                                        )}
                                      </option>
                                      <option value='Pcs'>
                                        {' '}
                                        {t(
                                          'marketplace.material.create_material_list.request.Pcs'
                                        )}{' '}
                                      </option>
                                    </select>
                                    <p style={{ color: '#eb516d ' }}>
                                      {this.state.unit_err1 === true
                                        ? `${t(
                                            'marketplace.material.create_material_list.request.unit_rqe'
                                          )} `
                                        : null}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className='form-group'>
                                <label htmlFor='quantity'>
                                  {t(
                                    'marketplace.material.create_material_list.offer.quantity'
                                  )}
                                </label>
                                <input
                                  style={
                                    this.state.quantity_err1 === true
                                      ? { border: '1px solid #eb516d' }
                                      : {}
                                  }
                                  onChange={this.handleState1}
                                  name='quantity1'
                                  id='quantity'
                                  maxLength='8'
                                  type='text'
                                  // pattern="[0-9]"
                                  className='form-control'
                                  placeholder='0'
                                  required
                                  value={this.state.quantity1}
                                  // min="0"
                                />
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.quantity_err1 === true
                                    ? t(
                                        'marketplace.material.create_material_list.request.quantity_req'
                                      )
                                    : null}
                                </p>
                              </div>
                              <div className='form-group'>
                                <label htmlFor='dtype'>
                                  {t(
                                    'marketplace.material.create_material_list.offer.delivery_type'
                                  )}
                                </label>
                                <select
                                  style={
                                    this.state.delivery_type_err1 === true
                                      ? { border: '1px solid #eb516d' }
                                      : {}
                                  }
                                  onChange={this.handleChange13}
                                  required
                                  name='delivery_type1[]'
                                  id='dtype'
                                  className='form-control'
                                >
                                  <option value=''>
                                    {' '}
                                    {t(
                                      'marketplace.material.create_material_list.offer.Select'
                                    )}{' '}
                                  </option>
                                  <option value='Included'>
                                    {' '}
                                    {t(
                                      'marketplace.material.create_material_list.offer.Included'
                                    )}{' '}
                                  </option>
                                  <option value='Not included'>
                                    {' '}
                                    {t(
                                      'marketplace.material.create_material_list.offer.Not_included'
                                    )}{' '}
                                  </option>
                                </select>
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.delivery_type_err1 === true
                                    ? `${t(
                                        'marketplace.material.create_material_list.request.DeliveryType_req'
                                      )} `
                                    : null}
                                </p>
                              </div>
                              <ul className='list-striped'>
                                {this.state.row_phase.map((r, index) => (
                                  <Row val={r} key={index} />
                                ))}
                              </ul>
                              <div className='form-group'>
                                <label htmlFor='expires1'>
                                  {t(
                                    'marketplace.material.create_material_list.request.post_expires_in'
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
                                      this.handleChange_7(date)
                                    }
                                    isValidDate={valid}
                                    name='post_expiry_date'
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
                                    inputProps={{ placeholder: 'DD-MM-YYYY' }}
                                    // inputProps={{ placeholder: this.state.post_expiry_date1 !== "Invalid date" ? moment(this.state.post_expiry_date1).format('DD-MM-YYYY') : this.state.post_expiry_date1, type: "number" }}

                                    // inputProps={ inputProps }
                                  />
                                  {/* <Datetime
                                    onChange={(date) => this.handleChange_7(date)}
                                    name="post_expiry_date1"
                                    isValidDate={valid}
                                    value={this.state.post_expiry_date1}
                                    dateFormat={this.state.datepicker_date_format} 
                                    viewMode="days"
                                    timeFormat={false}
                                    locale={`${localStorage.getItem("_lng") === "fi" ? "fr-fi" : 'en-US'} `}
                                    inputProps={{ placeholder: date_exp != "Invalid date" ? date_exp : this.state.post_expiry_date1, type: "number" }}
                                  /> */}
                                </div>
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.post_expiry_date_err1 === true
                                    ? t(
                                        'marketplace.material.create_material_list.request.Date_f'
                                      )
                                    : null}
                                </p>
                              </div>
                              <div className='form-group'>
                                <div className='form-check form-check-inline'>
                                  <input
                                    type='checkbox'
                                    className='form-check-input'
                                    id='work1'
                                    checked={
                                      this.state.work_checked === 2
                                        ? true
                                        : false
                                    }
                                    value='2'
                                    onChange={this.handleCheck}
                                  />
                                  <label
                                    className='form-check-label'
                                    htmlFor='work1'
                                  >
                                    {t(
                                      'marketplace.material.create_material_list.offer.work'
                                    )}
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className='col-12 col-md-7'>
                              <div className='form-group'>
                                <label htmlFor='Desc'>
                                  {t(
                                    'marketplace.material.create_material_list.request.description'
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
                                  id='Desc'
                                  className='form-control'
                                  required
                                  value={this.state.description1}
                                ></textarea>
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.description_err1 === true
                                    ? t(
                                        'marketplace.material.create_material_list.request.descrip_req'
                                      )
                                    : null}
                                </p>
                              </div>
                              <div className='row'>
                                <div className='col-12 col-sm-6'>
                                  <div className='form-group'>
                                    <label htmlFor='state'>
                                      {t(
                                        'marketplace.material.create_material_list.request.state_word'
                                      )}
                                    </label>
                                    <select
                                      onChange={this.ChangeCity}
                                      style={
                                        this.state.state_err === true
                                          ? { border: '1px solid #eb516d' }
                                          : {}
                                      }
                                      name='state'
                                      required
                                      id='state'
                                      value={this.state.state}
                                      className='form-control'
                                    >
                                      <option value=''>
                                        {' '}
                                        {t(
                                          'marketplace.material.create_material_list.request.Select'
                                        )}{' '}
                                      </option>
                                      {stateList}
                                    </select>
                                    <p style={{ color: '#eb516d ' }}>
                                      {this.state.state_err === true
                                        ? `${t(
                                            'marketplace.material.create_material_list.request.state_r'
                                          )} `
                                        : null}
                                    </p>
                                  </div>
                                </div>
                                <div className='col-12 col-sm-6'>
                                  <div className='form-group'>
                                    <label htmlFor='city'>
                                      {t(
                                        'marketplace.material.create_material_list.request.city'
                                      )}
                                    </label>
                                    {/* <select
                                      style={
                                        this.state.city_err1 === true
                                          ? { border: "1px solid #eb516d" }
                                          : {}
                                      }
                                      onChange={this.handleState}
                                      name="city1"
                                      id="city1"
                                      value={this.state.city1}
                                      className="form-control"
                                    >
                                      <option> {t("c_material_list.request.Select")} </option>
                                      {cityList1}
                                    </select> */}

                                    <Multiselect
                                      options={this.state.cities} // Options to display in the dropdown
                                      selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                      onSelect={(e) => this.check(e)}
                                      selectedValues={this.state.city}
                                      placeholder=''
                                      onSelect={this.onSelect}
                                      onRemove={this.onRemove}
                                      displayValue='city_identifier' //
                                      emptyRecordMsg={t(
                                        'marketplace.material.create_material_list.offer.No_Options_Available'
                                      )}
                                      placeholder={t(
                                        'marketplace.material.create_material_list.request.Select'
                                      )}
                                    />

                                    <p style={{ color: '#eb516d ' }}>
                                      {this.state.city_err === true
                                        ? 'City is required'
                                        : null}
                                    </p>
                                  </div>
                                </div>
                                {/* <div className="col-xl-5 col-md-6">
                                  <div className="form-group">
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
                                    />
                                    <p style={{ color: "#eb516d " }}>
                                      {this.state.pincode_err1 === true
                                        ? "Pincode is required"
                                        : null}
                                    </p>
                                  </div>
                                </div> */}
                                <div className='col-12 col-sm-6'>
                                  <div className='form-group'>
                                    <label htmlFor='warranty'>
                                      {t(
                                        'marketplace.material.create_material_list.offer.warranty'
                                      )}
                                    </label>
                                    <input
                                      style={
                                        this.state.warranty_err1 === true
                                          ? { border: '1px solid #eb516d' }
                                          : {}
                                      }
                                      onChange={this.handleState}
                                      name='warranty1'
                                      id='warranty1'
                                      type='number'
                                      className='form-control'
                                      placeholder='0'
                                      required
                                      value={this.state.warranty1}
                                      min='0'
                                    />
                                    <p style={{ color: '#eb516d ' }}>
                                      {this.state.warranty_err1 === true
                                        ? `${t(
                                            'marketplace.material.create_material_list.request.warranty_req'
                                          )} `
                                        : null}
                                    </p>
                                  </div>
                                </div>
                                <div className='col-12 col-sm-6'>
                                  <div className='form-group'>
                                    <label htmlFor='main1'>
                                      {t(
                                        'marketplace.material.create_material_list.request.main'
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
                                        onChange={this.handleChange_9}
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
                                        maxFileSize={3145757}
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
                                          />
                                          <span className='status'>
                                            {' '}
                                            {t(
                                              'marketplace.material.create_material_list.request.Upload_status'
                                            )}
                                          </span>
                                          <ProgressBar
                                            now={this.state.loaded_}
                                          />
                                        </label>
                                      </Files>
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
                                          onClick={this.removeImg_2}
                                          className='btn btn-danger'
                                        >
                                          {t(
                                            'marketplace.material.create_material_list.request.Remove'
                                          )}
                                        </button>
                                      ) : (
                                        ''
                                      )}
                                      <small className='form-text text-muted'>
                                        {t(
                                          'marketplace.material.create_material_list.request.ext'
                                        )}
                                      </small>
                                      <p style={{ color: '#eb516d ' }}>
                                        {this.state.featured_image_err1 === true
                                          ? 'Featured image is required'
                                          : null}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className='col-12 col-sm-6'>
                                  <div className='form-group'>
                                    <label htmlFor='attachment'>
                                      {t(
                                        'marketplace.material.create_material_list.request.attachment'
                                      )}
                                    </label>
                                    <div
                                      className='file-select'
                                      style={
                                        this.state.attachment_err1 === true
                                          ? {
                                              // border: "1px solid #eb516d"
                                            }
                                          : {}
                                      }
                                    >
                                      {/* <input
                                        onChange={this.handleChange_10}
                                        name="attachment1"
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
                                          '.pdf',
                                          '.doc',
                                          '.docx',
                                          'image/png',
                                          'image/jpg',
                                          '.svg',
                                        ]}
                                        multiple={false}
                                        maxFileSize={3145757}
                                        minFileSize={10}
                                        clickable
                                      >
                                        <label htmlFor='attachment1'>
                                          <img
                                            src={
                                              this.props.match.params.id
                                                ? url +
                                                  '/images/marketplace/material/' +
                                                  this.state.attachment_preview
                                                : this.state.attachment_img1 !==
                                                  null
                                                ? this.state.attachment_img1
                                                : File
                                            }
                                          />
                                          {/* <img src={this.state.attachment_img1} /> */}
                                          <span className='status'>
                                            {t(
                                              'marketplace.material.create_material_list.request.Upload_status'
                                            )}
                                          </span>
                                          <ProgressBar
                                            now={this.state.loaded_1}
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
                                      {this.state.attachment_img1 ? (
                                        <button
                                          style={{ marginTop: '10px' }}
                                          onClick={this.removeImg_3}
                                          className='btn btn-danger'
                                        >
                                          {t(
                                            'marketplace.material.create_material_list.request.Remove'
                                          )}
                                        </button>
                                      ) : (
                                        ''
                                      )}
                                      <small className='form-text text-muted'>
                                        {t(
                                          'marketplace.material.create_material_list.request.attachment_text'
                                        )}
                                      </small>
                                      <p style={{ color: '#eb516d ' }}>
                                        {/* {this.state.attachment_err1 === true
                                          ? null //"Attachment is required"
                                          : null} */}
                                        {this.state.file_size
                                          ? this.state.file_size
                                          : ''}
                                      </p>
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
                                <div className='col-12 col-sm-6'>
                                  <div className='form-group'>
                                    <label>
                                      {t(
                                        'marketplace.material.create_material_list.request.product_images'
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
                                      onChange={this.handleChange_11}
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
                                        maxFileSize={3145757}
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
                                              'marketplace.material.create_material_list.request.Upload'
                                            )}
                                          </span>
                                          <ProgressBar
                                            now={this.state.loaded_2}
                                          />
                                        </label>
                                      </Files>
                                      <small className='form-text text-muted'>
                                        {t(
                                          'marketplace.material.create_material_list.request.ext'
                                        )}
                                      </small>
                                      {this.state.slider_image1 == '' ? (
                                        ''
                                      ) : (
                                        <button
                                          style={{ marginTop: '10px' }}
                                          onClick={this.removeImg1}
                                          className='btn btn-danger'
                                        >
                                          {t(
                                            'marketplace.material.create_material_list.request.Remove'
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
                                          'marketplace.material.create_material_list.request.product_images_text'
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
                                  {' '}
                                  {t(
                                    'marketplace.material.create_material_list.request.Submit'
                                  )}{' '}
                                </button>
                              )}{' '}
                              <button
                                className='btn btn-gray ml-4 mt-3'
                                onClick={(e) => this.handlePreviewModal(e)}
                              >
                                {t(
                                  'marketplace.material.create_material_list.request.pre'
                                )}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
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

const Row = (props) => (
  <li>
    {props.val.type}- {props.val.cost}
  </li>
);

export default withTranslation()(Createmateriallist);
