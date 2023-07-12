import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Spinner from "react-bootstrap/Spinner";
import moment from "moment";
import { Helper, url } from "../../../helper/helper";
import axios from "axios";
import { withTranslation } from "react-i18next";
import Decline from "../listingdetails/Modals/Decline";
import Pagination from '../../myBussiness/pagination/pagination';

class Activebirds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentPage: 1,
      postsPerPage: 10,
      showDeclineModal: false
    }
  }

  getdate(date) {
    let now = moment();
    const { t, i18n } = this.props;
    var result = now.diff(date, 'days');
    return <div> {result} {t("mybid.days")}  </div>;
  }


  handleStatus = async (id, status) => {
    this.setState({ loaded: false });
    const token = await localStorage.getItem("token");
    const response = await axios.post(
      `${url}/api/contracts/status/${id}/${status}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200 && status === 3) {
      this.props.onClick();
      this.setState({ proposal_submitted: true });
    }

    // this.loadNotif(this.axiosCancelSource);
  };
  paginate = (number) => {
    this.setState({
      currentPage: number
    })
  }

  handleChange = (e) => {
    this.setState({
      postsPerPage: e.target.value
    })
  }

  getId = (userid, id) => {
    this.setState({
      u_id: userid,
      ID: id,
      showDeclineModal: !this.state.showDeclineModal
    })
  }

  render() {
    const birds = this.props.data;
    const { t, i18n } = this.props;
    const Accept = birds?.filter(item => item.tb_status == 0)

    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const currentPosts = Accept?.slice(indexOfFirstPost, indexOfLastPost);
    const length = Accept ? Accept.length : "";


    return (
      <div className="card">
        {currentPosts?.length > 0 ? (
          <>
            {currentPosts.map((data, index) => (

              <div className="card-body" key={index} style={{ borderBottom: "1px solid lightgray" }}>
                <div className="row">
                  <div className="col-sm-4">

                    <Link
                      to={{
                        pathname: `/Biddetails/${data.tb_id}`,
                        state: {
                          data: birds
                        }
                      }}
                    >  {data.tender_title}
                    </Link>

                    <div className="row custom_days">
                      <div className="col-sm-3">
                        {this.getdate(data.created_at)}
                      </div>

                      <div className="col-sm-3">
                        {data.tender_category_type === "Material" ? t("mybid.Material") : data.tender_category_type === "Work" ? t("mybid.work") : ""}
                      </div>

                      <div className="col-sm-3">
                        {data.tender_type}

                      </div>
                    </div>

                  </div>
                  <div className="col-sm-4" >
                    {/* <p>Job Expire</p> */}

                    {/* <p> {data.tender_status === 0
                      ? `${t("mybid.Draft")}`
                      : data.tender_status === 1
                        ? `${t("mybid.Send")}`
                        : data.tender_status === 2
                          ? `${t("mybid.Accepted")}`
                          : data.tender_status === 3
                            ? `${t("mybid.Declined")}`
                            : data.tender_status === 4
                              ? `${t("mybid.Pending")}`
                              : data.tender_status === 5
                                ? `${t("mybid.Cancle")}`
                                : data.tender_status === 6
                                  ? `${t("mybid.Ongoing")}`
                                  : data.tender_status === 7
                                    ? `${t("mybid.Expire")}`
                                    : null}
                    </p> */}
                    <p> {data.tb_status === 0
                      ? `${t("mybid.Draft")}`
                      : data.tb_status === 1
                        ? `${t("mybid.Accepted")}`
                        : data.tb_status === 2
                          ? `${t("mybid.Declined")}`
                          : data.tb_status === 3
                            ? `${t("mybid.proposal_send")}`
                            : data.tb_status === 4
                              ? `${t("mybid.proposal_Cancel")}`
                              // : data.tb_status === 5
                              //   ? `${t("mybid.Cancel")}`
                              : data.tb_status === 6
                                ? `${t("mybid.Ongoing")}`
                                // : data.tb_status === 7
                                //   ? `${t("mybid.Expire")}`
                                : null} </p>
                  </div>
                  <div className="col-sm-4" >
                    {/* {
                      data.tb_status == 3 ? <button type="button" onClick={() =>
                        this.handleStatus(data.tb_id, 3)
                      } className="btn btn-primary button_bid"> {t("mybid.Submit_Proposal")} </button> : <button type="button" className="btn btn-secondary button_bid"> {t("mybid.Withdraw")} </button>
                    } */}

                    {/* {data.tb_status === 3 && data.tb_status !== 6 && !data.sender_isLogged ? (
                      <Link
                        className="btn btn-outline-dark mt-3 mr-5"
                        to={{
                          pathname: `/business-proposal-create/${data.tb_id}/${data.tb_user_id}`,
                          state: {
                            data: data.tender_title,
                          }
                        }}
                      >
                        {t("my_contracts.submit_proposal")}
                      </Link>
                    ) : <>
                    <Decline id={`${data.tb_tender_id}/${data.tb_user_id}`} />
                    <a
                      href="#"
                      className="btn btn-secondary button_bid"
                      // data-user_id={bid.tb_user_id}
                      data-toggle="modal"
                      data-target="#decline"
                    >
                      {t("mybid.Withdraw")}
                    </a>
                  </>} */}

                    {data.tb_status === 3 && data.tb_status !== 6 && !data.sender_isLogged ? (<Link
                      className="btn btn-primary button_bid"
                      to={{
                        pathname: `/business-proposal-create/${data.tb_id}/${data.tender_user_id}`,
                        state: {
                          data: data.tender_title,
                        }
                      }}
                    >
                      {t("my_contracts.submit_proposal")}
                    </Link>
                    )
                      :
                      data.tb_status !== 2 && data.tb_status !== 4 ? <>
                        <Decline userId={data.tb_user_id} show={this.state.showDeclineModal} handleClose={() => this.setState({ showDeclineModal: false })} id={`${this.state.u_id}`} />
                        <a
                          onClick={() => this.getId(data.tb_tender_id, data.tb_user_id)}
                          href="#"
                          className="btn btn-secondary button_bid"
                          // data-user_id={bid.tb_user_id}
                          // data-toggle="modal"
                          // data-target="#decline"
                        >
                          {t("mybid.Withdraw")}
                        </a>
                      </> : ""
                    }

                  </div>
                </div>
              </div>

            ))}

            {length > 10 ?
              <div className="row" style={{ width: "100%" }}>
                {/* <div className="col-md-4" >
                  <h3 className="total_rec"> Total {length}  </h3>
                </div> */}
                <div className="col-md-6 " >
                  <h3 className="total_rec"> Show once  </h3>
                  <select id="dropdown_custom" onChange={this.handleChange} value={this.state.postsPerPage} >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="40">40</option>
                    <option value="80">80</option>
                    <option value="100">100</option>
                  </select>
                </div>
                <div className="col-md-6" >
                  <Pagination postsPerPage={this.state.postsPerPage} totalPosts={length} paginate={this.paginate} currentPage={this.state.currentPage} />
                </div>
              </div>
              : ""}
          </>
        ) : <div className="data_not">
          {t("mybid.data_not")}
        </div>
          // <div style={{ textAlign: "center", height: "50px", marginTop: "15px" }}> 
          // <Spinner animation="border" role="status">
          //   <span className="sr-only"> {t("mybid.Loading")} </span>
          // </Spinner>
          // </div>
        }

      </div>
    )
  }
}

export default withTranslation()(Activebirds);