export enum Gender {
  WOMAN = 'WOMAN',
  MAN = 'MAN',
  NON_BINARY = 'NON_BINARY',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
}

export enum RelationshipIntention {
  LONG_TERM = 'LONG_TERM',
  CASUAL = 'CASUAL',
  DATING_TO_MARRY = 'DATING_TO_MARRY',
  NEW_FRIENDS = 'NEW_FRIENDS',
  ACTIVITY_PARTNER = 'ACTIVITY_PARTNER',
  NOT_SURE_YET = 'NOT_SURE_YET'
}

export enum ConnectionMode {
  DATING = 'DATING',
  FRIENDSHIP = 'FRIENDSHIP',
  BOTH = 'BOTH'
}

export enum VerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export interface ProfilePhoto {
  id: string;
  profileId: string;
  url: string;
  order: number;
  isPrimary: boolean;
  isModerated: boolean;
  createdAt: Date | string;
}

export interface InterestTag {
  id: string;
  name: string;
  category: string;
  emoji: string;
}

export interface ProfilePrompt {
  id: string;
  question: string;
  answer: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  birthDate: string; // YYYY-MM-DD
  age: number;
  bio?: string | null;
  gender: Gender;
  pronouns?: string | null;
  relationshipIntention: RelationshipIntention;
  connectionMode: ConnectionMode;
  education?: string | null;
  occupation?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  languages: string[];
  interests: InterestTag[];
  photos: ProfilePhoto[];
  prompts: ProfilePrompt[];
  verificationStatus: VerificationStatus;
  completenessScore: number;
  isIncognito: boolean;
  isVisible: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ProfileUpdateRequest {
  displayName?: string;
  bio?: string;
  gender?: Gender;
  pronouns?: string;
  relationshipIntention?: RelationshipIntention;
  connectionMode?: ConnectionMode;
  education?: string;
  occupation?: string;
  city?: string;
  state?: string;
  country?: string;
  languages?: string[];
  interestIds?: string[];
  prompts?: { question: string; answer: string }[];
  isVisible?: boolean;
  isIncognito?: boolean;
}
