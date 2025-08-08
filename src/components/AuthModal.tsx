import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { auth, } from '../lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [view, setView] = useState<'signIn' | 'signUp' | 'forgotPassword'>('signIn');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const createUserDocument = async (user: User, additionalData = {}) => {
    // Function to create user document in Firestore
    // This is a placeholder, implement your Firestore logic here
    console.log('Creating user document for:', user.uid, additionalData);

 
  };

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setView('signIn');
      setName('');
      setEmail('');
      setPassword('');
      setShowPassword(false);
      setLoading(false);
    }
  }, [isOpen]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onAuthSuccess(userCredential.user);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await createUserDocument(userCredential.user, { name });
      onAuthSuccess(userCredential.user);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
      setView('signIn');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await createUserDocument(result.user);
      onAuthSuccess(result.user);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        {view === 'signIn' && (
          <div>
            <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
            <p className="text-center text-gray-500 mt-1 mb-6">Sign in to your Legal Port account</p>
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              {/* Email Input */}
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" className="pl-10" />
                </div>
              </div>
              {/* Password Input */}
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" className="pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="text-right mt-1">
                  <button type="button" onClick={() => setView('forgotPassword')} className="text-sm text-gold hover:underline">Forgot Password?</button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-gold text-white hover:bg-gold/90 h-11 text-base">
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Or continue with</span></div>
            </div>
            <Button onClick={handleGoogleSignIn} variant="outline" className="w-full h-11"><GoogleIcon /> Continue with Google</Button>
            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account? <button onClick={() => setView('signUp')} className="font-semibold text-gold hover:underline">Sign Up</button>
            </p>
          </div>
        )}

        {view === 'signUp' && (
           <div>
            <h2 className="text-2xl font-bold text-center">Create Account</h2>
            <p className="text-center text-gray-500 mt-1 mb-6">Get started with Legal Port</p>
            <form onSubmit={handleEmailSignUp} className="space-y-4">
               <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Enter your full name" />
              </div>
              <div>
                <Label htmlFor="signup-email">Email Address</Label>
                <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" />
              </div>
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Create a password" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-gold text-white hover:bg-gold/90 h-11 text-base">
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account? <button onClick={() => setView('signIn')} className="font-semibold text-gold hover:underline">Sign In</button>
            </p>
          </div>
        )}

        {view === 'forgotPassword' && (
          <div>
            <h2 className="text-2xl font-bold text-center">Reset Password</h2>
            <p className="text-center text-gray-500 mt-1 mb-6">Enter your email to get a reset link</p>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <Label htmlFor="reset-email">Email Address</Label>
                <Input id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-gold text-white hover:bg-gold/90 h-11 text-base">
                {loading ? 'Sending Link...' : 'Send Reset Link'}
              </Button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-6">
              Remembered your password? <button onClick={() => setView('signIn')} className="font-semibold text-gold hover:underline">Sign In</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}