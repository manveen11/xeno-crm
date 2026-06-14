import AuthLayout from '@/components/layout/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - Xeno CRM',
};

export default function RegisterPage() {
  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h1 className="text-[28px] font-[family-name:var(--font-display)] text-ink leading-tight mb-2">Create an account</h1>
        <p className="text-[15px] text-ink-muted">Join Xeno and start segmenting today</p>
      </div>

      <RegisterForm />
    </AuthLayout>
  );
}
