
import { useVerification } from './useVerification';
import { validateEmail } from '@/utils/validations';
import { initiateEmailVerification, verifyEmailCode } from '@/services/authService';

interface UseEmailVerificationProps {
  name: string;
}

export const useEmailVerification = ({ name }: UseEmailVerificationProps) => {
  const emailVerification = useVerification({
    validationFn: validateEmail,
    sendVerificationFn: async (email: string) => {
      return await initiateEmailVerification(email, name);
    },
    verifyCodeFn: async (code: string) => {
      // Pass the current email value from the useVerification hook
      return await verifyEmailCode(emailVerification.value, code);
    }
  });

  return emailVerification;
};
