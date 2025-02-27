import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Define the questions and options to be seeded
  const questions = [
    // Skipping question IDs 1, 2, 5, 6, and 7
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correct: 0,
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Venus", "Jupiter"],
      correct: 1,
    },
    { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], correct: 1 },
    {
      question: "Which animal is known as the King of the Jungle?",
      options: ["Tiger", "Elephant", "Lion", "Bear"],
      correct: 2,
    },
    {
      question: "Which is the largest ocean on Earth?",
      options: [
        "Atlantic Ocean",
        "Indian Ocean",
        "Arctic Ocean",
        "Pacific Ocean",
      ],
      correct: 3,
    },
    {
      question: "Who wrote the play Romeo and Juliet?",
      options: ["Shakespeare", "Dickens", "Hemingway", "Austen"],
      correct: 0,
    },
    {
      question: "What is the square root of 16?",
      options: ["2", "4", "6", "8"],
      correct: 1,
    },
    {
      question: "Who painted the Mona Lisa?",
      options: [
        "Vincent van Gogh",
        "Leonardo da Vinci",
        "Pablo Picasso",
        "Claude Monet",
      ],
      correct: 1,
    },
    {
      question: "What is the chemical symbol for water?",
      options: ["H2O", "O2", "CO2", "NaCl"],
      correct: 0,
    },
    {
      question: "What is the largest planet in our solar system?",
      options: ["Earth", "Saturn", "Jupiter", "Neptune"],
      correct: 2,
    },
    {
      question: "What is the main ingredient in guacamole?",
      options: ["Tomato", "Avocado", "Lime", "Chili"],
      correct: 1,
    },
    {
      question: "Which country is known as the Land of the Rising Sun?",
      options: ["China", "India", "Japan", "South Korea"],
      correct: 2,
    },
    {
      question: "What is the currency of the United States?",
      options: ["Euro", "Pound", "Yen", "Dollar"],
      correct: 3,
    },
    {
      question: "How many continents are there?",
      options: ["5", "6", "7", "8"],
      correct: 2,
    },
    {
      question: "What is the boiling point of water in Celsius?",
      options: ["90°C", "95°C", "100°C", "105°C"],
      correct: 2,
    },
    {
      question: "What is the fastest land animal?",
      options: ["Cheetah", "Lion", "Tiger", "Horse"],
      correct: 0,
    },
    {
      question: "Which element has the chemical symbol O?",
      options: ["Oxygen", "Osmium", "Ozone", "Opium"],
      correct: 0,
    },
    {
      question: "What is the capital of Japan?",
      options: ["Tokyo", "Beijing", "Seoul", "Bangkok"],
      correct: 0,
    },
    {
      question: "What is the primary language spoken in Brazil?",
      options: ["Spanish", "Portuguese", "English", "French"],
      correct: 1,
    },
    {
      question: "What is the largest animal on Earth?",
      options: ["Elephant", "Blue Whale", "Shark", "Giraffe"],
      correct: 1,
    },
  ];

  // Create the questions and their options
  for (let i = 0; i < questions.length; i++) {
    const { question, options, correct } = questions[i];

    // Create the question in the database
    const createdQuestion = await prisma.preTestAssessmentQuestion.create({
      data: {
        preTestAssessmentId: 2, // Use preTestAssessmentId as 2 for all questions
        question: question,
        preTestAssessmentOptions: {
          create: options.map((option, index) => ({
            option: option,
            isCorrect: index === correct, // Set correct option based on the index
          })),
        },
      },
    });

    console.log(
      `Question with ID ${createdQuestion.id} created: "${question}"`
    );
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
