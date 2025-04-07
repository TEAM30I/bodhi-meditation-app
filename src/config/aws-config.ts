
import { Amplify } from 'aws-amplify';
import { I18n } from '@aws-amplify/core';
import { resourcesConfig } from 'aws-amplify/auth/utils';
import awsconfig from './amplifyconfiguration.json';

// 한글 에러 메시지 설정 (추가하고 싶은 메시지가 있다면 더 확장 가능)
I18n.putVocabularies({
  ko: {
    'User does not exist.': '사용자가 존재하지 않습니다.',
    'Incorrect username or password.': '사용자 이름 또는 비밀번호가 올바르지 않습니다.',
    'User is not confirmed.': '사용자 인증이 완료되지 않았습니다.',
    'Username cannot be empty': '사용자 이름을 입력해주세요.',
    'Password cannot be empty': '비밀번호를 입력해주세요.',
    'User already exists': '이미 존재하는 사용자입니다.',
    'Invalid verification code provided, please try again.': '유효하지 않은 인증 코드입니다. 다시 시도해주세요.',
    'Invalid email address format.': '유효하지 않은 이메일 형식입니다.',
    'Password did not conform with policy': '비밀번호 정책에 맞지 않습니다.',
    'Password must have uppercase characters': '비밀번호에 대문자가 포함되어야 합니다.',
    'Password must have lowercase characters': '비밀번호에 소문자가 포함되어야 합니다.',
    'Password must have numeric characters': '비밀번호에 숫자가 포함되어야 합니다.',
    'Password must have symbol characters': '비밀번호에 특수문자가 포함되어야 합니다.'
  }
});
I18n.setLanguage('ko');

// Amplify v6 설정
Amplify.configure(awsconfig);

// 오류 메시지 번역 설정
resourcesConfig.Auth.i18n = I18n;

// 설정 파일 export
export { awsconfig };
