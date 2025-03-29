import { SignIn } from "@clerk/nextjs";
import Head from 'next/head';

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>Sign In | Nibog Events</title>
        <meta name="description" content="Sign in to Nibog Events" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-3xl font-bold text-center text-nibog-primary mb-6">
              Welcome Back
            </h1>
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-nibog-primary hover:bg-nibog-secondary',
                  card: 'shadow-none',
                }
              }}
              routing="path"
              path="/sign-in"
            />
          </div>
        </div>
      </div>
    </>
  );
}
