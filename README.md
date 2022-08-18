# Admin panel for registering no-birth-certificate students as well as their parents or relatives

## Brief
This project is designed by `Laravel` as backend, `React.js` as frontend and `MySql` for storing data.

To register no-birth-certificate students in schools, they must have an official letter, which is written down their names and parents on it, every year. It`s good to have a database of such students and their family members. On the other hand, the number of these students are a lot and issuing an official letter for very of them is routine so I decided to create a website for it to automate some parts of the process.


## Installation
There are two main directories in the root: `project` and `public_html`.

All logics and Laravel core files are in `project` directory. `public_html` is responsible for representing the website, and all asset files such as images, js files and css are in it.

I created two files in the `project` directory which specify the environment and paths to main directories:
`server-config.json`, `server-config.php`. If you deploy the project on a subdomain, you can simply change the public_path in both files and we are all set.

### server-config.json
```bash
{
    "relativePublicPath": "./../public_html",
    "appEnv": "local" // or "production"
}
```

### server-config.php
```bash
<?php

define('PUBLIC_PATH', __DIR__ . '/../public_html');
define('FRAMEWORK_PATH', __DIR__);
```

