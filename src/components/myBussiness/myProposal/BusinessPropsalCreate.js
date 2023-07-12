import React, { Component } from 'react';
import axios from 'axios';
import { url } from '../../../helper/helper';
import Header from '../../shared/Header';
import BussinessSidebar from '../../shared/BussinessSidebar';
import File from '../../../images/file-icon.png';
import Datetime from 'react-datetime';
import moment from 'moment';
import BusinessInfo from '../modals/BusinessInfo';
import AddCustomer from '../modals/AddCustomer';
import ProjectPlanProposal from '../modals/ProjectPlanProposal';
import PDFView from '../modals/PDFView';
import { Link } from 'react-router-dom';
// import Select from "react-select/creatable";
import Autosuggest from 'react-autosuggest';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { withTranslation } from 'react-i18next';
import { Prompt } from 'react-router';
import Files from 'react-files';
import img from '../../../images/DefaultImg.png';
import $ from 'jquery';
import SweetAlert from 'react-bootstrap-sweetalert';
import Sidebar from '../../shared/Sidebar';
import { useLocation } from 'react-router-dom';
import { getData, postDataWithToken } from '../../../helper/api';
import ProjectPlanProposalNew from '../modals/ProjectPlanProposalNew';
import './BusinessPropsalCreate.scss';
const options = [];
const clients = [];

// const getSuggestionValue = (suggestion) => {
//   return suggestion.value
// };

// const renderSuggestion = (suggestion) => {
//   return <div>{suggestion.value}</div>
// };

// const getSuggestions2 = (value) => {
//   const inputValue = value.trim().toLowerCase();
//   const inputLength = inputValue.length;

//   return inputLength === 0
//     ? []
//     : options.filter(
//       (lang) => lang.value.toLowerCase().slice(0, inputLength) === inputValue
//     );
// };

// const getSuggestionValue2 = (suggestion) => suggestion.value;

// // Use your imagination to render suggestions.

// const renderSuggestion2 = (suggestion) => <div>{suggestion.value}</div>;

class BusinessPropsalCreate extends Component {
  state = {
    logo: null,
    attachment: null,
    attachment_pre: null,
    logo_preview: null,
    page_reload: true,
    customer: '',
    email: '',
    emails: [],
    date: moment().format('DD-MM-YYYY'),
    dateFormat: moment().format('YYYY-MM-DD'),
    dateFormat1: '',
    date_err: false,
    mat_pay: '',
    mat_pay_err: false,
    other: '',
    work_pay: '',
    work_pay_err: false,
    work: '',
    work_err: false,
    insurance: '',
    insurance_err: false,
    due_date: '',
    due_date_err: false,
    sdate: '',
    edate: '',
    sdate_err: false,
    edate_err: false,
    business_info: [],
    isPerviewModal: false,
    error: null,
    // name: this.props?.location.state?.data
    //   ? this.props?.location.state?.data
    //   : ' ',
    name: '',
    name_err: false,
    errors: [],
    name_unq: null,
    show_errors: false,
    show_msg: false,
    loading: false,
    loading_1: false,
    tender_id: 0,
    proposal_id: 0,
    selectedOption: null,
    value: '',
    suggestions: [],
    suggestions2: [],
    userEmail: null,
    client_id: null,
    client_id_err: false,
    success: false,
    type: 'all',
    workItems: null,
    workTotal: 0,
    matItems: null,
    matTotal: 0,
    work_template_name: '',
    mat_template_name: '',
    template_name: '',
    mat_template_id: 0,
    work_template_id: 0,
    proposal_status: 0,
    proposal_client_type: 0,
    proposal_tender_draft: 0,
    proposal_request_id_tender: 0,
    left: null,
    right: null,
    loading_draft: false,
    loading_Submit: false,
    loading_Update: false,
    //name: this.props.location.state?.data ? this.props.location.state.data : '',
    templateErr: '',
    customerInfoErr: '',
    isModalOpen: false,
    isProjectModalOpen: false,
    isAddCustomerModalOpen: false,
    address: '',
    text: '',
    text2: '',
  };

  componentDidMount = () => {
    this._isMounted = true;

    if (this.props.match.params.customer !== undefined) {
      this.setState({ tender_id: this.props.match.params.tender });
      this.getEmail(this.props.match.params.customer);
      this.getTitle(this.props.match.params.tender);
    }
    if (this.props.match.url !== '/business-proposal-create') {
      this.setDataTender(this.props.match.params.tender);
    }
    if (
      this.props.match.params.customer !== undefined &&
      this.props.match.params.draft !== undefined
    ) {
      this.setData(this.props.match.params.tender);
    }
    this.loadResources();
    this.loadClient();
    this.loadProposalID();
    this.loadConfig();
    this.myRef = React.createRef();
    this.myRefMat = React.createRef();
    this.myRefDet = React.createRef();

    // this.interval = setInterval(() => {
    //   this.checkallfields();
    // }, 1000);

    // const data = this.props.location.state;
    // if (data) {

    //   this.setState({
    //     name:data
    //   })
    // }
    // //console.log("prpos===>", data)
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  addCustomer = () => {
    this.loadClient();
  };

  getTitle = async (id) => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/by_bid_id/${id}`, token)
      .then((res) => {
        // console.log(res);
        res.data.map((title) => {
          this.setState({ name: title.tender_title });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  loadConfig = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/config/currency`, token)
      .then((result) => {
        if (this._isMounted) {
          const { left, right } = result.data;
          this.setState({ left, right });
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          //console.log("Request canceled", err.message);
        } else {
          //console.log(err.response);
        }
      });
  };

  setDataTender = async (id) => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/proposal/get/byTID/${id}`, token)
      .then((result) => {
        //console.log('==result==', result);
        const {
          proposal_tender_id,
          work,
          mat,
          proposal_client_type,
          // proposal_client_id,
          // proposal_user_id,
          proposal_request_id,
          // proposal_pdf,
          proposal_attachment,
          emails,
          date,
          proposal_material_payment,
          proposal_other,
          proposal_work_payment,
          proposal_work_guarantee,
          proposal_insurance,
          proposal_due_date,
          proposal_start_date,
          proposal_end_date,
          proposal_status,
          email,
          proposal_names,
        } = result.data;

        if (this.props.match.params.draft !== undefined) {
          this.setState({
            tender_id: proposal_tender_id,
            emails: emails ? emails.split(',') : [],
            date: date === 'null' || date === null ? '' : date,
            dateFormat:
              date === 'null' || date === null
                ? ''
                : date.split('-').reverse().join('-'),
            mat_pay: proposal_material_payment,
            other: proposal_other,
            work_pay: proposal_work_payment,
            work:
              proposal_work_guarantee === 'null' ? '' : proposal_work_guarantee,
            insurance: proposal_insurance === 'null' ? '' : proposal_insurance,
            due_date: proposal_due_date === 'null' ? '' : proposal_due_date,
            sdate:
              proposal_start_date === 'null' || proposal_start_date === null
                ? ''
                : proposal_start_date,
            dateFormat1:
              proposal_start_date === 'null' || proposal_start_date === null
                ? ''
                : proposal_start_date.split('-').reverse().join('-'),
            edate: proposal_end_date === 'null' ? '' : proposal_end_date,
            userEmail: email,
            value: email,
            attachment_pre: proposal_attachment,
            // name: proposal_names,

            matItems: mat === null ? null : mat.items,
            matTotal: mat === null ? 0 : mat.total,
            mat_template_name: mat === null ? '' : mat.template_name,
            mat_template_id: mat === null ? 0 : mat.id,
            workItems: work === null ? null : work.items,
            workTotal: work === null ? 0 : work.total,
            work_template_name: work === null ? '' : work.template_name,
            work_template_id: work === null ? 0 : work.id,

            proposal_status,
            proposal_client_type,
            proposal_tender_draft: 1,
            proposal_request_id_tender: proposal_request_id,
          });
        }
        if (this.props.match.params.draft === undefined) {
          this.setState({
            name: proposal_names,
          });
        }
        // //console.log("proposal_names", proposal_names);
      })
      .catch((err) => {
        ////console.log(err);
      });
  };

  setData = async (id) => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/proposal/get/byID/${id}`, token)
      .then((result) => {
        //console.log('===========result==========', result);
        const {
          proposal_tender_id,
          work,
          mat,
          proposal_client_type,
          proposal_attachment,
          emails,
          proposal_material_payment,
          proposal_other,
          proposal_work_payment,
          proposal_work_guarantee,
          proposal_insurance,
          proposal_due_date,
          proposal_start_date,
          proposal_end_date,
          proposal_status,
          email,
          proposal_names,
          proposal_client_address,
        } = result.data[0];

        this.setState({
          tender_id: proposal_tender_id,
          emails: emails ? emails.split(',') : [],
          date: moment().format('DD-MM-YYYY'),
          mat_pay: proposal_material_payment,
          other: proposal_other,
          work_pay: proposal_work_payment,
          work:
            proposal_work_guarantee === 'null' ? '' : proposal_work_guarantee,
          insurance: proposal_insurance === 'null' ? '' : proposal_insurance,
          due_date:
            proposal_due_date === 'null'
              ? ''
              : moment(new Date(proposal_due_date)).format('DD-MM-YYYY'),
          sdate:
            proposal_start_date === 'null'
              ? ''
              : moment(new Date(proposal_start_date)).format('DD-MM-YYYY'),

          edate:
            proposal_end_date === 'null'
              ? ''
              : moment(new Date(proposal_end_date)).format('DD-MM-YYYY'),
          userEmail: email,
          value: email === 0 ? '' : email,
          attachment_pre:
            proposal_attachment === 'null' ? '' : proposal_attachment,
          attachment: proposal_attachment,
          name: proposal_names,
          matItems: mat === null ? null : mat.items,
          matTotal: mat === null ? 0 : mat.total,
          mat_template_name: mat === null ? '' : mat.template_name,
          mat_template_id: mat === null ? 0 : mat.id,
          workItems: work === null ? null : work.items,
          workTotal: work === null ? 0 : work.total,
          work_template_name: work === null ? '' : work.template_name,
          work_template_id: work === null ? 0 : work.id,

          proposal_status,
          proposal_client_type,
          address: proposal_client_address,
        });
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  getEmail = async (id) => {
    if (id > 0) {
      const token = await localStorage.getItem('token');
      await getData(`${url}/api/usersp/${id}`, token)
        .then((result) => {
          if (result.data.length > 0) {
            this.setState({
              userEmail: result.data[0].email,
            });
          }
        })
        .catch((err) => {
          //console.log(err);
        });
    }
  };

  handleworkItems = (items, total, type, name, id) => {
    const a = items.concat(items.slice(0, '1'), items.slice('x'));
    //console.log("===============", a);
    if (type === 'Material') {
      this.setState({
        matItems: items,
        matTotal: total,
        mat_template_name: name,
        mat_template_id: id,
      });
    }
    if (type === 'Work') {
      this.setState({
        workItems: items,
        workTotal: total,
        work_template_name: name,
        work_template_id: id,
      });
    }
    if (type === 'Both') {
      const myItems = JSON.parse(items);
      const myTotal = JSON.parse(total);
      this.setState({
        workItems: myItems.workArr,
        workTotal: myTotal.workTotal,
        matItems: myItems.matAtt,
        matTotal: myTotal.matTotal,
        work_template_name: name,
        work_template_id: id,
      });
    }
  };

  loadProposalID = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/proposal/get/latest`, token)
      .then((result) => {
        if (this._isMounted) {
          if (
            Object.keys(result.data).length === 0 &&
            result.data.constructor === Object
          ) {
            this.setState({ proposal_id: 1 });
          } else {
            this.setState({ proposal_id: result.data.proposal_id + 1 });
          }
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          //console.log("Request canceled", err.message);
        } else {
          //console.log(err.response);
        }
      });
  };

  loadResources = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/resources-list`, token)
      .then((result) => {
        if (this._isMounted) {
          result.data.data.map((res) => {
            var keys = ['value', 'label'];
            var _key = {};
            keys.forEach((key, i) => (_key[key] = res.email));
            options.push(_key);
          });
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          //console.log("Request canceled", err.message);
        } else {
          //console.log(err.response);
        }
      });
  };

  loadClient = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/resources-list/Client`, token)
      .then((result) => {
        if (this._isMounted) {
          result.data.map((res) => {
            var keys = ["value", "label", "name"];
            var _key = {};
            keys.forEach((key, i) => (key === "name"? _key[key] = res.first_name : _key[key] = res.email));
            clients.push(_key);
          });
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          //console.log("Request canceled", err.message);
        } else {
          //console.log(err.response);
        }
      });
  };

  handleAuto = (e) => {
    this.setState({ value: e.target.value });
  };

  onChange = (event, { newValue }) => {
    // console.log("newValue", newValue);
    this.setState({
      client_id_err: false,
      value: newValue,
      errro_mess: '',
      client_id: newValue,
    });
  };
  onChange2 = (event, { newValue }) => {
    this.setState({
      email: newValue,
      error: '',
    });
  };

  data_state() {
    const { t, i18n } = this.props;
    this.setState({
      errro_mess: t('myBusiness.offer.No_record'),
    });
    return [];
  }

  getSuggestion = (value) => {
    // this.loadClient()
    this.setState({
      suggestions: [],
    });
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const data = clients.filter(
      (lang) => (lang.value.toLowerCase().slice(0, inputLength) === inputValue) || (lang.name.toLowerCase().slice(0, inputLength) === inputValue)
    );
    if (data) {
      this.setState({
        errro_mess: '',
      });
    }
    return data.length != 0
      ? clients.filter(
          (lang) =>
            (lang.value.toLowerCase().slice(0, inputLength) === inputValue) || (lang.name.toLowerCase().slice(0, inputLength) === inputValue)
        )
      : this.data_state();
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    // this.setState({
    //   suggestions: [],
    // });
    this.setState({
      suggestions: this.getSuggestion(value),
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    // //console.log("val0");
    this.setState({
      suggestions: [],
    });
  };

  onSuggestionsFetchRequested2 = ({ value }) => {};

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested2 = () => {
    this.setState({
      suggestions2: [],
    });
  };

  handleBusinessInfo = (val) => {
    this.setState({ business_info: val });

    this.setState({
      work:
        this.props.match.params.draft !== undefined ||
        this.state.proposal_tender_draft === 1
          ? this.state.work
          : this.state.business_info.work,
      insurance:
        this.props.match.params.draft !== undefined ||
        this.state.proposal_tender_draft === 1
          ? this.state.insurance
          : this.state.business_info.insurance,
    });
  };

  onFilesChange = (files) => {
    // //console.log(files);
    if (files[0]) {
      this.setState({
        attachment: files[0],
        file_err: '',
        img_name: files[0].name,
      });
      // this.setState({ logo: files[0], logo_preview: URL.createObjectURL(files[0]), loaded1: 50, file_err: "", img_name: files[0].name });
    }
  };

  onFilesError = (error, file) => {
    //console.log(file, 'error code ' + error.code + ': ' + error.message)
    this.setState({
      file_err: error.message,
      // img_name: ''
    });
  };

  Remove_img = () => {
    this.setState({ attachment: '', loaded1: 0, file_err: '', img_name: '' });
  };

  handleAttachmentRemove = () => {
    this.setState({ attachment: null, img_name: '', file_err: '' });
  };

  handleDelete = (item) => {
    this.setState({
      emails: this.state.emails.filter((i) => i !== item),
    });
  };

  handlePaste = (evt) => {
    evt.preventDefault();

    var paste = evt.clipboardData.getData('text');
    var emails = paste.match(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g);

    if (emails) {
      var toBeAdded = emails.filter((email) => !this.isInList(email));

      this.setState({
        emails: [...this.state.emails, ...toBeAdded],
      });
    }
  };

  isValid(email) {
    let error = null;
    const { t } = this.props;

    if (this.isInList(email)) {
      error = `${email} ${t('myBusiness.offer.alreday_have')}`;
    }

    if (!this.isEmail(email)) {
      error = `${email} ${t('myBusiness.offer.emailmessage')}`;
    }

    if (error) {
      this.setState({ error });

      return false;
    }
    this.setState({ error });
    return true;
  }

  isInList(email) {
    return this.state.emails.includes(email);
  }

  isEmail(email) {
    return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
  }

  findIndexText = (index) => {
    const { t } = this.props;
    if (index === 0) {
      return t('myBusiness.offer.Select');
    } else if (index === 1) {
      return t('myBusiness.offer.Payment_aftre');
    } else if (index === 2) {
      return t('myBusiness.offer.Payment_aftre_project_done');
    } else if (index === 3) {
      return t('myBusiness.offer.As_per_inovice');
    } else if (index === 4) {
      return t('myBusiness.offer.Custom_message');
    }
  };

  findIndexTextTwo = (index) => {
    const { t } = this.props;
    if (index === 0) {
      return t('myBusiness.offer.Select');
    } else if (index === 1) {
      return t('myBusiness.offer.Payment_aftre_work');
    } else if (index === 2) {
      return t('myBusiness.offer.Payment_aftre_work1');
    } else if (index === 3) {
      return t('myBusiness.offer.Pay_hourly');
    }
  };

  handleChange2 = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
      error: null,
    });
    if (name === 'mat_pay') {
      this.setState({
        text: this.findIndexText(event.nativeEvent.target.selectedIndex),
      });
    }
    if (name === 'work_pay') {
      this.setState({
        text2: this.findIndexTextTwo(event.nativeEvent.target.selectedIndex),
      });
    }
  };

  handleRes = ({ value }) => {
    this.setState({ email: value, error: null });
  };

  handleKeyDown = (evt) => {
    if (['Enter', 'Tab', ','].includes(evt.key)) {
      evt.preventDefault();

      var email = this.state.email.trim();

      if (email && this.isValid(email)) {
        this.setState({
          emails: [...this.state.emails, this.state.email],
          email: '',
        });
      }
    }
  };

  handleKeyDownCus = (evt) => {
    if (['Enter'].includes(evt.key)) {
      evt.preventDefault();
    }
  };

  handleChange3 = (event) => {
    this.setState({ due_date: '' });
    this.setState({
      date: moment(event._d).format('DD-MM-YYYY'),
      dateFormat: moment(event._d).format('YYYY-MM-DD'),
    });
  };

  handleChange4 = (event) => {
    this.setState({ due_date: moment(event._d).format('DD-MM-YYYY') });
  };

  handleChange5 = (event) => {
    this.setState({ edate: '' });
    this.setState({
      sdate: moment(event._d).format('DD-MM-YYYY'),
      dateFormat1: moment(event._d).format('YYYY-MM-DD'),
    });
  };

  handleChange6 = (event) => {
    this.setState({ edate: moment(event._d).format('DD-MM-YYYY') });
  };

  handleDraft = async (event) => {
    event.preventDefault();
    this.setState({
      loading_draft: true,
      mat_pay_err: false,
      work_pay_err: false,
      date_err: false,
      due_date_err: false,
      insurance_err: false,
      work_err: false,
      sdate_err: false,
      edate_err: false,
      name_err: false,
      name_unq: null,
      client_id_err: false,
    });

    let client_id;
    if (
      this.state.tender_id !== 0 ||
      this.props.match.params.draft !== undefined
    ) {
      client_id = this.props.match.params.customer;
    } else {
      if (this.state.value === null || this.state.value === '') {
        client_id = 0;
      } else {
        client_id = this.state.value;
      }
    }

    if (this.state.name == null || this.state.name == '') {
      this.myRef.current.scrollTo(0, 0);
      return this.setState({ name_err: true });
    }
    if (this.state.client_id === null || this.state.client_id == '') {
      return this.setState({ client_id_err: true });
    }

    // if (this.state.mat_pay == "" || this.state.mat_pay == "--Select--") {
    //   this.setState({ mat_pay_err: true });
    // }
    // if (this.state.work_pay == "" || this.state.work_pay == "--Select--") {
    //   this.setState({ work_pay_err: true });
    // }
    // if (this.state.date == "" || this.state.date == "--Select--") {
    //   this.setState({ date_err: true });
    // }
    // if (this.state.due_date == "" || this.state.due_date == "--Select--") {
    //   this.setState({ due_date_err: true });
    // }
    // if (this.state.insurance == "") {
    //   this.setState({ insurance_err: true });
    // }
    // if (this.state.work == "") {
    //   this.setState({ work_err: true });
    // }
    // if (this.state.sdate == "") {
    //   this.setState({ sdate_err: true });
    // }
    // if (this.state.edate == "") {
    //   this.setState({ edate_err: true });
    // }

    const token = await localStorage.getItem('token');
    this.setState({ loading_1: true });
    const data = new FormData();
    // data.set('logo', this.state.logo)
    data.set('proposal_request_id', this.requestInput.value);
    data.set('proposal_tender_id', this.state.tender_id);
    data.set('proposal_client_id', client_id);
    data.set('emails', this.state.emails);
    data.set('date', this.state.date);
    data.set('proposal_material_payment', this.state.mat_pay);
    data.set('proposal_other', this.state.other);
    data.set('client_address', this.state.address);
    data.set('proposal_work_payment', this.state.work_pay);
    data.set('proposal_work_guarantee', this.state.work);
    data.set('proposal_insurance', this.state.insurance);
    data.set('proposal_due_date', this.state.due_date);
    data.set('proposal_start_date', this.state.sdate);
    data.set('proposal_end_date', this.state.edate);
    data.set('sent', 0);
    data.set('proposal_client_type', this.state.proposal_client_type);
    data.set('work_template_id', this.state.work_template_id);
    data.set('mat_template_id', this.state.mat_template_id);
    data.set('proposal_names', this.state.name);
    data.append('attachment', this.state.attachment);
    await postDataWithToken(`${url}/api/proposal/draft`, data, token)
      .then((res) => {
        this.setState({
          file_err: '',
          show_msg: true,
          loading_draft: false,
          loading_1: false,
          emails: [],
          date: '',
          mat_pay: '',
          other: '',
          work_pay: '',
          work: '',
          insurance: '',
          due_date: '',
          sdate: '',
          edate: '',
          proposal_client_type: 0,
          work_template_id: 0,
          mat_template_id: 0,
          workTotal: 0,
          matTotal: 0,
          matItems: null,
          workItems: null,
          name: '',
          attachment: null,
          success: 'Your Request have been submit succesfully',
          redirect_page: false,
          value: '',
        });
        this.myRef.current.scrollTo(0, 0);
      })
      .catch((err) => {
        // Object.entries(err.response.data.error).map(([key, value]) => {
        //   this.setState({ errors: err.response.data.error });
        // }); show_errors: true,
        if (err.response.status === 406) {
          if (err.response?.data?.error?.proposal_names) {
            this.setState({
              name_unq: err.response.data.error.proposal_names[0],
            });
          }
        }
        if (err?.response?.status === 403) {
          this.setState({
            client_id_err: true,
            loading: false,
          });
        }
        this.setState({ loading_1: false, loading_draft: false });
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
    });
    this.props.history.push('/proposal-listing');
  };

  handleUpdate = async (event) => {
    event.preventDefault();

    let client_id;
    if (
      this.state.tender_id !== 0 ||
      this.props.match.params.draft !== undefined
    ) {
      if (this.props.match.params.customer > 0) {
        client_id = this.props.match.params.customer;
      } else if (this.state.value === null || this.state.value === '') {
        client_id = 0;
      } else {
        client_id = this.state.value;
      }
    } else {
      if (this.state.value === null || this.state.value === '') {
        client_id = 0;
      } else {
        client_id = this.state.value;
      }
    }
    this.setState({ loading_Update: true });

    const token = await localStorage.getItem('token');
    const data = new FormData();
    data.set('proposal_request_id', this.requestInput.value);
    data.set('proposal_tender_id', this.state.tender_id);
    data.set('proposal_client_id', client_id);
    data.set('emails', this.state.emails);
    data.set('date', this.state.date);
    data.set('proposal_material_payment', this.state.mat_pay);
    data.set('proposal_other', this.state.other);
    data.set('proposal_work_payment', this.state.work_pay);
    data.set('proposal_work_guarantee', this.state.work);
    data.set('proposal_insurance', this.state.insurance);
    data.set('proposal_due_date', this.state.due_date);
    data.set('proposal_start_date', this.state.sdate);
    data.set('proposal_end_date', this.state.edate);
    data.set('proposal_client_type', this.state.proposal_client_type);
    data.set('work_template_id', this.state.work_template_id);
    data.set('mat_template_id', this.state.mat_template_id);
    data.set('proposal_names', this.state.name);
    data.append('attachment', this.state.attachment);
    await postDataWithToken(`${url}/api/proposal/put`, data, token)
      .then((res) => {
        this.setState({
          loading_Update: false,
          page_reload: false,
          show_msg: true,
          loading: false,
          success: ' Your Request have been submit succesfully',
          redirect_page: false,
          name: '',
          value: ' ',
          due_date: '',
          other: '',
          work_pay: '',
          work: '',
          insurance: '',
          sdate: ' ',
          edate: '',
        });
        this.myRef.current.scrollTo(0, 0);
      })
      .catch((err) => {
        this.setState({
          loading_Update: false,
        });
        if (err.response?.data?.error) {
          Object.entries(err.response.data.error).map(([key, value]) => {
            this.setState({ errors: err.response.data.error });
          });
          this.setState({ show_errors: true, loading: false });
        }
        if (err.response?.status === 403) {
          this.setState({
            client_id_err: true,
            loading: false,
          });
        }
        if (err.response?.status === 500) {
          alert('Request cannot be processed, try again later');
        }
        this.myRef.current.scrollTo(0, 0);
      });

    // Display the key/value pairs
    for (var pair of data.entries()) {
      //  //console.log(pair[0] + ", " + pair[1]);
    }
  };

  handleSubmit = async (e, event) => {
    const lng = localStorage.getItem('_lng');
    e.preventDefault();
    if (this.state.matItems === null && this.state.workItems === null) {
      return this.setState({
        templateErr:
          lng === 'fi'
            ? 'lisää työ tai materiaalikustannus'
            : 'Please select a template',
      });

      // return alert("Please select templates before submission");
    }

    this.setState({
      loading_Submit: false,
      mat_pay_err: false,
      work_pay_err: false,
      date_err: false,
      due_date_err: false,
      insurance_err: false,
      work_err: false,
      sdate_err: false,
      edate_err: false,
      name_err: false,
      client_id_err: false,
      templateErr: '',
      customerInfoErr: '',
      client_id_err: false,
    });

    let client_id;
    if (
      this.state.tender_id !== 0 ||
      this.props.match.params.draft !== undefined
    ) {
      client_id =
        this.props.match.params.customer == 0
          ? this.state.value
          : this.props.match.params.customer;
    } else {
      if (this.state.value === null || this.state.value === '') {
        return this.setState({ customerInfoErr: 'Please select a client' });
      }
      client_id = this.state.value;
    }

    if (this.state.date == '' || this.state.date == null) {
      this.myRef.current.scrollTo(0, 0);
      return this.setState({ date_err: true });
    }
    if (this.state.due_date == '' || this.state.due_date == null) {
      this.myRef.current.scrollTo(0, 0);
      return this.setState({ due_date_err: true });
    }

    if (
      this.state.mat_pay === '' ||
      this.state.mat_pay === '--Select--' ||
      this.state.mat_pay === 'null'
    ) {
      this.myRefMat.current.scrollIntoView();
      return this.setState({ mat_pay_err: true });
    }
    if (
      this.state.work_pay === '' ||
      this.state.work_pay === '--Select--' ||
      this.state.work_pay === 'null'
    ) {
      this.myRefMat.current.scrollIntoView();
      return this.setState({ work_pay_err: true });
    }

    if (this.state.insurance === '' || this.state.insurance === 'null') {
      this.myRefDet.current.scrollIntoView(0, 0);
      return this.setState({ insurance_err: true });
    }
    if (this.state.work === '' || this.state.work === 'null') {
      this.myRefDet.current.scrollIntoView(0, 0);
      return this.setState({ work_err: true });
    }
    if (this.state.sdate == '' || this.state.sdate == null) {
      this.myRefDet.current.scrollIntoView(0, 0);
      return this.setState({ sdate_err: true });
    }
    if (this.state.edate == '' || this.state.edate == null) {
      this.myRefDet.current.scrollIntoView(0, 0);
      return this.setState({ edate_err: true });
    }
    if (this.state.name == '' || this.state.name == null) {
      this.myRef.current.scrollTo(0, 0);
      return this.setState({ name_err: true });
    }

    const token = await localStorage.getItem('token');
    this.setState({ loading_Submit: true });
    const data = new FormData();
    data.set('proposal_request_id', this.requestInput.value);
    data.set('proposal_tender_id', this.state.tender_id);
    data.set('proposal_client_id', client_id);
    data.set('emails', this.state.emails);
    data.set('date', this.state.date);
    data.set('proposal_material_payment', this.state.mat_pay);
    data.set('proposal_other', this.state.other);
    data.set('proposal_work_payment', this.state.work_pay);
    data.set('proposal_work_guarantee', this.state.work);
    data.set('proposal_insurance', this.state.insurance);
    data.set('proposal_due_date', this.state.due_date);
    data.set('proposal_start_date', this.state.sdate);
    data.set('proposal_end_date', this.state.edate);
    data.set('sent', event);
    data.set('proposal_client_type', this.state.proposal_client_type);
    data.set('work_template_id', this.state.work_template_id);
    data.set('mat_template_id', this.state.mat_template_id);
    data.set('logo', this.state.business_info.company_logo);
    data.set('company_id', this.state.business_info.company_id);
    data.set(
      'names',
      `${this.state.business_info.first_name} ${this.state.business_info.last_name}`
    );
    data.set('email', this.state.business_info.email);
    data.set('address', this.state.business_info.address);
    data.set('client_address', this.state.address);
    data.set('phone', this.state.business_info.phone);
    data.set('bussiness_id', this.state.business_info.id);
    data.set('workTotal', this.state.workTotal);
    data.set('matTotal', this.state.matTotal);
    data.set(
      'matItems',
      (this.state.matItems ? JSON.parse(this.state.matItems) : []).map(
        (item) => item.items
      )
    );
    data.set(
      'workItems',
      (this.state.workItems ? JSON.parse(this.state.workItems) : []).map(
        (item) => item.items
      )
    );
    data.set('proposal_names', this.state.name);
    data.append('attachment', this.state.attachment);
    await postDataWithToken(`${url}/api/proposal/create`, data, token)
      .then((res) => {
        this.setState({
          file_err: '',
          loading_Submit: false,
          show_msg: true,
          page_reload: false,
          loading: false,
          emails: [],
          date: '',
          mat_pay: '',
          other: '',
          work_pay: '',
          work: '',
          insurance: '',
          due_date: '',
          sdate: '',
          edate: '',
          proposal_client_type: 0,
          work_template_id: 0,
          mat_template_id: 0,
          workTotal: 0,
          matTotal: 0,
          matItems: null,
          workItems: null,
          name: '',
          attachment: null,
          success: 'Your Request have been submit succesfully',
          redirect_page: false,
          value: '',
        });
        this.myRef.current.scrollTo(0, 0);
        // this.props.history.push("/proposal-listing");
      })
      .catch((err) => {
        // Object.entries(err.response.data.error).map(([key, value]) => {
        //   this.setState({ errors: err.response.data.error });
        // }); show_errors: true,
        if (err.response.status === 406) {
          if (err.response.data.error.proposal_names) {
            this.setState({
              name_unq: err.response.data.error.proposal_names[0],
            });
          }
          if (err.response.data.error.proposal_client_id) {
            this.setState({
              client_id_err: true,
            });
          }
        }
        if (err.response.status === 403) {
          this.setState({
            client_id_err: true,
          });
        }
        if (err.response.status === 500) {
          alert('Request cannot be processed, try again later');
        }
        this.setState({ loading_Submit: false });
        this.myRef.current.scrollTo(0, 0);
      });

    // Display the key/value pairs
    for (var pair of data.entries()) {
    }
  };

  hiddenFields = (event) => {
    event.preventDefault();
    let client_id =
      this.state.value === '' ? this.state.userEmail : this.state.value;
    this.setState({ client_id, isPerviewModal: !this.state.isPerviewModal });
  };

  checkallfields() {
    if (this.state.page_reload)
      if (
        this.state.name ||
        this.state.value ||
        this.state.due_date ||
        this.state.other ||
        this.state.work_pay ||
        this.state.work ||
        this.state.insurance ||
        this.state.sdate ||
        this.state.edate
      ) {
        this.setState({
          redirect_page: true,
        });
      } else {
        this.setState({
          redirect_page: false,
        });
      }
  }

  // Use your imagination to render suggestions.
  getSuggestionValue = (suggestion) => {
    return suggestion.value;
  };

  getSuggestionValue2 = (suggestion) => {
    return suggestion.value;
  };

  renderSuggestion = (suggestion) => {
    return <div>{suggestion.value}</div>;
  };

  renderSuggestion2 = (suggestion) => {
    return <div>{suggestion.value}</div>;
  };

  render() {
    const { t } = this.props;
    var yesterday = moment().subtract(1, 'day');
    function valid(current) {
      return current.isAfter(yesterday);
    }

    var date = this.state.date ? moment(this.state.dateFormat) : null;

    function valid2(current) {
      return current.isAfter(date);
    }
    var date1 = this.state.sdate ? moment(this.state.dateFormat1) : null;
    function valid4(current) {
      return current.isAfter(date1);
    }

    // function textFunction(sel) {
    //   return sel?.options[sel.selectedIndex]?.text;
    // }

    const userInfo = {
      client_id: this.state.client_id,
      proposal_id: this.state.proposal_id,
      date: this.state.date,
      address: this.state.address,
      other: this.state.other,
      due_date: this.state.due_date,
      workTotal: this.state.workTotal,
      matTotal: this.state.matTotal,
      mat_pay:
        this.state.mat_pay === 'other' ? this.state.mat_pay : this.state.text,
      work_pay: this.state.text2,
      matItems: this.state.matItems,
      workItems: this.state.workItems,
      work: this.state.work,
      insurance: this.state.insurance,
      start_date: this.state.sdate,
      end_date: this.state.edate,
      left: this.state.left,
      right: this.state.right,
    };
    // console.log(userInfo);
    let alert, loading_1;
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
          {t('myBusiness.offer.prop_ins')}
        </Alert>
      );
    }
    // if (this.state.loading === true) {
    //   loading = (
    //     <Spinner animation="border" role="status">
    //       <span className="sr-only"> {t("myBusiness.offer.Loading")}  </span>
    //     </Spinner>
    //   );
    // }
    if (this.state.loading_1 === true) {
      loading_1 = (
        <Spinner animation='border' role='status'>
          <span className='sr-only'> {t('myBusiness.offer.Loading')} </span>
        </Spinner>
      );
    }

    const { selectedOption } = this.state;

    let req_id =
      this.props.match.params.draft === 'update'
        ? this.props.match.params.tender
        : this.state.proposal_tender_draft === 1
        ? this.state.proposal_request_id_tender
        : this.state.business_info.id
        ? `${localStorage.getItem('Login_user_id')}${this.state.proposal_id}`
        : `${this.props.match.params.customer}${this.state.proposal_id}`;
    const { value, email, suggestions, suggestions2 } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: t('myBusiness.offer.place_email'),
      value,
      className: 'form-control',
      onChange: this.onChange,
      onKeyDown: this.handleKeyDownCus,
    };
    const inputPropsDate = {
      onKeyDown: this.handleKeyDownCus,
      placeholder: 'DD-MM-YYYY',
    };

    // Autosuggest will pass through all these props to the input.
    const inputProps2 = {
      placeholder: t('myBusiness.offer.place_emid'),
      value: this.state.email,
      className: 'form-control',
      onChange: this.onChange2,
      onKeyDown: this.handleKeyDown,
      onPaste: this.handlePaste,
    };

    const { success, loading_Submit, loading_draft, loading_Update } =
      this.state;

    return (
      <React.Fragment>
        <Prompt
          when={this.state.redirect_page}
          message={t('myBusiness.offer.leave_page')}
        />
        <div className='business-proposal-create'>
          {/* <Header active={'bussiness'} /> */}
          <div className='sidebar-toggle'></div>
          <nav aria-label='breadcrumb'>
            <ol className='breadcrumb'>
              <Link
                to='/business-dashboard'
                className='breadcrumb-item active'
                aria-current='page'
              >
                {t('myBusiness.offer.heading')}
              </Link>
              <Link
                to='/proposal-listing'
                className='breadcrumb-item active'
                aria-current='page'
              >
                {t('myBusiness.offer.proposal')}
              </Link>
              <li className='breadcrumb-item active' aria-current='page'>
                {t('myBusiness.offer.create')}
              </li>
            </ol>
          </nav>
          <div className='main-content'>
            <Sidebar dataFromParent={this.props.location.pathname} />
            <div ref={this.myRef} className='page-content'>
              {alert ? alert : null}

              {success ? (
                <SweetAlert
                  success
                  closeOnClickOutside={true}
                  title={t('myBusiness.offer.SuccessPopup')}
                  // title={t("myBusiness.offer.success")}
                  onConfirm={this.onConfirmError}
                >
                  {/* {t("myBusiness.offer.success1")} */}
                </SweetAlert>
              ) : (
                ''
              )}

              <div className='container-fluid'>
                <div
                  className='d-md-flex justify-content-between'
                  style={{ maxWidth: '1120px' }}
                >
                  <h3 className='head3'>{t('myBusiness.offer.cre_prop')} </h3>
                  <div className='mt-md-n3 mt-sm-4 mb-sm-4 mb-md-0'>
                    <button
                      onClick={this.hiddenFields}
                      className='btn btn-gray mb-md-0 mb-3 mr-4 clk2'
                      // data-toggle="modal"
                      // data-target="#preview-info"
                    >
                      {t('myBusiness.offer.Preview_Proposal')}
                    </button>

                    {this.props.match.params.draft !== undefined ||
                    this.state.proposal_tender_draft === 1 ? (
                      <button
                        onClick={this.handleUpdate}
                        className='btn btn-gray mb-md-0 mb-3 mr-4 clk2'
                      >
                        {loading_Update ? (
                          <Spinner animation='border' role='status'>
                            <span className='sr-only'>
                              {t('myBusiness.offer.Loading')}
                            </span>
                          </Spinner>
                        ) : (
                          ''
                        )}
                        {t('myBusiness.offer.Update_as_a_draft')}
                      </button>
                    ) : (
                      <button
                        onClick={this.handleDraft}
                        className='btn btn-gray mb-md-0 mb-3 mr-4 clk2'
                      >
                        {loading_draft ? (
                          <Spinner animation='border' role='status'>
                            <span className='sr-only'>
                              {t('myBusiness.offer.Loading')}
                            </span>
                          </Spinner>
                        ) : (
                          ''
                        )}{' '}
                        {t('myBusiness.offer.Save_as_a_draft')}
                      </button>
                    )}

                    <button
                      onClick={(e) => this.handleSubmit(e, 1)}
                      className='btn btn-primary mb-md-0 mb-4 clk2'
                    >
                      {loading_Submit ? (
                        <Spinner animation='border' role='status'>
                          <span className='sr-only'>
                            {t('myBusiness.offer.Loading')}
                          </span>
                        </Spinner>
                      ) : (
                        ''
                      )}
                      {t('myBusiness.offer.submit2')}
                    </button>
                  </div>
                </div>

                <div className='card' style={{ maxWidth: '1120px' }}>
                  <div className='card-body'>
                    <form>
                      <div className='row'>
                        <div className='col-xl-12 col-lg-12'>
                          <div className='form-group'>
                            <label htmlFor='name'>
                              {' '}
                              {t('myBusiness.offer.name')}{' '}
                            </label>
                            <input
                              id='name'
                              className='form-control'
                              type='text'
                              name='name'
                              autoComplete='off'
                              value={this.state.name}
                              onChange={this.handleChange2}
                            />
                            <p style={{ color: '#eb516d ' }}>
                              {this.state.name_err === true
                                ? 'Name is required'
                                : null}
                              {this.state.name_unq
                                ? t('myBusiness.offer.name_unq')
                                : null}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-lg-5 col-md-6'>
                          <div className='form-group'>
                            <div className='file-select file-sel inline'>
                              <label
                                htmlFor='attachment1sdsd'
                                style={{ width: '70%' }}
                              >
                                <img
                                  src={
                                    this.state.business_info.company_logo ===
                                    null
                                      ? img
                                      : url +
                                        '/images/marketplace/company_logo/' +
                                        this.state.business_info.company_logo
                                  }
                                  alt=''
                                />
                              </label>
                            </div>
                          </div>
                          <div className='form-group'>
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
                              {t('myBusiness.offer.buss_info1')}{' '}
                              <a
                                href='#'
                                data-toggle='modal'
                                data-target='#edit-info'
                              >
                                {t('myBusiness.offer.Edit')}
                              </a>
                            </label>
                            <div className='collapse' id='business-info'>
                              <div className='form-detail'>
                                {/* <p>{this.state.business_info.company_id}</p> */}
                                <p>{`${this.state.business_info.first_name} ${this.state.business_info.last_name}`}</p>
                                <p></p>
                                <p>{this.state.business_info.email}</p>
                                <p>
                                  {this.state.business_info.company_website}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className='form-group'>
                            <label htmlFor='customer-info'>
                              {t('myBusiness.offer.cus_info')}
                            </label>
                            <p className='error'>
                              {this.state.customerInfoErr}
                            </p>
                            {this.state.tender_id !== 0 ? (
                              <input
                                id='customer-info'
                                className='form-control'
                                type='text'
                                value={
                                  this.state.userEmail
                                    ? this.state.userEmail
                                    : ''
                                }
                                readOnly={true}
                              />
                            ) : this.props.match.params.draft !== undefined ? (
                              <React.Fragment>
                                <div className='input-group'>
                                  <Autosuggest
                                    suggestions={suggestions}
                                    onSuggestionsFetchRequested={
                                      this.onSuggestionsFetchRequested
                                    }
                                    // onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                    getSuggestionValue={this.getSuggestionValue}
                                    renderSuggestion={this.renderSuggestion}
                                    inputProps={inputProps}
                                    value={this.state.value}
                                    //placeholder='syötä asiakkaan sähköposti tai nimi'
                                  />

                                  <label>
                                    <a
                                      href='#'
                                      data-toggle='modal'
                                      data-target='#add-cus'
                                      onClick={(e) =>
                                        this.setState(
                                          {
                                            isAddCustomerModalOpen:
                                              !this.state
                                                .isAddCustomerModalOpen,
                                          },
                                          e.preventDefault()
                                        )
                                      }
                                    >
                                      {' '}
                                      [+]{' '}
                                    </a>
                                    <label className='color_red'>
                                      {this.state.errro_mess
                                        ? t('myBusiness.offer.No_record')
                                        : ''}{' '}
                                    </label>
                                    <a
                                      href='#'
                                      data-toggle='modal'
                                      data-target='#add-cus'
                                      onClick={(e) =>
                                        this.setState(
                                          {
                                            isAddCustomerModalOpen:
                                              !this.state
                                                .isAddCustomerModalOpen,
                                          },
                                          e.preventDefault()
                                        )
                                      }
                                    >
                                      <label className='color_red'>
                                        {this.state.errro_mess ? (
                                          <>
                                            {' '}
                                            <span className='link_blue'>
                                              {' '}
                                              {t(
                                                'myBusiness.offer.Add_New'
                                              )}{' '}
                                            </span>{' '}
                                          </>
                                        ) : (
                                          ''
                                        )}{' '}
                                      </label>
                                    </a>
                                  </label>
                                </div>
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.client_id_err === true
                                    ? 'Customer not found'
                                    : null}
                                </p>
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                <div className='input-group'>
                                  <Autosuggest
                                    suggestions={suggestions}
                                    onSuggestionsFetchRequested={
                                      this.onSuggestionsFetchRequested
                                    }
                                    onSuggestionsClearRequested={
                                      this.onSuggestionsClearRequested
                                    }
                                    getSuggestionValue={this.getSuggestionValue}
                                    renderSuggestion={this.renderSuggestion}
                                    inputProps={inputProps}
                                    value={this.state.value}
                                  />

                                  <label>
                                    {' '}
                                    <a
                                      href='#'
                                      data-toggle='modal'
                                      data-target='#add-cus'
                                      onClick={(e) =>
                                        this.setState(
                                          {
                                            isAddCustomerModalOpen:
                                              !this.state
                                                .isAddCustomerModalOpen,
                                          },
                                          e.preventDefault()
                                        )
                                      }
                                    >
                                      {' '}
                                      [+]{' '}
                                    </a>
                                    <label className='color_red'>
                                      {this.state.errro_mess
                                        ? t('myBusiness.offer.No_record')
                                        : ''}{' '}
                                    </label>
                                    <a
                                      href='#'
                                      data-toggle='modal'
                                      data-target='#add-cus'
                                      onClick={(e) =>
                                        this.setState(
                                          {
                                            isAddCustomerModalOpen:
                                              !this.state
                                                .isAddCustomerModalOpen,
                                          },
                                          e.preventDefault()
                                        )
                                      }
                                    >
                                      {' '}
                                      <label className='color_red'>
                                        {this.state.errro_mess ? (
                                          <>
                                            {' '}
                                            <span className='link_blue'>
                                              {' '}
                                              {t(
                                                'myBusiness.offer.Add_New'
                                              )}{' '}
                                            </span>{' '}
                                          </>
                                        ) : (
                                          ''
                                        )}{' '}
                                      </label>{' '}
                                    </a>
                                  </label>
                                </div>
                                <p style={{ color: '#eb516d ' }}>
                                  {this.state.client_id_err === true
                                    ? 'Customer not found'
                                    : null}
                                </p>
                              </React.Fragment>
                            )}
                          </div>

                          <div className='form-group'>
                            <label
                              htmlFor='mails'
                              style={{ marginRight: '60%' }}
                            >
                              {t('myBusiness.offer.mail_multi')}
                            </label>
                            {this.state.emails.map((item, i) => (
                              <div className='tag-item' key={i}>
                                {item}
                                <button
                                  type='button'
                                  className='button'
                                  onClick={() => this.handleDelete(item)}
                                >
                                  {' '}
                                  &times;{' '}
                                </button>
                              </div>
                            ))}

                            <Autosuggest
                              suggestions={suggestions2}
                              onSuggestionsFetchRequested={
                                this.onSuggestionsFetchRequested2
                              }
                              onSuggestionsClearRequested={
                                this.onSuggestionsClearRequested2
                              }
                              getSuggestionValue={this.getSuggestionValue2}
                              renderSuggestion={this.renderSuggestion2}
                              inputProps={inputProps2}
                            />

                            {this.state.error && (
                              <p className='error'>{this.state.error}</p>
                            )}
                            <small className='form-text text-muted'>
                              {t('myBusiness.offer.eg')}
                            </small>
                          </div>
                        </div>
                        <div className='col-lg-7 col-md-6'>
                          <div className='form-group'>
                            <label htmlFor='request-id'>
                              {t('myBusiness.offer.req_id')}
                            </label>

                            <input
                              id='request-id'
                              className='form-control'
                              type='text'
                              ref={(input) => {
                                this.requestInput = input;
                              }}
                              value={req_id}
                              readOnly='readOnly'
                            />
                          </div>
                          <div className='form-group'>
                            <label htmlFor='date'>
                              {t('myBusiness.offer.date')}
                            </label>
                            <input
                              className='form-control'
                              type='text'
                              id='date'
                              name='date'
                              value={this.state.date}
                              readOnly='readOnly'
                            />
                            <p style={{ color: '#eb516d ' }}>
                              {this.state.date_err === true
                                ? 'Date is required'
                                : null}
                            </p>
                          </div>
                          <div className='form-group'>
                            <label htmlFor='due-date'>
                              {t('myBusiness.offer.due_date')}
                            </label>
                            <Datetime
                              onChange={(date) => this.handleChange4(date)}
                              isValidDate={valid2}
                              inputProps={inputPropsDate}
                              name='due_date'
                              dateFormat='DD-MM-YYYY'
                              timeFormat={false}
                              locale={`${
                                localStorage.getItem('_lng') === 'fi'
                                  ? 'fr-fi'
                                  : 'en-US'
                              } `}
                              value={this.state.due_date}
                            />
                            <p style={{ color: '#eb516d ' }}>
                              {this.state.due_date_err === true
                                ? 'Due date is required'
                                : null}
                            </p>
                          </div>
                          <div className='form-group'>
                            <label htmlFor='address'>
                              {t('myBusiness.offer.clientAddress')}
                            </label>
                            <textarea
                              className='form-control'
                              type='text'
                              id='address'
                              name='address'
                              value={this.state.address}
                              onChange={this.handleChange2}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='mt-5'></div>
                      <div className='row'>
                        <div className='col-lg-5 col-md-6'>
                          <h2 className='head2 mb-5'>
                            {t('myBusiness.offer.proposal_summary')}
                          </h2>
                          <div className='form-group'>
                            <label> {t('myBusiness.offer.TotalC')} </label>
                            <div className='form-detail'>
                              <div className='row'>
                                <div className='col'>
                                  <p>{t('myBusiness.offer.work_total')}</p>
                                </div>
                                <div className='col'>
                                  <p>
                                    {this.state.left}{' '}
                                    {Number(this.state.workTotal).toFixed(2)}{' '}
                                    {this.state.right}
                                  </p>
                                </div>
                              </div>
                              <div className='row'>
                                <div className='col'>
                                  <p>{t('myBusiness.offer.material_total')}</p>
                                </div>
                                <div className='col'>
                                  <p>
                                    {this.state.left}{' '}
                                    {Number(this.state.matTotal).toFixed(2)}{' '}
                                    {this.state.right}
                                  </p>
                                </div>
                              </div>
                              <div className='row'>
                                <div className='col'>
                                  <p> {t('myBusiness.offer.Total_cost')} </p>
                                </div>
                                <div className='col'>
                                  <p>
                                    {this.state.left}{' '}
                                    {Number(
                                      Number(this.state.workTotal) +
                                        Number(this.state.matTotal)
                                    ).toFixed(2)}{' '}
                                    {this.state.right}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div ref={this.myRefMat} className='form-group'>
                            <label htmlFor='m-payment'>
                              {t('myBusiness.offer.mat_pay')}
                            </label>
                            <select
                              value={this.state.mat_pay}
                              onChange={this.handleChange2}
                              name='mat_pay'
                              // id="m-payment"
                              className='form-control'
                            >
                              <option value=''>
                                {' '}
                                {t('myBusiness.offer.Select')}{' '}
                              </option>
                              <option value='payment after total delivery'>
                                {' '}
                                {t('myBusiness.offer.Payment_aftre')}{' '}
                              </option>
                              <option value='payment after project done'>
                                {' '}
                                {t(
                                  'myBusiness.offer.Payment_aftre_project_done'
                                )}{' '}
                              </option>
                              <option value='as per invoice'>
                                {' '}
                                {t('myBusiness.offer.As_per_inovice')}{' '}
                              </option>
                              <option value='other'>
                                {' '}
                                {t('myBusiness.offer.Custom_message')}{' '}
                              </option>
                            </select>
                            <p style={{ color: '#eb516d ' }}>
                              {this.state.mat_pay_err === true
                                ? t('myBusiness.offer.fill_req')
                                : null}
                            </p>
                          </div>

                          {/* <div
                            className="form-group"
                            // id="custom-message"
                            style={{ display: "none" }}
                          > */}
                          {this.state.mat_pay === 'other' ? (
                            <textarea
                              style={{ fontSize: '15px' }}
                              className='form-control'
                              onChange={this.handleChange2}
                              name='other'
                              rows='5'
                              cols='50'
                              value={this.state.other}
                            ></textarea>
                          ) : (
                            ''
                          )}
                          {/* </div> */}

                          <div className='form-group'>
                            <label htmlFor='work-payment'>
                              {t('myBusiness.offer.work_pay')}
                            </label>
                            <select
                              value={this.state.work_pay}
                              onChange={this.handleChange2}
                              name='work_pay'
                              id='work-payment'
                              className='form-control'
                            >
                              <option value=''>
                                {' '}
                                {t('myBusiness.offer.Select')}{' '}
                              </option>
                              {/* <option> {t("myBusiness.offer.Payment_aftre_work")} </option> */}
                              <option value='payment after work'>
                                {' '}
                                {t('myBusiness.offer.Payment_aftre_work')}{' '}
                              </option>
                              <option value='invoice by hour'>
                                {' '}
                                {t('myBusiness.offer.Payment_aftre_work1')}{' '}
                              </option>
                              <option value='pay hourly'>
                                {' '}
                                {t('myBusiness.offer.Pay_hourly')}{' '}
                              </option>
                            </select>
                            <p style={{ color: '#eb516d ' }}>
                              {this.state.work_pay_err === true
                                ? t('myBusiness.offer.fill_req')
                                : null}
                            </p>
                          </div>
                        </div>
                        <div className='col-lg-7 col-md-6'>
                          <h2 className='head2 mb-5'>
                            {t('myBusiness.offer.project_plan')}
                          </h2>
                          <div className='form-group'>
                            <div className='plan-list'>
                              <div className='row gutters-24 offer-tab-design'>
                                {/* {this.state.workItems === null ? ( */}
                                <div className='col-lg-4 d-flex'>
                                  <button
                                    className='btn btn-light add-plan border bg-light text-dark '
                                    data-toggle='modal'
                                    data-target='#add-plan'
                                    onClick={(e) =>
                                      this.setState(
                                        {
                                          type: 'Work',
                                          isModalOpen: true,
                                          workItems: null,
                                          workTotal: 0,
                                          work_template_name: '',
                                          work_template_id: 0,
                                          matItems: null,
                                          matTotal: 0,
                                          mat_template_name: '',
                                          mat_template_id: 0,
                                          isProjectModalOpen:
                                            !this.state.isProjectModalOpen,
                                        },
                                        e.preventDefault()
                                      )
                                    }
                                  >
                                    {t('myBusiness.offer.work_cost')}
                                  </button>
                                </div>
                                {/* ) : null} */}

                                {/* {this.state.matItems === null ? ( */}
                                <div className='col-lg-4 d-flex'>
                                  <button
                                    className='btn btn-light add-plan border bg-light text-dark '
                                    data-toggle='modal'
                                    data-target='#add-plan'
                                    onClick={(e) =>
                                      this.setState(
                                        {
                                          type: 'Material',
                                          isModalOpen: true,
                                          workItems: null,
                                          workTotal: 0,
                                          work_template_name: '',
                                          work_template_id: 0,
                                          matItems: null,
                                          matTotal: 0,
                                          mat_template_name: '',
                                          mat_template_id: 0,
                                          isProjectModalOpen:
                                            !this.state.isProjectModalOpen,
                                        },
                                        e.preventDefault()
                                      )
                                    }
                                  >
                                    {t('myBusiness.offer.mat_cost')}
                                  </button>
                                </div>
                                {/* ) : null} */}

                                {/* 3rd button */}
                                <div className='col-lg-4 flex'>
                                  <button
                                    className='btn btn-light add-plan border bg-light text-dark'
                                    data-toggle='modal'
                                    data-target='#add-plan'
                                    onClick={(e) =>
                                      this.setState(
                                        {
                                          type: 'Both',
                                          isModalOpen: true,
                                          workItems: null,
                                          workTotal: 0,
                                          work_template_name: '',
                                          work_template_id: 0,
                                          matItems: null,
                                          matTotal: 0,
                                          mat_template_name: '',
                                          mat_template_id: 0,
                                          isProjectModalOpen:
                                            !this.state.isProjectModalOpen,
                                        },
                                        e.preventDefault()
                                      )
                                    }
                                  >
                                    {t('myBusiness.offer.work_mat_cost')}
                                  </button>
                                </div>
                              </div>

                              <p className='error'>{this.state.templateErr}</p>

                              <ul
                                className={`mt-5 ${
                                  this.state.workItems &&
                                  this.state.matItems === null
                                    ? 'show'
                                    : 'hide'
                                }`}
                              >
                                {this.state.workItems &&
                                  this.state.matItems === null &&
                                  JSON.parse(this.state.workItems).map(
                                    (item, i) => (
                                      <li key={i}>{item.items.trim()}</li>
                                    )
                                  )}
                              </ul>
                              <div>
                                {/* {t('myBusiness.offer.work')} */}

                                {this.state.workItems &&
                                  this.state.matItems === null && (
                                    <>
                                      {' '}
                                      <div
                                        className='edit-plan'
                                        data-toggle='modal'
                                        data-target='#add-plan'
                                        onClick={(e) =>
                                          this.setState(
                                            {
                                              template_name:
                                                this.state.work_template_name,
                                              type: 'Work',
                                              isModalOpen: true,
                                              isProjectModalOpen:
                                                !this.state.isProjectModalOpen,
                                            },
                                            e.preventDefault()
                                          )
                                        }
                                      >
                                        <button className="border bg-light mb-2">
                                        {t("myBusiness.offer.edit_quotation")}
                                        </button>
                                      </div>
                                    </>
                                  )}
                              </div>

                              <ul
                                className={`mt-5 ${
                                  this.state.matItems &&
                                  this.state.workItems === null
                                    ? 'show'
                                    : 'hide'
                                }`}
                              >
                                {this.state.matItems &&
                                  this.state.workItems === null &&
                                  JSON.parse(this.state.matItems).map(
                                    (item, i) => (
                                      <li key={i}>{item.items.trim()}</li>
                                    )
                                  )}
                              </ul>
                              <div>
                                {/* {t('myBusiness.offer.material')} */}
                                {this.state.matItems &&
                                  this.state.workItems === null && (
                                    <div
                                      className='edit-plan'
                                      data-toggle='modal'
                                      data-target='#add-plan'
                                      onClick={(e) =>
                                        this.setState(
                                          {
                                            template_name:
                                              this.state.mat_template_name,
                                            type: 'Material',
                                            isModalOpen: true,
                                            isProjectModalOpen:
                                              !this.state.isProjectModalOpen,
                                          },
                                          e.preventDefault()
                                        )
                                      }
                                    >
                                      <button className="border bg-light mb-2">
                                      {t("myBusiness.offer.edit_quotation")}
                                      </button>
                                    </div>
                                  )}
                              </div>

                              <div
                                className={`${
                                  this.state.workItems && this.state.matItems
                                    ? 'd-flex'
                                    : 'd-none'
                                }`}
                              >
                                {t('myBusiness.template.Work')}
                                <ul
                                  className={`mt-5 ${
                                    this.state.workItems === null
                                      ? 'hide'
                                      : 'show'
                                  }`}
                                >
                                  {this.state.workItems &&
                                    this.state.matItems &&
                                    JSON.parse(this.state.workItems).map(
                                      (item, i) => (
                                        <li key={i}>{item.items.trim()}</li>
                                      )
                                    )}
                                </ul>
                                {t('myBusiness.template.Material')}
                                <ul
                                  className={`mt-5 ${
                                    this.state.matItems === null
                                      ? 'hide'
                                      : 'show'
                                  }`}
                                >
                                  {this.state.workItems &&
                                    this.state.matItems &&
                                    JSON.parse(this.state.matItems).map(
                                      (item, i) => (
                                        <li key={i}>{item.items.trim()}</li>
                                      )
                                    )}
                                </ul>
                              </div>
                              <div>
                                {this.state.workItems &&
                                  this.state.matItems && (
                                    <>
                                      {' '}
                                      <div
                                        className='edit-plan'
                                        data-toggle='modal'
                                        data-target='#add-plan'
                                        onClick={(e) =>
                                          this.setState(
                                            {
                                              template_name:
                                                this.state.work_template_name,
                                              type: 'Both',
                                              isModalOpen: true,
                                              isProjectModalOpen:
                                                !this.state.isProjectModalOpen,
                                            },
                                            e.preventDefault()
                                          )
                                        }
                                      >
                                        <button className="border bg-light mb-2">
                                        {t("myBusiness.offer.edit_quotation")}
                                        </button>
                                      </div>
                                    </>
                                  )}
                              </div>

                              <span> </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='mt-5'></div>
                      <div ref={this.myRefDet} className='row'>
                        <div className='col-xl-12'>
                          <h2 className='head2'>
                            {t('myBusiness.offer.proposal_details')}
                          </h2>
                        </div>
                        <div className='col-xl-4 col-lg-5 col-md-6'>
                          <div className='form-group'>
                            <label htmlFor='work'>
                              {t('myBusiness.offer.guarantees_for_work')}
                            </label>
                            <textarea
                              maxLength='162'
                              id='work'
                              onChange={this.handleChange2}
                              name='work'
                              value={this.state.work ?? ''}
                              className='form-control'
                            ></textarea>
                            <p style={{ color: '#eb516d ' }}>
                              {this.state.work_err === true
                                ? t('myBusiness.offer.fill_req')
                                : null}
                            </p>
                          </div>
                        </div>
                        <div className='col-xl-4 col-lg-5 col-md-6 offset-xl-1'>
                          <div className='form-group'>
                            <label htmlFor='insurance'>
                              {t('myBusiness.offer.insurance')}
                            </label>
                            <textarea
                              maxLength='162'
                              id='insurance'
                              onChange={this.handleChange2}
                              name='insurance'
                              value={this.state.insurance ?? ''}
                              className='form-control'
                            ></textarea>
                            <p style={{ color: '#eb516d ' }}>
                              {this.state.insurance_err === true
                                ? t('myBusiness.offer.fill_req')
                                : null}
                            </p>
                          </div>
                        </div>
                        <div className='col-xl-4 col-lg-5 col-md-6 col-sm-6'>
                          <div className='row'>
                            <div className='form-group col-xs-12 col-lg-6'>
                              <label htmlFor='sdate'>
                                {t('myBusiness.offer.start_date')}
                              </label>
                              <Datetime
                                onChange={(date) => this.handleChange5(date)}
                                isValidDate={valid}
                                inputProps={inputPropsDate}
                                id='sdate'
                                name='sdate'
                                dateFormat='DD-MM-YYYY'
                                locale={`${
                                  localStorage.getItem('_lng') === 'fi'
                                    ? 'fr-fi'
                                    : 'en-US'
                                } `}
                                timeFormat={false}
                                value={this.state.sdate}
                              />
                              <p style={{ color: '#eb516d ' }}>
                                {this.state.sdate_err === true
                                  ? t('myBusiness.offer.fill_req')
                                  : null}
                              </p>
                            </div>
                            <div className='form-group col-xs-12 col-lg-6'>
                              <label htmlFor='edate'>
                                {t('myBusiness.offer.end_date')}
                              </label>
                              <Datetime
                                onChange={(date) => this.handleChange6(date)}
                                isValidDate={valid4}
                                inputProps={inputPropsDate}
                                id='edate'
                                name='edate'
                                locale={`${
                                  localStorage.getItem('_lng') === 'fi'
                                    ? 'fr-fi'
                                    : 'en-US'
                                } `}
                                dateFormat='DD-MM-YYYY'
                                timeFormat={false}
                                value={this.state.edate}
                              />
                              <p style={{ color: '#eb516d ' }}>
                                {this.state.edate_err === true
                                  ? t('myBusiness.offer.fill_req')
                                  : null}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className='col-xl-9 col-lg-10'>
                          <div className='form-group'>
                            <label htmlFor='issues'>
                              {t('myBusiness.offer.attachment')}
                            </label>

                            <div className='row'>
                              <div className='col-lg-11 file-select attachment'>
                                <Files
                                  className='files-dropzone'
                                  onChange={(e) => this.onFilesChange(e)}
                                  onError={(e) => this.onFilesError(e)}
                                  accepts={[
                                    'image/gif',
                                    'image/pdf',
                                    '.PDF',
                                    'image/jpeg',
                                    'image/png',
                                    'image/jpg',
                                    '.svg',
                                    '.docx',
                                    '.doc',
                                  ]}
                                  multiple={false}
                                  maxFileSize={3145757}
                                  minFileSize={10}
                                  clickable
                                >
                                  <label>
                                    <i className='icon-attachment'></i>
                                    <span
                                      className='filename font-weight-bold'
                                      data-text='Attach File'
                                    >
                                      {this.state.img_name
                                        ? this.state.img_name
                                        : t(
                                            'myBusiness.offer.Upload_attachments'
                                          )}
                                      {/* {t("myBusiness.offer.Upload_attachments")} */}
                                    </span>
                                  </label>
                                </Files>
                              </div>
                              <div className='col-lg-1 attachme'>
                                <span
                                  onClick={this.handleAttachmentRemove}
                                  className='clears'
                                >
                                  &Chi;
                                </span>
                              </div>
                            </div>
                            <p style={{ color: '#eb516d', fontSize: '15px' }}>
                              {this.state.file_err ? this.state.file_err : ''}{' '}
                            </p>

                            {this.state.attachment_pre ? (
                              <label htmlFor='attachments'>
                                <a
                                  href={
                                    url +
                                    '/images/marketplace/proposal/' +
                                    this.state.attachment_pre
                                  }
                                  target='_blank'
                                  className='attachment'
                                >
                                  <i className='icon-paperclip'></i>
                                  {this.state.attachment_pre
                                    ? this.state.attachment_pre
                                    : ''}
                                </a>
                              </label>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className='mt-5'></div>
                      <div className='row'>
                        <div className='col-12'>
                          <button
                            onClick={this.hiddenFields}
                            className='btn btn-gray mb-md-0 mb-3 mr-4'
                            // data-toggle="modal"
                            // data-target="#preview-info"
                          >
                            {t('myBusiness.offer.Preview_Proposal')}
                          </button>

                          {this.props.match.params.draft !== undefined ||
                          this.state.proposal_tender_draft === 1 ? (
                            <button
                              onClick={this.handleUpdate}
                              className='btn btn-gray mb-md-0 mb-3 mr-4 clk2'
                            >
                              {loading_Update ? (
                                <Spinner animation='border' role='status'>
                                  <span className='sr-only'>
                                    {t('myBusiness.offer.Loading')}
                                  </span>
                                </Spinner>
                              ) : (
                                ''
                              )}{' '}
                              {t('myBusiness.offer.Update_as_a_draft')}
                            </button>
                          ) : (
                            <button
                              onClick={this.handleDraft}
                              className='btn btn-gray mb-md-0 mb-3 mr-4 clk2'
                            >
                              {loading_draft ? (
                                <Spinner animation='border' role='status'>
                                  <span className='sr-only'>
                                    {t('myBusiness.offer.Loading')}
                                  </span>
                                </Spinner>
                              ) : (
                                ''
                              )}
                              {t('myBusiness.offer.Save_as_a_draft')}
                            </button>
                          )}

                          <button
                            onClick={(e) => this.handleSubmit(e, 1)}
                            className='btn btn-primary mb-md-0 mb-4 clk2'
                          >
                            {loading_Submit ? (
                              <Spinner animation='border' role='status'>
                                <span className='sr-only'>
                                  {t('myBusiness.offer.Loading')}
                                </span>
                              </Spinner>
                            ) : (
                              ''
                            )}
                            {t('myBusiness.offer.submit2')}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <BusinessInfo onInfo={this.handleBusinessInfo} />
              <AddCustomer
                show={this.state.isAddCustomerModalOpen}
                handleClose={() =>
                  this.setState({ isAddCustomerModalOpen: false })
                }
                addCus={this.addCustomer}
                relod={this.loadClient}
              />
              {window.innerWidth < 55 ? (
                <ProjectPlanProposal
                  onSelectWorkTemplate={this.handleworkItems}
                  tempName={this.state.template_name}
                  onType={this.state.type}
                  left={this.state.left}
                  right={this.state.right}
                  show={this.state.isProjectModalOpen}
                  handleClose={() =>
                    this.setState({
                      isProjectModalOpen: false,
                      template_name: '',
                    })
                  }
                />
              ) : (
                <ProjectPlanProposalNew
                  onSelectWorkTemplate={this.handleworkItems}
                  tempName={this.state.template_name}
                  onType={this.state.type}
                  left={this.state.left}
                  right={this.state.right}
                  show={this.state.isProjectModalOpen}
                  handleClose={() =>
                    this.setState({
                      isProjectModalOpen: false,
                      template_name: '',
                    })
                  }
                />
              )}

              <PDFView
                businessInfo={this.state.business_info}
                userInfo={userInfo}
                show={this.state.isPerviewModal}
                handleClose={() => this.setState({ isPerviewModal: false })}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withTranslation()(BusinessPropsalCreate);
