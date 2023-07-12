import React, { Component } from "react";
import axios from "axios";
import { url } from "../../../helper/helper";
import Header from "../../shared/Header";
import BussinessSidebar from "../../shared/BussinessSidebar";
import File from "../../../images/file-icon.png";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
// import Select from "react-select";
import Autosuggest from "react-autosuggest";
import AddCustomer from "../modals/AddCustomer";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import BusinessInfo from "../modals/BusinessInfo";
import PDFViewInvoice from "../modals/PDFViewInvoice";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Prompt } from "react-router";
import $ from "jquery";
import SweetAlert from "react-bootstrap-sweetalert";
import img from "../../../images/DefaultImg.png";
import Files from "react-files";
import Breadcrumb from "../../shared/Breadcrumb";
import Sidebar from "../../shared/Sidebar";
import { getData, postDataWithToken } from "../../../helper/api";
import "./Invoice.scss";
import ProjectPlanMobile from "../myProposal/ProjectPlanMobile";

const options = [];
const clients = [];
let width = window.innerWidth;

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

class Invoice extends Component {
  state = {
    business_info: [],
    email: "",
    emails: [],
    date: moment().format("DD-MM-YYYY"),
    date_err: false,
    due_date: "",
    due_date_err: false,
    inv_no: "",
    inv_no_err: false,
    refer: "",
    refer_err: false,
    acc_no: "",
    acc_err: false,
    pay_term: "",
    disable: false,
    pay_term_err: false,
    delay_interest: "",
    delay_interest_err: false,
    note: "",
    terms: "",
    service: "1",
    currency: "1",
    attachment: null,
    name: "",
    name_err: false,
    name_unq: null,
    agree_id: "",
    itemsInput: null,
    taxInput: null,
    subInput: null,
    taxCalcInput: null,
    totalInput: null,
    tender_id: 0,
    row_phasework: [
      { items: "", unit: "", date: "", price: "", qty: "", amount: "" },
    ],
    row_phaseWork2: [
      { items: "", unit: "", date: "", price: "", qty: "", amount: "" },
    ],
    row_phase_material: [
      { items: "", unit: "", date: "", price: "", qty: "", amount: "" },
    ],
    row_phase_workmat: [
      { items: "", unit: "", date: "", price: "", qty: "", amount: "" },
    ],
    selectedOption: null,
    value: "",
    suggestions: [],
    suggestions2: [],
    error: null,
    client_id_err: false,
    errors: [],
    show_errors: false,
    show_msg: false,
    agreements: [],
    projects: [],
    agreement: 0,
    project: 0,
    productcat: [],
    clientsList: [],
    loading: false,
    loading1: false,
    left: null,
    right: null,
    create_scratch: 0,
    success: false,
    deleteValid: false,
    isModalPreviewModal: false,
    isAddCustomerModalOpen: false,
    userEmail: "",
    client_type: "Client",
    address: "",
    type: "Work",
    items: "",
    itemsMaterial: "",
    itemsWork: "",
    ItemsWork2: "",
    ItemsWork: "",
    items_cost_subtotalMat: 0,
    items_cost_subtotalWorkmat: 0,
    items_cost_subtotalWork2: 0,
    items_cost_subtotalWork: 0,

    itemsMat: " ",
    totalMat: 0,
    totalWork: 0,
    totalWork2: 0,
    totalWorkMat: 0,

    tax_calcMat: 0,
    tax_calcWork: 0,
    tax_calcWork2: 0,
    tax_calcWorkMat: 0,

    est_time: "",
    est_cost: "",
    taxInputMat: 0,
    taxInputWork: 0,
    taxInputWorkmat: 0,
    taxInputWork2: 0,
    allTamp: [],
  };
  componentDidMount = () => {
    // $('.attachment input[type="file"]').change(function (e) {
    //   $(this)
    //     .next()
    //     .find(".filename")
    //     .html(e.target.files[0].name)
    //     .addClass("active");
    //   $(this).next().find(".clear").show();
    // });
    // $(".attachment label span.clear").click(function (e) {
    //   e.preventDefault();
    //   var content = $(this).prev(".filename").attr("data-text");
    //   $(this).prev(".filename").html(content).removeClass("active");
    //   $(this).parents(".file-select").find("input[type=file]").val("");
    //   $(this).hide();
    // });
    this.invoiceData();
    if (
      this.props.match.url === `/invoice/2/${this.props.match.params.tender}`
    ) {
      this.getprojectdata();
    }
    if (
      this.props.match.url === `/invoice/1/${this.props.match.params.tender}`
    ) {
      this.agreementList();
    }
    if (this.props.match.params.invoice_type) {
      console.log(
        this.props.match.params.invoice_type,
        "types",
        this.props.match.params.tender
      );
    }
    if (
      this.props.match.url ===
      `/invoice/${this.props.match.params.invoice_type}/draft`
    ) {
      this.getdraft();
    }

    this.loadResources();
    this.loadCategory();
    this.loadConfig();
    this.loadClient();
    this.getdata();
    this.loadNames();
    this.myRef = React.createRef();

    this.interval = setInterval(() => {
      this.checkallfields();
    }, 1000);
  };

  agreementList = async () => {
    const token = await localStorage.getItem("token");
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${url}/api/agreement/by_id/${this.props.match.params.tender}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        result.map((res) => {
          let row_phase = [];
          const {
            agreement_names,
            agreement_rate,
            email,
            emails,
            agreement_milestones,
            agreement_client_address,
          } = res;
          console.log(email, "ressss");

          JSON.parse(agreement_milestones).map((milestone) => {
            let obj = {
              items: milestone.des,
              unit: "",
              date: "",
              qty: 0,
              price:
                milestone.amount !== "0" ? milestone.amount : agreement_rate,
              amount: 0,
            };
            row_phase.push(obj);
          });

          this.setState({
            name: agreement_names,
            unit: agreement_rate,
            value: email,
            // emails: emails,
            rate: agreement_rate,
            row_phasework: row_phase,
            address: agreement_client_address,
          });
        });
      })
      .catch((error) => console.log("error", error));
  };

  loadNames = async () => {
    const token = await localStorage.getItem("token");
    await getData(`${url}/api/pro-plan/names/${this.state.type}`, token)
      .then((result) => {
        if (result.data?.data) {
          this.setState({ allTamp: result.data?.data });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  deleteRowWork = (index) => {
    var row_phasework = [...this.state.row_phasework];
    row_phasework.splice(index, 1);
    this.setState({ row_phasework });
  };

  deleteRowMaterial = (index) => {
    var row_phase_material = [...this.state.row_phase_material];
    row_phase_material.splice(index, 1);
    this.setState({ row_phase_material });
  };

  deleteRowWorkmat = (index) => {
    var row_phase_workmat = [...this.state.row_phase_workmat];
    row_phase_workmat.splice(index, 1);
    this.setState({ row_phase_workmat });
  };
  deleteRowWork2 = (index) => {
    var row_phaseWork2 = [...this.state.row_phaseWork2];
    row_phaseWork2.splice(index, 1);
    this.setState({ row_phaseWork2 });
  };
  // totalcalculation = () => {
  //   this.setState({
  //     itemsMaterial: JSON.stringify(this.state.row_phase_material),
  //     tax_calcMat: Number(
  //       (this.state.items_cost_subtotalMat * this.state.taxInputMat) / 100
  //     ).toFixed(2),
  //     totalMat: Number(
  //       this.state.items_cost_subtotalMat +
  //         (this.state.items_cost_subtotalMat * this.state.taxInputMat) / 100
  //     ).toFixed(2),

  //     itemsWork: JSON.stringify(this.state.row_phasework),
  //     tax_calcWork: Number(
  //       (this.state.items_cost_subtotalWork * this.state.taxInputWork) / 100
  //     ).toFixed(2),
  //     totalWork:
  //       Number(
  //         this.state.items_cost_subtotalWork +
  //           this.state.items_cost_subtotalWork * this.state.taxInputWork
  //       ) / (100).toFixed(2),
  //   });
  // };

  calcSubtotal = () => {
    let subtotalMat = 0;
    this.setState({
      items_cost_subtotalMat: subtotalMat,
    });
  };

  reset = () => {
    this.setState({
      row_phase_material: [],
      row_phasework: [],
      row_phaseWork2: [],
      row_phase_workmat: [],

      taxInputMat: 0,
      taxInputWork: 0,
      taxInputWorkmat: 0,
      taxInputWork2: 0,
      items_cost_subtotalMat: 0,
      items_cost_subtotalWork: 0,
      items_cost_subtotalWork2: 0,
      items_cost_subtotalWorkmat: 0,
    });
    // this.loadNames();
  };
  changeWorkArr = () => {
    let row_phasework = [...this.state.row_phasework];
    this.setState({ row_phasework });
  };
  changeMatArr = () => {
    let row_phase_mat = [...this.state.row_phase_material];
    this.setState({ row_phase_mat });
  };
  changeWorkmatArr = () => {
    let row_phase_workmat = [...this.state.row_phase_workmat];
    this.setState({ row_phase_workmat });
  };
  changeWork2Arr = () => {
    let row_phaseWork2 = [...this.state.row_phaseWork2];
    this.setState({ row_phaseWork2 });
  };

  ChangeItemWork = ({ e, idx }) => {
    let row_phasework = [...this.state.row_phasework];
    row_phasework[idx].items = e.target.value;
  };
  ChangeItem = ({ e, idx }) => {
    let row_phase_mat = [...this.state.row_phase_material];
    row_phase_mat[idx].items = e.target.value;
  };
  ChangeItemWorkmat = ({ e, idx }) => {
    let row_phase_workmat = [...this.state.row_phase_workmat];
    row_phase_workmat[idx].items = e.target.value;
  };
  ChangeItemWork2 = ({ e, idx }) => {
    let row_phaseWork2 = [...this.state.row_phaseWork2];
    row_phaseWork2[idx].items = e.target.value;
  };

  ChangeUnitWork = ({ e, idx }) => {
    let row_phasework = [...this.state.row_phasework];
    console.log(row_phasework[idx].unit, "unitt");
    row_phasework[idx].unit = e.target.value;
    this.setState({ row_phasework });
  };

  ChangeUnit = ({ e, idx }) => {
    let row_phase_mat = [...this.state.row_phase_material];
    console.log(row_phase_mat[idx].unit, "unitt");
    row_phase_mat[idx].unit = e.target.value;
    this.setState({ row_phase_mat });
  };

  ChangeUnitworkmat = ({ e, idx }) => {
    let row_phase_workmat = [...this.state.row_phase_workmat];
    console.log(row_phase_workmat[idx].unit, "unitt");
    row_phase_workmat[idx].unit = e.target.value;
    this.setState({ row_phase_workmat });
  };
  ChangeUnitwork2 = ({ e, idx }) => {
    let row_phaseWork2 = [...this.state.row_phaseWork2];
    console.log(row_phaseWork2[idx].unit, "unitt");
    row_phaseWork2[idx].unit = e.target.value;
    this.setState({ row_phaseWork2 });
  };
  changeQuantityWork = ({ e, idx }) => {
    let row_phasework = [...this.state.row_phasework];
    row_phasework[idx].qty = e.target.value;
    row_phasework[idx].amount = e.target.value * row_phasework[idx].price;
  };

  changeQuantity = ({ e, idx }) => {
    let row_phase_mat = [...this.state.row_phase_material];
    row_phase_mat[idx].qty = e.target.value;
    row_phase_mat[idx].amount = e.target.value * row_phase_mat[idx].price;
  };

  changeQuantityWorkMat = ({ e, idx }) => {
    let row_phase_workmat = [...this.state.row_phase_workmat];
    row_phase_workmat[idx].qty = e.target.value;
    row_phase_workmat[idx].amount =
      e.target.value * row_phase_workmat[idx].price;
  };
  changeQuantityWork2 = ({ e, idx }) => {
    let row_phaseWork2 = [...this.state.row_phaseWork2];
    row_phaseWork2[idx].qty = e.target.value;
    row_phaseWork2[idx].amount = e.target.value * row_phaseWork2[idx].price;
  };
  ChangePriceWork = ({ e, idx }) => {
    let row_phasework = [...this.state.row_phasework];
    console.log(row_phasework[idx].price, "costt");
    row_phasework[idx].price = e.target.value;
    row_phasework[idx].amount =
      row_phasework[idx].qty * row_phasework[idx].price;
  };

  ChangePriceMat = ({ e, idx }) => {
    let row_phase_mat = [...this.state.row_phase_material];
    console.log(row_phase_mat[idx].price, "costt");
    row_phase_mat[idx].price = e.target.value;
    row_phase_mat[idx].amount =
      row_phase_mat[idx].qty * row_phase_mat[idx].price;
  };
  ChangePriceWorkmat = ({ e, idx }) => {
    let row_phase_workmat = [...this.state.row_phase_workmat];
    console.log(row_phase_workmat[idx].price, "costt");
    row_phase_workmat[idx].price = e.target.value;
    row_phase_workmat[idx].amount =
      row_phase_workmat[idx].qty * row_phase_workmat[idx].price;
  };

  ChangePriceWork2 = ({ e, idx }) => {
    let row_phaseWork2 = [...this.state.row_phaseWork2];
    console.log(row_phaseWork2[idx].price, "costt");
    row_phaseWork2[idx].price = e.target.value;
    row_phaseWork2[idx].amount =
      row_phaseWork2[idx].qty * row_phaseWork2[idx].price;
  };

  ChangeTaxInput = (e) => {};
  totalMat = () => {
    this.setState({ itemsMat: JSON.stringify(this.state.row_phase_material) });
  };

  calculatesubTotal = () => {
    let subtotalMat = 0;
    this.setState({ items_cost_subtotalMat: subtotalMat });
  };
  loadConfig = async () => {
    const token = await localStorage.getItem("token");
    await getData(`${url}/api/config/currency`, token)
      .then((result) => {
        const { left, right } = result.data;
        this.setState({ left, right });
      })
      .catch((err) => {
        //console.log(err);
      });
  };
  invoiceData = async () => {
    const token = await localStorage.getItem("token");
    const result = await getData(`${url}/api/account`, token);
    console.log(result?.data[0].invoice_account_number);
    const acc = result?.data;
    console.log(acc);
    if (acc.length && acc.length > 0) {
      this.setState({
        acc_no: acc[0].invoice_account_number,
      });
    }
  };
  loadCategory = async () => {
    const token = await localStorage.getItem("token");
    let lang = await localStorage.getItem("_lng");
    await getData(`${url}/api/category/${lang}`, token)
      .then((result) => {
        this.setState({ productcat: result.data?.data });
      })
      .catch((err) => {
        //console.log(err.response);
      });
  };

  loadProjects = async (type, id) => {
    if (id.includes("com")) {
      const token = await localStorage.getItem("token");
      await getData(`${url}/api/invoice/getProjects/${type}/${id}`, token)
        .then((result) => {
          this.setState({ projects: result.data.data });
        })
        .catch((err) => {
          //console.log(err.response);
        });
    }
  };

  changeCat = (e) => {
    if (e.target.value !== "") {
      let row_phasework = this.state.row_phasework;
      const d = moment().format("MMMM DD YYYY");
      let obj = {
        des: e.target.value,
        date: d,
        amount: 0,
        qty: 0,
        price: 0,
      };
      row_phasework.push(obj);
      this.setState({
        row_phasework: row_phasework,
      });
    }
  };

  changeAgreement = async (event) => {
    // this.changeCat(event)

    if (event.target.value !== "--Select--") {
      let row_phasework = this.state.row_phasework;
      const token = localStorage.getItem("token");
      // if (event.target.value.split(",")[1] === "hourly") {
      await getData(
        `${url}/api/invoice/getTasksById/${event.target.value.split(",")[0]}`,
        token
      )
        .then((result) => {
          if (result.data.data[0] != null) {
            // this.setState({ row_phase: [] }); task_name  hours
            const d = moment(result.data.data[0]?.created_at).format(
              "MMMM DD YYYY"
            );
            let obj = {
              des: result.data.data[0]?.task_name,
              date: d,
              qty: result.data.data[0]?.hours,
              price: 0,
              amount: 0,
              // des: result.data.data[0]?.task_name,
              // amount: 0,
              // qty: result.data.data[0]?.hours,
              // cost: 0,
            };
            row_phasework.push(obj);
            this.setState({
              row_phasework: row_phasework,
              // row_phase: JSON.parse(result.data.data[0].items),
              agree_id: result.data.data[0].id,
              agreement: result.data.data[0].project_id,
            });
          }
        })
        .catch((err) => {
          //console.log(err.response);
        });
      // } else {
      //   axios
      //     .get(
      //       `${url}/api/invoiceAgreements/${event.target.value.split(",")[0]}`,
      //       {
      //         headers: {
      //           Authorization: `Bearer ${token}`,
      //         },
      //       }
      //     )
      //     .then((result) => {
      //       this.setState({ row_phase: [] });
      //       this.setState({
      //         row_phase: JSON.parse(result.data.data.items),
      //         agree_id: result.data.data.id,
      //         agreement: result.data.data.agreement_id,
      //       });
      //     })
      //     .catch((err) => {
      //       //console.log(err.response);
      //     });
      // }
    }
  };

  getprojectdata = async () => {
    const token = localStorage.getItem("token");
    await getData(
      `${url}/api/projectDetail/${this.props.match.params.tender}`,
      token
    )
      .then((result) => {
        this.setState({
          projectDetail: result.data?.data,
          name: result.data?.data[0].name,
          value: result.data?.data[0].email
            ? result.data?.data[0].email
            : result.data?.data[0].useremail,
          email_c: result.data?.data[0].email
            ? result.data?.data[0].email
            : result.data?.data[0].useremail,
          client_type: result.data?.data[0].client_type,
          // value: result.data?.data[0]. useremail,
          disable: true,
          // date: result.data.data[0].end_date
          // moment(result.data.data[0].end_date,'mm/dd/yyyy')
        });
        if (result.data.data[0].email) {
          this.setState({ disable: true });
        }
      })
      .catch((err) => {
        //console.log(err.response);
      });
  };

  getdraft = async () => {
    const token = localStorage.getItem("token");
    await getData(
      `${url}/api/invoice/getby/${this.props.match.params.invoice_type}`,
      token
    )
      .then((result) => {
        if (result.data.data[0]?.client_detail[0]?.email) {
          this.setState({
            value: result.data.data[0]?.client_detail[0]?.email,
            userEmail: result.data.data[0]?.client_detail[0]?.email,
          });
        }

        // //console.log("result.data.data[0].cc" , result.data.data[0]?.cc ? JSON.stringify(result.data.data[0].cc) : "");
        const restult_em = result.data?.data[0]?.cc;
        const emails = restult_em?.split(",");
        console.log(JSON.parse(result.data.data[0].items), "????");
        if (result.data.data[0].template_type === "Both") {
          this.setState({
            row_phaseWork2: JSON.parse(result.data.data[0].items).workArr,
            row_phase_workmat: JSON.parse(result.data.data[0].items).matArr,
            type: "Both",
          });
        } else if (result.data.data[0].template_type === "Material") {
          this.setState({
            row_phase_material: JSON.parse(result.data.data[0].items),
            type: "Material",
          });
        } else {
          this.setState({
            row_phasework: JSON.parse(result.data.data[0].items),
            type: "Work",
          });
        }
        this.setState({
          // JSON.parse(result.data?.data[0].items),
          agreements_name:
            result.data.data[0].attachment != null
              ? result.data.data[0].attachment
              : "",
          emails: emails ? emails : [],
          name:
            result.data.data[0].invoice_names != null
              ? result.data.data[0].invoice_names
              : "",
          due_date:
            result.data.data[0].due_date != null
              ? result.data.data[0].due_date
              : "",
          refer:
            result.data.data[0].reference != null
              ? result.data.data[0].reference
              : "",
          acc_no:
            result.data.data[0].acc_no != null
              ? result.data.data[0].acc_no
              : "",
          pay_term:
            result.data.data[0].pay_term != null
              ? result.data.data[0].pay_term
              : "",
          delay_interest:
            result.data.data[0].interest != null
              ? result.data.data[0].interest
              : "",
          //  delay_interest: items,
          address: result.data.data[0].client_address
            ? result.data.data[0].client_address
            : "",

          service:
            result.data.data[0].service != null
              ? result.data.data[0].acc_no
              : "",
          create_scratch:
            result.data.data[0].create_scratch != null
              ? result.data.data[0].create_scratch
              : "",
          //  terms: terms,
          note:
            result.data.data[0].note != null ? result.data.data[0].note : "",
          terms:
            result.data.data[0].terms != null ? result.data.data[0].note : "",

          taxInputWork:
            result.data.data[0].tax != null ? result.data.data[0].tax : "",
          taxInputMat:
            result.data.data[0].tax != null ? result.data.data[0].tax : "",
          total:
            result.data.data[0].total != null ? result.data.data[0].total : "",
          tax_calc:
            result.data.data[0].tax_calc != null
              ? result.data.data[0].tax_calc
              : "",
          items_cost_subtotalWork: result.data.data[0].sub_total
            ? result.data.data[0].sub_total
            : "",
          items_cost_subtotalMat: result.data.data[0].sub_total
            ? result.data.data[0].sub_total
            : "",
          type: result.data.data[0].type ? result.data.data[0].type : "",
          client_type: result.data.data[0].client_type
            ? result.data.data[0].client_type
            : "",
        });
        //console.log("result.data.data[0].client_type0", result.data.data[0].client_type);
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  getdata = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await getData(
        `${url}/api/projectTaskList/${this.props.match.params.invoice_type}`,
        token
      )
        .then((result) => {
          this.setState({ agreements: result?.data?.data });
        })
        .catch((err) => {
          //console.log(err.response);
        });
    }
  };

  //   selectTerm = (event) => {
  // // http://192.64.112.100/flipkoti/public/api/projectTaskList/17
  //     if (event.target.value !== "--Select--") {
  //       const token = localStorage.getItem("token");
  //       if (event.target.value.split(",")[1] !== "null") {
  //         axios
  //           .get(
  //             `${url}/api/invoice/getPaymentTerms/${this.props.match.params.tender}`,
  //             // `${url}/api/invoice/getPaymentTerms/${
  //             //   event.target.value.split(",")[0]
  //             // }/${event.target.value.split(",")[1]}`,
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${token}`,
  //               },
  //             }
  //           )
  //           .then((result) => {
  //             //console.log("=======getPaymentTerms======> ", result.data.data)
  //             this.setState({ agreements: result.data.data });
  //           })
  //           .catch((err) => {
  //             //console.log(err.response);
  //           });
  //       } else {
  //         axios
  //           .get(
  //             `${url}/api/invoice/getTasks/${event.target.value.split(",")[0]}`,
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${token}`,
  //               },
  //             }
  //           )
  //           .then((result) => {
  //             //console.log("=======getTasks======> ", result.data.data)
  //             this.setState({ agreements: result.data.data });
  //           })
  //           .catch((err) => {
  //             //console.log(err.response);
  //           });
  //       }
  //     }
  //   };
  handleAppendWork = (event) => {
    event.preventDefault();
    let row_phasework = this.state.row_phasework;
    const d = moment().format("MMMM DD YYYY");
    let keys = ["items", "date", "qty", "price", "unit", "amount"];
    let gg = `${""},${d},${0},${0},${0}`.split(",");
    let result = {};
    keys.forEach((key, i) => (result[key] = gg[i]));
    row_phasework.push(result);
    this.setState({ row_phase: row_phasework });
  };
  handleAppendMaterial = (event) => {
    event.preventDefault();
    let row_phase_material = this.state.row_phase_material;
    const d = moment().format("MMMM DD YYYY");
    let keys = ["items", "date", "qty", "price", "amount"];
    let gg = `${""},${d},${0},${0},${0}`.split(",");
    let result = {};
    keys.forEach((key, i) => (result[key] = gg[i]));
    row_phase_material.push(result);
    this.setState({ row_phase_material: row_phase_material });
  };

  handleAppendWorkmat = (event) => {
    event.preventDefault();
    let row_phase_workmat = this.state.row_phase_workmat;
    const d = moment().format("MMMM DD YYYY");
    let keys = ["items", "date", "qty", "price", "amount"];
    let gg = `${""},${d},${0},${0},${0}`.split(",");
    let result = {};
    keys.forEach((key, i) => (result[key] = gg[i]));
    row_phase_workmat.push(result);
    this.setState({ row_phase_workmat: row_phase_workmat });
  };
  handleAppendWork2 = (event) => {
    event.preventDefault();
    let row_phaseWork2 = this.state.row_phaseWork2;
    const d = moment().format("MMMM DD YYYY");
    let keys = ["items", "date", "qty", "price", "amount"];
    let gg = `${""},${d},${0},${0},${0}`.split(",");
    let result = {};
    keys.forEach((key, i) => (result[key] = gg[i]));
    row_phaseWork2.push(result);
    this.setState({ row_phaseWork2: row_phaseWork2 });
  };

  onFilesChange = (files) => {
    console.log(files, "?????");
    if (files[0]) {
      this.setState({
        attachment: files[0],
        file_err: "",
        img_name: files[0].name,
      });
      // this.setState({ logo: files[0], logo_preview: URL.createObjectURL(files[0]), loaded1: 50, file_err: "", img_name: files[0].name });
    }
  };

  onFilesError = (error, file) => {
    // //console.log(file, 'error code ' + error.code + ': ' + error.message)
    this.setState({
      file_err: error.message,
      // img_name: ''
    });
  };

  Remove_img = () => {
    this.setState({ attachment: "", loaded1: 0, file_err: "", img_name: "" });
  };

  handleAttachmentRemove = () => {
    this.setState({ attachment: null, img_name: "", file_err: "" });
  };

  // handleAttachment = (event) => {
  //   if (event.target.files[0].size > 2097152) {
  //     return alert("cannot be more than 2 mb");
  //   }
  //   if (
  //     event.target.files[0].name.split(".").pop() === "pdf" ||
  //     event.target.files[0].name.split(".").pop() === "PDF" ||
  //     event.target.files[0].name.split(".").pop() === "docx" ||
  //     event.target.files[0].name.split(".").pop() === "doc" ||
  //     event.target.files[0].name.split(".").pop() === "jpeg" ||
  //     event.target.files[0].name.split(".").pop() === "png" ||
  //     event.target.files[0].name.split(".").pop() === "PNG" ||
  //     event.target.files[0].name.split(".").pop() === "jpg" ||
  //     event.target.files[0].name.split(".").pop() === "JPG" ||
  //     event.target.files[0].name.split(".").pop() === "gif" ||
  //     event.target.files[0].name.split(".").pop() === "svg"
  //   ) {
  //     this.setState({ attachment: event.target.files[0] });
  //   } else {
  //     this.setState({ attachment: null });
  //     return alert("File type not supported");
  //   }
  // };

  // handleAttachmentRemove = () => {
  //   this.setState({ attachment: null });
  // };
  handleAuto = (selectedOption) => {
    this.setState({ selectedOption });
  };
  onChange = (event, { newValue }) => {
    if (newValue.length < 1) {
      this.setState({
        errro_mess: "",
      });
    }
    this.loadProjects(this.state.type, newValue);
    this.setState({
      value: newValue,
    });
  };
  onChange2 = (event, { newValue }) => {
    this.setState({
      email: newValue,
      error: "",
    });
  };

  data_state() {
    const { t, i18n } = this.props;
    this.setState({
      errro_mess: t("myBusiness.invoice.No_record"),
      err_value: "",
    });
    return [];
  }

  getSuggestion = (value) => {
    if (value) {
      this.setState({
        err_value: "",
      });
    }
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    // //console.log("inputLength", inputLength)
    console.log(clients, ">>>>>>>");
    const data = clients.filter(
      (lang) => (lang.value.toLowerCase().slice(0, inputLength) === inputValue) || (lang.name.toLowerCase().slice(0, inputLength) === inputValue)
    );
    if (data) {
      this.setState({
        errro_mess: "",
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
    this.setState({
      suggestions: this.getSuggestion(value),
    });
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
  handleBusinessInfo = (val) => {
    this.setState({ business_info: val });
  };
  handleDate = (event) => {
    this.setState({ date: moment(event._d).format("DD-MM-YYYY") });
  };
  handleDate1 = (event) => {
    this.setState({ due_date: moment(event._d).format("DD-MM-YYYY") });
  };
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  // changeType = (event) => {
  //   if (event.target.value === "client") {
  //     this.setState({ clientsList: [] });
  //     this.loadClient();
  //     this.setState({ type: "resource" });
  //   }
  //   if (event.target.value === "user") {
  //     this.setState({ clientsList: [] });
  //     this.loadUser();
  //     this.setState({ type: "user" });
  //   }
  // };

  addCustomer = () => {
    this.loadClient();
  };

  loadResources = async () => {
    const token = await localStorage.getItem("token");
    await axios
      .get(`${url}/api/resources-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        // //console.log(result);
        result.data.data.map((res) => {
          var keys = ["value", "label"];
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
    const token = await localStorage.getItem("token");
    await getData(`${url}/api/resources-list/Client`, token)
      .then((result) => {
        clients.length = 0;
        result.data.map((res) => {
          var keys = ["value", "label", "name"];
          var _key = {};
          keys.forEach((key, i) => (key === "name"? _key[key] = res.first_name : _key[key] = res.email));
          // _key["name"] = res.full_name;
          // _key["id"] = res.id;
          clients.push(_key);
          this.setState({ clientsList: clients });
        });
      })
      .catch((err) => {
        //console.log(err.response);
      });
  };

  loadUser = async () => {
    const token = await localStorage.getItem("token");
    await getData(`${url}/api/invoice/agreementUsers`, token)
      .then((result) => {
        clients.length = 0;
        result.data.data.map((res) => {
          if (res.email) {
            var keys = ["value", "label", "name"];
            var _key = {};
            keys.forEach((key, i) => (key === "name"? _key[key] = res.first_name : _key[key] = res.email));
            // _key["name"] = res.full_name;
            // _key["id"] = res.agreement_client_id;
            clients.push(_key);
            this.setState({ clientsList: clients });
          }
        });
      })
      .catch((err) => {
        //console.log(err.response);
      });
  };

  handleDelete = (item) => {
    this.setState({
      emails: this.state.emails.filter((i) => i !== item),
    });
  };

  handlePaste = (evt) => {
    evt.preventDefault();
    var paste = evt.clipboardData.getData("text");
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
      error = `${email} ${t("myBusiness.invoice.alreday_have")}`;
    }

    if (!this.isEmail(email)) {
      error = `${email} ${t("myBusiness.invoice.emailmessage")}`;
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
  handleChange2 = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, error: null });
  };
  handleRes = ({ value }) => {
    this.setState({ email: value, error: null });
  };
  handleKeyDown = (evt) => {
    if (["Enter", "Tab", ","].includes(evt.key)) {
      evt.preventDefault();

      var email = this.state.email.trim();

      if (email && this.isValid(email)) {
        this.setState({
          emails: [...this.state.emails, this.state.email],
          email: "",
        });
      }
    }
  };

  handleDraft = async (event) => {
    event.preventDefault();
    this.setState({
      date_err: false,
      inv_no_err: false,
      refer_err: false,
      acc_err: false,
      pay_term_err: false,
      due_date_err: false,
      delay_interest_err: false,
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
      if (this.state.value === null || this.state.value === "") {
        client_id = 0;
      } else {
        client_id = this.state.value;
      }
    }

    if (this.state.name == null || this.state.name == "") {
      this.myRef.current.scrollTo(0, 0);
      return this.setState({ name_err: true });
    }
    const token = await localStorage.getItem("token");
    this.setState({ loading1: true });
    const data = new FormData();
    const workTotal =
      subTotalWorkMat + (subTotalWorkMat * this.state.taxInputWork2) / 100;

    const matTotal =
      subTotalMaterialWork +
      (subTotalMaterialWork * this.state.taxInputWorkmat) / 100;

    const arrBoth = {
      workArr: this.state.row_phaseWork2,
      matArr: this.state.row_phase_workmat,
    };
    const taxBoth = {
      workTax: this.state.taxInputWork2,
      matTax: this.state.taxInputWorkmat,
    };
    const totalBoth = Number(workTotal + matTotal).toFixed(2);

    const tax_calcBoth = {
      workTaxCalc: Number(
        (subTotalWorkMat * this.state.taxInputWork2) / 100
      ).toFixed(2),
      matTaxCalc: Number(
        (subTotalMaterialWork * this.state.taxInputWorkmat) / 100
      ).toFixed(2),
    };
    const subTotalBoth = {
      workSubTotalBoth: subTotalWorkMat,
      matSubTotalBoth: subTotalMaterialWork,
    };
    let row_phasework = this.state.row_phasework;
    let row_phase_material = this.state.row_phase_material;

    if (this.state.type === "Work") {
      data.set("items", JSON.stringify(row_phasework));
      data.set("tax", this.state.taxInputWork);
      data.set("sub_total", subTotalWork);
      data.set(
        "tax_calc",
        Number((subTotalWork * this.state.taxInputWork) / 100).toFixed(2)
      );
      data.set(
        "total",
        Number(
          subTotalWork + (subTotalWork * this.state.taxInputWork) / 100
        ).toFixed(2)
      );
    } else if (this.state.type === "Material") {
      data.set("items", JSON.stringify(row_phase_material));
      data.set("tax", this.state.taxInputMat);
      data.set("sub_total", subTotalMat);
      data.set(
        "total",
        Number(
          subTotalMat + (subTotalMat * this.state.taxInputMat) / 100
        ).toFixed(2)
      );
      data.set(
        "tax_calc",
        Number((subTotalMat * this.state.taxInputMat) / 100).toFixed(2)
      );
    } else {
      data.set("items", JSON.stringify(arrBoth));
      data.set("tax", JSON.stringify(taxBoth));
      data.set("total", totalBoth);
      data.set("tax_calc", JSON.stringify(tax_calcBoth));
      data.set("sub_total", JSON.stringify(subTotalBoth));
    }

    data.set("tender_id", this.state.tender_id);
    data.set("client_id", client_id);
    data.set("date", this.state.date);

    if (
      this.props.match.url !==
      `/invoice/${this.props.match.params?.tender}/draft`
    ) {
      if (this.state.userEmail || this.state.email_c) {
        data.set("type", "user");
      } else {
        data.set("type", "resource");
      }
    }
    // data.set("type", this.state.type);

    data.set("agree_id", this.state.agree_id);
    data.set("agreement", this.state.agreement);
    data.set("due_date", this.state.due_date);
    data.set("invoice_number", this.state.inv_no);
    data.set("reference", this.state.refer);
    data.set("acc_no", this.state.acc_no);
    data.set("pay_term", this.state.pay_term);
    data.set("interest", this.state.delay_interest);
    data.set("cc", this.state.emails);
    data.set("client_address", this.state.address);
    data.set("service", this.state.service);
    data.set("currency", this.state.currency);

    // data.set("items", this.itemsInput.value);
    // data.set("tax", this.taxInput.value);
    // data.set("sub_total", this.subInput.value);
    // data.set("tax_calc", this.taxCalcInput.value);

    // data.set("total", this.totalInput.value);
    data.set("note", this.state.note);
    data.set("terms", this.state.terms);
    data.set("sent", 0);
    data.set("template_type", this.state.type);

    if (
      this.props.match.url ==
      `/invoice/${this.props.match.params?.tender}/draft`
    ) {
      data.set("id", this.props.match?.params?.tender);
      if (this.state.client_type === "user") {
        data.set("type", "user");
      } else {
        data.set("type", "resource");
      }
    } else {
      data.set("id", "");
      // if (this.state.type) {
      //   data.set("type", "user");
      // }
    }
    // if (this.props.match.params?.tender) {
    //   data.set("id", this.props.match.params?.tender)
    // } else {
    // }
    // return

    data.set("invoice_names", this.state.name);
    data.append(
      "attachment",
      this.state.attachment ? this.state.attachment : this.state.agreements_name
    );
    await postDataWithToken(`${url}/api/invoice/draft`, data, token)
      .then((res) => {
        this.setState({
          show_msg: true,
          loading1: false,
          success: " Your Request have been submit succesfully",
          redirect_page: false,
          value: "",
          date: "",
          due_date: "",
          inv_no: "",
          refer: "",
          acc_no: "",
          pay_term: "",
          delay_interest: "",
          emails: [],
          email: "",
          agreement: 0,
          agree_id: null,
          service: "",
          note: "",
          terms: "",
          attachment: "",
          name: "",
          address: "",
        });
        this.myRef.current.scrollTo(0, 0);
      })
      .catch((err) => {
        this.myRef.current.scrollTo(0, 0);
        if (err?.response?.status === 406) {
          if (err.response.data.error.invoice_names) {
            this.setState({
              name_unq: err.response.data.error.invoice_names[0],
            });
          }
        }
        if (err?.response?.status === 403) {
          this.setState({
            client_id_err: true,
          });
        }
        if (err?.response?.status === 500) {
          this.setState({ deleteValid: true });
        }
        this.setState({ loading1: false });
        this.myRef.current.scrollTo(0, 0);
      });

    // Display the key/value pairs
    // for (var pair of data.entries()) {
    //   //console.log(pair[0] + ", " + pair[1]);
    // }
  };

  //
  // addslider_api = () => {
  //   const token = await localStorage.getItem("token");

  //   const data = new FormData();
  //   // data.set("total", this.totalInput.value);
  //   data.append("banner_image", this.state.first_name);
  //   await axios
  //     .post("http://134.209.157.211/champbakery/public/api/add-banner", data, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((res) => {
  //       //console.log(res);
  //     })
  //     .catch((err) => {
  //       //console.log(err);
  //     });
  // }

  //
  handleSubmit = async (event) => {
    event.preventDefault();
    console.log(this.state.tax_calcWork, "????>>>>>>");

    this.setState({
      date_err: false,
      inv_no_err: false,
      refer_err: false,
      acc_err: false,
      pay_term_err: false,
      due_date_err: false,
      delay_interest_err: false,
      name_err: false,
      name_unq: null,
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
      if (this.state.value === null || this.state.value === "") {
        // return alert("please select a resource");
        return this.setState({
          err_value: "please select a resource",
        });
      }
      this.setState({
        err_value: "",
      });
      client_id = this.state.value;
    }
    if (this.state.name == null || this.state.name == "") {
      return this.setState({ name_err: true });
    }
    if (this.state.date == "") {
      return this.setState({ date_err: true });
    }
    // if (this.state.inv_no == "") {
    //   return this.setState({ inv_no_err: true });
    // }
    if (this.state.refer == "") {
      return this.setState({ refer_err: true });
    }
    if (this.state.acc_no == "") {
      return this.setState({ acc_err: true });
    }
    if (this.state.pay_term == "") {
      return this.setState({ pay_term_err: true });
    }
    if (this.state.due_date == "") {
      return this.setState({ due_date_err: true });
    }
    if (this.state.delay_interest == "") {
      return this.setState({ delay_interest_err: true });
    }

    const token = await localStorage.getItem("token");
    this.setState({ loading: true });
    const data = new FormData();
    const workTotal =
      subTotalWorkMat + (subTotalWorkMat * this.state.taxInputWork2) / 100;

    const matTotal =
      subTotalMaterialWork +
      (subTotalMaterialWork * this.state.taxInputWorkmat) / 100;

    const arrBoth = {
      workArr: this.state.row_phaseWork2,
      matArr: this.state.row_phase_workmat,
    };
    const taxBoth = {
      workTax: this.state.taxInputWork2,
      matTax: this.state.taxInputWorkmat,
    };
    const totalBoth = Number(workTotal + matTotal).toFixed(2);

    const tax_calcBoth = {
      workTaxCalc: Number(
        (subTotalWorkMat * this.state.taxInputWork2) / 100
      ).toFixed(2),
      matTaxCalc: Number(
        (subTotalMaterialWork * this.state.taxInputWorkmat) / 100
      ).toFixed(2),
    };
    const subTotalBoth = {
      workSubTotalBoth: subTotalWorkMat,
      matSubTotalBoth: subTotalMaterialWork,
    };

    let row_phasework = this.state.row_phasework;
    let row_phase_material = this.state.row_phase_material;

    if (this.state.type === "Work") {
      data.set("items", JSON.stringify(row_phasework));
      data.set("tax", this.state.taxInputWork);
      data.set("sub_total", subTotalWork);

      data.set(
        "tax_calc",
        Number((subTotalWork * this.state.taxInputWork) / 100).toFixed(2)
      );
      data.set(
        "total",
        Number(
          subTotalWork + (subTotalWork * this.state.taxInputWork) / 100
        ).toFixed(2)
      );
    } else if (this.state.type === "Material") {
      data.set("items", JSON.stringify(row_phase_material));
      data.set("tax", this.state.taxInputMat);
      data.set("sub_total", subTotalMat);

      data.set(
        "total",
        Number(
          subTotalMat + (subTotalMat * this.state.taxInputMat) / 100
        ).toFixed(2)
      );
      data.set(
        "tax_calc",
        Number((subTotalMat * this.state.taxInputMat) / 100).toFixed(2)
      );
    } else {
      data.set("items", JSON.stringify(arrBoth));
      data.set("tax", JSON.stringify(taxBoth));
      data.set("total", totalBoth);
      data.set("tax_calc", JSON.stringify(tax_calcBoth));
      data.set("sub_total", JSON.stringify(subTotalBoth));
    }

    if (
      this.props.match.url ===
      `/invoice/${this.props.match.params.invoice_type}/${this.props.match.params.tender}`
    ) {
      if (this.props.match.params.invoice_type === "1") {
        data.set("invoice_type", 1);
        data.set("invoice_type_id", 1);
        data.set("project_id", 0);
      } else if (this.props.match.params.invoice_type === "2") {
        data.set("invoice_type", 2);
        data.set("invoice_type_id", 0);
        data.set("project_id", this.props.match.params.tender);
      } else {
        data.set("invoice_type", 0);
        data.set("invoice_type_id", 0);
        data.set("project_id", 0);
      }
    }

    // if (this.props.match.params.invoice_type === 1) {
    //   data.set("invoice_type", 1);
    // }
    // else if (this.props.match.params.invoice_type === 2) {
    //   data.set("invoice_type", 2);
    // }
    // else {
    //   data.set("invoice_type", 0);
    // }

    data.set("tender_id", this.state.tender_id);
    data.set("client_id", client_id);

    data.set("agree_id", this.state.agree_id);
    data.set("agreement", this.state.agreement);
    data.set("date", this.state.date);
    data.set("due_date", this.state.due_date);
    data.set("invoice_number", this.state.inv_no);
    data.set("reference", this.state.refer);
    data.set("acc_no", this.state.acc_no);
    data.set("pay_term", this.state.pay_term);
    data.set("interest", this.state.delay_interest);
    data.set("cc", this.state.emails);
    data.set("service", this.state.service);
    data.set("currency", this.state.currency);
    data.set("template_type", this.state.type);

    // data.set("items", this.itemsInput.value);
    // data.set("tax", this.taxInput.value);
    // data.set("sub_total", this.subInput.value);
    // data.set("tax_calc", this.taxCalcInput.value);
    // data.set("total", this.totalInput.value);
    data.set("note", this.state.note);
    data.set("terms", this.state.terms);
    data.set("logo", this.state.business_info.company_logo);
    data.set("company_id", this.state.business_info.company_id);
    data.set(
      "names",
      `${this.state.business_info.first_name} ${this.state.business_info.last_name}`
    );
    data.set("email", this.state.business_info.email);
    data.set("address", this.state.business_info.address);
    data.set("client_address", this.state.address);
    data.set("phone", this.state.business_info.phone);
    data.set("bussiness_id", this.state.business_info.id);
    data.set("sent", 1);
    if (
      `/invoice/${this.props.match.params?.tender}/draft` ==
      this.props.match?.url
    ) {
      data.set("id", this.props.match.params?.tender);
    }

    if (
      this.props.match.url === `/invoice/${this.props.match.params?.tender}`
    ) {
      // data.set("type", "user");
      if (this.state.userEmail) {
        data.set("type", "user");
      } else {
        data.set("type", "resource");
      }
    }
    if (
      this.props.match.url ==
      `/invoice/${this.props.match.params?.tender}/draft`
    ) {
      if (this.state.client_type === "user") {
        data.set("type", "user");
      } else {
        data.set("type", "resource");
      }
    }

    if (this.props.match.url == "/invoice") {
      data.set("create_scratch", 1);
      data.set("type", "resource");
    }
    // return ;

    data.set("invoice_names", this.state.name);
    data.append("attachment", this.state.attachment);
    await postDataWithToken(`${url}/api/invoice/create`, data, token)
      .then((res) => {
        this.setState({
          show_msg: true,
          value: "",
          date: "",
          due_date: "",
          inv_no: "",
          refer: "",
          acc_no: "",
          pay_term: "",
          delay_interest: "",
          emails: [],
          email: "",
          agreement: 0,
          agree_id: null,
          service: "",
          note: "",
          terms: "",
          attachment: "",
          name: "",
          itemsInput: null,
          taxInput: null,
          subInput: null,
          taxCalcInput: null,
          taxInputWork: 0,
          taxInputMat: 0,
          taxInputWorkmat: 0,
          taxInputWork2: 0,
          tax_calcWork: "",
          row_phasework: [],
          selectedOption: null,
          agreements: [],
          projects: [],
          productcat: [],
          clientsList: [],
          loading1: false,
          loading: false,
          redirect_page: false,
          address: "",
          success: "Your Request have been submit succesfully",
        });
        this.myRef.current.scrollTo(0, 0);
        // this.props.history.push("/invoice-list")
      })
      .catch((err) => {
        this.myRef.current.scrollTo(0, 0);
        if (err?.response?.status === 406) {
          if (err.response.data.error.invoice_names) {
            this.setState({
              name_unq: err.response.data.error.invoice_names[0],
            });
          }
        }
        if (err?.response?.status === 403) {
          this.setState({
            client_id_err: true,
          });
        }
        if (err?.response?.status === 500) {
          this.setState({ deleteValid: true });
        }
        this.setState({ loading: false });
        this.myRef.current.scrollTo(0, 0);
      });

    // for (var pair of data.entries()) {
    //   //console.log(pair[0] + ", " + pair[1]);
    // }
  };

  loadTemplate = async (e) => {
    const val = e?.target?.value ? e.target.value : e;
    // setTemplate_name(val);
    const token = await localStorage.getItem("token");
    await getData(`${url}/api/pro-plan/template/${val}`, token)
      .then((result) => {
        const {
          type,
          items,
          tax,
          profit,
          tax_calc,
          profit_calc,
          items_cost,
          template_name,
          total,
          id,
        } = result.data;
        this.setState({
          row_phasework: [
            { items: "", unit: "", date: "", price: "", qty: "", amount: "" },
          ],
          row_phase_material: [
            { items: "", unit: "", date: "", price: "", qty: "", amount: "" },
          ],
          row_phaseWork2: [
            { items: "", unit: "", date: "", price: "", qty: "", amount: "" },
          ],
          row_phase_workmat: [
            { items: "", unit: "", date: "", price: "", qty: "", amount: "" },
          ],
        });
        if (type === "Work") {
          const newItems = JSON.parse(items).map((data, idx) => {
            return {
              items: data.items,
              unit: data.unit,
              date: "",
              price: data.cost,
              qty: data.dur,
              amount: data.mat,
            };
          });
          this.setState({
            row_phasework: newItems,
            type: type,
            // taxInputWork: tax,
          });
          // setType("Work");
          // items && setRow_phase(JSON.parse(items));
          // setTaxInputWork(tax);
          // setProfitInputWork(profit);
          // setLoaded(loaded + 1);
        } else if (type === "Material") {
          const newItems = JSON.parse(items).map((data, idx) => {
            return {
              items: data.items,
              unit: data.unit,
              date: "",
              price: data.cost,
              qty: data.dur,
              amount: data.mat,
            };
          });
          this.setState({
            row_phase_material: newItems,
            type: type,
            // taxInputWork: tax,
          });
          // setType("Material");
          // items && setRow_phaseMat(JSON.parse(items));
          // setTaxInputMat(tax);
          // setProfitInputMat(profit);
          // setLoaded(loaded + 1);
        } else {
          const myItems = items && JSON.parse(items);
          const newItemsMat = JSON.parse(myItems.workArr).map((data, idx) => {
            return {
              items: data.items,
              unit: data.unit,
              date: "",
              price: data.cost,
              qty: data.dur,
              amount: data.mat,
            };
          });
          const newItemsWork = JSON.parse(myItems.matAtt).map((data, idx) => {
            return {
              items: data.items,
              unit: data.unit,
              date: "",
              price: data.cost,
              qty: data.dur,
              amount: data.mat,
            };
          });
          this.setState({
            row_phaseWork2: newItemsWork,
            row_phase_workmat: newItemsMat,
            // type: type,
            // taxInputWork: tax,
          });
          // const myItems = items && JSON.parse(items);
          // const myTax = tax && JSON.parse(tax);
          // const myProfit = profit && JSON.parse(profit);
          // setType("Both");
          // setRow_phase(JSON.parse(myItems.workArr));
          // setRow_phaseMat(JSON.parse(myItems.matAtt));
          // setTaxInputWork(myTax.workTax);
          // setProfitInputWork(myProfit.workProfit);
          // setTaxInputMat(myTax.matTax);
          // setProfitInputMat(myProfit.matProfit);
          // setLoaded(loaded + 1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  hiddenFields = () => {
    this.setState({
      client_id:
        this.state.tender_id !== 0 ||
        this.props.match.params.draft !== undefined
          ? this.state.userEmail
          : this.state.value,
      itemsInput: this.itemsInput.value,
      taxInput: this.taxInput.value,
      subInput: this.subInput.value,
      taxInputWork: this.state.taxInputWork,
      taxInputMat: this.state.taxInputMat,
      taxInputWork2: this.state.taxInputWork2,
      taxInputWorkmat: this.state.taxInputWorkmat,
      tax_calcWork: this.state.tax_calcWork,
      taxCalcInput: this.taxCalcInput.value,
      totalInput: this.totalInput.value,
      isModalPreviewModal: !this.state.isModalPreviewModal,
    });
  };
  checkallfields() {
    if (
      this.state.name ||
      this.state.inv_no ||
      this.state.refer ||
      this.state.acc_no ||
      this.state.pay_term ||
      this.state.due_date ||
      this.state.delay_interest ||
      this.state.value ||
      this.state.terms
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

  onConfirmError = () => {
    this.setState({
      server: false,
      validation: false,
      success: false,
      redirect_page: false,
    });
    this.props.history.push("/invoice-list");
  };

  onCancel = () => {
    this.setState({
      deleteValid: false,
    });
  };

  render() {
    // //console.log("fjhgjh", this.props.match.url === `/invoice/${this.props.match.params?.tender}`);
    // //console.log(`/invoice/${this.props.match.params?.tender}`);
    // //console.log("this.props.match.params?.tender", this.props.match.url === `/invoice/${this.props.match.params?.tender}`)
    // //console.log(this.props.match.params.customer === "draft");
    // //console.log(this.props.match.url == `/invoice/${this.props.match.params.tender}/draft`);
    const { t, i18n } = this.props;
    // //console.log("`/invoice/${this.props.match.params?.tender}`", `/invoice/${this.props.match.params?.tender}`)
    let vatValue1 = 0;

    var d = moment().add(0, "day");
    function valid(current) {
      return current.isAfter(d);
    }

    let loading;
    let loading1;
    const userInfo = {
      client_id: this.state.client_id,
      date: this.state.date,
      due_date: this.state.due_date,
      invoice_number: this.state.inv_no,
      reference: this.state.refer,
      acc_no: this.state.acc_no,
      pay_term: this.state.pay_term,
      interest: this.state.delay_interest,
      cc: this.state.emails,
      service: this.state.service,
      currency: this.state.currency,
      itemsInput: this.state.itemsInput,
      taxInput: this.state.taxInput,
      subInput: this.state.subInput,
      taxInputWork: this.state.taxInputWork,
      taxInputMat: this.state.taxInputMat,
      taxInputWorkmat: this.state.taxInputWorkmat,
      taxInputWork2: this.state.taxInputWork2,
      tax_calcWork: this.state.tax_calcWork,
      taxCalcInput: this.state.taxCalcInput,
      totalInput: this.state.totalInput,
      note: this.state.note,
      terms: this.state.terms,
      address: this.state.address,
      left: this.state.left,
      right: this.state.right,
      type: this.state.type,
      rowPhaseWork: JSON.stringify(this.state.row_phasework),
      rowPhaseMat: JSON.stringify(this.state.row_phase_material),
      rowPhaseWork2: JSON.stringify(this.state.row_phaseWork2),
      rowPhaseWorkMat: JSON.stringify(this.state.row_phase_workmat),
    };

    if (this.state.loading === true) {
      loading = (
        <Spinner animation="border" role="status">
          <span className="sr-only"> {t("myBusiness.invoice.Loading")} </span>
        </Spinner>
      );
    }

    if (this.state.loading1 === true) {
      loading1 = (
        <Spinner animation="border" role="status">
          <span className="sr-only"> {t("myBusiness.invoice.Loading")} </span>
        </Spinner>
      );
    }

    let alert;
    if (this.state.show_errors === true) {
      alert = (
        <Alert variant="danger" style={{ fontSize: "13px", zIndex: 1 }}>
          {Object.entries(this.state.errors).map(([key, value]) => {
            const stringData = value.reduce((result, item) => {
              return `${item} `;
            }, "");
            return stringData;
          })}
        </Alert>
      );
    }
    if (this.state.show_msg === true) {
      alert = (
        <Alert variant="success" style={{ fontSize: "13px" }}>
          {t("myBusiness.invoice.inv_ins")}
        </Alert>
      );
    }

    const { selectedOption, value, email, suggestions, suggestions2 } =
      this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      disable: true,
      placeholder: t("myBusiness.invoice.place_email"),
      value,
      className: "form-control",
      onChange: this.onChange,
    };

    // Autosuggest will pass through all these props to the input.
    const inputProps2 = {
      placeholder: t("myBusiness.invoice.email_id"),
      value: this.state.email,
      className: "form-control",
      onChange: this.onChange2,
      onKeyDown: this.handleKeyDown,
      onPaste: this.handlePaste,
    };

    const { success } = this.state;
    // //console.log(this.state.productcat,"juhhhhhhhhhthis.state.productcat");
    // //console.log("attachment: null  , img_name: ", this.state.attachment , "dfihdeiuohfdsufd",this.state.img_name );
    const { deleteValid } = this.state;

    let productcat_data;
    if (this.state.productcat) {
      productcat_data = (
        <div className="col">
          <select
            onChange={this.changeCat}
            id="work_mat"
            className="form-control"
            required
          >
            <option value=""> {t("myBusiness.invoice.Select")} </option>

            {this.state.productcat.length != 0
              ? this.state.productcat?.map((x, i) => (
                  <>
                    <option key={i} value={x.category_name}>
                      {x.category_name}
                    </option>
                  </>
                ))
              : []}
          </select>
        </div>
      );
    }

    // console.log(this.state.address);
    let subtotalMat = 0;
    let subtotalMatWork = 0;
    let subtotalWork = 0;
    let subtotalWork2 = 0;

    return (
      <React.Fragment>
        <Prompt
          when={this.state.redirect_page}
          message={t("myBusiness.invoice.leave_page")}
        />
        <div>
          {deleteValid ? (
            <SweetAlert
              warning
              confirmBtnBsStyle="danger"
              title="Internal Server Error"
              onConfirm={this.onCancel}
            >
              {/* Internal Server Error */}
            </SweetAlert>
          ) : (
            ""
          )}

          {/* <Header active={'bussiness'} /> */}
          <Breadcrumb>
            <Link
              to="/business-dashboard"
              className="breadcrumb-item active"
              aria-current="page"
            >
              {t("myBusiness.invoice.heading")}
            </Link>
            <Link
              to="/invoice-list"
              className="breadcrumb-item active"
              aria-current="page"
            >
              {t("myBusiness.invoice.invoice")}
            </Link>
            <li className="breadcrumb-item active" aria-current="page">
              {t("myBusiness.invoice.create")}
            </li>
          </Breadcrumb>
          <div className="main-content">
            <Sidebar dataFromParent={this.props.location.pathname} />
            <div ref={this.myRef} className="page-content">
              {alert ? alert : null}

              {success ? (
                <SweetAlert
                  success
                  closeOnClickOutside={true}
                  title={t("myBusiness.invoice.SuccessPopup")}
                  // title={t("list_details.success1")}
                  onConfirm={this.onConfirmError}
                >
                  {/* {t("list_details.success")} */}
                </SweetAlert>
              ) : (
                ""
              )}

              <div className="container-fluid">
                <h3 className="head3">
                  {t("myBusiness.invoice.create_invoice")}
                </h3>
                <div className="row mt-4" style={{ maxWidth: "1120px" }}>
                  <div className="col text-right">
                    <button
                      onClick={this.hiddenFields}
                      className="btn btn-primary ml-3 mb-3 clk3"
                      data-toggle="modal"
                      data-target="#preview-info"
                    >
                      {t("myBusiness.invoice.Preview")}
                    </button>

                    {/* {loading1 ? (
                      loading1
                  ) : ( */}
                    <button
                      onClick={this.handleDraft}
                      className="btn btn-gray ml-3 mb-3 clk3"
                    >
                      {loading1 ? loading1 : ""}
                      {t("myBusiness.invoice.Save_as_Draft")}
                    </button>
                    {/* )} */}

                    {/* {loading ? (
                       loading
                     ) : ( */}
                    <button
                      onClick={this.handleSubmit}
                      className="btn btn-primary ml-3 mb-3 clk3"
                    >
                      {loading ? loading : ""} {t("myBusiness.invoice.Send")}
                    </button>
                    {/* )} */}
                  </div>
                </div>
                <div className="card" style={{ maxWidth: "1120px" }}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="form-group">
                          <label htmlFor="name">
                            {t("myBusiness.invoice.name1")}
                          </label>
                          <input
                            id="name"
                            className="form-control"
                            type="text"
                            name="name"
                            autoComplete="off"
                            value={this.state.name}
                            onChange={this.handleChange2}
                          />
                          <p style={{ color: "#eb516d " }}>
                            {this.state.name_err === true
                              ? "Name is required"
                              : null}
                            {this.state.name_unq ? this.state.name_unq : null}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="row gutters-70 mt-3">
                      <div className="col-sm-12 col-md">
                        <h4 className="head4">
                          {t("myBusiness.invoice.buss_info")}{" "}
                          <a
                            href="#"
                            className="float-right"
                            data-toggle="modal"
                            data-target="#edit-info"
                          >
                            {t("myBusiness.invoice.Edit")}
                          </a>
                        </h4>
                        <address>
                          <p>
                            {/* {this.state.business_info.company_id} */}
                            {/* <br /> */}
                            {t("myBusiness.invoice.Company_id")}
                            {this.state.business_info.company_id}
                          </p>
                          <p>
                            {this.state.business_info.address}
                            <br />
                            <p>{this.state.business_info.address_city}</p>
                            {this.state.business_info.zip == "null" ||
                            this.state.business_info.zip == "undefined"
                              ? " "
                              : this.state.business_info.zip}
                          </p>
                          <p>
                            {this.state.business_info.email}
                            <br />
                            {this.state.business_info.phone}
                            <br />
                            {this.state.business_info.company_website ==
                              "null" ||
                            this.state.business_info.company_website ==
                              "undefined"
                              ? " "
                              : this.state.business_info.company_website}
                          </p>
                        </address>
                      </div>
                      <div className="col-sm-12 col-md">
                        <div className="form-group">
                          <label>
                            {" "}
                            {t("myBusiness.invoice.Company_Logo")}{" "}
                          </label>
                          <div className="file-select inline">
                            <label htmlFor="attachments">
                              <img
                                src={
                                  this.state.business_info.company_logo === null
                                    ? img
                                    : url +
                                      "/images/marketplace/company_logo/" +
                                      this.state.business_info.company_logo
                                }
                                alt=""
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12 col-lg-5">
                        <input
                          type="hidden"
                          ref={(input) => {
                            this.itemsInput = input;
                          }}
                          id="_items"
                        />
                        <input
                          type="hidden"
                          ref={(input) => {
                            this.subInput = input;
                          }}
                          id="_sub_total"
                        />
                        <input
                          type="hidden"
                          ref={(input) => {
                            this.taxInput = input;
                          }}
                          id="_tax"
                        />
                        <input
                          type="hidden"
                          ref={(input) => {
                            this.taxCalcInput = input;
                          }}
                          id="_tax_calc"
                        />
                        <input
                          type="hidden"
                          ref={(input) => {
                            this.taxInputWork = input;
                          }}
                          id="_tax_Inputwork"
                        />
                        <input
                          type="hidden"
                          ref={(input) => {
                            this.taxInputMat = input;
                          }}
                          id="_tax_Inputwork"
                        />
                        <input
                          type="hidden"
                          ref={(input) => {
                            this.taxInputWork2 = input;
                          }}
                          id="_tax_Inputwork"
                        />
                        <input
                          type="hidden"
                          ref={(input) => {
                            this.taxInputWorkmat = input;
                          }}
                          id="_tax_Inputwork"
                        />

                        <input
                          type="hidden"
                          ref={(input) => {
                            this.tax_calcWork = input;
                          }}
                          id="tax_calcWork"
                        />

                        <input
                          type="hidden"
                          ref={(input) => {
                            this.totalInput = input;
                          }}
                          id="_total"
                        />

                        <div className="form-group mb-2">
                          <div className="row align-items-center">
                            <div className="col-sm-6 col-lg-5">
                              <label htmlFor="invoice-date">
                                {t("myBusiness.invoice.invoice_date")}
                              </label>
                              business_info
                            </div>
                            <div className="col-sm-6 col-lg-7">
                              <div className="input-group">
                                <input
                                  className="form-control"
                                  type="text"
                                  id="invoice-date"
                                  name="invoice_date"
                                  value={this.state.date}
                                  readOnly="readOnly"
                                />
                                {/* <div className="input-group-append">
                                <div className="input-group-text">
                                  <i className="icon-calendar"></i>
                                </div>
                              </div> */}
                              </div>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.date_err === true
                                  ? "Date is required"
                                  : null}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* <div className="form-group mb-2">
                        <div className="row align-items-center">
                          <div className="col-sm-6 col-lg-5">
                            <label htmlFor="invoice-number">
                              {t("myBusiness.invoice.invoice_number")}
                            </label>
                          </div>
                          <div className="col-sm-6 col-lg-7">
                            <div className="input-group">
                              <input
                                type="number"
                                onChange={this.handleChange}
                                className="form-control"
                                id="invoice-number"
                                name="inv_no"
                                value={this.state.inv_no}
                              />
                            </div>
                            <p style={{ color: "#eb516d " }}>
                              {this.state.inv_no_err === true
                                ? "Invoice-number is required"
                                : null}
                            </p>
                          </div>
                        </div>
                      </div> */}
                        <div className="form-group mb-2">
                          <div className="row align-items-center">
                            <div className="col-sm-6 col-lg-5">
                              <label htmlFor="reference">
                                {t("myBusiness.invoice.reference")}
                              </label>
                            </div>
                            <div className="col-sm-6 col-lg-7">
                              <div className="input-group">
                                <input
                                  type="text"
                                  onChange={this.handleChange}
                                  className="form-control"
                                  id="reference"
                                  name="refer"
                                  value={this.state.refer}
                                />
                              </div>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.refer_err === true
                                  ? "Reference is required"
                                  : null}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="form-group mb-2">
                          <div className="row align-items-center">
                            <div className="col-sm-6 col-lg-5">
                              <label htmlFor="account-number">
                                {t("myBusiness.invoice.account_number")}
                              </label>
                            </div>
                            <div className="col-sm-6 col-lg-7">
                              <div className="input-group">
                                <input
                                  type="text"
                                  onChange={this.handleChange}
                                  id="account-number"
                                  name="acc_no"
                                  className="form-control"
                                  value={this.state.acc_no}
                                  min="0"
                                />
                              </div>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.acc_err === true
                                  ? "Account-number is required"
                                  : null}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="form-group mb-2">
                          <div className="row align-items-center">
                            <div className="col-sm-6 col-lg-5">
                              <label htmlFor="payment-term">
                                {t("myBusiness.invoice.payment_terms")}
                              </label>
                            </div>
                            <div className="col-sm-6 col-lg-7">
                              <div className="input-group">
                                <input
                                  type="text"
                                  onChange={this.handleChange}
                                  className="form-control"
                                  id="payment-term"
                                  name="pay_term"
                                  value={this.state.pay_term}
                                />
                              </div>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.pay_term_err === true
                                  ? "Payment-term is required"
                                  : null}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="form-group mb-2">
                          <div className="row align-items-center">
                            <div className="col-sm-6 col-lg-5">
                              <label htmlFor="due-date">
                                {t("myBusiness.invoice.due_date1")}
                              </label>
                            </div>
                            <div className="col-sm-6 col-lg-7">
                              <div className="input-group">
                                <Datetime
                                  onChange={(date) => this.handleDate1(date)}
                                  isValidDate={valid}
                                  id="due-date"
                                  locale={`${
                                    localStorage.getItem("_lng") === "fi"
                                      ? "fr-fi"
                                      : "en-US"
                                  } `}
                                  name="due_date"
                                  dateFormat="DD-MM-YYYY"
                                  inputProps={{ placeholder: "DD-MM-YYYY" }}
                                  timeFormat={false}
                                  value={this.state.due_date}
                                />
                                <div className="input-group-append calender-icon">
                                  <div className="input-group-text">
                                    <i className="icon-calendar"></i>
                                  </div>
                                </div>
                              </div>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.due_date_err === true
                                  ? "Due-date is required"
                                  : null}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="form-group mb-2">
                          <div className="row align-items-center">
                            <div className="col-sm-6 col-lg-5">
                              <label htmlFor="delay-interest">
                                {t("myBusiness.invoice.delay_interest")}
                              </label>
                            </div>
                            <div className="col-sm-6 col-lg-7">
                              <div className="input-group">
                                <input
                                  type="number"
                                  id="delay-interest"
                                  onChange={this.handleChange}
                                  className="form-control"
                                  name="delay_interest"
                                  value={this.state.delay_interest}
                                  min="0"
                                />
                              </div>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.delay_interest_err === true
                                  ? "Delay-interest is required"
                                  : null}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="form-group mb-2">
                          <div className="row align-items-center">
                            <div className="col-sm-6 col-lg-5">
                              <label htmlFor="address">
                                {t("myBusiness.invoice.clientAddress")}
                              </label>
                            </div>
                            <div className="col-sm-6 col-lg-7">
                              <div className="input-group">
                                <textarea
                                  type="text"
                                  id="address"
                                  onChange={this.handleChange}
                                  className="form-control"
                                  name="address"
                                  value={this.state.address}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="hr mg-30"></div>
                    <div style={{ maxWidth: "610px" }}>
                      <div className="form-group">
                        <div className="row align-items-center">
                          <div className="col-md-2">
                            <label>{t("myBusiness.invoice.bill_to")}</label>
                          </div>
                          {/* <Select
                            value={selectedOption}
                            onChange={this.handleAuto}
                            options={clients}
                          /> */}
                          {/* <div className="col-md-4">
                          <select
                            onChange={this.changeType}
                            className="form-control"
                          >
                            <option>--Select--</option>
                            <option value="user">user</option>
                            <option value="client">client</option>
                          </select>
                        </div> */}
                          {/* {this.state.tender_id} 0000 { this.state.value} // {this.state.userEmail} === {this.props.match.url} ././.. */}

                          {this.state.tender_id !== 0 ||
                          (this.state.userEmail &&
                            this.props.match.url != "/invoice") ||
                          (this.state.userEmail &&
                            this.props.match.url ==
                              `/invoice/${this.props.match.params.tender}/draft`) ||
                          this.props.match.url ==
                            `/invoice/${this.props.match.params.tender}` ? (
                            <div className="col-md-6">
                              <input
                                id="customer-info"
                                className="form-control"
                                type="text"
                                value={this.state.value}
                                readOnly={true}
                              />
                            </div>
                          ) : (
                            <div className="col-md-6">
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
                                readonly={true}
                              />

                              <label>
                                <a
                                  href="#"
                                  data-toggle="modal"
                                  data-target="#add-cus"
                                  onClick={() =>
                                    this.setState({
                                      isAddCustomerModalOpen: true,
                                    })
                                  }
                                >
                                  [+]
                                </a>
                                <label className="color_red">
                                  {this.state.errro_mess
                                    ? this.state.errro_mess
                                    : ""}{" "}
                                </label>
                                <a
                                  href="#"
                                  data-toggle="modal"
                                  data-target="#add-cus"
                                >
                                  {" "}
                                  <label className="color_red">
                                    {this.state.errro_mess ? (
                                      <>
                                        {" "}
                                        <span className="link_blue">
                                          {" "}
                                          {t("myBusiness.invoice.Add_New")}{" "}
                                        </span>{" "}
                                      </>
                                    ) : (
                                      ""
                                    )}{" "}
                                  </label>{" "}
                                </a>
                              </label>

                              <p style={{ color: "#eb516d " }}>
                                {this.state.err_value
                                  ? this.state.err_value
                                  : ""}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 offset-md-2">
                          <address>
                            <p>
                              {selectedOption ? selectedOption.name : null}
                              <br />
                              {selectedOption ? selectedOption.value : null}
                            </p>
                          </address>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="row align-items-center">
                          <div className="col-md-2">
                            <label> {t("myBusiness.invoice.CC")} </label>
                          </div>
                          <div className="col-md-6">
                            {this.state.emails?.map((item, i) => (
                              <div className="tag-item" key={i}>
                                {item}
                                <button
                                  type="button"
                                  className="button"
                                  onClick={() => this.handleDelete(item)}
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                            <Autosuggest
                              suggestions={suggestions2}
                              disable="disable"
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
                            {/* <input
                            id="mails"
                            type="text"
                            name="email"
                            value={this.state.email}
                            className="form-control"
                            placeholder="Type or paste email addresses and press `Enter`..."
                            onKeyDown={this.handleKeyDown}
                            onChange={this.handleChange2}
                            onPaste={this.handlePaste}
                          /> */}
                            {this.state.error && (
                              <p className="error">{this.state.error}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4"></div>

                    {width >= 250 && (
                      <>
                        <div className="filter mt-4 project-planning-tabs invoice-tabs">
                          <ul class="nav nav-tabs row">
                            <li
                              onClick={() => {
                                this.setState({ type: "Work" });
                                // this.reset();
                                this.loadNames();
                              }}
                              className={`${
                                this.state.type === "Work" ? "active" : ""
                              } col d-flex justify-content-center`}
                            >
                              <a
                                className={`${
                                  this.state.type === "Work" ? "active" : ""
                                } flex-grow-1 d-flex  align-items-center`}
                                data-toggle="tab"
                                href="#work"
                              >
                                {/* <div className="row"> */}
                                {/* <div className="col-lg-3 col-md-6"> */}
                                <div className="form-group mb-0">
                                  <div className="row align-items-center gutters-14 mb-0">
                                    <div className="col ">
                                      {/* <label className="mb-0" htmlFor="work_mat"> */}
                                      {t("myBusiness.invoice.work_mat")}
                                      {/* </label> */}
                                    </div>
                                  </div>
                                </div>
                                {/* </div> */}

                                {/* {this.props?.match?.url != "/invoice" &&
                                this.state.agreements?.length > 0 ? (
                                  <div className="col-lg-4 col-md-6">
                                    <div className="form-group">
                                      <div className="row align-items-center gutters-14">
                                        <div className="col-lg-2">
                                          <label
                                            className="mb-0"
                                            htmlFor="project"
                                          >
                                            <b>
                                              {t("myBusiness.invoice.project")}
                                            </b>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )} */}
                              </a>
                            </li>

                            <li
                              onClick={() => {
                                this.setState({ type: "Material" });
                                // this.reset();
                                this.loadNames();
                              }}
                              className={`${
                                this.state.type === "Material" ? "active" : ""
                              } col d-flex justify-content-center`}
                            >
                              <a
                                data-toggle="tab"
                                href="#material"
                                className={`${
                                  this.state.type === "Material" ? "active" : ""
                                } flex-grow-1 d-flex align-items-center`}
                              >
                                <div>Material</div>
                              </a>
                            </li>
                            <li
                              onClick={() => {
                                this.setState({ type: "Both" });
                                // this.reset();
                                this.loadNames();
                              }}
                              className={`${
                                this.state.type === "Both" ? "active" : ""
                              } col d-flex justify-content-center `}
                            >
                              <a
                                data-toggle="tab"
                                href="#work-material-both"
                                className={`${
                                  this.state.type === "Both" ? "active" : ""
                                } flex-grow-1 d-flex align-items-center`}
                              >
                                <div>Work and Material</div>
                              </a>
                            </li>
                          </ul>
                        </div>

                        <div
                          id="project-planning-table"
                          className="tab-content"
                        >
                          <div id="work" className="tab-pane active">
                            <div className="row project_plan">
                              <div className="col-sm-2">
                                <div className="form-group text-right">
                                  <label className="d-xl-none">&nbsp;</label>
                                  <div
                                    id="invoice-tamp-select"
                                    className="dropdown mt-2"
                                  >
                                    <select
                                      onChange={this.loadTemplate}
                                      className="btn btn-light dropdown-toggle"
                                    >
                                      <option value="">
                                        {t("myBusiness.offer.template")}
                                      </option>
                                      {this.state.allTamp.map((data, idx) => {
                                        return (
                                          <option value={data?.template_name}>
                                            {data?.template_name}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="table-responsive-lg scroller mt-3 mb-5 invoice-table">
                              <table className="table table-bordered table-sm">
                                <thead>
                                  <tr>
                                    <th className="close-icon-cell"></th>
                                    <th>{t("project_planning.items")}</th>
                                    <th style={{ display: "none" }}>
                                      {t("myBusiness.invoice.Date")}
                                    </th>
                                    <th>{t("myBusiness.offer.unit")}</th>
                                    <th> {t("myBusiness.offer.duration")}</th>
                                    <th> {t("myBusiness.offer.cost_hr")}</th>
                                    <th colSpan="2">
                                      {this.state.left}{" "}
                                      {t("myBusiness.offer.total_cost")}{" "}
                                      {this.state.right}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.row_phasework.map((r, index) => {
                                    subtotalWork += Number(r.amount);
                                    console.log(r, "rowprice");
                                    return (
                                      <RowWork
                                        t={t}
                                        val={r}
                                        key={index}
                                        idx={index}
                                        deleteRowWork={this.deleteRowWork}
                                        ChangeItemWork={this.ChangeItemWork}
                                        changeWorkArr={this.changeWorkArr}
                                        ChangeUnitWork={this.ChangeUnitWork}
                                        vatValueWork={Number(
                                          (subtotalWork *
                                            this.state.taxInputWork) /
                                            100
                                        ).toFixed(2)}
                                        TotalValueWork={Number(
                                          subtotalWork +
                                            (subtotalWork *
                                              this.state.taxInputWork) /
                                              100
                                        ).toFixed(2)}
                                        subTotalWork={
                                          subtotalWork
                                            ? subtotalWork
                                            : this.state.items_cost_subtotalWork
                                        }
                                        changeQuantityWork={
                                          this.changeQuantityWork
                                        }
                                        ChangePriceWork={this.ChangePriceWork}
                                      />
                                    );
                                  })}

                                  <tr className="text-left">
                                    <td colSpan="6">
                                      <button
                                        onClick={this.handleAppendWork}
                                        className="btn btn-link p-0"
                                      >
                                        {t("myBusiness.invoice.Add_row")}
                                      </button>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    {/* <td></td> */}
                                    <td className="p-0 border-0" colSpan="6">
                                      <table className="table table-bordered mt-0">
                                        <tbody>
                                          <tr className="text-right">
                                            <td>
                                              {this.state.left}{" "}
                                              {t("myBusiness.invoice.subtotal")}{" "}
                                              {this.state.right}
                                            </td>
                                            <td id="5result" colSpan="2">
                                              {/* {this.state.row_phase.length <= 0
                                                ? 0
                                                : this.state.sub_total} */}
                                              {subtotalWork
                                                ? subtotalWork
                                                : this.state
                                                    .items_cost_subtotalWork}

                                              {/* {Number(
                                                this.state
                                                  .items_cost_subtotalMat
                                              ).toFixed(2)}  */}
                                            </td>
                                          </tr>
                                          <tr className="text-right">
                                            <td>
                                              {" "}
                                              {t("myBusiness.invoice.VAT")}{" "}
                                            </td>
                                            <td
                                              className="material_tax1 text-left"
                                              suppressContentEditableWarning={
                                                true
                                              }
                                              contentEditable={false}
                                            >
                                              {/* {this.state.tax
                                                ? this.state.tax
                                                : "0"} */}
                                              <input
                                                defaultValue={
                                                  this.state.taxInputWork
                                                    ? this.state.taxInputWork
                                                    : null
                                                }
                                                type="number"
                                                placeholder="0"
                                                onChange={(e) =>
                                                  this.setState({
                                                    taxInputWork:
                                                      e.target.value,
                                                    items_cost_subtotalWork:
                                                      subtotalWork,
                                                  })
                                                }
                                              />
                                            </td>
                                            <td>
                                              {this.state.left}
                                              <span className="material_tax_res">
                                                {/* {this.state.tax_calc
                                                  ? this.state.tax_calc
                                                  : "0.00"} */}
                                                {Number(
                                                  (subtotalWork *
                                                    this.state.taxInputWork) /
                                                    100
                                                ).toFixed(2)}
                                              </span>
                                              {this.state.right}
                                            </td>
                                          </tr>
                                          <tr className="text-right">
                                            <td>
                                              <b>
                                                {this.state.left}{" "}
                                                {t("myBusiness.invoice.total")}{" "}
                                                {this.state.right}
                                              </b>
                                            </td>
                                            <td colSpan="2">
                                              <b>
                                                {this.state.left}
                                                <span className="material_total">
                                                  {" "}
                                                  {/* {this.state.total
                                                    ? this.state.total
                                                    : "0.00"} */}
                                                  {Number(
                                                    subtotalWork +
                                                      (subtotalWork *
                                                        this.state
                                                          .taxInputWork) /
                                                        100
                                                  ).toFixed(2)}
                                                  {/* {Number(
                                                    subtotalWork +
                                                      (subtotalWork *
                                                        this.state
                                                          .taxInputWork) /
                                                        100
                                                  ).toFixed(2)} */}
                                                </span>
                                                {this.state.right}
                                              </b>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            {/* <div> 
                                  <button onClick={() => this.reset()}
                                    className="btn btn-without-radius bg-grey mr-0"
                                  >
                                    reset
                                  </button> 
                                </div> */}
                          </div>

                          <div id="material" className="tab-pane fade">
                            {/* Material tab pane */}
                            <div className="row project_plan">
                              <div className="col-sm-2">
                                <div className="form-group text-right">
                                  <label className="d-xl-none">&nbsp;</label>
                                  <div
                                    id="invoice-tamp-select"
                                    className="dropdown mt-2"
                                  >
                                    <select
                                      onChange={this.loadTemplate}
                                      className="btn btn-light dropdown-toggle"
                                      id="invoice-tamp-select"
                                    >
                                      <option value="">
                                        {t("myBusiness.offer.template")}
                                      </option>
                                      {this.state.allTamp.map((data, idx) => {
                                        return (
                                          <option value={data?.template_name}>
                                            {data?.template_name}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="table-responsive-lg scroller mt-3 mb-5 invoice-table">
                              <table className="table table-bordered table-sm">
                                <thead>
                                  <tr>
                                    <th className="close-icon-cell"></th>
                                    <th>
                                      {" "}
                                      {t("myBusiness.template.MaterialItem")}
                                    </th>

                                    <th style={{ display: "none" }}>
                                      {t("myBusiness.invoice.Date")}
                                    </th>
                                    <th>{t("myBusiness.offer.unit")}</th>
                                    <th>{t("myBusiness.offer.duration")}</th>
                                    <th>{t("myBusiness.offer.cost_hr")}</th>
                                    <th colSpan="2">
                                      {this.state.left}{" "}
                                      {t("myBusiness.offer.total_cost")}{" "}
                                      {this.state.right}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.row_phase_material.map(
                                    (r, index) => {
                                      subtotalMat += Number(r.amount);
                                      console.log(subtotalMat, "total");
                                      // this.setState({
                                      //   items_cost_subtotalMat: subtotalMat,
                                      // });
                                      return (
                                        <MaterialRow
                                          t={t}
                                          val={r}
                                          key={index}
                                          idx={index}
                                          vatValueMat={Number(
                                            (subtotalMat *
                                              this.state.taxInputMat) /
                                              100
                                          ).toFixed(2)}
                                          TotalValueMat={Number(
                                            subtotalMat +
                                              (subtotalMat *
                                                this.state.taxInputMat) /
                                                100
                                          ).toFixed(2)}
                                          subTotalMat={
                                            subtotalMat
                                              ? subtotalMat
                                              : this.state
                                                  .items_cost_subtotalMat
                                          }
                                          deleteRowMaterial={
                                            this.deleteRowMaterial
                                          }
                                          ChangeItem={this.ChangeItem}
                                          changeMatArr={this.changeMatArr}
                                          ChangeUnit={this.ChangeUnit}
                                          changeQuantity={this.changeQuantity}
                                          ChangePriceMat={this.ChangePriceMat}
                                          // calcSubtotal={this.calcSubtotal}
                                        />
                                      );
                                    }
                                  )}

                                  <tr className="text-left">
                                    <td colSpan="6">
                                      <button
                                        // onClick={this.handleAppend}
                                        onClick={this.handleAppendMaterial}
                                        className="btn btn-link p-0"
                                      >
                                        {t("myBusiness.invoice.Add_row")}
                                      </button>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                  </tr>

                                  <tr>
                                    {/* <td></td> */}
                                    <td className="p-0 border-0" colSpan="6">
                                      <table className="table table-bordered mt-0">
                                        <tbody>
                                          <tr className="text-right">
                                            <td>
                                              {this.state.left}{" "}
                                              {t("myBusiness.invoice.subtotal")}{" "}
                                              {this.state.right}
                                            </td>
                                            <td id="5result" colSpan="2">
                                              {/* {this.state.row_phase.length <= 0
                                                ? 0
                                                : this.state.sub_total} */}
                                              {subtotalMat
                                                ? subtotalMat
                                                : this.state
                                                    .items_cost_subtotalMat}

                                              {/* {Number(
                                                this.state
                                                  .items_cost_subtotalMat
                                              ).toFixed(2)}  */}
                                            </td>
                                          </tr>
                                          <tr className="text-right">
                                            <td>
                                              {" "}
                                              {t("myBusiness.invoice.VAT")}{" "}
                                            </td>
                                            <td
                                              className="material_tax1 text-left"
                                              suppressContentEditableWarning={
                                                true
                                              }
                                              contentEditable={false}
                                            >
                                              {/* {this.state.tax
                                                ? this.state.tax
                                                : "0"} */}
                                              <input
                                                defaultValue={
                                                  this.state.taxInputMat
                                                    ? this.state.taxInputMat
                                                    : null
                                                }
                                                type="number"
                                                placeholder="0"
                                                onChange={(e) =>
                                                  this.setState({
                                                    taxInputMat: e.target.value,
                                                    items_cost_subtotalMat:
                                                      subTotalMat,
                                                  })
                                                }
                                              />
                                            </td>
                                            <td>
                                              {this.state.left}
                                              <span className="material_tax_res">
                                                {/* {this.state.tax_calc
                                                  ? this.state.tax_calc
                                                  : "0.00"} */}
                                                {Number(
                                                  (subtotalMat *
                                                    this.state.taxInputMat) /
                                                    100
                                                ).toFixed(2)}

                                                {/* {Number(
                                                  (subtotalMat *
                                                    this.state.taxInputMat) /
                                                    100
                                                ).toFixed(2)} */}
                                              </span>
                                              {this.state.right}
                                            </td>
                                          </tr>
                                          <tr className="text-right">
                                            <td>
                                              <b>
                                                {this.state.left}{" "}
                                                {t("myBusiness.invoice.total")}{" "}
                                                {this.state.right}
                                              </b>
                                            </td>
                                            <td colSpan="2">
                                              <b>
                                                {this.state.left}
                                                <span className="material_total">
                                                  {" "}
                                                  {/* {this.state.total
                                                    ? this.state.total
                                                    : "0.00"} */}
                                                  {Number(
                                                    subtotalMat +
                                                      (subtotalMat *
                                                        this.state
                                                          .taxInputMat) /
                                                        100
                                                  ).toFixed(2)}
                                                  {/* {Number(
                                                    subtotalMat +
                                                      (subtotalMat *
                                                        this.state
                                                          .taxInputMat) /
                                                        100
                                                  ).toFixed(2)} */}
                                                </span>
                                                {this.state.right}
                                              </b>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            {/* <div> 
                              <button onClick={() => this.reset()}
                              className="btn btn-without-radius bg-grey mr-0"
                              >
                              reset
                              </button> 
                              </div> */}
                          </div>
                          <div
                            id="work-material-both"
                            className="tab-pane fade"
                          >
                            <div className="row project_plan">
                              <div className="col-sm-2">
                                <div className="form-group text-right">
                                  <label className="d-xl-none">&nbsp;</label>
                                  <div
                                    id="invoice-tamp-select"
                                    className="dropdown mt-2"
                                  >
                                    <select
                                      onChange={this.loadTemplate}
                                      className="btn btn-light dropdown-toggle"
                                    >
                                      <option value="">
                                        {t("myBusiness.offer.template")}
                                      </option>
                                      {this.state.allTamp.map((data, idx) => {
                                        return (
                                          <option value={data?.template_name}>
                                            {data?.template_name}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Work and material */}
                            {/* work and material 1st */}
                            <div className="table-responsive-lg scroller mt-3 mb-5 invoice-table">
                              <table className="table table-bordered table-sm">
                                <thead>
                                  <tr>
                                    <th className="text-left close-icon-cell"></th>
                                    <th className="text-left">
                                      {t("project_planning.items")}
                                    </th>
                                    <th style={{ display: "none" }}>
                                      {t("myBusiness.invoice.Date")}
                                    </th>
                                    <th>{t("myBusiness.offer.unit")}</th>
                                    <th>{t("myBusiness.offer.duration")}</th>
                                    <th>{t("myBusiness.offer.cost_hr")}</th>
                                    <th colSpan="2">
                                      {this.state.left}{" "}
                                      {t("myBusiness.offer.total_cost")}{" "}
                                      {this.state.right}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.row_phaseWork2 &&
                                    this.state.row_phaseWork2.map(
                                      (r, index) => {
                                        subtotalWork2 += Number(r.amount);
                                        return (
                                          <WorkMat
                                            t={t}
                                            val={r}
                                            key={index}
                                            idx={index}
                                            vatValueWorkMat={Number(
                                              (subtotalWork2 *
                                                this.state.taxInputWork2) /
                                                100
                                            ).toFixed(2)}
                                            subTotalWorkMat={
                                              subtotalWork2
                                                ? subtotalWork2
                                                : this.state
                                                    .items_cost_subtotalWork2
                                            }
                                            TotalValueWorkMat={Number(
                                              subtotalWork2 +
                                                (subtotalWork2 *
                                                  this.state.taxInputWork2) /
                                                  100
                                            ).toFixed(2)}
                                            deleteRowWork2={this.deleteRowWork2}
                                            ChangeItemWork2={
                                              this.ChangeItemWork2
                                            }
                                            changeWork2Arr={this.changeWork2Arr}
                                            ChangeUnitwork2={
                                              this.ChangeUnitwork2
                                            }
                                            changeQuantityWork2={
                                              this.changeQuantityWork2
                                            }
                                            ChangePriceWork2={
                                              this.ChangePriceWork2
                                            }
                                          />
                                        );
                                      }
                                    )}

                                  <tr className="text-left">
                                    <td colSpan="6">
                                      <button
                                        onClick={this.handleAppendWork2}
                                        className="btn btn-link p-0"
                                      >
                                        {t("myBusiness.invoice.Add_row")}
                                      </button>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    {/* <td></td> */}
                                    <td className="p-0 border-0" colSpan="6">
                                      <table className="table table-bordered mt-0">
                                        <tbody>
                                          <tr className="text-right">
                                            <td>
                                              {this.state.left}{" "}
                                              {t("myBusiness.invoice.subtotal")}{" "}
                                              {this.state.right}
                                            </td>
                                            <td id="5result" colSpan="2">
                                              {/* {this.state.row_phase.length <= 0
                                                ? 0
                                                : this.state.sub_total} */}
                                              {subtotalWork2
                                                ? subtotalWork2
                                                : this.state
                                                    .items_cost_subtotalWork2}

                                              {/* {Number(
                                                this.state
                                                  .items_cost_subtotalMat
                                              ).toFixed(2)}  */}
                                            </td>
                                          </tr>
                                          <tr className="text-right">
                                            <td>
                                              {" "}
                                              {t("myBusiness.invoice.VAT")}{" "}
                                            </td>
                                            <td
                                              className="material_tax1 text-left"
                                              suppressContentEditableWarning={
                                                true
                                              }
                                              contentEditable={false}
                                            >
                                              {/* {this.state.tax
                                                ? this.state.tax
                                                : "0"} */}
                                              <input
                                                defaultValue={
                                                  this.state.taxInputWork2
                                                    ? this.state.taxInputWork2
                                                    : null
                                                }
                                                type="number"
                                                placeholder="0"
                                                onChange={(e) =>
                                                  this.setState({
                                                    taxInputWork2:
                                                      e.target.value,
                                                    items_cost_subtotalWork2:
                                                      subtotalWork2,
                                                  })
                                                }
                                              />
                                            </td>
                                            <td>
                                              {this.state.left}
                                              <span className="material_tax_res">
                                                {/* {this.state.tax_calc
                                                  ? this.state.tax_calc
                                                  : "0.00"} */}
                                                {Number(
                                                  (subtotalWork2 *
                                                    this.state.taxInputWork2) /
                                                    100
                                                ).toFixed(2)}

                                                {/* {Number(
                                                  (subtotalWork2 *
                                                    this.state.taxInputWork2) /
                                                    100
                                                ).toFixed(2)} */}
                                              </span>
                                              {this.state.right}
                                            </td>
                                          </tr>
                                          <tr className="text-right">
                                            <td>
                                              <b>
                                                {this.state.left}{" "}
                                                {t("myBusiness.invoice.total")}{" "}
                                                {this.state.right}
                                              </b>
                                            </td>
                                            <td colSpan="2">
                                              <b>
                                                {this.state.left}
                                                <span className="material_total">
                                                  {" "}
                                                  {/* {this.state.total
                                                    ? this.state.total
                                                    : "0.00"} */}
                                                  {Number(
                                                    subtotalWork2 +
                                                      (subtotalWork2 *
                                                        this.state
                                                          .taxInputWork2) /
                                                        100
                                                  ).toFixed(2)}
                                                  {/* {Number(
                                                    subtotalWork2 +
                                                      (subtotalWork2 *
                                                        this.state
                                                          .taxInputWork2) /
                                                        100
                                                  ).toFixed(2)} */}
                                                </span>
                                                {this.state.right}
                                              </b>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            {/* work and material 2nd */}
                            <div className="table-responsive-lg scroller mt-3 mb-5 invoice-table">
                              <table className="table table-bordered table-sm">
                                <thead>
                                  <tr>
                                    <th className="text-left close-icon-cell"></th>
                                    <th className="text-left">
                                      {t("myBusiness.template.MaterialItem")}
                                    </th>
                                    <th style={{ display: "none" }}>
                                      {t("myBusiness.invoice.Date")}
                                    </th>
                                    <th>{t("myBusiness.offer.unit")}</th>
                                    <th>{t("myBusiness.offer.duration")}</th>
                                    <th>{t("myBusiness.offer.cost_hr")}</th>
                                    <th colSpan="2">
                                      {this.state.left}{" "}
                                      {t("myBusiness.offer.total_cost")}{" "}
                                      {this.state.right}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.row_phase_workmat &&
                                    this.state.row_phase_workmat.map(
                                      (r, index) => {
                                        subtotalMatWork += Number(r.amount);

                                        return (
                                          <MaterialWorkmat
                                            t={t}
                                            val={r}
                                            key={index}
                                            idx={index}
                                            TotalValueMaterialWork={Number(
                                              subtotalMatWork +
                                                (subtotalMatWork *
                                                  this.state.taxInputWorkmat) /
                                                  100
                                            ).toFixed(2)}
                                            vatValueMaterialWork={Number(
                                              (subtotalMatWork *
                                                this.state.taxInputWorkmat) /
                                                100
                                            ).toFixed(2)}
                                            subTotalMaterialWork={
                                              subtotalMatWork
                                                ? subtotalMatWork
                                                : this.state
                                                    .items_cost_subtotalWorkmat
                                            }
                                            deleteRowWorkmat={
                                              this.deleteRowWorkmat
                                            }
                                            ChangeItemWorkmat={
                                              this.ChangeItemWorkmat
                                            }
                                            changeWorkmatArr={
                                              this.changeWorkmatArr
                                            }
                                            ChangeUnitworkmat={
                                              this.ChangeUnitworkmat
                                            }
                                            changeQuantityWorkMat={
                                              this.changeQuantityWorkMat
                                            }
                                            ChangePriceWorkmat={
                                              this.ChangePriceWorkmat
                                            }
                                          />
                                        );
                                      }
                                    )}

                                  <tr className="text-left">
                                    <td colSpan="6">
                                      <button
                                        onClick={this.handleAppendWorkmat}
                                        className="btn btn-link p-0"
                                      >
                                        {t("myBusiness.invoice.Add_row")}
                                      </button>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                    <td className="border-0">&nbsp;</td>
                                  </tr>

                                  <tr>
                                    <td className="p-0 border-0" colSpan="6">
                                      <table className="table table-bordered mt-0">
                                        <tbody>
                                          <tr className="text-right">
                                            <td>
                                              {this.state.left}{" "}
                                              {t("myBusiness.invoice.subtotal")}{" "}
                                              {this.state.right}
                                            </td>
                                            <td id="5result" colSpan="2">
                                              {subtotalMatWork
                                                ? subtotalMatWork
                                                : this.state
                                                    .items_cost_subtotalWorkmat}
                                            </td>
                                          </tr>
                                          <tr className="text-right">
                                            <td>
                                              {" "}
                                              {t("myBusiness.invoice.VAT")}{" "}
                                            </td>
                                            <td
                                              className="material_tax1 text-left"
                                              suppressContentEditableWarning={
                                                true
                                              }
                                              contentEditable={false}
                                            >
                                              <input
                                                defaultValue={
                                                  this.state.taxInputWorkmat
                                                    ? this.state.taxInputWorkmat
                                                    : null
                                                }
                                                type="number"
                                                placeholder="0"
                                                onChange={(e) =>
                                                  this.setState({
                                                    taxInputWorkmat:
                                                      e.target.value,
                                                    items_cost_subtotalWorkmat:
                                                      subtotalMatWork,
                                                  })
                                                }
                                              />
                                            </td>
                                            <td>
                                              {this.state.left}
                                              <span className="material_tax_res">
                                                {Number(
                                                  (subtotalMatWork *
                                                    this.state
                                                      .taxInputWorkmat) /
                                                    100
                                                ).toFixed(2)}

                                                {/* {Number(
                                                  (subtotalMatWork *
                                                    this.state
                                                      .taxInputWorkmat) /
                                                    100
                                                ).toFixed(2)} */}
                                              </span>
                                              {this.state.right}
                                            </td>
                                          </tr>
                                          <tr className="text-right">
                                            <td>
                                              <b>
                                                {this.state.left}{" "}
                                                {t("myBusiness.invoice.total")}{" "}
                                                {this.state.right}
                                              </b>
                                            </td>
                                            <td colSpan="2">
                                              <b>
                                                {this.state.left}
                                                <span className="material_total">
                                                  {" "}
                                                  {Number(
                                                    subtotalMatWork +
                                                      (subtotalMatWork *
                                                        this.state
                                                          .taxInputWorkmat) /
                                                        100
                                                  ).toFixed(2)}
                                                  {/* {Number(
                                                    subtotalMatWork +
                                                      (subtotalMatWork *
                                                        this.state
                                                          .taxInputWorkmat) /
                                                        100
                                                  ).toFixed(2)} */}
                                                </span>
                                                {this.state.right}
                                              </b>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {/* {width < 768 && (
                      <div className="project-planning-tabs invoice-responsive-design">
                        <ProjectPlanMobile />
                      </div>
                    )} */}

                    {/* <div className="row">
                      <div className="col"> */}
                    <div className="col-xl-9 col-lg-10">
                      <div className="form-group">
                        {/* <div className="form-group d-inline-block">
                          <div className="file-select attachment">
                            <input
                              onChange={this.handleAttachment}
                              type="file"
                              id="file"
                            />
                            <label htmlFor="file">
                              <i className="icon-attachment"></i>
                              <span
                                className="filename font-weight-bold"
                                data-text="Attach File"
                              >
                                {t("myBusiness.invoice.attach_file")}
                              </span>
                              <span
                                onClick={this.handleAttachmentRemove}
                                className="clear"
                              >
                                +
                            </span>
                            </label>
                          </div>
                        </div> */}
                        <div className="row attachment-file">
                          <div className="col-lg-11 file-select attachment padding0">
                            <Files
                              className="files-dropzone"
                              onChange={(e) => this.onFilesChange(e)}
                              onError={(e) => this.onFilesError(e)}
                              accepts={[
                                "image/gif",
                                "image/pdf",
                                ".PDF",
                                "image/jpeg",
                                "image/png",
                                "image/jpg",
                                ".svg",
                                ".docx",
                                ".doc",
                              ]}
                              multiple={false}
                              maxFileSize={3197152}
                              minFileSize={10}
                              clickable
                            >
                              <label>
                                <i className="icon-attachment"></i>
                                <span
                                  className="filename font-weight-bold"
                                  data-text="Attach File"
                                >
                                  {this.state.img_name
                                    ? this.state.img_name
                                    : t(
                                        "myBusiness.invoice.Upload_attachments"
                                      )}
                                  {/* {t("myproposal.Upload_attachments")} */}
                                </span>
                              </label>
                            </Files>
                          </div>

                          <div className="col-lg-1 attachme">
                            <span
                              onClick={this.handleAttachmentRemove}
                              className="clears"
                            >
                              &Chi;
                            </span>
                          </div>
                        </div>
                        {this.state.agreements_name ? (
                          <label htmlFor="attachments">
                            <a
                              href={
                                url +
                                "/images/marketplace/proposal/" +
                                this.state.agreements_name
                              }
                              target="_blank"
                              className="attachment"
                            >
                              <i className="icon-paperclip"></i>
                              {this.state.agreements_name
                                ? this.state.agreements_name
                                : ""}
                            </a>
                          </label>
                        ) : (
                          ""
                        )}
                        <p style={{ color: "#eb516d", fontSize: "15px" }}>
                          {this.state.file_err ? this.state.file_err : ""}{" "}
                        </p>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md">
                        <div className="form-group">
                          <label htmlFor="note">
                            {t("myBusiness.invoice.note_to_recipient")}
                          </label>
                          <textarea
                            name="note"
                            value={this.state.note}
                            onChange={this.handleChange}
                            id="note"
                            className="form-control"
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-md offset-md-1">
                        <div className="form-group">
                          <label htmlFor="terms">
                            {t("myBusiness.invoice.terms_and_conditions")}
                          </label>
                          <textarea
                            id="terms"
                            name="terms"
                            onChange={this.handleChange}
                            className="form-control"
                            value={this.state.terms}
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div className="row mt-4">
                      <div className="col text-right">
                        <button
                          onClick={this.hiddenFields}
                          className="btn btn-primary ml-3 mb-3 clk3"
                          data-toggle="modal"
                          data-target="#preview-info"
                        >
                          {t("myBusiness.invoice.Preview")}
                        </button>

                        {/* {loading1 ? (
                          loading1
                          ) : ( */}
                        <button
                          onClick={this.handleDraft}
                          className="btn btn-gray ml-3 mb-3 clk3"
                        >
                          {loading1 ? loading1 : ""}{" "}
                          {t("myBusiness.invoice.Save_as_Draft")}
                        </button>
                        {/* )} */}

                        {/* {loading ? (
                          loading
                        ) : ( */}
                        <button
                          onClick={this.handleSubmit}
                          className="btn btn-primary ml-3 mb-3 clk3"
                        >
                          {loading ? loading : ""}{" "}
                          {t("myBusiness.invoice.Send")}
                        </button>
                        {/* )} */}
                      </div>
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
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
              <PDFViewInvoice
                TotalValueWork={TotalValueWork}
                TotalValueMat={TotalValueMat}
                TotalValueWorkMat={TotalValueWorkMat}
                TotalValueMaterialWork={TotalValueMaterialWork}
                vatValueWork={vatValueWork}
                subTotalMat={subTotalMat}
                vatValueMat={vatValueMat}
                vatValueWorkMat={vatValueWorkMat}
                vatValueMaterialWork={vatValueMaterialWork}
                subTotalWork={subTotalWork}
                subTotalWorkMat={subTotalWorkMat}
                subTotalMaterialWork={subTotalMaterialWork}
                businessInfo={this.state.business_info}
                userInfo={userInfo}
                show={this.state.isModalPreviewModal}
                handleClose={() =>
                  this.setState({ isModalPreviewModal: false })
                }
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
let vatValueWork = 0;
let vatValueMat = 0;
let vatValueWorkMat = 0;
let vatValueMaterialWork = 0;
let TotalValueWork = 0;
let TotalValueMat = 0;
let TotalValueWorkMat = 0;
let TotalValueMaterialWork = 0;
let subTotalWork = 0;
let subTotalMat = 0;
let subTotalWorkMat = 0;
let subTotalMaterialWork = 0;

const RowWork = (props) => {
  console.log("===========props==============", props.vatValueWork);
  vatValueWork = props.vatValueWork;
  TotalValueWork = props.TotalValueWork;
  subTotalWork = props.subTotalWork;
  return (
    <tr className="text-right i-val customerIDCell">
      <td
        className="remove-row1"
        onClick={(e) => props.deleteRowWork(props.idx)}
        id="myRemove"
      >
        ×
      </td>
      <td
        suppressContentEditableWarning={true}
        className="text-left"
        contentEditable="true"
      >
        {/* {props.val?.items} {props.val?.des} */}
        {/* {console.log(props.val?.des, ">>>>>>>>>>>>>>")} */}
        <input
          onChange={(e) => props.ChangeItemWork({ e: e, idx: props.idx })}
          defaultValue={props.val.items ? props.val.items : null}
        />
      </td>

      {/* date */}
      <td
      // style={{ display: "none" }}
      // className="duration1"
      // suppressContentEditableWarning={true}
      // contentEditable="true"
      >
        {/* {props.val.qty ? props.val.qty : props.val.qty} */}
        <select
          onChange={(e) => props.ChangeUnitWork({ e: e, idx: props.idx })}
          class="form-control"
          value={props.val.unit}
        >
          <option value="">{props.t("myBusiness.template.select")}</option>
          <option value="Hrs">{props.t("myBusiness.template.HRS")}</option>
          <option value="Lts">{props.t("myBusiness.template.LTS")}</option>
          <option value="Pcs">{props.t("myBusiness.template.PCS")}</option>
          <option value="Kg">{props.t("myBusiness.template.KG")}</option>
        </select>
      </td>

      {/* date */}
      <td
      // style={{ display: "none" }}
      // // className="duration1"
      // suppressContentEditableWarning={true}
      // contentEditable="true"
      >
        {/* {props.val.qty ? props.val.qty : props.val.qty} */}

        <input
          type={"number"}
          onChange={(e) => props.changeQuantityWork({ e: e, idx: props.idx })}
          defaultValue={props.val.qty ? props.val.qty : null}
          placeholder="0"
        />
      </td>

      {/* hrs */}
      <td
        suppressContentEditableWarning={true}
        className="material_duration1"
        contentEditable="false"
      >
        {/* {props.val.price ? props.val.price : props.val.price} */}
        <input
          type={"number"}
          onChange={(e) => props.ChangePriceWork({ e: e, idx: props.idx })}
          // onBlur={() => props.changeWorkArr()}
          defaultValue={props.val.price ? props.val.price : null}
          placeholder="0"
        />
      </td>

      {/* <td
        className="material_cost_hr1"
        suppressContentEditableWarning={true}
        contentEditable="true"
      >
        {props.val.unit ? props.val.unit : props.val.unit}
      </td> */}
      <td className="material_mat_cost1" colSpan="2">
        {props.val.amount}
      </td>
    </tr>
  );
};

// test material

const MaterialRow = (props) => {
  // //console.log("===========props==============", props)
  vatValueMat = props.vatValueMat;
  TotalValueMat = props.TotalValueMat;
  subTotalMat = props.subTotalMat;
  return (
    <tr className="text-right i-val customerIDCell">
      <td
        className="remove-row1"
        onClick={(e) => props.deleteRowMaterial(props.idx)}
        id="myRemove"
      >
        ×
      </td>
      <td
        suppressContentEditableWarning={true}
        className="text-left"
        contentEditable="true"
      >
        {/* {props.val?.items} {props.val?.des} */}
        {/* {console.log(props.val?.des, ">>>>>>>>>>>>>>")} */}
        <input
          onChange={(e) => props.ChangeItem({ e: e, idx: props.idx })}
          defaultValue={props.val.items ? props.val.items : null}
        />
      </td>

      {/* date */}
      <td
      // style={{ display: "none" }}
      // className="duration1"
      // suppressContentEditableWarning={true}
      // contentEditable="true"
      >
        {/* {props.val.qty ? props.val.qty : props.val.qty} */}
        <select
          onChange={(e) => props.ChangeUnit({ e: e, idx: props.idx })}
          class="form-control"
          value={props.val.unit}
        >
          <option value="">{props.t("myBusiness.template.select")}</option>
          <option value="Hrs">{props.t("myBusiness.template.HRS")}</option>
          <option value="Lts">{props.t("myBusiness.template.LTS")}</option>
          <option value="Pcs">{props.t("myBusiness.template.PCS")}</option>
          <option value="Kg">{props.t("myBusiness.template.KG")}</option>
        </select>
      </td>

      {/* date */}
      <td
      // style={{ display: "none" }}
      // // className="duration1"
      // suppressContentEditableWarning={true}
      // contentEditable="true"
      >
        {/* {props.val.qty ? props.val.qty : props.val.qty} */}

        <input
          type={"number"}
          onChange={(e) => props.changeQuantity({ e: e, idx: props.idx })}
          defaultValue={props.val.qty ? props.val.qty : null}
          placeholder="0"
        />
      </td>

      {/* hrs */}
      <td
        suppressContentEditableWarning={true}
        className="material_duration1"
        contentEditable="false"
      >
        {/* {props.val.price ? props.val.price : props.val.price} */}
        <input
          type={"number"}
          onChange={(e) => props.ChangePriceMat({ e: e, idx: props.idx })}
          // onBlur={() => props.changeWorkArr()}
          defaultValue={props.val.price ? props.val.price : null}
          placeholder="0"
        />
      </td>

      {/* <td
        className="material_cost_hr1"
        suppressContentEditableWarning={true}
        contentEditable="true"
      >
        {props.val.unit ? props.val.unit : props.val.unit}
      </td> */}
      <td className="material_mat_cost1" colSpan="2">
        {props.val.amount}
      </td>
    </tr>
  );
};
const WorkMat = (props) => {
  vatValueWorkMat = props.vatValueWorkMat;
  TotalValueWorkMat = props.TotalValueWorkMat;
  subTotalWorkMat = props.subTotalWorkMat;
  return (
    <tr className="text-right i-val customerIDCell">
      <td
        className="remove-row1"
        onClick={(e) => props.deleteRowWork2(props.idx)}
        id="myRemove"
      >
        ×
      </td>
      <td
        suppressContentEditableWarning={true}
        className="text-left"
        contentEditable="true"
      >
        {/* {props.val?.items} {props.val?.des} */}
        {/* {console.log(props.val?.des, ">>>>>>>>>>>>>>")} */}
        <input
          onChange={(e) => props.ChangeItemWork2({ e: e, idx: props.idx })}
          defaultValue={props.val.items ? props.val.items : null}
        />
      </td>

      {/* date */}
      <td
      // style={{ display: "none" }}
      // className="duration1"
      // suppressContentEditableWarning={true}
      // contentEditable="true"
      >
        {/* {props.val.qty ? props.val.qty : props.val.qty} */}
        <select
          onChange={(e) => props.ChangeUnitwork2({ e: e, idx: props.idx })}
          class="form-control"
          value={props.val.unit}
        >
          <option value="">{props.t("myBusiness.template.select")}</option>
          <option value="Hrs">{props.t("myBusiness.template.HRS")}</option>
          <option value="Lts">{props.t("myBusiness.template.LTS")}</option>
          <option value="Pcs">{props.t("myBusiness.template.PCS")}</option>
          <option value="Kg">{props.t("myBusiness.template.KG")}</option>
        </select>
      </td>

      {/* date */}
      <td
      // style={{ display: "none" }}
      // // className="duration1"
      // suppressContentEditableWarning={true}
      // contentEditable="true"
      >
        {/* {props.val.qty ? props.val.qty : props.val.qty} */}

        <input
          type={"number"}
          onChange={(e) => props.changeQuantityWork2({ e: e, idx: props.idx })}
          defaultValue={props.val.qty ? props.val.qty : null}
          placeholder="0"
        />
      </td>

      {/* hrs */}
      <td
        suppressContentEditableWarning={true}
        className="material_duration1"
        contentEditable="false"
      >
        {/* {props.val.price ? props.val.price : props.val.price} */}
        <input
          type={"number"}
          onChange={(e) => props.ChangePriceWork2({ e: e, idx: props.idx })}
          // onBlur={() => props.changeWorkArr()}
          defaultValue={props.val.price ? props.val.price : null}
          placeholder="0"
        />
      </td>

      {/* <td
        className="material_cost_hr1"
        suppressContentEditableWarning={true}
        contentEditable="true"
      >
        {props.val.unit ? props.val.unit : props.val.unit}
      </td> */}
      <td className="material_mat_cost1" colSpan="2">
        {props.val.amount}
      </td>
    </tr>
  );
};
const MaterialWorkmat = (props) => {
  vatValueMaterialWork = props.vatValueMaterialWork;
  TotalValueMaterialWork = props.TotalValueMaterialWork;
  subTotalMaterialWork = props.subTotalMaterialWork;
  return (
    <>
      <tr className="text-right i-val customerIDCell">
        <td
          className="remove-row1"
          onClick={(e) => props.deleteRowWorkmat(props.idx)}
          id="myRemove"
        >
          ×
        </td>
        <td
          suppressContentEditableWarning={true}
          className="text-left"
          contentEditable="true"
        >
          {/* {props.val?.items} {props.val?.des} */}
          {/* {console.log(props.val?.des, ">>>>>>>>>>>>>>")} */}
          <input
            onChange={(e) => props.ChangeItemWorkmat({ e: e, idx: props.idx })}
            defaultValue={props.val.items ? props.val.items : null}
          />
        </td>

        {/* date */}
        <td
        // style={{ display: "none" }}
        // className="duration1"
        // suppressContentEditableWarning={true}
        // contentEditable="true"
        >
          {/* {props.val.qty ? props.val.qty : props.val.qty} */}
          <select
            onChange={(e) => props.ChangeUnitworkmat({ e: e, idx: props.idx })}
            class="form-control"
            value={props.val.unit}
          >
            <option value="">{props.t("myBusiness.template.select")}</option>
            <option value="Hrs">{props.t("myBusiness.template.HRS")}</option>
            <option value="Lts">{props.t("myBusiness.template.LTS")}</option>
            <option value="Pcs">{props.t("myBusiness.template.PCS")}</option>
            <option value="Kg">{props.t("myBusiness.template.KG")}</option>
          </select>
        </td>

        {/* date */}
        <td
        // style={{ display: "none" }}
        // // className="duration1"
        // suppressContentEditableWarning={true}
        // contentEditable="true"
        >
          {/* {props.val.qty ? props.val.qty : props.val.qty} */}

          <input
            type={"number"}
            onChange={(e) =>
              props.changeQuantityWorkMat({ e: e, idx: props.idx })
            }
            defaultValue={props.val.qty ? props.val.qty : null}
            placeholder="0"
          />
        </td>

        {/* hrs */}
        <td
          suppressContentEditableWarning={true}
          className="material_duration1"
          contentEditable="false"
        >
          {/* {props.val.price ? props.val.price : props.val.price} */}
          <input
            type={"number"}
            onChange={(e) => props.ChangePriceWorkmat({ e: e, idx: props.idx })}
            // onBlur={() => props.changeWorkArr()}
            defaultValue={props.val.price ? props.val.price : null}
            placeholder="0"
          />
        </td>

        {/* <td
        className="material_cost_hr1"
        suppressContentEditableWarning={true}
        contentEditable="true"
      >
        {props.val.unit ? props.val.unit : props.val.unit}
      </td> */}
        <td className="material_mat_cost1" colSpan="2">
          {props.val.amount}
        </td>
      </tr>
    </>
  );
};
// des: e.target.value,
// amount: 0,
// qty: 0,
// price: 0,

export default withTranslation()(Invoice);
