import React from 'react';
import { withTranslation } from 'react-i18next';
import './summaryProjectPlan.css';
import { dateFunc } from '../../../../helper/dateFunc/date';
const SummaryProjectPlan = ({ t, location, plan }) => {
  console.log(plan);
  const lang = localStorage.getItem('_lng');
  const {
    agreement_names,
    agreement_description,
    user,
    client,
    start_date,
    end_date,
  } = plan || {};
  const otherMembers = user?.resources;

  const filterMembers = otherMembers?.filter((members) => {
    return (
      members.ur_resource_type === 'Resource' ||
      members.ur_resource_type === 'Employee'
    );
  });

  return (
    <div className='card-body'>
      {plan === undefined || !plan ? (
        <div>No data available</div>
      ) : (
        <>
          <h2 className='body-title'>
            {' '}
            {t('projectManagment.Manage.project_plan')}
          </h2>
          <section>
            <h5>{agreement_names}</h5>
            <p>{agreement_description}</p>
          </section>
          <section className='resource-card'>
            <div className='resource-card-left'>
              <div className='title-resource'>
                {' '}
                {t('projectManagment.Manage.team_and_resources')}
              </div>
              <div className=''>
                <div className='resource-names'>
                  <div className='resource-manager'>
                    <div className='sub-title'>{user?.full_name}</div>
                    <div className='subtitle'>
                      {' '}
                      {t('projectManagment.Manage.project_manager')}
                    </div>
                  </div>
                  <div className='resource-client'>
                    <div className='sub-title'>{client?.full_name}</div>
                    <div className='subtitle'>
                      {' '}
                      {t('projectManagment.Manage.client1')}
                    </div>
                  </div>
                </div>

                <div>
                  <div className='sub-title'>
                    {' '}
                    {t('projectManagment.Manage.other_members')}
                  </div>
                  <div className='subtitle'>
                    {filterMembers?.map(({ first_name, last_name }) => {
                      return <li>{first_name + ' ' + last_name}</li>;
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className='resource-card-right'>
              <div className='title-resource'>
                {' '}
                {t('projectManagment.Manage.timeline')}
              </div>
              <div className='resource-dates'>
                <div className='resource-start-date'>
                  <div className='sub-title'>
                    {' '}
                    {t('projectManagment.Manage.planned_start_date')}
                  </div>
                  <div className='subtitle'>{dateFunc(start_date, lang)}</div>
                </div>
                <div className='resource-end-date'>
                  <div className='sub-title'>
                    {' '}
                    {t('projectManagment.Manage.planned_end_date')}
                  </div>
                  <div className='subtitle'>{dateFunc(end_date)}</div>
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className='work-material-container'>
              {/* <div className='work-list'>
            <div className='work-title'>Work List</div>
            <div className='work-listings'>
              <div className='item'>Asbestikartoitus</div>
              <div className='item'> Purkutyöt/demolition</div>
              <div className='item'> Kosteusmittaus</div>
              <div className='item'> Jätteen kierrätys ja kuljetus</div>
              <div className='item'> Lattialämmitysasennus</div>
              <div className='item'> Vedeneristys asennus</div>
              <div className='item'>Paksuusmittaus</div>
            </div>
          </div> */}
              <div className='material-list'>
                <div className='material-title'>Material List</div>
                {plan?.material_listing?.map((material) => (
                  <div className='material-listings'>
                    <div className='item'>{material.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default withTranslation()(SummaryProjectPlan);
