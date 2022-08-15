<?php

namespace App\Models;

use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, MustVerifyEmail;

    protected $table = 'tbl_users';
    protected $fillable = [
        'name',
        'family',
        'username',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    public function setPasswordAttribute(string $password): void
    {
        $this->attributes['password'] = Hash::make($password);
    }

    public static function updatePassword(int $id, string $password): bool
    {
        return DB::statement("UPDATE `tbl_users` SET `password`='$password' WHERE `id`=$id");
    }

    public static function get(int $id): mixed
    {
        return self::where('id', $id)->first();
    }

    public static function getPagination(string|null $username, string|null $name, string|null $family, int $page, int $pageItems): mixed
    {
        return self::where('username', 'LIKE', '%' . $username . '%')->where('name', 'LIKE', '%' . $name . '%')->orWhere('family', 'LIKE', '%' . $family . '%')->orderBy('family', 'ASC')->orderBy('name', 'ASC')->orderBy('id', 'ASC')->skip(($page - 1) * $pageItems)->take($pageItems)->get();
    }

    public static function getUsersCount(): int
    {
        return self::count();
    }
}
