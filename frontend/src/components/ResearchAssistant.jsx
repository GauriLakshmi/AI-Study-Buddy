import React, { useState } from 'react';
import useResearch from '../hooks/useResearch';

export default function ResearchAssistant() {
  const {
    history,
    selectedResult,
    isLoading,
    pipelineStep,
    error,
    setSelectedResult,
    startResearch,
    deleteResult,
    selectResult,
  } = useResearch();

  const [topicInput, setTopicInput] = useState('');
  const [activeTab, setActiveTab] = useState('final'); // 'final', 'draft', 'notes'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topicInput || !topicInput.trim()) return;
    startResearch(topicInput);
    setTopicInput('');
    setActiveTab('final');
  };

  const handleSelectHistory = (id) => {
    selectResult(id);
    setActiveTab('final');
  };

  const handleStartNew = () => {
    setSelectedResult(null);
    setTopicInput('');
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stepsInfo = [
    { id: 'researching', label: 'Researching Topic', desc: 'Searching the web and synthesizing academic sources...' },
    { id: 'drafting', label: 'Drafting Guide', desc: 'Generating a structured, comprehensive study guide...' },
    { id: 'reviewing', label: 'Reviewing & Refining', desc: 'Analyzing guide quality, applying peer reviewer critique, and polishing draft...' }
  ];

  return (
    <div className="flex flex-col md:flex-row flex-1 min-h-[calc(100vh-64px)] w-full">
      {/* Styles for the shimmering progress bar */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, #c0c1ff 0%, #7c87f3 50%, #c0c1ff 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>

      {/* Left Sidebar - History list */}
      <aside className="w-full md:w-80 bg-surface-container-low border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background font-semibold">Research Hub</h3>
          <span className="material-symbols-outlined text-primary text-2xl">history</span>
        </div>

        <button
          onClick={handleStartNew}
          className="w-full py-3 px-4 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all font-label-md text-label-md flex items-center justify-center space-x-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>New Research Guide</span>
        </button>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {history.length === 0 ? (
            <p className="text-on-surface-variant/50 text-sm italic text-center py-8">No previous research guides.</p>
          ) : (
            history.map((item) => {
              const isSelected = selectedResult && selectedResult._id === item._id;
              return (
                <div
                  key={item._id}
                  onClick={() => handleSelectHistory(item._id)}
                  className={`group relative w-full flex items-center justify-between p-4 rounded-lg transition-all border cursor-pointer hover:bg-white/5 ${
                    isSelected
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-surface-container border-white/5 text-on-surface-variant'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-label-md text-label-md truncate text-on-background font-medium">
                      {item.topic}
                    </p>
                    <p className="text-xs text-on-surface-variant/70 mt-1">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteResult(item._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-on-surface-variant/50 hover:text-error transition-all p-1 rounded hover:bg-white/5 cursor-pointer"
                    title="Delete research guide"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Right Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto flex flex-col justify-start relative">
        {/* Glow background ornament */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

        <div className="relative z-10 max-w-4xl w-full mx-auto flex-1 flex flex-col">
          
          {/* Active Error Notice */}
          {error && (
            <div className="mb-8 p-4 rounded-lg bg-error-container/20 border border-error-container text-error flex items-start space-x-3">
              <span className="material-symbols-outlined mt-0.5">error</span>
              <div className="flex-1 text-sm font-body-md">{error}</div>
            </div>
          )}

          {/* LOADING STATE - Shimmer and Pipeline progression */}
          {isLoading && pipelineStep !== 'idle' ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 max-w-2xl mx-auto w-full">
              <div className="text-center mb-8 space-y-2">
                <span className="material-symbols-outlined text-primary text-5xl animate-pulse">psychology</span>
                <h2 className="font-headline-lg text-headline-lg text-on-background">AI Research Agents Active</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  We are orchestrating multiple AI agents to research, synthesize, and review your topic.
                </p>
              </div>

              {/* Shimmering Progress Bar */}
              <div className="w-full space-y-8 glass-level-2 glass-card-border rounded-xl p-8 bg-surface-container-low/50 shadow-xl border border-white/5">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-label-sm text-on-surface-variant">
                    <span>PIPELINE PROGRESS</span>
                    <span className="uppercase text-primary font-bold">
                      {pipelineStep === 'researching' ? 'Stage 1 of 3' :
                       pipelineStep === 'drafting' ? 'Stage 2 of 3' :
                       pipelineStep === 'reviewing' ? 'Stage 3 of 3' : 'Finalizing...'}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div
                      className="h-full animate-shimmer rounded-full transition-all duration-700"
                      style={{
                        width:
                          pipelineStep === 'researching' ? '35%' :
                          pipelineStep === 'drafting' ? '70%' :
                          pipelineStep === 'reviewing' ? '92%' : '100%',
                      }}
                    />
                  </div>
                </div>

                {/* Stages List */}
                <div className="space-y-4">
                  {stepsInfo.map((step, idx) => {
                    const isCompleted =
                      (pipelineStep === 'drafting' && idx === 0) ||
                      (pipelineStep === 'reviewing' && idx <= 1) ||
                      pipelineStep === 'completed';
                    const isActive = pipelineStep === step.id;
                    const isPending = !isCompleted && !isActive;

                    return (
                      <div
                        key={step.id}
                        className={`flex items-start space-x-4 p-3 rounded-lg transition-colors ${
                          isActive ? 'bg-primary/5 border border-primary/10' : 'border border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-center mt-1">
                          {isCompleted ? (
                            <span className="material-symbols-outlined text-primary text-xl font-bold">check_circle</span>
                          ) : isActive ? (
                            <span className="material-symbols-outlined text-primary text-xl animate-spin">sync</span>
                          ) : (
                            <span className="material-symbols-outlined text-on-surface-variant/30 text-xl">circle</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4
                            className={`font-label-md text-label-md font-semibold ${
                              isActive ? 'text-primary' : isCompleted ? 'text-on-background' : 'text-on-surface-variant/40'
                            }`}
                          >
                            {step.label}
                          </h4>
                          <p
                            className={`text-xs mt-1 ${
                              isActive ? 'text-on-surface' : isCompleted ? 'text-on-surface-variant' : 'text-on-surface-variant/30'
                            }`}
                          >
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : selectedResult ? (
            /* RESULTS VIEW */
            <div className="flex-grow flex flex-col space-y-6">
              
              {/* Result Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="material-symbols-outlined text-primary">auto_awesome</span>
                    <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest">
                      AI Generated Research
                    </span>
                  </div>
                  <h2 className="font-headline-xl text-headline-xl text-on-background mt-2 tracking-tight">
                    {selectedResult.topic}
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Generated on {formatDate(selectedResult.createdAt)}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleStartNew}
                    className="py-2 px-4 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-background transition-all font-label-md text-label-md border border-white/15 flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">edit_note</span>
                    <span>New Topic</span>
                  </button>
                  <button
                    onClick={() => deleteResult(selectedResult._id)}
                    className="py-2 px-3 rounded-lg bg-error-container/10 hover:bg-error-container/20 text-error transition-all border border-error-container/20 flex items-center justify-center cursor-pointer"
                    title="Delete Study Guide"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>

              {/* Tabbed Navigation */}
              {selectedResult.isHistorical ? (
                // Historical records only have the final study guide saved
                <div className="flex-1 flex flex-col">
                  <div className="flex border-b border-white/5 mb-6">
                    <button className="py-3 px-6 text-primary border-b-2 border-primary font-label-md text-label-md font-bold flex items-center space-x-1.5">
                      <span className="material-symbols-outlined text-sm">school</span>
                      <span>Study Guide</span>
                    </button>
                    <button 
                      disabled
                      className="py-3 px-6 text-on-surface-variant/30 font-label-md text-label-md cursor-not-allowed flex items-center space-x-1.5"
                      title="Intermediate pipeline steps are only available for newly generated items."
                    >
                      <span>Draft</span>
                    </button>
                    <button 
                      disabled
                      className="py-3 px-6 text-on-surface-variant/30 font-label-md text-label-md cursor-not-allowed flex items-center space-x-1.5"
                      title="Intermediate pipeline steps are only available for newly generated items."
                    >
                      <span>Research Notes</span>
                    </button>
                  </div>
                  <div className="glass-level-2 glass-card-border rounded-xl p-8 md:p-12 bg-surface-container-low/70 border border-white/5 shadow-2xl overflow-y-auto">
                    <MarkdownRenderer content={selectedResult.content} />
                  </div>
                </div>
              ) : (
                // Newly generated results show full pipeline tabs
                <div className="flex-1 flex flex-col">
                  <div className="flex border-b border-white/5 mb-6 overflow-x-auto">
                    <button
                      onClick={() => setActiveTab('final')}
                      className={`py-3 px-6 border-b-2 font-label-md text-label-md font-bold flex items-center space-x-1.5 transition-all whitespace-nowrap cursor-pointer ${
                        activeTab === 'final'
                          ? 'text-primary border-primary bg-primary/5'
                          : 'text-on-surface-variant border-transparent hover:text-on-background'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">school</span>
                      <span>Study Guide</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('draft')}
                      className={`py-3 px-6 border-b-2 font-label-md text-label-md font-bold flex items-center space-x-1.5 transition-all whitespace-nowrap cursor-pointer ${
                        activeTab === 'draft'
                          ? 'text-primary border-primary bg-primary/5'
                          : 'text-on-surface-variant border-transparent hover:text-on-background'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">rate_review</span>
                      <span>Initial Draft</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('notes')}
                      className={`py-3 px-6 border-b-2 font-label-md text-label-md font-bold flex items-center space-x-1.5 transition-all whitespace-nowrap cursor-pointer ${
                        activeTab === 'notes'
                          ? 'text-primary border-primary bg-primary/5'
                          : 'text-on-surface-variant border-transparent hover:text-on-background'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">description</span>
                      <span>Research Notes</span>
                    </button>
                  </div>

                  <div className="glass-level-2 glass-card-border rounded-xl p-8 md:p-12 bg-surface-container-low/70 border border-white/5 shadow-2xl overflow-y-auto">
                    {activeTab === 'final' && <MarkdownRenderer content={selectedResult.reviewResult} />}
                    {activeTab === 'draft' && <MarkdownRenderer content={selectedResult.draft} />}
                    {activeTab === 'notes' && <MarkdownRenderer content={selectedResult.researchNotes} />}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* EMPTY INITIAL FORM */
            <div className="flex-grow flex flex-col items-center justify-center py-12 max-w-2xl mx-auto w-full">
              <div className="text-center space-y-4 mb-10">
                <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-2 shadow-inner border border-primary/5">
                  <span className="material-symbols-outlined text-4xl">psychology</span>
                </div>
                <h1 className="font-headline-xl text-headline-xl text-on-background tracking-tight">
                  Start AI Research Assistant
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Input any academic topic. Our multi-agent system will crawl research databases, write a detailed study guide, review it against strict pedagogical criteria, and refine the final output.
                </p>
              </div>

              {/* Research Form Card */}
              <div className="w-full glass-level-2 glass-card-border rounded-xl p-8 bg-surface-container-low/50 shadow-xl border border-white/5">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="topic" className="block text-sm font-semibold text-on-background">
                      Research Topic
                    </label>
                    <div className="relative">
                      <input
                        id="topic"
                        type="text"
                        value={topicInput}
                        onChange={(e) => setTopicInput(e.target.value)}
                        placeholder="e.g., Quantum Computing Cryptography, Photosynthesis Cycle..."
                        className="w-full pl-4 pr-12 py-3.5 rounded-lg bg-surface-container-lowest border border-white/10 text-on-background placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-body-md shadow-inner"
                      />
                      <button
                        type="submit"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-tertiary-container transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined">send</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold transition-all shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Execute Research Pipeline</span>
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  </button>
                </form>
              </div>

              {/* Sample suggestion chips */}
              <div className="mt-8 text-center space-y-3">
                <p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest">
                  Suggested Research Topics
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-md">
                  {[
                    'Deep Learning Transformers',
                    'Mitosis vs. Meiosis Stages',
                    'Behavioral Economics Bias',
                    'Roman Empire Collapse'
                  ].map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setTopicInput(topic)}
                      className="py-1.5 px-3 rounded-full bg-primary/5 border border-primary/10 text-xs font-semibold text-primary hover:bg-primary/10 transition-all cursor-pointer"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* Custom Markdown Renderer to render outputs beautifully in CSS styling */
function MarkdownRenderer({ content }) {
  if (!content) return null;

  // Split by double newlines for paragraph structures
  const paragraphs = content.split('\n\n');

  return (
    <div className="space-y-6 text-on-surface-variant font-body-md text-body-md leading-relaxed">
      {paragraphs.map((p, pIdx) => {
        const trimmed = p.trim();
        if (!trimmed) return null;

        // Code block
        if (trimmed.startsWith('```')) {
          const lines = trimmed.split('\n');
          const code = lines.slice(1, lines.length - (lines[lines.length - 1] === '```' ? 1 : 0)).join('\n');
          return (
            <pre
              key={pIdx}
              className="bg-surface-container-lowest border border-white/5 rounded-lg p-4 font-mono text-sm overflow-x-auto my-4 text-primary-fixed-dim shadow-inner"
            >
              <code>{code}</code>
            </pre>
          );
        }

        // Headers
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={pIdx} className="font-headline-xl text-3xl text-on-background mt-8 mb-4 border-b border-white/10 pb-2 flex items-center space-x-2">
              <span className="material-symbols-outlined text-primary text-2xl">auto_awesome</span>
              <span>{trimmed.substring(2)}</span>
            </h1>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={pIdx} className="font-headline-lg text-2xl text-on-background mt-6 mb-3">
              {trimmed.substring(3)}
            </h2>
          );
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={pIdx} className="font-headline-lg-mobile text-xl text-on-background mt-4 mb-2">
              {trimmed.substring(4)}
            </h3>
          );
        }

        // Bullet lists
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.match(/^\d+\.\s/)) {
          const lines = trimmed.split('\n');
          return (
            <ul key={pIdx} className="list-disc pl-6 space-y-2 my-4">
              {lines.map((line, lIdx) => {
                const cleanLine = line.replace(/^[\*\-\s\d+\.]+/, '').trim();
                return (
                  <li
                    key={lIdx}
                    dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(cleanLine) }}
                  />
                );
              })}
            </ul>
          );
        }

        // Standard paragraph
        return (
          <p
            key={pIdx}
            className="leading-relaxed text-on-surface"
            dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(trimmed) }}
          />
        );
      })}
    </div>
  );
}

function parseInlineMarkdown(text) {
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="font-mono bg-white/5 px-1.5 py-0.5 rounded text-sm text-primary-fixed-dim">$1</code>');
  return html;
}
