# Check if .env.development exists
if [ ! -f .env.development ]; then
  echo "❌ Error: .env.development not found."
  echo "Please copy .env;developement from the template and update with your Neon Credentials"
  exit 1
fi

# Check if docker is running 
if ! docker info > /dev/null 2>&1; then
  echo "❌ Error: Docker is not running."
  echo "Please start Docker and try again."
  exit 1
fi

# Create .neon_local directory if it doesn't exist
mkdir -p .neon_local

# Add .neon_local to .gitignore if not already present
if ! grep -q ".neon_local/" .gitignore 2>/dev/null; then
  echo ".neon_local/" >> .gitignore
  echo "✅ Added .neon_local/ to .gitignore"
fi

echo "Building and starting the Docker container..."
echo " - Neon local proxy will create an ephemeral database branch"
echo " - Application will run with hot reload enabled"
echo ""

# Run migrations with Drizzle
echo "Applying latest schema with Drizzle..."
npm run db:migrate
echo "✅ Migrations applied successfully."


# Wait for the database to be ready
echo "Waiting for the database to be ready..."
docker compose exec neon-local psql -U neon -d neondb -c "SELECT 1"


# Start development environment 

docker compose -f docker-compose.dev.yml up --build

echo ""
echo "🎉 Development environment is up and running!"
echo " Application: http://localhost:5173"
echo " Database: postgres://neon@localhost:5432/neondb"
echo ""
echo "To stop the environment, press Ctrl+C or run: docker compose down"