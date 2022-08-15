<?php

namespace App\Http\Controllers;

use App\Http\Requests\Student\IndexStudentsRequest;
use App\Http\Requests\Student\StoreStudentRequest;
use App\Http\Requests\Student\UpdateStudentRequest;
use App\Models\Student;

class StudentController extends Controller
{
    public function index(IndexStudentsRequest $request)
    {
        $items = $this->service->getPagination($request->name, $request->_pn, $request->_pi);
        $items['count'] = $this->service->count($request->name);

        return $this->handleJsonResponse($items);
    }

    public function show(Student $student)
    {
        return $this->handleJsonResponse($this->service->get($student));
    }

    public function store(StoreStudentRequest $request)
    {
        $result = $this->service->store($request->name, $request->family, $request->address, $request->phone, $request->date);

        if (array_key_exists('entity', $result)) {
            $result = array_merge($result, (new FileUploaderController('public/storage/students/images'))->uploadImage($result['entity'], $request, 'image', 'image'));

            unset($result['entity']);
        }

        return $this->handleJsonResponse($result);
    }

    public function update(Student $student, UpdateStudentRequest $request)
    {
        $result = $this->service->update($student, $request->name, $request->family, $request->address, $request->phone, $request->date);

        if (array_key_exists('entity', $result)) {
            $result = array_merge($result, (new FileUploaderController('public/storage/students/images'))->uploadImage($result['entity'], $request, 'image', 'image'));

            unset($result['entity']);
        }

        return $this->handleJsonResponse($result);
    }

    public function remove(Student $student)
    {
        return $this->handleJsonResponse($this->service->remove($student));
    }
}
