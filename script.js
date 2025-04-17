// Login Function
function login() {
  const name = document.getElementById('username').value;
  if (name.trim() !== "") {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    document.getElementById('welcomeMsg').innerText = `Welcome, ${name}! 👋`;
  } else {
    alert("Please enter your name!");
  }
}

// Logout Function
function logout() {
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('username').value = '';
  document.getElementById('welcomeMsg').innerText = '';  // Clear welcome message on logout
}

// OpenAI GPT - Viral Ideas
async function getIdeas() {
  const topic = document.getElementById("topicInput").value;
  const resultDiv = document.getElementById("gptResult");
  if (!topic.trim()) {
    resultDiv.innerHTML = "⚠️ Please enter a topic.";
    return;
  }

  resultDiv.innerHTML = "⏳ Generating ideas...";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Your api key"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Give me 3 viral content ideas for the topic: "${topic}"`
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from OpenAI");
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;
    resultDiv.innerHTML = `<p>${reply.replace(/\n/g, "<br>")}</p>`;
  } catch (error) {
    resultDiv.innerHTML = "❌ Error fetching ideas. Please try again.";
    console.error(error);
  }
}

// Validate URL Function
function isValidUrl(url) {
  const regex = /^(ftp|http|https):\/\/[^ "]+$/;
  return regex.test(url);
}

// Scam Link Checker - Google Safe Browsing API
async function checkScamLink() {
  const url = document.getElementById("linkInput").value;
  const result = document.getElementById("linkResult");

  if (!url.trim()) {
    result.innerHTML = "⚠️ Please paste a URL.";
    return;
  }

  if (!isValidUrl(url)) {
    result.innerHTML = "⚠️ Invalid URL format.";
    return;
  }

  result.innerHTML = "🔍 Checking link...";

  const apiKey = "AIzaSyBc6Ekc2feHNuZxQVeIx2h";
  const body = {
    client: {
      clientId: "trendtracker",
      clientVersion: "1.0"
    },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url: url }]
    }
  };

  try {
    const response = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      throw new Error("Failed to check link");
    }

    const data = await response.json();
    if (data && data.matches) {
      result.innerHTML = "🚫 Warning: This link might be a scam!";
    } else {
      result.innerHTML = "✅ This link looks safe.";
    }
  } catch (err) {
    console.error(err);
    result.innerHTML = "❌ Error checking link. Please try again.";
  }
}

// Toxicity Checker - Perspective API
async function checkToxicity() {
  const comment = document.getElementById("commentInput").value;
  const result = document.getElementById("toxicityResult");

  if (!comment.trim()) {
    result.innerHTML = "⚠️ Please enter a comment.";
    return;
  }

  result.innerHTML = "🔍 Analyzing...";

  const apiKey = "YOUR_PERSPECTIVE_API_KEY";
  try {
    const response = await fetch(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${apiKey}`, {
      method: "POST",
      body: JSON.stringify({
        comment: { text: comment },
        requestedAttributes: { TOXICITY: {} }
      }),
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      throw new Error("Failed to check comment toxicity");
    }

    const data = await response.json();
    const toxicityScore = data.attributeScores.TOXICITY.summaryScore.value;

    if (toxicityScore >= 0.75) {
      result.innerHTML = `⚠️ This comment is highly toxic! Toxicity score: ${toxicityScore.toFixed(2)}`;
    } else if (toxicityScore >= 0.5) {
      result.innerHTML = `⚠️ This comment has moderate toxicity. Toxicity score: ${toxicityScore.toFixed(2)}`;
    } else {
      result.innerHTML = `✅ This comment is safe. Toxicity score: ${toxicityScore.toFixed(2)}`;
    }
  } catch (err) {
    console.error(err);
    result.innerHTML = "❌ Error analyzing comment. Please try again.";
  }
}
