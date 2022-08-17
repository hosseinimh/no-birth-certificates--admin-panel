<?php

namespace App\Services;

use App\Helpers\Helper;
use App\Http\Resources\StudentResource as EntityResource;
use App\Models\Student;

class StudentService extends Service
{
    public function __construct()
    {
        $this->entityResource = EntityResource::class;
    }

    public function get(Student $student)
    {
        return $this->handleGet($student);
    }

    public function getPagination($nameFamily, $page, $pageItems)
    {
        return $this->handleGetItems(Student::getPagination($nameFamily, $nameFamily, $page, $pageItems));
    }

    public function store($name, $family, $address, $phone, $date)
    {
        $data = [
            'name' => $name,
            'family' => $family,
            'address' => $address,
            'phone' => $phone,
            'birth_date' => $date,
            'birth_date_timestamp' => Helper::getTimestamp($date)
        ];

        $student = Student::create($data);
        $result = $this->handleStore($student);

        if ($student) {
            $result['entity'] = $student;
        }

        return $result;
    }

    public function update(Student $student, $name, $family, $address, $phone, $date)
    {
        $data = [
            'name' => $name,
            'family' => $family,
            'address' => $address,
            'phone' => $phone,
            'birth_date' => $date,
            'birth_date_timestamp' => Helper::getTimestamp($date)
        ];

        $updated = $student->update($data);
        $result = $this->handleStore($updated);

        if ($updated) {
            $result['entity'] = $student;
        }

        return $result;
    }

    public function count($nameFamily)
    {
        return Student::getStudentsCount($nameFamily);
    }

    public function remove($student)
    {
        return $this->handleDelete($student->delete());
    }
}
