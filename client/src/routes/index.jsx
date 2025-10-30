import { createBrowserRouter } from 'react-router-dom'
import App from "../App.jsx"
import AuthLayouts from '../layout'
import Home from '../pages/home/page.jsx'
import Contact from '../pages/contact/page.jsx'
import Blog from '../pages/blog/page.jsx'
import Courses from '../pages/courses/page.jsx'
import Testimonial from '../pages/testimonial/page.jsx'

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