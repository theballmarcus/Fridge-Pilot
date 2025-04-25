RANDOM_USER=$(shell date +%s)
PASSWORD=$(shell date +%s)
TOKEN_FILE=.token.json

register_user:
	@echo "Registering user as $(RANDOM_USER)..."
	@curl -s -X POST http://localhost:8080/api/auth/register \
		-H "Content-Type: application/json" \
		-d "{\"mail\": \"$(RANDOM_USER)@example.com\", \"password\": \"$(PASSWORD)\"}" > /dev/null

login:
	@echo "Logging in as $(RANDOM_USER)..."
	@curl -s -X POST http://localhost:8080/api/auth/login \
		-H "Content-Type: application/json" \
		-d "{\"mail\": \"$(RANDOM_USER)@example.com\", \"password\": \"$(PASSWORD)\"}" > $(TOKEN_FILE)
	@echo "Token saved to $(TOKEN_FILE)"

register_details:
	@echo "Sending user details..."
	@TOKEN=$$(jq -r '.token' $(TOKEN_FILE)); \
	curl -s -X POST http://localhost:8080/api/auth/register_details \
		-H "Content-Type: application/json" \
		-H "Authorization: Bearer $$TOKEN" \
		-d "{\"birthday\": 10000, \"gender\": 0, \"height\": 180, \"weight\": 75, \"activityLevel\": 4, \"monthlyGoal\": 1}"
	@echo "\nUser details sent"

post_groceries:
	@echo "Posting groceries"
	@TOKEN=$$(jq -r '.token' $(TOKEN_FILE)); \
	curl -s -X POST http://localhost:8080/api/diet/groceries \
		-H "Content-Type: application/json" \
		-H "Authorization: Bearer $$TOKEN" \
		-d "{\"groceries\": [\"apple\", \"cheese\", \"bread\"]}"
	@echo "\nGroceries posted"

post_mealplan:
	@echo "Posting mealplan"
	@TOKEN=$$(jq -r '.token' $(TOKEN_FILE)); \
	curl -s -X POST http://localhost:8080/api/diet/mealplan \
		-H "Content-Type: application/json" \
		-H "Authorization: Bearer $$TOKEN" \
		-d "{\"date\": 1745569512581}"
	@echo "\nMealplan posted"
	
flush_database:
	@echo "Flushing database"
	@TOKEN=$$(jq -r '.token' $(TOKEN_FILE)); \
	curl -s -X POST http://localhost:8080/api/flush \
		-H "Content-Type: application/json" \
		-H "Authorization: Bearer $$TOKEN"
	@echo "\nDatabase flushed"

get_mealplan:
	@echo "Flushing database"
	@TOKEN=$$(jq -r '.token' $(TOKEN_FILE)); \
	curl -s -X GET http://localhost:8080/api/diet/mealplan/1745576260483 \
		-H "Content-Type: application/json" \
		-H "Authorization: Bearer $$TOKEN" 
	@echo "\nDatabase flushed"

test_flow:
	@$(MAKE) register_user RANDOM_USER=$(RANDOM_USER)
	@$(MAKE) login RANDOM_USER=$(RANDOM_USER)
	@$(MAKE) register_details
	@$(MAKE) post_groceries
	cat .token.json
