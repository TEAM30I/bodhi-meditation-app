
import random
import string
import boto3
from botocore.exceptions import ClientError
import os
import json

# AWS Configuration from config file
config = {
    "aws_project_region": "ap-northeast-2",
    "aws_cognito_region": "ap-northeast-2",
    "aws_user_pools_id": "ap-northeast-2_asbht9MBG",
    "aws_user_pools_web_client_id": "3bmg89p73cggqdhpc35v35g2fo"
}

# Initialize Cognito client
client = boto3.client(
    'cognito-idp',
    region_name=config['aws_cognito_region']
)

def generate_verification_code():
    """Generate a random 4-digit verification code"""
    return ''.join(random.choices(string.digits, k=4))

def send_verification_code(phone_number):
    code = generate_verification_code()
    
    # SNS 클라이언트 생성
    sns_client = boto3.client('sns', region_name=config['aws_cognito_region'])
    
    try:
        response = sns_client.publish(
            PhoneNumber=phone_number,
            Message=f"Your verification code is: {code}"
        )
        # 코드와 response를 데이터베이스나 캐시에 저장하여 나중에 검증할 수 있도록 함
        return code
    except ClientError as e:
        print(f"Error sending SMS: {e}")
        return None


def verify_phone_number(phone_number, code):
    """Verify the phone number with the provided code"""
    # In a real implementation, you'd check the code against what was stored
    # Return True if valid, False otherwise
    return True  # Mocked for demo

def find_user_by_phone(phone_number):
    """Find a user by phone number in Cognito"""
    try:
        response = client.list_users(
            UserPoolId=config['aws_user_pools_id'],
            Filter=f'phone_number = "{phone_number}"'
        )
        
        if response['Users']:
            # Found user with this phone number
            user = response['Users'][0]
            username = next((attr['Value'] for attr in user['Attributes'] 
                            if attr['Name'] == 'preferred_username'), 
                           user['Username'])
            return username
        else:
            return None
    except ClientError as e:
        print(f"Error finding user: {e}")
        return None

def reset_password(username):
    """Initiate password reset for a user"""
    try:
        response = client.forgot_password(
            ClientId=config['aws_user_pools_web_client_id'],
            Username=username
        )
        return response
    except ClientError as e:
        print(f"Error resetting password: {e}")
        return None

def confirm_forgot_password(username, code, new_password):
    """Confirm password reset with verification code"""
    try:
        response = client.confirm_forgot_password(
            ClientId=config['aws_user_pools_web_client_id'],
            Username=username,
            ConfirmationCode=code,
            Password=new_password
        )
        return True
    except ClientError as e:
        print(f"Error confirming password reset: {e}")
        return False

def register_user(username, password, email, phone_number):
    """Register a new user in Cognito"""
    try:
        response = client.sign_up(
            ClientId=config['aws_user_pools_web_client_id'],
            Username=username,
            Password=password,
            UserAttributes=[
                {
                    'Name': 'email',
                    'Value': email
                },
                {
                    'Name': 'phone_number',
                    'Value': phone_number
                }
            ]
        )
        return response
    except ClientError as e:
        print(f"Error registering user: {e}")
        return None

def update_user_attributes(username, attributes):
    """Update user attributes in Cognito"""
    try:
        # Get access token for the user
        auth_response = client.admin_initiate_auth(
            UserPoolId=config['aws_user_pools_id'],
            ClientId=config['aws_user_pools_web_client_id'],
            AuthFlow='ADMIN_NO_SRP_AUTH',
            AuthParameters={
                'USERNAME': username,
                'SECRET_HASH': 'your_secret_hash'  # You'd calculate this in a real app
            }
        )
        
        access_token = auth_response['AuthenticationResult']['AccessToken']
        
        # Convert attributes dict to Cognito format
        user_attributes = [{'Name': k, 'Value': v} for k, v in attributes.items()]
        
        response = client.update_user_attributes(
            AccessToken=access_token,
            UserAttributes=user_attributes
        )
        
        return response
    except ClientError as e:
        print(f"Error updating user attributes: {e}")
        return None

if __name__ == "__main__":
    # Example usage
    code = send_verification_code("+821012345678")
    print(f"Verification code: {code}")
