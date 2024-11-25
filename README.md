# Onboard System

A modern onboarding system for companies to streamline their employee onboarding process.

## Features

- Multi-company support
- Customizable workflows
- Role-based access control
- Step-by-step onboarding process
- Document management
- Progress tracking
- Multi-language support (planned)

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, DaisyUI
- **Backend**: Supabase (Authentication and Database)
- **Database**: PostgreSQL
- **Deployment**: Netlify (planned)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sergioLiiD/onboard-system.git
   ```

2. Install dependencies:
   ```bash
   cd onboard-system
   npm install
   ```

3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development Status

- [x] Project setup
- [x] Authentication system
- [x] Database schema
- [ ] Dashboard implementation
- [ ] Workflow creation
- [ ] Step management
- [ ] Document handling
- [ ] Notifications
- [ ] Analytics
- [ ] Multi-language support

## License

This project is private and confidential.

## Contact

For any inquiries, please reach out to the repository owner.
