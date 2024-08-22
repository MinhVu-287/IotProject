import React from 'react';

const Button = ({ label }) => {
  return (
    <button className="bg-white text-black py-2 px-4 rounded-md shadow-lg hover:bg-gray-200">
      {label}
    </button>
  );
};

export default Button;
