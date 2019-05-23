# POL search portal

## Setup

1. `npm install`

2. Create a .env file which contains:
```
REACT_APP_INDEX="your-index-name"
REACT_APP_URL="https://to-es-cluster"
REACT_APP_CREDENTIALS="user:pass"
```
NOTE: "-nl" will be added automatically to the index name

3. npm start

# now localhost:3000 will open up and refesh on save

## Release

1. `npm run build`
2. `rsync -av -e "ssh" --rsync-path="sudo rsync" build/ ubuntu@surfpol-search.sda.surf-hosted.nl:/var/www/html --delete`

