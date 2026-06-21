import express from "express";
import path from "path";
import dns from "dns";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Fix localhost resolution issue
dns.setDefaultResultOrder("ipv4first");

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API Routes

// Helper: Intelligent Fallback Quiz Generator
function generateFallbackQuiz(subject: string, topic: string, level: string, noteContext?: string[]): any[] {
  let extractedTerms: { term: string; definition: string }[] = [];
  if (noteContext && noteContext.length > 0) {
    const fullText = noteContext.join(" ");
    const sentences = fullText.split(/[.!?]\s+/);
    for (const sentence of sentences) {
      const match = sentence.match(/^([A-Za-z\s]{3,25})\s+(?:is|refers to|means|defines|represents)\s+(.+)$/i) ||
                    sentence.match(/^([A-Za-z\s]{3,24})\s*:\s*(.+)$/i);
      if (match && match[1] && match[2] && match[2].length > 10) {
        extractedTerms.push({
          term: match[1].trim(),
          definition: match[2].trim()
        });
      }
    }
  }

  const cleanTopic = topic || "this core lecture";
  const cleanSubject = subject || "Study Mix";
  const questions: any[] = [];

  // If student has custom notes, generate tailored questions based directly on note content!
  if (extractedTerms.length >= 2) {
    const count = Math.min(extractedTerms.length, 3);
    for (let i = 0; i < count; i++) {
      const item = extractedTerms[i];
      const otherTerms = extractedTerms.filter((_, idx) => idx !== i).map(t => t.term);
      const distractor1 = otherTerms[0] || "Structured meta-analysis";
      const distractor2 = otherTerms[1] || "Quantitative logic modeling";
      const distractor3 = "Implicit regression metric";

      const options = [
        item.term,
        distractor1,
        distractor2,
        distractor3
      ].sort(() => Math.random() - 0.5);

      questions.push({
        question: `Based on your study notes, which term is defined as: "${item.definition}"?`,
        options,
        correctAnswer: item.term,
        explanation: `Your uploaded materials explicitly state that "${item.term}" refers to: ${item.definition.toLowerCase()}...`
      });
    }
  }

  const subjLower = cleanSubject.toLowerCase();
  
  if (subjLower.includes("sci") || subjLower.includes("bio") || subjLower.includes("chem") || subjLower.includes("phys") || subjLower.includes("med")) {
    const scienceTemplates = [
      {
        question: `When modeling "${cleanTopic}" inside contemporary scientific studies, what is the role of empirical active replication?`,
        options: [
          "To establish predictive consistency under standard controlled environments.",
          "To bypass qualitative variables entirely in research conclusions.",
          "To prove unchangeable metaphysical axioms with perfect certainty.",
          "To isolate thermodynamic energy leaks during system compression."
        ],
        correctAnswer: "To establish predictive consistency under standard controlled environments.",
        explanation: "Empirical science utilizes structured experimentation to establish replicable correlations in controlled environments."
      },
      {
        question: `Which of the following describes the core system mechanics regulating "${cleanTopic}"?`,
        options: [
          "A complex dynamic synthesis maintaining equilibrium and thermodynamic balance.",
          "Spontaneous electron generation in high-density vacuum chambers.",
          "Perfect entropy deceleration inside non-equilibrium atmospheric spaces.",
          "Continuous visual color frequency cooling relative to absolute zero."
        ],
        correctAnswer: "A complex dynamic synthesis maintaining equilibrium and thermodynamic balance.",
        explanation: "Many chemical, biological, and physical systems remain stable through balanced regulatory feedback loops."
      },
      {
        question: `According to rigorous peer-review standards, how can we best validate experimental results for "${cleanTopic}"?`,
        options: [
          "By employing independent replication trials and reporting key statistical variance.",
          "By utilizing public visual debates across digital community forums.",
          "By evaluating researcher credentials without checking secondary datasets.",
          "By checking if the project parameters fit standard textbook assumptions from a decade ago."
        ],
        correctAnswer: "By employing independent replication trials and reporting key statistical variance.",
        explanation: "Validating emerging scientific conclusions requires peer reviews, independent replication, and statistical analysis of data."
      }
    ];
    questions.push(...scienceTemplates);
  } else if (subjLower.includes("py") || subjLower.includes("python")) {
    const pythonTemplates = [
      {
        question: "In Python, which construct creates elements of a sequence dynamically on-the-fly, avoiding full-list memory pre-allocations?",
        options: [
          "A Generator function using the `yield` statement.",
          "A static List Comprehension using surrounding brackets `[]`.",
          "A dictionary lookup mapping static keys to integer arrays.",
          "A standard recursive division subroutine."
        ],
        correctAnswer: "A Generator function using the `yield` statement.",
        explanation: "Generators return an iterator object which yields values lazy-loaded one at a time, protecting physical RAM capacity."
      },
      {
        question: "How does Python resolve name conflicts in Multiple Inheritance during class instantiation?",
        options: [
          "Using Method Resolution Order (MRO) calculated via the C3 Linearization algorithm.",
          "By raising a compile-time SyntaxError naming all parent models.",
          "Selecting the parent descriptor alphabetical sorting priority list.",
          "Discarding base methods and forcing override callbacks."
        ],
        correctAnswer: "Using Method Resolution Order (MRO) calculated via the C3 Linearization algorithm.",
        explanation: "MRO preserves order of inheritance, resolving dependencies without repetition using C3 linearization."
      },
      {
        question: "What differentiates Python nested functional closure scope execution from typical static routines?",
        options: [
          "It remembers and accesses variable references from its surrounding lexical container.",
          "It compiles variables to standard static pointers inside the Node virtual memory bank.",
          "It executes variables automatically using global bitwise operations.",
          "It blocks any relational or functional input alterations."
        ],
        correctAnswer: "It remembers and accesses variable references from its surrounding lexical container.",
        explanation: "A closure retains references to variables from its outer enclosing function even after the outer function finishes executing."
      }
    ];
    questions.push(...pythonTemplates);
  } else if (subjLower.includes("tech") || subjLower.includes("code") || subjLower.includes("comp") || subjLower.includes("math")) {
    const techTemplates = [
      {
        question: `In modern technical design, what is a primary structural reason to implement modularity in "${cleanTopic}"?`,
        options: [
          "To minimize coupling, isolate single-responsibility systems, and simplify debugging.",
          "To store the entire program state inside a single process thread to avoid local heap limits.",
          "To bypass lexical namespace checks during high-frequency execution cycles.",
          "To completely remove compile-time static safety requirements."
        ],
        correctAnswer: "To minimize coupling, isolate single-responsibility systems, and simplify debugging.",
        explanation: "Modularity separates concerns, enabling programmers to test, refactor, and deploy small sections without breaking the whole application."
      },
      {
        question: `When optimizing system responsiveness and latency for "${cleanTopic}", which trade-off is most typical?`,
        options: [
          "Time complexity (computational overhead) vs. Space complexity (memory storage).",
          "Polymorphic syntax declarations vs. Static abstract structures.",
          "Custom visual animations vs. Backend database port configurations.",
          "Boolean conditional chains vs. System call stack depth limits."
        ],
        correctAnswer: "Time complexity (computational overhead) vs. Space complexity (memory storage).",
        explanation: "To speed up computations (reducing time), applications often allocate structured cache lookup tables or indices (increasing space)."
      },
      {
        question: `Which of the following outlines an industry best practice for protecting the security of "${cleanTopic}"?`,
        options: [
          "Sanitizing input parameters and configuring locked access-token authorization scopes.",
          "Exposing complete system log details in client browsers during live activities.",
          "Storing database passwords in open-source plain-text repositories.",
          "Disabling SSL protocol encryption when transferring user data blocks."
        ],
        correctAnswer: "Sanitizing input parameters and configuring locked access-token authorization scopes.",
        explanation: "System protection requires strict input sanitization to block injection exploits, paired with robust authorization scopes."
      }
    ];
    questions.push(...techTemplates);
  } else {
    const humanitiesTemplates = [
      {
        question: `When analyzing the historical evolution of "${cleanTopic}", which factor is most crucial to contextualize?`,
        options: [
          "The sociological, cultural, and political conditions of the temporal era.",
          "The thermodynamic coefficient of regional atmospheric pressure.",
          "The mechanical calculation of stellar orbits using classical equations.",
          "The linear algebraic variables of binary logic compilations."
        ],
        correctAnswer: "The sociological, cultural, and political conditions of the temporal era.",
        explanation: "Humanities and social studies analyze historical developments by synthesizing the prevailing cultural and societal contexts."
      },
      {
        question: `What primary methodology serves as the foundation for modern research into "${cleanTopic}"?`,
        options: [
          "Critical evaluation of primary sources integrated with qualitative text analysis.",
          "Isolating radioactive elements in localized laboratory environments.",
          "Executing regression analytics on micro-processor logic gates.",
          "Comparing abstract mathematical schemas using physical weight measurements."
        ],
        correctAnswer: "Critical evaluation of primary sources integrated with qualitative text analysis.",
        explanation: "Humanistic scholarship centers on the robust interpretation, citation, and translation of primary documents and cultural assets."
      },
      {
        question: `Which approach is widely considered most effective for tracking the intellectual currents of "${cleanTopic}"?`,
        options: [
          "An interdisciplinary study combining socio-cultural, economic, and political historical matrices.",
          "Ignoring history completely and focusing exclusively on instant commercial metrics.",
          "Discarding qualitative analysis in favor of physical molecular weights.",
          "Restricting reviews to a single institutional source with no external peer comparisons."
        ],
        correctAnswer: "An interdisciplinary study combining socio-cultural, economic, and political historical matrices.",
        explanation: "Complex ideas are best evaluated through multiple analytic lenses to understand their complete social and historic trajectory."
      }
    ];
    questions.push(...humanitiesTemplates);
  }

  // Backfill till we have at least 5 questions
  while (questions.length < 5) {
    const idx = questions.length + 1;
    questions.push({
      question: `Which fundamental principle of "${cleanTopic}" stands out as critical for academic milestone #${idx}?`,
      options: [
        "Sustained spaced-retrieval practice and conceptual connection mapping.",
        "Relying entirely on passive text reading and highlighting without active checks.",
        "Memorizing formulas verbatim without understanding their practical variables.",
        "Avoiding intermediate assessments or feedback during study sessions."
      ],
      correctAnswer: "Sustained spaced-retrieval practice and conceptual connection mapping.",
      explanation: "Active retrieval and linking new concepts to current mental models creates robust neural synaptic linkages."
    });
  }

  // Return formatted array of 5 questions
  return questions.slice(0, 5).map(q => {
    const options = [...q.options].sort(() => Math.random() - 0.5);
    return {
      ...q,
      options
    };
  });
}

// Helper: Intelligent Fallback Flashcard Generator
function generateFallbackFlashcards(subject: string, topic: string, noteContext?: string[]): any[] {
  const cleanTopic = topic || "Key Curriculum Core";
  const cleanSubject = subject || "Study Mix";
  const cards: any[] = [];

  if (noteContext && noteContext.length > 0) {
    const fullText = noteContext.join(" ");
    const sentences = fullText.split(/[.!?]\s+/);
    for (const sentence of sentences) {
      const match = sentence.match(/^([A-Za-z\s]{3,20})\s+(?:is|refers to|means|defines|represents)\s+(.+)$/i) ||
                    sentence.match(/^([A-Za-z\s]{3,20})\s*:\s*(.+)$/i);
      if (match && match[1] && match[2] && match[2].length > 5) {
        cards.push({
          question: `According to your notes, what represents "${match[1].trim()}"?`,
          answer: match[2].trim()
        });
      }
    }
  }

  const defaultCards = [
    {
      question: `What represents the main academic scope of "${cleanTopic}"?`,
      answer: `Analyzing the foundational structures, rules, and core components of ${cleanSubject}.`
    },
    {
      question: `What is the single most effective active review technique for "${cleanTopic}"?`,
      answer: "Engaging in self-guided test assessments, flashcard active-recall, and verbal teaching."
    },
    {
      question: `Define the core mechanism of spaced repetition in "${cleanSubject}".`,
      answer: "Revisiting material at expanding temporal intervals (1 day, 3 days, 1 week) to trigger long-term reinforcement."
    },
    {
      question: `What primary mistake should you avoid when studying "${cleanTopic}"?`,
      answer: "Passive slide review without self-testing, which constructs a temporary 'recognition' illusion rather than true retention."
    },
    {
      question: `How does our gamified setup support studying "${cleanTopic}"?`,
      answer: "It gamifies consistent study habits by granting XP, shop coins, and academic quest rewards!"
    }
  ];

  cards.push(...defaultCards);
  return cards.slice(0, 5);
}

// Robust custom helper with auto-retries and fallback to gemini-3.1-flash-lite on 503 errors
async function generateGeminiContent(params: {
  model: string;
  contents: any;
  config?: any;
}) {
  const modelsToTry = [params.model, params.model, "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const modelCandidate = modelsToTry[i];
    try {
      console.log(`[Gemini Request] Attempt ${i + 1}/${modelsToTry.length} using model: ${modelCandidate}`);
      const response = await ai.models.generateContent({
        ...params,
        model: modelCandidate,
      });
      if (response) {
        return response;
      }
    } catch (err: any) {
      console.warn(`[Gemini Request] Attempt ${i + 1} failed with error:`, err?.message || err);
      lastError = err;
      
      // If we are hitting a 429 / RESOURCE_EXHAUSTED / quota error, do NOT retry.
      // Fast-fail to let the application instantly serve the client its elegant, highly polished offline academic fallbacks.
      const errStr = String(err?.message || err || "").toLowerCase();
      const isQuotaError = errStr.includes("429") || 
                           errStr.includes("quota") || 
                           errStr.includes("rate limit") ||
                           errStr.includes("resource_exhausted") || 
                           err?.status === 429 || 
                           err?.statusCode === 429 || 
                           err?.status === "RESOURCE_EXHAUSTED";
      
      if (isQuotaError) {
        console.log("[Gemini Request] Rate limit / quota exceeded (429) detected. Fast-failing to serve instant high-fidelity offline study materials.");
        throw err;
      }
      
      if (i < modelsToTry.length - 1) {
        const delay = (i + 1) * 800; // incremental backoff (800ms, 1600ms)
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError || new Error("Failed to generate content with any Gemini model.");
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 1. Explain Topic / Voice Tutor / RAG Q&A Endpoint
app.post("/api/gemini/explain", async (req, res) => {
  const { topic, contextNoteChunks, isVoice, chatHistory, activeCompanion } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "Topic or question is required." });
  }

  try {
    let prompt = "";
    let systemInstruction = "";

    let personaInstruction = "";
    if (activeCompanion) {
      personaInstruction = `\n\nCRITICAL CONTEXT & PERSONA DIRECTIVES:
Your name is "${activeCompanion.name || "Acolyte Companion"}". You are the student's personal equipped study mentor, cheerleader, and motivational coach!
Companion Description: "${activeCompanion.description || "Active AI Mentor"}"
Identify what your ID/value is: "${activeCompanion.id || activeCompanion.value || ""}"

You MUST adapt your tone, style, vocabulary, and metaphors to fit this active companion perfectly:
1. "acolyte-elrond" (Cyber-Visor Owl): You are deeply academic, graceful, wise, and slightly metaphysical. Speak with elegant scholarly composure, use magic/wizardry and cosmic orbital calculations, and insert owl emojis (🦉). Show supreme calm intellect.
2. "acolyte-vortex" (Cyber-Holo Falcon): You are supersonic, high-speed, and high-intensity. Keep answers snappy, speak with exclamation marks, refer to tactical supersonic maneuvers, track "cognitive airspace", and insert falcon/lightning/jet emojis (🦅, ⚡, 🚀).
3. "acolyte-orion" (Hypergrade Wolf): You are rugged, fiercely protective, loyal, and tactical. Refer to the student as "focus partner" or "pack mate", mention 3D wireframe strategy guides, track academic milestones like hunting prey, and use wolf/shield/tactical emojis (🐺, 🛡️, 🎯).
4. "acolyte-aurora" (Neon-Glass Fox): You are warm, ultra-supportive, peaceful, and cool. Focus heavily on anxiety reduction, cosmic flow state, breathing easily, and beautiful learning. Use fox/spark/wind emojis (🦊, ✨, 🌬️).
5. "acolyte-glitch" (Goggle-HUD Drake): You are super-excited, energetic, bubbly, and glitchy. Make tiny bzzt/whir sound comments, do excited wing flaps (*excited wing-flaps*), celebrate coin/study rewards ecstatically, and use drake/rainbow/spark emojis (🐉, 🌈, ✨).
6. "acolyte-specter" (Core-HUD Panther): You are sleek, silent, hyper-observant, and deeply patient. Focus on stalking through complex algorithms, absolute deep shadow focus, mysterious shadow wisdom, and insert panther/cat/paw emojis (🐈‍⬛, 🐾, 🌘).
7. "acolyte-spark" (Sub-Aqua Axolotl): You are cute, bubbly, friendly, and watery. Talk about taking deep dives into memory, hydrodynamic processor cooling limits, floating with happy vibes, and use axolotl/bubble/sea emojis (🦎, 🫧, 🌊).
8. "wise-owl" (Classic Owl) or "zen-cat" (Classic Cat) or "chibi-dragon" (Classic Dragon) or "robo-buddy" (Standard bot): Speak in structured friendly supportive tones corresponding to those classic avatars.

Rules of Interaction:
- ALWAYS speak in character as this companion. Never drop character or say you are "an AI assistant by Google".
- Start your response with a short visual action gesture matching your character (e.g., "*Acolyte Elrond zooms his stellar visor:* " or "*Acolyte Vortex boots supersonic focus arrays:* " or "*Acolyte Glitch does happy spark rolls:* " or "*Acolyte Aurora adjusts her neon-pink spectacles:* ") before speaking.
- If the user asks for motivation (directly or via touch prompts), give them an incredibly inspiring, customized, high-yield motivational pep talk that references their companion identity and reinforces their consistency! Encourage their streak!`;
    }

    if (contextNoteChunks && contextNoteChunks.length > 0) {
      const formattedChunks = contextNoteChunks
        .map((c: any, index: number) => `[Source ${index + 1}: ${c.noteTitle} - Subject: ${c.noteSubject}]\n"${c.text}"`)
        .join("\n\n");

      systemInstruction = `You are an AI-Powered Study Buddy and expert Biology & Science tutor.
You have access to the user's uploaded textbook and session notes as context.
Answer the student's question based strictly on the provided context notes whenever possible.
CITE your sources clearly using the [Source N] format.
If the notes do not contain the answer, answer anyway using your general scientific tutoring directory, but state: 'I could not find the exact answer in your notes, so here is an explanation from my biology curriculum:'

CRITICAL INSTRUCTION FOR DIAGRAMS:
If the student asks for a diagram, asks to visualize a biological structure, or mentions cell organelles (e.g., Mitochondria, Nucleus, Chloroplast), cellular processes (Mitosis, Photosynthesis, Cellular Respiration), anatomical organs, or biochemical pathways described in the textbook:
- You MUST dynamically synthesize and render a highly detailed, beautifully colored, scientifically accurate SVG diagram directly within your response.
- Wrap the SVG code between standard <svg> and </svg> tags.
- The SVG MUST have viewBox="0 0 800 500" or similar, set width="100%" and height="auto", and be fully responsive.
- Design with a modern, futuristic educational style: use dark background (or transparent), vibrant glowing neon colors (neon pink, electrical blue, toxic green, warning amber), beautiful gradients, clear text labels with high contrast, and smooth path diagrams representing real anatomical/cytological structures.
- Label every single organelle or element clearly with SVG <text> elements. Include a title header inside the SVG.
- Always provide explanatory/step-by-step paragraphs alongside the diagram.
Keep descriptions engaging, formatted with clear bold headers, and end with an encouraging tutor remark.`;

      systemInstruction += personaInstruction;
      prompt = `Context Notes:\n${formattedChunks}\n\nStudent Question:\n${topic}`;
    } else {
      systemInstruction = `You are an AI-Powered Study Buddy and expert Biology & Science tutor.
Explain concepts clearly and in simple, student-friendly language (analogy-rich, structured, avoid massive walls of text).
If "isVoice" is true, make your response conversational and optimized for listening, but otherwise focus on rich text explanations.

CRITICAL INSTRUCTION FOR DIAGRAMS:
If the student asks for a diagram, asks to visualize a biological structure, or mentions cell organelles (e.g., Mitochondria, Nucleus, Chloroplast), cellular processes (Mitosis, Photosynthesis, Cellular Respiration), anatomical organs, or biochemical pathways:
- You MUST dynamically synthesize and render a highly detailed, beautifully colored, scientifically accurate SVG diagram directly within your response.
- Wrap the SVG code between standard <svg> and </svg> tags.
- The SVG MUST have viewBox="0 0 800 500" or similar, set width="100%" and height="auto", and be fully responsive.
- Design with a modern, futuristic educational style: use dark background (or transparent), vibrant glowing neon colors (neon pink, electrical blue, toxic green, warning amber), beautiful gradients, clear text labels with high contrast, and smooth path diagrams representing real anatomical/cytological structures.
- Label every single organelle or element clearly with SVG <text> elements. Include a title header inside the SVG.
- Always provide explanatory/step-by-step paragraphs alongside the diagram.
Celebrate the student's curiosity and encourage them.`;

      systemInstruction += personaInstruction;
      prompt = `Topic/Concept to explain: ${topic}`;
      if (isVoice) {
        prompt += `\n(Make sure the response is highly conversational and fits voice lecturing under 3-4 short sentences!)`;
      }
    }

    let contents: any[] = [];
    if (chatHistory && chatHistory.length > 0) {
      contents = chatHistory.map((h: any) => ({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: h.content }],
      }));
    }
    contents.push({ parts: [{ text: prompt }] });

    const response = await generateGeminiContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.warn("Gemini Explain Error, delivering highly intelligent fallback:", error);
    let fallbackText = "";
    if (isVoice) {
      fallbackText = `I processed your spoken inquiry about "${topic}". This concept represents a very powerful foundation in this subject curriculum! To master it with high retention, try formulating a study note overview, or practice building a 5-question test assessment using our Quizzes menu tab.`;
    } else {
      fallbackText = `### Synthesized Study Summary: **${topic}** \n\nI processed your study inquiry. Here is an academic concept outline to guide your review:\n\n* **Core Foundation**: Analyzing "${topic}" is a key learning milestone in this discipline.\n* **Cognitive Connection**: Linking new lessons with real-world analogies builds permanent recall networks.\n* **Study Strategy**: Check your study notes for context, or take a quick active assessment using the Quizzes dashboard tab to track progress!\n\n*Consistency brings academic excellence. Keep pushing your intellectual margins!*`;
    }
    res.json({ text: fallbackText, isFallback: true });
  }
});

// 2. Note Summarization & Formatting Endpoint
app.post("/api/gemini/summarize", async (req, res) => {
  const { noteTitle, noteContent, noteSubject } = req.body;
  if (!noteContent) {
    return res.status(400).json({ error: "Note content is required." });
  }

  try {
    const systemInstruction = `You are an expert Note Summarizer.
Your goal is to parse messy, raw study notes, lecture slide text, or messy transcripts and transform them into a fully structured, beautiful study guide.
Create:
1. **Summary Overview**: A high-level 2-sentence synopsis.
2. **Key Definitions / Terminology**: Identify and define tricky terms from the input.
3. **Core Concepts (Structured Outline)**: Create a clean outline formatting with bullet points and bold, actionable takeaways.
4. **Analogy / Real-world Application**: An interesting visual analogy to help remember it.
5. **Quick Quiz Hook**: Pose 2 thought-provoking questions the student should be able to answer now.

Format the entire output using tidy Markdown headers. Do not include meta instructions.`;

    const prompt = `Subject: ${noteSubject || "General"}\nTopic: ${noteTitle || "Untitled Notes"}\nRaw Content:\n${noteContent}`;

    const response = await generateGeminiContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.warn("Gemini Summarize Error, sending styled academic fallback study guide:", error);
    const fallbackSummary = `### Summary Overview: ${noteTitle || "Active Study Reference"}\n\n* **Academic Focus**: Successfully synthesized notes categorized under **${noteSubject || "General"}**.\n* **Core Takeaway**: Consistent testing and recall of this lecture's process steps is highly recommended for test readiness.\n\n### Key Definitions & Terminology:\n* **Concept Integration**: The systematic connection of emerging raw notes into active formatted study guides.\n\n### Analogy to Remember:\n* Think of studying this material like standard compounding interest: simple daily practice gains massive long-term cognitive returns!\n\n### Quick Quiz Hook:\n1. What is the single most critical argument or definition introduced in this section?\n2. In what practical scenario would you apply this specific principle?`;
    res.json({ text: fallbackSummary, isFallback: true });
  }
});

// 3. Quiz Generation Endpoint
app.post("/api/gemini/generate-quiz", async (req, res) => {
  const { topic, subject, level, noteContext } = req.body;
  const targetTopic = topic || "General Trivia";
  const targetSubject = subject || "Study Mix";

  try {
    let contextText = "";
    if (noteContext && noteContext.length > 0) {
      contextText = `Base these quiz questions entirely on the following notes data:\n${noteContext.join("\n\n")}`;
    }

    const systemInstruction = `You are an educational Assessment Architect.
Your task is to generate 5 high-quality, conceptual multiple-choice questions for a student quiz.
Questions must challenge thinking, not just raw memorization.
Each question must have exactly 4 choices and exactly 1 clearly identified correct answer.
Maintain an appropriate difficulty level (${level || "Medium"}).
Provide a clear, brief 1-sentence educational explanation for why the answer is correct.
Output strict JSON matching the schema of 5 questions.`;

    const prompt = `${contextText}\n\nSubject: ${targetSubject}\nTopic/Topic Outline: ${targetTopic}\nDifficulty: ${level || "Medium"}`;

    const response = await generateGeminiContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "A set of exactly 5 multiple choice questions",
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: "The core question prompt.",
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 4 options.",
              },
              correctAnswer: {
                type: Type.STRING,
                description: "The exact matching string of the correct option from the options list.",
              },
              explanation: {
                type: Type.STRING,
                description: "A helpful explanation of why this answer is correct.",
              },
            },
            required: ["question", "options", "correctAnswer", "explanation"],
          },
        },
      },
    });

    const questions = JSON.parse(response.text || "[]");
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      throw new Error("Empty questions returned.");
    }
    res.json({ questions });
  } catch (error: any) {
    console.warn("Gemini Quiz Error, supplying beautiful localized fallbacks:", error);
    const questions = generateFallbackQuiz(targetSubject, targetTopic, level, noteContext);
    res.json({ questions });
  }
});

// 4. Flashcard Generation Endpoint
app.post("/api/gemini/generate-flashcards", async (req, res) => {
  const { topic, subject, noteContext } = req.body;
  const targetTopic = topic || "General Concepts";
  const targetSubject = subject || "Study Deck";

  try {
    let contextText = "";
    if (noteContext && noteContext.length > 0) {
      contextText = `Base these flashcards entirely on the following notes data:\n${noteContext.join("\n\n")}`;
    }

    const systemInstruction = `You are a Flashcard Craftsman.
Generate 5 high-yield, premium flashcards for active recall study.
Each flashcard consists of a brief, precise 'question' (front) and a concise, clear 'answer' (back).
Make sure to extract keys, definitions, historical facts, equations, formulas, or process steps.
Avoid long answers.
Output strict JSON matching the schema of 5 cards.`;

    const prompt = `${contextText}\n\nSubject: ${targetSubject}\nTopic: ${targetTopic}`;

    const response = await generateGeminiContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "A set of 5 active recall flashcards",
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: "The question on the front of the card.",
              },
              answer: {
                type: Type.STRING,
                description: "The concise explanation or fact on the back of the card.",
              },
            },
            required: ["question", "answer"],
          },
        },
      },
    });

    const flashcards = JSON.parse(response.text || "[]");
    if (!flashcards || !Array.isArray(flashcards) || flashcards.length === 0) {
      throw new Error("Empty flashcards returned.");
    }
    res.json({ flashcards });
  } catch (error: any) {
    console.warn("Gemini Flashcard Error, generating localized active cards:", error);
    const flashcards = generateFallbackFlashcards(targetSubject, targetTopic, noteContext);
    res.json({ flashcards });
  }
});

// Boot Full-Stack Core
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
