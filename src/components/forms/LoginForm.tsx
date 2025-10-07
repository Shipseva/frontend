import React, { useState } from 'react';
import { useLoginUserMutation } from '@/store/api/userApi';
import { LoginCredentials } from '@/types/user';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';

export const LoginForm: React.FC = () => {
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const [formData, setFormData] = useState<LoginCredentials>({
    identifier: '',
    password: '',
    role: 'user'
  });

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await loginUser(formData).unwrap();
      console.log('Login successful:', result);
      // Handle successful login (store token, redirect, etc.)
    } catch (err) {
      console.error('Login failed:', err);
      // Handle login error
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label="Email or Phone Number"
          type="text"
          value={formData.identifier}
          onChange={(e) => handleInputChange('identifier', e.target.value)}
          placeholder="johndoe@gmail.com or 9878787676"
          required
        />
      </div>

      <div>
        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          required
        />
      </div>

      <div>
        <Select
          label="Role"
          value={formData.role}
          onChange={(e) => handleInputChange('role', e.target.value as 'user' | 'admin')}
          options={[
            { value: 'user', label: 'User' },
            { value: 'admin', label: 'Admin' }
          ]}
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          Login failed. Please check your credentials and try again.
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};
