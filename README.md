# Scribe-Vision

**Scribe-Vision** helps writers and creators tap into the power of AI and public opinion to research and inspire creative projects. Enter a **theme** or a **YouTube video URL** to scrape comments and receive:

- 🧠 Sentiment Analysis (via `vader-sentiment`)
- 🔍 Extracted Keywords (via `keyword-extractor`)
- 📝 AI-Generated Summaries (via `mistralai/Mistral-Small-3.1-24B-Instruct-2503`)

---

## 🔗 Access
NOTE: This service is on a free-tier so please use judiciously (don't wanna get bills!)
Try it live: [https://scribe-vision.netlify.app/](https://scribe-vision.netlify.app/)

---

## ❓ Why the Need for This?

While large AI models like **ChatGPT**, **Claude**, **Gemini**, and others can browse blogs, articles, Reddit threads, and research papers, they fall short when it comes to mining insights directly from **YouTube comments** and other social media feedback loops.

That’s where **Scribe-Vision** steps in.

> 🧰 **This project is a one-stop research tool** for creators who want to organize, analyze, and extract value from *real audience reactions* without having to manually sift through hundreds of comments.

Use it when:
- You're trying to understand what makes a viral video emotionally impactful
- You want to detect common opinions or emotional responses to a theme
- You're looking for genuine, unfiltered human sentiment from social platforms

It’s built specifically to fill this **research gap** — by bringing structured AI analysis to one of the most chaotic but valuable data sources: **comment sections**.

---

## ⚙️ Tech Stack & Components

Scribe-Vision is built with a **MERN stack** and integrates the following tools:

- **Frontend:** React (deployed on **Netlify**)  
- **Backend:** Node.js + Express (deployed on **Render**)  
- **APIs Used:**
  - 🎥 YouTube Data API v3 — to search videos and scrape top comments
  - 🤖 Hugging Face Inference API — to summarize insights using [`mistralai/Mistral-Small-3.1-24B-Instruct-2503`]
- **NLP Tools:**
  - `vader-sentiment` — for sentiment analysis
  - `keyword-extractor` — for key phrase extraction

---

## 🧪 How to Use

### 1. Analyze by Video URL  
Paste a full YouTube video link. The app will analyze top comments on that specific video.

### 2. Analyze by Theme  
Enter a theme or phrase (e.g. `100 men vs 1 Gorilla`). The app will:
- Search YouTube for relevant videos  
- Scrape and aggregate top comments across them  
- Provide insights using AI-generated summaries, keyword extraction, and sentiment scores

---

## 📌 Example Use Cases
- Scriptwriters exploring public reaction on viral topics  
- Novelists researching emotional trends  
- Content creators gathering audience sentiment  
- Researchers analyzing public discourse

---

