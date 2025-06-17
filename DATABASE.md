# PulseFit Database Setup

This document explains how to set up and manage the PulseFit database in Docker.

## Quick Start

1. **Start the application with database:**
   \`\`\`bash
   make up
   \`\`\`

2. **Check if everything is running:**
   \`\`\`bash
   make ps
   make health
   \`\`\`

3. **Access the application:**
   - Web App: http://localhost:3000
   - Database: localhost:5432

## Database Management

### Initial Setup
The database is automatically initialized when you start the Docker containers. The initialization includes:
- Creating all necessary tables
- Setting up indexes for performance
- Creating default admin and user accounts
- Seeding sample data

### Manual Database Operations

**Run migrations:**
\`\`\`bash
make db-migrate
\`\`\`

**Seed sample data:**
\`\`\`bash
make db-seed
\`\`\`

**Access database shell:**
\`\`\`bash
make db-shell
\`\`\`

**Create backup:**
\`\`\`bash
make db-backup
\`\`\`

**Reset database (WARNING: This will delete all data):**
\`\`\`bash
make db-reset
\`\`\`

## Database Schema

### Tables

1. **users** - User accounts and profiles
2. **subscriptions** - User subscription details
3. **attendance** - Gym check-in/check-out records
4. **exercises** - Workout logging

### Default Accounts

**Admin Account:**
- Email: admin@pulsefit.com
- Password: admin123
- Role: admin

**Demo User Account:**
- Email: user@pulsefit.com
- Password: user123
- Role: user

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user

### Attendance
- `GET /api/attendance?userId=X` - Get user attendance
- `POST /api/attendance` - Check in/out

### Exercises
- `GET /api/exercises?userId=X` - Get user exercises
- `POST /api/exercises` - Log exercise
- `DELETE /api/exercises?id=X&userId=Y` - Delete exercise

### Health Check
- `GET /api/health` - Check database connectivity

## Environment Variables

The following environment variables are automatically set in Docker:

\`\`\`env
DATABASE_URL=postgresql://pulsefit_user:pulsefit_password@postgres:5432/pulsefit
POSTGRES_USER=pulsefit_user
POSTGRES_PASSWORD=pulsefit_password
POSTGRES_DATABASE=pulsefit
\`\`\`

## Troubleshooting

### Database Connection Issues
1. Check if PostgreSQL container is running:
   \`\`\`bash
   docker-compose ps postgres
   \`\`\`

2. Check database logs:
   \`\`\`bash
   docker-compose logs postgres
   \`\`\`

3. Test connection:
   \`\`\`bash
   make health
   \`\`\`

### Reset Everything
If you encounter issues, you can reset the entire setup:
\`\`\`bash
make clean
make up
\`\`\`

### Performance Monitoring
Monitor database performance:
\`\`\`bash
make stats
\`\`\`

## Backup Strategy

- Automatic daily backups are created in `scripts/backup/`
- Backups older than 7 days are automatically deleted
- Manual backups can be created with `make db-backup`

## Production Considerations

1. **Security:**
   - Change default passwords
   - Use environment variables for secrets
   - Enable SSL connections

2. **Performance:**
   - Monitor connection pool usage
   - Add database indexes as needed
   - Consider read replicas for scaling

3. **Backup:**
   - Set up automated backups to external storage
   - Test backup restoration procedures
   - Monitor backup success/failure

4. **Monitoring:**
   - Set up database monitoring
   - Configure alerts for connection issues
   - Monitor query performance
\`\`\`

Now your PulseFit application has a fully functional database setup with:

✅ **Complete database schema** with all necessary tables
✅ **Automatic migrations** and initialization
✅ **API endpoints** for all database operations
✅ **Sample data seeding** for testing
✅ **Health checks** and monitoring
✅ **Backup and restore** functionality
✅ **Docker integration** with proper networking
✅ **Development tools** and scripts

You can now run `make up` and have a fully functional PulseFit application with a real database backend!
