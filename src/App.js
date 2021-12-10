import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import IssuesEdit from './pages/issuesEdit/issues';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<IssuesEdit />} />
          <Route path="/issues" element={<IssuesEdit />} />
          <Route path="/prit-sentry" element={<IssuesEdit />} />
          <Route path="/prit-sentry-list" element={<IssuesEdit />} />
          <Route path="/prit-sentry-edit" element={<IssuesEdit edit={ true }/>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
