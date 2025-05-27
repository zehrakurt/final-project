import { useState } from 'react';

export default function CollapsibleSection({ title, children,className }:any) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={className}> 
      <button onClick={toggleSection} className="ftr-77">
        {isOpen ? '-' : '+'} <span>{title}</span>
      </button>
      <div
        style={{
          maxHeight: isOpen ? '700px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
          padding: isOpen ? '1rem' : '0',
        }}
      >
        {children}
      </div>
    </div>
  );
}
