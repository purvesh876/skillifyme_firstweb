import { createBrowserRouter } from 'react-router-dom'
import App from "../App.jsx"
import AuthLayouts from '../layout'
import Home from '../pages/home/page.jsx'
import Contact from '../pages/contact/page.jsx'
import Blog from '../pages/blog/BlogPage.jsx'
import Courses from '../pages/courses/page.jsx'
import Testimonial from '../pages/testimonial/page.jsx'
import RegisterPage from "../pages/register/Page.jsx"
import LoginPage from "../pages/login/Page.jsx"
import GoogleExtraInfo from '../pages/register/GoogleExtraInfo.jsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <AuthLayouts><Home /></AuthLayouts>
            },
            {
                path: "home",
                element: <AuthLayouts><Home /></AuthLayouts>

            },
            {
                path:"register",
                element : <AuthLayouts><RegisterPage/></AuthLayouts>
            },
            {
                path : "extra-info",
                element : <AuthLayouts><GoogleExtraInfo/></AuthLayouts>
            },
            {
                path:"login",
                element : <AuthLayouts><LoginPage/></AuthLayouts>
            },
            {
                path: "contact",
                element: <AuthLayouts><Contact /></AuthLayouts>
            },
            {
                path: "blog",
                element: <AuthLayouts><Blog /></AuthLayouts>
            },
            {
                path: "courses",
                element: <AuthLayouts><Courses /></AuthLayouts>
            },
            {
                path: "testimonial",
                element: <AuthLayouts><Testimonial /></AuthLayouts>
            }
        ]
    }
])

export default router