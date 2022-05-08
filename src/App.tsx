import { Routes, Route, Link } from "react-router-dom";
import './App.scss';

import { Navbar, Nav } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';


import { Home } from './Home';
import { Trucks } from './Trucks';

function App() {
  return (
    <div className="app-root">
      <Navbar expand="lg">
        {/* <Container> */}
          <Navbar.Brand>metaTMS</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <Nav.Link><Link to="/">Home</Link></Nav.Link>
              <Nav.Link><Link to="/trucks">Trucks</Link></Nav.Link>
            </Nav>
          </Navbar.Collapse>
        {/* </Container> */}
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trucks" element={<Trucks />} />
      </Routes>
    </div>
  );
}

export default App;
