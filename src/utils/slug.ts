import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

export async function generateSkillAssessmentUniqueSlug(
  title: string,
  id?: number
): Promise<string> {
  let slug = slugify(title, { lower: true, strict: true, trim: true });
  let uniqueSlug = slug;
  let count = 1;

  while (
    await prisma.skillAssessment.findFirst({
      where: { slug: uniqueSlug, NOT: { id } },
    })
  ) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }

  return uniqueSlug;
}

export async function generateAssessmentUniqueSlug(
  title: string,
  id?: number
): Promise<string> {
  let slug = slugify(title, { lower: true, strict: true, trim: true });
  let uniqueSlug = slug;
  let count = 1;

  while (
    await prisma.preTestAssessment.findFirst({
      where: { slug: uniqueSlug, NOT: { id } },
    })
  ) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }

  return uniqueSlug;
}

export async function generateJobUniqueSlug(
  title: string,
  id?: number
): Promise<string> {
  let slug = slugify(title, { lower: true, strict: true, trim: true });
  let uniqueSlug = slug;
  let count = 1;

  while (
    await prisma.job.findFirst({
      where: { slug: uniqueSlug, NOT: { id } },
    })
  ) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }

  return uniqueSlug;
}
