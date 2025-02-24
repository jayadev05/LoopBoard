import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react'

export default function SingInForm() {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
      });
    
      const [showPassword, setShowPassword] = useState(false);
    
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

  return (
    <form className="space-y-4">
    

          <div className="input-group">
            <Label className="sr-only" htmlFor='email'>Email :</Label>
            <Input
              required
              type="email"
              id='email'
              name="email"
              value={formData?.email}
              onChange={(e) => handleInputChange(e)}
              placeholder="Enter your email adress"
              disabled={false}
            />
          </div>

          <div className="input-group relative w-full">
            <Label htmlFor="password" className="sr-only">
              Password:
            </Label>
            <Input
              id="password"
              required
              type={showPassword ? "text" : "password"} // Toggle type
              name="password"
              placeholder="Enter your password"
              className="pr-10 w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>


          <Button size="lg" disabled={false} className="w-full">
            Sign In
          </Button>
        </form>
  )
}
