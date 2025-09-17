import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { translate } from '../../utils/translations';

const Header = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="header" style={headerStyle}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1 style={titleStyle}>{translate(title)}</h1>
          </div>
          <div className="col-md-6 text-end">
            <div className="btn-group" role="group">
              <button
                className={`btn ${isActive('/pets') ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => navigate('/pets')}
                style={buttonStyle}
              >
                🐕 {translate('Pet List')}
              </button>
              <button
                className={`btn ${isActive('/pet-owners') ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => navigate('/pet-owners')}
                style={buttonStyle}
              >
                👥 {translate('Pet Owners List')}
              </button>
            </div>
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