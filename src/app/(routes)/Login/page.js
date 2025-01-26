import Link from "next/link";

import LoginForm from "@/components/LoginForm";
import AuthLogin from "@/components/AuthLogin";

export default function Login() {
    return (
        <div className="mt-32 flex items-center justify-center rounded-lg">
            <div className="bg-black/[.8] p-8 rounded-lg shadow-xl w-96">
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Login</h1>
                <LoginForm />

                {/* Forgot Password Link */}
                <p className="mt-2 text-center">
                    <Link href="/PasswordResetRequest" className="text-blue-600 hover:underline">
                        Forgot Password?
                    </Link>
                </p>

                <p className="text-white text-sm mt-2 text-center">
                    Don't have an account? Click
                    {' '}
                    <a href="/Register" className="text-blue-600 hover:underline">
                        here
                    </a>{' '}
                    to Register
                </p>
            </div>
        </div>
    );
}
