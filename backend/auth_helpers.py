
import random
import string
import boto3
from botocore.exceptions import ClientError
import os
import json
import logging
from datetime import datetime, timedelta

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 설정 파일에서 AWS 정보 가져오기
with open('../src/config/amplifyconfiguration.json', 'r') as config_file:
    config = json.load(config_file)

# 인증 코드 저장소 (메모리 캐시, 실제 환경에서는 Redis 등 사용 권장)
verification_codes = {}

# Initialize AWS clients
sns_client = boto3.client(
    'sns',
    region_name=config['aws_project_region'],
    aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY')
)

cognito_client = boto3.client(
    'cognito-idp',
    region_name=config['aws_cognito_region'],
    aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY')
)

def generate_verification_code(length=6):
    """Generate a random 6-digit verification code"""
    return ''.join(random.choices(string.digits, k=length))

def send_verification_code(phone_number):
    """Send verification code via AWS SNS"""
    try:
        code = generate_verification_code()
        
        # 한국어 메시지 내용
        message = f"[보디] 인증번호는 [{code}]입니다. 3분 안에 입력해주세요."
        
        # AWS SNS를 통해 SMS 발송
        response = sns_client.publish(
            PhoneNumber=phone_number,
            Message=message,
            MessageAttributes={
                'AWS.SNS.SMS.SenderID': {
                    'DataType': 'String',
                    'StringValue': 'BODHI'
                },
                'AWS.SNS.SMS.SMSType': {
                    'DataType': 'String',
                    'StringValue': 'Transactional'
                }
            }
        )
        
        # 인증코드 메모리에 저장 (3분 유효)
        expiry_time = datetime.now() + timedelta(minutes=3)
        verification_codes[phone_number] = {
            'code': code,
            'expires_at': expiry_time
        }
        
        logger.info(f"Verification code sent to {phone_number}: {code}")
        return code
        
    except ClientError as e:
        logger.error(f"Error sending SMS: {e}")
        return None

def verify_verification_code(phone_number, code):
    """Verify the provided code against stored code"""
    if phone_number not in verification_codes:
        logger.warning(f"No verification code found for {phone_number}")
        return False
    
    stored_data = verification_codes[phone_number]
    
    # 만료 시간 확인
    if datetime.now() > stored_data['expires_at']:
        # 만료된 코드 삭제
        del verification_codes[phone_number]
        logger.warning(f"Verification code for {phone_number} has expired")
        return False
    
    # 코드 일치 확인
    if stored_data['code'] == code:
        # 검증 성공 시 삭제
        del verification_codes[phone_number]
        logger.info(f"Verification successful for {phone_number}")
        return True
    
    logger.warning(f"Invalid verification code for {phone_number}")
    return False

def check_username_exists(username):
    """Check if a username already exists in Cognito"""
    try:
        response = cognito_client.list_users(
            UserPoolId=config['aws_user_pools_id'],
            Filter=f'username = "{username}"',
            Limit=1
        )
        
        return len(response.get('Users', [])) > 0
    
    except ClientError as e:
        logger.error(f"Error checking username: {e}")
        raise e

def register_user(username, password, user_attributes):
    """Register a new user in Cognito"""
    try:
        response = cognito_client.sign_up(
            ClientId=config['aws_user_pools_web_client_id'],
            Username=username,
            Password=password,
            UserAttributes=[
                {'Name': key, 'Value': value} for key, value in user_attributes.items()
            ]
        )
        return response
    except ClientError as e:
        logger.error(f"Error registering user: {e}")
        raise e

if __name__ == "__main__":
    # 테스트용
    print("Testing verification code generation:")
    code = generate_verification_code()
    print(f"Generated code: {code}")
