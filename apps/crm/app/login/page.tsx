import AuthLayout from '@/components/layout/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Xeno CRM',
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h1 className="text-[28px] font-[family-name:var(--font-display)] text-ink leading-tight mb-2">Welcome back</h1>
        <p className="text-[15px] text-ink-muted">Sign in to manage your D2C campaigns</p>
      </div>

      <LoginForm />
    </AuthLayout>
  );
}
