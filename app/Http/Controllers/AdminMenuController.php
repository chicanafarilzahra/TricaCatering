<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;

class AdminMenuController extends Controller
{

    public function index()
    {
        return Menu::with([
            'owner:id,nama_catering,email'
        ])
        ->latest()
        ->get();
    }


    public function store(Request $request)
    {
        $request->validate([

            'name' =>
                'required',

            'price' =>
                'required',
        ]);

        $menu = Menu::create([

            'name' =>
                $request->name,

            'description' =>
                $request->description,

            'price' =>
                $request->price,

            'image' =>
                $request->image,

            'status' =>
                'active',
        ]);

        return response()->json([
            'message' =>
                'Menu berhasil ditambahkan',

            'data' => $menu
        ]);
    }


    public function show(int $id)
{
    return Menu::findOrFail($id);
}


    public function update(
    Request $request,
    int $id
)
{
    $menu = Menu::findOrFail($id);

    $menu->update($request->all());

    return response()->json([
        'message' => 'Menu berhasil diupdate',
        'data' => $menu,
    ]);
}

   
    public function destroy(int $id)
{
    Menu::destroy($id);

    return response()->json([
        'message' => 'Menu berhasil dihapus',
    ]);
}
}