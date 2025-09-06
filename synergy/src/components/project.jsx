import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

// --- Mock Data ---
const MOCK_PROJECTS = [
    { id: 'proj1', name: 'RD Services', date: '21/09/22', tasks: 18, image: 'https://placehold.co/600x400/c4b5fd/3730a3?text=RD+Services', tag: 'Services'},
    { id: 'proj2', name: 'RD Sales', date: '23/09/22', tasks: 12, image: 'https://placehold.co/600x400/c4b5fd/3730a3?text=RD+Sales', tag: 'Payments'},
    { id: 'proj3', name: 'RD Upgrade', date: '23/02/22', tasks: 16, image: 'https://placehold.co/600x400/d1d5db/1f2937?text=RD+Upgrade', tag: 'Upgrade'}
];

// --- Components ---

const Sidebar = ({ isCollapsed, theme, toggleTheme, onLogout, user, currentPage, onNavigate }) => {
    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <CompanyLogo />
                <span className="sidebar-header-text">Company</span>
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
                    <img src={user.avatar} alt="User Avatar"/>
                    <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProjectCard = ({ project }) => {
    return (
        <div className="project-card">
            <img src={project.image} alt={project.name} className="project-card-image" />
            <div className="project-card-content">
                <div className="project-card-header">
                    <h3>{project.name}</h3>
                    <div className="project-tags">
                        <span className="tag tag-services">{project.tag}</span>
                    </div>
                </div>
                <div className="project-card-footer">
                    <div className="project-date">
                        <CalendarIcon />
                        <span>{project.date}</span>
                    </div>
                    <div className="project-tasks">
                        <TaskListIcon />
                        <span>{project.tasks} tasks</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MainContent = () => {
    return (
        <div className="main-content">
            <header className="main-header">
                <div className="breadcrumbs"> &gt; Projects </div>
                <div className="search-bar">
                    <span className="search-icon"><SearchIcon /></span>
                    <input type="text" placeholder="Search..." />
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary">[...]</button>
                    <button className="btn btn-primary"><PlusIcon /> New Project</button>
                </div>
            </header>
            <div className="projects-grid">
                {MOCK_PROJECTS.map(proj => <ProjectCard key={proj.id} project={proj}/>)}
            </div>
        </div>
    );
};


export default function ProjectPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [theme, setTheme] = useState('dark');
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState('projects');

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);

    const handleNavigate = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="app-container">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                theme={theme}
                toggleTheme={setTheme}
                user={user}
                currentPage={currentPage}
                onNavigate={handleNavigate}
            />
            <MainContent />
        </div>
    );
}

