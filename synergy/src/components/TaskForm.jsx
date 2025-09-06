// TaskForm.jsx
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import './TaskForm.css';

export const NewTaskForm = ({ onSubmit, projects = [], currentProject }) => {
  const [formData, setFormData] = useState({
    name: '',
    assignee: '',
    project_id: currentProject?.id || '',
    tags: '',
    deadline: '',
    image: '',
    description: '',
    status: 'To-Do'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.description) {
      alert('Please fill in required fields: Name and Description');
      return;
    }
    
    if (!formData.project_id && !currentProject?.id) {
      alert('Please select a project');
      return;
    }

    setIsSubmitting(true);
    try {
      const taskData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        project_id: formData.project_id || currentProject?.id,
        deadline: formData.deadline || null,
        status: formData.status,
        assignee: formData.assignee.trim() || null,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        image: formData.image || null
      };
      
      console.log('Submitting task data:', taskData); // Debug log
      await onSubmit(taskData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Error creating task: ${error.message}`);
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
              placeholder="Enter task name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Assignee Field */}
        <div className="field-group">
          <label htmlFor="assignee" className="field-label">
            Assignee
          </label>
          <div className="input-wrapper">
            <input
              id="assignee"
              name="assignee"
              className="text-input"
              placeholder="Enter assignee email or name"
              value={formData.assignee}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Project Field */}
        <div className="field-group">
          <label htmlFor="project_id" className="field-label">
            Project *
          </label>
          <div className="input-wrapper">
            {currentProject ? (
              <input
                id="project_id"
                name="project_id"
                className="text-input"
                value={currentProject.name}
                disabled
                style={{ backgroundColor: 'var(--bg-tertiary)', cursor: 'not-allowed' }}
              />
            ) : (
              <select 
                id="project_id"
                name="project_id"
                className="select-input"
                value={formData.project_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Tags Field */}
        <div className="field-group">
          <label htmlFor="tags" className="field-label">
            Tags
          </label>
          <div className="input-wrapper">
            <input
              id="tags"
              name="tags"
              className="text-input"
              placeholder="frontend, api, urgent"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Status Field */}
        <div className="field-group">
          <label htmlFor="status" className="field-label">
            Status
          </label>
          <div className="input-wrapper">
            <select 
              id="status"
              name="status"
              className="select-input"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        {/* Deadline Field */}
        <div className="field-group">
          <label htmlFor="deadline" className="field-label">
            Deadline
          </label>
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
              placeholder="Enter task description"
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
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskForm;
