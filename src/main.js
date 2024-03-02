import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import VueRouter from 'vue-router';
import LoginPage from './components/LoginPage.vue';
import HomePage from './components/HomePage.vue';
import CategoriesPage from './components/category/CategoriesPage.vue';
import AddCategory from './components/category/AddCategory.vue';
import EditCategory from './components/category/EditCategory.vue';
import NewsPage from './components/news/NewsPage.vue';
import AddNews from './components/news/AddNews.vue';
import EditNews from './components/news/EditNews.vue';
import UsersPage from './components/user/UsersPage.vue';
import AddUser from './components/user/AddUser.vue';
import EditUser from './components/user/EditUser.vue'
import SingleNewsPage from './components/SingleNewsPage.vue';
import PopularPage from './components/PopularPage.vue'
import AllCategories from './components/AllCategories.vue'
import NewsCategory from './components/NewsCategory.vue';
import NewsTag from './components/NewsTag.vue'
import SearchPage from './components/SearchPage.vue'

Vue.prototype.$axios = axios;

axios.interceptors.request.use(
  (config) => {
    const frontendPath = window.location.pathname;
    config.headers['Frontend-Path'] = frontendPath;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  { path: '/login', component: LoginPage },
  { path: '/', component: HomePage },
  { path: '/categories', component: CategoriesPage },
  { path: '/categories/add', component: AddCategory },
  {
    path: '/categories/:categoryId/edit',
    name: 'EditCategory',
    component: EditCategory
  },
  { path: '/news/add', component: AddNews },
  {
    path: '/news/:categoryId?',
    name: 'NewsPage',
    component: NewsPage,
  },
  {
    path: '/news/:newsId/edit',
    name: 'EditNews',
    component: EditNews
  },
  { path: '/users', component: UsersPage },
  { path: '/users/add', component: AddUser },
  {
    path: '/users/:userId/edit',
    name: 'EditUser',
    component: EditUser
  },
  {
    path: '/single-news/:newsId',
    name: 'SingleNewsPage',
    component: SingleNewsPage,
  },
  { path: '/popular', component: PopularPage },
  { path: '/all-categories', component: AllCategories },
  {
    path: '/category/:categoryId',
    name: 'NewsCategory',
    component: NewsCategory,
  },
  {
    path: '/tag/:tagId',
    name: 'NewsTag',
    component: NewsTag,
  },
  {
    path: '/search/:query',
    name: 'SearchPage',
    component: SearchPage,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
