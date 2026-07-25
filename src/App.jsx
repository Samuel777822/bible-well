import { useState, useEffect } from "react"
import { supabase } from './supabase'
import './App.css'

const BOOKS = {
  "genesis": 1, "exodus": 2, "leviticus": 3, "numbers": 4,
  "deuteronomy": 5, "joshua": 6, "judges": 7, "ruth": 8,
  "1 samuel": 9, "2 samuel": 10, "1 kings": 11, "2 kings": 12,
  "1 chronicles": 13, "2 chronicles": 14, "ezra": 15, "nehemiah": 16,
  "esther": 17, "job": 18, "psalms": 19, "psalm": 19, "proverbs": 20,
  "ecclesiastes": 21, "song of solomon": 22, "isaiah": 23, "jeremiah": 24,
  "lamentations": 25, "ezekiel": 26, "daniel": 27, "hosea": 28,
  "joel": 29, "amos": 30, "obadiah": 31, "jonah": 32, "micah": 33,
  "nahum": 34, "habakkuk": 35, "zephaniah": 36, "haggai": 37,
  "zechariah": 38, "malachi": 39, "matthew": 40, "mark": 41,
  "luke": 42, "john": 43, "acts": 44, "romans": 45,
  "1 corinthians": 46, "2 corinthians": 47, "galatians": 48,
  "ephesians": 49, "philippians": 50, "colossians": 51,
  "1 thessalonians": 52, "2 thessalonians": 53, "1 timothy": 54,
  "2 timothy": 55, "titus": 56, "philemon": 57, "hebrews": 58,
  "james": 59, "1 peter": 60, "2 peter": 61, "1 john": 62,
  "2 john": 63, "3 john": 64, "jude": 65, "revelation": 66
}

const BOOK_CHAPTERS = {
  1: 50, 2: 40, 3: 27, 4: 36, 5: 34, 6: 24, 7: 21, 8: 4,
  9: 31, 10: 24, 11: 22, 12: 25, 13: 29, 14: 36, 15: 10, 16: 13,
  17: 10, 18: 42, 19: 150, 20: 31, 21: 12, 22: 8, 23: 66, 24: 52,
  25: 5, 26: 48, 27: 12, 28: 14, 29: 3, 30: 9, 31: 1, 32: 4,
  33: 7, 34: 3, 35: 3, 36: 3, 37: 2, 38: 14, 39: 4, 40: 28,
  41: 16, 42: 24, 43: 21, 44: 28, 45: 16, 46: 16, 47: 13, 48: 6,
  49: 6, 50: 4, 51: 4, 52: 5, 53: 3, 54: 6, 55: 4, 56: 3,
  57: 1, 58: 13, 59: 5, 60: 5, 61: 3, 62: 5, 63: 1, 64: 1,
  65: 1, 66: 22
}

const BOOK_NAMES = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations",
  "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew",
  "Mark", "Luke", "John", "Acts", "Romans",
  "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians",
  "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy",
  "Titus", "Philemon", "Hebrews", "James", "1 Peter",
  "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
]

const DAILY_VERSES = [
  { book: "john", chapter: 3, verse: 16 },
  { book: "jeremiah", chapter: 29, verse: 11 },
  { book: "philippians", chapter: 4, verse: 13 },
  { book: "psalms", chapter: 23, verse: 1 },
  { book: "romans", chapter: 8, verse: 28 },
  { book: "isaiah", chapter: 40, verse: 31 },
  { book: "proverbs", chapter: 3, verse: 5 },
  { book: "matthew", chapter: 6, verse: 33 },
  { book: "psalms", chapter: 46, verse: 10 },
  { book: "galatians", chapter: 2, verse: 20 },
  { book: "romans", chapter: 8, verse: 1 },
  { book: "john", chapter: 14, verse: 6 },
  { book: "psalms", chapter: 42, verse: 1 },
  { book: "isaiah", chapter: 41, verse: 10 },
  { book: "matthew", chapter: 11, verse: 28 },
  { book: "john", chapter: 15, verse: 5 },
  { book: "romans", chapter: 5, verse: 8 },
  { book: "ephesians", chapter: 2, verse: 8 },
  { book: "psalms", chapter: 119, verse: 105 },
  { book: "hebrews", chapter: 11, verse: 1 },
  { book: "james", chapter: 1, verse: 2 },
  { book: "1 peter", chapter: 5, verse: 7 },
  { book: "revelation", chapter: 21, verse: 4 },
  { book: "john", chapter: 10, verse: 10 },
  { book: "romans", chapter: 12, verse: 1 },
  { book: "colossians", chapter: 3, verse: 23 },
  { book: "matthew", chapter: 28, verse: 19 },
  { book: "acts", chapter: 1, verse: 8 },
  { book: "proverbs", chapter: 27, verse: 17 },
  { book: "matthew", chapter: 5, verse: 6 },
  { book: "psalms", chapter: 27, verse: 1 }
]

function BibleScreen({ onBack }) {
  const [version, setVersion] = useState("NIV")
  const [view, setView] = useState("home")
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [verses, setVerses] = useState([])
  const [loadingVerses, setLoadingVerses] = useState(false)
  const [dailyVerse, setDailyVerse] = useState(null)
  const [dailyLoading, setDailyLoading] = useState(true)
  const versions = ["NIV", "ESV", "NLT", "NKJV"]

  useEffect(() => { loadDailyVerse() }, [version])

  async function loadDailyVerse() {
    setDailyLoading(true)
    const dayOfYear = Math.floor(
      (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    )
    const todayVerse = DAILY_VERSES[dayOfYear % DAILY_VERSES.length]
    const bookNumber = BOOKS[todayVerse.book]
    try {
      const res = await fetch(
        `https://bolls.life/get-text/${version}/${bookNumber}/${todayVerse.chapter}/`
      )
      const data = await res.json()
      const verse = data.find(v => v.verse === todayVerse.verse)
      if (!verse) throw new Error("Verse not found")
      setDailyVerse({
        text: verse.text,
        reference: `${todayVerse.book.charAt(0).toUpperCase() + todayVerse.book.slice(1)} ${todayVerse.chapter}:${todayVerse.verse}`
      })
    } catch {
      setDailyVerse(null)
    }
    setDailyLoading(false)
  }

  async function loadChapter(bookNumber, chapter) {
    setLoadingVerses(true)
    setVerses([])
    try {
      const res = await fetch(
        `https://bolls.life/get-text/${version}/${bookNumber}/${chapter}/`
      )
      const data = await res.json()
      setVerses(data)
    } catch {
      setVerses([])
    }
    setLoadingVerses(false)
  }

  function handleBookSelect(bookNumber) { setSelectedBook(bookNumber); setView("chapters") }
  function handleChapterSelect(chapter) { setSelectedChapter(chapter); setView("reading"); loadChapter(selectedBook, chapter) }
  function handleNextChapter() {
    if (selectedChapter < BOOK_CHAPTERS[selectedBook]) {
      const next = selectedChapter + 1; setSelectedChapter(next); loadChapter(selectedBook, next)
    }
  }
  function handlePrevChapter() {
    if (selectedChapter > 1) {
      const prev = selectedChapter - 1; setSelectedChapter(prev); loadChapter(selectedBook, prev)
    }
  }

  if (view === "home") return (
    <div className="bw-screen">
      <button className="bw-back" onClick={onBack}>← Back</button>
      <h1 className="bw-title">📖 Bible</h1>
      <div className="bw-versions">
        {versions.map(v => (
          <button key={v} className={`bw-chip ${version === v ? "active" : ""}`} onClick={() => setVersion(v)}>{v}</button>
        ))}
      </div>
      <h2>Today's Verse</h2>
      {dailyLoading && <p className="bw-loading-note">Loading...</p>}
      {dailyVerse && (
        <div className="bw-verse-card">
          <p className="bw-verse-text" dangerouslySetInnerHTML={{ __html: dailyVerse.text }} />
          <p className="bw-verse-ref">— {dailyVerse.reference} ({version})</p>
        </div>
      )}
      <hr className="bw-ripple" />
      <h2>Read the Bible</h2>
      <button className="bw-btn-primary" onClick={() => setView("books")}>Choose a Book →</button>
    </div>
  )

  if (view === "books") return (
    <div className="bw-screen">
      <button className="bw-back" onClick={() => setView("home")}>← Back</button>
      <h1 className="bw-title">Choose a Book</h1>
      <h3>Old Testament</h3>
      <div className="bw-book-grid">
        {BOOK_NAMES.slice(0, 39).map((name, index) => (
          <button key={index} className="bw-full-btn" onClick={() => handleBookSelect(index + 1)}>{name}</button>
        ))}
      </div>
      <h3>New Testament</h3>
      <div className="bw-book-grid">
        {BOOK_NAMES.slice(39).map((name, index) => (
          <button key={index + 39} className="bw-full-btn" onClick={() => handleBookSelect(index + 40)}>{name}</button>
        ))}
      </div>
    </div>
  )

  if (view === "chapters") return (
    <div className="bw-screen">
      <button className="bw-back" onClick={() => setView("books")}>← Back</button>
      <h1 className="bw-title">{BOOK_NAMES[selectedBook - 1]}</h1>
      <p className="bw-subtitle">Choose a chapter:</p>
      <div className="bw-chapter-grid">
        {Array.from({ length: BOOK_CHAPTERS[selectedBook] }, (_, i) => i + 1).map(ch => (
          <button key={ch} onClick={() => handleChapterSelect(ch)}>{ch}</button>
        ))}
      </div>
    </div>
  )

  if (view === "reading") return (
    <div className="bw-screen">
      <button className="bw-back" onClick={() => setView("chapters")}>← Back</button>
      <h1 className="bw-title">{BOOK_NAMES[selectedBook - 1]} {selectedChapter}</h1>
      <p className="bw-reading-version">{version}</p>
      {loadingVerses && <p className="bw-loading-note">Loading...</p>}
      {verses.map(v => (
        <p key={v.verse} className="bw-verse-line">
          <span className="bw-verse-num">{v.verse}</span>
          <span dangerouslySetInnerHTML={{ __html: v.text }} />
        </p>
      ))}
      <div className="bw-chapter-nav">
        <button onClick={handlePrevChapter} disabled={selectedChapter === 1}>← Previous</button>
        <button onClick={handleNextChapter} disabled={selectedChapter === BOOK_CHAPTERS[selectedBook]}>Next →</button>
      </div>
    </div>
  )
}

function GoogleLoginScreen() {
  const [error, setError] = useState("")
  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    if (error) setError("Something went wrong. Please try again.")
  }
  return (
    <div className="bw-login">
      <h1>Bible Well</h1>
      <p className="bw-tagline">Come thirsty. Leave transformed.</p>
      {error && <p className="bw-login-error">{error}</p>}
      <button className="bw-google-btn" onClick={handleGoogleLogin}>Continue with Google</button>
    </div>
  )
}

function PastorDashboard() {
  const [requests, setRequests] = useState([])
  const [reflections, setReflections] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("requests")

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const { data: reqData } = await supabase
      .from('requests').select('*').order('created_at', { ascending: false })
    const { data: refData } = await supabase
      .from('reflections').select('*').order('created_at', { ascending: false })
    setRequests(reqData || [])
    setReflections(refData || [])
    setLoading(false)
  }

  async function updateStatus(id, newStatus) {
    const { error } = await supabase.from('requests').update({ status: newStatus }).eq('id', id)
    if (error) { alert("Error: " + error.message); return }
    setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r))
  }

  async function handleLogout() { await supabase.auth.signOut() }

  function nameForUser(userId) {
    const match = requests.find(r => r.user_id === userId)
    return match ? match.name : "Unknown user"
  }

  if (loading) return <div className="bw-loading-screen"><p>Loading...</p></div>

  return (
    <div className="bw-screen-wide">
      <div className="bw-dash-header">
        <h1 className="bw-title">Pastor Dashboard</h1>
        <button className="bw-btn-secondary" onClick={handleLogout}>Logout</button>
      </div>
      <div className="bw-dash-tabs">
        <button className={`bw-dash-tab ${tab === "requests" ? "active" : ""}`} onClick={() => setTab("requests")}>Requests ({requests.length})</button>
        <button className={`bw-dash-tab ${tab === "reflections" ? "active" : ""}`} onClick={() => setTab("reflections")}>Reflections ({reflections.length})</button>
      </div>
      {tab === "requests" && (
        <div>
          {requests.length === 0 && <p className="bw-empty-note">No requests yet.</p>}
          {requests.map(r => (
            <div key={r.id} className="bw-pastor-card">
              <h3>{r.name}</h3>
              <p><strong>Phone:</strong> {r.phone}</p>
              <p><strong>Age:</strong> {r.age}</p>
              <p><strong>Occupation:</strong> {r.occupation}</p>
              <p><strong>Gender:</strong> {r.gender}</p>
              <p><strong>Maturity:</strong> {r.maturity}</p>
              {r.reason && <p><strong>Reason:</strong> {r.reason}</p>}
              {r.journey && <p><strong>Journey:</strong> {r.journey}</p>}
              <p className="bw-pastor-meta">Submitted: {new Date(r.created_at).toLocaleDateString()}</p>
              <select className="bw-select" value={r.status} onChange={e => updateStatus(r.id, e.target.value)}>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          ))}
        </div>
      )}
      {tab === "reflections" && (
        <div>
          {reflections.length === 0 && <p className="bw-empty-note">No reflections yet.</p>}
          {reflections.map(r => (
            <div key={r.id} className="bw-pastor-card">
              <p className="bw-pastor-meta">{new Date(r.created_at).toLocaleDateString()} — {new Date(r.created_at).toLocaleTimeString()}</p>
              <p><strong>Name:</strong> {nameForUser(r.user_id)}</p>
              <p><strong>What they understood:</strong> {r.what_understood}</p>
              <p><strong>Doubts:</strong> {r.doubts || "None"}</p>
              <p><strong>What God spoke:</strong> {r.what_god_spoke}</p>
              {r.ai_response && (
                <div className="bw-ai-response">
                  <p className="bw-ai-label">✨ Response</p>
                  <p className="bw-ai-text">{r.ai_response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DoorsScreen({ onBible, onStudy, onSessions, onLogout }) {
  return (
    <div className="bw-doors-wrap">
      <div className="bw-logout-row">
        <button className="bw-btn-secondary" onClick={onLogout}>Logout</button>
      </div>
      <h1>Bible Well</h1>
      <p className="bw-subtitle">What are you looking for today?</p>
      <div className="bw-doors">
        <div className="bw-door" onClick={onBible}>
          <div className="bw-door-icon">📖</div>
          <h3>Read the Bible</h3>
          <p>Open the Word, any book, any chapter.</p>
        </div>
        <div className="bw-door" onClick={onStudy}>
          <div className="bw-door-icon">🙏</div>
          <h3>Bible Study</h3>
          <p>Walk through Scripture with someone, at your pace.</p>
        </div>
        <div className="bw-door" onClick={onSessions}>
          <div className="bw-door-icon">📋</div>
          <h3>My Sessions</h3>
          <p>See your request status and past reflections.</p>
        </div>
      </div>
    </div>
  )
}

function StudyIntroScreen({ onReady, onBack }) {
  return (
    <div className="bw-screen">
      <button className="bw-back" onClick={onBack}>← Back</button>
      <div className="bw-intro-card">
        <h1>That longing you feel right now is not an accident.</h1>
        <p>The Bible puts it like this: "As a deer pants for streams of water, so my soul pants for you, my God." (Psalm 42:1)</p>
        <p>That is your soul speaking, and God hears it. More than that, He is the one who placed that longing there. He is the author and finisher of your faith. The hunger you feel, the pull toward His Word, is God Himself drawing you closer.</p>
        <p>Wherever you are right now, this is for you. Whether you have never opened a Bible in your life. Whether you have walked with God for years and are hungry to go deeper. Whether you know Him but feel distant, stuck, or like you keep falling short. Especially you.</p>
        <p>The same God who said, "You will seek me and find me when you seek me with all your heart" (Jeremiah 29:13), is the God who runs toward the one who turns back to Him.</p>
        <p>He is not disappointed. He is not surprised. He is waiting.</p>
        <p>Someone will walk through the Word with you, personally, at your own pace.</p>
        <button className="bw-btn-primary" onClick={onReady}>I'm Ready →</button>
      </div>
    </div>
  )
}

function RequestFormScreen({ onSubmit, onBack }) {
  const [form, setForm] = useState({
    name: "", phone: "", age: "", occupation: "",
    gender: "", maturity: "", reason: "", journey: ""
  })
  const [error, setError] = useState("")

  function updateField(field, value) { setForm({ ...form, [field]: value }); setError("") }

  function handleSubmit() {
    if (!form.name) { setError("Please enter your name"); return }
    if (!form.phone) { setError("Please enter your phone number"); return }
    if (form.phone.length !== 10) { setError("Please enter a valid 10 digit number"); return }
    if (isNaN(form.phone)) { setError("Phone number must be digits only"); return }
    if (!form.age) { setError("Please enter your age"); return }
    if (isNaN(form.age)) { setError("Please enter a valid age"); return }
    if (Number(form.age) < 5 || Number(form.age) > 100) { setError("Please enter a realistic age"); return }
    if (!form.occupation) { setError("Please select your occupation"); return }
    if (!form.gender) { setError("Please select your gender"); return }
    if (!form.maturity) { setError("Please select your spiritual maturity level"); return }
    setError("")
    onSubmit(form)
  }

  return (
    <div className="bw-screen">
      <button className="bw-back" onClick={onBack}>← Back</button>
      <h1 className="bw-title">Tell us about yourself</h1>
      <p className="bw-subtitle">This helps us connect you with the right Bible study.</p>

      <p className="bw-field-label">Name *</p>
      <input className="bw-input" value={form.name} onChange={e => updateField("name", e.target.value)} placeholder="Your name" />

      <p className="bw-field-label">Phone Number *</p>
      <input className="bw-input" value={form.phone} onChange={e => updateField("phone", e.target.value)} placeholder="Your WhatsApp number" />

      <p className="bw-field-label">Age *</p>
      <input className="bw-input" value={form.age} onChange={e => updateField("age", e.target.value)} placeholder="Your age" />

      <p className="bw-field-label">Occupation *</p>
      <div className="bw-option-row">
        <button className={`bw-chip ${form.occupation === "Student" ? "active" : ""}`} onClick={() => updateField("occupation", "Student")}>Student</button>
        <button className={`bw-chip ${form.occupation === "Youth" ? "active" : ""}`} onClick={() => updateField("occupation", "Youth")}>Youth</button>
        <button className={`bw-chip ${form.occupation === "Working Professional" ? "active" : ""}`} onClick={() => updateField("occupation", "Working Professional")}>Working Professional</button>
      </div>

      <p className="bw-field-label">Gender *</p>
      <div className="bw-option-row">
        <button className={`bw-chip ${form.gender === "Male" ? "active" : ""}`} onClick={() => updateField("gender", "Male")}>Male</button>
        <button className={`bw-chip ${form.gender === "Female" ? "active" : ""}`} onClick={() => updateField("gender", "Female")}>Female</button>
      </div>

      <p className="bw-field-label">Where are you in your spiritual journey? *</p>
      <button className={`bw-full-btn ${form.maturity === "Beginner" ? "active" : ""}`} onClick={() => updateField("maturity", "Beginner")}>Complete Beginner — never really read the Bible</button>
      <button className={`bw-full-btn ${form.maturity === "Some Stories" ? "active" : ""}`} onClick={() => updateField("maturity", "Some Stories")}>I know a little — heard some stories</button>
      <button className={`bw-full-btn ${form.maturity === "Gospels" ? "active" : ""}`} onClick={() => updateField("maturity", "Gospels")}>I've read the Gospels — (Matthew, Mark, Luke, John)</button>
      <button className={`bw-full-btn ${form.maturity === "Beyond Gospels" ? "active" : ""}`} onClick={() => updateField("maturity", "Beyond Gospels")}>Beyond the Gospels (e.g. Acts, Epistles)</button>
      <button className={`bw-full-btn ${form.maturity === "Advanced" ? "active" : ""}`} onClick={() => updateField("maturity", "Advanced")}>Advanced — looking for deep, intense study</button>

      <p className="bw-field-label">Why are you seeking this? (optional)</p>
      <textarea className="bw-input" value={form.reason} onChange={e => updateField("reason", e.target.value)} placeholder="What's drawing you to study the Word right now?" rows={3} />

      <p className="bw-field-label">Anything about your journey you'd like to share? (optional)</p>
      <textarea className="bw-input" value={form.journey} onChange={e => updateField("journey", e.target.value)} placeholder="Share as much or as little as you'd like..." rows={3} />

      {error && <p className="bw-error">{error}</p>}
      <div className="bw-submit-row">
        <button className="bw-btn-primary" onClick={handleSubmit}>Submit Request</button>
      </div>
    </div>
  )
}

function ConfirmationScreen({ onBack }) {
  return (
    <div className="bw-confirm">
      <div className="bw-dove">🕊</div>
      <h2>Your request has been received.</h2>
      <p className="bw-confirm-sub">A leader will get back to you shortly.</p>
      <p className="bw-confirm-verse">"You will seek me and find me, when you seek me with all your heart." — Jeremiah 29:13</p>
      <button className="bw-btn-secondary" style={{ marginTop: "28px" }} onClick={onBack}>← Back to Home</button>
    </div>
  )
}

function ReflectionFormScreen({ user, onSubmit, onBack }) {
  const [form, setForm] = useState({ chapter_studied: "", what_understood: "", doubts: "", what_god_spoke: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function updateField(field, value) { setForm({ ...form, [field]: value }); setError("") }

  async function handleSubmit() {
    if (!form.chapter_studied) { setError("Please enter the chapter you studied"); return }
    if (!form.what_understood) { setError("Please share what you understood"); return }
    if (!form.what_god_spoke) { setError("Please share what God spoke to you"); return }
    setLoading(true)
    try {
      const aiResponse = await fetch("/api/openrouter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "system",
              content: "You are a warm, encouraging Bible study guide. When a student shares their reflection after a Bible study session, respond with pastoral care — affirm what they understood, gently address their doubts with scripture, and encourage what God spoke to them. Keep it personal, warm, and under 200 words."
            },
            {
              role: "user",
              content: `After my Bible study session, here is my reflection:\n\nChapter studied: ${form.chapter_studied}\n\nWhat I understood: ${form.what_understood}\n\nMy doubts: ${form.doubts || "None"}\n\nWhat God spoke to me: ${form.what_god_spoke}`
            }
          ]
        })
      })
      if (!aiResponse.ok) {
        const errData = await aiResponse.json()
        throw new Error(errData?.error?.message || `API error ${aiResponse.status}`)
      }
      const aiData = await aiResponse.json()
      const aiText = aiData.choices?.[0]?.message?.content || ""
      const { error } = await supabase.from('reflections').insert([{
        user_id: user.id,
        chapter_studied: form.chapter_studied,
        what_understood: form.what_understood,
        doubts: form.doubts,
        what_god_spoke: form.what_god_spoke,
        ai_response: aiText
      }])
      if (error) { setError(error.message); setLoading(false); return }
      onSubmit()
    } catch (err) {
      setError("Something went wrong: " + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="bw-screen">
      <button className="bw-back" onClick={onBack}>← Back</button>
      <h1 className="bw-title">Session Reflection</h1>
      <p className="bw-subtitle">Take a moment to reflect on today's Bible study.</p>

      <p className="bw-field-label">Which chapter did you study today? *</p>
      <input
        className="bw-input"
        value={form.chapter_studied}
        onChange={e => updateField("chapter_studied", e.target.value)}
        placeholder="e.g. John 3, Romans 8, Psalm 23"
      />

      <p className="bw-field-label">What did you understand from today's session? *</p>
      <textarea className="bw-input" value={form.what_understood} onChange={e => updateField("what_understood", e.target.value)} placeholder="Share what stood out to you..." rows={4} />

      <p className="bw-field-label">Any doubts or questions? (optional)</p>
      <textarea className="bw-input" value={form.doubts} onChange={e => updateField("doubts", e.target.value)} placeholder="What are you still unsure about?" rows={3} />

      <p className="bw-field-label">What did God speak to you today? *</p>
      <textarea className="bw-input" value={form.what_god_spoke} onChange={e => updateField("what_god_spoke", e.target.value)} placeholder="What felt personal, what touched your heart..." rows={4} />

      {error && <p className="bw-error">{error}</p>}
      {loading && <p className="bw-loading-note">✨ Getting your response...</p>}
      <div className="bw-submit-row">
        <button className="bw-btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? "Submitting..." : "Submit Reflection"}</button>
      </div>
    </div>
  )
}

function MySessionsScreen({ user, onBack }) {
  const [request, setRequest] = useState(null)
  const [reflections, setReflections] = useState([])
  const [loading, setLoading] = useState(true)
  const [screen, setScreen] = useState("sessions")

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const { data: reqData } = await supabase
      .from('requests').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false }).limit(1).maybeSingle()
    const { data: refData } = await supabase
      .from('reflections').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setRequest(reqData)
    setReflections(refData || [])
    setLoading(false)
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr)
    const date = d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
    const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    return `${date} at ${time}`
  }

  if (loading) return <div className="bw-loading-screen"><p>Loading...</p></div>

  if (screen === "reflect") return (
    <ReflectionFormScreen
      user={user}
      onSubmit={async () => { await fetchData(); setScreen("sessions") }}
      onBack={() => setScreen("sessions")}
    />
  )

  const statusClass = request ? `bw-status-${request.status}` : ""

  return (
    <div className="bw-screen">
      <button className="bw-back" onClick={onBack}>← Back</button>
      <h1 className="bw-title">My Sessions</h1>

      {!request && <p className="bw-empty-note">You haven't submitted a request yet.</p>}
      {request && (
        <div className="bw-request-card">
          <h2>Your Request</h2>
          <span className={`bw-status-pill ${statusClass}`}>{request.status}</span>
          <p style={{ marginTop: "10px" }} className="bw-request-meta">Submitted: {formatDate(request.created_at)}</p>
          {request.status === "pending" && <p className="bw-request-status-note">⏳ Waiting to be contacted by a leader.</p>}
          {(request.status === "contacted" || request.status === "completed") && (
            <button className="bw-btn-secondary" onClick={() => setScreen("reflect")}>+ Add Reflection</button>
          )}
        </div>
      )}

      {reflections.length > 0 && (
        <div>
          <hr className="bw-ripple" />
          <h2>Past Reflections</h2>

          {reflections.map(r => (
            <div key={r.id} className="bw-reflection-card">
              <p className="bw-reflection-time">🕐 {formatDate(r.created_at)}</p>
              {r.chapter_studied && (
                <p><strong>📖 Chapter studied:</strong> {r.chapter_studied}</p>
              )}
              <p><strong>What I understood:</strong> {r.what_understood}</p>
              <p><strong>Doubts:</strong> {r.doubts || "None"}</p>
              <p><strong>What God spoke:</strong> {r.what_god_spoke}</p>

              {r.ai_response && (
                <div className="bw-ai-response">
                  <p className="bw-ai-label">✨ Response</p>
                  <p className="bw-ai-text">{r.ai_response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

async function checkIfPastor(userId) {
  const queryPromise = supabase.from('pastors').select('id').eq('user_id', userId).maybeSingle()
  const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ timedOut: true }), 8000))
  const result = await Promise.race([queryPromise, timeoutPromise])
  if (result.timedOut) return false
  return result.data !== null
}

function App() {
  const [user, setUser] = useState(null)
  const [isPastor, setIsPastor] = useState(false)
  const [screen, setScreen] = useState("doors")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        const pastor = await checkIfPastor(currentUser.id)
        setIsPastor(pastor)
      }
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (_event === 'SIGNED_IN') {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) {
          const pastor = await checkIfPastor(currentUser.id)
          setIsPastor(pastor)
        }
        setLoading(false)
      }
      if (_event === 'SIGNED_OUT') {
        setUser(null)
        setIsPastor(false)
        setLoading(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() { await supabase.auth.signOut() }

  if (loading) return <div className="bw-loading-screen"><p>Loading...</p></div>
  if (!user) return <GoogleLoginScreen />
  if (isPastor) return <PastorDashboard />

  return (
    <div>
      {screen === "doors" && (
        <DoorsScreen
          onBible={() => setScreen("bible")}
          onStudy={() => setScreen("study")}
          onSessions={() => setScreen("sessions")}
          onLogout={handleLogout}
        />
      )}
      {screen === "bible" && <BibleScreen onBack={() => setScreen("doors")} />}
      {screen === "study" && <StudyIntroScreen onReady={() => setScreen("request")} onBack={() => setScreen("doors")} />}
      {screen === "request" && (
        <RequestFormScreen
          onBack={() => setScreen("study")}
          onSubmit={async (formData) => {
            const { error } = await supabase
              .from('requests')
              .insert([{ ...formData, user_id: user.id }])
            if (error) { alert(error.message); return }
            setScreen("confirmation")
          }}
        />
      )}
      {screen === "confirmation" && <ConfirmationScreen onBack={() => setScreen("doors")} />}
      {screen === "sessions" && (
        <MySessionsScreen user={user} onBack={() => setScreen("doors")} />
      )}
    </div>
  )
}

export default App
