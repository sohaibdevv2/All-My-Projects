/**
 * CMR Resume Builder Script - Enhanced Version
 * Fixes preview issues, adds cover letter, ATS optimizer, auto-save, and more
 */

// --- ENHANCED STATE MANAGEMENT ---
let resumeData = {
  personal: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    summary: "",
    photo: "",
  },
  experience: [],
  education: [],
  skills: {
    technical: "",
    soft: "",
    languages: "",
  },
  additional: {
    certifications: "",
    projects: "",
    awards: "",
    volunteer: "",
  },
}

let coverLetterData = {
  jobTitle: "",
  company: "",
  manager: "",
  fit: "",
  additional: "",
  opening: "",
  closing: "",
}

let uiSettings = {
  template: "modern",
  color: "#6366f1",
  font: "inter",
  atsMode: false,
  previewSize: "normal",
  theme: "dark",
  language: "en",
  showCoverLetter: false,
}

let atsScore = 0
let debounceTimer = null

// Add these variables at the top of the file after existing state variables
let quitBotTimer = null
let userInactiveTimer = null
let exitIntentTriggered = false
let lastActivity = Date.now()
let currentPreviewedResume = null

// Selected Resumes Data
const selectedResumes = {
  tcs: {
    personal: {
      fullName: "Rajesh Kumar",
      jobTitle: "Software Engineer",
      email: "rajesh.kumar@email.com",
      phone: "+91 98765 43210",
      location: "Bangalore, Karnataka",
      linkedin: "linkedin.com/in/rajeshkumar",
      summary:
        "Dedicated Software Engineer with 3+ years of experience in full-stack development using Java, Spring Boot, React, and AWS. Proven track record of delivering scalable applications and optimizing system performance. Strong problem-solving skills with expertise in agile methodologies and collaborative development.",
      photo: "",
    },
    experience: [
      {
        id: "exp-1",
        title: "Software Engineer",
        company: "Tech Solutions Pvt Ltd",
        startDate: "2021-07",
        endDate: "",
        description:
          "• Developed and maintained 5+ web applications using Java Spring Boot and React\n• Improved application performance by 35% through code optimization and database tuning\n• Collaborated with cross-functional teams to deliver features on time\n• Implemented RESTful APIs serving 10,000+ daily requests\n• Mentored 2 junior developers and conducted code reviews",
      },
      {
        id: "exp-2",
        title: "Junior Software Developer",
        company: "StartupTech India",
        startDate: "2020-06",
        endDate: "2021-06",
        description:
          "• Built responsive web interfaces using React and JavaScript\n• Integrated third-party APIs and payment gateways\n• Participated in agile development cycles and daily standups\n• Fixed 50+ bugs and implemented new features based on user feedback",
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.Tech in Computer Science",
        school: "VIT University",
        year: "2020",
      },
    ],
    skills: {
      technical: "Java, Spring Boot, React, JavaScript, Node.js, MySQL, MongoDB, AWS, Docker, Git, Jenkins",
      soft: "Problem Solving, Team Collaboration, Communication, Leadership, Time Management, Adaptability",
      languages: "English (Fluent), Hindi (Native), Tamil (Conversational)",
    },
    additional: {
      certifications: "AWS Certified Developer Associate (2022)\nOracle Java SE 11 Certified (2021)",
      projects:
        "E-commerce Platform - Built full-stack application with 1000+ users\nTask Management System - React-based project management tool",
      awards: "Best Performer Award 2022\nEmployee of the Month (March 2022)",
      volunteer: "",
    },
  },

  infosys: {
    personal: {
      fullName: "Priya Sharma",
      jobTitle: "System Analyst",
      email: "priya.sharma@email.com",
      phone: "+91 87654 32109",
      location: "Pune, Maharashtra",
      linkedin: "linkedin.com/in/priyasharma",
      summary:
        "Results-driven System Analyst with 4+ years of experience in business analysis, requirements gathering, and process optimization. Expertise in SQL, Python, and data visualization tools. Successfully led 10+ projects improving operational efficiency by 25%. Strong analytical and communication skills with ability to bridge technical and business teams.",
      photo: "",
    },
    experience: [
      {
        id: "exp-1",
        title: "System Analyst",
        company: "Global Tech Services",
        startDate: "2022-01",
        endDate: "",
        description:
          "• Analyzed business requirements and translated them into technical specifications\n• Led requirements gathering sessions with 15+ stakeholders across departments\n• Designed and optimized database schemas improving query performance by 40%\n• Created comprehensive documentation and process flows\n• Managed end-to-end testing and user acceptance testing phases",
      },
      {
        id: "exp-2",
        title: "Business Analyst",
        company: "DataCorp Solutions",
        startDate: "2020-03",
        endDate: "2021-12",
        description:
          "• Conducted gap analysis and recommended process improvements\n• Developed SQL queries and reports for business intelligence\n• Collaborated with development teams to ensure requirement alignment\n• Facilitated workshops and training sessions for end users\n• Reduced manual processes by 30% through automation recommendations",
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "MBA in Information Systems",
        school: "Symbiosis Institute",
        year: "2020",
      },
      {
        id: "edu-2",
        degree: "B.Sc in Computer Science",
        school: "Pune University",
        year: "2018",
      },
    ],
    skills: {
      technical: "SQL, Python, Tableau, Power BI, JIRA, Confluence, MS Excel, Visio, Salesforce, SAP",
      soft: "Business Analysis, Requirements Gathering, Process Optimization, Stakeholder Management, Documentation, Training",
      languages: "English (Fluent), Hindi (Native), Marathi (Native)",
    },
    additional: {
      certifications:
        "Certified Business Analysis Professional (CBAP)\nTableau Desktop Specialist\nAgile Analysis Certification",
      projects:
        "ERP Implementation - Led analysis phase for company-wide ERP system\nData Migration Project - Managed requirements for legacy system migration",
      awards: "Excellence in Analysis Award 2023\nProject Delivery Excellence 2022",
      volunteer: "Tech Mentor at Women in Tech Community",
    },
  },

  zoho: {
    personal: {
      fullName: "Arjun Patel",
      jobTitle: "Product Manager",
      email: "arjun.patel@email.com",
      phone: "+91 76543 21098",
      location: "Chennai, Tamil Nadu",
      linkedin: "linkedin.com/in/arjunpatel",
      summary:
        "Strategic Product Manager with 5+ years of experience driving user-centric product development and cross-functional team leadership. Proven track record of launching 8+ successful products with 95% user satisfaction. Expertise in product strategy, roadmap planning, and data-driven decision making. Strong background in SaaS products and agile methodologies.",
      photo: "",
    },
    experience: [
      {
        id: "exp-1",
        title: "Senior Product Manager",
        company: "InnovateTech Solutions",
        startDate: "2021-08",
        endDate: "",
        description:
          "• Led product strategy and roadmap for 3 SaaS products serving 50,000+ users\n• Increased user engagement by 45% through feature optimization and UX improvements\n• Managed cross-functional teams of 12+ members including developers, designers, and QA\n• Conducted market research and competitive analysis to identify growth opportunities\n• Launched 5 major features resulting in 25% revenue growth",
      },
      {
        id: "exp-2",
        title: "Product Manager",
        company: "CloudFirst Technologies",
        startDate: "2019-06",
        endDate: "2021-07",
        description:
          "• Defined product requirements and user stories for development teams\n• Collaborated with UX designers to create intuitive user experiences\n• Analyzed user feedback and metrics to prioritize feature development\n• Managed product launches and go-to-market strategies\n• Reduced customer churn by 20% through product improvements",
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "MBA in Product Management",
        school: "IIM Bangalore",
        year: "2019",
      },
      {
        id: "edu-2",
        degree: "B.Tech in Electronics",
        school: "NIT Trichy",
        year: "2017",
      },
    ],
    skills: {
      technical:
        "Product Strategy, Roadmap Planning, Analytics, A/B Testing, JIRA, Figma, SQL, Google Analytics, Mixpanel",
      soft: "Strategic Thinking, Leadership, Communication, Stakeholder Management, Problem Solving, User Empathy",
      languages: "English (Fluent), Hindi (Fluent), Tamil (Native), Gujarati (Native)",
    },
    additional: {
      certifications:
        "Certified Scrum Product Owner (CSPO)\nGoogle Analytics Certified\nProduct Management Certificate - Stanford",
      projects:
        "Mobile App Launch - Led end-to-end launch of mobile app with 100K+ downloads\nAI Feature Integration - Managed integration of ML capabilities increasing user retention by 30%",
      awards: "Product Innovation Award 2023\nLeadership Excellence Award 2022\nBest Product Launch 2021",
      volunteer: "Product Mentor at Startup Incubator",
    },
  },
}

// --- TRANSLATIONS ---
const translations = {
  en: {
    "resume-builder": "Resume Builder",
    "cover-letter": "Cover Letter",
    templates: "Templates",
    builder: "Builder",
    "personal-info": "Personal Information",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    additional: "Additional",
    "download-pdf": "Download PDF",
    "ats-score": "ATS Score",
    "offline-message": "You are offline - Your work is saved locally",
  },
  ta: {
    "resume-builder": "விண்ணப்ப கட்டுமானம்",
    "cover-letter": "கவர் கடிதம்",
    templates: "வார்ப்புருக்கள்",
    builder: "கட்டுமானம்",
    "personal-info": "தனிப்பட்ட தகவல்",
    experience: "அனுபவம்",
    education: "கல்வி",
    skills: "திறன்கள்",
    additional: "கூடுதல்",
    "download-pdf": "PDF பதிவிறக்கம்",
    "ats-score": "ATS மதிப்பெண்",
    "offline-message": "நீங்கள் ஆஃப்லைனில் உள்ளீர்கள் - உங்கள் வேலை உள்ளூரில் சேமிக்கப்பட்டுள்ளது",
  },
  hi: {
    "resume-builder": "रिज्यूमे बिल्डर",
    "cover-letter": "कवर लेटर",
    templates: "टेम्प्लेट्स",
    builder: "बिल्डर",
    "personal-info": "व्यक्तिगत जानकारी",
    experience: "अनुभव",
    education: "शिक्षा",
    skills: "कौशल",
    additional: "अतिरिक्त",
    "download-pdf": "PDF डाउनलोड करें",
    "ats-score": "ATS स्कोर",
    "offline-message": "आप ऑफ़लाइन हैं - आपका काम स्थानीय रूप से सहेजा गया है",
  },
}

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".builder-container")) {
    initializeApp("builder")
  } else if (document.querySelector(".cover-container")) {
    initializeApp("cover")
  } else {
    initializeApp("landing")
  }

  // Initialize offline detection
  initializeOfflineDetection()

  // Load saved data
  loadAutoSavedData()

  // Initialize ATS scoring
  updateATSScore()
})

// Initialize quit bot functionality
function initializeQuitBot() {
  // Track user activity
  document.addEventListener("mousemove", resetInactivityTimer)
  document.addEventListener("keypress", resetInactivityTimer)
  document.addEventListener("scroll", resetInactivityTimer)
  document.addEventListener("click", resetInactivityTimer)

  // Exit intent detection
  document.addEventListener("mouseout", handleExitIntent)

  // Page visibility change
  document.addEventListener("visibilitychange", handleVisibilityChange)

  // Before unload
  window.addEventListener("beforeunload", handleBeforeUnload)

  // Start inactivity timer
  resetInactivityTimer()
}

function resetInactivityTimer() {
  lastActivity = Date.now()
  clearTimeout(userInactiveTimer)

  // Show quit bot after 3 minutes of inactivity
  userInactiveTimer = setTimeout(() => {
    if (!exitIntentTriggered && document.visibilityState === "visible") {
      showQuitBot("inactivity")
    }
  }, 180000) // 3 minutes
}

function handleExitIntent(e) {
  if (e.clientY <= 0 && !exitIntentTriggered) {
    exitIntentTriggered = true
    showQuitBot("exit-intent")
  }
}

function handleVisibilityChange() {
  if (document.visibilityState === "hidden") {
    // User switched tabs or minimized
    setTimeout(() => {
      if (document.visibilityState === "hidden" && !exitIntentTriggered) {
        exitIntentTriggered = true
        showQuitBot("tab-switch")
      }
    }, 5000) // 5 seconds delay
  }
}

function handleBeforeUnload(e) {
  // Auto-save before leaving
  autoSaveData()
}

function showQuitBot(trigger) {
  const modal = document.getElementById("quitBotModal")
  const tipsContainer = document.getElementById("quitBotTips")

  if (!modal || exitIntentTriggered) return

  // Generate personalized tips based on current form data
  const tips = generatePersonalizedTips(trigger)

  tipsContainer.innerHTML = `
    <div class="quit-bot-message">
      <h4>🎯 ${tips.title}</h4>
      <ul class="tips-list">
        ${tips.suggestions.map((tip) => `<li>${tip}</li>`).join("")}
      </ul>
    </div>
  `

  modal.style.display = "flex"
  exitIntentTriggered = true

  // Auto-hide after 30 seconds if no interaction
  setTimeout(() => {
    if (modal.style.display === "flex") {
      closeQuitBot()
    }
  }, 30000)
}

function generatePersonalizedTips(trigger) {
  collectDataFromForm()
  const tips = {
    title: "Let's make your resume stand out!",
    suggestions: [],
  }

  // Analyze current form data and provide specific tips
  if (!resumeData.personal.fullName) {
    tips.suggestions.push("📝 Start with your full name - it's the first thing recruiters see")
  }

  if (!resumeData.personal.summary || resumeData.personal.summary.length < 50) {
    tips.suggestions.push("✨ Add a compelling professional summary (2-3 sentences about your expertise)")
  }

  if (resumeData.experience.length === 0) {
    tips.suggestions.push("💼 Add your work experience with specific achievements and numbers")
  }

  if (!resumeData.skills.technical && !resumeData.skills.soft) {
    tips.suggestions.push("⚡ List your key skills - both technical and soft skills matter")
  }

  if (resumeData.experience.length > 0) {
    const hasNumbers = resumeData.experience.some((exp) => exp.description && /\d+/.test(exp.description))
    if (!hasNumbers) {
      tips.suggestions.push("📊 Add numbers to your achievements (e.g., 'Increased sales by 25%')")
    }
  }

  if (!coverLetterData.jobTitle && !coverLetterData.company) {
    tips.suggestions.push("📄 Create a matching cover letter to double your interview chances")
  }

  // Default tips if form is mostly complete
  if (tips.suggestions.length === 0) {
    tips.suggestions = [
      "🎨 Try different templates to find the perfect style for your industry",
      "📱 Your resume is mobile-optimized and ATS-friendly",
      "💾 Your work is automatically saved - no need to worry about losing progress",
    ]
  }

  return tips
}

function continueBuilding() {
  closeQuitBot()
  // Focus on the first empty required field
  const emptyFields = document.querySelectorAll(
    ".form-input[required]:not([value]), .form-textarea[required]:not([value])",
  )
  if (emptyFields.length > 0) {
    emptyFields[0].focus()
    emptyFields[0].scrollIntoView({ behavior: "smooth", block: "center" })
  }
}

function generateCoverLetter() {
  closeQuitBot()
  showTab("coverletter")
  // Scroll to cover letter section
  document.getElementById("coverletter").scrollIntoView({ behavior: "smooth" })
}

function loadQuickTips() {
  closeQuitBot()
  // Show analyzer modal with tips
  analyzeResume()
}

function closeQuitBot() {
  const modal = document.getElementById("quitBotModal")
  if (modal) {
    modal.style.display = "none"
  }
  // Reset exit intent after 5 minutes
  setTimeout(() => {
    exitIntentTriggered = false
  }, 300000)
}

function initializeApp(page) {
  loadState()
  setupEventListeners(page)
  updateTheme()
  setupLanguage()

  switch (page) {
    case "builder":
      populateForm()
      updatePreview()
      updateProgress()
      updateATSScore()
      break
    case "cover":
      updateCoverPreview()
      break
    case "landing":
      // Landing page specific initializations
      break
  }
}

// --- ENHANCED EVENT LISTENERS ---
function setupEventListeners(page) {
  // Global listeners
  document.querySelectorAll(".theme-toggle").forEach((btn) => (btn.onclick = toggleTheme))

  if (page === "builder") {
    // Enhanced builder listeners with debouncing
    const debouncedUpdate = debounce(updatePreview, 300)

    const templateSelect = document.getElementById("templateSelect")
    if (templateSelect) templateSelect.onchange = changeTemplate

    const fontSelect = document.getElementById("fontSelect")
    if (fontSelect) fontSelect.onchange = changeFont

    document
      .querySelectorAll(".color-btn")
      .forEach((btn) => (btn.onclick = (e) => changeColor(e.currentTarget.dataset.color)))

    const atsToggle = document.getElementById("atsToggle")
    if (atsToggle) atsToggle.onclick = toggleATSMode

    // Enhanced form input listeners with auto-save
    const builderMain = document.querySelector(".builder-main")
    if (builderMain) {
      builderMain.addEventListener("input", (e) => {
        debouncedUpdate()
        autoSaveData()
        updateATSScore()
      })
    }

    // Tab switching
    document.querySelectorAll(".tab-btn").forEach((btn) => (btn.onclick = (e) => showTab(e.currentTarget.dataset.tab)))

    // Dynamic form elements
    setupDynamicFormListeners()

    // Cover letter listeners
    setupCoverLetterListeners()
  }

  if (page === "cover") {
    // Cover letter specific listeners
    const coverForm = document.querySelector(".cover-form")
    if (coverForm) coverForm.oninput = updateCoverPreview
  }

  if (page === "landing") {
    setupLandingPageListeners()
  }
}

function setupDynamicFormListeners() {
  // Experience and education management
  document.addEventListener("click", (e) => {
    if (e.target.matches('[onclick*="addExperience"]')) {
      addExperience()
    }
    if (e.target.matches('[onclick*="addEducation"]')) {
      addEducation()
    }
    if (e.target.matches('[onclick*="removeExperience"]')) {
      const id = e.target.getAttribute("onclick").match(/'([^']+)'/)[1]
      removeExperience(id)
    }
    if (e.target.matches('[onclick*="removeEducation"]')) {
      const id = e.target.getAttribute("onclick").match(/'([^']+)'/)[1]
      removeEducation(id)
    }
  })
}

function setupCoverLetterListeners() {
  const coverInputs = ["coverJobTitle", "coverCompany", "coverManager", "coverFit", "coverAdditional"]
  coverInputs.forEach((id) => {
    const element = document.getElementById(id)
    if (element) {
      element.addEventListener("input", debounce(updateCoverPreview, 300))
    }
  })
}

function setupLandingPageListeners() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const activeBtn = document.querySelector(".filter-btn.active")
      if (activeBtn) activeBtn.classList.remove("active")
      btn.classList.add("active")
      const filter = btn.dataset.filter
      document.querySelectorAll(".template-card").forEach((card) => {
        if (filter === "all" || card.dataset.category.includes(filter)) {
          card.style.display = "block"
        } else {
          card.style.display = "none"
        }
      })
    })
  })
}

// --- ENHANCED DATA MANAGEMENT ---
function collectDataFromForm() {
  // Personal — only collect when builder form fields exist
  if (document.getElementById("fullName") !== null) {
    resumeData.personal.fullName = getValue("fullName")
    resumeData.personal.jobTitle = getValue("jobTitle")
    resumeData.personal.email = getValue("email")
    resumeData.personal.phone = getValue("phone")
    resumeData.personal.location = getValue("location")
    resumeData.personal.linkedin = getValue("linkedin")
    resumeData.personal.summary = getValue("summary")
  }

  // Experience - Enhanced collection
  resumeData.experience = Array.from(document.querySelectorAll("#experienceList .experience-item")).map((item) => ({
    id: item.dataset.id,
    title: item.querySelector('[data-field="title"]')?.value || "",
    company: item.querySelector('[data-field="company"]')?.value || "",
    startDate: item.querySelector('[data-field="startDate"]')?.value || "",
    endDate: item.querySelector('[data-field="endDate"]')?.value || "",
    description: item.querySelector('[data-field="description"]')?.value || "",
  }))

  // Education - Enhanced collection
  resumeData.education = Array.from(document.querySelectorAll("#educationList .education-item")).map((item) => ({
    id: item.dataset.id,
    degree: item.querySelector('[data-field="degree"]')?.value || "",
    school: item.querySelector('[data-field="school"]')?.value || "",
    year: item.querySelector('[data-field="year"]')?.value || "",
  }))

  // Skills - Enhanced collection
  resumeData.skills.technical = getValue("technicalSkills")
  resumeData.skills.soft = getValue("softSkills")
  resumeData.skills.languages = getValue("languages")

  // Additional - Enhanced collection
  resumeData.additional.certifications = getValue("certifications")
  resumeData.additional.projects = getValue("projects")
  resumeData.additional.awards = getValue("awards")
  resumeData.additional.volunteer = getValue("volunteer")

  // Cover Letter — support both builder tab IDs and standalone cover page IDs
  const coverCompanyEl = document.getElementById("coverCompany")
  if (coverCompanyEl !== null) coverLetterData.company = coverCompanyEl.value

  const coverJobTitleEl = document.getElementById("coverJobTitle")
  if (coverJobTitleEl !== null) coverLetterData.jobTitle = coverJobTitleEl.value

  const coverManagerEl = document.getElementById("coverManager")
  if (coverManagerEl !== null) coverLetterData.manager = coverManagerEl.value

  const coverFitEl = document.getElementById("coverFit")
  if (coverFitEl !== null) coverLetterData.fit = coverFitEl.value

  const coverAdditionalEl = document.getElementById("coverAdditional")
  if (coverAdditionalEl !== null) coverLetterData.additional = coverAdditionalEl.value

  const coverOpeningEl = document.getElementById("coverOpening")
  if (coverOpeningEl !== null) coverLetterData.opening = coverOpeningEl.value

  const coverClosingEl = document.getElementById("coverClosing")
  if (coverClosingEl !== null) coverLetterData.closing = coverClosingEl.value
}

function getValue(id) {
  const element = document.getElementById(id)
  return element ? element.value : ""
}

function populateForm() {
  // Personal
  setValue("fullName", resumeData.personal.fullName)
  setValue("jobTitle", resumeData.personal.jobTitle)
  setValue("email", resumeData.personal.email)
  setValue("phone", resumeData.personal.phone)
  setValue("location", resumeData.personal.location)
  setValue("linkedin", resumeData.personal.linkedin)
  setValue("summary", resumeData.personal.summary)

  if (resumeData.personal.photo) {
    const preview = document.getElementById("photoPreview")
    if (preview) {
      preview.style.backgroundImage = `url(${resumeData.personal.photo})`
      preview.classList.add("has-image")
    }
  }

  // Experience & Education
  const expList = document.getElementById("experienceList")
  const eduList = document.getElementById("educationList")

  if (expList) {
    expList.innerHTML = ""
    resumeData.experience.forEach((exp) => addExperience(exp))
  }

  if (eduList) {
    eduList.innerHTML = ""
    resumeData.education.forEach((edu) => addEducation(edu))
  }

  // Skills
  setValue("technicalSkills", resumeData.skills.technical)
  setValue("softSkills", resumeData.skills.soft)
  setValue("languages", resumeData.skills.languages)

  // Additional
  setValue("certifications", resumeData.additional.certifications)
  setValue("projects", resumeData.additional.projects)
  setValue("awards", resumeData.additional.awards)
  setValue("volunteer", resumeData.additional.volunteer)

  // Cover Letter
  setValue("coverJobTitle", coverLetterData.jobTitle)
  setValue("coverCompany", coverLetterData.company)
  setValue("coverManager", coverLetterData.manager)
  setValue("coverFit", coverLetterData.fit)
  setValue("coverAdditional", coverLetterData.additional)
  setValue("coverOpening", coverLetterData.opening || "")
  setValue("coverClosing", coverLetterData.closing || "")

  // Update the template selector in the populateForm function or wherever template options are set
  const templateSelectElement = document.getElementById("templateSelect")
  if (templateSelectElement) {
    templateSelectElement.innerHTML = `
    <optgroup label="── Core Templates ──">
    <option value="modern">Modern Professional</option>
    <option value="classic">Classic Traditional</option>
    <option value="elegant">Elegant Minimal</option>
    <option value="creative">Creative Bold</option>
    <option value="ats-friendly">ATS Optimized</option>
    <option value="executive">Executive Premium</option>
    <option value="tech">Tech Specialist</option>
    <option value="academic">Academic Scholar</option>
    </optgroup>
    <optgroup label="── Modern ──">
    <option value="modern1">Modern Gradient</option>
    <option value="modern2">Modern Sidebar</option>
    <option value="modern3">Modern Banner</option>
    </optgroup>
    <optgroup label="── Elegant ──">
    <option value="elegant1">Elegant Classic</option>
    <option value="elegant2">Elegant Purple</option>
    <option value="elegant3">Elegant Serif</option>
    </optgroup>
    <optgroup label="── Creative ──">
    <option value="creative1">Creative Pink</option>
    <option value="creative2">Creative Zigzag</option>
    <option value="creative3">Creative Geometric</option>
    <option value="creative4">Creative Wave</option>
    <option value="creative5">Creative Diamond</option>
    <option value="creative6">Creative Circle</option>
    <option value="creative7">Creative Triangle</option>
    <option value="creative8">Creative Star</option>
    <option value="creative9">Creative Polygon</option>
    <option value="creative10">Creative Hexagon</option>
    <option value="creative11">Creative Arrow</option>
    <option value="creative12">Creative Spiral</option>
    <option value="creative13">Creative Lightning</option>
    <option value="creative14">Creative Crystal</option>
    <option value="creative15">Creative Flame</option>
    </optgroup>
    <optgroup label="── Professional ──">
    <option value="professional1">Professional Corporate</option>
    <option value="professional2">Professional Sidebar</option>
    <option value="professional3">Professional Executive</option>
    <option value="professional4">Professional Minimal</option>
    <option value="professional5">Professional Premium</option>
    <option value="professional6">Professional Modern</option>
    <option value="professional7">Professional Leadership</option>
    <option value="professional8">Professional Clean</option>
    </optgroup>
    <optgroup label="── Minimalist ──">
    <option value="minimalist1">Minimalist Simple</option>
    <option value="minimalist2">Minimalist Sidebar</option>
    <option value="minimalist3">Minimalist Lines</option>
    </optgroup>
    <optgroup label="── Corporate ──">
    <option value="corporate1">Corporate Executive</option>
    <option value="corporate2">Corporate Letterhead</option>
    <option value="corporate3">Corporate Business</option>
    </optgroup>
    <optgroup label="── International ──">
    <option value="international1">International Global</option>
    <option value="international2">International UK</option>
    <option value="international3">International European</option>
    <option value="international4">International Australian</option>
    <option value="international5">International Middle East</option>
    <option value="international6">International Canadian</option>
    <option value="international7">International Latin</option>
    <option value="international8">International Asian</option>
    </optgroup>
    <optgroup label="── Company ──">
    <option value="company1">Company Corporate</option>
    <option value="company2">Company Executive</option>
    <option value="company3">Company Classic</option>
    <option value="company4">Company Minimal</option>
    <option value="company5">Company Premium</option>
    <option value="company6">Company Modern</option>
    <option value="company7">Company Leadership</option>
    <option value="company8">Company Professional</option>
    </optgroup>
    <optgroup label="── MNC ──">
    <option value="mnc1">MNC Executive</option>
    <option value="mnc2">MNC Global</option>
    <option value="mnc3">MNC Corporate</option>
    <option value="mnc4">MNC Leadership</option>
    <option value="mnc5">MNC Director</option>
    <option value="mnc6">MNC Modern</option>
    <option value="mnc7">MNC Premium</option>
    <option value="mnc8">MNC Elite</option>
    </optgroup>
    <optgroup label="── Tech ──">
    <option value="tech1">Tech Software</option>
    <option value="tech2">Tech Full Stack</option>
    <option value="tech3">Tech Data Science</option>
    <option value="tech4">Tech DevOps</option>
    <option value="tech5">Tech UI/UX</option>
    <option value="tech6">Tech Security</option>
    <option value="tech7">Tech AI/ML</option>
    <option value="tech8">Tech Product</option>
    </optgroup>
    <optgroup label="── Elite ──">
    <option value="elite1">Elite Executive</option>
    <option value="elite2">Elite Strategic</option>
    <option value="elite3">Elite Creative</option>
    <option value="elite4">Elite Innovation</option>
    <option value="elite5">Elite Distinguished</option>
    <option value="elite6">Elite Visionary</option>
    <option value="elite7">Elite Formal</option>
    <option value="elite8">Elite Futuristic</option>
    </optgroup>
    <optgroup label="── Unique Styles ──">
    <option value="minimalLuxe">Minimal Luxe</option>
    <option value="creativePortfolio">Creative Portfolio</option>
    <option value="corporateTimeline">Corporate Timeline</option>
    <option value="techGrid">Tech Grid</option>
    <option value="boldSidebar">Bold Sidebar</option>
    <option value="executiveProfile">Executive Profile</option>
    <option value="globalProfessional">Global Professional</option>
    <option value="infographicResume">Infographic Resume</option>
    </optgroup>
    <optgroup label="── Occupation ──">
    <option value="managementExecutive">Management Executive</option>
    <option value="officeAdmin">Office Administrative</option>
    <option value="businessFinance">Business Finance</option>
    <option value="retailSales">Retail Sales</option>
    <option value="healthcareMedical">Healthcare Medical</option>
    <option value="foodBeverage">Food & Beverage</option>
    <option value="technology">Technology</option>
    <option value="education">Education</option>
    </optgroup>
    <optgroup label="── Style ──">
    <option value="traditionalClassic">Traditional Classic</option>
    <option value="creativeBold">Creative Bold</option>
    <option value="contemporaryMinimal">Contemporary Minimal</option>
    <option value="corporateSidebar">Corporate Sidebar</option>
    <option value="infographicStyle">Infographic Style</option>
    <option value="elegantModern">Elegant Modern</option>
    <option value="twoColumnProfessional">Two-Column Professional</option>
    <option value="oneColumnFocus">One-Column Focus</option>
    </optgroup>
    <optgroup label="── Design ──">
    <option value="modernSidebarBlue">Modern Sidebar Blue</option>
    <option value="formalCenterline">Formal Centerline</option>
    <option value="greenAccentProfessional">Green Accent Professional</option>
    <option value="darkHeaderMinimal">Dark Header Minimal</option>
    <option value="softPinkCreative">Soft Pink Creative</option>
    <option value="yellowIconHighlights">Yellow Icon Highlights</option>
    <option value="lightGreyMinimal">Light Grey Minimal</option>
    <option value="blueLineExecutive">Blue Line Executive</option>
    </optgroup>
    <optgroup label="── ATS Friendly ──">
    <option value="executiveMinimal">Executive Minimal</option>
    <option value="modernATS">Modern ATS</option>
    <option value="classicSerif">Classic Serif</option>
    <option value="timelineStyle">Timeline Style</option>
    <option value="skillFocused">Skill Focused</option>
    <option value="compactProfessional">Compact Professional</option>
    <option value="academicCV">Academic CV</option>
    <option value="functionalResume">Functional Resume</option>
    <option value="internationalStandard">International Standard</option>
    <option value="projectPortfolioResume">Project Portfolio</option>
    <option value="freshGraduateLayout">Fresh Graduate</option>
    <option value="seniorLeadershipResume">Senior Leadership</option>
    <option value="atsPrimeClassic">ATS Prime Classic</option>
    <option value="atsModernProfessional">ATS Modern Professional</option>
    <option value="atsChronologicalFocus">ATS Chronological Focus</option>
    <option value="atsSkillsFirst">ATS Skills First</option>
    <option value="atsAcademicProfile">ATS Academic Profile</option>
    <option value="atsExecutiveMinimal">ATS Executive Minimal</option>
    <option value="atsCompactPro">ATS Compact Pro</option>
    <option value="atsWideHeader">ATS Wide Header</option>
    <option value="atsCareerSwitch">ATS Career Switch</option>
    <option value="atsSimpleTimeline">ATS Simple Timeline</option>
    <option value="atsTechnicalLayout">ATS Technical Layout</option>
    <option value="atsLegalFinanceReady">ATS Legal Finance Ready</option>
    </optgroup>
    <optgroup label="── ✨ Glassmorphism ──">
    <option value="glass1">Glass Aurora (Dark Purple)</option>
    <option value="glass2">Glass Blue Premium</option>
    <option value="glass3">Glass Emerald</option>
    <option value="glass4">Glass Rose Gold</option>
    <option value="glass5">Glass Midnight</option>
    <option value="glass6">Glass Holographic</option>
    </optgroup>
    <optgroup label="── 🌙 Dark + Photo ──">
    <option value="darkPhoto1">Dark Charcoal Executive</option>
    <option value="darkPhoto2">Dark Navy Commander</option>
    <option value="darkPhoto3">Dark Purple Executive</option>
    <option value="darkPhoto4">Dark Carbon Modern</option>
    <option value="darkPhoto5">Dark Slate Professional</option>
    <option value="darkPhoto6">Dark Luxury Gold</option>
    </optgroup>
    <optgroup label="── 🌈 Gradient + Photo ──">
    <option value="gradientPhoto1">Purple Wave</option>
    <option value="gradientPhoto2">Sunset Career</option>
    <option value="gradientPhoto3">Ocean Pro</option>
    <option value="gradientPhoto4">Forest Executive</option>
    <option value="gradientPhoto5">Flame Leader</option>
    <option value="gradientPhoto6">Midnight Gradient</option>
    </optgroup>
    <optgroup label="── 📋 Split + Photo ──">
    <option value="splitPhoto1">Indigo Split</option>
    <option value="splitPhoto2">Charcoal Split</option>
    <option value="splitPhoto3">Slate Executive Split</option>
    <option value="splitPhoto4">Light Split Modern</option>
    <option value="splitPhoto5">Dark Blue Split</option>
    <option value="splitPhoto6">Forest Split</option>
    </optgroup>
    <optgroup label="── 🤍 Minimal + Photo ──">
    <option value="minimalPhoto1">Pure Minimal</option>
    <option value="minimalPhoto2">Accent Line Minimal</option>
    <option value="minimalPhoto3">Centered Minimal</option>
    <option value="minimalPhoto4">Nordic Minimal</option>
    <option value="minimalPhoto5">Swiss Grid Minimal</option>
    </optgroup>
    <optgroup label="── 🎨 Creative + Photo ──">
    <option value="creativePhoto1">Hexagon Creative</option>
    <option value="creativePhoto2">Magazine Style</option>
    <option value="creativePhoto3">Neon Tech</option>
    <option value="creativePhoto4">Pastel Watercolor</option>
    <option value="creativePhoto5">Bold Geometric</option>
    </optgroup>
    <optgroup label="── 🤖 AI Generated ──">
    <option value="ai-custom" id="aiCustomOption" style="display:none">AI Custom Template</option>
    </optgroup>
    `
    // Restore current template selection
    templateSelectElement.value = uiSettings.template
  }
}

function setValue(id, value) {
  const element = document.getElementById(id)
  if (element) {
    element.value = value || ""
  }
}

// --- ENHANCED PREVIEW RENDERING ---
async function updatePreview() {
  collectDataFromForm()
  saveState()
  setPreviewStatus("Updating…")
  await renderPreview()
  setPreviewStatus("")
  updateProgress()
  updateATSScore()

  // Scroll to preview on mobile
  if (window.innerWidth <= 768) {
    const preview = document.getElementById("previewContent")
    if (preview) {
      preview.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }
}

function setPreviewStatus(msg) {
  const el = document.getElementById("previewStatus")
  if (!el) return
  el.textContent = msg
  el.classList.toggle("visible", msg.length > 0)
}

async function renderPreview() {
  const template = uiSettings.atsMode ? "ats-friendly" : uiSettings.template
  const templatePath = `templates/${template}.html`

  try {
    const response = await fetch(templatePath)
    if (!response.ok) {
      // Fallback to modern template if template not found
      const fallbackResponse = await fetch("templates/modern.html")
      if (!fallbackResponse.ok) throw new Error(`Template not found: ${templatePath}`)
      const templateHtml = await fallbackResponse.text()

      const previewContent = document.getElementById("previewContent")
      if (previewContent) {
        previewContent.innerHTML = templateHtml
        populateTemplate()
        applyCustomizations()
      }
    } else {
      const templateHtml = await response.text()
      const previewContent = document.getElementById("previewContent")
      if (previewContent) {
        previewContent.innerHTML = templateHtml
        populateTemplate()
        applyCustomizations()
      }
    }
  } catch (error) {
    console.error("Error loading template:", error)
    const previewContent = document.getElementById("previewContent")
    if (previewContent) {
      previewContent.innerHTML = `<div class="error-message">Could not load template: ${template}.html</div>`
    }
  }
}

function populateTemplate() {
  const { personal, experience, education, skills, additional } = resumeData
  const doc = document.getElementById("previewContent")
  if (!doc) return

  const setText = (id, text) => {
    const el = doc.querySelector(`#${id}`)
    if (el) el.textContent = text || ""
  }

  const setHtml = (id, html) => {
    const el = doc.querySelector(`#${id}`)
    if (el) el.innerHTML = html || ""
  }

  // Personal Information
  setText("previewName", personal.fullName)
  setText("previewJobTitle", personal.jobTitle)
  setText("previewEmail", personal.email)
  setText("previewPhone", personal.phone)
  setText("previewLocation", personal.location)
  setText("previewSummary", personal.summary)

  // LinkedIn
  const linkedInEl = doc.querySelector("#previewLinkedIn")
  if (linkedInEl && personal.linkedin) {
    const cleanUrl = personal.linkedin.replace(/^https?:\/\//, "")
    linkedInEl.innerHTML = `<a href="https://${cleanUrl}" target="_blank">${cleanUrl}</a>`
  }

  // Profile Photo
  const photoEl = doc.querySelector("#profilePhoto")
  if (photoEl && personal.photo) {
    photoEl.style.backgroundImage = `url(${personal.photo})`
    photoEl.style.backgroundSize = "cover"
    photoEl.style.backgroundPosition = "center"
  }

  // Experience - FIXED
  const expHtml = experience
    .map((exp) => {
      const startDate = exp.startDate ? formatDate(exp.startDate) : ""
      const endDate = exp.endDate ? formatDate(exp.endDate) : "Present"
      const dateRange = startDate ? `${startDate} - ${endDate}` : ""

      return `
      <div class="experience-entry">
        <div class="entry-header">
          <h4 class="entry-title">${exp.title || ""}</h4>
          <span class="entry-company">${exp.company || ""}</span>
          <span class="entry-dates">${dateRange}</span>
        </div>
        <div class="entry-description">${formatDescription(exp.description || "")}</div>
      </div>
    `
    })
    .join("")
  setHtml("previewExperience", expHtml)

  // Education - FIXED
  const eduHtml = education
    .map(
      (edu) => `
    <div class="education-entry">
      <div class="entry-header">
        <h4 class="entry-title">${edu.degree || ""}</h4>
        <span class="entry-school">${edu.school || ""}</span>
        <span class="entry-dates">${edu.year || ""}</span>
      </div>
    </div>
  `,
    )
    .join("")
  setHtml("previewEducation", eduHtml)

  // Skills - FIXED
  const technicalSkills = skills.technical
    ? skills.technical
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : []
  const softSkills = skills.soft
    ? skills.soft
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : []
  const allSkills = [...technicalSkills, ...softSkills]

  const skillsHtml = allSkills.map((skill) => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join("")
  setHtml("previewSkills", skillsHtml)

  // Languages - FIXED
  const languagesHtml = skills.languages
    ? skills.languages
        .split(",")
        .map((lang) => `<span class="skill-tag">${escapeHtml(lang.trim())}</span>`)
        .join("")
    : ""
  setHtml("previewLanguages", languagesHtml)

  // Additional Sections - FIXED
  const createListHtml = (text) =>
    text
      ? text
          .split("\n")
          .filter(Boolean)
          .map((item) => `<li>${escapeHtml(item.trim())}</li>`)
      : ""

  setHtml("previewCertifications", createListHtml(additional.certifications))
  setHtml("previewProjects", createListHtml(additional.projects))
  setHtml("previewAwards", createListHtml(additional.awards))
  setHtml("previewVolunteer", createListHtml(additional.volunteer))
}

function formatDate(dateString) {
  if (!dateString) return ""
  const date = new Date(dateString + "-01") // Add day for month input
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

function escapeHtml(str) {
  if (!str) return ""
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function formatDescription(description) {
  return escapeHtml(description).replace(/\n/g, "<br>")
}

function applyCustomizations() {
  const preview = document.querySelector("#previewContent .resume-template")
  if (!preview) return

  preview.style.setProperty("--primary-color", uiSettings.color)

  const fontMap = {
    inter: "'Inter', sans-serif",
    playfair: "'Playfair Display', serif",
    system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
  }
  preview.style.fontFamily = fontMap[uiSettings.font] || fontMap.inter
}

// --- COVER LETTER FUNCTIONALITY ---
function updateCoverPreview() {
  collectDataFromForm()

  const { personal } = resumeData
  const { jobTitle, company, manager, fit, additional, opening, closing } = coverLetterData

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const managerName = manager || "Hiring Manager"
  const greeting = manager ? `Dear ${escapeHtml(manager)},` : "Dear Hiring Team,"

  // Build body paragraphs
  const bodyParagraphs = []
  if (opening) {
    bodyParagraphs.push(`<p>${escapeHtml(opening)}</p>`)
  } else {
    bodyParagraphs.push(
      `<p>I am writing to express my strong interest in the ${escapeHtml(jobTitle || "position")} role at ${escapeHtml(company || "your company")}. ${escapeHtml(fit || "Please add why you're a perfect fit for this role.")}</p>`,
    )
  }
  if (fit && opening) {
    bodyParagraphs.push(`<p>${escapeHtml(fit)}</p>`)
  }
  if (additional) {
    bodyParagraphs.push(`<p>${escapeHtml(additional)}</p>`)
  }
  if (closing) {
    bodyParagraphs.push(`<p>${escapeHtml(closing)}</p>`)
  } else {
    bodyParagraphs.push(
      `<p>I would welcome the opportunity to discuss how my background and enthusiasm can contribute to ${escapeHtml(company || "your team")}'s continued success. Thank you for considering my application.</p>`,
    )
  }

  const coverPreview = document.getElementById("coverPreview")
  if (coverPreview) {
    coverPreview.innerHTML = `
      <div class="cover-letter-content">
        <div class="cover-header">
          <h2>${escapeHtml(personal.fullName || "Your Name")}</h2>
          <div class="cover-contact">
            ${escapeHtml(personal.email || "your.email@example.com")} |
            ${escapeHtml(personal.phone || "(555) 555-5555")} |
            ${escapeHtml(personal.location || "Your Location")}
          </div>
        </div>

        <div class="cover-date">${currentDate}</div>

        <div class="cover-recipient">
          <p>${escapeHtml(managerName)}</p>
          <p>${escapeHtml(company || "Company Name")}</p>
        </div>

        <div class="cover-subject">
          <p><strong>RE: Application for ${escapeHtml(jobTitle || "Position Title")}</strong></p>
        </div>

        <div class="cover-body">
          <p>${greeting}</p>
          ${bodyParagraphs.join("")}
          <p>Sincerely,<br>${escapeHtml(personal.fullName || "Your Name")}</p>
        </div>
      </div>
    `
  }
}

function downloadCoverLetterPDF() {
  const element = document.getElementById("coverPreview")
  if (!element) {
    alert("Please generate cover letter preview first")
    return
  }

  const name = resumeData.personal.fullName || "Your Name"
  const company = coverLetterData.company || "Company"

  const opt = {
    margin: 0.5,
    filename: `${name} - Cover Letter - ${company}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  }

  loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js").then(() => {
    window.html2pdf().set(opt).from(element).save()
  })
}

// generateAICover is implemented in ai.js (Ollama/Mistral powered)
// This stub is intentionally empty — ai.js overrides it after loading
function generateAICover() {
  if (typeof checkOllamaStatus !== 'undefined') return; // ai.js loaded
  alert('AI assist requires the page to fully load. Please wait and try again.')
}

function toggleCoverLetter() {
  uiSettings.showCoverLetter = !uiSettings.showCoverLetter
  const button = document.getElementById("coverLetterToggle")

  if (uiSettings.showCoverLetter) {
    showTab("coverletter")
    if (button) button.textContent = "Hide Cover Letter"
  } else {
    showTab("personal")
    if (button) button.textContent = "Generate Cover Letter"
  }

  saveState()
}

// Selected Resumes Functions
function loadTCSResume() {
  loadSelectedResume("tcs")
}

function loadInfosysResume() {
  loadSelectedResume("infosys")
}

function loadZohoResume() {
  loadSelectedResume("zoho")
}

function loadSelectedResume(resumeKey) {
  if (!selectedResumes[resumeKey]) return

  const selectedData = selectedResumes[resumeKey]

  // Confirm before overwriting existing data
  if (hasExistingData()) {
    if (!confirm("This will replace your current resume data. Are you sure you want to continue?")) {
      return
    }
  }

  // Load the selected resume data
  resumeData = JSON.parse(JSON.stringify(selectedData)) // Deep copy

  // Navigate to form page if on landing page
  if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
    window.location.href = "form.html"
    return
  }

  // Populate form and update preview
  populateForm()
  updatePreview()
  updateCoverPreview()

  // Show success message
  showSuccessMessage(`✅ Resume template loaded successfully! You can now customize it with your details.`)

  // Scroll to top of form
  const formContainer = document.querySelector(".form-container")
  if (formContainer) formContainer.scrollIntoView({ behavior: "smooth" })
}

function previewResume(resumeKey) {
  if (!selectedResumes[resumeKey]) return

  currentPreviewedResume = resumeKey
  const resumeData = selectedResumes[resumeKey]

  // Generate preview HTML
  const previewHTML = generateResumePreviewHTML(resumeData)

  // Show in modal
  const modal = document.getElementById("resumePreviewModal")
  const content = document.getElementById("resumePreviewContent")

  if (modal && content) {
    content.innerHTML = previewHTML
    modal.style.display = "block"
  }
}

function generateResumePreviewHTML(data) {
  return `
    <div class="resume-preview-wrapper">
      <div class="resume-template modern-template">
        <div class="resume-header">
          <div class="profile-section">
            <div class="profile-info">
              <h1 class="name">${escapeHtml(data.personal.fullName)}</h1>
              <div class="job-title">${escapeHtml(data.personal.jobTitle)}</div>
              <div class="contact-info">
                <span>${escapeHtml(data.personal.email)}</span>
                <span>${escapeHtml(data.personal.phone)}</span>
                <span>${escapeHtml(data.personal.location)}</span>
              </div>
            </div>
          </div>
          <div class="summary-section">
            <p class="summary-text">${escapeHtml(data.personal.summary)}</p>
          </div>
        </div>

        <div class="resume-body">
          <div class="resume-section">
            <h2 class="section-title">Experience</h2>
            ${data.experience
              .map(
                (exp) => `
              <div class="experience-entry">
                <div class="entry-header">
                  <h4 class="entry-title">${escapeHtml(exp.title)}</h4>
                  <span class="entry-company">${escapeHtml(exp.company)}</span>
                  <span class="entry-dates">${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : "Present"}</span>
                </div>
                <div class="entry-description">${escapeHtml(exp.description).replace(/\n/g, "<br>")}</div>
              </div>
            `,
              )
              .join("")}
          </div>

          <div class="resume-section">
            <h2 class="section-title">Education</h2>
            ${data.education
              .map(
                (edu) => `
              <div class="education-entry">
                <div class="entry-header">
                  <h4 class="entry-title">${escapeHtml(edu.degree)}</h4>
                  <span class="entry-school">${escapeHtml(edu.school)}</span>
                  <span class="entry-dates">${escapeHtml(edu.year)}</span>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>

          <div class="resume-section">
            <h2 class="section-title">Skills</h2>
            <div class="skills-list">
              ${data.skills.technical
                .split(",")
                .map((skill) => `<span class="skill-tag">${escapeHtml(skill.trim())}</span>`)
                .join("")}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

function usePreviewedResume() {
  if (currentPreviewedResume) {
    closeResumePreview()
    loadSelectedResume(currentPreviewedResume)
  }
}

function closeResumePreview() {
  const modal = document.getElementById("resumePreviewModal")
  if (modal) {
    modal.style.display = "none"
  }
  currentPreviewedResume = null
}

function hasExistingData() {
  return (
    resumeData.personal.fullName ||
    resumeData.personal.email ||
    resumeData.experience.length > 0 ||
    resumeData.education.length > 0
  )
}

function showSuccessMessage(message) {
  // Create and show success toast
  const toast = document.createElement("div")
  toast.className = "success-toast"
  toast.textContent = message
  document.body.appendChild(toast)

  // Show toast
  setTimeout(() => toast.classList.add("show"), 100)

  // Hide and remove toast
  setTimeout(() => {
    toast.classList.remove("show")
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 300)
  }, 4000)
}

// Enhanced auto-save with better error handling
function enhancedAutoSave() {
  try {
    const saveData = {
      resumeData,
      coverLetterData,
      uiSettings,
      timestamp: Date.now(),
      version: "2.0",
    }

    localStorage.setItem("cmr_autosave", JSON.stringify(saveData))
    localStorage.setItem("cmr_backup", JSON.stringify(saveData)) // Backup copy

    // Show subtle save indicator
    showSaveIndicator()
  } catch (error) {
    console.warn("Auto-save failed:", error)
    // Try to free up space by removing old data
    try {
      localStorage.removeItem("cmr_old_data")
      localStorage.setItem(
        "cmr_autosave",
        JSON.stringify({
          resumeData,
          coverLetterData,
          uiSettings,
          timestamp: Date.now(),
        }),
      )
    } catch (secondError) {
      console.error("Critical: Unable to save data", secondError)
    }
  }
}

function showSaveIndicator() {
  const indicator = document.createElement("div")
  indicator.className = "save-indicator"
  indicator.innerHTML = "💾 Saved"
  document.body.appendChild(indicator)

  setTimeout(() => indicator.classList.add("show"), 100)
  setTimeout(() => {
    indicator.classList.remove("show")
    setTimeout(() => {
      if (document.body.contains(indicator)) {
        document.body.removeChild(indicator)
      }
    }, 300)
  }, 2000)
}

// Override the existing autoSaveData function
function autoSaveData() {
  enhancedAutoSave()
}

// Initialize quit bot when page loads
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".builder-container")) {
    initializeQuitBot()
  }
})

// --- ATS OPTIMIZER — 25-CONDITION KEYWORD ENGINE ---

const ATS_ACTION_VERBS = [
  "led","managed","developed","built","created","designed","implemented","delivered",
  "achieved","improved","increased","reduced","launched","established","coordinated",
  "executed","streamlined","optimized","spearheaded","drove","collaborated","oversaw",
  "mentored","negotiated","resolved","analyzed","automated","deployed","migrated",
  "integrated","architected","scaled","secured","transformed","generated"
]

const ATS_TECH_KEYWORDS = [
  // Software & Web
  "javascript","typescript","python","java","c++","c#","php","ruby","swift","kotlin","go","rust",
  "react","angular","vue","next.js","node.js","express","django","flask","spring","laravel",
  "html","css","sass","tailwind","bootstrap","jquery","webpack","vite",
  // Data & AI
  "sql","postgresql","mysql","mongodb","redis","elasticsearch","firebase",
  "machine learning","deep learning","data science","nlp","computer vision","pytorch","tensorflow",
  "pandas","numpy","scikit-learn","tableau","power bi","excel","data analysis","analytics",
  // Cloud & DevOps
  "aws","azure","gcp","docker","kubernetes","terraform","ansible","jenkins","github actions",
  "ci/cd","devops","linux","bash","git","github","bitbucket","jira","confluence",
  "microservices","rest api","graphql","grpc","kafka","rabbitmq","nginx","cloudflare",
  // Management & Business
  "project management","product management","agile","scrum","kanban","stakeholder",
  "leadership","strategy","roadmap","budget","cost reduction","revenue","p&l",
  "cross-functional","team management","mentoring","onboarding","kpi","okr",
  // Design & Marketing
  "ui/ux","figma","adobe","photoshop","illustrator","user research","wireframe","prototype",
  "seo","sem","google analytics","content marketing","social media","email marketing","crm","salesforce",
  // Finance & Operations
  "financial analysis","forecasting","accounting","erp","sap","supply chain","procurement","compliance",
  // Healthcare & Other
  "clinical","research","quality assurance","testing","automation","selenium","cypress","jest"
]

const ATS_POWER_WORDS = [
  "achieved","delivered","exceeded","accelerated","boosted","maximized","surpassed",
  "outperformed","transformed","revolutionized","pioneered","championed","elevated",
  "led","managed","built","launched","designed","developed","implemented","optimized",
  "reduced","increased","improved","created","established","streamlined","automated",
  "collaborated","coordinated","spearheaded","initiated","drove","generated","saved"
]

const FIRST_PERSON_PRONOUNS = /\b(I|me|my|myself|I'm|I've|I'll|I'd)\b/i

function updateATSScore() {
  const conditions = [] // { passed, points, tip }
  const { personal, experience, education, skills, additional } = resumeData

  const allText = [
    personal.fullName, personal.jobTitle, personal.summary,
    ...experience.map(e => e.title + " " + e.company + " " + e.description),
    skills.technical, skills.soft, additional.certifications, additional.projects
  ].join(" ").toLowerCase()

  const summaryWords = personal.summary ? personal.summary.trim().split(/\s+/).length : 0
  const techSkillsList = skills.technical ? skills.technical.split(",").map(s => s.trim()).filter(Boolean) : []
  const softSkillsList = skills.soft ? skills.soft.split(",").map(s => s.trim()).filter(Boolean) : []

  // ── CONDITION 1: Full name ────────────────── (4 pts)
  conditions.push({ passed: !!personal.fullName?.trim(), points: 4, tip: "Add your full name" })

  // ── CONDITION 2: Professional email ──────── (4 pts)
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email || "")
  conditions.push({ passed: emailOk, points: 4, tip: "Add a valid email address" })

  // ── CONDITION 3: Phone number ─────────────── (3 pts)
  conditions.push({ passed: !!(personal.phone?.trim()), points: 3, tip: "Add your phone number" })

  // ── CONDITION 4: Location ─────────────────── (2 pts)
  conditions.push({ passed: !!(personal.location?.trim()), points: 2, tip: "Add your city/location" })

  // ── CONDITION 5: LinkedIn profile ────────── (3 pts)
  conditions.push({ passed: !!(personal.linkedin?.trim()), points: 3, tip: "Add your LinkedIn profile URL" })

  // ── CONDITION 6: Professional summary ────── (4 pts)
  conditions.push({ passed: summaryWords >= 20, points: 4, tip: "Add a professional summary (20+ words)" })

  // ── CONDITION 7: Summary optimal length ──── (2 pts)
  conditions.push({ passed: summaryWords >= 30 && summaryWords <= 150, points: 2, tip: "Keep summary between 30–150 words for ATS" })

  // ── CONDITION 8: No 1st-person in summary ── (3 pts)
  const noFirstPerson = !FIRST_PERSON_PRONOUNS.test(personal.summary || "")
  conditions.push({ passed: noFirstPerson, points: 3, tip: "Remove 'I', 'my', 'me' from summary — use third-person style" })

  // ── CONDITION 9: Job title in summary ────── (2 pts)
  const jobWords = (personal.jobTitle || "").toLowerCase().split(/\s+/).filter(w => w.length > 3)
  const titleInSummary = jobWords.length > 0 && jobWords.some(w => (personal.summary || "").toLowerCase().includes(w))
  conditions.push({ passed: titleInSummary, points: 2, tip: "Include your job title keyword in the summary" })

  // ── CONDITION 10: Has experience ─────────── (5 pts)
  conditions.push({ passed: experience.length > 0, points: 5, tip: "Add at least one work experience" })

  // ── CONDITION 11: 2+ experiences ─────────── (3 pts)
  conditions.push({ passed: experience.length >= 2, points: 3, tip: "Add 2+ work experiences for stronger ATS match" })

  // ── CONDITION 12: Action verbs in experience (4 pts)
  const usesActionVerbs = experience.some(e =>
    ATS_ACTION_VERBS.some(v => (e.description || "").toLowerCase().includes(v))
  )
  conditions.push({ passed: usesActionVerbs, points: 4, tip: `Start bullet points with action verbs (led, built, managed, delivered...)` })

  // ── CONDITION 13: Quantified achievements ── (4 pts)
  const hasNumbers = experience.some(e => /\d+/.test(e.description || ""))
  conditions.push({ passed: hasNumbers, points: 4, tip: "Add numbers/metrics to experience (e.g. improved speed by 40%)" })

  // ── CONDITION 14: Experience has dates ───── (2 pts)
  const hasDates = experience.every(e => e.startDate)
  conditions.push({ passed: experience.length > 0 && hasDates, points: 2, tip: "Add start/end dates to all experiences" })

  // ── CONDITION 15: Experience descriptions ── (3 pts)
  const hasRichDesc = experience.every(e => (e.description || "").length > 50)
  conditions.push({ passed: experience.length > 0 && hasRichDesc, points: 3, tip: "Add detailed descriptions to all experiences (50+ chars each)" })

  // ── CONDITION 16: Education ───────────────── (4 pts)
  conditions.push({ passed: education.length > 0, points: 4, tip: "Add your education background" })

  // ── CONDITION 17: Technical skills ──────── (4 pts)
  conditions.push({ passed: techSkillsList.length >= 3, points: 4, tip: "Add at least 3 technical skills" })

  // ── CONDITION 18: 6+ technical skills ───── (3 pts)
  conditions.push({ passed: techSkillsList.length >= 6, points: 3, tip: "List 6+ technical skills for better ATS keyword matching" })

  // ── CONDITION 19: Soft skills ────────────── (2 pts)
  conditions.push({ passed: softSkillsList.length >= 2, points: 2, tip: "Add soft skills (leadership, communication, etc.)" })

  // ── CONDITION 20: Industry keywords ≥ 3 ──── (4 pts)
  const keywordMatches = ATS_TECH_KEYWORDS.filter(k => allText.includes(k))
  conditions.push({ passed: keywordMatches.length >= 3, points: 4, tip: `Add industry keywords — try: ${ATS_TECH_KEYWORDS.filter(k => !allText.includes(k)).slice(0,3).join(", ")}` })

  // ── CONDITION 20b: Keywords ≥ 6 (bonus) ──── (3 pts)
  conditions.push({ passed: keywordMatches.length >= 6, points: 3, tip: "List 6+ industry keywords for top ATS matching" })

  // ── CONDITION 21: Power/impact words ─────── (4 pts)
  const powerMatches = ATS_POWER_WORDS.filter(w => allText.includes(w))
  conditions.push({ passed: powerMatches.length >= 2, points: 4, tip: "Use action/impact words: led, built, achieved, reduced, increased..." })

  // ── CONDITION 21b: 5+ power words ────────── (2 pts)
  conditions.push({ passed: powerMatches.length >= 5, points: 2, tip: "Use 5+ action verbs across your experience descriptions" })

  // ── CONDITION 22: Languages ───────────────── (2 pts)
  conditions.push({ passed: !!(skills.languages?.trim()), points: 2, tip: "Add languages you speak (e.g. English, Tamil, Hindi)" })

  // ── CONDITION 23: Certifications ─────────── (3 pts)
  conditions.push({ passed: !!(additional.certifications?.trim()), points: 3, tip: "Add certifications (AWS, Google, PMP, Coursera, etc.)" })

  // ── CONDITION 24: Projects ─────────────────  (3 pts)
  conditions.push({ passed: !!(additional.projects?.trim()), points: 3, tip: "Add 1–2 projects with tech stack and outcome" })

  // ── CONDITION 25: Awards / achievements ──── (2 pts)
  conditions.push({ passed: !!(additional.awards?.trim()), points: 2, tip: "Add awards or achievements to stand out" })

  // ── CONDITION 26: Volunteer experience ────── (1 pt)
  conditions.push({ passed: !!(additional.volunteer?.trim()), points: 1, tip: "Add volunteer experience — shows initiative" })

  // ── CONDITION 27: Job title filled ────────── (2 pts)
  conditions.push({ passed: !!(personal.jobTitle?.trim()), points: 2, tip: "Add your professional title (e.g. Software Engineer)" })

  // ── CONDITION 28: Profile photo present ────── (1 pt)
  conditions.push({ passed: !!(resumeData.personal?.photo), points: 1, tip: "Upload a professional profile photo" })

  // ── CONDITION 29: Overall completeness ───── (3 pts)
  const filledSections = [personal.fullName, personal.email, personal.phone, personal.summary,
    experience.length > 0, education.length > 0, skills.technical, skills.soft].filter(Boolean).length
  conditions.push({ passed: filledSections >= 7, points: 3, tip: "Complete all resume sections for maximum ATS score" })

  // ── CONDITION 30: Experience desc richness ── (2 pts)
  const avgDescLen = experience.length > 0
    ? experience.reduce((s,e) => s + (e.description||"").length, 0) / experience.length : 0
  conditions.push({ passed: avgDescLen >= 100, points: 2, tip: "Make experience descriptions more detailed (100+ chars each)" })

  // ── Calculate score (score = earned/max * 100, baseline boosted so complete = 85+) ──
  const maxScore = conditions.reduce((s, c) => s + c.points, 0)
  const earned = conditions.filter(c => c.passed).reduce((s, c) => s + c.points, 0)
  // Scale so well-filled resumes score 85-95 (matching industry-standard ATS tools)
  // Formula: floor of 30 for any resume, then scale the rest to 70 points
  // 100% → 99, 80% → 86, 60% → 72, 40% → 58, 0% → 30
  const rawPct = earned / maxScore
  atsScore = Math.min(99, Math.round(30 + (rawPct * 69)))

  const failed = conditions.filter(c => !c.passed)

  // ── Update sidebar score ─────────────────────
  const scoreEl = document.getElementById("atsScore")
  const tipsEl = document.getElementById("atsTips")

  if (scoreEl) {
    scoreEl.textContent = atsScore
    // Update the SVG ring fill (new structure) — do NOT overwrite .ats-ring-inner class
    const ring = document.getElementById("atsRingFill")
    if (ring) {
      const circumference = 213.6
      const offset = circumference - (atsScore / 100) * circumference
      ring.style.strokeDashoffset = offset
      ring.style.stroke = atsScore >= 80 ? "#22a06b" : atsScore >= 60 ? "#f0a500" : "#ef4444"
    }
    // Color the score number to match
    scoreEl.style.color = atsScore >= 80 ? "#22a06b" : atsScore >= 60 ? "#f0a500" : "#ef4444"
  }

  if (tipsEl) {
    if (failed.length === 0) {
      tipsEl.innerHTML = '<div class="ats-tip success">🎯 Perfect! Your resume is fully ATS optimized</div>'
    } else {
      tipsEl.innerHTML = failed.slice(0, 3).map(c =>
        `<div class="ats-tip">⚠ ${c.tip}</div>`
      ).join("") + (failed.length > 3 ? `<div class="ats-tip-more">+${failed.length-3} more issues — click Analyze</div>` : "")
    }
  }
}

function getScoreClass(score) {
  if (score >= 85) return "excellent"
  if (score >= 65) return "good"
  if (score >= 45) return "fair"
  return "poor"
}

// --- AUTO-SAVE FUNCTIONALITY ---
function loadAutoSavedData() {
  try {
    const saved = localStorage.getItem("cmr_autosave")
    if (saved) {
      const data = JSON.parse(saved)

      // Only load if data is less than 7 days old
      if (Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000) {
        resumeData = { ...resumeData, ...data.resumeData }
        coverLetterData = { ...coverLetterData, ...data.coverLetterData }
        uiSettings = { ...uiSettings, ...data.uiSettings }
      }
    }
  } catch (error) {
    console.warn("Failed to load auto-saved data:", error)
  }
}

function clearDraft() {
  if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
    localStorage.removeItem("cmr_autosave")
    localStorage.removeItem("resumeData")
    localStorage.removeItem("uiSettings")
    localStorage.removeItem("coverLetterData")
    location.reload()
  }
}

// --- ENHANCED DYNAMIC FORM ELEMENTS ---
function addExperience(data = {}) {
  const id = data.id || `exp-${Date.now()}`
  const list = document.getElementById("experienceList")
  if (!list) return

  const item = document.createElement("div")
  item.className = "experience-item animate-slide-in"
  item.dataset.id = id
  item.innerHTML = `
    <div class="item-header">
      <h4 class="item-title">${escapeHtml(data.title || "New Experience")}</h4>
      <button type="button" class="btn-remove" onclick="removeExperience('${id}')">&times;</button>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label>Job Title *</label>
        <input type="text" data-field="title" value="${escapeHtml(data.title || "")}" required>
      </div>
      <div class="form-group">
        <label>Company *</label>
        <input type="text" data-field="company" value="${escapeHtml(data.company || "")}" required>
      </div>
      <div class="form-group">
        <label>Start Date *</label>
        <input type="month" data-field="startDate" value="${escapeHtml(data.startDate || "")}" required>
      </div>
      <div class="form-group">
        <label>End Date (leave empty for current)</label>
        <input type="month" data-field="endDate" value="${escapeHtml(data.endDate || "")}">
      </div>
      <div class="form-group full-width">
        <label>Description (use bullet points) *</label>
        <textarea data-field="description" placeholder="• Achieved X by doing Y&#10;• Improved Z by N%&#10;• Led team of N people" required>${escapeHtml(data.description || "")}</textarea>
      </div>
    </div>
  `
  list.appendChild(item)

  // Add input listeners to new elements
  item.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", debounce(updatePreview, 300))
  })
}

function removeExperience(id) {
  const item = document.querySelector(`.experience-item[data-id="${id}"]`)
  if (item) {
    item.remove()
    updatePreview()
  }
}

function addEducation(data = {}) {
  const id = data.id || `edu-${Date.now()}`
  const list = document.getElementById("educationList")
  if (!list) return

  const item = document.createElement("div")
  item.className = "education-item animate-slide-in"
  item.dataset.id = id
  item.innerHTML = `
    <div class="item-header">
      <h4 class="item-title">${escapeHtml(data.degree || "New Education")}</h4>
      <button type="button" class="btn-remove" onclick="removeEducation('${id}')">&times;</button>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label>Degree / Certificate *</label>
        <input type="text" data-field="degree" value="${escapeHtml(data.degree || "")}" required>
      </div>
      <div class="form-group">
        <label>School / Institution *</label>
        <input type="text" data-field="school" value="${escapeHtml(data.school || "")}" required>
      </div>
      <div class="form-group">
        <label>Year of Completion *</label>
        <input type="text" data-field="year" value="${escapeHtml(data.year || "")}" placeholder="2023" required>
      </div>
    </div>
  `
  list.appendChild(item)

  // Add input listeners to new elements
  item.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", debounce(updatePreview, 300))
  })
}

function removeEducation(id) {
  const item = document.querySelector(`.education-item[data-id="${id}"]`)
  if (item) {
    item.remove()
    updatePreview()
  }
}

// --- ENHANCED ACTIONS ---
function downloadPDF() {
  const element = document.querySelector("#previewContent .resume-template")
  if (!element) {
    alert("Please wait for the preview to load")
    return
  }

  const filename = `${resumeData.personal.fullName || "Resume"}.pdf`
  const opt = {
    margin: 0.2,
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  }

  loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js").then(() => {
    window.html2pdf().set(opt).from(element).save()
  })
}

function exportData() {
  const exportData = {
    resumeData,
    coverLetterData,
    uiSettings,
    exportDate: new Date().toISOString(),
  }

  const dataStr = JSON.stringify(exportData, null, 2)
  const blob = new Blob([dataStr], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${resumeData.personal.fullName || "resume"}-data.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importData() {
  const fileInput = document.getElementById("importFileInput")
  if (fileInput) {
    fileInput.value = ""
    fileInput.click()
  }
}

function handleImportFile(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result)

      if (importedData.resumeData) {
        resumeData = { ...resumeData, ...importedData.resumeData }
      }
      if (importedData.coverLetterData) {
        coverLetterData = { ...coverLetterData, ...importedData.coverLetterData }
      }
      if (importedData.uiSettings) {
        uiSettings = { ...uiSettings, ...importedData.uiSettings }
      }

      populateForm()
      updatePreview()
      updateCoverPreview()
      showSuccessMessage("✅ Data imported successfully!")
    } catch (err) {
      alert("Error importing file. Please ensure it's a valid JSON file.")
    }
  }
  reader.readAsText(file)
}

function loadSampleData() {
  if (!confirm("This will replace your current data. Are you sure?")) return

  resumeData = {
    personal: {
      fullName: "Jane Doe",
      jobTitle: "Senior Product Manager",
      email: "jane.doe@example.com",
      phone: "(123) 456-7890",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/janedoe",
      summary:
        "Results-driven Senior Product Manager with over 8 years of experience in delivering innovative and user-centric products from conception to launch. Proven ability to lead cross-functional teams and manage product lifecycles in fast-paced, agile environments.",
      photo: "",
    },
    experience: [
      {
        id: "exp-1",
        title: "Senior Product Manager",
        company: "Tech Solutions Inc.",
        startDate: "2018-06",
        endDate: "",
        description:
          "• Led the development of a new SaaS platform, resulting in a 30% increase in user engagement\n• Managed a team of 5 product managers and designers\n• Defined product strategy and roadmap based on market research and user feedback",
      },
      {
        id: "exp-2",
        title: "Product Manager",
        company: "StartupCorp",
        startDate: "2016-03",
        endDate: "2018-05",
        description:
          "• Launched 3 major product features that increased user retention by 25%\n• Collaborated with engineering teams to deliver products on time and within budget\n• Conducted user research and A/B testing to optimize product performance",
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "MBA, Business Administration",
        school: "Stanford University",
        year: "2016",
      },
      {
        id: "edu-2",
        degree: "BS, Computer Science",
        school: "UC Berkeley",
        year: "2014",
      },
    ],
    skills: {
      technical: "Agile Methodologies, JIRA, Confluence, SQL, Market Research, A/B Testing",
      soft: "Leadership, Strategic Planning, Communication, User-Centered Design, Team Management",
      languages: "English (Native), Spanish (Conversational), French (Basic)",
    },
    additional: {
      certifications: "Certified Scrum Product Owner (CSPO)\nGoogle Analytics Certified",
      projects:
        "E-commerce Platform - Led development of full-stack platform serving 10k+ users\nMobile App - Designed and launched iOS/Android app with 4.8 star rating",
      awards: "Product of the Year Award 2021\nEmployee Excellence Award 2020",
      volunteer: "Volunteer Web Developer at Local Non-profit (2022-Present)",
    },
  }

  coverLetterData = {
    jobTitle: "Senior Product Manager",
    company: "Google",
    manager: "Sarah Johnson",
    fit: "With over 8 years of product management experience and a proven track record of launching successful products, I am excited about the opportunity to contribute to Google's innovative product ecosystem. My experience in leading cross-functional teams and driving user-centric product development aligns perfectly with this role.",
    additional:
      "I am particularly drawn to Google's mission of organizing the world's information and making it universally accessible. I would love to discuss how my background in SaaS platforms and mobile applications can contribute to your team's success.",
  }

  populateForm()
  updatePreview()
  updateCoverPreview()
}

// --- UI & THEME ENHANCEMENTS ---
function toggleTheme() {
  uiSettings.theme = uiSettings.theme === "light" ? "dark" : "light"
  updateTheme()
  saveState()
}

function updateTheme() {
  document.documentElement.dataset.theme = uiSettings.theme
  document.querySelectorAll(".theme-icon").forEach((icon) => {
    icon.textContent = uiSettings.theme === "light" ? "🌙" : "☀️"
  })
}

function changeTemplate() {
  const select = document.getElementById("templateSelect")
  if (select) {
    uiSettings.template = select.value
    updatePreview()
    saveState()
  }
}

function changeFont() {
  const select = document.getElementById("fontSelect")
  if (select) {
    uiSettings.font = select.value
    updatePreview()
    saveState()
  }
}

function changeColor(color) {
  uiSettings.color = color
  const activeBtn = document.querySelector(".color-btn.active")
  if (activeBtn) activeBtn.classList.remove("active")
  const newActiveBtn = document.querySelector(`.color-btn[data-color="${color}"]`)
  if (newActiveBtn) newActiveBtn.classList.add("active")
  updatePreview()
  saveState()
}

function toggleATSMode() {
  uiSettings.atsMode = !uiSettings.atsMode
  const toggle = document.getElementById("atsToggle")
  if (toggle) {
    toggle.classList.toggle("active", uiSettings.atsMode)
  }
  updatePreview()
  saveState()
}

function showTab(tabName) {
  // Remove active class from all tabs and content
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))
  document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"))

  // Add active class to selected tab and content
  const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`)
  const tabContent = document.getElementById(tabName)

  if (tabBtn) tabBtn.classList.add("active")
  if (tabContent) tabContent.classList.add("active")

  // Update form validation
  validateCurrentTab(tabName)
}

function validateCurrentTab(tabName) {
  const tabContent = document.getElementById(tabName)
  if (!tabContent) return

  const requiredFields = tabContent.querySelectorAll("[required]")
  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      field.classList.add("error")
    } else {
      field.classList.remove("error")
    }
  })
}

function handlePhotoUpload(event) {
  const file = event.target.files[0]
  if (file) {
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Photo size must be less than 2MB")
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      resumeData.personal.photo = e.target.result
      const preview = document.getElementById("photoPreview")
      if (preview) {
        preview.style.backgroundImage = `url(${resumeData.personal.photo})`
        preview.classList.add("has-image")
      }
      updatePreview()
      autoSaveData()
    }
    reader.readAsDataURL(file)
  }
}

function updateProgress() {
  let completed = 0
  const total = 8 // Updated total sections

  if (resumeData.personal.fullName && resumeData.personal.email && resumeData.personal.phone) completed++
  if (resumeData.personal.summary && resumeData.personal.summary.length > 20) completed++
  if (resumeData.experience.length > 0) completed++
  if (resumeData.education.length > 0) completed++
  if (resumeData.skills.technical) completed++
  if (resumeData.skills.soft) completed++
  if (resumeData.skills.languages) completed++
  if (resumeData.additional.certifications || resumeData.additional.projects) completed++

  const percentage = Math.round((completed / total) * 100)
  const progressFill = document.getElementById("progressFill")
  const progressText = document.getElementById("progressText")

  if (progressFill) progressFill.style.width = `${percentage}%`
  if (progressText) progressText.textContent = `${percentage}% Complete`
}

// --- MULTILINGUAL SUPPORT ---
function setupLanguage() {
  const selector = document.getElementById("languageSelector")
  if (selector) {
    selector.value = uiSettings.language
    updateLanguage()
  }
}

function changeLanguage() {
  const selector = document.getElementById("languageSelector")
  if (selector) {
    uiSettings.language = selector.value
    updateLanguage()
    saveState()
  }
}

function updateLanguage() {
  const lang = uiSettings.language
  const elements = document.querySelectorAll("[data-i18n]")

  elements.forEach((element) => {
    const key = element.getAttribute("data-i18n")
    if (translations[lang] && translations[lang][key]) {
      element.textContent = translations[lang][key]
    }
  })
}

// --- OFFLINE SUPPORT ---
function initializeOfflineDetection() {
  const indicator = document.getElementById("offlineIndicator")

  function updateOnlineStatus() {
    if (indicator) {
      if (navigator.onLine) {
        indicator.classList.add("hidden")
      } else {
        indicator.classList.remove("hidden")
      }
    }
  }

  window.addEventListener("online", updateOnlineStatus)
  window.addEventListener("offline", updateOnlineStatus)
  updateOnlineStatus()
}

// --- UTILITY FUNCTIONS ---
function debounce(func, wait) {
  let timer
  return function executedFunction(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => func(...args), wait)
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }

    const script = document.createElement("script")
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function saveState() {
  try {
    localStorage.setItem("resumeData", JSON.stringify(resumeData))
    localStorage.setItem("uiSettings", JSON.stringify(uiSettings))
    localStorage.setItem("coverLetterData", JSON.stringify(coverLetterData))
  } catch (error) {
    console.warn("Failed to save state:", error)
  }
}

function loadState() {
  try {
    const savedResumeData = localStorage.getItem("resumeData")
    const savedUISettings = localStorage.getItem("uiSettings")
    const savedCoverData = localStorage.getItem("coverLetterData")

    if (savedResumeData) resumeData = { ...resumeData, ...JSON.parse(savedResumeData) }
    if (savedUISettings) uiSettings = { ...uiSettings, ...JSON.parse(savedUISettings) }
    if (savedCoverData) coverLetterData = { ...coverLetterData, ...JSON.parse(savedCoverData) }
  } catch (error) {
    console.warn("Failed to load state:", error)
  }
}

// --- ANALYZER FUNCTIONS (Enhanced) ---
function analyzeResume() {
  updateATSScore()
  const modal = document.getElementById("analyzerModal")
  if (!modal) return

  const { personal, experience, education, skills, additional } = resumeData
  const allText = [personal.fullName, personal.jobTitle, personal.summary,
    ...experience.map(e => (e.title||"") + " " + (e.company||"") + " " + (e.description||"")),
    skills.technical, skills.soft, additional.certifications, additional.projects
  ].join(" ").toLowerCase()

  const summaryWords = personal.summary ? personal.summary.trim().split(/\s+/).length : 0
  const techSkillsList = skills.technical ? skills.technical.split(",").map(s => s.trim()).filter(Boolean) : []
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email || "")

  const checks = [
    { cat: "Contact Info", label: "Full name present", ok: !!personal.fullName?.trim() },
    { cat: "Contact Info", label: "Valid email address", ok: emailOk },
    { cat: "Contact Info", label: "Phone number", ok: !!personal.phone?.trim() },
    { cat: "Contact Info", label: "Location / city", ok: !!personal.location?.trim() },
    { cat: "Contact Info", label: "LinkedIn profile URL", ok: !!personal.linkedin?.trim() },
    { cat: "Summary", label: "Summary present (20+ words)", ok: summaryWords >= 20 },
    { cat: "Summary", label: "Optimal length (30–150 words)", ok: summaryWords >= 30 && summaryWords <= 150 },
    { cat: "Summary", label: "No first-person pronouns (I/me/my)", ok: !FIRST_PERSON_PRONOUNS.test(personal.summary || "") },
    { cat: "Summary", label: "Job title keyword in summary", ok: (personal.jobTitle||"").toLowerCase().split(/\s+/).filter(w=>w.length>3).some(w=>(personal.summary||"").toLowerCase().includes(w)) },
    { cat: "Experience", label: "At least 1 work experience", ok: experience.length > 0 },
    { cat: "Experience", label: "2+ work experiences", ok: experience.length >= 2 },
    { cat: "Experience", label: "Action verbs used (led, built, managed…)", ok: experience.some(e => ATS_ACTION_VERBS.some(v => (e.description||"").toLowerCase().includes(v))) },
    { cat: "Experience", label: "Quantified achievements (numbers/metrics)", ok: experience.some(e => /\d+/.test(e.description||"")) },
    { cat: "Experience", label: "All experiences have dates", ok: experience.length > 0 && experience.every(e => e.startDate) },
    { cat: "Experience", label: "Rich descriptions (50+ chars each)", ok: experience.length > 0 && experience.every(e => (e.description||"").length > 50) },
    { cat: "Education", label: "Education section present", ok: education.length > 0 },
    { cat: "Skills", label: "3+ technical skills", ok: techSkillsList.length >= 3 },
    { cat: "Skills", label: "6+ technical skills (ATS keyword matching)", ok: techSkillsList.length >= 6 },
    { cat: "Skills", label: "2+ soft skills listed", ok: (skills.soft||"").split(",").filter(Boolean).length >= 2 },
    { cat: "Keywords", label: "3+ industry tech keywords found", ok: ATS_TECH_KEYWORDS.filter(k => allText.includes(k)).length >= 3 },
    { cat: "Keywords", label: "Impact/power words used", ok: ATS_POWER_WORDS.some(w => allText.includes(w)) },
    { cat: "Additional", label: "Languages listed", ok: !!skills.languages?.trim() },
    { cat: "Additional", label: "Certifications added", ok: !!additional.certifications?.trim() },
    { cat: "Additional", label: "Projects added", ok: !!additional.projects?.trim() },
    { cat: "Overall", label: "All major sections complete (7/8)", ok: [personal.fullName, personal.email, personal.phone, personal.summary, experience.length>0, education.length>0, skills.technical, skills.soft].filter(Boolean).length >= 7 },
  ]

  const cats = [...new Set(checks.map(c => c.cat))]
  const getScore = catList => {
    const grp = checks.filter(c => catList.includes(c.cat))
    return grp.length ? Math.round(grp.filter(c=>c.ok).length / grp.length * 100) : 0
  }
  const contentScore  = getScore(["Summary","Experience"])
  const atsCompatScore = getScore(["Contact Info","Skills","Keywords"])
  const completeness  = Math.round(checks.filter(c=>c.ok).length / checks.length * 100)

  const scoreValue = document.getElementById("scoreValue")
  if (scoreValue) {
    scoreValue.textContent = atsScore
    const circle = scoreValue.closest(".score-circle")
    if (circle) circle.style.background = `conic-gradient(var(--primary-color) ${atsScore}%, #e5e7eb ${atsScore}%)`
  }

  const fills = document.querySelectorAll("#analyzerModal .breakdown-fill")
  const scores = document.querySelectorAll("#analyzerModal .breakdown-score")
  if (fills[0]) fills[0].style.width = contentScore + "%"
  if (fills[1]) fills[1].style.width = atsCompatScore + "%"
  if (fills[2]) fills[2].style.width = completeness + "%"
  if (scores[0]) scores[0].textContent = contentScore + "%"
  if (scores[1]) scores[1].textContent = atsCompatScore + "%"
  if (scores[2]) scores[2].textContent = completeness + "%"

  const suggestionsList = document.getElementById("suggestionsList")
  if (suggestionsList) {
    suggestionsList.innerHTML = cats.map(cat => {
      const grp = checks.filter(c => c.cat === cat)
      const items = grp.map(c =>
        `<li class="ats-check-item ${c.ok ? 'ats-pass' : 'ats-fail'}">
          <span class="ats-check-icon">${c.ok ? '✅' : '❌'}</span>
          <span>${c.label}</span>
        </li>`).join("")
      return `<li class="ats-cat-header">${cat} <span class="ats-cat-score">${grp.filter(c=>c.ok).length}/${grp.length}</span></li>${items}`
    }).join("")
  }

  modal.style.display = "block"
}

function closeAnalyzer() {
  const modal = document.getElementById("analyzerModal")
  if (modal) {
    modal.style.display = "none"
  }
}

function toggleEditablePreview() {
  const content = document.getElementById("previewContent")
  const btn = document.getElementById("editPreviewBtn")
  if (!content) return

  const isEditable = content.getAttribute("contenteditable") === "true"
  if (isEditable) {
    content.removeAttribute("contenteditable")
    content.style.outline = ""
    if (btn) { btn.classList.remove("active"); btn.title = "Edit preview directly"; btn.textContent = "✏️"; }
  } else {
    content.setAttribute("contenteditable", "true")
    content.focus()
    if (btn) { btn.classList.add("active"); btn.title = "Stop editing"; btn.textContent = "✅"; }
  }
}

function togglePreview() {
  const previewPanel = document.querySelector(".preview-panel")
  if (!previewPanel) return
  previewPanel.classList.toggle("collapsed")
  const isCollapsed = previewPanel.classList.contains("collapsed")
  previewPanel.style.width = isCollapsed ? "0" : ""
  previewPanel.style.minWidth = isCollapsed ? "0" : ""
  previewPanel.style.overflow = isCollapsed ? "hidden" : ""
}

function togglePreviewSize() {
  const previewPanel = document.querySelector(".preview-panel")
  if (!previewPanel) return
  previewPanel.classList.toggle("expanded")
  const isExpanded = previewPanel.classList.contains("expanded")
  // Expanded = half the screen for comfortable editing; normal = 380px
  previewPanel.style.width = isExpanded ? "50vw" : "380px"
  previewPanel.style.minWidth = isExpanded ? "50vw" : "380px"
  // zoom is handled by the .expanded class in CSS
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch((err) => {
      console.warn("Service worker registration failed:", err)
    })
  }
}

// Make functions globally available
window.toggleTheme = toggleTheme
window.changeTemplate = changeTemplate
window.changeFont = changeFont
window.changeColor = changeColor
window.toggleATSMode = toggleATSMode
window.showTab = showTab
window.addExperience = addExperience
window.removeExperience = removeExperience
window.addEducation = addEducation
window.removeEducation = removeEducation
window.handlePhotoUpload = handlePhotoUpload
window.downloadPDF = downloadPDF
window.exportData = exportData
window.importData = importData
window.handleImportFile = handleImportFile
window.loadSampleData = loadSampleData
window.analyzeResume = analyzeResume
window.closeAnalyzer = closeAnalyzer
window.updateCoverPreview = updateCoverPreview
window.downloadCoverLetterPDF = downloadCoverLetterPDF
window.toggleCoverLetter = toggleCoverLetter
window.changeLanguage = changeLanguage
window.clearDraft = clearDraft
window.loadTCSResume = loadTCSResume
window.loadInfosysResume = loadInfosysResume
window.loadZohoResume = loadZohoResume
window.previewResume = previewResume
window.usePreviewedResume = usePreviewedResume
window.closeResumePreview = closeResumePreview
window.continueBuilding = continueBuilding
window.generateCoverLetter = generateCoverLetter
window.loadQuickTips = loadQuickTips
window.closeQuitBot = closeQuitBot
window.generateAICover = generateAICover
window.downloadCoverPDF = downloadCoverLetterPDF
window.updatePreview = updatePreview
window.togglePreview = togglePreview
window.togglePreviewSize = togglePreviewSize

// Register service worker on load
registerServiceWorker()
