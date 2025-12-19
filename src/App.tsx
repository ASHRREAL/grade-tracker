import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useMemo, useState } from "react";
import type { Assessment, Course } from "./lib/grade";
import { currentTotal, overallGpa, requiredFinal, weightsSum } from "./lib/grade";
import { 
  loadSemesters, 
  saveSemesters, 
  getActiveSemesterId, 
  setActiveSemesterId,
  type Semester 
} from "./lib/store";
import {
  parseOutlineWithGroq,
  convertParsedToCourse,
  getStoredApiKey,
  setStoredApiKey,
  type ParsedCourse,
} from "./lib/ai-parser";

function uid() {
  return crypto.randomUUID();
}

function parseNumber(raw: string): number {
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (items.length <= 1 || fromIndex === toIndex) return items;
  const next = items.slice();
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

const starter: Course[] = [
  {
    id: uid(),
    name: "CIS*2520 – Data Structures",
    credits: 0.5,
    target: 80,
    assessments: [
      { id: uid(), name: "Zybook", category: "Other", weight: 10, score: 100 },
      { id: uid(), name: "A1", category: "Assignment", weight: 2, score: 100 },
      { id: uid(), name: "Midterm", category: "Midterm", weight: 20, score: 77.5 },
      { id: uid(), name: "Final", category: "Final", weight: 30, isFinal: true },
    ],
  },
];

function getContribution(a: Assessment): string {
  if (a.score === undefined || a.score === null) return "—";
  return ((a.weight / 100) * a.score).toFixed(2);
}

export default function App() {
  const [semesters, setSemesters] = useState<Semester[]>(() => {
    const loaded = loadSemesters();
    if (loaded.length) return loaded;
    // Create default semester with starter courses
    const defaultSemester: Semester = {
      id: uid(),
      name: "Sem 1",
      courses: starter,
    };
    saveSemesters([defaultSemester]);
    setActiveSemesterId(defaultSemester.id);
    return [defaultSemester];
  });

  const [activeSemesterId, setActiveSemesterIdState] = useState<string>(() => {
    const stored = getActiveSemesterId();
    return stored ?? semesters[0]?.id ?? "";
  });

  const activeSemester = semesters.find(s => s.id === activeSemesterId) ?? semesters[0];
  const courses = activeSemester?.courses ?? [];

  const [activeId, setActiveId] = useState<string>(() => courses[0]?.id ?? "");
  const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [editingSemesterName, setEditingSemesterName] = useState(false);
  
  // AI Import state
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiApiKey, setAiApiKey] = useState(() => getStoredApiKey() ?? "");
  const [aiOutlineText, setAiOutlineText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiParsedCourses, setAiParsedCourses] = useState<ParsedCourse[] | null>(null);

  // Sync active semester ID to localStorage
  useEffect(() => {
    if (activeSemesterId) {
      setActiveSemesterId(activeSemesterId);
    }
  }, [activeSemesterId]);

  // Reset active course when semester changes
  useEffect(() => {
    if (courses.length) {
      const exists = courses.some(c => c.id === activeId);
      if (!exists) setActiveId(courses[0].id);
    } else {
      setActiveId("");
    }
  }, [activeSemesterId, courses, activeId]);

  const active = courses.find(c => c.id === activeId) ?? courses[0];
  const gpa = useMemo(() => overallGpa(courses), [courses]);
  const totalCredits = useMemo(
    () => courses.reduce((s, c) => s + (Number.isFinite(c.credits) ? c.credits : 0), 0),
    [courses],
  );
  const avgGrade = useMemo(() => {
    if (!courses.length) return null;
    const totals = courses.map(c => currentTotal(c));
    return totals.reduce((sum, t) => sum + t, 0) / totals.length;
  }, [courses]);

  function commitSemesters(next: Semester[]) {
    setSemesters(next);
    saveSemesters(next);
  }

  function commitCourses(nextCourses: Course[]) {
    const nextSemesters = semesters.map(s =>
      s.id === activeSemesterId ? { ...s, courses: nextCourses } : s
    );
    commitSemesters(nextSemesters);
  }

  function addSemester() {
    const semNum = semesters.length + 1;
    const s: Semester = {
      id: uid(),
      name: `Sem ${semNum}`,
      courses: [],
    };
    const next = [s, ...semesters];
    commitSemesters(next);
    setActiveSemesterIdState(s.id);
  }

  function deleteSemester(semesterId: string) {
    const semester = semesters.find(s => s.id === semesterId);
    setConfirmModal({
      message: `Delete "${semester?.name ?? "this semester"}" and all its courses? This cannot be undone.`,
      onConfirm: () => {
        const next = semesters.filter(s => s.id !== semesterId);
        commitSemesters(next);
        if (activeSemesterId === semesterId && next.length) {
          setActiveSemesterIdState(next[0].id);
        }
        setConfirmModal(null);
      },
    });
  }

  function renameSemester(name: string) {
    const next = semesters.map(s =>
      s.id === activeSemesterId ? { ...s, name } : s
    );
    commitSemesters(next);
  }

  function addCourse() {
    const c: Course = {
      id: uid(),
      name: "New Course",
      credits: 0.5,
      target: 85,
      assessments: [],
    };
    const next = [c, ...courses];
    commitCourses(next);
    setActiveId(c.id);
  }

  function deleteCourse(courseId: string) {
    const course = courses.find(c => c.id === courseId);
    setConfirmModal({
      message: `Delete "${course?.name ?? "this course"}"? This cannot be undone.`,
      onConfirm: () => {
        const next = courses.filter(c => c.id !== courseId);
        commitCourses(next);
        setConfirmModal(null);
      },
    });
  }

  // Reorder handlers for courses
  function moveCourseUp(idx: number) {
    if (idx <= 0) return;
    const reordered = moveItem(courses, idx, idx - 1);
    commitCourses(reordered);
  }

  function moveCourseDown(idx: number) {
    if (idx >= courses.length - 1) return;
    const reordered = moveItem(courses, idx, idx + 1);
    commitCourses(reordered);
  }

  // Reorder handlers for assessments
  function moveAssessmentUp(idx: number) {
    if (!active || idx <= 0) return;
    const reordered = moveItem(active.assessments, idx, idx - 1);
    const nextCourses = courses.map(c => (c.id === active.id ? { ...c, assessments: reordered } : c));
    commitCourses(nextCourses);
  }

  function moveAssessmentDown(idx: number) {
    if (!active || idx >= active.assessments.length - 1) return;
    const reordered = moveItem(active.assessments, idx, idx + 1);
    const nextCourses = courses.map(c => (c.id === active.id ? { ...c, assessments: reordered } : c));
    commitCourses(nextCourses);
  }

  function updateActive(patch: Partial<Course>) {
    if (!active) return;
    const next = courses.map(c => (c.id === active.id ? { ...c, ...patch } : c));
    commitCourses(next);
  }

  function addAssessment(isFinal: boolean) {
    if (!active) return;
    const a: Assessment = {
      id: uid(),
      name: isFinal ? "Final" : "New Item",
      category: isFinal ? "Final" : "Other",
      weight: 0,
      isFinal,
    };
    const next = courses.map(c =>
      c.id === active.id ? { ...c, assessments: [...c.assessments, a] } : c,
    );
    commitCourses(next);
  }

  function updateAssessment(assessmentId: string, patch: Partial<Assessment>) {
    if (!active) return;
    const next = courses.map(c => {
      if (c.id !== active.id) return c;
      return {
        ...c,
        assessments: c.assessments.map(a => (a.id === assessmentId ? { ...a, ...patch } : a)),
      };
    });
    commitCourses(next);
  }

  function removeAssessment(assessmentId: string) {
    if (!active) return;
    const next = courses.map(c => {
      if (c.id !== active.id) return c;
      return { ...c, assessments: c.assessments.filter(a => a.id !== assessmentId) };
    });
    commitCourses(next);
  }

  const cur = active ? currentTotal(active) : 0;
  const req = active ? requiredFinal(active) : null;
  const wsum = active ? weightsSum(active) : 0;
  const wWarn = active ? Math.abs(wsum - 100) > 0.01 : false;

  // AI Import functions
  async function handleAiParse() {
    console.log("handleAiParse called, text length:", aiOutlineText.length, "apiKey:", aiApiKey ? "set" : "empty");
    if (!aiApiKey.trim() || !aiOutlineText.trim()) {
      console.log("Aborting: missing apiKey or text");
      return;
    }
    
    setAiLoading(true);
    setAiError(null);
    setStoredApiKey(aiApiKey.trim());
    
    try {
      const parsed = await parseOutlineWithGroq(aiOutlineText.trim(), aiApiKey.trim());
      console.log("Parsed courses:", parsed);
      setAiParsedCourses(parsed);
    } catch (e) {
      console.error("Parse error:", e);
      setAiError(e instanceof Error ? e.message : "Failed to parse outline");
    } finally {
      setAiLoading(false);
    }
  }

  function handleAiImport() {
    if (!aiParsedCourses) return;
    
    const newCourses = aiParsedCourses.map(p => convertParsedToCourse(p, 0));
    commitCourses([...newCourses, ...courses]);
    if (newCourses.length > 0) {
      setActiveId(newCourses[0].id);
    }
    
    // Reset modal
    setShowAiModal(false);
    setAiOutlineText("");
    setAiParsedCourses(null);
  }

  function switchScheme(schemeIndex: number) {
    if (!active || !active.gradingSchemes) return;
    const scheme = active.gradingSchemes[schemeIndex];
    if (!scheme) return;
    
    // Preserve scores from current assessments where possible
    const currentScores = new Map(
      active.assessments.map(a => [a.name.toLowerCase(), a.score])
    );
    
    const newAssessments = scheme.assessments.map(a => ({
      ...a,
      id: uid(),
      score: currentScores.get(a.name.toLowerCase()),
    }));
    
    updateActive({
      assessments: newAssessments,
      activeSchemeIndex: schemeIndex,
    });
  }

  return (
    <div className="gt-shell">
      {/* Confirm Modal */}
      {confirmModal && (
        <div className="gt-modalOverlay" onClick={() => setConfirmModal(null)}>
          <div className="gt-modal" onClick={e => e.stopPropagation()}>
            <div className="gt-modalTitle">Confirm</div>
            <div className="gt-modalBody">{confirmModal.message}</div>
            <div className="gt-modalActions">
              <button className="gt-btn" onClick={() => setConfirmModal(null)}>
                Cancel
              </button>
              <button className="gt-btn gt-btnDanger" onClick={confirmModal.onConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Import Modal */}
      {showAiModal && (
        <div className="gt-modalOverlay" onClick={() => setShowAiModal(false)}>
          <div className="gt-modal gt-modalWide" onClick={e => e.stopPropagation()}>
            <div className="gt-modalTitle">🤖 AI Course Import</div>
            <div className="gt-modalBody">
              {!aiParsedCourses ? (
                <>
                  <label className="gt-field" style={{ marginBottom: 12 }}>
                    Groq API Key
                    <input
                      className="gt-input"
                      type="password"
                      value={aiApiKey}
                      onChange={e => setAiApiKey(e.target.value)}
                      placeholder="gsk_..."
                    />
                    <span className="gt-fieldHint">
                      Get your free API key at <a href="https://console.groq.com/keys" target="_blank" rel="noopener">console.groq.com/keys</a>
                    </span>
                  </label>
                  
                  <label className="gt-field" style={{ marginBottom: 12 }}>
                    Course Outline(s)
                    <textarea
                      className="gt-textarea"
                      value={aiOutlineText}
                      onChange={e => setAiOutlineText(e.target.value)}
                      placeholder="Paste course outline text here (supports multiple courses)..."
                      rows={12}
                     />
                    <span className="gt-fieldHint">
                      Supports multiple courses at once. Copy from PDF viewer with Ctrl+A, Ctrl+C.
                    </span>
                  </label>
                  
                  {aiError && <div className="gt-error">{aiError}</div>}
                </>
              ) : (
                <div className="gt-parsedPreview">
                  <div style={{ marginBottom: 12, fontWeight: 600 }}>
                    Found {aiParsedCourses.length} course(s):
                  </div>
                  {aiParsedCourses.map((c, i) => (
                    <div key={i} className="gt-parsedCourse">
                      <div className="gt-parsedCourseName">{c.name}</div>
                      <div className="gt-parsedCourseMeta">
                        {c.credits} credits · {c.schemes.length} grading scheme(s)
                      </div>
                      {c.schemes.map((s: { name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; assessments: any[]; }, si: Key | null | undefined) => (
                        <div key={si} className="gt-parsedScheme">
                          <div className="gt-parsedSchemeName">{s.name}</div>
                          <div className="gt-parsedAssessments">
                            {s.assessments.map((a, ai) => (
                              <span key={ai} className="gt-parsedAssessment">
                                {a.name} ({a.weight}%)
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="gt-modalActions">
              <button className="gt-btn" onClick={() => {
                setShowAiModal(false);
                setAiParsedCourses(null);
                setAiOutlineText("");
                setAiError(null);
              }}>
                Cancel
              </button>
              {!aiParsedCourses ? (
                <button 
                  className="gt-btn gt-btnPrimary" 
                  onClick={handleAiParse}
                  disabled={aiLoading || !aiApiKey.trim() || !aiOutlineText.trim()}
                >
                  {aiLoading ? "Parsing..." : "Parse Outline"}
                </button>
              ) : (
                <>
                  <button className="gt-btn" onClick={() => setAiParsedCourses(null)}>
                    ← Back
                  </button>
                  <button className="gt-btn gt-btnPrimary" onClick={handleAiImport}>
                    Import {aiParsedCourses.length} Course(s)
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <aside className="gt-sidebar">
        {/* Semester selector */}
        <div className="gt-semesterBar">
          <div className="gt-semesterHeader">
            {editingSemesterName && activeSemester ? (
              <input
                className="gt-semesterInput"
                value={activeSemester.name}
                onChange={e => renameSemester(e.target.value)}
                onBlur={() => setEditingSemesterName(false)}
                onKeyDown={e => e.key === "Enter" && setEditingSemesterName(false)}
                autoFocus
              />
            ) : (
              <select
                className="gt-semesterSelect"
                value={activeSemesterId}
                onChange={e => setActiveSemesterIdState(e.target.value)}
              >
                {semesters.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            )}
            <div className="gt-semesterActions">
              <button
                className="gt-btn gt-btnIcon"
                title="Rename semester"
                onClick={() => setEditingSemesterName(true)}
              >
                ✎
              </button>
              <button
                className="gt-btn gt-btnIcon"
                title="Add semester"
                onClick={addSemester}
              >
                +
              </button>
              {semesters.length > 1 && (
                <button
                  className="gt-btn gt-btnIcon"
                  title="Delete semester"
                  onClick={() => deleteSemester(activeSemesterId)}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="gt-brandbar">
          <div className="gt-brandbarTitle">
            <div>Courses</div>
            <div className="gt-btnRow">
              <button 
                className="gt-btn" 
                onClick={() => setShowAiModal(true)}
                title="Import from course outline using AI"
              >
                🤖 AI Import
              </button>
              <button className="gt-btn gt-btnPrimary" onClick={addCourse}>
                + Course
              </button>
            </div>
          </div>
          <div style={{ marginTop: 8, opacity: 0.95, fontSize: 12 }}>
            Avg <b>{avgGrade === null ? "—" : `${avgGrade.toFixed(1)}%`}</b> · GPA <b>{gpa === null ? "—" : gpa.toFixed(2)}</b> · Credits <b>{totalCredits.toFixed(2)}</b>
          </div>
        </div>

        <div className="gt-sidebarBody">
          {courses.length ? (
            <div style={{ display: "grid", gap: 10 }}>
              {courses.map((c, idx) => (
                <div
                  key={c.id}
                  className={`gt-courseItem ${c.id === activeId ? "gt-courseItemActive" : ""}`}
                  onClick={() => setActiveId(c.id)}
                >
                  <div className="gt-reorderBtns">
                    <button
                      className="gt-btn gt-btnIcon gt-btnMini"
                      title="Move up"
                      onClick={e => { e.stopPropagation(); moveCourseUp(idx); }}
                      disabled={idx === 0}
                    >
                      ▲
                    </button>
                    <button
                      className="gt-btn gt-btnIcon gt-btnMini"
                      title="Move down"
                      onClick={e => { e.stopPropagation(); moveCourseDown(idx); }}
                      disabled={idx === courses.length - 1}
                    >
                      ▼
                    </button>
                  </div>
                  <div className="gt-courseInfo">
                    <div className="gt-courseName">{c.name}</div>
                    <div className="gt-courseMeta">
                      Current {currentTotal(c).toFixed(2)}% · Weights {weightsSum(c).toFixed(0)}%
                    </div>
                  </div>
                  <button
                    className="gt-btn gt-btnIcon gt-btnDeleteSmall"
                    title="Delete course"
                    onClick={e => {
                      e.stopPropagation();
                      deleteCourse(c.id);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="gt-muted">No courses yet. Add one to start.</div>
          )}
        </div>
      </aside>

      <main className="gt-main">
        <div className="gt-page">
          {active ? (
            <>
              <div className="gt-topbar">
                <div className="gt-titleBlock">
                  <input
                    className="gt-titleInput"
                    value={active.name}
                    onChange={e => updateActive({ name: e.target.value })}
                    placeholder="Course name"
                  />

                  <div className="gt-fields">
                    <label className="gt-field">
                      Credits
                      <input
                        className="gt-input gt-noSpin"
                        type="number"
                        step="0.25"
                        value={active.credits}
                        onChange={e => updateActive({ credits: parseNumber(e.target.value) })}
                      />
                    </label>
                    <label className="gt-field">
                      Target %
                      <input
                        className="gt-input gt-noSpin"
                        type="number"
                        value={active.target}
                        onChange={e => updateActive({ target: parseNumber(e.target.value) })}
                      />
                    </label>
                    {/* Grading Scheme Selector */}
                    {active.gradingSchemes && active.gradingSchemes.length > 1 && (
                      <div className="gt-schemeSelector">
                        <span className="gt-schemeLabel">Scheme</span>
                        <div className="gt-schemeButtons">
                          {active.gradingSchemes.map((scheme, idx) => (
                            <button
                              key={scheme.id}
                              className={`gt-schemeBtn ${(active.activeSchemeIndex ?? 0) === idx ? "gt-schemeBtnActive" : ""}`}
                              onClick={() => switchScheme(idx)}
                              title={scheme.name}
                            >
                              {idx + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "grid", gap: 10, justifyItems: "end" }}>
                  <div className="gt-btnRow">
                    <button className="gt-btn" onClick={() => addAssessment(false)}>
                      + Item
                    </button>
                    <button className="gt-btn gt-btnPrimary" onClick={() => addAssessment(true)}>
                      + Final
                    </button>
                  </div>
                </div>
              </div>

              <div className="gt-kpis">
                <Kpi label="Current Total" value={`${cur.toFixed(2)}%`} />
                <Kpi label="Required Final" value={req === null ? "—" : `${req.toFixed(2)}%`} />
                <Kpi label="Weights Sum" value={`${wsum.toFixed(2)}%`} warn={wWarn} />
              </div>

              <div className="gt-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 900 }}>Assessments</div>
                  <div className="gt-muted" style={{ fontSize: 12 }}>
                    Use ▲▼ to reorder
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <table className="gt-table">
                    <thead>
                      <tr>
                        <th style={{ width: 60 }}></th>
                        <th>Name</th>
                        <th style={{ width: 100, textAlign: "center" }}>Weight %</th>
                        <th style={{ width: 100, textAlign: "center" }}>Score %</th>
                        <th style={{ width: 80, textAlign: "center" }}>Points</th>
                        <th style={{ width: 70, textAlign: "center" }}>Final</th>
                        <th style={{ width: 50 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {active.assessments.map((a, idx) => (
                        <tr key={a.id}>
                          <td>
                            <div className="gt-reorderBtns gt-reorderBtnsRow">
                              <button
                                className="gt-btn gt-btnIcon gt-btnMini"
                                title="Move up"
                                onClick={() => moveAssessmentUp(idx)}
                                disabled={idx === 0}
                              >
                                ▲
                              </button>
                              <button
                                className="gt-btn gt-btnIcon gt-btnMini"
                                title="Move down"
                                onClick={() => moveAssessmentDown(idx)}
                                disabled={idx === active.assessments.length - 1}
                              >
                                ▼
                              </button>
                            </div>
                          </td>
                          <td>
                            <input
                              className="gt-tableInput gt-tableInputName"
                              value={a.name}
                              onChange={e => updateAssessment(a.id, { name: e.target.value })}
                              placeholder="e.g., Midterm"
                            />
                          </td>
                          <td>
                            <input
                              className="gt-tableInput gt-noSpin"
                              type="number"
                              value={a.weight}
                              onChange={e => updateAssessment(a.id, { weight: parseNumber(e.target.value) })}
                            />
                          </td>
                          <td>
                            <input
                              className="gt-tableInput gt-noSpin"
                              type="number"
                              value={a.score ?? ""}
                              onChange={e =>
                                updateAssessment(a.id, {
                                  score: e.target.value === "" ? undefined : parseNumber(e.target.value),
                                })
                              }
                              placeholder="—"
                            />
                          </td>
                          <td>
                            <div className="gt-pointsCell">{getContribution(a)}</div>
                          </td>
                          <td>
                            <div className="gt-finalCell">
                              <label className="gt-toggle" title="Counts as final" aria-label="Counts as final">
                                <input
                                  className="gt-toggleInput"
                                  type="checkbox"
                                  checked={!!a.isFinal}
                                  onChange={e => updateAssessment(a.id, { isFinal: e.target.checked })}
                                />
                                <span className="gt-toggleTrack" aria-hidden="true">
                                  <span className="gt-toggleThumb" aria-hidden="true" />
                                </span>
                              </label>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                              <button
                                className="gt-btn gt-btnDanger gt-btnIcon"
                                title="Delete"
                                onClick={() => removeAssessment(a.id)}
                              >
                                ✕
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {active.assessments.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="gt-muted" style={{ padding: 12 }}>
                            No items yet — click “+ Item”.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="gt-card">
              <div style={{ fontWeight: 900 }}>No courses yet</div>
              <div className="gt-muted" style={{ marginTop: 6 }}>
                Click “+ Course” to start tracking.
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Kpi({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className={`gt-card ${warn ? "gt-cardWarn" : ""}`}>
      <div className="gt-cardLabel">{label}</div>
      <div className="gt-cardValue">{value}</div>
    </div>
  );
}
