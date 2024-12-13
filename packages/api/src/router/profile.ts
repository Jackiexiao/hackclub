import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Enums } from "@acme/db";

const socialLinkSchema = z.object({
  platform: z.enum(["github", "twitter", "linkedin", "website"]),
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
  realName: z.string().min(1),
  phoneNumber: z.string().optional(),
  nickname: z.string().optional(),
  wechat: z.string().optional(),
  selfIntro: z.string().optional(),
  gender: z.nativeEnum(Enums.Gender).optional(),
  occupation: z.string().optional(),
  field: z.nativeEnum(Enums.ProfessionalField).optional(),
  status: z.nativeEnum(Enums.UserStatus).optional(),
  resources: z.string().optional(),
  helpNeeded: z.string().optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
  projects: z.array(projectSchema).optional(),
});

export const profileRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
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

  getByUsername: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { slug: input.username },
        include: {
          club: true,
          projects: true,
          socialLinks: true,
        },
      });
      return user;
    }),

  update: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      let slug = user?.slug;
      if (!slug && input.realName) {
        const baseUsername = input.realName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");

        let counter = 1;
        slug = baseUsername;
        while (
          await ctx.db.user.findUnique({
            where: { slug },
            select: { id: true },
          })
        ) {
          slug = `${baseUsername}${counter}`;
          counter++;
        }
      }

      const activities = await ctx.db.eventRegistration.count({
        where: { userId: ctx.session.user.id },
      });
      const projects = await ctx.db.project.count({
        where: { userId: ctx.session.user.id },
      });

      let level = 0;
      if (activities > 0) level = 1;
      if (projects > 0) level = 2;

      const updatedUser = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          ...input,
          slug,
          level,
        },
        include: {
          club: true,
          projects: true,
          socialLinks: true,
        },
      });

      return updatedUser;
    }),
});
