# RentEase

RentEase is a modern property rental platform that connects property owners with potential renters. This repository contains the frontend and backend code for the RentEase application.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization
- Property listings with detailed information
- Advanced search and filtering options
- Booking and payment system
- User profiles and reviews
- Dashboard for property owners
- Responsive design for all devices

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Hero UI components

### Backend
- Django
- Django REST Framework
- PostgreSQL
- Redis

### Other Services
- ModemPay for payment processing
- EdgeStore for file storage
- Google OAuth for authentication

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v18 or later)
- npm or yarn
- Python (v3.8 or later)
- PostgreSQL
- Redis
- Docker (optional, for containerized deployment)

## Installation

### Clone the repository

```bash
git clone https://github.com/yourusername/rent-ease.git
cd rent-ease
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd rent_ease
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add the following environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_EDGESTORE_URL=http://localhost:3000/api/edgestore
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_MODEM_PAYMENT_CURRENCY=GMD
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd ../rent_ease_backend
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory and add the following environment variables:
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgres://username:password@localhost:5432/rent_ease
REDIS_URL=redis://localhost:6379/0
MODEM_API_KEY=your-modempay-api-key
GOOGLE_CLIENT_ID=your-google-client-id
FRONTEND_URL=http://localhost:3000
DEFAULT_FROM_EMAIL=your-email@example.com
```

## Configuration

### Database Setup

1. Create a PostgreSQL database named `rent_ease`.

2. Run migrations:
```bash
python manage.py migrate
```

### Redis Setup

Ensure Redis is running on your local machine or update the `REDIS_URL` in the backend `.env` file to point to your Redis server.

## Running the Application

### Frontend

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000`

### Backend

1. Start the Django development server:
```bash
python manage.py runserver
```

2. The backend will be available at `http://localhost:8000`

## Deployment

### Frontend Deployment

1. Build the frontend for production:
```bash
npm run build
```

2. Deploy the `out` directory to your preferred hosting service.

### Backend Deployment

1. Collect static files:
```bash
python manage.py collectstatic
```

2. Deploy the application to your preferred hosting service, ensuring to configure the necessary environment variables.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.