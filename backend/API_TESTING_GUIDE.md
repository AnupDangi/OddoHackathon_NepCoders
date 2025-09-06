# SynergySphere API v1.0 Testing Guide

## 🚀 Quick Start Testing

### 1. Health Check
```bash
curl -X GET http://localhost:5000/
```
**Expected Response:**
```json
{
  "message": "SynergySphere API v1.0",
  "status": "active",
  "timestamp": "2025-09-06T..."
}
```

### 2. API Documentation
```bash
curl -X GET http://localhost:5000/api/v1/auth/
```

## 🔐 Authentication Testing

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@gmail.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Test User Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@gmail.com",
    "password": "Password123!"
  }'
```
**⚠️ IMPORTANT: Save the `access_token` from the response for all subsequent requests!**

### Test Get Current User (with token)
```bash
# Replace YOUR_JWT_TOKEN with actual token from login response
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Logout
```bash
curl -X POST http://localhost:5000/api/v1/auth/logout
```

## 📋 Projects Testing

### Get All Projects (requires auth)
```bash
curl -X GET http://localhost:5000/api/v1/projects/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create New Project (requires auth)
```bash
curl -X POST http://localhost:5000/api/v1/projects/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "E-Commerce Mobile App",
    "description": "Building a cross-platform mobile app with React Native",
    "deadline": "2024-12-31",
    "priority": "High",
    "tags": ["mobile", "react-native", "e-commerce"],
    "image": "https://example.com/project-image.jpg"
  }'
```

### Create Another Project Example
```bash
curl -X POST http://localhost:5000/api/v1/projects/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AI Chatbot Integration",
    "description": "Integrate GPT-4 chatbot into customer support system",
    "deadline": "2024-11-15",
    "priority": "Medium",
    "tags": ["ai", "backend", "chatbot"]
  }'
```

### Get Project by ID (requires auth)
```bash
curl -X GET http://localhost:5000/api/v1/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Project (requires auth)
```bash
curl -X PUT http://localhost:5000/api/v1/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Project Name",
    "description": "Updated description with new requirements",
    "priority": "Medium",
    "tags": ["updated", "modified"]
  }'
```

### Delete Project (requires auth)
```bash
curl -X DELETE http://localhost:5000/api/v1/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Add Member to Project (requires auth)
```bash
curl -X POST http://localhost:5000/api/v1/projects/PROJECT_ID/members \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_TO_ADD",
    "role": "member"
  }'
```

### Remove Member from Project (requires auth)
```bash
curl -X DELETE http://localhost:5000/api/v1/projects/PROJECT_ID/members/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## ✅ Tasks Testing

### Get All User Tasks
```bash
curl -X GET http://localhost:5000/api/v1/tasks/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/v1/tasks/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "PROJECT_ID_HERE",
    "name": "Implement User Authentication",
    "description": "Create login and signup functionality with JWT",
    "deadline": "2024-10-15",
    "status": "To-Do",
    "tags": ["backend", "auth", "security"]
  }'
```

### Create Another Task Example
```bash
curl -X POST http://localhost:5000/api/v1/tasks/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "PROJECT_ID_HERE",
    "name": "Design UI Components",
    "description": "Create reusable React components for the project",
    "deadline": "2024-11-01",
    "status": "In Progress",
    "tags": ["frontend", "ui", "react"],
    "image": "https://example.com/task-mockup.jpg"
  }'
```

### Get Tasks by Project
```bash
curl -X GET http://localhost:5000/api/v1/tasks/project/PROJECT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Task by ID
```bash
curl -X GET http://localhost:5000/api/v1/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Task
```bash
curl -X PUT http://localhost:5000/api/v1/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Task Name",
    "status": "Done",
    "description": "Task completed successfully"
  }'
```

### Delete Task
```bash
curl -X DELETE http://localhost:5000/api/v1/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 👤 Users Testing

### Get User Profile
```bash
curl -X GET http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update User Profile
```bash
curl -X PUT http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John Updated",
    "last_name": "Doe Updated"
  }'
```

### Get All Users (for member assignment)
```bash
curl -X GET http://localhost:5000/api/v1/users/all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Search Users
```bash
curl -X GET "http://localhost:5000/api/v1/users/all?search=john" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Avatar
```bash
curl -X POST http://localhost:5000/api/v1/users/avatar \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "avatar_url": "https://example.com/new-avatar.jpg"
  }'
```

## 📊 Dashboard Testing

### Get Dashboard Data
```bash
curl -X GET http://localhost:5000/api/v1/dashboard/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Dashboard Statistics
```bash
curl -X GET http://localhost:5000/api/v1/dashboard/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Error Testing

### Test Invalid Routes
```bash
curl -X GET http://localhost:5000/invalid-route
```

### Test Missing Auth
```bash
curl -X GET http://localhost:5000/api/v1/projects/
```
**Expected:** 401 Unauthorized

### Test Invalid Data
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "123"
  }'
```
**Expected:** 400 Bad Request with validation errors

### Test Unauthorized Project Access
```bash
curl -X GET http://localhost:5000/api/v1/projects/NONEXISTENT_PROJECT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Expected:** 403 Forbidden

## 📝 Testing Workflow

1. **Health Check** → Verify server is running
2. **Register User** → Create test account
3. **Login User** → Get access token
4. **Create Projects** → Add 2-3 test projects
5. **Get Projects** → Verify projects are listed
6. **Create Tasks** → Add tasks to projects
7. **Get Tasks** → Verify task creation
8. **Update Tasks** → Change status to "Done"
9. **Get Dashboard** → View aggregated data
10. **Test User Profile** → Update profile info
11. **Test Delete Operations** → Clean up test data

## 🚨 Expected Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": true,
  "message": "Error description",
  "details": ["validation error 1", "validation error 2"]
}
```

### Project Response Example
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "E-Commerce Mobile App",
      "description": "Building a cross-platform mobile app...",
      "deadline": "2024-12-31",
      "priority": "High",
      "tags": ["mobile", "react-native", "e-commerce"],
      "image": "https://example.com/project-image.jpg",
      "project_manager": "user-id",
      "created_at": "2024-09-06T...",
      "project_members": [...],
      "tasks": [...],
      "stats": {
        "totalTasks": 5,
        "todoTasks": 2,
        "inProgressTasks": 2,
        "doneTasks": 1
      }
    }
  ]
}
```

### Task Response Example
```json
{
  "success": true,
  "data": [
    {
      "id": "task-id-123",
      "project_id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Implement User Authentication",
      "description": "Create login and signup functionality...",
      "deadline": "2024-10-15",
      "status": "To-Do",
      "tags": ["backend", "auth", "security"],
      "assignee": "user-id",
      "created_at": "2024-09-06T...",
      "projects": {
        "name": "E-Commerce Mobile App"
      },
      "assignee_profile": {
        "first_name": "John",
        "last_name": "Doe"
      }
    }
  ]
}
```

## 🔍 HTTP Status Codes

- `200` - Success (GET, PUT)
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 🎯 Quick Test Commands for Postman

### Environment Variables to Set:
- `base_url` = `http://localhost:5000`
- `access_token` = `YOUR_TOKEN_FROM_LOGIN`
- `project_id` = `ID_FROM_CREATED_PROJECT`
- `task_id` = `ID_FROM_CREATED_TASK`

### Test Sequence:
1. Register → Login → Save token
2. Create project → Save project_id  
3. Create task → Save task_id
4. Test all GET endpoints
5. Test UPDATE endpoints
6. Test DELETE endpoints
