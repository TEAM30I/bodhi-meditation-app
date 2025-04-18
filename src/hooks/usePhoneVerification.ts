
import { useVerification } from './useVerification';
import { validatePhone } from '@/utils/validations';
import { initiatePhoneVerification, verifyPhoneCode } from '@/services/authService';

interface UsePhoneVerificationProps {
  name: string;
  email: string;
}

export const usePhoneVerification = ({ name, email }: UsePhoneVerificationProps) => {
  const phoneVerification = useVerification({
    validationFn: validatePhone,
    sendVerificationFn: async (phone: string) => {
      return await initiatePhoneVerification(email, name, phone);
    },
    verifyCodeFn: async (code: string) => {
      return await verifyPhoneCode(phoneVerification.value, code);
    }
  });

  return phoneVerification;
};
