<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    const MAX_LOGIN_ATTEMPTS = 5;
    const LOCKOUT_DURATION = 30; // minutes

    /**
     * Register a new user with strong password requirements
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|min:2',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => [
                'required',
                'string',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
            'role' => 'required|in:admin,manager,staff',
        ]);

        // Input sanitization
        $validated['name'] = htmlspecialchars($validated['name'], ENT_QUOTES, 'UTF-8');

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'login_attempts' => 0,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Login user with account lockout protection
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Sanitize email
        $email = filter_var($validated['email'], FILTER_SANITIZE_EMAIL);

        $user = User::where('email', $email)->first();

        // Check if account is locked
        if ($user && $user->locked_until && now()->isBefore($user->locked_until)) {
            $remainingMinutes = now()->diffInMinutes($user->locked_until);
            throw ValidationException::withMessages([
                'email' => ["Account is locked. Try again in {$remainingMinutes} minutes."],
            ]);
        }

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            // Increment login attempts
            if ($user) {
                $user->increment('login_attempts');

                // Lock account if max attempts exceeded
                if ($user->login_attempts >= self::MAX_LOGIN_ATTEMPTS) {
                    $user->update(['locked_until' => now()->addMinutes(self::LOCKOUT_DURATION)]);
                }
            }

            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Reset login attempts on successful login
        $user->update([
            'login_attempts' => 0,
            'locked_until' => null,
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Get current user profile
     */
    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Update profile with input sanitization
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|min:2',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        // Input sanitization
        if (isset($validated['name'])) {
            $validated['name'] = htmlspecialchars($validated['name'], ENT_QUOTES, 'UTF-8');
        }
        if (isset($validated['email'])) {
            $validated['email'] = filter_var($validated['email'], FILTER_SANITIZE_EMAIL);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }

    /**
     * Change password with strong validation
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => [
                'required',
                'string',
                'confirmed',
                'different:current_password',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
        ]);

        // Verify current password
        if (!Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The provided current password is incorrect.'],
            ]);
        }

        // Update password
        $user->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        // Revoke all tokens except current one
        $user->tokens()->where('name', '!=', 'auth_token')->delete();

        return response()->json([
            'message' => 'Password changed successfully',
            'user' => $user,
        ]);
    }

    /**
     * Logout user and revoke token
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout successful']);
    }
}
