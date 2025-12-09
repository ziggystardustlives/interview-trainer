
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { questionId, audioBase64, mimeType } = req.body || {};

    if (!questionId || !audioBase64) {
      res.status(400).json({ error: "Missing questionId or audioBase64" });
      return;
    }

    const audioBuffer = Buffer.from(audioBase64, "base64");

    const file = new File([audioBuffer], "answer.webm", {
      type: mimeType || "audio/webm",
    });

    const transcription = await client.audio.transcriptions.create({
      file,
      model: "whisper-1",
      language: "en",
    });

    const transcriptText = transcription.text || "";

    const question = QUESTIONS_LOOKUP[questionId] || "this interview question";

    const prompt = `
You are an experienced interview coach.
The candidate has just answered the question: "${question}".

Here is the transcript of their answer:
${transcriptText}

Write clear, friendly feedback in HTML (using <p> and <ul>/<li> only).
- Start with 1 short sentence summarising their performance.
- Then give 3–5 bullet points under a heading "What you did well".
- Then 3–5 bullet points under a heading "How to improve".
- Finish with 1 short "Try saying it like this..." example paragraph.

Keep the tone encouraging and specific.
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert interview coach." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    });

    const feedbackHtml = completion.choices[0]?.message?.content || "";

    res.status(200).json({
      ok: true,
      questionId,
      transcript: transcriptText,
      feedbackHtml,
    });
  } catch (error) {
    console.error("Error in /api/generateFeedback:", error);
    res.status(500).json({ error: "Failed to generate feedback" });
  }
}

const QUESTIONS_LOOKUP = {
  q1: "Tell me about yourself",
  q2: "Why do you want this job?",
  q3: "Why are you leaving your current job?",
  q4: "What are your strengths?",
  q5: "What are your weaknesses?",
  q6: "Tell me about a time you worked successfully in a team.",
  q7: "Tell me about a conflict you had at work and how you handled it.",
  q8: "Tell me about a time you showed leadership and took initiative.",
  q9: "Tell me about your greatest achievement at work.",
  q10: "How do you handle pressure and tight deadlines?",
  q11: "How do you prioritise your tasks?",
  q12: "What motivates you?",
  q13: "Where do you see yourself in five years?",
  q14: "Do you have any questions for us?",
};
