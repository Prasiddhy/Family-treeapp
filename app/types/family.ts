export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: Date;
}

export interface Person {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  fatherName?: string;      
  motherName?: string;
  middleName?: string;
  maritalStatus?: string;
  spouseId?: string;
  children?: string[];
  parents?: string[];
  birthDate?: string;
  birthYear?: number;
  deathDate?: string;
  deathYear?: number;
  image?: string;
  gender?: 'male' | 'female' | 'other';
  occupation?: string;
  location?: string;
  isAlive?: boolean;
  biography?: string;
  notes?: string;
  tags?: string[];
  documents?: string[];
  events?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FamilyNode {
  person: Person;
  spouse?: Person;
  children: FamilyNode[];
  level: number;
  parentName?: string;
}

export interface FamilyTreeProps {
  personId: string;
  level?: number;
  parentName?: string;
  maxDepth?: number;
}

export interface PersonCardProps {
  person: Person;
  relation?: string;
  level: number;
  onClick?: (person: Person, event?: React.MouseEvent) => void;
}

export interface FamilyData {
  [key: string]: Person;
}

export interface FamilyEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: 'birthday' | 'anniversary' | 'wedding' | 'death' | 'graduation' | 'other';
  personIds: string[];
  location?: string;
  photos?: string[];
  documents?: string[];
  isRecurring: boolean;
  reminderDays?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FamilyDocument {
  id: string;
  title: string;
  description?: string;
  type: 'photo' | 'certificate' | 'story' | 'document' | 'other';
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  personIds: string[];
  tags?: string[];
  isPublic: boolean;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FamilyInvite {
  id: string;
  email: string;
  familyId: string;
  role: 'viewer' | 'editor' | 'admin';
  status: 'pending' | 'accepted' | 'declined';
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
}

export interface FamilyTree {
  id: string;
  name: string;
  description?: string;
  rootPersonId: string;
  members: string[];
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
