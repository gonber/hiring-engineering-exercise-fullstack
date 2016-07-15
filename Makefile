deps:
	@brew install postgres nvm
	@nvm install 6.2

start_db:
	@postgres -D /usr/local/var/postgres

init_db:
	@echo "\nInit DB. Please choose \"converge\" as the password\n"
	@if [[ ! -d /usr/local/var/postgres ]]; then initdb /usr/local/var/postgres; fi
	-@createuser converge -P
	-@createdb converge -O converge
	@npm run migrate

env:
	@export NVM_DIR="$HOME/.nvm"
	@. "$(brew --prefix nvm)/nvm.sh"
	@nvm use 6.2
	@npm install

