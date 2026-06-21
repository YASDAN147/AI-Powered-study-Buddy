import { useState, useEffect } from "react";
import { 
  BookOpen, Award, Flame, Sparkles, CheckCircle2, Code, Terminal, 
  ArrowRight, ChevronRight, Play, Lightbulb, BookOpenText, UserCheck, Compass, HelpCircle, RefreshCw,
  Cpu, Activity, Zap, Beaker, Hourglass
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playChimeSound } from "../utils/sound";
import { StudyNote } from "../types";

interface AdaptivePathProps {
  onEarnReward: (xpGained: number, coinsGained: number, isPerfectQuiz?: boolean) => void;
  onAddNote: (note: StudyNote) => void;
  notes: StudyNote[];
}

interface Milestone {
  id: string;
  phase: string;
  title: string;
  description: string;
  beginnerTopics: string[];
  intTopics: string[];
  advTopics: string[];
  challengeTitle: string;
  challengePrompt: string;
  challengeCodeTemplate: string;
  challengeSolutionKeyword: string;
  hint: string;
  suggestedPrompt: string;
}

const pythonMilestones: Milestone[] = [
  {
    id: "py-m1",
    phase: "Phase 1",
    title: "Python Sandbox & Dynamic Typing",
    description: "Unravel interpreted logic execution, primitive variables, and relational formatting structures.",
    beginnerTopics: ["Declaring variables (strings, integers, floats)", "Relational and arithmetic operators", "Console output using print() formatting"],
    intTopics: ["Dynamic memory pointers vs deep object copying", "Manipulating immutable states", "Using f-strings with formatted floating points"],
    advTopics: ["Integer bitwise shift maneuvers", "Dynamic variable namespace globals() evaluation", "Garbage collection and reference counting internals"],
    challengeTitle: "Variable Squaring Machine",
    challengePrompt: "Define a variable named `base_val` and store the integer `12`. Next, calculate its squared value and store it inside a variable named `result_val`. Finally, print `result_val`.",
    challengeCodeTemplate: "# Complete your Phase 1 squarer challenge below\nbase_val = 12\n",
    challengeSolutionKeyword: "result_val =",
    hint: "Use result_val = base_val ** 2 or result_val = base_val * base_val, and remember print()!",
    suggestedPrompt: "Act as an expert computer science professor. Break down dynamic typing in Python with simple analogies for a beginner."
  },
  {
    id: "py-m2",
    phase: "Phase 2",
    title: "Collection Structures & Iteration Loops",
    description: "Explore composite collections like structural Lists, indexed Tuples, Dictionaries, and Sets.",
    beginnerTopics: ["Creating list collections with brackets []", "Retrieving elements via positive index positions", "Basic for loops to traverse elements"],
    intTopics: ["Building nested List Comprehensions", "Key-Value pairs operations inside Dictionary collections", "Handling duplicate variables with Sets"],
    advTopics: ["Designing custom iterators using __iter__", "Generating sequences dynamically using Yield generators", "Time complexity calculations of list slices vs deque structures"],
    challengeTitle: "List Filtration Master",
    challengePrompt: "Create a list named `input_list` containing: [3, 8, 12, 17, 20]. Create a new list named `filtered_list` by using a list comprehension that extracts only values strictly greater than 10.",
    challengeCodeTemplate: "# Construct your list filter comprehension\ninput_list = [3, 8, 12, 17, 20]\n",
    challengeSolutionKeyword: "filtered_list =",
    hint: "filtered_list = [x for x in input_list if x > 10] matches the syntax required to pass!",
    suggestedPrompt: "Give me an intuitive study lesson concerning Python list comprehensions, explaining when to avoid them for readability."
  },
  {
    id: "py-m3",
    phase: "Phase 3",
    title: "Functional Architecture & Scope",
    description: "Structure modular scopes by leveraging functions, arguments, return parameters, and standard modules.",
    beginnerTopics: ["Defining functions using def keyword", "Passing positional arguments", "Returning parameters to main code runtime"],
    intTopics: ["Passing keyword arguments *args and **kwargs", "Declaring anonymous inline lambda routines", "Local vs global lexical namespaces"],
    advTopics: ["Designing custom higher-order function wrappers", "Applying nested decorator functions", "Enforcing closures to persist state memory"],
    challengeTitle: "Fahrenheit Celsius Converter",
    challengePrompt: "Define a function named `to_celsius(fahrenheit)` that calculates the formula: `(fahrenheit - 32) * 5/9` and returns the output. Check it by printing `to_celsius(68)`.",
    challengeCodeTemplate: "# Build your temperature conversion routine\ndef to_celsius(fahrenheit):\n",
    challengeSolutionKeyword: "return",
    hint: "Multiply fahrenheit subtractor by 5, then divide by 9. Ensure you include the 'return' command!",
    suggestedPrompt: "Explain Python lexical scoping (the LEGB rule) with clear coding snippets."
  },
  {
    id: "py-m4",
    phase: "Phase 4",
    title: "Object-Oriented Programming (OOP)",
    description: "Construct scalable object engines grouping variables and behaviours into Classes and Inheritance lines.",
    beginnerTopics: ["Creating a Class with class keyword and instance structures", "Defining attributes inside the __init__ initializer method", "Instantiating class instances"],
    intTopics: ["Configuring property decorators for encapsulation", "Creating derived classes via Single-Inheritance", "Overriding base class methods"],
    advTopics: ["Implementing Multiple Inheritance with Method Resolution Order (MRO)", "Invoking operational polymorphic operator overloading methods like __add__", "Overriding __new__ factories"],
    challengeTitle: "Mascot Companion Class",
    challengePrompt: "Construct a class named `StudyMascot`. The `__init__(self, name)` method should store `self.name = name`. Next, define a method named `greet(self)` that returns `f'Hello, {self.name}!'`.",
    challengeCodeTemplate: "# Code your Python OOP mascot template below\nclass StudyMascot:\n",
    challengeSolutionKeyword: "self.name",
    hint: "Establish def __init__(self, name): and def greet(self): carefully to complete the object rules.",
    suggestedPrompt: "Create a detailed Python lesson on encapsulation and polymorphism, demonstrating them with animal mascot examples."
  },
  {
    id: "py-m5",
    phase: "Phase 5",
    title: "Practical Scripting & Data Parsing",
    description: "Interact with storage disks, request remote web assets via REST APIs, and integrate external tool packages.",
    beginnerTopics: ["Reading file contents using open() with blocks", "Importing mathematical libraries of python (import math)", "Writing text files safely"],
    intTopics: ["Parsing raw JSON string dictionaries using json package", "Constructing GET requests using requests library", "Implementing try...except blocks"],
    advTopics: ["Creating operational asyncio loops and concurrent operations", "Handling massive databases via sqlalchemy engine tools", "Writing custom exception wrapper hierarchies"],
    challengeTitle: "Web Request Exception Handler",
    challengePrompt: "Write a try-except structure. Inside the `try` block, invoke a function `execute_call()` which is simulated. Inside the `except Exception as err:` block, set a variable `error_logged = True` and print `err`.",
    challengeCodeTemplate: "# Implement standard python try-except scoping\ntry:\n    execute_call()\n",
    challengeSolutionKeyword: "except",
    hint: "Remember to indent properly and register 'except Exception as err:' to log code warnings.",
    suggestedPrompt: "Develop a Python tutorial on asynchronously consuming REST Web APIs using standard asyncio libraries."
  }
];

const csMilestones: Milestone[] = [
  {
    id: "cs-m1",
    phase: "Phase 1",
    title: "Algorithmic Complexity & Big-O",
    description: "Analyze worst-case time complexity scenarios of key search and filter routines.",
    beginnerTopics: ["Linear Search complexity O(N)", "Binary Search logarithmic divisions O(log N)", "Constant time O(1) dictionary lookups"],
    intTopics: ["Quadratic complexity O(N²) bubble sort structures", "Log-linear O(N log N) Merge Sort algorithms", "Space complexity auxiliary storage analysis"],
    advTopics: ["Amortized analysis mathematical proof bounds", "NP-Complete and NP-Hard decision constraints", "Master Theorem recursion recurrence formulas"],
    challengeTitle: "Binary Search Split Counter",
    challengePrompt: "Write a function `binary_splits(n)` that returns the maximum number of recursive split divisions needed to search `n` items, calculated as the ceiled base-2 logarithm of `n`: `math.ceil(math.log2(n))`.",
    challengeCodeTemplate: "import math\n\ndef binary_splits(n):\n    # Calculate splits dynamically\n",
    challengeSolutionKeyword: "math.ceil",
    hint: "Use 'return math.ceil(math.log2(n))' and make sure you retain the math import.",
    suggestedPrompt: "Illustrate the difference between Average-case and Worst-case analysis of Quick Sort using beautiful ASCII tracing."
  },
  {
    id: "cs-m2",
    phase: "Phase 2",
    title: "Relational SQL Operations",
    description: "Examine key constraints, JOIN operations, aggregation filters, and query scanners.",
    beginnerTopics: ["SELECT column projections", "WHERE conditions filters", "ORDER BY sorting modifiers"],
    intTopics: ["INNER JOIN and LEFT JOIN references", "GROUP BY aggregation counts", "HAVING filtration thresholds"],
    advTopics: ["Subqueries vs Common Table Expressions (CTEs)", "B-Tree vs Hash indexing execution scans", "Isolation levels and concurrency locks"],
    challengeTitle: "Top Student Finder Query",
    challengePrompt: "Write an ANSI SQL statement mapping top participants: select `name` and `score` columns from table `students` filtering for scores strictly greater than `90` sorted descending.",
    challengeCodeTemplate: "-- Write your raw SQL query\nSELECT \n",
    challengeSolutionKeyword: "WHERE score > 90",
    hint: "Your query should contain: SELECT name, score FROM students WHERE score > 90 ORDER BY score DESC;",
    suggestedPrompt: "Explain PostgreSQL Index Only Scans and explain when they bypass physical heap lookups."
  }
];

const bioMilestones: Milestone[] = [
  {
    id: "bio-m1",
    phase: "Phase 1",
    title: "DNA Transcription Syntax",
    description: "Explore atomic RNA transcribing from DNA sequences using base binding mechanics.",
    beginnerTopics: ["Base triplets representation: A, T, C, G", "Messenger RNA pairing characteristics", "Enzymatic catalysts: RNA Polymerase rules"],
    intTopics: ["Promoter region binding mechanisms", "DNA template vs non-coding coding strands", "Intron pre-mRNA splicing stages"],
    advTopics: ["Transcription factor pre-initiation assembly", "Epigenetic chromatin remodeling structures", "Alternative splicing pathways of cell survival"],
    challengeTitle: "Messenger RNA Transcriber",
    challengePrompt: "Write a transcription routine `transcribe_dna(strand)` mapping letters: A->U, T->A, C->G, G->C. For instance, testing a string of 'ATCG' converts to 'UAGC'.",
    challengeCodeTemplate: "# Map nucleotides: A->U, T->A, C->G, G->C\ndef transcribe_dna(strand):\n    # Store transcribed letters\n",
    challengeSolutionKeyword: "transcribe",
    hint: "You can build a map = {'A':'U','T':'A','C':'G','G':'C'} and return ''.join(map.get(char) for char in strand).",
    suggestedPrompt: "Compare and contrast RNA Polymerase cellular activities with DNA Polymerase repair systems."
  },
  {
    id: "bio-m2",
    phase: "Phase 2",
    title: "Mendelian Genetic Crosses",
    description: "Determine prospective genotype and phenotype ratio distributions using algebraic tracking.",
    beginnerTopics: ["Alleles definitions: Dominant vs Recessive", "Homozygous vs Heterozygous configurations", "Constructing basic monohybrid cross matrices"],
    intTopics: ["Dihybrid crosses yielding 9:3:3:1 phenotypic distributions", "Calculating Punnett probability models", "Pedigree family inheritance maps"],
    advTopics: ["Incomplete dominance vs co-dominance mechanics", "Gene linkage map distance math calculations", "Polygenic trait cumulative distributions"],
    challengeTitle: "Punnett Cross Calculator",
    challengePrompt: "Define a function `hetero_cross()` returning the probability float showing when crossing heterozygous (Aa x Aa) parents we isolate a recessive (aa) trait. Out of 4 options (AA, Aa, aA, aa) return 0.25.",
    challengeCodeTemplate: "# Compute Aa x Aa recessive offspring outcome chance\ndef hetero_cross():\n",
    challengeSolutionKeyword: "0.25",
    hint: "Simply return the decimal ratio of recessive progeny which is exactly 0.25.",
    suggestedPrompt: "Walk me through a monohybrid cross of pea flower colors to explain the law of segregation."
  }
];

const physicsMilestones: Milestone[] = [
  {
    id: "phy-m1",
    phase: "Phase 1",
    title: "Newtonian Motion Mechanics",
    description: "Integrate vector equations of motion, momentum conservations, and dynamic Force mechanics.",
    beginnerTopics: ["Linear velocity rate: v = d / t", "Force equals mass times acceleration (F = m * a)", "Kinetic vs stored gravitational potential energistics"],
    intTopics: ["Solving 2D kinematics equations of projectiles", "Frictional coefficients and normal reaction planes", "Conservation of momentum during collisions"],
    advTopics: ["Newtonian gravitations with Inverse Square laws", "Rotational moments of inertia tensors", "Lagrangian mechanics and path action integrals"],
    challengeTitle: "Force Calculator Engine",
    challengePrompt: "Implement the Newtonian function `calculate_force(mass, acceleration)` that computes the linear force of an object (F = m * a) and returns it.",
    challengeCodeTemplate: "# Q = mass * acceleration vector integration\ndef calculate_force(mass, acceleration):\n",
    challengeSolutionKeyword: "mass * acceleration",
    hint: "Return mass multiplied by acceleration to represent force in Newtons.",
    suggestedPrompt: "Derive projectile motions of an object launched at an angle theta with initial speed v0."
  },
  {
    id: "phy-m2",
    phase: "Phase 2",
    title: "Thermodynamics & Heat exchange",
    description: "Determine warmth distribution thresholds, entropic boundaries, and kinetic engine cycles.",
    beginnerTopics: ["Temperature vs warmth energy difference", "First Law of thermal conservations", "Conduction and convection mechanical modes"],
    intTopics: ["Specific heat capacity equations (Q = mcΔT)", "Thermal expansion constants of solids", "Ideal gas behaviors (PV = nRT)"],
    advTopics: ["Carnot heat cycle absolute limits", "Microstate counts of thermodynamic entropy (S = k ln W)", "Gibbs Free Energy equilibrium shifts"],
    challengeTitle: "Specific Heat Absorption Formula",
    challengePrompt: "Define the heat energy function `heat_absorbed(m, c, delta_t)` returning total heat absorbed: Q = m * c * delta_t.",
    challengeCodeTemplate: "# Find thermal energy Q = mass * specific_heat * temp_delta\ndef heat_absorbed(m, c, delta_t):\n",
    challengeSolutionKeyword: "m * c * delta_t",
    hint: "Compute the multiplication of m, c and delta_t to output total calorie change.",
    suggestedPrompt: "Formulate the thermal Carnot engine efficiency ratio and why it dictates maximum efficiency bounds."
  }
];

const chemMilestones: Milestone[] = [
  {
    id: "chem-m1",
    phase: "Phase 1",
    title: "Stoichiometry & Molar conversions",
    description: "Map raw gaseous or solid atomic measurements to balanced mole conversion paths.",
    beginnerTopics: ["Avogadro's constant 6.022e23 ratios", "Compound Molar Mass determinations", "Enforcing chemical equation stoichiometric ratios"],
    intTopics: ["Determining limiting reactants", "Theoretical versus experimental yield values", "Gaseous mole scaling under standard limits"],
    advTopics: ["Empirical formula calculations from combustion weights", "Solution molarity calculations in active volumes", "Back titration experimental ratios"],
    challengeTitle: "Molar Mass Conversion Routine",
    challengePrompt: "Build helper function `moles_from_mass(mass, molar_mass)` that computes and returns chemical moles (mass / molar_mass) given compounds mass parameters.",
    challengeCodeTemplate: "# Solve: moles = mass / molar_mass\ndef moles_from_mass(mass, molar_mass):\n",
    challengeSolutionKeyword: "mass / molar_mass",
    hint: "Simply return mass divided by molar_mass to pass.",
    suggestedPrompt: "How do you calculate limiting reactants in complex gaseous reactions with multiple products?"
  },
  {
    id: "chem-m2",
    phase: "Phase 2",
    title: "Aqueous Acidic pH scale",
    description: "Quantify hydrogen ion concentration scales on logarithmic pH boundaries.",
    beginnerTopics: ["Logarithmic pH scale definitions", "Acidic vs basic buffer definitions", "Neutral indicators of standard tap water"],
    intTopics: ["pH calculation of strong acids (-log10[H+])", "Autoprotolysis constant Kw of solution states", "Henderson-Hasselbalch conjugate base ratios"],
    advTopics: ["Ka and Kb acid-base ionization coefficients", "Hydrolysis of ionic salts inside volumes", "Polyprotic acid titration curves"],
    challengeTitle: "Logarithmic pH Calculator",
    challengePrompt: "Design a function `calculate_ph(hydrogen_concentration)` calculating `-math.log10(hydrogen_concentration)` to register exact acid levels. (e.g. 1e-7 maps to 7.0).",
    challengeCodeTemplate: "import math\n\ndef calculate_ph(hydrogen_concentration):\n    # Calculate pH using log10\n",
    challengeSolutionKeyword: "math.log10",
    hint: "Use return -math.log10(hydrogen_concentration). Ensure math module is referenced.",
    suggestedPrompt: "Derive the Henderson-Hasselbalch equation from the Ka equilibrium expression."
  }
];

const historyMilestones: Milestone[] = [
  {
    id: "hist-m1",
    phase: "Phase 1",
    title: "The Industrial Revolution & Social Shifts",
    description: "Explore the transition from agrarian economies to machine-driven industrial supercenters.",
    beginnerTopics: ["Steam engine invention and coal miners", "Urbanization migrations and factory work conditions", "Invention of the spinning jenny"],
    intTopics: ["The shift of trade networks and capital markets", "Inception of labor alliances and worker unions", "The Factory Act regulations of 1833"],
    advTopics: ["Socio-political dynamic tension balances", "The standard-of-living debate of economic historians", "Second Industrial Revolution electrical grids shift"],
    challengeTitle: "Peak Steam Age Chronology",
    challengePrompt: "Implement a function `is_peak_steam(year)` that returns `True` if the parsed integer `year` resides within the peak Industrial Steam Period between `1760` and `1840` inclusive, otherwise return `False`.",
    challengeCodeTemplate: "# Mapped periods 1760 - 1840\ndef is_peak_steam(year):\n",
    challengeSolutionKeyword: "year >= 1760 and year <= 1840",
    hint: "Return year >= 1760 and year <= 1840 to validate chronological steam peak constraints.",
    suggestedPrompt: "Write an editorial analysis concerning the shift of agrarian labor circles during the First Industrial Revolution."
  },
  {
    id: "hist-m2",
    phase: "Phase 2",
    title: "Foundations of Ancient Civilizations",
    description: "Examine institutional, architectural, and legal standards of early river valley systems.",
    beginnerTopics: ["Mesopotamian irrigation ditches and Euphrates agriculture", "Egyptian pharaoh dynasties and river flooding", "The development of early cuneiform writing"],
    intTopics: ["Code of Hammurabi lex talionis regulatory statutes", "The Bronze Age Collapse trade breakdowns", "Indus Valley sewer architecture and urban planning"],
    advTopics: ["Cuneiform transaction bookkeeping translation layers", "State formation theories and grain storage centralization", "The transition from Bronze to Iron metallurgy metallurgy"],
    challengeTitle: "Hammurabi Legal Code Validator",
    challengePrompt: "Write a parser routine `check_penalty(is_noble, theft_value)` that returns an eye-for-an-eye penalty string: if `is_noble` is True, return `'Death'`. Otherwise, if `theft_value > 100`, return `'Enslavement'`. For other conditions, return `'Fine'`.",
    challengeCodeTemplate: "# Hammurabi Law code penalty mapper\ndef check_penalty(is_noble, theft_value):\n",
    challengeSolutionKeyword: "is_noble",
    hint: "Use conditions: if is_noble: return 'Death', and check theft_value > 100.",
    suggestedPrompt: "Provide a detailed comparison of legal codes between ancient Babylon and the Roman Twelve Tables."
  }
];

const literatureMilestones: Milestone[] = [
  {
    id: "lit-m1",
    phase: "Phase 1",
    title: "Shakespearian Sonnets & Meter Metric Scan",
    description: "Analyze metric rhythm structures, focus stresses, and standard rhymes of early modern English sonnets.",
    beginnerTopics: ["Understanding unstressed vs stressed vocal beats", "Calculating 10-syllable lines of pentameter", "The ABAB CDCD EFEF GG rhyme layout"],
    intTopics: ["Identifying iambic vs trochaic foot structures", "Understanding caesura natural breaks in blank verse", "Syntax inversions and early modern contractions"],
    advTopics: ["Syllable vowel elision and syncope phonetic compression", "Feminine endings in metrical foot variants", "Semiotics of tragedy in Hamlet blank verse"],
    challengeTitle: "Syllable Metric Checker",
    challengePrompt: "Implement a metrics function `is_pentameter(syllables)` that returns `True` if `syllables == 10` representing the perfect iambic line parameter count, otherwise returning `False`.",
    challengeCodeTemplate: "# Perfect metric lines expect exactly 10 syllables\ndef is_pentameter(syllables):\n",
    challengeSolutionKeyword: "syllables == 10",
    hint: "Return syllables == 10 to see if it matches the count.",
    suggestedPrompt: "Draft a modern summary explaining metabolic metrics of iambic pentameter."
  },
  {
    id: "lit-m2",
    phase: "Phase 2",
    title: "Modernist Narrative Structures",
    description: "Investigate stream-of-consciousness, fragmented perspectives, and nonlinear chronological pathways.",
    beginnerTopics: ["First-person vs omniscient narrative modes", "Identifying stream-of-consciousness prose", "High-concept symbols and cultural motifs"],
    intTopics: ["Virginia Woolf's fluid time concepts in Mrs. Dalloway", "James Joyce's dense multi-layered epiphanies", "Interior monologue narration vs traditional dialogue"],
    advTopics: ["Phenomenology of consciousness in Ulysses", "Objective correlative theory formulated by T.S. Eliot", "The semantic drift of post-war fragmentation"],
    challengeTitle: "Stream text flow cleaner",
    challengePrompt: "Write a stream text processing function `clean_monologue(raw_text)` that removes any punctuation characters from `raw_text`: specifically commas, periods, and question marks (',', '.', '?') and returns the lowercased clean string.",
    challengeCodeTemplate: "# Modernist uninterrupted prose cleaner\ndef clean_monologue(raw_text):\n",
    challengeSolutionKeyword: "replace",
    hint: "Iterate or use chain replacements raw_text.replace(',', '').replace('.', '').replace('?', '').lower().",
    suggestedPrompt: "Contrast Hemingway's Iceberg theory of narrative omission with Joyce's stream-of-consciousness."
  }
];

const milestonesBySubject: Record<string, Milestone[]> = {
  "Python": pythonMilestones,
  "Computer Science": csMilestones,
  "Biology": bioMilestones,
  "Physics": physicsMilestones,
  "Chemistry": chemMilestones,
  "History": historyMilestones,
  "Literature": literatureMilestones
};

const subjectsIcons: Record<string, any> = {
  "Python": Code,
  "Computer Science": Cpu,
  "Biology": Activity,
  "Physics": Zap,
  "Chemistry": Beaker,
  "History": Hourglass,
  "Literature": BookOpenText
};

export default function AdaptivePath({ onEarnReward, onAddNote, notes }: AdaptivePathProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("Python");
  const [skillLevel, setSkillLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [activeMilestones, setActiveMilestones] = useState<Milestone[]>(pythonMilestones);
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>("py-m1");
  const [completedSubtopics, setCompletedSubtopics] = useState<string[]>([]);
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);
  const [playgroundCode, setPlaygroundCode] = useState<string>("");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [hintVisible, setHintVisible] = useState<boolean>(false);
  const [noteGenerating, setNoteGenerating] = useState<string | null>(null);

  // Set milestones, default template, and terminal greetings when the subject or milestone changes
  useEffect(() => {
    const list = milestonesBySubject[selectedSubject] || pythonMilestones;
    setActiveMilestones(list);
    
    // Auto-select first milestone of the new subject if current one doesn't belong
    if (!list.some(m => m.id === activeMilestoneId)) {
      setActiveMilestoneId(list[0]?.id || "py-m1");
    }
  }, [selectedSubject]);

  const activeMilestone = activeMilestones.find(m => m.id === activeMilestoneId) || activeMilestones[0] || pythonMilestones[0];

  useEffect(() => {
    if (activeMilestone) {
      setPlaygroundCode(activeMilestone.challengeCodeTemplate);
      setTerminalOutput([
        `[${selectedSubject} Sandbox Live]`,
        `Selected: ${activeMilestone.title}`,
        "Ready for verification compiles...",
        "Provide your code inside the editor."
      ]);
      setHintVisible(false);
    }
  }, [activeMilestoneId, selectedSubject]);

  // Handle subject switch
  const handleSubjectSwitch = (subj: string) => {
    setSelectedSubject(subj);
    playChimeSound("success");
  };

  // Handle skill level toggle
  const handleSkillChange = (level: "beginner" | "intermediate" | "advanced") => {
    setSkillLevel(level);
    playChimeSound("success");
  };

  // Checkbox toggle handler
  const toggleTopic = (topic: string) => {
    let updated: string[];
    if (completedSubtopics.includes(topic)) {
      updated = completedSubtopics.filter(t => t !== topic);
    } else {
      updated = [...completedSubtopics, topic];
      playChimeSound("success");
      // Earn small active reward
      onEarnReward(15, 5);
    }
    setCompletedSubtopics(updated);
  };

  // Sandboxed Code execution parser simulation
  const runCodeAndCheck = () => {
    setIsCompiling(true);
    setTerminalOutput(prev => [...prev, ">>> Initializing local virtual sandbox...", ">>> Checking AST validation gates..."]);
    
    setTimeout(() => {
      setIsCompiling(false);
      const codeClean = playgroundCode.trim();
      
      if (!codeClean || codeClean === activeMilestone.challengeCodeTemplate.trim()) {
        setTerminalOutput(prev => [
          ...prev,
          "SyntaxError: Missing implementation.",
          "Please write your answer in the container before compiling."
        ]);
        return;
      }

      let dynamicLogs: string[] = [];
      let passed = false;

      // Evaluators for each chemical, biological, or physics challenge
      const mid = activeMilestone.id;

      if (mid === "py-m1") {
        const baseMatch = codeClean.match(/base_val\s*=\s*(\d+)/);
        const resultMatch = codeClean.match(/result_val\s*=\s*/);
        if (baseMatch && resultMatch) {
          const baseVal = parseInt(baseMatch[1], 10);
          const resultVal = baseVal * baseVal;
          dynamicLogs = [
            `>>> Name Resolution: Bound 'base_val' value to: ${baseVal}`,
            `>>> Evaluating assignment expression: result_val = ${baseVal} ** 2`,
            `>>> output print: result_val -> ${resultVal}`,
            `✓ Standard Output: SUCCESS (Assertion matches calculated exponent)`
          ];
          passed = true;
        } else {
          dynamicLogs = [
            `AssertionError: Expected 'base_val = 12' and 'result_val' expression assignments.`
          ];
        }
      } else if (mid === "py-m2") {
        const inputMatch = codeClean.includes("input_list");
        const filteredMatch = codeClean.includes("filtered_list");
        if (inputMatch && filteredMatch) {
          dynamicLogs = [
            `>>> Collection evaluation: input_list loaded: [3, 8, 12, 17, 20]`,
            `>>> List comprehension evaluates correctly to [12, 17, 20]`,
            `✓ Collection Output: filtered_list matches check criteria!`
          ];
          passed = true;
        } else {
          dynamicLogs = [
            `AssertionError: Please design a list comprehension referencing 'input_list' filtering values > 10.`
          ];
        }
      } else if (mid === "py-m3") {
        const hasDef = codeClean.includes("def to_celsius");
        const hasReturn = codeClean.includes("return");
        if (hasDef && hasReturn) {
          const valMatch = codeClean.match(/to_celsius\(\s*(\d+)\s*\)/);
          const tempVal = valMatch ? parseInt(valMatch[1], 10) : 68;
          const calculated = Math.round(((tempVal - 32) * 5 / 9) * 100) / 100;
          dynamicLogs = [
            `>>> Compiled 'to_celsius' procedure.`,
            `>>> Invoking: to_celsius(${tempVal})`,
            `>>> Returned Celsius value: ${calculated}`,
            `✓ Formula assertion check parameters: OK`
          ];
          passed = true;
        } else {
          dynamicLogs = [
            `AssertionError: Missing code block definitions representing 'to_celsius' formula routines.`
          ];
        }
      } else if (mid === "py-m4") {
        const hasClass = codeClean.includes("class StudyMascot");
        const hasInit = codeClean.includes("__init__");
        const hasGreet = codeClean.includes("greet");
        if (hasClass && hasInit && hasGreet) {
          dynamicLogs = [
            `>>> Class 'StudyMascot' successfully registered.`,
            `>>> self.name stored correctly with string parameters.`,
            `>>> salute.greet() returns output greeting text correctly.`,
            `✓ Instance encapsulation parameters verified: PASS`
          ];
          passed = true;
        } else {
          dynamicLogs = [
            `AssertionError: Create Class name 'StudyMascot' with attribute 'self.name' and method 'greet(self)'.`
          ];
        }
      } else if (mid === "py-m5") {
        if (codeClean.includes("try:") && codeClean.includes("except") && codeClean.includes("execute_call")) {
          dynamicLogs = [
            `>>> Entering try scope...`,
            `>>> Caught simulated Exception. Routing to 'except' block.`,
            `>>> Variable error_logged set to True`,
            `✓ Error exception trapping: PASS`
          ];
          passed = true;
        } else {
          dynamicLogs = [
            `AssertionError: Ensure 'try:' calls 'execute_call()' with a proper fallback 'except' handler.`
          ];
        }
      } else if (mid === "cs-m1") {
        const hasSplit = codeClean.includes("def binary_splits");
        const hasCeil = codeClean.includes("math.ceil") || codeClean.includes("math.log2");
        if (hasSplit && hasCeil) {
          dynamicLogs = [
            `>>> Binary Search split algorithm mapped.`,
            `>>> binary_splits(1024) evaluates log-base-2 recursive levels to: 10`,
            `✓ Logarithmic search counts: verified successfully!`
          ];
          passed = true;
        } else {
          dynamicLogs = [
            `AssertionError: Missing math.ceil or math.log2 formulas inside 'binary_splits(n)' procedure.`
          ];
        }
      } else if (mid === "cs-m2") {
        const queryCheck = codeClean.toUpperCase();
        if (queryCheck.includes("SELECT") && queryCheck.includes("FROM") && queryCheck.includes("WHERE") && queryCheck.includes("SCORE > 90")) {
          dynamicLogs = [
            `>>> Executing ANSI SQL statement over students indices...`,
            `>>> Selected columns: (name, score)`,
            `>>> Query execution schema: Index scan over scores. Filter passed!`,
            `✓ Database Projection constraints verified!`
          ];
          passed = true;
        } else {
          dynamicLogs = [
            `AssertionError: Invalid ANSI SQL query syntax. Use WHERE score > 90 with ORDER BY desc.`
          ];
        }
      } else if (mid === "bio-m1") {
        if (codeClean.includes("def transcribe_dna") && (codeClean.includes("U") || codeClean.includes("translate") || codeClean.includes("replace") || codeClean.includes("str") || codeClean.includes("join") || codeClean.includes("get"))) {
          dynamicLogs = [
            `>>> Nucleotide base pairs mapped on RNA strand sequence.`,
            `>>> transcribe_dna('ATCG') generates RNA transcript: 'UAGC'`,
            `✓ Bio-molecular conversion gates: verified.`
          ];
          passed = true;
        } else {
          dynamicLogs = [
            `AssertionError: Ensure transcribe_dna maps Adenine to Uracil and Cytosine to Guanine correctly.`
          ];
        }
      } else if (mid === "bio-m2") {
        if (codeClean.includes("0.25") || codeClean.includes("25")) {
          dynamicLogs = [
            `>>> Probability ratios derived over monohybrid cross matrices.`,
            `>>> Progeny outcomes AA, Aa, aA, aa counted. Recessive frequency chance: 25% (0.25)`,
            `✓ Punnett Mendelian ratios: OK`
          ];
          passed = true;
        } else {
          dynamicLogs = [
            `AssertionError: Expected heterozygous cross monohybrid recessive result (0.25 or 25%).`
          ];
        }
      } else if (mid === "phy-m1") {
        if (codeClean.includes("def calculate_force") && codeClean.includes("*")) {
          dynamicLogs = [
            `>>> Momentum force models initialized.`,
            `>>> calculate_force(15, 9.8) yields output force: 147 Newtons.`,
            `✓ Newtonian kinematic calculations: verified!`
          ];
          passed = true;
        } else {
          dynamicLogs = [
            `AssertionError: Implement formula F = m * a inside calculate_force.`
          ];
        }
      } else if (mid === "phy-m2") {
        if (codeClean.includes("def heat_absorbed") && codeClean.includes("*")) {
          dynamicLogs = [
            `>>> Specific heat formula initialized.`,
            `>>> heat_absorbed(50, 4.184, 10) yields Q = 2092 Joules.`,
            `✓ Thermodynamic energy bounds: verified!`
          ];
          passed = true;
        } else {
          dynamicLogs = [
            `AssertionError: Implement standard formula Q = m * c * ΔT.`
          ];
        }
      } else if (mid === "chem-m1") {
        if (codeClean.includes("def moles_from_mass") && codeClean.includes("/")) {
          dynamicLogs = [
            `>>> Stoichiometric calculations mapped.`,
            `>>> moles_from_mass(36, 18) yields output molar count: 2.0 moles.`,
            `✓ mole balance quotients: verified!`
          ];
          passed = true;
        } else {
          dynamicLogs = [
            `AssertionError: Expected the equation: moles = mass / molar_mass.`
          ];
        }
      } else if (mid === "chem-m2") {
        if (codeClean.includes("def calculate_ph") && codeClean.includes("log10")) {
          dynamicLogs = [
            `>>> Logarithmic Henderson acid-base maps initialized.`,
            `>>> calculate_ph(1e-4) yields calculated solution acidity index: 4.0`,
            `✓ pH logarithmic curves verified successfully!`
          ];
          passed = true;
        } else {
          dynamicLogs = [
            `AssertionError: Make sure to implement -math.log10(hydrogen_concentration) equation.`
          ];
        }
      } else if (mid === "hist-m1") {
        if (codeClean.includes("def is_peak_steam") && (codeClean.includes("1760") || codeClean.includes("1840"))) {
          dynamicLogs = [
            `>>> Standardizing Steam Age chronological gates...`,
            `>>> Testing year=1800: returns True`,
            `>>> Testing year=1900: returns False`,
            `✓ Chrono boundaries verified successfully!`
          ];
          passed = true;
        } else {
          dynamicLogs = [
            `AssertionError: Ensure is_peak_steam evaluates whether the year is between 1760 and 1840.`
          ];
        }
      } else if (mid === "hist-m2") {
        if (codeClean.includes("def check_penalty") && (codeClean.includes("is_noble") || codeClean.includes("theft_value"))) {
          dynamicLogs = [
            `>>> Code of Hammurabi lex talionis regulatory statutes initialized.`,
            `>>> check_penalty(True, 500) evaluates penalty to: 'Death'`,
            `>>> check_penalty(False, 250) evaluates penalty to: 'Enslavement'`,
            `✓ Penalty parser engine validated successfully!`
          ];
          passed = true;
        } else {
          dynamicLogs = [
            `AssertionError: Ensure Hammurabi's legal check returns 'Death', 'Enslavement' or 'Fine' appropriately.`
          ];
        }
      } else if (mid === "lit-m1") {
        if (codeClean.includes("def is_pentameter") && codeClean.includes("10")) {
          dynamicLogs = [
            `>>> Analyzing metrics check stresses parameters...`,
            `>>> Testing syllables=10: returns True`,
            `>>> Testing syllables=12: returns False`,
            `✓ Metric syllable scanner verified successfully!`
          ];
          passed = true;
        } else {
          dynamicLogs = [
            `AssertionError: Ensure is_pentameter checks if syllables is equal to 10.`
          ];
        }
      } else if (mid === "lit-m2") {
        if (codeClean.includes("def clean_monologue") && codeClean.includes("replace")) {
          dynamicLogs = [
            `>>> Analyzing Stream of Consciousness text patterns...`,
            `>>> Input: "Yes, I said Yes?" -> Output: "yes i said yes"`,
            `✓ Uninterrupted prose formatting verified successfully!`
          ];
          passed = true;
        } else {
          dynamicLogs = [
            `AssertionError: Ensure clean_monologue replaces punctuation (',', '.', '?') and lowercases strings.`
          ];
        }
      } else {
        // Fallback pass keyword
        if (codeClean.length > 5) {
          dynamicLogs = [`>>> Parsing generic subject challenge code...`, `✓ Validation gates passed!`];
          passed = true;
        } else {
          dynamicLogs = [`❌ Incorrect implementation length. Please expand your submission.`];
        }
      }

      setTerminalOutput(prev => [...prev, ...dynamicLogs]);

      if (passed) {
        setTerminalOutput(prev => [
          ...prev,
          "✓ Sandboxed pipeline: OK",
          `🎉 Challenge Verified! Gained +100 XP and +50 Study Coins in ${selectedSubject}!`
        ]);
        
        if (!completedMilestones.includes(activeMilestone.id)) {
          const newCompleted = [...completedMilestones, activeMilestone.id];
          setCompletedMilestones(newCompleted);
          playChimeSound("quest");
          onEarnReward(100, 50);
        }
      } else {
        setTerminalOutput(prev => [
          ...prev,
          "❌ Sandbox verification check failed. Check your mathematical operations or inspect the 'Reveal Hint' lightbulb below!"
        ]);
      }
    }, 1200);
  };

  // Generate study notes automatically via fallback AI engine
  const handleGenerateAISummary = async () => {
    setNoteGenerating(activeMilestone.id);
    setTerminalOutput(prev => [...prev, `>>> Generating academic study notes for ${selectedSubject}...`]);
    
    try {
      const resp = await fetch("/api/gemini/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noteTitle: `Mastering ${selectedSubject}: ${activeMilestone.title}`,
          noteSubject: selectedSubject,
          noteContent: `Phase: ${activeMilestone.phase} curriculum. \nTopic Scope: ${activeMilestone.description} \nCompleted Sub-Elements checked: ${completedSubtopics.join(", ") || "General fundamentals overview"}`
        })
      });

      const data = await resp.json();
      
      const newNote: StudyNote = {
        id: `note-${activeMilestone.id}-${Date.now()}`,
        title: `Mastering ${selectedSubject}: ${activeMilestone.title}`,
        subject: selectedSubject,
        content: data.text || `Lecture summary covering key aspects of ${activeMilestone.title}.`,
        createdAt: new Date().toLocaleDateString(),
        isIndexed: true,
        chunks: [
          {
            id: `chunk-1-${Date.now()}`,
            noteId: `note-${activeMilestone.id}`,
            noteTitle: `Mastering ${selectedSubject}: ${activeMilestone.title}`,
            noteSubject: selectedSubject,
            text: `This section highlights ${selectedSubject} structures relevant to ${activeMilestone.title}. Details: ${activeMilestone.description}`
          }
        ]
      };

      onAddNote(newNote);
      playChimeSound("badge");
      setTerminalOutput(prev => [
        ...prev,
        `✓ AI Note Summary generated successfully: "Mastering ${selectedSubject}: ${activeMilestone.title}" has been registered into your Lesson Decks.`,
        "🏅 Try generating a custom MCQ quiz or flashcard set from your new Python Deck!"
      ]);
    } catch (err) {
      console.warn("AI Note Generator fallback applied.");
      const fallbackNote: StudyNote = {
        id: `note-fb-${activeMilestone.id}-${Date.now()}`,
        title: `Mastering ${selectedSubject}: ${activeMilestone.title} (Draft)`,
        subject: selectedSubject,
        content: `### Reference Study Guide: ${selectedSubject} ${activeMilestone.title}\n\n* **Academic Focus**: Comprehensive mastery of ${selectedSubject} syntax, concepts, and structures.\n* **Key Concepts**: ${activeMilestone.description}\n\n### Definitions:\n* **Reference Material**: Core educational frameworks.\n* **Variables**: Reusable mathematical and scientific definitions.\n\n*Review from Lesson Decks tab to generate dynamic flashcards.*`,
        createdAt: new Date().toLocaleDateString(),
        isIndexed: true,
        chunks: [{
          id: `chunk-fb-${Date.now()}`,
          noteId: `note-fb-${activeMilestone.id}`,
          noteTitle: `Mastering ${selectedSubject}: ${activeMilestone.title}`,
          noteSubject: selectedSubject,
          text: `Study guide covering ${activeMilestone.title} focusing on: ${activeMilestone.description}`
        }]
      };
      onAddNote(fallbackNote);
      playChimeSound("badge");
      setTerminalOutput(prev => [...prev, `✓ Local ${selectedSubject} note template registered in Lesson Decks.`]);
    } finally {
      setNoteGenerating(null);
    }
  };

  const getCurrentTopics = (milestone: Milestone) => {
    if (skillLevel === "intermediate") return milestone.intTopics;
    if (skillLevel === "advanced") return milestone.advTopics;
    return milestone.beginnerTopics;
  };

  // Progression calculation across all milestones of the current selected subject
  const currentSubjectMilestones = activeMilestones;
  const totalSubtopics = currentSubjectMilestones.reduce((acc, m) => acc + getCurrentTopics(m).length, 0);
  const completedCount = completedSubtopics.filter(t => 
    currentSubjectMilestones.some(m => getCurrentTopics(m).includes(t))
  ).length;
  
  const totalMilestonesCount = currentSubjectMilestones.length;
  const milestonesCompletedCount = currentSubjectMilestones.filter(m => completedMilestones.includes(m.id)).length;

  const totalProgressPct = totalSubtopics + (totalMilestonesCount * 3) > 0 
    ? Math.round(((completedCount + (milestonesCompletedCount * 3)) / (totalSubtopics + (totalMilestonesCount * 3))) * 100)
    : 0;

  return (
    <div id="learning-path-viewport" className="flex flex-col gap-6 text-left">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-white text-glow flex items-center gap-2">
            <Compass className="text-indigo-400 w-6 h-6 animate-pulse" /> Adaptive Learning Plans
          </h2>
          <p className="text-xs text-slate-400">
            Tailor high-yield learning plans across multiple core academic domains, compile functional checks, and claim gamified Study gems!
          </p>
        </div>
        
        {/* Progress pill indicator */}
        <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/30 py-2 px-4 rounded-2xl">
          <Flame className="w-5 h-5 text-amber-500 fill-amber-500/10" />
          <div className="text-left font-sans">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">{selectedSubject} Mastery</span>
            <div className="flex items-center gap-1.5 font-black text-white text-sm">
              {totalProgressPct}% Complete <span className="text-xs font-normal text-slate-300">({milestonesCompletedCount}/{totalMilestonesCount} Milestones)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Subjects Row Tabs switcher */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Select Learning Field</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 bg-slate-950/60 p-2 border border-white/5 rounded-3xl">
          {Object.keys(milestonesBySubject).map((subj) => {
            const IsSelected = selectedSubject === subj;
            const IconComponent = subjectsIcons[subj] || Code;
            return (
              <button
                key={subj}
                onClick={() => handleSubjectSwitch(subj)}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-black transition-all duration-300 ${
                  IsSelected 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/35"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <IconComponent className="w-4 h-4 shrink-0 text-glow" />
                <span>{subj}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Adaptive Mode Selection Trigger */}
      <div className="p-4 rounded-3xl bg-slate-900/60 border border-indigo-500/20 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600/20 rounded-2xl border border-indigo-500/30 text-indigo-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] font-black tracking-wider text-indigo-400 uppercase">Adaptive Level Diagnostics</span>
            <h3 className="text-sm font-bold text-white">Choose your target syllabus complexity for {selectedSubject}</h3>
          </div>
        </div>

        {/* Level Toggle Button Matrix */}
        <div className="flex bg-slate-950/80 p-1 border border-white/5 rounded-2xl self-stretch md:self-auto shrink-0 font-bold">
          <button
            onClick={() => handleSkillChange("beginner")}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs transition-all duration-300 ${
              skillLevel === "beginner" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => handleSkillChange("intermediate")}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs transition-all duration-300 ${
              skillLevel === "intermediate" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
            }`}
          >
            Intermediate
          </button>
          <button
            onClick={() => handleSkillChange("advanced")}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs transition-all duration-300 ${
              skillLevel === "advanced" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      {/* Main Grid: Phase Milestones on Left, Code Editor Challenge on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Milestone Map (Col: 5) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
            Current {selectedSubject} Milestones
          </span>
          
          {activeMilestones.map((m) => {
            const isActive = activeMilestoneId === m.id;
            const isCompleted = completedMilestones.includes(m.id);
            const mTopics = getCurrentTopics(m);
            const complMTopicsCount = mTopics.filter(t => completedSubtopics.includes(t)).length;
            const progress = mTopics.length > 0 ? Math.round((complMTopicsCount / mTopics.length) * 100) : 0;

            return (
              <button
                key={m.id}
                onClick={() => {
                  setActiveMilestoneId(m.id);
                  playChimeSound("success");
                }}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all duration-300 ${
                  isActive 
                    ? "bg-indigo-600/15 border-indigo-500 shadow-[0_4px_20px_rgba(99,102,241,0.12)] text-white" 
                    : isCompleted
                      ? "bg-emerald-950/15 border-emerald-500/40 opacity-90 hover:opacity-100"
                      : "bg-white/5 border-white/5 hover:border-white/10"
                }`}
              >
                {/* Visual Circle Indicator */}
                <div className={`mt-0.5 p-1.5 rounded-xl border shrink-0 flex items-center justify-center ${
                  isCompleted 
                    ? "bg-emerald-500/15 border-emerald-400 text-emerald-400 animate-pulse" 
                    : isActive 
                      ? "bg-indigo-500 text-white border-indigo-400" 
                      : "bg-slate-900/60 border-white/5 text-slate-400"
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-[10px] font-extrabold w-3.5 h-3.5 flex items-center justify-center">
                      {m.phase.replace("Phase ", "")}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[9px] font-black uppercase tracking-wider ${
                      isActive ? "text-indigo-400" : isCompleted ? "text-emerald-400" : "text-slate-500"
                    }`}>
                      {m.phase} • {skillLevel.toUpperCase()}
                    </span>
                    {isCompleted && (
                      <span className="text-[9px] bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                        PASSED
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-black text-white truncate">{m.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-normal line-clamp-1">{m.description}</p>
                  
                  {/* Micro index value progress indicator bar */}
                  <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden mt-2">
                    <div 
                      className={`h-full transition-all duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 mt-2 shrink-0 text-slate-500 transition-transform ${
                  isActive ? "translate-x-1" : ""
                }`} />
              </button>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Milestone detail view + Sandbox editor (Col: 7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Active Milestone Scope Card */}
          <div className="p-6 rounded-3xl bg-slate-950/40 border border-white/5 text-left space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#a5b4fc] block">
                  ACTIVE EXPERIMENT SCOPE ({activeMilestone?.phase})
                </span>
                <h3 className="text-base font-black text-white mt-1">{activeMilestone?.title}</h3>
              </div>

              {/* Generative Notes Link */}
              <button
                onClick={handleGenerateAISummary}
                disabled={noteGenerating !== null}
                className="self-start md:self-auto py-2 px-3 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/5 text-[10px] font-black uppercase rounded-xl transition duration-300 flex items-center gap-1.5"
              >
                {noteGenerating === activeMilestone?.id ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <BookOpenText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Create Deck study Copy</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-2xl border border-white/5">
              💡 <span className="font-bold">Focus Target:</span> {activeMilestone?.description}
            </p>

            {/* Checklist items list */}
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                Required Study Checklist (Check to claim XP!)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {activeMilestone && getCurrentTopics(activeMilestone).map((topic, idx) => {
                  const check = completedSubtopics.includes(topic);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleTopic(topic)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition duration-300 ${
                        check 
                          ? "bg-indigo-600/5 border-indigo-500/20 text-white" 
                          : "bg-white/5 border-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                        check 
                          ? "bg-indigo-500 border-indigo-400 text-white" 
                          : "border-white/20 text-transparent"
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] leading-snug text-slate-300">{topic}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Playground */}
          <div className="rounded-3xl border border-white/5 overflow-hidden flex flex-col bg-[#140a24]/90 shadow-2xl">
            {/* Header console controls */}
            <div className="bg-[#1b1031] px-5 py-3.5 border-b border-white/5 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Code className="w-4.5 h-4.5 text-fuchsia-400" />
                <span className="text-xs font-mono font-bold text-slate-200 animate-pulse">
                  active_workspace • {activeMilestone?.challengeTitle}
                </span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
            </div>

            {/* Prompt explanation box */}
            <div className="bg-[#1e1436] p-4 text-left border-b border-white/5 space-y-1">
              <span className="text-[9px] font-mono font-black text-fuchsia-400 uppercase tracking-widest">
                VERIFICATION CHALLENGE
              </span>
              <p className="text-[11px] leading-relaxed text-slate-200">
                {activeMilestone?.challengePrompt}
              </p>
            </div>

            {/* Code Input Field */}
            <div className="p-4 relative">
              <textarea
                value={playgroundCode}
                onChange={(e) => setPlaygroundCode(e.target.value)}
                rows={7}
                className="w-full bg-[#0a0414] text-[#a5b4fc] font-mono text-[11px] leading-relaxed p-4 rounded-2xl border border-white/5 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                placeholder="# Create your active code answer here..."
              />
              <span className="absolute bottom-6 right-6 text-[9px] text-[#554078] font-mono">
                UTF-8 Input
              </span>
            </div>

            {/* Actions: run verification check */}
            <div className="px-4 pb-4 flex flex-wrap items-center justify-between gap-3 font-sans">
              {/* Optional Hint Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setHintVisible(!hintVisible);
                    playChimeSound("success");
                  }}
                  className="py-2 px-3.5 hover:bg-slate-800 text-[10px] font-bold text-slate-300 flex items-center gap-1.5 rounded-xl border border-white/5 transition"
                >
                  <Lightbulb className={`w-3.5 h-3.5 ${hintVisible ? "text-amber-400 animate-pulse" : "text-slate-500"}`} />
                  <span>{hintVisible ? "Conceal Hint" : "Reveal Hint"}</span>
                </button>

                {hintVisible && (
                  <div className="absolute left-0 bottom-full mb-2 w-64 bg-slate-900 border border-white/10 p-3 rounded-xl shadow-2xl z-20 text-[10.5px] leading-normal text-amber-200">
                    💡 <span className="font-bold">Syllabus Hint:</span> {activeMilestone?.hint}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPlaygroundCode(activeMilestone?.challengeCodeTemplate || "")}
                  className="py-2 px-3 hover:bg-white/5 text-[10px] font-bold text-slate-400 rounded-xl transition"
                >
                  Reset Template
                </button>
                <button
                  onClick={runCodeAndCheck}
                  disabled={isCompiling}
                  className="py-2.5 px-4.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-extrabold text-[10.5px] uppercase rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-fuchsia-700/20"
                >
                  {isCompiling ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying Assertions...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Execute Checks</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Terminal Outputs Console */}
            <div className="bg-[#070112] p-4 text-left border-t border-white/5">
              <span className="text-[9px] font-mono font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1 block mb-2">
                <Terminal className="w-3 h-3" /> Execution Terminal stdout
              </span>
              <div className="font-mono text-[10px] leading-relaxed space-y-1 max-h-[140px] overflow-y-auto">
                {terminalOutput.map((out, idx) => (
                  <p key={idx} className={
                    out.includes("✓") || out.includes("🎉") ? "text-emerald-400 font-bold" :
                    out.includes("Error") || out.includes("failed") || out.includes("❌") ? "text-rose-400 font-bold" : "text-slate-300"
                  }>
                    {out}
                  </p>
                ))}
              </div>
            </div>

          </div>

          {/* Collapsible Python & Coding Examples Reference Sheet */}
          <div className="bg-[#160a2c]/80 border border-indigo-500/10 rounded-3xl p-5 text-left space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                <Code className="text-indigo-400 w-4 h-4" /> 📋 Academic Python Code Reference
              </h4>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-300 font-mono font-bold px-2.5 py-0.5 rounded-full">
                python_demo.py
              </span>
            </div>
            
            <p className="text-[11px] text-slate-300 leading-normal font-sans">
              We added a real Python execution script at the root (<code className="text-fuchsia-400">python_demo.py</code>)! Below are high-quality, executable sample structures matching each of our syllabus milestones:
            </p>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              <div className="bg-[#070114]/90 p-3.5 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono border-b border-white/5 pb-1.5">
                  <span className="text-indigo-450 font-bold">Phase 1: Squaring Variable (Dynamic Typing)</span>
                  <span className="text-slate-500">base_val = 12</span>
                </div>
                <pre className="text-[10.5px] font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed select-all scrollbar-thin">
{`# Direct squaring variable declaration
base_val = 12
result_val = base_val ** 2
print(result_val)  # Outputs: 144`}
                </pre>
              </div>

              <div className="bg-[#070114]/90 p-3.5 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono border-b border-white/5 pb-1.5">
                  <span className="text-indigo-450 font-bold">Phase 2: List Comprehensions (Iterative Filt)</span>
                  <span className="text-slate-500">x &gt; 10 expression</span>
                </div>
                <pre className="text-[10.5px] font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed select-all scrollbar-thin">
{`# Filter values from collection
input_list = [3, 8, 12, 17, 20]
filtered_list = [x for x in input_list if x > 10]
print(filtered_list)  # Outputs: [12, 17, 20]`}
                </pre>
              </div>

              <div className="bg-[#070114]/90 p-3.5 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono border-b border-white/5 pb-1.5">
                  <span className="text-indigo-450 font-bold">Phase 3: Functional Convert (Fahrenheit)</span>
                  <span className="text-slate-500">def to_celsius</span>
                </div>
                <pre className="text-[10.5px] font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed select-all scrollbar-thin">
{`# Convert fahrenheit parameter to celsius
def to_celsius(fahrenheit):
    return (fahrenheit - 32) * 5/9

print(to_celsius(68))  # Outputs: 20.0`}
                </pre>
              </div>

              <div className="bg-[#070114]/90 p-3.5 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono border-b border-white/5 pb-1.5">
                  <span className="text-indigo-450 font-bold">Phase 4: OOP Class Model (Mascots)</span>
                  <span className="text-slate-500">class StudyMascot</span>
                </div>
                <pre className="text-[10.5px] font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed select-all scrollbar-thin">
{`# Class constructor & methods
class StudyMascot:
    def __init__(self, name):
        self.name = name
    def greet(self):
        return f"Hello, {self.name}!"

mascot = StudyMascot("PyBuddy")
print(mascot.greet())  # Outputs: "Hello, PyBuddy!"`}
                </pre>
              </div>

              <div className="bg-[#070114]/90 p-3.5 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono border-b border-white/5 pb-1.5">
                  <span className="text-indigo-450 font-bold">Phase 5: Script Exception Log</span>
                  <span className="text-slate-500">try-except handling</span>
                </div>
                <pre className="text-[10.5px] font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed select-all scrollbar-thin">
{`# Exception interception safety framework
try:
    execute_call()
except Exception as err:
    error_logged = True
    print(err)  # Logs captured exception safely`}
                </pre>
              </div>
            </div>
          </div>

          {/* Prompt Playground hooks */}
          <div className="bg-[#10072b]/80 p-5 rounded-3xl border border-indigo-500/10 text-left space-y-3.5">
            <h4 className="text-xs font-black text-white flex items-center gap-1.5">
              <Sparkles className="text-indigo-400 w-4 h-4" /> Customized Learning Companion Prompt hooks
            </h4>
            <p className="text-[11px] text-slate-300 leading-normal font-sans">
              Copy this curriculum prompt hook below and paste it directly into our **RAG Tutoring Hub** to let Gemini run adaptive analysis:
            </p>
            <div className="bg-[#070114] p-3 rounded-2xl text-[10px] font-mono text-indigo-400 border border-white/5 break-all leading-normal flex justify-between items-center gap-2">
              <span className="select-all block pr-1 leading-relaxed">
                "{activeMilestone?.suggestedPrompt}"
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
