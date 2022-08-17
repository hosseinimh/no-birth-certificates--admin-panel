<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class RelativeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'student_id' => 1,
            'name' => fake()->firstName(),
            'family' => fake()->lastName(),
            'relation' => 1,
            'birth_date' => '1401/01/01',
            'birth_date_timestamp' => 0,
        ];
    }
}
