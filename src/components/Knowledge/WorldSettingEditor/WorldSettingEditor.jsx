/* src/components/Knowledge/WorldSettingEditor/WorldSettingEditor.jsx */
import React, { useState, useEffect } from 'react';
import Input from '../../common/Input/Input';
import Button from '../../common/Button/Button';
import './WorldSettingEditor.css';

const WorldSettingEditor = ({ setting, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'general',
    content: ''
  });

  useEffect(() => {
    if (setting) {
      setFormData({
        title: setting.title || setting.name || '',
        category: setting.category || setting.type || 'general',
        content: setting.content || setting.description || ''
      });
    }
  }, [setting]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="knowledge-editor" onSubmit={handleSubmit}>
      <Input
        label="设定标题"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="例如：灵力等级划分"
        required
      />

      <div className="form-group">
        <label className="input-label">设定分类</label>
        <select className="input-field" name="category" value={formData.category} onChange={handleChange}>
          <option value="general">通用</option>
          <option value="geography">地理</option>
          <option value="history">历史</option>
          <option value="magic_system">力量体系</option>
          <option value="culture">文化/习俗</option>
        </select>
      </div>

      <div className="form-group">
        <label className="input-label">详细内容</label>
        <textarea
          className="input-field"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="详细描述该世界观设定的具体内容..."
          rows={6}
          required
        />
      </div>

      <div className="editor-actions">
        <Button type="button" variant="ghost" onClick={onCancel}>取消</Button>
        <Button type="submit" variant="primary">保存设定</Button>
      </div>
    </form>
  );
};

export default WorldSettingEditor;
