 

Command line tool 

Build a custom Command line tool which can behave like your system’s CMD/terminal. 

 Implement a CMD tool capable of register/unregister a command, activate/deactivate a command, print history of commands, logs history of commands into a text file. 

 
 Handle the following commands: 

 `register <command_name> <Executor>`: 

Registers a command and actions assigned to the command. 

On register, the command should be auto activated. 

Executor is an object, which should be stored against the `command_name` at the time of registering. You must use this object while running the registered commands. 

a 

`unregister <command_name>`: 

unregister a command 

 
`activate <command_name>`: 

activates the command mentioned in the `< command_name>`, it makes the user to gain access to run this command. 

 
`deactivate <command_name>`: 

deactivates the command mentioned in the `< command_name>`, it makes the user to loss access to run this command. 

 
`history <count>`: 

print <count> latest commands (no need to persist), default count is 5 

 
`log <options>` - Logs commands from the log file location 

`log --start <path>` - start logging and the save the log at given path. Ex: log --start C:/Users/UserName/log.txt 

`log --all`           - print all commands from the current log file 

`log --tail 9`      - print last 9 commands from the current log file 

`log --head 9`   - print first 9 commands from the current log file 

`log --clear`      - clears all logs from the current log file 

`log --stop`       - stops logging commands but keep the current log file 

 

Logging: 

You need to log all the commands in the current log file in the below pattern 

All the commands must handle `--help` argument, it should print the usage description of the command. 

Example:  

`$ register --help` 

Prints -> `Used to register a command and actions assigned to the command `register <command_name>`` 

 

**Math Module** 

Built this module in the above command-line project by implementing a `MathHandler` class for following methods: 

 

`add`         - It should take list of elements as input and return their sum 

`subtract` - It should take list of elements as input and return their subtraction  

`multiply` - It should take list of elements as input and return their multiplication 

`divide`     - It can allow only two numbers as input and return their division 

 

Link `MathHandler` to CMD 

 By registering your `MathHandler` class with your Command line tool and make it able to run all the methods implemented in it. 

  

> register math MathHandler 

  

Following are the commands which can be handled using the `math`. 

 

`math --add 1 2 3 4 4` or `math -a 1 2 3 4 4` 
14 

  

`math --subtract 1 2 2` or `math -s 1 2 2` 
-3 

  

`math --multiply 1 2 3 4` or `math -m 1 2 3 4` 
24 

  

`math --divide 4 2` or `math -d 4 2` 
2 

  

`math --help` or `math -h` -> Description of this module and commands that `math` handle 

`math <method> --help`     -> Description of the method and an Example of valid command 

  

Ex:  
`math add --help` 
`<add enables adding of numbers>` 
