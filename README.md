# Superset Embedded Dashboard Demo

A React application demonstrating how to embed Apache Superset dashboards using the Superset Embedded SDK.

## Features

- **Guest Token Authentication**: Secure authentication using Superset's guest token system
- **Dynamic Configuration**: Real-time dashboard UI configuration with JSON
- **Theme Support**: Multiple preset themes with live switching
- **Dark Mode**: Built-in dark/light mode toggle
- **Live Preview**: Instant preview of embedded dashboards with configuration changes

## Getting Started

### Prerequisites

- Node.js 18+
- Apache Superset instance with embedded dashboards enabled
- Admin credentials for your Superset instance

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start on the port specified in your `.env` file (default: 3000).

### Configuration

1. Enter your Superset instance URL (e.g., `http://localhost:8088`)
2. Provide admin credentials for authentication
3. Enter the embedded dashboard ID from your Superset instance
4. Customize the dashboard UI configuration as needed
5. Click "Display Embed" to preview

## Building for Production

```bash
npm run build
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code

## Technologies

- **React 19** - UI framework
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Data fetching and caching
- **Superset Embedded SDK** - Dashboard embedding
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Vite** - Build tool

## License

MIT