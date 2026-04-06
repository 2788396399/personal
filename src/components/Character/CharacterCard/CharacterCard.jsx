/* src/components/Character/CharacterCard/CharacterCard.jsx */
import React from 'react';
import Tag from '../../common/Tag/Tag';
import Button from '../../common/Button/Button';
import './CharacterCard.css';

const CharacterCard = ({ character, onEdit, onDelete, onViewDetails }) => {
  const { name, gender, age, identity, personality, appearances } = character;

  return (
    <div className="character-card" onClick={onViewDetails}>
      <div className="character-card-header">
        <div className="character-card-info">
          <h4 className="character-card-name">{name}</h4>
          <div className="character-card-basic">
            {identity && <span>{identity}</span>}
            {gender && <span>· {gender}</span>}
            {age && <span>· {age}岁</span>}
          </div>
        </div>
        {character.isAIExtracted && <Tag color="primary">AI 提取</Tag>}
      </div>

      {personality?.traits?.length > 0 && (
        <div className="character-card-personality">
          {personality.traits.map((trait, index) => (
            <Tag key={index} color="secondary" size="sm">{trait}</Tag>
          ))}
        </div>
      )}

      <div className="character-card-footer">
        <div className="character-card-actions">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            编辑
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            style={{ color: 'var(--color-danger)' }}
          >
            删除
          </Button>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
        >
          查看详情
        </Button>
      </div>
    </div>
  );
};

export default CharacterCard;
