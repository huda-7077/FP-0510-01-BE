import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const jobsData = [
    {
      companyId: 1,
      title: "Software Engineer",
      description:
        "<p>We are looking for a talented software engineer to join our team. Responsibilities include developing and maintaining software applications, collaborating with cross-functional teams, and participating in code reviews.</p>",
      category: "Engineering",
      salary: 12000000,
      tags: ["javascript", "nodejs", "react"],
      applicationDeadline: new Date("2025-12-31"),
      isPublished: true,
      requiresAssessment: true,
      isDeleted: false,
      companyLocationId: 1,
    },
    {
      companyId: 1,
      title: "Data Analyst",
      description:
        "<p>We are seeking a data analyst to help us make data-driven decisions. The ideal candidate will have experience in data analysis, data visualization, and statistical modeling. SQL and Python skills are a must.</p>",
      category: "Data",
      salary: 9000000,
      tags: ["sql", "python", "data-visualization"],
      applicationDeadline: new Date("2025-11-30"),
      isPublished: false,
      requiresAssessment: false,
      isDeleted: false,
      companyLocationId: 2,
    },
    {
      companyId: 1,
      title: "UI/UX Designer",
      description:
        "<p>We are looking for a creative UI/UX designer to design intuitive and engaging user interfaces for our web and mobile applications. The ideal candidate should have a strong portfolio demonstrating their design skills.</p>",
      category: "Design",
      salary: 10000000,
      tags: ["ui-design", "ux-design", "figma"],
      applicationDeadline: new Date("2025-10-31"),
      isPublished: true,
      requiresAssessment: true,
      isDeleted: false,
      companyLocationId: 3,
    },
    {
      companyId: 1,
      title: "Financial Analyst",
      description:
        "<p>We are seeking a financial analyst to support our financial planning and analysis efforts. The ideal candidate should have strong analytical skills and experience in financial modeling and forecasting.</p>",
      category: "Finance",
      salary: 11000000,
      tags: ["financial-analysis", "budgeting", "forecasting"],
      applicationDeadline: new Date("2025-09-30"),
      isPublished: false,
      requiresAssessment: false,
      isDeleted: false,
      companyLocationId: 4,
    },
    {
      companyId: 1,
      title: "HR Manager",
      description:
        "<p>We are looking for an experienced HR manager to lead our human resources department. The ideal candidate should have a proven track record of developing and implementing HR strategies and policies.</p>",
      category: "Human Resources",
      salary: 13000000,
      tags: ["recruitment", "employee-relations", "performance-management"],
      applicationDeadline: new Date("2025-08-31"),
      isPublished: true,
      requiresAssessment: false,
      isDeleted: false,
      companyLocationId: 5,
    },
    {
      companyId: 1,
      title: "Sales Manager",
      description:
        "<p>We are seeking a results-driven sales manager to lead our sales team. The ideal candidate should have a proven track record of meeting and exceeding sales targets and building strong client relationships.</p>",
      category: "Sales",
      salary: 12000000,
      tags: ["sales-strategy", "account-management", "business-development"],
      applicationDeadline: new Date("2025-07-31"),
      isPublished: true,
      requiresAssessment: true,
      isDeleted: false,
      companyLocationId: 6,
    },
    {
      companyId: 1,
      title: "Project Manager",
      description:
        "<p>We are looking for an experienced project manager to oversee the planning, execution, and delivery of our projects. The ideal candidate should have strong leadership, communication, and problem-solving skills.</p>",
      category: "Project Management",
      salary: 14000000,
      tags: ["agile", "scrum", "project-planning"],
      applicationDeadline: new Date("2025-06-30"),
      isPublished: true,
      requiresAssessment: false,
      isDeleted: false,
      companyLocationId: 7,
    },
    {
      companyId: 1,
      title: "Network Administrator",
      description:
        "<p>We are seeking a skilled network administrator to maintain and optimize our network infrastructure. The ideal candidate should have experience in network design, configuration, and troubleshooting.</p>",
      category: "IT",
      salary: 11000000,
      tags: ["networking", "system-administration", "security"],
      applicationDeadline: new Date("2025-05-31"),
      isPublished: false,
      requiresAssessment: true,
      isDeleted: false,
      companyLocationId: 8,
    },
    {
      companyId: 1,
      title: "Content Writer",
      description:
        "<p>We are looking for a creative content writer to produce engaging and informative content for our website and marketing materials. The ideal candidate should have excellent writing and research skills.</p>",
      category: "Content",
      salary: 8000000,
      tags: ["copywriting", "seo", "content-strategy"],
      applicationDeadline: new Date("2025-04-30"),
      isPublished: true,
      requiresAssessment: false,
      isDeleted: false,
      companyLocationId: 9,
    },
    {
      companyId: 1,
      title: "Customer Support Specialist",
      description:
        "<p>We are seeking a customer-focused support specialist to provide excellent assistance to our customers. The ideal candidate should have strong communication skills and a passion for helping others.</p>",
      category: "Customer Service",
      salary: 7000000,
      tags: ["customer-support", "problem-solving", "communication"],
      applicationDeadline: new Date("2025-03-31"),
      isPublished: true,
      requiresAssessment: true,
      isDeleted: false,
      companyLocationId: 10,
    },
    {
      companyId: 1,
      title: "Graphic Designer",
      description:
        "<p>We are looking for a talented graphic designer to create visually appealing designs for our marketing and branding materials. The ideal candidate should have a strong portfolio showcasing their creativity and design skills.</p>",
      category: "Design",
      salary: 9000000,
      tags: ["graphic-design", "branding", "adobe-creative-suite"],
      applicationDeadline: new Date("2025-02-28"),
      isPublished: false,
      requiresAssessment: false,
      isDeleted: false,
      companyLocationId: 1,
    },
    {
      companyId: 1,
      title: "Backend Developer",
      description:
        "<p>We are seeking a skilled backend developer to design and implement server-side applications. The ideal candidate should have experience in building scalable and efficient backend systems.</p>",
      category: "Engineering",
      salary: 13000000,
      tags: ["java", "spring-boot", "microservices"],
      applicationDeadline: new Date("2025-01-31"),
      isPublished: true,
      requiresAssessment: true,
      isDeleted: false,
      companyLocationId: 2,
    },
    {
      companyId: 1,
      title: "Digital Marketing Specialist",
      description:
        "<p>We are looking for a data-driven digital marketing specialist to develop and execute our online marketing strategies. The ideal candidate should have experience in SEO, SEM, and social media marketing.</p>",
      category: "Marketing",
      salary: 10000000,
      tags: ["seo", "sem", "social-media-marketing"],
      applicationDeadline: new Date("2024-12-31"),
      isPublished: true,
      requiresAssessment: false,
      isDeleted: false,
      companyLocationId: 3,
    },
    {
      companyId: 1,
      title: "Product Manager",
      description:
        "<p>We are seeking a visionary product manager to drive the development and success of our products. The ideal candidate should have experience in defining product strategy, roadmaps, and working closely with cross-functional teams.</p>",
      category: "Product",
      salary: 15000000,
      tags: ["product-strategy", "user-research", "agile"],
      applicationDeadline: new Date("2024-11-30"),
      isPublished: false,
      requiresAssessment: true,
      isDeleted: false,
      companyLocationId: 4,
    },
    {
      companyId: 1,
      title: "Cybersecurity Analyst",
      description:
        "<p>We are looking for a detail-oriented cybersecurity analyst to protect our systems and data from security threats. The ideal candidate should have experience in identifying vulnerabilities, implementing security controls, and responding to incidents.</p>",
      category: "Security",
      salary: 12000000,
      tags: ["cybersecurity", "incident-response", "risk-assessment"],
      applicationDeadline: new Date("2024-10-31"),
      isPublished: true,
      requiresAssessment: true,
      isDeleted: false,
      companyLocationId: 5,
    },
  ];

  for (const job of jobsData) {
    await prisma.job.create({
      data: job,
    });
  }

  console.log("Jobs seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
