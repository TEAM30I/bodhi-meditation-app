
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  const formattedPhone = `+82${phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber}`;
  return formattedPhone;
};
