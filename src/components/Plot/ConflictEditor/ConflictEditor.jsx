/* src/components/Plot/ConflictEditor/ConflictEditor.jsx */
import React, { useState, useEffect } from 'react';
import Input from '../../common/Input/Input';
import Button from '../../common/Button/Button';
import './ConflictEditor.css';

const ConflictEditor = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    description: '',
    type: 'external',
    parties: '',
    startChapter: 1,
    status: 'active',
    resolution: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        description: item.description || '',
        type: item.type || 'external',
        parties: item.parties?.join('、') || '',
        startChapter: item.startChapter || 1,
        status: item.status || 'active',
        resolution: item.resolution || ''
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      parties: formData.parties.split(/[、,，\s]+/).filter(p => p.trim() !== '')
    });
  };

  return (
    <form className="plot-editor" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="input-label">冲突描述</label>
        <textarea
          className="input-field"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="描述冲突的核心内容..."
          rows={3}
          required
        />
      </div>

      <Input
        label="冲突各方 (用、分隔)"
        name="parties"
        value={formData.parties}
        onChange={handleChange}
        placeholder="例如：林枫、黑衣人"
      />

      <div className="form-row">
        <div className="form-group flex-1">
          <label className="input-label">冲突类型</label>
          <select className="input-field" name="type" value={formData.type} onChange={handleChange}>
            <option value="external">外部矛盾</option>
            <option value="internal">内在冲突</option>
          </select>
        </div>
        <div className="form-group flex-1">
          <label className="input-label">爆发章节</label>
          <input 
            type="number" 
            className="input-field" 
            name="startChapter" 
            value={formData.startChapter} 
            onChange={handleChange}
            min={1}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="input-label">状态</label>
        <select className="input-field" name="status" value={formData.status} onChange={handleChange}>
          <option value="active">进行中</option>
          <option value="resolved">已解决</option>
          <option value="escalated">激化中</option>
        </select>
      </div>

      {formData.status === 'resolved' && (
        <div className="form-group">
          <label className="input-label">解决方式</label>
          <textarea
            className="input-field"
            name="resolution"
            value={formData.resolution}
            onChange={handleChange}
            placeholder="描述冲突是如何解决的..."
            rows={2}
          />
        </div>
      )}

      <div className="editor-actions">
        <Button type="button" variant="ghost" onClick={onCancel}>取消</Button>
        <Button type="submit" variant="primary">保存冲突</Button>
      </div>
    </form>
  );
};

export default ConflictEditor;
