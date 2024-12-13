import { type Prisma } from "@prisma/client";

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum ProfessionalField {
  DEVELOPMENT = "DEVELOPMENT",
  PRODUCT = "PRODUCT",
  DESIGN = "DESIGN",
  OPERATIONS = "OPERATIONS",
  HARDWARE = "HARDWARE",
  SALES = "SALES",
  RESEARCH = "RESEARCH",
  MEDIA = "MEDIA",
  CONSULTING = "CONSULTING",
  INVESTMENT = "INVESTMENT",
  STUDENT = "STUDENT",
  ART = "ART",
  LEGAL = "LEGAL",
  TEACHING = "TEACHING",
  OTHER = "OTHER",
}

export enum UserStatus {
  EMPLOYED = "EMPLOYED",
  STARTUP = "STARTUP",
  FREELANCE = "FREELANCE",
  JOB_SEEKING = "JOB_SEEKING",
  STUDENT = "STUDENT",
  OTHER = "OTHER",
}

export enum RegistrationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export const Enums = {
  Gender,
  ProfessionalField,
  UserStatus,
  RegistrationStatus,
} as const;

// Re-export Prisma namespace for type access
export type { Prisma };
