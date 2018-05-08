These files describe a simple account-creation post route, but notably, with an authentication setup. When users create accounts, their passwords will be hashed and immediately removed from the database. In addition, with each session a unique token will be generated to authenticate user requests.

More functionality will be built in as the lab continues.