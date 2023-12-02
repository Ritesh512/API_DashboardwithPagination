import StickyHeadTable from "./StickyHeadTable";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <div className="App">
      <StickyHeadTable />
      <ToastContainer />
    </div>
  );
}

