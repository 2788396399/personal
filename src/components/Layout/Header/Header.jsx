/* src/components/Layout/Header/Header.jsx */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button/Button';
import './Header.css';

const Header = ({ title, showBack = false, extra }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        {showBack && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            icon={<span>←</span>}
          >
            返回
          </Button>
        )}
        <h1 className="header-title">{title || 'AI小说创作助手'}</h1>
      </div>
      <div className="header-right">
        {extra}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/settings')}
          icon={<span>⚙️</span>}
        >
          设置
        </Button>
      </div>
    </header>
  );
};

export default Header;
