// App.jsx
import './App.css';
import {Outlet} from 'react-router-dom'
import toast , {Toaster} from 'react-hot-toast'
import DummyPayment from "./components/DummyPayment";
import RealPayment from './components/RealPayment';
import RazorpayCheckout from './components/RazorpayCheckout';

// function App() {
//   return (
//     <>
//     <Toaster/>
//     <main>
//       <Outlet/>
//     </main>
//     </>
//   )
// }

function App() {
  return <RazorpayCheckout />;
}
export default App;