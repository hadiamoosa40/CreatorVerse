import os
import jwt
import secrets
import time
import logging
import random
import base64
import requests
import stripe
import cv2
from flask_mysqldb import MySQL
import bcrypt
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS
from flask_mysqldb import MySQL
from dotenv import load_dotenv
from google.auth.transport.requests import Request
from google.oauth2 import id_token
from PIL import Image
from io import BytesIO
import google.generativeai as genai
from functools import wraps
from flask import redirect, url_for
# Load environment variables
load_dotenv()

# --- Configs ---
# Google OAuth
CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_hex(32))
if not CLIENT_ID:
    raise ValueError("Missing Google CLIENT_ID. Check your .env file.")

# Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("Missing Gemini API key! Check your .env file.")
genai.configure(api_key=GEMINI_API_KEY)

# Stripe
stripe.api_key = ''

# HuggingFace & DeepAI
HUGGINGFACE_API_KEY = ''
HUGGINGFACE_MODEL_URL = ''
STABLE_DIFFUSION_API_URL = ""
DEEPAI_API_KEY = ''
DEEPAI_MUSIC_API_URL = ""

huggingface_headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
deepai_headers = {"api-key": DEEPAI_API_KEY}
headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}

# --- Flask App Setup ---
app = Flask(__name__)
app.secret_key = SECRET_KEY
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
# MySQL Database Config
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'hadia123'
app.config['MYSQL_DB'] = 'auth_system'
app.config['MYSQL_PORT'] = 3307

mysql = MySQL(app)

# Helper function to find user by email
def get_user_by_email(email):
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, name, email, password_hash, auth_provider FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()
    return user
def get_user_credits(email):
    cur = mysql.connection.cursor()
    cur.execute("SELECT credits FROM users WHERE email = %s", (email,))
    credits = cur.fetchone()
    cur.close()
    if credits:
        return credits[0]
    return None
def deduct_credit(email):
    cur = mysql.connection.cursor()
    cur.execute("UPDATE users SET credits = credits - 1 WHERE email = %s AND credits > 0", (email,))
    mysql.connection.commit()
    cur.close()

def require_credits(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        email = request.json.get('email')  # Frontend must send email in request
        if not email:
            return jsonify({'error': 'Email required'}), 400

        credits = get_user_credits(email)
        if credits is None:
            return jsonify({'error': 'User not found'}), 404
        if credits <= 0:
            return jsonify({'redirect': '/subscription'}), 403

        return f(*args, **kwargs)
    return decorated_function

# Manual Signup
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({"message": "Missing fields"}), 400

    if get_user_by_email(email):
        return jsonify({"message": "User already exists"}), 409

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO users (name, email, password_hash, auth_provider) VALUES (%s, %s, %s, 'manual')",
                (name, email, hashed_password))
    mysql.connection.commit()
    cur.close()

    return jsonify({"user": {"name": name, "email": email}}), 201

# Manual Signin
@app.route('/signin', methods=['POST'])
def signin():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = get_user_by_email(email)
    if not user:
        return jsonify({"message": "User not found"}), 404

    user_id, name, email, password_hash, auth_provider = user

    if auth_provider != 'manual':
        return jsonify({"message": "Please login with Google"}), 400

    if not bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):
        return jsonify({"message": "Incorrect password"}), 401

    return jsonify({"user": {"name": name, "email": email}}), 200

# Google Signin (or signup if new)
@app.route('/google-signin', methods=['POST'])
def google_signin():
    token = request.json.get('token')
    try:
        idinfo = id_token.verify_oauth2_token(token, grequests.Request(), "1002653775098-klrpdsn4j8b390i17rvovptvgc01kqp1.apps.googleusercontent.com")
        
        email = idinfo['email']
        name = idinfo.get('name')

        user = get_user_by_email(email)

        if not user:
            # New Google user -> save to database
            cur = mysql.connection.cursor()
            cur.execute("INSERT INTO users (name, email, auth_provider) VALUES (%s, %s, 'google')",
                        (name, email))
            mysql.connection.commit()
            cur.close()

        return jsonify({"user": {"name": name, "email": email}}), 200

    except Exception as e:
        print("Google Signin Error:", e)
        return jsonify({"message": "Google authentication failed"}), 400
# Static files
os.makedirs("static", exist_ok=True)

# Logging
logging.basicConfig(level=logging.DEBUG)

# --- Helpers ---
def create_jwt_token(user_info):
    payload = {
        'email': user_info['email'],
        'exp': datetime.utcnow() + timedelta(hours=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def call_hugging_face_api(url, payload, retries=8, wait_time=15):
    for attempt in range(retries):
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 503:
            estimated_time = response.json().get("estimated_time", wait_time)
            print(f"Model loading... Retrying in {estimated_time:.2f} seconds")
            time.sleep(estimated_time + 2)
        else:
            return response
    return None

def generate_text_from_huggingface(prompt):
    payload = {"inputs": prompt}
    response = requests.post(HUGGINGFACE_MODEL_URL, headers=huggingface_headers, json=payload)
    if response.status_code == 200:
        return response.json()[0]["generated_text"]
    else:
        logging.error(f"Error generating text: {response.status_code}")
        return None

def generate_music_from_text(text_input):
    response = requests.post(DEEPAI_MUSIC_API_URL, data={'text': text_input}, headers=deepai_headers)
    if response.status_code == 200:
        return response.json().get('output_url')
    else:
        logging.error(f"Error generating music: {response.status_code}, {response.text}")
        return None
@app.route('/generate-image', methods=['POST'])
@require_credits  # 🛡️ Add credit check decorator
def generate_image():
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        email = data.get('email', '')  # 📩 get email from frontend

        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400

        if not email:
            return jsonify({'error': 'Email is required'}), 400

        payload = {
            'inputs': prompt,
        }

        response = call_hugging_face_api(HUGGINGFACE_MODEL_URL, payload)

        if response is None:
            return jsonify({'error': 'No response from HuggingFace after retries'}), 504

        if response.status_code != 200:
            print('HuggingFace error:', response.status_code, response.text)
            return jsonify({'error': 'Failed to generate image from HuggingFace'}), response.status_code

        # 🎯 Success - generate image
        image_bytes = response.content
        image_base64 = base64.b64encode(image_bytes).decode('utf-8')
        image_url = f"data:image/png;base64,{image_base64}"

        deduct_credit(email)  # 📉 Deduct 1 credit after successful generation

        return jsonify({'image_url': image_url})

    except Exception as e:
        print('Error in /generate-image:', str(e))
        return jsonify({'error': 'Server error', 'details': str(e)}), 500

# Text to Music Generation
@app.route("/generate-music", methods=["POST"])
@require_credits  # 🛡️ Require credits before processing
def generate_music():
    try:
        data = request.get_json()
        prompt = data.get("prompt", "")
        email = data.get("email", "")  # 📩 Fetch email from request

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400
        if not email:
            return jsonify({"error": "Email is required"}), 400

        generated_text = generate_text_from_huggingface(prompt)

        if not generated_text:
            return jsonify({"error": "Failed to generate text"}), 500

        music_url = generate_music_from_text(generated_text)
        if not music_url:
            return jsonify({"error": "Failed to generate music"}), 500

        deduct_credit(email)  # 📉 Deduct 1 credit

        return jsonify({"music_url": music_url})

    except Exception as e:
        print("Error in /generate-music:", str(e))
        return jsonify({"error": str(e)}), 500
@app.route("/generate-video", methods=["POST"])
@require_credits  # 🛡️ Require credits before processing
def generate_video():
    try:
        data = request.get_json()
        prompt = data.get("prompt", "A futuristic city skyline")
        email = data.get("email", "")  # 📩 Fetch email from request

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400
        if not email:
            return jsonify({"error": "Email is required"}), 400

        frames = []

        for i in range(10):
            response = call_hugging_face_api(STABLE_DIFFUSION_API_URL, {"inputs": prompt})
            if response and response.status_code == 200:
                image = Image.open(BytesIO(response.content)).resize((256, 256), Image.LANCZOS)
                image_path = f"static/frame_{i}.png"
                image.save(image_path)
                frames.append(image_path)
            else:
                return jsonify({"error": "Image generation failed"}), 500

        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        video_output_path = "static/generated_video.mp4"
        out = cv2.VideoWriter(video_output_path, fourcc, 1, (256, 256))

        for frame in frames:
            img = cv2.imread(frame)
            out.write(img)

        out.release()

        deduct_credit(email)  # 📉 Deduct 1 credit

        return jsonify({"video_url": f"http://localhost:5000/static/generated_video.mp4"})

    except Exception as e:
        print("Error in /generate-video:", str(e))
        return jsonify({"error": str(e)}), 500

# Stripe Checkout Session
@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'eur',
                    'product_data': {'name': 'Paypal Plan'},
                    'unit_amount': 2000,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='http://localhost:5173/success',
            cancel_url='http://localhost:5173/cancel',
        )
        return jsonify({'id': checkout_session.id})
    except Exception as e:
        print('Stripe Error:', str(e))
        return jsonify({'error': str(e)}), 400

# Serve Static Files
@app.route("/static/<path:filename>")
def serve_static(filename):
    return send_from_directory("static", filename)

@app.route('/generate-content', methods=['POST'])
@require_credits
def generate_content():
    try:
        data = request.json
        prompt = data.get("prompt", "")
        email = data.get("email", "")  # must pass email from frontend!

        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        generated_text = response.text.strip()

        deduct_credit(email)  # Deduct 1 credit after success

        return jsonify({"content": generated_text.replace("\n", "\n\n")})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
