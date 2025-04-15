
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // 한국 휴대폰 번호 형식 검사 (010-xxxx-xxxx 또는 010-xxx-xxxx)
  const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// 전화번호 형식을 010-1234-5678에서 +8210... 형식으로 변환
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // 하이픈 및 공백 제거
  const cleaned = phoneNumber.replace(/[^\d]/g, '');
  
  // 첫 자리가 0인 경우 제거하고 +82 추가
  const formattedPhone = '+82' + (cleaned.startsWith('0') ? cleaned.substring(1) : cleaned);
  
  return formattedPhone;
};

// 전화번호를 표시용으로 변환 (서버에서 받은 +8210... 형식을 010-... 형식으로)
export const formatPhoneNumberForDisplay = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  if (phoneNumber.startsWith('+82')) {
    // +82 제거하고 앞에 0 추가
    const digits = phoneNumber.substring(3);
    
    if (digits.length === 9) { // 국번이 3자리인 경우 (10-123-4567)
      return `0${digits.substring(0, 2)}-${digits.substring(2, 5)}-${digits.substring(5)}`;
    } else { // 국번이 4자리인 경우 (10-1234-5678)
      return `0${digits.substring(0, 2)}-${digits.substring(2, 6)}-${digits.substring(6)}`;
    }
  }
  
  return phoneNumber;
};

// 010-1234-5678 형식의 전화번호 입력을 자동으로 하이픈 추가하는 유틸리티 함수
export const formatPhoneWithHyphen = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }
};
