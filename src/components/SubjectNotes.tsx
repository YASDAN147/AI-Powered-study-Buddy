import { useState, ChangeEvent } from "react";
import { StudyNote, NoteChunk } from "../types";
import { BookOpen, FileText, Plus, Trash2, Sparkles, AlertCircle, RefreshCw, Layers, Upload, CheckCircle } from "lucide-react";
import { extractTextFromPdf } from "../utils/pdfExtractor";

interface SubjectNotesProps {
  notes: StudyNote[];
  onAddNote: (note: StudyNote | StudyNote[]) => void;
  onDeleteNote: (id: string) => void;
  xp: number;
  onEarnReward: (xpGained: number, coinsGained: number) => void;
}

export default function SubjectNotes({ notes, onAddNote, onDeleteNote, xp, onEarnReward }: SubjectNotesProps) {
  const [activeSubject, setActiveSubject] = useState<string>("All");
  const [selectedNote, setSelectedNote] = useState<StudyNote | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [creationMode, setCreationMode] = useState<"text" | "upload">("text");
  
  // Form fields
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Computer Science");
  const [newContent, setNewContent] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Textbook upload states
  const [uploadProgress, setUploadProgress] = useState<{
    status: "idle" | "reading" | "segmenting" | "done" | "error";
    message: string;
    percent: number;
  }>({ status: "idle", message: "", percent: 0 });

  const subjectsList = ["All", "Computer Science", "Python", "Biology", "History", "Physics", "Literature", "Chemistry"];

  const filteredNotes = activeSubject === "All" 
    ? notes 
    : notes.filter((n) => n.subject === activeSubject);

  // High-yield clean semantic chunks creator
  const createChunks = (noteId: string, title: string, subject: string, text: string): NoteChunk[] => {
    const cleanText = text.trim();
    if (!cleanText) return [];
    
    // Split by paragraphs first using double line breaks
    let rawParagraphs = cleanText.split(/\n\s*\n|\n{2,}/);
    
    // Fallback: if we only got 1 or 2 giant chunk structures without double spacing, split by standard sentences
    if (rawParagraphs.length <= 2 && cleanText.length > 2000) {
      rawParagraphs = cleanText.split(/(?<=[.?!])\s+/); // split at sentence boundaries
    }

    const segments: NoteChunk[] = [];
    let currentBlock = "";
    let blockIndex = 0;

    // Group paragraphs into stable 800-1200 character nodes for balanced high-speed search retrieval
    for (const paragraph of rawParagraphs) {
      const trimmed = paragraph.trim();
      if (!trimmed) continue;

      if ((currentBlock.length + trimmed.length) > 1000 && currentBlock.length > 200) {
        segments.push({
          id: `${noteId}-chunk-${blockIndex}`,
          noteId,
          noteTitle: title,
          noteSubject: subject,
          text: currentBlock.trim()
        });
        currentBlock = trimmed;
        blockIndex++;
      } else {
        currentBlock += (currentBlock ? "\n" : "") + trimmed;
      }
    }

    if (currentBlock.trim().length > 15) {
      segments.push({
        id: `${noteId}-chunk-${blockIndex}`,
        noteId,
        noteTitle: title,
        noteSubject: subject,
        text: currentBlock.trim()
      });
    }

    return segments.filter((chunk) => chunk.text.length > 20);
  };

  // Secure Textbook File Uploader & Segment Slicer
  const handleTextbookUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadProgress({
      status: "reading",
      message: `Loading textbook document "${file.name}"...`,
      percent: 10
    });

    try {
      let text = "";
      if (file.name.toLowerCase().endsWith(".pdf")) {
        // Handle PDF processing dynamically
        text = await extractTextFromPdf(file, (percent, message) => {
          setUploadProgress({
            status: "reading",
            message,
            percent
          });
        });
      } else {
        // Handle normal plain text / markdown / json files
        text = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string) || "");
          reader.onerror = () => reject(new Error("Failed to read text file."));
          reader.readAsText(file);
        });
      }

      if (!text || text.trim().length === 0) {
        setUploadProgress({
          status: "error",
          message: "The uploaded file content appears to be empty.",
          percent: 0
        });
        return;
      }

      setUploadProgress({
        status: "segmenting",
        message: "Compiling textbook content and building index vectors...",
        percent: 85
      });

      // Split extremely massive textbooks into sequential 30,000 char study-note boundaries
      const maxSegmentSize = 30005;
      const notesToCreate: StudyNote[] = [];
      const baseNoteId = `book-${Date.now()}`;
      const defaultTitle = file.name.replace(/\.[^/.]+$/, ""); // strip raw file extension

      if (text.length <= maxSegmentSize) {
        // Fits comfortable single note volume
        const noteId = `${baseNoteId}-0`;
        const generatedChunks = createChunks(noteId, defaultTitle, newSubject, text);
        notesToCreate.push({
          id: noteId,
          title: defaultTitle,
          subject: newSubject,
          content: text,
          createdAt: new Date().toLocaleDateString(),
          isIndexed: true,
          chunks: generatedChunks
        });
      } else {
        // Multi-segment book slicing
        let index = 0;
        let pointer = 0;

        while (pointer < text.length) {
          let end = pointer + maxSegmentSize;
          if (end >= text.length) {
            end = text.length;
          } else {
            // Find nearby paragraph/sentence end to avoid cut off words
            const searchSlice = text.substring(end - 2000, end + 2000);
            const paragraphEnd = searchSlice.lastIndexOf("\n\n");
            if (paragraphEnd !== -1 && paragraphEnd > 500) {
              end = (end - 2000) + paragraphEnd + 2;
            } else {
              const sentenceEnd = searchSlice.lastIndexOf(". ");
              if (sentenceEnd !== -1 && sentenceEnd > 500) {
                end = (end - 2000) + sentenceEnd + 2;
              }
            }
          }

          const segmentContent = text.substring(pointer, end).trim();
          if (segmentContent.length > 50) {
            const partTitle = `${defaultTitle} - Part ${index + 1}`;
            const noteId = `${baseNoteId}-${index}`;
            const generatedChunks = createChunks(noteId, partTitle, newSubject, segmentContent);

            notesToCreate.push({
              id: noteId,
              title: partTitle,
              subject: newSubject,
              content: segmentContent,
              createdAt: new Date().toLocaleDateString(),
              isIndexed: true,
              chunks: generatedChunks
            });
            index++;
          }
          pointer = end;
        }
      }

      // batch-dispatch segmented materials to persistent memory
      onAddNote(notesToCreate);
      
      const totalCreatedChunks = notesToCreate.reduce((sum, n) => sum + n.chunks.length, 0);

      // Reward high points for successful ingestion!
      onEarnReward(80, 25); // Golden textbook ingestion award

      setUploadProgress({
        status: "done",
        message: `Successfully indexed textbook! Saved ${notesToCreate.length} parts and ${totalCreatedChunks} RAG retrieval indices. Ready to query!`,
        percent: 100
      });

      // Show the first parsed book section in workspace
      if (notesToCreate.length > 0) {
        setSelectedNote(notesToCreate[0]);
        setTimeout(() => {
          setIsCreating(false);
          setUploadProgress({ status: "idle", message: "", percent: 0 });
        }, 2200);
      }
    } catch (err: any) {
      console.error(err);
      setUploadProgress({
        status: "error",
        message: err.message || "Failed to parse direct PDF document textbook.",
        percent: 0
      });
    }
  };

  const handleCreateNote = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      setErrorMsg("Please fill out both the title and notes content.");
      return;
    }

    const noteId = `note-${Date.now()}`;
    const generatedChunks = createChunks(noteId, newTitle, newSubject, newContent);

    const newNote: StudyNote = {
      id: noteId,
      title: newTitle,
      subject: newSubject,
      content: newContent,
      createdAt: new Date().toLocaleDateString(),
      isIndexed: true,
      chunks: generatedChunks
    };

    onAddNote(newNote);
    onEarnReward(30, 10); // Standard prompt rewarding
    setSelectedNote(newNote);
    setIsCreating(false);
    
    // Reset Form
    setNewTitle("");
    setNewContent("");
    setErrorMsg("");
  };

  const handleAISummarize = async () => {
    if (!newContent.trim()) {
      setErrorMsg("Please paste some lecture content or slide notes first!");
      return;
    }

    setIsSummarizing(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/gemini/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noteTitle: newTitle || "Lecture Session",
          noteSubject: newSubject,
          noteContent: newContent
        })
      });

      if (!response.ok) {
        throw new Error("Tutor was unable to summarize this text.");
      }

      const data = await response.json();
      setNewContent(data.text);
      if (!newTitle) {
        setNewTitle(`AI Summary: ${newSubject} Outline`);
      }
      onEarnReward(50, 20); // Golden summarization reward
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to reach AI Summarizer. Check your environment connectivity.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const reindexNote = (note: StudyNote) => {
    setIsIndexing(true);
    setTimeout(() => {
      const updatedChunks = createChunks(note.id, note.title, note.subject, note.content);
      note.isIndexed = true;
      note.chunks = updatedChunks;
      setIsIndexing(false);
      onEarnReward(15, 5); // Indexing bonus
    }, 1500);
  };

  return (
    <div id="subject-notes-panel" className="grid grid-cols-1 md:grid-cols-4 gap-6 p-2 min-h-[500px]">
      {/* Sidebar: Subject quick links & note history */}
      <div id="note-sidebar" className="md:col-span-1 glass border border-white/5 rounded-3xl p-4 flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Subjects</h3>
          <div className="flex flex-wrap md:flex-col gap-1">
            {subjectsList.map((sub) => (
              <button
                key={sub}
                onClick={() => {
                  setActiveSubject(sub);
                  setSelectedNote(null);
                  setIsCreating(false);
                }}
                className={`py-2 px-3 text-sm font-medium rounded-xl text-left transition-all duration-300 ${
                  activeSubject === sub 
                    ? "bg-indigo-500/15 border border-indigo-500/30 text-indigo-300" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-neutral-100 dark:border-neutral-800" />

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-widest text-left">Your Notes</h3>
            <button 
              onClick={() => {
                setIsCreating(true);
                setSelectedNote(null);
                setNewTitle("");
                setNewContent("");
              }}
              className="p-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition"
              title="Create note template"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 max-h-[300px] md:max-h-[350px]">
            {filteredNotes.length === 0 ? (
              <p className="text-xs text-neutral-400 italic text-center py-6">No lessons added yet.</p>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNote(note);
                    setIsCreating(false);
                  }}
                  className={`p-3 rounded-2xl cursor-pointer transition text-left relative group border ${
                    selectedNote?.id === note.id 
                      ? "glass shadow-xl border-indigo-500/40 bg-indigo-500/10" 
                      : "border-transparent bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-bold text-indigo-500/80 uppercase mb-1 tracking-wider">{note.subject}</span>
                    <span className="text-[10px] text-neutral-400">{note.createdAt}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-1">{note.title}</h4>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-500 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <Layers className="w-2.5 h-2.5" />
                      {note.chunks.length} retrieval nodes
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note.id);
                      if (selectedNote?.id === note.id) setSelectedNote(null);
                    }}
                    className="absolute right-2 bottom-2 p-1 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div id="note-workspace" className="md:col-span-3 flex flex-col glass rounded-3xl p-6 border border-white/8 shadow-2xl">
        {isCreating ? (
          <div id="create-note-form" className="flex flex-col gap-4 text-left h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/8 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white text-glow flex items-center gap-2">
                  <FileText className="text-indigo-400" /> Create New Learning Deck
                </h2>
                <p className="text-xs text-slate-400 mt-1">Upload a textbook file or paste custom study materials. The AI Study Companion indexes everything for high-speed local RAG recall.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">Class:</span>
                <select 
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="bg-slate-900 text-slate-200 text-sm font-semibold rounded-xl px-3 py-1.5 border border-white/5"
                >
                  {subjectsList.filter(s => s !== "All").map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Interactive Switcher Tabs for Manual Text vs Book Upload */}
            <div className="flex border-b border-white/5 pb-2 mb-2 gap-4">
              <button
                type="button"
                onClick={() => setCreationMode("text")}
                className={`pb-2 px-1 text-xs font-black uppercase tracking-wider transition-all duration-300 border-b-2 leading-none ${
                  creationMode === "text"
                    ? "border-indigo-500 text-indigo-300"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                Manual Copy-Paste / Draft
              </button>
              <button
                type="button"
                onClick={() => setCreationMode("upload")}
                className={`pb-2 px-1 text-xs font-black uppercase tracking-wider transition-all duration-300 border-b-2 leading-none flex items-center gap-1.5 ${
                  creationMode === "upload"
                    ? "border-indigo-500 text-indigo-300"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <Upload className="w-3.5 h-3.5" /> Auto Textbook Importer
              </button>
            </div>

            {errorMsg && (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs p-3.5 rounded-2xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {creationMode === "upload" ? (
              /* TEXTBOOK ACCELERATED UPLOADER ZONE */
              <div 
                id="textbook-drag-drop-zone" 
                className="flex-1 flex flex-col justify-center items-center py-10 border-2 border-dashed border-white/10 rounded-2xl bg-slate-950/20 hover:bg-slate-950/40 hover:border-indigo-500/30 p-6 transition text-center relative gap-5"
              >
                <div className="p-4 bg-indigo-500/10 rounded-full text-indigo-400 border border-indigo-500/20 shadow-md">
                  <Upload className="w-8 h-8 animate-pulse" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-white tracking-tight">Upload Complete Textbook or Syllabus</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    Select any <strong>.txt, .md, .json, or .pdf</strong> file. Massive resources are automatically parsed, structured, and split into sequential lesson nodes to safeguard against browser performance loss or API memory bounds.
                  </p>
                </div>

                {uploadProgress.status !== "idle" && (
                  <div className="w-full max-w-md bg-slate-950/75 p-5 border border-white/5 rounded-2xl space-y-3 shadow-md">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-indigo-300 flex items-center gap-1.5 leading-none">
                        {uploadProgress.status === "reading" && <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />}
                        {uploadProgress.status === "segmenting" && <Layers className="w-3.5 h-3.5 animate-pulse text-amber-400" />}
                        {uploadProgress.status === "done" && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                        {uploadProgress.status === "error" && <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
                        {uploadProgress.message}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 font-bold">{uploadProgress.percent}%</span>
                    </div>
                    
                    <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          uploadProgress.status === "error" ? "bg-rose-500" : "bg-gradient-to-r from-indigo-500 to-teal-400"
                        }`}
                        style={{ width: `${uploadProgress.percent}%` }}
                      />
                    </div>
                  </div>
                )}

                <label className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg select-none">
                  Choose Book File
                  <input 
                    type="file" 
                    accept=".txt,.md,.json,.pdf" 
                    onChange={handleTextbookUpload} 
                    className="hidden" 
                  />
                </label>
              </div>
            ) : (
              /* STANDARD MANUAL FORM */
              <div className="flex-1 flex flex-col gap-4">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Topic Title (e.g. Photoelectric Effect, Mitosis Stages, SQL Joins...)"
                  className="w-full text-base font-bold bg-white/5 focus:bg-slate-950 border border-transparent focus:border-indigo-500 rounded-2xl px-4 py-3 placeholder-slate-500 text-white transition"
                />

                <div className="flex-1 min-h-[220px] relative">
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Paste your lecture notes, messy slides, transcripts, or personal draft logs here..."
                    className="w-full h-full text-sm leading-relaxed bg-white/5 focus:bg-slate-950 border border-transparent focus:border-indigo-500 rounded-2xl p-4 placeholder-slate-500 text-slate-200 resize-none transition"
                  />
                  
                  {/* Floating summary & magical buttons */}
                  <div className="absolute right-4 bottom-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAISummarize}
                      disabled={isSummarizing}
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:from-neutral-400 disabled:to-neutral-500 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-200 dark:shadow-none transition transform hover:-translate-y-0.5 active:translate-y-0"
                      title="Let AI reorganize and explain this note beautifully"
                    >
                      {isSummarizing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Tidying up...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                          Format with AI Summarizer (+50 XP)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-slate-200 transition font-bold"
              >
                Cancel
              </button>
              {creationMode === "text" && (
                <button
                  type="button"
                  onClick={handleCreateNote}
                  className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition shadow-md shadow-indigo-950"
                >
                  Save & Index Note (+30 XP)
                </button>
              )}
            </div>
          </div>
        ) : selectedNote ? (
          <div id="note-details" className="flex flex-col text-left h-full gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/8 pb-4">
              <div>
                <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest">{selectedNote.subject}</span>
                <h2 className="text-xl font-bold text-white text-glow mt-0.5">{selectedNote.title}</h2>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <span>Saved on {selectedNote.createdAt}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => reindexNote(selectedNote)}
                  disabled={isIndexing}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {isIndexing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Refitting Indices...
                    </>
                  ) : (
                    <>
                      <Layers className="w-3.5 h-3.5" />
                      Re-index RAG Chunks
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Content Display */}
            <div className="flex-1 overflow-y-auto max-h-[380px] bg-white/5 border border-white/5 p-4 rounded-2xl leading-relaxed whitespace-pre-wrap text-sm text-slate-200">
              {selectedNote.content}
            </div>

            {/* RAG Index Map visual overlay */}
            <div className="bg-gradient-to-r from-teal-500/5 to-indigo-500/10 border border-white/5 p-4 rounded-2xl">
              <h4 className="text-xs font-extrabold text-teal-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 animate-pulse" /> RAG Semantic Segments ({selectedNote.chunks.length} elements mapped)
              </h4>
              <p className="text-[10px] text-slate-400 mb-3">Our background parser chunked this notebook into discrete semantic nodes. When you ask questions in the RAG bot, the system ranks these blocks using substring similarity vector scores to ground explanations.</p>
              
              <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto">
                {selectedNote.chunks.map((c, i) => (
                  <span 
                    key={c.id} 
                    className="text-[10px] bg-white/5 border border-white/5 cursor-help hover:border-teal-500 py-1 px-2.5 rounded-lg text-slate-300 transition-colors"
                    title={c.text}
                  >
                    Node #{i+1}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div id="notes-empty-state" className="flex flex-col items-center justify-center py-20 text-center gap-4 flex-1">
            <div className="p-4 bg-indigo-500/10 rounded-full text-indigo-400 animate-bounce">
              <BookOpen className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white text-glow">Ready your Study Materials</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">Upload lecture details, study text, or tidy up drafts. Once stored, you can ask questions with interactive Real-Time RAG or synthesize tailored interactive quizzes!</p>
            </div>
            <button
              onClick={() => {
                setIsCreating(true);
                setSelectedNote(null);
                setNewTitle("");
                setNewContent("");
              }}
              className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold py-2.5 px-6 rounded-2xl transition shadow-md shadow-indigo-100 dark:shadow-none"
            >
              Add Note or Paste Text
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
