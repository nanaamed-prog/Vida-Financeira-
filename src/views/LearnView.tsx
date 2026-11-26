import React, { useState } from 'react';
import {
  GraduationCap,
  Flame,
  Users,
  CheckCircle2,
  Lock,
  Play,
  Award,
  ChevronRight,
  BookOpen,
  Sparkles,
  HelpCircle,
  PiggyBank,
  Smile,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { ACADEMY_TRACKS, KIDS_ACTIVITIES } from '../data/initialData';
import { AcademyLesson, AcademyTrack } from '../types';

interface LearnViewProps {
  onOpenPremium: () => void;
}

export const LearnView: React.FC<LearnViewProps> = ({ onOpenPremium }) => {
  const {
    isPremium,
    completedLessonIds,
    completeLesson,
    challenge365,
    toggleChallengeDay,
    completedChallengeDays,
    triggerCelebration,
  } = useFinancial();

  const [activeTab, setActiveTab] = useState<'trilhas' | 'desafio' | 'familia'>('trilhas');
  const [selectedTrack, setSelectedTrack] = useState<AcademyTrack>(ACADEMY_TRACKS[0]);
  const [selectedLesson, setSelectedLesson] = useState<AcademyLesson | null>(null);

  // Micro-quiz state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handleOpenLesson = (lesson: AcademyLesson, track: AcademyTrack) => {
    if (track.isPremiumOnly && !isPremium) {
      onOpenPremium();
      return;
    }
    setSelectedLesson(lesson);
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setIsCorrect(false);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !selectedLesson) return;
    const correct = selectedAnswer === selectedLesson.quiz.correctIndex;
    setIsCorrect(correct);
    setQuizSubmitted(true);

    if (correct && !completedLessonIds.includes(selectedLesson.id)) {
      completeLesson(selectedLesson.id, selectedLesson.xpReward);
      triggerCelebration();
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Academia Financeira & Desafios</h1>
          <p className="text-xs text-slate-400">8 Trilhas estruturadas, micro-aulas práticas, Desafio 365 Dias e Modo Família</p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center space-x-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            onClick={() => setActiveTab('trilhas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'trilhas' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>8 Trilhas</span>
          </button>
          <button
            onClick={() => setActiveTab('desafio')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'desafio' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>365 Dias</span>
          </button>
          <button
            onClick={() => setActiveTab('familia')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'familia' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Família & Crianças</span>
          </button>
        </div>
      </div>

      {/* 1. TRILHAS DA ACADEMIA */}
      {activeTab === 'trilhas' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Tracks Horizontal Carousel / List */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {ACADEMY_TRACKS.map((track, i) => {
              const isSelected = selectedTrack.id === track.id;
              const isLocked = track.isPremiumOnly && !isPremium;
              const trackCompletedLessons = track.lessons.filter((l) =>
                completedLessonIds.includes(l.id)
              ).length;
              const trackPct = Math.round((trackCompletedLessons / track.lessons.length) * 100);

              return (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrack(track)}
                  className={`p-3 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-950/40'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isLocked && (
                    <div className="absolute top-2 right-2 text-amber-400">
                      <Lock className="w-3 h-3" />
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Trilha {i + 1}</span>
                    <h3 className="font-extrabold text-xs text-white line-clamp-2 mt-0.5">{track.title}</h3>
                  </div>

                  <div className="mt-3">
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mb-1">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${trackPct}%` }}></div>
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold">{trackCompletedLessons}/{track.lessons.length} aulas</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Track Detail & Lesson List */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Trilha Selecionada</span>
                <h2 className="text-xl font-black text-white">{selectedTrack.title}</h2>
                <p className="text-xs text-slate-300 mt-0.5">{selectedTrack.shortDescription || selectedTrack.description}</p>
              </div>

              {selectedTrack.isPremiumOnly && !isPremium && (
                <button
                  onClick={onOpenPremium}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center space-x-1 self-start"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Desbloquear Trilha Premium</span>
                </button>
              )}
            </div>

            {/* Lessons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedTrack.lessons.map((lesson, idx) => {
                const isCompleted = completedLessonIds.includes(lesson.id);
                const isLocked = selectedTrack.isPremiumOnly && !isPremium;

                return (
                  <div
                    key={lesson.id}
                    className={`p-5 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
                      isCompleted
                        ? 'bg-slate-900 border-emerald-500/40'
                        : 'bg-slate-800/80 border-slate-700 hover:border-indigo-500/60'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold">Aula {idx + 1} • {lesson.durationMinutes} min</span>
                        <span className="font-bold text-amber-400">+{lesson.xpReward} XP</span>
                      </div>
                      <h4 className="font-bold text-sm text-white">{lesson.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{lesson.summary}</p>
                    </div>

                    <button
                      onClick={() => handleOpenLesson(lesson, selectedTrack)}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : isLocked
                          ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Concluída (Revisar)</span>
                        </>
                      ) : isLocked ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Bloqueada (Premium)</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Iniciar Aula</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. DESAFIO DOS 365 DIAS */}
      {activeTab === 'desafio' && (
        <div className="space-y-6 animate-in fade-in">
          <section className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-amber-400">
                  <Flame className="w-5 h-5 fill-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Jornada de Transformação Diária</span>
                </div>
                <h2 className="text-2xl font-black text-white">Desafio dos 365 Dias</h2>
                <p className="text-xs text-slate-300">
                  1 mini-tarefa prática por dia para reprogramar sua mente financeira e acumular riqueza.
                </p>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-center min-w-[160px]">
                <span className="text-[11px] text-slate-400 font-medium">Dias Concluídos:</span>
                <div className="text-2xl font-black text-amber-400">
                  {completedChallengeDays.length} / 365
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(3, (completedChallengeDays.length / 365) * 100)}%` }}
                ></div>
              </div>
            </div>
          </section>

          {/* Daily challenges grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenge365.map((ch) => {
              const isDone = completedChallengeDays.includes(ch.day);

              return (
                <div
                  key={ch.day}
                  className={`p-5 rounded-2xl border transition space-y-3 ${
                    isDone ? 'bg-slate-900 border-emerald-500/40' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 font-extrabold text-xs border border-amber-500/20">
                        Dia {ch.day}
                      </span>
                      <h4 className="font-bold text-sm text-white">{ch.title}</h4>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">+{ch.xp} XP</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{ch.action}</p>

                  <div className="p-3 bg-slate-800/80 rounded-xl text-[11px] text-amber-300 font-medium">
                    💡 {ch.tip}
                  </div>

                  <button
                    onClick={() => toggleChallengeDay(ch.day, ch.xp)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isDone ? 'Concluído com Sucesso!' : 'Marcar Dia como Concluído (+XP)'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. MODO FAMÍLIA & CRIANÇAS */}
      {activeTab === 'familia' && (
        <div className="space-y-6 animate-in fade-in">
          <section className="p-6 rounded-3xl bg-gradient-to-br from-pink-950/40 via-slate-900 to-slate-900 border border-pink-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-pink-400">
                  <Smile className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Educação Financeira Infantil</span>
                </div>
                <h2 className="text-2xl font-black text-white">Pequenos Poupadores & Modo Família</h2>
                <p className="text-xs text-slate-300">
                  Ensine seus filhos a lidar com mesada, valorizar o trabalho, esperar e investir para o futuro.
                </p>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 min-w-[200px] text-center">
                <span className="text-xs text-slate-400 font-semibold">Cofrinho dos Filhos</span>
                <div className="text-xl font-extrabold text-pink-400 mt-0.5">R$ 145,00 guardados</div>
              </div>
            </div>
          </section>

          {/* Kids Activities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {KIDS_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 hover:border-pink-500/40 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{act.icon}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-pink-300 border border-slate-700">
                    Idade: {act.ageGroup}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-white">{act.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{act.description}</p>
                </div>

                <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20 text-xs text-pink-300 font-semibold flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recompensa: {act.reward}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LESSON READER MODAL */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  {selectedTrack.title}
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">{selectedLesson.title}</h3>
              </div>
              <button
                onClick={() => setSelectedLesson(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Lesson Content */}
            <div className="p-6 space-y-6">
              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedLesson.contentMarkdown}
              </div>

              {/* Key Takeaways */}
              <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pontos Principais para Guardar:</span>
                </span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  {selectedLesson.keyTakeaways.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>

              {/* Micro-Quiz */}
              <div className="p-5 bg-slate-800/90 border border-slate-700 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <HelpCircle className="w-4 h-4" />
                    <span>Micro-Quiz de Validação (+{selectedLesson.xpReward} XP)</span>
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{selectedLesson.quiz.question}</h4>

                <div className="space-y-2">
                  {selectedLesson.quiz.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => !quizSubmitted && setSelectedAnswer(idx)}
                      className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition ${
                        selectedAnswer === idx
                          ? 'bg-indigo-600/30 border-indigo-400 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {quizSubmitted && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs font-medium ${
                      isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    {isCorrect ? '✅ Resposta Correta! ' : '❌ Quase lá! '}
                    {selectedLesson.quiz.explanation}
                  </div>
                )}

                <div className="pt-2">
                  {!quizSubmitted ? (
                    <button
                      onClick={handleAnswerSubmit}
                      disabled={selectedAnswer === null}
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs transition"
                    >
                      Verificar Resposta
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedLesson(null)}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition"
                    >
                      Concluir & Voltar para a Trilha
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
