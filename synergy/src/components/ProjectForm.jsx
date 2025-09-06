// ProjectForm.jsx
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import './ProjectForm.css';

export const NewProjectForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    tags: '',
    manager: '',
    deadline: '',
    priority: 'medium',
    image: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      alert('Please fill in required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const projectData = {
        name: formData.name,
        description: formData.description,
        deadline: formData.deadline || null,
        priority: formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        image: formData.image || null
      };
      
      await onSubmit(projectData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="field-group">
          <label htmlFor="name" className="field-label">
            Name *
          </label>
          <div className="input-wrapper">
            <input
              id="name"
              name="name"
              className="text-input"
              placeholder="Enter project name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Tags Field */}
        <div className="field-group">
          <div className="label-row">
            <label htmlFor="tags" className="field-label">
              Tags
            </label>
            <span className="type-indicator">
              Comma-separated values
            </span>
          </div>
          <div className="input-wrapper">
            <input
              id="tags"
              name="tags"
              className="text-input"
              placeholder="frontend, backend, api"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Project Manager Field */}
        <div className="field-group">
          <div className="label-row">
            <label htmlFor="manager" className="field-label">
              Project Manager
            </label>
            <span className="type-indicator">
              Optional
            </span>
          </div>
          <div className="input-wrapper">
            <input
              id="manager"
              name="manager"
              className="text-input"
              placeholder="Assign project manager"
              value={formData.manager}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Deadline Field */}
        <div className="field-group">
          <div className="label-row">
            <label htmlFor="deadline" className="field-label">
              Deadline
            </label>
            <span className="type-indicator">
              Date Selection Field
            </span>
          </div>
          <div className="input-wrapper">
            <input
              id="deadline"
              name="deadline"
              type="date"
              className="date-input"
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Priority Field */}
        <div className="field-group priority-group">
          <div className="label-row">
            <label className="field-label">
              Priority
            </label>
            <span className="type-indicator">
              Single Radio Selection
            </span>
          </div>
          <div className="radio-group">
            <div className="radio-item">
              <input 
                type="radio" 
                id="low" 
                name="priority" 
                value="low" 
                className="radio-input"
                checked={formData.priority === 'low'}
                onChange={handleChange}
              />
              <label htmlFor="low" className="radio-label">Low</label>
            </div>
            <div className="radio-item">
              <input 
                type="radio" 
                id="medium" 
                name="priority" 
                value="medium" 
                className="radio-input"
                checked={formData.priority === 'medium'}
                onChange={handleChange}
              />
              <label htmlFor="medium" className="radio-label">Medium</label>
            </div>
            <div className="radio-item">
              <input 
                type="radio" 
                id="high" 
                name="priority" 
                value="high" 
                className="radio-input"
                checked={formData.priority === 'high'}
                onChange={handleChange}
              />
              <label htmlFor="high" className="radio-label">High</label>
            </div>
          </div>
        </div>

        {/* Image URL Field */}
        <div className="field-group">
          <label htmlFor="image" className="field-label">
            Image URL
          </label>
          <div className="input-wrapper">
            <input
              id="image"
              name="image"
              type="url"
              className="text-input"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Description Field */}
        <div className="field-group">
          <label htmlFor="description" className="field-label">
            Description *
          </label>
          <div className="textarea-wrapper">
            <textarea
              id="description"
              name="description"
              className="textarea-input"
              placeholder="Enter project description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProjectForm;