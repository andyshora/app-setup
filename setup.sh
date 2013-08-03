echo "Please enter your app name, e.g. testApp:"
read appName
find . -type f -name "*.js" -print0 | xargs -0 sed -i '.bak' -e "s/newappApp/$appName/g"
find . -type f -name "*.html" -print0 | xargs -0 sed -i '.bak' -e "s/newappApp/$appName/g"
echo  "Replaced app name references"
cd app
echo  "Installing npm dependencies"
npm i
echo  "Installing bower dependencies"
bower i
echo  "Done. You can now run 'grunt server' to see your app."
echo  "Do you want to add a dev domain to use locally on MAMP?"
read dev
if [ "$dev" == "y" ]; then
	echo "Enter dev domain, e.g. dev.myapp.com"
	read domain
	find . -type f -name "Gruntfile.js" -print0 | xargs -0 sed -i '.bak' -e "s/localhost/$domain/g"
	cp /etc/hosts ~/hosts.bak
	sudo bash -c 'sudo echo "127.0.0.1	$domain" >> /etc/hosts'
fi
