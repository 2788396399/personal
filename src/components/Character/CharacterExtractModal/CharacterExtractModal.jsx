/* src/components/Character/CharacterExtractModal/CharacterExtractModal.jsx */
import React from 'react';
import Modal from '../../common/Modal/Modal';
import Button from '../../common/Button/Button';
import Tag from '../../common/Tag/Tag';
import './CharacterExtractModal.css';

const CharacterExtractModal = ({ isOpen, onClose, extractionData, onConfirm }) => {
  const { newCharacters = [], updates = [] } = extractionData || {};

  const handleConfirm = () => {
    onConfirm(extractionData);
    onClose();
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>忽略</Button>
      <Button variant="primary" onClick={handleConfirm}>确认应用</Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      title="AI 角色提取建议"
      size="lg"
      footer={footer}
    >
      <div className="character-extract-modal">
        {newCharacters.length > 0 && (
          <div className="character-extract-section">
            <h3 className="character-extract-section-title">
              🆕 发现新角色 ({newCharacters.length})
            </h3>
            {newCharacters.map((char, index) => (
              <div key={index} className="character-extract-item">
                <div className="character-extract-item-header">
                  <span className="character-extract-item-name">{char.name}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {char.gender && <Tag color="secondary">{char.gender}</Tag>}
                    {char.identity && <Tag color="primary">{char.identity}</Tag>}
                  </div>
                </div>
                {char.description && (
                  <div className="character-extract-item-desc">
                    {char.description}
                  </div>
                )}
                {char.personality && (
                  <div className="character-extract-item-details">
                    <span><strong>性格：</strong>{char.personality}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {updates.length > 0 && (
          <div className="character-extract-section">
            <h3 className="character-extract-section-title">
              📝 现有角色信息更新 ({updates.length})
            </h3>
            {updates.map((update, index) => (
              <div key={index} className="character-extract-item">
                <div className="character-extract-item-header">
                  <span className="character-extract-item-name">{update.name}</span>
                </div>
                <div className="character-extract-update-diff">
                  <span className="character-extract-update-field">{update.field}</span>
                  <div className="character-extract-update-values">
                    <span className="character-extract-update-old">{update.oldValue}</span>
                    <span>→</span>
                    <span className="character-extract-update-new">{update.newValue}</span>
                  </div>
                </div>
                {update.reason && (
                  <div className="character-extract-item-desc">
                    理由：{update.reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {newCharacters.length === 0 && updates.length === 0 && (
          <div className="character-empty">
            没有发现任何新的角色信息或更新建议。
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CharacterExtractModal;
