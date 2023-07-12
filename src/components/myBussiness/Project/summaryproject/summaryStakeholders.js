import React from 'react';
import { withTranslation } from 'react-i18next';
import './summaryStakeholders.css';
const SummaryStakeholders = ({ t, location, stakeholder }) => {
  console.log(stakeholder);
  const { clients, user, resources } = stakeholder || {};
  return (
    <div className='card-body'>
      {stakeholder === undefined || stakeholder?.length === 0 ? (
        <div>No data available</div>
      ) : (
        <>
          <h3>{t('projectManagment.Manage.project_stakeholders')}</h3>
          <div>
            <div className='stakeholders-container'>
              <div className='stakeholders-manager'>
                <div className='stakeholders-name'>{user?.full_name}</div>
                <div className='stakeholders-title'>
                  {t('projectManagment.Manage.project_manager')}
                </div>
                <div className='stakeholders-email'>{user?.email}</div>
                <div className='stakeholders-number'>{user?.phone}</div>
                <div className='stakeholders-company'></div>
              </div>
              <div className='stakeholders-client'>
                <div className='stakeholders-name'>{clients?.full_name}</div>
                <div className='stakeholders-title'>
                  {t('projectManagment.Manage.client')}
                </div>
                <div className='stakeholders-email'>{clients?.email}</div>
                <div className='stakeholders-number'>{clients?.phone}</div>
                <div className='stakeholders-company'></div>
              </div>
            </div>
            <div>
              <div className='stakeholders-other-members'>
                {t('projectManagment.Manage.other_members')}
              </div>
              <div className='stakeholders-members'>
                {resources?.map((resource) => {
                  return (
                    <div className='stakeholders-member'>
                      <div className='stakeholders-name'>
                        {resource?.full_name}
                      </div>
                      <div className='stakeholders-title'></div>
                      <div className='stakeholders-email'></div>
                      <div className='stakeholders-number'></div>
                      <div className='stakeholders-company'></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default withTranslation()(SummaryStakeholders);
