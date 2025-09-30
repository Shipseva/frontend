"use client";

export default function TestTailwindPage() {
  return (
    <div className="min-h-screen bg-bg-light p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-text-primary mb-8">Tailwind CSS Test Page</h1>
        
        {/* Color Test */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-primary text-white p-4 rounded-lg text-center">
            <p className="font-semibold">Primary</p>
            <p className="text-sm opacity-80">#0bb0ed</p>
          </div>
          <div className="bg-accent text-white p-4 rounded-lg text-center">
            <p className="font-semibold">Accent</p>
            <p className="text-sm opacity-80">#10c4fa</p>
          </div>
          <div className="bg-success text-white p-4 rounded-lg text-center">
            <p className="font-semibold">Success</p>
            <p className="text-sm opacity-80">#22c55e</p>
          </div>
          <div className="bg-error text-white p-4 rounded-lg text-center">
            <p className="font-semibold">Error</p>
            <p className="text-sm opacity-80">#ef4444</p>
          </div>
        </div>

        {/* Gradient Test */}
        <div className="bg-gradient-primary text-white p-8 rounded-xl mb-8">
          <h2 className="text-2xl font-bold mb-4">Gradient Background</h2>
          <p className="text-lg opacity-90">This should show a beautiful gradient from primary to accent color.</p>
        </div>

        {/* Form Elements Test */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Form Elements</h2>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Test input field" 
              className="w-full px-4 py-3 border border-border-default rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-light transition-colors">
              Test Button
            </button>
          </div>
        </div>

        {/* Responsive Test */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-text-primary">Card 1</h3>
            <p className="text-text-secondary text-sm">Responsive grid item</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-text-primary">Card 2</h3>
            <p className="text-text-secondary text-sm">Responsive grid item</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-text-primary">Card 3</h3>
            <p className="text-text-secondary text-sm">Responsive grid item</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/auth/login" 
            className="inline-block bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-lg font-medium hover:from-primary-light hover:to-accent-light transition-all"
          >
            Go to Login Page
          </a>
        </div>
      </div>
    </div>
  );
}

