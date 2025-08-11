#!/bin/bash

# Start the frontend in a new tab
gnome-terminal \
	--tab \
	--title="Frontend" \
    	-- bash -c 'cd ./dashboard && npm run dev; exec bash'

# Start the backend in a new tab
gnome-terminal \
	--tab  \
	--title="Backend" \
    	-- bash -c 'cd ./backend && source .venv/bin/activate && python run.py; exec bash'

