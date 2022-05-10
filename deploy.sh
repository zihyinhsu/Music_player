npm run build
cd dist
git init
git add -A
git commit -m "deploy"

git push -f git@github.com:a121515222/Music_player.git main:gh-pages