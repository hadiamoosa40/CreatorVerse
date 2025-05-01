# CreatorVerse is a full-stack AI generation platform that empowers users to create Images, Videos, Music, Code, and Content with the help of cutting-edge AI models like HuggingFace, Gemini, and DeepAI.
It features authentication (Google/Manual), credits system, Stripe payments, and tiered subscriptions.

## Description

This project is a Flask-based backend server providing:
- Manual and Google-based authentication (signup/signin)
- Credit system for using AI services
- AI Content Generation:
  - Text-to-Image
  - Text-to-Music
  - Text-to-Video
  - Text-based content generation using Google Gemini
- Stripe payment integration for purchasing credits

---

## Tech Stack

- **Backend:** Flask
- **Database:** MySQL
- **Authentication:** Google OAuth, JWT, bcrypt
- **AI APIs:** HuggingFace, DeepAI, Google Gemini
- **Payments:** Stripe
- **Environment Management:** dotenv
- **Cross-Origin:** Flask-CORS

---

## Requirements

- Python 3.8+
- MySQL server (configured locally)
- `pip install` the following packages:

```bash
pip install flask flask-cors flask-mysqldb bcrypt python-dotenv requests stripe opencv-python pillow google-auth google-auth-oauthlib google-auth-httplib2 google-generativeai
```

---

## Setup

1. Clone the repo:

```bash
[git clone https://github.com/yourusername/yourrepo.git](https://github.com/hadiamoosa40/CreatorVerse.git)
cd CreaterVerse
```

2. Create a `.env` file in the root directory:

```env
GOOGLE_CLIENT_ID=your_google_client_id
SECRET_KEY=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

3. Update MySQL credentials if needed in the app config:

```python
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'yourpassword'
app.config['MYSQL_DB'] = 'auth_system'
app.config['MYSQL_PORT'] = 3307
```

4. Run the app:

```bash
python app.py
```

The server will start on [http://localhost:5000](http://localhost:5000).

---

## Available Routes

### Authentication

- `POST /signup` - Manual signup (name, email, password)
- `POST /signin` - Manual signin (email, password)
- `POST /google-signin` - Google OAuth signin/signup

### AI Services (requires credits)

- `POST /generate-image` - Generate an image from prompt
- `POST /generate-music` - Generate music from prompt
- `POST /generate-video` - Generate video (10 frames) from prompt
- `POST /generate-content` - Generate text content from prompt

### Payment

- `POST /create-checkout-session` - Create Stripe checkout session

### Static File Access

- `GET /static/<path:filename>` - Serve static images/videos

---

## Environment Variables

| Key | Description |
|:---|:---|
| GOOGLE_CLIENT_ID | Your Google OAuth Client ID |
| SECRET_KEY | Flask secret key |
| GEMINI_API_KEY | Google Gemini API key |
| HUGGING_FACE_API_KEY | Your API key

---

## Credit System

- Every successful AI operation deducts **1 credit** from the user's account.
- If no credits are left, API responds with a redirect to `/subscription`.

---

## API Keys Used

- HuggingFace API (for text-to-image)
- DeepAI API (for text-to-music)
- Google Gemini API (for content and code generation)
  

> **Note:** Replace API keys with your own for production.

---

## Stripe Configuration

Currently hardcoded for a single product checkout. Update pricing details in `/create-checkout-session` endpoint as needed.

---

## Important Notes

- Make sure MySQL service is running.
- Frontend must send user's email for each generation request.
- Use `.env` to store all secrets and keys.
- `static/` folder is automatically created to store generated frames/videos.

---



