#!/usr/bin/env bash

set -ex

npm run build

scp -r build/* archive@app.archive.bbdomain.org:/sites/archive-frontend