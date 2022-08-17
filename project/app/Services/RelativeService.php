<?php

namespace App\Services;

use App\Helpers\Helper;
use App\Http\Resources\RelativeResource as EntityResource;
use App\Models\Relative;
use App\Models\Student;

class RelativeService extends Service
{
    public function __construct()
    {
        $this->entityResource = EntityResource::class;
    }

    public function get(Relative $relative)
    {
        return $this->handleGet(Relative::get($relative->id));
    }

    public function getPagination(Student $student, $nameFamily, $page, $pageItems)
    {
        return $this->handleGetItems(Relative::getPagination($student->id, $nameFamily, $nameFamily, $page, $pageItems));
    }

    public function store($studentId, $name, $family, $date, int $relation, $relationText)
    {
        $data = [
            'student_id' => $studentId,
            'name' => $name,
            'family' => $family,
            'relation' => $relation,
            'relation_text' => $relation === 7 ? $relationText : null,
            'birth_date' => $date,
            'birth_date_timestamp' => Helper::getTimestamp($date),
        ];

        $relative = Relative::create($data);
        $result = $this->handleStore($relative);

        if ($relative) {
            $result['entity'] = $relative;
        }

        return $result;
    }

    public function update(Relative $relative, $name, $family, $date, int $relation, $relationText)
    {
        $data = [
            'name' => $name,
            'family' => $family,
            'birth_date' => $date,
            'birth_date_timestamp' => Helper::getTimestamp($date),
            'relation' => $relation,
            'relation_text' => $relation === 7 ? $relationText : null,
        ];

        $updated = $relative->update($data);
        $result = $this->handleStore($updated);

        if ($updated) {
            $result['entity'] = $relative;
        }

        return $result;
    }

    public function count(Student $student, $nameFamily)
    {
        return Relative::getRelativesCount($student->id, $nameFamily);
    }

    public function remove($relative)
    {
        return $this->handleDelete($relative->delete());
    }
}
