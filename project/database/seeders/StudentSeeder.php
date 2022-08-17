<?php

namespace Database\Seeders;

use App\Helpers\Helper;
use App\Models\Relative;
use App\Models\Student;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $date = '1401/01/01';
        $timestamp = Helper::getTimestamp($date);
        $data = ['birth_date' => $date, 'birth_date_timestamp' => $timestamp];

        Student::factory(100)->create($data)->each(function ($student) use ($data) {
            foreach (range(1, 7) as $number) {
                Relative::factory()->create(array_merge(['student_id' => $student->id, 'relation' => $number], $data));
            }
        });
    }
}
