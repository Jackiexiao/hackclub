import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { Gender, ProfessionalField, UserStatus } from "@acme/db";

// Validation schemas
const socialLinkSchema = z.object({
  platform: z.string(),
  url: z.string().url(),
});

const projectSchema = z.object({
  name: z.string(),
  description: z.string(),
  imageUrl: z.string().optional(),
  projectUrl: z.string().url().optional(),
});

const profileSchema = z.object({
  clubId: z.string().optional(),
  realName: z.string().optional(),
  phoneNumber: z.string().optional(),
  nickname: z.string().optional(),
  wechat: z.string().optional(),
  selfIntro: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  occupation: z.string().optional(),
  field: z.nativeEnum(ProfessionalField).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  resources: z.string().optional(),
  helpNeeded: z.string().optional(),
  projects: z.array(projectSchema).optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
  slug: z.string().optional(),
});

export const userRouter = createTRPCRouter({
  // Get public profile by slug
  getBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { slug: input },
        include: {
          club: true,
          projects: true,
          socialLinks: true,
        },
      });
      return user;
    }),

  // Get current user's profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        club: true,
        projects: true,
        socialLinks: true,
      },
    });
    return user;
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ ctx, input }) => {
      // Generate slug if not provided
      const slug = input.slug ??
        (input.nickname ?
          input.nickname.toLowerCase().replace(/\s+/g, '-') :
          ctx.session.user.id);

      // Update user profile
      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          ...input,
          slug,
          // Handle nested updates for projects and social links
          projects: input.projects ? {
            deleteMany: {},
            create: input.projects,
          } : undefined,
          socialLinks: input.socialLinks ? {
            deleteMany: {},
            create: input.socialLinks,
          } : undefined,
        },
        include: {
          club: true,
          projects: true,
          socialLinks: true,
        },
      });
      return user;
    }),
});
