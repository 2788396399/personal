/* src/components/Project/NewProjectModal/NewProjectModal.jsx */
import React, { useState } from 'react';
import Modal from '../../common/Modal/Modal';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';

import './NewProjectModal.css';

const COVER_MAX_WIDTH = 900;
const COVER_MAX_HEIGHT = 1200;
const COVER_QUALITY = 0.72;

const loadImage = (src) => new Promise((resolve, reject) => {
  const image = new window.Image();
  image.onload = () => resolve(image);
  image.onerror = () => reject(new Error('图片加载失败'));
  image.src = src;
});

const readFileAsDataURL = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onloadend = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('图片读取失败'));
  reader.readAsDataURL(file);
});

const compressCoverImage = async (file) => {
  const source = await readFileAsDataURL(file);
  const image = await loadImage(source);
  const scale = Math.min(COVER_MAX_WIDTH / image.width, COVER_MAX_HEIGHT / image.height, 1);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    return source;
  }

  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', COVER_QUALITY);
};

const NewProjectModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [cover, setCover] = useState(null);
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!name.trim()) {
      setError('作品名称不能为空');
      return;
    }
    onCreate({ name, cover });
    setName('');
    setCover(null);
    setError('');
    onClose();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressedCover = await compressCoverImage(file);
      setCover(compressedCover);
    }
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        取消
      </Button>
      <Button variant="primary" onClick={handleCreate}>
        创建
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      title="新建作品"
      footer={footer}
    >
      <div className="new-project-form">
        <Input
          label="作品名称"
          placeholder="请输入作品名称"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value) setError('');
          }}
          error={error}
        />
        <div className="new-project-cover-section">
          <label className="input-label" style={{ marginBottom: 'var(--spacing-1)', display: 'block' }}>
            上传封面 (可选)
          </label>
          <div className="new-project-cover-upload" onClick={() => document.getElementById('cover-upload-input').click()}>
            {cover ? (
              <img src={cover} alt="封面预览" className="new-project-cover-preview" />
            ) : (
              <>
                <div className="new-project-cover-icon">📷</div>
                <div className="new-project-cover-text">点击上传封面</div>
              </>
            )}
            <input
              id="cover-upload-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NewProjectModal;
