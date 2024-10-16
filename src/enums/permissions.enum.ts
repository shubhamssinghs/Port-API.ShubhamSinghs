/* eslint-disable no-unused-vars */
export enum Permissions {
  VIEW_ALL_USERS = 'view_all_users',
  VIEW_USER_PROFILE = 'view_user_profile',
  UPDATE_USER_PROFILE = 'update_user_profile',
  DELETE_USER_PROFILE = 'delete_user_profile',

  VIEW_ALL_LOGS = 'view_all_logs',

  VIEW_OWN_PROFILE = 'view_own_profile',
  UPDATE_OWN_PROFILE = 'update_own_profile',
  DELETE_OWN_PROFILE = 'delete_own_profile'
}

export enum PermissionDescription {
  VIEW_ALL_USERS = 'Allows the user to view a list of all users',
  VIEW_USER_PROFILE = 'Allows the user to view details of a specific user',
  UPDATE_USER_PROFILE = 'Allows the user to update the details of a specific user',
  DELETE_USER_PROFILE = 'Allows the user to delete a specific user profile',

  VIEW_ALL_LOGS = 'Allows the user to view all system logs',

  VIEW_OWN_PROFILE = 'Allows the user to view their own profile data',
  UPDATE_OWN_PROFILE = 'Allows the user to update their own profile data',
  DELETE_OWN_PROFILE = 'Allows the user to delete their own profile'
}
