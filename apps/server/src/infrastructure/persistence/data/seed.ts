import { PrismaClient } from "@prisma/client";

export const seed = async (db: PrismaClient) => {
    await resetDatabase(db);

    console.log("Inserting quizzes ✨");

    // JavaScript Quiz
    const jsQuiz = await db.quiz.create({
        data: {
            title: "JavaScript Fundamentals",
            description: "Test your knowledge of JavaScript core concepts",
            questions: {
                create: [
                    {
                        content: "Which of the following is NOT a JavaScript data type?",
                        point: 30,
                        timeLimitSeconds: 10,
                        choices: {
                            create: [
                                { content: "String", isCorrect: false },
                                { content: "Boolean", isCorrect: false },
                                { content: "Float", isCorrect: true },
                                { content: "Object", isCorrect: false }
                            ]
                        }
                    },
                    {
                        content: "What does the '===' operator do in JavaScript?",
                        point: 20,
                        timeLimitSeconds: 15,
                        choices: {
                            create: [
                                { content: "Compares values only", isCorrect: false },
                                { content: "Compares values and types", isCorrect: true },
                                { content: "Assigns a value", isCorrect: false },
                                { content: "Checks if a value exists", isCorrect: false }
                            ]
                        }
                    },
                    {
                        content: "Which method adds an element to the end of an array?",
                        point: 8,
                        choices: {
                            create: [
                                { content: "push()", isCorrect: true },
                                { content: "pop()", isCorrect: false },
                                { content: "shift()", isCorrect: false },
                                { content: "unshift()", isCorrect: false }
                            ]
                        }
                    }
                ]
            }
        },
        include: {
            questions: true,
        }
    });

    // WebSockets Quiz
    const websocketsQuiz = await db.quiz.create({
        data: {
            title: "WebSockets Deep Dive",
            description: "Explore the realtime communication protocol",
            questions: {
                create: [
                    {
                        content: "What is the main advantage of WebSockets over HTTP?",
                        point: 10,
                        timeLimitSeconds: 10,
                        choices: {
                            create: [
                                { content: "Full-duplex communication", isCorrect: true },
                                { content: "Faster initial connection", isCorrect: false },
                                { content: "Less bandwidth usage", isCorrect: false },
                                { content: "Better security", isCorrect: false }
                            ]
                        }
                    },
                    {
                        content: "Which event is fired when a WebSocket connection is established?",
                        point: 15,
                        timeLimitSeconds: 20,
                        choices: {
                            create: [
                                { content: "onconnect", isCorrect: false },
                                { content: "onopen", isCorrect: true },
                                { content: "onstart", isCorrect: false },
                                { content: "oninit", isCorrect: false }
                            ]
                        }
                    },
                    {
                        content: "What protocol does WebSocket use after the initial handshake?",
                        point: 15,
                        timeLimitSeconds: 10,
                        choices: {
                            create: [
                                { content: "HTTP", isCorrect: false },
                                { content: "TCP", isCorrect: true },
                                { content: "UDP", isCorrect: false },
                                { content: "SMTP", isCorrect: false }
                            ]
                        }
                    },
                    {
                        content: "What is the WebSocket URL scheme for secure connections?",
                        point: 10,
                        timeLimitSeconds: 10,
                        choices: {
                            create: [
                                { content: "ws://", isCorrect: false },
                                { content: "wss://", isCorrect: true },
                                { content: "http://", isCorrect: false },
                                { content: "https://", isCorrect: false }
                            ]
                        }
                    }
                ]
            }
        },
        include: {
            questions: true,
        }
    });

    // Networking Quiz
    const networkingQuiz = await db.quiz.create({
        data: {
            title: "Computer Networking Basics",
            description: "Learn the fundamentals of computer networks",
            questions: {
                create: [
                    {
                        content: "Which OSI layer is responsible for routing?",
                        point: 20,
                        timeLimitSeconds: 10,
                        choices: {
                            create: [
                                { content: "Physical Layer", isCorrect: false },
                                { content: "Data Link Layer", isCorrect: false },
                                { content: "Network Layer", isCorrect: true },
                                { content: "Transport Layer", isCorrect: false }
                            ]
                        }
                    },
                    {
                        content: "What is the default port for HTTP?",
                        point: 15,
                        timeLimitSeconds: 15,
                        choices: {
                            create: [
                                { content: "21", isCorrect: false },
                                { content: "22", isCorrect: false },
                                { content: "80", isCorrect: true },
                                { content: "443", isCorrect: false }
                            ]
                        }
                    },
                    {
                        content: "Which protocol is connectionless?",
                        point: 15,
                        timeLimitSeconds: 20,
                        choices: {
                            create: [
                                { content: "TCP", isCorrect: false },
                                { content: "UDP", isCorrect: true },
                                { content: "HTTP", isCorrect: false },
                                { content: "FTP", isCorrect: false }
                            ]
                        }
                    }
                ]
            }
        },
        include: {
            questions: true,
        }
    });

    console.log("Quizzes created ✅");

    console.log(`Created ${jsQuiz.questions.length} questions for JavaScript quiz`);
    console.log(`Created ${websocketsQuiz.questions.length} questions for WebSockets quiz`);
    console.log(`Created ${networkingQuiz.questions.length} questions for Networking quiz`);
};

async function resetDatabase(db: PrismaClient) {
    console.log("Resetting database 🔄");
    await db.$transaction([
        db.answer.deleteMany(),
        db.question.deleteMany(),
        db.quiz.deleteMany(),
    ]);

    console.log("Database reset ✅");
}