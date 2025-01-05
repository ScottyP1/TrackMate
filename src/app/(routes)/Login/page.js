import Link from "next/link";

import LoginForm from "@/components/LoginForm";
import AuthLogin from "@/components/AuthLogin";

export default function Login() {
    return (
        <div className="mt-32 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Login</h1>
                <LoginForm />
                <h2 className="text-black text-center mt-2">Or</h2>
                <AuthLogin />
                <p className="text-black text-sm mt-2">Dont have an account? Click <Link href='/Register'>here</Link> to register</p>
            </div>
        </div>
    )
}
