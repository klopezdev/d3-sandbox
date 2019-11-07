FROM klopezinfor/npm-server

# For live development, mount a volume to your workspace with -v
COPY webapp/ ./

# Build:        docker build --rm -t klopezinfor/d3-sandbox .
# Run Image:    docker run --rm -p 8080:8080 klopezinfor/d3-sandbox
# Development:  docker run --rm -v /Users/klopez3/work/proto/docker/d3-sandbox/webapp/:/webapp/ -p 8080:8080 klopezinfor/d3-sandbox
