<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// not auth users
Route::middleware(['cors'])->group(function () {
    Route::post('users/login', [UserController::class, 'login']);
});

// auth users
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('dashboard/review', [DashboardController::class, 'review']);

    Route::post('users', [UserController::class, 'index']);
    Route::post('users/show/{user}', [UserController::class, 'show']);
    Route::post('users/update/{user}', [UserController::class, 'update']);
    Route::post('users/change_password/{user}', [UserController::class, 'changePassword']);
    Route::post('users/logout', [UserController::class, 'logout']);

    Route::post('students', [StudentController::class, 'index']);
    Route::post('students/show/{student}', [StudentController::class, 'show']);
    Route::post('students/store', [StudentController::class, 'store']);
    Route::post('students/update/{student}', [StudentController::class, 'update']);
    Route::post('students/remove/{student}', [StudentController::class, 'remove']);
});
