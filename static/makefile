
all: js/force-fsm.js css/force.css js/force-json.js index.html

index.html: index.jade
	jade index.jade

css/force.css: css/force.less
	lessc $< > $@

js/%.js: js/%.ls
	lsc -c $< 
	
clean:
	rm -f css/*.css
	rm -f js/force-json.js
	
preview:
	watchman js "make; chromereload;" & 
	jade -w index.jade