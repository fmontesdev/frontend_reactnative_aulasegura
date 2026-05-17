import { Pagination } from './Pagination';
import { User } from './User';

export type TagType = 'rfid' | 'nfc_mobile';

export interface TagUser extends Pick<User, 'userId' | 'name' | 'lastname' | 'email' | 'avatar'> {}

export interface Tag {
  tagId: string | number;
  type: TagType;
  isActive: boolean;
  createdAt?: string;
  issuedAt?: string;
  userId?: string;
  user?: TagUser;
}

export interface PaginatedTags {
  data: Tag[];
  meta: Pagination;
}

export interface TagsFilters {
  page?: number;
  limit?: number;
  filters?: string[];
}

export interface CreateTagData {
  userId: string;
  type: TagType;
  rawUid?: string;
}

export interface UpdateTagData {
  rawUid: string;
}

export interface CreateTagResponse extends Tag {
  mobileCredential?: string;
}

export interface DeleteTagResponse {
  message: string;
}
