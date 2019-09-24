import RoleResponse from './Role.response';

export default interface UserResponse {
  id: number;
  username: string;
  password: string;
  email: string;
  organizationId?: number;
  roles: RoleResponse[];
}
