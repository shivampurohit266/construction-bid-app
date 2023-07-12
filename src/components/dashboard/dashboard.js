import './_dashboard.css';
import * as React from 'react';
import Header from '../shared/Header';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { url } from '../../helper/helper';
import Sidebar from '../shared/Sidebar';
import { Si } from 'react-flags-select';

const QuicklinkCard = ({ title, children, location }) => (
  <div className='quicklink-card'>
    <h3 className='quicklink-card__title'>{title}</h3>
    <div className='quicklink-card__content'>{children}</div>
  </div>
);

const MarketplaceCard = () => {
  const { t } = useTranslation();

  return (
    <QuicklinkCard title={t('firtDashboard.quicklinks.marketplace.title')}>
      <ul>
        <li>
          <Link to='/myaccount'>
            {t('firtDashboard.quicklinks.marketplace.userAccount')}
          </Link>
        </li>
        <li>
          <Link to='/feeds'>
            {t('firtDashboard.quicklinks.marketplace.browseNotifications')}
          </Link>
        </li>
        <li>
          <Link to='/create-work-list'>
            {t('firtDashboard.quicklinks.marketplace.newJobOpening')}
          </Link>
        </li>
        <li>
          <Link to='/create-material-list'>
            {t('firtDashboard.quicklinks.marketplace.newMaterialNotification')}
          </Link>
        </li>
        <li>
          <Link to='/business-dashboard'>
            {t('firtDashboard.quicklinks.marketplace.viewOffers')}
          </Link>
        </li>
      </ul>
    </QuicklinkCard>
  );
};

const BusinessCard = () => {
  const { t } = useTranslation();

  return (
    <QuicklinkCard title={t('firtDashboard.quicklinks.business.title')}>
      <ul>
        <li>
          <Link to='/business-proposal-create'>
            {t('firtDashboard.quicklinks.business.newOffer')}
          </Link>
        </li>
        <li>
          <Link to='/business-agreement-create'>
            {t('firtDashboard.quicklinks.business.newContract')}
          </Link>
        </li>
        <li>
          <Link to='/invoice'>
            {t('firtDashboard.quicklinks.business.newInvoice')}
          </Link>
        </li>
        <li>
          <Link to=''>{t('firtDashboard.quicklinks.business.newReport')}</Link>
        </li>
        <li>
          <Link to='/mycustomers'>
            {t('firtDashboard.quicklinks.business.newCustomer')}
          </Link>
        </li>
        <li>
          <Link to='/myresources'>
            {t('firtDashboard.quicklinks.business.newResource')}
          </Link>
        </li>
      </ul>
    </QuicklinkCard>
  );
};

const ProjectToolsCard = () => {
  const _didUnmountRef = React.useRef(false);

  const [pmsToken, setPmsToken] = React.useState(null);

  React.useEffect(
    () => () => {
      _didUnmountRef.current = true;
    },
    []
  );

  React.useEffect(() => {
    axios
      .get(`${url}/api/prousers/token/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(({ data: { token } }) => {
        if (!_didUnmountRef.current) {
          setPmsToken(token);
        }
      });
  }, [setPmsToken]);

  const { t } = useTranslation();

  if (!pmsToken) {
    return (
      <QuicklinkCard title={t('firtDashboard.quicklinks.projectTools.title')} />
    );
  } else {
    return (
      <QuicklinkCard title={t('firtDashboard.quicklinks.projectTools.title')}>
        <ul>
          <li>
            <a href='/myresources'>
              {t('firtDashboard.quicklinks.projectTools.addResources')}
            </a>
          </li>
          <li>
            <a href='/mycustomers'>
              {t('firtDashboard.quicklinks.projectTools.addCustomer')}
            </a>
          </li>
          <li>
            <a href={`${url}/pms/sso?token=${pmsToken}`}>
              {t('firtDashboard.quicklinks.projectTools.newProject')}
            </a>
          </li>
          <li>
            <a href={`${url}/pms/sso?token=${pmsToken}`}>
              {t('firtDashboard.quicklinks.projectTools.newQuicktask')}
            </a>
          </li>
          <li>{t('firtDashboard.quicklinks.projectTools.communicate')}</li>
          <li>
            <a href={`${url}/pms/sso?token=${pmsToken}`}>
              {t('firtDashboard.quicklinks.projectTools.followProjects')}
            </a>
          </li>
        </ul>
      </QuicklinkCard>
    );
  }
};

const IntroCard = () => {
  const { t } = useTranslation();

  return (
    <QuicklinkCard title={t('firtDashboard.quicklinks.intro.title')}>
      <ul>
        <li>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://www.youtube.com/watch?v=SEg6rl38eZU'
          >
            {t('firtDashboard.quicklinks.intro.marketplace')}
          </a>
        </li>
        <li>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://www.youtube.com/watch?v=SEg6rl38eZU'
          >
            {t('firtDashboard.quicklinks.intro.business')}
          </a>
        </li>
        <li>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://www.youtube.com/watch?v=SEg6rl38eZU'
          >
            {t('firtDashboard.quicklinks.intro.projectTools')}
          </a>
        </li>
      </ul>
    </QuicklinkCard>
  );
};

const OtherServicesCard = () => {
  const { t } = useTranslation();

  return (
    <QuicklinkCard title={t('firtDashboard.quicklinks.otherServices.title')}>
      <ul>
        <li>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='/proppu-muut-palvelut.pdf'
          >
            {t('firtDashboard.quicklinks.otherServices.ownWebPages')}
          </a>
        </li>
        <li>{t('firtDashboard.quicklinks.otherServices.commonInvestment')}</li>
        <li>{t('firtDashboard.quicklinks.otherServices.bookKeeping')}</li>
      </ul>
    </QuicklinkCard>
  );
};

const ContactCard = () => {
  const { t } = useTranslation();

  return (
    <QuicklinkCard title={t('firtDashboard.quicklinks.contact.title')}>
      <ul>
        <li>
          <a href='mailto:noora.kuisma@proppu.com'>
            {t('firtDashboard.quicklinks.contact.sendEmail')}
          </a>
        </li>
        <li>{t('firtDashboard.quicklinks.contact.call')}</li>
      </ul>
    </QuicklinkCard>
  );
};

const Dashboard = () => {
  const { t } = useTranslation();

  const header = t('firtDashboard.header');
  const secondary = t('firtDashboard.second_h');
  const p1 = t('firtDashboard.firstDescription');
  const p2 = t('firtDashboard.secondDescription');
  const p3 = t('firtDashboard.third_des');

  return (
    <section className='dashboard'>
      {/* <Header active={'Dashboard'} /> */}
      <div className='sidebar-toggle'></div>
      <div className='main-content'>
        <Sidebar dataFromParent={'/Dashboard'} />
        <div className='page-content'>
          <div className='dashboard-wrapper'>
            <div className='dashboard-wrapper-content'>
              <h1 className='dashboard__heading'>{header}</h1>
              <h2 className='dashboard__heading'>{secondary}</h2>
              <div className='dashboard__text-content'>
                <p>{p1}</p>
                <p>{p2}</p>
                <p>{p3}</p>
              </div>
              <div className='quicklink-container'>
                <MarketplaceCard />
                <BusinessCard />
                <ProjectToolsCard />
                <IntroCard />
                <OtherServicesCard />
                <ContactCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
