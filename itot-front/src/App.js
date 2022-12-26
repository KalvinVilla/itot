import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes.js';

import Login from './pages/Login.js';
import Vlan from "./pages/Vlan.js";

  function App() {
    return (
      <div>
        <Router>
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route element={<div>Hello</div>} path="/" exact />
              <Route path="/vlan">
                <Route path='' element={<Vlan />} />
                <Route path=":uid" element={<Vlan />} />
              </Route>
            </Route>
            <Route element={<Login />} path="/login" />
          </Routes>
        </Router>
      </div>

      
    );
  }

export default App