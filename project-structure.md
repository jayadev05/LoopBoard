📁 my-nextjs-app/
├── 📁 src/                     # Source directory
│   ├── 📁 app/                 # App Router directory
│   │   ├── 📁 api/            # API routes
│   │   │   └── [...]/         # API endpoint directories
│   │   ├── 📁 (auth)/         # Auth-related route group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── 📁 dashboard/      # Dashboard routes
│   │   └── layout.tsx         # Root layout
│   ├── 📁 components/
│   │   ├── 📁 ui/             # Reusable UI components
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   └── Forms/
│   │   ├── 📁 features/       # Feature-specific components
│   │   │   ├── Dashboard/
│   │   │   └── Auth/
│   │   └── 📁 layouts/        # Layout components
│   ├── 📁 lib/                # Shared utilities
│   │   ├── 📁 api/            # API client utilities
│   │   ├── 📁 hooks/          # Custom React hooks
│   │   ├── 📁 utils/          # Helper functions
│   │   └── 📁 validations/    # Schema validations
│   ├── 📁 store/              # State management
│   │   ├── 📁 slices/         # State slices
│   │   └── index.ts           # Store configuration
│   ├── 📁 styles/             # Global styles
│   │   ├── globals.css
│   │   └── themes/
│   └── 📁 types/              # TypeScript type definitions
│       ├── api.ts
│       └── models.ts
├── 📁 public/                  # Static assets (outside src since it's served directly)
├── 📁 tests/                   # Test files (often kept outside src)
│   ├── 📁 unit/
│   ├── 📁 integration/
│   └── 📁 e2e/
├── 📁 config/                  # Configuration files
│   ├── env.ts
│   └── constants.ts
├── .env.local                  # Local environment variables
├── .env.example                # Example environment variables
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies