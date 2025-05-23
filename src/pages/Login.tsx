
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col">
      {/* Header */}
      <header className="bg-white py-3 px-6 border-b shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="logo-hover">
                <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="20" width="35" height="35" rx="5" fill="#e74c3c" stroke="#c0392b" strokeWidth="2" />
                  <rect x="25" y="10" width="35" height="35" rx="5" fill="#27ae60" stroke="#219653" strokeWidth="2" />
                  <rect x="45" y="30" width="35" height="35" rx="5" fill="#3498db" stroke="#2980b9" strokeWidth="2" />
                  <rect x="65" y="15" width="35" height="35" rx="5" fill="#f39c12" stroke="#d35400" strokeWidth="2" />
                </svg>
              </div>
              <span className="font-bold text-lg">Inventory Pro</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-[#e74c3c] hover:underline font-medium">
              SIGN IN
            </button>
            <Button variant="default" size="sm" className="bg-[#e74c3c] hover:bg-[#c0392b]">
              SIGN UP NOW
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Main content */}
        <div className="container mx-auto grid md:grid-cols-2 gap-8 px-4 py-12">
          {/* Left side - Marketing content */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center mb-4">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#e74c3c]">
                <path
                  d="M5 8H19M5 8C3.89543 8 3 7.10457 3 6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6C21 7.10457 20.1046 8 19 8M5 8L5 18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V8M10 12H14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h1 className="text-2xl font-bold ml-2">Inventory Pro</h1>
            </div>
            <h2 className="text-4xl font-bold text-[#e74c3c] mb-6">
              Free inventory software
            </h2>
            <h2 className="text-4xl font-bold mb-6">
              trusted by businesses globally
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Inventory Pro is free inventory management software designed to help small and growing businesses effortlessly manage their inventory across multiple channels and devices.
            </p>
            <Button className="bg-secondary hover:bg-secondary/90 w-fit flex items-center gap-2 text-base">
              Get a Free Demo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Button>
          </div>

          {/* Right side - Login form */}
          <div className="flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto">
              <h3 className="text-2xl font-medium mb-6">Set up your organization right now</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input 
                    className="form-input-zoho" 
                    placeholder="Company Name" 
                  />
                </div>

                <div>
                  <Input
                    type="email"
                    className="form-input-zoho"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Input
                    type="password"
                    className="form-input-zoho"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <select className="form-input-zoho">
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <div className="w-14 text-center bg-gray-100 border-y border-l border-gray-200 rounded-l-md h-[46px] flex items-center justify-center text-gray-500">
                    +91
                  </div>
                  <Input 
                    className="rounded-l-none form-input-zoho" 
                    placeholder="Phone number" 
                  />
                </div>

                <div className="text-sm text-gray-600">
                  Your data will be in INDIA data center.
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" id="terms" className="mt-1" />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the <a href="#" className="text-secondary hover:underline">Terms of Service</a> and <a href="#" className="text-secondary hover:underline">Privacy Policy</a>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="btn-zoho-primary"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    'Create your free account'
                  )}
                </Button>
                
                <div className="mt-4 text-sm flex justify-center">
                  <Button variant="ghost" className="text-secondary hover:underline p-0 h-auto">
                    Request a demo
                  </Button>
                </div>
              </form>

              <div className="mt-8 text-sm text-center text-gray-600">
                <p>Demo Accounts:</p>
                <p>Admin: admin@example.com / admin123</p>
                <p>Staff: cashier@example.com / cashier123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
