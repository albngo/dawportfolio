To set up this application, please refer to the following steps:

Open the virtual machine, and clone the repo with "git clone https://github.com/albngo/dawportfolio.git".

Then navigate into the folder directory with "cd dawportfolio".

Then do "curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -" and "sudo apt install -y nodejs" right after, this ensures Node.js and npm are installed.

Then run "npm install axios bcryptjs dotenv ejs express express-sanitizer express-validator express-session mysql2 node nodejs request stack".

This will install all the required dependencies or alternatively run "npm init" this should also install all the dependencies so use the above just in case.

Now, run "sudo mysql", and log in with your log in and password for the root user.

Once inside mysql, run "source create_db.sql", and then run "exit".

Now you are all ready to run the application. 

Run "node index.js" and go to "https://www.doc.gold.ac.uk/usr/691/" to view the application.

Enjoy!
