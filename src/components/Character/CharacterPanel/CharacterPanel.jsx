/* src/components/Character/CharacterPanel/CharacterPanel.jsx */
import React, { useState, useEffect } from 'react';
import useCharacterStore from '../../../stores/characterStore';
import CharacterCard from '../CharacterCard/CharacterCard';
import CharacterEditor from '../CharacterEditor/CharacterEditor';
import Modal from '../../common/Modal/Modal';
import Button from '../../common/Button/Button';
import Tag from '../../common/Tag/Tag';
import './CharacterPanel.css';

const CharacterPanel = ({ projectId }) => {
  const { characters, createCharacter, updateCharacter, deleteCharacter } = useCharacterStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [viewingCharacter, setViewingCharacter] = useState(null);

  // 过滤当前项目的角色
  const projectCharacters = characters.filter(c => c.projectId === projectId);

  const handleCreate = () => {
    setEditingCharacter(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (character) => {
    setEditingCharacter(character);
    setIsEditorOpen(true);
  };

  const handleSave = (characterData) => {
    if (editingCharacter) {
      updateCharacter(editingCharacter.id, characterData);
    } else {
      createCharacter({ ...characterData, projectId });
    }
    setIsEditorOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('确定要删除这个角色吗？')) {
      deleteCharacter(id);
    }
  };

  return (
    <div className="character-panel">
      <div className="character-panel-header">
        <h3 className="character-panel-title">角色卡片</h3>
        <div className="character-panel-actions">
          <Button variant="primary" size="sm" onClick={handleCreate}>
            ＋ 添加角色
          </Button>
        </div>
      </div>

      <div className="character-section">
        {projectCharacters.length > 0 ? (
          <div className="character-list">
            {projectCharacters.map((character) => (
              <CharacterCard 
                key={character.id} 
                character={character} 
                onEdit={() => handleEdit(character)}
                onDelete={() => handleDelete(character.id)}
                onViewDetails={() => setViewingCharacter(character)}
              />
            ))}
          </div>
        ) : (
          <div className="character-empty">
            还没有添加任何角色。点击上方按钮开始创建，或在写作时通过 AI 自动提取。
          </div>
        )}
      </div>

      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        closeOnOverlayClick={false}
        title={editingCharacter ? "编辑角色" : "添加新角色"}
        size="lg"
      >
        <CharacterEditor 
          character={editingCharacter} 
          onSave={handleSave} 
          onCancel={() => setIsEditorOpen(false)} 
        />
      </Modal>

      <Modal
        isOpen={!!viewingCharacter}
        onClose={() => setViewingCharacter(null)}
        closeOnOverlayClick={false}
        title={viewingCharacter?.name || "角色详情"}
        size="md"
        footer={<Button variant="primary" onClick={() => setViewingCharacter(null)}>确定</Button>}
      >
        {viewingCharacter && (
          <div className="character-details">
            <div className="character-details-section">
              <h4>基本信息</h4>
              <p><strong>姓名：</strong>{viewingCharacter.name}</p>
              <p><strong>性别：</strong>{viewingCharacter.gender}</p>
              <p><strong>年龄：</strong>{viewingCharacter.age}</p>
              <p><strong>身份：</strong>{viewingCharacter.identity}</p>
              <p><strong>外貌：</strong>{viewingCharacter.appearance}</p>
            </div>
            {viewingCharacter.personality?.traits?.length > 0 && (
              <div className="character-details-section">
                <h4>性格特征</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '8px 0' }}>
                  {viewingCharacter.personality.traits.map((t, i) => (
                    <Tag key={i} color="secondary">{t}</Tag>
                  ))}
                </div>
              </div>
            )}
            {viewingCharacter.background?.origin && (
              <div className="character-details-section">
                <h4>背景故事</h4>
                <p>{viewingCharacter.background.origin}</p>
              </div>
            )}
            {viewingCharacter.arc?.goal && (
              <div className="character-details-section">
                <h4>角色目标</h4>
                <p>{viewingCharacter.arc.goal}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CharacterPanel;
