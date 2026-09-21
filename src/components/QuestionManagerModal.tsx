import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, QuestionCategory } from '../types';
import {
  X,
  Plus,
  Search,
  BookOpen,
  Trash2,
  Check,
  AlertCircle,
  Pencil,
  RotateCcw,
  CheckCircle2,
  Save,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import {
  saveCustomQuestion,
  updateStoredQuestion,
  deleteStoredQuestion,
  resetQuestionsToDefault,
} from '../data/geographyQuestions';

interface QuestionManagerModalProps {
  questions: Question[];
  onClose: () => void;
  onRefreshQuestions: () => void;
}

export const QuestionManagerModal: React.FC<QuestionManagerModalProps> = ({
  questions,
  onClose,
  onRefreshQuestions,
}) => {
  const [tab, setTab] = useState<'list' | 'add' | 'edit'>('list');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'all'>('all');

  // Form state for Adding & Editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [category, setCategory] = useState<QuestionCategory>('vietnam_nature');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [explanation, setExplanation] = useState('');
  const [formError, setFormError] = useState('');

  // Notifications & Confirmations
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const categories: { id: QuestionCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Tất cả chủ đề' },
    { id: 'vietnam_nature', label: 'Địa lý Tự nhiên VN' },
    { id: 'vietnam_economy', label: 'Kinh tế - Xã hội VN' },
    { id: 'world_geo', label: 'Địa lý Thế giới' },
    { id: 'climate_earth', label: 'Trái Đất & Bản đồ' },
    { id: 'capitals_flags', label: 'Thủ đô & Quốc gia' },
  ];

  const filteredQuestions = questions.filter((q) => {
    const matchCategory = selectedCategory === 'all' || q.category === selectedCategory;
    const matchSearch =
      search.trim() === '' ||
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.explanation.toLowerCase().includes(search.toLowerCase()) ||
      q.options.some((opt) => opt.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 2500);
  };

  // Switch to Add Mode
  const handleOpenAdd = () => {
    setEditingId(null);
    setQuestionText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setCorrectIdx(0);
    setCategory('vietnam_nature');
    setDifficulty('medium');
    setExplanation('');
    setFormError('');
    setTab('add');
  };

  // Switch to Edit Mode
  const handleOpenEdit = (q: Question) => {
    setEditingId(q.id);
    setQuestionText(q.question);
    setOptA(q.options[0] || '');
    setOptB(q.options[1] || '');
    setOptC(q.options[2] || '');
    setOptD(q.options[3] || '');
    setCorrectIdx(q.correctIndex);
    setCategory(q.category);
    setDifficulty(q.difficulty || 'medium');
    setExplanation(q.explanation || '');
    setFormError('');
    setTab('edit');
  };

  // Save new question
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) {
      setFormError('Vui lòng nhập nội dung câu hỏi và toàn bộ 4 phương án A, B, C, D.');
      return;
    }

    const catName = categories.find((c) => c.id === category)?.label || 'Địa lý';

    saveCustomQuestion({
      question: questionText.trim(),
      options: [optA.trim(), optB.trim(), optC.trim(), optD.trim()],
      correctIndex: correctIdx,
      category,
      categoryName: catName,
      explanation: explanation.trim() || 'Đáp án chính xác theo kiến thức Địa lý.',
      difficulty,
    });

    onRefreshQuestions();
    showToast('Đã thêm câu hỏi mới thành công!');
    setTab('list');
  };

  // Save edited question
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    if (!questionText.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) {
      setFormError('Vui lòng nhập nội dung câu hỏi và toàn bộ 4 phương án A, B, C, D.');
      return;
    }

    const catName = categories.find((c) => c.id === category)?.label || 'Địa lý';

    updateStoredQuestion(editingId, {
      question: questionText.trim(),
      options: [optA.trim(), optB.trim(), optC.trim(), optD.trim()],
      correctIndex: correctIdx,
      category,
      categoryName: catName,
      explanation: explanation.trim() || 'Đáp án chính xác theo kiến thức Địa lý.',
      difficulty,
    });

    onRefreshQuestions();
    showToast('Đã cập nhật câu hỏi thành công!');
    setTab('list');
  };

  // Confirm delete single question
  const handleConfirmDelete = () => {
    if (!deletingQuestion) return;
    deleteStoredQuestion(deletingQuestion.id);
    onRefreshQuestions();
    showToast(`Đã xóa câu hỏi: "${deletingQuestion.question.slice(0, 30)}..."`);
    setDeletingQuestion(null);
  };

  // Confirm reset all to default
  const handleConfirmReset = () => {
    resetQuestionsToDefault();
    onRefreshQuestions();
    showToast('Đã khôi phục ngân hàng câu hỏi gốc (60 câu chuẩn)!');
    setIsResetConfirmOpen(false);
  };

  return (
    <div
      id="question-manager-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative"
      >
        {/* Success Toast Notification */}
        <AnimatePresence>
          {successToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-950/40"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>{successToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white">
                  Quản Lý Câu Hỏi Môn Địa Lý
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {questions.length} câu
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Thêm câu hỏi mới, chỉnh sửa nội dung hoặc xóa câu hỏi trong trò chơi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
              <button
                id="tab-btn-list"
                type="button"
                onClick={() => setTab('list')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  tab === 'list' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Danh sách ({questions.length})
              </button>
              <button
                id="tab-btn-add"
                type="button"
                onClick={handleOpenAdd}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  tab === 'add' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm câu hỏi
              </button>
            </div>

            <button
              id="btn-reset-questions-prompt"
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
              title="Khôi phục ngân hàng câu hỏi gốc"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="btn-close-question-modal"
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="grow overflow-y-auto p-4 sm:p-6">
          {tab === 'list' ? (
            <div>
              {/* Search, Filter & Quick Action Bar */}
              <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
                <div className="relative grow">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-search-question"
                    type="text"
                    placeholder="Tìm theo nội dung câu hỏi, đáp án, lời giải thích..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  id="select-filter-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as QuestionCategory | 'all')}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-300 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <button
                  id="btn-quick-add"
                  type="button"
                  onClick={handleOpenAdd}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tạo mới</span>
                </button>
              </div>

              {/* Questions List Header */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5 px-1">
                <span>
                  Hiển thị <strong className="text-white">{filteredQuestions.length}</strong> / {questions.length} câu hỏi
                </span>
                {selectedCategory !== 'all' && (
                  <span className="text-amber-400 font-medium">
                    Chủ đề: {categories.find((c) => c.id === selectedCategory)?.label}
                  </span>
                )}
              </div>

              {/* Questions Cards */}
              <div className="space-y-3">
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-16 px-4 rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 text-slate-400">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="font-bold text-sm text-slate-300 mb-1">
                      Không tìm thấy câu hỏi phù hợp
                    </p>
                    <p className="text-xs text-slate-500 mb-4">
                      Hãy thử tìm với từ khóa khác hoặc thêm câu hỏi mới vào ngân hàng.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenAdd}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Thêm câu hỏi ngay
                    </button>
                  </div>
                ) : (
                  filteredQuestions.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-all group"
                    >
                      {/* Card Header: Category, Difficulty & Action Buttons (SỬA & XÓA) */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                            {q.categoryName}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                              q.difficulty === 'hard'
                                ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                                : q.difficulty === 'easy'
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                                : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                            }`}
                          >
                            {q.difficulty === 'hard' ? 'Khó' : q.difficulty === 'easy' ? 'Dễ' : 'Vừa'}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">#{idx + 1}</span>
                        </div>

                        {/* Action Buttons: SỬA & XÓA */}
                        <div className="flex items-center gap-1.5">
                          <button
                            id={`btn-edit-question-${q.id}`}
                            type="button"
                            onClick={() => handleOpenEdit(q)}
                            className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Sửa câu hỏi này"
                          >
                            <Pencil className="w-3.5 h-3.5 text-blue-400" />
                            <span>Sửa</span>
                          </button>

                          <button
                            id={`btn-delete-question-${q.id}`}
                            type="button"
                            onClick={() => setDeletingQuestion(q)}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Xóa câu hỏi này"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span>Xóa</span>
                          </button>
                        </div>
                      </div>

                      {/* Question Text */}
                      <h4 className="font-black text-sm sm:text-base text-white mb-3">
                        {q.question}
                      </h4>

                      {/* 4 Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-xs">
                        {q.options.map((opt, oIdx) => {
                          const isCorrect = oIdx === q.correctIndex;
                          return (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-xl flex items-center gap-2.5 ${
                                isCorrect
                                  ? 'bg-emerald-950/70 text-emerald-200 border border-emerald-500/50 font-bold'
                                  : 'bg-slate-900/60 text-slate-400 border border-slate-800/80'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-lg font-black flex items-center justify-center shrink-0 text-[10px] ${
                                  isCorrect
                                    ? 'bg-emerald-500 text-slate-950'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className="truncate">{opt}</span>
                              {isCorrect && (
                                <span className="ml-auto shrink-0 flex items-center gap-1 text-[11px] text-emerald-400 font-extrabold">
                                  <Check className="w-3.5 h-3.5" /> Đúng
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {q.explanation && (
                        <div className="text-[11px] sm:text-xs text-slate-300 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60 flex items-start gap-2">
                          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-amber-300/90 font-bold">Giải thích: </span>
                            {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* TAB THÊM HOẶC SỬA CÂU HỎI */
            <form onSubmit={tab === 'edit' ? handleEditSubmit : handleAddSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      tab === 'edit'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {tab === 'edit' ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                  <h4 className="font-black text-base text-white">
                    {tab === 'edit' ? 'Chỉnh Sửa Câu Hỏi' : 'Thêm Câu Hỏi Mới Vào Ngân Hàng'}
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() => setTab('list')}
                  className="px-3 py-1 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800/80 cursor-pointer"
                >
                  Quay lại danh sách
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Category & Difficulty Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Chủ đề môn Địa lý
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as QuestionCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="vietnam_nature">Địa lý Tự nhiên VN</option>
                    <option value="vietnam_economy">Kinh tế - Xã hội VN</option>
                    <option value="world_geo">Địa lý Thế giới</option>
                    <option value="climate_earth">Trái Đất & Bản đồ</option>
                    <option value="capitals_flags">Thủ đô & Quốc gia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Mức độ khó
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="easy">Dễ (Kiến thức cơ bản)</option>
                    <option value="medium">Vừa (Thông hiểu)</option>
                    <option value="hard">Khó (Vận dụng cao)</option>
                  </select>
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nội dung câu hỏi <span className="text-amber-400">*</span>
                </label>
                <textarea
                  id="input-question-text"
                  rows={3}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Ví dụ: Đỉnh núi cao nhất Việt Nam và Đông Dương là đỉnh nào?..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* 4 Options with Radio Correct Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    4 Phương án trả lời (Chọn nút tròn tại phương án đúng) <span className="text-amber-400">*</span>
                  </label>
                  <span className="text-[11px] text-emerald-400 font-bold">
                    Đáp án đúng: Phương án {String.fromCharCode(65 + correctIdx)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option A */}
                  <div
                    className={`p-2.5 rounded-xl border transition-colors ${
                      correctIdx === 0
                        ? 'bg-emerald-950/30 border-emerald-500/50'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                        <span className="w-4 h-4 rounded bg-slate-800 text-slate-200 text-[10px] flex items-center justify-center">A</span>
                        Phương án A
                      </span>
                      <label className="text-[11px] text-slate-300 flex items-center gap-1 cursor-pointer font-bold">
                        <input
                          type="radio"
                          name="correct-option"
                          checked={correctIdx === 0}
                          onChange={() => setCorrectIdx(0)}
                          className="accent-emerald-400"
                        />
                        <span className={correctIdx === 0 ? 'text-emerald-400' : 'text-slate-400'}>
                          Đáp án đúng
                        </span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={optA}
                      onChange={(e) => setOptA(e.target.value)}
                      placeholder="Nội dung đáp án A..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Option B */}
                  <div
                    className={`p-2.5 rounded-xl border transition-colors ${
                      correctIdx === 1
                        ? 'bg-emerald-950/30 border-emerald-500/50'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                        <span className="w-4 h-4 rounded bg-slate-800 text-slate-200 text-[10px] flex items-center justify-center">B</span>
                        Phương án B
                      </span>
                      <label className="text-[11px] text-slate-300 flex items-center gap-1 cursor-pointer font-bold">
                        <input
                          type="radio"
                          name="correct-option"
                          checked={correctIdx === 1}
                          onChange={() => setCorrectIdx(1)}
                          className="accent-emerald-400"
                        />
                        <span className={correctIdx === 1 ? 'text-emerald-400' : 'text-slate-400'}>
                          Đáp án đúng
                        </span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={optB}
                      onChange={(e) => setOptB(e.target.value)}
                      placeholder="Nội dung đáp án B..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Option C */}
                  <div
                    className={`p-2.5 rounded-xl border transition-colors ${
                      correctIdx === 2
                        ? 'bg-emerald-950/30 border-emerald-500/50'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                        <span className="w-4 h-4 rounded bg-slate-800 text-slate-200 text-[10px] flex items-center justify-center">C</span>
                        Phương án C
                      </span>
                      <label className="text-[11px] text-slate-300 flex items-center gap-1 cursor-pointer font-bold">
                        <input
                          type="radio"
                          name="correct-option"
                          checked={correctIdx === 2}
                          onChange={() => setCorrectIdx(2)}
                          className="accent-emerald-400"
                        />
                        <span className={correctIdx === 2 ? 'text-emerald-400' : 'text-slate-400'}>
                          Đáp án đúng
                        </span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={optC}
                      onChange={(e) => setOptC(e.target.value)}
                      placeholder="Nội dung đáp án C..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Option D */}
                  <div
                    className={`p-2.5 rounded-xl border transition-colors ${
                      correctIdx === 3
                        ? 'bg-emerald-950/30 border-emerald-500/50'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                        <span className="w-4 h-4 rounded bg-slate-800 text-slate-200 text-[10px] flex items-center justify-center">D</span>
                        Phương án D
                      </span>
                      <label className="text-[11px] text-slate-300 flex items-center gap-1 cursor-pointer font-bold">
                        <input
                          type="radio"
                          name="correct-option"
                          checked={correctIdx === 3}
                          onChange={() => setCorrectIdx(3)}
                          className="accent-emerald-400"
                        />
                        <span className={correctIdx === 3 ? 'text-emerald-400' : 'text-slate-400'}>
                          Đáp án đúng
                        </span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={optD}
                      onChange={(e) => setOptD(e.target.value)}
                      placeholder="Nội dung đáp án D..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Explanation Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Lời giải thích kiến thức (Hiện lên sau khi học sinh trả lời)
                </label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Ví dụ: Đỉnh Fansipan cao 3.143m thuộc dãy Hoàng Liên Sơn, là nóc nhà của Đông Dương..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  id="btn-submit-question-form"
                  type="submit"
                  className={`grow py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all ${
                    tab === 'edit'
                      ? 'bg-blue-500 hover:bg-blue-400 text-slate-950 shadow-blue-500/20'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>{tab === 'edit' ? 'Lưu Thay Đổi Câu Hỏi' : 'Lưu Câu Hỏi Mới Vào Kho'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTab('list')}
                  className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
              </div>
            </form>
          )}
        </div>

        {/* DIALOG XÁC NHẬN XÓA CÂU HỎI */}
        <AnimatePresence>
          {deletingQuestion && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md p-5 rounded-2xl bg-slate-900 border border-rose-500/40 shadow-2xl shadow-rose-950/40"
              >
                <div className="flex items-center gap-3 text-rose-400 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-white">Xác Nhận Xóa Câu Hỏi</h4>
                    <p className="text-xs text-rose-300/80">Hành động này sẽ xóa câu hỏi khỏi trò chơi</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 mb-4 line-clamp-3">
                  &ldquo;{deletingQuestion.question}&rdquo;
                </div>

                <div className="flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDeletingQuestion(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    id="btn-confirm-delete"
                    type="button"
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-500 cursor-pointer shadow-lg shadow-rose-600/30"
                  >
                    Xóa Vĩnh Viễn
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* DIALOG XÁC NHẬN KHÔI PHỤC MẶC ĐỊNH */}
        <AnimatePresence>
          {isResetConfirmOpen && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md p-5 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-2xl shadow-amber-950/40"
              >
                <div className="flex items-center gap-3 text-amber-400 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-white">Khôi Phục Ngân Hàng Gốc?</h4>
                    <p className="text-xs text-amber-300/80">Đặt lại 60 câu hỏi Địa lý chuẩn</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Ngân hàng sẽ được thiết lập lại về 60 câu hỏi mẫu tiêu chuẩn ban đầu. Mọi câu hỏi do bạn tạo thêm hoặc chỉnh sửa sẽ được đặt lại.
                </p>

                <div className="flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsResetConfirmOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    id="btn-confirm-reset"
                    type="button"
                    onClick={handleConfirmReset}
                    className="px-4 py-2 rounded-xl text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 cursor-pointer shadow-lg shadow-amber-400/30"
                  >
                    Xác Nhận Khôi Phục
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
