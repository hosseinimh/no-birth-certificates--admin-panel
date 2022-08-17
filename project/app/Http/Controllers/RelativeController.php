<?php

namespace App\Http\Controllers;

use App\Http\Requests\Relative\IndexRelativesRequest;
use App\Http\Requests\Relative\StoreRelativeRequest;
use App\Http\Requests\Relative\UpdateRelativeRequest;
use App\Models\Relative;
use App\Models\Student;

class RelativeController extends Controller
{
    public function index(Student $student, IndexRelativesRequest $request)
    {
        $items = $this->service->getPagination($student, $request->name, $request->_pn, $request->_pi);
        $items['count'] = $this->service->count($student, $request->name);

        return $this->handleJsonResponse(array_merge($items, ['student' => $student]));
    }

    public function show(Relative $relative)
    {
        return $this->handleJsonResponse($this->service->get($relative));
    }

    public function store(Student $student, StoreRelativeRequest $request)
    {
        $result = $this->service->store($student->id, $request->name, $request->family, $request->date, $request->relation, $request->relation_text);

        if (array_key_exists('entity', $result)) {
            $result = array_merge($result, (new FileUploaderController('public/storage/relatives/images'))->uploadImage($result['entity'], $request, 'image', 'image'));

            unset($result['entity']);
        }

        return $this->handleJsonResponse($result);
    }

    public function update(Relative $relative, UpdateRelativeRequest $request)
    {
        $result = $this->service->update($relative, $request->name, $request->family, $request->date, $request->relation, $request->relation_text);

        if (array_key_exists('entity', $result)) {
            $result = array_merge($result, (new FileUploaderController('public/storage/relatives/images'))->uploadImage($result['entity'], $request, 'image', 'image'));

            unset($result['entity']);
        }

        return $this->handleJsonResponse($result);
    }

    public function remove(Relative $relative)
    {
        return $this->handleJsonResponse($this->service->remove($relative));
    }
}
