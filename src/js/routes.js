import NotFoundPage from "../features/home/presentation/404.f7";
import Home from "../features/home/presentation/home.f7";
import { initLoginPage } from './pages/login';
import { initRegisterPage } from './pages/register';
import { initForgotPasswordPage, initResetPasswordPage } from './pages/password-reset';
import { AuthUseCase } from './usecases/authUseCase';

var routes = [
    {
        path: '/login/',
        url: './pages/login.html',
        on: {
            pageInit: initLoginPage
        }
    },
    {
        path: '/register/',
        url: './pages/register.html',
        on: {
            pageInit: initRegisterPage
        }
    },
    {
        path: '/forgot-password/',
        url: './pages/forgot-password.html',
        on: {
            pageInit: initForgotPasswordPage
        }
    },
    {
        path: '/reset-password/',
        url: './pages/reset-password.html',
        on: {
            pageInit: initResetPasswordPage
        }
    },
    {
        path: "/",
        component: Home,
    },
    {
        path: "(.*)",
        component: NotFoundPage,
    },
];

export default routes;