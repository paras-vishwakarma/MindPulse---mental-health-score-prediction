<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Scikit--Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Deployed_on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" />
</p>

#  MindPulse — Mental Health Score Prediction

> **An AI-powered web application that predicts a student's mental health score (0–10) based on their daily habits, social media usage, and lifestyle factors.**

MindPulse combines a **machine learning model** trained on real student survey data with a **premium, animated web interface** to deliver instant, personalized mental health insights.

---

##  Key Features

| Feature | Description |
|---------|-------------|
|  **ML-Powered Prediction** | Trained regression model predicts mental health scores on a 0–10 scale |
|  **FastAPI Backend** | High-performance REST API with automatic input validation via Pydantic |
|  **Premium UI** | Dark-themed, glassmorphism design with Playfair Display & Inter typography |
|  **Particle System** | Interactive canvas-based particle collision animation as a background |
|  **Animated Results** | Animated score ring, count-up numbers, and stat bars for sleep, screen time, physical activity & stress |
|  **Fully Responsive** | Adapts seamlessly from desktop split-panel to mobile stacked layout |
|  **Live Deployment** | Backend deployed on Render, frontend can be hosted on any static server |

---

##  Project Structure

```
MindPulse/
├── index.html                                          # Frontend — form & result panels
├── style.css                                           # Premium dark theme with animations
├── script.js                                           # Particle system + form logic + result rendering
├── main.py                                             # FastAPI backend with /predict endpoint
├── Mental_Health_Model.pkl                             # Trained scikit-learn model (joblib)
├── mental_health.ipynb                                 # Jupyter notebook — EDA, training & evaluation
├── Student Social Media And Mental Health Impact.csv   # Source dataset
├── requirements.txt                                    # Python dependencies
└── README.md
```

---

##  Getting Started

### Prerequisites

- **Python 3.10+**
- **pip** (Python package manager)
- A modern web browser

### 1. Clone the Repository

```bash
git clone https://github.com/paras-vishwakarma/MindPulse---mental-health-score-prediction.git
cd MindPulse---mental-health-score-prediction
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the Backend Server

```bash
uvicorn main:app --reload
```

The API will start at **`http://127.0.0.1:8000`**.

### 4. Open the Frontend

Simply open `index.html` in your browser. If running locally, update `API_BASE` in `script.js` to:

```javascript
const API_BASE = "http://127.0.0.1:8000";
```

> **Note:** The deployed version uses `https://mindpulse-mental-health-score-prediction.onrender.com`

---

## 📡 API Reference

### `GET /`

Health check endpoint.

**Response:**
```json
["mental health score prediction"]
```

### `POST /predict`

Predict the mental health score for a student.

**Request Body:**
```json
{
  "age": 21,
  "gender": "Male",
  "country": "India",
  "academic_level": "Undergraduate",
  "most_used_platform": "Instagram",
  "purpose_of_use": "Entertainment",
  "avg_daily_usage_hours": 4.5,
  "daily_unlocks": 60,
  "study_hours": 3.0,
  "physical_activity_hours": 1.0,
  "sleep_hours_per_night": 7.0,
  "stress_level": "Medium"
}
```

**Response:**
```json
{
  "predicted_mental_health_score": 6.77
}
```

### Input Field Constraints

| Field | Type | Constraints |
|-------|------|-------------|
| `age` | `int` | 10–100 |
| `gender` | `string` | `Male` \| `Female` |
| `country` | `string` | Any (auto-grouped to top 10 or "Other") |
| `academic_level` | `string` | `High School` \| `Undergraduate` \| `Graduate` |
| `most_used_platform` | `string` | Facebook, LinkedIn, Instagram, Snapchat, Twitter, YouTube, TikTok, LINE, KakaoTalk, VKontakte, WhatsApp, WeChat |
| `purpose_of_use` | `string` | `Networking` \| `Education` \| `Entertainment` \| `News` |
| `avg_daily_usage_hours` | `float` | 0–24 |
| `daily_unlocks` | `int` | ≥ 0 |
| `study_hours` | `float` | 0–24 |
| `physical_activity_hours` | `float` | 0–24 |
| `sleep_hours_per_night` | `float` | 0–24 |
| `stress_level` | `string` | `Low` \| `Medium` \| `High` \| `Very High` |

---

## 📊 Dataset

**Source:** `Student Social Media And Mental Health Impact.csv`

The dataset contains **13 features** from student surveys:

| Column | Description |
|--------|-------------|
| `Age` | Student's age |
| `Gender` | Male / Female |
| `Country` | Country of residence |
| `Academic_Level` | High School / Undergraduate / Graduate |
| `Most_Used_Platform` | Primary social media platform |
| `Purpose_Of_Use` | Reason for using social media |
| `Avg_Daily_Usage_Hours` | Average hours/day on social media |
| `Daily_Unlocks` | Number of phone unlocks per day |
| `Study_Hours` | Hours spent studying per day |
| `Physical_Activity_Hours` | Hours of physical exercise per day |
| `Sleep_Hours_Per_Night` | Average sleep hours per night |
| `Stress_Level` | Self-reported stress level |
| **`Mental_Health_Score`** | **Target variable (0–10)** |

---

##  Model Details

- **Type:** Regression (scikit-learn)
- **Serialization:** `joblib` → `Mental_Health_Model.pkl`
- **Preprocessing:** Country grouping (top 10 countries vs. "Other")
- **Notebook:** Full EDA, feature engineering, model training & evaluation in `mental_health.ipynb`

---

##  Frontend Highlights

- **Design System:** Deep navy background (`#0f1623`) with antique gold accents (`#c1a875`)
- **Typography:** Playfair Display (headings) + Inter (body) from Google Fonts
- **Particle Canvas:** 80 particles with elastic collisions, glow effects, and connection lines
- **Result Visualization:**
  - Animated SVG ring gauge (0–10 score)
  - Count-up number animation with easing
  - Color-coded categories:  Thriving (≥ 7.5) ·  Holding Steady (5–7.5) ·  Under Strain (< 5)
  - Stat bars for Sleep Quality, Screen Balance, Physical Health & Stress Management

---

##  Deployment

### Backend (Render)

The FastAPI backend is deployed on **Render**:

🔗 **Live API:** [https://mindpulse-mental-health-score-prediction.onrender.com](https://mindpulse-mental-health-score-prediction.onrender.com)

### Frontend

The frontend is static HTML/CSS/JS and can be hosted on any platform:
- **GitHub Pages**
- **Netlify**
- **Vercel**

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3 (Vanilla), JavaScript (ES6+) |
| **Backend** | Python, FastAPI, Uvicorn |
| **ML/Data** | scikit-learn, pandas, joblib |
| **Validation** | Pydantic |
| **Deployment** | Render |
| **Fonts** | Google Fonts (Playfair Display, Inter) |

---

##  Disclaimer

> This tool provides an **estimated** mental health score based on self-reported habits. It is **not** a clinical diagnosis. If you're struggling, please reach out to a qualified mental health professional.

---

##  License

© 2026 **Paras Vishwakarma**. All rights reserved.
