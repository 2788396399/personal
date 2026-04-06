/* src/components/Plot/ForeshadowingEditor/ForeshadowingEditor.jsx */
import React, { useState, useEffect } from 'react';
import Input from '../../common/Input/Input';
import Button from '../../common/Button/Button';
import './ForeshadowingEditor.css';

const ForeshadowingEditor = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    content: '',
    importance: 'medium',
    plantChapter: 1,
    notes: '',
    status: 'pending'
  });

  useEffect(() => {
    if (item) {
      setFormData({
        content: item.content || '',
        importance: item.importance || 'medium',
        plantChapter: item.plantChapter || 1,
        notes: item.notes || '',
        status: item.status || 'pending'
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="plot-editor" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="input-label">伏笔内容</label>
        <textarea
          className="input-field"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="描述伏笔的具体内容..."
          rows={3}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group flex-1">
          <label className="input-label">重要程度</label>
          <select className="input-field" name="importance" value={formData.importance} onChange={handleChange}>
            <option value="high">核心伏笔</option>
            <option value="medium">重要线索</option>
            <option value="low">细节埋线</option>
          </select>
        </div>
        <div className="form-group flex-1">
          <label className="input-label">埋线章节</label>
          <input 
            type="number" 
            className="input-field" 
            name="plantChapter" 
            value={formData.plantChapter} 
            onChange={handleChange}
            min={1}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="input-label">状态</label>
        <select className="input-field" name="status" value={formData.status} onChange={handleChange}>
          <option value="pending">待回收</option>
          <option value="revealed">已揭示</option>
        </select>
      </div>

      <div className="form-group">
        <label className="input-label">备注</label>
        <textarea
          className="input-field"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="其他补充信息..."
          rows={2}
        />
      </div>

      <div className="editor-actions">
        <Button type="button" variant="ghost" onClick={onCancel}>取消</Button>
        <Button type="submit" variant="primary">保存伏笔</Button>
      </div>
    </form>
  );
};

export default ForeshadowingEditor;
