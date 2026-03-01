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
function Navbar({ theme, toggleTheme }) {
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
      <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Open menu">
        <span/><span/><span/>
      </button>
    </nav>
  )
}

/* ── Hero Section ────────────────────────────────────────── */
function Hero() {
  const text = useTypewriter(['Full Stack Developer','UI/UX Enthusiast','Problem Solver','Open Source Contributor','Cloud Engineer'])
  return (
    <section id="home" className="section hero-section">
      <div className="hero-bg">
        <div className="blob blob-1"/><div className="blob blob-2"/><div className="blob blob-3"/>
      </div>
      <div className="hero-content">
        <p className="hero-greeting">👋 Hello, I'm</p>
        <h1 className="hero-name">Raji <span className="accent">Sh</span></h1>
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
          <a href="#" className="social-link" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg></a>
          <a href="#" className="social-link" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
          <a href="#" className="social-link" aria-label="Twitter"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.936 4.936 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0 0 24 4.59z"/></svg></a>
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
  name: "Raji Sh",
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

/* ── About ─────────────────────────────────────────────────── */
function About() {
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
                <svg viewBox="0 0 24 24" fill="currentColor" style={{width:80,height:80,opacity:0.3}}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
              </div>
              <div className="about-badge badge-1"><span className="badge-num">2+</span><span className="badge-label">Years Exp</span></div>
              <div className="about-badge badge-2"><span className="badge-num">15+</span><span className="badge-label">Projects</span></div>
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
    { year:'2020 – 2024', degree:'B.Tech in Computer Science', school:'National Institute of Technology', grade:'CGPA: 9.1 / 10', desc:'Specialized in software engineering, algorithms, and distributed systems. Led the college\'s coding club and organized two national-level hackathons.' },
    { year:'2018 – 2020', degree:'Higher Secondary Certificate (HSC)', school:'State Board of Higher Secondary Education', grade:'96.4%', desc:'Scored top marks in Mathematics, Physics, and Computer Science. Recipient of the State Merit Scholarship for academic excellence.' },
    { year:'2023', degree:'AWS Certified Solutions Architect', school:'Amazon Web Services', grade:'Score: 892 / 1000', desc:'Earned professional cloud certification demonstrating expertise in designing scalable and resilient architectures on the AWS platform.' },
  ]
  return (
    <section id="education" className="section section-alt">
      <div className="container">
        <div className="section-header" data-aos=""><span className="section-tag">My Academic Journey</span><h2 className="section-title">Education</h2></div>
        <div className="timeline">
          {items.map((item, i) => (
            <div className="timeline-item" data-aos="" key={i}>
              <div className="timeline-dot"/>
              <div className="timeline-content">
                <span className="timeline-year">{item.year}</span>
                <h3>{item.degree}</h3>
                <p className="timeline-school">{item.school}</p>
                <span className="timeline-grade">{item.grade}</span>
                <p>{item.desc}</p>
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
    { period:'Jan 2024 – Present', role:'Software Engineer', company:'TechCorp Solutions', type:'Full-time', points:['Led development of a microservices-based e-commerce platform serving 200K+ daily users','Reduced page load time by 40% through code splitting, lazy loading, and CDN optimization','Mentored 3 junior developers and introduced team-wide code review practices'] },
    { period:'Jun – Dec 2023', role:'Full Stack Intern', company:'StartupXYZ', type:'Internship', points:['Built a real-time dashboard with WebSocket integration for live data visualization','Developed RESTful APIs serving 50K+ requests/day with 99.9% uptime','Implemented automated CI/CD pipeline, cutting deployment time by 60%'] },
    { period:'Feb – May 2023', role:'Research Intern', company:'IIT Research Lab', type:'Research', points:['Researched ML-based anomaly detection in network traffic data','Published co-authored paper at IEEE ICTCS 2023 conference','Achieved 94.2% accuracy on intrusion detection dataset using ensemble methods'] },
  ]
  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section-header" data-aos=""><span className="section-tag">My Professional Journey</span><h2 className="section-title">Experience</h2></div>
        <div className="experience-list">
          {jobs.map((job, i) => (
            <div className="exp-card" data-aos="" key={i}>
              <div className="exp-left"><span className="exp-period">{job.period}</span><span className={`exp-type ${job.type.toLowerCase()}`}>{job.type}</span></div>
              <div className="exp-right">
                <h3>{job.role}</h3><p className="exp-company">{job.company}</p>
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
    { emoji:'🛒', title:'ShopSphere', category:'web', desc:'A full-stack e-commerce platform with real-time inventory, payment integration via Stripe, and an admin dashboard.', tags:['React','Node.js','MongoDB','Stripe'], gh:'#', live:'#' },
    { emoji:'🧠', title:'MediScan AI', category:'ml', desc:'Deep learning model that analyzes X-ray images to detect early signs of pneumonia with 96.3% accuracy.', tags:['Python','TensorFlow','Flask','OpenCV'], gh:'#', live:'#' },
    { emoji:'📊', title:'DevDash', category:'web', desc:'Developer productivity dashboard aggregating GitHub stats, Jira tickets, and calendar events in one unified view.', tags:['React','GraphQL','TypeScript','OAuth'], gh:'#', live:'#' },
    { emoji:'💪', title:'FitTrack', category:'mobile', desc:'Cross-platform fitness app with AI-powered workout suggestions, progress tracking, and social challenges.', tags:['React Native','Firebase','ML Kit','Node.js'], gh:'#', live:'#' },
    { emoji:'💬', title:'ChatNest', category:'web', desc:'Real-time chat app with end-to-end encryption, file sharing, voice messages, and group channels.', tags:['Socket.io','React','Redis','WebRTC'], gh:'#', live:'#' },
    { emoji:'🌍', title:'EcoSense', category:'ml', desc:'IoT + ML platform that predicts air quality levels using sensor data, weather APIs, and time-series forecasting models.', tags:['Python','IoT','LSTM','Grafana'], gh:'#', live:'#' },
  ]
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter)
  return (
    <section id="projects" className="section section-alt">
      <div className="container">
        <div className="section-header" data-aos=""><span className="section-tag">What I've Built</span><h2 className="section-title">Projects</h2></div>
        <div className="project-filters" data-aos="">
          {['all','web','ml','mobile'].map(f=>(
            <button key={f} className={`filter-btn${filter===f?' active':''}`} onClick={()=>setFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>
          ))}
        </div>
        <div className="projects-grid">
          {filtered.map((p,i)=>(
            <div className="project-card" data-aos="" key={i}>
              <div className="project-emoji">{p.emoji}</div>
              <div className="project-info">
                <div className="project-header">
                  <h3>{p.title}</h3>
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
    { icon:'🏆', title:'1st Place – National Hackathon', sub:'HackIndia 2023 • 500+ Teams', desc:'Led a 4-member team to victory by building an AI-powered accessibility tool for visually impaired users in 36 hours.' },
    { icon:'📄', title:'Research Paper Publication', sub:'IEEE ICTCS 2023', desc:'Published "Early Disease Detection using Convolutional Neural Networks" — cited 18 times since publication.' },
    { icon:'☁️', title:'AWS Certified Solutions Architect', sub:'Amazon Web Services • 2023', desc:'Earned professional cloud certification validating expertise in designing scalable, resilient AWS architectures.' },
    { icon:'🌟', title:'Google Summer of Code Contributor', sub:'Google • Open Source • 2023', desc:'Selected from 20,000+ applicants. Contributed 3,200+ lines of code to a widely-used open-source project.' },
    { icon:'💡', title:'Smart India Hackathon Finalist', sub:'Ministry of Education, India • 2022', desc:'Selected as top-30 finalists nationwide with a smart waste management solution using computer vision.' },
    { icon:'🎓', title:'Merit Scholarship – 4 Consecutive Years', sub:'NIT • 2020–2024', desc:'Awarded full merit scholarship for maintaining a CGPA above 9.0 throughout the undergraduate program.' },
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
              <div className="contact-item"><span className="contact-icon">📧</span><div><p>Email</p><a href="mailto:raji@example.com">raji@example.com</a></div></div>
              <div className="contact-item"><span className="contact-icon">📍</span><div><p>Location</p><p>Bengaluru, India</p></div></div>
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
        <p>Designed & built with ❤️ by Raji Sh</p>
        <p>© 2024 All rights reserved.</p>
      </div>
    </footer>
  )
}

/* ── Main Portfolio Page ────────────────────────────────────── */
export default function Portfolio() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  useAOS()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Track visit on mount
  useEffect(() => {
    api.post('/visits/track', { page: '/', referrer: document.referrer }).catch((err) => {
      if (import.meta.env.DEV) console.error('Visit tracking error:', err)
    })
  }, [])

  function toggleTheme() { setTheme(t => t === 'dark' ? 'light' : 'dark') }

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <About />
      <Education />
      <Experience />
      <Projects />
      <Achievements />
      <Contact />
      <Footer />
      <button className="back-to-top" id="back-to-top" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label="Back to top">↑</button>
    </>
  )
}
