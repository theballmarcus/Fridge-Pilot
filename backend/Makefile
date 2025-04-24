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
		-d "{\"age\": 25, \"gender\": 0, \"height\": 180, \"weight\": 75, \"activityLevel\": 4, \"goal\": \"muscle gain\"}"
	@echo "\nUser details sent"

post_groceries:
	@echo "Posting groceries"
	@TOKEN=$$(jq -r '.token' $(TOKEN_FILE)); \
	curl -s -X POST http://localhost:8080/api/diet/groceries \
		-H "Content-Type: application/json" \
		-H "Authorization: Bearer $$TOKEN" \
		-d "{\"groceries\": [\"apple\", \"cheese\", \"bread\"]}"
	@echo "\nGroceries posted"
	
test_flow:
	@$(MAKE) register_user RANDOM_USER=$(RANDOM_USER)
	@$(MAKE) login RANDOM_USER=$(RANDOM_USER)
	@$(MAKE) register_details
	cat .token.json
