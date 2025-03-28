'use client';

import { FaSearch, FaCog, FaMagic, FaPlus, FaMusic, FaSubscript, FaTextHeight, FaShapes, FaQuestionCircle, FaBars } from 'react-icons/fa';
import { useState } from 'react';
import './Sidebar2.css';

export default function Sidebar2() {
  const [active, setActive] = useState('Media');

  const menuItems = [
    { name: 'Search', icon: <FaSearch /> },
    { name: 'Settings', icon: <FaCog /> },
    { name: 'Brand Kits', icon: <FaMagic /> },
    { name: 'Media', icon: <FaPlus />, activeClass: 'active' },
    { name: 'Audio', icon: <FaMusic /> },
    { name: 'Subtitles', icon: <FaSubscript /> },
    { name: 'Text', icon: <FaTextHeight /> },
    { name: 'Elements', icon: <FaShapes /> },
  ];

  return (
    <div className="sidebar">
      {/* Hamburger Menu */}
      <div className="hamburger">
        <FaBars />
      </div>
      
      {/* Menu Items */}
      {menuItems.map((item) => (
        <div
          key={item.name}
          className={`menu-item ${active === item.name ? item.activeClass || '' : ''}`}
          onClick={() => setActive(item.name)}
        >
          <div className="icon-container">{item.icon}</div>
          <p>{item.name}</p>
        </div>
      ))}
      
      {/* Help Icon */}
      <div className="help-icon">
        <FaQuestionCircle />
      </div>
    </div>
  );
}
