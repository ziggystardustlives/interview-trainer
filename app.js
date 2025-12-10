// app.js

console.log("app.js loaded");

// ======================
// Global question config
// ======================

const QUESTIONS = [
  {
    id: "q1",
    label: "Q1",
    video: "Q01_TellMeAboutYourself.mp4",
    title: "Tell me about yourself",
  },
  {
    id: "q2",
    label: "Q2",
    video: "Q02_whydoyouwant.mp4",
    title: "Why do you want this job?",
  },
  {
    id: "q3",
    label: "Q3",
    video: "Q03_whyareyouleaving.mp4",
    title: "Why are you leaving your current job?",
  },
  {
    id: "q4",
    label: "Q4",
    video: "Q04_whatstrengths.mp4",
    title: "What are your strengths?",
  },
  {
    id: "q5",
    label: "Q5",
    video: "Q05_whatweaknesses.mp4",
    title: "What are your weaknesses?",
  },
  {
    id: "q6",
    label: "Q6",
    video: "Q06_successteam.mp4",
    title: "Tell me about a time you worked successfully in a team.",
  },
  {
    id: "q7",
    label: "Q7",
    video: "Q07_conflicthandle.mp4",
    title: "Tell me about a conflict you had at work and how you handled it.",
  },
  {
    id: "q8",
    label: "Q8",
    video: "Q08_leadership.mp4",
    title: "Tell me about a time you showed leadership and took initiative.",
  },
  {
    id: "q9",
    label: "Q9",
    video: "Q09_achievement.mp4",
    title: "Tell me about your greatest achievement at work.",
  },
  {
    id: "q10",
    label: "Q10",
    video: "Q010_deadlines.mp4",
    title: "How do you handle pressure and tight deadlines?",
  },
  {
    id: "q11",
    label: "Q11",
    video: "Q011_prioritise.mp4",
    title: "How do you prioritise your tasks?",
  },
  {
    id: "q12",
    label: "Q12",
    video: "Q012_motivates.mp4",
    title: "What motivates you?",
  },
  {
    id: "q13",
    label: "Q13",
    video: "Q013_fiveyears.mp4",
    title: "Where do you see yourself in five years?",
  },
  {
    id: "q14",
    label: "Q14",
    video: "Q014_doyouhaveqs.mp4",
    title: "Do you have any questions for us?",
  },
];

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function getQuestionById(id) {
  return QUESTIONS.find((q) => q.id === id);
}

function getQuestionIndexById(id) {
  return QUESTIONS.findIndex((q) => q.id === id);
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
    console.warn("Menu elements not found.");
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

  const actionButtons = document.querySelectorAll(
    ".side-menu__link[data-action]"
  );

  actionButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
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

  QUESTIONS.forEach((q) => {
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
  const container = document.querySelector(".practice");
  if (!container || !currentQuestion) return;

  let touchStartX = 0;
  let touchEndX = 0;
  const threshold = 60;

  container.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  container.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    if (Math.abs(deltaX) < threshold) return;

    const currentIndex = getQuestionIndexById(currentQuestion.id);
    if (currentIndex === -1) return;

    if (deltaX < 0 && currentIndex < QUESTIONS.length - 1) {
      const nextQuestion = QUESTIONS[currentIndex + 1];
      navigateWithSlide(nextQuestion.id, "left");
    } else if (deltaX > 0 && currentIndex > 0) {
      const prevQuestion = QUESTIONS[currentIndex - 1];
      navigateWithSlide(prevQuestion.id, "right");
    }
  }

  function navigateWithSlide(targetQuestionId, direction) {
    const card = document.querySelector(".practice__video-card");
    if (!card) {
      window.location.href = `practice.html?question=${targetQuestionId}`;
      return;
    }

    card.classList.add(
      direction === "left"
        ? "slide-out-left-fast"
        : "slide-out-right-fast"
    );

    setTimeout(() => {
      window.location.href = `practice.html?question=${targetQuestionId}`;
    }, 180);
  }
}

// ========================
// Helpers for audio upload
// ========================

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      const base64 = String(dataUrl).split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ==================
// Practice page init
// ==================

function initPracticePage() {
  const videoEl = document.getElementById("questionVideo");
  const questionLabelEl = document.getElementById("questionLabel");
  const recordButton = document.getElementById("recordButton");
  const playButton = document.getElementById("playAnswerButton");
  const feedbackButton = document.getElementById("feedbackButton");
  const statusEl = document.getElementById("practiceStatus");
  const overlay = document.getElementById("videoPlayOverlay");
  const wrapper = document.getElementById("videoWrapper");
  const audioPlayer = document.getElementById("answerPlayer");

  if (
    !videoEl ||
    !questionLabelEl ||
    !recordButton ||
    !overlay ||
    !wrapper ||
    !audioPlayer
  ) {
    return;
  }

  const queryId = getQueryParam("question");
  const currentQuestion = getQuestionById(queryId) || getDefaultQuestion();

  questionLabelEl.textContent = currentQuestion.label;
  videoEl.src = `videos/${currentQuestion.video}`;
  videoEl.load();

  // ----- video overlay -----
  const playWithSound = () => {
    overlay.classList.add("hidden");
    videoEl.currentTime = 0;
    videoEl.play().catch((err) => {
      console.log("Play failed:", err);
    });
  };

  overlay.addEventListener("click", playWithSound);
  wrapper.addEventListener("click", () => {
    if (videoEl.paused) playWithSound();
  });
  videoEl.addEventListener("ended", () => {
    overlay.classList.remove("hidden");
  });

  // ----- recording state -----
  let mediaRecorder = null;
  let recordedChunks = [];
  let recordedBlob = null;
  let recordedMimeType = "audio/webm";

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function updateButtonsState() {
    const hasRecording = !!recordedBlob;
    if (playButton) playButton.disabled = !hasRecording;
    if (feedbackButton) feedbackButton.disabled = !hasRecording;
  }

  updateButtonsState();
  setStatus("Tap Record to practise your answer.");

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunks = [];
      mediaRecorder = new MediaRecorder(stream);

      recordedMimeType = mediaRecorder.mimeType || "audio/webm";

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        recordedBlob = new Blob(recordedChunks, { type: recordedMimeType });

        // Create / refresh object URL for playback using the <audio> element
        if (audioPlayer.src) {
          URL.revokeObjectURL(audioPlayer.src);
        }
        audioPlayer.src = URL.createObjectURL(recordedBlob);

        updateButtonsState();
        setStatus("Great! You can play your answer or get feedback.");
      };

      mediaRecorder.start();
      recordButton.textContent = "Stop";
      recordButton.classList.add("btn-record--active");
      setStatus("Recording… Tap Stop when you finish.");
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Could not access your microphone.");
    }
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
    recordButton.textContent = "Record";
    recordButton.classList.remove("btn-record--active");
  }

  recordButton.addEventListener("click", () => {
    if (!mediaRecorder || mediaRecorder.state === "inactive") {
      startRecording();
    } else {
      stopRecording();
    }
  });

  if (playButton) {
    playButton.addEventListener("click", () => {
      if (!recordedBlob) {
        setStatus("Please record your answer first.");
        return;
      }

      audioPlayer.currentTime = 0;
      audioPlayer
        .play()
        .then(() => {
          setStatus("Playing your answer…");
        })
        .catch((err) => {
          console.error("Error playing answer:", err);
          setStatus("Couldn't play your answer. Try recording again.");
        });
    });
  }

  if (feedbackButton) {
    feedbackButton.addEventListener("click", async () => {
      if (!recordedBlob) {
        alert("Please record your answer first.");
        return;
      }

      feedbackButton.disabled = true;
      recordButton.disabled = true;
      if (playButton) playButton.disabled = true;
      setStatus("Getting feedback from your AI coach…");

      try {
        const audioBase64 = await blobToBase64(recordedBlob);

        const response = await fetch("/api/generateFeedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questionId: currentQuestion.id,
            audioBase64,
            mimeType: recordedMimeType,
          }),
        });

        if (!response.ok) {
          console.error("Feedback request failed:", await response.text());
          throw new Error("Feedback request failed");
        }

        const data = await response.json();

        const storageKey = `feedback_${currentQuestion.id}`;
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            feedbackHtml: data.feedbackHtml || "",
            transcript: data.transcript || "",
          })
        );

        window.location.href = `feedback.html?question=${currentQuestion.id}`;
      } catch (err) {
        console.error("Error getting feedback:", err);
        setStatus(
          "Sorry, something went wrong getting feedback. Please try again."
        );
        feedbackButton.disabled = false;
        recordButton.disabled = false;
        updateButtonsState();
      }
    });
  }

  // Swipe nav
  setupSwipeNavigation(currentQuestion);
}

// ==================
// Feedback page init
// ==================

function initFeedbackPage() {
  const headingEl = document.getElementById("feedbackHeading");
  const textEl = document.getElementById("feedbackText");
  const nextButton = document.getElementById("nextButton");

  if (!headingEl || !textEl || !nextButton) return;

  const queryId = getQueryParam("question");
  const currentQuestion = getQuestionById(queryId) || getDefaultQuestion();
  const index = getQuestionIndexById(currentQuestion.id);

  headingEl.textContent = `${currentQuestion.label} Feedback`;

  const storageKey = `feedback_${currentQuestion.id}`;
  const stored = localStorage.getItem(storageKey);

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const html = parsed.feedbackHtml || "";
      if (html.trim()) {
        textEl.innerHTML = html;
      } else {
        textEl.textContent =
          "We couldn't generate detailed feedback this time. Please try again.";
      }
    } catch (err) {
      console.error("Error parsing stored feedback:", err);
      textEl.textContent =
        "Sorry, we couldn't load your feedback. Please record your answer again
