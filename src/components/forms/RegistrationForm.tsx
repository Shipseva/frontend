import React, { useState } from 'react';
import { useRegisterUserMutation } from '@/store/api/userApi';
import { RegistrationData } from '@/types/user';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';

export const RegistrationForm: React.FC = () => {
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    phone: '',
    email: '',
    companyName: '',
    password: '',
    role: 'individual'
  });

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await registerUser(formData).unwrap();
      console.log('Registration successful:', result);
      // Handle successful registration (redirect, show success message, etc.)
    } catch (err) {
      console.error('Registration failed:', err);
      // Handle registration error
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label="Full Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
        />
      </div>

      <div>
        <Input
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          required
        />
      </div>

      <div>
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
        />
      </div>

      <div>
        <Input
          label="Company Name"
          type="text"
          value={formData.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
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
          onChange={(e) => handleInputChange('role', e.target.value as 'individual' | 'agency')}
          options={[
            { value: 'individual', label: 'Individual' },
            { value: 'agency', label: 'Agency' }
          ]}
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          Registration failed. Please try again.
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
};
