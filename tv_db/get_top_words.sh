#!/bin/bash
python cat_overview.py | sort | uniq -c | sort -r | less
