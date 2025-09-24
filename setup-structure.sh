# Create base folders
mkdir -p src/app
mkdir -p src/components/{ui,dashboard,forms,charts}
mkdir -p src/lib/hooks
mkdir -p src/store/slices
mkdir -p src/styles
mkdir -p src/types

# Public pages
mkdir -p "src/app/(public)/track/[trackingId]"
touch "src/app/(public)/page.tsx"
touch "src/app/(public)/track/[trackingId]/page.tsx"

# Dashboard
mkdir -p src/app/dashboard/{orders/[id],shipments/[id],payments,settings}
touch src/app/dashboard/layout.tsx
touch src/app/dashboard/orders/page.tsx
touch src/app/dashboard/orders/[id]/page.tsx
touch src/app/dashboard/shipments/page.tsx
touch src/app/dashboard/shipments/[id]/page.tsx
touch src/app/dashboard/payments/page.tsx
touch src/app/dashboard/settings/page.tsx

# Admin
mkdir -p src/app/admin/{partners,users,rules}
touch src/app/admin/page.tsx

# Auth
mkdir -p src/app/auth/{login,signup,forgot-password}
touch src/app/auth/login/page.tsx
touch src/app/auth/signup/page.tsx
touch src/app/auth/forgot-password/page.tsx

# Root app files
touch src/app/layout.tsx
touch src/app/page.tsx

# Components placeholders
touch src/components/ui/.gitkeep
touch src/components/dashboard/.gitkeep
touch src/components/forms/.gitkeep
touch src/components/charts/.gitkeep

# Lib files
touch src/lib/api.ts
touch src/lib/auth.ts
touch src/lib/constants.ts

# Store files
touch src/store/index.ts
touch src/store/slices/userSlice.ts
touch src/store/slices/orderSlice.ts
touch src/store/slices/shipmentSlice.ts
touch src/store/slices/paymentSlice.ts

# Styles
touch src/styles/globals.scss
touch src/styles/variables.scss

# Types
touch src/types/order.ts
touch src/types/shipment.ts
touch src/types/user.ts
touch src/types/partner.ts
