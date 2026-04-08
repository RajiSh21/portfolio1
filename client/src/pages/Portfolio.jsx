import { useEffect, useRef, useState } from 'react'
import api from '../utils/api'
 

/* ── Typewriter hook ─────────────────────────────────────── */
function useTypewriter(roles) {
  const [text, setText] = useState('')
  useEffect(() => {
    let roleIdx = 0, charIdx = 0, deleting = false, delay = 110
    let timer
    function tick() {
      const current = roles[roleIdx]
      if (deleting) {
        setText(current.substring(0, charIdx - 1))
        charIdx--
        delay = 55
      } else {
        setText(current.substring(0, charIdx + 1))
        charIdx++
        delay = 110
      }
      if (!deleting && charIdx === current.length) { deleting = true; delay = 1800 }
      else if (deleting && charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 400 }
      timer = setTimeout(tick, delay)
    }
    const start = setTimeout(tick, 800)
    return () => { clearTimeout(start); clearTimeout(timer) }
  }, [])
  return text
}

/* ── AOS hook ────────────────────────────────────────────── */
function useAOS() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('aos-animate'); observer.unobserve(e.target) } }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('[data-aos]').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 80}ms`
      observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])
}

/* ── Navbar ──────────────────────────────────────────────── */
function Navbar({ theme, toggleTheme, brainrotMode, toggleBrainrot }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20)
      const scrollPos = window.scrollY + 120
      const secs = ['home','about','education','experience','projects','achievements','contact']
      for (let i = secs.length - 1; i >= 0; i--) {
        const el = document.getElementById(secs[i])
        if (el && scrollPos >= el.offsetTop) { setActiveSection(secs[i]); break }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollTo(id) {
    const el = document.getElementById(id)
    if (el) { const navH = 70; window.scrollTo({ top: el.offsetTop - navH, behavior: 'smooth' }) }
    setMenuOpen(false)
  }

  const links = ['home','about','education','experience','projects','achievements','contact']
  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-brand">
        <span className="brand-dot">&lt;</span>Raji<span className="brand-accent">Sh</span><span className="brand-dot">/&gt;</span>
      </div>
      <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
        {links.map(l => (
          <li key={l}><a href={`#${l}`} className={`nav-link${activeSection === l ? ' active' : ''}`} onClick={e => { e.preventDefault(); scrollTo(l) }}>{l.charAt(0).toUpperCase() + l.slice(1)}</a></li>
        ))}
      </ul>
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        <span className="theme-icon">{theme === 'dark' ? '🌙' : '☀️'}</span>
      </button>
      <button className={`brainrot-toggle${brainrotMode ? ' active' : ''}`} onClick={toggleBrainrot} aria-label="Toggle brainrot mode">
        {brainrotMode ? 'Chaos On' : 'Chaos Off'}
      </button>
      <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Open menu">
        <span/><span/><span/>
      </button>
    </nav>
  )
}

/* ── Hero Section ────────────────────────────────────────── */
function Hero({ brainrotMode }) {
  const text = useTypewriter(['Full Stack Developer','UI/UX Enthusiast','Problem Solver','Open Source Contributor','Cloud Engineer'])
  return (
    <section id="home" className="section hero-section">
      <div className="hero-bg">
        <div className="blob blob-1"/><div className="blob blob-2"/><div className="blob blob-3"/>
      </div>
      <div className="hero-content">
        <p className={`chaos-badge${brainrotMode ? ' on' : ''}`}>Brainrot mode: {brainrotMode ? 'ON' : 'OFF'}</p>
        <p className="hero-greeting">👋 Hello, I'm</p>
        <h1 className="hero-name">Raji<span className="accent">Sh</span></h1>
        <div className="hero-roles">
          <span className="static-text">I'm a </span>
          <span className="dynamic-text">{text}</span>
          <span className="cursor-blink">|</span>
        </div>
        <p className="hero-description">Passionate about building beautiful, performant web experiences and solving real-world problems with clean, elegant code.</p>
        <div className="hero-cta">
          <a href="#projects" className="btn btn-primary" onClick={e=>{e.preventDefault();document.getElementById('projects').scrollIntoView({behavior:'smooth'})}}>View My Work</a>
          <a href="#contact" className="btn btn-secondary" onClick={e=>{e.preventDefault();document.getElementById('contact').scrollIntoView({behavior:'smooth'})}}>Let's Talk</a>
        </div>
        <div className="hero-socials">
          <a href="https://github.com/RajiSh21" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg></a>
          <a href="https://www.linkedin.com/in/rajishpande/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
          <a href="https://wa.me/9779800890137" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.92 11.92 0 0 0 12.04 0C5.4 0 .02 5.37.02 12c0 2.12.55 4.2 1.6 6.03L0 24l6.17-1.61A11.96 11.96 0 0 0 12.04 24h.01c6.63 0 12-5.37 12-12 0-3.2-1.25-6.2-3.52-8.52zM12.05 21.97h-.01a9.94 9.94 0 0 1-5.06-1.39l-.36-.21-3.66.96.98-3.57-.23-.37a9.95 9.95 0 0 1-1.53-5.38c0-5.5 4.47-9.97 9.97-9.97 2.66 0 5.16 1.04 7.04 2.93a9.91 9.91 0 0 1 2.92 7.04c0 5.5-4.48 9.96-9.98 9.96zm5.47-7.45c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.46-.88-.79-1.48-1.77-1.65-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.11 3.22 5.1 4.52.71.31 1.27.5 1.71.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z"/></svg></a>
        </div>
      </div>
      <div className="hero-illustration">
        <div className="code-card">
          <div className="code-header">
            <span className="dot red"/><span className="dot yellow"/><span className="dot green"/>
            <span className="code-title">portfolio.js</span>
          </div>
          <pre className="code-body"><code>
{`const developer = {
  name: "RajiSh",
  passion: "Building great UX",
  skills: ["React", "Node.js",
            "Python", "AWS"],
  status: "Open to work 🚀",
  greet() {
    return "Let's build something!";
  }
};`}
          </code></pre>
        </div>
      </div>
      <a href="#about" className="scroll-down" aria-label="Scroll down" onClick={e=>{e.preventDefault();document.getElementById('about').scrollIntoView({behavior:'smooth'})}}>
        <span className="scroll-arrow"/>
      </a>
    </section>
  )
}

function BrainrotStickers({ enabled }) {
  if (!enabled) return null
  const chips = ['100%', 'No Cap', 'Hyperfocus', 'Ship It', 'Pixel Goblin', 'Certified']
  return (
    <div className="brainrot-stickers" aria-hidden="true">
      {chips.map((chip, idx) => (
        <span className="brainrot-chip" style={{ '--i': idx }} key={chip}>{chip}</span>
      ))}
    </div>
  )
}

/* ── About ─────────────────────────────────────────────────── */
function About() {
  function handleProfileImageError(e) {
    const img = e.currentTarget
    if (img.dataset.fallback !== 'github') {
      img.dataset.fallback = 'github'
      img.src = 'https://avatars.githubusercontent.com/RajiSh21?v=4'
      return
    }
    img.classList.add('hidden')
    img.nextElementSibling?.classList.remove('hidden')
  }

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-header" data-aos="">
          <span className="section-tag">Get to know me</span>
          <h2 className="section-title">About Me</h2>
        </div>
        <div className="about-grid">
          <div className="about-left" data-aos="">
            <div className="about-img-wrapper">
              <div className="about-img-placeholder">
                <img
                  src="/raji-profile.jpg"
                  alt="RajiSh portrait"
                  className="about-profile-img"
                  loading="lazy"
                  onError={handleProfileImageError}
                />
                <svg className="about-fallback-icon hidden" viewBox="0 0 24 24" fill="currentColor" style={{width:80,height:80,opacity:0.3}}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
              </div>
              <div className="about-badge badge-1"><span className="badge-num">2+</span><span className="badge-label">Years Experience</span></div>
              <div className="about-badge badge-2"><span className="badge-num">15+</span><span className="badge-label">Projects Built</span></div>
            </div>
          </div>
          <div className="about-right" data-aos="">
            <h3>Full Stack Developer & Problem Solver</h3>
            <p>I'm a passionate developer who loves turning ideas into reality through code. With a strong foundation in both frontend and backend technologies, I craft seamless digital experiences that are fast, accessible, and delightful to use.</p>
            <p>When I'm not coding, you'll find me exploring new technologies, contributing to open-source, or mentoring fellow developers. I believe great software is built through collaboration, continuous learning, and a user-first mindset.</p>
            <div className="skills-grid">
              {[['Frontend',['React','TypeScript','HTML/CSS','Next.js']],['Backend',['Node.js','Python','Express','MongoDB']],['Tools & Cloud',['AWS','Docker','Git','CI/CD']]].map(([title,skills])=>(
                <div className="skill-group" key={title}>
                  <h4>{title}</h4>
                  <div className="skill-tags">{skills.map(s=><span className="skill-tag" key={s}>{s}</span>)}</div>
                </div>
              ))}
            </div>
            <a href="#contact" className="btn btn-primary" style={{display:'inline-block',marginTop:24}} onClick={e=>{e.preventDefault();document.getElementById('contact').scrollIntoView({behavior:'smooth'})}}>Hire Me</a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Education ─────────────────────────────────────────────── */
function Education() {
  const items = [
    {
      year:'2022 – Present',
      degree:'B.E. in Computer Science and Engineering (Pursuing)',
      school:'Nepal Engineering College, Changunarayan, Bhaktapur',
      grade:'Affiliated to Pokhara University',
      desc:'Currently pursuing a Bachelor of Engineering in Computer Science and Engineering, enrolled in 2022.'
    },
    {
      year:'2020 – 2022',
      degree:'Higher Secondary Education (NEB +2)',
      school:'Premier College, Baneshwor',
      grade:'Computer Science Major',
      desc:'Completed NEB +2 from Premier College with Computer Science as a major, establishing a strong academic foundation.'
    },
  ]
  return (
    <section id="education" className="section section-alt">
      <div className="container">
        <div className="section-header" data-aos=""><span className="section-tag">My Academic Journey</span><h2 className="section-title">Education</h2></div>
        <div className="timeline">
          {items.map((item, i) => (
            <div className="timeline-item" data-aos="" key={i}>
              <div className="timeline-dot"/>
              <div className="timeline-card">
                <div className="timeline-period">{item.year}</div>
                <h3 className="timeline-title">{item.degree}</h3>
                <p className="timeline-place">{item.school}</p>
                <p className="timeline-desc">{item.desc}</p>
                <div className="timeline-tags">
                  <span className="tag tag-sm">{item.grade}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Experience ────────────────────────────────────────────── */
function Experience() {
  const jobs = [
    { period:'2024 – 2025', role:'MERN Developer', company:'Smart Campus Web App', type:'Project Role', points:['Designed and built the complete MERN architecture for student, faculty, and admin workflows','Implemented role-based authentication, protected routes, and modular APIs for secure operations','Delivered responsive dashboards for notices, attendance, and events with clean reusable components'] },
    { period:'2025 – 2026', role:'Frontend Lead', company:'Personal Portfolio Website', type:'Project Role', points:['Created a modern single-page portfolio in React with smooth navigation and section-based storytelling','Structured reusable UI blocks for education, projects, achievements, and contact for easy future updates','Optimized user experience with responsive layouts, clear hierarchy, and performance-focused rendering'] },
    { period:'2026 – Present', role:'ML & Security Contributor', company:'Network Intrusion Detector', type:'Project Role', points:['Built the data processing and model evaluation pipeline for real-time threat classification','Contributed attack-pattern feature engineering to improve detection confidence and reduce noisy alerts','Connected model outputs with an actionable interface so suspicious traffic could be monitored quickly'] },
  ]
  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section-header" data-aos=""><span className="section-tag">My Professional Journey</span><h2 className="section-title">Experience</h2></div>
        <div className="experience-list">
          {jobs.map((job, i) => (
            <div className="exp-card" data-aos="" key={i}>
              <div className="exp-right">
                <div className="exp-headline">
                  <h3>{job.role}</h3>
                  <span className={`exp-type ${job.type.toLowerCase()}`}>{job.type}</span>
                </div>
                <p className="exp-company">{job.company}</p>
                <p className="exp-period">Timeline: {job.period}</p>
                <ul className="exp-points">{job.points.map((p,j)=><li key={j}>{p}</li>)}</ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Projects ──────────────────────────────────────────────── */
function Projects() {
  const [filter, setFilter] = useState('all')
  const projects = [
    {
      emoji:'🏫',
      title:'Smart Campus Web App',
      category:'web',
      timeline:'Completed (2024 - 2025)',
      desc:'A complete MERN stack web platform for campus management with student profiles, attendance, notices, events, and role-based admin dashboards.',
      tags:['MongoDB','Express','React','Node.js'],
      gh:'https://github.com/RajiSh21',
      live:'#'
    },
    {
      emoji:'🛡️',
      title:'Network Intrusion Detector',
      category:'ml',
      timeline:'In Progress (2026 - Present)',
      desc:'A live network threat detection system that analyzes traffic streams in real time to identify suspicious behavior, classify attacks, and trigger alerts.',
      tags:['Python','Network Security','ML','Real-time Detection'],
      gh:'https://github.com/RajiSh21',
      live:'#'
    },
    {
      emoji:'💼',
      title:'Personal Portfolio Website',
      category:'web',
      timeline:'Completed (2025 - 2026)',
      desc:'A modern and responsive portfolio web project built with React to showcase my education, skills, projects, and professional profile.',
      tags:['React','JavaScript','CSS','Responsive UI'],
      gh:'https://github.com/RajiSh21',
      live:'#'
    },
  ]
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter)
  return (
    <section id="projects" className="section section-alt">
      <div className="container">
        <div className="section-header" data-aos=""><span className="section-tag">What I've Built</span><h2 className="section-title">Projects</h2></div>
        <div className="project-filters" data-aos="">
          {['all','web','ml'].map(f=>(
            <button key={f} className={`filter-btn${filter===f?' active':''}`} onClick={()=>setFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>
          ))}
        </div>
        <div className="projects-grid">
          {filtered.map((p,i)=>(
            <div className="project-card" data-aos="" key={i}>
              <div className="project-emoji">{p.emoji}</div>
              <div className="project-info">
                <div className="project-header">
                  <div>
                    <h3>{p.title}</h3>
                    <p className="project-timeline">Timeline: {p.timeline}</p>
                  </div>
                  <div className="project-links">
                    <a href={p.gh} className="project-link" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>GitHub</a>
                    <a href={p.live} className="project-link live">Live demo ↗</a>
                  </div>
                </div>
                <p>{p.desc}</p>
                <div className="project-tags">{p.tags.map(t=><span className="project-tag" key={t}>{t}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Achievements ──────────────────────────────────────────── */
function Achievements() {
  const items = [
    { icon:'🚀', title:'Built With Consistency', sub:'Portfolio + Product Work', desc:'I keep shipping, refining, and learning in public. Progress is my habit, not my mood.' },
    { icon:'🧠', title:'Problem Solver Mindset', sub:'Code, Debug, Improve', desc:'Every bug is feedback, every fix is growth, and every version is stronger than the last.' },
    { icon:'🤝', title:'Team-First Contributor', sub:'Collaboration Driven', desc:'I value clear communication, thoughtful code reviews, and building software that helps people.' },
    { icon:'🎯', title:'Yet To Achieve: Global Impact Project', sub:'Next Milestone', desc:'I am working toward building one product that solves a real problem at scale and positively impacts millions.' },
    { icon:'🔥', title:'Motivation Line', sub:'Daily Reminder', desc:'Dream big, start small, stay consistent. Greatness is built quietly, one focused day at a time.' },
    { icon:'🌱', title:'Yet To Achieve: Open Source Legacy', sub:'Long-Term Goal', desc:'I aim to contribute to and maintain open-source tools that students and developers rely on worldwide.' },
  ]
  return (
    <section id="achievements" className="section">
      <div className="container">
        <div className="section-header" data-aos=""><span className="section-tag">Honours & Awards</span><h2 className="section-title">Achievements</h2></div>
        <div className="achievements-grid">
          {items.map((a,i)=>(
            <div className="achievement-card" data-aos="" key={i}>
              <div className="achievement-icon">{a.icon}</div>
              <div className="achievement-content">
                <h3>{a.title}</h3><p className="achievement-sub">{a.sub}</p><p>{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Contact ───────────────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({name:'',email:'',subject:'',message:''})
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true); setError('')
    try {
      // In production, wire this to an email service like EmailJS or a /api/contact endpoint
      await new Promise(r => setTimeout(r, 1500))
      setSuccess(true); setForm({name:'',email:'',subject:'',message:''})
      setTimeout(() => setSuccess(false), 5000)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally { setSending(false) }
  }

  return (
    <section id="contact" className="section section-alt">
      <div className="container">
        <div className="section-header" data-aos=""><span className="section-tag">Get In Touch</span><h2 className="section-title">Contact Me</h2></div>
        <div className="contact-grid">
          <div className="contact-info" data-aos="">
            <p>I'm always open to interesting conversations, collaborative projects, or just a friendly chat about tech. Drop me a message and I'll get back to you within 24 hours!</p>
            <div className="contact-details">
              <div className="contact-item"><span className="contact-icon">📧</span><div><p>Email</p><a href="mailto:rajishpandey508@gmail.com">rajishpandey508@gmail.com</a></div></div>
              <div className="contact-item"><span className="contact-icon">📍</span><div><p>Location</p><p>Bhaktapur, Nepal</p></div></div>
              <div className="contact-item"><span className="contact-icon">🕐</span><div><p>Response Time</p><p>Within 24 hours</p></div></div>
            </div>
            <div className="contact-socials">
              <a href="#" className="contact-social" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg></a>
              <a href="#" className="contact-social" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
            </div>
          </div>
          <form className="contact-form" id="contact-form" onSubmit={handleSubmit} data-aos="">
            <div className="form-row">
              <div className="form-group"><label>Name</label><input type="text" placeholder="John Doe" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required/></div>
              <div className="form-group"><label>Email</label><input type="email" placeholder="john@example.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required/></div>
            </div>
            <div className="form-group"><label>Subject</label><input type="text" placeholder="Let's collaborate!" value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} required/></div>
            <div className="form-group"><label>Message</label><textarea rows="5" placeholder="Tell me about your project or idea..." value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} required/></div>
            <button type="submit" className="btn btn-primary" disabled={sending} style={{width:'100%'}}>
              {sending ? 'Sending…' : 'Send Message 🚀'}
            </button>
            {success && <p className="form-success" style={{color:'#4ade80',marginTop:12}}>✅ Message sent! I'll get back to you soon.</p>}
            {error && <p style={{color:'#f87171',marginTop:12}}>{error}</p>}
          </form>
        </div>
      </div>
    </section>
  )
}

/* ── Footer ─────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>Designed & built with ❤️ by RajiSh</p>
        <p>© 2024 All rights reserved.</p>
      </div>
    </footer>
  )
}

/* ── Main Portfolio Page ────────────────────────────────────── */
export default function Portfolio() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [brainrotMode, setBrainrotMode] = useState(() => localStorage.getItem('brainrotMode') === 'on')
  useAOS()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('brainrotMode', brainrotMode ? 'on' : 'off')
    document.body.classList.toggle('mode-brainrot', brainrotMode)
    return () => document.body.classList.remove('mode-brainrot')
  }, [brainrotMode])

  useEffect(() => {
    function onMove(event) {
      document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`)
      document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    const backToTopBtn = document.getElementById('back-to-top')
    if (!backToTopBtn) return undefined

    function onScroll() {
      backToTopBtn.classList.toggle('visible', window.scrollY > 460)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Track visit on mount
  useEffect(() => {
    api.post('/visits/track', { page: '/', referrer: document.referrer }).catch((err) => {
      if (import.meta.env.DEV) console.error('Visit tracking error:', err)
    })
  }, [])

  function toggleTheme() { setTheme(t => t === 'dark' ? 'light' : 'dark') }
  function toggleBrainrot() { setBrainrotMode(v => !v) }

  return (
    <div className={`portfolio-shell${brainrotMode ? ' brainrot-mode' : ''}`}>
      <div className="interactive-glow" aria-hidden="true" />
      <Navbar theme={theme} toggleTheme={toggleTheme} brainrotMode={brainrotMode} toggleBrainrot={toggleBrainrot} />
      <Hero brainrotMode={brainrotMode} />
      <About />
      <Education />
      <Experience />
      <Projects />
      <Achievements />
      <Contact />
      <Footer />
      <BrainrotStickers enabled={brainrotMode} />
      <button className="back-to-top" id="back-to-top" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label="Back to top">↑</button>
    </div>
  )
}
