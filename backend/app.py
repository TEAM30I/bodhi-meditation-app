
from flask import Flask, request, jsonify
from flask_cors import CORS
from auth_helpers import send_verification_code, verify_verification_code
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
        user_email = data.get('user_email', '')
        user_name = data.get('user_name', '')
        
        if not phone_number:
            return jsonify({"success": False, "error": "Phone number is required"}), 400
        
        logger.info(f"Sending verification code to: {phone_number} for user: {user_email}")
        
        # 인증 코드 발송
        code = send_verification_code(phone_number)
        
        if code:
            return jsonify({"success": True, "message": "Verification code sent successfully"})
        else:
            return jsonify({"success": False, "error": "Failed to send verification code"}), 500
    
    except Exception as e:
        logger.error(f"Error in /api/send-sms: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/verify-sms', methods=['POST'])
def verify_sms():
    try:
        data = request.json
        phone_number = data.get('phone_number')
        verification_code = data.get('verification_code')
        
        if not phone_number or not verification_code:
            return jsonify({"success": False, "error": "Phone number and verification code are required"}), 400
        
        logger.info(f"Verifying code for: {phone_number}")
        
        # 인증 코드 검증
        is_valid = verify_verification_code(phone_number, verification_code)
        
        if is_valid:
            return jsonify({"success": True, "message": "Verification successful"})
        else:
            return jsonify({"success": False, "error": "Invalid verification code"}), 400
    
    except Exception as e:
        logger.error(f"Error in /api/verify-sms: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
