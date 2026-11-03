'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { getBookmarks, toggleBookmark } from '@/lib/adaptive/bookmarks';
import { LESSONS_REGISTRY } from '@/lib/curriculum/lessonsData';
import {
  X,
  Bookmark,
  FileText,
  Plus,
  Trash2,
  Download,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

export interface StudyNote {
  id: string;
  title: string;
  topic: string;
  content: string;
  timestamp: string;
}

const NOTES_STORAGE_KEY = 'ml_in_motion_notes_v1';

export function getSavedNotes(): StudyNote[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) {
      const defaultNotes: StudyNote[] = [
        {
          id: 'note-1',
          title: 'K-Means Voronoi Property',
          topic: 'K-Means',
          content: 'Lloyd iteration always decreases or maintains inertia. Voronoi cells are convex polygons bisected by straight perpendicular hyperplanes.',
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
        {
          id: 'note-2',
          title: 'Concentric Ring Failure',
          topic: 'Failure Modes',
          content: 'K-Means slices concentric rings because variance is calculated to the centroid (mean), not neighbor density. Need DBSCAN with epsilon reachability.',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      ];
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(defaultNotes));
      return defaultNotes;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get notes', e);
    return [];
  }
}

export function saveNotes(notes: StudyNote[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  window.dispatchEvent(new CustomEvent('notes-updated'));
}

interface NotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotesDrawer: React.FC<NotesDrawerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'bookmarks'>('notes');
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Note form state
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('General');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNotes(getSavedNotes());
      setBookmarks(getBookmarks());
    }
  }, [isOpen]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newNote: StudyNote = {
      id: `note-${Date.now()}`,
      title: newTitle.trim(),
      topic: newTopic,
      content: newContent.trim(),
      timestamp: new Date().toISOString(),
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    saveNotes(updated);

    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    saveNotes(updated);
  };

  const handleRemoveBookmark = (lessonId: string) => {
    toggleBookmark(lessonId);
    setBookmarks(getBookmarks());
  };

  const handleExportMarkdown = () => {
    let md = '# ML in Motion — Personal Study Notes\n\n';
    md += `Generated: ${new Date().toLocaleString()}\n\n`;

    notes.forEach((n) => {
      md += `## ${n.title} [${n.topic}]\n`;
      md += `*${new Date(n.timestamp).toLocaleString()}*\n\n`;
      md += `${n.content}\n\n---\n\n`;
    });

    const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(md);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ml_in_motion_study_notes_${Date.now()}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#1A1715]/60 backdrop-blur-[1px]">
      <div
        className="w-full max-w-md bg-[#FAF7F0] border-l-[2px] border-[#1A1715] shadow-[-6px_0px_0px_#1A1715] h-full flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header Plate */}
        <div className="p-4 border-b-[1.5px] border-[#1A1715] bg-[#E8E1D3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#C83226]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1A1715]">
              STUDY DRAWER // NOTES & BOOKMARKS
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-[#1A1715] bg-[#FAF7F0] hover:bg-[#F0EAE0]"
          >
            <X className="w-4 h-4 text-[#1A1715]" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#1A1715] bg-[#FAF7F0] font-mono text-xs">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-2.5 px-3 border-r border-[#1A1715] font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'notes' ? 'bg-[#1848B8] text-white' : 'hover:bg-[#F0EAE0] text-[#5C544B]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>NOTES ({notes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 py-2.5 px-3 font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'bookmarks' ? 'bg-[#1848B8] text-white' : 'hover:bg-[#F0EAE0] text-[#5C544B]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>BOOKMARKS ({bookmarks.length})</span>
          </button>
        </div>

        {/* Tab 1: Notes List & Editor */}
        {activeTab === 'notes' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsAdding(!isAdding)}
                className="font-mono text-xs font-bold px-3 py-1 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715] flex items-center gap-1 hover:bg-[#E8E1D3]"
              >
                <Plus className="w-3 h-3 text-[#C83226]" />
                <span>{isAdding ? 'CANCEL' : 'ADD NOTE'}</span>
              </button>

              <button
                onClick={handleExportMarkdown}
                disabled={notes.length === 0}
                className="font-mono text-xs font-bold px-2.5 py-1 bg-[#FAF7F0] border border-[#1A1715] flex items-center gap-1 hover:bg-[#E8E1D3] disabled:opacity-40"
              >
                <Download className="w-3 h-3" />
                <span>EXPORT .MD</span>
              </button>
            </div>

            {/* Note Creation Form */}
            {isAdding && (
              <form
                onSubmit={handleAddNote}
                className="p-3 bg-[#E8E1D3] border-[1.5px] border-[#1A1715] space-y-2 font-mono text-xs"
              >
                <div>
                  <label className="block text-[10px] font-bold text-[#5C544B] uppercase mb-0.5">
                    TITLE:
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Lloyd Algorithm Termination Condition"
                    className="w-full p-1.5 bg-[#FAF7F0] border border-[#1A1715] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#5C544B] uppercase mb-0.5">
                    TOPIC:
                  </label>
                  <select
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full p-1.5 bg-[#FAF7F0] border border-[#1A1715] outline-none"
                  >
                    <option value="K-Means">K-Means</option>
                    <option value="Linear Regression">Linear Regression</option>
                    <option value="Gradient Descent">Gradient Descent</option>
                    <option value="Logistic Regression">Logistic Regression</option>
                    <option value="Decision Trees">Decision Trees</option>
                    <option value="PCA">PCA</option>
                    <option value="Failure Modes">Failure Modes</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#5C544B] uppercase mb-0.5">
                    CONTENT:
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Capture your intuition, equations, or counter-examples..."
                    className="w-full p-1.5 bg-[#FAF7F0] border border-[#1A1715] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-1.5 bg-[#1848B8] text-white font-bold uppercase border border-[#1A1715] shadow-[1px_1px_0px_#1A1715]"
                >
                  SAVE NOTE
                </button>
              </form>
            )}

            {/* List of Notes */}
            <div className="space-y-3">
              {notes.length === 0 ? (
                <div className="p-8 text-center font-mono text-xs text-[#948B7D]">
                  No study notes yet. Click &ldquo;ADD NOTE&rdquo; to jot down mathematical reflections.
                </div>
              ) : (
                notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] space-y-1.5 font-mono text-xs"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-[#D8CFC0] pb-1">
                      <div>
                        <span className="font-bold text-[#1A1715] block">{n.title}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] px-1 bg-[#E8E1D3] border border-[#1A1715] text-[#5C544B]">
                            {n.topic}
                          </span>
                          <span className="text-[10px] text-[#948B7D]">
                            {new Date(n.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(n.id)}
                        className="text-[#948B7D] hover:text-[#C83226] p-1"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[#1A1715] text-[11px] leading-relaxed whitespace-pre-wrap">
                      {n.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Bookmarks */}
        {activeTab === 'bookmarks' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
            {bookmarks.length === 0 ? (
              <div className="p-8 text-center text-[#948B7D]">
                No lessons bookmarked yet. Click the bookmark button on any lesson to save it for quick access.
              </div>
            ) : (
              bookmarks.map((lesId) => {
                const lesson = LESSONS_REGISTRY[lesId];
                if (!lesson) return null;

                return (
                  <div
                    key={lesId}
                    className="p-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-[#C83226] font-bold block uppercase">
                          {lesson.algorithmId}
                        </span>
                        <span className="font-bold text-[#1A1715]">{lesson.title}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveBookmark(lesId)}
                        className="text-[#948B7D] hover:text-[#C83226] p-1"
                        title="Remove bookmark"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="pt-2 border-t border-[#D8CFC0]">
                      <Link
                        href={`/lessons/${lesson.id}`}
                        onClick={onClose}
                        className="w-full py-1.5 px-2.5 bg-[#FAF7F0] border border-[#1A1715] hover:bg-[#F0EAE0] font-bold uppercase text-[10px] flex items-center justify-between"
                      >
                        <span>RESUME LESSON</span>
                        <ArrowRight className="w-3 h-3 text-[#1848B8]" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
