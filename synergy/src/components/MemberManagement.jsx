import React, { useState, useEffect } from 'react';
import { membersAPI, invitationsAPI, enhancedUsersAPI } from '../api/api';

// --- SVG Icon Components ---
const Icon = ({ path, className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={{ width: '20px', height: '20px' }}>
        <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
);

const UserIcon = () => <Icon path="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />;
const UsersIcon = () => <Icon path="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />;
const PlusIcon = () => <Icon path="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />;
const XIcon = () => <Icon path="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />;
const SearchIcon = () => <Icon path="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />;
const MailIcon = () => <Icon path="M3 4a1 1 0 011-1h12a1 1 0 011 1v2.586l-4.293 4.293a1 1 0 01-1.414 0L7 6.586V4zm0 4v6a1 1 0 001 1h12a1 1 0 001-1V8l-4.293 4.293a3 3 0 01-4.242 0L3 8z" />;
const TrashIcon = () => <Icon path="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z M4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM6 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" />;
const CrownIcon = () => <Icon path="M5 4a1 1 0 00-.894 1.447L5 7l1.5-1.5L8 7l1.5-1.5L11 7l.894-1.553A1 1 0 0011 4H5zM3 11v4a1 1 0 001 1h12a1 1 0 001-1v-4H3z" />;

// Member Card Component
const MemberCard = ({ member, currentUserId, isProjectManager, onUpdateRole, onRemoveMember }) => {
    const [isUpdatingRole, setIsUpdatingRole] = useState(false);
    const [showRoleMenu, setShowRoleMenu] = useState(false);

    const handleRoleChange = async (newRole) => {
        if (newRole === member.role) return;
        
        setIsUpdatingRole(true);
        try {
            await onUpdateRole(member.id, newRole);
            setShowRoleMenu(false);
        } catch (error) {
            console.error('Error updating role:', error);
        } finally {
            setIsUpdatingRole(false);
        }
    };

    const handleRemove = async () => {
        if (window.confirm(`Are you sure you want to remove ${member.full_name} from this project?`)) {
            await onRemoveMember(member.id);
        }
    };

    const isCurrentUser = member.id === currentUserId;
    const canManage = isProjectManager && !isCurrentUser;

    return (
        <div className="member-card">
            <div className="member-avatar">
                <img
                    src={member.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.full_name)}&background=4f46e5&color=fff`}
                    alt={member.full_name}
                />
                {member.role === 'manager' && (
                    <div className="member-role-badge">
                        <CrownIcon />
                    </div>
                )}
            </div>
            
            <div className="member-info">
                <h4 className="member-name">{member.full_name}</h4>
                <p className="member-email">{member.email}</p>
                <div className="member-role-container">
                    {canManage ? (
                        <div className="member-role-dropdown">
                            <button
                                onClick={() => setShowRoleMenu(!showRoleMenu)}
                                className={`member-role ${member.role === 'manager' ? 'role-manager' : 'role-member'}`}
                                disabled={isUpdatingRole}
                            >
                                {isUpdatingRole ? 'Updating...' : member.role}
                            </button>
                            {showRoleMenu && (
                                <div className="role-menu">
                                    <button
                                        onClick={() => handleRoleChange('member')}
                                        className={member.role === 'member' ? 'active' : ''}
                                    >
                                        Member
                                    </button>
                                    <button
                                        onClick={() => handleRoleChange('manager')}
                                        className={member.role === 'manager' ? 'active' : ''}
                                    >
                                        Manager
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <span className={`member-role ${member.role === 'manager' ? 'role-manager' : 'role-member'}`}>
                            {member.role}
                        </span>
                    )}
                </div>
            </div>

            {canManage && (
                <div className="member-actions">
                    <button
                        onClick={handleRemove}
                        className="member-action-btn member-remove"
                        title="Remove member"
                    >
                        <TrashIcon />
                    </button>
                </div>
            )}
        </div>
    );
};

// Invite Member Modal Component
const InviteMemberModal = ({ isOpen, onClose, projectId, onInviteSent }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('member');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');
    const [searchTimeout, setSearchTimeout] = useState(null);

    const handleEmailSearch = async (searchEmail) => {
        if (!searchEmail || searchEmail.length < 3) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await enhancedUsersAPI.searchByEmail(searchEmail);
            if (response.success) {
                setSearchResults(response.data || []);
            }
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setError('');

        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Set new timeout for search
        if (value.length >= 3) {
            const timeout = setTimeout(() => {
                handleEmailSearch(value);
            }, 300);
            setSearchTimeout(timeout);
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectUser = (user) => {
        setEmail(user.email);
        setSearchResults([]);
    };

    const handleSendInvitation = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setError('Please enter an email address');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsSending(true);
        setError('');

        try {
            const response = await invitationsAPI.sendInvitation(projectId, {
                email,
                role
            });

            if (response.success) {
                onInviteSent();
                onClose();
                setEmail('');
                setRole('member');
                setSearchResults([]);
            } else {
                setError(response.message || 'Failed to send invitation');
            }
        } catch (error) {
            console.error('Error sending invitation:', error);
            setError(error.message || 'Failed to send invitation');
        } finally {
            setIsSending(false);
        }
    };

    const handleClose = () => {
        onClose();
        setEmail('');
        setRole('member');
        setSearchResults([]);
        setError('');
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Invite Member</h2>
                    <button onClick={handleClose} className="modal-close">
                        <XIcon />
                    </button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSendInvitation} className="invite-form">
                        <div className="field-group">
                            <label htmlFor="email" className="field-label">
                                Email Address
                            </label>
                            <div className="search-input-container">
                                <div className="input-wrapper">
                                    <SearchIcon />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        placeholder="Enter email address..."
                                        className="text-input"
                                        required
                                    />
                                </div>
                                {isSearching && (
                                    <div className="search-loading">Searching...</div>
                                )}
                                {searchResults.length > 0 && (
                                    <div className="search-results">
                                        {searchResults.map(user => (
                                            <div
                                                key={user.id}
                                                onClick={() => handleSelectUser(user)}
                                                className="search-result-item"
                                            >
                                                <img
                                                    src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.email)}&background=4f46e5&color=fff`}
                                                    alt={user.full_name || user.email}
                                                />
                                                <div>
                                                    <div className="result-name">{user.full_name || 'No name'}</div>
                                                    <div className="result-email">{user.email}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="field-group">
                            <label htmlFor="role" className="field-label">
                                Role
                            </label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="select-input"
                            >
                                <option value="member">Member</option>
                                <option value="manager">Manager</option>
                            </select>
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSending || !email}
                            >
                                {isSending ? 'Sending...' : 'Send Invitation'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Main Member Management Component
const MemberManagement = ({ projectId, currentUserId, isProjectManager }) => {
    const [members, setMembers] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('members');

    const fetchMembers = async () => {
        try {
            setIsLoading(true);
            const response = await membersAPI.getProjectMembers(projectId);
            if (response.success) {
                setMembers(response.data || []);
            } else {
                setError('Failed to fetch project members');
            }
        } catch (error) {
            console.error('Error fetching members:', error);
            setError('Failed to fetch project members');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchInvitations = async () => {
        if (!isProjectManager) return;
        
        try {
            const response = await invitationsAPI.getProjectInvitations(projectId);
            if (response.success) {
                setInvitations(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching invitations:', error);
        }
    };

    const handleUpdateRole = async (userId, newRole) => {
        try {
            const response = await membersAPI.updateMemberRole(projectId, userId, newRole);
            if (response.success) {
                setMembers(prev =>
                    prev.map(member =>
                        member.id === userId ? { ...member, role: newRole } : member
                    )
                );
            }
        } catch (error) {
            throw error;
        }
    };

    const handleRemoveMember = async (userId) => {
        try {
            const response = await membersAPI.removeMember(projectId, userId);
            if (response.success) {
                setMembers(prev => prev.filter(member => member.id !== userId));
            }
        } catch (error) {
            console.error('Error removing member:', error);
        }
    };

    const handleInviteSent = () => {
        fetchInvitations();
    };

    useEffect(() => {
        if (projectId) {
            fetchMembers();
            fetchInvitations();
        }
    }, [projectId, isProjectManager]);

    if (isLoading) {
        return (
            <div className="member-management">
                <div className="loading-state">
                    <p>Loading members...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="member-management">
                <div className="error-message">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const pendingInvitations = invitations.filter(inv => inv.status === 'pending');

    return (
        <div className="member-management">
            <div className="member-management-header">
                <div className="member-tabs">
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`tab-button ${activeTab === 'members' ? 'active' : ''}`}
                    >
                        <UsersIcon />
                        Members ({members.length})
                    </button>
                    {isProjectManager && pendingInvitations.length > 0 && (
                        <button
                            onClick={() => setActiveTab('invitations')}
                            className={`tab-button ${activeTab === 'invitations' ? 'active' : ''}`}
                        >
                            <MailIcon />
                            Pending ({pendingInvitations.length})
                        </button>
                    )}
                </div>
                
                {isProjectManager && (
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="btn btn-primary btn-sm"
                    >
                        <PlusIcon /> Invite Member
                    </button>
                )}
            </div>

            <div className="member-content">
                {activeTab === 'members' && (
                    <div className="members-grid">
                        {members.map(member => (
                            <MemberCard
                                key={member.id}
                                member={member}
                                currentUserId={currentUserId}
                                isProjectManager={isProjectManager}
                                onUpdateRole={handleUpdateRole}
                                onRemoveMember={handleRemoveMember}
                            />
                        ))}
                    </div>
                )}

                {activeTab === 'invitations' && (
                    <div className="invitations-list">
                        {pendingInvitations.map(invitation => (
                            <div key={invitation.id} className="invitation-item">
                                <div className="invitation-info">
                                    <h4>{invitation.invitee_email}</h4>
                                    <p>Role: {invitation.role}</p>
                                    <p>Invited by: {invitation.inviter.first_name} {invitation.inviter.last_name}</p>
                                    <p>Expires: {new Date(invitation.expires_at).toLocaleDateString()}</p>
                                </div>
                                <div className="invitation-status">
                                    <span className="status-pending">Pending</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <InviteMemberModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                projectId={projectId}
                onInviteSent={handleInviteSent}
            />
        </div>
    );
};

export default MemberManagement;
