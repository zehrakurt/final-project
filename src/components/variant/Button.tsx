import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    selected?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, selected, ...props }) => {
    return <button style={selected ? { border: '2px solid black' } : {}} {...props}>{children}</button>;
};