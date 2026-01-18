import { ROLE_ADMIN, ROLE_EMPLOYEE, ROLE_USER } from './enums.js';

/**
 * Default permissions for each role.
 * 
 * HYBRID SYSTEM EXPLANATION:
 * 1. These are the "Base Permissions" that a user gets automatically based on their role.
 * 2. You can grant EXTRA permissions to any specific user by adding strings to their 
 *    `permissions` array in the Database (User Model).
 * 
 * Total Permissions = (Role Defaults) + (User Specific Permissions)
 */
export const ROLE_PERMISSIONS = {
  [ROLE_ADMIN]: [
    'user_create',
    'user_read',
    'user_update',
    'user_delete',
    'company_read',
    'company_update',
    'report_view',
    'report_export'
  ],
  [ROLE_EMPLOYEE]: [
    'user_read',
    'company_read'
  ],
  [ROLE_USER]: [
    'user_read'
  ]
};

/**
 * System level permissions that are NOT assigned to any role by default.
 * These must be manually assigned to specific users (e.g., Super Admins).
 */
const SYSTEM_PERMISSIONS = [
  'permission_view'
];

/**
 * List of ALL available permissions in the system.
 * Derived automatically from ROLE_PERMISSIONS to ensure no duplication.
 */
export const ALL_PERMISSIONS = [
  ...new Set([
    ...Object.values(ROLE_PERMISSIONS).flat(),
    ...SYSTEM_PERMISSIONS
  ])
];
