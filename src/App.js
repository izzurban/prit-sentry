import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Issues from './pages/issues';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Issues />} />
          <Route path="/issues" element={<Issues />} />
          {/* <Route path="/issueDetails" element={<IssuesDetails />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;