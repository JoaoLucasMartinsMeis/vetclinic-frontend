import React from 'react';
import { useNavigate } from 'react-router-dom';
import { translate } from '../../utils/translations';

const Header = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="header" style={headerStyle}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1 style={titleStyle}>{translate(title)}</h1>
          </div>
          <div className="col-md-6 text-end">
            <button 
              className="btn btn-outline-light me-2"
              onClick={() => navigate('/pets')}
              style={buttonStyle}
            >
              {translate('Pet List')}
            </button>
            <button 
              className="btn btn-orange"
              onClick={() => navigate('/add-pet')}
              style={buttonStyle}
            >
              + {translate('Add Pet')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const headerStyle = {
  backgroundColor: '#2c3e50',
  color: 'white',
  padding: '20px 0',
  marginBottom: '30px'
};

const titleStyle = {
  margin: 0,
  fontSize: '2rem',
  fontWeight: 'bold'
};

const buttonStyle = {
  borderRadius: '20px',
  padding: '10px 20px',
  fontWeight: 'bold'
};

export default Header;