import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
const Dashboard = () => import(/* webpackChunkName: "dashboard" */"@/pages/Dashboard.vue");
const Profile = () => import(/* webpackChunkName: "common" */ "@/pages/Profile.vue");
const Notifications = () => import(/* webpackChunkName: "common" */"@/pages/Notifications.vue");
const Icons = () => import(/* webpackChunkName: "common" */ "@/pages/Icons.vue");
const Maps = () => import(/* webpackChunkName: "common" */ "@/pages/Maps.vue");
const Typography = () => import(/* webpackChunkName: "common" */ "@/pages/Typography.vue");
const TableList = () => import(/* webpackChunkName: "common" */ "@/pages/TableList.vue");
const StatisticUserReport = () => import(/* webpackChunkName: "common" */ "@/pages/StatisticUserReport.vue");
const LudiTiketi = () => import(/* webpackChunkName: "common" */ "@/pages/LudiTiketi.vue");
const Cashflow = () => import(/* webpackChunkName: "common" */ "@/pages/Cashflow.vue");
const BettingToday = () => import(/* webpackChunkName: "common" */ "@/pages/BettingToday.vue");
const SlipDetailedPreview = () => import(/* webpackChunkName: "common" */ "@/pages/SlipDetailedPreview.vue");


const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard
      },
      {
        path: "profile",
        name: "profile",
        component: Profile
      },
      {
        path: "notifications",
        name: "notifications",
        component: Notifications
      },
      {
        path: "icons",
        name: "icons",
        component: Icons
      },
      {
        path: "maps",
        name: "maps",
        component: Maps
      },
      {
        path: "typography",
        name: "typography",
        component: Typography
      },
      {
        path: "table-list",
        name: "table-list",
        component: TableList
      },
      {
        path:'statistic-user-report',
        name:'statistic-user-report',
        component: StatisticUserReport
      },
      {
        path:'ludi-tiketi',
        name:'ludi-tiketi',
        component: LudiTiketi
      },
      {
        path:'cashflow-report',
        name:'cashflow-report',
        component: Cashflow
      },
      {
        path:'betting-today',
        name:'betting-today',
        component:BettingToday
      },
      {
        path:'slip-view',
        name:'slip-view',
        component:SlipDetailedPreview
      }
    ]
  },
  { path: "*", component: NotFound },
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
