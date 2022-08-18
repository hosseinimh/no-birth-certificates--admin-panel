# Admin panel for registering no-birth-certificate students as well as their parents or relatives

## Brief
This project is designed with `Laravel` as backend, `React.js` as frontend and `MySql` for storing data.

To register no-birth-certificate students in schools, they must have an official letter, which is written down their names and parents on it, every year. It`s good to have a database of such students and their family members. On the other hand, the number of these students are a lot and issuing an official letter for very of them is time wasting so I decided to create a website to automate some parts of this routine process.


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

### Database configuration
Also, you have to set the database connection parameters in `.env`:
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=non_certificates_db
DB_USERNAME=root
DB_PASSWORD=123456
```

### Table migrations and fake data initialization
Go to `project` directory and run this custom command:
```bash
php artisan project:init
```
This command creates 100 students, which every of them has 7 relatives.

It also creates a user to login:
```bash
user: 991061
password: 1234
```
### Running the project
To start the `project`, go to the `project` directory and run `artisan serve` command:
```bash
php artisan serve
```

## Database seeding
The project has three main models: `User`, `Student` and `Relative`. Since every student has many relatives, `Relative` is a sub-model of `Student`, so I created `StudentSeeder` to initilize both students and relatives tables with fake data:
```bash
public function run()
{
    $date = '1401/01/01';
    $timestamp = Helper::getTimestamp($date);
    $data = ['birth_date' => $date, 'birth_date_timestamp' => $timestamp];

    Student::factory(100)->create($data)->each(function ($student) use ($data) {
        foreach (range(1, 7) as $number) {
            Relative::factory()->create(array_merge(['student_id' => $student->id, 'relation' => $number], $data));
        }
    });
}
```

The function creates 100 students and for each of them creates 7 relatives with defferent type of relation. `$data` parameter overwrites on default array in model factory.
