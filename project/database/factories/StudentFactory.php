<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'name' => fake()->firstName(),
            'family' => fake()->lastName(),
            'address' => fake()->text(200),
            'phone' => random_int(11111111111, 99999999999) . '',
            'birth_date' => '1401/01/01',
            'birth_date_timestamp' => 0,
        ];
    }
}
