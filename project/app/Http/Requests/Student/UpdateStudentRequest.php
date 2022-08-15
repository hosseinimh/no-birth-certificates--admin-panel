<?php

namespace App\Http\Requests\Student;

use App\Constants\ErrorCodes;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;

class UpdateStudentRequest extends FormRequest
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
            'address' => 'required|max:200',
            'phone' => 'required|min:11|max:50',
            'date' => 'required|min:10|max:10',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => __('student.name_required'),
            'name.min' => __('student.name_min'),
            'name.max' => __('student.name_max'),
            'family.required' => __('student.family_required'),
            'family.min' => __('student.family_min'),
            'family.max' => __('student.family_max'),
            'address.required' => __('student.address_required'),
            'address.max' => __('student.address_max'),
            'phone.required' => __('student.phone_required'),
            'phone.min' => __('student.phone_min'),
            'phone.max' => __('student.phone_max'),
            'date.required' => __('student.date_required'),
            'date.min' => __('student.date_min'),
            'date.max' => __('student.date_max'),
        ];
    }
}
