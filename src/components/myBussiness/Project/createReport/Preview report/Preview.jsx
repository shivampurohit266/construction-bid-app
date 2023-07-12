import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { url } from '../../../../../helper/helper';
import img from '../../../../../images/DefaultImg.png';
import { dateFunc } from '../../../../../helper/dateFunc/date';

class Preview extends Component {
  render() {
    const {
      userImage,
      t,
      email,
      executiveName,
      clientAddress,
      clientId,
      zipCode,
      taskId,
      phone,
      date,
      userAddress,
      imageFull,
      comments,
      imagePreview,
      editImages,
      editItems,
      editComments,
      prdDatas,
      emailId,
      emails,
      createdAt,
    } = this.props;

    const style = {
      margin: 'auto',
      display: 'block',
    };

    return (
      <div
        className='modal fade'
        id='preview-report'
        tabIndex='-1'
        role='dialog'
        aria-labelledby='previewModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modalPropu modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              <div className='pdf-section'>
                <div className='pdf-header'>
                  <div className='logo'>
                    <img
                      src={
                        userImage === null
                          ? img
                          : url +
                            '/images/marketplace/company_logo/' +
                            userImage
                      }
                      alt='logo'
                    />
                  </div>
                  <div className='row'>
                    <div className='col-md-8'>
                      <div className='row'>
                        <div className='col-md-12'>
                          <p>
                            <br />
                            <b>{`${executiveName ? executiveName : ''}`}</b>
                            <br />
                            <b>{`${email ? email : ''}`}</b>
                            <br />
                          </p>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-6 col-lg-4'>
                          <p>{t('create_report.from')}</p>
                          <address>
                            <b>{`${executiveName ? executiveName : ''}`}</b>
                            <br />
                            {t('create_report.address')}:{' '}
                            {userAddress ? userAddress : ' '}
                            <br />
                            {t('create_report.phone')}: {phone ? phone : ' '}
                            <br />
                            {t('create_report.zip')}: {zipCode ? zipCode : ''}
                            {/* {t("proposal_pdf.business_ID")} {businessInfo.id ? businessInfo.id :""}
                            <br /> */}
                            {/* {t("proposal_pdf.other_info")} */}
                          </address>
                        </div>
                        <div className='col-md-6 col-lg-4'>
                          <p>{t('create_report.to')}</p>
                          <address>
                            <span>
                              {t('create_report.email')}:{' '}
                              {!emails?.includes('') && emails?.length !== 0
                                ? emails?.map((email) => <li>{email}</li>)
                                : emailId}
                            </span>
                            <br />
                            {t('create_report.address')}:{' '}
                            <span>{clientAddress}</span>
                            <br />
                            {/* {clientId === 0 ? '' : clientId} */}
                            <br />
                          </address>
                        </div>
                        <div className='col-md-12 col-lg-4'></div>
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <div className='float-md-right float-sm-none'>
                        <address>
                          <p>
                            {' '}
                            Customer ID/ {''}
                            {clientId === 0 || clientId === 'Select Customer'
                              ? ''
                              : clientId}
                            {''}
                          </p>
                          <br />
                          <p>
                            Date:{''} {date ? dateFunc(date) : ''}{' '}
                            {createdAt ? dateFunc(createdAt) : ''}
                          </p>{' '}
                          <br />
                        </address>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='pdf-content'>
                  <div className='preview-report-to'></div>
                  <div className='preview-report-report'></div>{' '}
                </div>
                <div className='preview-report-project-info'>
                  {' '}
                  <div className='preview-report-title-task'>
                    {/* <h3>Project:</h3>
                    <h3>Task: </h3>{' '} */}
                  </div>
                  {imagePreview && comments && !editItems && !editComments ? (
                    <div>
                      <div>
                        <img src={imagePreview['sec0']} alt='' style={style} />
                        <p style={{ textAlign: 'center' }}>
                          {comments['sec0']}
                        </p>
                      </div>
                      <div>
                        <img src={imagePreview['sec1']} alt='' style={style} />
                        <p style={{ textAlign: 'center' }}>
                          {comments['sec1']}
                        </p>
                      </div>
                      <div>
                        <img src={imagePreview['sec2']} alt='' style={style} />
                        <p style={{ textAlign: 'center' }}>
                          {comments['sec2']}
                        </p>
                      </div>
                      <div>
                        <img src={imagePreview['sec3']} alt='' style={style} />
                        <p style={{ textAlign: 'center' }}>
                          {comments['sec3']}
                        </p>
                      </div>
                      <div>
                        <img src={imagePreview['sec4']} alt='' style={style} />
                        <p style={{ textAlign: 'center' }}>
                          {comments['sec4']}
                        </p>
                      </div>
                      <div>
                        <img src={imagePreview['sec5']} alt='' style={style} />
                        <p style={{ textAlign: 'center' }}>
                          {comments['sec5']}
                        </p>
                      </div>
                      <div>
                        <img src={imagePreview['sec6']} alt='' style={style} />
                        <p style={{ textAlign: 'center' }}>
                          {comments['sec6']}
                        </p>
                      </div>
                      <div>
                        <img src={imagePreview['sec7']} alt='' style={style} />
                        <p style={{ textAlign: 'center' }}>
                          {comments['sec7']}
                        </p>
                      </div>
                      <div>
                        <img src={imagePreview['sec8']} alt='' style={style} />
                        <p style={{ textAlign: 'center' }}>
                          {comments['sec8']}
                        </p>
                      </div>
                      <div>
                        <img src={imagePreview['sec9']} alt='' style={style} />
                        <p style={{ textAlign: 'center' }}>
                          {comments['sec9']}
                        </p>
                      </div>
                    </div>
                  ) : null}
                  {editImages && prdDatas ? (
                    <div>
                      <div>
                        <img
                          src={
                            editItems.sec0
                              ? imagePreview['sec0']
                              : imageFull.sec0
                          }
                          alt='first image'
                          style={style}
                        />
                        <p style={{ textAlign: 'center' }}>{comments.sec0}</p>
                      </div>
                      <div>
                        <img
                          src={
                            editItems.sec1
                              ? imagePreview['sec1']
                              : imageFull.sec1
                          }
                          alt=''
                          style={style}
                        />
                        <p style={{ textAlign: 'center' }}>{comments.sec1}</p>
                      </div>
                      <div>
                        <img
                          src={
                            editItems.sec2
                              ? imagePreview['sec2']
                              : imageFull.sec2
                          }
                          alt=''
                          style={style}
                        />
                        <p style={{ textAlign: 'center' }}>{comments.sec2}</p>
                      </div>
                      <div>
                        <img
                          src={
                            editItems.sec3
                              ? imagePreview['sec3']
                              : imageFull.sec3
                          }
                          alt=''
                          style={style}
                        />
                        <p style={{ textAlign: 'center' }}>{comments.sec3}</p>
                      </div>
                      <div>
                        <img
                          src={
                            editItems.sec4
                              ? imagePreview['sec4']
                              : imageFull.sec4
                          }
                          alt=''
                          style={style}
                        />
                        <p style={{ textAlign: 'center' }}>{comments.sec4}</p>
                      </div>
                      <div>
                        <img
                          src={
                            editItems.sec5
                              ? imagePreview['sec5']
                              : imageFull.sec5
                          }
                          alt=''
                          style={style}
                        />
                        <p style={{ textAlign: 'center' }}>{comments.sec5}</p>
                      </div>
                      <div>
                        <img
                          src={
                            editItems.sec6
                              ? imagePreview['sec6']
                              : imageFull.sec6
                          }
                          alt=''
                          style={style}
                        />
                        <p style={{ textAlign: 'center' }}>{comments.sec6}</p>
                      </div>
                      <div>
                        <img
                          src={
                            editItems.sec7
                              ? imagePreview['sec7']
                              : imageFull.sec7
                          }
                          alt=''
                          style={style}
                        />
                        <p style={{ textAlign: 'center' }}>{comments.sec7}</p>
                      </div>
                      <div>
                        <img
                          src={
                            editItems.sec8
                              ? imagePreview['sec8']
                              : imageFull.sec8
                          }
                          alt=''
                          style={style}
                        />
                        <p style={{ textAlign: 'center' }}>{comments.sec8}</p>
                      </div>
                      <div>
                        <img
                          src={
                            editItems.sec9
                              ? imagePreview['sec9']
                              : imageFull.sec9
                          }
                          alt=''
                          style={style}
                        />
                        <p style={{ textAlign: 'center' }}>{comments.sec9}</p>
                      </div>{' '}
                    </div>
                  ) : null}
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
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Preview);
