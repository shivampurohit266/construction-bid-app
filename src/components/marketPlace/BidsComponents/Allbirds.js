import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { url } from '../../../helper/helper';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import { withTranslation } from 'react-i18next';
import Decline from '../listingdetails/Modals/Decline';
import Pagination from '../../myBussiness/pagination/pagination';

class AllBirds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentPage: 1,
      postsPerPage: 10,
      showDeclineModal: false
    };
    console.log(this.props);
  }

  getdate(date) {
    let now = moment();
    var result = now.diff(date, 'days');
    const { t } = this.props;
    if (result === 0) {
      return <>{t('mybid.Today_bid')} </>;
    } else {
      return (
        <div>
          {' '}
          {result} {t('mybid.days')}{' '}
        </div>
      );
    }
  }

  handleStatus = async (id, status) => {
    this.setState({ loaded: false });
    const token = await localStorage.getItem('token');
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
      this.props.business();
      // this.props.history.push(`./business-proposal-create`)
    }
    // this.loadNotif(this.axiosCancelSource);
  };

  business = () => {
    this.props.history.push(`./business-proposal-create`);
  };

  paginate = (number) => {
    this.setState({
      currentPage: number,
    });
  };

  handleChange = (e) => {
    this.setState({
      postsPerPage: e.target.value,
    });
  };

  getId = (userid, id) => {
    this.setState({
      u_id: userid,
      ID: id,
      showDeclineModal: !this.state.showDeclineModal
    });
  };

  render() {
    //
    const birds = this.props.data;
    console.log('birds', birds);
    // //console.log("birds", this.props?.data?.length)
    const { t } = this.props;
    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const currentPosts = birds?.slice(indexOfFirstPost, indexOfLastPost);
    const length = birds ? birds.length : '';

    return (
      <div className='card'>
        {currentPosts ? (
          <>
            {currentPosts.map((data, index) => (
              <div
                className='card-body'
                key={index}
                style={{ borderBottom: '1px solid lightgray' }}
              >
                <div className='row'>
                  <div className='col-sm-4'>
                    <Link
                      to={{
                        pathname: `/Biddetails/${data.tb_id}`,
                        state: {
                          data: birds,
                          // getData: this.props.onClick,
                          //commented out GetData to get rid of error onClick of my bid's name
                          user_id: data.tender_user_id,
                        },
                      }}
                    >
                      {' '}
                      {data.tender_title}
                    </Link>

                    <div className='row custom_days'>
                      <div className='col-sm-3'>
                        {this.getdate(data.created_at)}
                      </div>

                      <div className='col-sm-3'>
                        {data.tender_category_type === 'Material'
                          ? t('mybid.Material')
                          : data.tender_category_type === 'Work'
                            ? t('mybid.work')
                            : ''}
                      </div>

                      <div className='col-sm-3'>
                        {data.tender_type === 'Request'
                          ? t('mybid.Request')
                          : t('mybid.Offer')}
                      </div>
                    </div>
                  </div>
                  <div className='col-sm-4'>
                    {/* <p> {data.tender_status === 0
                      ? `${t("mybid.Draft")}`
                      : data.tender_status === 1 && data.tb_status === 0
                        ? `${t("mybid.Send")}`
                        : data.tender_status === 2
                          ? `${t("mybid.Accepted")}`
                          : data.tender_status === 3
                            ? `${t("mybid.Declined")}`
                            : data.tender_status === 4
                              ? `${t("mybid.Pending")}`
                              : data.tender_status === 5
                                ? `${t("mybid.Cancel")}`
                                : data.tender_status === 6
                                  ? `${t("mybid.Ongoing")}`
                                  : data.tender_status === 7
                                    ? `${t("mybid.Expire")}`
                                    : null}
                    </p> */}

                    <p>
                      {' '}
                      {data.tb_status === 0
                        ? `${t('mybid.Draft')}`
                        : data.tb_status === 1
                          ? `${t('mybid.Accepted')}`
                          : data.tb_status === 2
                            ? `${t('mybid.Declined')}`
                            : data.tb_status === 3
                              ? `${t('mybid.proposal_send')}`
                              : data.tb_status === 4
                                ? `${t('mybid.proposal_Cancel')}`
                                : // : data.tb_status === 5
                                //   ? `${t("mybid.Cancel")}`
                                data.tb_status === 6
                                  ? `${t('mybid.Ongoing')}`
                                  : // : data.tb_status === 7
                                  //   ? `${t("mybid.Expire")}`
                                  null}
                    </p>
                  </div>

                  <div className='col-sm-4'>
                    {data.tb_status === 3 &&
                      data.tb_status !== 6 &&
                      !data.sender_isLogged ? (
                      <Link
                        className='btn btn-primary button_bid'
                        to={{
                          pathname: `/business-proposal-create/${data.tb_id}/${data.tender_user_id}`,
                          state: {
                            data: data.tender_title,
                          },
                        }}
                      >
                        {t('my_contracts.submit_proposal')}
                      </Link>
                    ) : data.tb_status !== 2 && data.tb_status !== 4 ? (
                      <>
                        <Decline userId={data.tb_user_id} show={this.state.showDeclineModal} handleClose={() => this.setState({ showDeclineModal: false })} id={`${this.state.u_id}`} />
                        <a
                          onClick={() =>
                            this.getId(data.tb_tender_id, data.tb_user_id)
                          }
                          href='#'
                          className='btn btn-secondary button_bid'
                        // data-user_id={bid.tb_user_id}
                        // data-toggle='modal'
                        // data-target='#decline'
                        >
                          {t('mybid.Withdraw')}
                        </a>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            ))}

            {length > 10 ? (
              <div className='row' style={{ width: '100%' }}>
                {/* <div className="col-md-4" >
                  <h3 className="total_rec"> Total {length}  </h3>
                </div> */}
                <div className='col-md-6 '>
                  <h3 className='total_rec'> Show once </h3>
                  <select
                    id='dropdown_custom'
                    onChange={this.handleChange}
                    value={this.state.postsPerPage}
                  >
                    <option value='10'>10</option>
                    <option value='20'>20</option>
                    <option value='40'>40</option>
                    <option value='80'>80</option>
                    <option value='100'>100</option>
                  </select>
                </div>
                <div className='col-md-6'>
                  <Pagination
                    postsPerPage={this.state.postsPerPage}
                    totalPosts={length}
                    paginate={this.paginate}
                    currentPage={this.state.currentPage}
                  />
                </div>
              </div>
            ) : (
              ''
            )}
          </>
        ) : (
          <div
            style={{ textAlign: 'center', height: '50px', marginTop: '15px' }}
          >
            {' '}
            <Spinner animation='border' role='status'>
              <span className='sr-only'>{t('mybid.Loading')} </span>
            </Spinner>
          </div>
        )}
      </div>
    );
  }
}

export default withTranslation()(AllBirds);
