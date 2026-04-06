/* src/components/Knowledge/EntityEditor/EntityEditor.jsx */
import React, { useState, useEffect } from 'react';
import Input from '../../common/Input/Input';
import Button from '../../common/Button/Button';
import './EntityEditor.css';

const EntityEditor = ({ entity, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'location',
    description: '',
    aliases: ''
  });

  useEffect(() => {
    if (entity) {
      setFormData({
        name: entity.name || entity.title || '',
        type: entity.type || entity.category || 'location',
        description: entity.description || entity.content || '',
        aliases: Array.isArray(entity.aliases) ? entity.aliases.join('、') : (entity.aliases || '')
      });
    }
  }, [entity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      aliases: typeof formData.aliases === 'string' 
        ? formData.aliases.split(/[、,，\s]+/).filter(a => a.trim() !== '')
        : []
    });
  };

  return (
    <form className="knowledge-editor" onSubmit={handleSubmit}>
      <Input
        label="实体名称"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="例如：青云宗、斩妖剑"
        required
      />

      <div className="form-group">
        <label className="input-label">实体类型</label>
        <select className="input-field" name="type" value={formData.type} onChange={handleChange}>
          <option value="location">地点</option>
          <option value="item">物品</option>
          <option value="organization">组织</option>
          <option value="concept">设定/概念</option>
        </select>
      </div>

      <Input
        label="别名 (用、分隔)"
        name="aliases"
        value={formData.aliases}
        onChange={handleChange}
        placeholder="例如：云顶之巅、第一禁地"
      />

      <div className="form-group">
        <label className="input-label">描述</label>
        <textarea
          className="input-field"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="详细描述该实体的特征、历史或特殊属性..."
          rows={4}
          required
        />
      </div>

      <div className="editor-actions">
        <Button type="button" variant="ghost" onClick={onCancel}>取消</Button>
        <Button type="submit" variant="primary">保存实体</Button>
      </div>
    </form>
  );
};

export default EntityEditor;
