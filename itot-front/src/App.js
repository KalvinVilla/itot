import {
    BrowserRouter as Router,
    Route,
    Link,
    Routes
  } from "react-router-dom";
import HostTable from "./components/HostTable.js";
import VLanList from "./components/VLanList.js";
  
  function App() {
    return (
      <HostTable />
      // <Router>
      //   <div>
      //     <nav>
      //       <ul>
      //         <li>
      //           <Link to="/">Home</Link>
      //         </li>
      //         <li>
      //           <Link to="/about">About</Link>
      //         </li>
      //       </ul>
      //     </nav>
      //   <Routes>
      //       <Route exact path="/" component={VLanList} />
      //       <Route path="/about" component={About} />
      //   </Routes>

      //   </div>
      // </Router>
    );
  }

export default App