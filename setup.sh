echo "Please enter your app name, e.g. testApp:"
read appName
find . -type f -name "*.js" -print0 | xargs -0 sed -i '' -e "s/newappApp/$appName/g"
find . -type f -name "*.html" -print0 | xargs -0 sed -i '' -e "s/newappApp/$appName/g"
echo  "Replaced app name references"
cd app
echo  "Do you want to install npm and bower dependencies now? (y/n)"
read install
if [ "$install" == "y" ]; then
	echo  "Installing npm dependencies"
	npm i
	echo  "Installing bower dependencies"
	bower i
	echo  "Done. You can now run 'grunt server' to see your app."
fi
echo  "Do you want to add a dev domain to use locally? (y/n)"
read dev
if [ "$dev" == "y" ]; then
	echo "Enter dev domain, e.g. dev.myapp.com"
	read domain
	find . -type f -name "Gruntfile.js" -print0 | xargs -0 sed -i '.bak' -e "s/dev\.app-setup\.com/$domain/g"
	echo  "Do you want to add this new dev domain to your hosts file? (y/n)"
	read add
	if [ "$add" == "y" ]; then
		cp /etc/hosts ~/hosts.bak
		sudo bash -c "sudo echo '127.0.0.1	'$domain >> /etc/hosts"
	fi
	echo "Done."
fi