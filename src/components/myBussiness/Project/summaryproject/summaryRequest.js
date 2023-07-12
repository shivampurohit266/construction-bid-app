import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import attachment from '../../../../images/Vector.svg';
const SummaryRequest = ({ t, request, attachmentUrl, tbAttachmentUrl }) => {
  const { tb_attachment, tb_user_name, tb_quote, tb_message } = request || {};
  const {
    tender_title,
    tender_category_type,
    tender_type,
    category,
    tender_budget,
    tender_state,
    tender_available_from,
    tender_available_to,
    tender_expiry_date,
    tender_attachment,
    tender_description,
    cities,
    state,
    tendercategorylang,
  } = request?.tender || {};
  return (
    <div className='card-body'>
      {request?.length === 0 || request === undefined ? (
        <div>No data available</div>
      ) : (
        <>
          <h2>{tender_title}</h2>
          <p>
            {tender_category_type} {tender_type}
          </p>

          <div className='card-section'>
            <div>
              <p>{tender_description}</p>
              {/* <p>
            Vanhan keittiön purku, sis kaapit, hana, välitila, ylä- ja
            alasokkelit.
          </p>
          <p>Kaappeja 10kpl. Työtasoa 300cm.</p>
          <p>Uudet kulmapistorasiat 2kpl ja välitila valot 2kpl.</p>
          <p>Uudet kulmapistorasiat 2kpl ja välitila valot 2kpl.</p>
          <p>Uudet kulmapistorasiat 2kpl ja välitila valot 2kpl.</p>
          <p>
            Vanhan keittiön purku, sis kaapit, hana, välitila, ylä- ja
            alasokkelit.
          </p> */}
            </div>

            <table>
              <tr>
                <th> {t('projectManagment.Manage.category')}</th>
                <td>{tendercategorylang?.lang_category_name}</td>
              </tr>
              <tr>
                <th> {t('projectManagment.Manage.budget')}</th>
                <td>{tender_budget}</td>
              </tr>
              <tr>
                <th> {t('projectManagment.Manage.location')}</th>
                <td>
                  {cities?.city_identifier}, {state?.state_code}
                </td>
              </tr>
              <tr>
                <th> {t('projectManagment.Manage.work_start')}</th>
                <td>{tender_available_from}</td>
              </tr>
              <tr>
                <th> {t('projectManagment.Manage.work_end')}</th>
                <td>{tender_available_to}</td>
              </tr>
              <tr>
                <th> {t('projectManagment.Manage.expires_in')}</th>
                <td>{tender_expiry_date}</td>
              </tr>
            </table>
          </div>
          <div className='card-attachment'>
            <img src={attachment} alt='attachemnt' />
            <h4 style={{ marginBottom: '0px', marginLeft: '1rem' }}>
              {t('projectManagment.Create.attachment')}
            </h4>
          </div>
          <div className='images-container'>
            <img
              className='image-box'
              src={attachmentUrl + tender_attachment}
            />
            {/* <div className='image-box'>Image</div>
        <div className='image-box'>Image</div> */}
          </div>
          <h3 style={{ marginTop: '3rem' }}>
            {' '}
            {t('projectManagment.Manage.bidder_details')}
          </h3>
          <div className='bider-table'>
            <table>
              <tr>
                <th> {t('projectManagment.Manage.offer1')}</th>
                <td>{tb_quote}</td>
              </tr>
              <tr>
                <th> {t('projectManagment.Manage.name')}</th>
                <td>{tb_user_name}</td>
              </tr>
              <tr>
                <th> {t('projectManagment.Manage.message')}</th>
                <td></td>
              </tr>
            </table>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <p style={{ fontSize: '13px', lineHeight: '15px' }}>{tb_message}</p>
          </div>

          <div className='card-attachment'>
            <img src={attachment} alt='attachemnt' />
            <h4 style={{ marginBottom: '0px', marginLeft: '1rem' }}>
              {t('projectManagment.Create.attachment')}
            </h4>
          </div>
          <div className='images-container'>
            <img className='image-box' src={tbAttachmentUrl + tb_attachment} />
          </div>
        </>
      )}
    </div>
  );
};

export default withTranslation()(SummaryRequest);
