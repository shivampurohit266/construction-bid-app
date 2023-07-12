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
// import Select from "react-select";
import Autosuggest from 'react-autosuggest';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { Link } from 'react-router-dom';
import PDFViewAgreement from '../modals/PDFViewAgreement';
import RatingModal from '../modals/RatingModal';
import { Prompt } from 'react-router';
import SweetAlert from 'react-bootstrap-sweetalert';
// import ReactToPrint from "react-to-print";
import { useTranslation, withTranslation } from 'react-i18next';
import img from '../../../images/DefaultImg.png';
import Files from 'react-files';
import { Multiselect } from 'multiselect-react-dropdown';
import Breadcrumb from '../../shared/Breadcrumb';
import Sidebar from '../../shared/Sidebar';
import { getData, postDataWithToken } from '../../../helper/api';
import Terms from '../modals/Terms';
const options = [];
const clients = [];
const lest = [];
const Contractor = [];
const Client = [];

const rx_live = /^[+-]?\d*(?:[,.]\d*)?$/;

// Teach Autosuggest how to calculate suggestions for any given input value.
// const getSuggestions = (value) => {
//   const inputValue = value.trim().toLowerCase();
//   const inputLength = inputValue.length;

//   return inputLength === 0
//     ? []
//     : clients.filter(
//       (lang) => lang.value.toLowerCase().slice(0, inputLength) === inputValue
//     );
// };

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = (suggestion) => suggestion.value;

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion) => <div>{suggestion.value}</div>;

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions2 = (value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? []
    : options.filter(
        (lang) => lang.value.toLowerCase().slice(0, inputLength) === inputValue
      );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue2 = (suggestion) => suggestion.value;

// Use your imagination to render suggestions.
const renderSuggestion2 = (suggestion) => <div>{suggestion.value}</div>;

class AgreementCreate extends Component {
  state = {
    legal_agreement: [
      { lable: 'Reys-8-1995' },
      { lable: 'Rys-9-1998' },
      { lable: 'Yse-1998' },
    ],
    legalOptions: ['Reys-8-1995', 'Rys-9-1998', 'Yse-1998'],
    ContractorResposibilities: [
      'agreement_vals.responsibilities.waterAvailability',
      'agreement_vals.responsibilities.electricityAvailability',
      'agreement_vals.responsibilities.plumbingWork',
      'agreement_vals.responsibilities.electricalWork',
    ],
    agreement_client_res1: [],
    logo: null,
    firsttime: 0,
    logo_preview: null,
    business_info: [],
    agreement_proposal_id: 0,
    email: '',
    emails: [],
    date: moment().format('DD-MM-YYYY'),
    dateFormat: '',
    dateFormat1: '',
    due_date: '',
    date_err: false,
    due_date_err: false,
    sdate: '',
    edate: '',
    sdate_err: false,
    edate_err: false,
    error: null,
    agreement_terms: 'fixed',
    // agreement_type: "",
    agreement_type_err: false,
    row_phase: [],
    mat_pay: '',
    mat_pay_err: false,
    other: '',
    agreement_work_payment_other: '',
    work_pay: '',
    work_pay_err: false,
    agreement_insurances: '',
    agreement_insurances_err: false,
    agreement_milestones: [],
    isPreviewModal: false,
    agreement_other: '',
    agreement_transport_payment: '',
    agreement_transport_payment_err: false,
    agreement_legal_category: '',
    agreement_client_res: '',
    agreement_client_res_other: '',
    agreement_contractor_res: '',
    agreement_contractor_res_other: '',
    agreement_additional_work_price: '',
    agreement_material_guarantee: '',
    agreement_material_guarantee_err: false,
    agreement_work_guarantee: '',
    agreement_work_guarantee_err: false,
    agreement_panelty: '',
    agreement_panelty_err: false,
    agreement_rate: '',
    agreement_service_fee: '',
    agreement_estimated_payment: '',
    attachment: null,
    attachment_pre: null,
    name: this.props.location.state?.data ? this.props.location.state.data : '',
    name_err: false,
    customerInfoErr: '',

    errors: [],
    name_unq: null,
    show_errors: false,
    show_msg: false,
    loading: false,
    loading_1: false,

    tender_id: 0,
    proposal_id: 0,
    agreement_id: 0,
    selectedOption: null,
    value: '',
    suggestions: [],
    suggestions2: [],
    userEmail: null,
    client_id: null,
    client_id_err: false,
    configuration_val: null,

    work_template: null,
    mat_template: null,
    success: false,
    agreement_status: 0,
    agreement_client_type: 0,
    agreement_tender_draft: 0,
    agreement_request_id_tender: 0,
    agreement_type: 'project',

    left: null,
    right: null,
    redirect_p: false,
    agreement_client_res2: [],
    selectedValues: [],
    agreement_legal_category2: [],
    agreement_contractor_res2: [],

    lest: [],
    Client: [],
    Contractor: [],
    isModalOpen: false,
    address: '',
    text1: '',
    text2: '',
    text3: '',
  };

  componentDidMount = () => {
    if (this.props.match.params.customer !== undefined) {
      this.setState({
        tender_id: this.props.match.params.tender,
        agreement_proposal_id: this.props.match.params.tender,
      });
      this.getEmail(this.props.match.params.tender);
      this.setProposalData(this.props.match.params.tender);
      // this.setDataTender(this.props.match.params.tender);
    }
    if (
      this.props.match.params.customer !== undefined &&
      this.props.match.params.draft !== undefined
    ) {
      this.setData(this.props.match.params.tender);
    }
    this.loadResources();
    this.loadClient();
    this.loadAgreementID();
    this.loadConfig();
    this.loadCurrency();
    this.myRef = React.createRef();
    this.myRefType = React.createRef();
    this.myRefTerms = React.createRef();

    this.interval = setInterval(() => {
      this.checkallfields();
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  addCustomer = () => {
    this.loadClient();
  };

  getEmail = async (id) => {
    if (id > 0) {
      const token = await localStorage.getItem('token');
      await getData(`${url}/api/users/${id}`, token)
        .then((result) => {
          if (result.data.length > 0) {
            this.setState({
              userEmail: result.data,
              value: result.data,
            });
          }
        })
        .catch((err) => {
          // //console.log(err);
        });
    }
  };

  loadCurrency = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/config/currency`, token)
      .then((result) => {
        const { left, right } = result.data;
        this.setState({ left, right });
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  setProposalData = async (id) => {
    // const token = await localStorage.getItem("token");
    // const response = await axios.get(`${url}/api/proposal/get/byPID/${id}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    // if (response?.status === 200) {
    //   if (response.data?.data.length > 0) {
    //     // //console.log("response?.data.data",response?.data.data[0].work_template.total , id);
    //     const { work_template, mat_template } = await response.data?.data[0];
    //     this.setState({ work_template, mat_template });
    //   }
    // }
    const token = localStorage.getItem('token');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);
    var formdata = new FormData();

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}/api/proposal/get/byPID/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // //console.log("============result", result.data?.data)
        if (result.data) {
          const { work_template, mat_template } = result.data[0];
          this.setState({ work_template, mat_template });
        }
      })
      .catch((error) => {
        //console.log('error', error)
      });
  };

  setProposalDataReq = async (id) => {
    const token = await localStorage.getItem('token');
    const response = await getData(
      `${url}/api/agreement/get/byRID/${id}`,
      token
    );

    if (response?.status === 200) {
      if (response?.data?.data[0]?.length > 0) {
        console.log('response.data?.data[0]', response.data);
        const { work_template, mat_template } = response?.data?.data[0];
        this.setState({ work_template, mat_template });
      }
    }
  };

  setData = async (id) => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/agreement/get/byID/${id}`, token)
      .then((result) => {
        const {
          agreement_tender_id,
          agreement_proposal_id,
          agreement_client_type,
          // agreement_client_id,
          // agreement_user_id,
          // agreement_request_id,
          agreement_other,
          // agreement_pdf,
          agreement_attachment,
          emails,
          date,
          agreement_due_date,
          agreement_end_date,
          agreement_start_date,
          agreement_terms,
          agreement_type,
          agreement_milestones,
          agreement_rate,
          agreement_service_fee,
          agreement_estimated_payment,
          agreement_material_payment,
          agreement_work_payment,
          agreement_work_guarantee,
          agreement_material_guarantee,
          agreement_transport_payment,
          agreement_legal_category,
          agreement_client_res,
          agreement_client_res1,
          agreement_client_res2,
          agreement_contractor_res,
          agreement_contractor_res1,
          agreement_contractor_res2,
          agreement_additional_work_price,
          agreement_insurance,
          agreement_panelty,
          agreement_general,
          email,
          agreement_status,
          agreement_names,
          agreement_legal_category1,
          agreement_legal_category2,
          agreement_work_payment_other,
        } = result.data[0];

        // console.log("=========agreement_legal_category1=========", JSON.parse(agreement_legal_category1));

        if (agreement_milestones && agreement_type == 'milestone') {
          this.setState({
            row_phase: JSON.parse(agreement_milestones),
            agreement_type: 'milestone',
          });
        } else {
          this.setState({
            agreement_type: 'project',
            row_phase: JSON.parse(agreement_milestones),
          });
        }
        console.log(agreement_end_date, 'datee...');
        this.setState({
          agreement_work_payment_other:
            agreement_work_payment_other !== undefined
              ? agreement_work_payment_other
              : agreement_work_payment_other,
          agreement_proposal_id:
            agreement_proposal_id === 'null' || agreement_proposal_id === null
              ? ''
              : agreement_proposal_id,
          tender_id:
            agreement_tender_id === 'null' || agreement_tender_id === null
              ? ''
              : agreement_tender_id,
          emails: emails ? emails.split(',') : [],
          date: date === 'null' || date === null ? '' : date,
          dateFormat:
            date === 'null' || date === null
              ? ''
              : date.split('-').reverse().join('-'),
          due_date:
            agreement_due_date === 'null' || agreement_due_date === null
              ? ''
              : moment(new Date(agreement_due_date)).format('DD-MM-YYYY'),
          sdate:
            agreement_start_date === 'null' || agreement_start_date === null
              ? ''
              : moment(new Date(agreement_start_date)).format('DD-MM-YYYY'),
          edate:
            agreement_end_date === 'null' || agreement_end_date === null
              ? ''
              : moment(new Date(agreement_end_date)).format('DD-MM-YYYY'),
          agreement_terms:
            agreement_terms === 'null' || agreement_terms === null
              ? ''
              : agreement_terms,
          // agreement_type: agreement_terms === "null" || agreement_terms === null ? "" : agreement_terms,
          // row_phase: JSON.parse(agreement_milestones),
          agreement_rate:
            agreement_rate === 'null' || agreement_rate === null
              ? ''
              : agreement_rate,
          agreement_service_fee:
            agreement_service_fee === 'null' || agreement_service_fee === null
              ? ''
              : agreement_service_fee,
          agreement_estimated_payment:
            agreement_estimated_payment === 'null' ||
            agreement_estimated_payment === null
              ? ''
              : agreement_estimated_payment,
          mat_pay:
            agreement_material_payment === 'null' ||
            agreement_material_payment === null
              ? ''
              : agreement_material_payment,
          work_pay:
            agreement_work_payment === 'null' || agreement_work_payment === null
              ? ''
              : agreement_work_payment,
          agreement_work_guarantee:
            agreement_work_guarantee === 'null' ||
            agreement_work_guarantee === null
              ? ''
              : agreement_work_guarantee,
          agreement_material_guarantee:
            agreement_material_guarantee === 'null' ||
            agreement_material_guarantee === null
              ? ''
              : agreement_material_guarantee,
          agreement_transport_payment:
            agreement_transport_payment === 'null' ||
            agreement_transport_payment === null
              ? ''
              : agreement_transport_payment,
          agreement_legal_category:
            agreement_legal_category === 'null' ||
            agreement_legal_category === null
              ? ''
              : agreement_legal_category,
          // agreement_client_res: agreement_client_res === "null" || agreement_client_res === null ? "" : agreement_client_res,
          // agreement_contractor_res: agreement_contractor_res === "null" || agreement_contractor_res === null ? "" : agreement_contractor_res,
          agreement_additional_work_price:
            agreement_additional_work_price === 'null' ||
            agreement_additional_work_price === null
              ? ''
              : agreement_additional_work_price,
          agreement_insurances:
            agreement_insurance === 'null' || agreement_insurance === null
              ? ' '
              : agreement_insurance,
          agreement_panelty:
            agreement_panelty === 'null' || agreement_panelty === null
              ? ''
              : agreement_panelty,
          agreement_general:
            agreement_general === 'null' || agreement_general === null
              ? ''
              : agreement_general,
          agreement_other:
            agreement_other === 'null' || agreement_other === null
              ? ''
              : agreement_other,
          userEmail: email === 'null' || email === null ? '' : email,
          value: email === 0 ? '' : email,
          attachment_pre:
            agreement_attachment === 'null' || agreement_attachment === null
              ? ''
              : agreement_attachment,
          attachment:
            agreement_attachment === 'null' || agreement_attachment === null
              ? ' '
              : agreement_attachment,
          agreement_status:
            agreement_status === 'null' || agreement_status === null
              ? ''
              : agreement_status,
          agreement_client_type:
            agreement_client_type === 'null' || agreement_client_type === null
              ? ' '
              : agreement_client_type,
          name:
            agreement_names === 'null' || agreement_names === null
              ? ''
              : agreement_names,
          agreement_client_res2: agreement_client_res2,
        });

        this._c_total.value = agreement_rate;
        // this.agreement_legal_category.value = agreement_legal_category;
        // this.agreement_client_res.value = agreement_client_res;
        // this.agreement_contractor_res.value = agreement_contractor_res;

        // if (agreement_legal_category1) {
        //   this.setState({
        //     selectedValues: JSON.parse(agreement_legal_category1)
        //   })
        //   const a  = JSON.parse(agreement_legal_category2)
        //   console.log("agreement_legal_category2" , a[0]);
        //   // const data = JSON.parse(agreement_legal_category1);
        //   let tempuser = this.state.legal_agreement?.filter((item, i) => item.lable === a[i]);
        //   console.log("tempuser", tempuser);
        //   for (var i = 0; i < this.state.legal_agreement?.length; ++i)
        //     lest.push(tempuser[i].lable);
        // }

        if (agreement_client_res1) {
          // console.log("JSON.parse(agreement_client_res1)" , JSON.parse(agreement_client_res1));
          this.setState({
            agreement_client_res1: JSON.parse(agreement_client_res1),
            Client: JSON.parse(agreement_client_res2),
          });
          const a = JSON.parse(agreement_client_res2);
          let tempuser = a?.filter((item, i) => item);
          for (var i = 0; i < a?.length; ++i) Client.push(tempuser[i]);
        }

        if (agreement_contractor_res1) {
          const data = JSON.parse(agreement_contractor_res2);

          this.setState({
            agreement_contractor_res1: JSON.parse(agreement_contractor_res1),
            agreement_contractor_res2: agreement_contractor_res2,
            Contractor: data,
          });
          // let tempuser = data?.filter((item, i) => item);
          // for (var i = 0; i < data?.length; ++i)
          //   Contractor.push(tempuser[i]);
        }

        if (agreement_legal_category1) {
          this.setState({
            selectedValues: JSON.parse(agreement_legal_category1),
            agreement_legal_category2: agreement_legal_category2,
          });
          const a = JSON.parse(agreement_legal_category2);
          this.setState({
            lest: a,
          });
          // let tempuser = this.state.legal_agreement?.filter((item, i) => item.lable === a[i]);
          // console.log("tempuser", tempuser);
          // for (var i = 0; i < this.state.legal_agreement?.length; ++i)
          //   lest.push(tempuser[i].lable);
        }
      })

      .catch((err) => {
        //console.log(err);
      });

    // if (this.state.agreement_client_type === "user") {
    this.setProposalDataReq(id);
    // }
  };

  loadAgreementID = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/agreement/get/latest`, token)
      .then((result) => {
        if (
          Object.keys(result.data).length === 0 &&
          result.data.constructor === Object
        ) {
          this.setState({ agreement_id: 1 });
        } else {
          this.setState({ agreement_id: result.data.agreement_id + 1 });
        }
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  loadConfig = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/config/fee`, token)
      .then((result) => {
        const { configuration_val } = result.data.data[0];
        this.setState({ configuration_val: configuration_val });
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  loadResources = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/resources-list`, token)
      .then((result) => {
        result.data.data.map((res) => {
          var keys = ['value', 'label'];
          var _key = {};
          keys.forEach((key, i) => (_key[key] = res.email));
          options.push(_key);
        });
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  loadClient = async () => {
    const token = await localStorage.getItem('token');
    await getData(`${url}/api/resources-list/Client`, token)
      .then((result) => {
        result.data.map((res) => {
          var keys = ["value", "label", "name"];
          var _key = {};
          keys.forEach((key, i) => (key === "name"? _key[key] = res.first_name : _key[key] = res.email));
          clients.push(_key);
        });
      })
      .catch((err) => {
        //console.log(err.response);
      });
  };

  handleAuto = (selectedOption) => {
    this.setState({ selectedOption });
  };
  onChange = (event, { newValue }) => {
    this.setState({
      client_id_err: false,
      value: newValue,
      errro_mess: '',
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
      errro_mess: t('myBusiness.contract.No_record'),
    });
    return [];
  }

  getSuggestion = (value) => {
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
    return data.length !== 0
      ? clients.filter(
        (lang) =>
        (lang.value.toLowerCase().slice(0, inputLength) === inputValue) || (lang.name.toLowerCase().slice(0, inputLength) === inputValue)
        )
      : this.data_state();
  };
  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    if (value) {
      this.setState({
        suggestions: this.getSuggestion(value),
      });
    }
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  onSuggestionsFetchRequested2 = ({ value }) => {
    this.setState({
      suggestions2: getSuggestions2(value),
    });
  };

  // // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested2 = () => {
    this.setState({
      suggestions2: [],
    });
  };

  findIndexText = (index) => {
    const { t } = this.props;
    if (index === 0) {
      return t('myBusiness.contract.Select');
    } else if (index === 1) {
      return t('myBusiness.contract.delivery');
    } else if (index === 2) {
      return t('myBusiness.contract.project_done');
    } else if (index === 3) {
      return t('myBusiness.contract.inovice');
    } else if (index === 4) {
      return t('myBusiness.contract.Custom_message');
    }
  };

  findIndexTextTwo = (index) => {
    const { t } = this.props;
    if (index === 0) {
      return t('myBusiness.offer.Select');
    } else if (index === 1 && this.state.agreement_terms === 'fixed') {
      return t('myBusiness.contract.PaymentA');
    } else if (index === 2) {
      return t('myBusiness.contract.Custom_message');
    } else if (index === 1 && this.state.agreement_terms === 'hourly') {
      return t('myBusiness.contract.Pay_hourly');
    }
  };

  findIndexTextThree = (index) => {
    const { t } = this.props;
    if (index === 0) {
      return t('myBusiness.contract.Select');
    } else if (index === 1) {
      return t('myBusiness.contract.included');
    } else if (index === 2) {
      return t('myBusiness.contract.Not_included');
    }
  };

  handleChange2 = (event) => {
    console.log(this.state.agreement_terms);
    const { name, value } = event.target;
    console.log(event.nativeEvent.target.selectedIndex);
    this.setState({
      [name]: value,
      error: null,
    });
    if (name === 'mat_pay') {
      this.setState({
        text1: this.findIndexText(event.nativeEvent.target.selectedIndex),
      });
    }
    if (name === 'work_pay') {
      this.setState({
        text2: this.findIndexTextTwo(event.nativeEvent.target.selectedIndex),
      });
    }
    if (name === 'agreement_transport_payment') {
      this.setState({
        text3: this.findIndexTextThree(event.nativeEvent.target.selectedIndex),
      });
    }
  };
  handleBusinessInfo = (val) => {
    this.setState({ business_info: val });
    this.setState({
      agreement_work_guarantee:
        this.state.business_info.agreement_work_guarantee,
      agreement_material_guarantee:
        this.state.business_info.agreement_material_guarantee,
      agreement_insurances: this.state.business_info.agreement_insurances,
      agreement_panelty: this.state.business_info.agreement_panelty,
    });
  };
  handleAppend = (event) => {
    // event.preventDefault();
    let row_phase = this.state.row_phase;
    let keys = ['des', 'due_date', 'amount'];
    let gg = `${''},${''},${'amount'}`.split(',');
    let result = {};
    keys.forEach((key, i) => (result[key] = gg[i]));
    row_phase.push(result);
    this.setState({ row_phase: row_phase });
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
      error = `${email} ${t('myBusiness.contract.alreday_have')}`;
    }
    if (!this.isEmail(email)) {
      error = `${email} ${t('myBusiness.contract.emailmessage')}`;
    }
    if (error) {
      this.setState({ error });
      return false;
    }
    this.setState({ error: '' });
    return true;
  }
  isInList(email) {
    return this.state.emails.includes(email);
  }
  isEmail(email) {
    return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
  }

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

  // handleChange7 = (event) => {
  //   if (event.target.files[0].size > 2097152) {
  //     return alert("cannot be more than 2 mb");
  //   }
  //   if (
  //     event.target.files[0].name.split(".").pop() == "pdf" ||
  //     event.target.files[0].name.split(".").pop() == "PDF" ||
  //     event.target.files[0].name.split(".").pop() == "docx" ||
  //     event.target.files[0].name.split(".").pop() == "doc" ||
  //     event.target.files[0].name.split(".").pop() == "jpeg" ||
  //     event.target.files[0].name.split(".").pop() == "png" ||
  //     event.target.files[0].name.split(".").pop() == "PNG" ||
  //     event.target.files[0].name.split(".").pop() == "jpg" ||
  //     event.target.files[0].name.split(".").pop() == "JPG" ||
  //     event.target.files[0].name.split(".").pop() == "gif" ||
  //     event.target.files[0].name.split(".").pop() == "svg"
  //   ) {
  //     this.setState({ attachment: event.target.files[0] });
  //   } else {
  //     this.setState({ attachment: null });
  //     return alert("File type not supported");
  //   }
  // };

  onFilesChange = (files) => {
    if (files[0]) {
      this.setState({
        attachment: files[0],
        file_err: '',
        img_name: files[0].name,
      });
    }
  };

  onFilesError = (error, file) => {
    //console.log(file, 'error code ' + error.code + ': ' + error.message)
    this.setState({
      file_err: error.message,
    });
  };

  handleAttachmentRemove = () => {
    this.setState({ attachment: null, img_name: '', file_err: '' });
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
    // console.log(this.state.sdate,"datee",this.state.edate);
  };

  handleDraft = async (event) => {
    event.preventDefault();

    this.setState({
      mat_pay_err: false,
      work_pay_err: false,
      date_err: false,
      due_date_err: false,
      name_err: false,
      name_unq: null,
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

    let agreement_type =
      this.state.agreement_terms === 'hourly'
        ? 'hourly'
        : this.state.agreement_type;

    const token = await localStorage.getItem('token');
    this.setState({ loading: true });
    const data = new FormData();
    // data.set('logo', this.state.logo)
    data.set('agreement_request_id', this.requestInput.value);
    data.set('agreement_tender_id', 0);
    data.set('agreement_client_id', client_id);
    data.set('agreement_proposal_id', this.state.agreement_proposal_id);
    data.set('emails', this.state.emails);
    data.set('date', this.state.date);
    data.set('client_address', this.state.address);
    data.set('agreement_terms', this.state.agreement_terms);
    data.set('agreement_type', agreement_type);
    data.set('agreement_material_payment', this.state.mat_pay);
    data.set('agreement_insurance', this.state.agreement_insurances);
    data.set('agreement_work_payment', this.state.work_pay);
    data.set('agreement_work_guarantee', this.state.agreement_work_guarantee);
    data.set('agreement_legal_category', this.state.lest);
    data.set('agreement_client_res', this.state.Client);
    data.set('agreement_contractor_res', this.state.Contractor);
    data.set('sent', 0);
    data.set(
      'agreement_additional_work_price',
      this.state.agreement_additional_work_price
    );
    data.set(
      'agreement_material_guarantee',
      this.state.agreement_material_guarantee
    );
    data.set(
      'agreement_transport_payment',
      this.state.agreement_transport_payment
    );
    data.set('agreement_due_date', this.state.due_date);
    data.set('agreement_panelty', this.state.agreement_panelty);
    data.set('agreement_rate', this._c_total.value);
    data.set('agreement_other', this.state.other);

    data.set(
      'agreement_work_payment_other',
      this.state.agreement_work_payment_other
    );
    data.set('agreement_start_date', this.state.sdate);
    data.set('agreement_end_date', this.state.edate);

    if (
      this._milestone.value.des != undefined ||
      this._milestone.value.due_date != undefined ||
      this._milestone.value.amount != undefined
    ) {
      data.set('agreement_milestones', this._milestone.value);
    } else {
      data.set('agreement_milestones', this._milestone.value);
    }
    data.set(
      'agreement_service_fee',
      this._fee.value === 'NaN' ? 0 : this._fee.value
    );
    data.set(
      'agreement_estimated_payment',
      this.est_pay.value === 'NaN' ? 0 : this.est_pay.value
    );
    data.set('agreement_names', this.state.name);
    data.set(
      'agreement_client_res_other',
      this.state.agreement_client_res_other
    );
    data.set(
      'agreement_contractor_res_other',
      this.state.agreement_contractor_res_other
    );
    data.append('attachment', this.state.attachment);
    await postDataWithToken(`${url}/api/agreement/draft`, data, token)
      .then((res) => {
        // //console.log("res.data=====", res.data);
        this.setState({
          loading: false,
          show_msg: true,
          redirect_p: true,
          loading_1: false,
          due_date: '',
          other: '',
          mat_pay: '',
          work_pay: '',
          agreement_transport_payment: '',
          agreement_client_res_other: '',
          agreement_material_guarantee: '',
          agreement_work_guarantee: '',
          agreement_insurances: '',
          agreement_panelty: '',
          agreement_additional_work_price: '',
          success: 'Your Request have been submit succesfully',
          redirect_page: false,
        });
        this.myRef.current.scrollTo(0, 0);
      })
      .catch((err) => {
        // Object.entries(err.response.data.error).map(([key, value]) => {
        //   this.setState({ errors: err.response.data.error });
        // }); show_errors: true,
        if (err.response.status === 406) {
          if (err.response.data.error.agreement_names) {
            this.setState({
              name_unq: err.response.data.error.agreement_names[0],
            });
          }
        }
        if (err.response.status === 403) {
          this.setState({
            client_id_err: true,
            loading: false,
          });
        }
        if (err.response.status === 500) {
          alert('Request cannot be processed, try again later');
        }
        this.setState({ loading: false });
        this.myRef.current.scrollTo(0, 0);
      });

    // Display the key/value pairs
    // for (var pair of data.entries()) {
    //   //console.log(pair[0] + ", " + pair[1]);
    // }
  };

  handleSubmit = async (e, event) => {
    e.preventDefault();

    this.setState({
      date_err: false,
      due_date_err: false,
      agreement_type_err: false,
      mat_pay_err: false,
      work_pay_err: false,
      agreement_transport_payment_err: false,
      agreement_material_guarantee_err: false,
      agreement_work_guarantee_err: false,
      agreement_insurances_err: false,
      agreement_panelty_err: false,
      name_err: false,
      customerInfoErr: '',
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

    let agreement_type =
      this.state.agreement_terms === 'hourly'
        ? 'hourly'
        : this.state.agreement_type;

    if (this.state.date == '' || this.state.date == null) {
      this.myRef.current.scrollTo(0, 0);
      return this.setState({ date_err: true });
    }
    if (this.state.due_date == '' || this.state.due_date == null) {
      this.myRef.current.scrollTo(0, 0);
      return this.setState({ due_date_err: true });
    }
    if (agreement_type == '' || agreement_type == null) {
      this.myRefType.current.scrollIntoView();
      return this.setState({ agreement_type_err: true });
    }
    if (this.state.mat_pay == '' || this.state.mat_pay == null) {
      this.myRefTerms.current.scrollIntoView();
      return this.setState({ mat_pay_err: true });
    }
    if (this.state.work_pay == '' || this.state.work_pay == null) {
      this.myRefTerms.current.scrollIntoView();
      return this.setState({ work_pay_err: true });
    }
    if (
      this.state.agreement_transport_payment == '' ||
      this.state.agreement_transport_payment == null
    ) {
      this.myRefTerms.current.scrollIntoView();
      return this.setState({ agreement_transport_payment_err: true });
    }
    if (
      this.state.agreement_material_guarantee == '' ||
      this.state.agreement_material_guarantee == null
    ) {
      this.myRefTerms.current.scrollIntoView();
      return this.setState({ agreement_material_guarantee_err: true });
    }
    if (
      this.state.agreement_work_guarantee == '' ||
      this.state.agreement_work_guarantee == null
    ) {
      this.myRefTerms.current.scrollIntoView();
      return this.setState({ agreement_work_guarantee_err: true });
    }
    if (
      this.state.agreement_insurances == '' ||
      this.state.agreement_insurances == null
    ) {
      this.myRefTerms.current.scrollIntoView();
      return this.setState({ agreement_insurances_err: true });
    }
    if (
      this.state.agreement_panelty == '' ||
      this.state.agreement_panelty == null
    ) {
      this.myRefTerms.current.scrollIntoView();
      return this.setState({ agreement_panelty_err: true });
    }
    if (this.state.name == null || this.state.name == '') {
      this.myRef.current.scrollTo(0, 0);
      return this.setState({ name_err: true });
    }

    this.setState({ loading_submit: true });

    const token = await localStorage.getItem('token');
    const data = new FormData();
    data.set('agreement_request_id', this.requestInput.value);
    data.set('agreement_tender_id', 0);
    data.set('agreement_client_id', client_id);
    data.set('agreement_proposal_id', this.state.agreement_proposal_id);
    data.set('emails', this.state.emails);
    data.set('date', this.state.date);
    data.set('agreement_terms', this.state.agreement_terms);
    data.set('agreement_type', agreement_type);
    data.set('agreement_material_payment', this.state.mat_pay);
    data.set('agreement_insurance', this.state.agreement_insurances);
    data.set('agreement_other', this.state.agreement_other);
    data.set('agreement_work_payment', this.state.work_pay);
    data.set(
      'agreement_work_payment_other',
      this.state.agreement_work_payment_other
    );
    data.set('agreement_work_guarantee', this.state.agreement_work_guarantee);
    data.set('agreement_legal_category', this.state.lest);
    data.set('agreement_client_res', this.state.Client);
    data.set(
      'agreement_client_res_other',
      this.state.agreement_client_res_other
    );
    data.set('agreement_contractor_res', this.state.Contractor);
    data.set(
      'agreement_contractor_res_other',
      this.state.agreement_contractor_res_other
    );
    data.set(
      'agreement_additional_work_price',
      this.state.agreement_additional_work_price
    );
    data.set(
      'agreement_material_guarantee',
      this.state.agreement_material_guarantee
    );
    data.set(
      'agreement_transport_payment',
      this.state.agreement_transport_payment
    );
    data.set('agreement_due_date', this.state.due_date);
    data.set('agreement_panelty', this.state.agreement_panelty);
    data.set('agreement_rate', this._c_total.value);
    data.set('agreement_milestones', this._milestone.value);
    data.set(
      'agreement_service_fee',
      this._fee.value === 'NaN' ? 0 : this._fee.value
    );
    data.set(
      'agreement_estimated_payment',
      this.est_pay.value === 'NaN' ? 0 : this.est_pay.value
    );
    data.set('sent', event);
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
    data.set('mat_template', JSON.stringify(this.state.mat_template));
    data.set('work_template', JSON.stringify(this.state.work_template));
    data.set('agreement_names', this.state.name);
    // data.append("attachment", this.state.attachment);
    data.append(
      'attachment',
      this.state.attachment === null ? ' ' : this.state.attachment
    );
    data.set('agreement_start_date', this.state.sdate);
    data.set('agreement_end_date', this.state.edate);
    await postDataWithToken(`${url}/api/agreement/create`, data, token)
      .then((res) => {
        this.setState({
          redirect_p: true,
          loading_submit: false,
          success: 'Your Request have been submit succesfully',
          redirect_page: false,
          show_msg: true,
          loading: false,
          date: '',
          mat_pay: '',
          agreement_insurances: '',
          other: '',
          work_pay: '',
          agreement_work_guarantee: '',
          agreement_client_res_other: '',
          agreement_contractor_res_other: '',
          agreement_additional_work_price: '',
          agreement_material_guarantee: '',
          agreement_transport_payment: '',
          due_date: '',
          agreement_panelty: '',
          mat_template: null,
          work_template: null,
          name: '',
          attachment: null,
        });
        // this.agreement_legal_category.value = "";
        // this.agreement_client_res.value = "";
        // this.agreement_contractor_res.value = "";
        this._c_total.value = '';
        this._milestone.value = '';
        this._fee.value = '';
        this.est_pay.value = '';
        this.myRef.current.scrollTo(0, 0);
        // this.props.history.push("/agreement-listing");
      })
      .catch((err) => {
        if (err?.response.status === 406) {
          if (err.response.data.error.agreement_names) {
            this.setState({
              name_unq: err.response.data.error.agreement_names[0],
            });
          }
          if (err.response.data.error.agreement_client_id) {
            this.setState({
              client_id_err: true,
            });
          }
        }
        if (err?.response.status === 403) {
          this.setState({
            client_id_err: true,
          });
        }
        if (err.response.status === 500) {
          alert('Request cannot be processed, try again later');
        }
        this.setState({ loading_submit: false });
        this.myRef.current.scrollTo(0, 0);
      });
    // Display the key/value pairs
    for (var pair of data.entries()) {
      // //console.log(pair[0] + ", " + pair[1]);
    }
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

    let agreement_type =
      this.state.agreement_terms === 'hourly'
        ? 'hourly'
        : this.state.agreement_type;

    const token = await localStorage.getItem('token');
    this.setState({ loading_update: true });
    const data = new FormData();
    data.set('agreement_request_id', this.requestInput.value);
    data.set('agreement_tender_id', this.state.tender_id);
    data.set('agreement_client_id', client_id);
    data.set('agreement_proposal_id', this.state.agreement_proposal_id);
    data.set('emails', this.state.emails);
    data.set('date', this.state.date);
    data.set('agreement_terms', this.state.agreement_terms);
    data.set('agreement_type', agreement_type);
    data.set('agreement_material_payment', this.state.mat_pay);
    data.set('agreement_insurance', this.state.agreement_insurances);
    // other
    data.set('agreement_other', this.state.other);
    data.set('agreement_legal_category', this.state.lest);
    //
    data.set('agreement_work_payment', this.state.work_pay);
    data.set('agreement_work_guarantee', this.state.agreement_work_guarantee);
    data.set('agreement_legal_category', this.agreement_legal_category.value);
    data.set('agreement_client_res', this.state.Client);
    data.set('agreement_contractor_res', this.state.Contractor);
    data.set(
      'agreement_additional_work_price',
      this.state.agreement_additional_work_price
    );
    data.set(
      'agreement_material_guarantee',
      this.state.agreement_material_guarantee
    );
    data.set(
      'agreement_transport_payment',
      this.state.agreement_transport_payment
    );
    data.set('agreement_due_date', this.state.due_date);
    data.set('agreement_panelty', this.state.agreement_panelty);
    data.set('agreement_rate', this._c_total.value);
    data.set('agreement_milestones', this._milestone.value);
    data.set(
      'agreement_service_fee',
      this._fee.value === 'NaN' ? 0 : this._fee.value
    );
    data.set(
      'agreement_estimated_payment',
      this.est_pay.value !== null || this.est_pay.value !== 'null'
        ? 0
        : this.est_pay.value
    );
    data.set('agreement_names', this.state.name);
    data.set(
      'agreement_client_res_other',
      this.state.agreement_client_res_other
    );
    data.set(
      'agreement_contractor_res_other',
      this.state.agreement_contractor_res_other
    );
    data.append('attachment', this.state.attachment);

    data.set('agreement_start_date', this.state.sdate);
    data.set('agreement_end_date', this.state.edate);

    await postDataWithToken(`${url}/api/agreement/put`, data, token)
      .then((res) => {
        console.log(res);
        this.setState({
          show_msg: true,
          loading_update: false,
          loading: false,
          success: true,
          redirect_page: false,
          redirect_p: true,
          date: '',
          mat_pay: '',
          agreement_insurances: '',
          other: '',
          work_pay: '',
          agreement_work_guarantee: '',
          agreement_client_res_other: '',
          agreement_contractor_res_other: '',
          agreement_additional_work_price: '',
          agreement_material_guarantee: '',
          agreement_transport_payment: '',
          due_date: '',
          agreement_panelty: '',
          mat_template: null,
          work_template: null,
          name: '',
          attachment: null,
        });
        this.myRef.current.scrollTo(0, 0);
      })
      .catch((err) => {
        if (err.response.data.error) {
          Object.entries(err.response.data.error).map(([key, value]) => {
            this.setState({ errors: err.response.data.error });
          });
          this.setState({ show_errors: true, loading: false });
        }
        if (err.response.status === 403) {
          this.setState({
            client_id_err: true,
            loading: false,
          });
        }
        if (err.response.status === 500) {
          alert('Request cannot be processed, try again later');
        }
        this.myRef.current.scrollTo(0, 0);
        this.setState({
          loading_update: false,
        });
      });

    // Display the key/value pairs
    // for (var pair of data.entries()) {
    //   //console.log(pair[0] + ", " + pair[1]);
    // }
  };

  hiddenFields = () => {
    this.setState({
      client_id:
        this.state.value === '' ? this.state.userEmail : this.state.value,
      agreement_milestones: this._milestone.value,
      // agreement_legal_category: this.agreement_legal_category.value,
      // agreement_client_res: this.agreement_client_res.value,
      // agreement_contractor_res: this.agreement_contractor_res.value,
      agreement_estimated_payment: this.est_pay.value ? this.est_pay.value : '',
      isPreviewModal: !this.state.isPreviewModal,
    });
  };

  checkallfields() {
    if (!this.state.redirect_p) {
      if (
        this.state.due_date ||
        this.state.other ||
        this.state.mat_pay ||
        this.state.work_pay ||
        this.state.agreement_transport_payment ||
        this.state.agreement_client_res_other ||
        this.state.agreement_material_guarantee ||
        this.state.agreement_work_guarantee ||
        this.state.agreement_insurances ||
        this.state.agreement_panelty ||
        this.state.agreement_additional_work_price
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
  }

  milestone_add = () => {
    this.setState({
      agreement_type: 'milestone',
    });
    if (this.state.row_phase.length <= 0) {
      this.handleAppend();
    }
  };

  agreement_type = () => {
    this.setState({
      agreement_type: 'project',

      // row_phase: this.state.row_phase ? "" : "" ,
    });
    if (
      this.props.match.url !==
      `/business-agreement-create/${this.props.match.params.tender}/${this.props.match.params.customer}/update`
    ) {
      this.setState({
        row_phase: [],
      });
    }
  };

  onConfirmError = () => {
    this.setState({
      server: false,
      validation: false,
      success: false,
      redirect_page: false,
    });
    this.props.history.push('/agreement-listing');
  };

  check_input = (e) => {
    if (rx_live.test(e.target.value))
      this.setState({
        change_data: true,
      });
  };

  onSelect = (selectedList, selectedItem) => {
    this.setState((state) => ({
      lest: [...state.lest, selectedItem],
    }));
  };

  onRemove = (selectedList, removedItem) => {
    this.setState((state) => ({
      lest: this.state.lest?.filter(function (data) {
        return data !== removedItem;
      }),
    }));
  };

  onSelect1 = (selectedList, selectedItem) => {
    this.setState((state) => ({
      Contractor: [...state.Contractor, this.findIndexTextFour(selectedItem)],
    }));
  };

  onRemove1 = (selectedList, removedItem) => {
    this.setState((state) => ({
      Contractor: this.state.Contractor?.filter(function (data) {
        return data !== removedItem;
      }),
    }));
  };

  findIndexTextFour = (element) => {
    const { t } = this.props;
    // return array.find((val) => t(val) === element)?.element;
    if (element === t('agreement_vals.responsibilities.waterAvailability')) {
      return 'water supply';
    } else if (
      element === t('agreement_vals.responsibilities.electricityAvailability')
    ) {
      return 'electricity supply';
    } else if (element === t('agreement_vals.responsibilities.plumbingWork')) {
      return 'plumbing supply';
    } else if (
      element === t('agreement_vals.responsibilities.electricalWork')
    ) {
      return 'electricity work';
    }
  };

  onSelect2 = (selectedList, selectedItem) => {
    this.setState((state) => ({
      Client: [...state.Client, this.findIndexTextFour(selectedItem)],
    }));
  };

  onRemove2 = (selectedList, removedItem) => {
    this.setState((state) => ({
      Client: this.state.Client?.filter(function (data) {
        return data !== removedItem;
      }),
    }));
  };

  handleagreement_other = (e) => {
    this.setState({
      agreement_other: e.target.value,
    });
  };

  render() {
    const data = this.props.location.state?.proposal_request_id;
    const { t, i18n } = this.props;
    const inputPropsDate = {
      onKeyDown: this.handleKeyDownCus,
      placeholder: 'DD-MM-YYYY',
    };
    var yesterday = moment().subtract(1, 'day');
    function valid(current) {
      return current.isAfter(yesterday);
    }
    var date1 = this.state.sdate ? moment(this.state.dateFormat1) : null;
    function valid4(current) {
      return current.isAfter(date1);
    }
    var date = moment().add(0, 'day');
    function valid2(current) {
      return current.isAfter(date);
    }
    const userInfo = {
      client_id: this.state.client_id,
      agreement_id: this.state.agreement_id,
      date: this.state.date,
      address: this.state.address,
      due_date: this.state.due_date,
      agreement_terms: this.state.agreement_terms,
      agreement_type: this.state.agreement_type,
      mat_pay:
        this.state.mat_pay === 'other' ? this.state.mat_pay : this.state.text1,
      agreement_other: this.state.agreement_other,
      work_pay: this.state.text2,
      agreement_work_payment_other: this.state.agreement_work_payment_other,
      agreement_insurances: this.state.agreement_insurances, //==========
      agreement_transport_payment: this.state.text3,
      agreement_legal_category:
        this.state.lest.length > 0 ? this.state.lest : [],
      agreement_client_res: this.state.agreement_client_res,
      agreement_client_res_other:
        this.state.Client.length > 0 ? this.state.Client : [],
      agreement_contractor_res:
        this.state.Contractor.length > 0 ? this.state.Contractor : [],
      agreement_contractor_res_other: this.state.agreement_contractor_res_other,
      agreement_milestones: this.state.agreement_milestones,
      agreement_additional_work_price:
        this.state.agreement_additional_work_price,
      agreement_material_guarantee: this.state.agreement_material_guarantee, //==========
      agreement_work_guarantee: this.state.agreement_work_guarantee, //==========
      agreement_panelty: this.state.agreement_panelty, //==========
      agreement_service_fee: this.state.agreement_service_fee,
      agreement_estimated_payment: this.state.agreement_estimated_payment,
      work_template: this.state.work_template,
      mat_template: this.state.mat_template,
      left: this.state.left,
      right: this.state.right,
    };

    let alert, loading, loading_1, loading_update, loading_submit;
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
          {t('success.agreement')}
        </Alert>
      );
    }
    if (this.state.loading === true) {
      loading = (
        <Spinner animation='border' role='status'>
          <span className='sr-only'>Loading...</span>
        </Spinner>
      );
    }
    if (this.state.loading_1 === true) {
      loading_1 = (
        <Spinner animation='border' role='status'>
          <span className='sr-only'>Loading...</span>
        </Spinner>
      );
    }

    if (this.state.loading_submit === true) {
      loading_submit = (
        <Spinner animation='border' role='status'>
          <span className='sr-only'>Loading...</span>
        </Spinner>
      );
    }

    if (this.state.loading_update === true) {
      loading_update = (
        <Spinner animation='border' role='status'>
          <span className='sr-only'>Loading...</span>
        </Spinner>
      );
    }
    console.log(this.state.sdate, 'datee', this.state.edate);

    const { selectedOption, value, email, suggestions, suggestions2 } =
      this.state;

    let req_id =
      this.props.match.params.draft === 'update'
        ? this.props.match.params.tender
        : this.state.agreement_tender_draft === 1
        ? this.state.agreement_request_id_tender
        : this.state.business_info.user_id
        ? `${this.state.business_info.user_id}${this.state.agreement_id}`
        : `${localStorage.getItem('Login_user_id')}${this.state.agreement_id}`;
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: t('myBusiness.contract.email_id_c'),
      value,
      className: 'form-control',
      onChange: this.onChange,
    };

    // Autosuggest will pass through all these props to the input.
    const inputProps2 = {
      placeholder: t('myBusiness.contract.email_id'),
      value: this.state.email,
      className: 'form-control',
      onChange: this.onChange2,
      onKeyDown: this.handleKeyDown,
      onPaste: this.handlePaste,
    };

    const { success } = this.state;

    return (
      <React.Fragment>
        <Prompt
          when={this.state.redirect_page}
          message={t('myBusiness.contract.leave_page')}
        />
        <div>
          {/* <Header active={'bussiness'} /> */}
          <Breadcrumb>
            <Link
              to='/business-dashboard'
              className='breadcrumb-item active'
              aria-current='page'
            >
              {t('myBusiness.contract.heading')}
            </Link>
            <Link
              to='/agreement-listing'
              className='breadcrumb-item active'
              aria-current='page'
            >
              {t('myBusiness.contract.agreement')}
            </Link>
            <li className='breadcrumb-item active' aria-current='page'>
              {t('myBusiness.contract.create')}
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
                  title={t('myBusiness.contract.SuccessPopup')}
                  // title={t("list_details.success1")}
                  onConfirm={this.onConfirmError}
                >
                  {/* {t("list_details.success")} */}
                </SweetAlert>
              ) : (
                ''
              )}

              <div className='container-fluid'>
                <div
                  className='d-md-flex justify-content-between'
                  style={{ maxWidth: '1120px' }}
                >
                  <h3 className='head3'>{t('myBusiness.contract.cre_prop')}</h3>
                  {/* <div>
                    <ReactToPrint
                      trigger={() => {
                        // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                        // to the root node of the returned component as it will be overwritten.
                        return <a href="#">Print this out!</a>;
                      }}
                      content={() => this.componentRef}
                    />
                    <div ref={(el) => (this.componentRef = el)} > <PDFViewAgreement/> </div>
                  </div> */}
                  <div className='mt-md-n3 mt-sm-4 mb-sm-4 mb-md-0'>
                    <button
                      onClick={this.hiddenFields}
                      className='btn btn-gray mb-md-0 mb-3 mr-4 clk2'
                      // data-toggle='modal'
                      // data-target='#preview-info'
                    >
                      {t('myBusiness.contract.Preview_Agreement')}
                    </button>

                    {this.props.match.params.draft !== undefined ||
                    this.state.agreement_tender_draft === 1 ? (
                      <button
                        onClick={this.handleUpdate}
                        className='btn btn-gray mb-md-0 mb-3 mr-4 clk2'
                      >
                        {loading_update ? loading_update : ''}{' '}
                        {t('myBusiness.contract.draft')}
                      </button>
                    ) : (
                      <button
                        onClick={this.handleDraft}
                        className='btn btn-gray mb-md-0 mb-3 mr-4 clk2'
                      >
                        {loading ? loading : ''}{' '}
                        {t('myBusiness.contract.Savedraft')}
                      </button>
                    )}

                    <button
                      onClick={(e) => this.handleSubmit(e, 1)}
                      className='btn btn-primary mb-md-0 mb-4 clk2'
                    >
                      {loading_submit ? loading_submit : ''}
                      {t('myBusiness.contract.submit2')}
                      {/* {t("myBusiness.contract.Send")} */}
                    </button>
                  </div>
                </div>
                <div className='card' style={{ maxWidth: '1120px' }}>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-xl-12 col-lg-12'>
                        <div className='form-group'>
                          <label htmlFor='name'>
                            {t('myBusiness.contract.name')}
                          </label>
                          <input
                            id='name'
                            className='form-control'
                            type='text'
                            autoComplete='off'
                            name='name'
                            value={this.state.name}
                            onChange={this.handleChange2}
                          />
                          <p style={{ color: '#eb516d ' }}>
                            {this.state.name_err === true
                              ? 'Name is required'
                              : null}
                            {this.state.name_unq ? this.state.name_unq : null}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='row'>
                      <input
                        type='hidden'
                        ref={(input) => {
                          this._milestone = input;
                        }}
                        className='_milestone'
                      />
                      <input
                        type='hidden'
                        ref={(input) => {
                          this._fee = input;
                        }}
                        className='_fee'
                      />
                      <input
                        type='hidden'
                        ref={(input) => {
                          this.est_pay = input;
                        }}
                        className='_est_pay'
                      />
                      <input
                        type='hidden'
                        ref={(input) => {
                          this._c_total = input;
                        }}
                        className='_c_total'
                      />
                      <div className='col-lg-5 col-md-6'>
                        <div className='form-group'>
                          <div className='file-select file-sel inline'>
                            <label
                              htmlFor='attachment1sdsd'
                              style={{ width: '70%' }}
                            >
                              <img
                                src={
                                  this.state.business_info.company_logo === null
                                    ? img
                                    : url +
                                      '/images/marketplace/company_logo/' +
                                      this.state.business_info?.company_logo
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
                            {t('myBusiness.contract.buss_info')}{' '}
                            <a
                              href='#'
                              data-toggle='modal'
                              data-target='#edit-info'
                            >
                              {t('myBusiness.contract.Edit')}
                            </a>
                          </label>
                          <div className='collapse' id='business-info'>
                            <div className='form-detail'>
                              <p>{this.state.business_info.company_id}</p>
                              <p>{`${this.state.business_info.first_name} ${this.state.business_info.last_name}`}</p>
                              <p></p>
                              <p>{this.state.business_info.email}</p>
                              <p>{this.state.business_info.company_website}</p>
                            </div>
                          </div>
                        </div>
                        <div className='form-group'>
                          <label htmlFor='customer-info'>
                            {t('myBusiness.contract.cus_info')}
                          </label>
                          {
                            <p className='error'>
                              {this.state.customerInfoErr}
                            </p>
                          }
                          {this.state.tender_id !== 0 ||
                          (this.state.value != '' &&
                            this.props.match.params.draft == 'update' &&
                            this.state.userEmail) ||
                          (this.props.match.url ==
                            `/business-agreement-create/${this.props.match.params.tender}/${this.props.match.params.customer}` &&
                            this.state.value) ? (
                            // || this.state.value
                            //  || this.props?.match?.params?.draft == "update"
                            <input
                              id='customer-info'
                              className='form-control'
                              type='text'
                              value={
                                this.state.value
                                  ? this.state.value
                                  : this.state.value
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
                                  onSuggestionsClearRequested={
                                    this.onSuggestionsClearRequested
                                  }
                                  getSuggestionValue={getSuggestionValue}
                                  renderSuggestion={renderSuggestion}
                                  inputProps={inputProps}
                                  value={this.state.value}
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
                                            !this.state.isAddCustomerModalOpen,
                                        },
                                        e.preventDefault()
                                      )
                                    }
                                  >
                                    [+]
                                  </a>
                                  <label className='color_red'>
                                    {this.state.errro_mess
                                      ? t('myBusiness.contract.No_record')
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
                                            !this.state.isAddCustomerModalOpen,
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
                                              'myBusiness.contract.Add_New'
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
                                  getSuggestionValue={getSuggestionValue}
                                  renderSuggestion={renderSuggestion}
                                  inputProps={inputProps}
                                  value={this.state.value}
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
                                            !this.state.isAddCustomerModalOpen,
                                        },
                                        e.preventDefault()
                                      )
                                    }
                                  >
                                    [+]
                                  </a>
                                  <label className='color_red'>
                                    {this.state.errro_mess
                                      ? t('myBusiness.contract.No_record')
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
                                            !this.state.isAddCustomerModalOpen,
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
                                              'myBusiness.contract.Add_New'
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
                          <label htmlFor='mails' style={{ marginRight: '60%' }}>
                            {t('myBusiness.contract.mail_multi')}
                          </label>
                          {this.state.emails.map((item) => (
                            <div className='tag-item' key={item}>
                              {item}
                              <button
                                type='button'
                                className='button'
                                onClick={() => this.handleDelete(item)}
                              >
                                &times;
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
                            getSuggestionValue={getSuggestionValue2}
                            renderSuggestion={renderSuggestion2}
                            inputProps={inputProps2}
                          />
                          {this.state.error && (
                            <p className='error'>{this.state.error}</p>
                          )}
                          <small className='form-text text-muted'>
                            {t('myBusiness.contract.e_eg')}
                          </small>
                        </div>
                      </div>
                      <div className='col-lg-7 col-md-6'>
                        <div className='form-group'>
                          <label htmlFor='request-id'>
                            {t('myBusiness.contract.req_id')}
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
                            {t('myBusiness.contract.date')}
                          </label>
                          <input
                            className='form-control'
                            type='text'
                            id='date'
                            name='date'
                            value={this.state.date}
                            readOnly='readOnly'
                          />
                          {/* <Datetime
                            onChange={(date) => this.handleChange3(date)}
                            isValidDate={valid}
                            id="date"
                            name="date"
                            dateFormat="DD-MM-YYYY"
                            timeFormat={false}
                            value={this.state.date}
                          /> */}
                          <p style={{ color: '#eb516d ' }}>
                            {this.state.date_err === true
                              ? 'Date is required'
                              : null}
                          </p>
                        </div>
                        <div className='form-group'>
                          <label htmlFor='due-date'>
                            {t('myBusiness.contract.due_date')}
                          </label>
                          <Datetime
                            onChange={(date) => this.handleChange4(date)}
                            isValidDate={valid2}
                            id='due-date'
                            name='due-date'
                            dateFormat='DD-MM-YYYY'
                            inputProps={{ placeholder: 'DD-MM-YYYY' }}
                            locale={`${
                              localStorage.getItem('_lng') === 'fi'
                                ? 'fr-fi'
                                : 'en-US'
                            } `}
                            timeFormat={false}
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
                            {t('myBusiness.contract.clientAddress')}
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
                    <p className='my-5'></p>
                    <ul
                      className='nav nav-tabs'
                      id='paymentTerms'
                      role='tablist'
                    >
                      <li className='nav-item' role='presentation'>
                        <a
                          className={
                            this.state.agreement_terms === 'fixed'
                              ? 'nav-link active'
                              : 'nav-link'
                          }
                          id='fixed-tab'
                          data-toggle='tab'
                          href='#fixed'
                          role='tab'
                          aria-controls='fixed'
                          aria-selected='true'
                          onClick={() =>
                            this.setState({ agreement_terms: 'fixed' })
                          }
                        >
                          {t('myBusiness.contract.fixed')}
                        </a>
                      </li>
                      <li className='nav-item' role='presentation'>
                        <a
                          className={
                            this.state.agreement_terms === 'hourly'
                              ? 'nav-link active'
                              : 'nav-link'
                          }
                          id='hourly-tab'
                          data-toggle='tab'
                          href='#hourly'
                          role='tab'
                          aria-controls='hourly'
                          aria-selected='false'
                          onClick={() =>
                            this.setState({ agreement_terms: 'hourly' })
                          }
                        >
                          {t('myBusiness.contract.hourly')}
                        </a>
                      </li>
                    </ul>
                    <div className='tab-content' id='paymentTermsContent'>
                      <div
                        className={
                          this.state.agreement_terms === 'fixed'
                            ? 'tab-pane fade show active'
                            : 'tab-pane fade'
                        }
                        id='fixed'
                        role='tabpanel'
                        aria-labelledby='fixed-tab'
                      >
                        <div className='row'>
                          <div className='col-md-12'>
                            <br />
                            <h3 className='head3 mb-1'>
                              {t('myBusiness.contract.payment_terms')}
                            </h3>

                            {this.props.match?.url !==
                            '/business-agreement-create' ? (
                              <div
                                className='row justify-content-between'
                                style={{ color: '#a7a7a7' }}
                              >
                                <div className='col-sm-3'>
                                  <b>{t('myBusiness.contract.fixed')}</b>
                                </div>
                                <div className='col-sm-9'>
                                  <b className='float-sm-right'>
                                    {t('myBusiness.contract.Client’s')}
                                    {userInfo.mat_template &&
                                    userInfo.work_template
                                      ? Number(this.state.mat_template.total) +
                                        Number(this.state.work_template.total)
                                      : 0}{' '}
                                    {t('myBusiness.contract.EUR')}{' '}
                                  </b>
                                </div>
                              </div>
                            ) : (
                              ''
                            )}
                          </div>
                          <div className='col-md-12'>
                            <div ref={this.myRefType} className='form-group'>
                              <label className='mt-4 mb-3'>
                                <b>{t('myBusiness.contract.how_paid')}</b>
                              </label>
                              <div className='form-check mb-4'>
                                <input
                                  type='radio'
                                  name='paymethod'
                                  className='form-check-input'
                                  id='milestone'
                                  defaultChecked={
                                    this.state.agreement_type === 'milestone'
                                      ? true
                                      : false
                                  }
                                  onClick={
                                    (e) => this.milestone_add(e)
                                    // this.setState({ agreement_type: "milestone" })
                                  }
                                />
                                <label
                                  className='form-check-label'
                                  htmlFor='milestone'
                                >
                                  <b>{t('myBusiness.contract.by_mile')}</b>
                                  <br />
                                  <span className='light'>
                                    {t('myBusiness.contract.mile_text')}
                                  </span>
                                </label>
                              </div>
                              <div className='form-check'>
                                <input
                                  type='radio'
                                  name='paymethod'
                                  className='form-check-input'
                                  id='project'
                                  defaultChecked={
                                    this.state.agreement_type === 'project'
                                      ? true
                                      : false
                                  }
                                  onClick={this.agreement_type}
                                  //   onClick={() =>  !this.state.row_phase  ? this.setState({
                                  //     row_phase: [],
                                  // }) : this.setState({
                                  //   agreement_type: "project",
                                  //   row_phase: this.state.row_phase ? "" : "" ,
                                  // })
                                  // }
                                  // this.setState({
                                  //   agreement_type: "project",
                                  //   // row_phase: [],
                                  //   // row_phase:
                                  //   //   this.props.match.params.draft !==
                                  //   //   undefined
                                  //   //     ? this.state.row_phase
                                  //   //     : [],
                                  // }) }
                                />
                                <label
                                  className='form-check-label'
                                  htmlFor='project'
                                >
                                  <b>{t('myBusiness.contract.by_proj')}</b>
                                  <br />
                                  <span className='light'>
                                    {t('myBusiness.contract.proj_text')}
                                  </span>
                                </label>
                              </div>
                              <p style={{ color: '#eb516d ' }}>
                                {this.state.agreement_type_err === true
                                  ? 'Agreement type is required'
                                  : null}
                              </p>
                            </div>
                            <div className='form-group'>
                              {this.state.agreement_type === 'milestone' ? (
                                <label className='mt-4 mb-4'>
                                  {/* <b>{t('myBusiness.contract.mile_que')}</b> */}
                                </label>
                              ) : null}
                              {(this.state.agreement_type === 'project' &&
                                this.props.match.url ==
                                  '/business-agreement-create') ||
                              (this.props.match.url ===
                                `/business-agreement-create/${this.props.match.params.tender}/${this.props.match.params.customer}` &&
                                this.state.agreement_type === 'project') ||
                              (this.props.match.url !==
                                `/business-agreement-create/${this.props.match.params.tender}/${this.props.match.params.customer}/update` &&
                                !this.state.row_phase) ? (
                                this.props.match.params.draft !== undefined &&
                                this.state.agreement_tender_draft ===
                                  1 ? null : (
                                  <>
                                    <Row
                                      val={{
                                        des: 'des',
                                        due_date: 'due_date',
                                        amount: 'amount',
                                      }}
                                      val2={{
                                        des: '',
                                        due_date: '',
                                        amount: '0',
                                      }}
                                      key={0}
                                      ind={0}
                                      t={t}
                                      check_input={(e) => this.check_input(e)}
                                    />
                                  </>
                                )
                              ) : (
                                ''
                              )}
                              {/* {this.state.agreement_type} */}
                              {/* {this.state.agreement_type , this.state.row_phase} */}
                              {this.state.agreement_type === 'project' &&
                              this.props.match.url ===
                                `/business-agreement-create/${this.props.match.params.tender}/${this.props.match.params.customer}/update` &&
                              this.state.row_phase ? (
                                <>
                                  {this.state.row_phase?.map((x, i) => (
                                    <>
                                      <Row
                                        val={{
                                          des: 'des',
                                          due_date: 'due_date',
                                          amount: 'amount',
                                        }}
                                        val2={x}
                                        key={i}
                                        ind={i}
                                        t={t}
                                        check_input={(e) => this.check_input(e)}
                                      />
                                    </>
                                  ))}
                                </>
                              ) : this.props.match.url ==
                                  `/business-agreement-create/${this.props.match.params.tender}/${this.props.match.params.customer}/update` &&
                                this.state.agreement_type == 'project' ? (
                                <>
                                  <Row
                                    val={{
                                      des: 'des',
                                      due_date: 'due_date',
                                      amount: 'amount',
                                    }}
                                    val2={{
                                      des: '',
                                      due_date: '',
                                      amount: '0',
                                    }}
                                    key={0}
                                    ind={0}
                                    t={t}
                                    check_input={(e) => this.check_input(e)}
                                  />
                                </>
                              ) : (
                                '   '
                              )}
                              {/* {this.props.match.params.draft !== undefined
                                && this.state.agreement_tender_draft === 1 && this.state.agreement_type != "project"
                                ? null : (
                                  <>
                                    <Row
                                      val={{
                                        des: "des",
                                        due_date: "due_date",
                                        amount: "amount",
                                      }}
                                      val2={{ des: "", due_date: "", amount: "" }}
                                      key={0}
                                      ind={0}
                                      t={t}
                                    />
                                  </>
                                )} */}
                              {/* {this.state.agreement_type === "milestone" ? (
                                <> */}

                              {this.state.agreement_type == 'milestone'
                                ? this.state.row_phase?.map((r, index) => (
                                    <div>
                                      <Row
                                        val={{
                                          des: 'des',
                                          due_date: 'due_date',
                                          amount: 'amount',
                                        }}
                                        val2={r}
                                        key={index}
                                        ind={index + 1}
                                        t={t}
                                        check_input={(e) => this.check_input(e)}
                                      />
                                    </div>
                                  ))
                                : '  '}
                            </div>
                            <div className='form-group mb-0'>
                              {this.state.agreement_type === 'milestone' ? (
                                <label className='add_mileston'>
                                  <a onClick={this.handleAppend}>
                                    {t('myBusiness.contract.add_mile')}
                                  </a>
                                </label>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className='hr mg-20 mb-5'></div>
                        <div className='row'>
                          <div className='col-lg-7 offset-lg-5 col-md-10 offset-md-2'>
                            <div className='row mb-3'>
                              <div className='col-sm-8'>
                                <h4 className='head4 mb-2'>
                                  {t('myBusiness.contract.total_proj')}
                                </h4>
                                <p>{t('myBusiness.contract.total_proj_txt')}</p>
                              </div>
                              <div className='col-sm-4 text-sm-right'>
                                <h5 className='head5'>
                                  {this.state.left}{' '}
                                  <span id='c_total'>
                                    {this.props.match.params.draft !==
                                      undefined ||
                                    this.state.agreement_tender_draft === 1
                                      ? this.state.agreement_rate
                                      : '0.00'}
                                  </span>{' '}
                                  {this.state.right}
                                  {/*{this.state.agreement_rate} */}
                                </h5>
                              </div>
                            </div>
                            {this.state.configuration_val > 0 &&
                            window.location.pathname !==
                              '/business-agreement-create' ? (
                              <div className='row mb-3'>
                                <div className='col-sm-8'>
                                  <h4 className='head4 mb-2'>
                                    <span>
                                      {this.state.configuration_val}%{' '}
                                      {t('myBusiness.contract.flip_fee')}{' '}
                                    </span>
                                    <button
                                      className='btn btn-primary ml-3 mb-3 clk3'
                                      data-toggle='modal'
                                      data-target='#preview-terms'
                                      style={{
                                        color: '#007bff',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                      }}
                                    >
                                      {' '}
                                      {t('myBusiness.contract.chk_terms')}
                                    </button>
                                  </h4>
                                  <p>&nbsp;</p>
                                </div>
                                <div className='col-sm-4 text-sm-right'>
                                  <input
                                    type='hidden'
                                    id='config'
                                    value={this.state.configuration_val}
                                  />
                                  <h5 className='head5 fee'>
                                    {this.state.left}{' '}
                                    <span id='per'>
                                      {this.props.match.params.draft !==
                                        undefined ||
                                      this.state.agreement_tender_draft === 1
                                        ? this.state.agreement_service_fee
                                        : '0.00'}
                                    </span>{' '}
                                    {this.state.right}
                                  </h5>
                                </div>
                              </div>
                            ) : null}
                            {this.state.configuration_val > 0 ? (
                              <div className='row mb-3'>
                                <div className='col-sm-8'>
                                  <h4 className='head4 mb-2'>
                                    {t('myBusiness.contract.chk_terms_txt')}{' '}
                                    {/* <a href='#'>
                                      {t('myBusiness.contract.chk_terms_txt_terms')}
                                    </a> */}
                                  </h4>
                                  <p>{t('myBusiness.contract.more_terms')}</p>
                                </div>
                                <div className='col-sm-4 text-sm-right'>
                                  <h5 className='head5 est_pay'>
                                    {this.state.left}{' '}
                                    <span id='1_est'>
                                      {this.props.match.params.draft !==
                                        undefined ||
                                      this.state.agreement_tender_draft === 1
                                        ? this.state.agreement_estimated_payment
                                        : '0.00'}
                                    </span>{' '}
                                    {this.state.right}
                                  </h5>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className='hr mg-20'></div>
                      </div>

                      <div
                        className={
                          this.state.agreement_terms === 'hourly'
                            ? 'tab-pane fade show active'
                            : 'tab-pane fade'
                        }
                        id='hourly'
                        role='tabpanel'
                        aria-labelledby='hourly-tab'
                      >
                        <div className='row'>
                          <div className='col-md-12'>
                            <br />
                            <h3 className='head3 mb-1'>
                              {t('myBusiness.contract.payment_terms')}
                            </h3>
                            <p className='mb-5' style={{ color: '#a7a7a7' }}>
                              <b>{t('myBusiness.contract.hourly')}</b>
                            </p>
                          </div>
                          <div className='col-md-12'>
                            <div className='form-group'>
                              <div className='row align-items-center'>
                                <div className='col-xl-4 col-lg-5 col-md-6'>
                                  <label className='mb-md-0'>
                                    {t('myBusiness.contract.hr_rate')}
                                  </label>
                                </div>
                                <div className='col-xl-4 col-lg-5 col-md-6 offset-xl-1'>
                                  <div className='row gutters-14 align-items-center'>
                                    <div className='col'>
                                      <div className='input-group'>
                                        <input
                                          type='number'
                                          className='form-control text-right my-input1'
                                          placeholder={
                                            this.state.agreement_rate
                                          }
                                        />
                                        <div className='input-group-prepend'>
                                          <div className='input-group-text'>
                                            <i className='icon-euro'></i>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='col flexgrow0'>
                                      <label className='mb-0'>
                                        {' '}
                                        {t('myBusiness.contract.hr')}{' '}
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className='form-group'>
                              <div className='row align-items-center'>
                                <div className='col-xl-4 col-lg-5 col-md-6'>
                                  <label className='mb-md-0'>
                                    {this.state.configuration_val}%{' '}
                                    {t('myBusiness.contract.flip_fee')}.{' '}
                                    <button
                                      className='btn btn-primary ml-3 mb-3 clk3'
                                      data-toggle='modal'
                                      data-target='#preview-terms'
                                      style={{
                                        color: '#007bff',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                      }}
                                    >
                                      {t('myBusiness.contract.chk_terms')}
                                    </button>
                                  </label>
                                </div>

                                <div className='col-xl-4 col-lg-5 col-md-6 offset-xl-1'>
                                  <div className='row gutters-14 align-items-center'>
                                    <div className='col'>
                                      <div className='input-group'>
                                        <input
                                          className='inpu'
                                          // type="hidden"
                                          id='config1'
                                          value={this.state.configuration_val}
                                        />

                                        <input
                                          type='text'
                                          className='form-control text-right fee1 inp'
                                          placeholder={
                                            this.state.agreement_service_fee
                                          }
                                          readOnly
                                        />
                                        <div className='input-group-prepend'>
                                          <div className='input-group-text'>
                                            <i className='icon-euro'></i>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      className='col'
                                      style={{ flexGrow: '0' }}
                                    >
                                      <label className='mb-01 lbl'>
                                        {' '}
                                        {t('myBusiness.contract.hr')}{' '}
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className='form-group'>
                              <div className='row align-items-center'>
                                <div className='col-xl-4 col-lg-5 col-md-6'>
                                  <label className='mb-md-0'>
                                    {t('myBusiness.contract.chk_terms_txt')}{' '}
                                    {/* <a href='#'>
                                      {t('myBusiness.contract.chk_terms_txt_terms')}
                                    </a> */}
                                  </label>
                                </div>
                                <div className='col-xl-4 col-lg-5 col-md-6 offset-xl-1'>
                                  <div className='row gutters-14 align-items-center'>
                                    <div className='col'>
                                      <div className='input-group'>
                                        <input
                                          type='text'
                                          className='form-control text-right'
                                          id='c_total1'
                                          placeholder={
                                            this.state
                                              .agreement_estimated_payment
                                          }
                                        />
                                        <div className='input-group-prepend'>
                                          <div className='input-group-text'>
                                            <i className='icon-euro'></i>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='col flexgrow0'>
                                      <label className='mb-0'>
                                        {' '}
                                        {t('myBusiness.contract.hr')}{' '}
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='hr mg-20'></div>
                      </div>
                    </div>
                    <div className='clear'></div>
                    <h2 className='head2 my-4'>
                      {t('myBusiness.contract.agreement_terms')}
                    </h2>
                    <div ref={this.myRefTerms} className='row'>
                      <div className='col-xl-5 col-lg-5 col-md-6'>
                        <div className='form-group'>
                          <label htmlFor='m-payment'>
                            {t('myBusiness.contract.mat_pay')}
                          </label>
                          <select
                            value={this.state.mat_pay}
                            onChange={this.handleChange2}
                            name='mat_pay'
                            id='m-payment'
                            required
                            className='form-control'
                          >
                            <option value='' hidden>
                              {t('myBusiness.contract.Select')}{' '}
                            </option>
                            <option value='payment after total delivery'>
                              {t('myBusiness.contract.delivery')}{' '}
                            </option>
                            <option value='payment after project done'>
                              {t('myBusiness.contract.project_done')}{' '}
                            </option>
                            <option value='as per invoice'>
                              {t('myBusiness.contract.inovice')}{' '}
                            </option>
                            <option value='other'>
                              {' '}
                              {t('myBusiness.contract.Custom_message')}{' '}
                            </option>
                          </select>
                          <p style={{ color: '#eb516d ' }}>
                            {this.state.mat_pay_err === true
                              ? 'Payment is required'
                              : null}
                          </p>
                          {this.state.mat_pay === 'other' ? (
                            // <div className="form-group" style={{ display: "none" }} >
                            <textarea
                              onChange={this.handleagreement_other}
                              value={this.state.agreement_other}
                              className='form-control'
                            ></textarea>
                          ) : (
                            // </div>
                            ''
                          )}
                        </div>

                        <div className='form-group'>
                          <label htmlFor='work-payment'>
                            {t('myBusiness.contract.work_pay')}
                          </label>
                          <select
                            value={this.state.work_pay}
                            onChange={this.handleChange2}
                            name='work_pay'
                            id='work-payment'
                            required
                            className='form-control'
                          >
                            <option value=''>
                              {' '}
                              {t('myBusiness.contract.Select')}{' '}
                            </option>
                            {this.state.agreement_terms === 'fixed' ? (
                              <option value='payment after work'>
                                {' '}
                                {t('myBusiness.contract.PaymentA')}{' '}
                              </option>
                            ) : null}
                            {this.state.agreement_terms === 'hourly' ? (
                              <option value='hourly pay'>
                                {' '}
                                {t('myBusiness.contract.Pay_hourly')}
                              </option>
                            ) : null}
                            <option value='agreement_work_payment_other'>
                              {' '}
                              {t('myBusiness.contract.Custom_message')}{' '}
                            </option>
                          </select>
                          <br />

                          {this.state.work_pay ===
                          'agreement_work_payment_other' ? (
                            <textarea
                              onChange={this.handleChange2}
                              value={this.state.agreement_work_payment_other}
                              name='agreement_work_payment_other'
                              className='form-control'
                            ></textarea>
                          ) : (
                            ''
                          )}

                          <p style={{ color: '#eb516d ' }}>
                            {this.state.work_pay_err === true
                              ? 'Payment is required'
                              : null}
                          </p>
                        </div>
                        {/* <div
                          className="form-group"
                          id="custom-message10"
                          style={{ display: "none" }}
                        >
                          <textarea
                            onChange={this.handleChange2}
                            name="agreement_work_payment_other"
                            className="form-control"
                          ></textarea>
                        </div> */}

                        <div className='form-group'>
                          <label htmlFor='transport-payment'>
                            {t(
                              'myBusiness.contract.transportation_payment_terms'
                            )}
                          </label>
                          <select
                            value={this.state.agreement_transport_payment}
                            onChange={this.handleChange2}
                            name='agreement_transport_payment'
                            id='transport-payment'
                            required
                            className='form-control'
                          >
                            <option hidden value=''>
                              {' '}
                              {t('myBusiness.contract.Select')}{' '}
                            </option>
                            <option value='included'>
                              {' '}
                              {t('myBusiness.contract.included')}{' '}
                            </option>
                            <option value='not included'>
                              {' '}
                              {t('myBusiness.contract.Not_included')}{' '}
                            </option>
                          </select>
                          <p style={{ color: '#eb516d ' }}>
                            {this.state.agreement_transport_payment_err === true
                              ? 'Transport payment is required'
                              : null}
                          </p>
                        </div>
                        <div className='form-group'>
                          <label>
                            {t('myBusiness.contract.client_resposibilities')}
                          </label>

                          {(this.props.match.params.customer !== undefined &&
                            this.props.match.params.draft !== undefined) ||
                          this.state.agreement_tender_draft === 1 ? (
                            <p>{this.state.agreement_client_res}</p>
                          ) : null}

                          <Multiselect
                            showArrow
                            isObject={false}
                            options={this.state.ContractorResposibilities.map(
                              (localeVal) => t(localeVal)
                            )}
                            selectedValues={this.state.Client} // Preselected value to persist in dropdown
                            placeholder={t('myBusiness.contract.Select')}
                            onSelect={(e) => this.check(e)} // Function will trigger on select event
                            // selectedValues={this.state.city} // Preselected value to persist in dropdown
                            onSelect={this.onSelect2} // Function will trigger on select event
                            onRemove={this.onRemove2} // Function will trigger on remove event
                            displayValue='lable' //
                            overrideStrings={true}
                            emptyRecordMsg={t(
                              'myBusiness.contract.No_Options_Available'
                            )}
                            // showCheckbox={true}
                          />

                          {/* <div id="client-resposibilities">
                            <select
                              name="agreement_client_res"
                              id="client-resposibilities"
                              required
                              className="form-control"
                              value={this.state.agreement_client_res}
                            >
                              <option value="Water">
                                {t("agreement_vals.responsibilities.water")}
                              </option>
                              <option value="Timber">
                                {t("agreement_vals.responsibilities.timber")}
                              </option>
                              <option value="Electricity">
                                {t("agreement_vals.responsibilities.electricity")}
                              </option>
                              <option value="Plumbing">
                                {t("agreement_vals.responsibilities.plumbing")}
                              </option> 
                              <option value="custom 1">  {t("myBusiness.contract.Custom")}  </option>
                            </select>
                            <input
                              ref={(input) => {
                                this.agreement_client_res = input;
                              }}
                              style={{ display: "none" }}
                              type="text"
                              name="selected_values"
                              disabled="disabled"
                              placeholder="Selected"
                            />
                          </div> */}
                        </div>
                        <div
                          className='form-group'
                          id='custom-message2'
                          style={{ display: 'none' }}
                        >
                          <textarea
                            onChange={this.handleChange2}
                            name='agreement_client_res_other'
                            className='form-control'
                            value={this.state.agreement_client_res_other}
                          ></textarea>
                        </div>
                        <div className='form-group'>
                          <label>
                            {t(
                              'myBusiness.contract.contractor_resposibilities'
                            )}
                          </label>
                          {(this.props.match.params.customer !== undefined &&
                            this.props.match.params.draft !== undefined) ||
                          this.state.agreement_tender_draft === 1 ? (
                            <p>{this.state.agreement_contractor_res}</p>
                          ) : null}
                          {/*  */}

                          <Multiselect
                            showArrow
                            isObject={false}
                            options={this.state.ContractorResposibilities.map(
                              (localeVal) => t(localeVal)
                            )} // Options to display in the dropdown
                            selectedValues={this.state.Contractor} // Preselected value to persist in dropdown
                            placeholder={t('myBusiness.contract.Select')}
                            onSelect={(e) => this.check(e)} // Function will trigger on select event
                            // selectedValues={this.state.city} // Preselected value to persist in dropdown
                            onSelect={this.onSelect1} // Function will trigger on select event
                            onRemove={this.onRemove1} // Function will trigger on remove event
                            displayValue='lable' //
                            overrideStrings={true}
                            emptyRecordMsg={t(
                              'myBusiness.contract.No_Options_Available'
                            )}
                            // showCheckbox={true}
                          />

                          {/* <div id="contractor-resposibilities">
                            <select
                              name="agreement_contractor_res"
                              id="contractor-resposibilities"
                              className="form-control"
                            >
                              <option value="Water">
                                {t("agreement_vals.responsibilities.water")}
                              </option>
                              <option value="Timber">
                                {t("agreement_vals.responsibilities.timber")}
                              </option>
                              <option value="Electricity">
                                {t("agreement_vals.responsibilities.electricity")}
                              </option>
                              <option value="Plumbing">
                                {t("agreement_vals.responsibilities.plumbing")}
                              </option>
                              
                              <option value="custom">{t("myBusiness.contract.Custom")} </option>
                            </select>
                            <input
                              ref={(input) => {
                                this.agreement_contractor_res = input;
                              }}
                              style={{ display: "none" }}
                              type="text"
                              name="selected_values"
                              disabled="disabled"
                              placeholder="Selected"
                            />
                          </div> */}

                          {/*  */}
                        </div>
                        <div
                          className='form-group'
                          id='custom-message1'
                          style={{ display: 'none' }}
                        >
                          <textarea
                            onChange={this.handleChange2}
                            name='agreement_contractor_res_other'
                            className='form-control'
                            value={this.state.agreement_contractor_res_other}
                          ></textarea>
                        </div>

                        <div className='form-group'>
                          <label htmlFor='legal-agreement'>
                            {t('myBusiness.contract.legal_agreement_category')}
                          </label>
                          {/* <p>{this.state.agreement_legal_category}</p> */}
                          <div>
                            <Multiselect
                              showArrow
                              isObject={false}
                              options={this.state.legalOptions} // Options to display in the dropdown
                              selectedValues={this.state.lest} // Preselected value to persist in dropdown
                              placeholder={t('myBusiness.contract.Select')}
                              onSelect={(e) => this.check(e)} // Function will trigger on select event
                              // selectedValues={this.state.city} // Preselected value to persist in dropdown
                              onSelect={this.onSelect} // Function will trigger on select event
                              onRemove={this.onRemove} // Function will trigger on remove event
                              displayValue='lable' //
                              overrideStrings={true}
                              emptyRecordMsg={t(
                                'myBusiness.contract.No_Options_Available'
                              )}
                              // showCheckbox={true}
                            />

                            {/* <select
                              name="agreement_legal_category"
                              // id="legal-agreement"
                              className="form-control"
                            >
                               <option value="Timber">
                                {t("agreement_vals.legal.select")}
                              </option>
                              <option value="Timber">
                                {t("agreement_vals.legal.timber")}
                              </option>
                              <option value="Electricity">
                                {t("agreement_vals.legal.electricity")}
                              </option>
                              <option value="Plumbing">
                                {t("agreement_vals.legal.plumbing")}
                              </option>
                            </select> */}
                            {/* <option value="etc">etc</option> */}
                            {/* "timber": "Timber",
                                "electricity": "Electricity",
                                "plumbing": "Plumbing",
                                "select": "--Select--" */}
                            <input
                              ref={(input) => {
                                this.agreement_legal_category = input;
                              }}
                              style={{ display: 'none' }}
                              type='text'
                              name='selected_values'
                              disabled='disabled'
                              placeholder='Selected'
                            />
                          </div>
                        </div>

                        {/* ========================== */}
                        <div className='form-group' id='check_con'>
                          <div
                            className='form-check form-check-inline'
                            id='klon1'
                          ></div>
                        </div>
                        {/* ========================== */}
                      </div>
                      <div className='col-xl-5 col-lg-6 col-md-6'>
                        <div className='form-group'>
                          <label htmlFor='materials'>
                            {t('myBusiness.contract.materials_quarantees')}{' '}
                          </label>
                          <textarea
                            value={this.state.agreement_material_guarantee}
                            onChange={this.handleChange2}
                            name='agreement_material_guarantee'
                            style={{ height: '70px' }}
                            // id="materials"
                            required
                            className='form-control'
                          ></textarea>
                          <p style={{ color: '#eb516d ' }}>
                            {this.state.agreement_material_guarantee_err ===
                            true
                              ? 'Guarantee is required'
                              : null}
                          </p>
                        </div>
                        <div className='form-group'>
                          <label htmlFor='work-quarantees'>
                            {t('myBusiness.contract.work_quarantees')}
                          </label>
                          <textarea
                            value={this.state.agreement_work_guarantee}
                            onChange={this.handleChange2}
                            name='agreement_work_guarantee'
                            style={{ height: '70px' }}
                            required
                            // id="work-quarantees"
                            className='form-control'
                          ></textarea>
                          <p style={{ color: '#eb516d ' }}>
                            {this.state.agreement_work_guarantee_err === true
                              ? 'Guarantee is required'
                              : null}
                          </p>
                        </div>
                        <div className='form-group'>
                          <label htmlFor='agreement-insurances'>
                            {t('myBusiness.contract.agreement_insurances')}
                          </label>
                          <input
                            value={this.state.agreement_insurances}
                            type='text'
                            onChange={this.handleChange2}
                            name='agreement_insurances'
                            required
                            id='agreement-insurances'
                            className='form-control'
                          />
                          <p style={{ color: '#eb516d ' }}>
                            {this.state.agreement_insurances_err === true
                              ? 'Insurance is required'
                              : null}
                          </p>
                        </div>
                        <div className='form-group'>
                          <label htmlFor='panelty-terms'>
                            {t('myBusiness.contract.panelty_terms')}
                          </label>
                          <textarea
                            value={this.state.agreement_panelty}
                            onChange={this.handleChange2}
                            name='agreement_panelty'
                            required
                            style={{ height: '70px' }}
                            id='panelty-terms'
                            className='form-control'
                          ></textarea>
                          <small className='form-text text-muted'>
                            {t('myBusiness.contract.delay_term')}
                          </small>
                          <p style={{ color: '#eb516d ' }}>
                            {this.state.agreement_panelty_err === true
                              ? 'Penalty is required'
                              : null}
                          </p>
                        </div>
                        <div className='form-group'>
                          <label htmlFor='a-work-price'>
                            {t('myBusiness.contract.additional_work_prices')}
                          </label>
                          <textarea
                            id='a-work-price'
                            required
                            className='form-control'
                            value={this.state.agreement_additional_work_price}
                            onChange={this.handleChange2}
                            name='agreement_additional_work_price'
                            placeholder=''
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <br />
                    <br />
                    <div className='row'>
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
                      <div className='col-xl-10 col-lg-11'>
                        <div className='form-group'>
                          <label>{t('myBusiness.contract.attachments')}</label>

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
                                          'myBusiness.contract.Upload_attachments'
                                        )}
                                    {/* {t("myBusiness.contract.Upload_attachments")} */}
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

                          {/* <div className="file-select attachment">
                            <input
                              onChange={this.handleChange7}
                              type="file"
                              id="attachments"
                              name="attachments"
                            />
                             <Files
                                    className='files-dropzone'
                                    onChange={(e) => this.onFilesChange(e)}
                                    onError={(e) => this.onFilesError(e)}
                                    accepts={['image/gif', 'image/pdf', '.PDF', 'image/jpeg', 'image/png', 'image/jpg', '.svg', '.docx', '.doc']}
                                    multiple={false}
                                    maxFileSize={2097152}
                                    minFileSize={0}
                                    clickable
                                  >
                            <label >
                              <i className="icon-attachment"></i>
                              <span
                                className="filename font-weight-bold"
                                data-text="Attach File"
                              >
                              {this.state.img_name ? this.state.img_name : t("myBusiness.contract.up_attachments")}
                               
                              </span>
                              <span
                                onClick={this.handleAttachmentRemove}
                                className="clear"
                              >
                                &Chi;
                            </span>
                            </label>
                            </Files>
                          </div> */}

                          {this.state.attachment_pre ? (
                            <label htmlFor='attachments'>
                              <a
                                href={
                                  url +
                                  '/images/marketplace/agreement/' +
                                  this.state.attachment_pre
                                }
                                target='_blank'
                                className='attachment'
                              >
                                <i className='icon-paperclip'></i>
                                {this.state.attachment_pre}
                              </a>
                            </label>
                          ) : null}
                          <p className='form-text text-muted'>
                            {t('myBusiness.contract.legal_txt')}
                          </p>
                        </div>
                      </div>

                      <div className='col-12 mt-5'>
                        {/* <button
                          className="btn btn-sm btn-gray mr-3 mb-3 mb-sm-0"
                          data-toggle="modal"
                          data-target="#closeagreement"
                          onClick={() => this.setState({ isModalOpen: true })}
                        >
                          Close Greement
                      </button> */}
                        <button
                          onClick={this.hiddenFields}
                          className='btn btn-gray mb-md-0 mb-3 mr-4 clk2'
                          data-toggle='modal'
                          data-target='#preview-info'
                        >
                          {t('myBusiness.contract.Preview_Agreement')}
                        </button>
                        {this.props.match.params.draft !== undefined ||
                        this.state.agreement_tender_draft === 1 ? (
                          <button
                            onClick={this.handleUpdate}
                            className='btn btn-sm btn-gray mr-3 mb-3 mb-sm-0 clk2'
                          >
                            {t('myBusiness.contract.Update_as_a_draft')}
                          </button>
                        ) : (
                          <button
                            onClick={this.handleDraft}
                            className='btn btn-gray mb-md-0 mb-3 mr-4 clk2'
                          >
                            {loading ? loading : ''}{' '}
                            {t('myBusiness.contract.Save_as_a_draft')}
                          </button>
                        )}

                        {/* {loading ? (
                        loading
                      ) : ( */}
                        <button
                          onClick={(e) => this.handleSubmit(e, 1)}
                          className='btn btn-primary mb-md-0 mb-4 clk2'
                        >
                          {loading_submit ? loading_submit : ''}
                          {/* {t("myBusiness.contract.Submit")}    &amp; {t("myBusiness.contract.Send")} */}
                          {t('myBusiness.contract.submit2')}
                        </button>
                        {/* )} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <BusinessInfo onInfo={this.handleBusinessInfo} />
              <RatingModal
                show={this.state.isModalOpen}
                handleClose={() => this.setState({ isModalOpen: false })}
              />
              <AddCustomer
                show={this.state.isAddCustomerModalOpen}
                handleClose={() =>
                  this.setState({ isAddCustomerModalOpen: false })
                }
                addCus={this.addCustomer}
                relod={this.loadClient}
              />
              <PDFViewAgreement
                businessInfo={this.state.business_info}
                show={this.state.isPreviewModal}
                handleClose={() => this.setState({ isPreviewModal: false })}
                userInfo={userInfo}
              />
              <Terms />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
var yesterday = moment().subtract(1, 'day');
function valid(current) {
  return current.isAfter(yesterday);
}

const Row = (props) => {
  // console.log("props==========",props);
  return (
    <>
      <div className='row'>
        <div className='col-2-md' style={{ flexGrow: '0' }}>
          {props.val2.amount && props.ind >= 1 ? (
            <>
              {props.ind != 1 ? (
                <button
                  style={{ borderRadius: '50px', zIndex: '9999' }}
                  className={`btn-dark remove-input ${
                    props.ind == 1 ? 'disable' : ''
                  }`}
                  id='myRemoveinput'
                >
                  X
                </button>
              ) : (
                ''
              )}
            </>
          ) : null}

          <div className='form-group'>
            <label>&nbsp;</label>
            <p className='form-text'></p>
          </div>
        </div>
        <div className='col'>
          <div className='row milestone'>
            <div className='col-md-6'>
              <div className='form-group'>
                <label>
                  <b>{props.t('myBusiness.contract.description1')}</b>
                </label>
                <input
                  type='text'
                  className='form-control'
                  name={props.val.des}
                  placeholder={
                    props.val2.des != 'undefined' ? props.val2.des : ''
                  }
                  // value={props.val2.des}
                />
              </div>
            </div>

            <div className='col-md-6'>
              <div className='row gutters-14'>
                <div className='col-sm'>
                  <div className='form-group'>
                    <label>
                      <b>{props.t('myBusiness.contract.due_date')}</b>
                    </label>
                    <div className='input-group'>
                      <Datetime
                        name={props.val.due_date}
                        isValidDate={valid}
                        dateFormat='DD-MM-YYYY'
                        inputProps={{ placeholder: 'DD-MM-YYYY' }}
                        timeFormat={false}
                        locale={`${
                          localStorage.getItem('_lng') === 'fi'
                            ? 'fr-fi'
                            : 'en-US'
                        } `}
                        defaultValue={
                          props.val2.due_date != 'undefined'
                            ? props.val2.due_date
                            : ''
                        }
                      />
                      <div className='input-group-append'>
                        <div className='input-group-text'>
                          <i className='icon-calendar'></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-sm'>
                  <div className='form-group'>
                    <label>
                      <b>{props.t('myBusiness.contract.amount')}</b>
                    </label>
                    <div className='input-group'>
                      <input
                        className='form-control text-right my-input'
                        placeholder={
                          props.val2.amount != 'undefined'
                            ? props.t('myBusiness.contract.amount')
                            : '0'
                        }
                        // value={props.val2.amount}
                        name={props.val.amount}
                        onChange={props.check_input}
                        min='0'
                        maxLength='8'
                        type='number'
                        defaultValue={
                          props.val2.amount != 'undefined'
                            ? props.val2.amount
                            : ''
                        }
                        // value={props.val2.amount != "undefined" ? props.val2.amount : "0"}
                      />
                      <div className='input-group-prepend'>
                        <div className='input-group-text'>
                          <i className='icon-euro'></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withTranslation()(AgreementCreate);
