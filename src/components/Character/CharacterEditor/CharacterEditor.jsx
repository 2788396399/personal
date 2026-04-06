/* src/components/Character/CharacterEditor/CharacterEditor.jsx */
import React, { useState, useEffect } from 'react';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';
import Textarea from '../../common/Textarea/Textarea';
import Tag from '../../common/Tag/Tag';
import './CharacterEditor.css';

const CharacterEditor = ({ character, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    identity: '',
    appearance: '',
    personality: {
      traits: [],
      habits: [],
      catchphrases: []
    },
    background: {
      origin: '',
      experiences: [],
      secrets: []
    },
    arc: {
      goal: '',
      innerConflict: '',
      growthTrack: ''
    }
  });

  const [traitInput, setTraitInput] = useState('');

  useEffect(() => {
    if (character) {
      setFormData({
        ...formData,
        ...character,
        personality: { ...formData.personality, ...character.personality },
        background: { ...formData.background, ...character.background },
        arc: { ...formData.arc, ...character.arc }
      });
    }
  }, [character]);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    if (section) {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [name]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const addTrait = () => {
    if (traitInput.trim()) {
      setFormData({
        ...formData,
        personality: {
          ...formData.personality,
          traits: [...formData.personality.traits, traitInput.trim()]
        }
      });
      setTraitInput('');
    }
  };

  const removeTrait = (index) => {
    setFormData({
      ...formData,
      personality: {
        ...formData.personality,
        traits: formData.personality.traits.filter((_, i) => i !== index)
      }
    });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('角色姓名不能为空');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="character-editor">
      <div className="character-editor-section">
        <h3 className="character-editor-section-title">基本信息</h3>
        <div className="character-editor-row">
          <Input 
            label="姓名" 
            name="name" 
            value={formData.name} 
            onChange={(e) => handleChange(e)} 
            placeholder="请输入角色姓名"
          />
          <Input 
            label="性别" 
            name="gender" 
            value={formData.gender} 
            onChange={(e) => handleChange(e)} 
            placeholder="男/女/未知"
          />
        </div>
        <div className="character-editor-row">
          <Input 
            label="年龄" 
            name="age" 
            value={formData.age} 
            onChange={(e) => handleChange(e)} 
            placeholder="请输入年龄"
          />
          <Input 
            label="身份/职业" 
            name="identity" 
            value={formData.identity} 
            onChange={(e) => handleChange(e)} 
            placeholder="请输入身份或职业"
          />
        </div>
        <Textarea 
          label="外貌描述" 
          name="appearance" 
          value={formData.appearance} 
          onChange={(e) => handleChange(e)} 
          placeholder="请输入外貌细节描述"
          rows={3}
        />
      </div>

      <div className="character-editor-section">
        <h3 className="character-editor-section-title">性格特征</h3>
        <div className="character-editor-tags">
          <label className="input-label">性格标签</label>
          <div className="character-editor-tag-input">
            <Input 
              value={traitInput} 
              onChange={(e) => setTraitInput(e.target.value)} 
              placeholder="按回车添加"
              onKeyPress={(e) => e.key === 'Enter' && addTrait()}
            />
            <Button onClick={addTrait}>添加</Button>
          </div>
          <div className="character-editor-tag-list">
            {formData.personality.traits.map((trait, index) => (
              <Tag key={index} closable onClose={() => removeTrait(index)} color="secondary">{trait}</Tag>
            ))}
          </div>
        </div>
        <Textarea 
          label="核心习惯/口头禅" 
          name="habits" 
          value={formData.personality.habits?.join('\n') || ''} 
          onChange={(e) => {
            setFormData({
              ...formData,
              personality: {
                ...formData.personality,
                habits: e.target.value.split('\n')
              }
            });
          }} 
          placeholder="每行一个习惯或口头禅"
          rows={3}
        />
      </div>

      <div className="character-editor-section">
        <h3 className="character-editor-section-title">背景故事</h3>
        <Textarea 
          label="出身背景/秘密" 
          name="origin" 
          value={formData.background.origin} 
          onChange={(e) => handleChange(e, 'background')} 
          placeholder="请输入背景故事或核心秘密"
          rows={4}
        />
      </div>

      <div className="character-editor-section">
        <h3 className="character-editor-section-title">角色弧光</h3>
        <Input 
          label="角色目标" 
          name="goal" 
          value={formData.arc.goal} 
          onChange={(e) => handleChange(e, 'arc')} 
          placeholder="本章或全书要达成的目标"
        />
        <Textarea 
          label="内在冲突" 
          name="innerConflict" 
          value={formData.arc.innerConflict} 
          onChange={(e) => handleChange(e, 'arc')} 
          placeholder="角色的核心矛盾或成长动力"
          rows={3}
        />
      </div>

      <div className="character-editor-footer">
        <Button variant="secondary" onClick={onCancel}>取消</Button>
        <Button variant="primary" onClick={handleSave}>保存角色</Button>
      </div>
    </div>
  );
};

export default CharacterEditor;
