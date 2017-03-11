MOCHA_REPORTER = spec
TEST_TIME_OUT = 5000

test:
	@./node_modules/mocha/bin/mocha  \
		--recursive \
		--reporter $(MOCHA_REPORTER) \
		--timeout $(TEST_TIME_OUT)

test_debug:
	@./node_modules/mocha/bin/mocha \
		--debug-brk 

.PHONY: test test_debug
