// Debug so we know the script is running
console.log("app.js loaded");

// ======================
// Global question config
// ======================

const QUESTIONS = [
  {
    id: "q1",
    label: "Q1",
    video: "Q01_TellMeAboutYourself.mp4",
    title: "Tell me about yourself"
  },
  {
    id: "q2",
    label: "Q2",
    video: "Q02_whydoyouwant.mp4",
    title: "Why do you want this job?"
  },
  {
    id: "q3",
    label: "Q3",
    video: "Q03_whyareyouleaving.mp4",
    title: "Why are you leaving your current job?"
  },
  {
    id: "q4",
    label: "Q4",
    video: "Q04_whatstrengths.mp4",
    title: "What are your strengths?"
  },
  {
    id: "q5",
    label: "Q5",
    video: "Q05_whatweaknesses.mp4",
    title: "What are your weaknesses?"
  },
  {
    id: "q6",
    label: "Q6",
    video: "Q06_successteam.mp4",
    title: "Tell me about a time you worked successfully in a team."
  },
  {
    id: "q7",
    label: "Q7",
    video: "Q07_conflicthandle.mp4",
    title: "Tell me about a conflict you had at work and how you handled it."
  },
  {
    id: "q8",
    label: "Q8",
    video: "Q08_leadership.mp4",
    title: "Tell me about a time you showed leadership and took initiative."
  },
  {
    id: "q9",
    label: "Q9",
    video: "Q09_achievement.mp4",
    title: "Tell me about your greatest achievement at work."
  },
  {
    id: "q10",
    label: "Q10",
    video: "Q010_deadlines.mp4",
    title: "How do you handle pressure and tight deadlines?"
  },
  {
    id: "q11",
    label: "Q11",
    video: "Q011_prioritise.mp4",
    title: "How do you prioritise your tasks?"
  },
  {
    id: "q12",
    label: "Q12",
    video: "Q012_motivates.mp4",
    title: "What motivates you?"
  },
  {
    id: "q13",
    label: "Q13",
    video: "Q013_fiveyears.mp4",
    title: "Where do you see yourself in five years?"
  },
  {
    id: "q14",
    label: "Q14",
    video: "Q014_doyouhaveqs.mp4",
    title: "Do you have any questions for us?"
  }
];

// Store recordings per question in memory: { [questionId]: { blob, url } }
const recordings = {};

// ======================
// Helper functions
// ======================

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function getQuestionById(id) {
  return QUESTIONS.find(q => q.id === id);
}

function getQuestionIndexById(id) {
  return QUESTIONS.findIndex(q => q.id === id);
}

function getDefaultQuestion() {
  return QUESTIONS[0];
}

// =====================
// Slide-out menu setup
// =====================

function setupSlideMenu() {
  const menu = document.querySelector(".side-menu");
  const overlay = document.querySelector(".menu-overlay");
  const toggle = document.querySelector(".menu-toggle");
  const closeBtn = document.querySelector(".menu-close");

  if (!menu || !overlay || !toggle) {
    // feedback page might not have all elements
    console.warn("Menu elements not found on this page.");
    return;
  }

  const openMenu = () => {
    menu.classList.add("open");
    overlay.classList.add("visible");
  };

  const closeMenu = () => {
    menu.classList.remove("open");
    overlay.classList.remove("visible");
  };

  toggle.addEventListener("click", openMenu);
  overlay.addEventListener("click", closeMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  // Restart/Login/Credits actions
  const actionButtons = document.querySelectorAll(".side-menu__link[data-action]");
  actionButtons.forEach(btn => {
    btn.addEventListener("click", e => {
      const action = e.currentTarget.dataset.action;

      if (action === "restart") {
        window.location.href = "practice.html";
      } else if (action === "login") {
        alert("Login screen coming soon.");
      } else if (action === "credits") {
        alert("Interview Trainer – prototype by Chris.");
      }

      closeMenu();
    });
  });
}

function buildQuestionMenuList() {
  const listEl = document.getElementById("questionMenuList");
  if (!listEl) return;

  listEl.innerHTML = "";

  QUESTIONS.forEach(q => {
    const li = document.createElement("li");

    const link = document.createElement("a");
    link.href = `practice.html?question=${q.id}`;
    link.className = "side-menu__question-link";

    const labelSpan = document.createElement("span");
    labelSpan.className = "side-menu__question-label";
    labelSpan.textContent = q.label;

    const textSpan = document.createElement("span");
    textSpan.className = "side-menu__question-text";
    textSpan.textContent = q.title;

    link.appendChild(labelSpan);
    link.appendChild(textSpan);
    li.appendChild(link);
    listEl.appendChild(li);
  });
}

// =====================
// Swipe navigation
// =====================

function setupSwipeNavigation(currentQuestion) {
  const practiceEl = document.querySelector(".practice");
  if (!practiceEl || !currentQuestion) return;

  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let isNavigating = false;

  const threshold = 60;
  const restraint = 80;
  const allowedTime = 500;
  const animationDuration = 140; // ms (match CSS ~0.14s)

  practiceEl.addEventListener("touchstart", e => {
    const touch = e.changedTouches[0];
    startX = touch.pageX;
    startY = touch.pageY;
    startTime = new Date().getTime();
  });

  practiceEl.addEventListener("touchend", e => {
    if (isNavigating) return;

    const touch = e.changedTouches[0];
    const distX = touch.pageX - startX;
    const distY = touch.pageY - startY;
    const elapsed = new Date().getTime() - startTime;

    // Ignore if side menu is open
    const menuOpen = document.querySelector(".side-menu.open");
    if (menuOpen) return;

    if (
      elapsed <= allowedTime &&
      Math.abs(distX) >= threshold &&
      Math.abs(distY) <= restraint
    ) {
      const currentIndex = getQuestionIndexById(currentQuestion.id);
      if (currentIndex === -1) return;

      let targetIndex;
      let directionClass;

      if (distX < 0) {
        // swipe left → next
        targetIndex = currentIndex === QUESTIONS.length - 1 ? 0 : currentIndex + 1;
        directionClass = "practice--swipe-left";
      } else {
        // swipe right → previous
        targetIndex = currentIndex === 0 ? QUESTIONS.length - 1 : currentIndex - 1;
        directionClass = "practice--swipe-right";
      }

      const targetQuestion = QUESTIONS[targetIndex];
      if (!targetQuestion) return;

      isNavigating = true;
      practiceEl.classList.add(directionClass);

      setTimeout(() => {
        window.location.href = `practice.html?question=${targetQuestion.id}`;
      }, animationDuration);
    }
  });
}

// ==================
// Practice page init
// ==================

function initPracticePage() {
  const videoEl = document.getElementById("questionVideo");
  const questionLabelEl = document.getElementById("questionLabel");
  const recordButton = document.getElementById("recordButton");
  const recordLabelEl = document.getElementById("recordLabel");
  const playButton = document.getElementById("playAnswerButton");
  const getFeedbackButton = document.getElementById("getFeedbackButton");
  const statusEl = document.getElementById("recordStatus");
  const overlay = document.getElementById("videoPlayOverlay");
  const wrapper = document.getElementById("videoWrapper");

  if (!videoEl || !questionLabelEl || !recordButton || !overlay || !wrapper) {
    console.warn("initPracticePage: missing elements");
    return;
  }

  const queryId = getQueryParam("question");
  const currentQuestion = getQuestionById(queryId) || getDefaultQuestion();

  questionLabelEl.textContent = currentQuestion.label;

  // ----- Load main video -----
  videoEl.src = `videos/${currentQuestion.video}`;
  videoEl.load();

  // Preload next video for smoother swipe
  const currentIndex = getQuestionIndexById(currentQuestion.id);
  const nextIndex = currentIndex === QUESTIONS.length - 1 ? 0 : currentIndex + 1;
  const preload = document.createElement("link");
  preload.rel = "preload";
  preload.as = "video";
  preload.href = `videos/${QUESTIONS[nextIndex].video}`;
  document.head.appendChild(preload);

  // ----- Video overlay play -----
  const playWithSound = () => {
    overlay.classList.add("hidden");
    videoEl.currentTime = 0;
    videoEl.play().catch(err => console.log("Play failed:", err));
  };

  overlay.addEventListener("click", playWithSound);
  wrapper.addEventListener("click", () => {
    if (videoEl.paused) playWithSound();
  });

  videoEl.addEventListener("ended", () => {
    overlay.classList.remove("hidden");
  });

  // ----- Recording (MediaRecorder) -----

  const supportsRecording =
    !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

  let mediaRecorder = null;
  let audioChunks = [];
  let isRecording = false;

  if (!supportsRecording) {
    recordButton.disabled = true;
    if (playButton) playButton.disabled = true;
    if (getFeedbackButton) getFeedbackButton.disabled = true;
    if (statusEl) {
      statusEl.textContent = "Recording is not supported in this browser.";
    }
  } else {
    const existing = recordings[currentQuestion.id];
    if (playButton) playButton.disabled = !existing;
    if (getFeedbackButton) getFeedbackButton.disabled = !existing;

    if (statusEl && !existing) {
      statusEl.textContent = "Tap Record to practise your answer.";
    }
    if (statusEl && existing) {
      statusEl.textContent = "Recording saved. Tap Play or Get feedback.";
    }

    async function startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", e => {
          audioChunks.push(e.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const mimeType = mediaRecorder.mimeType || "audio/webm";
          const blob = new Blob(audioChunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          recordings[currentQuestion.id] = { blob, url };

          if (playButton) playButton.disabled = false;
          if (getFeedbackButton) getFeedbackButton.disabled = false;
          if (statusEl) {
            statusEl.textContent = "Recording saved. Tap Play or Get feedback.";
          }

          // release mic
          stream.getTracks().forEach(t => t.stop());
        });

        mediaRecorder.start();
        isRecording = true;

        recordButton.classList.add("btn-record--active");
        if (recordLabelEl) recordLabelEl.textContent = "Stop";
        if (statusEl) {
          statusEl.textContent = "Recording... tap Stop when you finish.";
        }
      } catch (err) {
        console.error("Error accessing microphone:", err);
        if (statusEl) {
          statusEl.textContent =
            "Could not access the microphone. Check your browser permissions.";
        }
      }
    }

    function stopRecording() {
      if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        recordButton.classList.remove("btn-record--active");
        if (recordLabelEl) recordLabelEl.textContent = "Record";
      }
    }

    recordButton.addEventListener("click", () => {
      if (!supportsRecording) return;
      if (!isRecording) {
        startRecording();
      } else {
        stopRecording();
      }
    });

    if (playButton) {
      playButton.addEventListener("click", () => {
        const rec = recordings[currentQuestion.id];
        if (!rec) {
          if (statusEl) {
            statusEl.textContent = "No recording yet. Tap Record first.";
          }
          return;
        }

        const audio = new Audio(rec.url);
        audio
          .play()
          .then(() => {
            if (statusEl) statusEl.textContent = "Playing your answer...";
          })
          .catch(err => {
            console.error("Playback failed:", err);
            if (statusEl) {
              statusEl.textContent =
                "Couldn’t play the recording. Try recording again.";
            }
          });
      });
    }

    if (getFeedbackButton) {
      getFeedbackButton.addEventListener("click", () => {
        const rec = recordings[currentQuestion.id];
        if (!rec) {
          if (statusEl) {
            statusEl.textContent =
              "Record your answer first, then tap Get feedback.";
          }
          return;
        }

        // For now we just navigate; later this is where we'll send audio to the backend
        window.location.href = `feedback.html?question=${currentQuestion.id}`;
      });
    }
  }

  // Enable swipe left/right for next/previous question
  setupSwipeNavigation(currentQuestion);
}

// ==================
// Feedback page init
// ==================

function initFeedbackPage() {
  const headingEl = document.getElementById("feedbackHeading");
  const textEl = document.getElementById("feedbackText");
  const nextButton = document.getElementById("nextButton");

  if (!headingEl || !textEl || !nextButton) {
    console.warn("initFeedbackPage: missing elements");
    return;
  }

  const queryId = getQueryParam("question");
  const currentQuestion = getQuestionById(queryId) || getDefaultQuestion();
  const index = getQuestionIndexById(currentQuestion.id);

  headingEl.textContent = `${currentQuestion.label} Feedback`;

  // Long placeholder text to test scrolling
  textEl.innerHTML = `
    <p><strong>Your answer was generally good</strong>, but you could improve in a few areas. Focus on clear structure, specific examples, and a concise ending.</p>

    <p>Try using a simple STAR structure (Situation, Task, Action, Result). Start by briefly setting the scene, then explain what you needed to do, describe the actions you took, and finish with a clear, measurable result that shows your impact.</p>

    <p>You can also improve your delivery by slowing down slightly and pausing between key points. This will make your answer easier to follow and give you time to emphasise your strongest achievements, instead of rushing through them.</p>

    <p>Finally, make sure your answer is tailored to this specific role. Mention one or two skills that are clearly relevant to the job description, and close with a confident summary sentence that links your experience to what the company needs.</p>

    <p>If you apply this structure and tighten your examples, your answer will sound more focused, professional, and memorable.</p>
  `;

  nextButton.addEventListener("click", () => {
    const isLast = index === QUESTIONS.length - 1;
    const nextIndex = isLast ? 0 : index + 1;
    const nextQuestion = QUESTIONS[nextIndex];
    window.location.href = `practice.html?question=${nextQuestion.id}`;
  });
}

// ==================
// Bootstrapping
// ==================

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ready");

  setupSlideMenu();
  buildQuestionMenuList();

  const pageType = document.body.dataset.page;
  if (pageType === "practice") {
    initPracticePage();
  }
  if (pageType === "feedback") {
    initFeedbackPage();
  }
});
