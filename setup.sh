echo "Please enter your app name, e.g. testApp:"
read appName
find . -type f -name "*.js" -print0 | xargs -0 sed -i '.bak' -e "s/newappApp/$appName/g"
find . -type f -name "*.html" -print0 | xargs -0 sed -i '.bak' -e "s/newappApp/$appName/g"
echo  "Done."