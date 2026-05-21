<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;

class AdminMenuController extends Controller
{

    public function index()
    {
        return Menu::latest()->get();
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

            'stock' =>
                $request->stock,

            'status' =>
                'active',
        ]);

        return response()->json([
            'message' =>
                'Menu berhasil ditambahkan',

            'data' => $menu
        ]);
    }


    public function show($id)
    {
        return Menu::findOrFail($id);
    }



    public function update(
        Request $request,
        $id
    ) {

        $menu = Menu::findOrFail($id);

        $menu->update($request->all());

        return response()->json([
            'message' =>
                'Menu berhasil diupdate',

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