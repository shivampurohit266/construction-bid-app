import React, { Component } from 'react';
import { url } from '../../../helper/helper';
import { withTranslation } from 'react-i18next';
import img from '../../../images/DefaultImg.png';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

class PDFView extends Component {
  render() {
    const { businessInfo, userInfo, t } = this.props;
    const { show, handleClose } = this.props;
    console.log(' businessInfo, userInfo', businessInfo, userInfo);

    return (
      // <div
      //   className="modal fade"
      //   id="preview-info"
      //   tabIndex="-1"
      //   role="dialog"
      //   aria-labelledby="previewModalLabel"
      //   aria-hidden="true"
      // >
      <Modal
        isOpen={show}
        toggle={() => handleClose()}
        className={'modalPropu preview-modal'}
        centered
      >
        <ModalHeader toggle={() => handleClose()}>
          {t('proposal_pdf.heading')}
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
                        <b>{`${
                          businessInfo.first_name ? businessInfo.first_name : ''
                        } ${
                          businessInfo.last_name ? businessInfo.last_name : ' '
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
                        {businessInfo.address ? businessInfo.address : ' '}
                        <br />
                        {t('proposal_pdf.phone_no')}{' '}
                        {businessInfo.phone ? businessInfo.phone : ' '}
                        <br />
                        {t('account.zip') + ':'}{' '}
                        {businessInfo.zip ? businessInfo.zip : ''}
                        {/* {t("proposal_pdf.business_ID")} {businessInfo.id ? businessInfo.id :""}
                            <br /> */}
                        {/* {t("proposal_pdf.other_info")} */}
                      </address>
                    </div>
                    <div className='col-md-6 col-lg-4'>
                      <address>
                        <p className='mb-2'>{t('proposal_pdf.proposal_to')}</p>
                        <br />
                        {userInfo.client_id === 0 ? '' : userInfo.client_id}
                        <br />
                        {userInfo.address === 0 ? '' : userInfo.address}
                        <br />
                      </address>
                    </div>
                    <div className='col-md-12 col-lg-4'></div>
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className='float-md-right float-sm-none'>
                    <h2>{t('proposal_pdf.proposal')}</h2>
                    <address>
                      {t('proposal_pdf.req')} {userInfo.proposal_id}
                      <br />
                      {t('proposal_pdf.prop_date')} {userInfo.date}
                      <br />
                      {t('proposal_pdf.due_date')} {userInfo.due_date}
                      <br />
                    </address>
                  </div>
                </div>
              </div>
            </div>
            <div className='pdf-content'>
              <h2>{t('proposal_pdf.proposal_summary')}</h2>
              <div className='row mb-5'>
                <div className='col-lg-4 col-md-12 mb-4 mb-lg-0'>
                  <h4>{t('proposal_pdf.total_cost')}</h4>
                  <table className='table table-striped'>
                    <tbody>
                      <tr>
                        <td>{t('proposal_pdf.work_cost')}</td>
                        <td className='text-right'>
                          {userInfo.left} {userInfo.workTotal} {userInfo.right}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('proposal_pdf.material_cost')}</td>
                        <td className='text-right'>
                          {userInfo.left} {userInfo.matTotal} {userInfo.right}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('proposal_pdf.total_cost')}</td>
                        <td className='text-right'>
                          {userInfo.left}{' '}
                          {Number(Number(userInfo.workTotal) +
                            Number(userInfo.matTotal)).toFixed(2)}{' '}
                          {userInfo.right}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className='col-lg-4 col-md-6 mb-4 mb-md-0'>
                  <h4>{t('proposal_pdf.mat_pay')}</h4>
                  <div className='border p-3' style={{ height: '110px' }}>
                    <p>
                      {userInfo.mat_pay === 'other'
                        ? userInfo.other
                        : userInfo.mat_pay}
                    </p>
                  </div>
                </div>
                <div className='col-lg-4 col-md-6'>
                  <h4>{t('proposal_pdf.work_pay')}</h4>
                  <div className='border p-3' style={{ height: '110px' }}>
                    <p>{userInfo.work_pay}</p>
                  </div>
                </div>
              </div>
              <h3>{t('proposal_pdf.project_plan')}</h3>
              <div className='row mb-5'>
                <div className='col-lg-4 col-md-6 mb-4 mb-md-0'>
                  <h5>{t('proposal_pdf.work')}</h5>
                  <table className='table table-striped small'>
                    <tbody>
                      {userInfo.workItems === null
                        ? null
                        : JSON.parse(userInfo.workItems).map((item, i) => (
                            <tr>
                              <td key={i}>{item.items}</td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
                <div className='col-lg-4 col-md-6'>
                  <h5>{t('proposal_pdf.material')}</h5>
                  <table className='table table-striped small'>
                    <tbody>
                      {userInfo.matItems === null
                        ? null
                        : JSON.parse(userInfo.matItems).map((item) => (
                            <tr>
                              <td>{item.items}</td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
                <div className='col-lg-4 col-md-12'></div>
              </div>
              <h2>{t('proposal_pdf.proposal_details')}</h2>
              <div className='row mb-5'>
                <div className='col-lg-4 col-md-6 mb-4 mb-md-0'>
                  <h4>{t('proposal_pdf.guarantee_for_work')}</h4>
                  <div className='border p-3' style={{ height: '110px' }}>
                    <p>{userInfo.work}</p>
                  </div>
                </div>
                <div className='col-lg-4 col-md-6'>
                  <h4>{t('proposal_pdf.insurance')}</h4>
                  <div className='border p-3' style={{ height: '110px' }}>
                    <p>{userInfo.insurance}</p>
                  </div>
                </div>
                <div className='col-lg-4 col-md-12'></div>
              </div>
              <br />
              <p className='h3 mb-3'>
                <b>{t('proposal_pdf.start_date')}</b> {userInfo.start_date}
              </p>
              <p className='h3'>
                <b>{t('proposal_pdf.end_date')}</b> {userInfo.end_date}
              </p>
              <br />
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
    );
  }
}

export default withTranslation()(PDFView);
