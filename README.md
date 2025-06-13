# FormWave Frontend

A modern, responsive form builder application built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Drag & Drop Form Builder** - Intuitive interface for creating forms
- **Real-time Preview** - See your forms as you build them
- **Responsive Design** - Works perfectly on all devices
- **Theme Customization** - Custom themes and styling options
- **Form Analytics** - Track form submissions and responses
- **User Authentication** - Secure user accounts with Supabase Auth
- **Form Sharing** - Share forms with custom URLs
- **Export Options** - Export form data in various formats
- **Performance Optimized** - Built with Next.js 15 and React 19

## 📋 Prerequisites

- Node.js (>= 18.0.0)
- npm (>= 8.0.0)
- FormWave Backend API running

## 🛠️ Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/WaselDasouqy/front-end-forms-builder.git
   cd front-end-forms-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in the required environment variables in `.env.local`:
   ```env
   # Frontend Configuration
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Supabase Configuration (for client-side auth)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Analytics (optional)
   NEXT_PUBLIC_GA_ID=your_google_analytics_id
   
   # Feature flags (optional)
   NEXT_PUBLIC_ENABLE_ANALYTICS=false
   NEXT_PUBLIC_ENABLE_SHARING=true
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 🏗️ Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start

# Build with bundle analysis
npm run build:analyze
```

## 📁 Project Structure

```
formwave-frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/         # Authentication pages
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── forms/          # Form-related pages
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # Reusable components
│   │   ├── ui/            # UI components
│   │   ├── forms/         # Form-related components
│   │   └── layout/        # Layout components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and configurations
│   ├── types/             # TypeScript type definitions
│   └── middleware.ts      # Next.js middleware
├── public/                # Static assets
├── package.json           # Dependencies and scripts
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── vercel.json            # Vercel deployment configuration
├── env.example            # Environment variables template
└── README.md              # This file
```

## 🎨 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **State Management**: Zustand
- **Drag & Drop**: @hello-pangea/dnd
- **Charts**: Recharts
- **Authentication**: Supabase Auth
- **Form Handling**: Custom form builder
- **Icons**: Lucide React

## 🔐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes | http://localhost:5000/api |
| `NEXT_PUBLIC_APP_URL` | Frontend app URL | Yes | http://localhost:3000 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes | - |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes | - |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | No | - |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics | No | false |
| `NEXT_PUBLIC_ENABLE_SHARING` | Enable form sharing | No | true |

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production ready frontend"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the frontend repository

3. **Configure Vercel Project**
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm ci`
   - **Development Command**: `npm run dev`

4. **Set Environment Variables**
   Add the following environment variables in Vercel:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
   NEXT_PUBLIC_APP_URL=https://your-frontend-domain.vercel.app
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel will automatically deploy on every push to main branch

### Manual Deployment

For other platforms:

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 🔧 Development Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run build:analyze` - Build with bundle analysis
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run export` - Export static site
- `npm run clean` - Clean build artifacts

## 🎯 Performance Optimizations

- **Next.js 15** with App Router for optimal performance
- **React 19** with concurrent features
- **Turbopack** for faster development builds
- **Image optimization** with Next.js Image component
- **Bundle splitting** for smaller initial loads
- **Tree shaking** to eliminate unused code
- **CSS optimization** with Tailwind CSS purging
- **Compression** enabled for all assets

## 🔒 Security Features

- **Content Security Policy** headers
- **XSS protection** with proper sanitization
- **CSRF protection** with SameSite cookies
- **Secure headers** configuration
- **Input validation** on all forms
- **Authentication** with Supabase Auth

## 🐛 Troubleshooting

### Common Issues

1. **Build errors**
   ```bash
   # Clear Next.js cache
   npm run clean
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Environment variables not working**
   - Ensure variables start with `NEXT_PUBLIC_` for client-side access
   - Restart development server after changing `.env.local`
   - Check that `.env.local` is not committed to git

3. **API connection issues**
   - Verify `NEXT_PUBLIC_API_URL` points to correct backend
   - Check CORS configuration in backend
   - Ensure backend is running and accessible

4. **Styling issues**
   ```bash
   # Rebuild Tailwind CSS
   npm run build
   ```

### Performance Issues

1. **Slow development server**
   - Use Turbopack: `npm run dev`
   - Clear `.next` directory: `npm run clean`

2. **Large bundle size**
   - Analyze bundle: `npm run build:analyze`
   - Check for unused dependencies
   - Optimize imports (use tree shaking)

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Commit changes: `git commit -m 'Add feature'`
7. Push to branch: `git push origin feature-name`
8. Create a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [troubleshooting section](#-troubleshooting)
2. Verify environment variables configuration
3. Ensure backend API is running and accessible
4. Check browser console for errors

For additional support, please open an issue in the GitHub repository.
