import React from 'react';

function Test() {
  return <div style={{ padding: '50px', fontSize: '24px', color: 'red' }}>
    <h1>TEST - If you see this, React is working!</h1>
    <p>Current time: {new Date().toLocaleTimeString()}</p>
  </div>;
}

export default Test;
