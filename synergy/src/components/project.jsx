import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsAPI, tasksAPI } from '../api/api';
import NewProjectForm from './ProjectForm';
import NewTaskForm from './TaskForm';
import './App.css';

// --- SVG Icon Components ---
const Icon = ({ path, className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={{ width: '20px', height: '20px' }}>
        <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
);
const CompanyLogo = () => <svg className="sidebar-header-logo" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a1.125 1.125 0 011.125 1.125v1.125a1.125 1.125 0 01-1.125 1.125H9v-3.375z" /></svg>;
const FolderIcon = () => <Icon path="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />;
const TasksIcon = () => <Icon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />;
const SunIcon = () => <Icon path="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />;
const MoonIcon = () => <Icon path="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />;
const SearchIcon = () => <Icon path="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />;
const CalendarIcon = () => <Icon path="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />;
const TaskListIcon = () => <Icon path="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm10.293 2.293a1 1 0 011.414 0l2 2a1 1 0 01-1.414 1.414L14 15.414l-1.293 1.293a1 1 0 01-1.414-1.414l2-2z" />;
const PlusIcon = () => <Icon path="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />;
const XIcon = () => <Icon path="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />;
const LogoutIcon = () => <Icon path="M3 3a1 1 0 000 2v8a2 2 0 002 2h2a1 1 0 100-2H5V5a1 1 0 01-1-1zm3 4a1 1 0 011-1h7.586l-1.293-1.293a1 1 0 011.414-1.414l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L13.586 9H7a1 1 0 01-1-1z" />;

// --- Components ---
const ProjectCreationModal = ({ isOpen, onClose, onCreateProject }) => {
    if (!isOpen) return null;

    const handleSubmit = async (formData) => {
        try {
            await onCreateProject(formData);
            onClose();
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Create New Project</h2>
                    <button onClick={onClose} className="modal-close">
                        <XIcon />
                    </button>
                </div>
                <div className="modal-body">
                    <NewProjectForm onSubmit={handleSubmit} />
                </div>
            </div>
        </div>
    );
};

const TaskCreationModal = ({ isOpen, onClose, onCreateTask, projects }) => {
    if (!isOpen) return null;

    const handleSubmit = async (formData) => {
        try {
            await onCreateTask(formData);
            onClose();
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Create New Task</h2>
                    <button onClick={onClose} className="modal-close">
                        <XIcon />
                    </button>
                </div>
                <div className="modal-body">
                    <NewTaskForm onSubmit={handleSubmit} projects={projects} />
                </div>
            </div>
        </div>
    );
};

const Sidebar = ({ isCollapsed, theme, toggleTheme, onLogout, user, currentPage, onNavigate }) => {
    const handleLogoutClick = async () => {
        try {
            await onLogout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <CompanyLogo />
                <span className="sidebar-header-text">SynergySphere</span>
            </div>
            <nav className="sidebar-nav">
                <button onClick={() => onNavigate('projects')} className={`nav-link ${currentPage === 'projects' ? 'active' : ''}`}>
                    <FolderIcon />
                    <span className="nav-link-text">Projects</span>
                </button>
                <button onClick={() => onNavigate('tasks')} className={`nav-link ${currentPage === 'tasks' ? 'active' : ''}`}>
                    <TasksIcon />
                    <span className="nav-link-text">My Tasks</span>
                </button>
            </nav>
            <div className="sidebar-footer">
                <div className="theme-toggle">
                    <button onClick={() => toggleTheme('light')} className={theme === 'light' ? 'active' : ''}><SunIcon /></button>
                    <button onClick={() => toggleTheme('dark')} className={theme === 'dark' ? 'active' : ''}><MoonIcon /></button>
                </div>
                <div className="user-profile">
                    <img 
                        src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.first_name || 'User'}&background=4f46e5&color=fff`} 
                        alt="User Avatar"
                    />
                    <div className="user-info">
                        <div className="user-name">{user?.first_name} {user?.last_name}</div>
                        <div className="user-email">{user?.email}</div>
                    </div>
                </div>
                <button onClick={handleLogoutClick} className="logout-btn">
                    <LogoutIcon />
                    <span className="nav-link-text">Logout</span>
                </button>
            </div>
        </div>
    );
};

const ProjectCard = ({ project, onProjectClick }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    const getDefaultImage = (projectName) => {
        const colors = ['c4b5fd', 'd1d5db', 'fbbf24', 'f87171', '60a5fa', '34d399'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return `https://placehold.co/600x400/${color}/ffffff?text=${encodeURIComponent(projectName)}`;
    };

    return (
        <div className="project-card" onClick={() => onProjectClick?.(project)}>
            <img 
                src={project.image || getDefaultImage(project.name)} 
                alt={project.name} 
                className="project-card-image" 
            />
            <div className="project-card-content">
                <div className="project-card-header">
                    <h3>{project.name}</h3>
                    <div className="project-tags">
                        {project.tags && project.tags.map((tag, index) => (
                            <span key={index} className="tag tag-services">{tag}</span>
                        ))}
                        {project.priority && (
                            <span className={`tag tag-priority tag-priority-${project.priority.toLowerCase()}`}>
                                {project.priority}
                            </span>
                        )}
                    </div>
                </div>
                <div className="project-card-footer">
                    <div className="project-date">
                        <CalendarIcon />
                        <span>{formatDate(project.deadline) || formatDate(project.created_at)}</span>
                    </div>
                    <div className="project-tasks">
                        <TaskListIcon />
                        <span>{project.stats?.totalTasks || project.tasks?.length || 0} tasks</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TaskCard = ({ task }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'todo':
            case 'to-do':
                return 'status-todo';
            case 'in progress':
            case 'in-progress':
                return 'status-progress';
            case 'done':
                return 'status-done';
            default:
                return 'status-todo';
        }
    };

    return (
        <div className="task-card">
            <div className="task-header">
                <h3>{task.name}</h3>
                <span className={`task-status ${getStatusColor(task.status)}`}>
                    {task.status}
                </span>
            </div>
            {task.description && (
                <p className="task-description">{task.description}</p>
            )}
            <div className="task-footer">
                <div className="task-project">
                    <FolderIcon />
                    <span>{task.projects?.name || 'No Project'}</span>
                </div>
                {task.deadline && (
                    <div className="task-deadline">
                        <CalendarIcon />
                        <span>{formatDate(task.deadline)}</span>
                    </div>
                )}
            </div>
            {task.tags && task.tags.length > 0 && (
                <div className="task-tags">
                    {task.tags.map((tag, index) => (
                        <span key={index} className="tag tag-services">{tag}</span>
                    ))}
                </div>
            )}
        </div>
    );
};

const MainContent = ({ 
    currentPage, 
    projects, 
    tasks, 
    isLoading, 
    error, 
    onNewProject,
    onNewTask,
    onProjectClick, 
    searchQuery, 
    onSearchChange 
}) => {
    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredTasks = tasks.filter(task =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (error) {
        return (
            <div className="main-content">
                <div className="error-message">
                    <h3>Error loading data</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="main-content">
            <header className="main-header">
                <div className="breadcrumbs">
                    &gt; {currentPage === 'projects' ? 'Projects' : 'My Tasks'}
                </div>
                <div className="search-bar">
                    <span className="search-icon"><SearchIcon /></span>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary">[...]</button>
                    {currentPage === 'projects' ? (
                        <button className="btn btn-primary" onClick={onNewProject}>
                            <PlusIcon /> New Project
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={onNewTask}>
                            <PlusIcon /> New Task
                        </button>
                    )}
                </div>
            </header>

            {isLoading ? (
                <div className="loading-state">
                    <p>Loading...</p>
                </div>
            ) : currentPage === 'projects' ? (
                <div className="projects-grid">
                    {filteredProjects.length === 0 ? (
                        <div className="empty-state">
                            <h3>No projects found</h3>
                            <p>Create your first project to get started!</p>
                        </div>
                    ) : (
                        filteredProjects.map(project => (
                            <ProjectCard 
                                key={project.id} 
                                project={project} 
                                onProjectClick={onProjectClick}
                            />
                        ))
                    )}
                </div>
            ) : (
                <div className="tasks-grid">
                    {filteredTasks.length === 0 ? (
                        <div className="empty-state">
                            <h3>No tasks found</h3>
                            <p>Tasks will appear here when assigned to projects.</p>
                        </div>
                    ) : (
                        filteredTasks.map(task => (
                            <TaskCard key={task.id} task={task} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};


export default function ProjectPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [theme, setTheme] = useState('dark');
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState('projects');
    const [searchQuery, setSearchQuery] = useState('');
    const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
    const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

    // Data states
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await projectsAPI.getAll();
            if (response.success) {
                setProjects(response.data || []);
            } else {
                setError('Failed to fetch projects');
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await tasksAPI.getAll();
            if (response.success) {
                setTasks(response.data || []);
            } else {
                setError('Failed to fetch tasks');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateProject = async (projectData) => {
        try {
            const response = await projectsAPI.create(projectData);
            if (response.success) {
                // Refresh projects list
                fetchProjects();
            } else {
                throw new Error(response.message || 'Failed to create project');
            }
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    };

    const handleCreateTask = async (taskData) => {
        try {
            const response = await tasksAPI.create(taskData);
            if (response.success) {
                // Refresh tasks list
                fetchTasks();
            } else {
                throw new Error(response.message || 'Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    };

    const handleNavigate = (page) => {
        setCurrentPage(page);
        setSearchQuery(''); // Clear search when switching pages
    };

    const handleNewProject = () => {
        setIsProjectFormOpen(true);
    };

    const handleNewTask = () => {
        setIsTaskFormOpen(true);
    };

    const handleProjectClick = (project) => {
        // Handle project click - could navigate to project details
        console.log('Project clicked:', project);
    };

    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);

    useEffect(() => {
        // Fetch data when page changes
        if (currentPage === 'projects') {
            fetchProjects();
        } else if (currentPage === 'tasks') {
            fetchTasks();
        }
    }, [currentPage]);

    return (
        <div className="app-container">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                theme={theme}
                toggleTheme={setTheme}
                onLogout={handleLogout}
                user={user}
                currentPage={currentPage}
                onNavigate={handleNavigate}
            />
            <MainContent 
                currentPage={currentPage}
                projects={projects}
                tasks={tasks}
                isLoading={isLoading}
                error={error}
                onNewProject={handleNewProject}
                onNewTask={handleNewTask}
                onProjectClick={handleProjectClick}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />
            <ProjectCreationModal 
                isOpen={isProjectFormOpen}
                onClose={() => setIsProjectFormOpen(false)}
                onCreateProject={handleCreateProject}
            />
            <TaskCreationModal 
                isOpen={isTaskFormOpen}
                onClose={() => setIsTaskFormOpen(false)}
                onCreateTask={handleCreateTask}
                projects={projects}
            />
        </div>
    );
}

