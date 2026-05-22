<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;

class OwnerMenuController extends Controller
{
    public function index()
    {
        return response()->json(
            Menu::latest()->get()
        );
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

    ]);

    $imagePath = null;

    // upload image
    if ($request->hasFile('image')) {

        $imagePath = $request
            ->file('image')
            ->store('menus', 'public');
    }

    $menu = Menu::create([

        'name' => $request->name,

        'description' => $request->description,

        'price' => $request->price,

        'category' => $request->category,

        'stock' => $request->stock,

        'image' => $imagePath,

        'is_active' => true,

    ]);

    return response()->json([

        'message' => 'Menu berhasil ditambahkan',

        'data' => $menu

    ]);
}
    public function show($id)
    {
        return Menu::findOrFail($id);
    }

    public function update(Request $request, $id)
{
    $menu = Menu::findOrFail($id);

    $request->validate([

        'name' => 'required',

        'description' => 'nullable',

        'price' => 'required',

        'category' => 'required',

        'stock' => 'required',

        'image' => 'nullable|image|mimes:jpg,jpeg,png,webp',

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

    ]);

    return response()->json([

        'message' => 'Menu berhasil diupdate',

        'data' => $menu

    ]);
}
    public function destroy($id)
    {
        Menu::destroy($id);

        return response()->json([

            'message' =>
                'Menu berhasil dihapus'

        ]);
    }
}