from flask import Flask, request, jsonify
from flask_cors import CORS
from auth_helpers import send_verification_code
import logging

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # 모든 도메인에 대해 CORS 허용

@app.route('/api/send-sms', methods=['POST'])
def send_sms():
    try:
        data = request.json
        phone_number = data.get('phone_number')
        
        if not phone_number:
            return jsonify({"success": False, "error": "Phone number is required"}), 400
        
        logger.info(f"Sending verification code to: {phone_number}")
        
        # 인증 코드 발송
        code = send_verification_code(phone_number)
        
        if code:
            return jsonify({"success": True, "message": "Verification code sent successfully"})
        else:
            return jsonify({"success": False, "error": "Failed to send verification code"}), 500
    
    except Exception as e:
        logger.error(f"Error in /api/send-sms: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)