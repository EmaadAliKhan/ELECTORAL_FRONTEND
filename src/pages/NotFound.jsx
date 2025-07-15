import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{ textAlign: 'center', marginTop: '3rem' }}>
    <h2>404 - Not Found</h2>
    <p>Sorry, the page you are looking for does not exist.</p>
    <Link to="/">Go to Dashboard</Link>
  </div>
);

export default NotFound;