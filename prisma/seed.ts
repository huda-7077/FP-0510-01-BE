import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const jobsData = [
    {
      companyId: 1,
      title: "Senior Software Engineer",
      description:
        "<p>We are looking for a Senior Software Engineer to join our team. You will be responsible for:</p><p>- Designing and implementing scalable software solutions</p><p>- Mentoring junior developers and conducting code reviews</p><p>- Collaborating with product managers and stakeholders</p><p>- Writing clean, maintainable code following best practices</p><p>- Participating in technical architecture discussions</p>",
      category: "Engineering",
      salary: 25000000,
      tags: ["typescript", "nodejs", "aws", "microservices"],
      applicationDeadline: new Date("2025-06-30"),
      isPublished: false,
      requiresAssessment: true,
      isDeleted: false,
      companyLocationId: 4,
    },
    {
      companyId: 1,
      title: "Data Scientist",
      description:
        "<p>Join our data science team to help drive data-driven decisions. Key responsibilities include:</p><p>- Developing machine learning models</p><p>- Conducting statistical analysis</p><p>- Creating data visualizations</p><p>- Collaborating with business teams</p><p>- Implementing data pipelines</p>",
      category: "Data Science",
      salary: 23000000,
      tags: ["python", "machine-learning", "sql", "tensorflow"],
      applicationDeadline: new Date("2025-05-15"),
      isPublished: false,
      requiresAssessment: true,
      isDeleted: false,
      companyLocationId: 5,
    },
    {
      companyId: 1,
      title: "Product Manager",
      description:
        "<p>We are seeking a Product Manager to drive our product vision. Your responsibilities will include:</p><p>- Defining product strategy and roadmap</p><p>- Gathering and analyzing user feedback</p><p>- Working with development teams</p><p>- Conducting market research</p><p>- Managing product launches</p>",
      category: "Product",
      salary: 24000000,
      tags: ["agile", "product-strategy", "leadership", "scrum"],
      applicationDeadline: new Date("2025-07-20"),
      isPublished: true,
      requiresAssessment: false,
      isDeleted: false,
      companyLocationId: 6,
    },
    {
      companyId: 1,
      title: "UX/UI Designer",
      description:
        "<p>Looking for a creative UX/UI Designer to enhance our digital products. You will:</p><p>- Create user-centered designs</p><p>- Conduct user research and testing</p><p>- Develop wireframes and prototypes</p><p>- Collaborate with development teams</p><p>- Maintain design systems</p>",
      category: "Design",
      salary: 20000000,
      tags: ["figma", "user-research", "interaction-design", "adobe-xd"],
      applicationDeadline: new Date("2025-04-30"),
      isPublished: false,
      requiresAssessment: false,
      isDeleted: false,
      companyLocationId: 4,
    },
    {
      companyId: 1,
      title: "DevOps Engineer",
      description:
        "<p>Join our DevOps team to improve our infrastructure. Key responsibilities:</p><p>- Managing cloud infrastructure</p><p>- Implementing CI/CD pipelines</p><p>- Monitoring system performance</p><p>- Automating deployment processes</p><p>- Managing security protocols</p>",
      category: "Engineering",
      salary: 26000000,
      tags: ["kubernetes", "docker", "terraform", "aws"],
      applicationDeadline: new Date("2025-06-15"),
      isPublished: false,
      requiresAssessment: true,
      isDeleted: false,
      companyLocationId: 5,
    },
    {
      companyId: 1,
      title: "Digital Marketing Specialist",
      description:
        "<p>We need a Digital Marketing Specialist to grow our online presence. You will:</p><p>- Plan and execute marketing campaigns</p><p>- Manage social media presence</p><p>- Analyze marketing metrics</p><p>- Create content strategies</p><p>- Optimize conversion rates</p>",
      category: "Marketing",
      salary: 18000000,
      tags: ["digital-marketing", "seo", "social-media", "google-analytics"],
      applicationDeadline: new Date("2025-05-30"),
      isPublished: true,
      requiresAssessment: false,
      isDeleted: false,
      companyLocationId: 6,
    },
    {
      companyId: 1,
      title: "Backend Developer",
      description:
        "<p>Seeking a Backend Developer to build robust services. Your role includes:</p><p>- Developing API endpoints</p><p>- Optimizing database performance</p><p>- Writing unit tests</p><p>- Documenting code and APIs</p><p>- Troubleshooting issues</p>",
      category: "Engineering",
      salary: 22000000,
      tags: ["java", "spring-boot", "postgresql", "redis"],
      applicationDeadline: new Date("2025-07-10"),
      isPublished: false,
      requiresAssessment: true,
      isDeleted: false,
      companyLocationId: 4,
    },
    {
      companyId: 1,
      title: "Business Intelligence Analyst",
      description:
        "<p>Join us as a BI Analyst to drive data-informed decisions. You will:</p><p>- Create data visualizations</p><p>- Build automated reports</p><p>- Analyze business metrics</p><p>- Present findings to stakeholders</p><p>- Maintain data quality</p>",
      category: "Business",
      salary: 19000000,
      tags: ["tableau", "sql", "power-bi", "data-analysis"],
      applicationDeadline: new Date("2025-06-01"),
      isPublished: false,
      requiresAssessment: false,
      isDeleted: false,
      companyLocationId: 5,
    },
    {
      companyId: 1,
      title: "Cloud Security Engineer",
      description:
        "<p>Help us maintain our cloud security infrastructure. Responsibilities include:</p><p>- Implementing security measures</p><p>- Conducting security audits</p><p>- Managing access controls</p><p>- Responding to security incidents</p><p>- Developing security policies</p>",
      category: "Security",
      salary: 27000000,
      tags: ["cloud-security", "compliance", "encryption", "aws-security"],
      applicationDeadline: new Date("2025-05-20"),
      isPublished: false,
      requiresAssessment: true,
      isDeleted: false,
      companyLocationId: 6,
    },
    {
      companyId: 1,
      title: "Frontend Developer",
      description:
        "<p>Looking for a Frontend Developer to create engaging user interfaces. You will:</p><p>- Build responsive web applications</p><p>- Implement UI components</p><p>- Optimize application performance</p><p>- Write unit tests</p><p>- Collaborate with designers</p>",
      category: "Engineering",
      salary: 21000000,
      tags: ["react", "typescript", "next.js", "tailwind"],
      applicationDeadline: new Date("2025-07-01"),
      isPublished: false,
      requiresAssessment: true,
      isDeleted: false,
      companyLocationId: 4,
    },
    {
      companyId: 1,
      title: "Quality Assurance Engineer",
      description:
        "<p>Join our QA team to ensure software quality. Key responsibilities:</p><p>- Creating test plans and cases</p><p>- Performing automated testing</p><p>- Identifying and tracking bugs</p><p>- Conducting regression testing</p><p>- Improving test processes</p>",
      category: "Engineering",
      salary: 19000000,
      tags: ["selenium", "cypress", "jest", "testing"],
      applicationDeadline: new Date("2025-06-25"),
      isPublished: false,
      requiresAssessment: true,
      isDeleted: false,
      companyLocationId: 5,
    },
    {
      companyId: 1,
      title: "Mobile App Developer",
      description:
        "<p>We need a Mobile Developer to build our next-gen apps. You will:</p><p>- Develop mobile applications</p><p>- Implement new features</p><p>- Optimize app performance</p><p>- Fix bugs and issues</p><p>- Work with cross-platform frameworks</p>",
      category: "Engineering",
      salary: 23000000,
      tags: ["react-native", "ios", "android", "mobile-development"],
      applicationDeadline: new Date("2025-07-15"),
      isPublished: false,
      requiresAssessment: true,
      isDeleted: false,
      companyLocationId: 6,
    },
    {
      companyId: 1,
      title: "HR Manager",
      description:
        "<p>Lead our HR initiatives as HR Manager. Responsibilities include:</p><p>- Managing recruitment processes</p><p>- Developing HR policies</p><p>- Handling employee relations</p><p>- Organizing training programs</p><p>- Managing performance reviews</p>",
      category: "Human Resources",
      salary: 22000000,
      tags: ["recruitment", "hr-management", "employee-relations", "training"],
      applicationDeadline: new Date("2025-06-20"),
      isPublished: true,
      requiresAssessment: false,
      isDeleted: false,
      companyLocationId: 4,
    },
    {
      companyId: 1,
      title: "Systems Analyst",
      description:
        "<p>Join us as a Systems Analyst to improve our processes. You will:</p><p>- Analyze business requirements</p><p>- Document system specifications</p><p>- Recommend process improvements</p><p>- Support system implementations</p><p>- Train end users</p>",
      category: "IT",
      salary: 20000000,
      tags: [
        "system-analysis",
        "business-process",
        "requirements-gathering",
        "documentation",
      ],
      applicationDeadline: new Date("2025-07-05"),
      isPublished: false,
      requiresAssessment: false,
      isDeleted: false,
      companyLocationId: 5,
    },
    {
      companyId: 1,
      title: "Content Strategist",
      description:
        "<p>Help shape our content strategy across platforms. Responsibilities include:</p><p>- Developing content strategies</p><p>- Creating content guidelines</p><p>- Managing content calendar</p><p>- Analyzing content performance</p><p>- Coordinating with writers</p>",
      category: "Marketing",
      salary: 18000000,
      tags: ["content-strategy", "seo", "content-management", "copywriting"],
      applicationDeadline: new Date("2025-06-10"),
      isPublished: true,
      requiresAssessment: false,
      isDeleted: false,
      companyLocationId: 6,
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
