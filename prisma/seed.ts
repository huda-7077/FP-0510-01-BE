import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const jobsData = [
    {
      companyId: 1,
      title: "Senior Software Engineer",
      description:
        "Leading development of enterprise-scale applications using modern frameworks and cloud technologies. Experience with distributed systems required.",
      category: "Engineering",
      salary: 288000000,
      tags: ["typescript", "nodejs", "aws"],
      applicationDeadline: new Date("2025-06-30"),
      isPublished: true,
      requiresAssessment: true,
      isDeleted: false,
    },
    {
      companyId: 1,
      title: "Data Scientist",
      description:
        "Analyzing large datasets to derive actionable insights. Strong background in statistical analysis and machine learning required.",
      category: "Data Science",
      salary: 264000000,
      tags: ["python", "machine-learning", "sql"],
      applicationDeadline: new Date("2025-05-15"),
      isPublished: true,
      requiresAssessment: false,
      isDeleted: false,
    },
    {
      companyId: 1,
      title: "Product Manager",
      description:
        "Driving product strategy and roadmap development. Collaborate with cross-functional teams to deliver innovative solutions.",
      category: "Product",
      salary: 276000000,
      tags: ["agile", "product-strategy", "leadership"],
      applicationDeadline: new Date("2025-07-20"),
      isPublished: true,
      requiresAssessment: true,
      isDeleted: false,
    },
    {
      companyId: 1,
      title: "UX/UI Designer",
      description:
        "Creating intuitive and engaging user experiences. Proficiency in design tools and user research methodologies.",
      category: "Design",
      salary: 228000000,
      tags: ["figma", "user-research", "interaction-design"],
      applicationDeadline: new Date("2025-04-30"),
      isPublished: true,
      requiresAssessment: false,
      isDeleted: false,
    },
    {
      companyId: 1,
      title: "DevOps Engineer",
      description:
        "Managing cloud infrastructure and implementing CI/CD pipelines. Experience with containerization and automation.",
      category: "Engineering",
      salary: 300000000,
      tags: ["kubernetes", "docker", "terraform"],
      applicationDeadline: new Date("2025-06-15"),
      isPublished: true,
      requiresAssessment: true,
      isDeleted: false,
    },
  ];

  for (const job of jobsData) {
    await prisma.job.create({
      data: job,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
