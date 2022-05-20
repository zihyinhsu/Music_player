npm run build
cd dist
git init
git add -A
git commit -m "deploy"
git branch -M main
<<<<<<< HEAD
git push -f git@github.com:a121515222/Music_player.git main:gh-pages
=======
git push -f git@github.com:zihyinhsu/Music_player.git main:gh-pages
>>>>>>> 5de3576e10916d02e831c426f7e9d22538ad1ec1
