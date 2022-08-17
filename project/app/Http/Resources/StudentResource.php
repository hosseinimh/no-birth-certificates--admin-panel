<?php

namespace App\Http\Resources;

use App\Helpers\Helper;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => intval($this->id),
            'name' => $this->name ?? '',
            'family' => $this->family ?? '',
            'address' => $this->address ?? '',
            'phone' => $this->phone ?? '',
            'image' => $this->image ?? null,
            'created_at_fa' => Helper::faDate($this->created_at),
        ];
    }
}
