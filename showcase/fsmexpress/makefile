# Makefile generated automatically on June 18th 2013, 3:00:32 pm
# (c) 2013 - Vittorio Zaccaria, all rights reserved


# Initial definitions
SHELL=/bin/bash

# main target
all: makefile
	 make deploy 

# Client sources (javascript)
CLIENT_SOURCES =  \
	$(strip $(patsubst %, ./build/%, $(notdir $(patsubst %.ls, %.js, $(shell find ./js -name '*.ls')))))

# Vendor sources (javascript), client side
CLIENT_VENDOR_SOURCES =  \
	$(strip $(patsubst %, ./build/%, $(patsubst %.js, %.js, $(notdir ./assets/components/jquery/jquery.js)))) \
	$(strip $(patsubst %, ./build/%, $(patsubst %.js, %.js, $(notdir ./assets/components/bootstrap/js/bootstrap-transition.js)))) \
	$(strip $(patsubst %, ./build/%, $(patsubst %.js, %.js, $(notdir ./assets/components/bootstrap/js/bootstrap-alert.js)))) \
	$(strip $(patsubst %, ./build/%, $(patsubst %.js, %.js, $(notdir ./assets/components/bootstrap/js/bootstrap-modal.js)))) \
	$(strip $(patsubst %, ./build/%, $(patsubst %.js, %.js, $(notdir ./assets/components/bootstrap/js/bootstrap-dropdown.js)))) \
	$(strip $(patsubst %, ./build/%, $(patsubst %.js, %.js, $(notdir ./assets/components/bootstrap/js/bootstrap-scrollspy.js)))) \
	$(strip $(patsubst %, ./build/%, $(patsubst %.js, %.js, $(notdir ./assets/components/bootstrap/js/bootstrap-tab.js)))) \
	$(strip $(patsubst %, ./build/%, $(patsubst %.js, %.js, $(notdir ./assets/components/bootstrap/js/bootstrap-tooltip.js)))) \
	$(strip $(patsubst %, ./build/%, $(patsubst %.js, %.js, $(notdir ./assets/components/bootstrap/js/bootstrap-popover.js)))) \
	$(strip $(patsubst %, ./build/%, $(patsubst %.js, %.js, $(notdir ./assets/components/bootstrap/js/bootstrap-button.js)))) \
	$(strip $(patsubst %, ./build/%, $(patsubst %.js, %.js, $(notdir ./assets/components/bootstrap/js/bootstrap-collapse.js)))) \
	$(strip $(patsubst %, ./build/%, $(patsubst %.js, %.js, $(notdir ./assets/components/bootstrap/js/bootstrap-carousel.js)))) \
	$(strip $(patsubst %, ./build/%, $(patsubst %.js, %.js, $(notdir ./assets/components/bootstrap/js/bootstrap-typeahead.js)))) \
	$(strip $(patsubst %, ./build/%, $(patsubst %.js, %.js, $(notdir ./assets/components/moment/moment.js)))) \
	$(strip $(patsubst %, ./build/%, $(patsubst %.js, %.js, $(notdir ./assets/components/showdown/src/showdown.js)))) \
	$(strip $(patsubst %, ./build/%, $(patsubst %.js, %.js, $(notdir ./js/d3.v2.js)))) \
	$(strip $(patsubst %, ./build/%, $(patsubst %.js, %.js, $(notdir ./js/force-fsm.js))))

# Client sources (css)
CLIENT_CSS_SOURCES =  \
	$(strip $(patsubst %, ./build/%, $(patsubst %.less, %.css, $(notdir ./assets/components/bootstrap/less/bootstrap.less)))) \
	$(strip $(patsubst %, ./build/%, $(patsubst %.less, %.css, $(notdir ./assets/components/bootstrap/less/responsive.less))))

# Client html
CLIENT_HTML =  \
	$(strip $(patsubst %, ./build/%, $(patsubst %.jade, %.html, $(notdir ./assets/index.jade))))

# Client dependencies (css)

# Assets (images)
CLIENT_IMG =  \
	$(strip $(patsubst %, ./deploy/static/img/%, $(notdir $(shell find ./assets/img/backgrounds -name '*.png'))))

# Build up client.js
./build/client.js: $(CLIENT_SOURCES)
	cat $^ > $@

# Build up vendor.js
./build/vendor.js: $(CLIENT_VENDOR_SOURCES)
	cat $^ > $@

# Build up client.css
./build/client.css: $(CLIENT_CSS_SOURCES) 
	cat  $(CLIENT_CSS_SOURCES) > $@

# Install server files
.PHONY: install
install: build
	 @echo '' 
	 @echo ' [34mInstalling into ./deploy[0m' 1>&2
	 mkdir -p ./deploy
	 mkdir -p ./deploy/server
	 mkdir -p ./deploy/static
	 mkdir -p ./deploy/static/js
	 mkdir -p ./deploy/static/css
	 mkdir -p ./deploy/static/img
	 mkdir -p ./deploy/static/font
	 mkdir -p ./deploy/static/html
	 install -m 555 $(strip $(patsubst %, ./build/%, $(patsubst %.jade, %.html, $(notdir ./assets/index.jade)))) ./deploy/static/
	 install -m 555 ./build/client.js ./deploy/static/js
	 install -m 555 ./build/vendor.js ./deploy/static/js
	 install -m 555 ./build/client.css ./deploy/static/css
	 -mkdir -p deploy/static/data
	 cp data/*.json deploy/static/data 


js/init-page.ls: js/init-page.ls.template ../../README.md
	 ./tools/insert.ls ./js/init-page.ls.template -s ../../README.md > ./js/init-page.ls

update-web: deploy
	 ./tools/deploy.coffee -s ./deploy/static -c "/Users/zaccaria/development/github/fluent-fsm/showcase/fsmexpress" -w "./fluent-fsm" deploy -v -e
	 @echo '' 
	 @echo ' [34mInstalled[0m' 1>&2

# Prepare build directory
prepare-build: 
	 mkdir -p ./build

# Build files
.PHONY: build
build:  ./build/client.js ./build/vendor.js ./build/client.css $(CLIENT_HTML)

# Deploy files
.PHONY: deploy
deploy:
	 @echo '' 
	 @echo ' [34mDeploying... fails if not ok at the end[0m' 1>&2
	 make prepare-build
	 make install
	 make install-assets
	 @echo '' 
	 @echo ' [32mOK[0m' 1>&2

# VPATH definition
VPATH =  \
	./js \
	./assets/img/backgrounds \
	$(dir ./assets/index.jade) \
	$(dir ./assets/components/bootstrap/less/bootstrap.less) \
	$(dir ./assets/components/bootstrap/less/responsive.less) \
	$(dir ./assets/components/jquery/jquery.js) \
	$(dir ./assets/components/bootstrap/js/bootstrap-transition.js) \
	$(dir ./assets/components/bootstrap/js/bootstrap-alert.js) \
	$(dir ./assets/components/bootstrap/js/bootstrap-modal.js) \
	$(dir ./assets/components/bootstrap/js/bootstrap-dropdown.js) \
	$(dir ./assets/components/bootstrap/js/bootstrap-scrollspy.js) \
	$(dir ./assets/components/bootstrap/js/bootstrap-tab.js) \
	$(dir ./assets/components/bootstrap/js/bootstrap-tooltip.js) \
	$(dir ./assets/components/bootstrap/js/bootstrap-popover.js) \
	$(dir ./assets/components/bootstrap/js/bootstrap-button.js) \
	$(dir ./assets/components/bootstrap/js/bootstrap-collapse.js) \
	$(dir ./assets/components/bootstrap/js/bootstrap-carousel.js) \
	$(dir ./assets/components/bootstrap/js/bootstrap-typeahead.js) \
	$(dir ./assets/components/moment/moment.js) \
	$(dir ./assets/components/showdown/src/showdown.js) \
	$(dir ./js/d3.v2.js) \
	$(dir ./js/force-fsm.js) \

# Start Continuous Build
start-cb: 
	 @echo '' 
	 @echo ' [34mStarting continuous build[0m' 1>&2
	@touch ./client-changed
	@touch ./recompile-all
	watchman -w ./js 'touch ./client-changed' &
	watchman -w ./assets/img/backgrounds 'touch ./client-changed' &
	watchman -w ./assets/index.jade 'touch ./client-changed' &
	watchman -w ./assets/components/bootstrap/less/bootstrap.less 'touch ./client-changed' &
	watchman -w ./assets/components/bootstrap/less/responsive.less 'touch ./client-changed' &
	watchman -w ./assets/components/jquery/jquery.js 'touch ./client-changed' &
	watchman -w ./assets/components/bootstrap/js/bootstrap-transition.js 'touch ./client-changed' &
	watchman -w ./assets/components/bootstrap/js/bootstrap-alert.js 'touch ./client-changed' &
	watchman -w ./assets/components/bootstrap/js/bootstrap-modal.js 'touch ./client-changed' &
	watchman -w ./assets/components/bootstrap/js/bootstrap-dropdown.js 'touch ./client-changed' &
	watchman -w ./assets/components/bootstrap/js/bootstrap-scrollspy.js 'touch ./client-changed' &
	watchman -w ./assets/components/bootstrap/js/bootstrap-tab.js 'touch ./client-changed' &
	watchman -w ./assets/components/bootstrap/js/bootstrap-tooltip.js 'touch ./client-changed' &
	watchman -w ./assets/components/bootstrap/js/bootstrap-popover.js 'touch ./client-changed' &
	watchman -w ./assets/components/bootstrap/js/bootstrap-button.js 'touch ./client-changed' &
	watchman -w ./assets/components/bootstrap/js/bootstrap-collapse.js 'touch ./client-changed' &
	watchman -w ./assets/components/bootstrap/js/bootstrap-carousel.js 'touch ./client-changed' &
	watchman -w ./assets/components/bootstrap/js/bootstrap-typeahead.js 'touch ./client-changed' &
	watchman -w ./assets/components/moment/moment.js 'touch ./client-changed' &
	watchman -w ./assets/components/showdown/src/showdown.js 'touch ./client-changed' &
	watchman -w ./js/d3.v2.js 'touch ./client-changed' &
	watchman -w ./js/force-fsm.js 'touch ./client-changed' &
	watchman -w ./client-changed 'make deploy; chromereload;' &
	watchman -w ./recompile-all 'make clean && make deploy; chromereload;' &
	@serve ./deploy/static &
	watchman -w ./assets/components/bootstrap/less 'touch ./recompile-all' &

# Stop Continuous Build
stop-cb:
	 -killall node

# Common targets
./build/%.js: %.ls
	 @echo '' 
	 @echo ' [34mCompiling $^[0m' 1>&2
	 lsc --output ./build -c $<

./build/%.js: %.js
	 cp $< $@
    
./build/%.js: %.coffee
	 @echo '' 
	 @echo ' [34mCompiling $^[0m' 1>&2
	 coffee -b -l --output ./build -c $<
    
./build/%.html: %.jade
	 @echo '' 
	 @echo ' [34mCompiling $^[0m' 1>&2
	 @jade -P --out ./build $<

./build/%.css: %.css
	 cp $< $@

./build/%.html: %.html
	 cp $< $@

./build/%.html: %.svg
	 cp $< $@

./build/%.css: %.styl
	 @echo '' 
	 @echo ' [34mCompiling $^[0m' 1>&2
	 stylus $< -o ./build

./deploy/static/img/%: %
	 cp $< $@

./deploy/static/font/%: %
	 cp $< $@

makefile: makefile.ls
	 @echo '' 
	 @echo ' [34mCompiling $^[0m' 1>&2
	 ./makefile.ls > makefile 

npm-install:
	 @echo '' 
	 @echo ' [34mInstalling a link globally on this machine.[0m' 1>&2
	 @echo '' 
	 @echo ' [34mRemember to do a `npm link pkg name` in the[0m' 1>&2
	 @echo '' 
	 @echo ' [34mDirectory of the modules that are going to use this.[0m' 1>&2
	 npm link .

npm-patch:
	 @echo '' 
	 @echo ' [34mWarning this is going to tag the current dev. branch and merge it to master.[0m' 1>&2
	 @echo '' 
	 @echo ' [34mThe tag will be brought to the master branch.[0m' 1>&2
	 git checkout development
	 npm version patch 
	 git commit -a 
	 git checkout master
	 git merge development
	 npm publish

npm-minor:
	 @echo '' 
	 @echo ' [34mWarning this is going to tag the current dev. branch and merge it to master.[0m' 1>&2
	 @echo '' 
	 @echo ' [34mThe tag will be brought to the master branch.[0m' 1>&2
	 git checkout development
	 npm version minor 
	 git commit -a 
	 git checkout master
	 git merge development
	 npm publish

npm-major:
	 @echo '' 
	 @echo ' [34mWarning this is going to tag the current dev. branch and merge it to master.[0m' 1>&2
	 @echo '' 
	 @echo ' [34mThe tag will be brought to the master branch.[0m' 1>&2
	 git checkout development
	 npm version major 
	 git commit -a 
	 git checkout master
	 git merge development
	 npm publish

distclean:
	 -rm -rf ./build 
	 -rm -rf ./deploy 
    
./build/%.css: %.less 
	 @echo '' 
	 @echo ' [34mCompiling $^[0m' 1>&2
	 lessc --verbose $< > $@

# Clean up
clean:
	  -rm -rf ./deploy/*
	  -rm -rf ./build/*
	  -rm -f ./client-changed
	  -rm -f ./recompile-all

# Install assets
	 @echo '' 
	 @echo ' [34mInstalling assets[0m' 1>&2
install-assets: $(CLIENT_IMG) 
