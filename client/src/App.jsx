// App.jsx
import './App.css';
import {Outlet} from 'react-router-dom'
import toast , {Toaster} from 'react-hot-toast'

function App() {
  return (
    <>
    <Toaster position="top-center" reverseOrder={false}/>
    <main>
      <Outlet/>
    </main>
    </>
  )
}

export default App;