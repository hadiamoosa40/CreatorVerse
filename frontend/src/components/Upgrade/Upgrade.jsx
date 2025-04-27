import React, { useState } from "react";
import "./Upgrade.css";
import { Check, MessageSquare, Music, Image, Video, Code, Zap } from "lucide-react";

const Upgrade = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="upgrade-container">
      <button className="upgrade-button" onClick={toggleModal}>
        Upgrade <Zap size={16} />
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              Upgrade to Genius <span className="pro-badge">PRO</span>
            </h2>
            <ul className="feature-list">
              {[
                { icon: <MessageSquare />, text: "Conversation" },
                { icon: <Music />, text: "Music Generation" },
                { icon: <Image />, text: "Image Generation" },
                { icon: <Video />, text: "Video Generation" },
                { icon: <Code />, text: "Code Generation" },
              ].map((feature, index) => (
                <li key={index} className="feature-item">
                  <span className="feature-icon">{feature.icon}</span>
                  {feature.text}
                  <Check size={18} className="check-icon" />
                </li>
              ))}
            </ul>
            <button className="upgrade-modal-button" onClick={toggleModal}>
              Upgrade <Zap size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upgrade;
