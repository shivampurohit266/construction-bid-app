import React, { Component } from 'react';
import { url } from '../../../helper/helper';
import { withTranslation } from 'react-i18next';
// import ReactToPrint from "react-to-print";
import img from '../../../images/DefaultImg.png';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

class PDFViewAgreement extends Component {
  render() {
    const { businessInfo, userInfo, t } = this.props;
    const { show, handleClose } = this.props;
    // //console.log("businessInfo", businessInfo );
    // console.log(businessInfo , "userInfo", userInfo );
    return (
      <>
        {/* <ReactToPrint
          trigger={() => <div style={{fontSize:"15px", float:"right"}}>Print this out!</div>}
          content={() => this.componentRef}
          bodyClass="modal-dialog modal-xl modal-dialog-centered preview-modal"
          copyStyles={true}
        />  
        ref={(el) => (this.componentRef = el)}
        */}
        {/* <div
          className="modal fade"
          id="preview-info"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="previewModalLabel"
          aria-hidden="true"
        > */}
        <Modal
          isOpen={show}
          toggle={() => handleClose()}
          className={'modalPropu preview-modal'}
          centered
        >
          <ModalHeader toggle={() => handleClose()}>
            {t('b_sidebar.agreement.View_message')}
          </ModalHeader>
          <ModalBody>
            <div className='pdf-section'>
              <div className='pdf-header'>
                <div className='logo'>
                  {businessInfo.company_logo ? (
                    <img
                      src={
                        url +
                        '/images/marketplace/company_logo/' +
                        businessInfo.company_logo
                      }
                      alt='logo'
                    />
                  ) : (
                    <img src={img} />
                  )}
                </div>
                <div className='row'>
                  <div className='col-md-8'>
                    <div className='row'>
                      <div className='col-md-12'>
                        <p>
                          <b>
                            {businessInfo.company_id
                              ? businessInfo.company_id
                              : ''}
                          </b>
                          <br />
                          <b>{`${businessInfo.first_name} ${
                            businessInfo.last_name ? businessInfo.last_name : ''
                          }`}</b>
                          <br />
                          <b>{businessInfo.email ? businessInfo.email : ''}</b>
                          <br />
                        </p>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6 col-lg-4'>
                        <address>
                          <br />
                          {businessInfo.address ? businessInfo.address : ''}
                          <br />
                          {t('proposal_pdf.phone_no')}{' '}
                          {businessInfo.phone ? businessInfo.phone : ' '}
                          <br />
                          {/* {t("proposal_pdf.business_ID")} {businessInfo.id ? businessInfo.id : ""} */}
                          {/* <br /> */}
                          {/* {t("proposal_pdf.other_info")} */}
                        </address>
                      </div>
                      <div className='col-md-6 col-lg-4'>
                        <address>
                          <p className='mb-2'>
                            {t('proposal_pdf.agreement_to')}
                          </p>
                          <br />
                          {userInfo.client_id ? userInfo.client_id : ' '}
                          <br />
                          {userInfo.address ? userInfo.address : ' '}
                          <br />
                        </address>
                      </div>
                      <div className='col-md-12 col-lg-4' />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className='float-md-right float-sm-none'>
                      <h2>{t('proposal_pdf.agreement')}</h2>
                      <address>
                        {t('proposal_pdf.req')}{' '}
                        {`${businessInfo.user_id ? businessInfo.user_id : ''}${
                          userInfo.agreement_id ? userInfo.agreement_id : ''
                        }`}
                        <br />
                        {t('proposal_pdf.prop_date')}{' '}
                        {userInfo.date ? userInfo.date : ''}
                        <br />
                        {t('proposal_pdf.due_date')}{' '}
                        {userInfo.due_date ? userInfo.due_date : ''}
                        <br />
                      </address>
                    </div>
                  </div>
                </div>
              </div>
              <div className='pdf-content'>
                <h2>{t('proposal_pdf.project_plan')}</h2>
                <div className='row mb-5'>
                  <div className='col-lg-4 col-md-6 mb-4 mb-md-0'>
                    <h5>{t('proposal_pdf.work')}</h5>
                    <table className='table table-striped small'>
                      <tbody>
                        {userInfo.work_template !== null ? (
                          userInfo.work_template?.items !== undefined ? (
                            JSON.parse(userInfo.work_template?.items).map(
                              (item) => (
                                <tr>
                                  <td>{item.items}</td>
                                </tr>
                              )
                            )
                          ) : (
                            ''
                          )
                        ) : (
                          <tr>
                            <td> {t('proposal_pdf.None')}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className='col-lg-4 col-md-6'>
                    <h5>{t('proposal_pdf.material')}</h5>
                    <table className='table table-striped small'>
                      <tbody>
                        {userInfo.mat_template !== null ? (
                          userInfo.mat_template?.items !== undefined ? (
                            JSON.parse(userInfo.mat_template?.items).map(
                              (item) => (
                                <tr>
                                  <td>{item.items}</td>
                                </tr>
                              )
                            )
                          ) : (
                            ''
                          )
                        ) : (
                          <tr>
                            <td> {t('proposal_pdf.None')}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className='col-lg-4 col-md-12' />
                </div>
                <h2>{t('proposal_pdf.terms')}</h2>
                <div className='row mb-5'>
                  <div className='col-lg-4 col-md-6 mb-4 mb-md-0'>
                    <h4>{t('proposal_pdf.mat_pay')}</h4>
                    <div className='border p-3' style={{ height: 110 }}>
                      <p>
                        {userInfo?.mat_pay === 'other'
                          ? userInfo?.agreement_other
                          : userInfo?.mat_pay}{' '}
                      </p>
                    </div>
                  </div>

                  <div className='col-lg-4 col-md-6'>
                    <h4>{t('proposal_pdf.work_pay')}</h4>
                    <div className='border p-3' style={{ height: 110 }}>
                      <p>
                        {t('proposal_pdf.terms')} :{' '}
                        {userInfo.agreement_terms === 'fixed'
                          ? t('proposal_pdf.fixed')
                          : t('proposal_pdf.hourly')}
                        <br />
                        {userInfo.agreement_terms !== 'fixed' ? (
                          <span>
                            {t('proposal_pdf.hourly_price')} : {userInfo.left}{' '}
                            <span>{userInfo.agreement_estimated_payment}</span>{' '}
                            {userInfo.right}
                          </span>
                        ) : null}
                        <br />
                        {userInfo.agreement_work_payment_other}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='row mb-5'>
                  {userInfo.agreement_terms !== 'hourly' ? (
                    <div className='col-lg-8 col-md-12 mb-4 mb-lg-0'>
                      <h4>{t('proposal_pdf.terms')}</h4>
                      <table className='table table-striped'>
                        <tbody>
                          {userInfo.agreement_terms !== 'fixed' ? (
                            <tr></tr>
                          ) : userInfo.agreement_milestones.length > 0 ? (
                            JSON.parse(userInfo.agreement_milestones).map(
                              (milestone, index) => {
                                return (
                                  <tr>
                                    <td className='text-center'>{++index}</td>
                                    <td>
                                      {milestone.des}
                                      <br />
                                    </td>
                                    <td>{milestone.due_date}</td>
                                    <td className='text-right'>
                                      <b>
                                        {userInfo.left}{' '}
                                        {milestone.amount === 'undefined'
                                          ? ''
                                          : milestone.amount}{' '}
                                        {userInfo.right}
                                      </b>
                                    </td>
                                  </tr>
                                );
                              }
                            )
                          ) : null}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    ''
                  )}
                  <div className='col-lg-4 col-md-6 mb-4 mb-md-0'>
                    <h4>{t('proposal_pdf.trans')}</h4>
                    <div className='border p-3 mb-4' style={{ height: 42 }}>
                      <p> {userInfo.agreement_transport_payment} </p>
                    </div>
                    <h4>{t('proposal_pdf.panelty_terms')}</h4>
                    <div className='border p-3 mb-4'>
                      <p>{userInfo.agreement_panelty}</p>
                    </div>
                  </div>
                </div>
                <h2>{t('proposal_pdf.guarantee_insurance')}</h2>
                <div className='row mb-5'>
                  <div className='col-lg-4 col-md-6 mb-4 mb-md-0'>
                    <h4>{t('proposal_pdf.guarantee_work')}</h4>
                    <div className='border p-3' style={{ height: 110 }}>
                      <p>{userInfo.agreement_work_guarantee}</p>
                    </div>
                  </div>
                  <div className='col-lg-4 col-md-6'>
                    <h4>{t('proposal_pdf.guarantee_mat')}</h4>
                    <div className='border p-3' style={{ height: 110 }}>
                      <p>{userInfo.agreement_material_guarantee}</p>
                    </div>
                  </div>
                  <div className='col-lg-4 col-md-6'>
                    <h4>{t('proposal_pdf.agreement_insurance')}</h4>
                    <div className='border p-3' style={{ height: 110 }}>
                      <p>{userInfo.agreement_insurances}</p>
                    </div>
                  </div>
                </div>
                <h2>{t('proposal_pdf.legal')}</h2>
                <div className='row mb-5'>
                  <div className='col-lg-4 col-md-6 mb-4 mb-md-0'>
                    <h4>{t('proposal_pdf.client_res')}</h4>
                    <div className='border p-3' style={{ height: 110 }}>
                      <p>
                        {`${userInfo.agreement_client_res_other}`} <br />
                        {/* {userInfo.agreement_client_res_other ?
                             userInfo.agreement_client_res_other
                            .split(",")
                            .map((agreement_client) => (
                              agreement_client + "  "
                         ))
                            :""}  */}
                      </p>
                    </div>
                  </div>
                  <div className='col-lg-4 col-md-6'>
                    <h4>{t('proposal_pdf.contractor_res')}</h4>
                    <div className='border p-3' style={{ height: 110 }}>
                      <p>
                        {`${userInfo.agreement_contractor_res}`} <br />
                        {userInfo.agreement_contractor_res_other
                          ? userInfo.agreement_contractor_res_other
                              .split(',')
                              .map(
                                (agreement_contractor) =>
                                  agreement_contractor + '  '
                              )
                          : ''}
                      </p>
                    </div>
                  </div>
                  <div className='col-lg-4 col-md-6'>
                    <h4>{t('proposal_pdf.legal_terms')}</h4>
                    <div className='form-group'>
                      {userInfo.agreement_legal_category?.map((x, i) => (
                        <div className='form-check'>
                          <input
                            type='checkbox'
                            className='form-check-input'
                            checked
                          />
                          <label className='form-check-label'>
                            {x} {t('proposal_pdf.agreement')}
                          </label>
                        </div>
                      ))}
                      {/* {userInfo.agreement_legal_category
                            ? userInfo.agreement_legal_category
                              .split(",")
                              .map((legal) => (
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked
                                  />
                                  <label className="form-check-label">
                                    {legal}  {t("proposal_pdf.agreement")} 
                                </label>
                                </div>
                              ))
                            : null} */}
                    </div>
                  </div>
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
              </div>
              <div className='pdf-footer'>
                <p>{t('proposal_pdf.brand')}</p>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </>
    );
  }
}

export default withTranslation()(PDFViewAgreement);
