import React, { ReactNode } from 'react';
import './OverlayPanel.css'; // Import your custom CSS

interface OverlayPanelProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
}

const OverlayPanel: React.FC<OverlayPanelProps> = ({ open, onClose, children }) => {
    if (!open) return null;

    return (
        <div className="overlay-panel">
            <div className="overlay-panel-content">
                <button className="overlay-panel-close" onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
            <div className="overlay-panel-backdrop" onClick={onClose}></div>
        </div>
    );
};

export default OverlayPanel;
