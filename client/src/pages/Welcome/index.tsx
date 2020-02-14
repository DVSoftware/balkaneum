import React from 'react';

import {
  Typography,
} from 'antd';


export default function Welcome() {
  return <div>
    <Typography.Title>
      Welcome to Balkaneum 
    </Typography.Title>
    <p>
      To begin, add a new coin or select the existing one from the sidebar.
    </p>
  </div>;
};