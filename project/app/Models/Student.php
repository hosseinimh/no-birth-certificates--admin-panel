<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_students';
    protected $fillable = [
        'name',
        'family',
        'address',
        'phone',
        'birth_date',
        'birth_date_timestamp',
        'image',
    ];

    protected static function booted()
    {
        static::deleting(function ($student) {
            if ($student->image) {
                @unlink(storage_path('app') . '/public/storage/students/images/' . $student->image);
            }

            foreach ($student->relatives as $relative) {
                $relative->delete();
            }
        });
    }

    public function relatives()
    {
        return $this->hasMany(Relative::class);
    }

    public static function get(int $id): mixed
    {
        return self::where('id', $id)->first();
    }

    public static function getPagination(string|null $name, string|null $family, int $page, int $pageItems): mixed
    {
        return self::where('name', 'LIKE', '%' . $name . '%')->orWhere('family', 'LIKE', '%' . $family . '%')->orderBy('family', 'ASC')->orderBy('name', 'ASC')->orderBy('id', 'ASC')->skip(($page - 1) * $pageItems)->take($pageItems)->get();
    }

    public static function getStudentsCount(string|null $nameFamily): int
    {
        return self::where('name', 'LIKE', '%' . $nameFamily . '%')->orWhere('family', 'LIKE', '%' . $nameFamily . '%')->count();
    }
}
