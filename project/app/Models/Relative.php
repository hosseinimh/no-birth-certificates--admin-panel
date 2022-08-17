<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Relative extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_relatives';
    protected $fillable = [
        'student_id',
        'name',
        'family',
        'relation',
        'relation_text',
        'birth_date',
        'birth_date_timestamp',
        'image',
    ];

    protected static function booted()
    {
        static::deleting(function ($relative) {
            if ($relative->image) {
                @unlink(storage_path('app') . '/public/storage/relatives/images/' . $relative->image);
            }
        });
    }

    public static function get(int $id): mixed
    {
        return self::select('tbl_relatives.*', 'tbl_students.id AS student_id', 'tbl_students.name AS student_name', 'tbl_students.family AS student_family')->where('tbl_relatives.id', $id)->join('tbl_students', 'student_id', 'tbl_students.id')->first();
    }

    public static function getPagination(int $student_id, string|null $name, string|null $family, int $page, int $pageItems): mixed
    {
        return self::select('tbl_relatives.*', 'tbl_students.id AS student_id', 'tbl_students.name AS student_name', 'tbl_students.family AS student_family')->where('student_id', $student_id)->where(function ($query) use ($name, $family) {
            $query->where('tbl_relatives.name', 'LIKE', '%' . $name . '%')->orWhere('tbl_relatives.family', 'LIKE', '%' . $family . '%');
        })->join('tbl_students', 'student_id', 'tbl_students.id')->orderBy('tbl_relatives.family', 'ASC')->orderBy('tbl_relatives.name', 'ASC')->orderBy('tbl_relatives.id', 'ASC')->skip(($page - 1) * $pageItems)->take($pageItems)->get();
    }

    public static function getRelativesCount(int $student_id, string|null $nameFamily): int
    {
        return self::where('student_id', $student_id)->where(function ($query) use ($nameFamily) {
            $query->where('name', 'LIKE', '%' . $nameFamily . '%')->orWhere('family', 'LIKE', '%' . $nameFamily . '%');
        })->count();
    }
}
