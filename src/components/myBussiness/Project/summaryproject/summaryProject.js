import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../../shared/Breadcrumb';
import Sidebar from '../../../shared/Sidebar';
import Contract from './summaryContract';
import Offer from './summaryOffer';
import Request from './summaryRequest';
import ProjectPlan from './summaryProjectPlan';
import Reports from './summaryReport';
import Progress from './summaryProjectProgress';
import Conversations from './summaryConversations';
import Stakeholders from './summaryStakeholders';
import { useParams } from 'react-router-dom';
import Invoices from './summaryInvoices';
import { getData } from '../../../../helper/api';
import { url } from '../../../../helper/helper';

import './summaryProject.css';
const SummaryProject = ({ t, location }) => {
  const params = useParams();
  console.log(location.state);
  const [request, setRequest] = useState(true);
  const [offer, setOffer] = useState(false);
  const [contract, setContract] = useState(false);
  const [projectPlan, setProjectPlan] = useState(false);
  const [projectProgress, setProjectProgress] = useState(false);
  const [reports, setReports] = useState(false);
  const [conversations, setConversations] = useState(false);
  const [stakeholders, setStakeholders] = useState(false);
  const [invoices, setInvoices] = useState(false);
  const [requestData, setRequestData] = useState([]);
  const [offerData, setOfferData] = useState([]);
  const [contractData, setContractData] = useState([]);
  const [projectPlannning, setProjectPlanning] = useState([]);
  const [projectProgresses, setProjectProgresses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [stakeholder, setStakeholder] = useState([]);

  const boolean = [
    request,
    offer,
    contract,
    projectPlan,
    projectProgress,
    reports,
    conversations,
    stakeholders,
    invoices,
  ];

  const { proposal } = requestData || {};

  const tender = proposal?.tenderbids?.tender;
  const tenderbids = proposal?.tenderbids;

  const { tender_attachment_url, project_report_pdf_url, tb_attachment_url } =
    projectPlannning || {};
  const checkState = (array) => {
    return array.find((arr) => arr === true);
  };

  const callAppropriateFunc = (tab) => {
    switch (tab) {
      case request === true:
        return (
          <Request
            request={requestData}
            attachmentUrl={tender_attachment_url}
            tbAttachmentUrl={tb_attachment_url}
          />
        );
    }
    switch (tab) {
      case offer === true:
        return <Offer proposal={offerData} />;
    }
    switch (tab) {
      case contract === true:
        return <Contract contract={contractData} />;
    }
    switch (tab) {
      case projectPlan === true:
        return <ProjectPlan plan={projectPlannning} />;
    }
    switch (tab) {
      case projectProgress === true:
        return (
          <Progress
            progress={projectProgresses}
            plan={projectPlannning}
            loggedHours={projectProgresses?.map((duration) => duration.time)}
          />
        );
    }
    switch (tab) {
      case reports === true:
        return (
          <Reports
            documents={documents}
            report_url={project_report_pdf_url}
            plan={projectPlannning}
          />
        );
    }

    switch (tab) {
      case conversations === true:
        return <Conversations />;
    }
    switch (tab) {
      case stakeholders === true:
        return <Stakeholders stakeholder={stakeholder} />;
    }
    switch (tab) {
      case invoices === true:
        return <Invoices projectPlanning={projectPlannning} />;
    }
  };

  const summaryDetails = async () => {
    const token = localStorage.getItem('token');
    await getData(
      `${url}/api/project/project_summary/${params.id}`,
      token
    ).then((result) => {
      setRequestData(result?.data?.request);
      setOfferData(result?.data?.offer);
      setContractData(result?.data?.contract);
      setProjectPlanning(result?.data?.project_plan);
      setProjectProgresses(result?.data?.project_progress);
      setDocuments(result?.data?.documents);
      setStakeholder(result?.data?.stakeholders);
    });
  };
  useEffect(() => {
    summaryDetails();
  }, []);

  const { tender_title } = requestData?.tender || {};

  return (
    <div>
      {/* <Header active={'bussiness'} /> */}
      <Breadcrumb>
        <Link to='/' className='breadcrumb-item active' aria-current='page'>
          {/* {t('projectManagment.Resources.heading')} */}
          {t('projectManagment.Manage.title')}
        </Link>
        <li className='breadcrumb-item active' aria-current='page'>
          {/* {t('projectManagment.Resources.myResource')} */}
          Archive Project
        </li>
      </Breadcrumb>
      <div className='main-content'>
        <Sidebar dataFromParent={window.location.pathname} />

        <div className='page-content'>
          <div className='content-header'>
            <h2 className='page-content-header'>
              {tender_title !== undefined
                ? `${tender_title}`
                : `${location?.state?.title}`}{' '}
              - {t('projectManagment.Manage.details_summary')}
            </h2>
            <div className='btn-group'>
              <Link
                className='create-project'
                to='/create-report/report-details'
              >
                {t('projectManagment.Manage.download_all')}
              </Link>
            </div>
          </div>
          <div className='container-fluid'>
            <div className='myProjects_summary-headings'>
              <div>
                <button
                  onClick={() => {
                    setRequest(true);
                    setOffer(false);
                    setContract(false);
                    setProjectPlan(false);
                    setProjectProgress(false);
                    setReports(false);
                    setConversations(false);
                    setStakeholders(false);
                    setInvoices(false);
                  }}
                  className={request ? 'active' : ''}
                >
                  {t('projectManagment.Manage.request')}
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    setRequest(false);
                    setOffer(true);
                    setContract(false);
                    setProjectPlan(false);
                    setProjectProgress(false);
                    setReports(false);
                    setConversations(false);
                    setStakeholders(false);
                    setInvoices(false);
                  }}
                  className={offer ? 'active' : ''}
                >
                  {t('projectManagment.Manage.offer')}
                </button>
              </div>

              <div>
                <button
                  onClick={() => {
                    setRequest(false);
                    setOffer(false);
                    setContract(true);
                    setProjectPlan(false);
                    setProjectProgress(false);
                    setReports(false);
                    setConversations(false);
                    setStakeholders(false);
                    setInvoices(false);
                  }}
                  className={contract ? 'active' : ''}
                >
                  {t('projectManagment.Manage.contract')}
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    setRequest(false);
                    setOffer(false);
                    setContract(false);
                    setProjectPlan(true);
                    setProjectProgress(false);
                    setReports(false);
                    setConversations(false);
                    setStakeholders(false);
                    setInvoices(false);
                  }}
                  className={projectPlan ? 'active' : ''}
                >
                  {t('projectManagment.Manage.project_plan')}
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    setRequest(false);
                    setOffer(false);
                    setContract(false);
                    setProjectPlan(false);
                    setProjectProgress(true);
                    setReports(false);
                    setConversations(false);
                    setStakeholders(false);
                    setInvoices(false);
                  }}
                  className={projectProgress ? 'active' : ''}
                >
                  {t('projectManagment.Manage.progress_summary')}
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    setRequest(false);
                    setOffer(false);
                    setContract(false);
                    setProjectPlan(false);
                    setProjectProgress(false);
                    setReports(true);
                    setConversations(false);
                    setStakeholders(false);
                    setInvoices(false);
                  }}
                  className={reports ? 'active' : ''}
                >
                  {t('projectManagment.Manage.documents')}
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    setRequest(false);
                    setOffer(false);
                    setContract(false);
                    setProjectPlan(false);
                    setProjectProgress(false);
                    setReports(false);
                    setConversations(true);
                    setStakeholders(false);
                    setInvoices(false);
                  }}
                  className={conversations ? 'active' : ''}
                >
                  {t('projectManagment.Manage.conversations')}
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    setRequest(false);
                    setOffer(false);
                    setContract(false);
                    setProjectPlan(false);
                    setProjectProgress(false);
                    setReports(false);
                    setConversations(false);
                    setStakeholders(true);
                    setInvoices(false);
                  }}
                  className={stakeholders ? 'active' : ''}
                >
                  {t('projectManagment.Manage.stakeholders')}
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    setRequest(false);
                    setOffer(false);
                    setContract(false);
                    setProjectPlan(false);
                    setProjectProgress(false);
                    setReports(false);
                    setConversations(false);
                    setStakeholders(false);
                    setInvoices(true);
                  }}
                  className={invoices ? 'active' : ''}
                >
                  {t('projectManagment.Manage.invoices')}
                </button>
              </div>
            </div>
            <div className='myProfile-edit'></div>
            <div className='card' style={{ marginTop: '31px' }}>
              {callAppropriateFunc(checkState(boolean))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(SummaryProject);
