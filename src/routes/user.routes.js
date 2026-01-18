import express from 'express';
import userController from '../controller/user.controller.js';

import { checkPermission } from '../middlewares/permission.middleware.js';

const router = express.Router();

// Create a new user
router.post('/user/create-user', checkPermission('user_create'), userController.createUser);

// Get all system permissions (for UI dropdowns)
// Restricted to specific admins (Manual assignment required)
router.get('/user/get-all-permissions', checkPermission('permission_view'), userController.getAllPermissions);

// Get all users with pagination
router.get('/user/get-all-users', checkPermission('user_read'), userController.getAllUsers);

// Get user statistics
router.get('/user/get-user-stats', checkPermission('user_read'), userController.getUserStats);

// Search users by name or email
router.get('/user/search-users', checkPermission('user_read'), userController.searchUsers);

// Get users by role
router.get('/user/get-users-by-role/:role', checkPermission('user_read'), userController.getUsersByRole);

// Get user by email
router.get('/user/get-user-by-email/:email', checkPermission('user_read'), userController.getUserByEmail);

// Get user by ID
router.get('/user/:id/get-user', checkPermission('user_read'), userController.getUserById);

// Update user by ID
router.put('/user/:id/update-user', checkPermission('user_update'), userController.updateUser);

// Delete user by ID
router.delete('/user/:id/delete-user', checkPermission('user_delete'), userController.deleteUser);

// Get user profile - Keeping 'user_read' as general permission, or could be 'profile_view'
router.get('/user/:id/get-user-profile', checkPermission('user_read'), userController.getUserProfile);

// Update user profile
router.put('/user/:id/update-user-profile', checkPermission('user_update'), userController.updateProfile);

// Update user password
router.put('/user/:id/update-user-password', checkPermission('user_update'), userController.updatePassword);

// Login user
router.post('/user/login', userController.loginUser);

// Toggle user status (activate/deactivate)
router.put('/user/:id/deactivate-user', checkPermission('user_update'), userController.deactivateUser);
router.put('/user/:id/reactivate-user', checkPermission('user_update'), userController.reactivateUser);


export default router;