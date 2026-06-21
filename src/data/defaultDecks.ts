import { FlashcardDeck } from "../types";

export const defaultDecks: FlashcardDeck[] = [
  {
    id: "deck-py-core",
    name: "Python Advanced Core Mechanics",
    subject: "Python",
    cards: [
      {
        id: "fc-py-1",
        question: "Explain the main difference between Static Typing and Python's Dynamic Typing.",
        answer: "Static typing binds types to variable names at compilation. Python's Dynamic typing binds types to the object values themselves at runtime, allowing a single name to reference completely different types sequentially.",
        status: "new"
      },
      {
        id: "fc-py-2",
        question: "What is a python generator and why does it optimize memory overhead?",
        answer: "A generator is an iterator created using the 'yield' keyword. Instead of allocating memory for a full list, it lazily produces sequence values one-by-one on demand, reducing space complexity to O(1).",
        status: "new"
      },
      {
        id: "fc-py-3",
        question: "Describe Method Resolution Order (MRO) and the C3 Linearization algorithm.",
        answer: "MRO is the search list Python uses to resolve class attributes/methods in multiple inheritance. It uses C3 Linearization to guarantee local precedence and monotonicity without circular search hops.",
        status: "new"
      },
      {
        id: "fc-py-4",
        question: "What is a decorator and how does it execute pre/post computation wrappers?",
        answer: "A decorator is a higher-order function that takes another function, extends/modifies its behavior without changing its core source code, and returns a wrapping executing closure.",
        status: "new"
      },
      {
        id: "fc-py-5",
        question: "How does are double-under (dunder) methods used to implement operator overloading?",
        answer: "Dunder methods like __add__, __str__, or __len__ hook directly into Python's native operators, letting user-defined classes mimic native collections and respond elegantly to standard operators.",
        status: "new"
      }
    ]
  },
  {
    id: "deck-cs-algo",
    name: "Data Structures & RAG Architectures",
    subject: "Computer Science",
    cards: [
      {
        id: "fc-cs-1",
        question: "What are the three core stages of a Retrieval-Augmented Generation (RAG) pipeline?",
        answer: "1. Chunking (segmenting raw knowledge content), 2. Indexing (embedding text into vectors inside a database), 3. Retrieval (searching nearest-neighbor contexts to supplement LLM prompts).",
        status: "new"
      },
      {
        id: "fc-cs-2",
        question: "How do vector embeddings map semantic meaning in high-dimensional spaces?",
        answer: "Semantic embeddings convert textual passages into dense floating-point numeric arrays representing location coordinates, such that semantically similar concepts reside physically close (measured via cosine distance).",
        status: "new"
      },
      {
        id: "fc-cs-3",
        question: "What is the primary worst-case boundary of QuickSort and how is it mitigated?",
        answer: "The worst-case complexity is O(N^2) occurring when pivots split arrays highly unequally (such as pre-sorted inputs). It is mitigated by choosing a random pivot or utilizing the 'median-of-three' rule.",
        status: "new"
      },
      {
        id: "fc-cs-4",
        question: "Define Hash Collisions and contrast Chaining versus Open Addressing mitigation rules.",
        answer: "Collisions occur when different keys hash to identical indexes. Chaining stores collision items in a linked list at that index; Open Addressing searches neighboring cells (linear/quadratic probing) for gaps.",
        status: "new"
      },
      {
        id: "fc-cs-5",
        question: "What unique invariants distinguish Red-Black Trees from standard binary search trees?",
        answer: "Every node is red or black, root is always black, leaves are black nulls, red nodes must have black children, and every path from node to descendant leaf contains identical black node counts (O(log N) balance).",
        status: "new"
      }
    ]
  },
  {
    id: "deck-bio-cell",
    name: "Cellular Energy, Genes & CRISPR-Cas9",
    subject: "Biology",
    cards: [
      {
        id: "fc-bio-1",
        question: "Explain the energy transduction role of ATP (Adenosine Triphosphate).",
        answer: "ATP works as the primary molecular currency. Energetically unfavorable reactions are coupled to ATP hydrolysis, releasing free energy (~30.5 kJ/mol) by breaking high-energy phosphoanhydride bonds.",
        status: "new"
      },
      {
        id: "fc-bio-2",
        question: "Name the key stages of the Krebs Cycle and its output per individual glucose cycle.",
        answer: "The cycle inside mitochondria oxidizes acetyl-CoA into CO2. One glucose (2 turns) produces 6 NADH, 2 FADH2, 2 ATP/GTP, which feed directly into the electron transport chain to fuel oxidative phosphorylation.",
        status: "new"
      },
      {
        id: "fc-bio-3",
        question: "How does CRISPR-Cas9 execute site-specific genome editing?",
        answer: "A single guide RNA (sgRNA) targets a complementary 20-nucleotide coordinate beside a Protospacer Adjacent Motif (PAM). The Cas9 enzyme then acts as molecular scissors to construct a precise double-stranded DNA break.",
        status: "new"
      },
      {
        id: "fc-bio-4",
        question: "Contrast the mitotic stages of Anaphase and Telophase.",
        answer: "Anaphase pulls sister chromatids apart toward opposing cell poles. Telophase reconstructs the nuclear envelopes, decondenses chromosomes, and initiates cytokinesis division boundaries.",
        status: "new"
      },
      {
        id: "fc-bio-5",
        question: "Explain depolarization and repolarization phases of an action potential.",
        answer: "Depolarization is driven by rapid influx of Na+ ions via voltage-gated sodium channels. Repolarization stops Na+ influx and prompts rapid efflux of K+ ions via potassium channels, restoring negative potential.",
        status: "new"
      }
    ]
  },
  {
    id: "deck-phy-quant",
    name: "Relativity, Thermodynamics & Quantum States",
    subject: "Physics",
    cards: [
      {
        id: "fc-phy-1",
        question: "Explain the core postulate of Einstein's Special Relativity concerning the speed of light.",
        answer: "The speed of light in a vacuum (c) is an absolute constant for all observers, completely independent of the relative velocity of the light source or the reference framework of the observer.",
        status: "new"
      },
      {
        id: "fc-phy-2",
        question: "Define the Second Law of Thermodynamics in terms of entropy.",
        answer: "The total thermodynamic entropy (disorder) of any isolated physical system must always increase over time; natural state transformations run irreversibly toward maximum structural homogeneity.",
        status: "new"
      },
      {
        id: "fc-phy-3",
        question: "What is Quantum Entanglement and why did Einstein refer to it as 'spooky action at a distance'?",
        answer: "Entanglement occurs when paired subatomic particles share unified wave states. Interrogating a parameter of particle A immediately collapses particle B's reciprocal value, regardless of the physical distance separating them.",
        status: "new"
      },
      {
        id: "fc-phy-4",
        question: "Describe the Photoelectric Effect and how it justifies light quantization.",
        answer: "Light ejects surface electrons only if it surpasses a specific threshold frequency, regardless of intensity. This proves light consists of discrete energy packets (photons) defined by E = h*f.",
        status: "new"
      },
      {
        id: "fc-phy-5",
        question: "State Heisenberg's Uncertainty Principle and its physical formula.",
        answer: "It is physically impossible to simultaneously measure both the position (x) and momentum (p) of a particle with absolute precision: Δx * Δp >= h-bar / 2.",
        status: "new"
      }
    ]
  },
  {
    id: "deck-chem-kin",
    name: "Gibbs Free Energy, Kinetics & pH Balance",
    subject: "Chemistry",
    cards: [
      {
        id: "fc-ch-1",
        question: "Define Gibbs Free Energy (ΔG) and explain how its sign determines process spontaneity.",
        answer: "ΔG = ΔH - T*ΔS. A negative ΔG represents an exergonic, spontaneous reaction. A positive ΔG represents an endergonic, non-spontaneous reaction requiring external energy inputs.",
        status: "new"
      },
      {
        id: "fc-ch-2",
        question: "State Le Chatelier's Principle and explain its response to temperature changes.",
        answer: "If a chemical system at equilibrium is disturbed, the equilibrium shifts to counteract the disturbance. Heating an endothermic reaction shifts it right to absorb energy; heating an exothermic reaction shifts it left.",
        status: "new"
      },
      {
        id: "fc-ch-3",
        question: "How does one calculate the pH of a solution based on hydrogen ion concentration?",
        answer: "pH is defined log-scale: pH = -log10[H3O+]. For example, a solution with [H3O+] = 10^-5 M yields a pH of exactly 5 (highly acidic).",
        status: "new"
      },
      {
        id: "fc-ch-4",
        question: "What is chirality and what criteria defines a stereocenter carbon?",
        answer: "Chirality is the geometric property of an object being non-superimposable on its mirror image. A carbon stereocenter is a tetrahedral carbon atom bonded to four chemically distinct groups.",
        status: "new"
      },
      {
        id: "fc-ch-5",
        question: "Explain how catalysts accelerate chemical reactions without altering equilibrium.",
        answer: "Catalysts provide an alternative reaction mechanism with a lower Activation Energy (Ea). This increases the forward and backward reaction rates equally, preserving the equilibrium constant Keq.",
        status: "new"
      }
    ]
  },
  {
    id: "deck-hist-strat",
    name: "Ancient Codes & Industrial Shift Chronology",
    subject: "History",
    cards: [
      {
        id: "fc-hi-1",
        question: "What was the significance of the Code of Hammurabi in early Babylonia?",
        answer: "It was one of the earliest written legal codes, establishing uniform physical standards and a harsh 'lex talionis' (eye for an eye) punishment model scaled according to social status hierarchy.",
        status: "new"
      },
      {
        id: "fc-hi-2",
        question: "Explain the urban planning achievements of the ancient Indus Valley Civilization.",
        answer: "The cities of Harappa and Mohenjo-daro featured sophisticated grid-based planning, uniform sun-baked brick dimensions, and an exceptional municipal wastewater/drainage system superior to contemporary empires.",
        status: "new"
      },
      {
        id: "fc-hi-3",
        question: "Detail the transition of agrarian labor circles during the First Industrial Revolution (1760-1840).",
        answer: "The transition replaced traditional decentralized cottage industries with highly centralized, stream-driven urban factory hubs, prompting massive demographic migration, deskilling, and strict shift schedules.",
        status: "new"
      },
      {
        id: "fc-hi-4",
        question: "What was the Bronze Age Collapse and what key systems crumbled around 1200 BCE?",
        answer: "A rapid, interconnected socioeconomic collapse of civilisations in the Near East and Mediterranean. Driven by sea invader migrations, drought, and iron-displacement metallurgical trade breakdowns.",
        status: "new"
      },
      {
        id: "fc-hi-5",
        question: "What regulatory shifts resulted from the British Factory Act of 1833?",
        answer: "It established the first enforceable occupational safety and child labor codes in textile factories, banning employment of youngsters under 9 and creating a dedicated factory inspectorate.",
        status: "new"
      }
    ]
  },
  {
    id: "deck-lit-metrics",
    name: "Poetic Meters, Sonnets & Modernist Narrative",
    subject: "Literature",
    cards: [
      {
        id: "fc-li-1",
        question: "Explain the metric rhythm parameters of standard Iambic Pentameter.",
        answer: "A metrical line featuring five sequential 'iamb' feet. Each iamb consists of one unstressed syllable followed by a stressed syllable, resulting in a 10-syllable de-DUM de-DUM balance.",
        status: "new"
      },
      {
        id: "fc-li-2",
        question: "Define Stream of Consciousness and name a prominent modernist author who pioneered it.",
        answer: "A narrative technique depicting the continuous, non-linear flow of internal feelings, thoughts, and associations of a character. Virgina Woolf (Mrs. Dalloway) and James Joyce (Ulysses) are famous pioneers.",
        status: "new"
      },
      {
        id: "fc-li-3",
        question: "Contrast iambic feet with trochaic metric feet.",
        answer: "An iamb is unstressed followed by stressed (de-DUM), whereas a trochee is stressed followed by unstressed (DUM-de), creating a falling rather than rising cadence.",
        status: "new"
      },
      {
        id: "fc-li-4",
        question: "What is Hemingway's 'Iceberg Theory' of narrative emission?",
        answer: "A style focusing on raw, surface-level minimalism. By omitting explicit details of history or motive, the deeper subtext resides implicitly beneath the surface, strengthening reader engagement.",
        status: "new"
      },
      {
        id: "fc-li-5",
        question: "Describe T.S. Eliot's concept of the 'Objective Correlative'.",
        answer: "A formulaic group of objects, a situation, or chain of events that serve as the immediate vector for a particular human emotion, allowing readers to experience the feeling without passive description.",
        status: "new"
      }
    ]
  }
];
