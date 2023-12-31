.PHONY: start
start:
	uvicorn main:app --reload --port 9000
#uvicorn main:app --port 443 --host 0.0.0.0 --workers 1 --ssl-keyfile=./private.key --ssl-certfile=./bundle.crt

.PHONY: format
format:
	black .
	isort .