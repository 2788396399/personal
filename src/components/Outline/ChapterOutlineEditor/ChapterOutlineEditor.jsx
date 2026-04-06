/* src/components/Outline/ChapterOutlineEditor/ChapterOutlineEditor.jsx */
import React, { useState, useEffect } from 'react';
import Input from '../../common/Input/Input';
import Button from '../../common/Button/Button';
import './ChapterOutlineEditor.css';

const ChapterOutlineEditor = ({ chapter, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    objective: '',
    plotPoints: '',
    targetWordCount: 2000,
    status: 'in_progress'
  });

  useEffect(() => {
    if (chapter) {
      setFormData({
        title: chapter.title || '',
        objective: chapter.objective || '',
        plotPoints: chapter.plotPoints?.join('\n') || '',
        targetWordCount: chapter.targetWordCount || 2000,
        status: chapter.status || 'in_progress'
      });
    }
  }, [chapter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'targetWordCount' ? parseInt(value) || 0 : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      targetWordCount: parseInt(formData.targetWordCount) || 0,
      plotPoints: formData.plotPoints.split('\n').filter(p => p.trim() !== '')
    });
  };

  return (
    <form className="chapter-outline-editor" onSubmit={handleSubmit}>
      <Input
        label="章节标题"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="例如：第一章 初露锋芒"
        required
      />

      <Input
        label="目标字数"
        name="targetWordCount"
        type="number"
        value={formData.targetWordCount}
        onChange={handleChange}
        placeholder="本章计划创作的字数..."
        min={100}
        step={100}
        required
      />
      
      <div className="form-group">
        <label className="input-label">本章目标</label>
        <textarea
          className="input-field"
          name="objective"
          value={formData.objective}
          onChange={handleChange}
          placeholder="本章需要达成的核心剧情目标..."
          rows={3}
        />
      </div>

      <div className="form-group">
        <label className="input-label">主要情节点 (每行一个)</label>
        <textarea
          className="input-field"
          name="plotPoints"
          value={formData.plotPoints}
          onChange={handleChange}
          placeholder="1. 主角来到坊市&#10;2. 偶遇神秘老者&#10;3. 得到破损古剑"
          rows={6}
        />
      </div>

      <div className="form-group">
        <label className="input-label">状态</label>
        <select 
          className="input-field" 
          name="status" 
          value={formData.status} 
          onChange={handleChange}
        >
          <option value="in_progress">进行中</option>
          <option value="completed">已完成</option>
        </select>
      </div>

      <div className="editor-actions">
        <Button type="button" variant="ghost" onClick={onCancel}>取消</Button>
        <Button type="submit" variant="primary">保存大纲</Button>
      </div>
    </form>
  );
};

export default ChapterOutlineEditor;
