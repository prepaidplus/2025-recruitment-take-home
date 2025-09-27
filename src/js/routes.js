//Added routes for new auth pages, augmenting existing routes

import NotFoundPage from "../features/home/presentation/404.f7";
import Home from "../features/home/presentation/home.f7";
import Login from "../features/auth/presentation/login.f7";
import Register from "../features/auth/presentation/register.f7";
import ResetRequest from "../features/auth/presentation/reset-request.f7";
import ResetPassword from "../features/auth/presentation/reset-password.f7";

var routes = [
    { path: "/", component: Home },
    { path: "/auth/login/", component: Login },
    { path: "/auth/register/", component: Register },
    { path: "/auth/reset-request/", component: ResetRequest },
    { path: "/auth/reset-password/", component: ResetPassword },
    { path: "(.*)", component: NotFoundPage },
];

export default routes;