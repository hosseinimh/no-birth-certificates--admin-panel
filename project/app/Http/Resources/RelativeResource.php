<?php

namespace App\Http\Resources;

use App\Helpers\Helper;
use Illuminate\Http\Resources\Json\JsonResource;

class RelativeResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => intval($this->id),
            'student_id' => intval($this->student_id),
            'name' => $this->name ?? '',
            'family' => $this->family ?? '',
            'relation' => intval($this->relation),
            'relation_text' => $this->getRelationText($this->relation, $this->relation_text),
            'student_name' => $this->student_name ?? '',
            'student_family' => $this->student_family ?? '',
            'image' => $this->image ?? null,
        ];
    }

    private function getRelationText($relation, $relationText)
    {
        $text = __('relative.relation_undefined');

        switch ($relation) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                $text = __('relative.relation_' . $relation);

                break;
            case 7:
                $text = $relationText ?? __('relative.relation_undefined');

                break;
            default:
                break;
        }

        return $text;
    }
}
