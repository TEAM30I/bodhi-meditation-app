
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
    verifyCodeFn: async (email: string, code: string) => {
      return await verifyEmailCode(email, code);
    }
  });

  return emailVerification;
};
