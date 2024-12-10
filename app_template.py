from flask import Flask, render_template, request, jsonify
from openai import OpenAI

app = Flask(__name__)

# NVIDIA LLM API endpoint and API key
API_KEY = "your-nvidia-api-key-here"

# Initialize OpenAI client
client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=API_KEY
)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/query", methods=["POST"])
def query_llm():
    try:
        # Get the user input from the request body
        user_input = request.get_json()["input"]

        try:
            # Create chat completion using the OpenAI client
            completion = client.chat.completions.create(
                model="meta/llama-3.1-405b-instruct",
                messages=[{"role": "user", "content": user_input}],
                temperature=0.2,
                top_p=0.7,
                max_tokens=1024
            )
            
            # Extract the response text
            response_text = completion.choices[0].message.content
            return jsonify({"response": response_text})
            
        except Exception as e:
            return jsonify({"error": f"API Error: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"error": f"Server Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
