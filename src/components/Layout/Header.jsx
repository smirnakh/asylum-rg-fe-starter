import React from 'react';
import { Image } from 'antd';
import { Link } from 'react-router-dom';
import Logo from '../../styles/Images/WhiteLogo.png';
import { colors } from '../../styles/data_vis_colors';
//import Profile from '../pages/Profile';
import { useAuth0 } from '@auth0/auth0-react';

const { primary_accent_color } = colors;

function HeaderContent() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: primary_accent_color,
      }}
    >
      <div className="hrf-logo">
        <a href="https://www.humanrightsfirst.org/">
          <Image width={100} src={Logo} preview={false} alt="HRF logo white" />
        </a>
      </div>
      <div>
        {isAuthenticated ? (
          <>
            <Link
              style={{ color: '#E2F0F7', paddingRight: '75px' }}
              to="/profile"
            >
              Profile
            </Link>
            <button
              style={{
                color: '#E2F0F7',
                paddingRight: '75px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => logout()}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            style={{
              color: '#E2F0F7',
              paddingRight: '75px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={() => loginWithRedirect()}
          >
            Login
          </button>
        )}
        <Link to="/" style={{ color: '#E2F0F7', paddingRight: '75px' }}>
          Home
        </Link>
        <Link to="/graphs" style={{ color: '#E2F0F7' }}>
          Graphs
        </Link>
      </div>
    </div>
  );
}

export { HeaderContent };
