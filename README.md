# OSRS Tracker

A free and open-source web application for tracking Old School RuneScape player progress, milestones, and achievements. Built with modern web technologies to provide a beautiful, responsive experience for the OSRS community.

## About

OSRS Tracker helps players monitor their journey through Gielinor by tracking skill levels, experience gains, boss kill counts, and milestone achievements. Whether you're grinding for your first 99 or working towards max cape, this tool provides the insights you need to stay motivated and track your progress over time.

## Features

- **Player Progress Tracking** - Monitor skill levels, XP gains, and overall progression with historical data visualization
- **Milestone System** - Celebrate achievements like 99s, base levels, and boss kill count thresholds
- **Goal Tracking** - See how close you are to your next milestone and plan your grind accordingly
- **Account Verification** - Securely link your OSRS account through RuneLite plugin integration to unlock personalized features
- **Name Change History** - Track account name changes and maintain historical records
- **Beautiful Dashboard** - Modern, responsive UI built with Tailwind CSS
- **Real-time Updates** - Refresh player data on-demand to get the latest stats

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Project Structure

```
osrs-tracker/
├── app/                    # Next.js app router pages and API routes
├── components/             # React components
│   ├── dashboard/         # Dashboard-specific components
│   ├── layout/            # Header, footer, etc.
│   ├── player/            # Player tracking components
│   └── ui/                # Reusable UI components
├── lib/                    # Utility functions and configurations
├── prisma/                 # Database schema and migrations
├── services/               # Business logic services
│   ├── milestone/         # Milestone calculation logic
│   ├── name-change/       # Name change tracking
│   ├── osrs/              # OSRS API integration
│   ├── player/            # Player data management
│   └── snapshot/          # Snapshot handling
└── types/                  # TypeScript type definitions
```

## Development Workflow

This project follows a simplified GitHub Flow branching strategy:

1. Create a feature branch from `main` using the naming convention: `feature/your-feature-name`
2. Make commits following [Conventional Commits](https://www.conventionalcommits.org/) format
3. Push your branch and create a Pull Request
4. After code review and approval, merge to `main`

### Branch Naming Examples

- `feature/user-dashboard` - New features
- `bugfix/skill-chart-rendering` - Bug fixes
- `refactor/api-error-handling` - Code refactoring
- `docs/api-documentation` - Documentation updates
- `chore/update-dependencies` - Maintenance tasks

### Commit Message Format

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Examples:**
- `feat(api): add GraphQL endpoint for player queries`
- `fix(components): resolve skill chart rendering issue`
- `docs(readme): update development workflow section`

## Contributing

Contributions are welcome! This project is open source and we encourage the community to help improve it. Whether it's bug fixes, new features, or documentation improvements, your contributions make this project better for everyone.

Before contributing, please read our [Contributing Guidelines](CONTRIBUTING.md) which includes:
- Detailed Git branching and commit conventions
- Pull request guidelines
- Code review process
- Best practices for development

Please feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## License

This project is open source and available for the community to use and contribute to.

## Acknowledgments

Built for the Old School RuneScape community. Special thanks to Jagex for providing the official OSRS Hiscores API that makes this project possible.
