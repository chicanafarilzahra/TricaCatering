<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Menu;
use Illuminate\Support\Facades\Storage;

class OwnerMenuController extends Controller
{
    public function index()
    {
        return Menu::latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'price' => 'required|numeric',
            'description' => 'nullable',
            'image' => 'nullable|image',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {

            $imagePath = $request
                ->file('image')
                ->store('menus', 'public');
        }

        $menu = Menu::create([
            'name' => $request->name,
            'price' => $request->price,
            'description' => $request->description,
            'image' => $imagePath,
        ]);

        return response()->json([
            'message' => 'Menu created',
            'data' => $menu
        ]);
    }

    public function update(Request $request, $id)
    {
        $menu = Menu::findOrFail($id);

        $request->validate([
            'name' => 'required',
            'price' => 'required|numeric',
            'description' => 'nullable',
            'image' => 'nullable|image',
        ]);

        $imagePath = $menu->image;

        if ($request->hasFile('image')) {

            if ($menu->image) {
                Storage::disk('public')
                    ->delete($menu->image);
            }

            $imagePath = $request
                ->file('image')
                ->store('menus', 'public');
        }

        $menu->update([
            'name' => $request->name,
            'price' => $request->price,
            'description' => $request->description,
            'image' => $imagePath,
        ]);

        return response()->json([
            'message' => 'Menu updated',
            'data' => $menu
        ]);
    }

    public function destroy($id)
    {
        $menu = Menu::findOrFail($id);

        if ($menu->image) {
            Storage::disk('public')
                ->delete($menu->image);
        }

        $menu->delete();

        return response()->json([
            'message' => 'Menu deleted'
        ]);
    }
}