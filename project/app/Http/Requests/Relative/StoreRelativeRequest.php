<?php

namespace App\Http\Requests\Relative;

use App\Constants\ErrorCodes;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;

class StoreRelativeRequest extends FormRequest
{
    protected function failedValidation(Validator $validator)
    {
        $response = new Response(['_result' => '0', '_error' => $validator->errors()->first(), '_errorCode' => ErrorCodes::UPDATE_ERROR], 200);

        throw new ValidationException($validator, $response);
    }

    public function rules()
    {
        return [
            'name' => 'required|min:3|max:50',
            'family' => 'required|min:3|max:50',
            'date' => 'required|min:10|max:10',
            'relation' => 'required|min:1|max:7',
            'relation_text' => 'max:50',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => __('relative.name_required'),
            'name.min' => __('relative.name_min'),
            'name.max' => __('relative.name_max'),
            'family.required' => __('relative.family_required'),
            'family.min' => __('relative.family_min'),
            'family.max' => __('relative.family_max'),
            'date.required' => __('relative.date_required'),
            'date.min' => __('relative.date_min'),
            'date.max' => __('relative.date_max'),
            'relation.required' => __('relative.relation_required'),
            'relation.min' => __('relative.relation_min'),
            'relation.max' => __('relative.relation_max'),
            'relation_text.max' => __('relative.relation_text_max'),
        ];
    }
}
