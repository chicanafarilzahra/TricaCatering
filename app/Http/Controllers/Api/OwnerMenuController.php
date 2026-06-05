<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OwnerMenuController extends Controller
{
    public function index(Request $request)
{
    return Menu::where(
        'owner_id',
        $request->owner_id
    )
    ->where('is_active', true)
    ->latest()
    ->get();
}

   public function store(Request $request)
{
    $request->validate([
        'name' => 'required',
        'description' => 'nullable',
        'price' => 'required',
        'category' => 'required',
        'stock' => 'required',
        'image' => 'nullable|image|mimes:jpg,jpeg,png,webp',
        'jenis_catering' => 'required|string',
        'min_porsi' => 'required|integer|min:1',
    ]);

    $imagePath = null;

    if ($request->hasFile('image')) {
        $imagePath = $request
            ->file('image')
            ->store('menus', 'public');
    }

    $menu = Menu::create([
    'owner_id' => $request->owner_id,

    'name' => $request->name,
    'description' => $request->description,
    'price' => $request->price,
    'category' => $request->category,
    'stock' => $request->stock,
    'image' => $imagePath,
    'is_active' => true,
    'jenis_catering' => $request->jenis_catering,
    'min_porsi' => $request->min_porsi,
]);

    return response()->json([
        'message' => 'Menu berhasil ditambahkan',
        'data' => $menu
    ]);
}
    public function update(Request $request, $id)
{
    try {

        $menu = Menu::where(
    'id',
    $id
)->where(
    'owner_id',
    $request->owner_id
)->firstOrFail();

        $request->validate([
            'name' => 'required',
            'description' => 'nullable',
            'price' => 'required',
            'category' => 'required',
            'stock' => 'required',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp',
            'jenis_catering' => 'required|string',
            'min_porsi' => 'required|integer|min:1',
        ]);

        $imagePath = $menu->image;

        if ($request->hasFile('image')) {
            $imagePath = $request
                ->file('image')
                ->store('menus', 'public');
        }

        $menu->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'category' => $request->category,
            'stock' => $request->stock,
            'image' => $imagePath,
            'jenis_catering' => $request->jenis_catering,
            'min_porsi' => $request->min_porsi,
        ]);

        return response()->json([
            'message' => 'Menu berhasil diupdate',
            'data' => $menu
        ]);

    } catch (\Exception $e) {

        return response()->json([
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
        ], 500);

    }
}
    public function destroy(Request $request, $id)
{
    Menu::where(
        'id',
        $id
    )->where(
        'owner_id',
        $request->owner_id
    )->delete();

    return response()->json([
        'message' => 'Menu berhasil dihapus'
    ]);
}
}