import NotFoundPage from "../features/home/presentation/404.f7";
import Home from "../features/home/presentation/home.f7";

var routes = [
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
