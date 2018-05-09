
--Monday--

These files describe a simple account-creation post route, but notably, with an authentication setup. When users create accounts, their passwords will be hashed and immediately removed from the database. In addition, with each session a unique token will be generated to authenticate user requests.

--Tuesday--

In the next part of the lab, the developers added a 'get' route for user login, once an account has been created, as well as a 'post' route (and constructor) for a user profile which can include personalized information as opposed to merely identification credentials. 

Also added are middleware for authenticating sessions via use of tokens and the "secret key".

--

More functionality will be built in as the lab continues.