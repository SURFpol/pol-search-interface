# POL search portal

## Setup

    npm install
    # Create a .env file which contains
    # APP="your-index-name"
    # URL="https://to-es-cluster"
    # CREDENTIALS="user:pass"
    npm start
    # now localhost:3000 will open up and refesh on save

## Release
    
    npm run build
    rsync -av -e "ssh" --rsync-path="sudo rsync" build/ ubuntu@surfpol-search.sda.surf-hosted.nl:/var/www/html --delete

