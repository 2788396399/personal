/* src/components/Outline/BookOutlineEditor/BookOutlineEditor.jsx */
import React, { useState } from 'react';
import Button from '../../common/Button/Button';
import './BookOutlineEditor.css';

const BookOutlineEditor = ({ outline, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: outline?.title || '',
    genre: outline?.genre || '',
    theme: outline?.theme || '',
    synopsis: outline?.synopsis || '',
    estimatedWordCount: outline?.estimatedWordCount || 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimatedWordCount' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="book-outline-editor" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>作品名称</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="请输入作品名称"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>题材分类</label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            placeholder="如：玄幻、都市"
          />
        </div>
        <div className="form-group">
          <label>核心主题</label>
          <input
            type="text"
            name="theme"
            value={formData.theme}
            onChange={handleChange}
            placeholder="如：复仇、成长"
          />
        </div>
      </div>

      <div className="form-group">
        <label>预计总字数</label>
        <input
          type="number"
          name="estimatedWordCount"
          value={formData.estimatedWordCount}
          onChange={handleChange}
          step="10000"
        />
      </div>

      <div className="form-group">
        <label>故事梗概</label>
        <textarea
          name="synopsis"
          value={formData.synopsis}
          onChange={handleChange}
          placeholder="请输入全书梗概..."
          rows={8}
        />
      </div>

      <div className="book-outline-editor-footer">
        <Button variant="secondary" onClick={onCancel}>取消</Button>
        <Button variant="primary" type="submit">保存大纲</Button>
      </div>
    </form>
  );
};

export default BookOutlineEditor;
