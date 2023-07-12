// imports consisting of bussiness routes
import React from 'react';
const Index = React.lazy(() => import('../components/marketPlace/Index'));
const first_Dashboard = React.lazy(() =>
  import('../components/dashboard/dashboard')
);
const Logout = React.lazy(() => import('../components/login/Logout'));
const Dashboard = React.lazy(() =>
  import('../components/myBussiness/Dashboard')
);
const MyResources = React.lazy(() =>
  import('../components/myBussiness/myResources/MyResources')
);

const ResourceListing = React.lazy(() =>
  import('../components/myBussiness/myResources/ResourceListing')
);
const ProjectPlanning = React.lazy(() =>
  import('../components/myBussiness/myProposal/ProjectPlanning')
);
const BusinessProposal = React.lazy(() =>
  import('../components/myBussiness/myProposal/BusinessProposal')
);
const BusinessPropsalCreate = React.lazy(() =>
  import('../components/myBussiness/myProposal/BusinessPropsalCreate')
);
const Agreement = React.lazy(() =>
  import('../components/myBussiness/myAgreement/Agreement')
);
const AgreementCreate = React.lazy(() =>
  import('../components/myBussiness/myAgreement/AgreementCreate')
);
const MyCustomers = React.lazy(() =>
  import('../components/myBussiness/myCustomers/MyCustomers')
);
const Edit = React.lazy(() =>
  import('../components/myBussiness/myCustomers/Edit')
);
const CustomerListings = React.lazy(() =>
  import('../components/myBussiness/myCustomers/CustomerListings')
);
const Invoice = React.lazy(() =>
  import('../components/myBussiness/myInvoice/Invoice')
);
const Invoice_tabs = React.lazy(() =>
  import('../components/myBussiness/myInvoice/Invoice_tabs')
);
const InvoiceListing = React.lazy(() =>
  import('../components/myBussiness/myInvoice/InvoiceListing')
);
const ProposalListing = React.lazy(() =>
  import('../components/myBussiness/myProposal/ProposalListing')
);
const AgreementListing = React.lazy(() =>
  import('../components/myBussiness/myAgreement/AgreementListing')
);
const Phase = React.lazy(() =>
  import('../components/myBussiness/myPhases/Phase')
);
const PhaseListing = React.lazy(() =>
  import('../components/myBussiness/myPhases/PhaseListing')
);
const Print = React.lazy(() =>
  import('../components/myBussiness/modals/Print')
);
const Terms = React.lazy(() => import('../components/myBussiness/terms/terms'));

const Permission = React.lazy(() =>
  import('../components/myBussiness/myPermission/Permission')
);
const CreateRoles = React.lazy(() =>
  import('../components/myBussiness/myRoles/createRoles')
);
const EditRoles = React.lazy(() =>
  import('../components/myBussiness/myRoles/editRoles')
);
const CreateReport = React.lazy(() =>
  import('../components/myBussiness/Project/createReport/createReport')
);
const ReportDetails = React.lazy(() =>
  import('../components/myBussiness/Project/createReport/reportDetails')
);
const SelectPermission = React.lazy(() =>
  import('../components/myBussiness/myPermission/selectPermission')
);
const QuickTask = React.lazy(() =>
  import(
    '../components/myBussiness/Project/createproject/createquicktask/quickTask'
  )
);
const EditReport = React.lazy(() =>
  import('../components/myBussiness/Project/createReport/EditReport')
);
const ReportData = React.lazy(() =>
  import('../components/myBussiness/Project/createReport/ReportData/ReportData')
);
const Feeds = React.lazy(() => import('../components/marketPlace/Feeds'));
const Materiallisitngs = React.lazy(() =>
  import('../components/marketPlace/Materiallisitngs')
);
const Worklistings = React.lazy(() =>
  import('../components/marketPlace/Worklistings')
);
const Createmateriallist = React.lazy(() =>
  import('../components/marketPlace/Createmateriallist')
);
const Createworklist = React.lazy(() =>
  import('../components/marketPlace/Createworklist')
);
const Materialofferdetails = React.lazy(() =>
  import('../components/marketPlace/Materialofferdetails')
);
const Workdetail = React.lazy(() =>
  import('../components/marketPlace/Workdetail')
);
const Savedjobs = React.lazy(() =>
  import('../components/marketPlace/Savedjobs')
);
const Myaccount = React.lazy(() => import('../components/myAccount/Myaccount'));
const Confirm = React.lazy(() => import('../components/myAccount/Confirm'));
const ListDetails = React.lazy(() =>
  import('../components/marketPlace/listingdetails/ListDetails')
);
const Mycontracts = React.lazy(() =>
  import('../components/marketPlace/Mycontracts')
);
const Mybid = React.lazy(() => import('../components/marketPlace/Mybids'));
const MyActions = React.lazy(() =>
  import('../components/marketPlace/MyActions/MyActions')
);
const MyNotifications = React.lazy(() =>
  import('../components/marketPlace/MyNotifications')
);
const Biddetails = React.lazy(() =>
  import('../components/marketPlace/BidsComponents/Biddetails')
);
const BidDetail = React.lazy(() =>
  import('../components/marketPlace/bid_detail')
);
const Carousel = React.lazy(() =>
  import('../components/marketPlace/Carousel/Carousel')
);
const EditListing = React.lazy(() =>
  import('../components/marketPlace/EditListings/EditListing')
);
const BidersProfile = React.lazy(() =>
  import('../components/marketPlace/BidersProfile')
);

//const ReportEdit = React.lazy(() => import("../components/myBussiness/Project/createReport/ReportData/ReportEdit"));

export const ProtectedRoutes = [
  {
    path: '/index',
    name: 'Index',
    isAuthenticate: true,
    component: Index,
  },
  {
    path: '/material-list',
    name: 'Materiallisitngs',
    isAuthenticate: true,
    component: Materiallisitngs,
  },

  {
    path: '/work-list',
    name: 'Worklistings',
    isAuthenticate: true,
    component: Worklistings,
  },
  {
    path: '/create-material-list/:id?',
    name: 'Createmateriallist',
    isAuthenticate: true,
    component: Createmateriallist,
  },
  {
    path: '/Dashboard',
    name: 'Dashboard',
    isAuthenticate: true,
    component: first_Dashboard,
  },
  {
    path: '/material-offer-detail/:id',
    name: 'Materialofferdetails',
    isAuthenticate: true,
    component: Materialofferdetails,
  },
  {
    path: '/work-detail/:id',
    name: 'Workdetail',
    isAuthenticate: true,
    component: Workdetail,
  },
  {
    path: '/saved',
    name: 'Savedjobs',
    isAuthenticate: true,
    component: Savedjobs,
  },
  {
    path: '/myaccount',
    name: 'Myaccount',
    isAuthenticate: true,
    component: Myaccount,
  },
  {
    path: '/confirm/:id',
    name: 'Confirm',
    isAuthenticate: true,
    component: Confirm,
  },
  {
    path: '/listing-detail/:id',
    name: 'ListDetails',
    isAuthenticate: true,
    component: ListDetails,
  },
  {
    path: '/my-contracts',
    name: 'Mycontracts',
    isAuthenticate: true,
    component: Mycontracts,
  },
  {
    path: '/Dashboard',
    name: 'first_Dashboard',
    isAuthenticate: true,
    component: first_Dashboard,
  },
  {
    path: '/my-bids',
    name: 'Mybid',
    isAuthenticate: true,
    component: Mybid,
  },
  {
    path: '/my-actions/:id?',
    name: 'MyActions',
    isAuthenticate: true,
    component: MyActions,
  },
  {
    path: '/my-notif',
    name: 'MyNotifications',
    isAuthenticate: true,
    component: MyNotifications,
  },
  {
    path: '/Biddetails/:id?',
    name: 'Biddetails',
    isAuthenticate: true,
    component: Biddetails,
  },
  {
    path: '/bid-detail/:id?/:userid?',
    name: 'BidDetail',
    isAuthenticate: true,
    component: BidDetail,
  },
  {
    path: '/Carousel',
    name: 'Carousel',
    isAuthenticate: true,
    component: Carousel,
  },
  {
    path: '/listing-detail/edit/:id',
    name: 'EditListing',
    isAuthenticate: true,
    component: EditListing,
  },
  {
    path: '/listing-detail/copy/:id',
    name: 'EditListing',
    isAuthenticate: true,
    component: EditListing,
  },
  {
    path: '/profile/:id?',
    name: 'BidersProfile',
    isAuthenticate: true,
    component: BidersProfile,
  },
  {
    path: '/create-work-list/:id?',
    name: 'Createworklist',
    isAuthenticate: true,
    component: Createworklist,
  },
  {
    path: '/logout',
    name: 'Logout',
    isAuthenticate: true,
    component: Logout,
  },
  {
    path: '/feeds',
    name: 'Feeds',
    isAuthenticate: true,
    component: Feeds,
  },
  {
    path: '/business-dashboard',
    name: 'Business dashboard',
    isAuthenticate: true,
    component: Dashboard,
  },
  {
    path: '/myresources',
    name: 'MyResources',
    isAuthenticate: true,
    component: MyResources,
  },
  {
    path: '/myresources/id:',
    name: 'MyResources',
    isAuthenticate: true,
    component: MyResources,
  },
  {
    path: '/resource-list',
    name: 'resource list',
    isAuthenticate: true,
    component: ResourceListing,
  },
  {
    path: '/proposal-projectplanning',
    name: '',
    isAuthenticate: true,
    component: ProjectPlanning,
  },
  {
    path: '/myproposal',
    name: '',
    isAuthenticate: true,
    component: BusinessProposal,
  },
  {
    path: '/business-proposal-create/:tender?/:customer?/:draft?',
    name: '',
    isAuthenticate: true,
    component: BusinessPropsalCreate,
  },
  {
    path: '/myagreement',
    name: '',
    isAuthenticate: true,
    component: Agreement,
  },
  {
    path: '/business-agreement-create/:tender?/:customer?/:draft?',
    name: '',
    isAuthenticate: true,
    component: AgreementCreate,
  },
  {
    path: '/mycustomers',
    name: '',
    isAuthenticate: true,
    component: MyCustomers,
  },
  {
    path: '/mycustomers_edit/:id',
    name: '',
    isAuthenticate: true,
    component: Edit,
  },
  {
    path: '/customers-list',
    name: '',
    isAuthenticate: true,
    component: CustomerListings,
  },
  {
    path: '/invoice',
    name: '',
    isAuthenticate: true,
    component: Invoice,
  },
  {
    path: '/invoice/:tender?/:customer?/:draft?',
    name: '',
    isAuthenticate: true,
    component: Invoice,
  },
  {
    path: '/Invoice-tabs',
    name: '',
    isAuthenticate: true,
    component: Invoice_tabs,
  },
  {
    path: '/Print',
    name: '',
    isAuthenticate: true,
    component: Print,
  },
  {
    path: '/invoice-list',
    name: '',
    isAuthenticate: true,
    component: InvoiceListing,
  },
  {
    path: '/proposal-listing',
    name: '',
    isAuthenticate: true,
    component: ProposalListing,
  },
  {
    path: '/agreement-listing',
    name: '',
    isAuthenticate: true,
    component: AgreementListing,
  },
  {
    path: '/myphases/:id?',
    name: '',
    isAuthenticate: true,
    component: Phase,
  },
  {
    path: '/terms',
    name: '',
    isAuthenticate: true,
    component: Terms,
  },
  {
    path: '/phase-list',
    name: '',
    isAuthenticate: true,
    component: PhaseListing,
  },
  {
    path: '/permission',
    name: '',
    isAuthenticate: true,
    component: Permission,
  },
  {
    path: '/roles/create',
    name: '',
    isAuthenticate: true,
    component: CreateRoles,
  },
  {
    path: '/create-report',
    name: '',
    isAuthenticate: true,
    component: CreateReport,
  },
  {
    path: '/create-report/report-details',
    name: '',
    isAuthenticate: true,
    component: ReportDetails,
  },
  {
    path: '/roles/edit',
    name: '',
    isAuthenticate: true,
    component: EditRoles,
  },
  {
    path: '/permission/:id',
    name: '',
    isAuthenticate: true,
    component: SelectPermission,
  },
  {
    path: '/quicktask',
    name: '',
    isAuthenticate: true,
    component: QuickTask,
  },
  {
    path: '/create-report/edit/:id',
    name: '',
    isAuthenticate: true,
    component: EditReport,
  },
  {
    path: '/report-data/:id',
    name: '',
    isAuthenticate: true,
    component: ReportData,
  },
  // {
  //   path: '/create-report/edit/:id',
  //   name: '',
  //   isAuthenticate: true,
  //   component: ReportEdit,
  // },
];
