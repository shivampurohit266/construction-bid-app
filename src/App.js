import React, { useState, useEffect, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import img from './images/404.jpg';
import './js/custom';
import './js/jquery.multiselect';
import { matchPath } from 'react-router';

// import "./icomoon.css";
//  router imports
import {
  Login,
  Terms_of_use,
  Signup,
  Forgot,
  Index,
  Logout,
  Feeds,
  first_Dashboard,
  Materiallisitngs,
  Worklistings,
  Createmateriallist,
  Createworklist,
  Materialofferdetails,
  Workdetail,
  Savedjobs,
  Myaccount,
  Confirm,
  ListDetails,
  Mycontracts,
  Mybid,
  Reset,
  Confirmed,
  MyNotifications,
  Biddetails,
  BidDetail,
  Carousel,
  MyActions,
  EditMaterials,
  BidersProfile,
  SharedProfile,
  PublicProfile,
  DeleteAccount,
} from './router/materialRouter';
import {
  Dashboard,
  // first_Dashboard,
  MyResources,
  ResourceListing,
  ProjectPlanning,
  BusinessProposal,
  BusinessPropsalCreate,
  Agreement,
  AgreementCreate,
  MyCustomers,
  Edit,
  CustomerListings,
  Invoice,
  InvoiceAgreement,
  Invoice_tabs,
  Print,
  InvoiceListing,
  ProposalListing,
  AgreementListing,
  Phase,
  Terms,
  PhaseListing,
  Permission,
  CreateRoles,
  CreateReport,
  ReportDetails,
  EditRoles,
  SelectPermission,
  QuickTask,
  TasksAndPlanning,
  PmsMessages,
  EditReport,
  ReportData,
  ManageTask,
  ReportEdit,
  CreateProject,
  ManageProjects,
  Archiveprojects,
  EditQuickTask,
  ProjectPlanningNew,
  ManageProjectPlan,
  SummaryProject,
} from './router/bussinessRouter';
import { PublicRoutes } from './router/PublicRoutes';
import { ProtectedRoutes } from './router/ProtectedRoutes';

// stylesheets
import './icomoon.css';
import './jquery.multiselect.css';
import PageNotFound from './components/pageNotFound/PageNotFound';
import terms from './components/myBussiness/terms/terms';
import EditListing from './components/marketPlace/EditListings/EditListing';
import Myprofile from './components/myAccount/myProfile/Myprofile';
//import SharedProfile from './components/myAccount/sharedProfile/SharedProfile';
import './style.css';
import './responsive.css';

// import
import './bootstrap.css';
import Header from './components/shared/Header';
import Sidebar from './components/shared/Sidebar';
import SignupSuccess from './components/login/SignupSuccess';
import Axios from 'axios';
import i18n from './locales/i18n';
import Spinner from 'react-bootstrap/Spinner';
// import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [count, setCount] = useState(
    localStorage.getItem('Login_user_permissions')
      ? localStorage.getItem('Login_user_permissions')
      : []
  );

  const [ip, setIP] = useState('');

  const [loggedIn, setloggedIn] = useState(
    localStorage.getItem('token') ? true : false
  );

  const filter_marketplace_prodesk =
    count.length > 0
      ? JSON.parse(count)?.filter((x) => x === 'marketplace_prodesk')
      : [];
  const filter_marketplace_feeds =
    count.length > 0
      ? JSON.parse(count)?.filter((x) => x === 'marketplace_feeds')
      : [];
  const filter_marketplace_materials =
    count.length > 0
      ? JSON.parse(count)?.filter((x) => x === 'marketplace_materials')
      : [];
  const filter_marketplace_materials_create =
    count.length > 0
      ? JSON.parse(count)?.filter((x) => x === 'marketplace_materials_create')
      : [];
  // const filter_marketplace_materials_details = count.length > 0 ? JSON.parse(count)?.filter((x) => x === "marketplace_materials_details"): [];
  const filter_marketplace_work =
    count.length > 0
      ? JSON.parse(count)?.filter((x) => x === 'marketplace_work')
      : [];
  const filter_marketplace_work_create =
    count.length > 0
      ? JSON.parse(count)?.filter((x) => x === 'marketplace_work_create')
      : [];
  // const filter_marketplace_work_details = count.length > 0 ? JSON.parse(count)?.filter((x) => x === "marketplace_work_details") : [];
  const filter_marketplace_mycontact =
    count.length > 0
      ? JSON.parse(count)?.filter((x) => x === 'marketplace_mycontact')
      : [];
  const filter_marketplace_mybids =
    count.length > 0
      ? JSON.parse(count)?.filter((x) => x === 'marketplace_mybids')
      : [];
  const filter_marketplace_saved_jobs =
    count.length > 0
      ? JSON.parse(count)?.filter((x) => x === 'marketplace_saved_jobs')
      : [];

  const Layout = ({ children }) => {
    return (
      <>
        <Header />
        {children}
      </>
    );
  };

  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Signup} />
          <Route exact path='/forgot' component={Forgot} />
          <Route exact path='/register-success' component={SignupSuccess} />
          <Route exact path='/terms-of-use' component={Terms_of_use} />
          <Route exact path='/confirmed' component={Confirmed} />
          <Route exact path='/reset/:token?' component={Reset} />
          <Route
            exact
            path='/delete_account_confirmation/:id?'
            component={DeleteAccount}
          />
          <Route
            exact
            path='/public-profile/:user?/:profileURL?'
            component={SharedProfile}
          />

          <Route>
            <Layout>
              <Switch>
                <Route exact path='/Dashboard' component={first_Dashboard} />
                <Route exact path='/index' component={Index} />
                <Route exact path='/logout' component={Logout} />
                <Route exact path='/feeds' component={Feeds} />
                <Route
                  exact
                  path='/material-list'
                  component={Materiallisitngs}
                />
                <Route exact path='/work-list' component={Worklistings} />
                <Route exact path='/Print' component={Print} />
                <Route
                  exact
                  path='/create-material-list/:id?'
                  component={Createmateriallist}
                />
                <Route
                  exact
                  path='/create-work-list/:id?'
                  component={Createworklist}
                />
                <Route
                  exact
                  path='/material-offer-detail/:id'
                  component={Materialofferdetails}
                />
                <Route exact path='/work-detail/:id' component={Workdetail} />
                <Route exact path='/saved' component={Savedjobs} />
                <Route exact path='/myaccount' component={Myaccount} />
                <Route exact path='/confirm/:id' component={Confirm} />
                <Route
                  exact
                  path='/listing-detail/:id'
                  component={ListDetails}
                />
                <Route exact path='/my-contracts' component={Mycontracts} />
                <Route exact path='/my-bids' component={Mybid} />
                <Route exact path='/Biddetails/:id?' component={Biddetails} />
                <Route
                  exact
                  path='/bid-detail/:id?/:userid?'
                  component={BidDetail}
                />
                <Route exact path='/my-notif' component={MyNotifications} />
                <Route exact path='/business-dashboard' component={Dashboard} />
                <Route exact path='/create-project' component={CreateProject} />
                <Route
                  exact
                  path='/manage-projects'
                  component={ManageProjects}
                />
                <Route
                  exact
                  path='/archive-projects'
                  component={Archiveprojects}
                />
                <Route
                  exact
                  path='/summary-project/:id'
                  component={SummaryProject}
                />
                <Route exact path='/myresources' component={MyResources} />
                <Route exact path='/myresources/:id' component={MyResources} />
                <Route
                  exact
                  path='/resource-list'
                  component={ResourceListing}
                />
                {/* <Route
                  exact
                  path='/proposal-projectplanning'
                  component={ProjectPlanning}
                /> */}
                <Route
                  exact
                  path='/proposal-projectplanning-new/:val?'
                  component={ProjectPlanningNew}
                />
                <Route
                  exact
                  path='/proposal-projectplanning-listing'
                  component={ManageProjectPlan}
                />
                <Route exact path='/myproposal' component={BusinessProposal} />
                <Route
                  exact
                  path='/proposal-listing'
                  component={ProposalListing}
                />
                <Route
                  exact
                  path='/business-proposal-create/:tender?/:customer?/:draft?'
                  component={BusinessPropsalCreate}
                />
                <Route exact path='/myagreement' component={Agreement} />
                <Route
                  exact
                  path='/agreement-listing'
                  component={AgreementListing}
                />
                <Route
                  exact
                  path='/business-agreement-create/:tender?/:customer?/:draft?'
                  component={AgreementCreate}
                />
                <Route exact path='/mycustomers' component={MyCustomers} />
                <Route exact path='/mycustomers_edit/:id' component={Edit} />
                <Route
                  exact
                  path='/customers-list'
                  component={CustomerListings}
                />
                <Route
                  exact
                  path='/invoice/:invoice_type?/:tender?/:customer?/:draft?'
                  component={Invoice}
                />
                <Route
                  exact
                  path='/invoice-agreement/:id?'
                  component={InvoiceAgreement}
                />
                <Route exact path='/invoice' component={Invoice} />
                <Route exact path='/Invoice-tabs' component={Invoice_tabs} />
                <Route exact path='/invoice-list' component={InvoiceListing} />
                <Route exact path='/myphases/:id?' component={Phase} />
                <Route exact path='/terms' component={Terms} />
                <Route exact path='/phase-list' component={PhaseListing} />
                <Route exact path='/roles/create' component={CreateRoles} />
                <Route exact path='/roles/edit' component={EditRoles} />
                <Route exact path='/permission' component={Permission} />
                <Route
                  exact
                  path='/permission/:id'
                  component={SelectPermission}
                />
                <Route exact path='/report-listing' component={CreateReport} />
                <Route exact path='/create-task' component={QuickTask} />
                <Route exact path='/edit-task' component={EditQuickTask} />
                <Route exact path='/task-listing' component={ManageTask} />
                <Route exact path='/Carousel' component={Carousel} />
                <Route exact path='/my-actions/:id?' component={MyActions} />
                <Route
                  exact
                  path='/create-report/report-details'
                  component={ReportDetails}
                />
                <Route
                  exact
                  path='/create-report/edit/:id'
                  component={EditReport}
                />
                <Route
                  exact
                  path='/tasks-and-planning/:id/:title?'
                  component={TasksAndPlanning}
                />
                <Route
                  exact
                  path='/pms/messages/:id/:title?'
                  component={PmsMessages}
                />
                <Route
                  exact
                  path='/listing-detail/edit/:id'
                  component={EditListing}
                />
                <Route
                  exact
                  path='/listing-detail/copy/:id'
                  component={EditListing}
                />
                <Route exact path='/myprofile' component={Myprofile} />
                <Route exact path='/profile/:id?' component={BidersProfile} />
                <Route exact path='/report-data/:id' component={ReportData} />
                <Route path='*' component={PageNotFound} />
              </Switch>
            </Layout>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
export default App;
