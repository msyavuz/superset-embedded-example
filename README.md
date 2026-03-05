# Superset Embedded Dashboard Demo

A React application demonstrating how to embed Apache Superset dashboards using the Superset Embedded SDK.

<img width="1696" height="1034" alt="image" src="https://github.com/user-attachments/assets/028b85fe-99f8-4cc6-bed3-c1b9c02cb8cb" />


## Features

- **Guest Token Authentication**: Secure authentication using Superset's guest token system
- **Dynamic Configuration**: Real-time dashboard UI configuration with JSON
- **Theme Support**: Multiple preset themes with live switching
- **Dark Mode**: Built-in dark/light mode toggle
- **Live Preview**: Instant preview of embedded dashboards with configuration changes

## Getting Started

>[!NOTE]
> If you have a superset instance deployed for testing you can use the [live app](https://superset-embedded-example.appwrite.network/)  to test embedding a dashboard directly.

### Prerequisites

- Node.js 18+
- Apache Superset instance with embedded dashboards enabled
- Admin credentials for your Superset instance

### Superset Configuration

For embedded dashboards to work properly, your Superset instance must be configured with CORS support:

1. **Edit your `superset_config.py` file** and add:

```python
# Enable CORS
ENABLE_CORS = True

# Configure CORS options
CORS_OPTIONS = {
    'origins': [
        'http://localhost:3000',  # Your React app's URL
        # Add other allowed origins as needed
    ],
    'allow_headers': ['Content-Type', 'Authorization'],
    'supports_credentials': True,
}

# Enable embedded dashboards feature
FEATURE_FLAGS = {
    "EMBEDDED_SUPERSET": True,
}

# Configure guest role (important for embedded dashboards)
# The PUBLIC_ROLE_LIKE must be set to grant permissions to embedded users
PUBLIC_ROLE_LIKE = "Gamma"  # or another role with dashboard access

# Optional: Configure specific guest role permissions
GUEST_ROLE_NAME = "Guest"
```

2. **Restart your Superset instance** for changes to take effect

3. **Create an embedded dashboard** in Superset:
   - Navigate to your dashboard
   - Click on the three dots menu → "Embed dashboard"
   - Copy the generated embedded ID

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start on port 3000 by default. You can specify a different port by creating a `.env` file with `PORT=<your-port>`.

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

## Troubleshooting

### Common Issues

1. **403 Forbidden on `/api/v1/me/roles/`**
   - Ensure `PUBLIC_ROLE_LIKE` is set in `superset_config.py`
   - Check that the dashboard is properly shared for embedding
   - Verify the user creating the guest token has admin permissions

2. **CORS Errors**
   - Verify `ENABLE_CORS = True` in `superset_config.py`
   - Ensure your app's URL is in the `CORS_OPTIONS['origins']` list
   - Restart Superset after configuration changes

3. **Invalid Dashboard ID**
   - Use the UUID from the "Embed dashboard" dialog in Superset
   - Don't use the numeric dashboard ID from the URL

4. **Authentication Failed**
   - Verify your Superset instance is running
   - Check username/password are correct
   - Ensure the user has permission to create guest tokens

## License

Apache-2.0
